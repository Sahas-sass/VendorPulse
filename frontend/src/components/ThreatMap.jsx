import React from 'react';

export default function ThreatMap({ selectedZone, onSelectZone, predictions }) {
  // SVG Coordinates mapped to Colombo commercial geography
  const zones = [
    {
      id: 'ZONE-PETTAH-01',
      block: 'P-04',
      name: 'Pettah',
      label: 'CRITICAL\nCollapse in 48 hrs',
      cx: 260,
      cy: 290,
      radius: 42,
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
      color: '#EAB308',
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
      radius: 34,
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
      radius: 36,
      color: '#F97316',
      status: 'HIGH_RISK',
      pulse: false
    }
  ];

  return (
    <div className="relative w-full h-[360px] bg-[#1a1f2c] rounded-2xl overflow-hidden border border-[#2d3748] shadow-inner select-none">
      {/* Background Colombo Map Graphic */}
      <svg
        viewBox="0 0 500 480"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial Gradients for Heat Blooms */}
          <radialGradient id="heatRed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#DC2626" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#991B1B" stopOpacity="0.0" />
          </radialGradient>
          <radialGradient id="heatOrange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#EA580C" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C2410C" stopOpacity="0.0" />
          </radialGradient>
          <radialGradient id="heatYellow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EAB308" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#CA8A04" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#A16207" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* Landmass background */}
        <rect width="500" height="480" fill="#151b26" />

        {/* Beira Lake outline */}
        <path
          d="M 120 360 C 160 340, 210 380, 240 400 C 270 420, 230 460, 180 470 C 140 480, 110 420, 120 360 Z"
          fill="#0d141f"
          stroke="#1f2937"
          strokeWidth="1.5"
        />
        <text x="175" y="420" fill="#4b5563" fontSize="10" fontWeight="600" letterSpacing="1">
          BEIRA LAKE
        </text>

        {/* Harbor and Coastal outline */}
        <path
          d="M 60 80 L 160 80 L 170 140 L 120 220 L 90 320 L 70 440"
          fill="none"
          stroke="#1e293b"
          strokeWidth="3"
        />

        {/* Colombo Road Grid Lines */}
        <line x1="90" y1="180" x2="450" y2="180" stroke="#252f3f" strokeWidth="1.5" strokeDasharray="4 2" />
        <line x1="120" y1="260" x2="470" y2="260" stroke="#2a3447" strokeWidth="2" />
        <line x1="150" y1="340" x2="480" y2="340" stroke="#252f3f" strokeWidth="1.5" />
        <line x1="200" y1="100" x2="200" y2="440" stroke="#252f3f" strokeWidth="1" />
        <line x1="290" y1="120" x2="290" y2="460" stroke="#2d374a" strokeWidth="2.5" />
        <line x1="390" y1="140" x2="390" y2="460" stroke="#252f3f" strokeWidth="1.5" />

        {/* Road Diagonal arteries */}
        <path d="M 170 220 Q 240 270 350 260" fill="none" stroke="#334155" strokeWidth="2" />
        <path d="M 260 290 L 410 330" fill="none" stroke="#334155" strokeWidth="2" />

        {/* Road Street Labels */}
        <text x="140" y="240" fill="#475569" fontSize="9" fontWeight="700">Olcott Mawatha</text>
        <text x="280" y="315" fill="#475569" fontSize="9" fontWeight="700">Bodhiraja Mawatha</text>

        {/* District Place Names */}
        <text x="150" y="160" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="1.5">FORT</text>
        <text x="320" y="225" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="1.5">MARADANA</text>
        <text x="400" y="365" fill="#64748b" fontSize="10" fontWeight="700" letterSpacing="1.5">MALIGAWATTA</text>

        {/* Interactive Zone Heat Circles */}
        {zones.map((zone) => {
          const isSelected = selectedZone?.zone_id === zone.id || (zone.id === 'ZONE-PETTAH-01' && !selectedZone);
          const gradientId = zone.status === 'CRITICAL' ? 'url(#heatRed)' : zone.status === 'HIGH_RISK' ? 'url(#heatOrange)' : 'url(#heatYellow)';

          return (
            <g
              key={zone.id}
              onClick={() => onSelectZone(zone.id)}
              className="cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              {/* Outer pulsing wave for critical zones */}
              {zone.pulse && (
                <circle
                  cx={zone.cx}
                  cy={zone.cy}
                  r={zone.radius + 18}
                  fill={zone.color}
                  opacity="0.25"
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

              {/* Core zone point */}
              <circle
                cx={zone.cx}
                cy={zone.cy}
                r={isSelected ? 9 : 7}
                fill={zone.color}
                stroke="#ffffff"
                strokeWidth={isSelected ? 2.5 : 1.5}
                className="shadow-lg"
              />

              {/* Zone Threat Badge / Callout */}
              {zone.status === 'CRITICAL' && (
                <g>
                  <rect
                    x={zone.cx - 55}
                    y={zone.cy - 52}
                    width="110"
                    height="32"
                    rx="6"
                    fill="#1e1315"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    className="shadow-xl"
                  />
                  <text
                    x={zone.cx}
                    y={zone.cy - 39}
                    fill="#EF4444"
                    fontSize="9.5"
                    fontWeight="800"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    CRITICAL
                  </text>
                  <text
                    x={zone.cx}
                    y={zone.cy - 26}
                    fill="#F87171"
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

      {/* Modern Floating Controls */}
      <div className="absolute top-3 right-3 bg-[#111827]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 shadow flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-[#70E000] live-pulse" />
        <span className="text-[11px] font-mono text-slate-300 font-semibold tracking-wide">LIVE THREAT SENSORS</span>
      </div>

      {/* Map Legend (Matching Proposal Page 9) */}
      <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 bg-[#0f172a]/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700/60 shadow-lg flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
          <span className="text-[10px] text-slate-300 font-medium">Monitor</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
          <span className="text-[10px] text-slate-300 font-medium">High Risk</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="text-[10px] text-slate-300 font-bold">Critical</span>
        </div>
      </div>
    </div>
  );
}
