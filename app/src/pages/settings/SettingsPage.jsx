import { useEffect, useState } from 'react'
import Icon from '../../shared/Icon'
import { useLanguage } from '../../shared/LanguageProvider'
import { useTheme } from '../../shared/ThemeProvider'
import { get, set as storageSet } from '../../shared/storage'
import { notify } from '../../shared/toast'

const DEFAULT_SETTINGS = {
  theme: 'light',
  fontSize: 'medium',
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  notifications: {
    email: true,
    appointments: true,
    dailyTips: true,
    moodReminders: false,
  },
  privacy: {
    twoFactor: false,
    anonymousMode: false,
    shareData: false,
    personalizedRecs: true,
  },
  accessibility: {
    reduceMotion: false,
  },
}

const CARD = 'rounded-3xl border border-line-light bg-surface p-6 shadow-sm'
const SECTION_TITLE =
  'mb-5 flex items-center gap-2 text-lg font-bold text-ink'
const UNDERLINE =
  'mb-5 mt-2 h-0.5 w-14 rounded-full bg-[linear-gradient(90deg,var(--primary-color),var(--secondary-color))]'
const INPUT =
  'rounded-xl border border-line-light bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-primary'
const SELECT = INPUT
const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-5 py-2.5 text-sm font-bold text-on-primary shadow-md transition-transform hover:scale-[1.03]'
const GHOST_BTN =
  'inline-flex items-center justify-center gap-2 rounded-full border border-line-light bg-surface px-5 py-2.5 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text'
const DANGER_BTN =
  'inline-flex items-center justify-center gap-2 rounded-full border border-danger/40 bg-danger/5 px-5 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/10'

function SectionCard({ icon, title, children }) {
  return (
    <section className={CARD}>
      <div className="flex items-center gap-2">
        <h2 className={SECTION_TITLE}>
          <Icon icon={icon} className="text-primary-text" />
          {title}
        </h2>
      </div>
      <div className={UNDERLINE} />
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-ink">{label}</label>
      {children}
    </div>
  )
}

