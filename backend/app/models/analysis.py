import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Enum as SQLEnum, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class AnalysisStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class RiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ContentType(str, enum.Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    DOCUMENT = "document"

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    evidence_id = Column(UUID(as_uuid=True), ForeignKey("evidence.id"), nullable=True)
    
    filename = Column(String(500), nullable=False)
    original_filename = Column(String(500), nullable=False)
    file_size = Column(Float, nullable=False)
    content_type = Column(SQLEnum(ContentType), nullable=False)
    mime_type = Column(String(100))
    file_hash = Column(String(64), nullable=False)
    
    status = Column(SQLEnum(AnalysisStatus), default=AnalysisStatus.PENDING)
    risk_level = Column(SQLEnum(RiskLevel), nullable=True)
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
