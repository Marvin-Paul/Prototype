import { useEffect, useState } from 'react'
import Icon from '../../shared/Icon'
import { useLanguage } from '../../shared/LanguageProvider'
import { getGuestUser } from '../../shared/guestUser'
import { get, set as storageSet } from '../../shared/storage'
import { notify } from '../../shared/toast'

const CARD = 'rounded-3xl border border-line-light bg-surface p-6 shadow-sm'
const SECTION_TITLE = 'mb-4 flex items-center gap-2 text-lg font-bold text-ink'
const UNDERLINE =
  'mb-5 mt-2 h-0.5 w-14 rounded-full bg-[linear-gradient(90deg,var(--primary-color),var(--secondary-color))]'
const INPUT =
  'rounded-xl border border-line-light bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-primary'
const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-5 py-2.5 text-sm font-bold text-on-primary shadow-md transition-transform hover:scale-[1.03]'

const FAQ_GROUPS = [
  {
    title: 'Getting Started',
    items: [
      {
        q: 'How do I create an account?',
        a: 'To create an account, click the "Sign Up" button on the homepage. Fill in your student information, create a secure password, and verify your email address. Once verified, you can start using all Campus Mindspace features.',
      },
      {
        q: 'Is my information confidential?',
        a: 'Yes! Your privacy is our top priority. All your data is encrypted and stored securely. We never share your personal information or mental health data with third parties without your explicit consent. You can also use anonymous mode for group sessions.',
      },
      {
        q: 'What features are available?',
        a: 'Campus Mindspace offers therapy resources (CBT, DBT, MBSR), guided meditation, counseling appointments, mental health games, mood tracking, gratitude journaling, breathing exercises, and 24/7 AI chatbot support.',
      },
    ],
  },
  {
    title: 'Appointments & Counseling',
    items: [
      {
        q: 'How do I book a counseling session?',
        a: 'Navigate to the Appointments section, browse available counselors by specialty, select your preferred counselor, choose an available time slot, and confirm your booking. You\'ll receive email and in-app reminders before your session.',
      },
      {
        q: 'Can I cancel or reschedule an appointment?',
        a: 'Yes, you can cancel or reschedule up to 24 hours before your appointment. Go to your profile, select "My Appointments," and choose the cancel or reschedule option. Please note that late cancellations may incur a fee.',
      },
      {
        q: 'Are counseling sessions free?',
        a: 'Most campus counseling services are free for enrolled students. Some specialized services may have a nominal fee. Check with your specific counselor or campus health services for details.',
      },
    ],
  },
  {
    title: 'Technical Support',
    items: [
      {
        q: 'The app isn\'t loading properly. What should I do?',
        a: 'Try these steps: 1) Clear your browser cache and cookies, 2) Update your browser to the latest version, 3) Disable browser extensions, 4) Try a different browser. If issues persist, contact our technical support team.',
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'Click "Forgot Password" on the login page, enter your email address, and you\'ll receive a password reset link. Follow the link to create a new password. Make sure to check your spam folder if you don\'t see the email.',
      },
      {
        q: 'Which browsers are supported?',
        a: 'Campus Mindspace works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience and security.',
      },
    ],
  },
]

const GUIDE_STEPS = [
  {
    number: 1,
    title: 'Set Up Your Profile',
    text: 'Complete your profile with your information, preferences, and emergency contacts. This helps us personalize your experience.',
    items: ['Add your student ID and department', 'Set notification preferences', 'Add emergency contact information', 'Choose your preferred theme'],
  },
  {
    number: 2,
    title: 'Explore Resources',
    text: 'Browse our comprehensive mental health resources tailored for students.',
    items: ['Try guided meditation sessions', 'Practice CBT and DBT exercises', 'Listen to calming music', 'Watch motivational videos'],
  },
  {
    number: 3,
    title: 'Track Your Wellness',
    text: 'Use our tools to monitor and improve your mental health over time.',
    items: ['Log your daily mood', 'Write gratitude journal entries', 'Practice breathing exercises', 'Play mind games for relaxation'],
  },
  {
    number: 4,
    title: 'Get Professional Help',
    text: 'Connect with licensed counselors when you need professional support.',
    items: ['Browse counselors by specialty', 'Book appointments online', 'Attend virtual or in-person sessions', 'Access crisis support 24/7'],
  },
]

