"""
VendorPulse - Backend API Integration Tests
Tests all endpoints: health, zones, multi-horizon predictions, bridge authorization, and evaluation benchmarks.
"""

import os
os.environ["TESTING"] = "1"

from backend.app.api.endpoints import (
    health_check,
    list_zones,
    get_all_predictions,
    authorize_bridge_deployment,
    list_dispatches,
    get_model_benchmarks
)
from backend.app.models.schemas import BridgeDispatchRequest

def test_health_check():
    data = health_check()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "Supabase" in data["database"]

def test_get_zones():
    zones = list_zones()
    assert len(zones) == 5
    pettah = next(z for z in zones if z["block_code"] == "P-04")
    assert pettah["name"] == "Pettah Central Market"
    assert pettah["registered_vendors"] == 142

def test_get_predictions():
    preds = get_all_predictions()
    assert len(preds) == 5

    # Pettah should be top priority (CRITICAL)
    pettah_pred = next(p for p in preds if p["block_code"] == "P-04")
    assert pettah_pred["status"] == "CRITICAL"
    assert pettah_pred["collapse_probability"] >= 90.0
    assert len(pettah_pred["risk_drivers"]) > 0

def test_authorize_bridge_dispatch():
    payload = BridgeDispatchRequest(
        zone_id="ZONE-PETTAH-01",
        block_code="P-04",
        coordinator_name="Field Outreach Coordinator (Nexio)",
        vendors_count=142,
        capital_authorized_lkr=2500000.0,
        notes="Emergency preemptive liquidity deployment before Friday flash flooding"
    )
    dispatch = authorize_bridge_deployment(payload)
    assert dispatch.status == "AUTHORIZED"
    assert dispatch.vendors_count == 142
    assert dispatch.capital_authorized_lkr == 2500000.0
    assert "DISP-" in dispatch.id
    assert dispatch.action_window_expires_at is not None

def test_get_dispatches():
    dispatches = list_dispatches()
    assert len(dispatches) >= 1

def test_get_evaluation():
    results = get_model_benchmarks()
    assert len(results) == 3
    vp_model = next(r for r in results if "VendorPulse" in r["model_name"])
    assert vp_model["false_positive_rate"] < 0.20
    assert vp_model["f1_score"] > 0.70

if __name__ == "__main__":
    test_health_check()
    test_get_zones()
    test_get_predictions()
    test_authorize_bridge_dispatch()
    test_get_dispatches()
    test_get_evaluation()
    print("All backend integration tests passed successfully!")
