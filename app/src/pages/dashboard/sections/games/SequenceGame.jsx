import { useRef, useState } from 'react'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const SEQUENCES = [
  { pattern: [2, 4, 6, 8], answer: 10, hint: 'Add 2 each time' },
  { pattern: [1, 4, 9, 16], answer: 25, hint: 'Perfect squares' },
  { pattern: [1, 1, 2, 3], answer: 5, hint: 'Fibonacci sequence' },
  { pattern: [5, 10, 20, 40], answer: 80, hint: 'Multiply by 2' },
  { pattern: [3, 6, 12, 24], answer: 48, hint: 'Double each number' },
]

function buildQuestion() {
  const seq = SEQUENCES[Math.floor(Math.random() * SEQUENCES.length)]
  const wrong = [
    seq.answer + Math.floor(Math.random() * 10) + 1,
    seq.answer - Math.floor(Math.random() * 5) - 1,
    seq.answer + Math.floor(Math.random() * 5) + 1,
  ]
  const options = [seq.answer, ...wrong]
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }
  return {
    seq,
    display: seq.pattern.slice(0, -1).join(', ') + ', ?',
    options,
    feedback: {},
  }
}

export default function SequenceGame() {
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [question, setQuestion] = useState(() => buildQuestion())
  const [feedback, setFeedback] = useState(null)
  const [hint, setHint] = useState(null)
  const [busy, setBusy] = useState(false)
  const timer = useRef(null)

  const pick = (value) => {
    if (busy) return
    const isCorrect = value === question.seq.answer
    if (isCorrect) {
      setFeedback({ value, correct: true })
      setScore((s) => s + 10)
      setLevel((l) => l + 1)
      notify('Correct! +10 points', 'success')
    } else {
      setFeedback({ value, correct: false })
      setLives((l) => {
        const next = l - 1
        if (next <= 0) {
          notify('Game Over!', 'error')
          setLevel(1)
          setScore(0)
          return 3
        }
        notify('Wrong answer! Try again', 'warning')
        return next
      })
    }
    setHint(null)
    setBusy(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setQuestion(buildQuestion())
      setFeedback(null)
      setBusy(false)
    }, 1200)
  }

  const newQuestion = () => {
    clearTimeout(timer.current)
    setQuestion(buildQuestion())
    setFeedback(null)
    setHint(null)
    setBusy(false)
  }

  return (
    <GameCard
      icon="fa-calculator"
      title="Number Sequence"
      description="Complete the pattern to sharpen your logical thinking!"
      stats={[
        { label: 'Level', value: level },
        { label: 'Score', value: score },
        { label: 'Lives', value: lives },
      ]}
      controls={
        <>
          <button type="button" onClick={newQuestion} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90">
            New Sequence
          </button>
          <button type="button" onClick={() => setHint(question.seq.hint)} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            Hint
          </button>
        </>
      }
    >
      <div className="rounded-2xl bg-canvas px-4 py-6 text-center">
        <span className="text-xl font-extrabold tracking-wider text-ink">{question.display}</span>
      </div>
      {hint && <p className="mt-3 rounded-xl bg-warning/10 px-4 py-2 text-sm text-ink-2">Hint: {hint}</p>}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {question.options.map((value) => {
          const state = feedback && feedback.value === value ? (feedback.correct ? 'correct' : 'wrong') : 'idle'
          return (
            <button
              key={value}
              type="button"
              onClick={() => pick(value)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                state === 'correct'
                  ? 'border-success bg-success/10 text-success'
                  : state === 'wrong'
                    ? 'border-danger bg-danger/10 text-danger'
                    : 'border-line-light bg-canvas text-ink hover:border-primary'
              }`}
            >
              {value}
            </button>
          )
        })}
      </div>
    </GameCard>
  )
}
