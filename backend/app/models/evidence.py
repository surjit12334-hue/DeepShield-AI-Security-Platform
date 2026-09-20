import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    evidence_id = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    original_filename = Column(String(500), nullable=False)
    stored_filename = Column(String(500), nullable=False)
    file_hash = Column(String(64), nullable=False)
    file_size = Column(String(50), nullable=False)
    mime_type = Column(String(100))
    
    status = Column(String(20), default="created")
    chain_of_custody = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    uploaded_at = Column(DateTime, nullable=True)
    analyzed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="evidence_files")
    analysis = relationship("Analysis", back_populates="evidence", uselist=False)