const VIDEO_TUTORIALS = [
  { title: 'Getting Started with Campus Mindspace', desc: 'Learn the basics and set up your account', duration: '3:45' },
  { title: 'Booking Your First Counseling Session', desc: 'Step-by-step guide to scheduling appointments', duration: '5:20' },
  { title: 'Using Meditation & Mindfulness Tools', desc: 'Maximize your meditation practice', duration: '4:15' },
  { title: 'Mood Tracking & Wellness Journaling', desc: 'Track your mental health journey effectively', duration: '6:30' },
  { title: 'Privacy & Security Settings', desc: 'Keep your information safe and private', duration: '3:00' },
  { title: 'Using the AI Chatbot for Support', desc: 'Get 24/7 help from our AI assistant', duration: '4:45' },
]

function FaqItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`overflow-hidden rounded-xl border transition-colors ${open ? 'border-primary' : 'border-line-light'}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-ink transition-colors hover:bg-surface-hover"
      >
        <span>{item.q}</span>
        <Icon icon="fa-chevron-right" className={`shrink-0 text-primary-text transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && <p className="border-t border-line-light bg-canvas/50 px-4 py-3.5 text-sm leading-relaxed text-ink-2">{item.a}</p>}
    </div>
  )
}

function TopBar() {
  const { lang, setLang } = useLanguage()
  return (
    <nav className="sticky top-0 z-40 border-b border-line-light bg-surface/98 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="index.html" className="flex shrink-0 items-center gap-3 text-xl font-bold text-primary-text">
          <Icon icon="fa-brain" className="text-2xl text-primary-text" />
          <span className="hidden sm:inline">Campus Mindspace</span>
        </a>
        <div className="flex items-center gap-2">
          <a
            href="dashboard.html"
            className="hidden items-center gap-2 rounded-full border border-line-light px-4 py-2 text-sm font-medium text-ink-2 transition-all duration-200 hover:border-primary hover:text-primary-text sm:flex"
          >
            <Icon icon="fa-home" />
            <span>Home</span>
          </a>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            title="Select Language"
            className="hidden rounded-full border border-line-light bg-canvas px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:border-primary focus:border-primary focus:outline-none sm:block"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
          <a
            href="settings.html"
            title="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-ink-2 transition-all duration-200 hover:bg-surface-hover hover:text-primary-text"
          >
            <Icon icon="fa-cog" />
          </a>
        </div>
      </div>
      <div className="border-t border-line-light bg-canvas/60 px-6 py-4">
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-ink sm:text-2xl">
          <Icon icon="fa-life-ring" className="text-primary-text" /> Help & Support
        </h1>
        <p className="mt-1 text-sm text-ink-2">We're here to help you on your wellness journey</p>
      </div>
    </nav>
  )
}

