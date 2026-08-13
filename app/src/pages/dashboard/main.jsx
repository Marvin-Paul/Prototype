import { createRoot } from 'react-dom/client'
import '../../styles/main.css'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { LanguageProvider } from '../../shared/LanguageProvider'
import { Toasts } from '../../shared/toast'
import DashboardPage from './DashboardPage'

createRoot(document.getElementById('root')).render(
  <ThemeProvider mode="app">
    <LanguageProvider>
      <DashboardPage />
      <Toasts />
    </LanguageProvider>
  </ThemeProvider>,
)
