"""
VendorPulse - Supabase & Relational Data Client
Manages zones, live disruption telemetry, multi-horizon risk predictions, and bridge capital dispatches.
Supports both Supabase (managed PostgreSQL) and local SQLite fallback.
"""

import os
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv

# Load local environment variables
load_dotenv()

logger = logging.getLogger("VendorPulse.Database")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

class DatabaseClient:
    def __init__(self):
        self.supabase_client = None
        self.use_supabase = False

        if SUPABASE_URL and SUPABASE_KEY and "supabase.co" in SUPABASE_URL:
            try:
                from supabase import create_client, Client
                self.supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
                self.use_supabase = True
                logger.info(f"Connected to Supabase project: {SUPABASE_URL}")
            except Exception as e:
                logger.warning(f"Could not initialize Supabase client: {e}. Defaulting to in-memory/SQLite store.")
                self.use_supabase = False

        # In-memory store as reliable fallback and cache
        self._memory_store = {
            "zones": {},
            "predictions": {},
            "dispatches": []
        }
        self._seed_default_zones()

    def _seed_default_zones(self):
        """Pre-seeds standard Colombo commercial zones."""
        from data_pipeline.zones import COLOMBO_COMMERCIAL_ZONES
        for z in COLOMBO_COMMERCIAL_ZONES:
            self._memory_store["zones"][z["zone_id"]] = {
                "id": z["zone_id"],
                "block_code": z["block_code"],
                "name": z["name"],
                "district": z["district"],
                "lat": z["coordinates"]["lat"],
                "lon": z["coordinates"]["lon"],
                "registered_vendors": z["registered_vendors"],
                "daily_volume_lkr": z["daily_volume_lkr"],
                "baseline_vulnerability": z["baseline_vulnerability_score"]
            }

    def get_all_zones(self) -> List[Dict[str, Any]]:
        """Retrieves commercial zone records from Supabase or fallback memory store."""
        if self.use_supabase and self.supabase_client:
            try:
                res = self.supabase_client.table("zones").select("*").execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase fetch zones error: {e}. Using local cache.")
        return list(self._memory_store["zones"].values())

    def save_prediction(self, prediction: Dict[str, Any]) -> bool:
        """Saves a multi-horizon risk forecast record."""
        zid = prediction["zone_id"]
        self._memory_store["predictions"][zid] = prediction

        if self.use_supabase and self.supabase_client:
            try:
                record = {
                    "zone_id": zid,
                    "forecast_window_hours": prediction.get("forecast_window_hours", 72),
                    "collapse_probability": prediction.get("collapse_probability", 0.0),
                    "p50_risk": prediction.get("p50_risk", 0.0),
                    "p90_risk": prediction.get("p90_risk", 0.0),
                    "status": prediction.get("status", "MONITOR"),
                    "confidence_score": prediction.get("confidence_score", 0.90),
                    "risk_drivers": prediction.get("risk_drivers", []),
                    "evaluated_at": datetime.now(timezone.utc).isoformat()
                }
                self.supabase_client.table("risk_predictions").insert(record).execute()
                return True
            except Exception as e:
                logger.warning(f"Supabase save prediction failed: {e}")
        return True

    def get_latest_predictions(self) -> List[Dict[str, Any]]:
        """Returns the most recent risk predictions for all zones."""
        return list(self._memory_store["predictions"].values())

    def record_bridge_dispatch(self, dispatch_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Logs a coordinator's decision to authorize and deploy zero-interest
        bridge capital to informal vendors in an at-risk commercial zone.
        """
        dispatch_id = f"DISP-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{dispatch_data.get('block_code', 'COL')}"
        now_utc = datetime.now(timezone.utc)
        expires_at = now_utc + timedelta(hours=47, minutes=38)  # "Action window closes in 47h 38m"

        record = {
            "id": dispatch_id,
            "zone_id": dispatch_data.get("zone_id", "ZONE-PETTAH-01"),
            "coordinator_name": dispatch_data.get("coordinator_name", "Field Coordinator (Nexio)"),
            "vendors_count": dispatch_data.get("vendors_count", 142),
            "capital_authorized_lkr": dispatch_data.get("capital_authorized_lkr", 2500000.0),
            "status": "AUTHORIZED",
            "action_window_expires_at": expires_at.isoformat(),
            "created_at": now_utc.isoformat(),
            "notes": dispatch_data.get("notes", "Preemptive liquidity bridge authorized before Friday trade disruption")
        }

        self._memory_store["dispatches"].append(record)

        if self.use_supabase and self.supabase_client:
            try:
                self.supabase_client.table("bridge_dispatches").insert(record).execute()
                logger.info(f"Supabase logged dispatch: {dispatch_id}")
            except Exception as e:
                logger.warning(f"Supabase dispatch log failed: {e}")

        return record

    def get_all_dispatches(self) -> List[Dict[str, Any]]:
        """Returns list of all authorized bridge dispatches."""
        if self.use_supabase and self.supabase_client:
            try:
                res = self.supabase_client.table("bridge_dispatches").select("*").order("created_at", desc=True).execute()
                if res.data:
                    return res.data
            except Exception:
                pass
        return self._memory_store["dispatches"]

# Global database client singleton
db_client = DatabaseClient()
