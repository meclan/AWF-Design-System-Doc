import React from 'react'
import { THEMES } from '../data/tokens/index.js'
import { useBrandTheme } from '../contexts/BrandThemeContext.jsx'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

/**
 * Sticky brand-theme picker rendered under a page's right-side TOC aside.
 * Consumes the global BrandThemeContext so every page stays in sync.
 */
export default function BrandThemeSwitcher() {
  const { brandTheme, setBrandTheme } = useBrandTheme()

  return (
    <div style={{
      marginTop: 20,
      paddingTop: 16,
      borderTop: '1px solid var(--stroke-primary)',
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
        color: 'var(--text-tertiary)', marginBottom: 10,
      }}>
        Preview theme
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {VISIBLE_THEMES.map(t => {
          const active = brandTheme === t.id
          return (
            <button
              key={t.id}
              onClick={() => setBrandTheme(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px', borderRadius: 6,
                border: '1px solid',
                borderColor: active ? t.color : 'transparent',
                background: active ? t.color + '18' : 'transparent',
                color: active ? t.color : 'var(--text-secondary)',
                fontSize: 12, fontWeight: active ? 600 : 400,
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 120ms',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-secondary)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: t.color, flexShrink: 0,
                border: '1px solid rgba(0,0,0,.1)',
              }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
