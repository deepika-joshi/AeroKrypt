"""
AEROKRYPT - Planetary Analogue Locations Router
Serves the 20 curated and audited planetary analogue locations with PostGIS spatial coordinates,
environmental parameters, lithology, and bounding box polygons.
"""

import os
import json
import re
import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.schemas import AnalogueLocationSummary, AnalogueLocationDetail, BoundingBox, ParameterResponse
from app.database import get_db
from app.models.spatial_models import AnalogueLocationModel

logger = logging.getLogger("aerokrypt.routers.locations")
router = APIRouter(prefix="/locations", tags=["Analogue Locations (PostGIS)"])

# Helper to convert DMS string (e.g. 24°04′S, 69°59′W or decimal) to float
def dms_to_deg(dms_str: str) -> Optional[float]:
    if not dms_str or not isinstance(dms_str, str):
        return None
    dms_str = dms_str.strip()
    # Check simple float
    try:
        return float(dms_str.replace("°", "").replace("N", "").replace("E", ""))
    except ValueError:
        pass

    # Check degree minute second regex
    match = re.search(r"([0-9\.]+)[°\s]+([0-9\.]*)['′\s]*([0-9\.]*)[\"″\s]*([NSEWnsew]?)", dms_str)
    if match:
        deg = float(match.group(1))
        mins = float(match.group(2)) if match.group(2) else 0.0
        secs = float(match.group(3)) if match.group(3) else 0.0
        direction = match.group(4).upper()
        res = deg + (mins / 60.0) + (secs / 3600.0)
        if direction in ['S', 'W']:
            res = -res
        return res
    return None


def parse_coordinates(coord_str: str):
    """Splits '24°04′S, 69°59′W' into (lat, lon)."""
    parts = coord_str.split(",")
    if len(parts) == 2:
        return dms_to_deg(parts[0]), dms_to_deg(parts[1])
    return 0.0, 0.0


# Load full audited 20 locations from JSON
LOCATIONS_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "locations.json")
ALL_LOCATIONS = []

try:
    with open(LOCATIONS_PATH, "r", encoding="utf-8") as f:
        raw_locations = json.load(f)

    for item in raw_locations:
        loc_id = item["id"]
        coords_str = item.get("coordinates", "")
        lat, lon = parse_coordinates(coords_str)

        # Bounding box calculation
        raw_bbox = item.get("geographicBoundaries", {}).get("boundingBox", {})
        n = dms_to_deg(str(raw_bbox.get("north", ""))) if raw_bbox.get("north") is not None else (lat + 0.1 if lat else 1.0)
        s = dms_to_deg(str(raw_bbox.get("south", ""))) if raw_bbox.get("south") is not None else (lat - 0.1 if lat else -1.0)
        e = dms_to_deg(str(raw_bbox.get("east", ""))) if raw_bbox.get("east") is not None else (lon + 0.1 if lon else 1.0)
        w = dms_to_deg(str(raw_bbox.get("west", ""))) if raw_bbox.get("west") is not None else (lon - 0.1 if lon else -1.0)

        bbox = BoundingBox(
            north=round(n or 0.0, 4),
            south=round(s or 0.0, 4),
            east=round(e or 0.0, 4),
            west=round(w or 0.0, 4),
            boundary_type=item.get("geographicBoundaries", {}).get("boundaryClassification", "RESEARCH_AREA_ENVELOPE"),
            official_boundary_evidence_available=item.get("geographicBoundaries", {}).get("surveyStatus") == "OFFICIALLY_SURVEYED"
        )

        # Environmental parameters
        parsed_params = []
        for p_key, p_val in item.get("environmentalParameters", {}).items():
            if isinstance(p_val, dict):
                parsed_params.append(
                    ParameterResponse(
                        parameter_key=p_key,
                        parameter_name=p_val.get("name", p_key),
                        parameter_category=p_val.get("category", "General"),
                        value=float(p_val.get("value")) if isinstance(p_val.get("value"), (int, float)) else None,
                        unit=p_val.get("unit"),
                        data_tier=p_val.get("confidenceTier", "SOURCED"),
                        station_name=p_val.get("locationBasis"),
                        source_citation=p_val.get("sourceCitation", "AEROKRYPT Curated Database"),
                        doi=p_val.get("doi")
                    )
                )

        normalized = {
            **item,
            "id": loc_id,
            "name": item.get("name", loc_id),
            "country": item.get("country", "Unknown"),
            "region": item.get("region", "Global"),
            "primary_target": item.get("primaryTarget", "Mars"),
            "analogue_relevance": item.get("analogueRelevance", "MARS"),
            "target_bodies": item.get("targetBodies", [item.get("primaryTarget", "Mars")]),
            "location_category": item.get("locationCategory", "NATURAL_SITE"),
            "verification_status": item.get("verificationStatus", "VERIFIED"),
            "coordinates": coords_str,
            "geodetic_datum": item.get("geographicBoundaries", {}).get("geodeticDatum", "WGS 84 / EGM96 Geoid"),
            "bounding_box": bbox,
            "parameters": parsed_params,
            "lithology": item.get("lithology", []),
            "geomorphology_primary": item.get("terrainType", ""),
            "operational_strengths": item.get("operationalRelevance", [item.get("terrainType", "")]),
            "operational_limitations": item.get("environmentalCaveats", ["Earth 1.0G gravity discrepancy"]),
            "_lat": lat,
            "_lon": lon,
            "latitude": lat,
            "longitude": lon,
        }
        ALL_LOCATIONS.append(normalized)

