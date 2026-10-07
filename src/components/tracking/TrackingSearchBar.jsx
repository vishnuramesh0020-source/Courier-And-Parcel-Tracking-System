import { useState } from 'react'
import {
  Search,
  X,
  Layers,
  Crosshair,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export default function TrackingSearchBar({
  trackingCode,
  onSearch,
  activeMode, // 'single' | 'multi'
  onModeChange,
  availableShipments = [],
}) {
  const [inputValue, setInputValue] = useState(trackingCode || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSearch(inputValue.trim().toUpperCase())
    }
  }

  const handleClear = () => {
    setInputValue('')
  }

  const handleQuickSelect = (code) => {
    setInputValue(code)
    onSearch(code)
  }

  return (
    <div className="w-full rounded-2xl bg-[#091526]/90 border border-cyan-500/40 p-4 sm:p-5 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Title & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Global Satellite Tracking Node
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight mt-0.5">
            Real-Time Parcel Radar & Telemetry Lookup
          </h2>
        </div>

        {/* Single vs Multi-Tracking Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#050b14] border border-cyan-500/30 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onModeChange('single')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'single'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Single Waybill</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('multi')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'multi'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Shipment Command</span>
          </button>
        </div>
      </div>

      {/* Search Input Form for Single Tracking */}
      {activeMode === 'single' ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4.5 h-4.5 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter Consignment Tracking Number (e.g. GC-948210-US)..."
              className="w-full h-11 pl-11 pr-10 text-xs sm:text-sm font-mono font-bold uppercase rounded-xl bg-[#050b14] border border-cyan-500/40 text-white placeholder-slate-500 outline-none focus:border-cyan-300 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Track Parcel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* Multi-Tracking Info Strip */
        <div className="p-3 rounded-xl bg-[#050b14] border border-cyan-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Multi-Shipment Command Mode active. Enter multiple consignment codes or toggle active parcels below.
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/30 shrink-0">
            BATCH RADAR READY
          </span>
        </div>
      )}

      {/* Quick Select Preset Pills */}
      {availableShipments.length > 0 && (
        <div className="mt-3 pt-3 border-t border-cyan-500/20 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Quick Select Waybills:</span>
          {availableShipments.slice(0, 5).map((s) => {
            const code = s.trackingNumber || s.id
            const isSelected = activeMode === 'single' && trackingCode === code
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleQuickSelect(code)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-[#050b14] hover:bg-cyan-500/15 border border-cyan-500/30 text-slate-300 hover:text-cyan-300'
                }`}
              >
                {code} ({s.deliveryStatus})
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
