"""
VendorPulse - Scheduled Ingestion Worker
Runs periodic 3-hour polling cycles to ingest, normalize, and update zone disruption states.
Can be executed as a background worker or invoked on-demand.
"""

import time
import json
import logging
from datetime import datetime, timezone
from .normalizer import DataPipelineNormalizer

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("VendorPulse.IngestionWorker")

class IngestionWorker:
    def __init__(self, interval_seconds: int = 10800):  # Default 3 hours = 10800s
        self.interval_seconds = interval_seconds
        self.normalizer = DataPipelineNormalizer()
        self.is_running = False

    def run_cycle(self):
        """Executes a single end-to-end data ingestion and normalization pass."""
        logger.info("Executing scheduled 3-hour multi-modal ingestion pass...")
        try:
            snapshots = self.normalizer.generate_zone_feature_snapshots()
            logger.info(f"Successfully processed {len(snapshots)} commercial zones across Colombo 01-15.")
            for s in snapshots:
                logger.info(f" -> Zone [{s['block_code']}] {s['name']}: Rain Peak {s['features']['precipitation_48h_peak_mm']}mm | Speed Drop {s['features']['traffic_speed_drop_pct']}% | Drivers: {', '.join(s['risk_drivers'])}")
            return snapshots
        except Exception as e:
            logger.error(f"Ingestion cycle encountered error: {e}", exc_info=True)
            return []

    def start_loop(self):
        """Runs the continuous ingestion loop."""
        self.is_running = True
        logger.info(f"VendorPulse ingestion worker started. Polling interval: {self.interval_seconds}s.")
        while self.is_running:
            self.run_cycle()
            time.sleep(self.interval_seconds)

if __name__ == "__main__":
    worker = IngestionWorker()
    worker.run_cycle()
