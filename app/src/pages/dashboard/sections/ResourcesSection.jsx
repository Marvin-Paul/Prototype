import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../../shared/LanguageProvider'
import { get, set as storageSet } from '../../../shared/storage'
import { notify } from '../../../shared/toast'
import Modal from '../components/Modal'
import SectionHeader from '../components/SectionHeader'

const PLAYLIST = [
  { id: 'peaceful-piano', title: 'Peaceful Piano', duration: '3:45', file: 'audio/peaceful-piano.mp3' },
  { id: 'ocean-waves', title: 'Ocean Waves', duration: '5:20', file: 'audio/ocean-waves.mp3' },
  { id: 'forest-sounds', title: 'Forest Sounds', duration: '4:15', file: 'audio/forest-sounds.mp3' },
  { id: 'rain-sounds', title: 'Rain Sounds', duration: '6:30', file: 'audio/rain-sounds.mp3' },
  { id: 'meditation-bells', title: 'Meditation Bells', duration: '8:00', file: 'audio/meditation-bells.mp3' },
]

const PODCASTS = [
  { title: 'The Mindful Student', episodes: 24 },
  { title: 'Stress-Free Study', episodes: 18 },
  { title: 'College Wellness', episodes: 32 },
]

const GUIDED_AUDIO = [
  { title: 'Progressive Muscle Relaxation', note: '15-min guided relaxation' },
  { title: 'Sleep Stories', note: 'Gentle stories to drift off' },
  { title: 'Study Focus Music', note: 'Deep concentration tracks' },
]

const VIDEO_CATEGORIES = [
  {
    name: 'Study & Academic Success',
    videos: [
      { title: 'Study Motivation', url: 'https://www.youtube.com/watch?v=NTmHz-3wAQo', duration: '12:30' },
      { title: 'Effective Note-Taking', url: '#', duration: '8:45' },
      { title: 'Time Management', url: '#', duration: '15:20' },
    ],
  },
  {
    name: 'Mental Health & Wellness',
    videos: [
      { title: 'Self-Compassion', url: 'https://www.youtube.com/watch?v=wcoCmg-Uq-E', duration: '18:15' },
      { title: 'Work-Life Balance', url: 'https://www.youtube.com/watch?v=LO1mTELoj6o', duration: '22:10' },
      { title: 'Anxiety Management', url: '#', duration: '14:30' },
    ],
  },
]

const ARTICLE_CATEGORIES = [
  {
    name: 'Study & Learning',
    articles: [
      { title: 'The Science of Memory', readTime: '5 min read', tags: ['Memory', 'Study Tips'], body: 'Learn how spaced repetition and active recall can dramatically improve how well you retain information from lectures and textbooks.' },
      { title: 'Active Learning Strategies', readTime: '7 min read', tags: ['Learning', 'Engagement'], body: 'Discover techniques that turn passive reading into active understanding, from the Feynman method to elaborative interrogation.' },
    ],
  },
  {
    name: 'Mental Health',
    articles: [
      { title: 'Recognizing Burnout', readTime: '6 min read', tags: ['Burnout', 'Prevention'], body: 'Burnout is more than just tiredness. Learn the warning signs of emotional exhaustion and how to recover sustainably.' },
      { title: 'Building Support Networks', readTime: '8 min read', tags: ['Social', 'Relationships'], body: 'Meaningful connections protect your mental health. Explore practical ways to build and maintain a strong support system.' },
    ],
  },
]

const TOOL_CATEGORIES = [
  {
    name: 'Productivity',
    tools: ['Pomodoro Timer', 'Study Planner', 'Grade Calculator'],
  },
  {
    name: 'Wellness',
    tools: ['Sleep Tracker', 'Exercise Planner', 'Meal Planner'],
  },
]

