import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Loader2, KeyRound, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import GlobeIcon from '../common/GlobeIcon'

export default function ForgotPasswordForm({ onSwitchToLogin }) {
  const [step, setStep] = useState(1) // 1: Email Request, 2: New Password
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestedEmail, setRequestedEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { requestPasswordReset, resetPassword } = useAuth()

  // Step 1 Form: Request Email
  const {
    register: regEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    defaultValues: { email: '' },
  })

  // Step 2 Form: Code + New Password
  const {
    register: regReset,
    handleSubmit: handleResetSubmit,
    getValues: getResetValues,
    formState: { errors: resetErrors },
  } = useForm({
    defaultValues: {
      code: '123456',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Handle Step 1
  const onEmailSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      await requestPasswordReset(data.email)
      setRequestedEmail(data.email)
      setStep(2)
    } catch {
      // Error toast already displayed
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Step 2
  const onResetSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      await resetPassword(requestedEmail, data.newPassword)
      setTimeout(() => {
        onSwitchToLogin()
      }, 1000)
    } catch {
      // Error toast
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D Earth Globe with Cyan Aura */}
      <div className="relative mb-2 flex items-center justify-center">
        <div className="absolute w-16 h-16 rounded-full bg-[#38bdf8]/20 blur-lg pointer-events-none" />
        <GlobeIcon className="w-14 h-14 sm:w-16 sm:h-16" />
      </div>

      {/* Header */}
      <div className="text-center mb-5 select-none">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
          {step === 1 ? 'Password Recovery' : 'Reset Password'}
        </h1>
        <p className="text-xs sm:text-sm text-[#8ea5c6] mt-0.5">
          {step === 1
            ? 'Enter your registered email to receive access code'
            : `Set new secure password for ${requestedEmail}`}
        </p>
      </div>

      {step === 1 ? (
        /* STEP 1: Enter Email */
        <form
          onSubmit={handleEmailSubmit(onEmailSubmit)}
          className="w-full flex flex-col gap-3.5"
          noValidate
        >
          <div>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7990b0] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                placeholder="Registered Email"
                {...regEmail('email', {
                  required: 'Please enter your account email',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Enter a valid email address',
                  },
                })}
                className={`w-full h-12 pl-11 pr-4 rounded-2xl bg-[#0c203b]/80 border text-white placeholder-[#6f86a7] text-sm sm:text-base outline-none transition-all duration-200
                  ${
                    emailErrors.email
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-[#1f5492] hover:border-[#38bdf8]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 shadow-[0_0_15px_rgba(56,189,248,0.06)]'
                  }`}
              />
            </div>
            {emailErrors.email && (
              <p className="mt-1 text-xs text-red-400 pl-1">
                {emailErrors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 mt-1 rounded-2xl bg-gradient-to-r from-[#1d64ec] to-[#2563eb] hover:from-[#2563eb] hover:to-[#3b82f6] text-white font-semibold text-sm sm:text-base tracking-wide transition-all duration-200 shadow-[0_6px_22px_rgba(29,100,236,0.45)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Checking records...</span>
              </>
            ) : (
              'Send Recovery Code'
            )}
          </button>

          <div className="text-center pt-3 border-t border-[#1e3a63]/40">
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
      ) : (
        /* STEP 2: Enter Verification Code & New Password */
        <form
          onSubmit={handleResetSubmit(onResetSubmit)}
          className="w-full flex flex-col gap-3"
          noValidate
        >
          {/* Code Input */}
          <div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#7990b0] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="6-digit Code (e.g. 123456)"
                {...regReset('code', {
                  required: 'Enter verification code',
                  minLength: { value: 6, message: 'Code must be 6 digits' },
                })}
                className="w-full h-11 pl-11 pr-4 rounded-2xl bg-[#0c203b]/80 border border-[#1f5492] hover:border-[#38bdf8]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 text-white placeholder-[#6f86a7] text-sm outline-none"
              />
            </div>
            {resetErrors.code && (
              <p className="mt-1 text-xs text-red-400 pl-1">{resetErrors.code.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7990b0] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                {...regReset('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
                className={`w-full h-11 pl-11 pr-11 rounded-2xl bg-[#0c203b]/80 border text-white placeholder-[#6f86a7] text-sm outline-none transition-all duration-200
                  ${
                    resetErrors.newPassword
                      ? 'border-red-500'
                      : 'border-[#38bdf8]/60 hover:border-[#38bdf8] focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7990b0] hover:text-[#93c5fd] p-1 rounded focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {resetErrors.newPassword && (
              <p className="mt-1 text-xs text-red-400 pl-1">
                {resetErrors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7990b0] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                placeholder="Confirm New Password"
                {...regReset('confirmPassword', {
                  required: 'Please confirm password',
                  validate: (v) => v === getResetValues('newPassword') || 'Passwords do not match',
                })}
                className={`w-full h-11 pl-11 pr-4 rounded-2xl bg-[#0c203b]/80 border text-white placeholder-[#6f86a7] text-sm outline-none transition-all duration-200
                  ${
                    resetErrors.confirmPassword
                      ? 'border-red-500'
                      : 'border-[#1f5492] hover:border-[#38bdf8]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20'
                  }`}
              />
            </div>
            {resetErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400 pl-1">
                {resetErrors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 mt-1 rounded-2xl bg-gradient-to-r from-[#1d64ec] to-[#2563eb] hover:from-[#2563eb] hover:to-[#3b82f6] text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-[0_6px_22px_rgba(29,100,236,0.45)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Updating Password...</span>
              </>
            ) : (
              'Reset & Login'
            )}
          </button>

          <div className="text-center pt-2 border-t border-[#1e3a63]/40">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-[#8ea5c6] hover:text-[#38bdf8] transition-colors cursor-pointer"
            >
              Back to step 1
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
