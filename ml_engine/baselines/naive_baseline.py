"""
VendorPulse - Baseline 1: Naïve Persistence Model
Predicts that tomorrow's foot traffic disruption will be identical to today's observed value (T+1 = T0).
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

class NaivePersistenceBaseline:
    """Naïve Baseline: assumes tomorrow is identical to today."""
    def __init__(self):
        self.name = "Naïve Persistence Baseline (T+1 = T0)"

    def evaluate_on_test_set(self, test_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Evaluates out-of-sample holdout set using lagged persistence.
        """
        df = test_df.copy().sort_values(by=["zone_id", "date"]).reset_index(drop=True)
        # Shift continuous drop by 1 within each zone
        df["pred_drop"] = df.groupby("zone_id")["actual_foot_traffic_drop_pct"].shift(1).fillna(0.20)
        df["pred_class"] = (df["pred_drop"] >= 0.50).astype(int)

        y_true = df["cash_flow_collapse_label"].values
        y_pred = df["pred_class"].values
        y_true_cont = df["actual_foot_traffic_drop_pct"].values
        y_pred_cont = df["pred_drop"].values

        return self._compute_metrics(y_true, y_pred, y_true_cont, y_pred_cont)

    def _compute_metrics(self, y_true, y_pred, y_true_cont, y_pred_cont) -> Dict[str, Any]:
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

        acc = accuracy_score(y_true, y_pred)
        prec = precision_score(y_true, y_pred, zero_division=0)
        rec = recall_score(y_true, y_pred, zero_division=0)
        f1 = f1_score(y_true, y_pred, zero_division=0)

        tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0

        # Continuous Pinball loss for P50
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
