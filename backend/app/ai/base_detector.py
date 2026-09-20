from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import random

class BaseDetector(ABC):
    """Base class for all AI detection modules."""
    
    def __init__(self):
        self.name = "BaseDetector"
        self.version = "1.0.0"
    
    @abstractmethod
    async def analyze(self, file_path: str, file_hash: str) -> Dict[str, Any]:
        pass
    
    def _generate_confidence(self, base: float = 0.5, variance: float = 0.2) -> float:
        return round(min(max(base + random.uniform(-variance, variance), 0), 1), 4)
    
    def _determine_risk_level(self, score: float) -> str:
        if score < 0.3:
            return "low"
        elif score < 0.6:
            return "medium"
        elif score < 0.8:
            return "high"
        return "critical"