except Exception as err:
    print(f"Warning: Could not load locations.json: {err}")
    ALL_LOCATIONS = []


@router.get("", response_model=List[AnalogueLocationSummary])
def list_locations(
    target_body: Optional[str] = Query(None, description="Filter by target body: 'Mars', 'Moon', or 'ALL'"),
    category: Optional[str] = Query(None, description="'NATURAL_SITE' or 'RESEARCH_FACILITY'"),
    db: Optional[Session] = Depends(get_db),
):
    """
    Retrieves all 20 Earth planetary analogue sites with PostGIS spatial coordinates and data tiers.
    Queries database records when available, falling back to curated verified dataset.
    """
    if db is not None:
        try:
            query = db.query(AnalogueLocationModel)
            if category and category.upper() != "ALL":
                query = query.filter(AnalogueLocationModel.location_category == category.upper())
            db_records = query.all()
            if db_records:
                results = []
                for loc in db_records:
                    tb_list = loc.target_bodies if isinstance(loc.target_bodies, list) else [loc.primary_target]
                    if target_body and target_body.upper() != "ALL":
                        if target_body.capitalize() not in [t.capitalize() for t in tb_list]:
                            continue
                    results.append({
                        "id": loc.id,
                        "name": loc.name,
                        "country": loc.country,
                        "region": loc.region,
                        "primary_target": loc.primary_target,
                        "analogue_relevance": loc.analogue_relevance,
                        "target_bodies": tb_list,
                        "location_category": loc.location_category,
                        "verification_status": loc.verification_status,
                        "coordinates": f"{loc.bounding_box_north or 0:.4f}, {loc.bounding_box_east or 0:.4f}",
                        "geodetic_datum": loc.geodetic_datum,
                    })
                return results
        except Exception as e:
            logger.warning("Database query failed in list_locations (%s). Serving cached baseline.", e)

    results = ALL_LOCATIONS
    if target_body and target_body.upper() != "ALL":
        results = [l for l in results if target_body.capitalize() in [t.capitalize() for t in l["target_bodies"]]]
    if category and category.upper() != "ALL":
        results = [l for l in results if l["location_category"].upper() == category.upper()]
    return results


