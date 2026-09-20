from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class EvidenceCreate(BaseModel):
    analysis_id: Optional[UUID] = None

class EvidenceResponse(BaseModel):
    id: UUID
    evidence_id: str
    original_filename: str
    file_hash: str
    file_size: str
    mime_type: Optional[str] = None
    status: str
    chain_of_custody: List[Dict[str, Any]]
    created_at: datetime
    uploaded_at: Optional[datetime] = None
    analyzed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class EvidenceListResponse(BaseModel):
    evidence: List[EvidenceResponse]
    total: int
