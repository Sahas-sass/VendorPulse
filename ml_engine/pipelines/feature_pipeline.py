"""
VendorPulse - Feature Engineering & Data Normalization Pipeline
Prepares static, past-observed, and future-known feature vectors for multi-horizon forecasting.
"""

import os
import pandas as pd
import numpy as np
from typing import Tuple, List, Dict, Any

FEATURE_COLUMNS = [
    "baseline_vulnerability",
    "rain_observed_past_24h_mm",
    "rain_forecast_48h_mm",
    "traffic_congestion_index",
    "traffic_speed_drop_pct",
    "suspended_routes_count",
    "nlp_civic_severity",
    "day_of_week",
    "is_weekend"
]

TARGET_COL_BINARY = "cash_flow_collapse_label"
TARGET_COL_CONTINUOUS = "actual_foot_traffic_drop_pct"

def load_and_preprocess_dataset(csv_path: str = None) -> pd.DataFrame:
    """Loads historical Colombo dataset and adds rolling/lagged interaction features."""
    if csv_path is None:
        csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "colombo_historical_disruptions.csv")

    df = pd.read_csv(csv_path)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(by=["zone_id", "date"]).reset_index(drop=True)

    # Feature interaction: compounded weather + transit shock
    df["compounded_weather_transit_shock"] = (
        (df["rain_forecast_48h_mm"] / 50.0) * (df["traffic_speed_drop_pct"] / 50.0)
    ).clip(0, 10.0)

    return df

def get_train_test_split(df: pd.DataFrame, test_days: int = 120) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Temporal train/test split.
    Splits strictly chronologically so the out-of-sample test represents genuine future unseen days.
    """
    cutoff_date = df["date"].max() - pd.Timedelta(days=test_days)
    train_df = df[df["date"] <= cutoff_date].copy()
    test_df = df[df["date"] > cutoff_date].copy()
    return train_df, test_df
