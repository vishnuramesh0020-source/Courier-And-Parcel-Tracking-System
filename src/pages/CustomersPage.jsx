import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/common/Navbar'
import CustomerFormModal from '../components/customers/CustomerFormModal'
import CustomerDeleteModal from '../components/customers/CustomerDeleteModal'
import CustomerProfileModal from '../components/customers/CustomerProfileModal'
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../services/customerService'
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Building2,
  Shield,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react'
import { toast } from 'react-toastify'

const STATUS_FILTERS = ['All Tiers', 'Active', 'VIP', 'Corporate', 'Inactive']

export default function CustomersPage() {
  // 1. Data State
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  // 2. Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [profileCustomer, setProfileCustomer] = useState(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const [deletingCustomer, setDeletingCustomer] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // 3. Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Tiers')
  const [cityFilter, setCityFilter] = useState('All Cities')
  const [sortBy, setSortBy] = useState('date-desc')

  // 4. View Mode & Pagination State
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [copiedId, setCopiedId] = useState(null)

  // Initial load
  useEffect(() => {
    let ignore = false
    fetchCustomers()
      .then((res) => {
        if (!ignore) {
          setCustomers(res.data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!ignore) {
          toast.error('Failed to load customers from registry.')
          setLoading(false)
        }
      })
    return () => {
      ignore = true
    }
  }, [])

  // Manual refresh handler
  const handleRefresh = async () => {
    try {
      setLoading(true)
      const res = await fetchCustomers()
      setCustomers(res.data)
    } catch {
      toast.error('Failed to load customers from registry.')
    } finally {
      setLoading(false)
    }
  }

  // Unique cities list for filtering
  const uniqueCities = useMemo(() => {
    const set = new Set(customers.map((c) => c.city).filter(Boolean))
    return ['All Cities', ...Array.from(set).sort()]
  }, [customers])

  // Filtered & Sorted Customers
  const filteredCustomers = useMemo(() => {
    let result = [...customers]

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (c) =>
          c.customerName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.mobileNumber?.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q) ||
          c.postalCode?.toLowerCase().includes(q) ||
          c.address?.toLowerCase().includes(q) ||
          c.id?.toLowerCase().includes(q)
      )
    }

    // Status filter
    if (statusFilter !== 'All Tiers') {
      result = result.filter((c) => c.status === statusFilter)
    }

    // City filter
    if (cityFilter !== 'All Cities') {
      result = result.filter((c) => c.city === cityFilter)
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.customerName || '').localeCompare(b.customerName || '')
        case 'name-desc':
          return (b.customerName || '').localeCompare(a.customerName || '')
        case 'shipments-desc':
          return (b.totalShipments || 0) - (a.totalShipments || 0)
        case 'shipments-asc':
          return (a.totalShipments || 0) - (b.totalShipments || 0)
        case 'date-asc':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        case 'date-desc':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      }
    })

    return result
  }, [customers, searchQuery, statusFilter, cityFilter, sortBy])

  // Pagination calculation
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredCustomers.slice(start, start + pageSize)
  }, [filteredCustomers, currentPage, pageSize])

  // Reset page on filter changes
  const handleSearchChange = (val) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val)
    setCurrentPage(1)
  }

  const handleCityFilterChange = (val) => {
    setCityFilter(val)
    setCurrentPage(1)
  }

  // Summary counts
  const summaryCounts = useMemo(() => {
    return {
      total: customers.length,
      vip: customers.filter((c) => c.status === 'VIP').length,
      corporate: customers.filter((c) => c.status === 'Corporate').length,
      active: customers.filter((c) => c.status === 'Active').length,
    }
  }, [customers])

  // CRUD Handlers
  const handleOpenCreate = () => {
    setEditingCustomer(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (cust) => {
    setEditingCustomer(cust)
    setIsFormModalOpen(true)
  }

  const handleOpenProfile = (cust) => {
    setProfileCustomer(cust)
    setIsProfileModalOpen(true)
  }

  const handleOpenDelete = (cust) => {
    setDeletingCustomer(cust)
    setIsDeleteModalOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      if (editingCustomer) {
        // Edit Customer
        const res = await updateCustomer(editingCustomer.id, formData)
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingCustomer.id ? res.data : c))
        )
        toast.success(`Customer ${res.data.customerName} successfully updated!`)
      } else {
        // Add Customer
        const res = await createCustomer(formData)
        setCustomers((prev) => [res.data, ...prev])
        toast.success(`Customer ${res.data.customerName} successfully registered!`)
      }
      setIsFormModalOpen(false)
      setEditingCustomer(null)
    } catch (err) {
      toast.error(err.message || 'Operation failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async (id) => {
    try {
      setIsDeleting(true)
      await deleteCustomer(id)
      setCustomers((prev) => prev.filter((c) => c.id !== id))
      toast.success('Customer record permanently removed.')
      setIsDeleteModalOpen(false)
      setDeletingCustomer(null)
      if (profileCustomer?.id === id) {
        setIsProfileModalOpen(false)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete customer.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopyEmail = (id, email) => {
    navigator.clipboard.writeText(email)
    setCopiedId(id)
    toast.success('Email copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VIP':
        return 'bg-purple-500/15 text-purple-300 border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
      case 'Corporate':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
      case 'Active':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.25)]'
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/40'
    }
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col select-none relative overflow-x-hidden font-sans">
      {/* Background Cyber Glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Unified Cyber Navigation Bar */}
      <Navbar />

      {/* Main Container (Edge-to-Edge Full Width) */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-5 relative z-10">
        {/* =========================================================
            HEADER & ACTIONS BAR
            ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Customer Management & Directory
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Reload button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh Customers"
              className="p-2 rounded-xl bg-[#091526] border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Add Customer Action Button */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            SUMMARY STATS TILES (Quick Telemetry Bar)
            ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#091526]/90 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Clients</span>
              <span className="text-lg font-extrabold text-white font-mono">{summaryCounts.total}</span>
            </div>
            <Users className="w-5 h-5 text-cyan-400 opacity-80" />
          </div>

          <div className="p-3 rounded-xl bg-[#091526]/90 border border-purple-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-purple-300 uppercase font-semibold block">VIP Shippers</span>
              <span className="text-lg font-extrabold text-purple-300 font-mono">{summaryCounts.vip}</span>
            </div>
            <Shield className="w-5 h-5 text-purple-400 opacity-80" />
          </div>

          <div className="p-3 rounded-xl bg-[#091526]/90 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-cyan-300 uppercase font-semibold block">Corporate</span>
              <span className="text-lg font-extrabold text-cyan-300 font-mono">{summaryCounts.corporate}</span>
            </div>
            <Building2 className="w-5 h-5 text-cyan-400 opacity-80" />
          </div>

          <div className="p-3 rounded-xl bg-[#091526]/90 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Active Accounts</span>
              <span className="text-lg font-extrabold text-emerald-300 font-mono">{summaryCounts.active}</span>
            </div>
            <Users className="w-5 h-5 text-emerald-400 opacity-80" />
          </div>
        </div>

        {/* =========================================================
            SEARCH, FILTER & VIEW CONTROLS TOOLBAR
            ========================================================= */}
        <div className="p-3 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          {/* Omni-Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by customer name, email, phone, city, address, or postal code..."
              className="w-full h-9.5 pl-9 pr-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            />
          </div>

          {/* Filters & View Switches */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Filter by Tier */}
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="h-9.5 px-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-slate-200 outline-none focus:border-cyan-400 cursor-pointer"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s} className="bg-[#091526] text-white">
                  {s}
                </option>
              ))}
            </select>

            {/* Filter by City */}
            <select
              value={cityFilter}
              onChange={(e) => handleCityFilterChange(e.target.value)}
              className="h-9.5 px-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-slate-200 outline-none focus:border-cyan-400 cursor-pointer"
            >
              {uniqueCities.map((c) => (
                <option key={c} value={c} className="bg-[#091526] text-white">
                  {c}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9.5 px-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-slate-200 outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="date-desc" className="bg-[#091526]">Newest Added</option>
              <option value="date-asc" className="bg-[#091526]">Oldest Added</option>
              <option value="name-asc" className="bg-[#091526]">Name (A-Z)</option>
              <option value="name-desc" className="bg-[#091526]">Name (Z-A)</option>
              <option value="shipments-desc" className="bg-[#091526]">Most Bookings</option>
              <option value="shipments-asc" className="bg-[#091526]">Least Bookings</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[#050b14] border border-cyan-500/30">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Table Grid"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                title="Card Grid"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            DATA DISPLAY: TABLE OR CARDS
            ========================================================= */}
        {loading ? (
          <div className="p-12 rounded-2xl bg-[#091526]/80 border border-cyan-500/30 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
            <p className="text-xs text-slate-300 font-mono">Synchronizing Customer Records...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#091526]/80 border border-cyan-500/30 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Customers Located</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              No customer records match your filter criteria. Try adjusting your query or onboard a new client.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-all cursor-pointer"
            >
              Add First Customer
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* =========================================================
              TABLE VIEW
              ========================================================= */
          <div className="rounded-2xl bg-[#091526]/90 border border-cyan-500/30 overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#050b14]/90 text-[11px] font-mono uppercase text-slate-400 border-b border-cyan-500/20">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Customer / ID</th>
                    <th className="py-3 px-4 font-semibold">Contact Email</th>
                    <th className="py-3 px-4 font-semibold">Mobile Number</th>
                    <th className="py-3 px-4 font-semibold">Delivery Address & City</th>
                    <th className="py-3 px-4 font-semibold">Postal Code</th>
                    <th className="py-3 px-4 font-semibold">Status Tier</th>
                    <th className="py-3 px-4 font-semibold">Total Parcels</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {paginatedCustomers.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-cyan-500/[0.04] transition-colors group cursor-pointer"
                      onClick={() => handleOpenProfile(c)}
                    >
                      {/* Customer Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
                            {c.customerName?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-white group-hover:text-cyan-300 transition-colors block truncate">
                              {c.customerName}
                            </span>
                            <span className="font-mono text-[10px] text-cyan-400/80 block">
                              {c.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-slate-300" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <span className="truncate max-w-[180px]">{c.email}</span>
                          <button
                            onClick={() => handleCopyEmail(c.id, c.email)}
                            className="p-1 rounded text-slate-500 hover:text-cyan-300 transition-colors"
                            title="Copy email"
                          >
                            {copiedId === c.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Mobile Number */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {c.mobileNumber}
                      </td>

                      {/* Address & City */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="truncate max-w-[220px] font-medium text-white">
                          {c.address}
                        </div>
                        <div className="text-[11px] text-cyan-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>{c.city}</span>
                        </div>
                      </td>

                      {/* Postal Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                        {c.postalCode}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${getStatusBadge(
                            c.status
                          )}`}
                        >
                          {c.status}
                        </span>
                      </td>

                      {/* Total Bookings */}
                      <td className="py-3.5 px-4 font-mono font-extrabold text-white">
                        {c.totalShipments || 0}
                      </td>

                      {/* Action Tools */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenProfile(c)}
                            title="Inspect Customer Dossier"
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(c)}
                            title="Edit Customer Details"
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(c)}
                            title="Delete Customer"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition-colors cursor-pointer"
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
              CARD GRID VIEW
              ========================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedCustomers.map((c) => (
              <div
                key={c.id}
                onClick={() => handleOpenProfile(c)}
                className="p-4 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
                        {c.customerName?.charAt(0)?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {c.customerName}
                        </h4>
                        <span className="font-mono text-[10px] text-cyan-400/80">
                          {c.id}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border shrink-0 ${getStatusBadge(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 truncate text-[11px]">
                      <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{c.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono">
                      <Phone className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{c.mobileNumber}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px] pt-1">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-slate-400">
                        {c.address}, {c.city} ({c.postalCode})
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[10px] font-mono text-slate-400">
                    <strong className="text-white">{c.totalShipments || 0}</strong> Shipments
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenProfile(c)}
                      className="p-1 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(c)}
                      className="p-1 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Edit Customer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(c)}
                      className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition-colors"
                      title="Delete Customer"
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
        {filteredCustomers.length > 0 && (
          <div className="p-3 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
            {/* Range Indicator */}
            <div className="text-slate-400 font-mono text-[11px]">
              Showing{' '}
              <strong className="text-white">
                {(currentPage - 1) * pageSize + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-white">
                {Math.min(currentPage * pageSize, filteredCustomers.length)}
              </strong>{' '}
              of <strong className="text-cyan-300">{filteredCustomers.length}</strong> customers
            </div>

            {/* Pagination Buttons & Page Size */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Page Size Selector */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mr-2">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="px-2 py-1 rounded-lg bg-[#050b14] border border-cyan-500/30 text-white outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                </select>
              </div>

              {/* Prev Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-[#050b14] border border-cyan-500/30 text-cyan-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Direct Page Numbers */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                        : 'bg-[#050b14] border border-cyan-500/20 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-[#050b14] border border-cyan-500/30 text-cyan-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================
          MODALS INTEGRATION
          ========================================================= */}
      {/* 1. Add / Edit Customer Modal */}
      <CustomerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCustomer}
        isSubmitting={isSubmitting}
      />

      {/* 2. Quick Customer Profile Modal */}
      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        customer={profileCustomer}
        onEdit={(c) => handleOpenEdit(c)}
        onDelete={(c) => handleOpenDelete(c)}
      />

      {/* 3. Delete Confirmation Modal */}
      <CustomerDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        customer={deletingCustomer}
        isDeleting={isDeleting}
      />
    </div>
  )
}
