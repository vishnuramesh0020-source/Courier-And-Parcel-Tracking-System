import {
  PlusCircle,
  Search,
  UserPlus,
  QrCode,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react'

export default function QuickActionCards({
  onNewShipment,
  onTrackParcel,
  onAddCustomer,
  onDispatchScan,
  onExportReport,
  layout = 'vertical', // 'vertical' | 'grid'
}) {
  const actions = [
    {
      id: 'track',
      title: 'Track Parcel',
      desc: 'Instant GPS waypoint lookup & real-time ETA history',
      icon: Search,
      action: onTrackParcel,
    },
    {
      id: 'shipment',
      title: 'Create Shipment',
      desc: 'Book new parcel manifest & issue international waybill',
      icon: PlusCircle,
      action: onNewShipment,
    },
    {
      id: 'export',
      title: 'View Reports',
      desc: 'Download audited daily manifest & dispatch analytics',
      icon: FileSpreadsheet,
      action: onExportReport,
    },
    {
      id: 'scan',
      title: 'Hub Dispatch Scan',
      desc: 'Simulate barcode scan to advance parcels to next terminal',
      icon: QrCode,
      action: onDispatchScan,
    },
    {
      id: 'customer',
      title: 'Register Client',
      desc: 'Onboard corporate shipper or individual courier customer',
      icon: UserPlus,
      action: onAddCustomer,
    },
  ]

  // Vertical layout exactly matching Image 2
  if (layout === 'vertical') {
    return (
      <div className="h-full rounded-2xl bg-[#091526]/90 border border-cyan-500/40 p-4 sm:p-5 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              Quick Action
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
              Operations
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {actions.map((act) => {
              const Icon = act.icon
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={act.action}
                  className="w-full p-3 rounded-xl border border-cyan-500/40 hover:border-cyan-300 bg-[#0c203b]/80 hover:bg-cyan-500/15 text-white flex items-center justify-between transition-all duration-200 group cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.08)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {act.title}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {act.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-cyan-500/20 text-center">
          <span className="text-[10px] text-slate-400 font-mono">
            COMMAND HOTKEYS: [ALT + 1..5]
          </span>
        </div>
      </div>
    )
  }

  // Grid layout
  return (
    <div className="w-full rounded-2xl bg-[#091526]/90 border border-cyan-500/40 p-4 sm:p-5 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
          Quick Operations & Action Cards
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {actions.map((act) => {
          const Icon = act.icon
          return (
            <button
              key={act.id}
              type="button"
              onClick={act.action}
              className="p-4 rounded-xl bg-[#0c203b]/80 hover:bg-cyan-500/15 border border-cyan-500/40 hover:border-cyan-300 text-left flex flex-col justify-between transition-all duration-200 group cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_22px_rgba(6,182,212,0.3)]"
            >
              <div>
                <div className="p-2 w-fit rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">
                  {act.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {act.desc}
                </p>
              </div>
              <div className="pt-2.5 mt-2.5 border-t border-cyan-500/20 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span>Run Action</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
