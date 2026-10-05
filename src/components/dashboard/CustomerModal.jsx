import { useState } from 'react'
import { X, UserPlus, Check, Loader2 } from 'lucide-react'

export default function CustomerModal({ isOpen, onClose, onAddCustomer }) {
  const [formData, setFormData] = useState({
    name: 'Atlas Global Logistics Corp',
    email: 'operations@atlaslogistics.com',
    company: 'Atlas Freight Holding AG',
    phone: '+1 (555) 789-0123',
    accountType: 'Enterprise Client',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      onAddCustomer(formData)
      setIsSubmitting(false)
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0c1a2f]/90 backdrop-blur-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-6 text-slate-100 overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Register Client Entity
              </h3>
              <p className="text-xs text-slate-400">
                Onboard commercial shipper, consignee, or freight enterprise
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5 relative z-10">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Primary Contact / Client Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Official Corporate Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Enterprise Company
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Tier Category
              </label>
              <select
                value={formData.accountType}
                onChange={(e) =>
                  setFormData({ ...formData, accountType: e.target.value })
                }
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-[#0b172a] border border-white/15 text-white outline-none cursor-pointer focus:border-purple-400"
              >
                <option value="Enterprise Client">Enterprise Client</option>
                <option value="Standard Shipper">Standard Shipper</option>
                <option value="Frequent Sender">Frequent Sender</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Direct Dispatch Phone
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.05] border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white flex items-center gap-1.5 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Client</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
