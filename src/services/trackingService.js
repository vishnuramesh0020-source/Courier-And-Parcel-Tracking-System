import { getLocalShipments, updateShipment } from './shipmentApi'
import { notifyStatusUpdated } from './notificationService'

export const TRACKING_EVENTS_KEY = 'global_connect_tracking_events_v1'

// Simulated GPS Hub Coordinates
const HUB_COORDINATES = {
  'New York': { lat: 40.6413, lng: -73.7781, code: 'JFK', altitude: 'Sea Level', timezone: 'EDT (UTC-4)' },
  'London': { lat: 51.4700, lng: -0.4543, code: 'LHR', altitude: '25m ASL', timezone: 'BST (UTC+1)' },
  'Frankfurt': { lat: 50.0379, lng: 8.5622, code: 'FRA', altitude: '111m ASL', timezone: 'CEST (UTC+2)' },
  'Dubai': { lat: 25.2532, lng: 55.3657, code: 'DXB', altitude: '62m ASL', timezone: 'GST (UTC+4)' },
  'Tokyo': { lat: 35.7720, lng: 140.3929, code: 'NRT', altitude: '43m ASL', timezone: 'JST (UTC+9)' },
  'San Francisco': { lat: 37.6213, lng: -122.3790, code: 'SFO', altitude: '4m ASL', timezone: 'PDT (UTC-7)' },
  'São Paulo': { lat: -23.4356, lng: -46.4731, code: 'GRU', altitude: '750m ASL', timezone: 'BRT (UTC-3)' },
  'Madrid': { lat: 40.4839, lng: -3.5680, code: 'MAD', altitude: '610m ASL', timezone: 'CEST (UTC+2)' },
  'Singapore': { lat: 1.3644, lng: 103.9915, code: 'SIN', altitude: '22m ASL', timezone: 'SGT (UTC+8)' },
  'Sydney': { lat: -33.9399, lng: 151.1753, code: 'SYD', altitude: '6m ASL', timezone: 'AEST (UTC+10)' },
  'Oslo': { lat: 60.1976, lng: 11.1004, code: 'OSL', altitude: '208m ASL', timezone: 'CEST (UTC+2)' },
  'Montreal': { lat: 45.4657, lng: -73.7455, code: 'YUL', altitude: '36m ASL', timezone: 'EDT (UTC-4)' },
}

/**
 * Extract an associated city key from address string
 */
export const extractCityFromAddress = (address = '') => {
  if (!address) return 'New York'
  for (const city of Object.keys(HUB_COORDINATES)) {
    if (address.toLowerCase().includes(city.toLowerCase())) {
      return city
    }
  }
  return 'New York'
}

/**
 * Generate standard milestones for shipment timeline
 */
export const generateMilestones = (shipment) => {
  if (!shipment) return []
  const progress = shipment.progress || (shipment.deliveryStatus === 'Delivered' ? 100 : 50)
  const status = shipment.deliveryStatus || 'In Transit'

  const originCity = extractCityFromAddress(shipment.pickupAddress)
  const destCity = extractCityFromAddress(shipment.deliveryAddress)

  return [
    {
      id: 'step-1',
      title: 'Consignment Created & Manifest Issued',
      description: 'Air waybill generated and electronic manifest synchronized with customs authority.',
      location: `${originCity} Cargo Terminal (Booking Desk)`,
      date: shipment.shippingDate || '2026-10-01',
      time: '08:30 AM',
      done: true,
      current: status === 'Pending Pickup',
      icon: 'FileText',
      badge: 'ORDER CONFIRMED',
    },
    {
      id: 'step-2',
      title: 'Origin Terminal Intake & Security Clearance',
      description: 'Physical parcel intake, volumetric gross weighing (14.5 kg), and x-ray screening cleared.',
      location: `${originCity} International Freight Station`,
      date: shipment.shippingDate || '2026-10-01',
      time: '12:15 PM',
      done: status !== 'Pending Pickup',
      current: status === 'Pending Pickup' && progress > 10,
      icon: 'ShieldCheck',
      badge: 'SECURITY CLEARED',
    },
    {
      id: 'step-3',
      title: 'Dispatched on Flight / Linehaul Transit Corridor',
      description: `Loaded onto ${shipment.carrier || 'Global Air Cargo'} flight corridor. En route to hub.`,
      location: shipment.currentLocation || `Transcontinental Air Corridor (${originCity} → ${destCity})`,
      date: shipment.shippingDate || '2026-10-02',
      time: '18:40 PM',
      done: progress >= 40 || status === 'Delivered' || status === 'Out for Delivery',
      current: status === 'In Transit' && progress >= 20 && progress < 85,
      icon: 'Plane',
      badge: 'IN FLIGHT',
    },
    {
      id: 'step-4',
      title: 'Inbound Gateway Terminal Arrival & Customs Assessment',
      description: 'Arrived at international destination port of entry. Import customs declaration verified.',
      location: `${destCity} International Cargo Gateway`,
      date: shipment.expectedDeliveryDate || '2026-10-04',
      time: '04:20 AM',
      done: progress >= 80 || status === 'Delivered' || status === 'Out for Delivery',
      current: status === 'Customs Clearance',
      icon: 'Building2',
      badge: 'PORT ARRIVAL',
    },
    {
      id: 'step-5',
      title: 'Sorted & Dispatched Out for Final Delivery',
      description: 'Assigned to localized electric delivery fleet. Real-time courier vehicle active.',
      location: `${destCity} Local Express Dispatch Hub`,
      date: shipment.expectedDeliveryDate || '2026-10-05',
      time: '08:50 AM',
      done: progress >= 95 || status === 'Delivered',
      current: status === 'Out for Delivery',
      icon: 'Truck',
      badge: 'OUT FOR DELIVERY',
    },
    {
      id: 'step-6',
      title: 'Consignment Delivered & Consignee Signed',
      description: `Package successfully delivered to ${shipment.receiverName}. Signed receipt archived.`,
      location: shipment.deliveryAddress || `${destCity} Consignee Reception`,
      date: shipment.expectedDeliveryDate || '2026-10-06',
      time: '14:20 PM',
      done: status === 'Delivered' || progress === 100,
      current: false,
      icon: 'CheckCircle2',
      badge: 'FINAL DELIVERY',
    },
  ]
}

