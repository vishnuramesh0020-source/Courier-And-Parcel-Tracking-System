import { useState, useMemo } from 'react'
import {
  Calendar,
  Download,
  Search,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react'
import {
  getMonthlyShipmentData,
  exportMonthlyReportCsv,
} from '../../services/reportService'
import { toast } from 'react-toastify'

export default function MonthlyReportTable() {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('month')
  const [sortDirection, setSortDirection] = useState('asc') // 'asc' | 'desc'

  const data = useMemo(() => getMonthlyShipmentData(), [])

  const handleExport = () => {
    exportMonthlyReportCsv()
    toast.success('Monthly Shipment Report CSV exported successfully!')
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.month.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
      let valA = a[sortField]
      let valB = b[sortField]

      if (sortField === 'month') {
        const order = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        valA = order.indexOf(a.shortMonth)
        valB = order.indexOf(b.shortMonth)
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, search, sortField, sortDirection])

  // Aggregate Totals for Summary Row
  const totalVolume = data.reduce((acc, d) => acc + d.totalShipments, 0)
  const totalDelivered = data.reduce((acc, d) => acc + d.delivered, 0)
  const totalPending = data.reduce((acc, d) => acc + d.pending, 0)
  const totalExceptions = data.reduce((acc, d) => acc + d.exceptions, 0)
  const totalWeight = data.reduce((acc, d) => acc + d.weightKg, 0)
  const totalRevenue = data.reduce((acc, d) => acc + d.revenue, 0)
  const avgSla = data.length > 0
    ? (data.reduce((acc, d) => acc + d.slaRate, 0) / data.length).toFixed(1)
    : '100.0'
  const overallSla = totalVolume > 0
    ? (((totalVolume - totalExceptions) / totalVolume) * 100).toFixed(1)
    : '100.0'

  return (
    <div className="w-full rounded-2xl bg-[#091526]/90 border border-cyan-500/30 p-5 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col gap-4">
      {/* Header and Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-white">
              Monthly Shipment Report
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              2026 Fiscal Year
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audited month-by-month manifest volume, delivery completions, weight, and financial yield
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
              placeholder="Filter month..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#050b14] border border-cyan-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 w-36 sm:w-44"
            />
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer"
            title="Download Monthly Report as CSV"
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
              <th
                onClick={() => handleSort('month')}
                className="py-3 px-4 font-bold text-white cursor-pointer hover:text-cyan-300 select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Month</span>
                  <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('totalShipments')}
                className="py-3 px-3 font-bold text-white cursor-pointer hover:text-cyan-300 select-none text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total Volume</span>
                  <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('delivered')}
                className="py-3 px-3 font-bold text-white cursor-pointer hover:text-cyan-300 select-none text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Delivered</span>
                  <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                </div>
              </th>
              <th className="py-3 px-3 font-bold text-white text-right">
                Pending
              </th>
              <th className="py-3 px-3 font-bold text-white text-right">
                Exceptions
              </th>
              <th
                onClick={() => handleSort('slaRate')}
                className="py-3 px-3 font-bold text-white cursor-pointer hover:text-cyan-300 select-none text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>SLA %</span>
                  <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                </div>
              </th>
              <th className="py-3 px-3 font-bold text-white text-right">
                Weight (kg)
              </th>
              <th
                onClick={() => handleSort('revenue')}
                className="py-3 px-3 font-bold text-white cursor-pointer hover:text-cyan-300 select-none text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Revenue ($)</span>
                  <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-center">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 font-mono">
            {filteredData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-cyan-500/5 transition-colors group"
              >
                <td className="py-3 px-4 font-sans font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform" />
                  <span>{row.month}</span>
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-white">
                  {row.totalShipments}
                </td>
                <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                  {row.delivered}
                </td>
                <td className="py-3 px-3 text-right text-amber-300">
                  {row.pending}
                </td>
                <td className="py-3 px-3 text-right text-rose-400">
                  {row.exceptions}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold">
                    {row.slaRate}%
                  </span>
                </td>
                <td className="py-3 px-3 text-right text-slate-300">
                  {row.weightKg.toLocaleString()} kg
                </td>
                <td className="py-3 px-3 text-right text-cyan-300 font-bold">
                  ${row.revenue.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center font-sans">
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    SLA PASSED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Aggregated Totals Footer Row */}
          <tfoot className="bg-[#091526]/95 border-t-2 border-cyan-500/40 text-xs font-mono font-extrabold text-white">
            <tr>
              <td className="py-3.5 px-4 font-sans uppercase tracking-wider text-cyan-300">
                Full Year Total
              </td>
              <td className="py-3.5 px-3 text-right text-white">
                {totalVolume.toLocaleString()}
              </td>
              <td className="py-3.5 px-3 text-right text-emerald-400">
                {totalDelivered.toLocaleString()}
              </td>
              <td className="py-3.5 px-3 text-right text-amber-300">
                {totalPending}
              </td>
              <td className="py-3.5 px-3 text-right text-rose-400">
                {totalExceptions}
              </td>
              <td className="py-3.5 px-3 text-right text-cyan-300">
                {avgSla}% Avg
              </td>
              <td className="py-3.5 px-3 text-right text-slate-300">
                {totalWeight.toLocaleString()} kg
              </td>
              <td className="py-3.5 px-3 text-right text-cyan-300">
                ${totalRevenue.toLocaleString()}
              </td>
              <td className="py-3.5 px-4 text-center font-sans text-emerald-400 text-[11px]">
                {overallSla}% On-Time
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
