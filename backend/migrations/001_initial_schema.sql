-- VendorPulse / ModelX 2.0 Database Schema for Supabase (PostgreSQL)
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Create Commercial Zones Table
CREATE TABLE IF NOT EXISTS public.zones (
    id TEXT PRIMARY KEY,
    block_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    registered_vendors INTEGER NOT NULL DEFAULT 0,
    daily_volume_lkr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    baseline_vulnerability NUMERIC(4, 2) NOT NULL DEFAULT 0.50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Multi-Modal Disruption Telemetry Table
CREATE TABLE IF NOT EXISTS public.disruptions (
    id BIGSERIAL PRIMARY KEY,
    zone_id TEXT REFERENCES public.zones(id) ON DELETE CASCADE,
    precipitation_mm NUMERIC(6, 2) DEFAULT 0.0,
    weather_condition TEXT DEFAULT 'Normal',
    traffic_congestion_index NUMERIC(4, 2) DEFAULT 1.0,
    speed_drop_percent NUMERIC(5, 2) DEFAULT 0.0,
    nlp_severity_score NUMERIC(4, 2) DEFAULT 0.0,
    risk_drivers JSONB DEFAULT '[]'::jsonb,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Predictive Risk Forecasts Table (TFT / Multi-Horizon Output)
CREATE TABLE IF NOT EXISTS public.risk_predictions (
    id BIGSERIAL PRIMARY KEY,
    zone_id TEXT REFERENCES public.zones(id) ON DELETE CASCADE,
    forecast_window_hours INTEGER DEFAULT 72,
    collapse_probability NUMERIC(5, 2) NOT NULL, -- e.g. 90.0%
    p50_risk NUMERIC(5, 4) NOT NULL,            -- Median Quantile Risk
    p90_risk NUMERIC(5, 4) NOT NULL,            -- 90th Percentile Tail Risk
    status TEXT NOT NULL CHECK (status IN ('MONITOR', 'HIGH_RISK', 'CRITICAL')),
    confidence_score NUMERIC(4, 2) NOT NULL DEFAULT 0.90,
    risk_drivers JSONB DEFAULT '[]'::jsonb,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Emergency Bridge Deployment Audits Table (Coordinator Actions)
CREATE TABLE IF NOT EXISTS public.bridge_dispatches (
    id TEXT PRIMARY KEY,
    zone_id TEXT REFERENCES public.zones(id) ON DELETE CASCADE,
    coordinator_name TEXT NOT NULL,
    vendors_count INTEGER NOT NULL,
    capital_authorized_lkr NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'AUTHORIZED' CHECK (status IN ('AUTHORIZED', 'DISPATCHED', 'COMPLETED', 'CANCELLED')),
    action_window_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes TEXT
);

-- Enable Row Level Security (RLS) and grant read/write permissions for public/anon access
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disruptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridge_dispatches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read zones" ON public.zones FOR SELECT USING (true);
CREATE POLICY "Allow public all zones" ON public.zones FOR ALL USING (true);

CREATE POLICY "Allow public read disruptions" ON public.disruptions FOR SELECT USING (true);
CREATE POLICY "Allow public all disruptions" ON public.disruptions FOR ALL USING (true);

CREATE POLICY "Allow public read risk_predictions" ON public.risk_predictions FOR SELECT USING (true);
CREATE POLICY "Allow public all risk_predictions" ON public.risk_predictions FOR ALL USING (true);

CREATE POLICY "Allow public read bridge_dispatches" ON public.bridge_dispatches FOR SELECT USING (true);
CREATE POLICY "Allow public all bridge_dispatches" ON public.bridge_dispatches FOR ALL USING (true);

-- Seed Baseline Colombo Commercial Zones
INSERT INTO public.zones (id, block_code, name, district, lat, lon, registered_vendors, daily_volume_lkr, baseline_vulnerability)
VALUES
    ('ZONE-PETTAH-01', 'P-04', 'Pettah Central Market', 'Colombo 11', 6.9367, 79.8530, 142, 2500000.00, 0.85),
    ('ZONE-FORT-01', 'F-02', 'Fort Railway & Station Hub', 'Colombo 01', 6.9344, 79.8498, 95, 1650000.00, 0.65),
    ('ZONE-MALIGAWATTA-01', 'M-12', 'Maligawatta Market', 'Colombo 10', 6.9312, 79.8710, 86, 1400000.00, 0.75),
    ('ZONE-MARADANA-01', 'MD-05', 'Maradana Technical Junction', 'Colombo 10', 6.9272, 79.8665, 110, 1900000.00, 0.70),
    ('ZONE-KOLLUPITIYA-01', 'K-03', 'Kollupitiya Market Corridor', 'Colombo 03', 6.9110, 79.8505, 64, 1100000.00, 0.55)
ON CONFLICT (id) DO UPDATE SET
    registered_vendors = EXCLUDED.registered_vendors,
    daily_volume_lkr = EXCLUDED.daily_volume_lkr;
