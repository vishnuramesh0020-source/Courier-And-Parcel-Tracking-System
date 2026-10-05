import { useState } from 'react'
import { X, Package, Check, Loader2 } from 'lucide-react'

export default function ShipmentModal({ isOpen, onClose, onCreateShipment }) {
  const [formData, setFormData] = useState({
    origin: 'New York (JFK Hub), USA',
    destination: 'Frankfurt Central Hub, Germany',
    recipient: 'Acme International Freight Corp',
    carrier: 'Global Air Cargo',
    weight: '14.5',
    type: 'Express Transcontinental',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      const randomCode = Math.floor(10000 + Math.random() * 90000)
      const newShipment = {
        id: `GC-${randomCode}-GL`,
        origin: formData.origin,
        destination: formData.destination,
        recipient: formData.recipient,
        carrier: formData.carrier,
        status: 'In Transit',
        progress: 25,
        eta: 'In 3 business days',
        weight: `${formData.weight} kg`,
      }
      onCreateShipment(newShipment)
      setIsSubmitting(false)
      onClose()
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0c1a2f]/90 backdrop-blur-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-6 text-slate-100 overflow-hidden">
        {/* Soft specular light reflection */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Book Consignment & Issue Waybill
              </h3>
              <p className="text-xs text-slate-400">
                Generate an audited transcontinental freight manifest & tracking code
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Origin Terminal
              </label>
              <input
                type="text"
                required
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Destination Terminal
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Recipient / Enterprise Entity
            </label>
            <input
              type="text"
              required
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Carrier Line
              </label>
              <select
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-[#0b172a] border border-white/15 text-white outline-none cursor-pointer focus:border-cyan-400"
              >
                <option value="Global Air Cargo">Global Air Cargo (Express)</option>
                <option value="Express Overland">Express Overland (Truck)</option>
                <option value="Pacific Priority">Pacific Priority (Maritime)</option>
                <option value="Atlantic Logistics">Atlantic Logistics</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Gross Weight (KG)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
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
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white flex items-center gap-1.5 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Auditing Manifest...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Generate Shipment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