@router.get("/{location_id}", response_model=AnalogueLocationDetail)
def get_location_by_id(location_id: str, db: Optional[Session] = Depends(get_db)):
    """
    Retrieves full site details, including bounding-box polygon, environmental parameters, and literature DOI registry.
    """
    if db is not None:
        try:
            loc = db.query(AnalogueLocationModel).filter(AnalogueLocationModel.id == location_id).first()
            if loc:
                parsed_params = [
                    ParameterResponse(
                        parameter_key=p.parameter_key,
                        parameter_name=p.parameter_name,
                        parameter_category=p.parameter_category,
                        value=float(p.measured_value) if p.measured_value is not None else None,
                        unit=p.unit,
                        data_tier=p.data_tier,
                        station_name=p.station_name,
                        station_distance_km=float(p.station_distance_km) if p.station_distance_km is not None else None,
                        source_citation=p.source_citation,
                        doi=p.doi
                    )
                    for p in loc.parameters
                ]
                bbox = BoundingBox(
                    north=float(loc.bounding_box_north or 0.0),
                    south=float(loc.bounding_box_south or 0.0),
                    east=float(loc.bounding_box_east or 0.0),
                    west=float(loc.bounding_box_west or 0.0),
                    boundary_type=loc.boundary_type,
                    official_boundary_evidence_available=loc.official_boundary_evidence_available
                )
                tb_list = loc.target_bodies if isinstance(loc.target_bodies, list) else [loc.primary_target]

                # Check for cached rich attributes (lithology, citations)
                cached = next((l for l in ALL_LOCATIONS if l["id"] == location_id), {})
                return {
                    **cached,
                    "id": loc.id,
                    "name": loc.name,
                    "country": loc.country,
                    "region": loc.region,
                    "primary_target": loc.primary_target,
                    "analogue_relevance": loc.analogue_relevance,
                    "target_bodies": tb_list,
                    "location_category": loc.location_category,
                    "verification_status": loc.verification_status,
                    "coordinates": f"{loc.bounding_box_north or 0:.4f}, {loc.bounding_box_east or 0:.4f}",
                    "geodetic_datum": loc.geodetic_datum,
                    "bounding_box": bbox,
                    "parameters": parsed_params or cached.get("parameters", []),
                    "lithology": cached.get("lithology", []),
                    "geomorphology_primary": cached.get("geomorphology_primary", ""),
                    "operational_strengths": cached.get("operational_strengths", []),
                    "operational_limitations": cached.get("operational_limitations", []),
                }
        except Exception as e:
            logger.warning("Database query failed in get_location_by_id (%s). Falling back.", e)

    for loc in ALL_LOCATIONS:
        if loc["id"] == location_id:
            return loc
    raise HTTPException(status_code=404, detail=f"Analogue location [{location_id}] not found in database.")


@router.get("/{location_id}/geojson")
def get_location_geojson(location_id: str, db: Optional[Session] = Depends(get_db)):
    """
    Returns authentic GeoJSON FeatureCollection with PostGIS point and bounding polygon geometry.
    """
    if db is not None:
        try:
            loc = db.query(AnalogueLocationModel).filter(AnalogueLocationModel.id == location_id).first()
            if loc:
                west = float(loc.bounding_box_west or -0.05)
                east = float(loc.bounding_box_east or 0.05)
                north = float(loc.bounding_box_north or 0.05)
                south = float(loc.bounding_box_south or -0.05)
                center_lon = (west + east) / 2.0
                center_lat = (north + south) / 2.0
                return {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [[
                                    [west, south],
                                    [east, south],
                                    [east, north],
                                    [west, north],
                                    [west, south]
                                ]]
                            },
                            "properties": {
                                "id": loc.id,
                                "name": loc.name,
                                "category": loc.location_category,
                                "crs": "urn:ogc:def:crs:OGC:1.3:CRS84"
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [center_lon, center_lat]
                            },
                            "properties": {
                                "id": loc.id,
                                "name": loc.name,
                                "primary_target": loc.primary_target
                            }
                        }
                    ]
                }
        except Exception as e:
            logger.warning("Database query failed in get_location_geojson (%s). Falling back.", e)

    loc = next((l for l in ALL_LOCATIONS if l["id"] == location_id), None)
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")

    bbox = loc.get("bounding_box")
    west = bbox.west if bbox else loc.get("_lon", 0.0) - 0.05
    east = bbox.east if bbox else loc.get("_lon", 0.0) + 0.05
    north = bbox.north if bbox else loc.get("_lat", 0.0) + 0.05
    south = bbox.south if bbox else loc.get("_lat", 0.0) - 0.05

    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [west, south],
                        [east, south],
                        [east, north],
                        [west, north],
                        [west, south]
                    ]]
                },
                "properties": {
                    "id": loc["id"],
                    "name": loc["name"],
                    "category": loc["location_category"],
                    "crs": "urn:ogc:def:crs:OGC:1.3:CRS84"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [loc.get("_lon", 0.0), loc.get("_lat", 0.0)]
                },
                "properties": {
                    "id": loc["id"],
                    "name": loc["name"],
                    "primary_target": loc["primary_target"]
                }
            }
        ]
    }
