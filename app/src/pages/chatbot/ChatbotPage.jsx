import { useEffect, useState } from 'react'
import Icon from '../../shared/Icon'
import Chatbot from '../dashboard/components/Chatbot'

const FEATURES = [
  {
    icon: 'fa-comment-dots',
    title: 'Always Here to Listen',
    text: 'Vent, reflect, or get perspective. MindBot is available day and night, whenever you need a safe space to talk.',
  },
  {
    icon: 'fa-compass',
    title: 'Practical Support',
    text: 'From exam-season stress to social anxiety, get gentle guidance, grounding techniques and practical next steps.',
  },
  {
    icon: 'fa-hand-holding-heart',
    title: 'Care with Limits',
    text: 'MindBot is a companion, not a therapist. For urgent needs it will point you to the crisis line and counselling services.',
  },
]

const PILLS = [
  { icon: 'fa-clock', label: 'Available 24/7' },
  { icon: 'fa-heart', label: 'Stress & anxiety' },
  { icon: 'fa-book-open', label: 'Study tips' },
  { icon: 'fa-moon', label: 'Sleep guidance' },
]

export default function ChatbotPage() {
  const [chatOpen, setChatOpen] = useState(false)
  const [autoOpened, setAutoOpened] = useState(false)

  const openChat = () => {
    setChatOpen(true)
    setAutoOpened(true)
  }

  useEffect(() => {
    if (autoOpened) return
    const timer = setTimeout(openChat, 700)
    return () => clearTimeout(timer)
  }, [autoOpened])

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#0a1f1c_0%,#0e2a26_55%,#12332c_100%)] font-sans text-[#e8efed]">
      <div className="mx-auto max-w-[1100px] px-6 py-8 pb-12 sm:px-6">
        <header className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <a href="index.html" className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-white no-underline">
            <Icon icon="fa-brain" className="text-2xl text-primary-text" />
            <span>Campus Mindspace</span>
          </a>
          <a
            href="index.html"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-[#e8efed]/85 no-underline transition-all duration-200 hover:bg-white/15 hover:text-white"
          >
            <Icon icon="fa-arrow-left" />
            Back to Home
          </a>
        </header>

        <main>
          <section className="mb-14 text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-text/40 bg-primary-text/15 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#7dd3d0] uppercase">
              <Icon icon="fa-robot" /> AI Assistant
            </span>
            <h1 className="mx-auto mb-3 bg-[linear-gradient(135deg,#ffffff_0%,#a5e8e4_100%)] bg-clip-text text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-none tracking-tight text-transparent">
              MindBot
            </h1>
            <p className="mx-auto mb-5 max-w-[640px] text-[clamp(1rem,2.5vw,1.25rem)] font-light leading-relaxed text-[#e8efed]/90">
              Your mental wellness companion. Talk through stress, anxiety, study pressure, sleep
              difficulties and more — any time, in confidence.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={openChat}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-9 py-3.5 text-base font-bold text-on-primary shadow-md transition-all duration-200 hover:scale-[1.03] hover:shadow-glow"
              >
                <Icon icon="fa-comments" /> Start Chatting
              </button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {PILLS.map((pill) => (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-[#e8efed]/90 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <Icon icon={pill.icon} className="text-primary-text" />
                  {pill.label}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_14px_34px_rgba(0,0,0,0.25)]"
              >
                <Icon icon={feature.icon} className="mb-3.5 inline-block text-2xl text-primary-text" />
                <h3 className="mb-2 text-base font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[#e8efed]/75">{feature.text}</p>
              </div>
            ))}
          </section>

          <p className="-mt-2 mb-12 text-center text-sm text-[#e8efed]/65">
            Have questions for our team?{' '}
            <a href="support.html" className="text-[#7dd3d0] no-underline hover:underline">
              Visit Help &amp; Support
            </a>
            .
          </p>

          {/* Crisis footer */}
          <div className="mb-12 flex flex-col items-start gap-3 rounded-3xl border border-primary-text/30 bg-primary-text/10 p-6 sm:flex-row sm:items-center">
            <Icon icon="fa-heart" className="text-xl text-[#7dd3d0]" />
            <p className="text-sm text-[#e8efed]/90">
              <strong className="text-white">In crisis? You are not alone.</strong> Call or text the
              National Crisis Lifeline at <strong className="text-white">988</strong> — free,
              confidential and available 24/7. You matter.
            </p>
          </div>

          <footer className="grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
            <div>
              <h4 className="mb-2 text-sm font-bold text-white">Campus Mindspace</h4>
              <p className="text-sm leading-relaxed text-[#e8efed]/75">
                Confidential mental wellness support designed for university students — mood
                tracking, therapy tools, meditation and peer support groups, all in one private
                space.
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-bold text-white">Support</h4>
              <ul className="space-y-1.5 text-sm text-[#e8efed]/75">
                <li>
                  <a href="support.html" className="no-underline hover:text-white hover:underline">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="dashboard.html" className="no-underline hover:text-white hover:underline">
                    Student Dashboard
                  </a>
                </li>
                <li>
                  <a href="admin-dashboard.html" className="no-underline hover:text-white hover:underline">
                    Counselor Portal
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-bold text-white">Your Privacy</h4>
              <p className="text-sm leading-relaxed text-[#e8efed]/75">
                Your data stays private and confidential. Your mood entries, messages and
                appointments are never shared without your consent.
              </p>
            </div>
            <div className="flex flex-col gap-1 border-t border-white/10 pt-6 text-sm text-[#e8efed]/65 sm:col-span-3">
              <span>&copy; 2026 Campus Mindspace. All rights reserved.</span>
              <span>Not a medical service. For emergencies, call 911.</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Floating chatbot widget (opens on load, matching prototype behavior) */}
      <Chatbot open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  )
}
