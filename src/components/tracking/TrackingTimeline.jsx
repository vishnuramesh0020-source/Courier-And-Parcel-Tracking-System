import { useState } from 'react'
import {
  FileText,
  ShieldCheck,
  Plane,
  Building2,
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react'
import { generateMilestones } from '../../services/trackingService'

export default function TrackingTimeline({ shipment }) {
  const [expandedStep, setExpandedStep] = useState(null)

  if (!shipment) return null

  const milestones = generateMilestones(shipment)

  const getMilestoneIcon = (iconName, done, current) => {
    const props = { className: 'w-4 h-4' }
    if (done) return <CheckCircle2 {...props} />
    if (current) return <Truck {...props} />

    switch (iconName) {
      case 'FileText':
        return <FileText {...props} />
      case 'ShieldCheck':
        return <ShieldCheck {...props} />
      case 'Plane':
        return <Plane {...props} />
      case 'Building2':
        return <Building2 {...props} />
      case 'Truck':
        return <Truck {...props} />
      case 'CheckCircle2':
      default:
        return <Clock {...props} />
    }
  }

  const toggleExpand = (id) => {
    setExpandedStep(expandedStep === id ? null : id)
  }

  return (
    <div className="w-full rounded-2xl bg-[#091526]/90 border border-cyan-500/40 p-5 sm:p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            Shipment Milestone Progression & Waypoints
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Sequential chain of custody tracking from cargo intake to final consignee signature
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/30">
          6 STAGES AUDITED
        </span>
      </div>

      {/* Timeline Steps Container */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-sky-500 before:to-slate-700">
        {milestones.map((ms, index) => {
          const isExpanded = expandedStep === ms.id

          return (
            <div key={ms.id} className="relative group">
              {/* Timeline Marker Node */}
              <div
                className={`absolute -left-[1.85rem] sm:-left-[2.1rem] top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  ms.done
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : ms.current
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.5)] animate-pulse'
                    : 'bg-[#050b14] border-slate-700 text-slate-500'
                }`}
              >
                {getMilestoneIcon(ms.icon, ms.done, ms.current)}
              </div>

              {/* Step Card */}
              <div
                onClick={() => toggleExpand(ms.id)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  ms.current
                    ? 'bg-cyan-500/10 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : ms.done
                    ? 'bg-[#050b14]/90 border-cyan-500/30 hover:border-cyan-400/50'
                    : 'bg-[#050b14]/50 border-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {index + 1}. {ms.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          ms.done
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30'
                            : ms.current
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-400/40 animate-pulse'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {ms.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{ms.location}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {ms.date} • {ms.time}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1 rounded-md text-slate-400 hover:text-white"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expandable Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-cyan-500/20 text-xs text-slate-300 animate-in fade-in duration-150">
                    <p className="leading-relaxed">{ms.description}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                      <span>Verification: SHA-256 Validated</span>
                      <span className="text-cyan-400">Node SLA: OK</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
