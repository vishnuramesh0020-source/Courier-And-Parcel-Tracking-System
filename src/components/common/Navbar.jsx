import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import GlobeIcon from './GlobeIcon'
import {
  Package,
  LayoutDashboard,
  LogOut,
  User,
  Shield,
  Bell,
  Radio,
  Search,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isDashboard = location.pathname === '/dashboard'
  const isShipments = location.pathname.startsWith('/shipments')

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
        </nav>

        {/* Optional Center Tracking Search Pill */}
        {onSearch && (
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    onSearch(e.target.value.trim())
                  }
                }}
                placeholder="Search tracking code, courier, or city hub..."
                className="w-full h-9.5 pl-10 pr-4 text-xs rounded-xl bg-[#050b14] border border-cyan-500/40 text-white placeholder-slate-400 outline-none focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              />
            </div>
          </div>
        )}

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3 justify-end">
          {/* Live Node Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[11px] font-semibold">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>12 Hubs Synced</span>
          </div>

          {/* Notification bell with red alert dot */}
          <button
            onClick={() => toast.info('System Telemetry: All 12 global corridors normal. 99.2% on-time.')}
            className="relative p-2 rounded-xl bg-[#050b14] border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-300 transition-colors cursor-pointer"
            title="Alert Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
          </button>

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
    </header>
  )
}
