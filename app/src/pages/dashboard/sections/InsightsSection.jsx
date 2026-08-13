import { useMemo, useState } from 'react'
import { useLanguage } from '../../../shared/LanguageProvider'
import { get, set as storageSet } from '../../../shared/storage'
import { notify } from '../../../shared/toast'
import Modal from '../components/Modal'
import SectionHeader from '../components/SectionHeader'

const ts = (h) => new Date(h.timestamp || h.date).getTime()
const day = (h) => new Date(h.timestamp || h.date).toDateString()

function analyzeMood(history) {
  if (!history.length) return null
  const values = history.map((h) => Number(h.mood))
  const sorted = [...history].sort((a, b) => ts(a) - ts(b))
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  const best = sorted.reduce((b, c) => (Number(c.mood) > Number(b.mood) ? c : b))
  const worst = sorted.reduce((w, c) => (Number(c.mood) < Number(w.mood) ? c : w))
  const recent = sorted.slice(-7)
  const older = sorted.slice(-14, -7)
  const recentAvg = recent.reduce((a, h) => a + Number(h.mood), 0) / recent.length
  const olderAvg = older.length ? older.reduce((a, h) => a + Number(h.mood), 0) / older.length : recentAvg
  const scores = {}
  sorted.forEach((h) => (h.factors || []).forEach((f) => {
    scores[f] = scores[f] || []
    scores[f].push(Number(h.mood))
  }))
  return {
    avg,
    trend: recentAvg - olderAvg,
    bestDay: new Date(best.timestamp || best.date).toLocaleDateString(),
    worstDay: new Date(worst.timestamp || worst.date).toLocaleDateString(),
    topFactors: Object.entries(scores).map(([f, m]) => [f, m.reduce((a, b) => a + b, 0) / m.length]).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f]) => f),
  }
}

function analyzeTherapy(progress) {
  const entries = Object.values(progress || {})
  if (!entries.length) return null
  const completed = entries.filter((p) => p.completionDate).length
  return { completionRate: completed / entries.length, total: entries.length, completed }
}

function analyzeMeditation(history) {
  if (!history.length) return null
  const counts = {}
  history.forEach((h) => {
    if (h.type) counts[h.type] = (counts[h.type] || 0) + 1
  })
  return {
    avgDuration: history.reduce((a, h) => a + (h.duration || 0), 0) / history.length,
    frequency: new Set(history.map(day)).size,
    favorites: Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t),
  }
}

function buildRecommendations(mood, therapy, meditation) {
  const recs = []
  if (mood && mood.avg < 3) {
    recs.push({ id: 'mood-boost', priority: 'high', icon: 'fa-sun', title: 'Boost Your Mood', description: 'Your mood has been lower than usual. Consider trying some mood-boosting activities.', actions: ['Try the gratitude journal', 'Listen to uplifting music', 'Practice positive affirmations', 'Engage in physical activity'], time: '15-30 minutes', difficulty: 'Easy' })
  }
  if (mood && mood.trend < -0.1) {
    recs.push({ id: 'mood-trend', priority: 'medium', icon: 'fa-chart-line', title: 'Address Declining Mood', description: 'Your mood has been trending downward. Let\'s work on stabilizing it.', actions: ['Practice daily mood tracking', 'Identify mood triggers', 'Use therapy techniques more regularly', 'Maintain consistent sleep schedule'], time: '20-40 minutes', difficulty: 'Medium' })
  }
  if (therapy && therapy.completionRate < 0.5) {
    recs.push({ id: 'therapy-consistency', priority: 'medium', icon: 'fa-user-md', title: 'Improve Therapy Consistency', description: 'Regular therapy practice can help maintain mental wellness.', actions: ['Set therapy reminders', 'Try shorter, more frequent sessions', 'Explore different therapy techniques', 'Track therapy progress'], time: '10-20 minutes', difficulty: 'Easy' })
  }
  if (meditation && meditation.frequency < 3) {
    recs.push({ id: 'meditation-frequency', priority: 'low', icon: 'fa-om', title: 'Increase Meditation Practice', description: 'Regular meditation can help reduce stress and improve focus.', actions: ['Start with 5-minute sessions', 'Try different meditation types', 'Use guided meditation', 'Set meditation reminders'], time: '5-15 minutes', difficulty: 'Easy' })
  }
  return recs
}

function buildProgress(mood, therapy, meditation) {
  const p = {
    mood: mood ? Math.round((mood.avg / 5) * 100) : 50,
    sleep: 50,
    activity: 50,
    therapy: therapy ? Math.round(therapy.completionRate * 100) : 50,
    meditation: meditation ? Math.min(Math.round((meditation.frequency / 7) * 100), 100) : 50,
  }
  p.overall = Math.round((p.mood + p.sleep + p.activity + p.therapy + p.meditation) / 5)
  return p
}

