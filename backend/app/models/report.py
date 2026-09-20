import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from app.database import Base

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    report_id = Column(String(50), unique=True, nullable=False, index=True)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    report_data = Column(JSON, nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)
