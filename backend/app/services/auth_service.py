"""
AEROKRYPT - Authentication and Cryptographic Security Service
Implements NIST SP 800-132 PBKDF2-HMAC-SHA256 password hashing,
cryptographic JWT session tokens (HMAC-SHA256), and HttpOnly cookie authentication.
Zero-binary pure standard library implementation: 100% resilient across all operating systems.
"""

import base64
import hashlib
import hmac
import json
import secrets
import time
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Union
from fastapi import Request, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.research_models import ResearcherModel


# ============================================================================
# PASSWORD HASHING (PBKDF2-HMAC-SHA256, 200,000 Iterations, 16-byte salt)
# ============================================================================

def hash_password(password: str) -> str:
    """
    Hashes a researcher password using PBKDF2-HMAC-SHA256.
    Returns: 'pbkdf2_sha256$200000$<salt_hex>$<hash_hex>'
    """
    if not password or len(password) < 8:
        raise ValueError("Password must be at least 8 characters long")
    salt = secrets.token_hex(16)
    iterations = 200000
    dk = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        iterations
    )
    return f"pbkdf2_sha256${iterations}${salt}${dk.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against stored hash using constant-time comparison
    to prevent timing attacks.
    """
    try:
        parts = hashed_password.split('$')
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False
        iterations = int(parts[1])
        salt = parts[2]
        expected_hex = parts[3]
        dk = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt.encode('utf-8'),
            iterations
        )
        return hmac.compare_digest(dk.hex(), expected_hex)
    except Exception:
        return False


# ============================================================================
# CRYPTOGRAPHIC JWT TOKENS (RFC 7519 Compliant HMAC-SHA256)
# ============================================================================

def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')


def _base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4)) if (len(data) % 4) != 0 else ''
    return base64.urlsafe_b64decode(data + padding)


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Issues a cryptographically signed JWT token with sub, role, email, and exp claims.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": int(expire.timestamp()),
        "iat": int(now.timestamp()),
        "iss": "aerokrypt-planetary-api"
    })

    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _base64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = _base64url_encode(json.dumps(to_encode, separators=(',', ':')).encode('utf-8'))

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(
        settings.JWT_SECRET_KEY.encode('utf-8'),
        signing_input,
        hashlib.sha256
    ).digest()
    signature_b64 = _base64url_encode(signature)

    return f"{header_b64}.{payload_b64}.{signature_b64}"


def decode_access_token(token: str) -> dict:
    """
    Decodes and cryptographically verifies a JWT access token.
    Raises HTTPException(401) on invalid signature, tampering, or expiration.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or session expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        parts = token.split('.')
        if len(parts) != 3:
            raise credentials_exception

        header_b64, payload_b64, signature_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_signature = hmac.new(
            settings.JWT_SECRET_KEY.encode('utf-8'),
            signing_input,
            hashlib.sha256
        ).digest()

        actual_signature = _base64url_decode(signature_b64)
        if not hmac.compare_digest(actual_signature, expected_signature):
            raise credentials_exception

        payload_bytes = _base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))

        # Expiration check
        exp = payload.get("exp")
        if exp is None or time.time() > exp:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session token has expired. Please log in again.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return payload
    except HTTPException:
        raise
    except Exception:
        raise credentials_exception


# ============================================================================
# FASTAPI AUTHENTICATION DEPENDENCIES
# ============================================================================

def get_token_from_request(request: Request) -> Optional[str]:
    """
    Extracts access token with preference for secure HttpOnly cookie,
    falling back to Authorization Bearer header.
    """
    # 1. Check HttpOnly cookie
    token = request.cookies.get(settings.COOKIE_NAME)
    if token:
        return token

    # 2. Check Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:].strip()

    return None


def get_current_researcher(
    request: Request,
    db: Session = Depends(get_db)
) -> ResearcherModel:
    """
    FastAPI route dependency ensuring researcher authentication.
    Returns the authenticated ResearcherModel.
    Raises 401 Unauthorized if unauthenticated.
    """
    token = get_token_from_request(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    researcher_id = payload.get("sub")
    if not researcher_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: missing researcher identifier",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service unavailable"
        )

    researcher = db.query(ResearcherModel).filter(ResearcherModel.id == researcher_id).first()
    if not researcher:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Researcher account no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not researcher.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Researcher account is inactive or suspended"
        )

    return researcher


def get_optional_researcher(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[ResearcherModel]:
    """
    Optional researcher dependency. Returns ResearcherModel if authenticated, None otherwise.
    Used for endpoints that provide additional metadata for logged-in researchers without blocking public users.
    """
    token = get_token_from_request(request)
    if not token or db is None:
        return None
    try:
        payload = decode_access_token(token)
        researcher_id = payload.get("sub")
        if not researcher_id:
            return None
        return db.query(ResearcherModel).filter(
            ResearcherModel.id == researcher_id,
            ResearcherModel.is_active == True
        ).first()
    except Exception:
        return None


def require_roles(allowed_roles: List[str]):
    """
    Role-based authorization dependency factory.
    Example: Depends(require_roles(["REVIEWER", "ADMIN"]))
    """
    def role_checker(current_user: ResearcherModel = Depends(get_current_researcher)) -> ResearcherModel:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation requires one of the following roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker
