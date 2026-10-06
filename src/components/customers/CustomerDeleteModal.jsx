import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'

export default function CustomerDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  customer,
  isDeleting = false,
}) {
  if (!isOpen || !customer) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#091526] border border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.25)] p-5 sm:p-6 text-slate-100 overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-rose-500/20 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Delete Customer Record
              </h3>
              <p className="text-xs text-rose-300/80">
                Permanent CRM account decommissioning
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
        <div className="my-4 text-xs sm:text-sm text-slate-300 relative z-10 space-y-3">
          <p>
            Are you sure you want to permanently delete customer dossier for{' '}
            <strong className="text-white font-semibold">{customer.customerName}</strong>?
          </p>

          <div className="p-3 rounded-xl bg-[#050b14] border border-white/10 space-y-1.5 text-xs text-slate-400 font-mono">
            <div>
              <span className="text-slate-500">Account ID:</span>{' '}
              <span className="text-cyan-300 font-bold">{customer.id}</span>
            </div>
            <div>
              <span className="text-slate-500">Email:</span>{' '}
              <span className="text-slate-200">{customer.email}</span>
            </div>
            <div>
              <span className="text-slate-500">Phone:</span>{' '}
              <span className="text-slate-200">{customer.mobileNumber}</span>
            </div>
            <div>
              <span className="text-slate-500">Location:</span>{' '}
              <span className="text-slate-200">{customer.city}, {customer.postalCode}</span>
            </div>
          </div>

          <p className="text-[11px] text-rose-400 flex items-center gap-1.5 font-medium">
            <span>⚠️</span> All historical bookings and courier waybill associations will be unlinked.
          </p>
        </div>

        {/* Footer Actions */}
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
            onClick={() => onConfirm(customer.id)}
            disabled={isDeleting}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Removing Customer...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Customer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
