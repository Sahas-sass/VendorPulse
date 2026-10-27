import React from 'react';
import { ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck, ChevronRight, Zap } from 'lucide-react';

export default function ZoneDetailCard({ zone, onBack, onAuthorize, isAuthorizing }) {
  if (!zone) return null;

  const isCritical = zone.status === 'CRITICAL';

  return (
    <div className="w-full bg-[#121824] rounded-2xl border border-slate-800 p-4 shadow-2xl flex flex-col space-y-4">
      {/* Top Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Deployment Zone
          </span>
          <h2 className="text-base font-bold text-white tracking-tight">{zone.name}</h2>
        </div>
      </div>

      {/* Collapse Imminent Alert Banner */}
      <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 flex items-start space-x-3">
        <div className="p-1 rounded-full bg-red-500/20 text-red-400 shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-red-400 tracking-wide uppercase">
              Collapse Imminent
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5 font-medium">
            Action window closes in {zone.action_window || '47h 38m'}
          </p>
        </div>
      </div>

      {/* Mini Zone Visual Map & Tag */}
      <div className="relative bg-[#192231] rounded-xl p-3 border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center space-x-1.5 bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
            <span>CRITICAL ZONE · {zone.block_code}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 font-medium">
            {zone.location_sub || 'Colombo 11'}
          </span>
        </div>

        {/* Impact Heat Spot Representation */}
        <div className="my-3 h-20 bg-[#0f1723] rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-800/80">
          <div className="absolute w-28 h-28 rounded-full bg-red-600/30 blur-xl animate-pulse" />
          <div className="absolute w-12 h-12 rounded-full bg-red-500/50 blur-sm" />
          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg relative z-10" />
          <span className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-500">
            {zone.impact_area || '0.8 km² impact area'}
          </span>
        </div>
      </div>

      {/* Impact Forecast Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-200">Impact Forecast</h3>
          <span className="text-[10px] font-mono text-slate-500">MODEL VP-2.1</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Card 1: Probability/Confidence */}
          <div className="bg-[#17202e] border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
            <div className="text-lg font-black text-[#70E000] tracking-tight">
              {zone.collapse_probability ? `${zone.collapse_probability}%` : '90%'}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
              Confidence
            </div>
          </div>

          {/* Card 2: Registered Vendors */}
          <div className="bg-[#17202e] border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
            <div className="text-lg font-black text-slate-100 tracking-tight">
              {zone.registered_vendors || 142}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
              Registered Vendors
            </div>
          </div>

          {/* Card 3: Capital Required */}
          <div className="bg-[#17202e] border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
            <div className="text-base font-black text-slate-100 tracking-tight">
              Rs {((zone.capital_required_lkr || 2500000) / 1000000).toFixed(1)}M
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
              Capital Required
            </div>
          </div>
        </div>
      </div>

      {/* Risk Drivers Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-200">Risk Drivers</h3>
          <span className="text-[10px] font-mono text-[#70E000] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#70E000] live-pulse" />
            <span>LIVE SIGNALS</span>
          </span>
        </div>

        <div className="space-y-2">
          {/* Driver 01 */}
          <div className="bg-[#17202e] border border-slate-800/90 rounded-xl p-2.5 flex items-start space-x-3">
            <span className="w-5 h-5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
              01
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-100">
                {zone.risk_drivers?.[0]?.title || 'Flooded primary drainage'}
              </h4>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                {zone.risk_drivers?.[0]?.subtext || 'Water level +52cm in the last 4 hours'}
              </p>
            </div>
          </div>

          {/* Driver 02 */}
          <div className="bg-[#17202e] border border-slate-800/90 rounded-xl p-2.5 flex items-start space-x-3">
            <span className="w-5 h-5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
              02
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-100">
                {zone.risk_drivers?.[1]?.title || 'Bus Route 138 suspended'}
              </h4>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                {zone.risk_drivers?.[1]?.subtext || 'Foot traffic projected down 64%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Criteria Verified Check */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-[#70E000]" />
          <div>
            <div className="text-xs font-bold text-emerald-400">
              Deployment criteria verified
            </div>
            <div className="text-[10px] text-slate-400">
              Vendor registry and capital pool pre-ready
            </div>
          </div>
        </div>
        <CheckCircle2 className="w-4 h-4 text-[#70E000]" />
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => onAuthorize(zone)}
        disabled={isAuthorizing}
        className="w-full bg-[#70E000] hover:bg-[#60c400] active:scale-[0.99] text-black font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-between disabled:opacity-50"
      >
        <span className="flex items-center space-x-2">
          <Zap className="w-4 h-4 fill-black" />
          <span>{isAuthorizing ? 'Transmitting Dispatch...' : 'Authorize Bridge Deployment'}</span>
        </span>
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
