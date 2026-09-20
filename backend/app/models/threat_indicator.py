import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, JSON, Text
from app.database import Base

class ThreatIndicator(Base):
    __tablename__ = "threat_indicators"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    indicator_type = Column(String(50), nullable=False)
    value = Column(String(500), nullable=False)
    severity = Column(String(20), nullable=False)
    description = Column(Text)
    source = Column(String(100))
    confidence = Column(Float)
    metadata_ = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
