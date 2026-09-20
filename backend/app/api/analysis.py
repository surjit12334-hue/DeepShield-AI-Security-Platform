import os
import uuid
import hashlib
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.database import get_db
from app.security.auth import get_current_user
from app.models.user import User
from app.services.analysis_service import analysis_service
from app.config import settings

router = APIRouter(prefix="/api/analyze", tags=["Analysis"])

CONTENT_TYPE_MAP = {
    "image/jpeg": "image", "image/png": "image", "image/gif": "image", "image/webp": "image",
    "video/mp4": "video", "video/quicktime": "video", "video/x-msvideo": "video",
    "audio/mpeg": "audio", "audio/wav": "audio", "audio/ogg": "audio",
    "application/pdf": "document", "text/plain": "document"
}

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    content_type = CONTENT_TYPE_MAP.get(file.content_type, "image")
    
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    stored_filename = f"{file_id}{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, stored_filename)
    
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    file_hash = hashlib.sha256(content).hexdigest()
    
    analysis = await analysis_service.create_analysis(
        db=db,
        user_id=current_user.id,
        filename=stored_filename,
        original_filename=file.filename,
        file_size=len(content),
        content_type=content_type,
        mime_type=file.content_type,
        file_hash=file_hash
    )
    
    return {
        "analysis_id": str(analysis.id),
        "filename": stored_filename,
        "original_filename": file.filename,
        "file_size": len(content),
        "content_type": content_type,
        "mime_type": file.content_type,
        "file_hash": file_hash,
        "status": "uploaded"
    }

@router.post("/{analysis_id}/run")
async def run_analysis(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    analysis = await analysis_service.get_by_id(db, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    if str(analysis.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    file_path = os.path.join(settings.UPLOAD_DIR, analysis.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    analysis = await analysis_service.run_analysis(db, analysis, file_path)
    return {"analysis_id": str(analysis.id), "status": analysis.status.value}

@router.get("/{analysis_id}")
async def get_analysis(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    analysis = await analysis_service.get_by_id(db, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    if str(analysis.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    return analysis

@router.get("/")
async def list_analyses(
    page: int = 1,
    per_page: int = 20,
    content_type: Optional[str] = None,
    risk_level: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await analysis_service.get_user_analyses(db, current_user.id, page, per_page, content_type, risk_level)

@router.get("/stats/overview")
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await analysis_service.get_stats(db, current_user.id)
