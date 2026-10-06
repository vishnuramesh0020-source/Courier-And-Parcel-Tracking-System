import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ShipmentsPage from './pages/ShipmentsPage'
import ShipmentDetailsPage from './pages/ShipmentDetailsPage'
import CustomersPage from './pages/CustomersPage'
import CustomerProfilePage from './pages/CustomerProfilePage'
import ProtectedRoute from './components/layout/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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

          {/* Fallback & Root Redirection */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
