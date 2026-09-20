from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class ReportResponse(BaseModel):
    id: UUID
    report_id: str
    analysis_id: UUID
    title: str
    report_data: Optional[Dict[str, Any]] = None
    generated_at: datetime
    
    class Config:
        from_attributes = True
