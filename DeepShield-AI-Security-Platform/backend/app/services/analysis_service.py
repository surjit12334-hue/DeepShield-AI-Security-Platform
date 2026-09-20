import os
import uuid
import hashlib
from typing import Optional, List, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.analysis import Analysis
from app.models.evidence import Evidence
from app.ai.analyzer import analyzer
from app.config import settings

class AnalysisService:
    @staticmethod
    async def create_analysis(
        db: AsyncSession,
        user_id,
        filename: str,
        original_filename: str,
        file_size: float,
        content_type: str,
        mime_type: Optional[str],
        file_hash: str,
        options: Optional[Dict[str, bool]] = None
    ) -> Analysis:
        analysis = Analysis(
            user_id=user_id,
            filename=filename,
            original_filename=original_filename,
            file_size=file_size,
            content_type=content_type,
            mime_type=mime_type,
            file_hash=file_hash,
            status="pending",
            analysis_options=options
        )
        db.add(analysis)
        await db.commit()
        await db.refresh(analysis)
        return analysis
    
    @staticmethod
    async def run_analysis(db: AsyncSession, analysis: Analysis, file_path: str) -> Analysis:
        analysis.status = "processing"
        await db.commit()
        
        try:
            results = await analyzer.analyze_content(
                file_path=file_path,
                content_type=analysis.content_type,
                options=analysis.analysis_options
            )
            
            risk = results.get("risk_assessment", {})
            detector = results.get("detector_results", [{}])[0] if results.get("detector_results") else {}
            
            analysis.status = "completed"
            analysis.risk_level = risk.get("risk_level", "low")
            analysis.confidence_score = risk.get("confidence", 0)
            analysis.ai_detection_score = detector.get("ai_probability", 0)
            analysis.manipulation_score = detector.get("manipulation_score", 0)
            analysis.metadata_analysis = results.get("metadata_analysis", {})
            analysis.detection_indicators = detector.get("indicators", [])
            analysis.explainability_data = risk.get("explainability", {})
            analysis.pipeline_results = results.get("pipeline_results", {})
            analysis.completed_at = datetime.utcnow()
            
            evidence = Evidence(
                evidence_id=f"EV-{uuid.uuid4().hex[:12].upper()}",
                user_id=analysis.user_id,
                original_filename=analysis.original_filename,
                stored_filename=analysis.filename,
                file_hash=analysis.file_hash,
                file_size=str(analysis.file_size),
                mime_type=analysis.mime_type,
                status="analyzed",
                chain_of_custody=[
                    {"action": "created", "timestamp": datetime.utcnow().isoformat()},
                    {"action": "uploaded", "timestamp": datetime.utcnow().isoformat()},
                    {"action": "analyzed", "timestamp": datetime.utcnow().isoformat()}
                ],
                uploaded_at=datetime.utcnow(),
                analyzed_at=datetime.utcnow()
            )
            db.add(evidence)
            await db.flush()
            analysis.evidence_id = evidence.id
            
        except Exception as e:
            analysis.status = "failed"
            analysis.pipeline_results = {"error": str(e)}
        
        await db.commit()
        await db.refresh(analysis)
        return analysis
    
    @staticmethod
    async def get_by_id(db: AsyncSession, analysis_id) -> Optional[Analysis]:
        result = await db.execute(select(Analysis).where(Analysis.id == analysis_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_analyses(
        db: AsyncSession, user_id, page: int = 1, per_page: int = 20,
        content_type: Optional[str] = None, risk_level: Optional[str] = None
    ) -> Dict[str, Any]:
        query = select(Analysis).where(Analysis.user_id == user_id)
        count_query = select(func.count(Analysis.id)).where(Analysis.user_id == user_id)
        
        if content_type:
            query = query.where(Analysis.content_type == content_type)
            count_query = count_query.where(Analysis.content_type == content_type)
        if risk_level:
            query = query.where(Analysis.risk_level == risk_level)
            count_query = count_query.where(Analysis.risk_level == risk_level)
        
        total_result = await db.execute(count_query)
        total = total_result.scalar()
        
        query = query.order_by(Analysis.created_at.desc())
        query = query.offset((page - 1) * per_page).limit(per_page)
        
        result = await db.execute(query)
        analyses = result.scalars().all()
        
        return {"analyses": analyses, "total": total, "page": page, "per_page": per_page}
    
    @staticmethod
    async def get_stats(db: AsyncSession, user_id) -> Dict[str, Any]:
        total = await db.execute(select(func.count(Analysis.id)).where(Analysis.user_id == user_id))
        threats = await db.execute(select(func.count(Analysis.id)).where(
            Analysis.user_id == user_id,
            Analysis.risk_level.in_(["high", "critical"])
        ))
        evidence_count = await db.execute(select(func.count(Evidence.id)).where(Evidence.user_id == user_id))
        
        return {
            "total_analyses": total.scalar() or 0,
            "threats_detected": threats.scalar() or 0,
            "evidence_files": evidence_count.scalar() or 0,
            "reports_generated": 0
        }

analysis_service = AnalysisService()
