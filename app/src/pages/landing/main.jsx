import { createRoot } from 'react-dom/client'
import '../../styles/main.css'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { LanguageProvider } from '../../shared/LanguageProvider'
import LandingPage from './LandingPage'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <LanguageProvider>
      <LandingPage />
    </LanguageProvider>
  </ThemeProvider>,
)
