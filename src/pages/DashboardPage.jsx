import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import GlobeIcon from '../components/common/GlobeIcon'
import {
  LogOut,
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Shield,
  User,
  Phone,
  Mail,
} from 'lucide-react'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [searchTracking, setSearchTracking] = useState('')

  // Sample shipments for previewing the courier tracking system
  const mockShipments = [
    {
      id: 'GC-94821-US',
      origin: 'New York (JFK), USA',
      destination: 'London (LHR), United Kingdom',
      status: 'In Transit',
      carrier: 'Global Air Cargo',
      eta: 'Tomorrow, 14:00 GMT',
      statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      progress: 65,
    },
    {
      id: 'GC-83920-EU',
      origin: 'Frankfurt Hub, Germany',
      destination: 'Dubai (DXB), UAE',
      status: 'Out for Delivery',
      carrier: 'Express Overland',
      eta: 'Today, 18:30 GST',
      statusColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      progress: 90,
    },
    {
      id: 'GC-72109-AP',
      origin: 'Tokyo Hub, Japan',
      destination: 'San Francisco, USA',
      status: 'Delivered',
      carrier: 'Pacific Priority',
      eta: 'Delivered at 09:15 PST',
      statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      progress: 100,
    },
    {
      id: 'GC-61094-SA',
      origin: 'Sao Paulo, Brazil',
      destination: 'Madrid, Spain',
      status: 'Customs Clearance',
      carrier: 'Atlantic Logistics',
      eta: 'Oct 07, 11:00 CEST',
      statusColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      progress: 40,
    },
  ]

  const filteredShipments = mockShipments.filter((s) =>
    s.id.toLowerCase().includes(searchTracking.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchTracking.toLowerCase()) ||
    s.origin.toLowerCase().includes(searchTracking.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#1b3b65] bg-[#0c1a2f]/90 backdrop-blur sticky top-0 z-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <GlobeIcon className="w-9 h-9" />
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-none">
                Global Connect
              </span>
              <span className="text-xs text-[#38bdf8] font-medium tracking-wide">
                Couriers & Parcel Tracking
              </span>
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-[#1b3b65]">
              <div className="w-9 h-9 rounded-full bg-[#1b3b65] border border-[#38bdf8]/40 overflow-hidden flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-sky-400" />
                )}
              </div>
              <div className="text-left text-xs">
                <div className="font-semibold text-white">{user?.fullName}</div>
                <div className="text-[#8ea5c6] flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#38bdf8]" />
                  <span>{user?.role || 'Authenticated'}</span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 text-xs sm:text-sm font-medium transition-all hover:border-red-700 cursor-pointer shadow-sm"
              title="Logout from portal"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Full Screen Width */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Welcome Banner with User Storage Details */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1a2f] via-[#10243f] to-[#0c1a2f] border border-[#1b3b65] shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-80 opacity-15 pointer-events-none flex items-center justify-center">
            <GlobeIcon className="w-72 h-72" />
          </div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#132d4e] text-[#38bdf8] text-xs font-medium border border-[#1b4372] mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Portal Access Verified (Session Active)
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome, {user?.fullName}!
            </h1>
            <p className="text-sm text-[#8ea5c6] max-w-2xl mb-4">
              Your credentials have been securely authenticated and stored in LocalStorage. You can now monitor global freight, search parcel tracking codes, and access courier services.
            </p>

            {/* User Session Info Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#070e1b]/60 border border-[#1b3b65]/80 text-xs">
                <Mail className="w-4 h-4 text-[#38bdf8]" />
                <span className="text-[#8ea5c6] truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#070e1b]/60 border border-[#1b3b65]/80 text-xs">
                <Shield className="w-4 h-4 text-[#38bdf8]" />
                <span className="text-[#8ea5c6]">{user?.role || 'Courier Client'}</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#070e1b]/60 border border-[#1b3b65]/80 text-xs">
                <Phone className="w-4 h-4 text-[#38bdf8]" />
                <span className="text-[#8ea5c6]">{user?.phone || 'No phone set'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0c1a2f] border border-[#1b3b65] flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10 text-[#38bdf8]">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1,280</div>
              <div className="text-xs text-[#8ea5c6]">Active Parcels</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1a2f] border border-[#1b3b65] flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">425</div>
              <div className="text-xs text-[#8ea5c6]">In Transit Hubs</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1a2f] border border-[#1b3b65] flex items-center gap-3">
            <div className="p-3 rounded-lg bg-sky-500/10 text-sky-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">182</div>
              <div className="text-xs text-[#8ea5c6]">Out For Delivery</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1a2f] border border-[#1b3b65] flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">98.9%</div>
              <div className="text-xs text-[#8ea5c6]">On-Time Rate</div>
            </div>
          </div>
        </div>

        {/* Parcel Tracking Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#7087a5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTracking}
              onChange={(e) => setSearchTracking(e.target.value)}
              placeholder="Search by Tracking ID (e.g. GC-94821) or City..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#0c1a2f] border border-[#1b3b65] text-white placeholder-[#7087a5] text-sm focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] outline-none"
            />
          </div>
          <div className="text-xs text-[#8ea5c6]">
            Showing {filteredShipments.length} tracked international shipments
          </div>
        </div>

        {/* Shipments List */}
        <div className="rounded-2xl bg-[#0c1a2f] border border-[#1b3b65] overflow-hidden shadow-lg">
          <div className="p-4 sm:p-5 border-b border-[#1b3b65] flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#38bdf8]" />
              Live Parcel Manifest
            </h2>
            <span className="text-xs text-[#8ea5c6]">Updated Live</span>
          </div>

          <div className="divide-y divide-[#1b3b65]/60">
            {filteredShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="p-4 sm:p-5 hover:bg-[#10243f]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-[#38bdf8] text-sm sm:text-base">
                      {shipment.id}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${shipment.statusColor}`}
                    >
                      {shipment.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#8ea5c6] flex items-center gap-2">
                    <span>{shipment.origin}</span>
                    <span className="text-[#38bdf8]">→</span>
                    <span className="text-white font-medium">{shipment.destination}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
                  <div className="text-right">
                    <div className="text-white font-medium">{shipment.eta}</div>
                    <div className="text-[#8ea5c6]">{shipment.carrier}</div>
                  </div>
                  <div className="w-24 bg-[#070e1b] rounded-full h-2 overflow-hidden border border-[#1b3b65]">
                    <div
                      className="bg-[#38bdf8] h-full rounded-full"
                      style={{ width: `${shipment.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
