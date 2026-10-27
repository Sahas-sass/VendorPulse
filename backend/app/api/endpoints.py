"""
VendorPulse - FastAPI Endpoints & Routing
Handles API requests for zones, predictive risk forecasts, bridge loan dispatch authorization,
and live pipeline data polling.
"""

import os
import json
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks

from ..models.schemas import (
    ZoneSchema,
    RiskPredictionSchema,
    BridgeDispatchRequest,
    BridgeDispatchResponse,
    BenchmarkEvaluationSchema
)
from ..core.supabase_client import db_client
from data_pipeline.normalizer import DataPipelineNormalizer
from data_pipeline.zones import COLOMBO_COMMERCIAL_ZONES
from ml_engine.models.risk_forecaster import risk_engine

router = APIRouter(prefix="/api", tags=["VendorPulse Core Services"])
normalizer = DataPipelineNormalizer()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "VendorPulse Intelligence Core",
        "version": "2.0.0",
        "database": "Supabase PostgreSQL (Hybrid Cache Active)",
        "model": "Temporal Multi-Horizon Neural Forecaster (PyTorch)"
    }

@router.get("/zones", response_model=List[ZoneSchema])
def list_zones():
    """Returns all pre-mapped high-density informal commercial zones in Colombo."""
    zones = db_client.get_all_zones()
    return zones

@router.get("/predictions", response_model=List[RiskPredictionSchema])
def get_all_predictions():
    """
    Executes the multi-modal intelligence pipeline across all zones.
    Produces 48h-72h forward collapse risk predictions, Quantile Loss bounds,
    and localized risk drivers.
    """
    snapshots = normalizer.generate_zone_feature_snapshots()
    results = []

    for s in snapshots:
        pred = risk_engine.predict_zone_risk(s)
        
        # Enrich with zone financial and vendor metadata
        zid = s["zone_id"]
        zone_meta = next((z for z in COLOMBO_COMMERCIAL_ZONES if z["zone_id"] == zid), None)
        vendors = zone_meta["registered_vendors"] if zone_meta else 100
        capital = zone_meta["daily_volume_lkr"] if zone_meta else 1500000.0

        # Time to collapse estimation
        time_to_collapse = 48 if pred["status"] in ["CRITICAL", "HIGH_RISK"] else 72
        if s["block_code"] == "M-12":
            time_to_collapse = 72

        enriched_pred = {
            "zone_id": s["zone_id"],
            "block_code": s["block_code"],
            "name": s["name"],
            "status": pred["status"],
            "collapse_probability": pred["collapse_probability"],
            "p50_risk": pred["p50_risk"],
            "p90_risk": pred["p90_risk"],
            "confidence_score": pred["confidence_score"],
            "forecast_window_hours": pred["forecast_window_hours"],
            "risk_drivers": pred["risk_drivers"],
            "time_to_collapse_hours": time_to_collapse,
            "registered_vendors": vendors,
            "capital_required_lkr": capital
        }

        # Save to database store (Supabase)
        db_client.save_prediction(enriched_pred)
        results.append(enriched_pred)

    # Sort so CRITICAL zones appear first
    priority_order = {"CRITICAL": 0, "HIGH_RISK": 1, "MONITOR": 2}
    results.sort(key=lambda x: priority_order.get(x["status"], 3))
    return results

@router.get("/predictions/{zone_id}", response_model=RiskPredictionSchema)
def get_zone_prediction(zone_id: str):
    """Returns predictive risk details for a single target zone."""
    all_preds = get_all_predictions()
    match = next((p for p in all_preds if p["zone_id"] == zone_id), None)
    if not match:
        raise HTTPException(status_code=404, detail=f"Zone '{zone_id}' not found.")
    return match

@router.post("/dispatch/authorize", response_model=BridgeDispatchResponse)
def authorize_bridge_deployment(payload: BridgeDispatchRequest):
    """
    Authorizes preemptive zero-interest emergency bridge liquidity deployment for a commercial zone.
    Logs decision to Supabase database with audit timestamp and initiates field dispatch.
    """
    dispatch_record = db_client.record_bridge_dispatch(payload.model_dump())
    return BridgeDispatchResponse(
        id=dispatch_record["id"],
        zone_id=dispatch_record["zone_id"],
        coordinator_name=dispatch_record["coordinator_name"],
        vendors_count=dispatch_record["vendors_count"],
        capital_authorized_lkr=dispatch_record["capital_authorized_lkr"],
        status=dispatch_record["status"],
        action_window_expires_at=dispatch_record["action_window_expires_at"],
        created_at=dispatch_record["created_at"],
        notes=dispatch_record.get("notes"),
        message=f"Preemptive bridge liquidity of Rs {payload.capital_authorized_lkr:,.0f} successfully authorized for {payload.vendors_count} informal vendors in Block {payload.block_code}."
    )

@router.get("/dispatches")
def list_dispatches():
    """Returns audit log of all bridge capital disbursements authorized by coordinators."""
    return db_client.get_all_dispatches()

@router.get("/evaluation", response_model=List[BenchmarkEvaluationSchema])
def get_model_benchmarks():
    """Returns out-of-sample empirical evaluation results against Naïve & ARIMA baselines."""
    eval_file = os.path.join(os.path.dirname(__file__), "..", "..", "ml_engine", "evaluation", "evaluation_results.json")
    if os.path.exists(eval_file):
        with open(eval_file, "r", encoding="utf-8") as f:
            return json.load(f)
    # If not yet generated, trigger benchmark
    from ml_engine.evaluation.evaluate_models import run_full_benchmark
    return run_full_benchmark()

@router.post("/pipeline/refresh")
def force_pipeline_refresh(background_tasks: BackgroundTasks):
    """Triggers an immediate on-demand ingestion run across weather, transit, and civic news."""
    from data_pipeline.scheduler import IngestionWorker
    worker = IngestionWorker()
    background_tasks.add_task(worker.run_cycle)
    return {"message": "On-demand ingestion cycle initiated in background worker."}
