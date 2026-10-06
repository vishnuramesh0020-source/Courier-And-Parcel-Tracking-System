import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  X,
  MapPin,
  Building2,
  Shield,
  Edit,
  Trash2,
  Package,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { getStoredShipments } from '../../services/shipmentApi'

export default function CustomerProfileModal({
  isOpen,
  onClose,
  customer,
  onEdit,
  onDelete,
}) {
  const [copiedField, setCopiedField] = useState(null)

  // Find linked consignments for this customer
  const linkedShipments = useMemo(() => {
    if (!customer) return []
    try {
      const all = getStoredShipments()
      const searchName = customer.customerName.toLowerCase()
      return all
        .filter(
          (s) =>
            s.senderName?.toLowerCase().includes(searchName) ||
            s.receiverName?.toLowerCase().includes(searchName) ||
            searchName.includes(s.senderName?.toLowerCase() || '') ||
            searchName.includes(s.receiverName?.toLowerCase() || '')
        )
        .slice(0, 4)
    } catch {
      return []
    }
  }, [customer])

  if (!isOpen || !customer) return null

  const handleCopy = (field, text) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(`${field} copied to clipboard!`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'VIP':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
      case 'Corporate':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
      case 'Active':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 print:p-0 print:bg-white print:text-black">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#091526] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 overflow-hidden print:border-none print:shadow-none">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none print:hidden" />

        {/* =========================================================
            STICKY HEADER
            ========================================================= */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/20 bg-[#07101e]/90 relative z-10 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] shrink-0">
              {customer.customerName?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-white text-base truncate">
                  {customer.customerName}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getStatusColor(
                    customer.status
                  )}`}
                >
                  {customer.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span>ID: <strong className="text-cyan-300">{customer.id}</strong></span>
                <span>•</span>
                <span>Client since {customer.createdAt || '2026'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 print:hidden">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onEdit(customer)
                }}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/25 transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onDelete(customer)
                }}
                className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-all cursor-pointer"
                title="Delete Customer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================
            SCROLLABLE BODY
            ========================================================= */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 relative z-10">
          {/* 1. TOP METRICS TILES */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Total Bookings
              </span>
              <span className="text-lg font-mono font-extrabold text-cyan-300 mt-0.5 block">
                {customer.totalShipments || 0}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Account Tier
              </span>
              <span className="text-xs sm:text-sm font-bold text-white mt-1 block flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                {customer.status}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Dispatch Region
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400 mt-1 block truncate">
                {customer.city}
              </span>
            </div>
          </div>

          {/* 2. CONTACT & BILLING COORDINATES */}
          <div className="p-4 rounded-xl bg-[#050b14]/90 border border-cyan-500/30 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Verified Contact & Billing Coordinates
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Email */}
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Email Address</span>
                  <span className="text-slate-200 font-medium truncate block">{customer.email}</span>
                </div>
                <button
                  onClick={() => handleCopy('Email', customer.email)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Copy Email"
                >
                  {copiedField === 'Email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Phone */}
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Mobile Phone</span>
                  <span className="text-slate-200 font-mono font-medium truncate block">{customer.mobileNumber}</span>
                </div>
                <button
                  onClick={() => handleCopy('Mobile', customer.mobileNumber)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Copy Mobile"
                >
                  {copiedField === 'Mobile' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Street Address */}
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Street Address</span>
                <span className="text-slate-200 font-medium leading-relaxed block">{customer.address}</span>
              </div>

              {/* City & Postal */}
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">City & Postal Code</span>
                  <span className="text-slate-200 font-medium block">
                    {customer.city}, <strong className="font-mono text-cyan-300">{customer.postalCode}</strong>
                  </span>
                </div>
                <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Building2 className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* 3. LINKED WAYBILL SHIPMENT HISTORY */}
          <div className="p-4 rounded-xl bg-[#050b14] border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-400" />
                Linked Consignments & Tracking History
              </h4>
              <Link
                to="/shipments"
                onClick={onClose}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <span>View All Manifests</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {linkedShipments.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 bg-black/20 rounded-xl border border-white/5">
                No recent consignments directly tagged with this client name.
              </div>
            ) : (
              <div className="space-y-2">
                {linkedShipments.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-xl bg-[#091526] border border-cyan-500/20 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-300">{s.trackingNumber || s.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
                          {s.deliveryStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {s.parcelType} • {s.parcelWeight} kg • {s.shippingDate}
                      </p>
                    </div>

                    <Link
                      to={`/shipments/${encodeURIComponent(s.trackingNumber || s.id)}`}
                      onClick={onClose}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors shrink-0"
                      title="Inspect Waybill"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            STICKY FOOTER
            ========================================================= */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-cyan-500/20 bg-[#07101e]/90 shrink-0">
          <Link
            to={`/customers/${encodeURIComponent(customer.id)}`}
            onClick={onClose}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <span>Open Dedicated Full Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  )
}
