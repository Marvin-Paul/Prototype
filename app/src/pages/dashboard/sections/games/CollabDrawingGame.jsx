import { useEffect, useRef, useState } from 'react'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const ROUND_SECONDS = 180

export default function CollabDrawingGame() {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS)
  const [playing, setPlaying] = useState(false)
  const [players, setPlayers] = useState(1)
  const timerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3

    const pos = (e) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: ((e.clientX - rect.left) * canvas.width) / rect.width,
        y: ((e.clientY - rect.top) * canvas.height) / rect.height,
      }
    }
    const down = (e) => {
      if (!playing) return
      const p = pos(e)
      drawingRef.current = true
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
    }
    const move = (e) => {
      if (!drawingRef.current || !playing) return
      const p = pos(e)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
    const up = () => {
      drawingRef.current = false
    }
    canvas.addEventListener('mousedown', down)
    canvas.addEventListener('mousemove', move)
    canvas.addEventListener('mouseup', up)
    canvas.addEventListener('mouseleave', up)
    return () => {
      canvas.removeEventListener('mousedown', down)
      canvas.removeEventListener('mousemove', move)
      canvas.removeEventListener('mouseup', up)
      canvas.removeEventListener('mouseleave', up)
    }
  }, [playing])

  const start = () => {
    setPlaying(true)
    setSecondsLeft(ROUND_SECONDS)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current)
          setPlaying(false)
          notify('Round over! Time is up.', 'info')
          return 0
        }
        return s - 1
      })
    }, 1000)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  const invite = () => {
    setPlayers((p) => Math.min(p + 1, 8))
    const code = 'MS' + Math.floor(1000 + Math.random() * 9000)
    navigator.clipboard?.writeText(code).catch(() => {})
    notify(`Invite sent! Join code: ${code}`, 'success')
  }

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `collab-drawing-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
    notify('Drawing saved!', 'success')
  }

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <GameCard
      icon="fa-palette"
      title="Collaborative Drawing"
      description="Draw together with friends in real-time or take turns adding to a masterpiece!"
      stats={[
        { label: 'Players', value: players },
        { label: 'Rounds', value: playing ? 1 : 0 },
        { label: 'Timer', value: fmt(secondsLeft) },
      ]}
      controls={
        <>
          <button type="button" onClick={start} disabled={playing} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50">
            Start Game
          </button>
          <button type="button" onClick={invite} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            Invite Friends
          </button>
          <button type="button" onClick={save} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            Save Drawing
          </button>
        </>
      }
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={260}
          className={`w-full cursor-crosshair rounded-2xl border border-line-light bg-white ${playing ? '' : 'opacity-70'}`}
        />
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-black/60 px-4 py-2 text-sm font-semibold text-white">Press Start Game to begin</span>
          </div>
        )}
      </div>
    </GameCard>
  )
}
