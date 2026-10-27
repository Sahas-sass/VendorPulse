"""
VendorPulse - Baseline 2: Statistical ARIMA Time-Series Model
Implements standard AutoRegressive Integrated Moving Average (ARIMA) for basic economic time-series forecasting.
Represents current benchmark referenced in proposal section 9.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

class ARIMABaseline:
    def __init__(self, order=(2, 1, 1)):
        self.order = order
        self.name = "Traditional ARIMA Baseline (Statistical)"

    def evaluate_on_test_set(self, train_df: pd.DataFrame, test_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Fits an ARIMA model for each zone and generates out-of-sample forecasts.
        """
        all_y_true = []
        all_y_pred = []
        all_cont_true = []
        all_cont_pred = []

        zones = test_df["zone_id"].unique()
        for zone in zones:
            z_train = train_df[train_df["zone_id"] == zone]["actual_foot_traffic_drop_pct"].values
            z_test = test_df[test_df["zone_id"] == zone]["actual_foot_traffic_drop_pct"].values
            z_labels = test_df[test_df["zone_id"] == zone]["cash_flow_collapse_label"].values

            try:
                # Fit ARIMA on training sequence
                model = ARIMA(z_train, order=self.order)
                fitted = model.fit()
                # Forecast steps ahead
                forecast = fitted.forecast(steps=len(z_test))
                # Clip valid probabilities
                forecast = np.clip(forecast, 0.05, 0.95)
            except Exception:
                # Fallback to mean if non-stationary/singular
                forecast = np.full(len(z_test), np.mean(z_train))

            pred_labels = (forecast >= 0.50).astype(int)

            all_y_true.extend(z_labels)
            all_y_pred.extend(pred_labels)
            all_cont_true.extend(z_test)
            all_cont_pred.extend(forecast)

        y_true = np.array(all_y_true)
        y_pred = np.array(all_y_pred)
        y_true_cont = np.array(all_cont_true)
        y_pred_cont = np.array(all_cont_pred)

        acc = accuracy_score(y_true, y_pred)
        prec = precision_score(y_true, y_pred, zero_division=0)
        rec = recall_score(y_true, y_pred, zero_division=0)
        f1 = f1_score(y_true, y_pred, zero_division=0)

        tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0

        p50_loss = np.mean(np.maximum(0.5 * (y_true_cont - y_pred_cont), (0.5 - 1) * (y_true_cont - y_pred_cont)))
        p90_loss = np.mean(np.maximum(0.9 * (y_true_cont - y_pred_cont), (0.9 - 1) * (y_true_cont - y_pred_cont)))

        return {
            "model_name": self.name,
            "accuracy": round(float(acc), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1_score": round(float(f1), 4),
            "false_positive_rate": round(float(fpr), 4),
            "p50_quantile_loss": round(float(p50_loss), 4),
            "p90_quantile_loss": round(float(p90_loss), 4)
        }
