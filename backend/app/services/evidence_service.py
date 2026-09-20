import uuid
from typing import Optional, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.evidence import Evidence, EvidenceStatus

class EvidenceService:
    @staticmethod
    async def create(db: AsyncSession, user_id, **kwargs) -> Evidence:
        evidence = Evidence(
            evidence_id=f"EV-{uuid.uuid4().hex[:12].upper()}",
            user_id=user_id,
            status=EvidenceStatus.CREATED,
            chain_of_custody=[{"action": "created", "timestamp": datetime.utcnow().isoformat()}],
            **kwargs
        )
        db.add(evidence)
        await db.commit()
        await db.refresh(evidence)
        return evidence
    
    @staticmethod
    async def get_by_id(db: AsyncSession, evidence_id) -> Optional[Evidence]:
        result = await db.execute(select(Evidence).where(Evidence.id == evidence_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_evidence_id(db: AsyncSession, evidence_id_str: str) -> Optional[Evidence]:
        result = await db.execute(select(Evidence).where(Evidence.evidence_id == evidence_id_str))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_evidence(db: AsyncSession, user_id) -> List[Evidence]:
        result = await db.execute(
            select(Evidence).where(Evidence.user_id == user_id).order_by(Evidence.created_at.desc())
        )
        return result.scalars().all()
    
    @staticmethod
    async def update_status(db: AsyncSession, evidence: Evidence, status: str) -> Evidence:
        evidence.status = status
        evidence.chain_of_custody.append({
            "action": status,
            "timestamp": datetime.utcnow().isoformat()
        })
        await db.commit()
        await db.refresh(evidence)
        return evidence

evidence_service = EvidenceService()
