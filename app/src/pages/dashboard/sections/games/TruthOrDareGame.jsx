import { useState } from 'react'
import GameCard from './GameCard'

const TRUTHS = {
  easy: [
    "What's your favorite study spot on campus?",
    "What's the best advice you've ever received?",
    "What's your favorite way to relax?",
    "What's something you're proud of this semester?",
  ],
  medium: [
    "What's your biggest academic challenge?",
    "What's something you wish you could change about your study habits?",
    "What's the most important lesson you've learned in college?",
    "What's something that motivates you when you're feeling stressed?",
  ],
  hard: [
    "What's your biggest fear about your future?",
    "What's something you've never told anyone about your academic struggles?",
    "What's the hardest decision you've had to make as a student?",
    "What's something you regret about your college experience so far?",
  ],
}

const DARES = {
  easy: [
    'Do 10 jumping jacks right now',
    'Send a positive message to a friend',
    'Take 5 deep breaths',
    "Write down 3 things you're grateful for",
  ],
  medium: [
    'Study for 30 minutes without any distractions',
    'Try a new study technique for one hour',
    'Organize your study space',
    "Call or text someone you haven't talked to in a while",
  ],
  hard: [
    'Study for 2 hours straight without breaks',
    "Ask a professor for help with something you're struggling with",
    'Join a new club or organization',
    'Set up a study group with classmates',
  ],
}

export default function TruthOrDareGame() {
  const [difficulty, setDifficulty] = useState('medium')
  const [round, setRound] = useState(1)
  const [question, setQuestion] = useState('Choose Truth or Dare to begin!')

  const pick = (list) => list[Math.floor(Math.random() * list.length)]

  const getTruth = () => {
    setQuestion(`Truth: ${pick(TRUTHS[difficulty])}`)
  }

  const getDare = () => {
    setQuestion(`Dare: ${pick(DARES[difficulty])}`)
  }

  const next = () => {
    setRound((r) => r + 1)
    setQuestion('Choose Truth or Dare to begin!')
  }

  return (
    <GameCard
      icon="fa-dice"
      title="Truth or Dare"
      description="Play with friends or challenge yourself with fun questions and dares!"
      stats={[
        { label: 'Round', value: round },
        { label: 'Mode', value: 'Solo' },
      ]}
      controls={
        <>
          <button type="button" onClick={getTruth} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90">
            Truth
          </button>
          <button type="button" onClick={getDare} className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            Dare
          </button>
          <button type="button" onClick={next} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            Next
          </button>
        </>
      }
    >
      <div className="rounded-2xl bg-canvas px-4 py-5 text-center">
        <p className="text-sm font-semibold text-ink">{question}</p>
      </div>
      <label className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-ink-2">
        Difficulty:
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-xl border border-line-light bg-canvas px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
    </GameCard>
  )
}
