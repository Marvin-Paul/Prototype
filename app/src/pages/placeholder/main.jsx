import { createRoot } from 'react-dom/client'
import Icon from '../../shared/Icon'
import '../../styles/main.css'
import { ThemeProvider } from '../../shared/ThemeProvider'

function PlaceholderPage() {
  const page = document.getElementById('root')?.dataset.page || 'Page'
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="max-w-md rounded-3xl border border-line bg-surface p-10 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] text-2xl text-on-primary">
          <Icon icon="fa-brain" />
        </div>
        <h1 className="mb-2 text-2xl font-extrabold text-ink">{page}</h1>
        <p className="text-ink-2">
          This page will be built in the next milestone of the React conversion.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-xl bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-6 py-3 font-semibold text-on-primary shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        >
          Back to Home
        </a>
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <PlaceholderPage />
  </ThemeProvider>,
)
