import { useState, useMemo } from 'react'
import {
  Layers,
  CheckSquare,
  Square,
  Package,
  MapPin,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { toast } from 'react-toastify'
import StatusBadge from '../common/StatusBadge'

export default function MultiShipmentTracker({
  allShipments = [],
  selectedCodes = [],
  onSelectCodes,
  onFocusSingleShipment,
}) {
  const [batchInput, setBatchInput] = useState('')

  // Handle batch input submission
  const handleAddBatchCodes = (e) => {
    e.preventDefault()
    if (!batchInput.trim()) return

    const parsedCodes = batchInput
      .split(/[\s,;\n]+/)
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean)

    if (parsedCodes.length === 0) return

    const combined = Array.from(new Set([...selectedCodes, ...parsedCodes]))
    onSelectCodes(combined)
    setBatchInput('')
    toast.success(`Loaded ${parsedCodes.length} tracking numbers into batch command!`)
  }

  // Toggle single shipment in multi-select
  const handleToggleCode = (code) => {
    const upper = code.toUpperCase()
    if (selectedCodes.includes(upper)) {
      onSelectCodes(selectedCodes.filter((c) => c !== upper))
    } else {
      onSelectCodes([...selectedCodes, upper])
    }
  }

  // Select all or Clear all
  const handleSelectAll = () => {
    const allCodes = allShipments.map((s) => s.trackingNumber || s.id)
    onSelectCodes(allCodes)
  }

  const handleClearAll = () => {
    onSelectCodes([])
  }

  // Resolved list of shipments being tracked
  const trackedShipments = useMemo(() => {
    return allShipments.filter((s) => {
      const code = (s.trackingNumber || s.id).toUpperCase()
      return selectedCodes.includes(code)
    })
  }, [allShipments, selectedCodes])

  // Summary statistics for batch
  const batchStats = useMemo(() => {
    const total = trackedShipments.length
    const inTransit = trackedShipments.filter((s) => s.deliveryStatus === 'In Transit').length
    const delivered = trackedShipments.filter((s) => s.deliveryStatus === 'Delivered').length
    const outForDelivery = trackedShipments.filter((s) => s.deliveryStatus === 'Out for Delivery').length
    const customs = trackedShipments.filter((s) => s.deliveryStatus === 'Customs Clearance').length
    const avgProgress = total > 0
      ? Math.round(trackedShipments.reduce((acc, s) => acc + (s.progress || 50), 0) / total)
      : 0

    return { total, inTransit, delivered, outForDelivery, customs, avgProgress }
  }, [trackedShipments])

  return (
    <div className="w-full flex flex-col gap-5">
      {/* =========================================================
          BATCH INPUT & SELECTION PANEL
          ========================================================= */}
      <div className="p-5 rounded-2xl bg-[#091526]/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Batch Multi-Shipment Command Center
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste multiple consignment codes or choose from the manifest registry
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1 rounded-lg bg-[#050b14] border border-cyan-500/30 text-cyan-300 hover:text-white transition-colors cursor-pointer"
            >
              Select All ({allShipments.length})
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1 rounded-lg bg-[#050b14] border border-cyan-500/30 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleAddBatchCodes} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder="Paste multiple tracking numbers (e.g. GC-948210-US, GC-839201-EU, GC-721094-AP)..."
            className="flex-1 h-11 px-4 text-xs sm:text-sm font-mono uppercase rounded-xl bg-[#050b14] border border-cyan-500/40 text-white placeholder-slate-500 outline-none focus:border-cyan-300"
          />
          <button
            type="submit"
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Load Tracking Batch</span>
          </button>
        </form>

        {/* Quick Checkbox Chips */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Quick Toggle from Registry:</span>
            <span className="font-mono text-cyan-400 font-bold">
              {selectedCodes.length} of {allShipments.length} Active
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap max-h-28 overflow-y-auto pr-1">
            {allShipments.map((s) => {
              const code = (s.trackingNumber || s.id).toUpperCase()
              const isChecked = selectedCodes.includes(code)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleToggleCode(code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                    isChecked
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                      : 'bg-[#050b14] border-cyan-500/20 text-slate-400 hover:text-white hover:border-cyan-500/40'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>{code}</span>
                  <span className="text-[10px] text-slate-400 font-sans font-normal">
                    ({s.deliveryStatus})
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
          BATCH TELEMETRY SUMMARY STRIP
          ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-[#091526]/90 border border-cyan-500/30 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tracked Consignments</span>
          <span className="text-lg font-mono font-extrabold text-white">{batchStats.total}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#091526]/90 border border-cyan-500/30 text-center">
          <span className="text-[10px] text-cyan-400 uppercase font-semibold block">In Transit</span>
          <span className="text-lg font-mono font-extrabold text-cyan-300">{batchStats.inTransit}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#091526]/90 border border-sky-500/30 text-center">
          <span className="text-[10px] text-sky-400 uppercase font-semibold block">Out for Delivery</span>
          <span className="text-lg font-mono font-extrabold text-sky-300">{batchStats.outForDelivery}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#091526]/90 border border-emerald-500/30 text-center">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Delivered</span>
          <span className="text-lg font-mono font-extrabold text-emerald-400">{batchStats.delivered}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#091526]/90 border border-amber-500/30 text-center">
          <span className="text-[10px] text-amber-400 uppercase font-semibold block">Customs Port</span>
          <span className="text-lg font-mono font-extrabold text-amber-300">{batchStats.customs}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#091526]/90 border border-cyan-500/30 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg Progress</span>
          <span className="text-lg font-mono font-extrabold text-cyan-400">{batchStats.avgProgress}%</span>
        </div>
      </div>

      {/* =========================================================
          MULTI-SHIPMENT COMPARATIVE CARDS GRID
          ========================================================= */}
      {trackedShipments.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#091526]/60 border border-cyan-500/20 text-center flex flex-col items-center justify-center">
          <Layers className="w-10 h-10 text-cyan-500/40 mb-3" />
          <h4 className="text-base font-bold text-white">No Consignments Selected</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Enter tracking numbers above or select from the registry pills to begin simultaneous multi-parcel radar tracking.
          </p>
          <button
            type="button"
            onClick={handleSelectAll}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold hover:bg-cyan-500/25 transition-all cursor-pointer"
          >
            Track All Active Shipments
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trackedShipments.map((s) => {
            const progress = s.progress || (s.deliveryStatus === 'Delivered' ? 100 : 50)

            return (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 hover:border-cyan-300/60 shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-cyan-400" />
                      <span className="font-mono text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {s.trackingNumber || s.id}
                      </span>
                    </div>
                    <StatusBadge status={s.deliveryStatus} size="sm" />
                  </div>

                  {/* Progress Bar */}
                  <div className="my-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Progression</span>
                      <span className="text-cyan-400 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-[#050b14] h-1.5 rounded-full overflow-hidden border border-cyan-500/20">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 shadow-[0_0_8px_#38bdf8]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Route Coordinates */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 text-[11px]">From: </span>
                        <span className="font-medium">{s.senderName}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 text-[11px]">To: </span>
                        <span className="font-medium">{s.receiverName}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-[#050b14] border border-cyan-500/20 text-[11px] text-cyan-300 font-mono truncate">
                      📍 {s.currentLocation || 'In Transit Air Corridor'}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400">
                    <span>ETA: </span>
                    <strong className="text-slate-200">{s.expectedDeliveryDate}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => onFocusSingleShipment(s.trackingNumber || s.id)}
                    className="px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Full Radar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
