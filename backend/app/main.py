from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import init_db
from app.api import auth, analysis, evidence, reports, threat_intelligence, admin, settings as settings_api
from app.models.user import User
from app.services.user_service import user_service
from app.database import async_session

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    async with async_session() as db:
        demo_user = await user_service.get_by_email(db, settings.DEMO_EMAIL)
        if not demo_user:
            await user_service.create(db, "Demo User", settings.DEMO_EMAIL, settings.DEMO_PASSWORD, role="admin")
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Digital Security Platform",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(analysis.router)
app.include_router(evidence.router)
app.include_router(reports.router)
app.include_router(threat_intelligence.router)
app.include_router(admin.router)
app.include_router(settings_api.router)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "app": settings.APP_NAME, "version": settings.APP_VERSION}

@app.get("/api/demo/info")
async def demo_info():
    return {
        "demo_mode": settings.DEMO_MODE,
        "demo_email": settings.DEMO_EMAIL,
        "message": "Demo credentials: demo@deepshield.local / Demo@12345"
    }
