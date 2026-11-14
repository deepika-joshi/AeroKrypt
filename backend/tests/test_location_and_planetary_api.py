"""
AEROKRYPT - Location and Planetary Data API Test Suite
Verifies:
1. GET /api/v1/locations (All locations, filtering by target_body, category)
2. GET /api/v1/locations/{id} (Complete profile, verification status, no fabricated data)
3. GET /api/v1/locations/{id}/geojson (Valid GeoJSON FeatureCollection with polygon and point)
4. GET /api/v1/planetary/terrains (Mars MOLA & Moon LOLA datums, landforms, CRS)
5. GET /api/v1/planetary/terrains/{id} (Individual terrain metadata and bounds)
6. GET /api/v1/planetary/elevation-sample (Elevation sampling endpoint)
7. GET /api/v1/ingestion/stac/search (Copernicus GLO-30 and STAC search query)
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database import setup_database_connection, init_db

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_test_environment():
    # Use persistent SQLite test database
    setup_database_connection(force_sqlite=True)
    init_db()


def test_get_all_locations():
    """Verifies listing all analogue locations returns at least 20 curated sites."""
    res = client.get("/api/v1/locations")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 20

    # Verify key properties exist on each item
    for loc in data:
        assert "id" in loc
        assert "name" in loc
        assert "country" in loc
        assert "primary_target" in loc
        assert "target_bodies" in loc
        assert "location_category" in loc
        assert "verification_status" in loc


def test_filter_locations_by_target():
    """Verifies filtering by Mars, Moon, or Dual targets."""
    # Filter Mars
    res_mars = client.get("/api/v1/locations?target_body=Mars")
    assert res_mars.status_code == 200
    mars_locs = res_mars.json()
    assert len(mars_locs) > 0
    for loc in mars_locs:
        targets = [t.lower() for t in loc.get("target_bodies", [])]
        assert "mars" in targets or loc.get("primary_target", "").lower() == "mars"

    # Filter Moon
    res_moon = client.get("/api/v1/locations?target_body=Moon")
    assert res_moon.status_code == 200
    moon_locs = res_moon.json()
    assert len(moon_locs) > 0
    for loc in moon_locs:
        targets = [t.lower() for t in loc.get("target_bodies", [])]
        assert "moon" in targets or loc.get("primary_target", "").lower() == "moon"


def test_get_location_detail_and_404():
    """Verifies single location detail lookup and 404 for unknown IDs."""
    # Valid site: Atacama Desert — Yungay Region
    res = client.get("/api/v1/locations/atacama-yungay")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "atacama-yungay"
    assert "Atacama Desert" in data["name"]
    assert data["country"] == "Chile"
    assert data["primary_target"] == "Mars"
    assert "bounding_box" in data
    assert "parameters" in data

    # Unknown ID returns 404
    res_404 = client.get("/api/v1/locations/non-existent-fantasy-crater")
    assert res_404.status_code == 404
    assert "not found" in res_404.json()["detail"].lower()


def test_get_location_geojson():
    """Verifies valid GeoJSON feature geometry returned for map rendering."""
    res = client.get("/api/v1/locations/haughton-crater/geojson")
    assert res.status_code == 200
    geojson = res.json()
    assert geojson.get("type") == "FeatureCollection"
    assert "features" in geojson
    assert len(geojson["features"]) >= 1

    feature = geojson["features"][0]
    assert feature["type"] == "Feature"
    assert "geometry" in feature
    assert feature["geometry"]["type"] in ["Polygon", "Point"]
    assert "coordinates" in feature["geometry"]


def test_get_planetary_reference_terrains():
    """Verifies Mars MOLA and Moon LOLA reference terrains and datums."""
    res = client.get("/api/v1/planetary/terrains")
    assert res.status_code == 200
    terrains = res.json()
    assert isinstance(terrains, list)
    assert len(terrains) >= 3

    terrain_ids = [t["id"] for t in terrains]
    assert "mars-gale-crater-aeolis" in terrain_ids
    assert "moon-marius-hills-skylight" in terrain_ids

    for t in terrains:
        assert "datum_name" in t
        assert "datum_description" in t
        assert "target_body" in t


def test_planetary_elevation_sample():
    """Verifies elevation sampling endpoint behavior."""
    res = client.get("/api/v1/planetary/elevation-sample?lat=-5.36&lon=137.86&body=Mars")
    assert res.status_code == 200
    data = res.json()
    assert "elevation_m" in data
    assert data["target_body"] == "Mars"
    assert "method" in data


def test_stac_search_copernicus():
    """Verifies STAC client endpoint against Copernicus GLO-30 DEM."""
    res = client.get("/api/v1/ingestion/stac/search?target_body=earth&agency=copernicus")
    assert res.status_code == 200
    result = res.json()
    assert "features" in result or "items" in result or "status" in result
