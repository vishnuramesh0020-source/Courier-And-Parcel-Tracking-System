import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import Navbar from '../components/common/Navbar'
import StatCard from '../components/dashboard/StatCard'
import CyberWorldMap from '../components/dashboard/CyberWorldMap'
import QuickActionCards from '../components/dashboard/QuickActionCards'
import RecentActivities from '../components/dashboard/RecentActivities'
import ShipmentModal from '../components/dashboard/ShipmentModal'
import TrackModal from '../components/dashboard/TrackModal'
import CustomerModal from '../components/dashboard/CustomerModal'
import { createShipment } from '../services/shipmentApi'
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function DashboardPage() {
  const { user } = useAuth()

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
    // Persist to Module 3 API & LocalStorage
    createShipment({
      trackingNumber: newShipment.id,
      senderName: newShipment.origin,
      receiverName: newShipment.recipient,
      pickupAddress: newShipment.origin,
      deliveryAddress: newShipment.destination,
      parcelWeight: parseFloat(newShipment.weight) || 12.0,
      parcelType: 'Standard Box',
      shippingDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      deliveryStatus: 'In Transit',
      carrier: newShipment.carrier,
    }).catch(() => {})

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
      {/* =========================================================
          TOP CYBER COMMAND NAVIGATION BAR
          ========================================================= */}
      <Navbar onSearch={handleOpenTracking} />

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
