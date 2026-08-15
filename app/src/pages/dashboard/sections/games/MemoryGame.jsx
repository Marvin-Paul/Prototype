import { useEffect, useRef, useState } from 'react'
import { get, set as storageSet } from '../../../../shared/storage'
import { notify } from '../../../../shared/toast'
import Icon from '../../../../shared/Icon'
import GameCard from './GameCard'

const ICONS = ['fa-graduation-cap', 'fa-book', 'fa-pencil-alt', 'fa-lightbulb', 'fa-bullseye', 'fa-star', 'fa-rainbow', 'fa-palette']

function buildDeck() {
  const pairs = [...ICONS, ...ICONS]
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  return pairs.map((icon, index) => ({ id: index, icon, flipped: false, matched: false }))
}

function formatTime(secs) {
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
}

export default function MemoryGame() {
  const [cards, setCards] = useState(buildDeck)
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [hintedId, setHintedId] = useState(null)
  const [lock, setLock] = useState(false)
  const startRef = useRef(Date.now())
  const hintTimer = useRef(null)

  const bestTime = get('gameStats', {}).memoryBestTime || null

  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  const matchedCount = cards.filter((c) => c.matched).length
  const done = matchedCount === cards.length && cards.length > 0

  useEffect(() => {
    if (!done) return
    const stats = get('gameStats', {})
    const time = Math.floor((Date.now() - startRef.current) / 1000)
    if (!stats.memoryBestTime || time < stats.memoryBestTime) {
      storageSet('gameStats', { ...stats, memoryBestTime: time })
      notify('New best time!', 'success')
    }
    notify(`Game completed in ${formatTime(time)} with ${moves} moves!`, 'success')
  }, [done])

  const flip = (id) => {
    if (lock) return
    const card = cards.find((c) => c.id === id)
    if (!card || card.flipped || card.matched) return

    const flippedIds = cards.filter((c) => c.flipped && !c.matched).map((c) => c.id)
    if (flippedIds.length >= 2) return

    const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    setCards(next)

    const nowFlipped = next.filter((c) => c.flipped && !c.matched)
    if (nowFlipped.length === 2) {
      setMoves((m) => m + 1)
      if (nowFlipped[0].icon === nowFlipped[1].icon) {
        setCards(next.map((c) => (nowFlipped.some((f) => f.id === c.id) ? { ...c, matched: true } : c)))
      } else {
        setLock(true)
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (nowFlipped.some((f) => f.id === c.id) ? { ...c, flipped: false } : c)))
          setLock(false)
        }, 1000)
      }
    }
  }

  const giveHint = () => {
    const unmatched = cards.filter((c) => !c.matched)
    if (!unmatched.length) return
    const target = unmatched[Math.floor(Math.random() * unmatched.length)]
    setHintedId(target.id)
    clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setHintedId(null), 2000)
  }

  const reset = () => {
    clearTimeout(hintTimer.current)
    startRef.current = Date.now()
    setCards(buildDeck())
    setMoves(0)
    setElapsed(0)
    setHintedId(null)
    setLock(false)
  }

  return (
    <GameCard
      icon="fa-brain"
      title="Memory Challenge"
      description="Match all the icon pairs to improve your memory!"
      stats={[
        { label: 'Moves', value: moves },
        { label: 'Matches', value: `${matchedCount}/${cards.length}` },
        { label: 'Time', value: formatTime(elapsed) },
        { label: 'Best', value: bestTime ? formatTime(bestTime) : '--' },
      ]}
      controls={
        <>
          <button type="button" onClick={reset} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90">
            New Game
          </button>
          <button type="button" onClick={giveHint} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            Hint
          </button>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => flip(card.id)}
            className={`flex aspect-square items-center justify-center rounded-xl border text-2xl transition-all duration-300 ${
              card.matched
                ? 'border-success/30 bg-success/10'
                : card.flipped
                  ? 'border-primary bg-primary/10'
                  : hintedId === card.id
                    ? 'scale-105 border-warning bg-warning/20'
                    : 'border-line-light bg-canvas hover:border-primary'
            }`}
          >
            {card.flipped || card.matched || hintedId === card.id ? <Icon icon={card.icon} className="text-2xl" /> : '?'}
          </button>
        ))}
      </div>
    </GameCard>
  )
}
