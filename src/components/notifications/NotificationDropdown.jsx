import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  Sparkles,
  Inbox,
  AlertTriangle,
  PackagePlus,
  Truck,
  CheckCircle2,
  X,
} from 'lucide-react'
import { useNotifications } from '../../context/useNotifications'
import NotificationCard from './NotificationCard'
import { NOTIFICATION_TYPES } from '../../services/notificationService'

export default function NotificationDropdown({ isOpen, onClose }) {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    simulateNotification,
  } = useNotifications()

  const [activeTab, setActiveTab] = useState('ALL') // 'ALL' | 'UNREAD' | 'ALERTS'

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose()
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Filter list
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'UNREAD') return !item.isRead
    if (activeTab === 'ALERTS')
      return item.type === NOTIFICATION_TYPES.FAILED_DELIVERY
    return true
  })

  const alertsCount = notifications.filter(
    (n) => n.type === NOTIFICATION_TYPES.FAILED_DELIVERY
  ).length

  const handleOpenFullCenter = () => {
    onClose()
    navigate('/notifications')
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] max-w-[calc(100vw-24px)] bg-[#070e1c] border border-cyan-500/40 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
      style={{ maxHeight: '82vh' }}
    >
      {/* Dropdown Header */}
      <div className="p-3.5 sm:p-4 border-b border-cyan-500/20 bg-[#091526]/95 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold uppercase tracking-tight text-white">
                Notifications
              </h3>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 animate-pulse">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                  All read
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="px-2 py-1 rounded-md text-[11px] font-semibold text-cyan-300 hover:text-white hover:bg-cyan-950/60 border border-cyan-500/30 flex items-center gap-1 transition-colors cursor-pointer"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-3 h-3" />
              <span>Mark Read</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close dropdown"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Filter Strip */}
      <div className="px-3 py-2 border-b border-cyan-500/15 bg-[#050b14]/90 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
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
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
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
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'ALERTS'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            Alerts ({alertsCount})
          </button>
        </div>

        <Link
          to="/notifications"
          onClick={onClose}
          className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition-colors"
        >
          <span>Full Center</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Notifications Scroll List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[340px]">
        {filteredNotifications.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-300">
              No notifications found
            </div>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              {activeTab === 'UNREAD'
                ? 'All caught up! No unread notifications.'
                : activeTab === 'ALERTS'
                ? 'No delivery exception alerts reported.'
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
              onCloseParent={onClose}
            />
          ))
        )}
      </div>

      {/* Live Simulation Testing Bar */}
      <div className="p-2.5 border-t border-cyan-500/15 bg-[#050b14]/95">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Simulate Real-Time Telemetry</span>
          </span>
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => simulateNotification(NOTIFICATION_TYPES.SHIPMENT_CREATED)}
            className="px-1.5 py-1 rounded bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-[9px] font-bold text-cyan-300 flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
            title="Simulate Shipment Created"
          >
            <PackagePlus className="w-2.5 h-2.5 text-cyan-400" />
            <span>+ Create</span>
          </button>
          <button
            type="button"
            onClick={() => simulateNotification(NOTIFICATION_TYPES.STATUS_UPDATE)}
            className="px-1.5 py-1 rounded bg-blue-950/50 hover:bg-blue-900/60 border border-blue-500/30 text-[9px] font-bold text-blue-300 flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
            title="Simulate Delivery Status Update"
          >
            <Truck className="w-2.5 h-2.5 text-blue-400" />
            <span>Update</span>
          </button>
          <button
            type="button"
            onClick={() => simulateNotification(NOTIFICATION_TYPES.DELIVERY_COMPLETED)}
            className="px-1.5 py-1 rounded bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-[9px] font-bold text-emerald-300 flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
            title="Simulate Delivery Completed"
          >
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
            <span>Delivered</span>
          </button>
          <button
            type="button"
            onClick={() => simulateNotification(NOTIFICATION_TYPES.FAILED_DELIVERY)}
            className="px-1.5 py-1 rounded bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/30 text-[9px] font-bold text-rose-300 flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
            title="Simulate Failed Delivery Alert"
          >
            <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
            <span>Alert</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation Button */}
      <div className="p-2 border-t border-cyan-500/20 bg-[#081220]">
        <button
          type="button"
          onClick={handleOpenFullCenter}
          className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View All in Notification Center</span>
        </button>
      </div>
    </div>
  )
}
