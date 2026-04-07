import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { SIDEBAR_NAV } from '../data/navConfig.js'
import { COMPONENTS_CONFIG } from '../data/componentsConfig.js'

export default function ContextSidebar() {
  const location = useLocation()
  const [sortAZ, setSortAZ] = useState(false)

  // Find which top-level section we're in
  const sectionKey = Object.keys(SIDEBAR_NAV).find(key =>
    location.pathname === key || location.pathname.startsWith(key + '/')
  )

  const items = sectionKey ? SIDEBAR_NAV[sectionKey] : null
  if (!items) return null

  const isComponents = sectionKey === '/components'

  const linkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '6px 20px',
    fontSize: 13,
    fontWeight: isActive ? 500 : 400,
    color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
    background: isActive ? 'var(--brand-50)' : 'transparent',
    borderLeft: isActive ? '2px solid var(--brand-600)' : '2px solid transparent',
    textDecoration: 'none',
    transition: 'all 120ms',
  })

  // A-Z flat list — all component nav items sorted alphabetically
  const azList = sortAZ
    ? [...COMPONENTS_CONFIG]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(c => ({ label: c.name, path: c.path }))
    : null

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      flexShrink: 0,
      background: 'var(--bg-primary)',
      borderRight: '1px solid var(--stroke-primary)',
      overflowY: 'auto',
      height: '100%',
      padding: '20px 0',
    }}>
      {/* A-Z toggle — only shown in components section */}
      {isComponents && (
        <div style={{ padding: '0 16px 14px', borderBottom: '1px solid var(--stroke-primary)', marginBottom: 12 }}>
          <div style={{
            display: 'flex', borderRadius: 8, overflow: 'hidden',
            border: '1px solid var(--stroke-primary)', background: 'var(--bg-secondary)',
          }}>
            <button
              onClick={() => setSortAZ(false)}
              style={{
                flex: 1, padding: '5px 0', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                background: !sortAZ ? 'var(--brand-600)' : 'transparent',
                color: !sortAZ ? '#fff' : 'var(--text-tertiary)',
                border: 'none', transition: 'all 120ms',
              }}
            >Grouped</button>
            <button
              onClick={() => setSortAZ(true)}
              style={{
                flex: 1, padding: '5px 0', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                background: sortAZ ? 'var(--brand-600)' : 'transparent',
                color: sortAZ ? '#fff' : 'var(--text-tertiary)',
                border: 'none', transition: 'all 120ms',
              }}
            >A → Z</button>
          </div>
        </div>
      )}

      {/* A-Z list */}
      {isComponents && sortAZ && (
        <>
          <NavLink to="/components" end style={linkStyle}>Overview</NavLink>
          <div style={{ height: 8 }} />
          {azList.map(item => (
            <NavLink key={item.path} to={item.path} style={linkStyle}>
              {item.label}
            </NavLink>
          ))}
        </>
      )}

      {/* Grouped list (default) */}
      {(!isComponents || !sortAZ) && items.map((item) => {
        if (item.group) {
          return (
            <div key={item.group} style={{ marginBottom: 4 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '.12em',
                textTransform: 'uppercase', color: 'var(--text-tertiary)',
                padding: '12px 20px 4px',
              }}>
                {item.group}
              </div>
              {item.items.map(child => (
                <NavLink key={child.path} to={child.path} style={linkStyle}>
                  {child.label}
                </NavLink>
              ))}
            </div>
          )
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end ?? false}
            style={linkStyle}
          >
            {item.label}
          </NavLink>
        )
      })}
    </aside>
  )
}
