"""
AEROKRYPT - PostGIS Extension & Spatial DDL Tests
Tests:
1. SafeGeometry spatial type mapping for PostgreSQL (PostGIS) vs SQLite.
2. SafeArray array type mapping for PostgreSQL (ARRAY) vs SQLite (JSON).
3. PostGIS DDL script (initdb.sql) syntax and table coverage.
4. Schema index and constraint audit across all 10 tables.
"""

import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import Table, Column, String, Integer, MetaData
from sqlalchemy.dialects import postgresql, sqlite
from app.models.spatial_models import SafeGeometry, SafeArray, Base
from app.config import settings


def test_safe_geometry_dialect_compilation():
    """
    Verifies that SafeGeometry produces PostGIS geometry types on PostgreSQL
    and Text types on SQLite.
    """
    metadata = MetaData()
    test_table = Table(
        "test_spatial",
        metadata,
        Column("id", Integer, primary_key=True),
        Column("point_geom", SafeGeometry(geometry_type="POINT", srid=4326)),
        Column("poly_geom", SafeGeometry(geometry_type="POLYGON", srid=4326))
    )

    # 1. Compile for PostgreSQL
    pg_impl = test_table.columns.point_geom.type.load_dialect_impl(postgresql.dialect())
    pg_ddl = str(postgresql.dialect().type_compiler.process(pg_impl))
    # On PostgreSQL with GeoAlchemy2, geometry type is used
    assert "GEOMETRY" in pg_ddl.upper()

    # 2. Compile for SQLite
    sqlite_impl = test_table.columns.point_geom.type.load_dialect_impl(sqlite.dialect())
    sqlite_ddl = str(sqlite.dialect().type_compiler.process(sqlite_impl))
    assert "TEXT" in sqlite_ddl.upper()


def test_safe_array_dialect_compilation():
    """
    Verifies that SafeArray produces native ARRAY on PostgreSQL and JSON on SQLite.
    """
    metadata = MetaData()
    test_table = Table(
        "test_array",
        metadata,
        Column("id", Integer, primary_key=True),
        Column("tags", SafeArray(String))
    )

    # 1. Compile for PostgreSQL
    pg_type = test_table.columns.tags.type.load_dialect_impl(postgresql.dialect())
    assert isinstance(pg_type, postgresql.ARRAY)

    # 2. Compile for SQLite
    sqlite_type = test_table.columns.tags.type.load_dialect_impl(sqlite.dialect())
    assert "JSON" in type(sqlite_type).__name__.upper() or "TEXT" in type(sqlite_type).__name__.upper()


def test_all_10_tables_registered_in_metadata():
    """
    Audits that all 10 mandatory tables are registered in SQLAlchemy Base.metadata.
    """
    # Import all models to ensure registration
    import app.models.spatial_models
    import app.models.research_models

    table_names = list(Base.metadata.tables.keys())

    expected_tables = [
        "researchers",
        "research_records",
        "research_references",
        "research_submissions",
        "review_history",
        "analogue_locations",
        "environmental_parameters",
        "planetary_reference_terrains",
        "site_evaluations",
        "pds_raster_assets"
    ]

    for expected in expected_tables:
        assert expected in table_names, f"Mandatory table [{expected}] is missing from SQLAlchemy metadata!"


def test_initdb_sql_contains_postgis_extensions_and_tables():
    """
    Verifies that initdb.sql contains the PostGIS extension activations,
    spatial indexes, and table definitions for all 10 resources.
    """
    initdb_path = os.path.join(os.path.dirname(__file__), "..", "initdb.sql")
    assert os.path.exists(initdb_path), "initdb.sql not found!"

    with open(initdb_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Check PostGIS extensions
    assert "CREATE EXTENSION IF NOT EXISTS postgis;" in content
    assert "CREATE EXTENSION IF NOT EXISTS postgis_topology;" in content
    assert "CREATE EXTENSION IF NOT EXISTS postgis_raster;" in content

    # Check GIST spatial indexes
    assert "USING GIST (center_geometry)" in content
    assert "USING GIST (boundary_polygon)" in content

    # Check all 10 tables present in SQL DDL
    expected_tables = [
        "analogue_locations",
        "environmental_parameters",
        "planetary_reference_terrains",
        "site_evaluations",
        "pds_raster_assets",
        "researchers",
        "research_records",
        "research_references",
        "research_submissions",
        "review_history"
    ]
    for tbl in expected_tables:
        assert f"CREATE TABLE IF NOT EXISTS {tbl}" in content, f"Table [{tbl}] missing from initdb.sql!"
