import random
from typing import Dict, Any
from app.ai.base_detector import BaseDetector

class AudioDetector(BaseDetector):
    """Demo audio deepfake detector."""
    
    def __init__(self):
        super().__init__()
        self.name = "AudioDeepfakeDetector"
        self.version = "1.0.0-demo"
    
    async def analyze(self, file_path: str, file_hash: str) -> Dict[str, Any]:
        ai_probability = self._generate_confidence(0.4, 0.3)
        manipulation_score = self._generate_confidence(0.35, 0.25)
        
        indicators = []
        if ai_probability > 0.5:
            indicators.append({"type": "spectral_anomalies", "severity": "medium", "description": "Unusual spectral patterns detected"})
        if manipulation_score > 0.4:
            indicators.append({"type": "voice_clone_indicators", "severity": "high", "description": "Potential voice cloning detected"})
        
        return {
            "detector": self.name,
            "version": self.version,
            "ai_probability": ai_probability,
            "manipulation_score": manipulation_score,
            "risk_level": self._determine_risk_level(max(ai_probability, manipulation_score)),
            "indicators": indicators,
            "confidence": self._generate_confidence(0.6, 0.2),
            "model_info": {
                "name": "Demo Audio Detector",
                "type": "mock",
                "note": "This is a demo detector. Replace with real AI model for production use."
            }
        }
