import { useState, useCallback, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import ReportsKpiCards from '../components/reports/ReportsKpiCards'
import ShipmentTrendsChart from '../components/reports/ShipmentTrendsChart'
import DeliveryPerformanceChart from '../components/reports/DeliveryPerformanceChart'
import MonthlyReportTable from '../components/reports/MonthlyReportTable'
import TopCustomersTable from '../components/reports/TopCustomersTable'
import {
  getReportsSummary,
  exportMonthlyReportCsv,
  exportTopCustomersReportCsv,
} from '../services/reportService'
import { fetchShipments } from '../services/shipmentApi'
import { fetchCustomers } from '../services/customerService'
import {
  Download,
  RotateCcw,
  Activity,
  FileSpreadsheet,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function ReportsPage() {
  const [summary, setSummary] = useState(() => getReportsSummary())
  const [refreshTick, setRefreshTick] = useState(0)

  // Synchronize fresh API data on mount
  useEffect(() => {
    let ignore = false
    Promise.all([fetchShipments(), fetchCustomers()]).then(() => {
      if (!ignore) {
        setSummary(getReportsSummary())
        setRefreshTick((t) => t + 1)
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([fetchShipments(), fetchCustomers()])
      setSummary(getReportsSummary())
      setRefreshTick((t) => t + 1)
      toast.success('Live API Telemetry successfully synchronized.')
    } catch {
      setSummary(getReportsSummary())
      setRefreshTick((t) => t + 1)
      toast.info('Telemetry data synchronized from local cache.')
    }
  }, [])

  const handleExportAll = () => {
    exportMonthlyReportCsv()
    setTimeout(() => {
      exportTopCustomersReportCsv()
    }, 500)
    toast.success('Comprehensive Executive Reports batch downloaded!')
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Background Subtle Cyber Glow Overlay */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/3 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Area (Edge-to-Edge Full Width, No Side Space) */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-5 relative z-10">
        {/* Top Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
              <Activity className="w-3.5 h-3.5" />
              <span>Cyber Command Telemetry & Business Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Executive Reports & Analytics</span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                FY 2026
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Comprehensive operational reporting on global consignment volume, carrier SLA benchmarks, monthly dispatch output, and enterprise client tonnage.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="px-3.5 py-2 rounded-xl bg-[#091526] hover:bg-[#0f2442] text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-400/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              title="Refresh telemetry metrics"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportAll}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
              title="Export all reports to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export All Reports</span>
            </button>
          </div>
        </div>

        {/* 1. Four Core KPI Metrics Cards */}
        <section>
          <ReportsKpiCards summary={summary} />
        </section>

        {/* 2. Interactive Shipment Trends & Volume Velocity Area/Line Chart */}
        <section key={`trends-${refreshTick}`}>
          <ShipmentTrendsChart />
        </section>

        {/* 3. Delivery Performance, Carrier SLA & Category Breakdown */}
        <section key={`perf-${refreshTick}`}>
          <DeliveryPerformanceChart />
        </section>

        {/* 4. Monthly Shipment Report Table */}
        <section key={`month-${refreshTick}`}>
          <MonthlyReportTable />
        </section>

        {/* 5. Top Customers & Enterprise Shippers Leaderboard */}
        <section key={`cust-${refreshTick}`}>
          <TopCustomersTable />
        </section>
      </main>
    </div>
  )
}
