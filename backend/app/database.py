from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import logging
from app.config import settings

logger = logging.getLogger("aerokrypt.database")

Base = declarative_base()

try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    logger.warning(
        "PostgreSQL + PostGIS engine could not bind to %s. Standalone mock mode active. Error: %s",
        settings.DATABASE_URL,
        e
    )
    engine = None
    SessionLocal = None

def get_db():
    """Dependency injection helper for FastAPI routes."""
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

