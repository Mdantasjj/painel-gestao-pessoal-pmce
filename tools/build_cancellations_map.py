"""Gera agregados territoriais de cancelamentos para o mapa público."""

from __future__ import annotations

import csv
import json
import re
import sys
import unicodedata
from collections import Counter
from datetime import datetime
from pathlib import Path


def key(value: str) -> str:
    text = unicodedata.normalize("NFD", value.strip().upper())
    text = "".join(char for char in text if unicodedata.category(char) != "Mn")
    return re.sub(r"[^A-Z0-9]", "", text).lower()


def main(source: Path, target: Path) -> None:
    with source.open(encoding="cp1252", newline="") as stream:
        rows = list(csv.reader(stream))

    dates = [datetime.strptime(row[18], "%d/%m/%Y %H:%M:%S") for row in rows]
    municipalities = Counter(key(row[23]) for row in rows if row[23].strip() not in {"", "-"})
    neighborhoods = Counter(key(row[22]) for row in rows if key(row[23]) == "fortaleza" and row[22].strip() not in {"", "-"})
    payload = {
        "periodo": {"inicio": min(dates).strftime("%Y-%m-%d"), "fim": max(dates).strftime("%Y-%m-%d")},
        "total_registros": len(rows),
        "ocorrencias_unicas": len({row[20] for row in rows}),
        "motivos": dict(sorted(Counter(row[10] for row in rows).items())),
        "por_ais": dict(sorted(Counter(row[7] for row in rows).items())),
        "por_municipio": dict(sorted(municipalities.items())),
        "por_bairro_fortaleza": dict(sorted(neighborhoods.items())),
        "sem_municipio": sum(row[23].strip() in {"", "-"} for row in rows),
        "sem_bairro_fortaleza": sum(key(row[23]) == "fortaleza" and row[22].strip() in {"", "-"} for row in rows),
        "fonte": "Relatório de finalização de ocorrência · cancelamentos · jan–set 2026",
    }
    target.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Agregados gerados: {len(rows):,} registros; {len(municipalities)} municípios; {len(neighborhoods)} bairros.")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
