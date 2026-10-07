import { useState } from 'react'
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  Printer,
  Share2,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'react-toastify'

function getETAEstimate(expectedDeliveryDate, deliveryStatus) {
  if (deliveryStatus === 'Delivered') {
    return 'Consignment Successfully Delivered'
  }
  if (deliveryStatus === 'Out for Delivery') {
    return 'Arriving Today (Final Mile Dispatch)'
  }
  if (deliveryStatus === 'Customs Clearance') {
    return 'In Harbor / Customs Inspection'
  }
  if (expectedDeliveryDate) {
    return `Estimated Arrival: ${expectedDeliveryDate}`
  }
  return 'In Route via Express Transit'
}

export default function TrackingSummaryCard({
  shipment,
  onOpenStatusModal,
}) {
  const [copied, setCopied] = useState(false)

  if (!shipment) return null

  const handleCopyCode = () => {
    navigator.clipboard.writeText(shipment.trackingNumber || shipment.id)
    setCopied(true)
    toast.success('Tracking code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    const url = `${window.location.origin}/tracking?code=${encodeURIComponent(shipment.trackingNumber || shipment.id)}`
    navigator.clipboard.writeText(url)
    toast.info('Direct tracking URL copied to clipboard!')
  }

  const handlePrint = () => {
    window.print()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
      case 'In Transit':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
      case 'Out for Delivery':
        return 'bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
      case 'Customs Clearance':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
      case 'Cancelled':
        return 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
      case 'Pending Pickup':
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
    }
  }

  const progress = shipment.progress || (shipment.deliveryStatus === 'Delivered' ? 100 : 50)

  return (
    <div className="w-full rounded-2xl bg-[#091526]/90 border border-cyan-500/40 p-5 sm:p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden flex flex-col gap-5">
      {/* Soft atmospheric gradient sheen */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

      {/* =========================================================
          SECTION 1: WAYBILL BANNER & QUICK ACTIONS
          ========================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-lg sm:text-2xl font-extrabold text-white tracking-wider">
                {shipment.trackingNumber || shipment.id}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-[#050b14] hover:bg-cyan-500/20 border border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                title="Copy Tracking ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${getStatusBadge(
                  shipment.deliveryStatus
                )}`}
              >
                {shipment.deliveryStatus}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>Carrier: <strong className="text-cyan-300">{shipment.carrier || 'Global Air Cargo'}</strong></span>
              <span>•</span>
              <span>Class: <strong className="text-slate-300">Priority Transcontinental Express</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {onOpenStatusModal && (
            <button
              type="button"
              onClick={onOpenStatusModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update Status</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-2 rounded-xl bg-[#050b14] border border-cyan-500/30 hover:border-cyan-300 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Share Tracking Link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-[#050b14] border border-cyan-500/30 hover:border-cyan-300 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Print Tracking Waybill"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          SECTION 2: TRANSIT PROGRESSION & ESTIMATED DELIVERY COUNTDOWN
          ========================================================= */}
      <div className="p-4 rounded-xl bg-[#050b14] border border-cyan-500/30 flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-semibold">
              {getETAEstimate(shipment.expectedDeliveryDate, shipment.deliveryStatus)}
            </span>
          </div>
          <div className="font-mono text-cyan-400 font-bold">
            {progress}% Completed
          </div>
        </div>

        {/* Glowing Progress Bar */}
        <div className="w-full bg-[#03060d] h-2.5 rounded-full overflow-hidden border border-cyan-500/20">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 shadow-[0_0_12px_#38bdf8] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Milestone Route Node Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Origin Terminal
          </span>
          <span className="text-slate-500">→</span>
          <span className={progress >= 50 ? 'text-cyan-300' : 'text-slate-500'}>
            Air Corridor Waypoint
          </span>
          <span className="text-slate-500">→</span>
          <span className={progress >= 85 ? 'text-sky-300' : 'text-slate-500'}>
            Inbound Hub
          </span>
          <span className="text-slate-500">→</span>
          <span className={progress === 100 ? 'text-emerald-400' : 'text-slate-500'}>
            Destination Delivery
          </span>
        </div>
      </div>

      {/* =========================================================
          SECTION 3: ORIGIN & DESTINATION COORDINATE TILES
          ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Origin Shipper Card */}
        <div className="p-4 rounded-xl bg-[#071324] border border-cyan-500/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-cyan-400 mb-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Origin / Consignor
              </span>
              <span className="text-[10px] text-slate-400">PICKUP NODE</span>
            </div>
            <div className="text-sm font-bold text-white mb-1">
              {shipment.senderName}
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              {shipment.pickupAddress}
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-cyan-500/15 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Dispatched
            </span>
            <span className="font-mono text-white font-semibold">{shipment.shippingDate}</span>
          </div>
        </div>

        {/* Destination Consignee Card */}
        <div className="p-4 rounded-xl bg-[#071324] border border-cyan-500/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-emerald-400 mb-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Destination / Consignee
              </span>
              <span className="text-[10px] text-slate-400">DELIVERY NODE</span>
            </div>
            <div className="text-sm font-bold text-white mb-1">
              {shipment.receiverName}
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              {shipment.deliveryAddress}
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-cyan-500/15 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Expected Delivery
            </span>
            <span className="font-mono text-emerald-300 font-semibold">{shipment.expectedDeliveryDate}</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 4: KEY TELEMETRY SPECS & BARCODE
          ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="p-3 rounded-xl bg-[#050b14] border border-cyan-500/20 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Parcel Type</span>
          <span className="text-xs sm:text-sm font-bold text-cyan-300 mt-0.5 block truncate">
            {shipment.parcelType}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#050b14] border border-cyan-500/20 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Gross Weight</span>
          <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block font-mono">
            {shipment.parcelWeight} KG
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#050b14] border border-cyan-500/20 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Service Class</span>
          <span className="text-xs sm:text-sm font-bold text-sky-300 mt-0.5 block truncate">
            Air Express
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#050b14] border border-cyan-500/20 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">SLA Performance</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> On-Time Guaranteed
          </span>
        </div>
      </div>

      {/* Cyber Barcode Strip */}
      <div className="p-3 rounded-xl bg-[#03060d] border border-cyan-500/30 flex flex-col items-center justify-center text-center relative z-10">
        <div className="font-mono text-lg sm:text-xl tracking-[0.3em] font-extrabold text-cyan-300 select-all leading-none">
          ||| | ||||| || |||| ||||| ||| |||| |
        </div>
        <div className="font-mono text-[10px] text-slate-400 mt-1.5 tracking-widest uppercase">
          WAYBILL HASH: {shipment.trackingNumber || shipment.id} • 256-BIT ENCRYPTED
        </div>
      </div>
    </div>
  )
}
