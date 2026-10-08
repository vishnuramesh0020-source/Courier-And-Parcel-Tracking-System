import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import StatusBadge from '../components/common/StatusBadge'
import ShipmentFormModal from '../components/shipments/ShipmentFormModal'
import DeleteConfirmModal from '../components/shipments/DeleteConfirmModal'
import {
  fetchShipmentById,
  updateShipment,
  deleteShipment,
} from '../services/shipmentApi'
import {
  Package,
  MapPin,
  Calendar,
  ArrowLeft,
  Copy,
  Check,
  Printer,
  Edit,
  Trash2,
  ShieldCheck,
  Share2,
  Loader2,
  AlertCircle,
  Radar,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function ShipmentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  // Edit / Delete modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isMounted = true
    const loadDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchShipmentById(id)
        if (isMounted) setShipment(data)
      } catch (err) {
        if (isMounted) setError(err.message || 'Consignment could not be found.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) {
      loadDetails()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  const handleCopy = () => {
    if (!shipment) return
    navigator.clipboard.writeText(shipment.trackingNumber || shipment.id)
    setCopied(true)
    toast.success('Tracking code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.info('Shareable tracking URL copied to clipboard!')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEditSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      const updated = await updateShipment(shipment.id || shipment.trackingNumber, formData)
      setShipment(updated)
      setIsEditModalOpen(false)
      toast.success('Consignment updated via API!')
    } catch (err) {
      toast.error(`Update failed: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async (shipmentId) => {
    try {
      setIsDeleting(true)
      await deleteShipment(shipmentId)
      toast.success('Consignment deleted via API.')
      setIsDeleteModalOpen(false)
      navigate('/shipments')
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`)
    } finally {
      setIsDeleting(false)
    }
  }


  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col select-none relative overflow-x-hidden font-sans">
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 relative z-10 max-w-5xl mx-auto">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/shipments"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shipments Registry</span>
          </Link>
        </div>

        {loading && (
          <div className="w-full p-16 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mb-4" />
            <p className="text-sm text-slate-300">Retrieving Consignment Waybill...</p>
          </div>
        )}

        {error && !loading && (
          <div className="w-full p-8 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-10 h-10 text-rose-400 mb-2" />
            <h2 className="text-base font-bold text-white">Consignment Not Found</h2>
            <p className="text-xs text-rose-300/80 mt-1 max-w-md">{error}</p>
            <Link
              to="/shipments"
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
            >
              Back to Shipments
            </Link>
          </div>
        )}

        {!loading && !error && shipment && (
          <div className="w-full space-y-6">
            {/* Header Card */}
            <div className="p-5 sm:p-7 rounded-2xl bg-[#091526]/90 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="font-mono text-xl sm:text-2xl font-extrabold text-white tracking-wider">
                      {shipment.trackingNumber || shipment.id}
                    </h1>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Copy Tracking ID"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <StatusBadge status={shipment.deliveryStatus} size="sm" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Carrier Line: <span className="text-cyan-300 font-semibold">{shipment.carrier || 'Global Air Cargo'}</span> • SLA Protected
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/tracking?code=${encodeURIComponent(shipment.trackingNumber || shipment.id)}`}
                  title="Track Live GPS Radar"
                  className="px-3.5 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/25 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Radar className="w-4 h-4" />
                  <span>Live Radar</span>
                </Link>
                <button
                  type="button"
                  onClick={handlePrint}
                  title="Print Waybill"
                  className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  title="Share Tracking Link"
                  className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/25 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Waypoint Progress */}
            <div className="p-5 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 font-mono uppercase font-semibold">
                  Transit Progression
                </span>
                <span className="text-cyan-400 font-mono font-bold">
                  {shipment.progress || (shipment.deliveryStatus === 'Delivered' ? 100 : 50)}% Transit
                </span>
              </div>
              <div className="w-full bg-[#050b14] h-2.5 rounded-full overflow-hidden border border-cyan-500/20">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 shadow-[0_0_12px_#38bdf8] transition-all duration-500"
                  style={{
                    width: `${shipment.progress || (shipment.deliveryStatus === 'Delivered' ? 100 : 50)}%`,
                  }}
                />
              </div>
            </div>

            {/* Origin & Destination Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-[#091526]/90 border border-cyan-500/30">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase mb-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Origin / Shipper</span>
                </div>
                <div className="text-base font-bold text-white mb-1">
                  {shipment.senderName}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {shipment.pickupAddress}
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Shipping Date
                  </span>
                  <span className="font-mono text-white font-semibold">{shipment.shippingDate}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#091526]/90 border border-cyan-500/30">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase mb-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Consignee / Recipient</span>
                </div>
                <div className="text-base font-bold text-white mb-1">
                  {shipment.receiverName}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {shipment.deliveryAddress}
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Expected Delivery
                  </span>
                  <span className="font-mono text-emerald-300 font-semibold">{shipment.expectedDeliveryDate}</span>
                </div>
              </div>
            </div>

            {/* Specifications Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-[#091526]/90 border border-cyan-500/20 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Parcel Type
                </span>
                <span className="text-sm font-bold text-cyan-300 mt-1 block">
                  {shipment.parcelType}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#091526]/90 border border-cyan-500/20 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Gross Weight
                </span>
                <span className="text-sm font-bold text-white mt-1 block font-mono">
                  {shipment.parcelWeight} KG
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#091526]/90 border border-cyan-500/20 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Current Waypoint
                </span>
                <span className="text-xs font-bold text-emerald-300 mt-1 block truncate">
                  {shipment.currentLocation || 'In Transit Corridor'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#091526]/90 border border-cyan-500/20 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  SLA Status
                </span>
                <span className="text-xs font-bold text-sky-300 mt-1 block flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> 100% On-Time
                </span>
              </div>
            </div>

            {/* Barcode Key */}
            <div className="p-4 rounded-2xl bg-[#03060d] border border-cyan-500/30 flex flex-col items-center justify-center text-center">
              <div className="font-mono text-2xl tracking-[0.35em] font-extrabold text-cyan-300 select-all">
                ||| | ||||| || |||| ||||| ||| |||| |
              </div>
              <div className="font-mono text-[11px] text-slate-400 mt-1 tracking-widest uppercase">
                WAYBILL KEY: {shipment.trackingNumber || shipment.id}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit & Delete Modals */}
      <ShipmentFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={shipment}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        shipment={shipment}
        isDeleting={isDeleting}
      />
    </div>
  )
}
