import React from 'react';

export default function ThreatMap({ selectedZone, onSelectZone, predictions }) {
  // SVG Coordinates mapped to Colombo commercial geography
  const zones = [
    {
      id: 'ZONE-PETTAH-01',
      block: 'P-04',
      name: 'Pettah',
      label: 'CRITICAL',
      sublabel: 'Collapse in 48 hrs',
      cx: 260,
      cy: 290,
      radius: 46,
      color: '#EF4444',
      status: 'CRITICAL',
      pulse: true
    },
    {
      id: 'ZONE-FORT-01',
      block: 'F-02',
      name: 'FORT',
      label: 'Fort Station',
      cx: 170,
      cy: 220,
      radius: 28,
      color: '#F59E0B',
      status: 'MONITOR',
      pulse: false
    },
    {
      id: 'ZONE-MARADANA-01',
      block: 'MD-05',
      name: 'MARADANA',
      label: 'Maradana',
      cx: 350,
      cy: 260,
      radius: 36,
      color: '#F97316',
      status: 'HIGH_RISK',
      pulse: false
    },
    {
      id: 'ZONE-MALIGAWATTA-01',
      block: 'M-12',
      name: 'MALIGAWATTA',
      label: 'Maligawatta',
      cx: 410,
      cy: 330,
      radius: 38,
      color: '#F97316',
      status: 'HIGH_RISK',
      pulse: false
    }
  ];

  return (
    <div className="relative w-full h-[340px] bg-[#f8fafc] rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm select-none">
      {/* Background Colombo Map Graphic (Light Minimalist Theme) */}
      <svg
        viewBox="0 0 500 480"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial Gradients for Soft Translucent Heat Blooms */}
          <radialGradient id="heatRedLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.70" />
            <stop offset="50%" stopColor="#F87171" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.0" />
          </radialGradient>
          <radialGradient id="heatOrangeLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.65" />
            <stop offset="55%" stopColor="#FB923C" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.0" />
          </radialGradient>
          <radialGradient id="heatYellowLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.60" />
            <stop offset="60%" stopColor="#FBBF24" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* Clean Landmass background */}
        <rect width="500" height="480" fill="#f8fafc" />

        {/* Soft Beira Lake outline */}
        <path
          d="M 120 360 C 160 340, 210 380, 240 400 C 270 420, 230 460, 180 470 C 140 480, 110 420, 120 360 Z"
          fill="#e0f2fe"
          stroke="#bae6fd"
          strokeWidth="1.5"
        />
        <text x="175" y="420" fill="#0284c7" opacity="0.6" fontSize="9.5" fontWeight="700" letterSpacing="1.2">
          BEIRA LAKE
        </text>

        {/* Harbor and Coastal outline */}
        <path
          d="M 60 80 L 160 80 L 170 140 L 120 220 L 90 320 L 70 440"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2.5"
          strokeDasharray="6 3"
        />

        {/* Colombo Street & Road Grid Lines (Clean Light Grey) */}
        <line x1="90" y1="180" x2="450" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="120" y1="260" x2="470" y2="260" stroke="#cbd5e1" strokeWidth="2.5" />
        <line x1="150" y1="340" x2="480" y2="340" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="200" y1="100" x2="200" y2="440" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="290" y1="120" x2="290" y2="460" stroke="#cbd5e1" strokeWidth="3" />
        <line x1="390" y1="140" x2="390" y2="460" stroke="#e2e8f0" strokeWidth="1.5" />

        {/* Connecting Arteries */}
        <path d="M 170 220 Q 240 270 350 260" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M 260 290 L 410 330" fill="none" stroke="#cbd5e1" strokeWidth="2" />

        {/* Street Labels (Clean & Minimal) */}
        <text x="140" y="244" fill="#94a3b8" fontSize="9" fontWeight="600">Olcott Mawatha</text>
        <text x="282" y="318" fill="#94a3b8" fontSize="9" fontWeight="600">Bodhiraja Mawatha</text>

        {/* District Place Names */}
        <text x="150" y="160" fill="#64748b" fontSize="11" fontWeight="800" letterSpacing="1.5">FORT</text>
        <text x="325" y="225" fill="#64748b" fontSize="11" fontWeight="800" letterSpacing="1.5">MARADANA</text>
        <text x="400" y="370" fill="#64748b" fontSize="10" fontWeight="800" letterSpacing="1.5">MALIGAWATTA</text>

        {/* Interactive Zone Heat Circles */}
        {zones.map((zone) => {
          const isSelected = selectedZone?.zone_id === zone.id || (zone.id === 'ZONE-PETTAH-01' && !selectedZone);
          const gradientId = zone.status === 'CRITICAL' ? 'url(#heatRedLight)' : zone.status === 'HIGH_RISK' ? 'url(#heatOrangeLight)' : 'url(#heatYellowLight)';

          return (
            <g
              key={zone.id}
              onClick={() => onSelectZone(zone.id)}
              className="cursor-pointer transition-all duration-200"
            >
              {/* Outer soft pulse for critical zones */}
              {zone.pulse && (
                <circle
                  cx={zone.cx}
                  cy={zone.cy}
                  r={zone.radius + 16}
                  fill={zone.color}
                  opacity="0.20"
                  className="animate-ping"
                  style={{ animationDuration: '3s' }}
                />
              )}

              {/* Heat bloom radius */}
              <circle
                cx={zone.cx}
                cy={zone.cy}
                r={zone.radius + (isSelected ? 8 : 0)}
                fill={gradientId}
                className="transition-all duration-300"
              />

              {/* Core zone point with clean white halo */}
              <circle
                cx={zone.cx}
                cy={zone.cy}
                r={isSelected ? 9 : 7}
                fill={zone.color}
                stroke="#ffffff"
                strokeWidth={isSelected ? 3 : 2}
                className="filter drop-shadow-sm"
              />

              {/* Critical Threat Callout Card (Clean Minimalist White Card) */}
              {zone.status === 'CRITICAL' && (
                <g>
                  {/* Drop shadow filter or clean background */}
                  <rect
                    x={zone.cx - 58}
                    y={zone.cy - 52}
                    width="116"
                    height="32"
                    rx="8"
                    fill="#ffffff"
                    stroke="#fecdd3"
                    strokeWidth="1.5"
                    className="filter drop-shadow-md"
                  />
                  <text
                    x={zone.cx}
                    y={zone.cy - 39}
                    fill="#e11d48"
                    fontSize="9.5"
                    fontWeight="800"
                    textAnchor="middle"
                    letterSpacing="0.8"
                  >
                    CRITICAL
                  </text>
                  <text
                    x={zone.cx}
                    y={zone.cy - 26}
                    fill="#475569"
                    fontSize="8.5"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    Collapse in 48 hrs
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Top Floating Status Pill */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200/90 shadow-sm flex items-center space-x-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 live-pulse" />
        <span className="text-[10px] font-semibold text-slate-700 tracking-wide">LIVE THREAT SENSORS</span>
      </div>

      {/* Clean Bottom Map Legend (Matching Page 9 Mockup in Light Theme) */}
      <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-slate-200 shadow-sm flex items-center space-x-3.5">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[10px] text-slate-600 font-medium">Monitor</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-[10px] text-slate-600 font-medium">High Risk</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[10px] text-slate-900 font-bold">Critical</span>
        </div>
      </div>
    </div>
  );
}
