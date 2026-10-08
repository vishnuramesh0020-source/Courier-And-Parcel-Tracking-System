export const NOTIFICATION_STORAGE_KEY = 'global_connect_notifications_v1'

export const NOTIFICATION_TYPES = {
  SHIPMENT_CREATED: 'SHIPMENT_CREATED',
  STATUS_UPDATE: 'STATUS_UPDATE',
  DELIVERY_COMPLETED: 'DELIVERY_COMPLETED',
  FAILED_DELIVERY: 'FAILED_DELIVERY',
  SYSTEM_ALERT: 'SYSTEM_ALERT',
}

export const NOTIFICATION_PRIORITIES = {
  CRITICAL: 'CRITICAL',
  SUCCESS: 'SUCCESS',
  UPDATE: 'UPDATE',
  INFO: 'INFO',
}

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-1',
    type: NOTIFICATION_TYPES.FAILED_DELIVERY,
    title: 'Failed Delivery Alert: Consignment Held',
    message: 'Delivery attempt failed for GC-610942-SA in Madrid. Reason: Consignee unavailable / Business premises closed.',
    trackingNumber: 'GC-610942-SA',
    priority: NOTIFICATION_PRIORITIES.CRITICAL,
    timestamp: '2026-10-08 09:45:12 UTC',
    isRead: false,
    metadata: {
      location: 'Madrid Barajas Dispatch Gate',
      recipient: 'Iberia Pharmaceutical Research',
      reason: 'Consignee unavailable / Business premises closed',
      currentStatus: 'Failed Delivery',
    },
  },
  {
    id: 'NOTIF-2',
    type: NOTIFICATION_TYPES.DELIVERY_COMPLETED,
    title: 'Delivery Completed Successfully',
    message: 'Consignment GC-721094-AP was delivered and signed by M. Vance in San Francisco, CA.',
    trackingNumber: 'GC-721094-AP',
    priority: NOTIFICATION_PRIORITIES.SUCCESS,
    timestamp: '2026-10-08 08:30:00 UTC',
    isRead: false,
    metadata: {
      location: 'San Francisco, CA',
      recipient: 'Pacific Silicon Labs LLC',
      signedBy: 'M. Vance',
      currentStatus: 'Delivered',
    },
  },
  {
    id: 'NOTIF-3',
    type: NOTIFICATION_TYPES.STATUS_UPDATE,
    title: 'Delivery Status Update: Out for Delivery',
    message: 'Shipment GC-839201-EU transitioned to Out for Delivery at Dubai Cargo Terminal 2.',
    trackingNumber: 'GC-839201-EU',
    priority: NOTIFICATION_PRIORITIES.UPDATE,
    timestamp: '2026-10-08 07:15:20 UTC',
    isRead: false,
    metadata: {
      newStatus: 'Out for Delivery',
      previousStatus: 'In Transit',
      location: 'Dubai Cargo Terminal 2',
      currentStatus: 'Out for Delivery',
    },
  },
  {
    id: 'NOTIF-4',
    type: NOTIFICATION_TYPES.SHIPMENT_CREATED,
    title: 'New Shipment Initialized',
    message: 'Consignment GC-948210-US registered by NovaTech Avionics Inc destined for Global Micro Systems Ltd.',
    trackingNumber: 'GC-948210-US',
    priority: NOTIFICATION_PRIORITIES.INFO,
    timestamp: '2026-10-07 14:20:00 UTC',
    isRead: true,
    metadata: {
      sender: 'NovaTech Avionics Inc',
      recipient: 'Global Micro Systems Ltd',
      origin: 'New York, NY, USA',
      destination: 'London, United Kingdom',
      currentStatus: 'In Transit',
    },
  },
  {
    id: 'NOTIF-5',
    type: NOTIFICATION_TYPES.STATUS_UPDATE,
    title: 'Delivery Status Update: In Transit',
    message: 'Consignment GC-552018-UK departed Heathrow Air Corridor en route to Sydney.',
    trackingNumber: 'GC-552018-UK',
    priority: NOTIFICATION_PRIORITIES.UPDATE,
    timestamp: '2026-10-07 11:05:00 UTC',
    isRead: true,
    metadata: {
      newStatus: 'In Transit',
      previousStatus: 'Picked Up',
      location: 'Heathrow Air Corridor (FL360)',
      currentStatus: 'In Transit',
    },
  },
]

/**
 * Read all notifications from localStorage
 */
export const getStoredNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS))
      return INITIAL_NOTIFICATIONS
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to parse notifications from localStorage:', err)
    return INITIAL_NOTIFICATIONS
  }
}

/**
 * Write notifications list to localStorage
 */
export const saveStoredNotifications = (notifications) => {
  try {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications))
    // Broadcast event for multi-tab or intra-app synchronization
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('global_connect_notifications_updated', {
          detail: { count: notifications.filter((n) => !n.isRead).length },
        })
      )
    }
  } catch (err) {
    console.error('Failed to write notifications to localStorage:', err)
  }
}

/**
 * Append new notification to top of list
 */
