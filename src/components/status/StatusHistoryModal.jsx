import { useState } from 'react'
import {
  X,
  History,
  Copy,
  Check,
  MapPin,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Printer,
} from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import { toast } from 'react-toastify'

export default function StatusHistoryModal({
  isOpen,
  onClose,
  shipment,
  history = [],
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !shipment) return null

  const handleCopyHistory = () => {
    const lines = [
      `STATUS AUDIT TRAIL FOR: ${shipment.trackingNumber || shipment.id}`,
      `Current Status: ${shipment.deliveryStatus}`,
      `Route: ${shipment.senderName} -> ${shipment.receiverName}`,
      '-------------------------------------------------------',
      ...history.map(
        (h) =>
          `[${h.timestamp}] ${h.fromStatus} -> ${h.toStatus} @ ${h.location} (Operator: ${h.operator})${
            h.reason ? ` Reason: ${h.reason}` : ''
          } - ${h.notes || 'No remarks'}`
      ),
    ]

    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    toast.success('Complete status history audit copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 rounded-2xl bg-[#091526] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Glow Header */}
        <div className="px-6 py-4 bg-[#050b14] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Delivery Status Audit History
                </h2>
                <StatusBadge status={shipment.deliveryStatus} size="sm" />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                CONSIGNMENT: {shipment.trackingNumber || shipment.id} • {shipment.senderName} → {shipment.receiverName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyHistory}
              className="p-2 rounded-xl bg-[#050b14] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-300 transition-colors cursor-pointer"
              title="Copy Audit Log"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-[#050b14] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-300 transition-colors cursor-pointer"
              title="Print Audit Log"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-[#050b14] rounded-xl border border-cyan-500/20">
              No status transitions recorded yet for this consignment.
            </div>
          ) : (
            <div className="relative border-l-2 border-cyan-500/30 ml-4 pl-6 space-y-6">
              {history.map((item, idx) => {
                const isLatest = idx === 0

                return (
                  <div key={item.id || idx} className="relative group">
                    {/* Glowing Bullet Node */}
                    <div
                      className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                        isLatest
                          ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_12px_#38bdf8] scale-110'
                          : 'bg-[#091526] border-cyan-500/60'
                      }`}
                    />

                    {/* Card Container */}
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        isLatest
                          ? 'bg-[#071324] border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                          : 'bg-[#050b14] border-cyan-500/20 hover:border-cyan-500/35'
                      }`}
                    >
                      {/* Top Row: Status Badges & Timestamp */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-cyan-500/15">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.fromStatus && item.fromStatus !== 'Initialized' ? (
                            <>
                              <StatusBadge status={item.fromStatus} size="sm" showDot={false} />
                              <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            </>
                          ) : null}
                          <StatusBadge status={item.toStatus} size="sm" />
                          {isLatest && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 uppercase tracking-widest">
                              CURRENT
                            </span>
                          )}
                        </div>

                        <span className="font-mono text-xs text-cyan-300">
                          {item.timestamp}
                        </span>
                      </div>

                      {/* Location & Operator */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{item.location || 'Terminal Hub'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="font-mono text-[11px] truncate text-slate-400">
                            {item.operator || 'Command Operator'}
                          </span>
                        </div>
                      </div>

                      {/* Specific Reason (if failed or cancelled) */}
                      {item.reason && (
                        <div className="mt-2.5 p-2 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-semibold block text-red-200">Incident Category:</strong>
                            <span>{item.reason}</span>
                          </div>
                        </div>
                      )}

                      {/* Notes / Remarks */}
                      {item.notes && (
                        <div className="mt-2 text-xs text-slate-400 leading-relaxed bg-[#03060d]/50 p-2.5 rounded-lg border border-cyan-500/10">
                          {item.notes}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#050b14] border-t border-cyan-500/20 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">
            TOTAL TRANSITIONS: <strong className="text-white">{history.length}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  )
}
