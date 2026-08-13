import { useState } from 'react'
import { useLanguage } from '../../../shared/LanguageProvider'
import { GuestUser } from '../../../shared/guestUser'
import { notify } from '../../../shared/toast'
import { set as storageSet } from '../../../shared/storage'

const DAILY_TIPS = [
  "Remember to take short breaks during study sessions. Even 5 minutes of deep breathing can help refresh your mind and improve focus.",
  "Practice gratitude by noting three things you're thankful for each day. This simple habit can significantly boost your mood.",
  "Stay hydrated! Drinking enough water throughout the day helps maintain your energy levels and cognitive function.",
  "Connect with a friend today. Social support is crucial for mental wellness, even if it's just a quick text message.",
  "Try the 5-4-3-2-1 grounding technique when feeling overwhelmed: Name 5 things you see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
  "Set small, achievable goals for today. Accomplishing them will give you a sense of progress and motivation.",
  "Practice self-compassion. Be as kind to yourself as you would be to a good friend facing the same challenges.",
  "Get some natural light. Even 10-15 minutes outdoors can help regulate your mood and sleep cycle.",
]

const QUICK_ACTIONS = [
  { section: 'therapy', icon: 'fa-user-md', titleKey: 'therapy_title', descKey: 'therapy_description', pct: 75, iconBg: 'from-violet-500 to-purple-500', badge: { key: 'popular', className: 'bg-primary/10 text-primary-text' } },
  { section: 'meditation', icon: 'fa-om', titleKey: 'meditation_title', descKey: 'meditation_description', pct: 60, iconBg: 'from-teal-400 to-cyan-500', badge: null },
  { section: 'resources', icon: 'fa-music', titleKey: 'resources_title', descKey: 'resources_description', pct: 45, iconBg: 'from-pink-400 to-rose-500', badge: null },
  { section: 'appointments', icon: 'fa-calendar-check', titleKey: 'appointment_title', descKey: 'appointment_description', pct: 30, iconBg: 'from-indigo-400 to-blue-500', badge: { key: 'new_badge', className: 'bg-success/10 text-success' }, pctTextKey: 'sessions_count' },
  { section: 'games', icon: 'fa-gamepad', titleKey: 'games_title', descKey: 'games_description', pct: 90, iconBg: 'from-amber-400 to-orange-500', badge: null },
  { section: 'groups', icon: 'fa-users', titleKey: 'groups_title', descKey: 'groups_description', pct: 55, iconBg: 'from-emerald-400 to-green-500', badge: null, pctTextKey: 'members_count' },
]

const ACTIVITIES = [
  { icon: 'fa-om', iconBg: 'from-indigo-500 to-purple-500', titleKey: 'activity_meditation_title', descKey: 'activity_meditation_desc', pts: 10 },
  { icon: 'fa-smile', iconBg: 'from-pink-400 to-rose-500', titleKey: 'activity_mood_title', descKey: 'activity_mood_desc', pts: 5 },
  { icon: 'fa-user-md', iconBg: 'from-sky-400 to-cyan-400', titleKey: 'activity_therapy_title', descKey: 'activity_therapy_desc', pts: 15 },
]

const BADGES = [
  { icon: 'fa-fire', titleKey: 'badge_streak', descKey: 'badge_streak_desc', earned: true },
  { icon: 'fa-meditation', titleKey: 'badge_zen', descKey: 'badge_zen_desc', earned: true },
  { icon: 'fa-trophy', titleKey: 'badge_champion', descKey: 'badge_champion_desc', earned: false },
  { icon: 'fa-users', titleKey: 'badge_helper', descKey: 'badge_helper_desc', earned: false },
]

const MOOD_KEYS = ['overwhelmed', 'sleep', 'social', 'happy', 'anxious', 'lonely']

const MOOD_ICONS = {
  overwhelmed: 'fa-exclamation-triangle',
  sleep: 'fa-bed',
  social: 'fa-users',
  happy: 'fa-smile',
  anxious: 'fa-heartbeat',
  lonely: 'fa-user',
}

const MOOD_COLORS = {
  overwhelmed: 'text-mood-overwhelmed',
  sleep: 'text-mood-sleep',
  social: 'text-mood-social',
  happy: 'text-mood-happy',
  anxious: 'text-mood-anxious',
  lonely: 'text-mood-lonely',
}

function randomTip() {
  return DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)]
}

