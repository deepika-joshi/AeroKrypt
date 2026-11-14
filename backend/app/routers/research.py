"""
AEROKRYPT - Private Research Workspace & Peer Review Pipeline Router
Implements strictly isolated private researcher workspace CRUD, ownership enforcement,
and multi-stage submission & review workflows.
"""

import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.research_models import (
    ResearcherModel,
    ResearchRecordModel,
    ResearchReferenceModel,
    ResearchSubmissionModel,
    ReviewHistoryModel
)
from app.schemas.research_schemas import (
    ResearchRecordCreate,
    ResearchRecordUpdate,
    ResearchRecordResponse,
    SubmissionCreate,
    SubmissionReviewAction,
    SubmissionResponse,
    PublicContributionResponse,
    ReferenceResponse
)
from app.services.auth_service import (
    get_current_researcher,
    require_roles,
    get_optional_researcher
)

router = APIRouter(prefix="/research", tags=["Research Workspace & Peer Review"])


# ============================================================================
# PRIVATE RESEARCH WORKSPACE (STRICT RESEARCHER OWNERSHIP)
# ============================================================================

@router.get("/records", response_model=List[ResearchRecordResponse])
def list_my_research_records(
    status_filter: Optional[str] = Query(None, alias="status"),
    target_body: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    """
    Returns private research workspace records for the authenticated researcher.
    STRICT PRIVACY: Enforces researcher_id filter so researchers can ONLY see their own records.
    """
    query = db.query(ResearchRecordModel).filter(
        ResearchRecordModel.researcher_id == current_researcher.id
    )

    if status_filter:
        query = query.filter(ResearchRecordModel.status == status_filter.upper())
    if target_body:
        query = query.filter(ResearchRecordModel.target_body == target_body)
    if category:
        query = query.filter(ResearchRecordModel.category == category)
    if search:
        s = f"%{search}%"
        query = query.filter(
            or_(
                ResearchRecordModel.title.ilike(s),
                ResearchRecordModel.abstract.ilike(s),
                ResearchRecordModel.objective.ilike(s),
                ResearchRecordModel.findings.ilike(s)
            )
        )

    records = query.order_by(ResearchRecordModel.created_at.desc()).all()
    return records


@router.post("/records", response_model=ResearchRecordResponse, status_code=status.HTTP_201_CREATED)
def create_research_record(
    req: ResearchRecordCreate,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    """
    Creates a new private research record in the researcher's workspace.
    """
    rec_id = f"rec-{uuid.uuid4().hex[:12]}"
    record = ResearchRecordModel(
        id=rec_id,
        researcher_id=current_researcher.id,
        title=req.title.strip(),
        abstract=req.abstract,
        objective=req.objective,
        category=req.category,
        target_body=req.target_body,
        location_id=req.location_id,
        experiment_name=req.experiment_name,
        methodology=req.methodology,
        observations=req.observations,
        findings=req.findings,
        research_notes=req.research_notes,
        status=req.status or "DRAFT",
        collaborators=req.collaborators,
        experiment_params=req.experiment_params,
        field_observations=req.field_observations,
        environmental_measurements=req.environmental_measurements,
        geological_observations=req.geological_observations,
        instrument_readings=req.instrument_readings,
        attachments=req.attachments,
        saved_evaluations_json=req.saved_evaluations_json
    )
    db.add(record)
    db.flush()

    # Add references if provided
    if req.references:
        for ref_in in req.references:
            ref = ResearchReferenceModel(
                record_id=record.id,
                doi=ref_in.doi,
                title=ref_in.title,
                authors=ref_in.authors,
                journal=ref_in.journal,
                year=ref_in.year,
                url=ref_in.url,
                citation_status=ref_in.citation_status or "UNVERIFIED"
            )
            db.add(ref)

    db.commit()
    db.refresh(record)
    return record


@router.get("/records/{record_id}", response_model=ResearchRecordResponse)
def get_research_record(
    record_id: str,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    """
    Retrieves a single research record.
    STRICT PRIVACY: Enforces that the requesting researcher owns the record.
    """
    record = db.query(ResearchRecordModel).filter(
        ResearchRecordModel.id == record_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Research record '{record_id}' not found."
        )

    # Strict ownership check: only owner (or reviewer/admin if submitted) can access
    if record.researcher_id != current_researcher.id and current_researcher.role not in ["REVIEWER", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: you do not own this research record."
        )

    return record


@router.put("/records/{record_id}", response_model=ResearchRecordResponse)
def update_research_record(
    record_id: str,
    req: ResearchRecordUpdate,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    """
    Updates a private research record.
    STRICT PRIVACY: Only the record owner can modify their record.
    """
    record = db.query(ResearchRecordModel).filter(
        ResearchRecordModel.id == record_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Research record '{record_id}' not found."
        )

    # Strict ownership check
    if record.researcher_id != current_researcher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: you do not have permission to modify another researcher's record."
        )

    # Update fields
    for field, val in req.model_dump(exclude_unset=True).items():
        if field != "references":
            setattr(record, field, val)

    # Handle references update if specified
    if req.references is not None:
        db.query(ResearchReferenceModel).filter(
            ResearchReferenceModel.record_id == record.id
        ).delete()
        for ref_in in req.references:
            ref = ResearchReferenceModel(
                record_id=record.id,
                doi=ref_in.doi,
                title=ref_in.title,
                authors=ref_in.authors,
                journal=ref_in.journal,
                year=ref_in.year,
                url=ref_in.url,
                citation_status=ref_in.citation_status or "UNVERIFIED"
            )
            db.add(ref)

    record.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/records/{record_id}")
def delete_research_record(
    record_id: str,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    """
    Permanently deletes a private research record.
    STRICT PRIVACY: Only the record owner can delete their record.
    """
    record = db.query(ResearchRecordModel).filter(
        ResearchRecordModel.id == record_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Research record '{record_id}' not found."
        )

    if record.researcher_id != current_researcher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: you cannot delete another researcher's record."
        )

    db.delete(record)
    db.commit()
    return {"message": f"Research record '{record_id}' successfully deleted."}


# ============================================================================
# RESEARCH PROJECT ALIAS ROUTES
# ============================================================================

@router.get("/projects", response_model=List[ResearchRecordResponse])
def list_my_projects(
    status_filter: Optional[str] = Query(None, alias="status"),
    target_body: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    return list_my_research_records(status_filter, target_body, category, search, current_researcher, db)


@router.post("/projects", response_model=ResearchRecordResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    req: ResearchRecordCreate,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    return create_research_record(req, current_researcher, db)


@router.get("/projects/{project_id}", response_model=ResearchRecordResponse)
def get_project(
    project_id: str,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    return get_research_record(project_id, current_researcher, db)


@router.put("/projects/{project_id}", response_model=ResearchRecordResponse)
def update_project(
    project_id: str,
    req: ResearchRecordUpdate,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    return update_research_record(project_id, req, current_researcher, db)


@router.delete("/projects/{project_id}")
def delete_project(
    project_id: str,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    return delete_research_record(project_id, current_researcher, db)


@router.get("/records/{record_id}/audit-trail", response_model=List[dict])
def get_record_audit_trail(
    record_id: str,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    record = db.query(ResearchRecordModel).filter(ResearchRecordModel.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found.")
    if record.researcher_id != current_researcher.id and current_researcher.role not in ["REVIEWER", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Access forbidden.")

    submissions = db.query(ResearchSubmissionModel).filter(ResearchSubmissionModel.record_id == record.id).all()
    sub_ids = [s.id for s in submissions]
    if not sub_ids:
        return []

    history = db.query(ReviewHistoryModel).filter(ReviewHistoryModel.submission_id.in_(sub_ids)).order_by(ReviewHistoryModel.created_at.asc()).all()
    return [
        {
            "id": h.id,
            "submission_id": h.submission_id,
            "actor_id": h.actor_id,
            "actor_name": h.actor_name,
            "from_status": h.from_status,
            "to_status": h.to_status,
            "comment": h.comment,
            "created_at": h.created_at.isoformat() if h.created_at else None
        }
        for h in history
    ]


# ============================================================================
# SUBMISSION & PEER REVIEW PIPELINE
# ============================================================================

@router.post("/records/{record_id}/submit", response_model=SubmissionResponse)
def submit_record_for_review(
    record_id: str,
    current_researcher: ResearcherModel = Depends(get_current_researcher),
    db: Session = Depends(get_db)
):
    """
    Submits a private research record into the AEROKRYPT peer review pipeline.
    Transitions status to SUBMITTED and creates an audit history entry.
    """
    record = db.query(ResearchRecordModel).filter(
        ResearchRecordModel.id == record_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Research record '{record_id}' not found."
        )

    if record.researcher_id != current_researcher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: only the author can submit this record for review."
        )

    # Update record status
    record.status = "SUBMITTED"

    # Check if submission already exists
    submission = db.query(ResearchSubmissionModel).filter(
        ResearchSubmissionModel.record_id == record.id
    ).first()

    if not submission:
        sub_id = f"sub-{uuid.uuid4().hex[:12]}"
        submission = ResearchSubmissionModel(
            id=sub_id,
            record_id=record.id,
            researcher_id=current_researcher.id,
            submission_title=record.title,
            submission_type="RESEARCH_RECORD",
            status="SUBMITTED"
        )
        db.add(submission)
        db.flush()
    else:
        submission.status = "SUBMITTED"

    # Add audit history record
    hist = ReviewHistoryModel(
        submission_id=submission.id,
        actor_id=current_researcher.id,
        actor_name=current_researcher.full_name,
        from_status="DRAFT",
        to_status="SUBMITTED",
        comment="Submitted to the AEROKRYPT Peer Review Committee."
    )
    db.add(hist)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/submissions/queue", response_model=List[SubmissionResponse])
def get_review_queue(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_reviewer: ResearcherModel = Depends(require_roles(["REVIEWER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    """
    Returns peer review queue. Accessible only to verified REVIEWER or ADMIN roles.
    """
    query = db.query(ResearchSubmissionModel)
    if status_filter:
        query = query.filter(ResearchSubmissionModel.status == status_filter.upper())
    else:
        query = query.filter(
            ResearchSubmissionModel.status.in_(["SUBMITTED", "UNDER_REVIEW", "REVISION_REQUESTED", "APPROVED"])
        )

    submissions = query.order_by(ResearchSubmissionModel.created_at.desc()).all()
    return submissions


@router.post("/submissions/{submission_id}/review", response_model=SubmissionResponse)
def perform_submission_review(
    submission_id: str,
    action: SubmissionReviewAction,
    current_reviewer: ResearcherModel = Depends(require_roles(["REVIEWER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    """
    Advances or updates review status: UNDER_REVIEW, REVISION_REQUESTED, APPROVED, or PUBLISHED.
    """
    submission = db.query(ResearchSubmissionModel).filter(
        ResearchSubmissionModel.id == submission_id
    ).first()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Submission '{submission_id}' not found."
        )

    allowed_target_statuses = ["UNDER_REVIEW", "REVISION_REQUESTED", "APPROVED", "PUBLISHED"]
    target_status = action.status.upper()
    if target_status not in allowed_target_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid target status. Must be one of: {', '.join(allowed_target_statuses)}"
        )

    previous_status = submission.status
    submission.status = target_status
    submission.reviewer_id = current_reviewer.id
    submission.reviewer_name = current_reviewer.full_name
    submission.reviewer_notes = action.reviewer_comments or submission.reviewer_notes
    submission.reviewed_at = datetime.now(timezone.utc)

    if target_status == "REVISION_REQUESTED":
        submission.revision_requested_reason = action.revision_requested_reason or action.reviewer_comments

    if target_status == "PUBLISHED":
        submission.published_at = datetime.now(timezone.utc)

    # Add audit log
    hist = ReviewHistoryModel(
        submission_id=submission.id,
        actor_id=current_reviewer.id,
        actor_name=current_reviewer.full_name,
        from_status=previous_status,
        to_status=target_status,
        comment=action.reviewer_comments or f"Status updated from {previous_status} to {target_status}"
    )
    db.add(hist)
    db.commit()
    db.refresh(submission)
    return submission


@router.post("/submissions/{submission_id}/publish", response_model=SubmissionResponse)
def publish_submission(
    submission_id: str,
    current_reviewer: ResearcherModel = Depends(require_roles(["REVIEWER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    """
    Publishes an approved submission to the Public Discovery archive.
    """
    submission = db.query(ResearchSubmissionModel).filter(
        ResearchSubmissionModel.id == submission_id
    ).first()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Submission '{submission_id}' not found."
        )

    previous_status = submission.status
    submission.status = "PUBLISHED"
    submission.published_at = datetime.now(timezone.utc)

    hist = ReviewHistoryModel(
        submission_id=submission.id,
        actor_id=current_reviewer.id,
        actor_name=current_reviewer.full_name,
        from_status=previous_status,
        to_status="PUBLISHED",
        comment="Published to Public Discovery open archive."
    )
    db.add(hist)
    db.commit()
    db.refresh(submission)
    return submission


# ============================================================================
# PUBLIC DISCOVERY (ISOLATED OPEN ARCHIVE)
# ============================================================================

@router.get("/public/published", response_model=List[PublicContributionResponse])
def get_public_published_contributions(
    target_body: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Public open-access endpoint. Returns ONLY approved & published research contributions.
    NEVER leaks draft or unapproved private records.
    """
    if db is None:
        return []

    query = db.query(ResearchSubmissionModel).join(
        ResearchRecordModel, ResearchSubmissionModel.record_id == ResearchRecordModel.id
    ).join(
        ResearcherModel, ResearchSubmissionModel.researcher_id == ResearcherModel.id
    ).filter(
        ResearchSubmissionModel.status == "PUBLISHED"
    )

    if target_body:
        query = query.filter(ResearchRecordModel.target_body == target_body)
    if category:
        query = query.filter(ResearchRecordModel.category == category)
    if search:
        s = f"%{search}%"
        query = query.filter(
            or_(
                ResearchSubmissionModel.submission_title.ilike(s),
                ResearchRecordModel.abstract.ilike(s),
                ResearchRecordModel.findings.ilike(s)
            )
        )

    submissions = query.order_by(ResearchSubmissionModel.published_at.desc()).all()

    results = []
    for sub in submissions:
        rec = sub.record
        author = sub.author
        results.append(
            PublicContributionResponse(
                id=sub.id,
                submission_title=sub.submission_title,
                submission_type=sub.submission_type,
                target_body=rec.target_body if rec else "Mars",
                category=rec.category if rec else "ANALOGUE_GEOLOGY",
                author_name=author.full_name if author else "Unknown Author",
                author_institution=author.institution if author else "AEROKRYPT",
                location_id=rec.location_id if rec else None,
                abstract=rec.abstract if rec else None,
                findings=rec.findings if rec else None,
                published_at=sub.published_at,
                references=[
                    ReferenceResponse(
                        id=r.id,
                        record_id=r.record_id,
                        doi=r.doi,
                        title=r.title,
                        authors=r.authors,
                        journal=r.journal,
                        year=r.year,
                        url=r.url,
                        citation_status=r.citation_status,
                        created_at=r.created_at
                    )
                    for r in (rec.references if rec else [])
                ]
            )
        )
    return results
