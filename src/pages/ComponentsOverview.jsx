import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { COMPONENTS_CONFIG, COMPONENT_CATEGORIES, CATEGORY_STYLE } from '../data/componentsConfig.js'

export default function ComponentsOverview() {
  const [activeCategory, setActiveCategory] = useState(null)

  const filtered = activeCategory
    ? COMPONENTS_CONFIG.filter(c => c.category === activeCategory)
    : COMPONENTS_CONFIG

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 40px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--text-primary)', marginBottom: 12 }}>
          Components
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 540 }}>
          {COMPONENTS_CONFIG.length} components, each with usage guidelines, token references, and accessibility notes.
          Live demos are available in Storybook.
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            padding: '5px 14px', borderRadius: 99, border: '1px solid var(--stroke-primary)',
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
            background: !activeCategory ? 'var(--brand-600)' : 'var(--bg-primary)',
            color: !activeCategory ? '#fff' : 'var(--text-secondary)',
            transition: 'all 120ms',
          }}
        >All</button>
        {COMPONENT_CATEGORIES.map(cat => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? null : cat)}
              style={{
                padding: '5px 14px', borderRadius: 99, border: '1px solid var(--stroke-primary)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                background: isActive ? 'var(--brand-600)' : 'var(--bg-primary)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                transition: 'all 120ms',
              }}
            >{cat}</button>
          )
        })}
      </div>

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {filtered.map(comp => {
          const catStyle = CATEGORY_STYLE[comp.category] || { color: 'var(--text-tertiary)', bg: 'var(--bg-secondary)' }
          return (
            <Link key={comp.path} to={comp.path} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: 'var(--bg-primary)', borderRadius: 12,
                  border: '1px solid var(--stroke-primary)',
                  padding: '18px', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  transition: 'border-color 120ms, box-shadow 120ms',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--brand-600)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--stroke-primary)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ marginBottom: 10 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase',
                    color: catStyle.color, background: catStyle.bg,
                    padding: '3px 8px', borderRadius: 99,
                  }}>{comp.category}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 7 }}>
                  {comp.name}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1, marginBottom: 14 }}>
                  {comp.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{comp.tokens} tokens</span>
                  <span style={{ fontSize: 12, color: 'var(--brand-600)', fontWeight: 500 }}>View docs →</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
