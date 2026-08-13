import { useEffect, useState } from 'react'
import { useLanguage } from '../../../shared/LanguageProvider'
import { get, set as storageSet } from '../../../shared/storage'
import { notify } from '../../../shared/toast'
import Modal from '../components/Modal'
import SectionHeader from '../components/SectionHeader'

const SESSIONS = [
  {
    id: 'body_scan',
    title: 'Body Scan Meditation',
    description: 'A systematic journey through physical sensations',
    duration: 15,
    difficulty: 'Beginner',
    icon: 'fa-user',
    iconBg: 'bg-[linear-gradient(135deg,#667eea,#764ba2)]',
    tags: ['Relaxation', 'Body Awareness', 'Stress Relief'],
    instructions: [
      'Find a comfortable lying position',
      'Close your eyes and take three deep breaths',
      'Begin with your toes, noticing any sensations',
      'Slowly move your attention up through your body',
      'Spend 30-60 seconds on each body part',
      'Notice sensations without judgment',
      'Return to your breath when mind wanders',
      'End with full body awareness',
    ],
  },
  {
    id: 'focused_breathing',
    title: 'Focused Breathing',
    description: 'Simple breath awareness for stress relief',
    duration: 10,
    difficulty: 'Beginner',
    icon: 'fa-wind',
    iconBg: 'bg-[linear-gradient(135deg,#4facfe,#00f2fe)]',
    tags: ['Calming', 'Focus', 'Quick Practice'],
    instructions: [
      'Sit comfortably with spine straight',
      'Close eyes or soften gaze',
      'Notice your natural breathing rhythm',
      'Count breaths if helpful (1-10, then repeat)',
      'Focus on the sensation of breath',
      'Gently return attention when distracted',
      'Continue for the full duration',
      'End with gratitude for practice',
    ],
  },
  {
    id: 'walking_meditation',
    title: 'Walking Meditation',
    description: 'Mindful movement for active relaxation',
    duration: 20,
    difficulty: 'Intermediate',
    icon: 'fa-walking',
    iconBg: 'bg-[linear-gradient(135deg,#43e97b,#38f9d7)]',
    tags: ['Movement', 'Active', 'Outdoor'],
    instructions: [
      'Choose a quiet, safe path to walk',
      'Stand still and feel your feet on the ground',
      'Begin walking slowly and deliberately',
      'Notice the lifting, moving, and placing of each foot',
      'Feel the sensations in your legs and feet',
      'Maintain awareness of your surroundings',
      'If mind wanders, return to walking sensations',
      'End by standing still and feeling gratitude',
    ],
  },
  {
    id: 'loving_kindness',
    title: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion for yourself and others',
    duration: 12,
    difficulty: 'Intermediate',
    icon: 'fa-heart',
    iconBg: 'bg-[linear-gradient(135deg,#fa709a,#fee140)]',
    tags: ['Compassion', 'Relationships', 'Emotional'],
    instructions: [
      'Sit comfortably and close your eyes',
      'Take three deep, calming breaths',
      'Begin with self-compassion phrases',
      'Extend loving-kindness to a loved one',
      'Include a neutral person in your life',
      'Extend compassion to a difficult person',
      'Include all beings in your practice',
      'Rest in open-hearted awareness',
    ],
  },
]

const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Gentle Rain', icon: 'fa-cloud-rain' },
  { id: 'ocean', name: 'Ocean Waves', icon: 'fa-water' },
  { id: 'forest', name: 'Forest Birds', icon: 'fa-tree' },
  { id: 'zen', name: 'Zen Garden', icon: 'fa-om' },
]

const TIMER_PRESETS = [5, 10, 15, 20, 30, 45]
const QUICK_OPTIONS = [
  { minutes: 3, icon: 'fa-zap', label: '3-Min Reset' },
  { minutes: 5, icon: 'fa-coffee', label: '5-Min Break' },
  { minutes: 10, icon: 'fa-moon', label: '10-Min Calm' },
]

const QUICK_INSTRUCTIONS = [
  'Find a comfortable position',
  'Take three deep breaths',
  'Focus on your breathing',
  'Notice the rhythm of your breath',
  'Gently return attention when mind wanders',
  'End with a moment of gratitude',
]

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

