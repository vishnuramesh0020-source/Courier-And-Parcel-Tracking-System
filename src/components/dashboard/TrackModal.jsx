import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Search, MapPin, Truck, CheckCircle2, Clock, ExternalLink } from 'lucide-react'

export default function TrackModal({
  isOpen,
  onClose,
  initialCode = '',
  shipments = [],
}) {
  const [trackingCode, setTrackingCode] = useState(initialCode || 'GC-94821-US')

  if (!isOpen) return null

  const matched = shipments.find(
    (s) => s.id.toLowerCase() === trackingCode.trim().toLowerCase()
  ) || {
    id: trackingCode.trim() || 'GC-94821-US',
    origin: 'New York (JFK Hub), USA',
    destination: 'London (Heathrow Hub), UK',
    status: 'In Transit',
    carrier: 'Global Air Cargo',
    eta: 'Tomorrow, 14:00 GMT',
    progress: 65,
  }

  const milestones = [
    {
      title: 'Consignment Intake & Security Clearance',
      location: matched.origin,
      time: 'Oct 04, 08:30 AM',
      done: true,
      current: false,
    },
    {
      title: 'Departed Transcontinental Air Hub',
      location: 'Regional International Freight Terminal',
      time: 'Oct 04, 19:45 PM',
      done: true,
      current: false,
    },
    {
      title: 'Active In-Flight Flight Corridor',
      location: 'Mid-Atlantic Freight Route',
      time: 'Oct 05, 03:15 AM',
      done: matched.progress >= 50,
      current: matched.progress >= 50 && matched.progress < 100,
    },
    {
      title: 'Terminal Inbound Verification',
      location: matched.destination,
      time: matched.eta,
      done: matched.progress === 100,
      current: false,
    },
    {
      title: 'Final Dispatch Delivery Signed',
      location: 'Consignee Receiving Facility',
      time: 'Pending inspection',
      done: matched.progress === 100,
      current: false,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0c1a2f]/90 backdrop-blur-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Live GPS Checkpoint Tracker
              </h3>
              <p className="text-xs text-slate-400">
                Real-time transcontinental waypoint inspection & SLA performance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative z-10">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Enter Consignment ID (e.g. GC-94821-US)..."
              className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-400 outline-none uppercase font-mono font-bold focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
            />
          </div>

          <div className="flex items-center gap-1.5 mt-2 flex-wrap text-xs">
            <span className="text-slate-400 text-[11px]">Quick select:</span>
            {shipments.slice(0, 4).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setTrackingCode(s.id)}
                className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-cyan-400 font-mono text-[11px] font-semibold hover:border-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Box */}
        <div className="mt-4 p-4 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col gap-3 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400">
                Consignment ID
              </span>
              <span className="font-mono font-bold text-white text-base block">
                {matched.id}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold uppercase text-slate-400">
                Status
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_10px_rgba(56,189,248,0.2)] uppercase block">
                {matched.status}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10 flex-wrap gap-2">
            <div>
              <span className="text-slate-400">Route: </span>
              <span className="text-white font-medium">
                {matched.origin} → {matched.destination}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Carrier: </span>
              <span className="text-white font-medium">{matched.carrier}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900/60 rounded-full h-2 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
              style={{ width: `${matched.progress || 50}%` }}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-5 space-y-3 relative z-10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Audited Transit Checkpoints & Reconciliation
          </h4>
          <div className="space-y-4 pl-2 border-l-2 border-white/15 ml-3">
            {milestones.map((ms, idx) => (
              <div key={idx} className="relative pl-6">
                <div
                  className={`absolute -left-[1.85rem] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                    ms.done
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                      : ms.current
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 animate-pulse shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                      : 'bg-slate-900/60 text-slate-500 border-slate-700'
                  }`}
                >
                  {ms.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : ms.current ? (
                    <Truck className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white">
                  {ms.title}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{ms.location}</span>
                  <span>•</span>
                  <span>{ms.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
          <Link
            to={`/tracking?code=${encodeURIComponent(matched.id)}`}
            onClick={onClose}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Open Dedicated Live GPS Radar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  )
}
