import React from 'react';
import { ChevronRight, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function PriorityThreatsList({ predictions, selectedZone, onSelectZone }) {
  return (
    <div className="w-full mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-tight">Priority Threats</h2>
          <p className="text-[11px] text-slate-400">2 zones require field action</p>
        </div>
        <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
          02 ACTIVE
        </span>
      </div>

      {/* Threats List */}
      <div className="space-y-2">
        {predictions.map((zone) => {
          const isSelected = selectedZone?.zone_id === zone.zone_id;
          const isCritical = zone.status === 'CRITICAL';
          const isHigh = zone.status === 'HIGH_RISK';

          return (
            <div
              key={zone.zone_id}
              onClick={() => onSelectZone(zone.zone_id)}
              className={`w-full p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-[#1e293b] border-slate-400 shadow-md ring-1 ring-slate-400'
                  : 'bg-[#151c28] border-slate-800/80 hover:bg-[#1a2333] hover:border-slate-700'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Left accent bar */}
                <div
                  className={`w-1 self-stretch rounded-full ${
                    isCritical ? 'bg-red-500' : isHigh ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}
                />

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-slate-100">{zone.name}</h3>
                    {isCritical && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
                    )}
                  </div>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Block {zone.block_code} · {zone.registered_vendors} vendors exposed
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {zone.status === 'CRITICAL'
                      ? 'Transit + Weather'
                      : zone.block_code === 'M-12'
                      ? 'Supply Disruption'
                      : 'Flash Flood Overflow'}
                  </p>
                </div>
              </div>

              {/* Right Side: Urgency Badge & Chevron */}
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md border ${
                    isCritical
                      ? 'bg-red-950/40 text-red-400 border-red-800/60'
                      : isHigh
                      ? 'bg-orange-950/40 text-orange-400 border-orange-800/60'
                      : 'bg-yellow-950/40 text-yellow-400 border-yellow-800/60'
                  }`}
                >
                  T-MINUS {zone.time_to_collapse_hours || 48} HRS
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
