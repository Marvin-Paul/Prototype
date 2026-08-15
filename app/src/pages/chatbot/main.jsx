import { createRoot } from 'react-dom/client'
import '../../styles/main.css'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { LanguageProvider } from '../../shared/LanguageProvider'
import ChatbotPage from './ChatbotPage'

createRoot(document.getElementById('root')).render(
  <ThemeProvider mode="app">
    <LanguageProvider>
      <ChatbotPage />
    </LanguageProvider>
  </ThemeProvider>,
)
