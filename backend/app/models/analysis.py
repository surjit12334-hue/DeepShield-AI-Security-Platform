import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    evidence_id = Column(String(36), ForeignKey("evidence.id"), nullable=True)
    
    filename = Column(String(500), nullable=False)
    original_filename = Column(String(500), nullable=False)
    file_size = Column(Float, nullable=False)
    content_type = Column(String(20), nullable=False)
    mime_type = Column(String(100))
    file_hash = Column(String(64), nullable=False)
    
    status = Column(String(20), default="pending")
    risk_level = Column(String(20), nullable=True)
    confidence_score = Column(Float, nullable=True)
    
    ai_detection_score = Column(Float, nullable=True)
    manipulation_score = Column(Float, nullable=True)
    metadata_analysis = Column(JSON, nullable=True)
    detection_indicators = Column(JSON, nullable=True)
    explainability_data = Column(JSON, nullable=True)
    
    analysis_options = Column(JSON, nullable=True)
    pipeline_results = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="analyses")
    evidence = relationship("Evidence", back_populates="analysis")
    detections = relationship("Detection", back_populates="analysis")
