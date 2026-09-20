import random
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from app.security.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/threat-intelligence", tags=["Threat Intelligence"])

@router.get("/")
async def get_threat_intelligence(current_user: User = Depends(get_current_user)):
    threat_level = random.choice(["low", "medium", "elevated", "high"])
    
    return {
        "threat_level": threat_level,
        "last_updated": datetime.utcnow().isoformat(),
        "active_indicators": random.randint(150, 500),
        "recent_threats": random.randint(20, 100),
        "detection_trends": [
            {"month": "Jan", "count": random.randint(50, 200)},
            {"month": "Feb", "count": random.randint(50, 200)},
            {"month": "Mar", "count": random.randint(50, 200)},
            {"month": "Apr", "count": random.randint(50, 200)},
            {"month": "May", "count": random.randint(50, 200)},
            {"month": "Jun", "count": random.randint(50, 200)}
        ],
        "recent_indicators": [
            {
                "id": f"IND-{i}",
                "type": random.choice(["hash", "domain", "ip", "url"]),
                "value": f"demo-{random.randint(1000,9999)}" if random.random() > 0.5 else f"0x{random.randint(100000,999999):x}",
                "severity": random.choice(["low", "medium", "high", "critical"]),
                "description": f"Demo threat indicator #{i}",
                "source": "DeepShield Demo Intelligence",
                "confidence": round(random.uniform(0.5, 0.95), 2),
                "created_at": (datetime.utcnow() - timedelta(days=random.randint(0, 30))).isoformat()
            }
            for i in range(1, 11)
        ],
        "ai_threat_trends": [
            {"type": "Deepfake Video", "trend": "increasing", "change": f"+{random.randint(5,25)}%"},
            {"type": "Voice Cloning", "trend": "stable", "change": f"{random.choice(['+', '-'])}{random.randint(1,10)}%"},
            {"type": "AI Text Generation", "trend": "increasing", "change": f"+{random.randint(10,40)}%"},
            {"type": "Synthetic Images", "trend": "decreasing", "change": f"-{random.randint(1,15)}%"}
        ],
        "demo_mode": True,
        "disclaimer": "This is demo threat intelligence data for demonstration purposes only. Not real-world threat data."
    }
