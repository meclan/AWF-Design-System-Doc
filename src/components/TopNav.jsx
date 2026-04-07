import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext.jsx'
import { TOP_NAV, SEARCH_INDEX } from '../data/navConfig.js'

export default function TopNav() {
  const { mode, toggle } = useTheme()
  const [query, setQuery]   = useState('')
  const [open, setOpen]     = useState(false)
  const searchRef           = useRef(null)
  const navigate            = useNavigate()
  const location            = useLocation()

  const results = query.length > 1
    ? SEARCH_INDEX.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7)
    : []

  useEffect(() => {
    function handler(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setOpen(false); setQuery('') }, [location.pathname])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 'var(--topnav-height)',
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--stroke-primary)',
      display: 'flex', alignItems: 'center', padding: '0 24px',
      gap: 24, zIndex: 100,
    }}>
      {/* Logo */}
      <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: 'linear-gradient(135deg, var(--brand-400), var(--brand-600))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '-.5px',
        }}>ADS</div>
        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-.2px' }}>AWF</span>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 400 }}>Design System</span>
      </NavLink>

      {/* Separator */}
      <div style={{ width: 1, height: 20, background: 'var(--stroke-primary)', flexShrink: 0 }} />

      {/* Nav items */}
      <nav style={{ display: 'flex', gap: 2, flex: 1 }}>
        {TOP_NAV.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path + '/')) ||
            (item.path !== '/' && location.pathname === item.path)
          return (
            <NavLink key={item.path} to={item.path} style={{
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
              padding: '6px 12px', borderRadius: 8,
              background: isActive ? 'var(--brand-50)' : 'transparent',
              textDecoration: 'none', transition: 'all 120ms',
            }}>
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Search */}
      <div ref={searchRef} style={{ position: 'relative', width: 220, flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)', fontSize: 14, pointerEvents: 'none',
          }}>⌕</span>
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder="Search…"
            style={{
              width: '100%', padding: '7px 12px 7px 30px',
              fontSize: 13, borderRadius: 8,
              border: '1px solid var(--stroke-primary)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'Poppins, sans-serif',
            }}
          />
        </div>
        {open && results.length > 0 && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: 'var(--bg-primary)',
            border: '1px solid var(--stroke-primary)',
            borderRadius: 10, overflow: 'hidden',
            boxShadow: 'var(--shadow-md)', zIndex: 200,
          }}>
            {results.map((item, i) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 14px',
                  background: 'transparent', border: 'none',
                  borderBottom: i < results.length - 1 ? '1px solid var(--stroke-primary)' : 'none',
                  cursor: 'pointer', transition: 'background 80ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
                  {item.section} · {item.desc}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dark / light toggle */}
      <button
        onClick={toggle}
        title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--stroke-primary)',
          color: 'var(--text-secondary)',
          fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {mode === 'light' ? '☾' : '☀'}
      </button>
    </header>
  )
}
