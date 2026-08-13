import { useEffect, useState } from 'react'

// Tiny event-based toast system. notify() is callable from anywhere
// (mirrors AppUtils.showNotification in the prototype); <Toasts/> renders them.

const listeners = new Set()

export function notify(message, type = 'info', duration = 3000) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  listeners.forEach((fn) => fn({ id, message, type, duration }))
}

function onNotify(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

const TYPE_STYLES = {
  success: { icon: 'fa-check-circle', color: 'text-success', bar: 'bg-success' },
  danger: { icon: 'fa-exclamation-circle', color: 'text-danger', bar: 'bg-danger' },
  error: { icon: 'fa-exclamation-circle', color: 'text-danger', bar: 'bg-danger' },
  warning: { icon: 'fa-exclamation-triangle', color: 'text-warning', bar: 'bg-warning' },
  info: { icon: 'fa-info-circle', color: 'text-primary', bar: 'bg-primary' },
}

export function Toasts() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const unsubscribe = onNotify((toast) => {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, toast.duration)
    })
    return unsubscribe
  }, [])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-4 right-4 z-[200] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
    >
      {toasts.map((toast) => {
        const style = TYPE_STYLES[toast.type] ?? TYPE_STYLES.info
        return (
          <div
            key={toast.id}
            className="pointer-events-auto animate-slide-up overflow-hidden rounded-2xl border border-line-light bg-surface p-4 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <i className={`fas ${style.icon} mt-0.5 ${style.color}`} />
              <p className="flex-1 text-sm leading-snug font-medium text-ink">{toast.message}</p>
            </div>
            <div className={`mt-3 h-0.5 ${style.bar}`} />
          </div>
        )
      })}
    </div>
  )
}
