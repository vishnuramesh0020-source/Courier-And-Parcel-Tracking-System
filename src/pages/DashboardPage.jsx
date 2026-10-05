import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import GlobeIcon from '../components/common/GlobeIcon'
import StatCard from '../components/dashboard/StatCard'
import CyberWorldMap from '../components/dashboard/CyberWorldMap'
import QuickActionCards from '../components/dashboard/QuickActionCards'
import RecentActivities from '../components/dashboard/RecentActivities'
import ShipmentModal from '../components/dashboard/ShipmentModal'
import TrackModal from '../components/dashboard/TrackModal'
import CustomerModal from '../components/dashboard/CustomerModal'
import {
  LogOut,
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  Shield,
  User,
  Bell,
  Grid,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  // 1. Metric Stats State (7 Core Courier Metrics)
  const [stats, setStats] = useState({
    totalShipments: 12854,
    inTransit: 1842,
    delivered: 10130,
    pendingDeliveries: 882,
    totalCustomers: 3420,
    todayShipments: 348,
    deliverySuccessRate: '99.2%',
  })

  // 2. Live Shipments State
  const [shipments, setShipments] = useState([
    {
      id: 'GC-94821-US',
      origin: 'From New York (JFK), USA',
      destination: 'To London Heathrow, UK',
      recipient: 'Global Tech Corp',
      carrier: 'Global Air Cargo',
      status: 'In Transit',
      progress: 65,
      weight: '18.4 kg',
    },
    {
      id: 'GC-83920-EU',
      origin: 'From Frankfurt Hub, Germany',
      destination: 'To Dubai (DXB), UAE',
      recipient: 'Al-Mansoor Logistics',
      carrier: 'Express Overland',
      status: 'Out for Delivery',
      progress: 90,
      weight: '34.0 kg',
    },
    {
      id: 'GC-72109-AP',
      origin: 'From Tokyo Hub, Japan',
      destination: 'To San Francisco, USA',
      recipient: 'Pacific Imports LLC',
      carrier: 'Pacific Priority',
      status: 'Delivered',
      progress: 100,
      weight: '8.2 kg',
    },
    {
      id: 'GC-61094-SA',
      origin: 'From Sao Paulo Hub, Brazil',
      destination: 'To Madrid Terminal, Spain',
      recipient: 'Iberia Express Lines',
      carrier: 'Atlantic Logistics',
      status: 'Customs Clearance',
      progress: 40,
      weight: '12.0 kg',
    },
    {
      id: 'GC-55201-UK',
      origin: 'From Manchester Hub, UK',
      destination: 'To Sydney Terminal, Australia',
      recipient: 'Southern Cross Freight',
      carrier: 'Global Air Cargo',
      status: 'In Transit',
      progress: 55,
      weight: '24.5 kg',
    },
  ])

  // 3. Recent Activities Feed State
  const [activities, setActivities] = useState([
    {
      id: 'act-1',
      title: 'Air Cargo Dispatched to London Heathrow',
      trackingId: 'GC-94821-US',
      type: 'shipment',
      status: 'In Transit',
      location: 'New York (JFK) → London (LHR)',
      actor: 'Global Courier Unit',
      timestamp: '5 mins ago',
      date: 'Today',
    },
    {
      id: 'act-2',
      title: 'Consignment Signed & Delivered',
      trackingId: 'GC-72109-AP',
      type: 'delivery',
      status: 'Delivered',
      location: 'San Francisco Hub Area',
      actor: 'Pacific Express Courier',
      timestamp: '22 mins ago',
      date: 'Today',
    },
    {
      id: 'act-3',
      title: 'New Commercial Customer Onboarded',
      type: 'customer',
      status: 'Customer Registered',
      location: 'Atlas Global Logistics (Hamburg)',
      actor: 'Account Manager Alex',
      timestamp: '1 hour ago',
      date: 'Today',
    },
    {
      id: 'act-4',
      title: 'Customs Documentation Verified at Frankfurt',
      trackingId: 'GC-83920-EU',
      type: 'shipment',
      status: 'Out for Delivery',
      location: 'Frankfurt Central Freight Facility',
      actor: 'Automated Customs Gateway',
      timestamp: '2 hours ago',
      date: 'Today',
    },
    {
      id: 'act-5',
      title: 'Consignment Scheduled for Hub Intake',
      trackingId: 'GC-61094-SA',
      type: 'shipment',
      status: 'Pending Pickup',
      location: 'Sao Paulo Air Terminal',
      actor: 'Ground Cargo Team',
      timestamp: '3 hours ago',
      date: 'Today',
    },
  ])

  // 4. Modal and Search State
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false)
  const [selectedTrackingCode, setSelectedTrackingCode] = useState('')
  const [headerSearch, setHeaderSearch] = useState('')

  // Quick Action Callbacks
  const handleOpenTracking = (code = '') => {
    setSelectedTrackingCode(code || (shipments[0]?.id ?? 'GC-94821-US'))
    setIsTrackModalOpen(true)
  }

  const handleCreateShipment = (newShipment) => {
    setShipments((prev) => [newShipment, ...prev])
    setStats((prev) => ({
      ...prev,
      totalShipments: prev.totalShipments + 1,
      todayShipments: prev.todayShipments + 1,
      inTransit: prev.inTransit + 1,
    }))
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `Waybill Issued for ${newShipment.recipient}`,
        trackingId: newShipment.id,
        type: 'shipment',
        status: 'In Transit',
        location: `${newShipment.origin} → ${newShipment.destination}`,
        actor: user?.fullName || 'Current Dispatcher',
        timestamp: 'Just now',
        date: 'Today',
      },
      ...prev,
    ])
    toast.success(`Consignment ${newShipment.id} successfully created!`)
  }

  const handleAddCustomer = (newCustomer) => {
    setStats((prev) => ({
      ...prev,
      totalCustomers: prev.totalCustomers + 1,
    }))
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `New Client Registered: ${newCustomer.name}`,
        type: 'customer',
        status: 'Customer Registered',
        location: newCustomer.company,
        actor: user?.fullName || 'Administrator',
        timestamp: 'Just now',
        date: 'Today',
      },
      ...prev,
    ])
    toast.success(`Customer ${newCustomer.name} successfully registered!`)
  }

  const handleDispatchScan = () => {
    const randomShipment = shipments[Math.floor(Math.random() * shipments.length)]
    if (randomShipment) {
      toast.info(`Barcode Verified: Consignment ${randomShipment.id} scanned at sorting terminal.`)
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          title: `Terminal Barcode Scanned & Reconciled`,
          trackingId: randomShipment.id,
          type: 'shipment',
          status: 'In Transit',
          location: randomShipment.origin,
          actor: 'Automated Hub Scanner',
          timestamp: 'Just now',
          date: 'Today',
        },
        ...prev,
      ])
    }
  }

  const handleExportReport = () => {
    toast.success('Audited daily courier manifest exported as CSV & PDF.')
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col select-none relative overflow-x-hidden font-sans">
      {/* Background Subtle Cyber Glow Overlay */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* =========================================================
          TOP CYBER COMMAND NAVIGATION BAR (Exact Match to Image 2)
          ========================================================= */}
      <header className="border-b border-cyan-500/30 bg-[#091526]/95 backdrop-blur-md sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand Identity with 3D Orbital Globe Icon */}
          <div className="flex items-center gap-3">
            <GlobeIcon className="w-9 h-9" />
            <div>
              <div className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-white leading-none">
                Global Connect Couriers
              </div>
              <div className="text-[11px] font-semibold text-cyan-400 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                Cyber Command & Tracking Center
              </div>
            </div>
          </div>

          {/* Center Search Pill matching Image 2 */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && headerSearch.trim()) {
                    handleOpenTracking(headerSearch.trim())
                  }
                }}
                placeholder="Search tracking code, courier, or city hub..."
                className="w-full h-9.5 pl-10 pr-4 text-xs rounded-xl bg-[#050b14] border border-cyan-500/40 text-white placeholder-slate-400 outline-none focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              />
            </div>
          </div>

          {/* Right Action Icons & Profile matching Image 2 */}
          <div className="flex items-center gap-3 justify-end">
            {/* Grid menu icon */}
            <button
              onClick={() => toast.info('System Telemetry: All 12 Hubs Connected.')}
              className="p-2 rounded-xl bg-[#050b14] border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-300 transition-colors cursor-pointer hidden sm:block"
              title="Hub Overview"
            >
              <Grid className="w-4 h-4" />
            </button>

            {/* Notification bell with red alert dot */}
            <button
              onClick={() => toast.info('No critical delays. 99.2% on-time.')}
              className="relative p-2 rounded-xl bg-[#050b14] border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-300 transition-colors cursor-pointer"
              title="Alert Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
            </button>

            {/* User Profile matching Image 2 */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#050b14] border border-cyan-500/40">
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

      {/* =========================================================
          MAIN CYBER COMMAND DASHBOARD (Full Width, No Side Space)
          ========================================================= */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-5 relative z-10">
        {/* =========================================================
            ROW 1: 7 CYBER HUD STAT METRIC CARDS
            Matching the top row of Image 2
            ========================================================= */}
        <section className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
            {/* 1. Total Shipments */}
            <StatCard
              title="Total Shipments"
              value={stats.totalShipments.toLocaleString()}
              change="+18.4% YoY"
              subtitle="Total Shipments"
              icon={Package}
              progress={75}
            />

            {/* 2. In Transit Parcels */}
            <StatCard
              title="In Transit Parcels"
              value={stats.inTransit.toLocaleString()}
              change="Active Flight"
              subtitle="In Transit Parcels"
              icon={Truck}
              progress={65}
            />

            {/* 3. Delivered */}
            <StatCard
              title="Delivered"
              value={stats.delivered.toLocaleString()}
              change="Optimal"
              subtitle="Total Delivered"
              icon={CheckCircle2}
              progress={88}
            />

            {/* 4. Pending */}
            <StatCard
              title="Pending"
              value={stats.pendingDeliveries.toLocaleString()}
              change="Dispatch Queue"
              subtitle="Vendor Pending"
              icon={Clock}
              progress={32}
            />

            {/* 5. Customers */}
            <StatCard
              title="Customers"
              value={stats.totalCustomers.toLocaleString()}
              change="+12.2% Growth"
              subtitle="Active Clients"
              icon={Users}
              progress={80}
            />

            {/* 6. Today's Shipments */}
            <StatCard
              title="Today's Shipments"
              value={stats.todayShipments.toLocaleString()}
              change="+24.1% Sustained"
              subtitle="Intake Today"
              icon={Calendar}
              progress={70}
            />

            {/* 7. Success Rate */}
            <StatCard
              title="Success Rate"
              value={stats.deliverySuccessRate}
              change="SLA 100%"
              subtitle="On-time Rate"
              icon={CheckCircle2}
              progress={99.2}
            />
          </div>
        </section>

        {/* =========================================================
            ROW 2: CYBER WORLD MAP & VERTICAL QUICK ACTIONS
            Exact Match to the Middle Row of Image 2:
            - Left: Global World Map (8 cols)
            - Right: Quick Action Vertical Cards (4 cols)
            ========================================================= */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column (8 cols): Holographic Cyber World Map */}
          <div className="lg:col-span-8 w-full flex flex-col">
            <CyberWorldMap onSelectRoute={handleOpenTracking} />
          </div>

          {/* Right Column (4 cols): Quick Action Vertical Cards matching Image 2 */}
          <div className="lg:col-span-4 w-full flex flex-col">
            <QuickActionCards
              layout="vertical"
              onNewShipment={() => setIsShipmentModalOpen(true)}
              onTrackParcel={() => handleOpenTracking()}
              onAddCustomer={() => setIsCustomerModalOpen(true)}
              onDispatchScan={handleDispatchScan}
              onExportReport={handleExportReport}
            />
          </div>
        </section>

        {/* =========================================================
            ROW 3: LIVE DARK COURIER DISPATCH TABLE
            Exact Match to the Lower Table of Image 2
            ========================================================= */}
        <section className="w-full">
          <RecentActivities
            activities={activities}
            onTrackParcel={handleOpenTracking}
          />
        </section>
      </main>

      {/* =========================================================
          INTERACTIVE CYBER MODALS
          ========================================================= */}
      <ShipmentModal
        isOpen={isShipmentModalOpen}
        onClose={() => setIsShipmentModalOpen(false)}
        onCreateShipment={handleCreateShipment}
      />

      <TrackModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        initialCode={selectedTrackingCode}
        shipments={shipments}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onAddCustomer={handleAddCustomer}
      />
    </div>
  )
}
