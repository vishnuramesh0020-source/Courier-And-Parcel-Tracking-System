import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import StatusBadge from '../components/common/StatusBadge'
import StatusUpdateModal from '../components/status/StatusUpdateModal'
import BatchStatusModal from '../components/status/BatchStatusModal'
import StatusHistoryModal from '../components/status/StatusHistoryModal'
import { getLocalShipments, fetchShipments } from '../services/shipmentApi'
import {
  DELIVERY_STATUS_LIST,
  updateDeliveryStatus,
  batchUpdateDeliveryStatus,
  getStatusHistory,
  getAllStatusHistory,
} from '../services/statusService'
import {
  CheckCircle2,
  Clock,
  PackageCheck,
  Navigation,
  Truck,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Copy,
  Check,
  RefreshCw,
  Layers,
  History,
  Radar,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function DeliveryStatusPage() {
  const [shipments, setShipments] = useState(() => getLocalShipments())
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('desc') // 'desc' | 'asc'
  const [selectedCodes, setSelectedCodes] = useState([])
  const [copiedCode, setCopiedCode] = useState(null)

  // Load fresh API shipments on mount
  useEffect(() => {
    let ignore = false
    fetchShipments().then((res) => {
      if (!ignore && res?.data) {
        setShipments(res.data)
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Modal states
  const [activeShipmentForUpdate, setActiveShipmentForUpdate] = useState(null)
  const [activeShipmentForHistory, setActiveShipmentForHistory] = useState(null)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [isGlobalFeedOpen, setIsGlobalFeedOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Status Counts
  const statusCounts = useMemo(() => {
    const counts = {
      TOTAL: shipments.length,
      Pending: 0,
      'Picked Up': 0,
      'In Transit': 0,
      'Out for Delivery': 0,
      Delivered: 0,
      Cancelled: 0,
      'Failed Delivery': 0,
    }

    shipments.forEach((s) => {
      const st = s.deliveryStatus || 'Pending'
      if (counts[st] !== undefined) {
        counts[st] += 1
      }
    })

    return counts
  }, [shipments])

  // Filter & Sort Shipments
  const filteredShipments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()

    const list = shipments.filter((s) => {
      const matchesStatus =
        selectedStatusFilter === 'ALL' || s.deliveryStatus === selectedStatusFilter

      const matchesSearch =
        !q ||
        (s.trackingNumber || s.id).toLowerCase().includes(q) ||
        s.senderName.toLowerCase().includes(q) ||
        s.receiverName.toLowerCase().includes(q) ||
        s.pickupAddress.toLowerCase().includes(q) ||
        s.deliveryAddress.toLowerCase().includes(q) ||
        (s.carrier && s.carrier.toLowerCase().includes(q)) ||
        (s.currentLocation && s.currentLocation.toLowerCase().includes(q))

      return matchesStatus && matchesSearch
    })

    return list.sort((a, b) => {
      const dateA = a.shippingDate || ''
      const dateB = b.shippingDate || ''
      return sortOrder === 'desc'
        ? dateB.localeCompare(dateA)
        : dateA.localeCompare(dateB)
    })
  }, [shipments, selectedStatusFilter, searchQuery, sortOrder])

  // Paginated View
  const totalPages = Math.max(1, Math.ceil(filteredShipments.length / pageSize))
  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredShipments.slice(startIndex, startIndex + pageSize)
  }, [filteredShipments, currentPage, pageSize])

  // Multi-select Handlers
  const handleToggleSelect = (code) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  const handleSelectAllOnPage = () => {
    const pageCodes = paginatedShipments.map((s) => s.trackingNumber || s.id)
    const allSelected = pageCodes.every((c) => selectedCodes.includes(c))

    if (allSelected) {
      setSelectedCodes((prev) => prev.filter((c) => !pageCodes.includes(c)))
    } else {
      setSelectedCodes((prev) => Array.from(new Set([...prev, ...pageCodes])))
    }
  }

  const handleClearSelection = () => {
    setSelectedCodes([])
  }

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Tracking ID ${code} copied!`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Update Status Handlers
  const handleSingleStatusUpdate = async ({
    trackingNumber,
    newStatus,
    location,
    reason,
    notes,
    operator,
  }) => {
    try {
      setIsUpdating(true)
      await updateDeliveryStatus(trackingNumber, newStatus, {
        location,
        reason,
        notes,
        operator,
      })

      // Refresh shipments
      const refreshed = getLocalShipments()
      setShipments(refreshed)

      toast.success(
        `Consignment ${trackingNumber} status updated to '${newStatus}'!`
      )
      setActiveShipmentForUpdate(null)
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to update status.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBatchStatusUpdate = async ({
    trackingNumbers,
    newStatus,
    location,
    reason,
    notes,
    operator,
  }) => {
    try {
      setIsUpdating(true)
      await batchUpdateDeliveryStatus(trackingNumbers, newStatus, {
        location,
        reason,
        notes,
        operator,
      })

      // Refresh shipments
      const refreshed = getLocalShipments()
      setShipments(refreshed)

      toast.success(
        `Batch updated ${trackingNumbers.length} consignments to '${newStatus}'!`
      )
      setIsBatchModalOpen(false)
      setSelectedCodes([])
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Batch update encountered an issue.')
    } finally {
      setIsUpdating(false)
    }
  }

  // Global history list
  const globalHistory = useMemo(() => {
    if (!isGlobalFeedOpen) return []
    return getAllStatusHistory(shipments).slice(0, 30)
  }, [isGlobalFeedOpen, shipments])

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col select-none relative overflow-x-hidden font-sans">
      {/* Background Cyan & Blue Atmosphere Auras */}
      <div className="fixed top-0 left-1/3 w-[650px] h-[650px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Unified Navigation Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-6 relative z-10">
        {/* =========================================================
            HEADER & ACTIONS
            ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Consignment Delivery Status Command
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-state lifecycle transition console, audit logging, and automated failure reporting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
            <button
              type="button"
              onClick={() => setIsGlobalFeedOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#091526] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <History className="w-4 h-4 text-cyan-400" />
              <span>Global Audit Stream</span>
            </button>

            {selectedCodes.length > 0 && (
              <button
                type="button"
                onClick={() => setIsBatchModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Batch Update ({selectedCodes.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            7-STATUS TELEMETRY METRICS GRID
            ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {/* Total Shipments */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatusFilter('ALL')
              setCurrentPage(1)
            }}
            className={`p-3 rounded-xl border transition-all text-center cursor-pointer ${
              selectedStatusFilter === 'ALL'
                ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                : 'bg-[#091526]/80 border-cyan-500/20 hover:border-cyan-500/40'
            }`}
          >
            <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">Total Manifest</span>
            <span className="text-xl font-mono font-extrabold text-white mt-0.5 block">{statusCounts.TOTAL}</span>
          </button>

          {/* Pending */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatusFilter('Pending')
              setCurrentPage(1)
            }}
            className={`p-3 rounded-xl border transition-all text-center cursor-pointer ${
              selectedStatusFilter === 'Pending'
                ? 'bg-amber-500/25 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50'
                : 'bg-[#091526]/80 border-amber-500/25 hover:border-amber-400/40'
            }`}
          >
            <span className="text-[10px] text-amber-400 uppercase font-semibold flex items-center justify-center gap-1 truncate">
              <Clock className="w-3 h-3 shrink-0" /> Pending
            </span>
            <span className="text-xl font-mono font-extrabold text-amber-300 mt-0.5 block">{statusCounts.Pending}</span>
          </button>

          {/* Picked Up */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatusFilter('Picked Up')
              setCurrentPage(1)
            }}
            className={`p-3 rounded-xl border transition-all text-center cursor-pointer ${
              selectedStatusFilter === 'Picked Up'
                ? 'bg-blue-500/25 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/50'
                : 'bg-[#091526]/80 border-blue-500/25 hover:border-blue-400/40'
            }`}
          >
            <span className="text-[10px] text-blue-400 uppercase font-semibold flex items-center justify-center gap-1 truncate">
              <PackageCheck className="w-3 h-3 shrink-0" /> Picked Up
            </span>
            <span className="text-xl font-mono font-extrabold text-blue-300 mt-0.5 block">{statusCounts['Picked Up']}</span>
          </button>

          {/* In Transit */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatusFilter('In Transit')
              setCurrentPage(1)
            }}
            className={`p-3 rounded-xl border transition-all text-center cursor-pointer ${
              selectedStatusFilter === 'In Transit'
                ? 'bg-cyan-500/25 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                : 'bg-[#091526]/80 border-cyan-500/25 hover:border-cyan-400/40'
            }`}
          >
            <span className="text-[10px] text-cyan-400 uppercase font-semibold flex items-center justify-center gap-1 truncate">
              <Navigation className="w-3 h-3 shrink-0" /> In Transit
            </span>
            <span className="text-xl font-mono font-extrabold text-cyan-300 mt-0.5 block">{statusCounts['In Transit']}</span>
          </button>

          {/* Out for Delivery */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatusFilter('Out for Delivery')
              setCurrentPage(1)
            }}
            className={`p-3 rounded-xl border transition-all text-center cursor-pointer ${
              selectedStatusFilter === 'Out for Delivery'
                ? 'bg-sky-500/25 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/50'
                : 'bg-[#091526]/80 border-sky-500/25 hover:border-sky-400/40'
            }`}
          >
            <span className="text-[10px] text-sky-400 uppercase font-semibold flex items-center justify-center gap-1 truncate">
              <Truck className="w-3 h-3 shrink-0" /> Out for Delivery
            </span>
            <span className="text-xl font-mono font-extrabold text-sky-300 mt-0.5 block">{statusCounts['Out for Delivery']}</span>
          </button>

          {/* Delivered */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatusFilter('Delivered')
              setCurrentPage(1)
            }}
            className={`p-3 rounded-xl border transition-all text-center cursor-pointer ${
              selectedStatusFilter === 'Delivered'
                ? 'bg-emerald-500/25 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50'
                : 'bg-[#091526]/80 border-emerald-500/25 hover:border-emerald-400/40'
            }`}
          >
            <span className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center justify-center gap-1 truncate">
              <CheckCircle2 className="w-3 h-3 shrink-0" /> Delivered
            </span>
            <span className="text-xl font-mono font-extrabold text-emerald-300 mt-0.5 block">{statusCounts.Delivered}</span>
          </button>

          {/* Failed Delivery (ALERT HIGHLIGHT) */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatusFilter('Failed Delivery')
              setCurrentPage(1)
            }}
            className={`p-3 rounded-xl border transition-all text-center cursor-pointer ${
              selectedStatusFilter === 'Failed Delivery'
                ? 'bg-red-500/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] ring-1 ring-red-400'
                : 'bg-red-950/20 border-red-500/30 hover:border-red-400/50'
            }`}
          >
            <span className="text-[10px] text-red-400 uppercase font-semibold flex items-center justify-center gap-1 truncate">
              <AlertTriangle className="w-3 h-3 shrink-0 animate-pulse text-red-400" /> Failed Delivery
            </span>
            <span className="text-xl font-mono font-extrabold text-red-300 mt-0.5 block">{statusCounts['Failed Delivery']}</span>
          </button>

          {/* Cancelled */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatusFilter('Cancelled')
              setCurrentPage(1)
            }}
            className={`p-3 rounded-xl border transition-all text-center cursor-pointer ${
              selectedStatusFilter === 'Cancelled'
                ? 'bg-rose-500/25 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] ring-1 ring-rose-400/50'
                : 'bg-[#091526]/80 border-rose-500/25 hover:border-rose-400/40'
            }`}
          >
            <span className="text-[10px] text-rose-400 uppercase font-semibold flex items-center justify-center gap-1 truncate">
              <XCircle className="w-3 h-3 shrink-0" /> Cancelled
            </span>
            <span className="text-xl font-mono font-extrabold text-rose-300 mt-0.5 block">{statusCounts.Cancelled}</span>
          </button>
        </div>

        {/* =========================================================
            SEARCH, FILTER & BATCH ACTION BAR
            ========================================================= */}
        <div className="p-4 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-[0_0_25px_rgba(6,182,212,0.12)]">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by tracking code, sender, receiver, destination hub..."
              className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-[#050b14] border border-cyan-500/40 text-white placeholder-slate-400 outline-none focus:border-cyan-300 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            />
          </div>

          {/* Status Filter Dropdown & Sort */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedStatusFilter}
                onChange={(e) => {
                  setSelectedStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-10 px-3 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white text-xs outline-none cursor-pointer focus:border-cyan-400"
              >
                <option value="ALL">All Statuses ({statusCounts.TOTAL})</option>
                {DELIVERY_STATUS_LIST.map((st) => (
                  <option key={st} value={st}>
                    {st} ({statusCounts[st] || 0})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="h-10 px-3 rounded-xl bg-[#050b14] border border-cyan-500/30 hover:border-cyan-300 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle date sort order"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>

            {selectedCodes.length > 0 && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="h-10 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear Selection ({selectedCodes.length})
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            CONSIGNMENT DELIVERY STATUS TABLE
            ========================================================= */}
        <div className="w-full rounded-2xl bg-[#091526]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#050b14]/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-cyan-500/20">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        paginatedShipments.length > 0 &&
                        paginatedShipments.every((s) =>
                          selectedCodes.includes(s.trackingNumber || s.id)
                        )
                      }
                      onChange={handleSelectAllOnPage}
                      className="rounded accent-cyan-500 cursor-pointer w-3.5 h-3.5"
                    />
                  </th>
                  <th className="py-3 px-3">WAYBILL NUMBER</th>
                  <th className="py-3 px-3">ROUTE NODES (ORIGIN → DEST)</th>
                  <th className="py-3 px-3">DELIVERY STATUS</th>
                  <th className="py-3 px-3">TRANSIT PROGRESS</th>
                  <th className="py-3 px-3">CURRENT CHECKPOINT</th>
                  <th className="py-3 px-3">SCHEDULED ETA</th>
                  <th className="py-3 px-4 text-right">ACTION CONTROLS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {paginatedShipments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <ShieldAlert className="w-8 h-8 text-cyan-500/30 mx-auto mb-2" />
                      No consignments match the selected delivery status filter or search parameters.
                    </td>
                  </tr>
                ) : (
                  paginatedShipments.map((s) => {
                    const code = s.trackingNumber || s.id
                    const isSelected = selectedCodes.includes(code)
                    const progress = s.progress || (s.deliveryStatus === 'Delivered' ? 100 : 50)
                    const isCopied = copiedCode === code

                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-cyan-500/5 transition-colors ${
                          isSelected ? 'bg-cyan-500/10' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(code)}
                            className="rounded accent-cyan-500 cursor-pointer w-3.5 h-3.5"
                          />
                        </td>

                        {/* Waybill */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-white tracking-wide">
                              {code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(code)}
                              className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-colors cursor-pointer"
                              title="Copy Tracking ID"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {s.carrier || 'Global Express'} • {s.parcelType}
                          </div>
                        </td>

                        {/* Route Nodes */}
                        <td className="py-3.5 px-3">
                          <div className="text-slate-200 font-semibold truncate max-w-[180px]">
                            {s.senderName}
                          </div>
                          <div className="text-[11px] text-cyan-300 flex items-center gap-1 truncate max-w-[180px]">
                            <span>↳ to {s.receiverName}</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3">
                          <StatusBadge status={s.deliveryStatus} size="sm" />
                          {s.statusReason && (
                            <div className="text-[10px] text-red-300/90 mt-1 max-w-[160px] truncate" title={s.statusReason}>
                              ⚠️ {s.statusReason}
                            </div>
                          )}
                        </td>

                        {/* Progress */}
                        <td className="py-3.5 px-3">
                          <div className="w-28 flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-[#050b14] h-1.5 rounded-full overflow-hidden border border-cyan-500/20">
                              <div
                                className={`h-full transition-all ${
                                  s.deliveryStatus === 'Delivered'
                                    ? 'bg-emerald-400'
                                    : s.deliveryStatus === 'Failed Delivery'
                                    ? 'bg-red-400'
                                    : s.deliveryStatus === 'Cancelled'
                                    ? 'bg-rose-400'
                                    : 'bg-gradient-to-r from-cyan-500 to-sky-400'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Checkpoint */}
                        <td className="py-3.5 px-3 text-slate-300">
                          <span className="truncate block max-w-[160px]" title={s.currentLocation}>
                            📍 {s.currentLocation || 'In Transit'}
                          </span>
                        </td>

                        {/* ETA */}
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300">
                          {s.expectedDeliveryDate || s.shippingDate}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Update Status Button */}
                            <button
                              type="button"
                              onClick={() => setActiveShipmentForUpdate(s)}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              title="Update Delivery Status"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span className="hidden sm:inline">Update</span>
                            </button>

                            {/* View History Button */}
                            <button
                              type="button"
                              onClick={() => setActiveShipmentForHistory(s)}
                              className="p-1.5 rounded-lg bg-[#050b14] hover:bg-white/10 border border-cyan-500/30 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="View Status History Log"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>

                            {/* Radar Deep Link */}
                            <Link
                              to={`/tracking?code=${encodeURIComponent(code)}`}
                              className="p-1.5 rounded-lg bg-[#050b14] hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer"
                              title="Open Live Radar Tracking"
                            >
                              <Radar className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Strip */}
          <div className="px-6 py-3.5 bg-[#050b14] border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-mono">
              Showing{' '}
              <strong className="text-cyan-300">
                {filteredShipments.length === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}{' '}
                - {Math.min(currentPage * pageSize, filteredShipments.length)}
              </strong>{' '}
              of <strong className="text-white">{filteredShipments.length}</strong> consignments
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-[#071324] border border-cyan-500/30 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-cyan-300 font-bold px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg bg-[#071324] border border-cyan-500/30 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================
          MODALS INTEGRATION
          ========================================================= */}
      {/* 1. Single Consignment Status Update Modal */}
      {activeShipmentForUpdate && (
        <StatusUpdateModal
          key={activeShipmentForUpdate.id || activeShipmentForUpdate.trackingNumber}
          isOpen={Boolean(activeShipmentForUpdate)}
          onClose={() => setActiveShipmentForUpdate(null)}
          shipment={activeShipmentForUpdate}
          onUpdateStatus={handleSingleStatusUpdate}
          isUpdating={isUpdating}
        />
      )}

      {/* 2. Batch Status Update Modal */}
      {isBatchModalOpen && (
        <BatchStatusModal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          selectedCodes={selectedCodes}
          onBatchUpdate={handleBatchStatusUpdate}
          isUpdating={isUpdating}
        />
      )}

      {/* 3. Consignment Status History Modal */}
      {activeShipmentForHistory && (
        <StatusHistoryModal
          isOpen={Boolean(activeShipmentForHistory)}
          onClose={() => setActiveShipmentForHistory(null)}
          shipment={activeShipmentForHistory}
          history={getStatusHistory(
            activeShipmentForHistory.trackingNumber || activeShipmentForHistory.id,
            activeShipmentForHistory
          )}
        />
      )}

      {/* 4. Global Status Audit Stream Drawer */}
      {isGlobalFeedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-6 rounded-2xl bg-[#091526] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden text-slate-100 max-h-[85vh]">
            <div className="px-6 py-4 bg-[#050b14] border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Global Network Status Audit Stream</h3>
                  <p className="text-xs text-slate-400">Live chronological feed of all consignment status transitions</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGlobalFeedOpen(false)}
                className="px-3 py-1 rounded-lg bg-[#050b14] border border-cyan-500/30 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Close Stream
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-3">
              {globalHistory.map((h, i) => (
                <div
                  key={h.id || i}
                  className="p-3.5 rounded-xl bg-[#050b14] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-bold text-cyan-300">{h.trackingNumber}</span>
                    <StatusBadge status={h.toStatus} size="sm" />
                    <span className="text-slate-400">@ {h.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
                    <span>{h.operator}</span>
                    <span>•</span>
                    <span className="text-slate-300">{h.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
