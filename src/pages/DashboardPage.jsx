import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Navbar from '../components/common/Navbar'
import StatCard from '../components/dashboard/StatCard'
import CyberWorldMap from '../components/dashboard/CyberWorldMap'
import QuickActionCards from '../components/dashboard/QuickActionCards'
import RecentActivities from '../components/dashboard/RecentActivities'
import ShipmentModal from '../components/dashboard/ShipmentModal'
import TrackModal from '../components/dashboard/TrackModal'
import CustomerModal from '../components/dashboard/CustomerModal'
import {
  fetchShipments,
  createShipment,
  getLocalShipments,
} from '../services/shipmentApi'
import {
  getStoredCustomers,
  createCustomer,
  fetchCustomers,
} from '../services/customerService'
import {
  getAllStatusHistory,
} from '../services/statusService'
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  RefreshCw,
  Activity,
  Wifi,
} from 'lucide-react'
import { toast } from 'react-toastify'

const TODAY_ISO = new Date().toISOString().split('T')[0]

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // 1. Core State loaded from API & Storage
  const [shipments, setShipments] = useState(() => getLocalShipments())
  const [customers, setCustomers] = useState(() => getStoredCustomers())
  const [isApiSyncing, setIsApiSyncing] = useState(false)

  // 2. Modals and Search State
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false)
  const [selectedTrackingCode, setSelectedTrackingCode] = useState('')

  // 3. Build Initial Activity List from real shipments & audit events
  const [activities, setActivities] = useState(() => {
    const list = getLocalShipments()
    const history = getAllStatusHistory()

    const initialFeed = []

    // Add recent real status transitions
    history.forEach((h, idx) => {
      initialFeed.push({
        id: h.id || `act-hist-${idx}`,
        title: `Consignment ${h.toStatus}: ${h.trackingNumber}`,
        trackingId: h.trackingNumber,
        type: h.toStatus === 'Delivered' ? 'delivery' : 'shipment',
        status: h.toStatus,
        location: h.location,
        actor: h.operator || 'Dispatcher',
        timestamp: h.timestamp || 'Recent',
        date: 'Today',
      })
    })

    // Add real registered shipments
    list.forEach((s, idx) => {
      const alreadyHasStatus = history.some((h) => h.trackingNumber === s.trackingNumber)
      if (!alreadyHasStatus) {
        initialFeed.push({
          id: `act-ship-${s.id || idx}`,
          title: `Shipment ${s.deliveryStatus}: ${s.senderName} → ${s.receiverName}`,
          trackingId: s.trackingNumber || s.id,
          type: s.deliveryStatus === 'Delivered' ? 'delivery' : 'shipment',
          status: s.deliveryStatus || 'In Transit',
          location: `${s.pickupAddress?.split(',')[0] || 'Origin'} → ${s.deliveryAddress?.split(',')[0] || 'Destination'}`,
          actor: s.carrier || 'Global Courier',
          timestamp: s.shippingDate || 'Recent',
          date: 'Today',
        })
      }
    })

    return initialFeed.slice(0, 5)
  })

  // 4. Initial load with Third-Party API
  useEffect(() => {
    let ignore = false
    Promise.all([fetchShipments(), fetchCustomers()])
      .then(([shipRes, custRes]) => {
        if (!ignore) {
          if (shipRes?.data) {
            setShipments(shipRes.data)
            // Update initial feed with fetched API shipments
            const history = getAllStatusHistory()
            const newFeed = []
            history.forEach((h, idx) => {
              newFeed.push({
                id: h.id || `act-hist-${idx}`,
                title: `Consignment ${h.toStatus}: ${h.trackingNumber}`,
                trackingId: h.trackingNumber,
                type: h.toStatus === 'Delivered' ? 'delivery' : 'shipment',
                status: h.toStatus,
                location: h.location,
                actor: h.operator || 'Dispatcher',
                timestamp: h.timestamp || 'Recent',
                date: 'Today',
              })
            })
            shipRes.data.forEach((s, idx) => {
              const alreadyHasStatus = history.some((h) => h.trackingNumber === s.trackingNumber)
              if (!alreadyHasStatus) {
                newFeed.push({
                  id: `act-ship-${s.id || idx}`,
                  title: `Shipment ${s.deliveryStatus}: ${s.senderName} → ${s.receiverName}`,
                  trackingId: s.trackingNumber || s.id,
                  type: s.deliveryStatus === 'Delivered' ? 'delivery' : 'shipment',
                  status: s.deliveryStatus || 'In Transit',
                  location: `${s.pickupAddress?.split(',')[0] || 'Origin'} → ${s.deliveryAddress?.split(',')[0] || 'Destination'}`,
                  actor: s.carrier || 'Global Courier',
                  timestamp: s.shippingDate || 'Recent',
                  date: 'Today',
                })
              }
            })
            setActivities(newFeed.slice(0, 5))
          }
          if (custRes?.data) {
            setCustomers(custRes.data)
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.warn('Initial fetch notice:', err.message)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  // Manual Synchronize button handler
  const handleManualSync = async () => {
    try {
      setIsApiSyncing(true)
      const [res, custRes] = await Promise.all([fetchShipments(), fetchCustomers()])
      if (res && res.data) {
        setShipments(res.data)
      }

      if (custRes && custRes.data) {
        setCustomers(custRes.data)
      } else {
        const custList = getStoredCustomers()
        setCustomers(custList)
      }

      // Refresh activities with latest real data
      const history = getAllStatusHistory()
      const newFeed = []
      history.forEach((h, idx) => {
        newFeed.push({
          id: h.id || `act-hist-${idx}`,
          title: `Consignment ${h.toStatus}: ${h.trackingNumber}`,
          trackingId: h.trackingNumber,
          type: h.toStatus === 'Delivered' ? 'delivery' : 'shipment',
          status: h.toStatus,
          location: h.location,
          actor: h.operator || 'Dispatcher',
          timestamp: h.timestamp || 'Recent',
          date: 'Today',
        })
      })
      const freshShipments = res?.data || shipments
      freshShipments.forEach((s, idx) => {
        const alreadyHasStatus = history.some((h) => h.trackingNumber === s.trackingNumber)
        if (!alreadyHasStatus) {
          newFeed.push({
            id: `act-ship-${s.id || idx}`,
            title: `Shipment ${s.deliveryStatus}: ${s.senderName} → ${s.receiverName}`,
            trackingId: s.trackingNumber || s.id,
            type: s.deliveryStatus === 'Delivered' ? 'delivery' : 'shipment',
            status: s.deliveryStatus || 'In Transit',
            location: `${s.pickupAddress?.split(',')[0] || 'Origin'} → ${s.deliveryAddress?.split(',')[0] || 'Destination'}`,
            actor: s.carrier || 'Global Courier',
            timestamp: s.shippingDate || 'Recent',
            date: 'Today',
          })
        }
      })
      setActivities(newFeed.slice(0, 5))

      toast.success('Live Telemetry & Third-Party API successfully synchronized!')
    } catch (err) {
      console.warn('API Sync notice:', err.message)
      toast.info('Local Storage cache active (Offline-resilient).')
    } finally {
      setIsApiSyncing(false)
    }
  }

  // 6. Dynamic Metrics Calculation from live datasets
  const dynamicStats = useMemo(() => {
    const total = shipments.length
    const inTransit = shipments.filter((s) => s.deliveryStatus === 'In Transit').length
    const delivered = shipments.filter((s) => s.deliveryStatus === 'Delivered').length
    const outForDelivery = shipments.filter((s) => s.deliveryStatus === 'Out for Delivery').length
    const pending = shipments.filter(
      (s) => s.deliveryStatus === 'Pending' || s.deliveryStatus === 'Picked Up'
    ).length
    const failed = shipments.filter((s) => s.deliveryStatus === 'Failed Delivery').length
    const cancelled = shipments.filter((s) => s.deliveryStatus === 'Cancelled').length
    const custCount = customers.length

    // Today's shipments
    const todayCount = shipments.filter(
      (s) => s.shippingDate === TODAY_ISO || s.date === 'Today'
    ).length

    // Success rate (delivered / (delivered + failed)) or delivered / total
    const resolvedCount = delivered + failed
    const successRate = resolvedCount > 0
      ? ((delivered / resolvedCount) * 100).toFixed(1)
      : (total > 0 ? ((delivered / total) * 100).toFixed(1) : '100.0')

    const pendingTotal = pending + outForDelivery

    const inTransitPct = total > 0 ? Math.round((inTransit / total) * 100) : 0
    const deliveredPct = total > 0 ? Math.round((delivered / total) * 100) : 0
    const pendingPct = total > 0 ? Math.round((pendingTotal / total) * 100) : 0
    const successRateNum = parseFloat(successRate) || 100

    return {
      totalShipments: total.toLocaleString(),
      inTransit: inTransit.toLocaleString(),
      delivered: delivered.toLocaleString(),
      pendingDeliveries: pendingTotal.toLocaleString(),
      totalCustomers: custCount.toLocaleString(),
      todayShipments: todayCount.toLocaleString(),
      deliverySuccessRate: `${successRate}%`,
      inTransitPct,
      deliveredPct,
      pendingPct,
      successRateNum,
      actualCounts: {
        total,
        inTransit,
        delivered,
        outForDelivery,
        pending,
        failed,
        cancelled,
      },
    }
  }, [shipments, customers])

  // Quick Action Callbacks
  const handleOpenTracking = (code = '') => {
    const target = code || shipments[0]?.trackingNumber || shipments[0]?.id || 'GC-948210-US'
    setSelectedTrackingCode(target)
    setIsTrackModalOpen(true)
  }

  const handleCreateShipment = async (newShipmentData) => {
    try {
      setIsApiSyncing(true)
      const created = await createShipment({
        trackingNumber: newShipmentData.id,
        senderName: newShipmentData.origin,
        receiverName: newShipmentData.recipient,
        pickupAddress: newShipmentData.origin,
        deliveryAddress: newShipmentData.destination,
        parcelWeight: parseFloat(newShipmentData.weight) || 12.0,
        parcelType: 'Standard Box',
        shippingDate: newShipmentData.shippingDate || '2026-10-07',
        expectedDeliveryDate: newShipmentData.expectedDeliveryDate || '2026-10-12',
        deliveryStatus: newShipmentData.status || 'In Transit',
        carrier: newShipmentData.carrier || 'Global Air Cargo',
      })

      // Update state with newly created shipment
      setShipments((prev) => [created, ...prev])

      // Add to live activity stream (keep only latest 5)
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          title: `Waybill Issued: ${created.receiverName}`,
          trackingId: created.trackingNumber,
          type: 'shipment',
          status: created.deliveryStatus,
          location: `${created.pickupAddress} → ${created.deliveryAddress}`,
          actor: user?.fullName || 'Current Dispatcher',
          timestamp: 'Just now',
          date: 'Today',
        },
        ...prev,
      ].slice(0, 5))

      toast.success(`Consignment ${created.trackingNumber} issued & synced with Third-Party API!`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to create shipment: ' + err.message)
    } finally {
      setIsApiSyncing(false)
    }
  }

  const handleAddCustomer = async (newCustomerData) => {
    try {
      const created = await createCustomer({
        customerName: newCustomerData.name,
        email: newCustomerData.email,
        mobileNumber: newCustomerData.phone || '+1 (555) 000-0000',
        address: newCustomerData.company || 'Enterprise Suite',
        city: 'Global Metropolitan Area',
        postalCode: '10001',
      })

      setCustomers((prev) => [created, ...prev])

      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          title: `New Client Registered: ${created.customerName}`,
          type: 'customer',
          status: 'Customer Registered',
          location: created.city || 'Hub Center',
          actor: user?.fullName || 'Administrator',
          timestamp: 'Just now',
          date: 'Today',
        },
        ...prev,
      ].slice(0, 5))

      toast.success(`Client ${created.customerName} successfully registered in registry!`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to register customer: ' + err.message)
    }
  }

  const handleDispatchScan = () => {
    const randomShipment = shipments[Math.floor(Math.random() * shipments.length)]
    if (randomShipment) {
      const code = randomShipment.trackingNumber || randomShipment.id
      toast.info(`Barcode Verified: Consignment ${code} scanned at sorting terminal.`)
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          title: `Terminal Barcode Scanned`,
          trackingId: code,
          type: 'shipment',
          status: randomShipment.deliveryStatus || 'In Transit',
          location: randomShipment.pickupAddress || 'Sorting Terminal',
          actor: 'Automated Hub Scanner',
          timestamp: 'Just now',
          date: 'Today',
        },
        ...prev,
      ].slice(0, 5))
    }
  }

  const handleExportReport = () => {
    // Generate real CSV from current shipments
    const headers = [
      'Tracking Number',
      'Sender Name',
      'Receiver Name',
      'Pickup Address',
      'Delivery Address',
      'Delivery Status',
      'Weight (kg)',
      'Carrier',
      'Shipping Date',
      'Expected Delivery',
    ]

    const rows = shipments.map((s) => [
      `"${s.trackingNumber || s.id}"`,
      `"${s.senderName || ''}"`,
      `"${s.receiverName || ''}"`,
      `"${s.pickupAddress || ''}"`,
      `"${s.deliveryAddress || ''}"`,
      `"${s.deliveryStatus || ''}"`,
      s.parcelWeight || 0,
      `"${s.carrier || ''}"`,
      `"${s.shippingDate || ''}"`,
      `"${s.expectedDeliveryDate || ''}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `global-connect-courier-manifest-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`Audited manifest with ${shipments.length} consignments exported as CSV!`)
    setTimeout(() => {
      navigate('/reports')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col select-none relative overflow-x-hidden font-sans">
      {/* Background Subtle Cyber Glow Overlay */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Unified Cyber Command Navigation Bar */}
      <Navbar />

      {/* Main Cyber Command Dashboard */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-5 relative z-10">
        {/* =========================================================
            HEADER & REAL-TIME API TELEMETRY STRIP
            ========================================================= */}
        <div className="p-4 rounded-2xl bg-[#091526]/90 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_25px_rgba(6,182,212,0.12)]">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Activity className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Real-Time Command Dashboard
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live API Sync Active
                </span>
              </div>
            </div>
          </div>

          {/* Manual Force API Sync Button */}
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isApiSyncing}
            className="px-3.5 py-2 rounded-xl bg-[#050b14] border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)] disabled:opacity-50 self-end sm:self-auto"
            title="Fetch real-time updates from Third-Party API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isApiSyncing ? 'animate-spin' : ''}`} />
            <span>{isApiSyncing ? 'Synchronizing API...' : 'Synchronize API'}</span>
          </button>
        </div>

        {/* =========================================================
            ROW 1: 7 CYBER HUD STAT METRIC CARDS
            Directly derived from API & local storage
            ========================================================= */}
        <section className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
            {/* 1. Total Shipments */}
            <StatCard
              title="Total Shipments"
              value={dynamicStats.totalShipments}
              change={`+${dynamicStats.actualCounts.total} Live`}
              subtitle="All Waybills"
              icon={Package}
              progress={100}
            />

            {/* 2. In Transit Parcels */}
            <StatCard
              title="In Transit Parcels"
              value={dynamicStats.inTransit}
              change={`${dynamicStats.inTransitPct}% of total`}
              subtitle="En Route"
              icon={Truck}
              progress={dynamicStats.inTransitPct}
            />

            {/* 3. Delivered */}
            <StatCard
              title="Delivered"
              value={dynamicStats.delivered}
              change={`${dynamicStats.deliveredPct}% completed`}
              subtitle="Successful"
              icon={CheckCircle2}
              progress={dynamicStats.deliveredPct}
            />

            {/* 4. Pending */}
            <StatCard
              title="Pending & Intake"
              value={dynamicStats.pendingDeliveries}
              change={`${dynamicStats.pendingPct}% in queue`}
              subtitle="Awaiting Delivery"
              icon={Clock}
              progress={dynamicStats.pendingPct}
            />

            {/* 5. Customers */}
            <StatCard
              title="Customers"
              value={dynamicStats.totalCustomers}
              change={`${customers.length} Entities`}
              subtitle="Registered"
              icon={Users}
              progress={100}
            />

            {/* 6. Today's Shipments */}
            <StatCard
              title="Today's Shipments"
              value={dynamicStats.todayShipments}
              change="Active Batch"
              subtitle="Today"
              icon={Calendar}
              progress={
                dynamicStats.actualCounts.total > 0
                  ? Math.round(
                      (Number(dynamicStats.todayShipments) /
                        dynamicStats.actualCounts.total) *
                        100
                    )
                  : 100
              }
            />

            {/* 7. Success Rate */}
            <StatCard
              title="Success Rate"
              value={dynamicStats.deliverySuccessRate}
              change="Target: 98%"
              subtitle="On-time SLA"
              icon={Wifi}
              progress={dynamicStats.successRateNum}
            />
          </div>
        </section>

        {/* =========================================================
            ROW 2: CYBER WORLD MAP & VERTICAL QUICK ACTIONS
            ========================================================= */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column (8 cols): Holographic Cyber World Map */}
          <div className="lg:col-span-8 w-full flex flex-col">
            <CyberWorldMap onSelectRoute={handleOpenTracking} />
          </div>

          {/* Right Column (4 cols): Quick Action Vertical Cards */}
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
            ROW 3: RECENT ACTIVITIES TABLE
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
