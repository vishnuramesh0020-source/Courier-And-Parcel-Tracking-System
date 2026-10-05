import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import GlobeIcon from '../common/GlobeIcon'
import { STORAGE_KEYS } from '../../utils/storage'

export default function LoginForm({ onSwitchToRegister, onSwitchToForgot }) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  })

  // Pre-fill remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem(STORAGE_KEYS.SAVED_CREDENTIALS)
    if (savedEmail) {
      setValue('email', savedEmail)
    }
  }, [setValue])

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      await login(data.email, data.password, data.rememberMe)
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick demo credentials helper
  const handleQuickDemo = (demoEmail, demoPassword) => {
    setValue('email', demoEmail)
    setValue('password', demoPassword)
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D Orbital Earth Globe with Glowing Aura */}
      <div className="relative mb-2 flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full bg-cyan-400/20 blur-xl pointer-events-none" />
        <GlobeIcon className="w-20 h-20 sm:w-24 sm:h-24" />
      </div>

      {/* Brand Heading - Matching Screenshot Typography */}
      <div className="text-center mb-6 select-none">
        <h1 className="text-2xl sm:text-[30px] font-bold tracking-tight text-white leading-tight">
          Global Connect
        </h1>
        <h2 className="text-2xl sm:text-[30px] font-bold tracking-tight text-white leading-tight">
          Couriers
        </h2>
      </div>

      {/* Form Fields */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3.5"
        noValidate
      >
        {/* Email Input with Mail Icon - Rounded Pill */}
        <div>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Enter a valid email address',
                },
              })}
              className={`w-full h-12.5 pl-12 pr-5 rounded-full bg-[#0a1e38]/85 border text-white placeholder-slate-400 text-sm sm:text-base transition-all duration-200 outline-none
                ${
                  errors.email
                    ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                    : 'border-[#225796] hover:border-[#38bdf8]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 shadow-[0_0_15px_rgba(56,189,248,0.08)]'
                }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400 pl-3">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input with Lock Icon, Glowing Cyan Border & Show/Hide Toggle */}
        <div>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className={`w-full h-12.5 pl-12 pr-12 rounded-full bg-[#0a1e38]/85 border-2 text-white placeholder-slate-400 text-sm sm:text-base transition-all duration-200 outline-none
                ${
                  errors.password
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-[#38bdf8] hover:border-[#7dd3fc] focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/35 shadow-[0_0_20px_rgba(56,189,248,0.35)]'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-300 p-1 rounded-full focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4.5 h-4.5" />
              ) : (
                <Eye className="w-4.5 h-4.5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400 pl-3">{errors.password.message}</p>
          )}
        </div>

        {/* Access Portal Submit Button - Solid Vibrant Blue Pill */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12.5 mt-1 rounded-full bg-gradient-to-r from-[#175ee0] to-[#2563eb] hover:from-[#1d68ed] hover:to-[#3b82f6] active:scale-[0.99] text-white font-bold text-base tracking-wide transition-all duration-200 shadow-[0_8px_25px_rgba(24,96,213,0.5)] hover:shadow-[0_10px_32px_rgba(37,99,235,0.65)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            'Access Portal'
          )}
        </button>

        {/* Tagline - Exact Match */}
        <p className="text-center text-slate-300/80 text-xs sm:text-sm tracking-normal mt-1.5 select-none font-normal">
          Connect to 200+ countries
        </p>

        {/* Navigation Links for Register & Forgot Password */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1e3a63]/40 text-xs text-[#8ea5c6]">
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="hover:text-[#38bdf8] transition-colors focus:outline-none cursor-pointer"
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[#38bdf8] hover:text-[#7dd3fc] font-medium transition-colors focus:outline-none cursor-pointer"
          >
            Create Account
          </button>
        </div>

        {/* Discreet Quick Demo Pill Links */}
        <div className="pt-1.5 text-[11px] text-[#64748b] text-center">
          <span className="text-[#7990b0] mr-1.5">Quick Demo:</span>
          <button
            type="button"
            onClick={() => handleQuickDemo('admin@globalconnect.com', 'Password123!')}
            className="px-2 py-0.5 rounded-md bg-[#10233e] hover:bg-[#1a3860] text-[#93c5fd] border border-[#1b3b65] mr-1.5 transition-all cursor-pointer"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('agent@globalconnect.com', 'Password123!')}
            className="px-2 py-0.5 rounded-md bg-[#10233e] hover:bg-[#1a3860] text-[#93c5fd] border border-[#1b3b65] mr-1.5 transition-all cursor-pointer"
          >
            Agent
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('client@globalconnect.com', 'Password123!')}
            className="px-2 py-0.5 rounded-md bg-[#10233e] hover:bg-[#1a3860] text-[#93c5fd] border border-[#1b3b65] transition-all cursor-pointer"
          >
            Client
          </button>
        </div>
      </form>
    </div>
  )
}
