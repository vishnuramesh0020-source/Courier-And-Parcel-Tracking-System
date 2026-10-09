import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import TrackingSearchBar from '../components/tracking/TrackingSearchBar'
import TrackingSummaryCard from '../components/tracking/TrackingSummaryCard'
import TrackingTimeline from '../components/tracking/TrackingTimeline'
import TrackingHistoryTable from '../components/tracking/TrackingHistoryTable'
import StatusUpdateModal from '../components/tracking/StatusUpdateModal'
import MultiShipmentTracker from '../components/tracking/MultiShipmentTracker'
import { getLocalShipments, fetchShipments } from '../services/shipmentApi'
import {
  searchShipmentByCode,
  getTrackingHistory,
  updateParcelStatus,
} from '../services/trackingService'
import { Radar, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

export default function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // All shipments in storage
  const [shipments, setShipments] = useState(() => getLocalShipments())

  // Tracking Mode: 'single' | 'multi'
  const [activeMode, setActiveMode] = useState('single')

  // Active Code (from URL or local fallback)
  const [currentCode, setCurrentCode] = useState(() => {
    const urlCode = searchParams.get('code')
    if (urlCode) return urlCode
    const list = getLocalShipments()
    return list[0]?.trackingNumber || list[0]?.id || ''
  })

  // Load fresh API shipments on mount
  useEffect(() => {
    let ignore = false
    fetchShipments().then((res) => {
      if (!ignore && res?.data) {
        setShipments(res.data)
        if (!currentCode && res.data.length > 0) {
          setCurrentCode(res.data[0]?.trackingNumber || res.data[0]?.id || '')
        }
      }
    })
    return () => {
      ignore = true
    }
  }, [currentCode])

  // Synchronized active code taking URL params into account
  const activeCode = searchParams.get('code') || currentCode

  // Derive current active shipment
  const currentShipment = useMemo(() => {
    if (!activeCode || !activeCode.trim()) return null
    return searchShipmentByCode(activeCode.trim(), shipments) || null
  }, [activeCode, shipments])

  // Derive historical events for active shipment
  const historyEvents = useMemo(() => {
    if (!currentShipment) return []
    return getTrackingHistory(
      currentShipment.trackingNumber || currentShipment.id,
      currentShipment
    )
  }, [currentShipment])

  // Derive search error message
  const searchError = useMemo(() => {
    if (!activeCode || !activeCode.trim()) {
      return 'Please provide a consignment tracking number.'
    }
    if (!currentShipment) {
      return `Consignment '${activeCode}' was not found in satellite registry.`
    }
    return null
  }, [activeCode, currentShipment])

  // Multi-tracking State
  const [selectedBatchCodes, setSelectedBatchCodes] = useState(() => {
    const list = getLocalShipments()
    return list.slice(0, 4).map((s) => (s.trackingNumber || s.id).toUpperCase())
  })

  // Status Update Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Single Search Trigger
  const handleSearch = (newCode) => {
    setActiveMode('single')
    const cleanCode = (newCode || '').trim().toUpperCase()
    if (!cleanCode) {
      toast.warn('Please enter a tracking number.')
      return
    }

    const match = searchShipmentByCode(cleanCode)
    if (!match) {
      toast.error(`Consignment '${cleanCode}' not found.`)
    }

    setCurrentCode(cleanCode)
    setSearchParams({ code: cleanCode }, { replace: true })
  }

  // Handle Parcel Status Update
  const handleStatusUpdate = async ({
    trackingNumber,
    newStatus,
    locationNote,
    eventDetails,
  }) => {
    try {
      setIsUpdatingStatus(true)
      await updateParcelStatus(
        trackingNumber,
        newStatus,
        locationNote,
        eventDetails
      )

      // Refresh shipments from storage (derived values re-compute automatically)
      const refreshed = getLocalShipments()
      setShipments(refreshed)

      toast.success(
        `Consignment ${trackingNumber} status updated to '${newStatus}'!`
      )
      setIsStatusModalOpen(false)
    } catch (err) {
      console.error('Status update failed:', err)
      toast.error(err.message || 'Failed to update status.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Focus single shipment from multi-tracker
  const handleFocusSingle = (code) => {
    handleSearch(code)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col select-none relative overflow-x-hidden font-sans">
      {/* Background Cyan Ambient Aura */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Unified Navigation Bar */}
      <Navbar />

      {/* Main Container (Edge-to-Edge Full Width) */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-6 relative z-10">
        {/* =========================================================
            PAGE HEADER
            ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Radar className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Live GPS Parcel Tracking & Telemetry Command
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time orbital waypoint downlinks, milestone progress, and multi-consignment radar
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================
            SEARCH & MODE SELECTOR
            ========================================================= */}
        <TrackingSearchBar
          trackingCode={currentCode}
          onSearch={handleSearch}
          activeMode={activeMode}
          onModeChange={setActiveMode}
          availableShipments={shipments}
        />

        {/* =========================================================
            VIEWPORT: SINGLE TRACKING vs MULTI TRACKING
            ========================================================= */}
        {activeMode === 'single' ? (
          /* SINGLE WAYBILL TRACKING MODE */
          searchError ? (
            /* Error State Card */
            <div className="w-full p-8 sm:p-12 rounded-2xl bg-rose-950/30 border border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.15)] flex flex-col items-center justify-center text-center">
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-400 mb-3 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Consignment Not Located</h3>
              <p className="text-xs sm:text-sm text-rose-300/80 mt-1 max-w-md">
                {searchError}
              </p>
              <div className="mt-5 flex items-center gap-2 flex-wrap justify-center">
                <span className="text-xs text-slate-400">Try quick tracking:</span>
                {shipments.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSearch(s.trackingNumber || s.id)}
                    className="px-3 py-1 rounded-lg bg-[#050b14] hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold cursor-pointer"
                  >
                    {s.trackingNumber || s.id}
                  </button>
                ))}
              </div>
            </div>
          ) : currentShipment ? (
            /* Active Tracking Dossier */
            <div className="flex flex-col gap-6">
              {/* Row 1: Shipment Summary & Actions */}
              <TrackingSummaryCard
                shipment={currentShipment}
                onOpenStatusModal={() => setIsStatusModalOpen(true)}
              />

              {/* Sequential Milestone Stepper */}
              <TrackingTimeline shipment={currentShipment} />

              {/* Row 4: Historical Event-by-Event Audit Log */}
              <TrackingHistoryTable events={historyEvents} />
            </div>
          ) : null
        ) : (
          /* MULTI-SHIPMENT BATCH MODE */
          <MultiShipmentTracker
            allShipments={shipments}
            selectedCodes={selectedBatchCodes}
            onSelectCodes={setSelectedBatchCodes}
            onFocusSingleShipment={handleFocusSingle}
          />
        )}
      </main>

      {/* Interactive Status & Checkpoint Update Modal */}
      {currentShipment && (
        <StatusUpdateModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          shipment={currentShipment}
          onUpdateStatus={handleStatusUpdate}
          isUpdating={isUpdatingStatus}
        />
      )}
    </div>
  )
}
