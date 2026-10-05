import { useState } from 'react'
import {
  Radio,
  Plane,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react'
import cyberWorldMap from '../../assets/cyber-world-map.jpg'

export default function CyberWorldMap({ onSelectRoute }) {
  const [activeNode, setActiveNode] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'transatlantic' | 'eurasia' | 'pacific' | 'americas'

  const hubs = [
    {
      id: 'jfk',
      code: 'JFK',
      name: 'New York Air Cargo (JFK)',
      country: 'United States',
      region: 'americas',
      cx: 350,
      cy: 270,
      cargo: '482 parcels (8.4 Tons)',
      flight: 'GC-94821-US',
      dest: 'London Heathrow (LHR)',
      status: 'In Transit • 65%',
      eta: '2h 15m',
    },
    {
      id: 'lhr',
      code: 'LHR',
      name: 'London Heathrow (LHR)',
      country: 'United Kingdom',
      region: 'transatlantic',
      cx: 660,
      cy: 220,
      cargo: '640 parcels (12.1 Tons)',
      flight: 'GC-94821-US',
      dest: 'Inbound from JFK',
      status: 'Approaching Terminal',
      eta: '45m',
    },
    {
      id: 'fra',
      code: 'FRA',
      name: 'Frankfurt Central (FRA)',
      country: 'Germany',
      region: 'eurasia',
      cx: 705,
      cy: 230,
      cargo: '520 parcels (9.8 Tons)',
      flight: 'GC-83920-EU',
      dest: 'Dubai Terminal (DXB)',
      status: 'Dispatched • 42%',
      eta: '3h 30m',
    },
    {
      id: 'dxb',
      code: 'DXB',
      name: 'Dubai Global Gateway (DXB)',
      country: 'United Arab Emirates',
      region: 'eurasia',
      cx: 832,
      cy: 371,
      cargo: '390 parcels (7.2 Tons)',
      flight: 'GC-83920-EU',
      dest: 'Tokyo Narita (HND)',
      status: 'Customs Cleared',
      eta: '1h 10m',
    },
    {
      id: 'hnd',
      code: 'HND',
      name: 'Tokyo Narita (HND)',
      country: 'Japan',
      region: 'pacific',
      cx: 1139,
      cy: 253,
      cargo: '310 parcels (6.5 Tons)',
      flight: 'GC-72109-AP',
      dest: 'San Francisco (SFO)',
      status: 'Delivered / Final Intake',
      eta: 'Completed',
    },
    {
      id: 'sin',
      code: 'SIN',
      name: 'Singapore Changi (SIN)',
      country: 'Singapore',
      region: 'pacific',
      cx: 1060,
      cy: 465,
      cargo: '445 parcels (8.0 Tons)',
      flight: 'GC-55201-UK',
      dest: 'Sydney Terminal (SYD)',
      status: 'Refueling / Transfer',
      eta: '1h 50m',
    },
    {
      id: 'syd',
      code: 'SYD',
      name: 'Sydney Terminal (SYD)',
      country: 'Australia',
      region: 'pacific',
      cx: 1174,
      cy: 549,
      cargo: '185 parcels (3.9 Tons)',
      flight: 'GC-55201-UK',
      dest: 'Final Dispatched',
      status: 'In Transit • 55%',
      eta: '4h 12m',
    },
    {
      id: 'gru',
      code: 'GRU',
      name: 'Sao Paulo Air (GRU)',
      country: 'Brazil',
      region: 'americas',
      cx: 468,
      cy: 592,
      cargo: '215 parcels (4.2 Tons)',
      flight: 'GC-61094-SA',
      dest: 'Madrid Hub (MAD)',
      status: 'Pending Intake • 40%',
      eta: '5h 05m',
    },
  ]

  const corridors = [
    {
      id: 'c1',
      name: 'North Atlantic Air Corridor',
      region: 'transatlantic',
      flight: 'GC-94821-US',
      d: 'M 350 270 Q 505 160 660 220',
      color: '#00f2fe',
    },
    {
      id: 'c2',
      name: 'Euro-Express Corridor',
      region: 'transatlantic',
      flight: 'GC-94821-US',
      d: 'M 660 220 Q 682 215 705 230',
      color: '#38bdf8',
    },
    {
      id: 'c3',
      name: 'Trans-Eurasia Air Route',
      region: 'eurasia',
      flight: 'GC-83920-EU',
      d: 'M 705 230 Q 770 270 832 371',
      color: '#00f2fe',
    },
    {
      id: 'c4',
      name: 'Asia-Pacific Direct Express',
      region: 'pacific',
      flight: 'GC-83920-EU',
      d: 'M 832 371 Q 980 230 1139 253',
      color: '#38bdf8',
    },
    {
      id: 'c5',
      name: 'Indian Ocean Freight Path',
      region: 'pacific',
      flight: 'GC-55201-UK',
      d: 'M 832 371 Q 940 430 1060 465',
      color: '#00f2fe',
    },
    {
      id: 'c6',
      name: 'Australasia Air Link',
      region: 'pacific',
      flight: 'GC-55201-UK',
      d: 'M 1060 465 Q 1120 490 1174 549',
      color: '#38bdf8',
    },
    {
      id: 'c7',
      name: 'Pan-American Flight Route',
      region: 'americas',
      flight: 'GC-61094-SA',
      d: 'M 350 270 Q 425 430 468 592',
      color: '#00f2fe',
    },
    {
      id: 'c8',
      name: 'Western Pacific Rim Corridor',
      region: 'pacific',
      flight: 'GC-72109-AP',
      d: 'M 1139 253 Q 1200 400 1174 549',
      color: '#0284c7',
    },
  ]

  const filteredCorridors = corridors.filter(
    (c) => activeFilter === 'all' || c.region === activeFilter
  )

  const handleNodeClick = (hub) => {
    if (onSelectRoute && hub.flight) {
      onSelectRoute(hub.flight)
    }
  }

  return (
    <div className="h-full rounded-2xl bg-[#091526]/90 border border-cyan-500/40 p-4 sm:p-5 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between select-none relative overflow-hidden backdrop-blur-md">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

      {/* =========================================================
          MAP HEADER & TELEMETRY BADGES
          ========================================================= */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 relative z-10 flex-wrap gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#38bdf8]" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>Global Holographic Map & Flight Corridors</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Live 4K HUD
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Live transcontinental freight corridors & automated waypoint radar
            </p>
          </div>
        </div>

        {/* Telemetry Status Badges */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Satellite Link: Active</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GPS 100% Locked</span>
          </span>
        </div>
      </div>

      {/* =========================================================
          CORRIDOR FILTER PILLS
          ========================================================= */}
      <div className="flex items-center gap-1.5 pt-2.5 pb-1 overflow-x-auto text-[11px] font-medium relative z-10 scrollbar-none">
        <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider mr-1 flex items-center gap-1">
          <Layers className="w-3 h-3 text-cyan-400" /> Corridors:
        </span>
        {[
          { key: 'all', label: 'All Corridors (8)' },
          { key: 'transatlantic', label: 'Transatlantic' },
          { key: 'eurasia', label: 'Trans-Eurasia' },
          { key: 'pacific', label: 'Asia-Pacific' },
          { key: 'americas', label: 'Pan-American' },
        ].map((f) => {
          const isActive = activeFilter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`px-2.5 py-1 rounded-lg border transition-all duration-150 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.35)] font-semibold'
                  : 'bg-white/[0.03] border-cyan-500/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* =========================================================
          INTERACTIVE HOLOGRAPHIC WORLD MAP CANVAS
          ========================================================= */}
      <div className="relative w-full rounded-xl overflow-hidden my-2 border border-cyan-500/30 bg-[#040812] shadow-[inset_0_0_40px_rgba(6,182,212,0.15)] flex items-center justify-center">
        <svg
          viewBox="0 0 1376 768"
          className="w-full h-auto max-h-[380px] select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Embedded CSS animation for dashes */}
            <style>{`
              @keyframes cyberDash {
                from { stroke-dashoffset: 48; }
                to { stroke-dashoffset: 0; }
              }
              .cyber-dash-flow {
                animation: cyberDash 1.8s linear infinite;
              }
              .cyber-dash-slow {
                animation: cyberDash 2.6s linear infinite;
              }
            `}</style>

            {/* Glowing Neon Cyan Filters */}
            <filter id="neonArcGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="hubHaloGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear Gradients for Flight Paths */}
            <linearGradient id="cyanArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="azureArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#00f2fe" stopOpacity="1" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* 1. PHOTOREALISTIC HOLOGRAPHIC WORLD MAP BACKGROUND */}
          <image
            href={cyberWorldMap}
            x="0"
            y="0"
            width="1376"
            height="768"
            preserveAspectRatio="xMidYMid slice"
            opacity="0.92"
          />

          {/* 2. SUBTLE LATITUDE/LONGITUDE CYBER GRID OVERLAY */}
          <g stroke="#00f2fe" strokeWidth="0.5" strokeOpacity="0.08" strokeDasharray="3 6">
            <line x1="0" y1="192" x2="1376" y2="192" />
            <line x1="0" y1="384" x2="1376" y2="384" />
            <line x1="0" y1="576" x2="1376" y2="576" />
            <line x1="344" y1="0" x2="344" y2="768" />
            <line x1="688" y1="0" x2="688" y2="768" />
            <line x1="1032" y1="0" x2="1032" y2="768" />
          </g>

          {/* 3. GLOWING ANIMATED FLIGHT CORRIDOR ARCS */}
          <g fill="none">
            {filteredCorridors.map((c) => {
              const isMatch = activeNode && (activeNode.region === c.region || activeNode.flight === c.flight)
              return (
                <g key={c.id}>
                  {/* Outer neon halo arc */}
                  <path
                    d={c.d}
                    stroke={c.color}
                    strokeWidth={isMatch ? 5 : 3}
                    strokeOpacity={isMatch ? 0.6 : 0.25}
                    filter="url(#neonArcGlow)"
                  />
                  {/* Inner dynamic dashing arc */}
                  <path
                    d={c.d}
                    stroke={c.color}
                    strokeWidth={isMatch ? 2.5 : 1.8}
                    strokeDasharray="8 6"
                    strokeOpacity={isMatch ? 1 : 0.85}
                    className="cyber-dash-flow cursor-pointer"
                    onClick={() => onSelectRoute && onSelectRoute(c.flight)}
                  />
                </g>
              )
            })}
          </g>

          {/* 4. RADAR HUBS & TELEMETRY BEACONS */}
          {hubs.map((hub) => {
            const isHovered = activeNode?.id === hub.id
            const isFiltered = activeFilter === 'all' || hub.region === activeFilter
            if (!isFiltered) return null

            return (
              <g
                key={hub.id}
                transform={`translate(${hub.cx}, ${hub.cy})`}
                className="cursor-pointer"
                onMouseEnter={() => setActiveNode(hub)}
                onMouseLeave={() => setActiveNode(null)}
                onClick={() => handleNodeClick(hub)}
              >
                {/* Outer animated radar pulse ring */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHovered ? 28 : 20}
                  fill="none"
                  stroke="#00f2fe"
                  strokeWidth="1.2"
                  opacity={isHovered ? 0.7 : 0.35}
                  className="animate-ping"
                />

                {/* Medium diffuse glow circle */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHovered ? 16 : 11}
                  fill="#00f2fe"
                  opacity={isHovered ? 0.45 : 0.25}
                  filter="url(#hubHaloGlow)"
                />

                {/* Solid high-tech base circle */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHovered ? 8 : 6}
                  fill="#091526"
                  stroke="#00f2fe"
                  strokeWidth="2.5"
                />

                {/* Core bright white light center */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHovered ? 4 : 2.8}
                  fill="#ffffff"
                />

                {/* Hub Code Label Pill */}
                <g transform="translate(10, -10)">
                  <rect
                    x="0"
                    y="0"
                    width="34"
                    height="18"
                    rx="4"
                    fill="#091526"
                    stroke={isHovered ? '#00f2fe' : '#0284c7'}
                    strokeWidth="1.2"
                    opacity="0.92"
                  />
                  <text
                    x="17"
                    y="13"
                    textAnchor="middle"
                    fill={isHovered ? '#38bdf8' : '#e2e8f0'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {hub.code}
                  </text>
                </g>
              </g>
            )
          })}
        </svg>

        {/* =========================================================
            ACTIVE HUB RADAR TELEMETRY TOOLTIP OVERLAY
            ========================================================= */}
        {activeNode && (
          <div
            className="absolute z-20 pointer-events-none p-3.5 rounded-xl bg-[#091526]/95 border border-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.45)] backdrop-blur-xl text-xs text-white max-w-xs transition-all duration-200"
            style={{
              top: `${Math.max(12, Math.min(65, (activeNode.cy / 768) * 100 - 8))}%`,
              left: `${Math.max(8, Math.min(65, (activeNode.cx / 1376) * 100 + 3))}%`,
            }}
          >
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-cyan-500/30">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-cyan-400" />
                <span>{activeNode.name}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {activeNode.country}
              </span>
            </div>

            <div className="mt-2 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Cargo Staged:</span>
                <span className="font-semibold text-white">{activeNode.cargo}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Route Link:</span>
                <span className="font-medium text-cyan-300">{activeNode.dest}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Live Status:</span>
                <span className="font-semibold text-emerald-400">{activeNode.status}</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px]">
              <span className="font-mono text-cyan-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> {activeNode.flight}
              </span>
              <span className="text-slate-400">ETA: {activeNode.eta}</span>
            </div>
            <div className="text-[9px] text-cyan-300/80 mt-1 text-center font-mono italic">
              Click node to inspect tracking modal
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          MAP FOOTER TELEMETRY STATUS ROW
          ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-cyan-500/20 text-xs relative z-10">
        <div className="p-2 rounded-xl bg-white/[0.03] border border-cyan-500/20 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">
            Active Air Routes
          </span>
          <span className="text-sm font-bold text-cyan-300">42 Corridors</span>
        </div>
        <div className="p-2 rounded-xl bg-white/[0.03] border border-cyan-500/20 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">
            Transponder Pings
          </span>
          <span className="text-sm font-bold text-emerald-400">1,842 Live</span>
        </div>
        <div className="p-2 rounded-xl bg-white/[0.03] border border-cyan-500/20 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">
            Global Cargo Hubs
          </span>
          <span className="text-sm font-bold text-sky-300">8 Terminals</span>
        </div>
        <div className="p-2 rounded-xl bg-white/[0.03] border border-cyan-500/20 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">
            Telemetry Latency
          </span>
          <span className="text-sm font-bold text-cyan-400">14 ms (Realtime)</span>
        </div>
      </div>
    </div>
  )
}
