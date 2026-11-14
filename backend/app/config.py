from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "AEROKRYPT Planetary Science API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database Settings (PostgreSQL + PostGIS)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+psycopg2://aerokrypt_user:aerokrypt_secure_password_dev@localhost:5432/aerokrypt"
    )
    
    # Raster Storage
    RASTER_CACHE_DIR: str = os.getenv("RASTER_CACHE_DIR", "./raster_cache")
    
    # Ingestion / STAC API Providers
    NASA_PDS_SEARCH_URL: str = "https://pds.nasa.gov/api/search/1.0"
    USGS_3DEP_API_URL: str = "https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer"
    EARTH_SEARCH_STAC_URL: str = "https://earth-search.aws.element84.com/v1"

    # Status: Connected vs Pending Architecture Flag
    IS_LOCAL_DB_LIVE: bool = False

    class Config:
        case_sensitive = True

settings = Settings()

