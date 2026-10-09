import { useMemo } from 'react'
import {
  ShieldCheck,
  Plane,
  Box,
} from 'lucide-react'
import {
  getCarrierPerformance,
  getParcelCategories,
} from '../../services/reportService'
import { getLocalShipments } from '../../services/shipmentApi'

export default function DeliveryPerformanceChart() {
  const shipments = getLocalShipments()
  const total = shipments.length || 1

  const delivered = shipments.filter((s) => s.deliveryStatus === 'Delivered').length
  const inTransit = shipments.filter((s) => s.deliveryStatus === 'In Transit').length
  const outForDelivery = shipments.filter((s) => s.deliveryStatus === 'Out for Delivery').length
  const exceptions = shipments.filter((s) => s.deliveryStatus === 'Failed Delivery').length
  const cancelled = shipments.filter((s) => s.deliveryStatus === 'Cancelled').length
  const pending = shipments.filter(
    (s) => s.deliveryStatus === 'Pending' || s.deliveryStatus === 'Picked Up'
  ).length

  const carrierPerformance = useMemo(() => getCarrierPerformance(shipments), [shipments])
  const parcelCategories = useMemo(() => getParcelCategories(shipments), [shipments])

  const slaRate =
    total > 0
      ? Number((((total - exceptions) / total) * 100).toFixed(1))
      : 100.0

  // Status breakdown slices
  const slices = [
    { label: 'Delivered', value: Number(((delivered / total) * 100).toFixed(1)), color: '#10b981', count: delivered },
    { label: 'In Transit', value: Number(((inTransit / total) * 100).toFixed(1)), color: '#06b6d4', count: inTransit },
    { label: 'Out for Delivery', value: Number(((outForDelivery / total) * 100).toFixed(1)), color: '#38bdf8', count: outForDelivery },
    { label: 'Pending & Intake', value: Number(((pending / total) * 100).toFixed(1)), color: '#f59e0b', count: pending },
    { label: 'Exceptions / Held', value: Number(((exceptions / total) * 100).toFixed(1)), color: '#ef4444', count: exceptions },
    { label: 'Cancelled', value: Number(((cancelled / total) * 100).toFixed(1)), color: '#64748b', count: cancelled },
  ].filter((s) => s.count > 0 || shipments.length === 0)

  // SVG Donut Chart Calculation
  const size = 180
  const strokeWidth = 22
  const center = size / 2
  const radius = center - strokeWidth
  const circumference = 2 * Math.PI * radius

  let accumulatedPercent = 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
      {/* Left Column (5 cols): Delivery Status Donut Chart */}
      <div className="lg:col-span-5 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col justify-between">
        <div className="pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-white">
              Status Distribution & SLA
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Breakdown of active vs finalized parcel lifecycle states
          </p>
        </div>

        {/* SVG Donut Visual */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-4 my-4">
          <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
              {/* Background circle track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#0f172a"
                strokeWidth={strokeWidth}
              />

              {/* Slices */}
              {slices.map((slice, i) => {
                const strokeDasharray = `${(slice.value / 100) * circumference} ${circumference}`
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
                accumulatedPercent += slice.value

                return (
                  <circle
                    key={i}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all hover:opacity-80"
                  />
                )
              })}
            </svg>

            {/* Inner Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-xl font-extrabold text-emerald-400 font-mono leading-none">
                {slaRate}%
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                SLA Compliance
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shadow-[0_0_6px_#10b981] animate-pulse" />
            </div>
          </div>

          {/* Slices Legend */}
          <div className="flex-1 space-y-1.5 w-full">
            {slices.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-[#050b14]/70 border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-slate-300 font-medium">{s.label}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-white font-bold">{s.value}%</span>
                  <span className="text-[10px] text-slate-500">({s.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Tags Strip */}
        <div className="pt-3 border-t border-cyan-500/15">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
            <Box className="w-3 h-3 text-cyan-400" />
            <span>Freight Category Share</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {parcelCategories.map((cat, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md border"
                style={{
                  color: cat.color,
                  borderColor: `${cat.color}50`,
                  backgroundColor: `${cat.color}15`,
                }}
              >
                {cat.category}: <strong>{cat.percentage}%</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (7 cols): Carrier Performance & Benchmarks */}
      <div className="lg:col-span-7 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col justify-between">
        <div className="pb-3 border-b border-cyan-500/20 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-400">
                <Plane className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-white">
                Carrier & Linehaul Performance
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Service Level Agreement (SLA) metrics and transit speed benchmarks
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hidden sm:inline-block">
            {carrierPerformance.length} Carriers Audited
          </span>
        </div>

        {/* Carrier Bars */}
        <div className="space-y-3.5 my-3">
          {carrierPerformance.map((carrier, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#050b14]/80 border border-cyan-500/20 hover:border-cyan-400/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{carrier.carrier}</span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                      carrier.status === 'OPTIMAL'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                    }`}
                  >
                    {carrier.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-slate-400">
                    Avg: <strong className="text-slate-200">{carrier.avgHours}h</strong>
                  </span>
                  <span className="text-cyan-400 font-bold">
                    {carrier.onTimeRate}% On-Time
                  </span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden flex items-center p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                  style={{ width: `${carrier.onTimeRate}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>{carrier.shipmentsHandled} Consignments Dispatched</span>
                <span>Incident Rate: {carrier.incidentRate}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Benchmark Callout Strip */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-cyan-500/15 text-center text-xs">
          <div className="p-2 rounded-xl bg-[#050b14] border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">1st Attempt Pass</div>
            <div className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5">
              {exceptions === 0 ? '100%' : `${(100 - (exceptions / total * 100)).toFixed(1)}%`}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-[#050b14] border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Avg Linehaul Speed</div>
            <div className="text-sm font-extrabold text-cyan-300 font-mono mt-0.5">890 km/h</div>
          </div>
          <div className="p-2 rounded-xl bg-[#050b14] border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Exception Rate</div>
            <div className="text-sm font-extrabold text-rose-400 font-mono mt-0.5">
              {((exceptions / total) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
