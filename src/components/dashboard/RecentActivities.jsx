import { useState } from 'react'
import {
  Search,
  Filter,
  ExternalLink,
} from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export default function RecentActivities({ activities = [], onTrackParcel }) {
  const [filterType, setFilterType] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchesFilter =
      filterType === 'ALL' ||
      (filterType === 'DELIVERED' && act.status === 'Delivered') ||
      (filterType === 'TRANSIT' &&
        (act.status === 'In Transit' || act.status === 'Out for Delivery')) ||
      (filterType === 'CUSTOMERS' && act.type === 'customer') ||
      (filterType === 'DELAYED' && act.status === 'Pending Pickup')

    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (act.trackingId &&
        act.trackingId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (act.location &&
        act.location.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  // Display only the 5 most recent activities
  const displayedActivities = filteredActivities.slice(0, 5)

  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-[#091526]/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col">
      {/* Table Header matching Image 2 */}
      <div className="p-4 sm:p-5 border-b border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0c1e36]/40">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            Recent Activities
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Latest consignment and delivery updates
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#050b14] border border-cyan-500/30 text-[10px] font-bold uppercase">
            {['ALL', 'TRANSIT', 'DELIVERED', 'DELAYED', 'CUSTOMERS'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterType(tab)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterType === tab
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dispatch..."
              className="h-8.5 pl-8 pr-3 text-xs rounded-xl bg-[#050b14] border border-cyan-500/30 text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
            />
          </div>
        </div>
      </div>

      {/* Structured Table matching Image 2 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#050b14]/70 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-cyan-500/20">
              <th className="py-3 px-4">TRACKING ID</th>
              <th className="py-3 px-4">COURIER LINE</th>
              <th className="py-3 px-4">ORIGIN</th>
              <th className="py-3 px-4">DESTINATION</th>
              <th className="py-3 px-4 text-center">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10">
            {displayedActivities.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <Filter className="w-6 h-6 mx-auto mb-1 text-slate-600" />
                  No dispatch records match your search filter.
                </td>
              </tr>
            ) : (
              displayedActivities.map((act) => {
                return (
                  <tr
                    key={act.id}
                    className="hover:bg-cyan-500/5 transition-colors text-slate-200"
                  >
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() =>
                          onTrackParcel && onTrackParcel(act.trackingId || 'GC-94821-US')
                        }
                        className="font-mono text-xs font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                      >
                        {act.trackingId || '0007832568201'}
                      </button>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {act.timestamp}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium text-xs">
                      {act.actor || 'Global Courier'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 text-xs">
                      {act.location ? act.location.split('→')[0].trim() : 'From Alty, UK'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 text-xs">
                      {act.location && act.location.includes('→')
                        ? act.location.split('→')[1].trim()
                        : 'To Yani USA'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={act.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onTrackParcel && onTrackParcel(act.trackingId || 'GC-94821-US')
                        }
                        className="p-1 rounded-lg hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        title="Audit / Track"
                      >
                        <ExternalLink className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-[#050b14]/70 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-4">
        <span>Recent Records: {displayedActivities.length}</span>
        <span className="text-emerald-400">Live Synchronized</span>
      </div>
    </div>
  )
}
