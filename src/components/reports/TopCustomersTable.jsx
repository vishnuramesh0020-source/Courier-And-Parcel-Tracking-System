import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Download,
  Search,
  Trophy,
  ExternalLink,
  FileSpreadsheet,
} from 'lucide-react'
import {
  getTopCustomersReport,
  exportTopCustomersReportCsv,
} from '../../services/reportService'
import { toast } from 'react-toastify'

export default function TopCustomersTable({ data }) {
  const [search, setSearch] = useState('')
  const customers = useMemo(() => {
    return Array.isArray(data) ? data : getTopCustomersReport()
  }, [data])

  const handleExport = () => {
    exportTopCustomersReportCsv()
    toast.success('Top Customers Report CSV exported successfully!')
  }

  const filtered = useMemo(() => {
    const q = (search || '').toLowerCase().trim()
    if (!q) return customers

    return customers.filter((c) => {
      const name = (c?.name || c?.customerName || '').toLowerCase()
      const city = (c?.city || '').toLowerCase()
      const corridor = (c?.primaryCorridor || '').toLowerCase()
      const email = (c?.email || '').toLowerCase()
      return (
        name.includes(q) ||
        city.includes(q) ||
        corridor.includes(q) ||
        email.includes(q)
      )
    })
  }, [customers, search])

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center justify-center font-bold text-xs shadow-[0_0_8px_rgba(245,158,11,0.3)]">
            #1
          </span>
        )
      case 2:
        return (
          <span className="w-6 h-6 rounded-lg bg-slate-400/20 text-slate-200 border border-slate-300/40 flex items-center justify-center font-bold text-xs shadow-[0_0_8px_rgba(148,163,184,0.3)]">
            #2
          </span>
        )
      case 3:
        return (
          <span className="w-6 h-6 rounded-lg bg-amber-700/30 text-amber-400 border border-amber-600/40 flex items-center justify-center font-bold text-xs">
            #3
          </span>
        )
      default:
        return (
          <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center font-bold text-xs">
            #{rank}
          </span>
        )
    }
  }

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'VIP':
        return (
          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            VIP Elite
          </span>
        )
      case 'Corporate':
        return (
          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/50">
            Corporate
          </span>
        )
      default:
        return (
          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            Standard
          </span>
        )
    }
  }

  return (
    <div className="w-full rounded-2xl bg-[#091526]/90 border border-cyan-500/30 p-5 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col gap-4">
      {/* Header and Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-400">
              <Trophy className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-white">
              Top Customers & Enterprise Shippers
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Leaderboard
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Key accounts ranked by freight booking volume, clearance reliability, and cumulative tonnage
          </p>
        </div>

        {/* Search & Export Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shipper or city..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#050b14] border border-cyan-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 w-44 sm:w-52"
            />
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer"
            title="Download Top Customers as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-cyan-500/20 bg-[#050b14]">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#091526] text-[11px] uppercase tracking-wider text-slate-400 border-b border-cyan-500/20">
            <tr>
              <th className="py-3 px-3 font-bold text-center w-12">Rank</th>
              <th className="py-3 px-4 font-bold text-white">Client / Enterprise Shipper</th>
              <th className="py-3 px-3 font-bold text-center">Tier</th>
              <th className="py-3 px-3 font-bold text-white text-right">Total Shipments</th>
              <th className="py-3 px-3 font-bold text-white text-right">Delivered</th>
              <th className="py-3 px-3 font-bold text-white text-right">Pending</th>
              <th className="py-3 px-3 font-bold text-white text-right">Tonnage (kg)</th>
              <th className="py-3 px-3 font-bold text-white text-right">SLA Reliability</th>
              <th className="py-3 px-4 font-bold text-white">Primary Corridor</th>
              <th className="py-3 px-3 font-bold text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 font-mono">
            {filtered.map((client, idx) => (
              <tr
                key={client.id || idx}
                className="hover:bg-cyan-500/5 transition-colors group"
              >
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center">
                    {getRankBadge(idx + 1)}
                  </div>
                </td>

                <td className="py-3 px-4 font-sans">
                  <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {client.name || client.customerName || 'Enterprise Shipper'}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                    <span>{client.city || 'Global Hub'}</span>
                    {client.email && (
                      <>
                        <span>•</span>
                        <span className="text-slate-500">{client.email}</span>
                      </>
                    )}
                  </div>
                </td>

                <td className="py-3 px-3 text-center font-sans">
                  {getTierBadge(client.tier || 'Active')}
                </td>

                <td className="py-3 px-3 text-right font-extrabold text-white text-sm">
                  {client.totalShipments ?? client.volume ?? 0}
                </td>

                <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                  {client.deliveredCount ?? client.delivered ?? 0}
                </td>

                <td className="py-3 px-3 text-right text-amber-300">
                  {client.pendingCount ?? 0}
                </td>

                <td className="py-3 px-3 text-right text-slate-300">
                  {(client.weightKg ?? client.weight ?? 0).toLocaleString()} kg
                </td>

                <td className="py-3 px-3 text-right">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold">
                    {client.slaRate ?? client.sla ?? 100}%
                  </span>
                </td>

                <td className="py-3 px-4 font-sans text-slate-300">
                  <span className="text-[11px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {client.primaryCorridor || 'Global Corridor'}
                  </span>
                </td>

                <td className="py-3 px-3 text-center font-sans">
                  <Link
                    to={`/customers/${client.id}`}
                    className="p-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-400 hover:text-white border border-cyan-500/30 inline-flex items-center justify-center transition-colors"
                    title="View Customer Profile"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
