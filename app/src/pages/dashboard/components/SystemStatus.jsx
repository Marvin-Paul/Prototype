import { useCallback, useEffect, useState } from 'react'
import Icon from '../../../shared/Icon'
import { useLanguage } from '../../../shared/LanguageProvider'
import { supabaseClient } from '../../../shared/supabase'

// Port of prototype/js/system-status.js
// Fixed bottom-right pill that checks Supabase auth + DB every 30 seconds.
const DOT_COLORS = {
  checking: 'bg-ink-3',
  online: 'bg-success',
  warning: 'bg-warning',
  offline: 'bg-danger',
}

const STATUS_LABELS = {
  checking: 'status_checking',
  online: 'status_cloud',
  warning: 'status_partial',
  offline: 'status_offline',
}

export default function SystemStatus() {
  const { t } = useLanguage()
  const [state, setState] = useState('checking')
  const [checks, setChecks] = useState({ auth: null, db: null })

  const check = useCallback(async () => {
    let authOk = false
    let dbOk = false
    try {
      await supabaseClient.auth.getSession()
      authOk = true
    } catch (e) {
      authOk = false
    }
    try {
      const { error } = await supabaseClient.from('profiles').select('id').limit(1)
      dbOk = !error
    } catch (e) {
      dbOk = false
    }
    const next = authOk && dbOk ? 'online' : authOk || dbOk ? 'warning' : 'offline'
    setChecks({ auth: authOk, db: dbOk })
    setState(next)
  }, [])

  useEffect(() => {
    check()
    const id = setInterval(check, 30000)
    return () => clearInterval(id)
  }, [check])

  return (
    <div className="group fixed right-5 bottom-24 z-[70] flex cursor-pointer items-center gap-2 rounded-full border border-line-light bg-surface/95 px-4 py-2 text-xs font-medium text-ink shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1">
      <span className={`h-2.5 w-2.5 rounded-full ${DOT_COLORS[state]}`} style={state === 'online' ? { boxShadow: '0 0 8px var(--success-color)' } : undefined} />
      <span>{t(STATUS_LABELS[state])}</span>

      <div className="pointer-events-none absolute right-0 bottom-full mb-2 hidden min-w-[210px] rounded-2xl border border-line-light bg-surface p-4 shadow-2xl group-hover:block">
        <h4 className="mb-2.5 text-sm font-bold text-ink">{t('status_health')}</h4>
        <ul className="space-y-2 text-xs text-ink-2">
          <li className="flex items-center justify-between">
            <span>{t('status_auth')}</span>
            {checks.auth === null ? (
              <Icon icon="fa-circle-notch" spin className="text-primary-text" />
            ) : checks.auth ? (
              <span className="flex items-center gap-1 font-semibold text-success">
                <Icon icon="fa-check-circle" /> {t('status_ok')}
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-danger">
                <Icon icon="fa-times-circle" /> {t('status_fail')}
              </span>
            )}
          </li>
          <li className="flex items-center justify-between">
            <span>{t('status_database')}</span>
            {checks.db === null ? (
              <Icon icon="fa-circle-notch" spin className="text-primary-text" />
            ) : checks.db ? (
              <span className="flex items-center gap-1 font-semibold text-success">
                <Icon icon="fa-check-circle" /> {t('status_ok')}
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-danger">
                <Icon icon="fa-times-circle" /> {t('status_fail')}
              </span>
            )}
          </li>
        </ul>
      </div>
    </div>
  )
}
