import { createContext, useContext, useEffect, useState } from 'react'

const ACCENTS = [
  {
    key: 'ocean',
    label: 'Ocean',
    preview: 'linear-gradient(135deg, #9fe870, #7ed24b)',
    overlay: 'linear-gradient(135deg, rgba(14,15,12,0.85) 0%, rgba(30,42,20,0.92) 100%)',
  },
  {
    key: 'sunset',
    label: 'Sunset',
    preview: 'linear-gradient(135deg, #cdffad, #9fe870)',
    overlay: 'linear-gradient(135deg, rgba(20,26,16,0.85) 0%, rgba(38,52,24,0.92) 100%)',
  },
  {
    key: 'forest',
    label: 'Forest',
    preview: 'linear-gradient(135deg, #7ed24b, #4fae2a)',
    overlay: 'linear-gradient(135deg, rgba(10,16,8,0.85) 0%, rgba(24,36,16,0.92) 100%)',
  },
  {
    key: 'cosmic',
    label: 'Cosmic',
    preview: 'linear-gradient(135deg, #b5e88a, #86d84e)',
    overlay: 'linear-gradient(135deg, rgba(16,20,12,0.85) 0%, rgba(32,44,22,0.92) 100%)',
  },
]

const ThemeContext = createContext(null)

function useSystemTheme() {
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  const [systemTheme, setSystemTheme] = useState(query.matches ? 'dark' : 'light')

  useEffect(() => {
    const handler = (e) => setSystemTheme(e.matches ? 'dark' : 'light')
    query.addEventListener('change', handler)
    return () => query.removeEventListener('change', handler)
  }, [query])

  return systemTheme
}

// Landing pages: brand accent themes (ocean/sunset/forest/cosmic).
function LandingThemeProvider({ children }) {
  const [accent, setAccent] = useState(() => {
    const saved = localStorage.getItem('preferred-theme')
    return ACCENTS.some((a) => a.key === saved) ? saved : 'ocean'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = accent
    localStorage.setItem('preferred-theme', accent)
  }, [accent])

  const current = ACCENTS.find((a) => a.key === accent) ?? ACCENTS[0]

  return (
    <ThemeContext.Provider
      value={{
        mode: 'landing',
        accent,
        setAccent,
        accents: ACCENTS,
        overlayGradient: current.overlay,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// App pages: light/dark/auto theme mode (port of theme-manager.js).
// `auto` resolves via the design-tokens media query; effectiveTheme is
// computed only for display purposes.
function AppThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const systemTheme = useSystemTheme()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const effectiveTheme = theme === 'auto' ? systemTheme : theme

  return (
    <ThemeContext.Provider
      value={{ mode: 'app', theme, setTheme, systemTheme, effectiveTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function ThemeProvider({ mode = 'landing', children }) {
  if (mode === 'app') return <AppThemeProvider>{children}</AppThemeProvider>
  return <LandingThemeProvider>{children}</LandingThemeProvider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
