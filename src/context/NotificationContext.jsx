import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  getStoredNotifications,
  markNotificationAsRead as serviceMarkRead,
  markAllNotificationsAsRead as serviceMarkAllRead,
  deleteNotification as serviceDeleteNotif,
  clearAllNotifications as serviceClearAll,
  resetToDefaultNotifications as serviceResetDefaults,
  notifyShipmentCreated,
  notifyStatusUpdated,
  notifyDeliveryCompleted,
  notifyFailedDelivery,
  NOTIFICATION_TYPES,
} from '../services/notificationService'
import { getLocalShipments } from '../services/shipmentApi'
import { NotificationContext } from './notificationContextInstance'

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => getStoredNotifications())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Sync state with storage on mount and when storage events fire
  const reloadNotifications = useCallback(() => {
    setNotifications(getStoredNotifications())
  }, [])

  useEffect(() => {
    // Listen for custom notification added / updated events
    const handleAdded = (e) => {
      reloadNotifications()
      const newNotif = e.detail
      if (newNotif) {
        if (newNotif.type === NOTIFICATION_TYPES.FAILED_DELIVERY) {
          toast.error(`🚨 ${newNotif.title}: ${newNotif.trackingNumber || ''}`)
        } else if (newNotif.type === NOTIFICATION_TYPES.DELIVERY_COMPLETED) {
          toast.success(`✅ ${newNotif.title}: ${newNotif.trackingNumber || ''}`)
        } else if (newNotif.type === NOTIFICATION_TYPES.SHIPMENT_CREATED) {
          toast.info(`📦 ${newNotif.title}: ${newNotif.trackingNumber || ''}`)
        } else {
          toast.info(`🚚 ${newNotif.title}`)
        }
      }
    }

    const handleUpdated = () => {
      reloadNotifications()
    }

    window.addEventListener('global_connect_notification_added', handleAdded)
    window.addEventListener('global_connect_notifications_updated', handleUpdated)

    return () => {
      window.removeEventListener('global_connect_notification_added', handleAdded)
      window.removeEventListener('global_connect_notifications_updated', handleUpdated)
    }
  }, [reloadNotifications])

  // Computed unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length
  }, [notifications])

  // Actions
  const markAsRead = useCallback((id) => {
    const updated = serviceMarkRead(id)
    setNotifications(updated)
  }, [])

  const markAllAsRead = useCallback(() => {
    const updated = serviceMarkAllRead()
    setNotifications(updated)
    toast.success('All notifications marked as read.')
  }, [])

  const removeNotification = useCallback((id) => {
    const updated = serviceDeleteNotif(id)
    setNotifications(updated)
  }, [])

  const clearAll = useCallback(() => {
    const updated = serviceClearAll()
    setNotifications(updated)
    toast.info('Notification history cleared.')
  }, [])

  const resetDefaults = useCallback(() => {
    const updated = serviceResetDefaults()
    setNotifications(updated)
    toast.success('Notification history restored to defaults.')
  }, [])

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev)
  }, [])

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  // Interactive testing/simulation dispatchers
  const simulateNotification = useCallback((type) => {
    const sampleShipments = getLocalShipments()
    const sample = sampleShipments.length > 0 ? sampleShipments[Math.floor(Math.random() * sampleShipments.length)] : {
      id: 'GC-SIM-8890',
      trackingNumber: 'GC-SIM-8890',
      receiverName: 'Nexus Quantum Corp',
      senderName: 'Apex Precision Labs',
      deliveryAddress: 'Marina Bay Financial Tower 2, Singapore',
      currentLocation: 'Singapore Changi Air Freight Gate 4',
      deliveryStatus: 'In Transit',
      parcelType: 'High-Tech Hardware',
    }

    switch (type) {
      case NOTIFICATION_TYPES.SHIPMENT_CREATED: {
        const dummyShipment = {
          id: `GC-${Math.floor(100000 + Math.random() * 900000)}-AP`,
          trackingNumber: `GC-${Math.floor(100000 + Math.random() * 900000)}-AP`,
          senderName: 'Tokyo Robotics & Automation Co',
          receiverName: 'Pacific Silicon Labs LLC',
          deliveryAddress: '450 Mission Street, San Francisco, CA',
          parcelType: 'Semiconductor Sensors',
          deliveryStatus: 'Pending',
        }
        notifyShipmentCreated(dummyShipment)
        break
      }
      case NOTIFICATION_TYPES.STATUS_UPDATE: {
        notifyStatusUpdated(sample, 'In Transit', {
          previousStatus: 'Picked Up',
          location: sample.currentLocation || 'Trans-Eurasian Cargo Hub',
        })
        break
      }
      case NOTIFICATION_TYPES.DELIVERY_COMPLETED: {
        notifyDeliveryCompleted(sample, {
          location: sample.deliveryAddress || 'Consignee Headquarters',
        })
        break
      }
      case NOTIFICATION_TYPES.FAILED_DELIVERY: {
        notifyFailedDelivery(sample, {
          reason: 'Consignee premises access restricted / Security refusal',
          location: sample.currentLocation || 'Consignee Destination Gate',
        })
        break
      }
      default:
        break
    }
  }, [])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isDrawerOpen,
      setIsDrawerOpen,
      toggleDrawer,
      openDrawer,
      closeDrawer,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      resetDefaults,
      simulateNotification,
    }),
    [
      notifications,
      unreadCount,
      isDrawerOpen,
      toggleDrawer,
      openDrawer,
      closeDrawer,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      resetDefaults,
      simulateNotification,
    ]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
