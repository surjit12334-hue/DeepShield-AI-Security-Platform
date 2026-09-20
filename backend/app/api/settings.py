from fastapi import APIRouter, Depends
from app.security.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        "notifications_enabled": True,
        "two_factor_enabled": False,
        "data_retention_days": 90
    }

@router.get("/api-keys")
async def get_api_keys(current_user: User = Depends(get_current_user)):
    return {"api_keys": [], "message": "API key management available in production"}

@router.post("/api-keys/generate")
async def generate_api_key(current_user: User = Depends(get_current_user)):
    import secrets
    key = f"ds_{secrets.token_hex(32)}"
    return {"key": key, "prefix": key[:10], "message": "Store this key securely. It will not be shown again."}
