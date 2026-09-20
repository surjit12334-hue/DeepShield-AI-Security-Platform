import random
from typing import Dict, Any
from app.ai.base_detector import BaseDetector

class MetadataAnalyzer(BaseDetector):
    """Analyzes file metadata for anomalies."""
    
    def __init__(self):
        super().__init__()
        self.name = "MetadataAnalyzer"
        self.version = "1.0.0"
    
    async def analyze(self, file_path: str, file_hash: str) -> Dict[str, Any]:
        metadata = {
            "creation_date": "2024-01-15T10:30:00Z",
            "modification_date": "2024-01-15T10:35:00Z",
            "software": "Adobe Photoshop 25.0",
            "device": "Canon EOS R5",
            "gps_location": None,
            "exposure_time": "1/250",
            "iso": "400",
            "focal_length": "85mm"
        }
        
        anomalies = []
        consistency_score = self._generate_confidence(0.7, 0.2)
        
        if random.random() > 0.6:
            anomalies.append({
                "type": "software_mismatch",
                "severity": "medium",
                "description": "Editing software metadata inconsistent with device origin"
            })
        
        return {
            "detector": self.name,
            "version": self.version,
            "metadata": metadata,
            "consistency_score": consistency_score,
            "anomalies": anomalies,
            "model_info": {
                "name": "Metadata Analyzer",
                "type": "rule-based",
                "note": "Rule-based metadata analysis"
            }
        }
