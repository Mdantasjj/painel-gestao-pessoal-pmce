"""Incorpora população e desenvolvimento humano às camadas territoriais do mapa."""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

import pandas as pd
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
MAP_DATA = ROOT / "mapa" / "data"
SOURCES = ROOT / "data" / "fontes_socioeconomicas"

MUNICIPALITIES = MAP_DATA / "municipios-ceara-2026.geojson"
NEIGHBORHOODS = MAP_DATA / "bairros-fortaleza.geojson"
IBGE_POPULATION = SOURCES / "ibge_estimativas_municipais_2026.xlsx"
FORTALEZA_IDHB = SOURCES / "fortaleza_idhb_2010.xlsx"
FORTALEZA_POPULATION = SOURCES / "fortaleza_populacao_bairros_2010.xlsx"
IPECE_IDHM = SOURCES / "ipece_idhm_municipios_ceara_2010.pdf"


def normalized(value: object) -> str:
    text = unicodedata.normalize("NFD", str(value).upper())
    text = "".join(char for char in text if unicodedata.category(char) != "Mn")
    return re.sub(r"[^A-Z0-9]", "", text)


def read_municipal_population() -> dict[str, int]:
    table = pd.read_excel(IBGE_POPULATION, sheet_name="municípios", skiprows=1)
    table = table[table.iloc[:, 0] == "CE"]
    result = {}
    for _, row in table.iterrows():
        code = f"{int(row.iloc[1]):02d}{int(row.iloc[2]):05d}"
        result[code] = int(row.iloc[4])
    if len(result) != 184:
        raise ValueError(f"Esperados 184 municípios cearenses na base IBGE, encontrados {len(result)}")
    return result


def read_municipal_idhm() -> dict[str, dict[str, float]]:
    text = "".join(page.extract_text() or "" for page in PdfReader(IPECE_IDHM).pages)
    appendix = text[text.find("Quadro 1:"):]
    compact = re.sub(r"\s+", " ", unicodedata.normalize("NFD", appendix.upper()))
    compact = "".join(char for char in compact if unicodedata.category(char) != "Mn")
    aliases = {
        "DEPIRAPUANPINHEIRO": "DEPUTADO IRAPUAN PINHEIRO",
        "ITAPAJE": "ITAPAGE",
    }
    result = {}
    for feature in json.loads(MUNICIPALITIES.read_text(encoding="utf-8"))["features"]:
        municipality = feature["properties"]["municipio"]
        key = normalized(municipality)
        lookup = aliases.get(key, re.sub(r"\s+", " ", unicodedata.normalize("NFD", municipality.upper())))
        lookup = "".join(char for char in lookup if unicodedata.category(char) != "Mn")
        match = re.search(rf"(?:^| ){re.escape(lookup)} (?=[0-9])", compact)
        if not match:
            raise ValueError(f"IDHM 2010 não localizado para {municipality}")
        values = re.findall(r"[0-9],[0-9]{3}", compact[match.end():match.end() + 650])
        if len(values) < 12:
            raise ValueError(f"Linha IDHM incompleta para {municipality}")
        decimals = [float(value.replace(",", ".")) for value in values[:12]]
        result[feature["properties"]["codigo_ibge"]] = {
            "idhm_2010": decimals[8],
            "idhm_educacao_2010": decimals[9],
            "idhm_longevidade_2010": decimals[10],
            "idhm_renda_2010": decimals[11],
        }
    return result


def read_fortaleza_neighborhoods() -> dict[str, dict[str, float | int]]:
    population = pd.read_excel(FORTALEZA_POPULATION, header=2).dropna(subset=["Bairros"])
    idhb = pd.read_excel(FORTALEZA_IDHB)
    population_by_name = {
        normalized(row["Bairros"]): int(row["População Total"])
        for _, row in population.iterrows()
        if pd.notna(row["População Total"]) and int(row["População Total"]) > 0
    }
    idhb_by_name = {
        normalized(row["Bairros"]): {
            "idhb_2010": float(row["IDH"]),
            "idhb_educacao_2010": float(row["IDH-Educação"]),
            "idhb_longevidade_2010": float(row["IDH-Longevidade"]),
            "idhb_renda_2010": float(row["IDH-Renda"]),
        }
        for _, row in idhb.iterrows()
        if str(row["IDH"]).strip() != "-"
    }
    return {
        name: {"populacao_2010": population_value, **idhb_by_name.get(name, {})}
        for name, population_value in population_by_name.items()
    }


def enrich_layers() -> None:
    municipal_population = read_municipal_population()
    municipal_idhm = read_municipal_idhm()
    municipality_data = json.loads(MUNICIPALITIES.read_text(encoding="utf-8"))
    for feature in municipality_data["features"]:
        properties = feature["properties"]
        code = properties["codigo_ibge"]
        properties["populacao_estimada_2026"] = municipal_population[code]
        properties.update(municipal_idhm[code])
    MUNICIPALITIES.write_text(json.dumps(municipality_data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    neighborhood_data = json.loads(NEIGHBORHOODS.read_text(encoding="utf-8"))
    neighborhood_indicators = read_fortaleza_neighborhoods()
    aliases = {
        "AMADEUFURTADO": "AMADEOFURTADO",
        "BOAVISTACASTELAO": "BOAVISTA",
        "ELLERY": "VILAELLERY",
        "ENGENHEIROLUCIANOCAVALCANTE": "LUCIANOCAVALCANTE",
        "MOURABRASIL": "ARRAIALMOURABRASIL",
        "NOVOMONDUBIM": "NOVOMONDUBIM",
        "OLAVOOLIVEIRA": "OLAVOOLIVEIRA",
        "PARQUESANTAMARIA": "PARQUESANTAMARIA",
        "PREFEITOJOSEWALTER": "PREFEITOJOSEVALTER",
        "TAUAPE": "SAOJOAODOTAUAPE",
        "VICENTEPINZON": "VINCENTEPINZON",
        "VILAPERI": "VILAPERY",
    }
    unmatched = []
    for feature in neighborhood_data["features"]:
        properties = feature["properties"]
        for field in ("populacao_2010", "idhb_2010", "idhb_educacao_2010", "idhb_longevidade_2010", "idhb_renda_2010"):
            properties.pop(field, None)
        name = normalized(properties["bairro"])
        source_name = aliases.get(name, name)
        indicators = neighborhood_indicators.get(source_name)
        if indicators:
            properties.update(indicators)
        else:
            unmatched.append(properties["bairro"])
    expected_unmatched = {"ARACAPE", "RACHELDEQUEIROZ", "NOVOMONDUBIM", "OLAVOOLIVEIRA", "PARQUESANTAMARIA"}
    if {normalized(name) for name in unmatched} != expected_unmatched:
        raise ValueError(f"Bairros sem correspondência inesperados: {unmatched}")
    NEIGHBORHOODS.write_text(json.dumps(neighborhood_data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Dados incorporados: 184 municípios e {len(neighborhood_data['features']) - len(unmatched)} bairros de Fortaleza.")


if __name__ == "__main__":
    enrich_layers()
