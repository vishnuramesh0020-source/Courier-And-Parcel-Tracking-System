import {
  getLocalShipments,
  updateShipment,
} from './shipmentApi'
import {
  getStoredTrackingEvents,
  saveStoredTrackingEvents,
} from './trackingService'

export const STATUS_STORAGE_KEY = 'global_connect_status_history_v1'

export const DELIVERY_STATUS_LIST = [
  'Pending',
  'Picked Up',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Failed Delivery',
]

export const STATUS_PROGRESS_MAP = {
  'Pending': 15,
  'Picked Up': 30,
  'In Transit': 65,
  'Out for Delivery': 90,
  'Delivered': 100,
  'Failed Delivery': 85,
  'Cancelled': 0,
}

export const FAILED_DELIVERY_REASONS = [
  'Consignee unavailable / Business premises closed',
  'Incorrect delivery address or security gate code missing',
  'Consignee premises access restricted / Security refusal',
  'Consignee requested delivery rescheduling',
  'Package damaged in transit, held for inspection',
  'Adverse weather conditions or transit blockage',
  'Consignee refused delivery / Disputed contents',
]

export const CANCELLATION_REASONS = [
  'Shipper requested consignment cancellation',
  'Prohibited contents flagged during security screening',
  'Commercial credit / Customs payment hold',
  'Duplicate air waybill booking',
  'Consignee cancelled order prior to dispatch',
]

/**
 * Read status history map from localStorage
 */
