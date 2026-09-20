from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.security.auth import get_admin_user
from app.models.user import User
from app.models.analysis import Analysis
from app.models.evidence import Evidence
import random

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/dashboard")
async def admin_dashboard(
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    users_count = await db.execute(select(func.count(User.id)))
    analyses_count = await db.execute(select(func.count(Analysis.id)))
    evidence_count = await db.execute(select(func.count(Evidence.id)))
    
    return {
        "metrics": {
            "total_users": users_count.scalar() or 0,
            "total_analyses": analyses_count.scalar() or 0,
            "files_analyzed": evidence_count.scalar() or 0,
            "threat_detections": random.randint(10, 50),
            "reports_generated": random.randint(5, 25)
        },
        "analysis_volume": [
            {"date": f"2024-01-{i:02d}", "count": random.randint(5, 30)}
            for i in range(1, 15)
        ],
        "risk_distribution": [
            {"level": "low", "count": random.randint(20, 60)},
            {"level": "medium", "count": random.randint(10, 30)},
            {"level": "high", "count": random.randint(5, 15)},
            {"level": "critical", "count": random.randint(1, 5)}
        ],
        "recent_users": []
    }

@router.get("/users")
async def list_users(
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).order_by(User.created_at.desc()).limit(50))
    users = result.scalars().all()
    return {"users": [{"id": str(u.id), "full_name": u.full_name, "email": u.email, "role": u.role, "is_active": u.is_active, "created_at": u.created_at.isoformat() if u.created_at else None} for u in users]}