export default function SupportPage() {
  const { t } = useLanguage()
  const [section, setSection] = useState('faq')
  const [form, setForm] = useState(() => {
    const user = getGuestUser()
    const profile = get('userData', {})
    return { name: profile.fullName || '', email: profile.email || user.email || '', subject: '', message: '' }
  })

  const scrollToSection = (id) => {
    setSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const submitForm = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.subject || !form.message.trim()) {
      notify(t('support_form_required'), 'error')
      return
    }
    const inquiries = get('supportInquiries', [])
    storageSet('supportInquiries', [
      ...inquiries,
      { ...form, status: 'pending', createdAt: new Date().toISOString() },
    ])
    notify(t('support_form_sent'), 'success')
    setForm((f) => ({ ...f, subject: '', message: '' }))
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
        {/* Crisis banner */}
        <section id="crisis" className="mb-10 rounded-3xl border-2 border-danger/30 bg-[linear-gradient(135deg,rgba(239,68,68,0.06),rgba(159,232,112,0.04))] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-danger">
                <span className="h-2 w-2 animate-pulse rounded-full bg-danger" /> Emergency
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl">In Crisis? Reach Out Now.</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-2">
                You are not alone. Trained counselors are available 24/7. Free, confidential, and always here when you need us.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="tel:988"
                  className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--danger-color),#b91c1c)] px-6 py-3 text-sm font-extrabold text-white shadow-md transition-transform hover:scale-[1.03]"
                >
                  <Icon icon="fa-phone" /> Call 988
                </a>
                <a
                  href="sms:741741&body=HOME"
                  className="inline-flex items-center gap-2 rounded-full border border-danger/40 bg-surface px-6 py-3 text-sm font-bold text-danger transition-colors hover:bg-danger/10"
                >
                  <Icon icon="fa-comment-dots" /> Text HOME → 741741
                </a>
                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 rounded-full border border-danger/40 bg-surface px-6 py-3 text-sm font-bold text-danger transition-colors hover:bg-danger/10"
                >
                  <Icon icon="fa-ambulance" /> Call 911
                </a>
              </div>
              <p className="mt-4 text-xs text-ink-3">
                Not in crisis? Explore our resources below or talk to a counselor anytime.
              </p>
            </div>
            <div className="rounded-2xl border border-line-light bg-surface/60 p-6 backdrop-blur">
              <h3 className="mb-3 text-sm font-bold text-ink">Crisis Support Numbers</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-lg text-danger">
                    <Icon icon="fa-phone" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink">Suicide & Crisis Lifeline</div>
                    <div className="text-xs text-ink-2">Call or text 988</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-lg text-danger">
                    <Icon icon="fa-comment-dots" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink">Crisis Text Line</div>
                    <div className="text-xs text-ink-2">Text HOME to 741741</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-lg text-danger">
                    <Icon icon="fa-ambulance" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink">Emergency Services</div>
                    <div className="text-xs text-ink-2">Call 911 for immediate help</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick help cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { id: 'faq', icon: 'fa-question-circle', title: 'FAQs', desc: 'Find answers to commonly asked questions' },
            { id: 'guide', icon: 'fa-book', title: 'User Guide', desc: 'Learn how to use Campus Mindspace' },
            { id: 'contact', icon: 'fa-envelope', title: 'Contact Us', desc: 'Get in touch with our support team' },
            { id: 'videos', icon: 'fa-video', title: 'Video Tutorials', desc: 'Watch step-by-step video guides' },
          ].map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => scrollToSection(card.id)}
              className={`${CARD} flex flex-col items-start text-left ${section === card.id ? 'border-primary shadow-md' : ''}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary-text">
                <Icon icon={card.icon} />
              </div>
              <h3 className="mt-3 text-sm font-bold text-ink">{card.title}</h3>
              <p className="mt-0.5 text-xs text-ink-2">{card.desc}</p>
            </button>
          ))}
        </div>

        {/* FAQ */}
        <section id="faq" className={`mb-10 scroll-mt-32 ${section !== 'faq' ? 'hidden' : ''}`}>
          <div className={CARD}>
            <h2 className={SECTION_TITLE}>
              <Icon icon="fa-question-circle" className="text-primary-text" /> Frequently Asked Questions
            </h2>
            <div className={UNDERLINE} />
            <div className="space-y-8">
              {FAQ_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-3 text-sm font-bold tracking-wide text-ink-2 uppercase">{group.title}</h3>
                  <div className="space-y-2">
                    {group.items.map((item, i) => (
                      <FaqItem key={i} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* User Guide */}
        <section id="guide" className={`mb-10 scroll-mt-32 ${section !== 'guide' ? 'hidden' : ''}`}>
          <div className={CARD}>
            <h2 className={SECTION_TITLE}>
              <Icon icon="fa-book" className="text-primary-text" /> User Guide
            </h2>
            <div className={UNDERLINE} />
            <div className="grid gap-4 md:grid-cols-2">
              {GUIDE_STEPS.map((step) => (
                <div key={step.number} className="rounded-2xl border border-line-light bg-canvas/60 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] text-sm font-extrabold text-on-primary">
                    {step.number}
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm text-ink-2">{step.text}</p>
                  <ul className="mt-3 space-y-1.5">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-2">
                        <Icon icon="fa-check" className="mt-1 shrink-0 text-xs text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className={`mb-10 scroll-mt-32 ${section !== 'contact' ? 'hidden' : ''}`}>
          <div className={CARD}>
            <h2 className={SECTION_TITLE}>
              <Icon icon="fa-envelope" className="text-primary-text" /> Contact Support
            </h2>
            <div className={UNDERLINE} />
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-bold text-ink">Get in Touch</h3>
                <p className="mt-1 text-sm text-ink-2">
                  Our support team is here to help you Monday through Friday, 9 AM - 5 PM.
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3 rounded-xl border border-line-light bg-canvas/60 p-3.5">
                    <Icon icon="fa-envelope" className="mt-0.5 text-lg text-primary-text" />
                    <div>
                      <h4 className="text-sm font-bold text-ink">Email Support</h4>
                      <a href="mailto:support@campusmindspace.edu" className="text-sm text-primary-text hover:underline">
                        support@campusmindspace.edu
                      </a>
                      <p className="text-xs text-ink-2">Response within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-line-light bg-canvas/60 p-3.5">
                    <Icon icon="fa-phone" className="mt-0.5 text-lg text-primary-text" />
                    <div>
                      <h4 className="text-sm font-bold text-ink">Phone Support</h4>
                      <a href="tel:+15551234567" className="text-sm text-primary-text hover:underline">
                        +1 (555) 123-4567
                      </a>
                      <p className="text-xs text-ink-2">Mon-Fri, 9 AM - 5 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-line-light bg-canvas/60 p-3.5">
                    <Icon icon="fa-comments" className="mt-0.5 text-lg text-primary-text" />
                    <div>
                      <h4 className="text-sm font-bold text-ink">Live Chat</h4>
                      <a href="dashboard.html" className="text-sm text-primary-text hover:underline">
                        Open the AI assistant on the dashboard
                      </a>
                      <p className="text-xs text-ink-2">Available 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-line-light bg-canvas/60 p-3.5">
                    <Icon icon="fa-map-marker-alt" className="mt-0.5 text-lg text-primary-text" />
                    <div>
                      <h4 className="text-sm font-bold text-ink">Campus Location</h4>
                      <p className="text-sm text-ink-2">
                        Student Health Center, Room 205
                        <br />
                        123 University Ave
                        <br />
                        Campus, ST 12345
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={submitForm} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink">Your Name</label>
                  <input
                    className={`${INPUT} w-full`}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink">Email Address</label>
                  <input
                    type="email"
                    className={`${INPUT} w-full`}
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink">Subject</label>
                  <select
                    className={`${INPUT} w-full`}
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="technical">Technical Issue</option>
                    <option value="appointment">Appointment Question</option>
                    <option value="account">Account Help</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink">Message</label>
                  <textarea
                    rows="6"
                    className={`${INPUT} w-full resize-none`}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className={PRIMARY_BTN}>
                  <Icon icon="fa-paper-plane" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Video tutorials */}
        <section id="videos" className={`mb-10 scroll-mt-32 ${section !== 'videos' ? 'hidden' : ''}`}>
          <div className={CARD}>
            <h2 className={SECTION_TITLE}>
              <Icon icon="fa-video" className="text-primary-text" /> Video Tutorials
            </h2>
            <div className={UNDERLINE} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VIDEO_TUTORIALS.map((video) => (
                <a
                  key={video.title}
                  href="resources.html"
                  className="group overflow-hidden rounded-2xl border border-line-light bg-canvas/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <div className="flex h-32 items-center justify-center bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))]">
                    <Icon icon="fa-play-circle" className="text-4xl text-on-primary transition-transform group-hover:scale-110" />
                    <span className="absolute mt-24 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {video.duration}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-ink">{video.title}</h3>
                    <p className="mt-0.5 text-xs text-ink-2">{video.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
        </main>
    </div>
  )
}
