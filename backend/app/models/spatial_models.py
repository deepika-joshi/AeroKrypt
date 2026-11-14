import json
from sqlalchemy import Column, String, Numeric, Boolean, Text, ForeignKey, JSON, DateTime, Integer
from sqlalchemy.types import TypeDecorator
from sqlalchemy.dialects.postgresql import ARRAY as PG_ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

try:
    from geoalchemy2 import Geometry as PostGISGeometry
except ImportError:
    PostGISGeometry = None


class SafeGeometry(TypeDecorator):
    """
    Dual-compatibility spatial type:
    PostGIS Geometry when running on PostgreSQL, Text (WKT/GeoJSON) on SQLite.
    """
    impl = Text
    cache_ok = True

    def __init__(self, geometry_type='POINT', srid=4326, **kwargs):
        self.geometry_type = geometry_type
        self.srid = srid
        super().__init__(**kwargs)

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql' and PostGISGeometry is not None:
            return dialect.type_descriptor(PostGISGeometry(geometry_type=self.geometry_type, srid=self.srid))
        return dialect.type_descriptor(Text())


class SafeArray(TypeDecorator):
    """
    Dual-compatibility array type:
    Native PostgreSQL ARRAY on PostgreSQL, JSON array on SQLite.
    """
    impl = JSON
    cache_ok = True

    def __init__(self, item_type=None, **kwargs):
        self.item_type = item_type
        super().__init__(**kwargs)

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql' and self.item_type is not None:
            return dialect.type_descriptor(PG_ARRAY(self.item_type))
        return dialect.type_descriptor(JSON())

    def process_result_value(self, value, dialect):
        if dialect.name != 'postgresql' and isinstance(value, str):
            try:
                return json.loads(value)
            except Exception:
                return []
        return value


class AnalogueLocationModel(Base):
    """
    Earth Planetary Analogue Site with PostGIS point and bounding polygon.
    """
    __tablename__ = "analogue_locations"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False)
    region = Column(String(150), nullable=False)
    primary_target = Column(String(50), nullable=False)  # 'Mars' | 'Moon'
    analogue_relevance = Column(String(50), nullable=False)
    target_bodies = Column(SafeArray(String), nullable=False)
    location_category = Column(String(50), nullable=False)  # 'NATURAL_SITE' | 'RESEARCH_FACILITY'
    verification_status = Column(String(50), nullable=False)  # 'VERIFIED' | 'PRELIMINARY'

    # Dual-compatible Spatial Geometries (WGS 84, SRID 4326)
    center_geometry = Column(SafeGeometry(geometry_type='POINT', srid=4326), nullable=False)
    boundary_polygon = Column(SafeGeometry(geometry_type='POLYGON', srid=4326), nullable=True)
    geodetic_datum = Column(String(100), default='WGS 84 / EGM96 Geoid')

    bounding_box_north = Column(Numeric(9, 6), nullable=True)
    bounding_box_south = Column(Numeric(9, 6), nullable=True)
    bounding_box_east = Column(Numeric(9, 6), nullable=True)
    bounding_box_west = Column(Numeric(9, 6), nullable=True)
    boundary_type = Column(String(100), nullable=True)
    official_boundary_evidence_available = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parameters = relationship("EnvironmentalParameterModel", back_populates="location", cascade="all, delete-orphan")
    evaluations = relationship("SiteEvaluationModel", back_populates="location")


class EnvironmentalParameterModel(Base):
    """
    Environmental and physical parameter with rigorous source citation and data tier.
    """
    __tablename__ = "environmental_parameters"

    id = Column(Integer, primary_key=True, autoincrement=True)
    location_id = Column(String(64), ForeignKey("analogue_locations.id", ondelete="CASCADE"), nullable=False, index=True)
    parameter_category = Column(String(100), nullable=False)
    parameter_name = Column(String(150), nullable=False)
    parameter_key = Column(String(100), nullable=False)
    measured_value = Column(Numeric(12, 4), nullable=True)
    unit = Column(String(50), nullable=True)
    data_tier = Column(String(50), nullable=False)  # MEASURED, NEARBY_STATION, SOURCED, ESTIMATED, UNAVAILABLE

    station_name = Column(String(255), nullable=True)
    station_distance_km = Column(Numeric(8, 2), nullable=True)
    station_geometry = Column(SafeGeometry(geometry_type='POINT', srid=4326), nullable=True)
    observation_period = Column(String(100), nullable=True)

    source_citation = Column(Text, nullable=False)
    doi = Column(String(150), nullable=True)
    doi_resolves = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)

    location = relationship("AnalogueLocationModel", back_populates="parameters")


class PlanetaryReferenceTerrainModel(Base):
    """
    Target planetary terrain dataset (MOLA Areoid or LOLA Lunar Sphere).
    """
    __tablename__ = "planetary_reference_terrains"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    target_body = Column(String(50), nullable=False)  # 'Mars' | 'Moon'
    planetary_region = Column(String(150), nullable=False)
    primary_landform = Column(String(150), nullable=False)
    center_coordinates = Column(String(100), nullable=False)
    datum_name = Column(String(150), nullable=False)  # IAU2000
    datum_description = Column(Text, nullable=False)
    local_relief_m = Column(Numeric(10, 2), nullable=True)
    typical_slope_deg = Column(Numeric(6, 2), nullable=True)
    max_slope_deg = Column(Numeric(6, 2), nullable=True)
    raster_asset_uri = Column(Text, nullable=True)


class SiteEvaluationModel(Base):
    """
    Multi-criteria site evaluation dossier record.
    """
    __tablename__ = "site_evaluations"

    id = Column(String(64), primary_key=True, index=True)
    project_id = Column(String(64), ForeignKey("research_records.id", ondelete="SET NULL"), nullable=True, index=True)
    location_id = Column(String(64), ForeignKey("analogue_locations.id"), nullable=False)
    target_body = Column(String(50), nullable=False)
    planetary_terrain_id = Column(String(64), ForeignKey("planetary_reference_terrains.id"), nullable=False)
    experiment_id = Column(String(100), nullable=True)
    evaluator_name = Column(String(255), nullable=False)
    geological_fidelity_rating = Column(String(50), nullable=False)
    operational_feasibility_rating = Column(String(50), nullable=False)
    composite_similarity = Column(Numeric(6, 2), nullable=True)
    evaluation_version = Column(String(50), default="AEROKRYPT_SITE_EVAL_V2")
    source_data_provenance = Column(JSON, nullable=True)
    evaluation_json = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    location = relationship("AnalogueLocationModel", back_populates="evaluations")


class PDSRasterAssetModel(Base):
    """
    PDS, USGS, and Copernicus digital elevation raster metadata.
    """
    __tablename__ = "pds_raster_assets"

    id = Column(String(100), primary_key=True, index=True)
    agency = Column(String(100), nullable=False)  # 'NASA_PDS' | 'USGS' | 'ESA' | 'COPERNICUS'
    target_body = Column(String(50), nullable=False)
    dataset_name = Column(String(255), nullable=False)
    mission = Column(String(100), nullable=False)
    instrument = Column(String(100), nullable=False)
    product_level = Column(String(50), nullable=False)
    file_path = Column(Text, nullable=False)
    spatial_resolution_m = Column(Numeric(10, 2), nullable=True)
    crs_epsg = Column(String(100), nullable=True)
    bounding_box_geom = Column(SafeGeometry(geometry_type='POLYGON', srid=4326), nullable=True)
    nodata_value = Column(Numeric(12, 4), nullable=True)
    ingested_at = Column(DateTime(timezone=True), server_default=func.now())
