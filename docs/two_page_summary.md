# VendorPulse: Executive 2-Page Summary
**ModelX 2.0 | Team Nexio | IEEE Computational Intelligence Society Student Chapter, IIT**

**Lead Developer:** Sahas Abeygunarathne (University of Moratuwa) · **Email:** sahas.samuditha@gmail.com  
**Project Repository:** [https://github.com/Sahas-sass/VendorPulse](https://github.com/Sahas-sass/VendorPulse)

---

## PAGE 1: THE PROBLEM, THE USER & THE SYSTEM CORE

### 1. The Vulnerability: Urban Informal Daily Liquidity
Across high-density South Asian commercial hubs—such as Colombo 01–15 (Pettah Central Market, Fort, Maradana, Maligawatta)—tens of thousands of informal hawkers and street vendors operate entirely on a daily cash cycle: **today's earnings purchase tomorrow's stock**. 

When acute external disruptions strike (hyper-local convective flash floods, spontaneous bus transit strikes, unannounced road closures), pedestrian density collapses. Without institutional buffers or savings, vendors face an immediate liquidity crisis. To feed their families and preserve their trading stalls, they are forced to borrow emergency working capital from unregulated, predatory local lenders charging **10% to 20% weekly interest**. A single disrupted trading weekend results in a vicious, cyclical debt trap that wipes out months of hard-won financial progress.

### 2. The Target User: Micro-Finance NGO Field Outreach Coordinator
Current relief mechanisms from micro-finance institutions (MFIs) and NGOs act **retroactively**. They restructure debts or process micro-loans weeks after defaults have occurred—when the vendor has already absorbed predatory loans.

**VendorPulse transforms the coordinator’s workflow from reactive default recovery to proactive shielding.** 
Instead of waiting for lagging default reports, the coordinator consults the VendorPulse Threat Map 48–72 hours in advance, identifies imminent cash-flow collapses for specific commercial blocks, and authorizes rapid zero-interest emergency bridge micro-loans before Friday trading commences.

### 3. Core Algorithmic Innovation: Multi-Modal Compounded Risk
Human operators cannot cross-reference thousands of shifting municipal, transit, and meteorological signals across a city, nor calculate the compounding, non-linear impact of overlapping disruptions. VendorPulse algorithmically extracts this intelligence by combining:
1. **Meteorological Forecasts**: Hyper-local precipitation and wind from OpenWeatherMap.
2. **Transit & Corridor Telemetry**: OpenStreetMap (OSRM) corridor speed drops and bus route suspensions.
3. **Civic Disruption NLP**: Automated entity extraction matching local news announcements (Ada Derana, NewsFirst) to specific Colombo commercial blocks (e.g. *"Bodhiraja Mawatha"*, *"Bus Route 138"*).

---

## PAGE 2: SYSTEM ARCHITECTURE, EMPIRICAL BENCHMARKS & FIELD IMPACT

### 4. End-to-End System Architecture

```
[ Ingestion & NLP ] ───> [ Multi-Modal Normalizer ] ───> [ PyTorch Neural Risk Engine ] ───> [ Threat Map UI & Dispatch ]
OpenWeather + OSRM       Standardized UTC+5:30            Quantile Loss (P50, P90)           Dark-mode mobile dashboard
+ Ada Derana Scraper     Time-Series Feature Tensors      Collapse Probability               1-Click Bridge Authorization
```

- **Backend & Storage**: High-throughput FastAPI services integrated with Supabase (managed PostgreSQL) and local SQLite failover for uninterrupted offline field operation.
- **Geospatial Engine**: Free and open-source OpenStreetMap (OSRM) routing replacing paid APIs.

### 5. Empirical Validation & Baseline Comparison
The multi-horizon neural model was back-tested against a 600-day out-of-sample holdout dataset of Colombo disruptions, benchmarked directly against the two baselines defined in the proposal:

| Model Architecture | Accuracy | Precision | Recall | F1-Score | FPR (< 20%) | P50 Quantile Loss |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **VendorPulse Multi-Horizon Forecaster** | **96.7%** | **72.3%** | **82.9%** | **0.773** | **2.3% (PASS)** | **0.0359** |
| **Naïve Persistence Baseline ($T_{+1} = T_0$)** | 88.0% | 12.2% | 12.2% | 0.122 | 6.4% (PASS) | 0.0733 |
| **Traditional ARIMA Baseline (Statistical)** | 93.2% | 0.0% | 0.0% | 0.000 | 0.0% (PASS) | 0.0541 |

#### Verification Against Project Failure Criteria:
1. **False Positive Rate (FPR) < 20%**: **PASS (2.33%)**. Protects limited NGO capital from being squandered on false alarms.
2. **Significantly Outperformed Naïve Baseline**: **PASS ($F1 = 0.773$ vs $0.122$)**. Proves the system captures multi-modal predictive signal rather than yesterday's momentum.
3. **Outperformed Traditional ARIMA**: **PASS ($F1 = 0.773$ vs $0.000$)**. Demonstrates that linear models fail on acute, step-function urban disruptions.

### 6. Field Interface & Concrete Action
In the field interface (modeled directly on Page 9 of the proposal), the coordinator views:
- **Threat Map**: Color-coded heat zones (Yellow: Monitor, Orange: High Risk, Red: Critical Liquidity Collapse).
- **Pettah Intersection Card (Block P-04)**: Flags an imminent collapse within 47h 38m with **90% confidence**, **142 registered vendors**, and **Rs 2.5M capital required**. Identifies live risk drivers: *Flooded primary drainage* and *Bus Route 138 suspended*.
- **1-Click Bridge Authorization**: The coordinator taps **"Authorize Bridge Deployment"**, logging an immutable dispatch record to Supabase and immediately alerting ground field officers.

### 7. Social & Economic Impact
By deploying Rs 2.5M in preemptive, zero-interest liquidity 48 hours prior to disruption, 142 daily-wage vendors in Pettah avoid borrowing at 20% weekly rates. This saves the community an estimated **Rs 500,000+ per week in toxic interest repayments**, preserving informal livelihoods and breaking the cycle of poverty.
