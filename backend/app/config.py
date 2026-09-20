from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "DeepShield"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    DATABASE_URL: str = "sqlite+aiosqlite:///./deepshield.db"
    SECRET_KEY: str = "deepshield-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    UPLOAD_DIR: str = "storage/uploads"
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    
    DEMO_MODE: bool = True
    DEMO_EMAIL: str = "demo@deepshield.local"
    DEMO_PASSWORD: str = "Demo@12345"
    
    class Config:
        env_file = ".env"

settings = Settings()