function ToggleRow({ title, subtitle, checked, onChange, onEnable }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line-light bg-canvas px-4 py-3">
      <div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <p className="text-xs text-ink-2">{subtitle}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => {
          if (!checked && onEnable) onEnable()
          onChange(!checked)
        }}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-line'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[1.4rem]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function TopBar({ title, subtitle }) {
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
            href="support.html"
            title="Help & Support"
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-ink-2 transition-all duration-200 hover:bg-surface-hover hover:text-primary-text"
          >
            <Icon icon="fa-life-ring" />
          </a>
        </div>
      </div>
      <div className="border-t border-line-light bg-canvas/60 px-6 py-4">
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-ink sm:text-2xl">
          <Icon icon="fa-cog" className="text-primary-text" /> {title}
        </h1>
        <p className="mt-1 text-sm text-ink-2">{subtitle}</p>
      </div>
    </nav>
  )
}

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState(() => get('userSettings', DEFAULT_SETTINGS))
  const [userData, setUserData] = useState(() => get('userData', {}))
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })

  useEffect(() => {
    storageSet('userSettings', settings)
  }, [settings])

  const patch = (section, key, value) => {
    setSettings((s) => ({ ...s, [section]: { ...s[section], [key]: value } }))
  }

  const saveAccount = () => {
    storageSet('userData', userData)
    notify(t('settings_saved'), 'success')
  }

  const saveEmergency = () => {
    if (!userData.emergencyContact?.name || !userData.emergencyContact?.phone) {
      notify(t('settings_emergency_required'), 'error')
      return
    }
    storageSet('userData', userData)
    notify(t('settings_emergency_saved'), 'success')
  }

  const changePassword = () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      notify(t('settings_password_required'), 'error')
      return
    }
    if (passwords.next !== passwords.confirm) {
      notify(t('settings_password_mismatch'), 'error')
      return
    }
    if (passwords.next.length < 8) {
      notify(t('settings_password_short'), 'error')
      return
    }
    notify(t('settings_password_updated'), 'success')
    setPasswords({ current: '', next: '', confirm: '' })
  }

  const downloadData = () => {
    const blob = new Blob([JSON.stringify({ settings, userData, moodHistory: get('moodHistory', []), appointments: get('appointments', []) }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `campus-mindspace-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    notify(t('settings_data_downloaded'), 'success')
  }

  const deleteAccount = () => {
    if (!window.confirm(t('settings_delete_confirm'))) return
    if (!window.confirm(t('settings_delete_last_chance'))) return
    localStorage.clear()
    sessionStorage.clear()
    notify(t('settings_delete_done'), 'info')
    setTimeout(() => {
      window.location.href = 'index.html'
    }, 2000)
  }

  const setThemeAndSave = (value) => {
    setTheme(value)
    setSettings((s) => ({ ...s, theme: value }))
  }

  const setLangAndSave = (value) => {
    setLang(value)
    setSettings((s) => ({ ...s, language: value }))
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <TopBar title={t('nav_settings')} subtitle={t('settings_subtitle')} />

      <main className="mx-auto max-w-[1200px] px-6 py-10 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Settings */}
          <SectionCard icon="fa-user" title={t('settings_account')}>
            <Field label="Full Name">
              <input
                className={`${INPUT} w-full`}
                value={userData.fullName || ''}
                onChange={(e) => setUserData((d) => ({ ...d, fullName: e.target.value }))}
                placeholder="Enter your full name"
              />
            </Field>
            <Field label="Email Address">
              <input
                type="email"
                className={`${INPUT} w-full`}
                value={userData.email || ''}
                onChange={(e) => setUserData((d) => ({ ...d, email: e.target.value }))}
                placeholder="your.email@example.com"
              />
            </Field>
            <Field label="Student ID">
              <input
                className={`${INPUT} w-full`}
                value={userData.studentId || ''}
                onChange={(e) => setUserData((d) => ({ ...d, studentId: e.target.value }))}
                placeholder="Enter your student ID"
              />
            </Field>
            <Field label="Department">
              <select
                className={`${SELECT} w-full`}
                value={userData.department || ''}
                onChange={(e) => setUserData((d) => ({ ...d, department: e.target.value }))}
              >
                <option value="">Select your department</option>
                <option value="cs">Computer Science</option>
                <option value="eng">Engineering</option>
                <option value="business">Business</option>
                <option value="arts">Arts & Humanities</option>
                <option value="science">Natural Sciences</option>
                <option value="health">Health Sciences</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <button type="button" onClick={saveAccount} className={PRIMARY_BTN}>
              <Icon icon="fa-save" /> Save Changes
            </button>
          </SectionCard>

          {/* Privacy & Security */}
          <SectionCard icon="fa-shield-alt" title={t('settings_security')}>
            <Field label="Current Password">
              <input
                type="password"
                className={`${INPUT} w-full`}
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                placeholder="Enter current password"
              />
            </Field>
            <Field label="New Password">
              <input
                type="password"
                className={`${INPUT} w-full`}
                value={passwords.next}
                onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                placeholder="Enter new password"
              />
            </Field>
            <Field label="Confirm New Password">
              <input
                type="password"
                className={`${INPUT} w-full`}
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Confirm new password"
              />
            </Field>
            <button type="button" onClick={changePassword} className={GHOST_BTN}>
              <Icon icon="fa-lock" /> Update Security
            </button>
            <ToggleRow
              title={t('settings_2fa')}
              subtitle="Add an extra layer of security to your account"
              checked={settings.privacy.twoFactor}
              onChange={(v) => patch('privacy', 'twoFactor', v)}
              onEnable={() => notify(t('settings_2fa_info'), 'info')}
            />
            <ToggleRow
              title={t('settings_anonymous')}
              subtitle="Hide your identity in group sessions"
              checked={settings.privacy.anonymousMode}
              onChange={(v) => patch('privacy', 'anonymousMode', v)}
            />
          </SectionCard>

          {/* Notifications */}
          <SectionCard icon="fa-bell" title={t('settings_notifications')}>
            <ToggleRow
              title="Email Notifications"
              subtitle="Receive updates and reminders via email"
              checked={settings.notifications.email}
              onChange={(v) => patch('notifications', 'email', v)}
            />
            <ToggleRow
              title="Appointment Reminders"
              subtitle="Get notified before scheduled sessions"
              checked={settings.notifications.appointments}
              onChange={(v) => patch('notifications', 'appointments', v)}
            />
            <ToggleRow
              title="Daily Wellness Tips"
              subtitle="Receive daily mental health tips"
              checked={settings.notifications.dailyTips}
              onChange={(v) => patch('notifications', 'dailyTips', v)}
            />
            <ToggleRow
              title="Mood Check-in Reminders"
              subtitle="Get reminded to log your mood"
              checked={settings.notifications.moodReminders}
              onChange={(v) => patch('notifications', 'moodReminders', v)}
            />
          </SectionCard>

          {/* Appearance */}
          <SectionCard icon="fa-palette" title={t('settings_appearance')}>
            <Field label="Theme">
              <div className="flex gap-2">
                {[
                  { value: 'light', icon: 'fa-sun', label: 'Light' },
                  { value: 'dark', icon: 'fa-moon', label: 'Dark' },
                  { value: 'auto', icon: 'fa-adjust', label: 'Auto' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setThemeAndSave(opt.value)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                      theme === opt.value
                        ? 'border-primary bg-primary/10 text-primary-text'
                        : 'border-line-light bg-canvas text-ink-2 hover:border-primary hover:text-primary-text'
                    }`}
                  >
                    <Icon icon={opt.icon} /> {opt.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Font Size">
              <select
                className={`${SELECT} w-full`}
                value={settings.fontSize}
                onChange={(e) => setSettings((s) => ({ ...s, fontSize: e.target.value }))}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </Field>
            <ToggleRow
              title="Reduce Animations"
              subtitle="Minimize motion for better accessibility"
              checked={settings.accessibility.reduceMotion}
              onChange={(v) => patch('accessibility', 'reduceMotion', v)}
            />
          </SectionCard>

          {/* Language & Region */}
          <SectionCard icon="fa-globe" title={t('settings_language')}>
            <Field label="Preferred Language">
              <select
                className={`${SELECT} w-full`}
                value={lang}
                onChange={(e) => setLangAndSave(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </Field>
            <Field label="Timezone">
              <select
                className={`${SELECT} w-full`}
                value={settings.timezone}
                onChange={(e) => setSettings((s) => ({ ...s, timezone: e.target.value }))}
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="GMT">GMT</option>
              </select>
            </Field>
            <Field label="Date Format">
              <select
                className={`${SELECT} w-full`}
                value={settings.dateFormat}
                onChange={(e) => setSettings((s) => ({ ...s, dateFormat: e.target.value }))}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </Field>
          </SectionCard>

          {/* Data & Privacy */}
          <SectionCard icon="fa-database" title={t('settings_data')}>
            <ToggleRow
              title="Share Anonymous Usage Data"
              subtitle="Help us improve by sharing anonymous usage statistics"
              checked={settings.privacy.shareData}
              onChange={(v) => patch('privacy', 'shareData', v)}
            />
            <ToggleRow
              title="Personalized Recommendations"
              subtitle="Get content suggestions based on your activity"
              checked={settings.privacy.personalizedRecs}
              onChange={(v) => patch('privacy', 'personalizedRecs', v)}
            />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={downloadData} className={GHOST_BTN}>
                <Icon icon="fa-download" /> {t('settings_download_data')}
              </button>
              <button type="button" onClick={deleteAccount} className={DANGER_BTN}>
                <Icon icon="fa-trash-alt" /> {t('settings_delete_account')}
              </button>
            </div>
          </SectionCard>

          {/* Emergency Contacts */}
          <SectionCard icon="fa-phone-alt" title={t('settings_emergency')}>
            <Field label="Contact Name">
              <input
                className={`${INPUT} w-full`}
                value={userData.emergencyContact?.name || ''}
                onChange={(e) =>
                  setUserData((d) => ({ ...d, emergencyContact: { ...d.emergencyContact, name: e.target.value } }))
                }
                placeholder="Enter contact name"
              />
            </Field>
            <Field label="Phone Number">
              <input
                type="tel"
                className={`${INPUT} w-full`}
                value={userData.emergencyContact?.phone || ''}
                onChange={(e) =>
                  setUserData((d) => ({ ...d, emergencyContact: { ...d.emergencyContact, phone: e.target.value } }))
                }
                placeholder="+1 (555) 123-4567"
              />
            </Field>
            <Field label="Relationship">
              <select
                className={`${SELECT} w-full`}
                value={userData.emergencyContact?.relationship || ''}
                onChange={(e) =>
                  setUserData((d) => ({
                    ...d,
                    emergencyContact: { ...d.emergencyContact, relationship: e.target.value },
                  }))
                }
              >
                <option value="">Select relationship</option>
                <option value="parent">Parent/Guardian</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="partner">Partner</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <button type="button" onClick={saveEmergency} className={PRIMARY_BTN}>
              <Icon icon="fa-phone-alt" /> Save Contact
            </button>
            <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
              <h3 className="mb-2 text-sm font-bold text-danger">Crisis Hotlines</h3>
              <p className="text-sm text-ink-2">
                <strong>National Crisis Line:</strong> 988
              </p>
              <p className="text-sm text-ink-2">
                <strong>Crisis Text Line:</strong> Text HOME to 741741
              </p>
              <p className="text-sm text-ink-2">
                <strong>Campus Counseling:</strong> (555) 123-4567
              </p>
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  )
}
