import { useState } from 'react'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const ASSOCIATIONS = {
  STUDY: ['learn', 'books', 'knowledge', 'education', 'school', 'homework', 'research'],
  FRIENDS: ['companionship', 'support', 'fun', 'trust', 'loyalty', 'memories', 'bond'],
  DREAMS: ['goals', 'aspirations', 'future', 'hope', 'ambition', 'vision', 'success'],
  NATURE: ['trees', 'fresh air', 'peace', 'beauty', 'outdoors', 'wildlife', 'serenity'],
}

function randomWord() {
  const keys = Object.keys(ASSOCIATIONS)
  return keys[Math.floor(Math.random() * keys.length)]
}

export default function WordGame() {
  const [current, setCurrent] = useState(() => randomWord())
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [count, setCount] = useState(0)
  const [found, setFound] = useState([])
  const [hint, setHint] = useState(null)

  const newWord = () => {
    setCurrent(randomWord())
    setInput('')
    setScore(0)
    setStreak(0)
    setCount(0)
    setFound([])
    setHint(null)
  }

  const submit = () => {
    const word = input.trim().toLowerCase()
    if (!word) {
      notify('Type a word first!', 'warning')
      return
    }
    const list = ASSOCIATIONS[current]
    const isCorrect = list.some((a) => a.toLowerCase().includes(word) || word.includes(a.toLowerCase()))
    if (isCorrect) {
      setScore((s) => s + 10)
      setStreak((s) => s + 1)
      setCount((c) => c + 1)
      setFound((f) => (f.includes(word) ? f : [...f, word]))
      notify('Great association! +10 points', 'success')
    } else {
      setStreak(0)
      notify('Try another word!', 'warning')
    }
    setInput('')
  }

  const giveHint = () => {
    const list = ASSOCIATIONS[current]
    const remaining = list.filter((a) => !found.includes(a.toLowerCase()))
    setHint(remaining.length ? remaining[Math.floor(Math.random() * remaining.length)] : list[0])
  }

  return (
    <GameCard
      icon="fa-puzzle-piece"
      title="Word Association"
      description="Connect words to expand your vocabulary and creativity!"
      stats={[
        { label: 'Score', value: score },
        { label: 'Streak', value: streak },
        { label: 'Words', value: count },
      ]}
      controls={
        <>
          <button type="button" onClick={newWord} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            New Word
          </button>
          <button type="button" onClick={giveHint} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary">
            Hint
          </button>
        </>
      }
    >
      <div className="rounded-2xl bg-canvas p-4 text-center">
        <span className="text-2xl font-extrabold tracking-wide text-primary">{current}</span>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Type a related word..."
          className="flex-1 rounded-xl border border-line-light bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none"
        />
        <button type="button" onClick={submit} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
          Submit
        </button>
      </div>
      {hint && <p className="mt-3 rounded-xl bg-warning/10 px-4 py-2 text-sm text-ink-2">Hint: try "{hint}"</p>}
      {found.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {found.map((word, i) => (
            <span key={i} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {word}
            </span>
          ))}
        </div>
      )}
    </GameCard>
  )
}
