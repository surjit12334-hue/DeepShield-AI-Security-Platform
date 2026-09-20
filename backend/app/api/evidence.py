from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.security.auth import get_current_user
from app.models.user import User
from app.services.evidence_service import evidence_service

router = APIRouter(prefix="/api/evidence", tags=["Evidence"])

@router.get("/")
async def list_evidence(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    evidence = await evidence_service.get_user_evidence(db, current_user.id)
    return {"evidence": evidence, "total": len(evidence)}

@router.get("/{evidence_id}")
async def get_evidence(
    evidence_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    evidence = await evidence_service.get_by_id(db, evidence_id)
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    if str(evidence.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    return evidence
