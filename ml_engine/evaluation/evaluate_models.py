"""
VendorPulse - Comprehensive Model Evaluation & Baseline Benchmark Suite
Validates the Multi-Horizon Neural Forecaster against:
1. Naïve Baseline (T+1 = T0)
2. Traditional Statistical Model (ARIMA)
Measures Quantile Loss (P50, P90), F1-Score, and confirms Failure Criteria: FPR < 20%.
"""

import os
import json
import torch
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

from ..pipelines.feature_pipeline import (
    load_and_preprocess_dataset,
    get_train_test_split,
    FEATURE_COLUMNS,
    TARGET_COL_BINARY,
    TARGET_COL_CONTINUOUS
)
from ..models.risk_forecaster import VendorPulseRiskEngine
from ..baselines.naive_baseline import NaivePersistenceBaseline
from ..baselines.arima_baseline import ARIMABaseline

EVAL_OUTPUT_JSON = os.path.join(os.path.dirname(__file__), "evaluation_results.json")

def evaluate_vendorpulse_engine(engine: VendorPulseRiskEngine, test_df: pd.DataFrame) -> dict:
    """Evaluates the multi-horizon neural model on unseen out-of-sample data."""
    feature_cols = FEATURE_COLUMNS + ["compounded_weather_transit_shock"]
    X_test = torch.tensor(test_df[feature_cols].values, dtype=torch.float32).to(engine.device)
    y_true_binary = test_df[TARGET_COL_BINARY].values
    y_true_cont = test_df[TARGET_COL_CONTINUOUS].values

    engine.model.eval()
    with torch.no_grad():
        quant_preds, prob_preds = engine.model(X_test)
        p50_preds = quant_preds[:, 0].cpu().numpy()
        p90_preds = quant_preds[:, 1].cpu().numpy()
        prob_vals = prob_preds.cpu().numpy()

    # Classification decision threshold (0.50)
    y_pred_binary = (prob_vals >= 0.50).astype(int)

    acc = accuracy_score(y_true_binary, y_pred_binary)
    prec = precision_score(y_true_binary, y_pred_binary, zero_division=0)
    rec = recall_score(y_true_binary, y_pred_binary, zero_division=0)
    f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)

    tn, fp, fn, tp = confusion_matrix(y_true_binary, y_pred_binary).ravel()
    fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0

    # Quantile Pinball Loss
    p50_loss = np.mean(np.maximum(0.5 * (y_true_cont - p50_preds), (0.5 - 1) * (y_true_cont - p50_preds)))
    p90_loss = np.mean(np.maximum(0.9 * (y_true_cont - p90_preds), (0.9 - 1) * (y_true_cont - p90_preds)))

    return {
        "model_name": "VendorPulse Multi-Horizon Neural Forecaster",
        "accuracy": round(float(acc), 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1_score": round(float(f1), 4),
        "false_positive_rate": round(float(fpr), 4),
        "p50_quantile_loss": round(float(p50_loss), 4),
        "p90_quantile_loss": round(float(p90_loss), 4)
    }

def run_full_benchmark():
    """Runs end-to-end evaluation comparing VendorPulse against all proposal baselines."""
    print("=====================================================================")
    print("      VENDORPULSE - MODELX 2.0 EMPIRICAL BENCHMARK EVALUATION        ")
    print("=====================================================================")

    df = load_and_preprocess_dataset()
    train_df, test_df = get_train_test_split(df, test_days=120)
    print(f"Dataset Split: {len(train_df)} training days | {len(test_df)} out-of-sample test days")
    print(f"Positive Crisis Cases in Test Set: {test_df[TARGET_COL_BINARY].sum()} / {len(test_df)}")
    print("---------------------------------------------------------------------")

    # 1. VendorPulse Multi-Horizon Engine
    print("1/3 Evaluating VendorPulse Multi-Horizon Neural Forecaster...")
    engine = VendorPulseRiskEngine()
    results_vp = evaluate_vendorpulse_engine(engine, test_df)

    # 2. Naïve Baseline
    print("2/3 Evaluating Naïve Persistence Baseline (T+1 = T0)...")
    naive_base = NaivePersistenceBaseline()
    results_naive = naive_base.evaluate_on_test_set(test_df)

    # 3. ARIMA Baseline
    print("3/3 Evaluating Traditional Statistical ARIMA Model...")
    arima_base = ARIMABaseline()
    results_arima = arima_base.evaluate_on_test_set(train_df, test_df)

    all_results = [results_vp, results_naive, results_arima]

    # Print Formatted Markdown Table
    print("\n========================= BENCHMARK RESULTS =========================")
    header = "| Model Architecture | Accuracy | Precision | Recall | F1-Score | FPR (< 20%) | P50 Quantile Loss |"
    divider = "| :--- | :---: | :---: | :---: | :---: | :---: | :---: |"
    print(header)
    print(divider)
    for r in all_results:
        fpr_status = f"{r['false_positive_rate']*100:.1f}% {'(PASS)' if r['false_positive_rate'] <= 0.20 else '(FAIL)'}"
        print(f"| **{r['model_name']}** | {r['accuracy']*100:.1f}% | {r['precision']*100:.1f}% | {r['recall']*100:.1f}% | **{r['f1_score']:.3f}** | {fpr_status} | {r['p50_quantile_loss']:.4f} |")

    # Check Failure Criteria
    print("\n---------------------- PROPOSAL FAILURE CRITERIA ---------------------")
    fpr_pass = results_vp["false_positive_rate"] <= 0.20
    outperforms_naive = results_vp["f1_score"] > results_naive["f1_score"]
    outperforms_arima = results_vp["f1_score"] > results_arima["f1_score"]

    print(f"1. False Positive Rate < 20%: {'PASS' if fpr_pass else 'FAIL'} (Measured: {results_vp['false_positive_rate']*100:.2f}%)")
    print(f"2. Significantly outperforms Naïve Baseline: {'PASS' if outperforms_naive else 'FAIL'} (F1: {results_vp['f1_score']:.3f} vs {results_naive['f1_score']:.3f})")
    print(f"3. Outperforms Traditional ARIMA: {'PASS' if outperforms_arima else 'FAIL'} (F1: {results_vp['f1_score']:.3f} vs {results_arima['f1_score']:.3f})")
    print("=====================================================================\n")

    # Save to disk
    with open(EVAL_OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2)
    print(f"Results written to: {EVAL_OUTPUT_JSON}")

    return all_results

if __name__ == "__main__":
    run_full_benchmark()
