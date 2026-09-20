from typing import Dict, Any, List

class RiskEngine:
    """Calculates overall risk assessment from multiple detector results."""
    
    def __init__(self):
        self.name = "RiskAssessmentEngine"
    
    def calculate_risk(
        self,
        detector_results: List[Dict[str, Any]],
        metadata_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        if not detector_results:
            return {
                "overall_score": 0.0,
                "risk_level": "low",
                "confidence": 0.0,
                "summary": "No analysis performed"
            }
        
        scores = [r.get("ai_probability", 0) for r in detector_results]
        avg_score = sum(scores) / len(scores) if scores else 0
        
        max_score = max(scores) if scores else 0
        
        weights = [0.4, 0.3, 0.2, 0.1]
        weighted_score = 0
        for i, score in enumerate(scores):
            if i < len(weights):
                weighted_score += score * weights[i]
        
        final_score = (avg_score * 0.4 + max_score * 0.3 + weighted_score * 0.3)
        final_score = min(max(final_score, 0), 1)
        
        if final_score < 0.3:
            risk_level = "low"
            summary = "Content appears to be authentic with low manipulation indicators."
        elif final_score < 0.5:
            risk_level = "medium"
            summary = "Some manipulation indicators detected. Manual review recommended."
        elif final_score < 0.7:
            risk_level = "high"
            summary = "Multiple manipulation indicators detected. Further investigation needed."
        else:
            risk_level = "critical"
            summary = "Strong indicators of AI manipulation detected. Immediate review recommended."
        
        all_indicators = []
        for result in detector_results:
            all_indicators.extend(result.get("indicators", []))
        
        explainability = {
            "summary": summary,
            "key_factors": [],
            "recommendation": ""
        }
        
        if max_score > 0.7:
            explainability["key_factors"].append("High AI generation probability from primary detector")
            explainability["recommendation"] = "Conduct manual forensic analysis"
        elif max_score > 0.5:
            explainability["key_factors"].append("Moderate manipulation indicators present")
            explainability["recommendation"] = "Verify source and context of content"
        else:
            explainability["key_factors"].append("Low manipulation indicators")
            explainability["recommendation"] = "Content appears authentic but verification always recommended"
        
        return {
            "overall_score": round(final_score, 4),
            "risk_level": risk_level,
            "confidence": round(1 - abs(max_score - avg_score), 4),
            "summary": summary,
            "indicators_count": len(all_indicators),
            "explainability": explainability
        }
