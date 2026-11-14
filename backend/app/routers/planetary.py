from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from app.schemas.schemas import PlanetaryTerrainResponse
from app.services.gis_processor import gis_processor
from app.database import get_db
from app.models.spatial_models import PlanetaryReferenceTerrainModel

router = APIRouter(prefix="/planetary", tags=["Planetary Reference Terrains"])

PLANETARY_TERRAINS = [
    {
        "id": "mars-jezero-delta",
        "name": "Jezero Crater Fan Delta & Western Rim",
        "target_body": "Mars",
        "planetary_region": "Syrtis Major Quadrangle (MC-13)",
        "primary_landform": "River delta deposit & crater rim",
        "center_coordinates": "18.38° N, 77.58° E",
        "datum_name": "IAU2000:49900 (MOLA Gravitational Areoid)",
        "datum_description": "Areoid equipotential surface U₀ = 12,637,273 m²/s²",
        "local_relief_m": 850.0,
        "typical_slope_deg": 4.5,
        "max_slope_deg": 28.0,
        "source_agency": "NASA / JPL / MGS MOLA",
        "integration_tier": "MAP_SERVICE"
    },
    {
        "id": "mars-gale-crater-aeolis",
        "name": "Gale Crater & Mount Sharp (Aeolis Mons)",
        "target_body": "Mars",
        "planetary_region": "Aeolis Quadrangle (MC-23)",
        "primary_landform": "Sedimentary central mound",
        "center_coordinates": "5.4° S, 137.8° E",
        "datum_name": "IAU2000:49900 (MOLA Gravitational Areoid)",
        "datum_description": "Areoid equipotential datum",
        "local_relief_m": 5500.0,
        "typical_slope_deg": 7.0,
        "max_slope_deg": 35.0,
        "source_agency": "NASA / JPL-Caltech / MOLA",
        "integration_tier": "MAP_SERVICE"
    },
    {
        "id": "moon-marius-hills-skylight",
        "name": "Marius Hills Pit Crater (Lunar Skylight)",
        "target_body": "Moon",
        "planetary_region": "Oceanus Procellarum",
        "primary_landform": "Collapsed lava tube / skylight pit",
        "center_coordinates": "14.2° N, 56.7° W",
        "datum_name": "IAU2000:30100 (Mean Lunar Sphere R = 1,737.4 km)",
        "datum_description": "Mean radius sphere datum",
        "local_relief_m": 45.0,
        "typical_slope_deg": 12.0,
        "max_slope_deg": 75.0,
        "source_agency": "NASA / LRO LOLA & LROC NAC",
        "integration_tier": "MAP_SERVICE"
    }
]

@router.get("/terrains", response_model=List[PlanetaryTerrainResponse])
def list_planetary_terrains(
    target_body: Optional[str] = Query(None, description="'Mars' or 'Moon'"),
    db: Optional[Session] = Depends(get_db)
):
    """
    Retrieves curated planetary reference terrain models (MOLA & LOLA altimetry baselines).
    Queries database records when available, falling back to curated planetary baseline.
    """
    if db is not None:
        try:
            query = db.query(PlanetaryReferenceTerrainModel)
            if target_body:
                query = query.filter(PlanetaryReferenceTerrainModel.target_body.ilike(target_body))
            db_terrains = query.all()
            if db_terrains:
                return [
                    {
                        "id": t.id,
                        "name": t.name,
                        "target_body": t.target_body,
                        "planetary_region": t.planetary_region,
                        "primary_landform": t.primary_landform,
                        "center_coordinates": t.center_coordinates,
                        "datum_name": t.datum_name,
                        "datum_description": t.datum_description,
                        "local_relief_m": float(t.local_relief_m) if t.local_relief_m is not None else None,
                        "typical_slope_deg": float(t.typical_slope_deg) if t.typical_slope_deg is not None else None,
                        "max_slope_deg": float(t.max_slope_deg) if t.max_slope_deg is not None else None,
                        "source_agency": "NASA / JPL / ESA",
                        "integration_tier": "MAP_SERVICE"
                    }
                    for t in db_terrains
                ]
        except Exception:
            pass

    if target_body:
        return [t for t in PLANETARY_TERRAINS if t["target_body"].lower() == target_body.lower()]
    return PLANETARY_TERRAINS


@router.get("/terrains/{terrain_id}", response_model=PlanetaryTerrainResponse)
def get_terrain_by_id(terrain_id: str, db: Optional[Session] = Depends(get_db)):
    """
    Retrieves detailed planetary terrain model by unique ID.
    """
    if db is not None:
        try:
            t = db.query(PlanetaryReferenceTerrainModel).filter(PlanetaryReferenceTerrainModel.id == terrain_id).first()
            if t:
                return {
                    "id": t.id,
                    "name": t.name,
                    "target_body": t.target_body,
                    "planetary_region": t.planetary_region,
                    "primary_landform": t.primary_landform,
                    "center_coordinates": t.center_coordinates,
                    "datum_name": t.datum_name,
                    "datum_description": t.datum_description,
                    "local_relief_m": float(t.local_relief_m) if t.local_relief_m is not None else None,
                    "typical_slope_deg": float(t.typical_slope_deg) if t.typical_slope_deg is not None else None,
                    "max_slope_deg": float(t.max_slope_deg) if t.max_slope_deg is not None else None,
                    "source_agency": "NASA / JPL / ESA",
                    "integration_tier": "MAP_SERVICE"
                }
        except Exception:
            pass

    for t in PLANETARY_TERRAINS:
        if t["id"] == terrain_id:
            return t
    raise HTTPException(status_code=404, detail="Planetary terrain not found.")

@router.get("/elevation-sample")
def sample_elevation(lat: float, lon: float, body: str = "Mars"):
    """
    Samples elevation using Rasterio from cached PDS/MOLA or USGS raster datasets.
    """
    val = gis_processor.sample_elevation_at_coordinate(f"./raster_cache/{body.lower()}_dem.tif", lat, lon)
    return {
        "target_body": body,
        "lat": lat,
        "lon": lon,
        "elevation_m": val,
        "method": "RASTERIO_PIXEL_INTERPOLATION" if val is not None else "PENDING_LOCAL_RASTER_INGESTION"
    }

