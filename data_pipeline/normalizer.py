"""
VendorPulse - Multi-Modal Normalizer & Feature Synthesizer
Merges meteorological, traffic congestion, and civic NLP streams into
standardized UTC+5:30 multi-horizon feature vectors for each Colombo commercial zone.
"""

from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from .zones import COLOMBO_COMMERCIAL_ZONES
from .weather.owm_client import OpenWeatherClient
from .traffic.traffic_monitor import TrafficMonitor
from .nlp.news_scraper import ColomboNewsScraper

COLOMBO_TZ = timezone(timedelta(hours=5, minutes=30))

class DataPipelineNormalizer:
    def __init__(self):
        self.weather_client = OpenWeatherClient()
        self.traffic_monitor = TrafficMonitor()
        self.news_scraper = ColomboNewsScraper()

    def generate_zone_feature_snapshots(self) -> List[Dict[str, Any]]:
        """
        Polls all three layers and generates standardized time-series feature records
        for each Colombo commercial zone.
        """
        now_colombo = datetime.now(COLOMBO_TZ)
        weather_data = self.weather_client.get_weather_forecast()
        traffic_data = self.traffic_monitor.get_corridor_telemetry()
        news_disruptions = self.news_scraper.fetch_recent_civic_disruptions()

        snapshots = []
        for zone in COLOMBO_COMMERCIAL_ZONES:
            zid = zone["zone_id"]

            # 1. Match traffic telemetry for zone
            ztraffic = next((t for t in traffic_data if t["zone_id"] == zid), None)
            congestion_idx = ztraffic["congestion_index"] if ztraffic else 2.0
            speed_drop = ztraffic["speed_drop_percent"] if ztraffic else 10.0
            suspended_routes = ztraffic["active_route_suspensions"] if ztraffic else []
            road_blocks = ztraffic["road_blockages"] if ztraffic else []

            # 2. Match civic news alerts for zone
            matched_news = [
                n for n in news_disruptions 
                if zid in n["nlp_data"]["matched_zones"]
            ]
            nlp_severity = max([n["nlp_data"]["severity_score"] for n in matched_news]) if matched_news else 0.0

            # Collect explicit risk drivers for the field UI card
            raw_drivers = []
            for n in matched_news:
                raw_drivers.extend(n["nlp_data"]["risk_drivers"])
            if road_blocks:
                raw_drivers.extend(road_blocks)
            if suspended_routes:
                raw_drivers.extend(suspended_routes)

            # Deduplicate and sort drivers
            dedup_drivers = list(dict.fromkeys(raw_drivers))
            if not dedup_drivers:
                dedup_drivers = ["Normal urban operating conditions"]

            # 3. Weather features for Colombo zone
            max_48h_rain = weather_data.get("72h_max_rain_window_mm", 15.0)
            current_condition = weather_data.get("current_condition", "Fair")

            snapshot = {
                "zone_id": zid,
                "block_code": zone["block_code"],
                "name": zone["name"],
                "district": zone["district"],
                "coordinates": zone["coordinates"],
                "registered_vendors": zone["registered_vendors"],
                "daily_volume_lkr": zone["daily_volume_lkr"],
                "timestamp_utc530": now_colombo.strftime("%Y-%m-%d %H:%M:%S UTC+05:30"),
                "features": {
                    "precipitation_48h_peak_mm": max_48h_rain,
                    "weather_condition": current_condition,
                    "traffic_congestion_index": congestion_idx,
                    "traffic_speed_drop_pct": speed_drop,
                    "suspended_routes_count": len(suspended_routes),
                    "civic_nlp_severity": nlp_severity,
                    "baseline_vulnerability": zone["baseline_vulnerability_score"]
                },
                "risk_drivers": dedup_drivers[:3],
                "active_suspensions": suspended_routes,
                "road_closures": road_blocks,
                "degraded_confidence": weather_data.get("degraded_confidence", False),
                "data_source_mode": weather_data.get("source", "hybrid_stream")
            }
            snapshots.append(snapshot)

        return snapshots
