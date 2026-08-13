export default function GameCard({ icon, title, description, stats, controls, children }) {
  return (
    <div className="flex flex-col rounded-3xl border border-line-light bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-3">
        <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
          <i className={`fas ${icon} text-primary-text`} />
          {title}
        </h3>
        <p className="mt-1 text-sm text-ink-2">{description}</p>
      </div>

      {stats && (
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-xl bg-canvas px-3 py-2 text-center">
              <span className="block text-[11px] font-semibold tracking-wide text-ink-3 uppercase">{stat.label}</span>
              <span className="block mt-0.5 text-sm font-bold text-ink">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {children && <div className="flex-1">{children}</div>}

      {controls && <div className="mt-4 flex flex-wrap items-center gap-2">{controls}</div>}
    </div>
  )
}
