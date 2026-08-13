import { useState } from 'react'
import { get, set as storageSet } from '../../../../shared/storage'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const TYPES = ['haiku', 'limerick', 'free-verse', 'sonnet']
const THEMES = ['nature', 'love', 'hope', 'friendship', 'dreams']

const PROMPT_LINES = {
  nature: ['trees swaying in the breeze', 'the quiet of a forest path', 'sunlight on the water'],
  love: ['a hand held in the dark', 'kind words that linger', 'the warmth of being known'],
  hope: ['dawn breaking after rain', 'a seed in winter ground', 'the light beyond the clouds'],
  friendship: ['laughter shared over coffee', 'a friend who simply stays', 'stories told till late'],
  dreams: ['sailing past the stars', 'a door that opens wide', 'the world you build at night'],
}

export default function PoetryGame() {
  const [type, setType] = useState('haiku')
  const [theme, setTheme] = useState('nature')
  const [text, setText] = useState('')
  const [prompt, setPrompt] = useState(() => `Write a haiku about nature...`)

  const generatePrompt = () => {
    const lines = PROMPT_LINES[theme] || PROMPT_LINES.nature
    const line = lines[Math.floor(Math.random() * lines.length)]
    setPrompt(`Write a ${type} about ${theme}... ${line}.`)
  }

  const save = () => {
    if (!text.trim()) {
      notify('Write something first!', 'warning')
      return
    }
    const nextStats = get('gameStats', {})
    const poems = [
      ...(nextStats.savedPoems || []),
      { id: Date.now(), type, theme, text, date: new Date().toISOString() },
    ]
    storageSet('gameStats', { ...nextStats, savedPoems: poems })
    notify('Poem saved!', 'success')
  }

  const share = () => {
    if (!text.trim()) {
      notify('Write something first!', 'warning')
      return
    }
    navigator.clipboard?.writeText(text).catch(() => {})
    notify('Poem copied to clipboard!', 'success')
  }

  const selectClass =
    'rounded-xl border border-line-light bg-canvas px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none'

  return (
    <GameCard
      icon="fa-feather-alt"
      title="Poetry Generator"
      description="Create beautiful poetry with guided prompts and inspiration!"
      controls={
        <>
          <button type="button" onClick={generatePrompt} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90">
            New Prompt
          </button>
          <button type="button" onClick={save} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            Save Poem
          </button>
          <button type="button" onClick={share} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            Share
          </button>
        </>
      }
    >
      <div className="mb-3 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-2">
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-2">
          Theme:
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className={selectClass}>
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="rounded-xl bg-canvas px-4 py-3 text-sm text-ink-2 italic">{prompt}</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing your poem here..."
        rows={6}
        className="mt-3 w-full resize-none rounded-2xl border border-line-light bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none"
      />
    </GameCard>
  )
}
