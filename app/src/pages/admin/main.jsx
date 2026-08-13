import { createRoot } from 'react-dom/client'
import '../../styles/main.css'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { LanguageProvider } from '../../shared/LanguageProvider'
import { Toasts } from '../../shared/toast'
import AdminPage from './AdminPage'

createRoot(document.getElementById('root')).render(
  <ThemeProvider mode="app">
    <LanguageProvider>
      <AdminPage />
      <Toasts />
    </LanguageProvider>
  </ThemeProvider>,
)
