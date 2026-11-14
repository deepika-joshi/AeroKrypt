-- AEROKRYPT Planetary Science Database Initialization
-- Enables PostGIS spatial extensions and foundational geodetic schema

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS postgis_raster;

-- Verify PostGIS installation
DO $$
BEGIN
    RAISE NOTICE 'PostGIS Extension Initialized: %', postgis_full_version();
END $$;

-- 1. Analogue Locations Spatial Table
CREATE TABLE IF NOT EXISTS analogue_locations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(150) NOT NULL,
    primary_target VARCHAR(50) NOT NULL,
    analogue_relevance VARCHAR(50) NOT NULL,
    target_bodies TEXT[] NOT NULL,
    location_category VARCHAR(50) NOT NULL, -- 'NATURAL_SITE' | 'RESEARCH_FACILITY'
    verification_status VARCHAR(50) NOT NULL, -- 'VERIFIED' | 'PRELIMINARY'
    center_geometry GEOMETRY(Point, 4326) NOT NULL,
    boundary_polygon GEOMETRY(Polygon, 4326),
    geodetic_datum VARCHAR(100) DEFAULT 'WGS 84 / EGM96 Geoid',
    bounding_box_north NUMERIC(9, 6),
    bounding_box_south NUMERIC(9, 6),
    bounding_box_east NUMERIC(9, 6),
    bounding_box_west NUMERIC(9, 6),
    boundary_type VARCHAR(100),
    official_boundary_evidence_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analogue_locations_center_geom ON analogue_locations USING GIST (center_geometry);
CREATE INDEX IF NOT EXISTS idx_analogue_locations_boundary_poly ON analogue_locations USING GIST (boundary_polygon);

-- 2. Environmental Parameters Table
CREATE TABLE IF NOT EXISTS environmental_parameters (
    id SERIAL PRIMARY KEY,
    location_id VARCHAR(64) REFERENCES analogue_locations(id) ON DELETE CASCADE,
    parameter_category VARCHAR(100) NOT NULL,
    parameter_name VARCHAR(150) NOT NULL,
    parameter_key VARCHAR(100) NOT NULL,
    measured_value NUMERIC(12, 4),
    unit VARCHAR(50),
    data_tier VARCHAR(50) NOT NULL, -- 'MEASURED' | 'NEARBY_STATION' | 'SOURCED' | 'ESTIMATED' | 'UNAVAILABLE'
    station_name VARCHAR(255),
    station_distance_km NUMERIC(8, 2),
    station_geometry GEOMETRY(Point, 4326),
    observation_period VARCHAR(100),
    source_citation TEXT NOT NULL,
    doi VARCHAR(150),
    doi_resolves BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_env_params_loc_key ON environmental_parameters(location_id, parameter_key);

-- 3. Planetary Reference Terrains Table (Mars MOLA & Moon LOLA/LROC)
CREATE TABLE IF NOT EXISTS planetary_reference_terrains (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    target_body VARCHAR(50) NOT NULL, -- 'Mars' | 'Moon'
    planetary_region VARCHAR(150) NOT NULL,
    primary_landform VARCHAR(150) NOT NULL,
    center_coordinates VARCHAR(100) NOT NULL,
    center_geometry GEOMETRY(Point, 4326),
    datum_name VARCHAR(150) NOT NULL, -- e.g., 'IAU2000:49900 (MOLA Gravitational Areoid)'
    datum_description TEXT NOT NULL,
    local_relief_m NUMERIC(10, 2),
    typical_slope_deg NUMERIC(6, 2),
    max_slope_deg NUMERIC(6, 2),
    raster_asset_uri TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Site Evaluation Dossiers Table
CREATE TABLE IF NOT EXISTS site_evaluations (
    id VARCHAR(64) PRIMARY KEY,
    location_id VARCHAR(64) REFERENCES analogue_locations(id),
    target_body VARCHAR(50) NOT NULL,
    planetary_terrain_id VARCHAR(64) REFERENCES planetary_reference_terrains(id),
    experiment_id VARCHAR(100),
    evaluator_name VARCHAR(255) NOT NULL,
    geological_fidelity_rating VARCHAR(50) NOT NULL,
    operational_feasibility_rating VARCHAR(50) NOT NULL,
    composite_similarity NUMERIC(6, 2),
    missing_critical_parameters TEXT[],
    divergent_factors TEXT[],
    strengths TEXT[],
    limitations TEXT[],
    evaluation_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PDS and USGS Ingested Raster Metadata Table
CREATE TABLE IF NOT EXISTS pds_raster_assets (
    id VARCHAR(100) PRIMARY KEY,
    agency VARCHAR(100) NOT NULL, -- 'NASA_PDS' | 'USGS' | 'ESA' | 'COPERNICUS'
    target_body VARCHAR(50) NOT NULL,
    dataset_name VARCHAR(255) NOT NULL,
    mission VARCHAR(100) NOT NULL,
    instrument VARCHAR(100) NOT NULL,
    product_level VARCHAR(50) NOT NULL,
    file_path TEXT NOT NULL,
    spatial_resolution_m NUMERIC(10, 2),
    crs_epsg VARCHAR(100),
    bounding_box_geom GEOMETRY(Polygon, 4326),
    nodata_value NUMERIC(12, 4),
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

