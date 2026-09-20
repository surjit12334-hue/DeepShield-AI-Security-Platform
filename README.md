# DeepShield - AI-Powered Digital Security Platform

> **Detect. Verify. Protect.**

DeepShield is a comprehensive AI-powered cybersecurity platform designed to detect potentially manipulated or AI-generated digital content such as images, videos, audio, and text.

![DeepShield](https://img.shields.io/badge/DEEPSHIELD-Cybersecurity-blue) ![Python](https://img.shields.io/badge/Python-3.11+-green) ![React](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-teal) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

---

## Features

- **AI-Powered Content Analysis** - Multi-modal detection across images, video, audio, and text
- **Deepfake Detection** - Identify face swaps, voice cloning, and synthetic media
- **Evidence Integrity** - SHA-256 hashing and chain of custody tracking
- **Explainable Results** - Understand why content was flagged with transparent AI reasoning
- **Secure Reports** - Generate comprehensive security reports with professional formatting
- **Threat Intelligence** - Monitor emerging AI manipulation trends
- **Role-Based Access** - User and admin roles with JWT authentication
- **Demo Mode** - Fully functional demo with simulated analysis results

## Architecture

```
deepshield/
├── frontend/          # React + TypeScript + Tailwind CSS
├── backend/           # Python + FastAPI + SQLAlchemy
├── ml/                # AI detection modules (pluggable)
├── database/          # Migrations
├── storage/           # Uploaded files
├── docker-compose.yml
└── .env.example
```

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS
- React Router v6
- Recharts (charts)
- Lucide React (icons)
- Axios (HTTP client)

### Backend
- Python 3.11+
- FastAPI
- SQLAlchemy (async)
- PostgreSQL (via asyncpg)
- JWT Authentication (python-jose)
- Password hashing (bcrypt via passlib)

### Infrastructure
- Docker & Docker Compose
- Nginx (frontend serving)
- PostgreSQL 16

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 16+ (or use Docker)

### Option 1: Docker (Recommended)

```bash
git clone <repository-url>
cd DeepShield-AI-Security-Platform
cp .env.example .env
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Manual Setup

#### Database

```bash
# Create PostgreSQL database
createdb deepshield
```

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
cp ../.env.example .env
python run.py
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Demo Credentials

| Field | Value |
|-------|-------|
| Email | demo@deepshield.local |
| Password | Demo@12345 |

The demo account has admin privileges and comes with simulated analysis data.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/change-password` | Change password |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze/upload` | Upload file for analysis |
| POST | `/api/analyze/{id}/run` | Run analysis |
| GET | `/api/analyze/{id}` | Get analysis result |
| GET | `/api/analyze/` | List analyses |
| GET | `/api/analyze/stats/overview` | Get stats |

### Evidence
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/evidence/` | List evidence files |
| GET | `/api/evidence/{id}` | Get evidence details |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/` | List reports |
| GET | `/api/reports/{id}` | Get report |

### Threat Intelligence
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/threat-intelligence/` | Get threat intel |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Admin dashboard |
| GET | `/api/admin/users` | List users |

---

## AI Model Integration

DeepShield uses a modular AI detection architecture. Each detector inherits from `BaseDetector` and can be replaced with real models.

### Current Demo Detectors
- `ImageDetector` - Demo image deepfake detection
- `VideoDetector` - Demo video deepfake detection
- `AudioDetector` - Demo audio deepfake detection
- `TextDetector` - Demo AI text detection
- `MetadataAnalyzer` - Rule-based metadata analysis
- `RiskEngine` - Risk assessment from detector results

### Integrating Real Models

1. Create your model class inheriting from `BaseDetector`
2. Implement the `analyze()` method
3. Register in `app/ai/analyzer.py`

```python
from app.ai.base_detector import BaseDetector

class RealImageDetector(BaseDetector):
    def __init__(self):
        super().__init__()
        self.name = "RealImageDetector"
    
    async def analyze(self, file_path: str, file_hash: str) -> dict:
        # Load your model and run inference
        result = your_model.predict(file_path)
        return {
            "ai_probability": result.score,
            "manipulation_score": result.manipulation,
            "risk_level": self._determine_risk_level(result.score),
            "indicators": result.indicators,
            "confidence": result.confidence,
        }
```

---

## Security Considerations

- JWT-based authentication with secure token handling
- bcrypt password hashing (never store plaintext passwords)
- File type validation (MIME type + extension)
- File size limits (100MB default)
- SHA-256 file integrity hashing
- CORS configuration
- Input validation via Pydantic
- Role-based access control (RBAC)
- Rate limiting ready
- SQL injection protection via SQLAlchemy ORM

---

## Important Disclaimers

- Analysis results are **AI-generated estimates**, not definitive determinations
- Always verify results with manual expert review
- Demo mode uses simulated detection results
- Threat intelligence data is generated for demonstration purposes only
- This platform is designed for educational and research purposes

---

## Project Structure

```
deepshield/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # Base UI (Button, Card, Badge, etc.)
│   │   │   ├── layout/      # Sidebar, TopNavbar
│   │   │   └── landing/     # Landing page components
│   │   ├── pages/           # Page components
│   │   ├── layouts/         # Layout wrappers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── api/             # API route handlers
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── ai/              # AI detection modules
│   │   ├── security/        # Auth & security
│   │   └── utils/           # Utilities
│   ├── requirements.txt
│   └── run.py
│
├── ml/                      # ML model code (future)
├── database/                # Migrations
├── storage/                 # File uploads
├── docker-compose.yml
└── README.md
```

---

## Future Improvements

- [ ] Real deepfake detection models (FaceForensics++, etc.)
- [ ] GPU-accelerated inference
- [ ] WebSocket real-time analysis updates
- [ ] PDF report export
- [ ] Email notifications
- [ ] API rate limiting middleware
- [ ] Audit logging dashboard
- [ ] Batch analysis support
- [ ] Webhook integrations
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## License

MIT License

## Support

For issues and questions, please open a GitHub issue.
