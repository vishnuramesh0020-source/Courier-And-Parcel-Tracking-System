import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import StatusBadge from '../components/common/StatusBadge'
import CustomerFormModal from '../components/customers/CustomerFormModal'
import CustomerDeleteModal from '../components/customers/CustomerDeleteModal'
import {
  fetchCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../services/customerService'
import { getStoredShipments } from '../services/shipmentApi'
import {
  MapPin,
  Building2,
  Shield,
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Loader2,
  Truck,
  PlusCircle,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function CustomerProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copiedField, setCopiedField] = useState(null)

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchCustomerById(id)
        if (isMounted) setCustomer(data)
      } catch (err) {
        if (isMounted) setError(err.message || 'Customer record could not be found.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) {
      loadData()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  // Linked shipments
  const linkedShipments = useMemo(() => {
    if (!customer) return []
    try {
      const all = getStoredShipments()
      const searchName = customer.customerName.toLowerCase()
      return all.filter(
        (s) =>
          s.senderName?.toLowerCase().includes(searchName) ||
          s.receiverName?.toLowerCase().includes(searchName) ||
          searchName.includes(s.senderName?.toLowerCase() || '') ||
          searchName.includes(s.receiverName?.toLowerCase() || '')
      )
    } catch {
      return []
    }
  }, [customer])

  const handleCopy = (field, text) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(`${field} copied to clipboard!`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleEditSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      const res = await updateCustomer(customer.id, formData)
      setCustomer(res.data)
      toast.success('Customer profile successfully updated!')
      setIsEditModalOpen(false)
    } catch (err) {
      toast.error(err.message || 'Failed to update customer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async (customerId) => {
    try {
      setIsDeleting(true)
      await deleteCustomer(customerId)
      toast.success('Customer permanently removed.')
      navigate('/customers')
    } catch (err) {
      toast.error(err.message || 'Failed to delete customer.')
    } finally {
      setIsDeleting(false)
    }
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
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col select-none relative overflow-x-hidden font-sans">
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Unified Navigation Bar */}
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 relative z-10 max-w-5xl mx-auto">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Customer Directory</span>
          </Link>
        </div>

        {loading && (
          <div className="w-full p-16 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mb-4" />
            <p className="text-sm text-slate-300">Retrieving Customer Dossier...</p>
          </div>
        )}

        {error && !loading && (
          <div className="w-full p-8 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-10 h-10 text-rose-400 mb-2" />
            <h2 className="text-base font-bold text-white">Customer Not Found</h2>
            <p className="text-xs text-rose-300/80 mt-1 max-w-md">{error}</p>
            <Link
              to="/customers"
              className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-colors"
            >
              Browse All Customers
            </Link>
          </div>
        )}

        {!loading && !error && customer && (
          <div className="space-y-6">
            {/* Header Hero Banner */}
            <div className="p-6 rounded-2xl bg-[#091526]/90 border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-extrabold text-2xl text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  {customer.customerName?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                      {customer.customerName}
                    </h1>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {customer.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2">
                    <span>Account ID: <strong className="text-cyan-300">{customer.id}</strong></span>
                    <span>•</span>
                    <span>Client since {customer.createdAt || '2026'}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/25 transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-all cursor-pointer shadow-sm"
                  title="Delete Customer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#091526]/80 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Total Consignments</span>
                  <span className="text-2xl font-mono font-extrabold text-white">{customer.totalShipments || 0}</span>
                </div>
                <Package className="w-6 h-6 text-cyan-400 opacity-80" />
              </div>

              <div className="p-4 rounded-xl bg-[#091526]/80 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Primary Dispatch Hub</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">{customer.city}</span>
                </div>
                <Building2 className="w-6 h-6 text-emerald-400 opacity-80" />
              </div>

              <div className="p-4 rounded-xl bg-[#091526]/80 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Account Tier</span>
                  <span className="text-lg font-bold text-purple-300 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    {customer.status}
                  </span>
                </div>
                <Shield className="w-6 h-6 text-purple-400 opacity-80" />
              </div>
            </div>

            {/* Contact & Billing Coordinates */}
            <div className="p-5 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Verified Contact & Address Coordinates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Email */}
                <div className="p-3.5 rounded-xl bg-[#050b14] border border-cyan-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email Address</span>
                    <span className="text-white font-medium block mt-0.5">{customer.email}</span>
                  </div>
                  <button
                    onClick={() => handleCopy('Email', customer.email)}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                    title="Copy Email"
                  >
                    {copiedField === 'Email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Mobile Phone */}
                <div className="p-3.5 rounded-xl bg-[#050b14] border border-cyan-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mobile Number</span>
                    <span className="text-white font-mono font-bold block mt-0.5">{customer.mobileNumber}</span>
                  </div>
                  <button
                    onClick={() => handleCopy('Mobile', customer.mobileNumber)}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                    title="Copy Phone"
                  >
                    {copiedField === 'Mobile' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Street Address */}
                <div className="p-3.5 rounded-xl bg-[#050b14] border border-cyan-500/20">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Physical Delivery Address</span>
                  <span className="text-white leading-relaxed font-medium block mt-0.5">{customer.address}</span>
                </div>

                {/* City & Postal */}
                <div className="p-3.5 rounded-xl bg-[#050b14] border border-cyan-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">City & Postal Code</span>
                    <span className="text-white font-medium block mt-0.5">
                      {customer.city}, <strong className="font-mono text-cyan-300 font-bold">{customer.postalCode}</strong>
                    </span>
                  </div>
                  <Building2 className="w-5 h-5 text-cyan-400 opacity-60" />
                </div>
              </div>
            </div>

            {/* Linked Shipments History */}
            <div className="p-5 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  Shipment Registry Associated with this Client
                </h3>
                <Link
                  to="/shipments"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                >
                  <span>Book Consignment</span>
                  <PlusCircle className="w-3.5 h-3.5" />
                </Link>
              </div>

              {linkedShipments.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-[#050b14] rounded-xl border border-cyan-500/20">
                  No active parcels currently tagged with this account name.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {linkedShipments.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-[#050b14] border border-cyan-500/20 flex items-center justify-between gap-4 text-xs hover:border-cyan-400/40 transition-colors"
                    >
                      <div className="min-w-0 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white tracking-wider">
                              {s.trackingNumber || s.id}
                            </span>
                            <StatusBadge status={s.deliveryStatus} size="sm" />
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {s.parcelType} • {s.parcelWeight} kg • Dispatched {s.shippingDate}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/shipments/${encodeURIComponent(s.trackingNumber || s.id)}`}
                        className="p-2 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors shrink-0 flex items-center gap-1 text-[11px] font-semibold"
                      >
                        <span>View Waybill</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Edit Customer Modal */}
      <CustomerFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={customer}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <CustomerDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        customer={customer}
        isDeleting={isDeleting}
      />
    </div>
  )
}
