import { useState } from 'react'
import {
  TrendingUp,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react'
import {
  getMonthlyShipmentData,
  getDailyTrendData,
} from '../../services/reportService'

export default function ShipmentTrendsChart() {
  const [viewMode, setViewMode] = useState('MONTHLY') // 'MONTHLY' | 'DAILY'
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const monthlyData = getMonthlyShipmentData()
  const dailyData = getDailyTrendData()

  const data =
    viewMode === 'MONTHLY'
      ? monthlyData.map((d) => ({
          label: d.shortMonth,
          fullLabel: d.month,
          total: d.totalShipments,
          delivered: d.delivered,
          slaRate: d.slaRate,
        }))
      : dailyData.map((d) => ({
          label: d.day,
          fullLabel: d.day + ', 2026',
          total: d.total,
          delivered: d.delivered,
          slaRate: d.total > 0 ? Number(((d.delivered / d.total) * 100).toFixed(1)) : 100.0,
        }))

  // SVG Chart Dimensions
  const width = 800
  const height = 280
  const paddingX = 40
  const paddingY = 30
  const chartWidth = width - paddingX * 2
  const chartHeight = height - paddingY * 2

  const maxVal = Math.max(...data.map((d) => d.total), 1) * 1.15

  // Point Coordinate Generators
  const getX = (index) =>
    paddingX + (index / (data.length - 1 || 1)) * chartWidth
  const getY = (val) =>
    height - paddingY - (val / maxVal) * chartHeight

  // Generate smooth SVG paths
  const generatePath = (key) => {
    return data
      .map((d, i) => {
        const x = getX(i)
        const y = getY(d[key])
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')
  }

  // Generate closed area path for gradients
  const generateAreaPath = (key) => {
    const linePath = generatePath(key)
    const firstX = getX(0)
    const lastX = getX(data.length - 1)
    const baselineY = height - paddingY
    return `${linePath} L ${lastX.toFixed(1)} ${baselineY} L ${firstX.toFixed(1)} ${baselineY} Z`
  }

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : null

  const peakMonth = [...monthlyData].sort((a, b) => b.totalShipments - a.totalShipments)[0] || {
    month: 'October 2026',
    totalShipments: 0,
  }
  const avgDispatch = monthlyData.length > 0
    ? Math.round(monthlyData.reduce((acc, d) => acc + d.totalShipments, 0) / monthlyData.length)
    : 0
  const firstMonthTotal = monthlyData[0]?.totalShipments || 1
  const lastMonthTotal = monthlyData[monthlyData.length - 1]?.totalShipments || 1
  const growthNum = Number((((lastMonthTotal - firstMonthTotal) / firstMonthTotal) * 100).toFixed(1))
  const growthRate = `${growthNum >= 0 ? '+' : ''}${growthNum}`

  return (
    <div className="w-full rounded-2xl bg-[#091526]/90 border border-cyan-500/30 p-5 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col gap-4 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-96 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-white">
              Shipment Trends & Volume Velocity
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hidden md:inline-block">
              Interactive SVG Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Historical consignment booking rate compared against verified consignee deliveries
          </p>
        </div>

        {/* View Mode Toggle & Legend */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
              <span className="text-slate-300">Total Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              <span className="text-slate-300">Delivered</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#050b14] p-1 rounded-xl border border-cyan-500/30">
            <button
              type="button"
              onClick={() => {
                setViewMode('MONTHLY')
                setHoveredIndex(null)
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'MONTHLY'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>Monthly</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('DAILY')
                setHoveredIndex(null)
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'DAILY'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>14-Day Daily</span>
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 sm:h-72 overflow-visible"
        >
          <defs>
            {/* Cyan Gradient for Total Shipments Area */}
            <linearGradient id="cyanAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>

            {/* Emerald Gradient for Delivered Area */}
            <linearGradient id="emeraldAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - paddingY - pct * chartHeight
            const val = Math.round(pct * maxVal)
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px] font-mono"
                >
                  {val}
                </text>
              </g>
            )
          })}

          {/* Shaded Area Fills */}
          <path d={generateAreaPath('total')} fill="url(#cyanAreaGradient)" />
          <path d={generateAreaPath('delivered')} fill="url(#emeraldAreaGradient)" />

          {/* Lines */}
          <path
            d={generatePath('total')}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_0_8px_#06b6d4]"
          />
          <path
            d={generatePath('delivered')}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_0_6px_#10b981]"
          />

          {/* Data Points & Interaction Hover Targets */}
          {data.map((d, i) => {
            const x = getX(i)
            const yTotal = getY(d.total)
            const yDelivered = getY(d.delivered)
            const isHovered = hoveredIndex === i

            return (
              <g key={i} className="cursor-pointer">
                {/* Vertical Cursor Guide when hovered */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={height - paddingY}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="opacity-70"
                  />
                )}

                {/* Total Point */}
                <circle
                  cx={x}
                  cy={yTotal}
                  r={isHovered ? 6 : 4}
                  fill="#06b6d4"
                  stroke="#081220"
                  strokeWidth="2"
                  className="transition-all"
                />

                {/* Delivered Point */}
                <circle
                  cx={x}
                  cy={yDelivered}
                  r={isHovered ? 5 : 3.5}
                  fill="#10b981"
                  stroke="#081220"
                  strokeWidth="2"
                  className="transition-all"
                />

                {/* X-Axis Labels */}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className={`text-[10px] font-mono transition-colors ${
                    isHovered
                      ? 'fill-cyan-300 font-bold'
                      : 'fill-slate-400'
                  }`}
                >
                  {d.label}
                </text>

                {/* Transparent Full-Height Touch/Mouse Hover Target */}
                <rect
                  x={x - (chartWidth / (data.length - 1)) / 2}
                  y={paddingY}
                  width={chartWidth / (data.length - 1)}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onClick={() => setHoveredIndex(i)}
                />
              </g>
            )
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {activePoint && (
          <div
            className="absolute top-2 right-4 sm:right-8 p-3 rounded-xl bg-[#050b14]/95 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md pointer-events-none z-20 flex flex-col gap-1 text-xs"
          >
            <div className="font-extrabold text-cyan-300 border-b border-cyan-500/20 pb-1 flex items-center justify-between gap-4">
              <span>{activePoint.fullLabel}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                SLA: {activePoint.slaRate != null ? `${activePoint.slaRate}%` : '100%'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Total Booked:</span>
              </span>
              <strong className="text-white font-mono">{activePoint.total}</strong>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Delivered:</span>
              </span>
              <strong className="text-emerald-400 font-mono">{activePoint.delivered}</strong>
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400 pt-0.5">
              <span>Delivery Rate:</span>
              <span className="text-cyan-300 font-bold font-mono">
                {activePoint.total > 0
                  ? `${((activePoint.delivered / activePoint.total) * 100).toFixed(1)}%`
                  : '0.0%'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-cyan-500/15 text-xs">
        <div className="p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/20">
          <div className="text-[10px] uppercase font-bold text-slate-400">Peak Volume Month</div>
          <div className="text-sm font-extrabold text-white mt-0.5">
            {peakMonth.month} ({peakMonth.totalShipments})
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/20">
          <div className="text-[10px] uppercase font-bold text-slate-400">Monthly Avg Dispatch</div>
          <div className="text-sm font-extrabold text-cyan-300 mt-0.5">
            {avgDispatch} Consignments
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/20">
          <div className="text-[10px] uppercase font-bold text-slate-400">Annual Growth Rate</div>
          <div className="text-sm font-extrabold text-emerald-400 mt-0.5">
            {growthRate}% YTD
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/20 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Telemetry Status</div>
            <div className="text-sm font-extrabold text-cyan-400 mt-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Calibrated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
