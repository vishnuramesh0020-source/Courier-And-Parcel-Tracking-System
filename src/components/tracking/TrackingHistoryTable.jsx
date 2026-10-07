import { useState } from 'react'
import {
  Search,
  Copy,
  Check,
  MapPin,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function TrackingHistoryTable({ events = [] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [copiedLog, setCopiedLog] = useState(false)

  const handleCopyHistory = () => {
    const text = events
      .map(
        (e) =>
          `[${e.timestamp}] ${e.status} at ${e.location} - ${e.details} (Operator: ${e.operator})`
      )
      .join('\n')
    navigator.clipboard.writeText(text)
    setCopiedLog(true)
    toast.success('Complete event audit log copied to clipboard!')
    setTimeout(() => setCopiedLog(false), 2000)
  }

  const filteredEvents = events.filter((e) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      !q ||
      e.status.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.details.toLowerCase().includes(q) ||
      e.operator.toLowerCase().includes(q)

    const matchesFilter =
      filterStatus === 'ALL' ||
      e.status.toLowerCase().includes(filterStatus.toLowerCase())

    return matchesSearch && matchesFilter
  })

  return (
    <div className="w-full rounded-2xl bg-[#091526]/90 border border-cyan-500/40 p-5 sm:p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden flex flex-col gap-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            Audited Tracking History & Timestamp Log
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable transponder records, scanner station stamps, and custody change logs
          </p>
        </div>

        {/* Action / Search Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-8.5 px-2.5 rounded-xl bg-[#050b14] border border-cyan-500/30 text-white text-xs outline-none cursor-pointer focus:border-cyan-400"
          >
            <option value="ALL">All Event Types</option>
            <option value="Manifest">Manifest / Order</option>
            <option value="Security">Security Scans</option>
            <option value="Transit">Transit Departures</option>
            <option value="Delivery">Final Delivery</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search event logs..."
              className="h-8.5 pl-7 pr-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-400 outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="button"
            onClick={handleCopyHistory}
            className="h-8.5 px-3 rounded-xl bg-[#050b14] border border-cyan-500/30 hover:border-cyan-300 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy audit log"
          >
            {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy Log</span>
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#050b14]/70 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-cyan-500/20">
              <th className="py-2.5 px-3">TIMESTAMP</th>
              <th className="py-2.5 px-3">EVENT / STATUS</th>
              <th className="py-2.5 px-3">LOCATION / TERMINAL</th>
              <th className="py-2.5 px-3">AUDIT DETAILS</th>
              <th className="py-2.5 px-3 text-right">OPERATOR / AGENT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No matching tracking events found in audit buffer.
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => (
                <tr
                  key={evt.id}
                  className="hover:bg-cyan-500/5 transition-colors text-slate-200"
                >
                  <td className="py-3 px-3 font-mono text-[11px] text-cyan-300 whitespace-nowrap">
                    {evt.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-white px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-[11px]">
                      {evt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{evt.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 leading-relaxed max-w-xs sm:max-w-md">
                    {evt.details}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {evt.operator}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer telemetry notice */}
      <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>LOG ENTRIES RECORDED: {filteredEvents.length}</span>
        <span className="text-cyan-400">AUDIT INTEGRITY: SECURE (100% RECONCILED)</span>
      </div>
    </div>
  )
}