const EMERGENCY_CONTACTS = [
  { name: 'National Suicide Prevention Lifeline', detail: '24/7 support', action: 'call', number: '988' },
  { name: 'Crisis Text Line', detail: 'Free 24/7 text support', action: 'text', number: 'HOME to 741741' },
  { name: 'Campus Counseling Center', detail: 'Mon-Fri 8AM-5PM', action: 'call', number: '(555) 123-4567' },
]

const EMERGENCY_APPS = ['My3 Support Network', 'Safety Plan']

const CATEGORIES = [
  { id: 'music', label: 'Music', icon: 'fa-music' },
  { id: 'videos', label: 'Videos', icon: 'fa-video' },
  { id: 'articles', label: 'Articles', icon: 'fa-newspaper' },
  { id: 'tools', label: 'Tools', icon: 'fa-tools' },
  { id: 'emergency', label: 'Emergency', icon: 'fa-phone-alt' },
]

function parseDuration(str) {
  const [m, s] = str.split(':').map(Number)
  return m * 60 + s
}

function formatSeconds(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function ResourcesSection() {
  const { t } = useLanguage()
  const [category, setCategory] = useState('music')
  const [currentTrackId, setCurrentTrackId] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [articleOpen, setArticleOpen] = useState(null)
  const [pomodoroOpen, setPomodoroOpen] = useState(false)
  const progressTimer = useRef(null)

  const currentTrack = PLAYLIST.find((tr) => tr.id === currentTrackId) ?? null
  const durationSecs = currentTrack ? parseDuration(currentTrack.duration) : 0
  const pct = durationSecs > 0 ? Math.min(100, (elapsed / durationSecs) * 100) : 0

  useEffect(() => {
    return () => clearInterval(progressTimer.current)
  }, [])

  useEffect(() => {
    if (!isPlaying || !currentTrack) return
    progressTimer.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(progressTimer.current)
  }, [isPlaying, currentTrack])

  useEffect(() => {
    if (isPlaying && durationSecs > 0 && elapsed >= durationSecs) {
      if (repeat) {
        setElapsed(0)
      } else {
        nextTrack()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, isPlaying, durationSecs])

  const selectTrack = (id) => {
    if (currentTrackId === id) return
    setCurrentTrackId(id)
    setElapsed(0)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (!currentTrack) {
      selectTrack(PLAYLIST[0].id)
      return
    }
    setIsPlaying((p) => !p)
  }

  const nextTrack = () => {
    if (!currentTrackId) return
    const idx = PLAYLIST.findIndex((tr) => tr.id === currentTrackId)
    const next = shuffle ? PLAYLIST[Math.floor(Math.random() * PLAYLIST.length)].id : PLAYLIST[(idx + 1) % PLAYLIST.length].id
    setCurrentTrackId(next)
    setElapsed(0)
    setIsPlaying(true)
  }

  const prevTrack = () => {
    if (!currentTrackId) return
    const idx = PLAYLIST.findIndex((tr) => tr.id === currentTrackId)
    const prev = PLAYLIST[(idx - 1 + PLAYLIST.length) % PLAYLIST.length].id
    setCurrentTrackId(prev)
    setElapsed(0)
    setIsPlaying(true)
  }

  const seek = (e) => {
    if (!currentTrack) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    setElapsed(Math.floor(ratio * durationSecs))
  }

  const switchCategory = (id) => {
    if (id !== 'music') {
      setIsPlaying(false)
    }
    setCategory(id)
  }

  return (
    <div className="space-y-8">
      <SectionHeader title={t('resources_title')} subtitle={t('resources_subtitle')} />

      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => switchCategory(cat.id)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              category === cat.id
                ? 'bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] text-on-primary shadow-md'
                : 'border border-line-light bg-surface text-ink-2 hover:border-primary hover:text-primary-text'
            }`}
          >
            <i className={`fas ${cat.icon}`} />
            {cat.label}
          </button>
        ))}
      </div>

      {category === 'music' && (
        <section className="mx-auto max-w-3xl space-y-5">
          {/* Player */}
          <div className="rounded-3xl border border-line-light bg-surface p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-ink">{currentTrack ? currentTrack.title : 'Calming Music'}</h3>
                <p className="text-xs text-ink-2">Campus Mindspace</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShuffle((s) => !s)
                    notify(shuffle ? 'Shuffle off' : 'Shuffle on', 'info')
                  }}
                  title="Shuffle"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${shuffle ? 'border-primary bg-primary/10 text-primary-text' : 'border-line-light text-ink-2'}`}
                >
                  <i className="fas fa-random" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRepeat((r) => !r)
                    notify(repeat ? 'Repeat off' : 'Repeat on', 'info')
                  }}
                  title="Repeat"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${repeat ? 'border-primary bg-primary/10 text-primary-text' : 'border-line-light text-ink-2'}`}
                >
                  <i className="fas fa-repeat" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <button type="button" onClick={prevTrack} className="h-10 w-10 rounded-full text-ink-2 transition-colors hover:text-primary-text">
                <i className="fas fa-step-backward" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] text-on-primary shadow-glow transition-transform hover:scale-110"
              >
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
              </button>
              <button type="button" onClick={nextTrack} className="h-10 w-10 rounded-full text-ink-2 transition-colors hover:text-primary-text">
                <i className="fas fa-step-forward" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-medium text-ink-2">{formatSeconds(elapsed)}</span>
              <div
                className="h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-line"
                onClick={seek}
                title="Seek"
              >
                <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary-color),var(--secondary-color))]" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-medium text-ink-2">{currentTrack ? currentTrack.duration : '0:00'}</span>
            </div>
          </div>

          {/* Playlist */}
          <div className="overflow-hidden rounded-3xl border border-line-light bg-surface shadow-md">
            {PLAYLIST.map((track, i) => (
              <button
                key={track.id}
                type="button"
                onClick={() => selectTrack(track.id)}
                className={`flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-colors ${
                  currentTrackId === track.id ? 'bg-primary/5' : 'hover:bg-surface-hover'
                }`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className="w-4 text-sm text-ink-3">{i + 1}</span>
                  <span className={`h-2 w-2 rounded-full ${currentTrackId === track.id && isPlaying ? 'animate-pulse bg-primary' : 'bg-ink-3'}`} />
                  <span className={`truncate text-sm font-medium ${currentTrackId === track.id ? 'text-primary-text' : 'text-ink'}`}>{track.title}</span>
                </div>
                <span className="shrink-0 text-xs text-ink-2">{track.duration}</span>
              </button>
            ))}
          </div>

          {/* Podcasts + guided audio */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-line-light bg-surface p-6 shadow-md">
              <h3 className="mb-4 font-bold text-ink">Wellness Podcasts</h3>
              <div className="space-y-2">
                {PODCASTS.map((p) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => notify('Podcast playback coming soon', 'info')}
                    className="flex w-full items-center justify-between rounded-xl bg-canvas px-4 py-3 text-left transition-colors hover:border hover:border-primary"
                  >
                    <span className="text-sm font-medium text-ink">{p.title}</span>
                    <span className="flex items-center gap-2 text-xs text-ink-2">
                      {p.episodes} episodes <i className="fas fa-play text-primary-text" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-line-light bg-surface p-6 shadow-md">
              <h3 className="mb-4 font-bold text-ink">Guided Audio</h3>
              <div className="space-y-2">
                {GUIDED_AUDIO.map((a) => (
                  <button
                    key={a.title}
                    type="button"
                    onClick={() => notify('Guided audio playback coming soon', 'info')}
                    className="flex w-full items-center justify-between rounded-xl bg-canvas px-4 py-3 text-left transition-colors hover:border hover:border-primary"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{a.title}</p>
                      <p className="text-xs text-ink-3">{a.note}</p>
                    </div>
                    <i className="fas fa-headphones text-primary-text" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {category === 'videos' && (
        <section className="mx-auto max-w-4xl space-y-5">
          {VIDEO_CATEGORIES.map((cat) => (
            <div key={cat.name} className="rounded-3xl border border-line-light bg-surface p-6 shadow-md">
              <h3 className="mb-4 font-bold text-ink">{cat.name}</h3>
              <div className="space-y-2">
                {cat.videos.map((v) => (
                  <a
                    key={v.title}
                    href={v.url === '#' ? undefined : v.url}
                    target={v.url === '#' ? undefined : '_blank'}
                    rel="noreferrer"
                    className="flex items-center gap-4 rounded-xl bg-canvas px-4 py-3 transition-colors hover:bg-surface-hover"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--primary-color),var(--secondary-color))] text-on-primary">
                      <i className="fas fa-play text-xs" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h5 className="truncate text-sm font-medium text-ink">{v.title}</h5>
                    </div>
                    <span className="shrink-0 rounded-full bg-ink-3/10 px-2 py-1 text-[10px] font-semibold text-ink-2">{v.duration}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {category === 'articles' && (
        <section className="mx-auto max-w-4xl space-y-5">
          {ARTICLE_CATEGORIES.map((cat) => (
            <div key={cat.name} className="rounded-3xl border border-line-light bg-surface p-6 shadow-md">
              <h3 className="mb-4 font-bold text-ink">{cat.name}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {cat.articles.map((a) => (
                  <button
                    key={a.title}
                    type="button"
                    onClick={() => setArticleOpen(a)}
                    className="rounded-2xl border border-line-light bg-canvas p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                  >
                    <h5 className="font-bold text-ink">{a.title}</h5>
                    <p className="mt-1 flex flex-wrap gap-1.5">
                      <span className="text-xs text-ink-2">{a.readTime}</span>
                      {a.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary-text">{tag}</span>
                      ))}
                    </p>
                    <p className="mt-2 text-xs text-ink-2">Click to read</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {category === 'tools' && (
        <section className="mx-auto max-w-4xl space-y-5">
          {TOOL_CATEGORIES.map((cat) => (
            <div key={cat.name} className="rounded-3xl border border-line-light bg-surface p-6 shadow-md">
              <h3 className="mb-4 font-bold text-ink">{cat.name}</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {cat.tools.map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => {
                      if (tool === 'Pomodoro Timer') setPomodoroOpen(true)
                      else notify('Coming soon', 'info')
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-line-light bg-canvas px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                  >
                    <i className="fas fa-toolbox text-primary-text" />
                    <span className="text-sm font-medium text-ink">{tool}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {category === 'emergency' && (
        <section className="mx-auto max-w-3xl space-y-5">
          <div className="rounded-3xl bg-[linear-gradient(135deg,#dc2626,#b91c1c)] p-6 text-center text-white shadow-xl">
            <i className="fas fa-exclamation-triangle mb-2 text-3xl" />
            <h3 className="text-xl font-bold">If you are in crisis, reach out now</h3>
            <p className="mt-1 text-sm text-white/85">Help is available 24/7. You are not alone.</p>
          </div>
          <div className="space-y-3">
            {EMERGENCY_CONTACTS.map((c) => (
              <div key={c.name} className="flex items-center justify-between gap-3 rounded-2xl border border-line-light bg-surface p-5 shadow-md">
                <div>
                  <h4 className="font-bold text-ink">{c.name}</h4>
                  <p className="text-xs text-ink-2">{c.detail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`${c.action === 'call' ? 'Call' : 'Text'} ${c.number}?`)) notify(`${c.action === 'call' ? 'Calling' : 'Texting'} ${c.number}...`, 'info')
                  }}
                  className="shrink-0 rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-4 py-2 text-xs font-bold text-on-primary shadow-md transition-transform hover:scale-105"
                >
                  {c.action === 'call' ? 'Call' : 'Text'}
                </button>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-line-light bg-surface p-6 shadow-md">
            <h3 className="mb-4 font-bold text-ink">Helpful Apps</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {EMERGENCY_APPS.map((app) => (
                <div key={app} className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-4">
                  <span className="text-sm font-medium text-ink">{app}</span>
                  <button
                    type="button"
                    onClick={() => notify('Download link coming soon', 'info')}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary-text transition-colors hover:bg-primary hover:text-on-primary"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Article reader */}
      <Modal open={!!articleOpen} onClose={() => setArticleOpen(null)} title={articleOpen?.title} icon="fa-newspaper" maxWidth="max-w-xl">
        {articleOpen && (
          <div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {articleOpen.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary-text">{tag}</span>
              ))}
              <span className="rounded-full bg-ink-3/10 px-2.5 py-1 text-[11px] font-semibold text-ink-2">{articleOpen.readTime}</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-2">{articleOpen.body}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-2">
              This is a placeholder preview for the article in the React build. Bookmark it and read the full version in the prototype to stay on top of your wellbeing.
            </p>
          </div>
        )}
      </Modal>

      <PomodoroModal open={pomodoroOpen} onClose={() => setPomodoroOpen(false)} />
    </div>
  )
}

function PomodoroModal({ open, onClose }) {
  const { t } = useLanguage()
  const [workMin, setWorkMin] = useState(25)
  const [breakMin, setBreakMin] = useState(5)
  const [mode, setMode] = useState('work')
  const [running, setRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [completed, setCompleted] = useState(() => get('pomodoroStats', 0))

  useEffect(() => {
    if (!open) {
      setRunning(false)
      setSecondsLeft(workMin * 60)
      setMode('work')
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
      if (mode === 'work') {
        const next = completed + 1
        setCompleted(next)
        storageSet('pomodoroStats', next)
        setMode('break')
        setSecondsLeft(breakMin * 60)
        notify('Work session complete! Time for a break.', 'success')
      } else {
        setMode('work')
        setSecondsLeft(workMin * 60)
        notify('Break over. Ready to focus?', 'info')
      }
    }
  }, [secondsLeft, running, mode, workMin, breakMin, completed])

  const switchMode = (m) => {
    setMode(m)
    setSecondsLeft((m === 'work' ? workMin : breakMin) * 60)
  }

  return (
    <Modal open={open} onClose={onClose} title="Pomodoro Timer" icon="fa-stopwatch" maxWidth="max-w-md">
      <div className="flex items-center justify-center gap-2">
        {[
          { id: 'work', label: 'Focus' },
          { id: 'break', label: 'Break' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => switchMode(m.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              mode === m.id ? 'bg-primary text-on-primary' : 'bg-canvas text-ink-2 hover:text-primary-text'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <div className={`inline-flex h-40 w-40 items-center justify-center rounded-full border-8 text-3xl font-extrabold ${mode === 'work' ? 'border-primary text-ink' : 'border-success text-ink'}`}>
          {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs">
        <label className="flex items-center gap-2 rounded-full bg-canvas px-3 py-2 font-semibold text-ink-2">
          Focus <input type="number" min={1} max={90} value={workMin} onChange={(e) => setWorkMin(Number(e.target.value))} className="w-12 rounded-md border border-line bg-surface px-1 py-0.5 text-center text-ink" />
        </label>
        <label className="flex items-center gap-2 rounded-full bg-canvas px-3 py-2 font-semibold text-ink-2">
          Break <input type="number" min={1} max={30} value={breakMin} onChange={(e) => setBreakMin(Number(e.target.value))} className="w-12 rounded-md border border-line bg-surface px-1 py-0.5 text-center text-ink" />
        </label>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-6 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-transform hover:scale-105"
        >
          <i className={`fas ${running ? 'fa-pause' : 'fa-play'} mr-2`} />
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false)
            switchMode('work')
          }}
          className="rounded-full bg-danger px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
        >
          <i className="fas fa-stop mr-2" />Reset
        </button>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-ink-2">
        Focus sessions completed: <span className="text-primary-text">{completed}</span>
      </p>
    </Modal>
  )
}
