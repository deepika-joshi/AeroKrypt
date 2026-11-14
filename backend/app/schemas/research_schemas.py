"""
AEROKRYPT - Research & Authentication Pydantic Schemas
Defines request and response schemas for researcher authentication,
private workspace records, references, and peer-review submissions.
"""

import re
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, List, Any, Dict
from datetime import datetime


# ============================================================================
# RESEARCHER AUTHENTICATION SCHEMAS
# ============================================================================

EMAIL_REGEX = re.compile(r"^[\w\.\+\-]+@[\w\-]+\.[a-zA-Z]{2,}$")


class ResearcherRegisterRequest(BaseModel):
    email: str = Field(..., description="Valid institutional or professional email")
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    full_name: str = Field(..., min_length=2)
    institution: str = Field(..., min_length=2)
    role: Optional[str] = Field("RESEARCHER", description="'RESEARCHER' | 'REVIEWER' | 'ADMIN'")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not EMAIL_REGEX.match(clean):
            raise ValueError("Invalid email format")
        return clean


class ResearcherLoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        return v.strip().lower()



class ResearcherResponse(BaseModel):
    id: str
    email: str
    full_name: str
    institution: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    researcher: ResearcherResponse


# ============================================================================
# RESEARCH REFERENCES SCHEMAS
# ============================================================================

class ReferenceCreate(BaseModel):
    doi: Optional[str] = None
    title: str = Field(..., min_length=2)
    authors: Optional[str] = None
    journal: Optional[str] = None
    year: Optional[int] = None
    url: Optional[str] = None
    citation_status: Optional[str] = "UNVERIFIED"


class ReferenceResponse(BaseModel):
    id: int
    record_id: str
    doi: Optional[str] = None
    title: str
    authors: Optional[str] = None
    journal: Optional[str] = None
    year: Optional[int] = None
    url: Optional[str] = None
    citation_status: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# PRIVATE RESEARCH RECORD SCHEMAS (WORKSPACE)
# ============================================================================

class ResearchRecordCreate(BaseModel):
    title: str = Field(..., min_length=3)
    abstract: Optional[str] = None
    objective: Optional[str] = None
    category: str = Field("ANALOGUE_GEOLOGY", description="ANALOGUE_GEOLOGY | ASTROBIOLOGY | ROVER_MOBILITY | etc.")
    target_body: str = Field("Mars", description="'Mars' | 'Moon' | 'Dual'")
    location_id: Optional[str] = None
    experiment_name: Optional[str] = None
    methodology: Optional[str] = None
    observations: Optional[str] = None
    findings: Optional[str] = None
    research_notes: Optional[str] = None
    status: Optional[str] = "DRAFT"
    collaborators: Optional[List[str]] = None
    experiment_params: Optional[Dict[str, Any]] = None
    field_observations: Optional[List[Dict[str, Any]]] = None
    environmental_measurements: Optional[List[Dict[str, Any]]] = None
    geological_observations: Optional[List[Dict[str, Any]]] = None
    instrument_readings: Optional[List[Dict[str, Any]]] = None
    attachments: Optional[List[Dict[str, Any]]] = None
    saved_evaluations_json: Optional[List[Dict[str, Any]]] = None
    references: Optional[List[ReferenceCreate]] = []


class ResearchRecordUpdate(BaseModel):
    title: Optional[str] = None
    abstract: Optional[str] = None
    objective: Optional[str] = None
    category: Optional[str] = None
    target_body: Optional[str] = None
    location_id: Optional[str] = None
    experiment_name: Optional[str] = None
    methodology: Optional[str] = None
    observations: Optional[str] = None
    findings: Optional[str] = None
    research_notes: Optional[str] = None
    status: Optional[str] = None
    collaborators: Optional[List[str]] = None
    experiment_params: Optional[Dict[str, Any]] = None
    field_observations: Optional[List[Dict[str, Any]]] = None
    environmental_measurements: Optional[List[Dict[str, Any]]] = None
    geological_observations: Optional[List[Dict[str, Any]]] = None
    instrument_readings: Optional[List[Dict[str, Any]]] = None
    attachments: Optional[List[Dict[str, Any]]] = None
    saved_evaluations_json: Optional[List[Dict[str, Any]]] = None
    references: Optional[List[ReferenceCreate]] = None


class ResearchRecordResponse(BaseModel):
    id: str
    researcher_id: str
    title: str
    abstract: Optional[str] = None
    objective: Optional[str] = None
    category: str
    target_body: str
    location_id: Optional[str] = None
    experiment_name: Optional[str] = None
    methodology: Optional[str] = None
    observations: Optional[str] = None
    findings: Optional[str] = None
    research_notes: Optional[str] = None
    status: str
    collaborators: Optional[List[str]] = None
    experiment_params: Optional[Dict[str, Any]] = None
    field_observations: Optional[List[Dict[str, Any]]] = None
    environmental_measurements: Optional[List[Dict[str, Any]]] = None
    geological_observations: Optional[List[Dict[str, Any]]] = None
    instrument_readings: Optional[List[Dict[str, Any]]] = None
    attachments: Optional[List[Dict[str, Any]]] = None
    saved_evaluations_json: Optional[List[Dict[str, Any]]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    references: List[ReferenceResponse] = []

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# RESEARCH SUBMISSION & REVIEW SCHEMAS
# ============================================================================

class SubmissionCreate(BaseModel):
    record_id: str
    submission_title: Optional[str] = None
    submission_type: Optional[str] = "RESEARCH_RECORD"


class SubmissionReviewAction(BaseModel):
    status: str = Field(..., description="'UNDER_REVIEW' | 'REVISION_REQUESTED' | 'APPROVED' | 'PUBLISHED'")
    reviewer_comments: Optional[str] = None
    reviewer_name: Optional[str] = None
    revision_requested_reason: Optional[str] = None


class ReviewHistoryResponse(BaseModel):
    id: int
    submission_id: str
    actor_id: Optional[str] = None
    actor_name: str
    from_status: Optional[str] = None
    to_status: str
    comment: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class SubmissionResponse(BaseModel):
    id: str
    record_id: str
    researcher_id: str
    submission_title: str
    submission_type: str
    status: str
    reviewer_id: Optional[str] = None
    reviewer_name: Optional[str] = None
    reviewer_notes: Optional[str] = None
    revision_requested_reason: Optional[str] = None
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    audit_history: List[ReviewHistoryResponse] = []
    record: Optional[ResearchRecordResponse] = None

    model_config = ConfigDict(from_attributes=True)


class PublicContributionResponse(BaseModel):
    id: str
    submission_title: str
    submission_type: str
    target_body: str
    category: str
    author_name: str
    author_institution: str
    location_id: Optional[str] = None
    abstract: Optional[str] = None
    findings: Optional[str] = None
    published_at: Optional[datetime] = None
    references: List[ReferenceResponse] = []
