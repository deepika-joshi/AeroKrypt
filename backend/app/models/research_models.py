"""
AEROKRYPT - Research Models
Relational schema for Researcher Authentication, Private Research Records,
Citations, Multi-Stage Submissions, and Review History.
"""

from sqlalchemy import Column, String, Boolean, Text, ForeignKey, Integer, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ResearcherModel(Base):
    """
    Authenticated researcher identity with role-based access control.
    """
    __tablename__ = "researchers"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    institution = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="RESEARCHER")  # 'RESEARCHER' | 'REVIEWER' | 'ADMIN'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    records = relationship("ResearchRecordModel", back_populates="researcher", cascade="all, delete-orphan")
    submissions = relationship(
        "ResearchSubmissionModel",
        back_populates="author",
        foreign_keys="ResearchSubmissionModel.researcher_id",
        cascade="all, delete-orphan"
    )
    assigned_reviews = relationship(
        "ResearchSubmissionModel",
        back_populates="reviewer",
        foreign_keys="ResearchSubmissionModel.reviewer_id"
    )


class ResearchRecordModel(Base):
    """
    Private researcher workspace entry.
    STRICT PRIVACY: Only the owning researcher can view, edit, or delete this record.
    """
    __tablename__ = "research_records"

    id = Column(String(64), primary_key=True, index=True)
    researcher_id = Column(String(64), ForeignKey("researchers.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    abstract = Column(Text, nullable=True)
    objective = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, default="ANALOGUE_GEOLOGY")
    target_body = Column(String(50), nullable=False, default="Mars")  # 'Mars' | 'Moon' | 'Dual'
    location_id = Column(String(64), nullable=True)
    experiment_name = Column(String(255), nullable=True)
    methodology = Column(Text, nullable=True)
    observations = Column(Text, nullable=True)
    findings = Column(Text, nullable=True)
    research_notes = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="DRAFT")  # 'DRAFT' | 'COMPLETED' | 'SUBMITTED'

    # Structured scientific data entry fields
    collaborators = Column(JSON, nullable=True)
    experiment_params = Column(JSON, nullable=True)
    field_observations = Column(JSON, nullable=True)
    environmental_measurements = Column(JSON, nullable=True)
    geological_observations = Column(JSON, nullable=True)
    instrument_readings = Column(JSON, nullable=True)
    attachments = Column(JSON, nullable=True)
    saved_evaluations_json = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    researcher = relationship("ResearcherModel", back_populates="records")
    references = relationship("ResearchReferenceModel", back_populates="record", cascade="all, delete-orphan")
    submissions = relationship("ResearchSubmissionModel", back_populates="record", cascade="all, delete-orphan")


class ResearchReferenceModel(Base):
    """
    Academic DOI and literature references associated with a research record.
    """
    __tablename__ = "research_references"

    id = Column(Integer, primary_key=True, autoincrement=True)
    record_id = Column(String(64), ForeignKey("research_records.id", ondelete="CASCADE"), nullable=False, index=True)
    doi = Column(String(150), nullable=True)
    title = Column(String(255), nullable=False)
    authors = Column(Text, nullable=True)
    journal = Column(String(255), nullable=True)
    year = Column(Integer, nullable=True)
    url = Column(Text, nullable=True)
    citation_status = Column(String(50), default="UNVERIFIED")  # 'VERIFIED_DOI' | 'PREPRINT' | 'UNVERIFIED'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    record = relationship("ResearchRecordModel", back_populates="references")


class ResearchSubmissionModel(Base):
    """
    Peer review contribution submission.
    Workflow: DRAFT -> SUBMITTED -> UNDER_REVIEW -> REVISION_REQUESTED / APPROVED -> PUBLISHED
    Only PUBLISHED records appear in Public Discovery.
    """
    __tablename__ = "research_submissions"

    id = Column(String(64), primary_key=True, index=True)
    record_id = Column(String(64), ForeignKey("research_records.id", ondelete="CASCADE"), nullable=False, index=True)
    researcher_id = Column(String(64), ForeignKey("researchers.id", ondelete="CASCADE"), nullable=False, index=True)
    submission_title = Column(String(255), nullable=False)
    submission_type = Column(String(50), nullable=False, default="RESEARCH_RECORD")  # 'RESEARCH_RECORD' | 'SITE_ASSESSMENT' | 'PEER_EVALUATION'
    status = Column(String(50), nullable=False, default="SUBMITTED")  # 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUESTED' | 'APPROVED' | 'PUBLISHED'
    reviewer_id = Column(String(64), ForeignKey("researchers.id", ondelete="SET NULL"), nullable=True)
    reviewer_name = Column(String(255), nullable=True)
    reviewer_notes = Column(Text, nullable=True)
    revision_requested_reason = Column(Text, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    record = relationship("ResearchRecordModel", back_populates="submissions")
    author = relationship("ResearcherModel", back_populates="submissions", foreign_keys=[researcher_id])
    reviewer = relationship("ResearcherModel", back_populates="assigned_reviews", foreign_keys=[reviewer_id])
    audit_history = relationship("ReviewHistoryModel", back_populates="submission", cascade="all, delete-orphan")


class ReviewHistoryModel(Base):
    """
    Immutable audit trail for submission lifecycle transitions.
    """
    __tablename__ = "review_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    submission_id = Column(String(64), ForeignKey("research_submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    actor_id = Column(String(64), ForeignKey("researchers.id", ondelete="SET NULL"), nullable=True)
    actor_name = Column(String(255), nullable=False)
    from_status = Column(String(50), nullable=True)
    to_status = Column(String(50), nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    submission = relationship("ResearchSubmissionModel", back_populates="audit_history")
