import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  X,
  Package,
  MapPin,
  Calendar,
  Activity,
  Copy,
  Check,
  Printer,
  Edit,
  Trash2,
  Truck,
  ShieldCheck,
  Share2,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function ShipmentDetailsModal({
  isOpen,
  onClose,
  shipment,
  onEdit,
  onDelete,
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !shipment) return null

  const handleCopyCode = () => {
    navigator.clipboard.writeText(shipment.trackingNumber || shipment.id)
    setCopied(true)
    toast.success('Tracking number copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrintManifest = () => {
    window.print()
  }

  const handleShare = () => {
    const url = `${window.location.origin}/shipments/${encodeURIComponent(shipment.trackingNumber || shipment.id)}`
    navigator.clipboard.writeText(url)
    toast.info('Direct tracking URL copied to clipboard!')
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
      case 'In Transit':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
      case 'Out for Delivery':
        return 'bg-sky-500/15 text-sky-300 border-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
      case 'Customs Clearance':
        return 'bg-amber-500/15 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
      case 'Cancelled':
        return 'bg-rose-500/15 text-rose-300 border-rose-400/50 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
      case 'Pending Pickup':
      default:
        return 'bg-purple-500/15 text-purple-300 border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
    }
  }

  const milestones = [
    {
      title: 'Consignment Order Created',
      location: shipment.pickupAddress?.split(',')[1]?.trim() || 'Origin Terminal',
      date: shipment.shippingDate,
      time: '08:30 AM',
      done: true,
      current: shipment.deliveryStatus === 'Pending Pickup',
    },
    {
      title: 'Pickup Completed & Security Clearance',
      location: shipment.pickupAddress,
      date: shipment.shippingDate,
      time: '12:45 PM',
      done: shipment.deliveryStatus !== 'Pending Pickup' && shipment.deliveryStatus !== 'Cancelled',
      current: shipment.deliveryStatus === 'In Transit' && (shipment.progress || 50) < 50,
    },
    {
      title: 'Dispatched on Flight / Linehaul Corridor',
      location: shipment.currentLocation || 'Active Air Route',
      date: shipment.shippingDate,
      time: '19:15 PM',
      done:
        shipment.deliveryStatus === 'Out for Delivery' ||
        shipment.deliveryStatus === 'Delivered' ||
        (shipment.deliveryStatus === 'In Transit' && (shipment.progress || 50) >= 50),
      current: shipment.deliveryStatus === 'In Transit' && (shipment.progress || 50) >= 50,
    },
    {
      title: 'Out for Final Terminal Delivery',
      location: shipment.deliveryAddress?.split(',')[1]?.trim() || 'Destination City',
      date: shipment.expectedDeliveryDate,
      time: '09:00 AM',
      done: shipment.deliveryStatus === 'Delivered',
      current: shipment.deliveryStatus === 'Out for Delivery',
    },
    {
      title: 'Delivered & Consignee Signature Verified',
      location: shipment.deliveryAddress,
      date: shipment.expectedDeliveryDate,
      time: '14:30 PM',
      done: shipment.deliveryStatus === 'Delivered',
      current: shipment.deliveryStatus === 'Delivered',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 print:p-0 print:bg-white print:text-black">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#091526] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none print:hidden" />

        {/* =========================================================
            FIXED HEADER BAR (Always visible at top of modal)
            ========================================================= */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-cyan-500/20 bg-[#07101e]/90 relative z-10 shrink-0 gap-2.5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)] shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-mono text-sm sm:text-base font-extrabold text-white tracking-wider truncate">
                  {shipment.trackingNumber || shipment.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  title="Copy Tracking Number"
                  className="p-1 rounded-md bg-white/[0.05] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <span
                  className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${getStatusBadge(
                    shipment.deliveryStatus
                  )}`}
                >
                  {shipment.deliveryStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans truncate mt-0.5">
                Carrier: <span className="text-cyan-300 font-semibold">{shipment.carrier || 'Global Air Cargo'}</span> • Issued Waybill
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0 print:hidden">
            <button
              type="button"
              onClick={handlePrintManifest}
              title="Print Official Manifest"
              className="p-1.5 sm:p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleShare}
              title="Share Tracking Link"
              className="p-1.5 sm:p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onEdit(shipment)
                }}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/25 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onDelete(shipment)
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-all cursor-pointer"
                title="Delete Consignment"
              >
                <Trash2 className="w-4 h-4" />
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
            SCROLLABLE BODY CONTENT (Fits within viewport screen height)
            ========================================================= */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5 relative z-10">
          {/* Waypoint Progress Bar */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#050b14] border border-cyan-500/30">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-mono uppercase font-semibold text-[11px]">
                Waypoint Progress
              </span>
              <span className="text-cyan-400 font-mono font-bold text-xs">
                {shipment.progress || (shipment.deliveryStatus === 'Delivered' ? 100 : 50)}% Transit
              </span>
            </div>
            <div className="w-full bg-[#0c203b] h-2 rounded-full overflow-hidden border border-cyan-500/20">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 shadow-[0_0_10px_#38bdf8] transition-all duration-500"
                style={{
                  width: `${shipment.progress || (shipment.deliveryStatus === 'Delivered' ? 100 : 50)}%`,
                }}
              />
            </div>
          </div>

          {/* SENDER & RECEIVER 2-COLUMN CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sender Origin */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#050b14]/80 border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-mono font-bold uppercase mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Origin & Dispatcher</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mb-0.5">
                  {shipment.senderName}
                </div>
                <div className="text-[11px] text-slate-300 leading-snug font-sans">
                  {shipment.pickupAddress}
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-400" /> Shipping Date
                </span>
                <span className="font-mono text-white font-semibold">{shipment.shippingDate}</span>
              </div>
            </div>

            {/* Consignee Destination */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#050b14]/80 border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-mono font-bold uppercase mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Consignee Destination</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mb-0.5">
                  {shipment.receiverName}
                </div>
                <div className="text-[11px] text-slate-300 leading-snug font-sans">
                  {shipment.deliveryAddress}
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" /> Expected Delivery
                </span>
                <span className="font-mono text-emerald-300 font-semibold">{shipment.expectedDeliveryDate}</span>
              </div>
            </div>
          </div>

          {/* PARCEL SPECIFICATIONS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-cyan-500/20 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Parcel Type
              </span>
              <span className="text-xs font-bold text-cyan-300 mt-0.5 block truncate">
                {shipment.parcelType}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-cyan-500/20 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Gross Weight
              </span>
              <span className="text-xs font-bold text-white mt-0.5 block font-mono">
                {shipment.parcelWeight} KG
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-cyan-500/20 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Current Waypoint
              </span>
              <span className="text-[11px] font-bold text-emerald-300 mt-0.5 block truncate">
                {shipment.currentLocation || 'In Transit Corridor'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-cyan-500/20 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                SLA Security
              </span>
              <span className="text-[11px] font-bold text-sky-300 mt-0.5 block flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-400" /> GPS Encrypted
              </span>
            </div>
          </div>

          {/* SPECIAL HANDLING NOTES IF PRESENT */}
          {shipment.notes && (
            <div className="p-2.5 rounded-xl bg-[#0c203b]/60 border border-cyan-500/20 text-xs">
              <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold block mb-0.5">
                Special Handling Instructions & Manifest Notes:
              </span>
              <p className="text-slate-300 italic text-[11px] leading-relaxed">{shipment.notes}</p>
            </div>
          )}

          {/* TIMELINE MILESTONES */}
          <div className="p-3.5 rounded-xl bg-[#050b14] border border-cyan-500/20">
            <h4 className="text-[11px] font-mono font-bold uppercase text-cyan-400 mb-2.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Waypoint Timeline & Transit Milestones
            </h4>

            <div className="space-y-2.5">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-2.5 relative">
                  {/* Vertical line connecting nodes */}
                  {idx < milestones.length - 1 && (
                    <div
                      className={`absolute left-3 top-5 w-0.5 h-6 ${
                        m.done ? 'bg-cyan-400/60' : 'bg-slate-700'
                      }`}
                    />
                  )}

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                      m.done
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                        : m.current
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {m.done ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Truck className="w-3 h-3" />
                    )}
                  </div>

                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className={`font-bold text-[11px] ${m.done ? 'text-white' : 'text-slate-400'}`}>
                        {m.title}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {m.date} • {m.time}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {m.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIMULATED HIGH-TECH BARCODE MANIFEST */}
          <div className="p-2.5 rounded-xl bg-[#03060d] border border-cyan-500/30 flex flex-col items-center justify-center text-center">
            <div className="font-mono text-base sm:text-lg tracking-[0.25em] font-extrabold text-cyan-300 select-all leading-tight">
              ||| | ||||| || |||| ||||| ||| |||| |
            </div>
            <div className="font-mono text-[10px] text-slate-400 mt-1 tracking-wider uppercase">
              WAYBILL AUTHENTICATION KEY: {shipment.trackingNumber || shipment.id}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-cyan-500/20 bg-[#07101e]/90 shrink-0">
          <Link
            to={`/tracking?code=${encodeURIComponent(shipment.trackingNumber || shipment.id)}`}
            onClick={onClose}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Open Dedicated Live GPS Radar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Close Manifest
          </button>
        </div>
      </div>
    </div>
  )
}
