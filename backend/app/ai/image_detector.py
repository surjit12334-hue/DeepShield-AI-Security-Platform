import random
from typing import Dict, Any
from app.ai.base_detector import BaseDetector

class ImageDetector(BaseDetector):
    """Demo image deepfake detector. Replace with real model in production."""
    
    def __init__(self):
        super().__init__()
        self.name = "ImageDeepfakeDetector"
        self.version = "1.0.0-demo"
    
    async def analyze(self, file_path: str, file_hash: str) -> Dict[str, Any]:
        ai_probability = self._generate_confidence(0.45, 0.35)
        manipulation_score = self._generate_confidence(0.4, 0.3)
        
        indicators = []
        if ai_probability > 0.6:
            indicators.append({"type": "facial_inconsistencies", "severity": "high", "description": "Potential facial manipulation detected"})
        if manipulation_score > 0.5:
            indicators.append({"type": "synthetic_texture", "severity": "medium", "description": "Synthetic texture patterns found"})
        if random.random() > 0.5:
            indicators.append({"type": "compression_anomalies", "severity": "low", "description": "Unusual compression patterns detected"})
        if random.random() > 0.7:
            indicators.append({"type": "metadata_consistency", "severity": "info", "description": "Metadata appears consistent"})
        
        return {
            "detector": self.name,
            "version": self.version,
            "ai_probability": ai_probability,
            "manipulation_score": manipulation_score,
            "risk_level": self._determine_risk_level(max(ai_probability, manipulation_score)),
            "indicators": indicators,
            "confidence": self._generate_confidence(0.7, 0.2),
            "model_info": {
                "name": "Demo Image Detector",
                "type": "mock",
                "note": "This is a demo detector. Replace with real AI model for production use."
            }
        }