const PRIORITY_STYLES = {
  high: 'bg-danger/10 text-danger',
  medium: 'bg-amber-400/15 text-amber-600',
  low: 'bg-primary/10 text-primary',
}

const BARS = [
  { id: 'mood', label: 'Mood', icon: 'fa-smile' },
  { id: 'sleep', label: 'Sleep', icon: 'fa-moon' },
  { id: 'activity', label: 'Activity', icon: 'fa-running' },
  { id: 'therapy', label: 'Therapy', icon: 'fa-user-md' },
  { id: 'meditation', label: 'Meditation', icon: 'fa-om' },
]

export default function InsightsSection() {
  const { t } = useLanguage()
  const [goals, setGoals] = useState(() => get('wellnessGoals', []))
  const [goalInput, setGoalInput] = useState('')
  const [detail, setDetail] = useState(null)

  const data = useMemo(() => {
    const mood = analyzeMood(get('moodHistory', []))
    const therapy = analyzeTherapy(get('therapyProgress', {}))
    const meditation = analyzeMeditation(get('meditationHistory', []))
    const correlations = []
    if (mood && (therapy || meditation)) {
      const strength = Math.random() * 0.6 - 0.3
      if (Math.abs(strength) > 0.3) {
        correlations.push({ description: strength > 0 ? 'Regular practice is associated with better mood' : 'Irregular practice is associated with better mood' })
      }
    }
    return { mood, therapy, meditation, correlations, recommendations: buildRecommendations(mood, therapy, meditation), progress: buildProgress(mood, therapy, meditation) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cards = [
    data.mood && { type: 'mood', icon: 'fa-smile', color: 'from-pink-500 to-rose-500', title: 'Mood Analysis', summary: `Your average mood is ${data.mood.avg.toFixed(1)}/5`, details: [`Best mood day: ${data.mood.bestDay}`, `Worst mood day: ${data.mood.worstDay}`, `Mood trend: ${data.mood.trend > 0 ? 'Improving' : 'Declining'}`, data.mood.topFactors.length ? `Top factors: ${data.mood.topFactors.join(', ')}` : 'No factors tracked yet'] },
    data.therapy && { type: 'therapy', icon: 'fa-user-md', color: 'from-blue-500 to-indigo-500', title: 'Therapy Progress', summary: `${data.therapy.completed} of ${data.therapy.total} exercises completed`, details: [`Completion rate: ${Math.round(data.therapy.completionRate * 100)}%`, 'Consistency: Steady', 'Effectiveness: High'] },
    data.meditation && { type: 'meditation', icon: 'fa-om', color: 'from-emerald-500 to-teal-500', title: 'Meditation Analysis', summary: `You average ${Math.round(data.meditation.avgDuration / 60)} min per session`, details: [`Active days: ${data.meditation.frequency}`, `Favorite: ${data.meditation.favorites[0] || 'Guided'}`, 'Consistency: Good'] },
    data.correlations.length > 0 && { type: 'correlation', icon: 'fa-project-diagram', color: 'from-amber-400 to-orange-500', title: 'Pattern Correlations', summary: `Found ${data.correlations.length} significant pattern`, details: data.correlations.map((c) => c.description) },
  ].filter(Boolean)

  const addGoal = () => {
    if (!goalInput.trim()) return
    const next = [...goals, { id: Date.now().toString(), text: goalInput.trim(), completed: false }]
    setGoals(next)
    storageSet('wellnessGoals', next)
    setGoalInput('')
    notify('Goal added', 'success')
  }

  const toggleGoal = (id) => {
    const next = goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    setGoals(next)
    storageSet('wellnessGoals', next)
  }

  const deleteGoal = (id) => {
    if (!window.confirm('Delete this goal?')) return
    const next = goals.filter((g) => g.id !== id)
    setGoals(next)
    storageSet('wellnessGoals', next)
  }

  const ringStyle = { background: `conic-gradient(var(--primary-color) ${data.progress.overall}%, var(--border) 0)` }

  return (
    <div className="space-y-8">
      <SectionHeader title={t('insights_title')} subtitle={t('insights_subtitle')} />

      {cards.length === 0 && (
        <div className="flex flex-col items-center rounded-3xl border border-line-light bg-surface p-10 text-center shadow-md">
          <i className="fas fa-chart-line mb-3 text-4xl text-ink-3" />
          <h3 className="font-bold text-ink">No insights yet</h3>
          <p className="mt-1 max-w-sm text-sm text-ink-2">Track your mood in Therapy, complete exercises, and finish meditation sessions to unlock personalized insights.</p>
        </div>
      )}

      {/* Overview cards */}
      {cards.length > 0 && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <button
              key={card.type}
              type="button"
              onClick={() => setDetail(card)}
              className="rounded-3xl border border-line-light bg-surface p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-xl text-white`}>
                <i className={`fas ${card.icon}`} />
              </div>
              <h3 className="mt-4 font-bold text-ink">{card.title}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{card.summary}</p>
              <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-ink-2">
                <i className="fas fa-eye" /> View details
              </p>
            </button>
          ))}
        </section>
      )}

      {/* Recommendations */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-ink">Recommendations</h2>
        {data.recommendations.length === 0 ? (
          <p className="rounded-3xl border border-line-light bg-surface p-6 text-center text-sm text-ink-2 shadow-md">Great job! No recommendations needed right now. Keep it up.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {data.recommendations.map((rec) => (
              <div key={rec.id} className="rounded-3xl border border-line-light bg-surface p-6 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-lg text-primary"><i className={`fas ${rec.icon}`} /></span>
                    <h3 className="font-bold text-ink">{rec.title}</h3>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${PRIORITY_STYLES[rec.priority]}`}>{rec.priority}</span>
                </div>
                <p className="mt-3 text-sm text-ink-2">{rec.description}</p>
                <ul className="mt-3 space-y-1.5">
                  {rec.actions.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-xs text-ink-2"><i className="fas fa-check mt-0.5 text-primary" />{a}</li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2 text-[11px] font-semibold text-ink-2">
                    <span className="rounded-full bg-canvas px-2.5 py-1"><i className="fas fa-clock mr-1" />{rec.time}</span>
                    <span className="rounded-full bg-canvas px-2.5 py-1"><i className="fas fa-signal mr-1" />{rec.difficulty}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => notify(`Starting: ${rec.title}`, 'success')}
                    className="rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-4 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
                  >
                    Start Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Wellness progress */}
      <section className="rounded-3xl border border-line-light bg-surface p-6 shadow-lg md:p-8">
        <h2 className="mb-6 text-xl font-bold text-ink">Wellness Progress</h2>
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center">
            <div className="flex h-44 w-44 items-center justify-center rounded-full p-3 shadow-inner" style={ringStyle}>
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-surface">
                <span className="text-4xl font-extrabold text-ink">{data.progress.overall}%</span>
                <span className="text-xs font-semibold text-ink-2">Overall Wellness</span>
              </div>
            </div>
          </div>
          <div className="w-full flex-1 space-y-4">
            {BARS.map((bar) => (
              <div key={bar.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold text-ink-2"><i className={`fas ${bar.icon} text-primary`} />{bar.label}</span>
                  <span className="font-bold text-ink">{data.progress[bar.id]}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary-color),var(--secondary-color))] transition-all" style={{ width: `${data.progress[bar.id]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness goals */}
      <section className="rounded-3xl border border-line-light bg-surface p-6 shadow-lg">
        <h2 className="text-xl font-bold text-ink">Wellness Goals</h2>
        <div className="mt-4 flex gap-2">
          <input
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addGoal()}
            placeholder="Add a wellness goal..."
            className="flex-1 rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none"
          />
          <button type="button" onClick={addGoal} className="rounded-xl bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105">
            <i className="fas fa-plus" />
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {goals.length === 0 ? (
            <p className="text-sm text-ink-3">No wellness goals yet. Add one above to start tracking.</p>
          ) : (
            goals.map((g) => (
              <div key={g.id} className="flex items-center justify-between gap-3 rounded-2xl bg-canvas px-4 py-3">
                <button type="button" onClick={() => toggleGoal(g.id)} className={`flex min-w-0 flex-1 items-center gap-3 text-left text-sm font-medium ${g.completed ? 'text-ink-3 line-through' : 'text-ink'}`}>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${g.completed ? 'border-success bg-success text-white' : 'border-line-light'}`}>
                    {g.completed && <i className="fas fa-check text-[10px]" />}
                  </span>
                  <span className="truncate">{g.text}</span>
                </button>
                <button type="button" onClick={() => deleteGoal(g.id)} className="shrink-0 text-ink-3 transition-colors hover:text-danger"><i className="fas fa-trash" /></button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.title} icon="fa-chart-line" maxWidth="max-w-md">
        {detail && (
          <div>
            <p className="rounded-2xl bg-canvas p-4 text-sm font-semibold text-ink">{detail.summary}</p>
            <ul className="mt-4 space-y-2">
              {detail.details.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-ink-2"><i className="fas fa-check mt-0.5 text-primary" />{d}</li>
              ))}
            </ul>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => { setDetail(null); notify('Recommendation added', 'success') }} className="flex-1 rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]">
                Get Recommendations
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
