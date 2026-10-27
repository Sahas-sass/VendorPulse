"""
VendorPulse - Pydantic Request & Response Schemas
Defines structured data contracts for zones, predictions, dispatches, and evaluations.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class Coordinates(BaseModel):
    lat: float
    lon: float

class ZoneSchema(BaseModel):
    id: str
    block_code: str
    name: str
    district: str
    lat: float
    lon: float
    registered_vendors: int
    daily_volume_lkr: float
    baseline_vulnerability: float

class RiskPredictionSchema(BaseModel):
    zone_id: str
    block_code: str
    name: str
    status: str  # MONITOR, HIGH_RISK, CRITICAL
    collapse_probability: float  # e.g., 90.0%
    p50_risk: float
    p90_risk: float
    confidence_score: float
    forecast_window_hours: int
    risk_drivers: List[str]
    time_to_collapse_hours: Optional[int] = 48
    registered_vendors: Optional[int] = 0
    capital_required_lkr: Optional[float] = 0.0

class BridgeDispatchRequest(BaseModel):
    zone_id: str
    block_code: str
    coordinator_name: Optional[str] = "Field Outreach Coordinator (Nexio)"
    vendors_count: int
    capital_authorized_lkr: float
    notes: Optional[str] = "Preemptive zero-interest liquidity bridge authorized before Friday trade disruption"

class BridgeDispatchResponse(BaseModel):
    id: str
    zone_id: str
    coordinator_name: str
    vendors_count: int
    capital_authorized_lkr: float
    status: str
    action_window_expires_at: str
    created_at: str
    notes: Optional[str]
    message: str = "Bridge deployment authorized successfully. Dispatch alerts queued for local field officers."

class BenchmarkEvaluationSchema(BaseModel):
    model_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    false_positive_rate: float
    p50_quantile_loss: float
    p90_quantile_loss: float
