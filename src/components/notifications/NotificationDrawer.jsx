import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  ExternalLink,
  Sparkles,
  Inbox,
  AlertTriangle,
  PackagePlus,
  Truck,
  CheckCircle2,
} from 'lucide-react'
import { useNotifications } from '../../context/useNotifications'
import NotificationCard from './NotificationCard'
import { NOTIFICATION_TYPES } from '../../services/notificationService'

export default function NotificationDrawer() {
  const {
    notifications,
    unreadCount,
    isDrawerOpen,
    closeDrawer,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    simulateNotification,
  } = useNotifications()

  const [activeTab, setActiveTab] = useState('ALL') // 'ALL' | 'UNREAD' | 'ALERTS'

  if (!isDrawerOpen) return null

  // Filter list
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'UNREAD') return !item.isRead
    if (activeTab === 'ALERTS')
      return item.type === NOTIFICATION_TYPES.FAILED_DELIVERY
    return true
  })

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-lg bg-[#060c18] border-l border-cyan-500/30 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-[#091526]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold uppercase tracking-tight text-white">
                  Notifications
                </h3>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 animate-pulse">
                    {unreadCount} unread
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                    All caught up
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time delivery telemetry & dispatch updates
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Bulk Actions */}
        <div className="px-4 py-2.5 border-b border-cyan-500/10 bg-[#070e1c] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('UNREAD')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'UNREAD'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ALERTS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'ALERTS'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                  : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              Alerts
            </button>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark All Read</span>
              </button>
            )}
            <Link
              to="/notifications"
              onClick={closeDrawer}
              className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 px-2 py-1 rounded bg-cyan-950/40 border border-cyan-500/30 transition-colors"
            >
              <span>Full Center</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Notification List Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-300">No notifications found</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {activeTab === 'UNREAD'
                  ? 'All notifications have been reviewed and marked as read.'
                  : activeTab === 'ALERTS'
                  ? 'Zero active delivery exception alerts.'
                  : 'No notification records exist currently.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onMarkRead={markAsRead}
                onDelete={removeNotification}
                onCloseParent={closeDrawer}
              />
            ))
          )}
        </div>

        {/* Live Simulation Quick-Action Panel */}
        <div className="p-3 border-t border-cyan-500/20 bg-[#081220]/95">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Simulate Real-Time Telemetry</span>
            </span>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => simulateNotification(NOTIFICATION_TYPES.SHIPMENT_CREATED)}
              className="px-2 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-[10px] font-semibold text-cyan-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Simulate Shipment Created"
            >
              <PackagePlus className="w-3 h-3 text-cyan-400" />
              <span>+ Created</span>
            </button>
            <button
              type="button"
              onClick={() => simulateNotification(NOTIFICATION_TYPES.STATUS_UPDATE)}
              className="px-2 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 text-[10px] font-semibold text-blue-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Simulate Delivery Status Update"
            >
              <Truck className="w-3 h-3 text-blue-400" />
              <span>Update</span>
            </button>
            <button
              type="button"
              onClick={() => simulateNotification(NOTIFICATION_TYPES.DELIVERY_COMPLETED)}
              className="px-2 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-[10px] font-semibold text-emerald-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Simulate Delivery Completed"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Delivered</span>
            </button>
            <button
              type="button"
              onClick={() => simulateNotification(NOTIFICATION_TYPES.FAILED_DELIVERY)}
              className="px-2 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-[10px] font-semibold text-rose-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Simulate Failed Delivery Alert"
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
