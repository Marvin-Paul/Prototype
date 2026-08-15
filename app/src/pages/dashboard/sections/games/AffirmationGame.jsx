import { useState } from 'react'
import Icon from '../../../../shared/Icon'
import { get, set as storageSet } from '../../../../shared/storage'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const AFFIRMATIONS = {
  general: [
    'I am worthy of love and respect.',
    'I have the power to create positive change in my life.',
    'I am capable of achieving my goals.',
    'I choose to focus on what I can control.',
    'I am grateful for the opportunities in my life.',
  ],
  academic: [
    'I am a capable and intelligent student.',
    'I can learn and grow from every challenge.',
    'My hard work and dedication will pay off.',
    'I have the skills to succeed in my studies.',
    'I am making progress toward my academic goals.',
  ],
  confidence: [
    'I believe in myself and my abilities.',
    'I am confident in who I am becoming.',
    'I trust my instincts and judgment.',
    'I am brave enough to face new challenges.',
    'I am proud of my accomplishments.',
  ],
  motivation: [
    'I am motivated to pursue my dreams.',
    'Every step forward is progress worth celebrating.',
    'I have the determination to overcome obstacles.',
    'My future is bright and full of possibilities.',
    'I am inspired to be my best self.',
  ],
}

const CATEGORIES = ['general', 'academic', 'confidence', 'motivation']

export default function AffirmationGame() {
  const [category, setCategory] = useState('general')
  const [current, setCurrent] = useState(null)
  const [favorites, setFavorites] = useState(() => get('gameStats', {}).favoriteAffirmations || [])
  const [todayAffirmations, setTodayAffirmations] = useState(() => get('gameStats', {}).todayAffirmations || [])

  const syncStats = (updater) => {
    const next = updater(get('gameStats', {}))
    storageSet('gameStats', next)
  }

  const spin = () => {
    const list = AFFIRMATIONS[category] || AFFIRMATIONS.general
    const pick = list[Math.floor(Math.random() * list.length)]
    setCurrent(pick)
    const today = new Date().toDateString()
    if (!todayAffirmations.includes(today)) {
      const nextDays = [...todayAffirmations, today]
      setTodayAffirmations(nextDays)
      syncStats((s) => ({ ...s, todayAffirmations: nextDays }))
    }
  }

  const favorite = () => {
    if (!current) {
      notify('Get an affirmation first!', 'warning')
      return
    }
    if (favorites.includes(current)) {
      notify('Already in favorites!', 'info')
      return
    }
    const next = [...favorites, current]
    setFavorites(next)
    syncStats((s) => ({ ...s, favoriteAffirmations: next }))
    notify('Added to favorites!', 'success')
  }

  const streak = () => {
    let s = 0
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const check = new Date(today)
      check.setDate(check.getDate() - i)
      if (todayAffirmations.includes(check.toDateString())) s++
      else break
    }
    return s
  }

  return (
    <GameCard
      icon="fa-star"
      title="Positive Affirmations"
      description="Get your daily dose of positivity and self-empowerment!"
      stats={[
        { label: 'Daily', value: todayAffirmations.length },
        { label: 'Favorites', value: favorites.length },
        { label: 'Streak', value: streak() },
      ]}
      controls={
        <>
          <button type="button" onClick={spin} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90">
            <Icon icon="fa-sync-alt" className="mr-2" />
            Get Affirmation
          </button>
          <button type="button" onClick={favorite} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            <Icon icon="fa-heart" className="mr-2" />
            Favorite
          </button>
        </>
      }
    >
      <div className="flex min-h-[90px] items-center justify-center rounded-2xl bg-canvas px-4 py-5 text-center">
        {current ? (
          <p className="text-base font-semibold text-primary-text italic">"{current}"</p>
        ) : (
          <p className="text-sm text-ink-3">Click the button to receive your daily affirmation!</p>
        )}
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              category === cat
                ? 'border-primary bg-primary/10 text-primary-text'
                : 'border-line-light bg-canvas text-ink-2 hover:border-primary hover:text-primary-text'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </GameCard>
  )
}
