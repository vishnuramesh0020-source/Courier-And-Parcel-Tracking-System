import { useNavigate } from 'react-router-dom'
import {
  PackagePlus,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Check,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  AlertOctagon,
} from 'lucide-react'
import { NOTIFICATION_TYPES } from '../../services/notificationService'

export default function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
  onCloseParent,
}) {
  const navigate = useNavigate()

  const {
    id,
    type,
    title,
    message,
    trackingNumber,
    timestamp,
    isRead,
    metadata = {},
  } = notification

  // Visual configuration based on type
  const getTypeConfig = () => {
    switch (type) {
      case NOTIFICATION_TYPES.FAILED_DELIVERY:
        return {
          icon: AlertTriangle,
          badgeLabel: 'Failed Delivery Alert',
          badgeClass:
            'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
          borderClass: isRead
            ? 'border-rose-900/40 hover:border-rose-600/60'
            : 'border-rose-500/60 bg-gradient-to-r from-rose-950/30 to-[#0a101d] shadow-[0_0_20px_rgba(244,63,94,0.15)]',
          iconColor: 'text-rose-400',
          iconBg: 'bg-rose-500/20 border-rose-500/40',
        }
      case NOTIFICATION_TYPES.DELIVERY_COMPLETED:
        return {
          icon: CheckCircle2,
          badgeLabel: 'Delivery Completed',
          badgeClass:
            'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
          borderClass: isRead
            ? 'border-emerald-900/30 hover:border-emerald-600/50'
            : 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/20 to-[#0a101d] shadow-[0_0_16px_rgba(16,185,129,0.1)]',
          iconColor: 'text-emerald-400',
          iconBg: 'bg-emerald-500/20 border-emerald-500/40',
        }
      case NOTIFICATION_TYPES.SHIPMENT_CREATED:
        return {
          icon: PackagePlus,
          badgeLabel: 'Shipment Created',
          badgeClass:
            'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
          borderClass: isRead
            ? 'border-cyan-900/30 hover:border-cyan-600/50'
            : 'border-cyan-500/50 bg-gradient-to-r from-cyan-950/20 to-[#0a101d] shadow-[0_0_16px_rgba(6,182,212,0.1)]',
          iconColor: 'text-cyan-400',
          iconBg: 'bg-cyan-500/20 border-cyan-500/40',
        }
      case NOTIFICATION_TYPES.STATUS_UPDATE:
      default:
        return {
          icon: Truck,
          badgeLabel: 'Delivery Status Update',
          badgeClass:
            'bg-blue-500/20 text-blue-300 border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.25)]',
          borderClass: isRead
            ? 'border-slate-800 hover:border-blue-600/50'
            : 'border-blue-500/50 bg-gradient-to-r from-blue-950/20 to-[#0a101d] shadow-[0_0_16px_rgba(59,130,246,0.1)]',
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/20 border-blue-500/40',
        }
    }
  }

  const config = getTypeConfig()
  const IconComponent = config.icon

  const handleTrackClick = (e) => {
    e.stopPropagation()
    if (onCloseParent) onCloseParent()
    if (trackingNumber) {
      navigate(`/tracking/${encodeURIComponent(trackingNumber)}`)
    } else {
      navigate('/tracking')
    }
  }

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all duration-200 bg-[#081220]/90 backdrop-blur-sm ${config.borderClass} ${
        !isRead ? 'ring-1 ring-cyan-500/20' : 'opacity-90 hover:opacity-100'
      }`}
    >
      {/* Unread indicator dot */}
      {!isRead && (
        <span className="absolute top-3.5 right-3.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
        </span>
      )}

      <div className="flex items-start gap-3.5">
        {/* Type Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${config.iconBg}`}
        >
          <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md border ${config.badgeClass}`}
            >
              {config.badgeLabel}
            </span>

            {trackingNumber && (
              <button
                type="button"
                onClick={handleTrackClick}
                className="text-[11px] font-mono font-bold text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 px-2 py-0.5 rounded border border-cyan-500/40 flex items-center gap-1 transition-colors cursor-pointer"
                title="Track consignment"
              >
                <span>{trackingNumber}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            )}

            <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{timestamp}</span>
            </span>
          </div>

          <h4 className="text-sm font-bold text-white leading-snug mb-1">
            {title}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
            {message}
          </p>

          {/* Metadata context (location, recipient, failure reason) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 mb-2">
            {metadata.location && (
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>{metadata.location}</span>
              </span>
            )}
            {metadata.recipient && (
              <span className="text-slate-400">
                Recipient: <strong className="text-white font-medium">{metadata.recipient}</strong>
              </span>
            )}
          </div>

          {/* Failed reason callout banner */}
          {type === NOTIFICATION_TYPES.FAILED_DELIVERY && metadata.reason && (
            <div className="mt-2 mb-3 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-start gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-200">
                <span className="font-semibold text-rose-300">Dispatch Interruption:</span>{' '}
                {metadata.reason}
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
            {trackingNumber && (
              <button
                type="button"
                onClick={handleTrackClick}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-200 flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Track Parcel</span>
              </button>
            )}

            {!isRead ? (
              <button
                type="button"
                onClick={() => onMarkRead(id)}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 transition-colors cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Mark Read</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 px-2 py-0.5">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Read</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => onDelete(id)}
              className="text-xs font-semibold text-slate-400 hover:text-rose-300 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-rose-950/30 transition-colors ml-auto cursor-pointer"
              title="Delete notification"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
