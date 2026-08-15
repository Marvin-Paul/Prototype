import { useEffect, useMemo, useState } from 'react'
import Icon from '../../shared/Icon'
import { useLanguage } from '../../shared/LanguageProvider'
import { notify } from '../../shared/toast'
import {
  COUNSELORS,
  FEATURE_USAGE,
  COUNSELING_DEMAND,
  SAMPLE_ACTIVITIES,
  TIME_SLOTS,
  loadUsers,
  loadAppointments,
  saveAppointments,
  loadMoodData,
  loadMovements,
  buildGroupStats,
  downloadFile,
  csvEscape,
  formatTime,
  isToday,
} from './adminData'
import { MOODS } from '../dashboard/sections/groups/data'

/* ---------- shared bits ---------- */

const CARD = 'rounded-3xl border border-line-light bg-surface p-6 shadow-sm'
const TITLE_BAR =
  'mb-1 flex items-center gap-2 text-lg font-bold text-ink'
const UNDERLINE = 'mb-5 mt-2 h-0.5 w-14 rounded-full bg-[linear-gradient(90deg,var(--primary-color),var(--secondary-color))]'
const INPUT =
  'rounded-xl border border-line-light bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-primary'
const PILL =
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold'
const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-5 py-2.5 text-sm font-bold text-on-primary shadow-md transition-transform hover:scale-[1.03]'
const GHOST_BTN =
  'inline-flex items-center justify-center gap-2 rounded-full border border-line-light bg-surface px-5 py-2.5 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text'

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className={TITLE_BAR}>
        <Icon icon={icon} className="text-primary-text" /> {title}
      </h2>
      {subtitle && <p className="text-sm text-ink-2">{subtitle}</p>}
      <div className={UNDERLINE} />
    </div>
  )
}

