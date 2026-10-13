"""Gera a camada cearense de Favelas e Comunidades Urbanas do Censo 2022.

Uso:
    python tools/build_fcu_layer.py CAMINHO_DO_SHP

A fonte vetorial deve ser o arquivo oficial ``poligonos_FCUs_shp.zip`` do IBGE.
O resultado cruza as comunidades com as divisões territoriais já usadas no mapa.
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

import shapefile
from shapely import make_valid, set_precision
from shapely.geometry import mapping, shape


ROOT = Path(__file__).resolve().parents[1]
MAP_DATA = ROOT / "mapa" / "data"
OUTPUT = MAP_DATA / "favelas-comunidades-urbanas-ceara-2022.geojson"


def load_geojson(name: str) -> dict:
    return json.loads((MAP_DATA / name).read_text(encoding="utf-8"))


def valid_geometry(raw_geometry):
    geometry = shape(raw_geometry)
    if not geometry.is_valid:
        geometry = make_valid(geometry)
    return geometry


def main(shapefile_path: str) -> None:
    municipalities = load_geojson("municipios-ceara-2026.geojson")
    neighborhoods = load_geojson("bairros-fortaleza.geojson")

    municipality_by_code = {
        str(feature["properties"]["codigo_ibge"]): feature["properties"]
        for feature in municipalities["features"]
    }
    neighborhood_geometries = [
        (valid_geometry(feature["geometry"]), feature["properties"])
        for feature in neighborhoods["features"]
    ]

    reader = shapefile.Reader(shapefile_path, encoding="utf-8")
    fields = [field[0] for field in reader.fields[1:]]
    features = []

    for shape_record in reader.iterShapeRecords():
        record = dict(zip(fields, shape_record.record))
        if str(record["cd_uf"]) != "23":
            continue

        geometry = valid_geometry(shape_record.shape.__geo_interface__)
        municipality = municipality_by_code.get(str(record["cd_mun"]), {})
        if not municipality:
            raise ValueError(f"Município IBGE não localizado: {record['cd_mun']}")

        properties = {
            "codigo_fcu": str(record["cd_fcu"]),
            "comunidade": str(record["nm_fcu"]).strip(),
            "codigo_municipio": str(record["cd_mun"]),
            "municipio": str(record["nm_mun"]).strip(),
            "bairro_referencia": None,
            "bairros_interceptados": [],
            "ais": municipality.get("ais"),
            "bpm": municipality.get("bpm"),
            "crpm": municipality.get("crpm"),
            "populacao_referencia": municipality.get("populacao_estimada_2026"),
            "idh_referencia": municipality.get("idhm_2010"),
            "referencia_socioeconomica": "município",
            "fonte_geometria": "IBGE · Censo Demográfico 2022",
        }

        if str(record["cd_mun"]) == "2304400":
            intersections = []
            for neighborhood_geometry, neighborhood in neighborhood_geometries:
                intersection_area = geometry.intersection(neighborhood_geometry).area
                if intersection_area > 1e-12:
                    intersections.append((intersection_area, neighborhood))
            intersections.sort(key=lambda item: item[0], reverse=True)
            if intersections:
                principal = intersections[0][1]
                properties.update(
                    {
                        "bairro_referencia": principal.get("bairro"),
                        "bairros_interceptados": [item[1].get("bairro") for item in intersections],
                        "ais": principal.get("ais"),
                        "bpm": principal.get("bpm"),
                        "crpm": principal.get("crpm"),
                        "populacao_referencia": principal.get("populacao_2010"),
                        "idh_referencia": principal.get("idhb_2010"),
                        "referencia_socioeconomica": "bairro",
                    }
                )

        simplified = geometry.simplify(0.000015, preserve_topology=True)
        simplified = set_precision(simplified, grid_size=0.000001)
        features.append(
            {
                "type": "Feature",
                "properties": properties,
                "geometry": mapping(simplified),
            }
        )

    features.sort(key=lambda feature: (feature["properties"]["municipio"], feature["properties"]["comunidade"]))
    municipality_counts = Counter(feature["properties"]["municipio"] for feature in features)
    output = {
        "type": "FeatureCollection",
        "name": "Favelas e Comunidades Urbanas do Ceará · Censo 2022",
        "source": "IBGE · Censo Demográfico 2022 · Favelas e Comunidades Urbanas · Resultados do universo",
        "study_reference": "Dantas (2022), Violência e vulnerabilidades urbanas: Teoria da ambiência restritiva",
        "metadata": {
            "comunidades": len(features),
            "municipios": len(municipality_counts),
            "fortaleza": municipality_counts["Fortaleza"],
            "observacao": "A geometria é do IBGE 2022. O artigo de referência analisa assentamentos de Fortaleza de 2016 e não define a malha estadual.",
        },
        "features": features,
    }
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(
        f"Camada criada: {len(features)} comunidades em {len(municipality_counts)} municípios; "
        f"{municipality_counts['Fortaleza']} em Fortaleza."
    )


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Informe o caminho do shapefile oficial do IBGE.")
    main(sys.argv[1])
