import { useRef, useState } from 'react'
import { get, set as storageSet } from '../../../../shared/storage'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const COLORS = [
  { name: 'red', bg: '#ef4444', active: 'bg-red-400', base: 'bg-red-500' },
  { name: 'blue', bg: '#3b82f6', active: 'bg-blue-400', base: 'bg-blue-500' },
  { name: 'green', bg: '#22c55e', active: 'bg-green-400', base: 'bg-green-500' },
  { name: 'yellow', bg: '#eab308', active: 'bg-yellow-300', base: 'bg-yellow-400' },
]

export default function ColorMemoryGame() {
  const [sequence, setSequence] = useState([])
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [flashIdx, setFlashIdx] = useState(null)
  const [userIdx, setUserIdx] = useState(0)
  const [status, setStatus] = useState('Press Start Game to begin')
  const timers = useRef([])

  const best = get('gameStats', {}).colorBest || 0

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const playSequence = (seq, onDone) => {
    setPlaying(true)
    setStatus('Watch the sequence...')
    seq.forEach((colorIdx, i) => {
      timers.current.push(
        setTimeout(() => {
          setFlashIdx(colorIdx)
          timers.current.push(
            setTimeout(() => {
              setFlashIdx(null)
              if (i === seq.length - 1) {
                setPlaying(false)
                setUserIdx(0)
                setStatus('Your turn - repeat the sequence!')
                onDone?.()
              }
            }, 450),
          )
        }, i * 950),
      )
    })
  }

  const start = () => {
    clearTimers()
    setRound(1)
    setScore(0)
    const first = [Math.floor(Math.random() * COLORS.length)]
    setSequence(first)
    playSequence(first)
  }

  const handleColor = (idx) => {
    if (playing || !sequence.length) return
    const expected = sequence[userIdx]
    setFlashIdx(idx)
    timers.current.push(setTimeout(() => setFlashIdx(null), 300))

    if (idx !== expected) {
      clearTimers()
      const bestNow = get('gameStats', {})
      const newBest = Math.max(bestNow.colorBest || 0, score)
      storageSet('gameStats', { ...bestNow, colorBest: newBest })
      setStatus('Game Over! Score reset. Press Start Game again.')
      setSequence([])
      setRound(1)
      setScore(0)
      notify('Game Over!', 'error')
      return
    }

    const nextIdx = userIdx + 1
    if (nextIdx === sequence.length) {
      const newScore = score + 10
      setScore(newScore)
      setRound((r) => r + 1)
      setStatus('Nice! Next round...')
      const newSeq = [...sequence, Math.floor(Math.random() * COLORS.length)]
      setSequence(newSeq)
      timers.current.push(
        setTimeout(() => {
          playSequence(newSeq)
        }, 900),
      )
    } else {
      setUserIdx(nextIdx)
    }
  }

  return (
    <GameCard
      icon="fa-palette"
      title="Color Memory"
      description="Remember the color sequence and repeat it!"
      stats={[
        { label: 'Round', value: round },
        { label: 'Score', value: score },
        { label: 'Best', value: best },
      ]}
      controls={
        <>
          <button type="button" onClick={start} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            Start Game
          </button>
          <button
            type="button"
            onClick={() => {
              clearTimers()
              setStatus('Watch the sequence...')
              playSequence(sequence)
            }}
            className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary"
          >
            Replay
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-2">
        {COLORS.map((color, idx) => (
          <button
            key={color.name}
            type="button"
            onClick={() => handleColor(idx)}
            aria-label={`Color ${color.name}`}
            style={{ backgroundColor: color.bg }}
            className={`aspect-[2/1] rounded-2xl transition-all duration-200 ${
              flashIdx === idx ? 'scale-95 opacity-80 ring-4 ring-white/70' : 'opacity-90 hover:opacity-100'
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-ink-2">{status}</p>
    </GameCard>
  )
}
