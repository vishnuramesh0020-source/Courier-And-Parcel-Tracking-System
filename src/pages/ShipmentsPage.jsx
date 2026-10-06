import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/common/Navbar'
import ShipmentFormModal from '../components/shipments/ShipmentFormModal'
import DeleteConfirmModal from '../components/shipments/DeleteConfirmModal'
import ShipmentDetailsModal from '../components/shipments/ShipmentDetailsModal'
import {
  fetchShipments,
  createShipment,
  updateShipment,
  deleteShipment,
} from '../services/shipmentApi'
import {
  Package,
  PlusCircle,
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  Grid,
  List,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'react-toastify'

const PARCEL_TYPES = [
  'All Types',
  'Standard Box',
  'Document',
  'Electronics',
  'Fragile',
  'Heavy Freight',
  'Perishable',
  'Medical Supplies',
]

const STATUS_FILTERS = [
  'All Statuses',
  'Pending Pickup',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'Customs Clearance',
  'Cancelled',
]

export default function ShipmentsPage() {
  // 1. Data State
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 2. Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingShipment, setEditingShipment] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [detailsShipment, setDetailsShipment] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const [deletingShipment, setDeletingShipment] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // 3. Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [sortBy, setSortBy] = useState('date-desc')
  const [viewMode, setViewMode] = useState('table')

  // 4. Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  // Load shipments on mount
  const loadShipments = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchShipments()
      setShipments(res.data)
    } catch (err) {
      console.error('Failed to load shipments:', err)
      setError(err.message || 'Failed to fetch shipments from Third-Party API.')
      toast.error('Network Error: Could not connect to API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchShipments()
        if (isMounted) {
          setShipments(res.data)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load shipments:', err)
          setError(err.message || 'Failed to fetch shipments from Third-Party API.')
          toast.error('Network Error: Could not connect to API.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  // =========================================================
  // CRUD HANDLERS
  // =========================================================

  // Create or Update
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      if (editingShipment) {
        // Edit existing shipment
        const updated = await updateShipment(
          editingShipment.id || editingShipment.trackingNumber,
          formData
        )
        setShipments((prev) =>
          prev.map((s) =>
            s.id === updated.id || s.trackingNumber === updated.trackingNumber
              ? updated
              : s
          )
        )
        toast.success(`Consignment ${updated.trackingNumber} updated via API!`)
      } else {
        // Create new shipment
        const created = await createShipment(formData)
        setShipments((prev) => [created, ...prev])
        toast.success(`Consignment ${created.trackingNumber} issued & dispatched!`)
      }
      setIsFormModalOpen(false)
      setEditingShipment(null)
    } catch (err) {
      console.error('Form submit error:', err)
      toast.error(`Operation failed: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete
  const handleDeleteConfirm = async (id) => {
    try {
      setIsDeleting(true)
      await deleteShipment(id)
      setShipments((prev) =>
        prev.filter((s) => s.id !== id && s.trackingNumber !== id)
      )
      toast.success(`Consignment ${id} deleted via Third-Party API.`)
      setIsDeleteModalOpen(false)
      setDeletingShipment(null)
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(`Delete failed: ${err.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  // Open Details Modal
  const handleOpenDetails = (shipment) => {
    setDetailsShipment(shipment)
    setIsDetailsModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (shipment) => {
    setEditingShipment(shipment)
    setIsFormModalOpen(true)
  }

  // Open Delete Modal
  const handleOpenDelete = (shipment) => {
    setDeletingShipment(shipment)
    setIsDeleteModalOpen(true)
  }

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingShipment(null)
    setIsFormModalOpen(true)
  }

  // =========================================================
  // FILTERING, SEARCHING & SORTING PIPELINE
  // =========================================================
  const filteredAndSortedShipments = useMemo(() => {
    return shipments
      .filter((s) => {
        // 1. Search Query
        const q = searchQuery.trim().toLowerCase()
        const matchesSearch =
          !q ||
          s.trackingNumber?.toLowerCase().includes(q) ||
          s.id?.toLowerCase().includes(q) ||
          s.senderName?.toLowerCase().includes(q) ||
          s.receiverName?.toLowerCase().includes(q) ||
          s.pickupAddress?.toLowerCase().includes(q) ||
          s.deliveryAddress?.toLowerCase().includes(q) ||
          s.carrier?.toLowerCase().includes(q)

        // 2. Parcel Type Filter
        const matchesType =
          typeFilter === 'All Types' || s.parcelType === typeFilter

        // 3. Delivery Status Filter
        const matchesStatus =
          statusFilter === 'All Statuses' || s.deliveryStatus === statusFilter

        return matchesSearch && matchesType && matchesStatus
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-desc':
            return new Date(b.shippingDate) - new Date(a.shippingDate)
          case 'date-asc':
            return new Date(a.shippingDate) - new Date(b.shippingDate)
          case 'eta-asc':
            return new Date(a.expectedDeliveryDate) - new Date(b.expectedDeliveryDate)
          case 'weight-desc':
            return (b.parcelWeight || 0) - (a.parcelWeight || 0)
          case 'weight-asc':
            return (a.parcelWeight || 0) - (b.parcelWeight || 0)
          case 'code-asc':
            return (a.trackingNumber || a.id).localeCompare(b.trackingNumber || b.id)
          default:
            return 0
        }
      })
  }, [shipments, searchQuery, typeFilter, statusFilter, sortBy])

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const handleTypeChange = (val) => {
    setTypeFilter(val)
    setCurrentPage(1)
  }

  const handleStatusChange = (val) => {
    setStatusFilter(val)
    setCurrentPage(1)
  }

  const handleSortChange = (val) => {
    setSortBy(val)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setTypeFilter('All Types')
    setStatusFilter('All Statuses')
    setCurrentPage(1)
  }

  // =========================================================
  // PAGINATION CALCULATIONS
  // =========================================================
  const totalItems = filteredAndSortedShipments.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const paginatedShipments = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredAndSortedShipments.slice(start, start + pageSize)
  }, [filteredAndSortedShipments, currentPage, pageSize])

  // Quick summary counts
  const summaryCounts = useMemo(() => {
    return {
      total: shipments.length,
      inTransit: shipments.filter((s) => s.deliveryStatus === 'In Transit').length,
      delivered: shipments.filter((s) => s.deliveryStatus === 'Delivered').length,
      outForDelivery: shipments.filter((s) => s.deliveryStatus === 'Out for Delivery').length,
      pending: shipments.filter((s) => s.deliveryStatus === 'Pending Pickup').length,
    }
  }, [shipments])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.25)]'
      case 'In Transit':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-400/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
      case 'Out for Delivery':
        return 'bg-sky-500/15 text-sky-300 border-sky-400/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
      case 'Customs Clearance':
        return 'bg-amber-500/15 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.25)]'
      case 'Cancelled':
        return 'bg-rose-500/15 text-rose-300 border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
      case 'Pending Pickup':
      default:
        return 'bg-purple-500/15 text-purple-300 border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
    }
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col select-none relative overflow-x-hidden font-sans">
      {/* Background Cyber Glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Unified Cyber Navigation Bar */}
      <Navbar />

      {/* Main Container (Full Width, No Side Spacing) */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-5 relative z-10">
        {/* =========================================================
            HEADER & ACTIONS BAR
            ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Package className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Shipment Operations & Waybill Registry
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Reload button */}
            <button
              type="button"
              onClick={loadShipments}
              disabled={loading}
              title="Refresh Shipments from API"
              className="p-2 rounded-xl bg-[#091526] border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Create New Shipment Action */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Shipment</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            SUMMARY STATS CHIPS (Quick Telemetry Bar)
            ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl bg-[#091526]/90 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Manifest</span>
              <span className="text-lg font-extrabold text-white font-mono">{summaryCounts.total}</span>
            </div>
            <Package className="w-5 h-5 text-cyan-400 opacity-80" />
          </div>

          <div className="p-3 rounded-xl bg-[#091526]/90 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">In Transit</span>
              <span className="text-lg font-extrabold text-cyan-300 font-mono">{summaryCounts.inTransit}</span>
            </div>
            <Truck className="w-5 h-5 text-cyan-400 opacity-80" />
          </div>

          <div className="p-3 rounded-xl bg-[#091526]/90 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Out For Delivery</span>
              <span className="text-lg font-extrabold text-sky-300 font-mono">{summaryCounts.outForDelivery}</span>
            </div>
            <Clock className="w-5 h-5 text-sky-400 opacity-80" />
          </div>

          <div className="p-3 rounded-xl bg-[#091526]/90 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Delivered</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{summaryCounts.delivered}</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-80" />
          </div>

          <div className="p-3 rounded-xl bg-[#091526]/90 border border-cyan-500/30 flex items-center justify-between col-span-2 sm:col-span-1">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pending Pickup</span>
              <span className="text-lg font-extrabold text-purple-300 font-mono">{summaryCounts.pending}</span>
            </div>
            <Clock className="w-5 h-5 text-purple-400 opacity-80" />
          </div>
        </div>

        {/* =========================================================
            SEARCH, FILTERS, SORTS & VIEW CONTROLS
            ========================================================= */}
        <div className="p-4 rounded-2xl bg-[#091526]/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.12)] flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input (5 cols) */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search tracking #, sender, receiver, address, or carrier..."
                className="w-full h-10 pl-10 pr-8 text-xs sm:text-sm rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter by Type (2 cols) */}
            <div className="md:col-span-2">
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-white outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {PARCEL_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-[#091526] text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter by Status (2 cols) */}
            <div className="md:col-span-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-white outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {STATUS_FILTERS.map((s) => (
                    <option key={s} value={s} className="bg-[#091526] text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort by Date & Weight (2 cols) */}
            <div className="md:col-span-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-white outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="date-desc" className="bg-[#091526] text-white">
                    Date: Newest First
                  </option>
                  <option value="date-asc" className="bg-[#091526] text-white">
                    Date: Oldest First
                  </option>
                  <option value="eta-asc" className="bg-[#091526] text-white">
                    ETA: Earliest First
                  </option>
                  <option value="weight-desc" className="bg-[#091526] text-white">
                    Weight: High to Low
                  </option>
                  <option value="weight-asc" className="bg-[#091526] text-white">
                    Weight: Low to High
                  </option>
                  <option value="code-asc" className="bg-[#091526] text-white">
                    Tracking ID: A-Z
                  </option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle (1 col) */}
            <div className="md:col-span-1 flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Table List View"
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-[#050b14] border-cyan-500/30 text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                title="Grid Cards View"
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-[#050b14] border-cyan-500/30 text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filter Tags */}
          {(searchQuery || typeFilter !== 'All Types' || statusFilter !== 'All Statuses') && (
            <div className="flex items-center gap-2 pt-2 border-t border-cyan-500/20 flex-wrap text-xs">
              <span className="text-slate-400 text-[11px] font-mono uppercase">Active Filters:</span>
              {searchQuery && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[11px] flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => handleSearchChange('')} className="hover:text-white">✕</button>
                </span>
              )}
              {typeFilter !== 'All Types' && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[11px] flex items-center gap-1">
                  Type: {typeFilter}
                  <button onClick={() => handleTypeChange('All Types')} className="hover:text-white">✕</button>
                </span>
              )}
              {statusFilter !== 'All Statuses' && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[11px] flex items-center gap-1">
                  Status: {statusFilter}
                  <button onClick={() => handleStatusChange('All Statuses')} className="hover:text-white">✕</button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:underline cursor-pointer ml-auto"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* =========================================================
            LOADING & ERROR STATES
            ========================================================= */}
        {loading && (
          <div className="w-full p-12 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Connecting to Third-Party Freight API...
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Synchronizing consignment database & transponder telemetry
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="w-full p-6 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">API Connection Notice</h3>
                <p className="text-xs text-rose-300/80">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadShipments}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Retry API Request
            </button>
          </div>
        )}

        {/* =========================================================
            SHIPMENTS CONTENT (TABLE OR CARDS VIEW)
            ========================================================= */}
        {!loading && !error && (
          <>
            {filteredAndSortedShipments.length === 0 ? (
              <div className="w-full p-16 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 flex flex-col items-center justify-center text-center">
                <Package className="w-12 h-12 text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-white">No Shipments Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  No consignments match your current search criteria. Try modifying your filter or create a new shipment.
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  Create New Shipment
                </button>
              </div>
            ) : viewMode === 'table' ? (
              /* =========================================================
                  TABULAR VIEW (HIGH-TECH CYBER HUD DISPATCH TABLE)
                  ========================================================= */
              <div className="w-full rounded-2xl bg-[#091526]/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#050b14] text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider border-b border-cyan-500/30">
                        <th className="py-3.5 px-4">TRACKING #</th>
                        <th className="py-3.5 px-4">SENDER</th>
                        <th className="py-3.5 px-4">RECEIVER</th>
                        <th className="py-3.5 px-4">TYPE & WEIGHT</th>
                        <th className="py-3.5 px-4">DATES (SHIP / ETA)</th>
                        <th className="py-3.5 px-4 text-center">STATUS</th>
                        <th className="py-3.5 px-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-500/10">
                      {paginatedShipments.map((s) => (
                        <tr
                          key={s.id || s.trackingNumber}
                          className="hover:bg-cyan-500/5 transition-colors text-slate-200 group"
                        >
                          {/* Tracking Number */}
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleOpenDetails(s)}
                              className="font-mono text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>{s.trackingNumber || s.id}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {s.carrier || 'Global Air Cargo'}
                            </div>
                          </td>

                          {/* Sender */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-xs">{s.senderName}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                              {s.pickupAddress}
                            </div>
                          </td>

                          {/* Receiver */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-xs">{s.receiverName}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                              {s.deliveryAddress}
                            </div>
                          </td>

                          {/* Type & Weight */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-200 block">{s.parcelType}</span>
                            <span className="font-mono text-[11px] text-cyan-300">
                              {s.parcelWeight} kg
                            </span>
                          </td>

                          {/* Dates */}
                          <td className="py-3.5 px-4 text-xs font-mono">
                            <div className="text-slate-300">
                              Ship: <span className="text-white">{s.shippingDate}</span>
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              ETA: <span className="text-emerald-300 font-semibold">{s.expectedDeliveryDate}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${getStatusBadge(
                                s.deliveryStatus
                              )}`}
                            >
                              {s.deliveryStatus}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Details */}
                              <button
                                type="button"
                                onClick={() => handleOpenDetails(s)}
                                title="View Consignment Details"
                                className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(s)}
                                title="Edit Consignment"
                                className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/25 transition-colors cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleOpenDelete(s)}
                                title="Delete Consignment"
                                className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* =========================================================
                  CARDS VIEW (RESPONSIVE CYBER HUD TILES)
                  ========================================================= */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedShipments.map((s) => (
                  <div
                    key={s.id || s.trackingNumber}
                    className="p-4 rounded-2xl bg-[#091526]/90 border border-cyan-500/40 hover:border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_28px_rgba(6,182,212,0.25)] flex flex-col justify-between transition-all group"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-cyan-500/20">
                        <div>
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(s)}
                            className="font-mono text-sm font-bold text-cyan-300 hover:underline cursor-pointer block"
                          >
                            {s.trackingNumber || s.id}
                          </button>
                          <span className="text-[10px] text-slate-400">
                            {s.carrier || 'Global Air Cargo'}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${getStatusBadge(
                            s.deliveryStatus
                          )}`}
                        >
                          {s.deliveryStatus}
                        </span>
                      </div>

                      {/* Route Info */}
                      <div className="mt-3 space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-mono block">From (Sender):</span>
                          <span className="font-bold text-white block">{s.senderName}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{s.pickupAddress}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-mono block">To (Receiver):</span>
                          <span className="font-bold text-white block">{s.receiverName}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{s.deliveryAddress}</span>
                        </div>
                      </div>

                      {/* Metrics Pill Grid */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/10 text-[11px]">
                        <div className="p-1.5 rounded-lg bg-[#050b14] border border-cyan-500/20 text-center">
                          <span className="text-[9px] text-slate-400 block uppercase">Type</span>
                          <span className="font-semibold text-cyan-300 truncate block">{s.parcelType}</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[#050b14] border border-cyan-500/20 text-center font-mono">
                          <span className="text-[9px] text-slate-400 block uppercase">Weight</span>
                          <span className="font-bold text-white">{s.parcelWeight} kg</span>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Ship: {s.shippingDate}</span>
                        <span className="text-emerald-300 font-semibold">ETA: {s.expectedDeliveryDate}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-3 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(s)}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded-lg hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(s)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* =========================================================
                PAGINATION CONTROLS
                ========================================================= */}
            <div className="p-3.5 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">
                  Showing{' '}
                  <span className="text-cyan-300 font-bold font-mono">
                    {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="text-cyan-300 font-bold font-mono">
                    {Math.min(currentPage * pageSize, totalItems)}
                  </span>{' '}
                  of <span className="text-white font-bold font-mono">{totalItems}</span> consignments
                </span>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="hidden sm:inline">Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="h-7 px-2 rounded-lg bg-[#050b14] border border-cyan-500/30 text-white outline-none cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-[#050b14] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1
                  if (
                    pNum === 1 ||
                    pNum === totalPages ||
                    (pNum >= currentPage - 1 && pNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => setCurrentPage(pNum)}
                        className={`w-8 h-7 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                          currentPage === pNum
                            ? 'bg-cyan-500 border border-cyan-300 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                            : 'bg-[#050b14] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400'
                        }`}
                      >
                        {pNum}
                      </button>
                    )
                  }
                  if (pNum === currentPage - 2 || pNum === currentPage + 2) {
                    return (
                      <span key={pNum} className="px-1 text-slate-500 font-mono">
                        ...
                      </span>
                    )
                  }
                  return null
                })}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg bg-[#050b14] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* =========================================================
          INTERACTIVE CRUD MODALS
          ========================================================= */}
      <ShipmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditingShipment(null)
        }}
        onSubmit={handleFormSubmit}
        initialData={editingShipment}
        isSubmitting={isSubmitting}
      />

      <ShipmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setDetailsShipment(null)
        }}
        shipment={detailsShipment}
        onEdit={(s) => {
          handleOpenEdit(s)
        }}
        onDelete={(s) => {
          handleOpenDelete(s)
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeletingShipment(null)
        }}
        onConfirm={handleDeleteConfirm}
        shipment={deletingShipment}
        isDeleting={isDeleting}
      />
    </div>
  )
}
