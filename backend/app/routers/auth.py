"""
AEROKRYPT - Researcher Authentication Router
Provides registration, secure login with HttpOnly cookies, logout,
and current researcher profile verification.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.research_models import ResearcherModel
from app.schemas.research_schemas import (
    ResearcherRegisterRequest,
    ResearcherLoginRequest,
    ResearcherResponse,
    AuthResponse
)
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_researcher
)

router = APIRouter(prefix="/auth", tags=["Researcher Authentication"])


def set_auth_cookie(response: Response, token: str):
    """Sets secure HttpOnly cookie for authenticated session."""
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False,  # Set to True in production HTTPS environments
        path="/"
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(
    req: ResearcherRegisterRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Registers a new planetary researcher account.
    Hashes password with PBKDF2-HMAC-SHA256, issues JWT, and sets secure HttpOnly cookie.
    """
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service unavailable"
        )

    # Check if researcher email already exists
    existing = db.query(ResearcherModel).filter(ResearcherModel.email == req.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A researcher with this email address is already registered."
        )

    # Create researcher record
    researcher_id = f"res-{uuid.uuid4().hex[:12]}"
    researcher = ResearcherModel(
        id=researcher_id,
        email=req.email.lower().strip(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name.strip(),
        institution=req.institution.strip(),
        role=req.role if req.role in ["RESEARCHER", "REVIEWER", "ADMIN"] else "RESEARCHER",
        is_active=True
    )
    db.add(researcher)
    db.commit()
    db.refresh(researcher)

    # Create JWT session token
    token = create_access_token({
        "sub": researcher.id,
        "email": researcher.email,
        "role": researcher.role
    })

    # Set secure HttpOnly cookie
    set_auth_cookie(response, token)

    return {
        "message": "Researcher account registered successfully.",
        "access_token": token,
        "token_type": "bearer",
        "researcher": researcher
    }


@router.post("/login", response_model=AuthResponse)
def login(
    req: ResearcherLoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Authenticates a researcher using verified credentials.
    Sets HttpOnly session cookie and returns profile.
    """
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service unavailable"
        )

    researcher = db.query(ResearcherModel).filter(
        ResearcherModel.email == req.email.lower().strip()
    ).first()

    if not researcher or not verify_password(req.password, researcher.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not researcher.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or suspended. Please contact operations administration."
        )

    # Issue JWT
    token = create_access_token({
        "sub": researcher.id,
        "email": researcher.email,
        "role": researcher.role
    })

    # Set secure HttpOnly cookie
    set_auth_cookie(response, token)

    return {
        "message": "Login successful.",
        "access_token": token,
        "token_type": "bearer",
        "researcher": researcher
    }


@router.post("/logout")
def logout(response: Response):
    """
    Terminates session by clearing HttpOnly authentication cookie.
    """
    response.delete_cookie(
        key=settings.COOKIE_NAME,
        path="/",
        samesite="lax"
    )
    return {"message": "Session terminated. Logged out successfully."}


@router.get("/me", response_model=ResearcherResponse)
def get_current_user_profile(
    current_researcher: ResearcherModel = Depends(get_current_researcher)
):
    """
    Returns profile information for currently authenticated researcher.
    Protected route requiring valid cookie or Bearer token.
    """
    return current_researcher
