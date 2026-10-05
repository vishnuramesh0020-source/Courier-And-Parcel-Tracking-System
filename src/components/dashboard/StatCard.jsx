export default function StatCard({
  title,
  value,
  change,
  subtitle = '',
  icon: Icon,
  progress,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#091526]/90 border border-cyan-500/40 hover:border-cyan-300 p-4 sm:p-4.5 flex flex-col justify-between transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_28px_rgba(6,182,212,0.25)] hover:-translate-y-0.5 group">
      {/* Ambient background cyan sheen */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />

      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-slate-300 tracking-wide">
            {title}
          </span>
          {Icon && (
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-cyan-400 leading-tight">
          {value}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-cyan-500/20 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          {change && (
            <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
              <span>{change}</span>
            </span>
          )}
          {subtitle && (
            <span className="text-[11px] text-slate-400 truncate">
              {subtitle}
            </span>
          )}
        </div>

        {/* Glowing Progress Bar */}
        {progress !== undefined && (
          <div className="w-full bg-[#050b14] rounded-full h-1.5 mt-1 overflow-hidden border border-cyan-500/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-500 shadow-[0_0_8px_#38bdf8]"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
