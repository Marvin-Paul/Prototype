import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../shared/LanguageProvider'
import HomeSection from './sections/HomeSection'
import TherapySection from './sections/TherapySection'
import MeditationSection from './sections/MeditationSection'
import ResourcesSection from './sections/ResourcesSection'
import AppointmentsSection from './sections/AppointmentsSection'
import InsightsSection from './sections/InsightsSection'
import GamesSection from './sections/GamesSection'
import ComingSoonSection from './sections/ComingSoonSection'
import Chatbot from './components/Chatbot'
import SystemStatus from './components/SystemStatus'
import Footer from './components/Footer'

const NAV_ITEMS = [
  { id: 'home', key: 'nav_home' },
  { id: 'therapy', key: 'nav_therapy' },
  { id: 'meditation', key: 'nav_meditation' },
  { id: 'resources', key: 'nav_resources' },
  { id: 'appointments', key: 'nav_appointments' },
  { id: 'insights', key: 'nav_insights' },
  { id: 'games', key: 'nav_games' },
  { id: 'groups', key: 'nav_groups' },
]

const SECTION_ICONS = {
  therapy: 'fa-user-md',
  meditation: 'fa-om',
  resources: 'fa-music',
  appointments: 'fa-calendar-check',
  games: 'fa-gamepad',
  groups: 'fa-users',
  insights: 'fa-chart-line',
}

const COMING_SOON_SECTIONS = ['groups']

export default function DashboardPage() {
  const { t, lang, setLang } = useLanguage()
  const [section, setSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const navigateTo = (id) => {
    setSection(id)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const dropdownItemClass =
    'block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-ink-2 transition-all duration-200 hover:translate-x-1 hover:bg-surface-hover hover:text-primary'

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-line-light bg-surface/98 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="/index.html" className="flex shrink-0 items-center gap-3 text-xl font-bold text-primary">
            <i className="fas fa-brain bg-[linear-gradient(135deg,var(--primary-color),var(--secondary-color))] bg-clip-text text-2xl text-transparent" />
            <span className="hidden sm:inline">{t('welcome_title')}</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden flex-1 items-center justify-center gap-1 overflow-x-auto lg:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo(item.id)
                }}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  section === item.id
                    ? 'bg-primary/5 text-primary'
                    : 'text-ink-2 hover:bg-surface-hover hover:text-primary'
                }`}
              >
                {t(item.key)}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
              href="/admin-dashboard.html"
              title="Admin Portal"
              className="hidden items-center gap-2 rounded-full border border-line-light px-4 py-2 text-sm font-medium text-ink-2 transition-all duration-200 hover:border-primary hover:text-primary xl:flex"
            >
              <i className="fas fa-shield-alt" />
              <span>{t('admin_shortcut')}</span>
            </a>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-label="Profile Menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="relative flex h-11 w-11 items-center justify-center rounded-full text-xl text-ink-2 transition-all duration-200 hover:scale-105 hover:bg-surface-hover hover:text-primary"
              >
                <i className="fas fa-user-circle" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
              </button>

              <div
                className={`absolute top-[calc(100%+0.75rem)] right-0 min-w-[220px] rounded-2xl border border-line-light bg-surface p-3 shadow-2xl transition-all duration-200 ${
                  menuOpen
                    ? 'visible translate-y-0 scale-100 opacity-100'
                    : 'invisible -translate-y-2 scale-95 opacity-0'
                }`}
              >
                <a href="/settings.html" className={dropdownItemClass}>
                  <i className="fas fa-cog mr-3 w-4 text-primary" /> {t('profile_settings')}
                </a>
                <a href="/support.html" className={dropdownItemClass}>
                  <i className="fas fa-life-ring mr-3 w-4 text-primary" /> {t('profile_help')}
                </a>
                <a href="/index.html" className={`${dropdownItemClass} font-semibold text-danger hover:bg-danger/10 hover:text-danger`}>
                  <i className="fas fa-sign-out-alt mr-3 w-4" /> {t('exit_home')}
                </a>
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Toggle Navigation"
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-ink-2 transition-all duration-200 hover:bg-surface-hover hover:text-primary lg:hidden"
            >
              <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-line-light bg-surface px-4 py-4 lg:hidden">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              title="Select Language"
              className="mb-3 w-full rounded-xl border border-line-light bg-canvas px-4 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:border-primary focus:border-primary focus:outline-none"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigateTo(item.id)
                  }}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    section === item.id ? 'bg-primary/5 text-primary' : 'text-ink-2 hover:bg-surface-hover hover:text-primary'
                  }`}
                >
                  {t(item.key)}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8">
        {section === 'home' ? (
          <HomeSection onNavigate={navigateTo} />
        ) : section === 'therapy' ? (
          <TherapySection key={section} />
        ) : section === 'meditation' ? (
          <MeditationSection key={section} />
        ) : section === 'resources' ? (
          <ResourcesSection key={section} />
        ) : section === 'appointments' ? (
          <AppointmentsSection key={section} />
        ) : section === 'insights' ? (
          <InsightsSection key={section} />
        ) : section === 'games' ? (
          <GamesSection key={section} />
        ) : COMING_SOON_SECTIONS.includes(section) ? (
          <ComingSoonSection key={section} icon={SECTION_ICONS[section] ?? 'fa-brain'} titleKey={`nav_${section}`} />
        ) : null}
      </main>

      <Footer />

      <Chatbot />
      <SystemStatus />
    </div>
  )
}
