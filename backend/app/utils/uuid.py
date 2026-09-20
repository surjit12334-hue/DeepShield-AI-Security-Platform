import uuid as _uuid
from sqlalchemy import String
from sqlalchemy.orm import mapped_column, Mapped

def generate_uuid() -> str:
    return str(_uuid.uuid4())

def UUIDColumn(primary_key: bool = False):
    return mapped_column(String(36), primary_key=primary_key, default=generate_uuid if not primary_key else None)

def UUIDForeignKey(table: str, nullable: bool = True):
    return mapped_column(String(36), nullable=nullable)