export const getStoredStatusHistory = () => {
  try {
    const raw = localStorage.getItem(STATUS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (err) {
    console.error('Failed to parse status history from localStorage:', err)
    return {}
  }
}

/**
 * Write status history map to localStorage
 */
export const saveStoredStatusHistory = (historyMap) => {
  try {
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(historyMap))
  } catch (err) {
    console.error('Failed to write status history to localStorage:', err)
  }
}

/**
 * Generate default seed history for a shipment if none exists yet
 */
const generateDefaultHistory = (shipment) => {
  const code = (shipment.trackingNumber || shipment.id).toUpperCase()
  const currentStatus = shipment.deliveryStatus || 'Pending'
  const baseDate = shipment.shippingDate || '2026-10-01'

  const events = []

  // Step 1: Pending (Creation)
  events.push({
    id: `HIST-${code}-1`,
    trackingNumber: code,
    fromStatus: 'Initialized',
    toStatus: 'Pending',
    timestamp: `${baseDate} 08:30:00 UTC`,
    location: shipment.pickupAddress || 'Shipper Origin Terminal',
    operator: 'Automated Booking Gateway',
    reason: '',
    notes: 'Air waybill generated and consignment registered in dispatch queue.',
  })

  // If beyond Pending:
  if (currentStatus !== 'Pending') {
    if (currentStatus === 'Cancelled') {
      events.push({
        id: `HIST-${code}-2`,
        trackingNumber: code,
        fromStatus: 'Pending',
        toStatus: 'Cancelled',
        timestamp: `${baseDate} 11:20:00 UTC`,
        location: 'Origin Processing Center',
        operator: 'Dispatcher S. Vance [ID #302]',
        reason: 'Shipper requested consignment cancellation',
        notes: 'Booking voided upon consignor formal instruction.',
      })
      return events
    }

    // Step 2: Picked Up
    events.push({
      id: `HIST-${code}-2`,
      trackingNumber: code,
      fromStatus: 'Pending',
      toStatus: 'Picked Up',
      timestamp: `${baseDate} 13:45:00 UTC`,
      location: shipment.pickupAddress || 'Origin Freight Station',
      operator: 'Courier Unit #14 (J. Morales)',
      reason: '',
      notes: 'Parcel collected from shipper, barcode verified, and placed into feeder vehicle.',
    })

    if (currentStatus !== 'Picked Up') {
      // Step 3: In Transit
      events.push({
        id: `HIST-${code}-3`,
        trackingNumber: code,
        fromStatus: 'Picked Up',
        toStatus: 'In Transit',
        timestamp: `${baseDate} 19:10:00 UTC`,
        location: shipment.currentLocation || 'Transcontinental Air Freight Corridor',
        operator: 'Cargo Hub Flight Operations',
        reason: '',
        notes: 'Loaded on scheduled freight flight corridor. High-altitude telemetry active.',
      })

      if (currentStatus === 'Out for Delivery' || currentStatus === 'Delivered' || currentStatus === 'Failed Delivery') {
        // Step 4: Out for Delivery
        const expDate = shipment.expectedDeliveryDate || '2026-10-05'
        events.push({
          id: `HIST-${code}-4`,
          trackingNumber: code,
          fromStatus: 'In Transit',
          toStatus: 'Out for Delivery',
          timestamp: `${expDate} 08:15:00 UTC`,
          location: shipment.deliveryAddress || 'Destination Metro Dispatch Hub',
          operator: 'Local Van Route #09 (T. Alvarez)',
          reason: '',
          notes: 'Sorted to electric final-mile courier vehicle for delivery to consignee.',
        })

        if (currentStatus === 'Delivered') {
          events.push({
            id: `HIST-${code}-5`,
            trackingNumber: code,
            fromStatus: 'Out for Delivery',
            toStatus: 'Delivered',
            timestamp: `${expDate} 14:32:00 UTC`,
            location: shipment.deliveryAddress || 'Consignee Reception',
            operator: 'Courier Delivery Terminal',
            reason: '',
            notes: `Successfully delivered to ${shipment.receiverName}. Digital signature confirmed.`,
          })
        } else if (currentStatus === 'Failed Delivery') {
          events.push({
            id: `HIST-${code}-5`,
            trackingNumber: code,
            fromStatus: 'Out for Delivery',
            toStatus: 'Failed Delivery',
            timestamp: `${expDate} 16:45:00 UTC`,
            location: shipment.deliveryAddress || 'Consignee Address Gate',
            operator: 'Courier Delivery Terminal',
            reason: 'Consignee unavailable / Business premises closed',
            notes: 'Door attempt made. Secure card notification left. Rescheduling for next business window.',
          })
        }
      }
    }
  }

  // Return in reverse chronological order (newest first)
  return events.reverse()
}

/**
 * Get status history for a specific tracking number
 */
export const getStatusHistory = (trackingNumber, fallbackShipment) => {
  if (!trackingNumber) return []
  const key = trackingNumber.toUpperCase()
  const historyMap = getStoredStatusHistory()

  if (historyMap[key] && historyMap[key].length > 0) {
    return historyMap[key]
  }

  // Generate and cache default history
  const shipment =
    fallbackShipment ||
    getLocalShipments().find(
      (s) =>
        s.trackingNumber?.toUpperCase() === key || s.id?.toUpperCase() === key
    )

  if (!shipment) return []

  const generated = generateDefaultHistory(shipment)
  historyMap[key] = generated
  saveStoredStatusHistory(historyMap)
  return generated
}

/**
 * Update delivery status for a single shipment with full audit record
 */
export const updateDeliveryStatus = async (
  trackingNumber,
  newStatus,
  {
    location = '',
    reason = '',
    notes = '',
    operator = 'Cyber Command Dispatcher',
  } = {}
) => {
  const key = trackingNumber.toUpperCase()
  const shipments = getLocalShipments()
  const target = shipments.find(
    (s) =>
      s.trackingNumber?.toUpperCase() === key || s.id?.toUpperCase() === key
  )

  if (!target) {
    throw new Error(`Consignment '${trackingNumber}' not found.`)
  }

  const previousStatus = target.deliveryStatus || 'Pending'
  const newProgress = STATUS_PROGRESS_MAP[newStatus] ?? target.progress ?? 50
  const finalLocation = location || target.currentLocation || 'Command Hub Facility'

  // 1. Update Shipment record
  const updatedShipment = await updateShipment(target.id || target.trackingNumber, {
    deliveryStatus: newStatus,
    progress: newProgress,
    currentLocation: finalLocation,
    statusReason: reason || undefined,
  })

  // 2. Append to Status History
  const historyMap = getStoredStatusHistory()
  const existingHistory = historyMap[key] || getStatusHistory(key, target)

  const newHistoryEntry = {
    id: `HIST-${Date.now()}`,
    trackingNumber: key,
    fromStatus: previousStatus,
    toStatus: newStatus,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    location: finalLocation,
    operator: operator || 'Cyber Command Dispatcher',
    reason: reason || '',
    notes:
      notes ||
      `Status transitioned from '${previousStatus}' to '${newStatus}' via Command Terminal.`,
  }

  const updatedHistory = [newHistoryEntry, ...existingHistory]
  historyMap[key] = updatedHistory
  saveStoredStatusHistory(historyMap)

  // 3. Keep Tracking Events in sync
  const trackingEventsMap = getStoredTrackingEvents()
  const existingTracking = trackingEventsMap[key] || []
  const newTrackingEvent = {
    id: `EVT-${Date.now()}`,
    timestamp: newHistoryEntry.timestamp,
    status: newStatus,
    location: finalLocation,
    details:
      (reason ? `[${reason}] ` : '') +
      (notes || `Delivery status changed to '${newStatus}'.`),
    operator: operator || 'Cyber Command Dispatcher',
    statusCode: newStatus.toUpperCase().replace(/\s+/g, '_'),
  }
  trackingEventsMap[key] = [newTrackingEvent, ...existingTracking]
  saveStoredTrackingEvents(trackingEventsMap)

  return {
    shipment: updatedShipment,
    history: updatedHistory,
    newEntry: newHistoryEntry,
  }
}

/**
 * Batch update delivery status across multiple tracking numbers
 */
export const batchUpdateDeliveryStatus = async (
  trackingNumbers = [],
  newStatus,
  options = {}
) => {
  const results = []
  for (const code of trackingNumbers) {
    try {
      const res = await updateDeliveryStatus(code, newStatus, options)
      results.push(res)
    } catch (err) {
      console.warn(`Failed to update status for ${code}:`, err)
    }
  }
  return results
}

/**
 * Get all status history records across all consignments (flattened & chronological)
 */
export const getAllStatusHistory = (shipmentList) => {
  const historyMap = getStoredStatusHistory()
  const shipments = shipmentList || getLocalShipments()

  // Make sure every shipment has generated history
  for (const s of shipments) {
    const key = (s.trackingNumber || s.id).toUpperCase()
    if (!historyMap[key]) {
      historyMap[key] = generateDefaultHistory(s)
    }
  }
  saveStoredStatusHistory(historyMap)

  const allEntries = []
  Object.values(historyMap).forEach((entries) => {
    if (Array.isArray(entries)) {
      allEntries.push(...entries)
    }
  })

  // Sort descending by timestamp / id
  return allEntries.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
}