export default function HomeSection({ onNavigate }) {
  const { t } = useLanguage()
  const [user] = useState(() => GuestUser.get())
  const [mood, setMood] = useState(() => user.initialMood || 'happy')
  const [tip, setTip] = useState(() => randomTip())

  const greeting = t('welcome_back').replace('{name}', user.firstName || 'Student')

  const nextTip = () => setTip(randomTip())

  const saveTip = () => notify(t('tip_saved'), 'success')

  const updateMood = () => {
    const next = window.prompt(
      'How are you feeling? (overwhelmed, sleep, social, happy, anxious, lonely)',
    )
    if (next && MOOD_KEYS.includes(next.trim())) {
      const cleaned = next.trim()
      const updated = { ...user, initialMood: cleaned, currentMood: cleaned }
      storageSet('campusMindspace_currentUser', updated)
      setMood(cleaned)
      notify(t('mood_updated'), 'success')
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome + stats */}
      <section className="animate-fade-up">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{greeting}</h1>
        <p className="mt-2 text-ink-2">{t('welcome_subtitle')}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-line-light bg-surface p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary-light/15 text-2xl text-primary-text">
              <i className="fas fa-calendar-check" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-ink">7</div>
              <div className="text-sm text-ink-2">{t('stat_streak')}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-line-light bg-surface p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary-light/15 text-2xl text-primary-text">
              <i className="fas fa-heart" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-ink">85%</div>
              <div className="text-sm text-ink-2">{t('stat_wellness')}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-line-light bg-surface p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary-light/15 text-2xl text-primary-text">
              <i className="fas fa-meditation" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-ink">12</div>
              <div className="text-sm text-ink-2">{t('stat_sessions')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily tip */}
      <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,var(--primary-color),var(--secondary-color))] p-8 text-on-primary shadow-2xl">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur">
            <i className="fas fa-lightbulb" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
              <i className="fas fa-star" /> {t('daily_tip_badge')}
            </div>
            <h3 className="text-xl font-bold">{t('daily_tip_title')}</h3>
            <p className="mt-1 leading-relaxed opacity-95">{tip}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={nextTip}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/30"
              >
                <i className="fas fa-refresh" /> {t('new_tip')}
              </button>
              <button
                type="button"
                onClick={saveTip}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/30"
              >
                <i className="fas fa-bookmark" /> {t('save_tip')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-ink">{t('quick_actions')}</h2>
          <p className="mt-1 text-ink-2">{t('quick_actions_subtitle')}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {QUICK_ACTIONS.map((card) => {
            const progressText = card.pctTextKey
              ? t(card.pctTextKey)
              : t('complete_pct').replace('{p}', card.pct)
            return (
              <div
                key={card.section}
                role="button"
                tabIndex={0}
                onClick={() => onNavigate(card.section)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onNavigate(card.section)
                }}
                className="group relative flex cursor-pointer items-center gap-5 rounded-3xl border border-line-light bg-surface p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl"
              >
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.iconBg} text-2xl text-white shadow-md`}>
                  <i className={`fas ${card.icon}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-ink">{t(card.titleKey)}</h3>
                  <p className="mt-0.5 line-clamp-2 text-sm text-ink-2">{t(card.descKey)}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary-color),var(--primary-dark))]"
                        style={{ width: `${card.pct}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-ink-2">{progressText}</span>
                  </div>
                </div>
                <i className="fas fa-arrow-right shrink-0 text-xl text-ink-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-text" />
                {card.badge && (
                  <span className={`absolute top-4 right-4 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${card.badge.className}`}>
                    {t(card.badge.key)}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Activity feed */}
      <section>
        <div className="rounded-3xl border border-line-light bg-surface p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">{t('recent_activity')}</h2>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> {t('live')}
            </span>
          </div>
          <div className="divide-y divide-line-light">
            {ACTIVITIES.map((item) => (
              <div
                key={item.titleKey}
                className="flex items-center gap-4 rounded-xl px-2 py-3 transition-all duration-300 hover:translate-x-1 hover:bg-surface-elevated"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.iconBg} text-white`}>
                  <i className={`fas ${item.icon}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-ink">{t(item.titleKey)}</h4>
                  <p className="text-xs text-ink-2">{t(item.descKey)}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-success">
                  {t('pts').replace('{n}', item.pts)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-ink">{t('your_achievements')}</h2>
          <p className="mt-1 text-ink-2">{t('achievements_subtitle')}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((badge) => (
            <div
              key={badge.titleKey}
              className={`flex items-center gap-4 rounded-2xl border bg-surface p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                badge.earned ? 'border-line-light' : 'border-dashed border-line opacity-60 grayscale'
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg text-white ${
                  badge.earned ? 'bg-gradient-to-br from-primary to-primary-dark' : 'bg-ink-3'
                }`}
              >
                <i className={`fas ${badge.icon}`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-ink">{t(badge.titleKey)}</h4>
                <p className="text-xs text-ink-2">{t(badge.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mood tracker */}
      <section className="rounded-3xl border border-line-light bg-surface p-6 shadow-md">
        <h2 className="mb-5 text-center text-2xl font-extrabold text-ink">{t('mood_tracker_title')}</h2>
        <div className="flex flex-col items-center gap-3">
          <div className={`flex items-center gap-3 rounded-full px-6 py-3 text-lg font-bold ${MOOD_COLORS[mood] ?? 'text-primary-text'}`}>
            <i className={`fas ${MOOD_ICONS[mood] ?? 'fa-question'}`} />
            <span>{t(`mood_${mood}`)}</span>
          </div>
          <button
            type="button"
            onClick={updateMood}
            className="flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-6 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <i className="fas fa-smile" /> {t('update_mood')}
          </button>
          <div className="mt-1 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('insights')}
              className="rounded-full border border-line-light bg-canvas px-5 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
            >
              {t('view_history')}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('insights')}
              className="rounded-full border border-line-light bg-canvas px-5 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
            >
              {t('analytics')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
