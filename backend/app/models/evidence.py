import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum as SQLEnum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class EvidenceStatus(str, enum.Enum):
    CREATED = "created"
    UPLOADED = "uploaded"
    ANALYZED = "analyzed"
    REPORT_GENERATED = "report_generated"
    EXPORTED = "exported"

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    evidence_id = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    original_filename = Column(String(500), nullable=False)
    stored_filename = Column(String(500), nullable=False)
    file_hash = Column(String(64), nullable=False)
    file_size = Column(String(50), nullable=False)
    mime_type = Column(String(100))
    
    status = Column(SQLEnum(EvidenceStatus), default=EvidenceStatus.CREATED)
    chain_of_custody = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    uploaded_at = Column(DateTime, nullable=True)
    analyzed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="evidence_files")
    analysis = relationship("Analysis", back_populates="evidence", uselist=False)
