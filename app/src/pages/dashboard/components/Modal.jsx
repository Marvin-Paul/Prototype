import { useEffect } from 'react'
import { useLanguage } from '../../../shared/LanguageProvider'

export default function Modal({ open, onClose, title, icon, children, maxWidth = 'max-w-lg' }) {
  const { t } = useLanguage()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`max-h-[85vh] w-full animate-fade-scale overflow-y-auto rounded-3xl border border-line-light bg-surface p-6 shadow-2xl ${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-5 flex items-start justify-between gap-4">
            <h3 className="flex items-center gap-3 text-lg font-bold text-ink">
              {icon && <i className={`fas ${icon} text-primary-text`} />}
              {title}
            </h3>
            <button
              type="button"
              aria-label={t('close')}
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-ink-2 transition-colors hover:bg-surface-hover hover:text-primary-text"
            >
              <i className="fas fa-times text-sm" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
