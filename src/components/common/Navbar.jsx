import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { useNotifications } from '../../context/useNotifications'
import GlobeIcon from './GlobeIcon'
import NotificationDropdown from '../notifications/NotificationDropdown'
import {
  Package,
  LayoutDashboard,
  Users,
  LogOut,
  User,
  Shield,
  Bell,
  Radar,
  ShieldAlert,
  BarChart3,
} from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const location = useLocation()

  const isDashboard = location.pathname === '/dashboard'
  const isTracking = location.pathname.startsWith('/tracking')
  const isDeliveryStatus =
    location.pathname.startsWith('/delivery-status') ||
    location.pathname.startsWith('/status')
  const isShipments = location.pathname.startsWith('/shipments')
  const isCustomers = location.pathname.startsWith('/customers')
  const isNotifications = location.pathname.startsWith('/notifications')
  const isReports = location.pathname.startsWith('/reports')

  return (
    <header className="border-b border-cyan-500/30 bg-[#091526]/95 backdrop-blur-md sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Identity with 3D Orbital Globe Icon */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <GlobeIcon className="w-9 h-9" />
          <div>
            <div className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-white leading-none group-hover:text-cyan-300 transition-colors">
              Global Connect Couriers
            </div>
            <div className="text-[11px] font-semibold text-cyan-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
              Cyber Command & Tracking Center
            </div>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#050b14] p-1 rounded-xl border border-cyan-500/30">
          <Link
            to="/dashboard"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isDashboard
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/tracking"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isTracking
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>Tracking</span>
          </Link>

          <Link
            to="/delivery-status"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isDeliveryStatus
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Status</span>
          </Link>

          <Link
            to="/shipments"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isShipments
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Shipments</span>
          </Link>

          <Link
            to="/customers"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isCustomers
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customers</span>
          </Link>

          <Link
            to="/notifications"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isNotifications
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-cyan-500/30 text-cyan-300 border border-cyan-400/40">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link
            to="/reports"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isReports
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Reports</span>
          </Link>
        </nav>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3 justify-end">

          {/* Notification bell container with dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="relative p-2 rounded-xl bg-[#050b14] border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-300 transition-colors cursor-pointer"
              title="Notification Center (Click to toggle panel)"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-[0_0_8px_#f43f5e] animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <NotificationDropdown
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
            />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#050b14] border border-cyan-500/40">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-sm overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="text-left text-xs hidden sm:block">
              <div className="font-bold text-white leading-none">
                {user?.fullName || 'Alex Mercer'}
              </div>
              <div className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
                <Shield className="w-2.5 h-2.5 text-cyan-400" />
                <span>{user?.role || 'Dispatcher'}</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase transition-all cursor-pointer shadow-sm"
            title="Logout from command"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-cyan-500/20 bg-[#060c18] px-2 py-1.5">
        <Link
          to="/dashboard"
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
            isDashboard
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
              : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-3 h-3" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/tracking"
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
            isTracking
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
              : 'text-slate-400'
          }`}
        >
          <Radar className="w-3 h-3" />
          <span>Tracking</span>
        </Link>
        <Link
          to="/delivery-status"
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
            isDeliveryStatus
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
              : 'text-slate-400'
          }`}
        >
          <ShieldAlert className="w-3 h-3" />
          <span>Status</span>
        </Link>
        <Link
          to="/shipments"
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
            isShipments
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
              : 'text-slate-400'
          }`}
        >
          <Package className="w-3 h-3" />
          <span>Shipments</span>
        </Link>
        <Link
          to="/customers"
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
            isCustomers
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
              : 'text-slate-400'
          }`}
        >
          <Users className="w-3 h-3" />
          <span>Customers</span>
        </Link>
        <Link
          to="/notifications"
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
            isNotifications
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
              : 'text-slate-400'
          }`}
        >
          <Bell className="w-3 h-3" />
          <span>Alerts</span>
          {unreadCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          )}
        </Link>
        <Link
          to="/reports"
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
            isReports
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
              : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-3 h-3" />
          <span>Reports</span>
        </Link>
      </div>
    </header>
  )
}