export const addNotification = ({
  type = NOTIFICATION_TYPES.STATUS_UPDATE,
  title,
  message,
  trackingNumber = '',
  priority = NOTIFICATION_PRIORITIES.INFO,
  metadata = {},
}) => {
  const current = getStoredNotifications()
  const newNotification = {
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    title: title || 'System Notification',
    message: message || '',
    trackingNumber,
    priority,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    isRead: false,
    metadata,
  }

  const updated = [newNotification, ...current]
  saveStoredNotifications(updated)

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('global_connect_notification_added', {
        detail: newNotification,
      })
    )
  }

  return newNotification
}

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = (id) => {
  const current = getStoredNotifications()
  const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n))
  saveStoredNotifications(updated)
  return updated
}

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = () => {
  const current = getStoredNotifications()
  const updated = current.map((n) => ({ ...n, isRead: true }))
  saveStoredNotifications(updated)
  return updated
}

/**
 * Delete a specific notification
 */
export const deleteNotification = (id) => {
  const current = getStoredNotifications()
  const updated = current.filter((n) => n.id !== id)
  saveStoredNotifications(updated)
  return updated
}

/**
 * Clear all notifications
 */
export const clearAllNotifications = () => {
  saveStoredNotifications([])
  return []
}

/**
 * Reset notifications to initial seed state
 */
export const resetToDefaultNotifications = () => {
  saveStoredNotifications(INITIAL_NOTIFICATIONS)
  return INITIAL_NOTIFICATIONS
}

/**
 * Get count of unread notifications
 */
export const getUnreadNotificationsCount = () => {
  const list = getStoredNotifications()
  return list.filter((n) => !n.isRead).length
}

/* ========================================================
   CONVENIENCE EVENT TRIGGER HELPERS
   ======================================================== */

/**
 * Trigger: Shipment Created Notification
 */
export const notifyShipmentCreated = (shipment) => {
  const trackingNumber = shipment.trackingNumber || shipment.id || 'N/A'
  const receiver = shipment.receiverName || 'Consignee'
  const destination = shipment.deliveryAddress || 'Destination'

  return addNotification({
    type: NOTIFICATION_TYPES.SHIPMENT_CREATED,
    title: 'Shipment Created Notification',
    message: `Consignment ${trackingNumber} registered for ${receiver} (${destination}).`,
    trackingNumber,
    priority: NOTIFICATION_PRIORITIES.INFO,
    metadata: {
      sender: shipment.senderName,
      recipient: receiver,
      destination,
      parcelType: shipment.parcelType,
      currentStatus: shipment.deliveryStatus || 'Pending',
    },
  })
}

/**
 * Trigger: Delivery Status Update Notification
 */
export const notifyStatusUpdated = (
  shipment,
  newStatus,
  { location = '', reason = '', previousStatus = '' } = {}
) => {
  const trackingNumber = shipment.trackingNumber || shipment.id || 'N/A'
  const locText = location ? ` at ${location}` : ''

  // If status is Delivered, route to completed notification
  if (newStatus === 'Delivered') {
    return notifyDeliveryCompleted(shipment, { location })
  }

  // If status is Failed Delivery, route to alert notification
  if (newStatus === 'Failed Delivery') {
    return notifyFailedDelivery(shipment, { reason, location })
  }

  return addNotification({
    type: NOTIFICATION_TYPES.STATUS_UPDATE,
    title: `Delivery Status Update: ${newStatus}`,
    message: `Consignment ${trackingNumber} updated from '${previousStatus || 'Previous'}' to '${newStatus}'${locText}.`,
    trackingNumber,
    priority: NOTIFICATION_PRIORITIES.UPDATE,
    metadata: {
      newStatus,
      previousStatus,
      location,
      reason,
      currentStatus: newStatus,
    },
  })
}

/**
 * Trigger: Delivery Completed Notification
 */
export const notifyDeliveryCompleted = (shipment, { location = '' } = {}) => {
  const trackingNumber = shipment.trackingNumber || shipment.id || 'N/A'
  const receiver = shipment.receiverName || 'Consignee'
  const locText = location || shipment.currentLocation || 'Destination Address'

  return addNotification({
    type: NOTIFICATION_TYPES.DELIVERY_COMPLETED,
    title: 'Delivery Completed Notification',
    message: `Consignment ${trackingNumber} has been successfully delivered to ${receiver} (${locText}).`,
    trackingNumber,
    priority: NOTIFICATION_PRIORITIES.SUCCESS,
    metadata: {
      recipient: receiver,
      location: locText,
      currentStatus: 'Delivered',
    },
  })
}

/**
 * Trigger: Failed Delivery Alert
 */
export const notifyFailedDelivery = (shipment, { reason = '', location = '' } = {}) => {
  const trackingNumber = shipment.trackingNumber || shipment.id || 'N/A'
  const reasonText = reason || shipment.statusReason || 'Consignee unavailable / Access restricted'
  const locText = location || shipment.currentLocation || 'Dispatch Corridor'

  return addNotification({
    type: NOTIFICATION_TYPES.FAILED_DELIVERY,
    title: 'Failed Delivery Alert',
    message: `Consignment ${trackingNumber} delivery attempt failed at ${locText}. Reason: ${reasonText}.`,
    trackingNumber,
    priority: NOTIFICATION_PRIORITIES.CRITICAL,
    metadata: {
      reason: reasonText,
      location: locText,
      recipient: shipment.receiverName,
      currentStatus: 'Failed Delivery',
    },
  })
}
