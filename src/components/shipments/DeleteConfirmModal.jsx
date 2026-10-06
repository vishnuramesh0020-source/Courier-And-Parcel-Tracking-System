import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  shipment,
  isDeleting = false,
}) {
  if (!isOpen || !shipment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#091526] border border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.25)] p-5 sm:p-6 text-slate-100 overflow-hidden">
        {/* Atmospheric rose glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-rose-500/20 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Delete Consignment Manifest
              </h3>
              <p className="text-xs text-rose-300/80">
                Permanent deletion confirmation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-4 text-xs sm:text-sm text-slate-300 relative z-10">
          <p>
            Are you sure you want to permanently delete consignment{' '}
            <span className="font-mono font-bold text-cyan-300 px-1 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
              {shipment.trackingNumber || shipment.id}
            </span>
            ?
          </p>
          <div className="mt-3 p-3 rounded-xl bg-[#050b14] border border-white/10 space-y-1 text-xs text-slate-400 font-mono">
            <div>
              <span className="text-slate-500">Sender:</span>{' '}
              <span className="text-slate-200">{shipment.senderName}</span>
            </div>
            <div>
              <span className="text-slate-500">Receiver:</span>{' '}
              <span className="text-slate-200">{shipment.receiverName}</span>
            </div>
            <div>
              <span className="text-slate-500">Type / Weight:</span>{' '}
              <span className="text-slate-200">
                {shipment.parcelType} • {shipment.parcelWeight} kg
              </span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-rose-400 flex items-center gap-1.5 font-medium">
            <span>⚠️</span> This action calls the API DELETE endpoint and removes the tracking record from all nodes.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3.5 border-t border-rose-500/20 relative z-10">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(shipment.id || shipment.trackingNumber)}
            disabled={isDeleting}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Deleting via API...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Shipment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
