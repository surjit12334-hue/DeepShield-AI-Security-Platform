# DeepShield - AI-Powered Digital Security Platform

> **Detect. Verify. Protect.**

DeepShield is a comprehensive AI-powered cybersecurity platform designed to detect potentially manipulated or AI-generated digital content such as images, videos, audio, and text.

![DeepShield](https://img.shields.io/badge/DEEPSHIELD-Cybersecurity-blue) ![Python](https://img.shields.io/badge/Python-3.13+-green) ![React](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-teal) ![SQLite](https://img.shields.io/badge/SQLite-demo-orange)

---

## Quick Deploy (GitHub)

### 1. Clone
```bash
git clone https://github.com/surjit12334-hue/DeepShield-AI-Security-Platform.git
cd DeepShield-AI-Security-Platform
```

### 2. Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```
Backend runs at **http://localhost:8000**

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at **http://localhost:3000**

### 4. Demo Login
| Field | Value |
|-------|-------|
| Email | `demo@deepshield.local` |
| Password | `Demo@12345` |

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

---

## Architecture

```
DeepShield-AI-Security-Platform/
├── backend/
│   ├── app/
│   │   ├── ai/          # AI detection modules (pluggable)
│   │   ├── api/         # REST API routes
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── security/    # JWT auth, password hashing
│   │   └── services/    # Business logic
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # 12 page components
│   │   ├── hooks/       # Auth & toast hooks
│   │   └── services/    # API client
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons |
| Backend | Python 3.13+, FastAPI, SQLAlchemy (async), Pydantic v2 |
| Database | SQLite (demo) / PostgreSQL (production) |
| Auth | JWT (python-jose), bcrypt password hashing |
| AI | Modular detector architecture (pluggable) |
| Infra | Docker Compose, Nginx |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/analyze/upload` | Upload file for analysis |
| POST | `/api/analyze/{id}/run` | Run analysis |
| GET | `/api/analyze/{id}` | Get analysis result |
| GET | `/api/analyze/` | List analyses |
| GET | `/api/evidence/` | List evidence files |
| GET | `/api/reports/` | List reports |
| GET | `/api/threat-intelligence/` | Threat intelligence |
| GET | `/api/admin/dashboard` | Admin dashboard |

---

## AI Detection Modules

| Module | Type | Purpose |
|--------|------|---------|
| ImageDetector | Demo | Image deepfake detection |
| VideoDetector | Demo | Video deepfake detection |
| AudioDetector | Demo | Audio deepfake detection |
| TextDetector | Demo | AI-generated text detection |
| MetadataAnalyzer | Rule-based | File metadata analysis |
| RiskEngine | Aggregator | Risk assessment scoring |

All detectors inherit from `BaseDetector`. Replace with real models for production.

---

## Docker Deployment

```bash
docker-compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## Important Disclaimers

- Analysis results are **AI-generated estimates**, not definitive determinations
- Always verify results with manual expert review
- Demo mode uses simulated detection results
- Threat intelligence data is generated for demonstration purposes only

---

## License

MIT License