/**
 * Read stored tracking events from localStorage
 */
export const getStoredTrackingEvents = () => {
  try {
    const raw = localStorage.getItem(TRACKING_EVENTS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (err) {
    console.error('Failed to read tracking events from localStorage:', err)
    return {}
  }
}

/**
 * Save tracking events to localStorage
 */
export const saveStoredTrackingEvents = (eventsMap) => {
  try {
    localStorage.setItem(TRACKING_EVENTS_KEY, JSON.stringify(eventsMap))
  } catch (err) {
    console.error('Failed to save tracking events to localStorage:', err)
  }
}

/**
 * Get tracking event history for a specific tracking number
 */
export const getTrackingHistory = (trackingNumber, shipment) => {
  const allEvents = getStoredTrackingEvents()
  const key = trackingNumber?.toUpperCase()

  if (allEvents[key] && allEvents[key].length > 0) {
    return allEvents[key]
  }

  // Derive initial realistic events from shipment
  const defaultEvents = [
    {
      id: `EVT-${Date.now()}-1`,
      timestamp: '2026-10-01 08:30:12 GMT',
      status: 'Manifest Registered',
      location: `${extractCityFromAddress(shipment?.pickupAddress)} Cargo Terminal`,
      details: 'Waybill generated and booked in global command system. Consignor order verified.',
      operator: 'Automated Booking System [API-01]',
      statusCode: 'MANIFEST_CONFIRMED',
    },
    {
      id: `EVT-${Date.now()}-2`,
      timestamp: '2026-10-01 12:15:40 GMT',
      status: 'Security Clearance Completed',
      location: `${extractCityFromAddress(shipment?.pickupAddress)} Screening Gate 3`,
      details: 'X-ray tomography and barcode verification passed. Weight calibrated at ' + (shipment?.parcelWeight || 12) + ' kg.',
      operator: 'Officer M. Jensen [ID #4829]',
      statusCode: 'SECURITY_PASSED',
    },
    {
      id: `EVT-${Date.now()}-3`,
      timestamp: '2026-10-02 18:40:05 GMT',
      status: 'Transcontinental Departure',
      location: `${shipment?.carrier || 'Global Air Cargo'} Flight Line`,
      details: 'Dispatched outbound on scheduled transcontinental corridor. Altitude cruising at FL380.',
      operator: 'Dispatch Controller K. Tanaka',
      statusCode: 'IN_TRANSIT',
    },
  ]

  if (shipment?.deliveryStatus === 'Out for Delivery' || shipment?.deliveryStatus === 'Delivered') {
    defaultEvents.push({
      id: `EVT-${Date.now()}-4`,
      timestamp: '2026-10-04 09:10:22 GMT',
      status: 'Out for Final Delivery',
      location: `${extractCityFromAddress(shipment?.deliveryAddress)} Local Hub`,
      details: 'Consignment loaded onto local delivery van #81. Driver route optimized.',
      operator: 'Courier Driver R. Alvarez',
      statusCode: 'OUT_FOR_DELIVERY',
    })
  }

  if (shipment?.deliveryStatus === 'Delivered') {
    defaultEvents.push({
      id: `EVT-${Date.now()}-5`,
      timestamp: '2026-10-05 14:22:18 GMT',
      status: 'Delivered and Signed',
      location: shipment?.deliveryAddress || 'Receiving Facility',
      details: 'Package signed and released to consignee reception desk.',
      operator: 'Signed by: Authorized Consignee',
      statusCode: 'DELIVERED',
    })
  }

  // Save back for future persistent queries
  allEvents[key] = defaultEvents
  saveStoredTrackingEvents(allEvents)
  return defaultEvents
}

/**
 * Add a new real-time status update / event to a tracked consignment
 */
export const updateParcelStatus = async (trackingNumber, newStatus, locationNote = '', eventDetails = '') => {
  const shipments = getLocalShipments()
  const key = trackingNumber?.toUpperCase()
  const found = shipments.find(
    (s) => s.trackingNumber?.toUpperCase() === key || s.id?.toUpperCase() === key
  )

  if (!found) {
    throw new Error(`Consignment with tracking code '${trackingNumber}' was not found.`)
  }

  // Determine new progress based on status
  let newProgress = found.progress || 50
  if (newStatus === 'Delivered') newProgress = 100
  else if (newStatus === 'Out for Delivery') newProgress = 92
  else if (newStatus === 'In Transit') newProgress = 65
  else if (newStatus === 'Customs Clearance') newProgress = 45
  else if (newStatus === 'Pending Pickup') newProgress = 15
  else if (newStatus === 'Cancelled') newProgress = 0

  const updatedShipment = await updateShipment(found.id || found.trackingNumber, {
    deliveryStatus: newStatus,
    progress: newProgress,
    currentLocation: locationNote || found.currentLocation,
  })

  // Append new tracking checkpoint event
  const allEvents = getStoredTrackingEvents()
  const existingEvents = allEvents[key] || []
  const newEvent = {
    id: `EVT-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    status: newStatus,
    location: locationNote || found.currentLocation || 'Cyber Command Checkpoint',
    details: eventDetails || `Status advanced to '${newStatus}' via Command Operations Terminal.`,
    operator: 'Cyber Command Operator',
    statusCode: newStatus.toUpperCase().replace(/\s+/g, '_'),
  }

  const updatedEvents = [newEvent, ...existingEvents]
  allEvents[key] = updatedEvents
  saveStoredTrackingEvents(allEvents)

  // Trigger Notification
  try {
    notifyStatusUpdated(found, newStatus, {
      location: locationNote || found.currentLocation,
      reason: eventDetails || '',
      previousStatus: found.deliveryStatus,
    })
  } catch (err) {
    console.error('Failed to dispatch tracking status notification:', err)
  }

  return {
    shipment: updatedShipment,
    events: updatedEvents,
    newEvent,
  }
}

/**
 * Search single shipment by tracking number, ID, or keywords
 */
export const searchShipmentByCode = (query, shipmentList) => {
  if (!query || !query.trim()) return null
  const q = query.trim().toUpperCase()
  const shipments = shipmentList || getLocalShipments()

  // Exact match on trackingNumber or id
  let match = shipments.find(
    (s) => s.trackingNumber?.toUpperCase() === q || s.id?.toUpperCase() === q
  )

  // Partial match
  if (!match) {
    match = shipments.find(
      (s) =>
        s.trackingNumber?.toUpperCase().includes(q) ||
        s.id?.toUpperCase().includes(q) ||
        s.senderName?.toUpperCase().includes(q) ||
        s.receiverName?.toUpperCase().includes(q)
    )
  }

  return match || null
}

/**
 * Batch multi-tracking lookup
 */
export const trackMultipleShipments = (trackingCodes = []) => {
  const shipments = getLocalShipments()
  const normalizedCodes = trackingCodes
    .map((c) => (typeof c === 'string' ? c.trim().toUpperCase() : ''))
    .filter(Boolean)

  if (normalizedCodes.length === 0) {
    // Return first 4 by default for rich initial preview
    return shipments.slice(0, 4)
  }

  const results = []
  for (const code of normalizedCodes) {
    const matched = shipments.find(
      (s) => s.trackingNumber?.toUpperCase() === code || s.id?.toUpperCase() === code
    )
    if (matched && !results.some((r) => r.id === matched.id)) {
      results.push(matched)
    }
  }

  return results
}
