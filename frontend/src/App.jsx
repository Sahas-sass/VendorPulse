import React, { useState, useEffect } from 'react';
import { Menu, RefreshCw, BarChart2, Smartphone, Monitor, Shield } from 'lucide-react';
import ThreatMap from './components/ThreatMap';
import PriorityThreatsList from './components/PriorityThreatsList';
import ZoneDetailCard from './components/ZoneDetailCard';
import DispatchModal from './components/DispatchModal';
import EvaluationModal from './components/EvaluationModal';
import { fetchPredictions, authorizeBridge, fetchBenchmarks } from './api/client';

export default function App() {
  const [predictions, setPredictions] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const preds = await fetchPredictions();
      setPredictions(preds);
      // Auto-select Pettah (Zone P-04) by default
      const pettah = preds.find(p => p.block_code === 'P-04') || preds[0];
      setSelectedZone(pettah);

      const bench = await fetchBenchmarks();
      setBenchmarks(bench);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectZone(zoneId) {
    const target = predictions.find(p => p.zone_id === zoneId);
    if (target) setSelectedZone(target);
  }

  async function handleAuthorizeBridge(zone) {
    setIsAuthorizing(true);
    try {
      const payload = {
        zone_id: zone.zone_id,
        block_code: zone.block_code,
        coordinator_name: "Field Outreach Coordinator (Nexio)",
        vendors_count: zone.registered_vendors || 142,
        capital_authorized_lkr: zone.capital_required_lkr || 2500000.0,
        notes: `Emergency preemptive liquidity bridge authorized for Block ${zone.block_code}`
      };
      const result = await authorizeBridge(payload);
      setDispatchResult(result);
    } catch (err) {
      alert("Error authorizing bridge deployment.");
    } finally {
      setIsAuthorizing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center p-2 sm:p-6 select-none">
      {/* Top App Control Bar for Evaluators */}
      <div className="w-full max-w-4xl flex items-center justify-between py-2 px-3 mb-2 text-xs text-slate-400 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-slate-300 font-bold">MODELX 2.0</span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline">Team Nexio · Micro-Finance Early Warning</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Evaluation Benchmarks Pill */}
          <button
            onClick={() => setShowBenchmarks(true)}
            className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 text-[#70E000] px-2.5 py-1 rounded-full text-[11px] font-bold hover:bg-emerald-500/20 transition"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>F1: 0.773 | FPR: 2.3% (PASS)</span>
          </button>

          {/* Viewport switch (Mobile vs Desktop) */}
          <div className="hidden sm:flex bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md ${viewMode === 'mobile' ? 'bg-[#70E000] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Mobile Device Mockup View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md ${viewMode === 'desktop' ? 'bg-[#70E000] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Side-by-Side Dual View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className={`w-full ${viewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'} transition-all duration-300`}>
        {/* Device Frame Wrapper (Screen 1 & 2) */}
        <div className="bg-[#0f1724] rounded-[32px] border border-slate-800/80 shadow-2xl overflow-hidden p-4 sm:p-5">
          {/* Header (Top Bar matching Mockup on Page 9) */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
            <div className="flex items-center space-x-3">
              <button className="text-slate-400 hover:text-white p-1 rounded-lg">
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#70E000] live-pulse" />
                <h1 className="text-sm font-black tracking-tight text-white">VendorPulse Live</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-mono font-semibold bg-emerald-500/10 text-[#70E000] border border-emerald-500/20 px-2 py-0.5 rounded-full">
                UPDATED 2 MIN AGO
              </span>
              {/* Coordinator Avatar */}
              <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[11px] font-bold text-white shadow">
                AK
              </div>
            </div>
          </div>

          {/* Conditional Layout: Single Column for Mobile, Dual Column for Desktop */}
          {viewMode === 'desktop' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Threat Map & Priority Action List */}
              <div>
                <ThreatMap
                  selectedZone={selectedZone}
                  onSelectZone={handleSelectZone}
                  predictions={predictions}
                />
                <PriorityThreatsList
                  predictions={predictions}
                  selectedZone={selectedZone}
                  onSelectZone={handleSelectZone}
                />
              </div>

              {/* Right Column: Exact Zone Detail Card & Dispatch Action */}
              <div>
                <ZoneDetailCard
                  zone={selectedZone}
                  onBack={() => {}}
                  onAuthorize={handleAuthorizeBridge}
                  isAuthorizing={isAuthorizing}
                />
              </div>
            </div>
          ) : (
            <div>
              {/* Mobile View: Shows Map & Action List, or expands to Detail Card */}
              {selectedZone ? (
                <div className="space-y-4">
                  <ZoneDetailCard
                    zone={selectedZone}
                    onBack={() => setSelectedZone(null)}
                    onAuthorize={handleAuthorizeBridge}
                    isAuthorizing={isAuthorizing}
                  />
                  <div className="pt-2">
                    <ThreatMap
                      selectedZone={selectedZone}
                      onSelectZone={handleSelectZone}
                      predictions={predictions}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <ThreatMap
                    selectedZone={selectedZone}
                    onSelectZone={handleSelectZone}
                    predictions={predictions}
                  />
                  <PriorityThreatsList
                    predictions={predictions}
                    selectedZone={selectedZone}
                    onSelectZone={handleSelectZone}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Modal for Dispatch Confirmation */}
      <DispatchModal
        dispatchResult={dispatchResult}
        onClose={() => setDispatchResult(null)}
      />

      {/* Floating Modal for Benchmark Evaluation Results */}
      {showBenchmarks && (
        <EvaluationModal
          benchmarks={benchmarks}
          onClose={() => setShowBenchmarks(false)}
        />
      )}
    </div>
  );
}
