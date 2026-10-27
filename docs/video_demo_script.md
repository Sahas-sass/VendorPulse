# VendorPulse: 3-Minute Video Demonstration Script
**ModelX 2.0 | Team Nexio | IEEE CIS Student Chapter, IIT**

* **Target Video Runtime:** Exactly 3 minutes (180 seconds)
* **Presenter:** Sahas Abeygunarathne (University of Moratuwa)
* **Demo Environment:** Live running VendorPulse system on Colombo commercial zone data
* **Audio Track:** Clear, articulate narration with subtle ambient background music

---

### [0:00 - 0:40] Segment 1: The Predatory Debt Spiral (Problem Framing)

* **Visual on Screen:**
  - Brief introductory slide with Team Nexio & ModelX 2.0 branding.
  - Video footage or high-resolution photography of Colombo's informal markets: Pettah Central Market, street fruit hawkers, bus terminals along Olcott Mawatha.
  - Text overlay: *"Today's profits fund tomorrow's inventory."*
  - Graphical depiction of a sudden flash flood and bus route stoppage causing foot-traffic collapse.
* **Narration:**
  > *"Across urban commercial hubs like Colombo, tens of thousands of informal street vendors and daily-wage hawkers survive on day-to-day liquidity. Today's sales purchase tomorrow's produce.*
  >
  > *When localized shocks strike—such as monsoon flash flooding or unannounced transit strikes—pedestrian foot traffic halts instantly. Without cash buffers, vendors face an impossible choice: close down, or borrow emergency working capital from local predatory lenders charging ruinous 10% to 20% weekly interest.*
  >
  > *Traditional micro-finance programs react weeks too late—offering restructuring only after vendors have already fallen into debt traps. Meet VendorPulse: an early-warning platform shifting NGO coordinators from reactive recovery to proactive financial shielding."*

---

### [0:40 - 1:20] Segment 2: Multi-Modal Ingestion & Intelligence Core

* **Visual on Screen:**
  - Quick split-screen of the ingestion pipeline in action:
    1. Real-time OpenWeatherMap convective rain forecasts for Colombo.
    2. OpenStreetMap transit corridor telemetry tracking the 64% speed drop along Olcott Mawatha.
    3. NLP entity extractor parsing local news bulletins from Ada Derana (highlighting *"Bodhiraja Mawatha flooded"* and *"Route 138 suspended"*).
  - Terminal or graphic showing the multi-horizon neural model computing Quantile Loss bounds ($P_{50}, P_{90}$).
* **Narration:**
  > *"VendorPulse operates by algorithmically extracting compounded risk from three disparate urban data streams.*
  >
  > *First, it pulls hyper-local 72-hour precipitation forecasts from OpenWeatherMap. Second, it monitors corridor speed drops using OpenStreetMap routing. Third, our localized NLP engine scans civic news feeds, isolating Colombo landmarks like Bodhiraja Mawatha and technical bus suspensions.*
  >
  > *A multi-horizon neural model trained on two years of historical Colombo disruption data then calculates the probability of cash-flow collapse. While moderate rain or minor traffic delays alone are manageable, our model detects when their compounded interaction triggers a catastrophic cliff-edge."*

---

### [1:20 - 2:20] Segment 3: Live Coordinator Experience & 1-Click Bridge Deployment

* **Visual on Screen:**
  - Screen recording of the **VendorPulse Live Dark-Mode Threat Map**.
  - Cursor hovers over Colombo commercial districts: Fort, Maradana, Maligawatta, and the pulsating red heat zone over **Pettah Intersection**.
  - Show the coordinator clicking on **Pettah Intersection (Block P-04)**.
  - The **Zone Detail Card** opens smoothly (matching the Page 9 proposal mockup):
    - Red alert: *"COLLAPSE IMMINENT · Action window closes in 47h 38m"*.
    - Impact Forecast: **90% Confidence**, **142 Registered Vendors**, **Rs 2.5M Capital Required**.
    - Live risk drivers: *01 Flooded primary drainage*, *02 Bus Route 138 suspended*.
    - Verified checklist: *Vendor registry and capital pool pre-ready*.
  - Presenter clicks the vibrant green button: **"Authorize Bridge Deployment"**.
  - Modal pops up instantly: *"Bridge Deployment Authorized — DISP-20261027-P-04 — 142 Hawkers Protected — Rs 2,500,000 Synced to Supabase"*.
* **Narration:**
  > *"Here is how a Micro-finance NGO Field Outreach Coordinator interacts with VendorPulse on a Thursday morning.*
  >
  > *Opening the live Threat Map, they immediately spot a critical red alert over Pettah Block P-04. Tapping into the zone card reveals the full predictive breakdown: 48 hours before Friday trading, the system identifies a 90% probability of severe cash-flow failure.*
  >
  > *The coordinator sees that 142 registered vendors are at risk, requiring Rs 2.5 million in bridge capital. Below, the live drivers confirm the compounded cause: primary drainage overflowing by 52 centimeters coupled with the total suspension of Bus Route 138.*
  >
  > *With one tap on 'Authorize Bridge Deployment', the coordinator dispatches zero-interest emergency bridge loans, logging the audit record directly to Supabase and notifying ground field officers before predatory lenders can intervene."*

---

### [2:20 - 3:00] Segment 4: Empirical Evaluation, Baselines & Social Impact

* **Visual on Screen:**
  - The **Evaluation Modal** pops up displaying the benchmark comparison table:
    - VendorPulse (F1: **0.773**, Accuracy: **96.7%**, FPR: **2.3%**).
    - Naïve Persistence (F1: **0.122**).
    - Traditional ARIMA (F1: **0.000**).
  - Graphic illustrating the community impact: 142 families shielded, saving Rs 500,000+ per week in predatory interest.
  - Closing slide with Team Nexio, Sahas Abeygunarathne, IEEE CIS IIT, and the GitHub repository link.
* **Narration:**
  > *"We rigorously evaluated VendorPulse against the project proposal's criteria on a 600-day out-of-sample holdout dataset.*
  >
  > *VendorPulse achieved an F1-score of 0.773, drastically outperforming the Naïve persistence baseline of 0.122 and the traditional ARIMA model, which scored 0.000 because linear models cannot anticipate sudden non-linear shocks.*
  >
  > *Crucially, our False Positive Rate was just 2.3%—far below the 20% failure threshold—ensuring NGO capital is never squandered on false alarms.*
  >
  > *By transforming lagging relief into proactive shielding, VendorPulse protects urban informal vendors from debt traps, safeguarding livelihoods one street block at a time. Thank you."*
