import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ShipmentsPage from './pages/ShipmentsPage'
import ShipmentDetailsPage from './pages/ShipmentDetailsPage'
import CustomersPage from './pages/CustomersPage'
import CustomerProfilePage from './pages/CustomerProfilePage'
import TrackingPage from './pages/TrackingPage'
import DeliveryStatusPage from './pages/DeliveryStatusPage'
import NotificationsPage from './pages/NotificationsPage'
import ProtectedRoute from './components/layout/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          {/* Global Toast Container styled to match dark UI */}
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />
          <Route path="/forgot-password" element={<AuthPage initialMode="forgot" />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipments"
            element={
              <ProtectedRoute>
                <ShipmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipments/:id"
            element={
              <ProtectedRoute>
                <ShipmentDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking"
            element={
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking/:id"
            element={
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery-status"
            element={
              <ProtectedRoute>
                <DeliveryStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/status"
            element={<Navigate to="/delivery-status" replace />}
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback & Root Redirection */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
