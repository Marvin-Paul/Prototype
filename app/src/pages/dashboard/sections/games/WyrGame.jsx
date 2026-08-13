import { useState } from 'react'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const QUESTIONS = {
  random: [
    { a: 'Have the ability to fly', b: 'Have the ability to be invisible' },
    { a: 'Always be 10 minutes late', b: 'Always be 20 minutes early' },
    { a: 'Live without music', b: 'Live without movies' },
    { a: 'Have unlimited money', b: 'Have unlimited time' },
  ],
  academic: [
    { a: 'Study alone in silence', b: 'Study in a group with music' },
    { a: 'Take all multiple choice tests', b: 'Take all essay tests' },
    { a: 'Have perfect memory', b: 'Have perfect understanding' },
    { a: 'Learn everything quickly', b: 'Learn everything deeply' },
  ],
  lifestyle: [
    { a: 'Sleep in every morning', b: 'Wake up at sunrise daily' },
    { a: 'Never use social media again', b: 'Never watch TV again' },
    { a: 'Eat the same meal every day', b: 'Never eat dessert again' },
    { a: 'Live on the beach forever', b: 'Live in the mountains forever' },
  ],
  funny: [
    { a: 'Only be able to whisper', b: 'Only be able to shout' },
    { a: 'Have a nose that honks when you sneeze', b: 'Laugh every time you hiccup' },
    { a: 'Always walk backwards', b: 'Always talk in rhymes' },
    { a: 'Only eat food that is cold', b: 'Only drink warm drinks' },
  ],
}

export default function WyrGame() {
  const [category, setCategory] = useState('random')
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [percents, setPercents] = useState(null)

  const question = QUESTIONS[category][index % QUESTIONS[category].length]

  const pick = (side) => {
    if (chosen) return
    const aPct = 30 + Math.floor(Math.random() * 41)
    setPercents({ a: aPct, b: 100 - aPct })
    setChosen(side)
    setCount((c) => c + 1)
  }

  const next = () => {
    setChosen(null)
    setPercents(null)
    setIndex((i) => i + 1)
  }

  const share = () => {
    const text = `${question.a} vs ${question.b} - which would you pick?`
    navigator.clipboard?.writeText(text).catch(() => {})
    notify('Question copied to clipboard!', 'success')
  }

  const option = (side) => {
    const value = side === 'a' ? question.a : question.b
    return (
      <button
        type="button"
        onClick={() => pick(side)}
        className={`flex flex-1 flex-col items-center justify-between gap-3 rounded-2xl border px-4 py-5 text-center transition-all ${
          chosen === side
            ? 'border-primary bg-primary/10 shadow-md'
            : chosen
              ? 'border-line-light bg-canvas opacity-60'
              : 'border-line-light bg-canvas hover:border-primary'
        }`}
      >
        <span className="text-sm font-medium text-ink">{value}</span>
        <span className={`text-lg font-extrabold ${percents ? (chosen === side ? 'text-primary' : 'text-ink-3') : 'text-ink-3'}`}>
          {percents ? `${percents[side]}%` : '--%'}
        </span>
      </button>
    )
  }

  return (
    <GameCard
      icon="fa-question-circle"
      title="Would You Rather"
      description="Make tough choices and see what your friends would pick!"
      stats={[
        { label: 'Questions', value: count },
        { label: 'Category', value: category },
      ]}
      controls={
        <>
          <button type="button" onClick={next} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            New Question
          </button>
          <button type="button" onClick={share} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary">
            Share
          </button>
        </>
      }
    >
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {option('a')}
        <span className="text-center text-sm font-extrabold text-ink-3">VS</span>
        {option('b')}
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {Object.keys(QUESTIONS).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat)
              setIndex(0)
              setChosen(null)
              setPercents(null)
            }}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              category === cat
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-line-light bg-canvas text-ink-2 hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </GameCard>
  )
}