function computeStreak(history) {
  if (!history.length) return 0
  const days = new Set(history.map((h) => new Date(h.completedAt || h.date).toDateString()))
  let streak = 0
  const d = new Date()
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1)
  while (days.has(d.toDateString())) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export default function MeditationSection() {
  const { t } = useLanguage()
  const [history, setHistory] = useState(() => get('meditationHistory', []))
  const [goals, setGoals] = useState(() => get('meditationGoals', []))
  const [goalInput, setGoalInput] = useState('')
  const [activeSession, setActiveSession] = useState(null)
  const [timerOpen, setTimerOpen] = useState(false)
  const [soundsOpen, setSoundsOpen] = useState(false)

  const stats = {
    sessions: history.length,
    minutes: history.reduce((sum, h) => sum + Math.floor((h.duration || 0) / 60), 0),
    streak: computeStreak(history),
  }

  const recordCompletion = (type, durationSeconds) => {
    const record = { type, duration: durationSeconds, completedAt: new Date().toISOString(), date: new Date().toDateString() }
    const next = [...history, record]
    setHistory(next)
    storageSet('meditationHistory', next)
  }

  const addGoal = () => {
    if (!goalInput.trim()) return
    const next = [...goals, { id: Date.now().toString(), text: goalInput.trim(), completed: false }]
    setGoals(next)
    storageSet('meditationGoals', next)
    setGoalInput('')
  }

  const toggleGoal = (id) => {
    const next = goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    setGoals(next)
    storageSet('meditationGoals', next)
  }

  const deleteGoal = (id) => {
    if (!window.confirm('Delete this goal?')) return
    const next = goals.filter((g) => g.id !== id)
    setGoals(next)
    storageSet('meditationGoals', next)
  }

  return (
    <div className="space-y-8">
      <SectionHeader title={t('meditation_title')} subtitle={t('meditation_subtitle')} />

      {/* Progress overview */}
      <section className="flex flex-wrap items-center justify-center gap-6 rounded-3xl border border-line-light bg-gradient-to-br from-sky-50 to-blue-50 p-6 shadow-md dark:from-primary/5 dark:to-primary/10">
        {[
          { icon: 'fa-check-circle', value: stats.sessions, label: 'Sessions Completed' },
          { icon: 'fa-clock', value: stats.minutes, label: 'Total Minutes' },
          { icon: 'fa-fire', value: stats.streak, label: 'Day Streak' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#10b981,#059669)] text-lg text-white shadow-md">
              <i className={`fas ${stat.icon}`} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-800 dark:text-ink">{stat.value}</div>
              <div className="text-xs font-medium text-gray-500 dark:text-ink-2">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Guided sessions */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-ink">Guided Meditation Sessions</h2>
          <p className="mt-1 text-ink-2">Follow-along sessions for every level</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SESSIONS.map((session) => (
            <div
              key={session.id}
              className="flex flex-col rounded-2xl border border-line-light bg-surface p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full text-xl text-white shadow-md ${session.iconBg}`}>
                <i className={`fas ${session.icon}`} />
              </div>
              <h3 className="text-lg font-bold text-ink">{session.title}</h3>
              <p className="mt-1 flex-1 text-sm text-ink-2">{session.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {session.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary-text">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-ink-2">
                <span className="flex items-center gap-1.5">
                  <i className="fas fa-clock" /> {session.duration} min
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    session.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-success/15 dark:text-success' : 'bg-amber-100 text-amber-700 dark:bg-warning/15 dark:text-warning'
                  }`}
                >
                  {session.difficulty}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSession({ ...session, quick: false })}
                className="mt-4 w-full rounded-xl bg-[linear-gradient(135deg,#667eea,#764ba2)] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.03]"
              >
                <i className="fas fa-play mr-2" />Start Session
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Quick meditation */}
      <section className="rounded-3xl border border-amber-200 bg-[linear-gradient(135deg,#fef3c7,#fde68a)] p-6 shadow-md dark:border-warning/30 dark:from-warning/10 dark:to-warning/20">
        <h2 className="text-lg font-bold text-amber-900 dark:text-warning">Quick Meditation</h2>
        <p className="mt-1 text-sm text-amber-800/80 dark:text-ink-2">Short guided sessions when you need a moment</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {QUICK_OPTIONS.map((q) => (
            <button
              key={q.minutes}
              type="button"
              onClick={() => setActiveSession({ title: `${q.minutes}-Minute Quick Meditation`, description: `A ${q.minutes}-minute guided meditation for instant calm`, duration: q.minutes, difficulty: 'Beginner', instructions: QUICK_INSTRUCTIONS, quick: true })}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-sm font-bold text-amber-800 shadow-md transition-transform hover:scale-[1.03] dark:bg-surface dark:text-warning"
            >
              <i className={`fas ${q.icon}`} />
              {q.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tools row */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => setTimerOpen(true)}
          className="group rounded-3xl border border-line-light bg-surface p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#7c3aed)] text-white shadow-md">
            <i className="fas fa-stopwatch" />
          </div>
          <h3 className="font-bold text-ink">Meditation Timer</h3>
          <p className="mt-1 text-sm text-ink-2">Set a custom countdown with gentle reminders</p>
        </button>
        <button
          type="button"
          onClick={() => setSoundsOpen(true)}
          className="group rounded-3xl border border-line-light bg-surface p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#7c3aed)] text-white shadow-md">
            <i className="fas fa-volume-up" />
          </div>
          <h3 className="font-bold text-ink">Ambient Sounds</h3>
          <p className="mt-1 text-sm text-ink-2">Soothing soundscapes for deep focus</p>
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('This will clear your saved meditation history locally.')) {
              setHistory([])
              storageSet('meditationHistory', [])
              notify('Meditation history cleared', 'info')
            }
          }}
          className="group rounded-3xl border border-line-light bg-surface p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#7c3aed)] text-white shadow-md">
            <i className="fas fa-chart-line" />
          </div>
          <h3 className="font-bold text-ink">Progress Tracker</h3>
          <p className="mt-1 text-sm text-ink-2">{stats.sessions} sessions • {stats.minutes} minutes total</p>
        </button>
      </section>

      {/* Goals */}
      <section className="rounded-3xl border border-green-200 bg-[linear-gradient(135deg,#f0fdf4,#dcfce7)] p-6 shadow-md dark:border-success/30 dark:from-success/10 dark:to-success/20">
        <h2 className="text-lg font-bold text-green-900 dark:text-success">Meditation Goals</h2>
        <p className="mt-1 text-sm text-green-800/80 dark:text-ink-2">What would you like to achieve with meditation?</p>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addGoal()
            }}
            placeholder="e.g. Meditate for 10 minutes daily"
            className="flex-1 rounded-xl border border-green-300 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-green-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={addGoal}
            className="rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-green-600"
          >
            {t('add_goal')}
          </button>
        </div>
        {goals.length > 0 && (
          <ul className="mt-4 space-y-2">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className={`flex items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-sm ${
                  goal.completed ? 'border-green-200 text-ink-3 line-through' : 'border-green-200 text-ink'
                }`}
              >
                <span className="flex-1">{goal.text}</span>
                <button type="button" onClick={() => toggleGoal(goal.id)} title={t('complete')} className="h-8 w-8 rounded-full bg-green-100 text-green-700 transition-colors hover:bg-green-200">
                  <i className="fas fa-check" />
                </button>
                <button type="button" onClick={() => deleteGoal(goal.id)} title={t('delete')} className="h-8 w-8 rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200">
                  <i className="fas fa-trash" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <GuidedSessionModal
        open={!!activeSession}
        session={activeSession}
        onClose={() => setActiveSession(null)}
        onComplete={recordCompletion}
      />
      <TimerModal open={timerOpen} onClose={() => setTimerOpen(false)} onComplete={recordCompletion} />
      <SoundsModal open={soundsOpen} onClose={() => setSoundsOpen(false)} />
    </div>
  )
}

function GuidedSessionModal({ open, session, onClose, onComplete }) {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [phase, setPhase] = useState('inhale')

  const totalSeconds = session ? session.duration * 60 : 0

  useEffect(() => {
    if (!open) {
      setRunning(false)
      setSeconds(0)
      setPhase('inhale')
    }
  }, [open])

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (running && seconds > 0 && seconds % 4 === 0) setPhase((p) => (p === 'inhale' ? 'exhale' : 'inhale'))
  }, [seconds, running])

  useEffect(() => {
    if (running && totalSeconds > 0 && seconds >= totalSeconds) {
      setRunning(false)
      onComplete(session.quick ? 'quick_meditation' : session.id, totalSeconds)
      notify('Meditation Complete! Well done!', 'success')
      setTimeout(onClose, 2500)
    }
  }, [seconds, running, totalSeconds, onComplete, onClose, session])

  if (!session) return null

  const pct = totalSeconds > 0 ? Math.min(100, (seconds / totalSeconds) * 100) : 0
  const step = Math.max(1, Math.floor((totalSeconds / session.instructions.length) / 60) || 1)
  const instructionIndex = Math.min(Math.floor(seconds / (step * 60)), session.instructions.length - 1)

  return (
    <Modal open={open} onClose={onClose} title={session.title} icon="fa-om" maxWidth="max-w-xl">
      <div className="text-center">
        <div
          className="mx-auto flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-light))] text-on-primary shadow-glow transition-transform ease-in-out"
          style={{
            width: 180,
            height: 180,
            transform: `scale(${phase === 'inhale' ? 1.15 : 1})`,
            transitionDuration: running ? '4s' : '0.3s',
          }}
        >
          <div>
            <div className="text-2xl font-bold">{formatTime(seconds)}</div>
            <div className="text-xs opacity-80">{phase === 'inhale' ? 'Breathe in' : 'Breathe out'}</div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-semibold text-ink-2">
          <span>{session.title}</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary-color),var(--secondary-color))] transition-all duration-1000" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-line-light bg-canvas p-4 text-center">
        <p className="text-sm font-medium text-ink">{session.instructions[instructionIndex] ?? session.instructions[0]}</p>
        <p className="mt-1 text-[11px] text-ink-3">Step {Math.min(instructionIndex + 1, session.instructions.length)} of {session.instructions.length}</p>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {!running ? (
          <button
            type="button"
            onClick={() => setRunning(true)}
            className="rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-6 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-transform hover:scale-105"
          >
            <i className="fas fa-play mr-2" />Start
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setRunning(false)}
              className="rounded-full bg-warning px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
            >
              <i className="fas fa-pause mr-2" />Pause
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false)
                setSeconds(0)
              }}
              className="rounded-full bg-danger px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
            >
              <i className="fas fa-stop mr-2" />Stop
            </button>
          </>
        )}
      </div>
    </Modal>
  )
}

function TimerModal({ open, onClose, onComplete }) {
  const [durationMin, setDurationMin] = useState(10)
  const [running, setRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(600)

  useEffect(() => {
    if (!open) {
      setRunning(false)
      setSecondsLeft(durationMin * 60)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (running && secondsLeft <= 0) {
      setRunning(false)
      setSecondsLeft(durationMin * 60)
      onComplete('timer', durationMin * 60)
      notify('Timer complete! Well done.', 'success')
    }
  }, [secondsLeft, running, durationMin, onComplete])

  const pct = durationMin > 0 ? ((durationMin * 60 - secondsLeft) / (durationMin * 60)) * 100 : 0
  const degrees = Math.round((pct / 100) * 360)

  const selectPreset = (min) => {
    setDurationMin(min)
    setSecondsLeft(min * 60)
  }

  return (
    <Modal open={open} onClose={onClose} title="Meditation Timer" icon="fa-stopwatch" maxWidth="max-w-md">
      <div className="flex flex-col items-center">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 200, height: 200, background: `conic-gradient(var(--primary-color) ${degrees}deg, var(--border-light) ${degrees}deg)` }}
        >
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-surface">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-ink">{formatTime(secondsLeft)}</div>
              <div className="text-xs text-ink-2">{running ? 'In progress' : 'Ready'}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {TIMER_PRESETS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => selectPreset(min)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                durationMin === min ? 'border-primary bg-primary text-on-primary' : 'border-line-light text-ink-2 hover:border-primary hover:text-primary-text'
              }`}
            >
              {min}m
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {!running ? (
            <button
              type="button"
              onClick={() => setRunning(true)}
              className="rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-6 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-transform hover:scale-105"
            >
              <i className="fas fa-play mr-2" />Start
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setRunning(false)}
                className="rounded-full bg-warning px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
              >
                <i className="fas fa-pause mr-2" />Pause
              </button>
              <button
                type="button"
                onClick={() => {
                  setRunning(false)
                  setSecondsLeft(durationMin * 60)
                }}
                className="rounded-full bg-danger px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
              >
                <i className="fas fa-stop mr-2" />Stop
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

function SoundsModal({ open, onClose }) {
  const [playing, setPlaying] = useState(null)
  const [volume, setVolume] = useState(70)

  return (
    <Modal open={open} onClose={onClose} title="Ambient Sounds" icon="fa-volume-up" maxWidth="max-w-md">
      <div className="grid grid-cols-2 gap-3">
        {AMBIENT_SOUNDS.map((sound) => (
          <button
            key={sound.id}
            type="button"
            onClick={() => setPlaying(playing === sound.id ? null : sound.id)}
            className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
              playing === sound.id ? 'border-primary bg-primary/10 shadow-md' : 'border-line-light bg-canvas hover:border-primary'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary-color),var(--secondary-color))] text-on-primary">
              <i className={`fas ${playing === sound.id ? 'fa-pause' : sound.icon}`} />
            </div>
            <div className="min-w-0 text-left">
              <h4 className="text-sm font-bold text-ink">{sound.name}</h4>
              {playing === sound.id && (
                <div className="mt-1 flex items-center gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="h-2 w-0.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <i className="fas fa-volume-down text-ink-2" />
        <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="flex-1 accent-[var(--primary-color)]" />
        <span className="text-xs font-semibold text-ink-2">{volume}%</span>
      </div>
      <p className="mt-3 text-center text-[11px] text-ink-3">Note: soundscapes are simulated in the demo build.</p>
    </Modal>
  )
}
