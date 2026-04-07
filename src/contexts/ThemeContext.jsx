import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeCtx = createContext({ mode: 'light', toggle: () => {} })

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('awf-theme') || 'light' } catch { return 'light' }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    try { localStorage.setItem('awf-theme', mode) } catch {}
  }, [mode])

  const toggle = () => setMode(m => m === 'light' ? 'dark' : 'light')

  return <ThemeCtx.Provider value={{ mode, toggle }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
