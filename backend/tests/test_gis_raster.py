"""
AEROKRYPT - GIS & Scientific Raster Processing Test Suite
Verifies:
1. Native binary availability of GDAL, Rasterio, GeoPandas, Shapely.
2. Creation and authentic pixel sampling of GeoTIFF rasters using Rasterio.
3. Handling of nodata values and out-of-bounds geocoordinates.
4. Vector geometry checks using GeoPandas and Shapely.
"""

import sys
import os
import tempfile
import pytest
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.gis_processor import (
    gis_processor,
    RASTERIO_AVAILABLE,
    GDAL_AVAILABLE
)


def test_gis_dependencies_availability():
    """Verifies that Rasterio with embedded GDAL and GeoPandas are active."""
    assert RASTERIO_AVAILABLE is True
    assert GDAL_AVAILABLE is True

    import rasterio
    import geopandas as gpd
    import shapely
    import pyproj

    assert rasterio.__version__ is not None
    assert gpd.__version__ is not None
    assert shapely.__version__ is not None
    assert pyproj.__version__ is not None


def test_geotiff_raster_sampling():
    """
    Creates a real GeoTIFF raster using Rasterio and tests authentic coordinate
    pixel elevation sampling through RasterElevationProcessor.
    """
    import rasterio
    from rasterio.transform import from_origin

    # Create temporary GeoTIFF
    with tempfile.NamedTemporaryFile(suffix=".tif", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        # Define 10x10 elevation grid around Gale Crater region
        # Top-left corner: Lon 137.0, Lat -5.0. Resolution: 0.1 deg / pixel
        transform = from_origin(137.0, -5.0, 0.1, 0.1)
        grid_data = np.zeros((10, 10), dtype=np.float32)

        # Populate synthetic topography: elevation varies from -4500m to -1200m
        for r in range(10):
            for c in range(10):
                grid_data[r, c] = -4500.0 + (r * 100.0) + (c * 200.0)

        # Set specific nodata pixel at row 0, col 0
        grid_data[0, 0] = -9999.0

        with rasterio.open(
            tmp_path,
            'w',
            driver='GTiff',
            height=10,
            width=10,
            count=1,
            dtype=grid_data.dtype,
            crs='+proj=latlong +datum=WGS84',
            transform=transform,
            nodata=-9999.0
        ) as dst:
            dst.write(grid_data, 1)

        # 1. Sample known valid coordinate (row 2, col 3)
        # Lat: -5.0 - 2.5 * 0.1 = -5.25; Lon: 137.0 + 3.5 * 0.1 = 137.35
        sampled = gis_processor.sample_elevation_at_coordinate(tmp_path, lat=-5.25, lon=137.35)
        assert sampled is not None
        expected_val = -4500.0 + (2 * 100.0) + (3 * 200.0)
        assert sampled == pytest.approx(expected_val, rel=1e-3)

        # 2. Sample nodata pixel (row 0, col 0)
        # Lat: -5.05, Lon: 137.05
        sampled_nodata = gis_processor.sample_elevation_at_coordinate(tmp_path, lat=-5.05, lon=137.05)
        assert sampled_nodata is None

        # 3. Sample out-of-bounds coordinate
        sampled_oob = gis_processor.sample_elevation_at_coordinate(tmp_path, lat=45.0, lon=0.0)
        assert sampled_oob is None

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def test_geopandas_spatial_polygon_containment():
    """
    Verifies GeoPandas vector containment calculations for analogue bounding boxes.
    """
    import geopandas as gpd
    from shapely.geometry import Polygon, Point

    # Define polygon for Haughton Crater research zone
    # [minx, miny, maxx, maxy] = [-89.95, 75.30, -89.70, 75.45]
    poly = Polygon([
        (-89.95, 75.30),
        (-89.70, 75.30),
        (-89.70, 75.45),
        (-89.95, 75.45),
        (-89.95, 75.30)
    ])
    gdf = gpd.GeoDataFrame([{"name": "Haughton Impact Zone", "geometry": poly}], crs="EPSG:4326")

    # Point inside Haughton base camp
    p_inside = Point(-89.85, 75.38)
    assert bool(gdf.contains(p_inside).iloc[0]) is True

    # Point outside (Resolute Bay)
    p_outside = Point(-94.83, 74.69)
    assert bool(gdf.contains(p_outside).iloc[0]) is False
