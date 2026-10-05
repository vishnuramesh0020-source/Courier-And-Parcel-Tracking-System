import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Loader2, ArrowLeft, User, Mail, Lock, Phone } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import GlobeIcon from '../common/GlobeIcon'

export default function RegisterForm({ onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register: registerUser } = useAuth()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: 'Courier Client',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password,
      })
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D Earth Globe with Cyan Aura */}
      <div className="relative mb-1 flex items-center justify-center">
        <div className="absolute w-16 h-16 rounded-full bg-[#38bdf8]/20 blur-lg pointer-events-none" />
        <GlobeIcon className="w-13 h-13 sm:w-15 sm:h-15" />
      </div>

      {/* Header */}
      <div className="text-center mb-4 select-none">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
          Create Account
        </h1>
        <p className="text-xs text-[#8ea5c6] mt-0.5">
          Join the Global Connect logistics network
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2.5"
        noValidate
      >
        {/* Full Name */}
        <div>
          <div className="relative">
            <User className="w-4 h-4 text-[#7990b0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Full Name"
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 chars' },
              })}
              className={`w-full h-11 pl-10 pr-3.5 rounded-2xl bg-[#0c203b]/80 border text-white placeholder-[#6f86a7] text-xs sm:text-sm outline-none transition-all duration-200
                ${
                  errors.fullName
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-[#1f5492] hover:border-[#38bdf8]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 shadow-[0_0_12px_rgba(56,189,248,0.06)]'
                }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-0.5 text-[11px] text-red-400 pl-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#7990b0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              placeholder="Work / Personal Email"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Enter a valid email address',
                },
              })}
              className={`w-full h-11 pl-10 pr-3.5 rounded-2xl bg-[#0c203b]/80 border text-white placeholder-[#6f86a7] text-xs sm:text-sm outline-none transition-all duration-200
                ${
                  errors.email
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-[#1f5492] hover:border-[#38bdf8]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 shadow-[0_0_12px_rgba(56,189,248,0.06)]'
                }`}
            />
          </div>
          {errors.email && (
            <p className="mt-0.5 text-[11px] text-red-400 pl-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone & Role Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-[#7990b0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              placeholder="Phone"
              {...register('phone')}
              className="w-full h-11 pl-8 pr-2.5 rounded-2xl bg-[#0c203b]/80 border border-[#1f5492] hover:border-[#38bdf8]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 text-white placeholder-[#6f86a7] text-xs outline-none"
            />
          </div>
          <div>
            <select
              {...register('role')}
              className="w-full h-11 px-3 rounded-2xl bg-[#0c203b] border border-[#1f5492] hover:border-[#38bdf8]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 text-white text-xs outline-none cursor-pointer"
            >
              <option value="Courier Client" className="bg-[#0b172a] text-white">
                Client
              </option>
              <option value="Courier Agent" className="bg-[#0b172a] text-white">
                Courier Agent
              </option>
              <option value="Fleet Manager" className="bg-[#0b172a] text-white">
                Fleet Manager
              </option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#7990b0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Min 6 characters',
                },
              })}
              className={`w-full h-11 pl-10 pr-9 rounded-2xl bg-[#0c203b]/80 border text-white placeholder-[#6f86a7] text-xs sm:text-sm outline-none transition-all duration-200
                ${
                  errors.password
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-[#1f5492] hover:border-[#38bdf8]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 shadow-[0_0_12px_rgba(56,189,248,0.06)]'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7990b0] hover:text-[#93c5fd] p-1 rounded focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-0.5 text-[11px] text-red-400 pl-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#7990b0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: (value) =>
                  value === getValues('password') || 'Passwords do not match',
              })}
              className={`w-full h-11 pl-10 pr-9 rounded-2xl bg-[#0c203b]/80 border text-white placeholder-[#6f86a7] text-xs sm:text-sm outline-none transition-all duration-200
                ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-[#1f5492] hover:border-[#38bdf8]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 shadow-[0_0_12px_rgba(56,189,248,0.06)]'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7990b0] hover:text-[#93c5fd] p-1 rounded focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-0.5 text-[11px] text-red-400 pl-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 mt-1 rounded-2xl bg-gradient-to-r from-[#1d64ec] to-[#2563eb] hover:from-[#2563eb] hover:to-[#3b82f6] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-[0_6px_22px_rgba(29,100,236,0.45)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Registering...</span>
            </>
          ) : (
            'Complete Registration'
          )}
        </button>

        {/* Back to Login Link */}
        <div className="text-center pt-2 border-t border-[#1e3a63]/40">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="inline-flex items-center gap-1.5 text-xs text-[#8ea5c6] hover:text-[#38bdf8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Portal Login
          </button>
        </div>
      </form>
    </div>
  )
}
