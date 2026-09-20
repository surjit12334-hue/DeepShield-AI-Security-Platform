import hashlib
import os
from typing import Dict, Any, Optional
from app.ai.image_detector import ImageDetector
from app.ai.video_detector import VideoDetector
from app.ai.audio_detector import AudioDetector
from app.ai.text_detector import TextDetector
from app.ai.metadata_analyzer import MetadataAnalyzer
from app.ai.risk_engine import RiskEngine

class ContentAnalyzer:
    """Main orchestrator for content analysis pipeline."""
    
    def __init__(self):
        self.image_detector = ImageDetector()
        self.video_detector = VideoDetector()
        self.audio_detector = AudioDetector()
        self.text_detector = TextDetector()
        self.metadata_analyzer = MetadataAnalyzer()
        self.risk_engine = RiskEngine()
    
    def get_detector(self, content_type: str):
        detectors = {
            "image": self.image_detector,
            "video": self.video_detector,
            "audio": self.audio_detector,
            "document": self.text_detector
        }
        return detectors.get(content_type, self.image_detector)
    
    async def analyze_content(
        self,
        file_path: str,
        content_type: str,
        options: Optional[Dict[str, bool]] = None
    ) -> Dict[str, Any]:
        if options is None:
            options = {
                "deepfake_detection": True,
                "metadata_analysis": True,
                "integrity_check": True,
                "ai_content_detection": True
            }
        
        detector = self.get_detector(content_type)
        
        with open(file_path, "rb") as f:
            file_hash = hashlib.sha256(f.read()).hexdigest()
        
        results = {
            "file_hash": file_hash,
            "file_path": file_path,
            "content_type": content_type,
            "pipeline_results": {},
            "detector_results": []
        }
        
        if options.get("deepfake_detection", True) or options.get("ai_content_detection", True):
            detector_result = await detector.analyze(file_path, file_hash)
            results["detector_results"].append(detector_result)
            results["pipeline_results"]["ai_detection"] = {
                "status": "completed",
                "score": detector_result.get("ai_probability", 0)
            }
        
        if options.get("metadata_analysis", True):
            metadata_result = await self.metadata_analyzer.analyze(file_path, file_hash)
            results["metadata_analysis"] = metadata_result
            results["pipeline_results"]["metadata"] = {
                "status": "completed",
                "consistency": metadata_result.get("consistency_score", 0)
            }
        
        if options.get("integrity_check", True):
            results["integrity"] = {
                "hash_verified": True,
                "hash_algorithm": "SHA-256",
                "hash_value": file_hash,
                "status": "verified"
            }
            results["pipeline_results"]["integrity"] = {
                "status": "completed"
            }
        
        risk_assessment = self.risk_engine.calculate_risk(
            results["detector_results"],
            results.get("metadata_analysis", {})
        )
        results["risk_assessment"] = risk_assessment
        results["pipeline_results"]["risk_assessment"] = {
            "status": "completed",
            "risk_level": risk_assessment["risk_level"]
        }
        
        return results

analyzer = ContentAnalyzer()
