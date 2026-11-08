import React from 'react';
import { ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck, ChevronRight, Zap } from 'lucide-react';

export default function ZoneDetailCard({ zone, onBack, onAuthorize, isAuthorizing }) {
  if (!zone) return null;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 p-3.5 shadow-sm flex flex-col space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onBack}
          className="p-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">
            Deployment Zone
          </span>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-none">{zone.name}</h2>
        </div>
      </div>

      {/* Collapse Imminent Alert Banner (Soft Pastel Pink/Red) */}
      <div className="bg-rose-50/80 border border-rose-200/90 rounded-2xl p-2.5 flex items-start space-x-2.5">
        <div className="p-1 rounded-full bg-rose-100 text-rose-600 shrink-0 mt-0.5">
          <AlertCircle className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-rose-700 tracking-wide uppercase">
              Collapse Imminent
            </span>
          </div>
          <p className="text-[10px] text-slate-600 mt-0.5 font-medium">
            Action window closes in {zone.action_window || '47h 38m'}
          </p>
        </div>
      </div>

      {/* Mini Zone Visual Map & Tag */}
      <div className="relative bg-slate-50 rounded-2xl p-2.5 border border-slate-200/80 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center space-x-1.5 bg-rose-100/70 border border-rose-200 text-rose-700 text-[9.5px] font-bold px-2 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 live-pulse" />
            <span>CRITICAL ZONE · {zone.block_code}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500 font-medium">
            {zone.location_sub || 'Colombo 11'}
          </span>
        </div>

        {/* Impact Heat Spot Representation */}
        <div className="my-2 h-16 bg-white rounded-xl flex items-center justify-center relative overflow-hidden border border-slate-200/60 shadow-2xs">
          <div className="absolute w-24 h-24 rounded-full bg-rose-500/15 blur-lg" />
          <div className="absolute w-10 h-10 rounded-full bg-rose-400/30 blur-xs" />
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow-sm relative z-10" />
          <span className="absolute bottom-1 right-2 text-[8.5px] font-mono text-slate-400">
            {zone.impact_area || '0.8 km² impact area'}
          </span>
        </div>
      </div>

      {/* Impact Forecast Section */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[11px] font-bold text-slate-800">Impact Forecast</h3>
          <span className="text-[9px] font-mono text-slate-400">MODEL VP-2.1</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Card 1: Probability/Confidence */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2 flex flex-col justify-between">
            <div className="text-base font-black text-emerald-600 tracking-tight">
              {zone.collapse_probability ? `${zone.collapse_probability}%` : '90%'}
            </div>
            <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
              Confidence
            </div>
          </div>

          {/* Card 2: Registered Vendors */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2 flex flex-col justify-between">
            <div className="text-base font-black text-slate-900 tracking-tight">
              {zone.registered_vendors || 142}
            </div>
            <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
              Registered Vendors
            </div>
          </div>

          {/* Card 3: Capital Required */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2 flex flex-col justify-between">
            <div className="text-sm font-black text-slate-900 tracking-tight">
              Rs {((zone.capital_required_lkr || 2500000) / 1000000).toFixed(1)}M
            </div>
            <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
              Capital Required
            </div>
          </div>
        </div>
      </div>

      {/* Risk Drivers Section */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[11px] font-bold text-slate-800">Risk Drivers</h3>
          <span className="text-[9px] font-mono text-emerald-600 font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-pulse" />
            <span>LIVE SIGNALS</span>
          </span>
        </div>

        <div className="space-y-1.5">
          {/* Driver 01 */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 flex items-start space-x-2.5">
            <span className="w-4 h-4 rounded bg-amber-100 text-amber-700 text-[9px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
              01
            </span>
            <div>
              <h4 className="text-[11px] font-bold text-slate-800">
                {zone.risk_drivers?.[0]?.title || 'Flooded primary drainage'}
              </h4>
              <p className="text-[9.5px] text-slate-500 mt-0.5">
                {zone.risk_drivers?.[0]?.subtext || 'Water level +52cm in the last 4 hours'}
              </p>
            </div>
          </div>

          {/* Driver 02 */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 flex items-start space-x-2.5">
            <span className="w-4 h-4 rounded bg-amber-100 text-amber-700 text-[9px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
              02
            </span>
            <div>
              <h4 className="text-[11px] font-bold text-slate-800">
                {zone.risk_drivers?.[1]?.title || 'Bus Route 138 suspended'}
              </h4>
              <p className="text-[9.5px] text-slate-500 mt-0.5">
                {zone.risk_drivers?.[1]?.subtext || 'Foot traffic projected down 64%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Criteria Verified Check */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <div>
            <div className="text-[10.5px] font-bold text-emerald-800">
              Deployment criteria verified
            </div>
            <div className="text-[9px] text-emerald-600/80">
              Vendor registry and capital pool pre-ready
            </div>
          </div>
        </div>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      </div>

      {/* Primary Action Button (Clean Vibrant Green CTA matching Page 9 mockup) */}
      <button
        onClick={() => onAuthorize(zone)}
        disabled={isAuthorizing}
        className="w-full bg-[#84cc16] hover:bg-[#65a30d] active:scale-[0.99] text-black font-extrabold text-xs py-3 px-4 rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-between disabled:opacity-50"
      >
        <span className="flex items-center space-x-2">
          <Zap className="w-3.5 h-3.5 fill-black" />
          <span>{isAuthorizing ? 'Transmitting Dispatch...' : 'Authorize Bridge Deployment'}</span>
        </span>
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
