import { useState } from 'react'
import Icon from '../../../../shared/Icon'
import { get, set as storageSet } from '../../../../shared/storage'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const MOOD_LEVELS = [
  { value: 1, icon: 'fa-sad-tear', label: 'Terrible' },
  { value: 2, icon: 'fa-frown', label: 'Poor' },
  { value: 3, icon: 'fa-meh', label: 'Okay' },
  { value: 4, icon: 'fa-smile', label: 'Good' },
  { value: 5, icon: 'fa-laugh', label: 'Excellent' },
]

const FACTORS = ['sleep', 'exercise', 'social', 'work']

function iconFor(avg) {
  if (!avg) return 'fa-meh'
  if (avg >= 4.5) return 'fa-laugh'
  if (avg >= 3.5) return 'fa-smile'
  if (avg >= 2.5) return 'fa-meh'
  if (avg >= 1.5) return 'fa-frown'
  return 'fa-sad-tear'
}

export default function MoodCheckGame() {
  const [mood, setMood] = useState(null)
  const [factors, setFactors] = useState([])

  const history = get('moodHistory', [])
  const today = new Date().toDateString()
  const todayEntry = [...history].reverse().find((e) => new Date(e.date || e.timestamp).toDateString() === today)

  const weekAvg = () => {
    const weekAgo = Date.now() - 7 * 86400000
    const recent = history.filter((e) => new Date(e.timestamp).getTime() >= weekAgo)
    if (!recent.length) return null
    return recent.reduce((sum, e) => sum + e.mood, 0) / recent.length
  }

  const trend = () => {
    const now = Date.now()
    const recent = history.filter((e) => new Date(e.timestamp).getTime() >= now - 7 * 86400000)
    const older = history.filter((e) => {
      const t = new Date(e.timestamp).getTime()
      return t >= now - 14 * 86400000 && t < now - 7 * 86400000
    })
    if (!recent.length && !older.length) return 'fa-arrow-right'
    const avg = (arr) => (arr.length ? arr.reduce((s, e) => s + e.mood, 0) / arr.length : 0)
    const diff = avg(recent) - avg(older)
    if (diff > 0.25) return 'fa-arrow-up'
    if (diff < -0.25) return 'fa-arrow-down'
    return 'fa-arrow-right'
  }

  const toggleFactor = (f) => {
    setFactors((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))
  }

  const save = () => {
    if (!mood) {
      notify('Select a mood first!', 'warning')
      return
    }
    const level = MOOD_LEVELS.find((m) => m.value === mood)
    const next = [
      ...history,
      { mood, moodText: `${level.label}`, factors, note: '', timestamp: new Date().toISOString(), date: new Date().toDateString() },
    ]
    storageSet('moodHistory', next)
    setMood(null)
    setFactors([])
    notify('Check-in saved!', 'success')
  }

  return (
    <GameCard
      icon="fa-smile"
      title="Mood Check-in"
      description="Track your emotional well-being and get personalized insights!"
      stats={[
        { label: 'Today', value: todayEntry ? MOOD_LEVELS.find((m) => m.value === todayEntry.mood)?.icon ?? 'fa-meh' : '--' },
        { label: 'Week Avg', value: iconFor(weekAvg()) },
        { label: 'Trend', value: trend() },
      ]}
      controls={
        <button type="button" onClick={save} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90">
          <Icon icon="fa-save" className="mr-2" />
          Save Check-in
        </button>
      }
    >
      <div className="flex flex-wrap justify-center gap-2">
        {MOOD_LEVELS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMood(m.value)}
            className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-2 text-center transition-all ${
              mood === m.value ? 'border-primary bg-primary/10 shadow-md' : 'border-line-light bg-canvas hover:border-primary'
            }`}
          >
            <Icon icon={m.icon} className="text-2xl" />
            <span className="text-[10px] font-semibold text-ink-2">{m.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 mb-2 text-sm font-semibold text-ink-2">What factors are affecting your mood?</p>
      <div className="flex flex-wrap gap-2">
        {FACTORS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => toggleFactor(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              factors.includes(f) ? 'border-primary bg-primary/10 text-primary-text' : 'border-line-light bg-canvas text-ink-2 hover:border-primary hover:text-primary-text'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </GameCard>
  )
}
