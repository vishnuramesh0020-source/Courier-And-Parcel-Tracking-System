import { useState } from 'react'
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Hash,
  Shield,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react'

const STATUS_OPTIONS = ['Active', 'VIP', 'Corporate', 'Inactive']

function CustomerFormContent({
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) {
  const isEdit = !!initialData

  const [formData, setFormData] = useState(() => ({
    customerName: initialData?.customerName || '',
    email: initialData?.email || '',
    mobileNumber: initialData?.mobileNumber || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    postalCode: initialData?.postalCode || '',
    status: initialData?.status || 'Active',
  }))

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = () => {
    const errs = {}

    // Customer Name
    if (!formData.customerName.trim()) {
      errs.customerName = 'Customer full name is required.'
    } else if (formData.customerName.trim().length < 2) {
      errs.customerName = 'Name must be at least 2 characters.'
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.'
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).'
    }

    // Mobile Number
    const phoneClean = formData.mobileNumber.replace(/[\s\-()]/g, '')
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required.'
    } else if (!/^[+]?[0-9]{7,15}$/.test(phoneClean)) {
      errs.mobileNumber = 'Please enter a valid phone number (7-15 digits).'
    }

    // Address
    if (!formData.address.trim()) {
      errs.address = 'Street address is required.'
    } else if (formData.address.trim().length < 4) {
      errs.address = 'Address must be at least 4 characters.'
    }

    // City
    if (!formData.city.trim()) {
      errs.city = 'City is required.'
    }

    // Postal Code
    if (!formData.postalCode.trim()) {
      errs.postalCode = 'Postal / ZIP code is required.'
    } else if (formData.postalCode.trim().length < 3) {
      errs.postalCode = 'Postal code must be at least 3 characters.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mark all touched
    setTouched({
      customerName: true,
      email: true,
      mobileNumber: true,
      address: true,
      city: true,
      postalCode: true,
    })

    if (!validate()) return

    onSubmit({
      ...formData,
      id: initialData?.id,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl bg-[#091526] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* =========================================================
            STICKY HEADER
            ========================================================= */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/20 bg-[#07101e]/90 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {isEdit ? 'Edit Customer Dossier' : 'Register New Customer'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEdit
                  ? `Updating profile and billing coordinates for ${initialData?.id || 'client'}`
                  : 'Onboard a new client or corporate shipper into the courier network'}
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

        {/* =========================================================
            FORM BODY (Scrollable, fits screen height)
            ========================================================= */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden relative z-10">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
            {/* 1. CUSTOMER NAME */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                Customer Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Apex Legal & Financial Counsel or John Doe"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  onBlur={() => handleBlur('customerName')}
                  className={`w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-[#050b14] border text-white placeholder-slate-500 outline-none transition-all ${
                    touched.customerName && errors.customerName
                      ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                      : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  }`}
                />
              </div>
              {touched.customerName && errors.customerName && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.customerName}</span>
                </p>
              )}
            </div>

            {/* 2. EMAIL & MOBILE NUMBER (2-COLUMN GRID) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="e.g. logistics@client.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-[#050b14] border text-white placeholder-slate-500 outline-none transition-all ${
                      touched.email && errors.email
                        ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                        : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                  Mobile Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="e.g. +1 (555) 234-5678"
                    value={formData.mobileNumber}
                    onChange={(e) => handleChange('mobileNumber', e.target.value)}
                    onBlur={() => handleBlur('mobileNumber')}
                    className={`w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-[#050b14] border text-white placeholder-slate-500 outline-none transition-all ${
                      touched.mobileNumber && errors.mobileNumber
                        ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                        : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    }`}
                  />
                </div>
                {touched.mobileNumber && errors.mobileNumber && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.mobileNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 3. STREET ADDRESS */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                Street Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. 100 Wall Street, 14th Floor"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  className={`w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-[#050b14] border text-white placeholder-slate-500 outline-none transition-all ${
                    touched.address && errors.address
                      ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                      : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  }`}
                />
              </div>
              {touched.address && errors.address && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.address}</span>
                </p>
              )}
            </div>

            {/* 4. CITY & POSTAL CODE (2-COLUMN GRID) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* City */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                  City <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. New York, London, Tokyo"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    className={`w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-[#050b14] border text-white placeholder-slate-500 outline-none transition-all ${
                      touched.city && errors.city
                        ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                        : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    }`}
                  />
                </div>
                {touched.city && errors.city && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.city}</span>
                  </p>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                  Postal Code / ZIP <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. 10005, EC2N 4AG, 60327"
                    value={formData.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value.toUpperCase())}
                    onBlur={() => handleBlur('postalCode')}
                    className={`w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-[#050b14] border font-mono text-white placeholder-slate-500 outline-none transition-all ${
                      touched.postalCode && errors.postalCode
                        ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                        : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    }`}
                  />
                </div>
                {touched.postalCode && errors.postalCode && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.postalCode}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 5. ACCOUNT STATUS TIER */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                Account Status Tier
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-white outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st} className="bg-[#091526] text-white">
                      {st} Client Tier
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* =========================================================
              STICKY FOOTER ACTION BUTTONS
              ========================================================= */}
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
                  <span>Saving Record...</span>
                </>
              ) : isEdit ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Customer Changes</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span>Create Customer Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  if (!isOpen) return null

  return (
    <CustomerFormContent
      key={initialData?.id || 'new-customer'}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      isSubmitting={isSubmitting}
    />
  )
}
