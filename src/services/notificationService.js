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

export const INITIAL_NOTIFICATIONS = []

/**
 * Dynamically generate audit notifications from live API shipments
 */
export const generateNotificationsFromShipments = (shipments = []) => {
  const generated = []

  if (Array.isArray(shipments)) {
    shipments.forEach((s, idx) => {
      if (s.deliveryStatus === 'Failed Delivery') {
        generated.push({
          id: `notif-fail-${s.id || idx}`,
          type: NOTIFICATION_TYPES.FAILED_DELIVERY,
          title: 'Failed Delivery Alert: Consignment Held',
          message: `Delivery attempt failed for ${s.trackingNumber || s.id}. Consignee location exception reported.`,
          trackingNumber: s.trackingNumber || s.id,
          priority: NOTIFICATION_PRIORITIES.CRITICAL,
          timestamp: s.shippingDate ? `${s.shippingDate} 09:45:12 UTC` : new Date().toISOString(),
          isRead: false,
          metadata: {
            location: s.currentLocation || 'Dispatch Terminal',
            recipient: s.receiverName,
            reason: s.notes || 'Consignee unavailable / Premises closed',
            currentStatus: 'Failed Delivery',
          },
        })
      } else if (s.deliveryStatus === 'Delivered') {
        generated.push({
          id: `notif-del-${s.id || idx}`,
          type: NOTIFICATION_TYPES.DELIVERY_COMPLETED,
          title: 'Delivery Completed Successfully',
          message: `Consignment ${s.trackingNumber || s.id} was delivered and signed by consignee.`,
          trackingNumber: s.trackingNumber || s.id,
          priority: NOTIFICATION_PRIORITIES.SUCCESS,
          timestamp: s.shippingDate ? `${s.shippingDate} 08:30:00 UTC` : new Date().toISOString(),
          isRead: false,
          metadata: {
            location: s.deliveryAddress,
            recipient: s.receiverName,
            currentStatus: 'Delivered',
          },
        })
      } else if (s.deliveryStatus === 'Out for Delivery' || s.deliveryStatus === 'In Transit') {
        generated.push({
          id: `notif-stat-${s.id || idx}`,
          type: NOTIFICATION_TYPES.STATUS_UPDATE,
          title: `Delivery Status Update: ${s.deliveryStatus}`,
          message: `Shipment ${s.trackingNumber || s.id} is actively ${s.deliveryStatus} via ${s.carrier || 'Global Express'}.`,
          trackingNumber: s.trackingNumber || s.id,
          priority: NOTIFICATION_PRIORITIES.UPDATE,
          timestamp: s.shippingDate ? `${s.shippingDate} 11:05:00 UTC` : new Date().toISOString(),
          isRead: true,
          metadata: {
            newStatus: s.deliveryStatus,
            location: s.currentLocation,
            currentStatus: s.deliveryStatus,
          },
        })
      }
    })
  }

  return generated
}

/**
 * Read all notifications from localStorage or generate from live API records
 */
export const getStoredNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEY)
    if (!raw) {
      let shipments = []
      try {
        const rawShipments = localStorage.getItem('global_connect_shipments_v3')
        if (rawShipments) shipments = JSON.parse(rawShipments)
      } catch {
        // empty
      }
      const initial = generateNotificationsFromShipments(shipments)
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to parse notifications from localStorage:', err)
    return []
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
  let shipments = []
  try {
    const rawShipments = localStorage.getItem('global_connect_shipments_v3')
    if (rawShipments) shipments = JSON.parse(rawShipments)
  } catch {
    // empty
  }
  const fresh = generateNotificationsFromShipments(shipments)
  saveStoredNotifications(fresh)
  return fresh
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
