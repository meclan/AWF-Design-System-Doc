import React, { createContext, useContext, useEffect, useState } from 'react'

const BrandThemeCtx = createContext({ brandTheme: 'dot', setBrandTheme: () => {} })

export function BrandThemeProvider({ children }) {
  const [brandTheme, setBrandTheme] = useState(() => {
    try { return localStorage.getItem('awf-brand-theme') || 'dot' } catch { return 'dot' }
  })

  useEffect(() => {
    try { localStorage.setItem('awf-brand-theme', brandTheme) } catch {}
  }, [brandTheme])

  return (
    <BrandThemeCtx.Provider value={{ brandTheme, setBrandTheme }}>
      {children}
    </BrandThemeCtx.Provider>
  )
}

export const useBrandTheme = () => useContext(BrandThemeCtx)
