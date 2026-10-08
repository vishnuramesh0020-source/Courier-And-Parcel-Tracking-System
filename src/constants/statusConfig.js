import {
  Clock,
  PackageCheck,
  Navigation,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react'

export const STATUS_CONFIG = {
  'Pending': {
    label: 'Pending',
    icon: Clock,
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    dotClass: 'bg-amber-400',
    description: 'Awaiting courier pickup & terminal intake',
  },
  'Picked Up': {
    label: 'Picked Up',
    icon: PackageCheck,
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.25)]',
    dotClass: 'bg-blue-400',
    description: 'Collected by courier from shipper facility',
  },
  'In Transit': {
    label: 'In Transit',
    icon: Navigation,
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    dotClass: 'bg-cyan-400',
    description: 'En route via transcontinental freight corridor',
  },
  'Out for Delivery': {
    label: 'Out for Delivery',
    icon: Truck,
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.25)]',
    dotClass: 'bg-sky-400',
    description: 'Loaded on final-mile courier vehicle',
  },
  'Delivered': {
    label: 'Delivered',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    dotClass: 'bg-emerald-400',
    description: 'Successfully delivered and signed by consignee',
  },
  'Cancelled': {
    label: 'Cancelled',
    icon: XCircle,
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-[0_0_12px_rgba(244,63,94,0.25)]',
    dotClass: 'bg-rose-400',
    description: 'Consignment booking cancelled / voided',
  },
  'Failed Delivery': {
    label: 'Failed Delivery',
    icon: AlertTriangle,
    badgeClass: 'bg-red-500/25 text-red-300 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.35)]',
    dotClass: 'bg-red-400 animate-pulse',
    description: 'Delivery attempt unsuccessful, re-attempt required',
  },
}

export const normalizeStatus = (status) => {
  if (!status) return 'Pending'
  const trimmed = status.trim()
  if (trimmed === 'Pending Pickup') return 'Pending'
  if (trimmed === 'Customs Clearance') return 'In Transit'
  return trimmed
}
