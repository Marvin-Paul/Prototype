import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../shared/ThemeProvider'
import { useLanguage } from '../../shared/LanguageProvider'
import VideoBackground from '../../shared/VideoBackground'

/* ---------- Data ---------- */

const FEATURES = [
  { icon: 'fa-user-md', label: 'Professional Counseling' },
  { icon: 'fa-brain', label: 'Mental Health Tools' },
  { icon: 'fa-users', label: 'Peer Support Groups' },
  { icon: 'fa-chart-line', label: 'Progress Tracking' },
]

const STATS = [
  { num: '10K+', label: 'Students Helped' },
  { num: '24/7', label: 'Support Available' },
  { num: '95%', label: 'Success Rate' },
  { num: '50+', label: 'Counselors' },
]

const TESTIMONIALS = [
  {
    quote: 'Campus Mindspace helped me manage my anxiety during finals. The meditation sessions were a game-changer!',
    name: 'Sarah M.',
    role: 'Psychology Major',
  },
  {
    quote: 'The group chat feature connected me with amazing people going through similar struggles. I feel less alone now.',
    name: 'Alex K.',
    role: 'Engineering Student',
  },
  {
    quote: "The progress tracking helped me see how much I've improved. It's incredibly motivating!",
    name: 'Maria L.',
    role: 'Business Major',
  },
]

const STEPS = [
  {
    num: '1',
    title: 'Create Account',
    desc: 'Sign up with your university email to access all features',
    icon: 'fa-user-plus',
  },
  {
    num: '2',
    title: 'Check Your Mood',
    desc: 'Complete a quick mood assessment to personalize your experience',
    icon: 'fa-heart',
  },
  {
    num: '3',
    title: 'Start Your Journey',
    desc: 'Access therapy resources, meditation, and connect with peers',
    icon: 'fa-rocket',
  },
]

const PARTICLES = [
  { style: { top: '15%', left: '8%', animationDelay: '0s', animationDuration: '3s' } },
  { style: { top: '8%', right: '15%', animationDelay: '0.8s', animationDuration: '4s' } },
  { style: { bottom: '25%', left: '12%', animationDelay: '1.6s', animationDuration: '3.5s' } },
  { style: { bottom: '15%', right: '8%', animationDelay: '2.4s', animationDuration: '4.2s' } },
  { style: { top: '45%', left: '3%', animationDelay: '3.2s', animationDuration: '3.8s' } },
  { style: { top: '35%', right: '5%', animationDelay: '1.2s', animationDuration: '3.2s' } },
  { style: { bottom: '45%', left: '25%', animationDelay: '2.8s', animationDuration: '4.5s' } },
  { style: { top: '65%', right: '25%', animationDelay: '0.4s', animationDuration: '3.6s' } },
]

/* ---------- Loading overlay ---------- */

