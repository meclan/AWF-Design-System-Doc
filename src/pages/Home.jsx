import React from 'react'
import { Link } from 'react-router-dom'
import { products, stats } from '../data/tokens.js'

const QUICK_LINKS = [
  { label: 'Getting started', desc: 'Set up AWF in your project', path: '/guides/getting-started' },
  { label: 'Token architecture', desc: 'Understand the 3-layer token system', path: '/themes/tokens' },
  { label: 'Browse components', desc: 'All UI components with token references', path: '/components' },
  { label: 'Theming guide', desc: 'Apply and customize product themes', path: '/guides/theming' },
]

export default function Home() {
  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '72px 40px 80px' }}>

      {/* Hero */}
      <div style={{ marginBottom: 64 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
          fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 5,
            background: 'linear-gradient(135deg, var(--brand-400), var(--brand-600))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, fontWeight: 700, color: '#fff',
          }}>ADS</div>
          ARCAD Design System
        </div>

        <h1 style={{
          fontSize: 52, fontWeight: 700, letterSpacing: '-2px',
          color: 'var(--text-primary)', lineHeight: 1.08, marginBottom: 24, maxWidth: 680,
        }}>
          AWF — Arcad Web Framework
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 540, marginBottom: 36 }}>
          A unified design language and token system powering {products.length} ARCAD products.
          Built for consistency, flexibility, and multi-theme support.
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/components" style={{
            padding: '11px 22px', borderRadius: 10, fontWeight: 600, fontSize: 14,
            background: 'var(--brand-600)', color: '#fff', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Browse components →
          </Link>
          <Link to="/themes/tokens" style={{
            padding: '11px 22px', borderRadius: 10, fontWeight: 500, fontSize: 14,
            background: 'var(--bg-secondary)', color: 'var(--text-primary)',
            border: '1px solid var(--stroke-primary)', textDecoration: 'none',
          }}>
            Token architecture
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 64 }}>
        {[
          { label: 'Primitive tokens', value: stats.primitives },
          { label: 'Semantic tokens',  value: stats.semantic },
          { label: 'Component tokens', value: stats.components },
          { label: 'Themes',           value: stats.modes },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-primary)', borderRadius: 12,
            border: '1px solid var(--stroke-primary)',
            padding: '20px 20px 18px',
          }}>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-1.5px', color: 'var(--brand-600)', lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ marginBottom: 64 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.3px', color: 'var(--text-primary)', marginBottom: 16 }}>
          Quick links
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {QUICK_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 20px',
                background: 'var(--bg-primary)', border: '1px solid var(--stroke-primary)',
                borderRadius: 12, textDecoration: 'none', transition: 'border-color 120ms',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-600)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--stroke-primary)'}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                  {link.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{link.desc}</div>
              </div>
              <span style={{ fontSize: 18, color: 'var(--text-tertiary)', marginLeft: 16, flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.3px', color: 'var(--text-primary)', marginBottom: 16 }}>
          Products using AWF
        </h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {products.map(p => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 14px', borderRadius: 99,
              background: 'var(--bg-primary)', border: '1px solid var(--stroke-primary)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
