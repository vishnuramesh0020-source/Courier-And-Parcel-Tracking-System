import { AlertCircle } from 'lucide-react'
import { STATUS_CONFIG, normalizeStatus } from '../../constants/statusConfig'

/**
 * Standardized Cyber Command Color-Coded Status Badge
 * Supports all 7 official delivery statuses:
 * - Pending
 * - Picked Up
 * - In Transit
 * - Out for Delivery
 * - Delivered
 * - Cancelled
 * - Failed Delivery
 */

export default function StatusBadge({
  status,
  size = 'md',
  showDot = true,
  showIcon = true,
  className = '',
}) {
  const normalized = normalizeStatus(status)
  const config = STATUS_CONFIG[normalized] || {
    label: status || 'Unknown',
    icon: AlertCircle,
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    dotClass: 'bg-purple-400',
    description: 'Custom status',
  }

  const IconComponent = config.icon

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs sm:text-sm px-3.5 py-1.5 gap-2 font-bold',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }

  return (
    <span
      className={`inline-flex items-center font-bold tracking-wider rounded-full border transition-all select-none ${
        config.badgeClass
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={config.description}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`}
        />
      )}
      {showIcon && <IconComponent className={`${iconSizes[size] || iconSizes.md} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  )
}
