import { useState } from 'react'
import {
  X,
  RefreshCw,
  Check,
  Loader2,
  MapPin,
  FileText,
  ShieldCheck,
} from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending (Awaiting Shipper Pickup)' },
  { value: 'Picked Up', label: 'Picked Up (Collected by Courier)' },
  { value: 'In Transit', label: 'In Transit (Air / Linehaul Corridor)' },
  { value: 'Out for Delivery', label: 'Out for Delivery (Courier Van Active)' },
  { value: 'Delivered', label: 'Delivered (Signed by Consignee)' },
  { value: 'Cancelled', label: 'Cancelled (Manifest Terminated)' },
  { value: 'Failed Delivery', label: 'Failed Delivery (Attempt Unsuccessful)' },
]

export default function StatusUpdateModal({
  isOpen,
  onClose,
  shipment,
  onUpdateStatus,
  isUpdating = false,
}) {
  const [selectedStatus, setSelectedStatus] = useState(
    shipment?.deliveryStatus || 'In Transit'
  )
  const [locationNote, setLocationNote] = useState(
    shipment?.currentLocation || ''
  )
  const [eventDetails, setEventDetails] = useState('')

  if (!isOpen || !shipment) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdateStatus({
      trackingNumber: shipment.trackingNumber || shipment.id,
      newStatus: selectedStatus,
      locationNote: locationNote.trim(),
      eventDetails: eventDetails.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl bg-[#091526] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Sticky Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/20 bg-[#07101e]/90 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Dispatch Status & Waypoint Update
              </h3>
              <p className="text-xs text-slate-400">
                Log real-time checkpoint telemetry for {shipment.trackingNumber || shipment.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 relative z-10">
          {/* Current Consignment Brief */}
          <div className="p-3 rounded-xl bg-[#050b14] border border-cyan-500/25 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">CURRENT STATUS</span>
              <span className="text-cyan-300 font-bold">{shipment.deliveryStatus}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">PROGRESS</span>
              <span className="text-white font-bold">{shipment.progress || 50}%</span>
            </div>
          </div>

          {/* New Status Select */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              New Delivery Status <span className="text-cyan-400">*</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#050b14] border border-cyan-500/40 text-white text-xs sm:text-sm font-semibold outline-none focus:border-cyan-300 cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#091526] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Note */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Current Waypoint / Terminal Facility</span>
            </label>
            <input
              type="text"
              required
              value={locationNote}
              onChange={(e) => setLocationNote(e.target.value)}
              placeholder="e.g. Frankfurt Cargo Hub Gate 14 (FRA)"
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-500 outline-none focus:border-cyan-300"
            />
          </div>

          {/* Event Details */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspection & Operational Audit Notes</span>
            </label>
            <textarea
              rows={3}
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              placeholder="e.g. Barcode verified at automated sortation line #8. Package scanned for transshipment."
              className="w-full p-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-500 outline-none focus:border-cyan-300 resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Submitting updates global waybill record and writes an immutable entry to tracking history.
            </span>
          </div>

          {/* Sticky Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-500/20">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-70"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Logging Checkpoint...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Commit Status Update</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
