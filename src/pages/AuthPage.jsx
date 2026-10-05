import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AuthCardLayout from '../components/auth/AuthCardLayout'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm'

export default function AuthPage({ initialMode = 'login' }) {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Derive mode directly from URL without state cascading effects
  const mode =
    location.pathname === '/register'
      ? 'register'
      : location.pathname === '/forgot-password'
      ? 'forgot'
      : initialMode

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const origin = location.state?.from?.pathname || '/dashboard'
      navigate(origin, { replace: true })
    }
  }, [isAuthenticated, loading, navigate, location])

  const handleSwitchToLogin = () => {
    navigate('/login')
  }

  const handleSwitchToRegister = () => {
    navigate('/register')
  }

  const handleSwitchToForgot = () => {
    navigate('/forgot-password')
  }

  return (
    <AuthCardLayout>
      {mode === 'login' && (
        <LoginForm
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToForgot={handleSwitchToForgot}
        />
      )}

      {mode === 'register' && (
        <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
      )}

      {mode === 'forgot' && (
        <ForgotPasswordForm onSwitchToLogin={handleSwitchToLogin} />
      )}
    </AuthCardLayout>
  )
}
