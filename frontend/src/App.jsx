import React, { useState, useEffect } from 'react';
import { 
  Menu, BarChart2, Smartphone, Monitor, Shield, Wifi, Battery, 
  Signal, MapPin, History, Sliders, ChevronLeft, CheckCircle2 
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'dispatches' | 'settings'
  const [dispatchesList, setDispatchesList] = useState([]);
  const [deviceFrame, setDeviceFrame] = useState(true); // true = iPhone frame, false = fluid

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const preds = await fetchPredictions();
      setPredictions(preds);
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
        notes: `Preemptive zero-interest liquidity bridge authorized for Block ${zone.block_code}`
      };
      const result = await authorizeBridge(payload);
      setDispatchResult(result);
      setDispatchesList(prev => [result, ...prev]);
    } catch (err) {
      alert("Error authorizing bridge deployment.");
    } finally {
      setIsAuthorizing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 font-sans">
      {/* Top Evaluation & Controller Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2 px-3 mb-4 bg-[#0d131f] rounded-2xl border border-slate-800 shadow">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#70E000] live-pulse" />
          <span className="font-mono text-xs font-black text-white tracking-wider">VENDORPULSE MOBILE</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">ModelX 2.0 · Team Nexio (IEEE CIS IIT)</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Model Evaluation Benchmark Button */}
          <button
            onClick={() => setShowBenchmarks(true)}
            className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 text-[#70E000] px-3 py-1 rounded-full text-[11px] font-bold hover:bg-emerald-500/20 transition shadow"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>F1: 0.773 (PASS)</span>
          </button>

          {/* Device Frame Toggle */}
          <button
            onClick={() => setDeviceFrame(!deviceFrame)}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700"
            title="Toggle Mobile Chassis Frame"
          >
            {deviceFrame ? <Smartphone className="w-3.5 h-3.5 text-[#70E000]" /> : <Monitor className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{deviceFrame ? 'Mobile Frame' : 'Full Screen'}</span>
          </button>
        </div>
      </header>

      {/* Main Mobile App Container */}
      <div className={`transition-all duration-300 ${deviceFrame ? 'w-full max-w-[390px]' : 'w-full max-w-4xl'}`}>
        {/* Authentic Mobile Device Chassis */}
        <div className={`${deviceFrame ? 'rounded-[48px] border-[6px] border-[#222b3a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-slate-700/50 p-3 bg-[#0d111a]' : 'rounded-3xl border border-slate-800 bg-[#0d111a] p-4 shadow-xl'}`}>
          
          {/* Mobile Screen Interior */}
          <div className="bg-[#101622] rounded-[38px] overflow-hidden flex flex-col min-h-[740px] border border-slate-800/80">
            
            {/* Top iOS / Mobile Status Bar (9:41, Notch, Wi-Fi, Battery) */}
            <div className="pt-3 px-6 pb-2 flex items-center justify-between text-slate-300 text-[11px] select-none font-semibold">
              <span className="font-mono text-xs font-bold text-white">9:41</span>
              {/* Dynamic Island / Speaker Notch */}
              <div className="w-24 h-4 bg-black rounded-full mx-auto -mt-1 shadow-inner flex items-center justify-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#161b26] ring-1 ring-slate-800" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e293b]" />
              </div>
              <div className="flex items-center space-x-1.5">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Mobile App Navigation Header (Page 9 Mockup) */}
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-800/60 bg-[#121927]">
              <div className="flex items-center space-x-2.5">
                <button className="text-slate-400 hover:text-white p-1 rounded-md">
                  <Menu className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#70E000] live-pulse" />
                  <span className="text-xs font-black text-white tracking-tight">VendorPulse Live</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[9.5px] font-mono font-bold bg-emerald-500/10 text-[#70E000] border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  UPDATED 2 MIN AGO
                </span>
                <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-white">
                  AK
                </div>
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {activeTab === 'map' ? (
                <>
                  {selectedZone ? (
                    /* Screen 2: Zone Detail Card & Dispatch Authorization (Exact Page 9 Right Screen) */
                    <div className="animate-in fade-in duration-200 space-y-3">
                      <ZoneDetailCard
                        zone={selectedZone}
                        onBack={() => setSelectedZone(null)}
                        onAuthorize={handleAuthorizeBridge}
                        isAuthorizing={isAuthorizing}
                      />
                      {/* Secondary Map Context Preview */}
                      <div className="pt-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>Corridor Heat Threat Context</span>
                          <span className="text-[10px] text-slate-500">Tap to switch zone</span>
                        </div>
                        <ThreatMap
                          selectedZone={selectedZone}
                          onSelectZone={handleSelectZone}
                          predictions={predictions}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Screen 1: Primary Threat Map + Action List (Exact Page 9 Left Screen) */
                    <div className="animate-in fade-in duration-200">
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
                </>
              ) : activeTab === 'dispatches' ? (
                /* Tab 2: Dispatches & Audit Log */
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Authorized Bridge Dispatches</h3>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {dispatchesList.length} LOGGED
                    </span>
                  </div>

                  {dispatchesList.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-[#141b28] rounded-2xl border border-slate-800">
                      <Shield className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-semibold text-slate-300">No Dispatches Authorized Yet</p>
                      <p className="text-[11px] text-slate-500 mt-1">Select a Critical zone on the Threat Map and authorize emergency bridge capital.</p>
                      <button
                        onClick={() => { setActiveTab('map'); setSelectedZone(predictions[0]); }}
                        className="mt-3 bg-[#70E000] text-black text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#60c400]"
                      >
                        Go to Threat Map
                      </button>
                    </div>
                  ) : (
                    dispatchesList.map((d, i) => (
                      <div key={i} className="p-3 bg-[#151c28] rounded-xl border border-emerald-500/30 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-white">{d.id}</span>
                          <span className="bg-emerald-500/20 text-[#70E000] text-[9.5px] font-extrabold px-1.5 py-0.5 rounded">
                            {d.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Rs {(d.capital_authorized_lkr || 2500000).toLocaleString()} deployed for {d.vendors_count} vendors.
                        </div>
                        <div className="text-[9.5px] text-slate-500 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-[#70E000]" />
                          <span>Logged to Supabase PostgreSQL</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* Tab 3: Model Metrics & Evaluation Tab */
                <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Model Performance & Defense</h3>
                  <div className="bg-[#141b28] p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Horizon:</span>
                      <span className="font-bold text-white">48–72 Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">False Positive Rate:</span>
                      <span className="font-bold text-[#70E000]">2.33% (&lt; 20% PASS)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">F1-Score:</span>
                      <span className="font-bold text-[#70E000]">0.773 (Beat Naïve & ARIMA)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quantile Loss (P50):</span>
                      <span className="font-mono text-slate-200">0.0359</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Native Mobile Bottom Navigation Bar */}
            <div className="px-4 py-2 border-t border-slate-800/80 bg-[#121927] flex items-center justify-around">
              <button
                onClick={() => setActiveTab('map')}
                className={`flex flex-col items-center py-1 transition ${activeTab === 'map' ? 'text-[#70E000]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-[9.5px] font-semibold mt-0.5">Threat Map</span>
              </button>
              <button
                onClick={() => setActiveTab('dispatches')}
                className={`flex flex-col items-center py-1 transition ${activeTab === 'dispatches' ? 'text-[#70E000]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <History className="w-4 h-4" />
                <span className="text-[9.5px] font-semibold mt-0.5">Dispatches</span>
              </button>
              <button
                onClick={() => setShowBenchmarks(true)}
                className="flex flex-col items-center py-1 text-slate-500 hover:text-slate-300 transition"
              >
                <BarChart2 className="w-4 h-4" />
                <span className="text-[9.5px] font-semibold mt-0.5">Metrics</span>
              </button>
            </div>

            {/* Home Indicator Gesture Bar (Bottom of screen) */}
            <div className="pb-1 pt-1.5 flex justify-center bg-[#101622]">
              <div className="w-32 h-1 bg-slate-600/60 rounded-full" />
            </div>

          </div>
        </div>
      </div>

      {/* Floating Modals */}
      <DispatchModal
        dispatchResult={dispatchResult}
        onClose={() => setDispatchResult(null)}
      />

      {showBenchmarks && (
        <EvaluationModal
          benchmarks={benchmarks}
          onClose={() => setShowBenchmarks(false)}
        />
      )}
    </div>
  );
}
