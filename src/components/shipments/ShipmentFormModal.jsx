import { useState } from 'react'
import {
  X,
  Package,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  MapPin,
  User,
  Scale,
  Layers,
  Activity,
  Loader2,
  FileText,
} from 'lucide-react'
import { generateTrackingNumber } from '../../services/shipmentApi'
import { toast } from 'react-toastify'

const PARCEL_TYPES = [
  'Standard Box',
  'Document',
  'Electronics',
  'Fragile',
  'Heavy Freight',
  'Perishable',
  'Medical Supplies',
]

const STATUS_OPTIONS = [
  'Pending Pickup',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'Customs Clearance',
  'Cancelled',
]

const CARRIERS = [
  'Global Air Cargo',
  'Express Overland & Air',
  'Pacific Priority Cargo',
  'Atlantic Logistics',
  'Diplomatic Courier Express',
]

const getTodayStr = () => new Date().toISOString().split('T')[0]
const getDefaultExpected = () =>
  new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

function ShipmentFormContent({
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) {
  const isEdit = !!initialData

  const [formData, setFormData] = useState(() => ({
    trackingNumber: initialData?.trackingNumber || initialData?.id || generateTrackingNumber(),
    senderName: initialData?.senderName || '',
    receiverName: initialData?.receiverName || '',
    pickupAddress: initialData?.pickupAddress || '',
    deliveryAddress: initialData?.deliveryAddress || '',
    parcelWeight: String(initialData?.parcelWeight || '5.0'),
    parcelType: initialData?.parcelType || 'Standard Box',
    shippingDate: initialData?.shippingDate || getTodayStr(),
    expectedDeliveryDate: initialData?.expectedDeliveryDate || getDefaultExpected(),
    deliveryStatus: initialData?.deliveryStatus || 'In Transit',
    carrier: initialData?.carrier || 'Global Air Cargo',
    notes: initialData?.notes || '',
  }))

  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState({})

  const handleRegenerateCode = () => {
    const newCode = generateTrackingNumber()
    setFormData((prev) => ({ ...prev, trackingNumber: newCode }))
    toast.info(`New Tracking Number generated: ${newCode}`)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(formData.trackingNumber)
    setCopied(true)
    toast.success('Tracking Number copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const validate = () => {
    const errs = {}
    if (!formData.trackingNumber.trim()) {
      errs.trackingNumber = 'Tracking number is required.'
    }
    if (!formData.senderName.trim()) {
      errs.senderName = 'Sender full name is required.'
    }
    if (!formData.receiverName.trim()) {
      errs.receiverName = 'Receiver full name is required.'
    }
    if (!formData.pickupAddress.trim()) {
      errs.pickupAddress = 'Pickup address is required.'
    }
    if (!formData.deliveryAddress.trim()) {
      errs.deliveryAddress = 'Delivery address is required.'
    }
    const weightNum = parseFloat(formData.parcelWeight)
    if (isNaN(weightNum) || weightNum <= 0) {
      errs.parcelWeight = 'Please enter a valid weight in kg (> 0).'
    }
    if (!formData.shippingDate) {
      errs.shippingDate = 'Shipping date is required.'
    }
    if (!formData.expectedDeliveryDate) {
      errs.expectedDeliveryDate = 'Expected delivery date is required.'
    } else if (formData.shippingDate && formData.expectedDeliveryDate < formData.shippingDate) {
      errs.expectedDeliveryDate = 'Expected delivery date cannot be before shipping date.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      ...formData,
      parcelWeight: parseFloat(formData.parcelWeight),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#091526] border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)] text-slate-100 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/20 bg-[#07101e]/90 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {isEdit ? 'Edit Shipment Manifest' : 'Create New Consignment Shipment'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEdit
                  ? 'Update live routing, delivery status, and waypoint parameters'
                  : 'Register parcel, auto-generate tracking ID, and issue courier waybill'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden relative z-10">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
          {/* 1. TRACKING NUMBER GENERATOR ROW */}
          <div className="p-3.5 rounded-xl bg-[#050b14] border border-cyan-500/30">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
              Unique Tracking Number (Auto-Generated)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.trackingNumber}
                onChange={(e) =>
                  setFormData({ ...formData, trackingNumber: e.target.value.toUpperCase() })
                }
                className="flex-1 h-10 px-3 rounded-lg bg-[#0c203b] border border-cyan-500/40 text-cyan-300 font-mono font-bold text-sm tracking-widest outline-none focus:border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
              />
              <button
                type="button"
                onClick={handleRegenerateCode}
                title="Generate New Tracking Number"
                className="h-10 px-3 rounded-lg bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/25 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Copy Tracking Number"
                className="h-10 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400 transition-all flex items-center gap-1 text-xs cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {errors.trackingNumber && (
              <p className="mt-1 text-xs text-rose-400 font-mono">{errors.trackingNumber}</p>
            )}
          </div>

          {/* 2. SENDER & RECEIVER ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Sender Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NovaTech Avionics Inc"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-500 text-xs sm:text-sm outline-none focus:border-cyan-400"
              />
              {errors.senderName && (
                <p className="mt-1 text-xs text-rose-400">{errors.senderName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Receiver Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Global Micro Systems Ltd"
                value={formData.receiverName}
                onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-500 text-xs sm:text-sm outline-none focus:border-cyan-400"
              />
              {errors.receiverName && (
                <p className="mt-1 text-xs text-rose-400">{errors.receiverName}</p>
              )}
            </div>
          </div>

          {/* 3. PICKUP & DELIVERY ADDRESSES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Pickup Address *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Street address, City, State/Province, Country"
                value={formData.pickupAddress}
                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-500 text-xs outline-none focus:border-cyan-400 resize-none"
              />
              {errors.pickupAddress && (
                <p className="mt-1 text-xs text-rose-400">{errors.pickupAddress}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Delivery Address *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Destination street, City, Postal Code, Country"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-500 text-xs outline-none focus:border-cyan-400 resize-none"
              />
              {errors.deliveryAddress && (
                <p className="mt-1 text-xs text-rose-400">{errors.deliveryAddress}</p>
              )}
            </div>
          </div>

          {/* 4. PARCEL WEIGHT & PARCEL TYPE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-cyan-400" /> Parcel Weight (kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  placeholder="5.0"
                  value={formData.parcelWeight}
                  onChange={(e) => setFormData({ ...formData, parcelWeight: e.target.value })}
                  className="w-full h-10 pl-3 pr-10 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white text-xs sm:text-sm outline-none focus:border-cyan-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-cyan-400">
                  KG
                </span>
              </div>
              {errors.parcelWeight && (
                <p className="mt-1 text-xs text-rose-400">{errors.parcelWeight}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Parcel Type *
              </label>
              <select
                value={formData.parcelType}
                onChange={(e) => setFormData({ ...formData, parcelType: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white text-xs sm:text-sm outline-none focus:border-cyan-400 cursor-pointer"
              >
                {PARCEL_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-[#091526] text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. DATES (SHIPPING DATE & EXPECTED DELIVERY DATE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Shipping Date *
              </label>
              <input
                type="date"
                required
                value={formData.shippingDate}
                onChange={(e) => setFormData({ ...formData, shippingDate: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white text-xs outline-none focus:border-cyan-400 cursor-pointer"
              />
              {errors.shippingDate && (
                <p className="mt-1 text-xs text-rose-400">{errors.shippingDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Expected Delivery Date *
              </label>
              <input
                type="date"
                required
                min={formData.shippingDate}
                value={formData.expectedDeliveryDate}
                onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white text-xs outline-none focus:border-cyan-400 cursor-pointer"
              />
              {errors.expectedDeliveryDate && (
                <p className="mt-1 text-xs text-rose-400">{errors.expectedDeliveryDate}</p>
              )}
            </div>
          </div>

          {/* 6. DELIVERY STATUS & CARRIER LINE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Delivery Status *
              </label>
              <select
                value={formData.deliveryStatus}
                onChange={(e) => setFormData({ ...formData, deliveryStatus: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white text-xs sm:text-sm outline-none focus:border-cyan-400 cursor-pointer"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status} className="bg-[#091526] text-white">
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assigned Carrier Line
              </label>
              <select
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white text-xs sm:text-sm outline-none focus:border-cyan-400 cursor-pointer"
              >
                {CARRIERS.map((c) => (
                  <option key={c} value={c} className="bg-[#091526] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 7. HANDLING INSTRUCTIONS / NOTES */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Special Courier Notes & Handling Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Fragile glassware, keep refrigerated, signature required upon delivery"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-500 text-xs outline-none focus:border-cyan-400"
            />
          </div>

          </div>

          {/* MODAL FOOTER BUTTONS */}
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-cyan-500/20 bg-[#07101e]/90 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Syncing with Third-Party API...</span>
                </>
              ) : isEdit ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Manifest Changes</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  <span>Issue & Dispatch Consignment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ShipmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  if (!isOpen) return null

  return (
    <ShipmentFormContent
      key={initialData?.id || initialData?.trackingNumber || 'new-shipment'}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      isSubmitting={isSubmitting}
    />
  )
}
