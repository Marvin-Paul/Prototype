import { createContext, useContext, useEffect, useState } from 'react'

const ACCENTS = [
  {
    key: 'ocean',
    label: 'Ocean',
    preview: 'linear-gradient(135deg, #00b5ad, #008b85)',
    overlay: 'linear-gradient(135deg, rgba(45,106,95,0.85) 0%, rgba(29,74,63,0.90) 100%)',
  },
  {
    key: 'sunset',
    label: 'Sunset',
    preview: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
    overlay: 'linear-gradient(135deg, rgba(255,107,107,0.85) 0%, rgba(255,165,0,0.90) 100%)',
  },
  {
    key: 'forest',
    label: 'Forest',
    preview: 'linear-gradient(135deg, #51cf66, #40c057)',
    overlay: 'linear-gradient(135deg, rgba(81,207,102,0.85) 0%, rgba(64,192,87,0.90) 100%)',
  },
  {
    key: 'cosmic',
    label: 'Cosmic',
    preview: 'linear-gradient(135deg, #9775fa, #748ffc)',
    overlay: 'linear-gradient(135deg, rgba(151,117,250,0.85) 0%, rgba(116,143,252,0.90) 100%)',
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
