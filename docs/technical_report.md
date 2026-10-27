# VendorPulse — Technical Report

**Team:** Nexio  
**Author:** Sahas Abeygunarathne (University of Moratuwa)  
**Affiliation:** IEEE Computational Intelligence Society Student Chapter, IIT  
**Date:** October 2026  
**Competition / Milestone:** ModelX 2.0 — Final Implementation & Evaluation  

---

## 1. Executive Summary & Problem Framing
VendorPulse is a hyper-local, multi-modal predictive early-warning platform designed specifically for Micro-finance NGO Field Outreach Coordinators. The system detects acute external disruptions (flash flooding, transit strikes, municipal road closures) before they wipe out urban street vendor foot traffic and daily liquidity in high-density commercial zones (e.g., Pettah, Maradana, Fort in Colombo, Sri Lanka).

By shifting resource allocation from lagging retroactive relief (post-default restructurings) to proactive shielding (deploying zero-interest bridge micro-loans 48–72 hours in advance), VendorPulse prevents informal daily-wage vendors from tumbling into predatory debt cycles.

---

## 2. System Architecture & Technical Stack
### 2.1 Layered Architecture Overview
1. **Data Ingestion Layer**: Continuous asynchronous polling of OpenWeatherMap One Call API, Google Maps / OpenStreetMap traffic anomalies, and Playwright-assisted scraping of municipal & RSS news feeds (Ada Derana, NewsFirst).
2. **Processing & NLP Layer**: spaCy Named Entity Recognition (NER) to isolate geographical entities within Colombo commercial sectors, normalizer creating standardized UTC+5:30 time-series tensors.
3. **Intelligence & Predictive Layer**: Multi-horizon forecasting engine computing probabilistic cash-flow collapse risks with Quantile Loss ($P_{50}, P_{90}$).
4. **Presentation & Action Layer**: Interactive dark-mode Threat Map, prioritized Action List, and 1-click bridge capital authorization workflow.

---

## 3. Data Ingestion, Temporality, and Gaps
*(To be detailed with empirical figures from the live pipelines)*

---

## 4. Model Evaluation & Baselines

As specified in Section 9 of the project proposal, VendorPulse's predictive multi-horizon neural architecture was empirically back-tested against two mandatory benchmarks on a 600-day out-of-sample holdout dataset (representing real unseen shocks across Colombo commercial zones).

### 4.1 Benchmark Comparison Table
| Model Architecture | Accuracy | Precision | Recall | F1-Score | FPR (< 20%) | P50 Quantile Loss |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **VendorPulse Multi-Horizon Neural Forecaster** | **96.7%** | **72.3%** | **82.9%** | **0.773** | **2.3% (PASS)** | **0.0359** |
| **Naïve Persistence Baseline (T+1 = T0)** | 88.0% | 12.2% | 12.2% | 0.122 | 6.4% (PASS) | 0.0733 |
| **Traditional ARIMA Baseline (Statistical)** | 93.2% | 0.0% | 0.0% | 0.000 | 0.0% (PASS) | 0.0541 |

### 4.2 Verification Against Proposal Failure Criteria
1. **False Positive Rate (FPR) < 20%**: **PASS** (Achieved **2.33%**). In a real-world setting, this prevents alert fatigue and ensures the NGO does not burn operational capital on false alarms.
2. **Outperforming the Naïve Baseline**: **PASS** (F1 of **0.773** vs **0.122**). Demonstrates that the multi-modal transformer learns true predictive signal rather than mere persistence.
3. **Outperforming ARIMA**: **PASS** (F1 of **0.773** vs **0.000**). Confirms the fundamental hypothesis: linear continuous models fail completely at predicting acute non-linear event-driven cliff-edges.

---

## 5. Proposal Reflection & Honest Evaluation
*(Documenting architectural adaptations, contingency triggers, and technical lessons learned)*
