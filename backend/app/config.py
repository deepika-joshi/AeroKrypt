from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True, extra="allow")

    PROJECT_NAME: str = "AEROKRYPT Planetary Science API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database Settings (PostgreSQL + PostGIS by default)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://aerokrypt_user:aerokrypt_secure_password_dev@localhost:5432/aerokrypt"
    )

    # SQLite Option - ONLY engaged when explicitly configured for testing/dev
    SQLITE_FALLBACK_URL: str = os.getenv("SQLITE_FALLBACK_URL", "sqlite:///./aerokrypt.db")
    USE_SQLITE: bool = os.getenv("USE_SQLITE", "false").lower() in ("true", "1")

    # Explicit Database Telemetry & Connection Tracking
    DB_DIALECT: str = "UNKNOWN"
    DB_CONNECTION_STATUS: str = "INITIALIZING"  # 'CONNECTED_POSTGRESQL', 'CONNECTED_SQLITE_EXPLICIT', 'POSTGRESQL_CONNECTION_FAILED'
    DB_ERROR: Optional[str] = None
    IS_LOCAL_DB_LIVE: bool = False
    POSTGIS_AVAILABLE: bool = False
    POSTGIS_VERSION: Optional[str] = None

    # Raster Storage
    RASTER_CACHE_DIR: str = os.getenv("RASTER_CACHE_DIR", "./raster_cache")

    # Ingestion / STAC API Providers
    NASA_PDS_SEARCH_URL: str = "https://pds.nasa.gov/api/search/1.0"
    USGS_3DEP_API_URL: str = "https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer"
    EARTH_SEARCH_STAC_URL: str = "https://earth-search.aws.element84.com/v1"

    # Status: Connected vs Pending Architecture Flag
    IS_LOCAL_DB_LIVE: bool = False

    # SQLite fallback database for local environments and tests
    SQLITE_FALLBACK_URL: str = os.getenv("SQLITE_FALLBACK_URL", "sqlite:///./aerokrypt.db")

    # Researcher Authentication & Session Security
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "aerokrypt_planetary_research_jwt_secret_key_2026_supersecure_32b"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    COOKIE_NAME: str = "access_token"

settings = Settings()

