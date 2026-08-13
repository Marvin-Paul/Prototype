import { useEffect, useRef, useState } from 'react'
import { get, set as storageSet } from '../../../../shared/storage'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const PRESETS = {
  '4-4-4': { inhale: 4, hold: 4, exhale: 4, pause: 0 },
  '4-7-8': { inhale: 4, hold: 7, exhale: 8, pause: 0 },
  box: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
  custom: { inhale: 6, hold: 2, exhale: 6, pause: 0 },
}

export default function BreathingGame() {
  const [preset, setPreset] = useState('4-4-4')
  const [phase, setPhase] = useState('ready')
  const [instruction, setInstruction] = useState('Click Start to begin')
  const [running, setRunning] = useState(false)
  const stats = get('gameStats', {})
  const [sessions, setSessions] = useState(stats.breathingSessions || 0)
  const [totalTime, setTotalTime] = useState(stats.breathingTotalTime || 0)
  const runningRef = useRef(false)
  const startRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const runCycle = () => {
    if (!runningRef.current) return
    const { inhale, hold, exhale, pause } = PRESETS[preset]
    setPhase('inhale')
    setInstruction(`Inhale for ${inhale} seconds`)
    timer.current = setTimeout(() => {
      if (!runningRef.current) return
      setPhase('hold')
      setInstruction(`Hold for ${hold} seconds`)
      timer.current = setTimeout(() => {
        if (!runningRef.current) return
        setPhase('exhale')
        setInstruction(`Exhale for ${exhale} seconds`)
        timer.current = setTimeout(() => {
          if (!runningRef.current) return
          if (pause > 0) {
            setPhase('pause')
            setInstruction(`Pause for ${pause} seconds`)
            timer.current = setTimeout(runCycle, pause * 1000)
          } else {
            runCycle()
          }
        }, exhale * 1000)
      }, hold * 1000)
    }, inhale * 1000)
  }

  const start = () => {
    runningRef.current = true
    startRef.current = Date.now()
    setRunning(true)
    runCycle()
  }

  const stop = () => {
    runningRef.current = false
    clearTimeout(timer.current)
    setRunning(false)
    setPhase('ready')
    setInstruction('Click Start to begin')
    const elapsedMin = Math.max(1, Math.round((Date.now() - startRef.current) / 60000))
    const nextStats = get('gameStats', {})
    const nextSessions = (nextStats.breathingSessions || 0) + 1
    const nextTime = (nextStats.breathingTotalTime || 0) + elapsedMin
    storageSet('gameStats', { ...nextStats, breathingSessions: nextSessions, breathingTotalTime: nextTime })
    setSessions(nextSessions)
    setTotalTime(nextTime)
    notify('Breathing session saved!', 'success')
  }

  const scale = phase === 'inhale' || phase === 'hold' ? 'scale-125' : 'scale-100'

  return (
    <GameCard
      icon="fa-wind"
      title="Breathing Exercise"
      description="Follow the circle to calm your mind and reduce stress!"
      stats={[
        { label: 'Sessions', value: sessions },
        { label: 'Total Time', value: `${totalTime}m` },
        { label: 'Preset', value: preset },
      ]}
      controls={
        <>
          {!running ? (
            <button type="button" onClick={start} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90">
              <i className="fas fa-play mr-2" />
              Start Exercise
            </button>
          ) : (
            <button type="button" onClick={stop} className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              <i className="fas fa-stop mr-2" />
              Stop
            </button>
          )}
          <div className="ml-auto flex flex-wrap gap-1">
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPreset(key)}
                disabled={running}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  preset === key ? 'border-primary bg-primary/10 text-primary-text' : 'border-line-light bg-canvas text-ink-2 hover:border-primary hover:text-primary-text'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </>
      }
    >
      <div className="flex items-center justify-center py-4">
        <div
          className={`flex h-44 w-44 items-center justify-center rounded-full border-4 border-primary/30 bg-primary/10 transition-transform duration-700 ease-in-out ${scale}`}
        >
          <div className="text-center">
            <div className="text-lg font-bold text-primary-text capitalize">{phase === 'ready' ? 'Get Ready' : phase}</div>
            <div className="mt-1 px-4 text-xs text-ink-2">{instruction}</div>
          </div>
        </div>
      </div>
    </GameCard>
  )
}
