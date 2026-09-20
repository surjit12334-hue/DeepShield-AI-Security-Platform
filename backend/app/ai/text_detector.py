import random
from typing import Dict, Any
from app.ai.base_detector import BaseDetector

class TextDetector(BaseDetector):
    """Demo AI-generated text detector."""
    
    def __init__(self):
        super().__init__()
        self.name = "TextAIGeneratorDetector"
        self.version = "1.0.0-demo"
    
    async def analyze(self, file_path: str, file_hash: str) -> Dict[str, Any]:
        ai_probability = self._generate_confidence(0.5, 0.35)
        
        indicators = []
        if ai_probability > 0.6:
            indicators.append({"type": "perplexity_anomalies", "severity": "medium", "description": "Text perplexity patterns suggest AI generation"})
        if random.random() > 0.5:
            indicators.append({"type": "burstiness", "severity": "low", "description": "Uniform text burstiness detected"})
        
        return {
            "detector": self.name,
            "version": self.version,
            "ai_probability": ai_probability,
            "manipulation_score": ai_probability,
            "risk_level": self._determine_risk_level(ai_probability),
            "indicators": indicators,
            "confidence": self._generate_confidence(0.55, 0.25),
            "model_info": {
                "name": "Demo Text Detector",
                "type": "mock",
                "note": "This is a demo detector. Replace with real AI model for production use."
            }
        }
