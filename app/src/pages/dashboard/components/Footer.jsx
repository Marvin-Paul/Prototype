import { useLanguage } from '../../../shared/LanguageProvider'

export default function Footer() {
  const { t } = useLanguage()

  const linkClass = 'text-[#e8efed]/80 no-underline transition-colors hover:text-white'

  return (
    <footer className="mt-12 border-t border-white/10 bg-[rgba(13,36,32,0.92)] px-6 py-10 text-[#e8efed] backdrop-blur-[6px] md:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Crisis note */}
        <div className="mb-8 flex items-center gap-4 rounded-xl border border-red-300/35 bg-[rgba(220,38,38,0.16)] p-4 text-[#fecaca]">
          <i className="fas fa-heart flex-shrink-0 text-xl text-red-300" />
          <p className="m-0 text-[0.9rem] leading-[1.5]">
            <strong className="text-white">{t('footer_crisis_title')}</strong>{' '}
            {t('footer_crisis_text').split(' 988 ').length === 2 ? (
              <>
                {t('footer_crisis_text').split(' 988 ')[0]}{' '}
                <strong className="text-white">988</strong> {t('footer_crisis_text').split(' 988 ')[1]}
              </>
            ) : (
              t('footer_crisis_text')
            )}
          </p>
        </div>

        {/* Columns */}
        <div className="mb-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-[0.95rem] font-normal uppercase tracking-[0.04em] text-white">
              <i className="fas fa-brain text-primary-text" /> Campus Mindspace
            </h4>
            <p className="text-[0.85rem] leading-[1.6] text-[#e8efed]/80">{t('footer_about_desc')}</p>
          </div>

          <div>
            <h4 className="mb-3 text-[0.95rem] font-normal uppercase tracking-[0.04em] text-white">{t('footer_quick_links')}</h4>
            <ul className="m-0 list-none p-0">
              <li className="mb-1 text-[0.85rem]">
                <a href="/dashboard.html#therapy" className={linkClass}>
                  Therapy
                </a>
              </li>
              <li className="mb-1 text-[0.85rem]">
                <a href="/dashboard.html#meditation" className={linkClass}>
                  Meditation
                </a>
              </li>
              <li className="mb-1 text-[0.85rem]">
                <a href="/dashboard.html#appointments" className={linkClass}>
                  Appointments
                </a>
              </li>
              <li className="mb-1 text-[0.85rem]">
                <a href="/dashboard.html#insights" className={linkClass}>
                  Insights
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-[0.95rem] font-normal uppercase tracking-[0.04em] text-white">{t('footer_support')}</h4>
            <ul className="m-0 list-none p-0">
              <li className="mb-1 text-[0.85rem]">
                <a href="support.html" className={linkClass}>
                  {t('footer_contact_support')}
                </a>
              </li>
              <li className="mb-1 text-[0.85rem]">
                <a href="dashboard.html" className={linkClass}>
                  {t('footer_student_dashboard')}
                </a>
              </li>
              <li className="mb-1 text-[0.85rem]">
                <a href="admin-dashboard.html" className={linkClass}>
                  {t('footer_counselor_portal')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-[0.95rem] font-normal uppercase tracking-[0.04em] text-white">{t('footer_privacy')}</h4>
            <p className="text-[0.85rem] leading-[1.6] text-[#e8efed]/80">{t('footer_privacy_desc')}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-[0.8rem] text-[#e8efed]/70">
          <span>{t('footer_copyright')}</span>
          <span>{t('footer_not_medical')}</span>
        </div>
      </div>
    </footer>
  )
}
