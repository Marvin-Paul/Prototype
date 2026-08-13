import { useLanguage } from '../../../shared/LanguageProvider'

export default function ComingSoonSection({ icon, titleKey }) {
  const { t } = useLanguage()
  return (
    <section className="flex min-h-[60vh] animate-fade-up items-center justify-center">
      <div className="max-w-md rounded-3xl border border-line bg-surface p-10 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] text-2xl text-white shadow-glow">
          <i className={`fas ${icon}`} />
        </div>
        <h2 className="mb-2 text-2xl font-extrabold text-ink">{t(titleKey)}</h2>
        <p className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {t('coming_soon')}
        </p>
        <p className="text-sm leading-relaxed text-ink-2">{t('coming_soon_desc')}</p>
      </div>
    </section>
  )
}
