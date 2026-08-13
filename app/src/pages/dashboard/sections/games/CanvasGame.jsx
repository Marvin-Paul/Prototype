import { useEffect, useRef, useState } from 'react'
import { get, set as storageSet } from '../../../../shared/storage'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const PRESET_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7']

export default function CanvasGame() {
  const canvasRef = useRef(null)
  const [tool, setTool] = useState('brush')
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(5)
  const drawingRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const pos = (e) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: ((e.clientX - rect.left) * canvas.width) / rect.width,
        y: ((e.clientY - rect.top) * canvas.height) / rect.height,
      }
    }

    const down = (e) => {
      const p = pos(e)
      drawingRef.current = true
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
    }
    const move = (e) => {
      if (!drawingRef.current) return
      const p = pos(e)
      ctx.lineTo(p.x, p.y)
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
      ctx.lineWidth = size
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
  }, [tool, color, size])

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    notify('Canvas cleared!', 'info')
  }

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const nextStats = get('gameStats', {})
    const art = [
      ...(nextStats.canvasArt || []),
      { id: Date.now(), data: canvas.toDataURL(), date: new Date().toISOString() },
    ]
    storageSet('gameStats', { ...nextStats, canvasArt: art })
    notify('Art saved!', 'success')
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `artwork-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
    notify('Artwork downloaded!', 'success')
  }

  const tools = [
    { id: 'brush', icon: '🖌️', label: 'Brush' },
    { id: 'eraser', icon: '🧽', label: 'Eraser' },
  ]

  return (
    <GameCard
      icon="fa-paint-brush"
      title="Digital Canvas"
      description="Express your creativity with digital art and doodling!"
      controls={
        <>
          <button type="button" onClick={clear} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary">
            Clear
          </button>
          <button type="button" onClick={save} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            Save
          </button>
          <button type="button" onClick={download} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary">
            Download
          </button>
        </>
      }
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-xl bg-canvas p-1">
          {tools.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              aria-label={t.label}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-base transition-colors ${
                tool === t.id ? 'bg-primary/15' : 'hover:bg-surface-hover'
              }`}
            >
              {t.icon}
            </button>
          ))}
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Choose Brush Color"
          aria-label="Brush Color"
          className="h-9 w-9 cursor-pointer rounded-lg border border-line-light bg-canvas"
        />
        <div className="flex gap-1">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Preset ${c}`}
              style={{ backgroundColor: c }}
              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                color === c ? 'border-primary' : 'border-line-light'
              }`}
            />
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-ink-2">
          Size: {size}
          <input
            type="range"
            min="1"
            max="20"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-24"
            style={{ accentColor: 'var(--primary-color)' }}
          />
        </label>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full cursor-crosshair rounded-2xl border border-line-light bg-white"
      />
    </GameCard>
  )
}
