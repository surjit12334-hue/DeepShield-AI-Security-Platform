from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class AnalysisCreate(BaseModel):
    filename: str
    file_size: float
    content_type: str
    mime_type: Optional[str] = None
    file_hash: str
    analysis_options: Optional[Dict[str, bool]] = None

class AnalysisResponse(BaseModel):
    id: UUID
    filename: str
    original_filename: str
    file_size: float
    content_type: str
    file_hash: str
    status: str
    risk_level: Optional[str] = None
    confidence_score: Optional[float] = None
    ai_detection_score: Optional[float] = None
    manipulation_score: Optional[float] = None
    metadata_analysis: Optional[Dict] = None
    detection_indicators: Optional[List] = None
    explainability_data: Optional[Dict] = None
    pipeline_results: Optional[Dict] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class AnalysisListResponse(BaseModel):
    analyses: List[AnalysisResponse]
    total: int
    page: int
    per_page: int
