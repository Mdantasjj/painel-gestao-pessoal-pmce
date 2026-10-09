"""Gera agregados ponderados de tempo por AIS para o mapa público."""

from __future__ import annotations

import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path


METRICS = {
    "despacho_min": 13,
    "deslocamento_min": 16,
    "resolucao_min": 19,
    "resposta_min": 22,
}


def integer(value: str) -> int:
    return int(value.strip().replace(".", ""))


def duration_minutes(value: str) -> int:
    match = re.fullmatch(r"(\d+),(\d{2})", value.strip())
    if not match:
        raise ValueError(f"Tempo inválido: {value!r}")
    hours, minutes = map(int, match.groups())
    if minutes >= 60:
        raise ValueError(f"Minutos fora do intervalo: {value!r}")
    return hours * 60 + minutes


def main(source: Path, target: Path) -> None:
    with source.open(encoding="cp1252", newline="") as stream:
        rows = list(csv.reader(stream))
    if not rows or any(len(row) != 34 for row in rows):
        raise ValueError("Estrutura inesperada no relatório de tempos")

    accumulators: dict[str, dict[str, float]] = defaultdict(lambda: {"ocorrencias": 0, **{metric: 0.0 for metric in METRICS}})
    for row in rows:
        ais = row[8].strip()
        if not re.fullmatch(r"AIS\d{2}", ais):
            raise ValueError(f"AIS inválida: {ais!r}")
        occurrences = integer(row[10])
        accumulators[ais]["ocorrencias"] += occurrences
        for metric, index in METRICS.items():
            accumulators[ais][metric] += occurrences * duration_minutes(row[index])

    by_ais = {}
    for ais, values in sorted(accumulators.items()):
        occurrences = int(values["ocorrencias"])
        by_ais[ais.lower()] = {
            "ocorrencias": occurrences,
            **{metric: round(values[metric] / occurrences, 3) for metric in METRICS},
        }

    total = sum(item["ocorrencias"] for item in by_ais.values())
    reported_total = integer(rows[0][26])
    if total != reported_total:
        raise ValueError(f"Total ponderado ({total}) diverge do relatório ({reported_total})")

    global_metrics = {
        metric: round(sum(item[metric] * item["ocorrencias"] for item in by_ais.values()) / total, 3)
        for metric in METRICS
    }
    payload = {
        "periodo": {"inicio": "2026-01-01", "fim": "2026-09-30"},
        "total_ocorrencias_analisadas": total,
        "quantidade_ais": len(by_ais),
        "tempo_estadual": global_metrics,
        "por_ais": by_ais,
        "metodologia": "Estimativa AIS ponderada pela quantidade de ocorrências de cada tipo/subtipo.",
        "cautela": "A fonte fornece tempos médios já agregados e arredondados no formato horas,minutos; não são tempos individuais.",
        "fonte": "Relatório TEMPOS MEDIANOS · campos identificados como TEMPO MÉDIO · jan–set/2026",
    }
    target.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Tempos agregados: {total:,} ocorrências; {len(by_ais)} AIS.")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
