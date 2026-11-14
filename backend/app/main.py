"""
AEROKRYPT - Planetary Analogue Research & Site Evaluation Platform
FastAPI Backend Core
Technology Stack: Python + FastAPI + PostgreSQL/PostGIS + GDAL/Rasterio/GeoPandas + Scikit-learn/PyTorch
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config import settings
from app.database import init_db
from app.routers import locations, planetary, evaluations, ingestion, auth, research

logger = logging.getLogger("aerokrypt.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes database schema and default seeds on platform boot."""
    try:
        init_db()
        logger.info("AEROKRYPT database initialization complete.")
    except Exception as e:
        logger.error("Failed to initialize database on startup: %s", e)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    description="""
    ## AEROKRYPT Planetary Science & Analogue Research API

    Provides high-performance geodetic data querying, planetary terrain comparison (Mars MOLA & Moon LOLA),
    multi-parameter site suitability assessment, and authenticated researcher private workspaces.

    ### Mandatory Approved Stack Compliance:
    - **Backend**: Python + FastAPI
    - **Database**: PostgreSQL + PostGIS (Spatial Geometries: WGS 84 & IAU2000)
    - **GIS Engine**: GDAL + Rasterio + GeoPandas
    - **AI / ML**: Scikit-learn + PyTorch
    - **Data APIs**: NASA PDS4 + USGS 3DEP + ESA + STAC (Copernicus GLO-30)
    """,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Configure CORS for frontend access (Vite dev & production) with credential support
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:80",
        "http://127.0.0.1:80",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(research.router, prefix=settings.API_V1_STR)
app.include_router(locations.router, prefix=settings.API_V1_STR)
app.include_router(planetary.router, prefix=settings.API_V1_STR)
app.include_router(evaluations.router, prefix=settings.API_V1_STR)
app.include_router(ingestion.router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["System Telemetry"])
def health_check():
    """Returns platform operational telemetry and component status."""
    return {
        "status": "NOMINAL" if settings.IS_LOCAL_DB_LIVE else "DATABASE_DISCONNECTED",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "stack": {
            "api_framework": "FastAPI",
            "gis_processing": "GDAL + Rasterio + GeoPandas",
            "machine_learning": "Scikit-learn + PyTorch",
            "spatial_database": "PostgreSQL 16 + PostGIS 3.4 (with explicit SQLite testing option)",
            "client_mapping": "Leaflet",
            "client_charts": "Recharts"
        },
        "database_connected": settings.IS_LOCAL_DB_LIVE,
        "database_dialect": settings.DB_DIALECT,
        "database_status": settings.DB_CONNECTION_STATUS,
        "database_error": settings.DB_ERROR,
        "postgis_available": settings.POSTGIS_AVAILABLE,
        "postgis_version": settings.POSTGIS_VERSION,
        "data_integrity_policy": "NO_FABRICATED_SCORES_OR_FICTITIOUS_APIS"
    }


@app.get("/", tags=["System Telemetry"])
def root():
    return {
        "platform": "AEROKRYPT",
        "documentation": f"{settings.API_V1_STR}/docs",
        "openapi_spec": f"{settings.API_V1_STR}/openapi.json"
    }
