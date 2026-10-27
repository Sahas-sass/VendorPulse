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
*(Evaluated against Naïve Baseline and Statistical ARIMA Model)*

---

## 5. Proposal Reflection & Honest Evaluation
*(Documenting architectural adaptations, contingency triggers, and technical lessons learned)*
