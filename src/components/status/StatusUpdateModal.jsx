import { useState } from 'react'
import {
  X,
  RefreshCw,
  MapPin,
  FileText,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import { STATUS_CONFIG } from '../../constants/statusConfig'
import {
  DELIVERY_STATUS_LIST,
  FAILED_DELIVERY_REASONS,
  CANCELLATION_REASONS,
} from '../../services/statusService'

export default function StatusUpdateModal({
  isOpen,
  onClose,
  shipment,
  onUpdateStatus,
  isUpdating = false,
}) {
  const [selectedStatus, setSelectedStatus] = useState(
    () => shipment?.deliveryStatus || 'Pending'
  )
  const [locationNote, setLocationNote] = useState(
    () => shipment?.currentLocation || ''
  )
  const [reason, setReason] = useState(
    () => shipment?.statusReason || ''
  )
  const [customReason, setCustomReason] = useState('')
  const [notes, setNotes] = useState('')
  const [operator, setOperator] = useState('Cyber Command Dispatcher')

  if (!isOpen || !shipment) return null

  const currentStatus = shipment.deliveryStatus || 'Pending'

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalReason = reason === 'Other' ? customReason : reason

    onUpdateStatus({
      trackingNumber: shipment.trackingNumber || shipment.id,
      newStatus: selectedStatus,
      location: locationNote.trim(),
      reason: finalReason.trim(),
      notes: notes.trim(),
      operator: operator.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-6 rounded-2xl bg-[#091526] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Accent Header */}
        <div className="px-6 py-4 bg-[#050b14] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Update Consignment Delivery Status
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                WAYBILL: {shipment.trackingNumber || shipment.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transition Summary Bar */}
        <div className="px-6 py-3 bg-[#071324] border-b border-cyan-500/15 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Status:</span>
            <StatusBadge status={currentStatus} size="sm" />
          </div>

          <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-slate-400">New Target Status:</span>
            <StatusBadge status={selectedStatus} size="sm" />
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          {/* Select Target Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
              Select New Delivery Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DELIVERY_STATUS_LIST.map((statusKey) => {
                const conf = STATUS_CONFIG[statusKey]
                const Icon = conf?.icon || ShieldCheck
                const isSelected = selectedStatus === statusKey

                return (
                  <button
                    key={statusKey}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(statusKey)
                      if (statusKey !== 'Failed Delivery' && statusKey !== 'Cancelled') {
                        setReason('')
                      }
                    }}
                    className={`p-2.5 rounded-xl text-left border flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                        : 'bg-[#050b14] border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#071324]'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg border shrink-0 ${conf?.badgeClass || 'bg-slate-800 text-slate-300 border-slate-700'}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{statusKey}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {conf?.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Contextual Reason: Failed Delivery */}
          {selectedStatus === 'Failed Delivery' && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 flex flex-col gap-2.5">
              <label className="text-xs font-bold text-red-300 flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Delivery Failure Reason (Required)
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl bg-[#050b14] border border-red-500/40 text-white outline-none focus:border-red-400 cursor-pointer"
                required
              >
                <option value="">Select standard failure category...</option>
                {FAILED_DELIVERY_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
                <option value="Other">Other / Custom Exception Reason</option>
              </select>

              {reason === 'Other' && (
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Specify failure circumstance in detail..."
                  className="w-full h-10 px-3 text-xs rounded-xl bg-[#050b14] border border-red-500/40 text-white outline-none focus:border-red-400"
                  required
                />
              )}
            </div>
          )}

          {/* Contextual Reason: Cancelled */}
          {selectedStatus === 'Cancelled' && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 flex flex-col gap-2.5">
              <label className="text-xs font-bold text-rose-300 flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Consignment Cancellation Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl bg-[#050b14] border border-rose-500/40 text-white outline-none focus:border-rose-400 cursor-pointer"
                required
              >
                <option value="">Select cancellation cause...</option>
                {CANCELLATION_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
                <option value="Other">Other / Custom Cancellation Cause</option>
              </select>

              {reason === 'Other' && (
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Specify cancellation cause in detail..."
                  className="w-full h-10 px-3 text-xs rounded-xl bg-[#050b14] border border-rose-500/40 text-white outline-none focus:border-rose-400"
                  required
                />
              )}
            </div>
          )}

          {/* Current Checkpoint Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Checkpoint Location / Terminal Hub
            </label>
            <input
              type="text"
              value={locationNote}
              onChange={(e) => setLocationNote(e.target.value)}
              placeholder="e.g. London Heathrow Inbound Air Cargo Hub (LHR)"
              className="w-full h-10 px-3.5 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
            />
          </div>

          {/* Operator Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              Authorized Dispatcher / Operator ID
            </label>
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              placeholder="e.g. Dispatcher Alex Mercer [ID #4829]"
              className="w-full h-10 px-3.5 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Audit Remarks & Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Status Transition Remarks & Audit Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Operational log notes, vehicle telematics, or customer notice details..."
              className="w-full p-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="px-4 py-2.5 rounded-xl bg-[#050b14] border border-cyan-500/30 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'Committing...' : 'Commit Status Change'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
