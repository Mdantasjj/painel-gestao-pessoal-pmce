"""Gera apenas agregados públicos para o painel histórico a partir de um CSV bruto."""

from __future__ import annotations

import csv
import json
import sys
import unicodedata
from collections import Counter
from datetime import datetime
from pathlib import Path


def key(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.strip().upper())
    return "".join(char for char in decomposed if unicodedata.category(char) != "Mn")


def read_cancellations(source: Path) -> dict:
    with source.open(encoding="cp1252", newline="") as file:
        rows = list(csv.reader(file))
    dates = [datetime.strptime(row[18], "%d/%m/%Y %H:%M:%S") for row in rows]
    municipalities = Counter(key(row[23]) for row in rows if row[23].strip() != "-")
    return {
        "periodo": {"inicio": min(dates).strftime("%Y-%m-%d"), "fim": max(dates).strftime("%Y-%m-%d")},
        "total_registros": len(rows),
        "ocorrencias_unicas": len({row[20] for row in rows}),
        "motivos": dict(Counter(row[10] for row in rows)),
        "por_mes": [{"mes": month, "total": count} for month, count in sorted(Counter(date.strftime("%Y-%m") for date in dates).items())],
        "por_ais": [{"ais": ais, "total": count} for ais, count in Counter(row[7] for row in rows).most_common()],
        "por_municipio": dict(sorted(municipalities.items())),
        "sem_municipio": sum(row[23].strip() == "-" for row in rows),
        "sem_bairro": sum(row[22].strip() == "-" for row in rows),
    }


def read_attended_occurrences(source: Path) -> dict:
    with source.open(encoding="cp1252", newline="") as file:
        rows = list(csv.reader(file))
    aggregated_rows = {tuple(row[:8]) for row in rows}
    totals = Counter()
    for row in aggregated_rows:
        totals[row[5]] += int(row[7].replace(".", ""))
    total = sum(totals.values())
    if total != len(rows):
        raise ValueError(f"Total das ocorrências ({total}) diverge das linhas do relatório ({len(rows)})")
    return {"total": total, "por_ais": [{"ais": ais, "total": count} for ais, count in totals.most_common()]}


def main(cancellations_source: Path, occurrences_source: Path, target: Path) -> None:
    payload = read_cancellations(cancellations_source)
    payload["ocorrencias_atendidas"] = read_attended_occurrences(occurrences_source)
    target.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]))
