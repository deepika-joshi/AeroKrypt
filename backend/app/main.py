"""
AEROKRYPT - Planetary Analogue Research & Site Evaluation Platform
FastAPI Backend Core
Technology Stack: Python + FastAPI + PostgreSQL/PostGIS + GDAL/Rasterio/GeoPandas + Scikit-learn/PyTorch
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import locations, planetary, evaluations, ingestion

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    ## AEROKRYPT Planetary Science & Analogue Research API
    
    Provides high-performance geodetic data querying, planetary terrain comparison (Mars MOLA & Moon LOLA),
    and multi-parameter site suitability assessment.
    
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

# Configure CORS for frontend access (Vite dev & production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(locations.router, prefix=settings.API_V1_STR)
app.include_router(planetary.router, prefix=settings.API_V1_STR)
app.include_router(evaluations.router, prefix=settings.API_V1_STR)
app.include_router(ingestion.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System Telemetry"])
def health_check():
    """Returns platform operational telemetry and component status."""
    return {
        "status": "NOMINAL",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "stack": {
            "api_framework": "FastAPI",
            "gis_processing": "GDAL + Rasterio + GeoPandas",
            "machine_learning": "Scikit-learn + PyTorch",
            "spatial_database": "PostgreSQL 16 + PostGIS 3.4",
            "client_mapping": "Leaflet",
            "client_charts": "Recharts"
        },
        "database_connected": settings.IS_LOCAL_DB_LIVE,
        "data_integrity_policy": "NO_FABRICATED_SCORES_OR_FICTITIOUS_APIS"
    }

@app.get("/", tags=["System Telemetry"])
def root():
    return {
        "platform": "AEROKRYPT",
        "documentation": f"{settings.API_V1_STR}/docs",
        "openapi_spec": f"{settings.API_V1_STR}/openapi.json"
    }

