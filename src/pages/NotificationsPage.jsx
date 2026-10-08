import { useState, useMemo } from 'react'
import Navbar from '../components/common/Navbar'
import NotificationCard from '../components/notifications/NotificationCard'
import { useNotifications } from '../context/useNotifications'
import { NOTIFICATION_TYPES } from '../services/notificationService'
import {
  Bell,
  CheckCheck,
  RotateCcw,
  Trash2,
  Search,
  Filter,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  PackagePlus,
  Truck,
  Inbox,
  Shield,
  Activity,
} from 'lucide-react'

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    resetDefaults,
    simulateNotification,
  } = useNotifications()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('ALL') // 'ALL' | 'UNREAD' | NOTIFICATION_TYPES.*
  const [sortOrder, setSortOrder] = useState('NEWEST') // 'NEWEST' | 'OLDEST'

  // Metric computations
  const totalCount = notifications.length
  const failedAlertsCount = useMemo(
    () =>
      notifications.filter(
        (n) => n.type === NOTIFICATION_TYPES.FAILED_DELIVERY
      ).length,
    [notifications]
  )
  const deliveredCount = useMemo(
    () =>
      notifications.filter(
        (n) => n.type === NOTIFICATION_TYPES.DELIVERY_COMPLETED
      ).length,
    [notifications]
  )
  const createdCount = useMemo(
    () =>
      notifications.filter(
        (n) => n.type === NOTIFICATION_TYPES.SHIPMENT_CREATED
      ).length,
    [notifications]
  )

  // Filtered & sorted notifications list
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) => {
        // Filter by Tab
        if (selectedType === 'UNREAD') {
          if (n.isRead) return false
        } else if (selectedType !== 'ALL') {
          if (n.type !== selectedType) return false
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const matchTitle = n.title?.toLowerCase().includes(q)
          const matchMessage = n.message?.toLowerCase().includes(q)
          const matchTracking = n.trackingNumber?.toLowerCase().includes(q)
          const matchRecipient = n.metadata?.recipient?.toLowerCase().includes(q)
          const matchLocation = n.metadata?.location?.toLowerCase().includes(q)
          const matchReason = n.metadata?.reason?.toLowerCase().includes(q)
          return (
            matchTitle ||
            matchMessage ||
            matchTracking ||
            matchRecipient ||
            matchLocation ||
            matchReason
          )
        }
        return true
      })
      .sort((a, b) => {
        if (sortOrder === 'OLDEST') {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
  }, [notifications, selectedType, searchQuery, sortOrder])

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
              <Activity className="w-3.5 h-3.5" />
              <span>Cyber Command Telemetry & Dispatch Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Notification Center</span>
              {unreadCount > 0 && (
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                  {unreadCount} Unread
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Centralized real-time hub for shipment creations, delivery status transitions, delivery completions, and critical delivery alerts.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}

            <button
              type="button"
              onClick={resetDefaults}
              className="px-3.5 py-2 rounded-xl bg-[#091526] hover:bg-[#0d1d36] text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              title="Restore initial seed notifications"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset Data</span>
            </button>

            {totalCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="px-3.5 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Notifications */}
          <div className="p-4 rounded-2xl bg-[#091526]/80 border border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Notifications
              </span>
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Bell className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {totalCount}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>Audit history persisted</span>
            </div>
          </div>

          {/* Card 2: Unread Count */}
          <div className="p-4 rounded-2xl bg-[#091526]/80 border border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Unread Alerts
              </span>
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                <Bell className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 flex items-center gap-2">
              <span>{unreadCount}</span>
              {unreadCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              )}
            </div>
            <div className="text-xs text-cyan-400/80 mt-1">
              {unreadCount === 0 ? 'All notifications reviewed' : 'Requires dispatcher attention'}
            </div>
          </div>

          {/* Card 3: Failed Delivery Alerts */}
          <div className="p-4 rounded-2xl bg-[#091526]/80 border border-rose-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Failed Delivery Alerts
              </span>
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">
              {failedAlertsCount}
            </div>
            <div className="text-xs text-rose-300/80 mt-1">
              {failedAlertsCount > 0 ? 'Critical dispatch exceptions' : 'Zero failure alerts reported'}
            </div>
          </div>

          {/* Card 4: Delivered Consignments */}
          <div className="p-4 rounded-2xl bg-[#091526]/80 border border-emerald-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Delivery Completed
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {deliveredCount}
            </div>
            <div className="text-xs text-emerald-300/80 mt-1">
              Consignments successfully received
            </div>
          </div>
        </div>

        {/* Live Simulation & Dispatch Testing Console */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071324] via-[#091c33] to-[#071324] border border-cyan-500/30 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Real-Time Notification Simulator
                </h3>
                <p className="text-xs text-slate-400">
                  Click any trigger below to test instant event broadcast, toasts, badge count updates, and history logging.
                </p>
              </div>
            </div>

            <div className="text-[11px] font-mono text-cyan-400 bg-[#050b14] px-3 py-1 rounded-lg border border-cyan-500/30 self-start sm:self-auto">
              Event Dispatcher Ready
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => simulateNotification(NOTIFICATION_TYPES.SHIPMENT_CREATED)}
              className="p-3 rounded-xl bg-[#091526] hover:bg-[#0f2442] border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
                <PackagePlus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                  Simulate Shipment Created
                </div>
                <div className="text-[10px] text-slate-400">
                  Generates new AWB consignment
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => simulateNotification(NOTIFICATION_TYPES.STATUS_UPDATE)}
              className="p-3 rounded-xl bg-[#091526] hover:bg-[#0f2442] border border-blue-500/30 hover:border-blue-400/60 transition-all flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-blue-300">
                  Simulate Status Update
                </div>
                <div className="text-[10px] text-slate-400">
                  Transit checkpoint transition
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => simulateNotification(NOTIFICATION_TYPES.DELIVERY_COMPLETED)}
              className="p-3 rounded-xl bg-[#091526] hover:bg-[#0f2442] border border-emerald-500/30 hover:border-emerald-400/60 transition-all flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                  Simulate Delivery Completed
                </div>
                <div className="text-[10px] text-slate-400">
                  Signed delivery confirmation
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => simulateNotification(NOTIFICATION_TYPES.FAILED_DELIVERY)}
              className="p-3 rounded-xl bg-[#091526] hover:bg-[#0f2442] border border-rose-500/30 hover:border-rose-400/60 transition-all flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-rose-300">
                  Simulate Failed Delivery Alert
                </div>
                <div className="text-[10px] text-slate-400">
                  Critical dispatch exception alert
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-4 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tracking number, recipient, title, reason..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#050b14] border border-cyan-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedType === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-white bg-[#050b14] border border-slate-800'
              }`}
            >
              All ({totalCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedType('UNREAD')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedType === 'UNREAD'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-white bg-[#050b14] border border-slate-800'
              }`}
            >
              Unread ({unreadCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedType(NOTIFICATION_TYPES.SHIPMENT_CREATED)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedType === NOTIFICATION_TYPES.SHIPMENT_CREATED
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-cyan-300 bg-[#050b14] border border-slate-800'
              }`}
            >
              Created ({createdCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedType(NOTIFICATION_TYPES.STATUS_UPDATE)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedType === NOTIFICATION_TYPES.STATUS_UPDATE
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40 shadow-[0_0_10px_rgba(59,130,246,0.25)]'
                  : 'text-slate-400 hover:text-blue-300 bg-[#050b14] border border-slate-800'
              }`}
            >
              Status Updates
            </button>

            <button
              type="button"
              onClick={() => setSelectedType(NOTIFICATION_TYPES.DELIVERY_COMPLETED)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedType === NOTIFICATION_TYPES.DELIVERY_COMPLETED
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                  : 'text-slate-400 hover:text-emerald-300 bg-[#050b14] border border-slate-800'
              }`}
            >
              Delivered ({deliveredCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedType(NOTIFICATION_TYPES.FAILED_DELIVERY)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedType === NOTIFICATION_TYPES.FAILED_DELIVERY
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                  : 'text-slate-400 hover:text-rose-300 bg-[#050b14] border border-slate-800'
              }`}
            >
              Failed Alerts ({failedAlertsCount})
            </button>

            {/* Sort Toggle */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-[#050b14] border border-cyan-500/30 text-xs font-semibold text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer ml-auto"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Notification History Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recent Notification History</span>
              <span className="text-xs text-slate-500">
                ({filteredNotifications.length} items)
              </span>
            </h2>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-[#091526]/50 border border-cyan-500/20 backdrop-blur-sm">
              <Inbox className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-200">
                No notifications match your current filter
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `No events matching "${searchQuery}". Try modifying your search term or filter category.`
                  : 'No notification records found in this category.'}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onMarkRead={markAsRead}
                onDelete={removeNotification}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
