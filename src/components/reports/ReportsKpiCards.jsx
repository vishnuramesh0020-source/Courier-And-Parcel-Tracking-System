import {
  Package,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react'

export default function ReportsKpiCards({ summary }) {
  const {
    totalShipments = 0,
    deliveredParcels = 0,
    pendingDeliveries = 0,
    failedDeliveries = 0,
    deliverySuccessRate = '100.0',
    onTimeSlaRate = 100.0,
    averageTransitHours = 32.5,
    growthRate = '+100%',
  } = summary || {}

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Shipments */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#091526]/85 border border-cyan-500/30 shadow-[0_4px_25px_rgba(0,0,0,0.35)] backdrop-blur-md relative overflow-hidden group hover:border-cyan-400/60 transition-all">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Shipments
          </span>
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {totalShipments.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-400/40">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              <span>{growthRate}</span>
            </span>
            <span className="text-xs text-slate-400">Live Manifest</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Active Registry</span>
          <span className="text-cyan-400 font-semibold">{totalShipments} Waybills</span>
        </div>
      </div>

      {/* 2. Delivered Parcels */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#091526]/85 border border-emerald-500/30 shadow-[0_4px_25px_rgba(0,0,0,0.35)] backdrop-blur-md relative overflow-hidden group hover:border-emerald-400/60 transition-all">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Delivered Parcels
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
            {deliveredParcels.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/40">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{deliverySuccessRate}% Success</span>
            </span>
            <span className="text-xs text-slate-400">Signed & Cleared</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Final Consignee Deliveries</span>
          <span className="text-emerald-400 font-semibold">{deliveredParcels} Delivered</span>
        </div>
      </div>

      {/* 3. Pending Deliveries */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#091526]/85 border border-amber-500/30 shadow-[0_4px_25px_rgba(0,0,0,0.35)] backdrop-blur-md relative overflow-hidden group hover:border-amber-400/60 transition-all">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Pending Deliveries
          </span>
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight">
            {pendingDeliveries}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/40">
              <span>Active Cycle</span>
            </span>
            <span className="text-xs text-slate-400">In transit & dispatch</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Priority Consignments</span>
          <span className="text-amber-300 font-semibold">
            {failedDeliveries > 0 ? `${failedDeliveries} Held Exceptions` : '0 Holds'}
          </span>
        </div>
      </div>

      {/* 4. Delivery Performance */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#091526]/85 border border-sky-500/30 shadow-[0_4px_25px_rgba(0,0,0,0.35)] backdrop-blur-md relative overflow-hidden group hover:border-sky-400/60 transition-all">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/20 transition-all" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Delivery Performance
          </span>
          <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-400/40 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-300 tracking-tight">
            {onTimeSlaRate}%
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-400/40">
              <Zap className="w-3 h-3 text-sky-400" />
              <span>{averageTransitHours}h Avg Transit</span>
            </span>
            <span className="text-xs text-slate-400">Hub-to-hub</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>First-Attempt Rate</span>
          <span className="text-sky-300 font-semibold">
            {failedDeliveries === 0 ? '100% Passed' : `${(100 - ((failedDeliveries / (totalShipments || 1)) * 100)).toFixed(1)}% Passed`}
          </span>
        </div>
      </div>
    </div>
  )
}
