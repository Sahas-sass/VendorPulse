import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function PriorityThreatsList({ predictions, selectedZone, onSelectZone }) {
  return (
    <div className="w-full mt-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <h2 className="text-xs font-bold text-slate-900 tracking-tight">Priority Threats</h2>
          <p className="text-[10.5px] text-slate-500">2 zones require field action</p>
        </div>
        <span className="bg-rose-50 text-rose-600 border border-rose-200/80 text-[10px] font-bold px-2 py-0.5 rounded-full">
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
              className={`w-full p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900/10'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                {/* Left accent bar */}
                <div
                  className={`w-1 self-stretch rounded-full ${
                    isCritical ? 'bg-rose-500' : isHigh ? 'bg-orange-500' : 'bg-amber-400'
                  }`}
                />

                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-xs font-bold text-slate-900">{zone.name}</h3>
                    {isCritical && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 live-pulse" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Block {zone.block_code} · {zone.registered_vendors} vendors exposed
                  </p>
                  <p className="text-[9.5px] text-slate-400 font-medium">
                    {zone.status === 'CRITICAL'
                      ? 'Transit + Weather'
                      : zone.block_code === 'M-12'
                      ? 'Supply Disruption'
                      : 'Flash Flood Overflow'}
                  </p>
                </div>
              </div>

              {/* Right Side: Urgency Badge & Chevron */}
              <div className="flex items-center space-x-1.5">
                <span
                  className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                    isCritical
                      ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                      : isHigh
                      ? 'bg-orange-50 text-orange-700 border-orange-200/80'
                      : 'bg-amber-50 text-amber-700 border-amber-200/80'
                  }`}
                >
                  T-{zone.time_to_collapse_hours || 48} HRS
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
