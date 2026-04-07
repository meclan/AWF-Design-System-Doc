import React, { useState } from 'react'
import { getComponentTokens, THEMES } from '../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

function isColor(val) {
  return typeof val === 'string' && /^#[0-9a-f]{3,8}$/i.test(val)
}

export default function StubPage({ name, description, category, tokenPrefix, figmaUrl }) {
  const [themeId, setThemeId] = useState('dot')
  const tokens = getComponentTokens(themeId)
  const prefix = tokenPrefix + '.'
  const componentTokens = Object.entries(tokens)
    .filter(([k]) => k.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b))

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          {category && (
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase',
              color: 'var(--brand-600)', background: 'var(--brand-50)',
              padding: '3px 10px', borderRadius: 99,
            }}>{category}</span>
          )}
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase',
            color: 'var(--text-tertiary)', background: 'var(--bg-secondary)',
            padding: '3px 10px', borderRadius: 99,
          }}>Stable</span>
          {figmaUrl && (
            <a href={figmaUrl} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)',
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 99,
              border: '1px solid var(--stroke-primary)',
            }}>
              ↗ Figma
            </a>
          )}
        </div>
        <h1 style={{
          fontSize: 32, fontWeight: 700, letterSpacing: '-.5px',
          color: 'var(--text-primary)', marginBottom: 14,
        }}>{name}</h1>
        {description && (
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 600 }}>
            {description}
          </p>
        )}
      </div>

      {/* In-progress notice */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 12,
        border: '1px solid var(--stroke-primary)',
        padding: '24px 28px',
        marginBottom: 48,
        display: 'flex', alignItems: 'flex-start', gap: 16,
      }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>✦</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6 }}>
            Documentation in progress
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Usage guidelines, anatomy, variants, do&apos;s &amp; don&apos;ts, and accessibility notes are being written.
            The token reference below is complete and production-ready.
          </p>
        </div>
      </div>

      {/* Token table */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.3px', color: 'var(--text-primary)' }}>
            Component tokens
            <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-tertiary)', marginLeft: 10 }}>
              {componentTokens.length}
            </span>
          </h2>
          {/* Theme picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginRight: 4 }}>Theme</span>
            {VISIBLE_THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setThemeId(t.id)}
                title={t.label}
                style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: t.color,
                  border: themeId === t.id ? '2px solid var(--text-primary)' : '2px solid transparent',
                  outline: themeId === t.id ? '2px solid var(--bg-primary)' : 'none',
                  outlineOffset: 1,
                  cursor: 'pointer', padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {componentTokens.length === 0 ? (
          <div style={{
            padding: '32px', textAlign: 'center',
            color: 'var(--text-tertiary)', fontSize: 13,
            border: '1px solid var(--stroke-primary)', borderRadius: 12,
          }}>
            No tokens found for prefix <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{tokenPrefix}</code>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: '60%' }}>Token</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {componentTokens.map(([key, val], i) => (
                  <tr key={key} style={{ borderBottom: i < componentTokens.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                    <td style={{ padding: '9px 16px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', fontSize: 12 }}>
                      {key}
                    </td>
                    <td style={{ padding: '9px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {isColor(val) && (
                          <div style={{
                            width: 16, height: 16, borderRadius: 4,
                            background: val, border: '1px solid var(--stroke-primary)', flexShrink: 0,
                          }} />
                        )}
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)', fontSize: 12 }}>
                          {String(val)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
