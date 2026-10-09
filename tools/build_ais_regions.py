"""Gera a camada AIS a partir da malha municipal e dos bairros de Fortaleza."""

from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

from shapely.geometry import mapping, shape
from shapely.ops import unary_union


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "mapa" / "data"


def ais_key(value: object) -> str | None:
    match = re.search(r"AIS\s*(\d{1,2})", str(value or ""), re.IGNORECASE)
    return f"AIS {int(match.group(1)):02d}" if match else None


def main() -> None:
    municipalities = json.loads((DATA / "municipios-ceara-2026.geojson").read_text(encoding="utf-8"))
    neighborhoods = json.loads((DATA / "bairros-fortaleza.geojson").read_text(encoding="utf-8"))
    geometries: dict[str, list] = defaultdict(list)
    municipality_counts: dict[str, int] = defaultdict(int)
    neighborhood_counts: dict[str, int] = defaultdict(int)

    for feature in municipalities["features"]:
        if feature["properties"]["municipio"] == "Fortaleza":
            continue
        key = ais_key(feature["properties"].get("ais"))
        if key:
            geometries[key].append(shape(feature["geometry"]))
            municipality_counts[key] += 1

    for feature in neighborhoods["features"]:
        key = ais_key(feature["properties"].get("ais"))
        if key:
            geometries[key].append(shape(feature["geometry"]))
            neighborhood_counts[key] += 1

    features = []
    for key in sorted(geometries, key=lambda value: int(value[-2:])):
        region = unary_union(geometries[key]).buffer(0)
        point = region.representative_point()
        features.append({
            "type": "Feature",
            "properties": {
                "ais": key,
                "municipios": municipality_counts[key],
                "bairros_fortaleza": neighborhood_counts[key],
                "label_coordinates": [round(point.x, 6), round(point.y, 6)],
            },
            "geometry": mapping(region),
        })

    output = {
        "type": "FeatureCollection",
        "name": "Divisões territoriais por AIS",
        "source": "DISTRI VTR (1).xlsx · limites IPECE 2026 · bairros IPLANFOR 2023",
        "cobertura": "33 AIS com geometria; AIS 12 sem polígono separado na malha de origem.",
        "features": features,
    }
    (DATA / "ais-regioes.geojson").write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Camada AIS gerada: {len(features)} regiões com geometria.")


if __name__ == "__main__":
    main()
