import { useState } from 'react'
import {
  Navigation,
  Radio,
  Compass,
  Copy,
  Check,
  Plane,
  Truck,
  Activity,
  Wind,
  Satellite,
  Wifi,
  Sparkles,
} from 'lucide-react'
import { getSimulatedTelemetry } from '../../services/trackingService'
import { toast } from 'react-toastify'

export default function TrackingLocationCard({ shipment }) {
  const [copiedCoords, setCopiedCoords] = useState(false)

  if (!shipment) return null

  const telemetry = getSimulatedTelemetry(shipment)
  if (!telemetry) return null

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(telemetry.currentCoordinates.formatted)
    setCopiedCoords(true)
    toast.success('GPS coordinates copied to clipboard!')
    setTimeout(() => setCopiedCoords(false), 2000)
  }

  const isAirborne = shipment.deliveryStatus === 'In Transit'

  return (
    <div className="w-full rounded-2xl bg-[#091526]/90 border border-cyan-500/40 p-5 sm:p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden flex flex-col gap-5">
      {/* Glow backdrop */}
      <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-cyan-500/20 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Live GPS Transponder & Waypoint Telemetry
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time orbital satellite downlink & transcontinental position fix
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(52,211,153,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            TRANSPONDER ONLINE
          </span>
        </div>
      </div>

      {/* Main Grid: Radar Scanner & Position Coordinates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center relative z-10">
        {/* Left Column (5 Cols): Animated Holographic GPS Radar Display */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#040812] border border-cyan-500/30 relative overflow-hidden">
          {/* Radar Scanner Grid Container */}
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
            {/* Concentric Radar Rings */}
            <div className="absolute inset-2 rounded-full border border-cyan-500/20" />
            <div className="absolute inset-8 rounded-full border border-cyan-500/25" />
            <div className="absolute inset-16 rounded-full border border-cyan-500/30" />
            <div className="absolute inset-24 rounded-full border border-cyan-500/40" />

            {/* Crosshair Lines */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-cyan-500/25" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-cyan-500/25" />

            {/* Cardinal Direction Marks */}
            <span className="absolute top-1 text-[10px] font-mono font-bold text-cyan-400/80">N</span>
            <span className="absolute bottom-1 text-[10px] font-mono font-bold text-cyan-400/80">S</span>
            <span className="absolute right-1 text-[10px] font-mono font-bold text-cyan-400/80">E</span>
            <span className="absolute left-1 text-[10px] font-mono font-bold text-cyan-400/80">W</span>

            {/* Rotating Radar Sweep Beam */}
            <div
              className="absolute inset-2 rounded-full pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.35) 0deg, rgba(6, 182, 212, 0.05) 60deg, transparent 90deg)',
                animation: 'spin 4s linear infinite',
              }}
            />

            {/* Pulsating Target Beacon Pin */}
            <div className="absolute top-1/3 right-1/3 flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping" />
              <span className="absolute w-5 h-5 rounded-full bg-cyan-400/50" />
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-white shadow-[0_0_12px_#00f2fe] z-10 flex items-center justify-center">
                {isAirborne ? (
                  <Plane className="w-2 h-2 text-slate-950" />
                ) : (
                  <Truck className="w-2 h-2 text-slate-950" />
                )}
              </div>
            </div>

            {/* Origin & Destination Nodes */}
            <div className="absolute bottom-10 left-8 p-1 rounded bg-[#091526] border border-cyan-500/40 text-[9px] font-mono text-cyan-300">
              {telemetry.originHub.code}
            </div>
            <div className="absolute top-10 right-8 p-1 rounded bg-[#091526] border border-emerald-500/40 text-[9px] font-mono text-emerald-300">
              {telemetry.destHub.code}
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              GPS LOCK: {telemetry.currentCoordinates.formatted}
            </span>
          </div>
        </div>

        {/* Right Column (7 Cols): Telemetry Coordinates & Specifications */}
        <div className="lg:col-span-7 flex flex-col gap-3.5">
          {/* Current Location Banner */}
          <div className="p-3.5 rounded-xl bg-[#050b14] border border-cyan-500/30 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold block">
                Current Waypoint Position
              </span>
              <div className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5">
                {telemetry.locationDescription}
              </div>
              <div className="text-xs text-cyan-400 font-mono mt-0.5">
                {telemetry.originCity} ({telemetry.originHub.code}) → {telemetry.destCity} ({telemetry.destHub.code})
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyCoords}
              className="p-2 rounded-xl bg-[#091526] hover:bg-cyan-500/20 border border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors shrink-0 cursor-pointer"
              title="Copy GPS coordinates"
            >
              {copiedCoords ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Telemetry Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Navigation className="w-3 h-3 text-cyan-400" /> Altitude
              </span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono mt-1 block">
                {telemetry.altitude}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Wind className="w-3 h-3 text-cyan-400" /> Ground Speed
              </span>
              <span className="text-xs sm:text-sm font-bold text-cyan-300 font-mono mt-1 block">
                {telemetry.groundSpeed}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Satellite className="w-3 h-3 text-cyan-400" /> Satellite Link
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-1 block">
                {telemetry.signalStrength}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" /> Route Distance
              </span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono mt-1 block">
                {telemetry.distanceCovered} / {telemetry.totalNauticalMiles} NM
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Wifi className="w-3 h-3 text-cyan-400" /> Transponder Ping
              </span>
              <span className="text-xs sm:text-sm font-bold text-cyan-400 font-mono mt-1 block">
                {telemetry.pingLatency}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#050b14] border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" /> Ambient Temp
              </span>
              <span className="text-xs sm:text-sm font-bold text-sky-300 font-mono mt-1 block">
                {telemetry.temperature}
              </span>
            </div>
          </div>

          {/* Distance Bar */}
          <div className="p-3 rounded-xl bg-[#050b14] border border-cyan-500/20 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">
                Dispatched from {telemetry.originCity} ({telemetry.distanceCovered} NM elapsed)
              </span>
              <span className="text-cyan-300 font-bold">
                {telemetry.distanceRemaining} NM to {telemetry.destCity}
              </span>
            </div>
            <div className="w-full bg-[#03060d] h-2 rounded-full overflow-hidden border border-cyan-500/20">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 shadow-[0_0_8px_#38bdf8]"
                style={{
                  width: `${Math.min(100, Math.round((telemetry.distanceCovered / telemetry.totalNauticalMiles) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