function LoadingOverlay() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loading')

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.random() * 15))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setPhase('hiding'), 500)
      return () => clearTimeout(t)
    }
  }, [progress])

  useEffect(() => {
    if (phase === 'hiding') {
      const t = setTimeout(() => setPhase('done'), 500)
      return () => clearTimeout(t)
    }
  }, [phase])

  if (phase === 'done') return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[linear-gradient(135deg,#2d6a5f_0%,#1d4a3f_100%)] transition-opacity duration-500 ${
        phase === 'hiding' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center text-white">
        <div className="mx-auto mb-12 flex h-[120px] w-[120px] animate-pulse-soft items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-[3rem] backdrop-blur-xl">
          <i className="fas fa-brain" />
        </div>
        <h2 className="mb-4 bg-gradient-to-br from-white to-[#00d4cc] bg-clip-text text-3xl font-bold text-transparent">
          Campus Mindspace
        </h2>
        <p className="mb-12 text-lg text-white/80">Loading your wellness journey...</p>
        <div className="mx-auto w-[300px]">
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#00b5ad,#00d4cc)] shadow-[0_0_20px_rgba(0,181,173,0.5)] transition-all duration-300"
              style={{ width: `${Math.round(progress)}%` }}
            />
          </div>
          <div className="text-center text-lg font-semibold">{Math.round(progress)}%</div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Controls ---------- */

function ThemeSwitcher() {
  const { accent, setAccent, accents } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="fixed right-6 top-4 z-[999]">
      <button
        type="button"
        title="Toggle Theme"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-white/30 bg-white/95 text-xl text-primary shadow-md backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
      >
        <i className="fas fa-moon" />
      </button>
      <div
        className={`absolute right-0 top-[60px] min-w-[200px] rounded-2xl border border-white/30 bg-white/95 p-4 shadow-lg backdrop-blur-xl transition-all duration-300 ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2.5 opacity-0'
        }`}
      >
        {accents.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={() => {
              setAccent(a.key)
              setOpen(false)
            }}
            className={`flex w-full items-center gap-4 rounded-lg px-4 py-2 text-left text-sm font-medium transition-all ${
              accent === a.key
                ? 'bg-[rgba(0,181,173,0.15)]'
                : 'hover:bg-[rgba(0,181,173,0.1)]'
            }`}
          >
            <span
              className="h-6 w-6 rounded-full border-2 border-white/50 shadow-[inset_0_0_0_2px_rgba(0,0,0,0.1)]"
              style={{ background: a.preview }}
            />
            <span className="text-ink">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function LanguageSelect() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="fixed left-6 top-4 z-[999] rounded-xl border border-white/30 bg-white/95 px-4 py-1 shadow-md backdrop-blur-xl">
      <select
        title="Select Language"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="bg-transparent py-1 font-sans text-sm text-ink-2 outline-none transition-colors hover:text-primary"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  )
}

/* ---------- Landing page ---------- */

export default function LandingPage() {
  const { overlayGradient } = useTheme()
  const { t } = useLanguage()
  const [slide, setSlide] = useState(0)
  const timerRef = useRef(null)

  const restartTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % TESTIMONIALS.length)
    }, 8000)
  }

  useEffect(() => {
    restartTimer()
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goToSlide = (i) => {
    setSlide(i)
    restartTimer()
  }

  return (
    <>
      <VideoBackground overlayGradient={overlayGradient} />
      <LoadingOverlay />
      <LanguageSelect />
      <ThemeSwitcher />

      <main className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden p-8">
        {/* decorative dotted pattern */}
        <div
          className="pointer-events-none absolute -left-1/2 -top-1/2 h-[200%] w-[200%] animate-float-slow"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 w-full max-w-[1200px] text-center">
          {/* Hero */}
          <section className="mb-16 flex flex-col gap-12">
            <div className="flex flex-wrap items-center justify-between gap-16">
              <div className="min-w-[320px] flex-1">
                <h1
                  className="animate-typing mb-6 overflow-hidden whitespace-nowrap border-r-[3px] border-white bg-gradient-to-br from-white to-indigo-100 bg-clip-text font-extrabold tracking-[-0.02em] text-transparent"
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}
                >
                  {t('welcome_title')}
                </h1>
                <p className="mb-6 text-xl font-light tracking-[0.01em] text-white/90">
                  {t('welcome_subtitle')}
                </p>
                <p className="mx-auto max-w-[600px] text-lg leading-[1.7] text-white/80">
                  {t('welcome_description')}
                </p>

                <div className="mx-auto mt-8 grid max-w-[400px] grid-cols-2 gap-6">
                  {FEATURES.map((f, i) => (
                    <div
                      key={f.label}
                      className="animate-slide-up flex items-center gap-4 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
                      style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                    >
                      <i className={`fas ${f.icon} w-6 text-center text-lg text-white/90`} />
                      <span className="text-sm font-medium text-white/90">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mood visualization */}
              <div className="relative flex h-[250px] w-[250px] animate-fade-scale items-center justify-center">
                <div className="absolute -inset-2.5 animate-pulse-ring rounded-full border-2 border-white/30" />
                <div className="animate-pulse-soft relative z-[2] flex h-[150px] w-[150px] items-center justify-center rounded-full border-[3px] border-white/30 bg-white/15 text-[4rem] text-white shadow-glow backdrop-blur-xl">
                  <i className="fas fa-brain" />
                </div>
                <div className="absolute inset-0">
                  {PARTICLES.map((p, i) => (
                    <span
                      key={i}
                      className="absolute h-3 w-3 animate-float-slow rounded-full bg-white/60 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      style={p.style}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl md:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="animate-fade-up text-center"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                >
                  <div className="mb-1 bg-gradient-to-br from-white to-[#00d4cc] bg-clip-text text-4xl font-bold text-transparent">
                    {s.num}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-[0.05em] text-white/80">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-16 text-center">
            <h2 className="mb-1 text-3xl font-bold text-white">What Students Say</h2>
            <p className="mb-12 text-lg text-white/80">Real experiences from our community</p>
            <div className="relative mx-auto max-w-[800px] overflow-hidden rounded-3xl">
              <div className="animate-fade-up rounded-3xl border border-white/30 bg-white/95 p-12 shadow-xl backdrop-blur-xl">
                <div className="mb-6 text-[3rem] opacity-30" style={{ color: 'var(--primary-color)' }}>
                  <i className="fas fa-quote-left" />
                </div>
                <p className="relative mb-8 text-lg italic leading-[1.6]" style={{ color: 'var(--text-primary)' }}>
                  “{TESTIMONIALS[slide].quote}”
                </p>
                <div className="flex items-center justify-center gap-6">
                  <div
                    className="flex h-[60px] w-[60px] items-center justify-center rounded-full text-[1.5rem] text-white"
                    style={{ background: 'var(--primary-gradient)' }}
                  >
                    <i className="fas fa-user" />
                  </div>
                  <div className="text-left">
                    <h4 className="mb-1 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {TESTIMONIALS[slide].name}
                    </h4>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {TESTIMONIALS[slide].role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to testimonial slide ${i + 1}`}
                  onClick={() => goToSlide(i)}
                  className={`h-3 w-3 rounded-full border-none transition-all duration-300 ${
                    slide === i ? 'scale-125 bg-white' : 'bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </section>

          {/* Quick start */}
          <section className="mb-16 text-center">
            <h2 className="mb-1 text-3xl font-bold text-white">Get Started in 3 Steps</h2>
            <p className="mb-12 text-lg text-white/80">Your wellness journey begins here</p>
            <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-center gap-6">
              {STEPS.map((step, i) => (
                <div key={step.num} className="contents">
                  {i > 0 && <div className="hidden h-[2px] w-[60px] bg-white/30 lg:block" />}
                  <div
                    className="animate-slide-up relative max-w-[300px] flex-1 rounded-3xl border border-white/30 bg-white/95 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    style={{ minWidth: '250px', animationDelay: `${0.1 + i * 0.1}s` }}
                  >
                    <div
                      className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg"
                      style={{ background: 'var(--primary-gradient)' }}
                    >
                      {step.num}
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="mb-4 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {step.title}
                      </h3>
                      <p className="text-sm leading-[1.5]" style={{ color: 'var(--text-secondary)' }}>
                        {step.desc}
                      </p>
                    </div>
                    <div className="mt-4 text-[2rem]" style={{ color: 'var(--primary-color)' }}>
                      <i className={`fas ${step.icon}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section
            className="relative mx-auto max-w-[500px] rounded-3xl border border-white/20 bg-white/95 p-12 shadow-2xl backdrop-blur-[30px]"
            style={{ boxShadow: 'var(--shadow-2xl), 0 0 0 1px rgba(255,255,255,0.5)' }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,rgba(0,181,173,0.05),rgba(0,212,204,0.05))]" />
            <div className="relative">
              <div className="mb-8 text-center">
                <h2
                  className="mb-1 bg-gradient-to-br text-3xl font-extrabold text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  {t('enter_title')}
                </h2>
                <p className="text-base leading-[1.6]" style={{ color: 'var(--text-secondary)' }}>
                  {t('enter_description')}
                </p>
              </div>

              <a
                href="/dashboard.html"
                className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[linear-gradient(135deg,var(--primary-color)_0%,var(--primary-dark)_100%)] px-6 py-4 text-base font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-full w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] transition-all duration-300 group-hover:left-full" />
                <i className="fas fa-arrow-right" />
                <span>{t('enter_btn')}</span>
              </a>

              <div className="mt-8 border-t pt-8 text-center" style={{ borderColor: 'var(--border-light)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Counselor portal?{' '}
                  <a
                    href="/admin-dashboard.html"
                    className="font-semibold transition-colors hover:underline"
                    style={{ color: 'var(--primary-color)' }}
                  >
                    Admin Dashboard
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            {[
              { icon: 'fa-shield-alt', label: t('secure_trusted') },
              { icon: 'fa-user-md', label: t('professional_counselors') },
              { icon: 'fa-lock', label: t('privacy_protected') },
            ].map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-4 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-base font-medium text-white/90 backdrop-blur-[10px] transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-md"
              >
                <i className={`fas ${b.icon} text-xl text-accent-green`} />
                <span>{b.label}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-12 rounded-2xl border border-white/10 bg-[rgba(13,36,32,0.55)] p-6 text-[#e8efed] backdrop-blur-[6px] md:p-8">
            <div className="mb-6 flex items-center gap-4 rounded-xl border border-red-300/35 bg-[rgba(220,38,38,0.16)] p-4 text-[#fecaca]">
              <i className="fas fa-heart flex-shrink-0 text-xl text-red-300" />
              <p className="m-0 text-[0.9rem] leading-[1.5]">
                <strong className="text-white">In crisis? You are not alone.</strong> Call or text the National Crisis
                Lifeline at <strong className="text-white">988</strong> — free, confidential and available 24/7. You
                matter.
              </p>
            </div>
            <div className="mb-6 grid gap-8 md:grid-cols-3">
              <div>
                <h4 className="mb-3 text-[0.95rem] font-normal uppercase tracking-[0.04em] text-white">
                  Campus Mindspace
                </h4>
                <p className="text-[0.85rem] leading-[1.6] text-[#e8efed]/80">
                  Confidential mental wellness support designed for university students — mood tracking, therapy tools,
                  meditation and peer support groups, all in one private space.
                </p>
              </div>
              <div>
                <h4 className="mb-3 text-[0.95rem] font-normal uppercase tracking-[0.04em] text-white">Support</h4>
                <ul className="m-0 list-none p-0">
                  <li className="mb-1 text-[0.85rem]">
                    <a href="/support.html" className="text-[#e8efed]/80 no-underline transition-colors hover:text-white">
                      Contact Support
                    </a>
                  </li>
                  <li className="mb-1 text-[0.85rem]">
                    <a href="/dashboard.html" className="text-[#e8efed]/80 no-underline transition-colors hover:text-white">
                      Student Dashboard
                    </a>
                  </li>
                  <li className="mb-1 text-[0.85rem]">
                    <a href="/admin-dashboard.html" className="text-[#e8efed]/80 no-underline transition-colors hover:text-white">
                      Counselor Portal
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 text-[0.95rem] font-normal uppercase tracking-[0.04em] text-white">
                  Your Privacy
                </h4>
                <p className="text-[0.85rem] leading-[1.6] text-[#e8efed]/80">
                  Your data stays private and confidential. Your mood entries, messages and appointments are never
                  shared without your consent.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-[0.8rem] text-[#e8efed]/70">
              <span>&copy; 2026 Campus Mindspace. All rights reserved.</span>
              <span>Not a medical service. For emergencies, call 911.</span>
            </div>
          </footer>
        </div>
      </main>
    </>
  )
}
