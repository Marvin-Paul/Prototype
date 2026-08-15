import { useState } from 'react'
import Icon from '../../../../shared/Icon'
import { get, set as storageSet } from '../../../../shared/storage'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const PROMPT_TAGS = ['Family', 'Friends', 'Health', 'Education', 'Nature']
const RANDOM_PROMPTS = [
  'What made you smile today?',
  'Who are you thankful for and why?',
  'What challenge did you overcome recently?',
  'What simple pleasure brought you joy today?',
  'What opportunity are you grateful for?',
  'What lesson did you learn this week?',
  'What comfort are you grateful for?',
  'What beauty did you notice today?',
]

export default function GratitudeGame() {
  const [text, setText] = useState('')
  const [prompt, setPrompt] = useState('general')
  const [placeholder, setPlaceholder] = useState('Write down 3 things you\'re thankful for today...')
  const [entries, setEntries] = useState(() => get('gameStats', {}).gratitudeEntries || [])

  const stats = get('gameStats', {})

  const save = () => {
    const trimmed = text.trim()
    if (!trimmed) {
      notify('Please write something you\'re grateful for!', 'warning')
      return
    }
    const nextStats = get('gameStats', {})
    const entry = {
      id: Date.now(),
      text: trimmed,
      date: new Date().toISOString(),
      prompt,
    }
    const next = [...(nextStats.gratitudeEntries || []), entry]
    storageSet('gameStats', { ...nextStats, gratitudeEntries: next })
    setEntries(next)
    setText('')
    notify('Gratitude entry saved!', 'success')
  }

  const randomPrompt = () => {
    const p = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)]
    setPlaceholder(p)
    setPrompt(p)
  }

  const streak = () => {
    let s = 0
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const check = new Date(today)
      check.setDate(check.getDate() - i)
      const has = entries.some((e) => new Date(e.date).toDateString() === check.toDateString())
      if (has) s++
      else break
    }
    return s
  }

  const thisWeek = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return entries.filter((e) => new Date(e.date) >= weekAgo).length
  }

  const recent = entries.slice(-5).reverse()

  return (
    <GameCard
      icon="fa-heart"
      title="Gratitude Journal"
      description="What are you grateful for today? Build a positive mindset!"
      stats={[
        { label: 'Entries', value: entries.length },
        { label: 'Streak', value: streak() },
        { label: 'This Week', value: thisWeek() },
      ]}
      controls={
        <>
          <button type="button" onClick={save} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90">
            <Icon icon="fa-save" className="mr-2" />
            Save Entry
          </button>
          <button type="button" onClick={randomPrompt} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            <Icon icon="fa-random" className="mr-2" />
            Random Prompt
          </button>
        </>
      }
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-2xl border border-line-light bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {PROMPT_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setPrompt(tag.toLowerCase())
              setPlaceholder(`What are you thankful for about ${tag.toLowerCase()}?`)
            }}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              prompt === tag.toLowerCase()
                ? 'border-primary bg-primary/10 text-primary-text'
                : 'border-line-light bg-canvas text-ink-2 hover:border-primary hover:text-primary-text'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {recent.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-bold text-ink">Recent Entries</h4>
          <div className="space-y-2">
            {recent.map((e) => (
              <div key={e.id} className="rounded-xl bg-canvas px-4 py-2.5">
                <div className="text-xs font-semibold text-ink-3">{new Date(e.date).toLocaleDateString()}</div>
                <div className="mt-0.5 text-sm text-ink">{e.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GameCard>
  )
}