function ModalShell({ onClose, children, maxW = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[85vh] w-full ${maxW} overflow-y-auto rounded-3xl border border-line-light bg-surface p-6 shadow-2xl`}
      >
        {children}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, tint, color }) {
  return (
    <div className={`${CARD} flex items-start gap-4`}>
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl"
        style={{ background: tint, color }}
      >
        <Icon icon={icon} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-ink-3 uppercase">{label}</p>
        <p className="mt-1 text-2xl font-extrabold text-ink">{value}</p>
        {sub && <p className="mt-0.5 text-xs font-medium text-success">{sub}</p>}
      </div>
    </div>
  )
}

function EmptyRow({ colSpan, text }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center">
        <Icon icon="fa-inbox" className="mb-2 block text-3xl text-ink-3" />
        <p className="text-sm font-medium text-ink-2">{text}</p>
      </td>
    </tr>
  )
}

/* ---------- top bar ---------- */

function AdminTopBar() {
  const { lang, setLang } = useLanguage()
  return (
    <nav className="sticky top-0 z-40 border-b border-line-light bg-surface/98 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] text-on-primary shadow-md">
            <Icon icon="fa-shield-alt" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-ink">Campus Mindspace Admin</p>
            <p className="text-xs text-ink-3">Counselor Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-line-light bg-canvas px-3 py-1.5 text-sm font-medium text-ink-2 sm:flex">
            <Icon icon="fa-user-shield" className="text-primary-text" />
            <span>Administrator</span>
          </div>
          <select
            aria-label="Language"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className={`${INPUT} w-auto accent-[var(--primary-color)]`}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
          <a
            href="index.html"
            className="inline-flex items-center gap-2 rounded-full border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-danger hover:text-danger"
          >
            <Icon icon="fa-sign-out-alt" /> <span className="hidden sm:inline">Exit Portal</span>
          </a>
        </div>
      </div>
    </nav>
  )
}

/* ---------- charts / analytics ---------- */

function MoodDistribution({ users }) {
  const counts = useMemo(() => {
    const map = {}
    users.forEach((u) => {
      const mood = u.initialMood || u.currentMood || 'unknown'
      map[mood] = (map[mood] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [users])

  const total = users.length || 1
  return (
    <div className={`${CARD}`}>
      <SectionTitle icon="fa-chart-pie" title="Initial Mood Distribution" subtitle="User mood check-in data from registration" />
      <div className="space-y-4">
        {counts.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-2">
            No user registration data yet. Registered users will appear here.
          </p>
        )}
        {counts.map(([mood, count]) => {
          const moodData = MOODS[mood]
          const pct = ((count / total) * 100).toFixed(1)
          return (
            <div key={mood} className="flex items-center gap-3">
              <span className="w-40 shrink-0 truncate text-sm font-medium text-ink-2">
                <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: moodData?.color || '#868685' }} />
                {moodData?.description || mood}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-canvas">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: moodData?.color || '#868685' }} />
              </div>
              <span className="w-20 shrink-0 text-right text-xs text-ink-3">
                {count} · {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FeatureUsage() {
  return (
    <div className={CARD}>
      <SectionTitle icon="fa-chart-bar" title="Feature Usage Analytics" subtitle="Most and least frequently used platform sections" />
      <div className="space-y-4">
        {FEATURE_USAGE.map((f) => (
          <div key={f.title} className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-canvas text-sm text-primary-text">
              <Icon icon={f.icon} />
            </div>
            <div className="flex-1">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-semibold text-ink">{f.title}</span>
                <span className="text-xs font-bold text-primary-text">{f.pct}% usage</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-canvas">
                <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: f.gradient }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CounselingDemand() {
  return (
    <div className={CARD}>
      <SectionTitle icon="fa-user-md" title="Counseling Demand by Specialization" subtitle="Appointment booking rates per counselor specialty" />
      <div className="space-y-4">
        {COUNSELING_DEMAND.map((d) => (
          <div key={d.label} className="rounded-2xl border border-line-light bg-canvas/60 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-ink">{d.label}</h4>
              <span className="text-xs font-semibold text-ink-3">{d.bookings} bookings</span>
            </div>
            <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: d.color }} />
            </div>
            <span
              className={`${PILL} ${
                d.status === 'High Demand'
                  ? 'bg-danger/10 text-danger'
                  : d.status === 'Medium Demand'
                    ? 'bg-warning/15 text-amber-600'
                    : 'bg-primary/10 text-primary-text'
              }`}
            >
              <Icon icon="fa-signal" /> {d.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RegistrationTrends({ users }) {
  const bars = useMemo(() => {
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleString('en', { month: 'short' }) })
    }
    const counts = months.map((m) => ({ ...m, count: 0 }))
    users.forEach((u) => {
      const d = new Date(u.registrationDate)
      if (Number.isNaN(d.getTime())) return
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const slot = counts.find((c) => c.key === key)
      if (slot) slot.count++
    })
    return counts
  }, [users])

  const max = Math.max(1, ...bars.map((b) => b.count))
  return (
    <div className={CARD}>
      <SectionTitle icon="fa-chart-line" title="User Registration Trends" subtitle="New user registrations over the last 6 months" />
      <div className="flex h-40 items-end gap-3">
        {bars.map((b) => (
          <div key={b.key} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-xs font-bold text-ink-2">{b.count > 0 ? b.count : ''}</span>
            <div
              className="w-full rounded-t-xl bg-[linear-gradient(180deg,var(--primary-color),var(--primary-dark))] transition-all duration-700"
              style={{ height: `${(b.count / max) * 100}%`, minHeight: b.count > 0 ? 6 : 2 }}
            />
            <span className="text-[11px] font-medium text-ink-3">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentActivity() {
  const typeClasses = {
    success: 'bg-success/10 text-success',
    info: 'bg-primary/10 text-primary-text',
    primary: 'bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] text-on-primary',
    secondary: 'bg-accent-purple/10 text-accent-purple',
    warning: 'bg-warning/15 text-amber-600',
  }
  return (
    <div className={CARD}>
      <SectionTitle icon="fa-history" title="Recent Activity" subtitle="Latest platform activities and events" />
      <div className="space-y-3">
        {SAMPLE_ACTIVITIES.map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${typeClasses[a.type]}`}>
              <Icon icon={a.icon} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{a.text}</p>
              <span className="text-xs text-ink-3">{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- admin actions ---------- */

function AdminActions({ users, appointments, moodData, activityLog }) {
  const [showReport, setShowReport] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [showUsers, setShowUsers] = useState(false)

  const exportAll = () => {
    const data = {
      exportDate: new Date().toISOString(),
      exportedBy: 'Administrator',
      statistics: { totalUsers: users.length, totalAppointments: appointments.length },
      users,
      appointments,
      moodData,
      activityLog,
    }
    downloadFile(JSON.stringify(data, null, 2), `campus-mindspace-export-${new Date().toISOString().split('T')[0]}.json`, 'application/json')
    notify('Data exported successfully!', 'success')
  }

  return (
    <div className={CARD}>
      <SectionTitle icon="fa-cogs" title="Administrative Actions" subtitle="Manage and export system data" />
      <div className="grid gap-4 sm:grid-cols-2">
        <button onClick={exportAll} className={PRIMARY_BTN}>
          <Icon icon="fa-download" /> <span>Export All Data</span>
        </button>
        <button onClick={() => setShowReport(true)} className={GHOST_BTN}>
          <Icon icon="fa-file-pdf" /> <span>Generate Report</span>
        </button>
        <button onClick={() => setShowLogs(true)} className={GHOST_BTN}>
          <Icon icon="fa-list" /> <span>View Activity Logs</span>
        </button>
        <button onClick={() => setShowUsers(true)} className={GHOST_BTN}>
          <Icon icon="fa-users-cog" /> <span>Manage Users</span>
        </button>
      </div>

      {showReport && (
        <ModalShell onClose={() => setShowReport(false)}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-ink">Administrative Report</h3>
              <p className="text-sm text-ink-2">Generated {new Date().toLocaleString()}</p>
            </div>
            <button onClick={() => setShowReport(false)} className="text-ink-3 transition-colors hover:text-ink">
              <Icon icon="fa-times" className="text-xl" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Total Users', users.length],
              ['Total Appointments', appointments.length],
              ['Most Used Feature', 'Mind Games (91%)'],
              ['Top Demand', 'Academic Stress (156)'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-line-light bg-canvas/60 p-4">
                <p className="text-xs font-semibold text-ink-3 uppercase">{label}</p>
                <p className="mt-1 text-xl font-extrabold text-ink">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-line-light bg-canvas/60 p-4">
            <p className="mb-2 text-sm font-bold text-ink">Recommendations</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-ink-2">
              <li>Increase counselor availability for Academic Stress specialty</li>
              <li>Promote appointment booking feature to increase usage</li>
              <li>Continue focus on Mind Games - highest engagement</li>
              <li>Consider adding more anxiety/depression resources</li>
            </ul>
          </div>
          <button onClick={() => setShowReport(false)} className={`${PRIMARY_BTN} mt-5 w-full`}>
            <Icon icon="fa-check" /> Done
          </button>
        </ModalShell>
      )}

      {showLogs && (
        <ModalShell onClose={() => setShowLogs(false)}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className="text-lg font-extrabold text-ink">Activity Logs</h3>
            <button onClick={() => setShowLogs(false)} className="text-ink-3 transition-colors hover:text-ink">
              <Icon icon="fa-times" className="text-xl" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-line-light bg-canvas/60 p-4 text-center">
              <p className="text-2xl font-extrabold text-ink">{users.length}</p>
              <p className="text-xs font-semibold text-ink-3 uppercase">Registered Users</p>
            </div>
            <div className="rounded-2xl border border-line-light bg-canvas/60 p-4 text-center">
              <p className="text-2xl font-extrabold text-ink">{activityLog.length}</p>
              <p className="text-xs font-semibold text-ink-3 uppercase">Logged Activities</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-2">
            Full platform activity and user audit data can be exported via the <b>Export All Data</b> action.
          </p>
          <button onClick={() => setShowLogs(false)} className={`${GHOST_BTN} mt-5 w-full`}>
            Close
          </button>
        </ModalShell>
      )}

      {showUsers && (
        <ModalShell onClose={() => setShowUsers(false)} maxW="max-w-2xl">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-ink">Manage Users</h3>
              <p className="text-sm text-ink-2">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => setShowUsers(false)} className="text-ink-3 transition-colors hover:text-ink">
              <Icon icon="fa-times" className="text-xl" />
            </button>
          </div>
          {users.length === 0 ? (
            <p className="rounded-2xl border border-line-light bg-canvas/60 p-6 text-center text-sm text-ink-2">
              No users registered yet.
            </p>
          ) : (
            <div className="space-y-2">
              {users.map((u, i) => (
                <div key={u.id || i} className="flex items-center gap-3 rounded-2xl border border-line-light bg-canvas/60 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary-text">
                    {(u.fullName || u.name || '?').charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{u.fullName || u.name}</p>
                    <p className="truncate text-xs text-ink-2">{u.email}</p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-3">
                    {u.registrationDate ? new Date(u.registrationDate).toLocaleDateString() : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ModalShell>
      )}
    </div>
  )
}

/* ---------- mood groups management ---------- */

function MovementsTable({ movements, categories }) {
  const [moodFilter, setMoodFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const filtered = movements
    .filter((m) => {
      const matchesMood = !moodFilter || m.fromMood === moodFilter || m.toMood === moodFilter
      const matchesDate = !dateFilter || new Date(m.timestamp).toDateString() === new Date(dateFilter).toDateString()
      return matchesMood && matchesDate
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  const exportCsv = () => {
    const rows = [
      ['User Name', 'From Mood', 'To Mood', 'Date', 'Time'],
      ...filtered.map((m) => [
        m.userName,
        categories[m.fromMood]?.description || m.fromMood,
        categories[m.toMood]?.description || m.toMood,
        new Date(m.timestamp).toLocaleDateString(),
        new Date(m.timestamp).toLocaleTimeString(),
      ]),
    ]
    downloadFile(rows.map((r) => r.map(csvEscape).join(',')).join('\n'), `user_movements_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
    notify('Movements exported successfully!', 'success')
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)} className={`${INPUT} accent-[var(--primary-color)]`}>
          <option value="">All Moods</option>
          {Object.entries(categories).map(([key, m]) => (
            <option key={key} value={key}>
              {m.description}
            </option>
          ))}
        </select>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={INPUT} />
        <button onClick={exportCsv} className={GHOST_BTN}>
          <Icon icon="fa-download" /> Export Log
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line-light text-xs font-semibold tracking-wide text-ink-3 uppercase">
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">From</th>
              <th className="px-3 py-2">To</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <EmptyRow colSpan={5} text="No movements match the current filters." />}
            {filtered.map((m, i) => (
              <tr key={i} className="border-b border-line-light/70 last:border-0">
                <td className="px-3 py-2.5 font-medium text-ink">{m.userName}</td>
                <td className="px-3 py-2.5">
                  <span className={`${PILL} bg-primary/10 text-primary-text`}>{categories[m.fromMood]?.description || m.fromMood}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`${PILL} bg-accent-purple/10 text-accent-purple`}>{categories[m.toMood]?.description || m.toMood}</span>
                </td>
                <td className="px-3 py-2.5 text-ink-2">{new Date(m.timestamp).toLocaleDateString()}</td>
                <td className="px-3 py-2.5 text-ink-2">{new Date(m.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MoodCategories({ categories, onChange }) {
  const [adding, setAdding] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [form, setForm] = useState({ key: '', description: '', icon: 'fa-smile', color: '#7ed24b' })

  const openAdd = () => {
    setForm({ key: '', description: '', icon: 'fa-smile', color: '#7ed24b' })
    setAdding(true)
  }

  const openEdit = (key) => {
    const m = categories[key]
    setForm({ key, description: m.description, icon: m.icon || 'fa-smile', color: m.color })
    setEditingKey(key)
  }

  const save = () => {
    if (!form.description.trim() || !form.key.trim()) {
      notify('Key and description are required', 'error')
      return
    }
    const next = { ...categories }
    next[form.key.trim()] = {
      ...(categories[form.key] || {}),
      description: form.description.trim(),
      icon: form.icon || 'fa-smile',
      color: form.color,
      groupName: `${form.description.trim()} Group`,
      icon: 'fa-heart',
    }
    onChange(next)
    setAdding(false)
    setEditingKey(null)
    notify('Mood category saved successfully!', 'success')
  }

  const remove = (key) => {
    if (!window.confirm(`Are you sure you want to delete the ${categories[key].description} category?`)) return
    const next = { ...categories }
    delete next[key]
    onChange(next)
    notify('Mood category deleted', 'success')
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(categories).map(([key, m]) => (
          <div key={key} className="flex items-center justify-between gap-3 rounded-2xl border border-line-light bg-canvas/60 p-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ background: `${m.color}20` }}>
                <Icon icon={m.icon || 'fa-smile'} className="text-xl" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-ink">{m.description}</h4>
                <p className="text-xs text-ink-3">{m.groupName}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                title="Edit"
                onClick={() => openEdit(key)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line-light text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
              >
                <Icon icon="fa-edit" />
              </button>
              <button
                title="Delete"
                onClick={() => remove(key)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line-light text-ink-2 transition-colors hover:border-danger hover:text-danger"
              >
                <Icon icon="fa-trash" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={openAdd} className={`${GHOST_BTN} mt-4`}>
        <Icon icon="fa-plus" /> Add New Mood Category
      </button>

      {(adding || editingKey) && (
        <ModalShell onClose={() => { setAdding(false); setEditingKey(null) }}>
          <h3 className="mb-4 text-lg font-extrabold text-ink">{editingKey ? 'Edit Mood Category' : 'Add New Mood Category'}</h3>
          <div className="space-y-3">
            {!editingKey && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Mood Key</label>
                <input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="e.g. calm" className={INPUT} />
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Calm" className={INPUT} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Icon</label>
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="fa-smile" className={INPUT} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Color</label>
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-10 w-full cursor-pointer rounded-xl border border-line-light bg-canvas" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button onClick={save} className={`${PRIMARY_BTN} flex-1`}>
              <Icon icon="fa-save" /> Save Category
            </button>
            <button onClick={() => { setAdding(false); setEditingKey(null) }} className={`${GHOST_BTN} flex-1`}>
              Cancel
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  )
}

function MoodAnalytics({ movements, categories }) {
  const [period, setPeriod] = useState('week')

  const analytics = useMemo(() => {
    const now = new Date()
    let startDate
    if (period === 'today') startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    else if (period === 'week') startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    else if (period === 'month') startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    else startDate = new Date(0)

    const filtered = movements.filter((m) => new Date(m.timestamp) >= startDate)
    const dist = {}
    filtered.forEach((m) => {
      dist[m.toMood] = (dist[m.toMood] || 0) + 1
    })
    const most = Object.entries(dist).sort((a, b) => b[1] - a[1])[0]
    const days = Math.max(1, Math.ceil((now - startDate) / (24 * 60 * 60 * 1000)))
    return {
      mostCommon: most ? categories[most[0]]?.description || most[0] : 'N/A',
      total: filtered.length,
      avg: (filtered.length / days).toFixed(1),
      dist,
    }
  }, [movements, period, categories])

  const generateReport = () => {
    downloadFile(
      JSON.stringify({ period, generatedAt: new Date().toISOString(), analytics }, null, 2),
      `mood_analytics_report_${period}_${new Date().toISOString().split('T')[0]}.json`,
      'application/json'
    )
    notify('Analytics report generated and downloaded!', 'success')
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className={`${INPUT} accent-[var(--primary-color)]`}>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
        <button onClick={generateReport} className={GHOST_BTN}>
          <Icon icon="fa-chart-line" /> Generate Report
        </button>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          ['Most Common Mood', analytics.mostCommon],
          ['Total Movements', analytics.total],
          ['Avg Daily Changes', analytics.avg],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line-light bg-canvas/60 p-3 text-center">
            <p className="text-sm font-bold text-ink">{value}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-ink-3 uppercase">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {Object.entries(analytics.dist).length === 0 && (
          <p className="py-6 text-center text-sm text-ink-2">No mood movements in this period.</p>
        )}
        {Object.entries(analytics.dist)
          .sort((a, b) => b[1] - a[1])
          .map(([mood, count]) => {
            const m = categories[mood]
            const pct = analytics.total > 0 ? ((count / analytics.total) * 100).toFixed(1) : '0'
            return (
              <div key={mood} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm font-medium text-ink-2">
                  <Icon icon={m?.icon || 'fa-smile'} className="mr-1 inline" /> {m?.description || mood}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-canvas">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: m?.color || '#868685' }} />
                </div>
                <span className="w-24 shrink-0 text-right text-xs text-ink-3">
                  {count} ({pct}%)
                </span>
              </div>
            )
          })}
      </div>
    </div>
  )
}

function GroupsManagement() {
  const [categories, setCategories] = useState(() => ({ ...MOODS }))
  const [movements, setMovements] = useState([])
  const [groupStats, setGroupStats] = useState({})
  const [version, setVersion] = useState(0)

  useEffect(() => {
    setMovements(loadMovements())
    setGroupStats(buildGroupStats())
  }, [version])

  const totals = useMemo(() => {
    const active = Object.values(groupStats).filter((g) => g.memberCount > 0).length
    const members = Object.values(groupStats).reduce((s, g) => s + g.memberCount, 0)
    const msgs = Object.values(groupStats).reduce((s, g) => s + g.messagesToday, 0)
    return { active, members, msgs }
  }, [groupStats])

  const monitor = Object.entries(groupStats)
    .filter(([, s]) => s.memberCount > 0)
    .sort((a, b) => b[1].memberCount - a[1].memberCount)

  return (
    <div className={CARD}>
      <SectionTitle icon="fa-users" title="Mood Groups Management" subtitle="Monitor and manage mood-based group chats" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: 'fa-layer-group', label: 'Active Groups', value: totals.active },
          { icon: 'fa-user-friends', label: 'Total Members', value: totals.members },
          { icon: 'fa-comments', label: 'Messages Today', value: totals.msgs },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-line-light bg-canvas/60 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-text">
              <Icon icon={s.icon} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-ink">{s.value}</p>
              <p className="text-xs font-semibold text-ink-3 uppercase">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
          <Icon icon="fa-eye" className="text-primary-text" /> Real-Time Group Monitoring
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {monitor.length === 0 && (
            <p className="rounded-2xl border border-line-light bg-canvas/60 p-6 text-sm text-ink-2">
              No active groups yet. Groups appear once members join them.
            </p>
          )}
          {monitor.map(([mood, stats]) => {
            const m = categories[mood]
            return (
              <div key={mood} className="rounded-2xl border border-line-light bg-canvas/60 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon icon={m?.icon || 'fa-smile'} className="text-xl" />
                    <h4 className="text-sm font-bold text-ink">{m?.groupName || mood}</h4>
                  </div>
                  <span className={`${PILL} bg-success/10 text-success`}>
                    <Icon icon="fa-circle" className="text-[8px]" /> Active
                  </span>
                </div>
                <p className="text-xs text-ink-2">{stats.memberCount} member{stats.memberCount !== 1 ? 's' : ''}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-ink-3">
                  <span><Icon icon="fa-comments" className="mr-1" />{stats.messagesToday} today</span>
                  <span><Icon icon="fa-clock" className="mr-1" />{formatTime(stats.lastActivity)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
          <Icon icon="fa-exchange-alt" className="text-primary-text" /> User Movement Log
        </h3>
        <MovementsTable movements={movements} categories={categories} />
      </div>

      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
          <Icon icon="fa-cog" className="text-primary-text" /> Mood Categories Management
        </h3>
        <MoodCategories categories={categories} onChange={(next) => setCategories(next)} />
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
          <Icon icon="fa-chart-bar" className="text-primary-text" /> Mood Distribution Analytics
        </h3>
        <MoodAnalytics movements={movements} categories={categories} />
      </div>
    </div>
  )
}

/* ---------- appointment management ---------- */

const STATUS_BADGE = {
  confirmed: 'bg-success/10 text-success',
  completed: 'bg-primary/10 text-primary-text',
  cancelled: 'bg-danger/10 text-danger',
  'no-show': 'bg-warning/15 text-amber-600',
}

function AppointmentDetails({ appointment, onClose, onEdit }) {
  const counselor = COUNSELORS[appointment.counselorType]
  const Row = ({ label, value }) => (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-canvas/60 px-3 py-2 text-sm">
      <span className="shrink-0 font-semibold text-ink-3">{label}</span>
      <span className="text-right font-medium text-ink break-words">{value || '—'}</span>
    </div>
  )
  return (
    <ModalShell onClose={onClose} maxW="max-w-2xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-ink">Appointment Details</h3>
          <p className="text-xs text-ink-3">ID: {appointment.id}</p>
        </div>
        <span className={`${PILL} ${STATUS_BADGE[appointment.status] || 'bg-canvas text-ink-2'}`}>
          <Icon icon={appointment.status === 'completed' ? 'fa-check-double' : appointment.status === 'cancelled' ? 'fa-times-circle' : appointment.status === 'no-show' ? 'fa-user-times' : 'fa-check-circle'} />
          {(appointment.status || 'unknown').replace(/^\w/, (c) => c.toUpperCase())}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-ink"><Icon icon="fa-user" className="mr-1 text-primary-text" /> Student</h4>
          <Row label="Name" value={appointment.studentName} />
          <Row label="Email" value={appointment.studentEmail} />
          <Row label="Phone" value={appointment.studentPhone} />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-ink"><Icon icon="fa-user-md" className="mr-1 text-primary-text" /> Counselor</h4>
          <Row label="Name" value={counselor?.name || appointment.counselorName} />
          <Row label="Specialty" value={counselor?.specialty || appointment.counselorSpecialty} />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-ink"><Icon icon="fa-calendar" className="mr-1 text-primary-text" /> Schedule</h4>
          <Row label="Date" value={new Date(appointment.date).toLocaleDateString()} />
          <Row label="Time" value={appointment.timeSlot} />
          <Row label="Type" value={(appointment.sessionType || '').replace(/^\w/, (c) => c.toUpperCase())} />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-ink"><Icon icon="fa-info-circle" className="mr-1 text-primary-text" /> Meta</h4>
          <Row label="Booked On" value={appointment.createdAt ? new Date(appointment.createdAt).toLocaleString() : '—'} />
          <Row label="Updated" value={appointment.updatedAt ? new Date(appointment.updatedAt).toLocaleString() : 'Never'} />
          <Row label="Session Focus" value={appointment.sessionFocus} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button onClick={onEdit} className={GHOST_BTN}><Icon icon="fa-edit" /> Edit</button>
        <button onClick={onClose} className={PRIMARY_BTN}><Icon icon="fa-check" /> Close</button>
      </div>
    </ModalShell>
  )
}

function EditAppointment({ appointment, onSave, onClose }) {
  const [form, setForm] = useState({
    studentName: appointment.studentName || '',
    studentEmail: appointment.studentEmail || '',
    studentPhone: appointment.studentPhone || '',
    date: appointment.date || '',
    timeSlot: appointment.timeSlot || '09:00',
    sessionType: appointment.sessionType || 'individual',
    status: appointment.status || 'confirmed',
    sessionFocus: appointment.sessionFocus || '',
  })

  const submit = (e) => {
    e.preventDefault()
    onSave({ ...form, updatedAt: new Date().toISOString() })
  }

  const field = 'space-y-1'
  const label = 'text-sm font-semibold text-ink'

  return (
    <ModalShell onClose={onClose} maxW="max-w-2xl">
      <h3 className="mb-4 text-lg font-extrabold text-ink">Edit Appointment</h3>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div className={field}>
          <label className={label}>Student Name</label>
          <input value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} className={`${INPUT} w-full`} required />
        </div>
        <div className={field}>
          <label className={label}>Email</label>
          <input type="email" value={form.studentEmail} onChange={(e) => setForm({ ...form, studentEmail: e.target.value })} className={`${INPUT} w-full`} required />
        </div>
        <div className={field}>
          <label className={label}>Phone</label>
          <input value={form.studentPhone} onChange={(e) => setForm({ ...form, studentPhone: e.target.value })} className={`${INPUT} w-full`} />
        </div>
        <div className={field}>
          <label className={label}>Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`${INPUT} w-full`} required />
        </div>
        <div className={field}>
          <label className={label}>Time</label>
          <select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} className={`${INPUT} w-full accent-[var(--primary-color)]`}>
            {TIME_SLOTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className={field}>
          <label className={label}>Session Type</label>
          <select value={form.sessionType} onChange={(e) => setForm({ ...form, sessionType: e.target.value })} className={`${INPUT} w-full accent-[var(--primary-color)]`}>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
          </select>
        </div>
        <div className={field}>
          <label className={label}>Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`${INPUT} w-full accent-[var(--primary-color)]`}>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>
        <div className={`${field} sm:col-span-2`}>
          <label className={label}>Session Focus / Notes</label>
          <textarea rows={3} value={form.sessionFocus} onChange={(e) => setForm({ ...form, sessionFocus: e.target.value })} className={`${INPUT} w-full`} />
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" className={`${PRIMARY_BTN} flex-1`}><Icon icon="fa-save" /> Save Changes</button>
          <button type="button" onClick={onClose} className={`${GHOST_BTN} flex-1`}>Cancel</button>
        </div>
      </form>
    </ModalShell>
  )
}

function AppointmentsManagement() {
  const [appointments, setAppointments] = useState(() => loadAppointments())
  const [dateFilter, setDateFilter] = useState('')
  const [counselorFilter, setCounselorFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [details, setDetails] = useState(null)
  const [editing, setEditing] = useState(null)

  const refresh = () => setAppointments(loadAppointments())

  useEffect(() => {
    const id = setInterval(refresh, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  const filtered = appointments.filter((a) => {
    const matchesDate = !dateFilter || a.date === dateFilter
    const matchesCounselor = !counselorFilter || a.counselorType === counselorFilter
    const matchesStatus = !statusFilter || a.status === statusFilter
    return matchesDate && matchesCounselor && matchesStatus
  })

  const stats = useMemo(() => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    return {
      today: appointments.filter((a) => isToday(new Date(a.date))).length,
      week: appointments.filter((a) => {
        const d = new Date(a.date)
        return d >= weekStart && d <= today
      }).length,
      pending: appointments.filter((a) => a.status === 'confirmed' && new Date(a.date) >= today).length,
      completed: appointments.filter((a) => a.status === 'completed').length,
    }
  }, [appointments])

  const toggleStatus = (id) => {
    const order = ['confirmed', 'completed', 'cancelled', 'no-show']
    const apt = appointments.find((a) => a.id === id)
    if (!apt) return
    apt.status = order[(order.indexOf(apt.status) + 1) % order.length]
    apt.updatedAt = new Date().toISOString()
    saveAppointments(appointments)
    refresh()
    notify(`Appointment status changed to ${apt.status}`, 'info')
  }

  const saveEdit = (updated) => {
    const list = appointments.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
    saveAppointments(list)
    refresh()
    setEditing(null)
    setDetails(null)
    notify('Appointment updated successfully!', 'success')
  }

  const exportCsv = () => {
    const headers = ['ID', 'Student Name', 'Student Email', 'Student Phone', 'Counselor Name', 'Counselor Specialty', 'Date', 'Time', 'Session Type', 'Status', 'Session Focus', 'Meeting Link', 'Created At', 'Updated At']
    const rows = filtered.map((a) => [
      a.id, a.studentName, a.studentEmail, a.studentPhone || '', a.counselorName, a.counselorSpecialty,
      a.date, a.timeSlot, a.sessionType, a.status, a.sessionFocus || '', a.meetingLink || '', a.createdAt, a.updatedAt || '',
    ])
    downloadFile([headers, ...rows].map((r) => r.map(csvEscape).join(',')).join('\n'), `appointments_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
    notify('Appointments exported successfully!', 'success')
  }

  return (
    <div className={CARD}>
      <SectionTitle icon="fa-calendar-check" title="Appointment Management" subtitle="Track and manage all counseling appointments" />

      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Today's Appointments", value: stats.today },
          { label: 'This Week', value: stats.week },
          { label: 'Pending', value: stats.pending },
          { label: 'Completed', value: stats.completed },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line-light bg-canvas/60 p-4 text-center">
            <p className="text-2xl font-extrabold text-ink">{s.value}</p>
            <p className="mt-0.5 text-xs font-semibold text-ink-3 uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-ink-3 uppercase">Date</label>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-ink-3 uppercase">Counselor</label>
          <select value={counselorFilter} onChange={(e) => setCounselorFilter(e.target.value)} className={`${INPUT} accent-[var(--primary-color)]`}>
            <option value="">All Counselors</option>
            {Object.entries(COUNSELORS).map(([key, c]) => (
              <option key={key} value={key}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-ink-3 uppercase">Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${INPUT} accent-[var(--primary-color)]`}>
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={refresh} className={GHOST_BTN}><Icon icon="fa-sync" /> Refresh</button>
          <button onClick={exportCsv} className={GHOST_BTN}><Icon icon="fa-download" /> Export</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-line-light text-xs font-semibold tracking-wide text-ink-3 uppercase">
              <th className="px-3 py-2">Student</th>
              <th className="px-3 py-2">Counselor</th>
              <th className="px-3 py-2">Date & Time</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Focus</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <EmptyRow colSpan={7} text="No appointments match the current filters." />}
            {filtered.map((a) => (
              <tr key={a.id} className="cursor-pointer border-b border-line-light/70 transition-colors last:border-0 hover:bg-surface-hover">
                <td className="px-3 py-2.5" onClick={() => setDetails(a)}>
                  <p className="font-bold text-ink">{a.studentName}</p>
                  <p className="text-xs text-ink-3">{a.studentEmail}</p>
                </td>
                <td className="px-3 py-2.5 text-ink-2">{a.counselorName}</td>
                <td className="px-3 py-2.5 text-ink-2">
                  {new Date(a.date).toLocaleDateString()}
                  <span className="ml-2 rounded-full bg-canvas px-2 py-0.5 text-xs font-semibold text-ink-2">{a.timeSlot}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`${PILL} bg-accent-purple/10 text-accent-purple`}>
                    <Icon icon={a.sessionType === 'group' ? 'fa-users' : 'fa-user'} /> {(a.sessionType || 'individual').replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`${PILL} ${STATUS_BADGE[a.status] || 'bg-canvas text-ink-2'}`}>
                    {(a.status || 'unknown').replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
                </td>
                <td className="max-w-[160px] truncate px-3 py-2.5 text-ink-2">{a.sessionFocus || '—'}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button title="View" onClick={() => setDetails(a)} className="flex h-8 w-8 items-center justify-center rounded-full border border-line-light text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
                      <Icon icon="fa-eye" />
                    </button>
                    <button title="Edit" onClick={() => setEditing(a)} className="flex h-8 w-8 items-center justify-center rounded-full border border-line-light text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
                      <Icon icon="fa-edit" />
                    </button>
                    <button title="Change Status" onClick={() => toggleStatus(a.id)} className="flex h-8 w-8 items-center justify-center rounded-full border border-line-light text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
                      <Icon icon="fa-toggle-on" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {details && <AppointmentDetails appointment={details} onClose={() => setDetails(null)} onEdit={() => setEditing(details)} />}
      {editing && <EditAppointment appointment={editing} onSave={saveEdit} onClose={() => setEditing(null)} />}
    </div>
  )
}

/* ---------- page ---------- */

export default function AdminPage() {
  const { t } = useLanguage()
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [moodData, setMoodData] = useState({})
  const [activityLog, setActivityLog] = useState([])

  useEffect(() => {
    setUsers(loadUsers())
    setAppointments(loadAppointments())
    setMoodData(loadMoodData())
    setActivityLog(getActivityLog())
    document.title = 'Counselor Portal - Campus Mindspace'
  }, [])

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <AdminTopBar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            <Icon icon="fa-shield-alt" className="mr-2 text-primary-text" />
            Administrator Dashboard
          </h1>
          <p className="mt-1 text-ink-2">Comprehensive analytics and management for Campus Mindspace</p>
          <div className="mt-3 h-1 w-20 rounded-full bg-[linear-gradient(90deg,var(--primary-color),var(--secondary-color))]" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon="fa-users" label="Total Users" value={users.length} sub="+12% this month" tint="linear-gradient(135deg,rgba(102,126,234,0.12),rgba(118,75,162,0.12))" color="#667eea" />
          <StatCard icon="fa-smile" label="Active Sessions" value={Math.floor(users.length * 0.3)} sub="Live now" tint="linear-gradient(135deg,rgba(46,173,75,0.12),rgba(5,150,105,0.12))" color="#2ead4b" />
          <StatCard icon="fa-calendar-check" label="Appointments" value={appointments.length} sub="This week" tint="linear-gradient(135deg,rgba(245,158,11,0.12),rgba(217,119,6,0.12))" color="#f59e0b" />
          <StatCard icon="fa-gamepad" label="Games Played" value={Math.floor(users.length * 4.5)} sub="+8% engagement" tint="linear-gradient(135deg,rgba(236,72,153,0.12),rgba(219,39,119,0.12))" color="#ec4899" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <MoodDistribution users={users} />
          <FeatureUsage />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CounselingDemand />
          <RegistrationTrends users={users} />
        </div>

        <div className="mt-6">
          <AdminActions users={users} appointments={appointments} moodData={moodData} activityLog={activityLog} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <RecentActivity />
          <div className="rounded-3xl border border-line-light bg-surface p-6 shadow-sm">
            <SectionTitle icon="fa-layer-group" title="Groups Overview" subtitle="Summary of the mood group ecosystem" />
            <GroupsOverview />
          </div>
        </div>

        <div className="mt-6">
          <GroupsManagement />
        </div>

        <div className="mt-6">
          <AppointmentsManagement />
        </div>

        <p className="mt-8 text-center text-xs text-ink-3">{t('footer_not_medical')}</p>
      </main>
    </div>
  )
}

function getActivityLog() {
  try {
    const raw = localStorage.getItem('campusMindspace_activityLog')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function GroupsOverview() {
  const [stats, setStats] = useState({})
  const [version, setVersion] = useState(0)
  useEffect(() => {
    setStats(buildGroupStats())
  }, [version])

  const active = Object.values(stats).filter((g) => g.memberCount > 0).length
  const members = Object.values(stats).reduce((s, g) => s + g.memberCount, 0)
  const msgs = Object.values(stats).reduce((s, g) => s + g.messagesToday, 0)

  return (
    <div className="space-y-4">
      {[
        { icon: 'fa-layer-group', label: 'Active Groups', value: active, tint: 'bg-primary/10 text-primary-text' },
        { icon: 'fa-user-friends', label: 'Total Members', value: members, tint: 'bg-accent-purple/10 text-accent-purple' },
        { icon: 'fa-comments', label: 'Messages Today', value: msgs, tint: 'bg-success/10 text-success' },
      ].map((s) => (
        <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-line-light bg-canvas/60 p-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${s.tint}`}>
            <Icon icon={s.icon} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-ink">{s.value}</p>
            <p className="text-xs font-semibold text-ink-3 uppercase">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
