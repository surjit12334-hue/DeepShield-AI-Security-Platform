import random
from typing import Dict, Any
from app.ai.base_detector import BaseDetector

class VideoDetector(BaseDetector):
    """Demo video deepfake detector."""
    
    def __init__(self):
        super().__init__()
        self.name = "VideoDeepfakeDetector"
        self.version = "1.0.0-demo"
    
    async def analyze(self, file_path: str, file_hash: str) -> Dict[str, Any]:
        ai_probability = self._generate_confidence(0.5, 0.3)
        manipulation_score = self._generate_confidence(0.45, 0.3)
        
        indicators = []
        if ai_probability > 0.55:
            indicators.append({"type": "temporal_inconsistencies", "severity": "high", "description": "Frame-by-frame inconsistencies detected"})
        if manipulation_score > 0.5:
            indicators.append({"type": "lip_sync_anomalies", "severity": "medium", "description": "Potential lip-sync manipulation"})
        if random.random() > 0.4:
            indicators.append({"type": "face_swap_indicators", "severity": "medium", "description": "Face swap indicators found"})
        
        return {
            "detector": self.name,
            "version": self.version,
            "ai_probability": ai_probability,
            "manipulation_score": manipulation_score,
            "risk_level": self._determine_risk_level(max(ai_probability, manipulation_score)),
            "indicators": indicators,
            "confidence": self._generate_confidence(0.65, 0.2),
            "model_info": {
                "name": "Demo Video Detector",
                "type": "mock",
                "note": "This is a demo detector. Replace with real AI model for production use."
            }
        }
