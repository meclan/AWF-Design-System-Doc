import React, { useState } from 'react'
import { layers, products, stats } from '../data/tokens.js'
import { THEMES, getSemanticTokens } from '../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

// Two groups show the key insight: brand tokens shift per theme, neutral tokens stay constant
const TOKEN_GROUPS = [
  {
    label: 'Brand tokens — resolve differently per theme',
    note: 'Each product maps these to its own color palette.',
    accent: true,
    keys: [
      'color.bg.brand.default',
      'color.bg.brand.strong',
      'color.bg.brand.subtle',
      'color.bg.brand.subtlest',
      'color.bg.brand.hover',
    ],
  },
  {
    label: 'Neutral tokens — identical across all themes',
    note: 'These reference the neutral palette and never change.',
    accent: false,
    keys: [
      'color.bg.default',
      'color.text.primary',
      'color.text.secondary',
    ],
  },
]

const NAMING_EXAMPLES = [
  { token: 'button.filled.bg.default',    breakdown: 'component · variant · property · state' },
  { token: 'button.filled.bg.hover',      breakdown: 'same — different state' },
  { token: 'input.outlined.stroke.focus', breakdown: 'component · variant · property · state' },
  { token: 'toast.icon.bg.success',       breakdown: 'component · part · property · type' },
]

const CODE_STEPS = [
  {
    title: '1 — Import the token API',
    code: `import { getComponentTokens } from 'data/tokens'`,
    desc: 'Single import point for all token resolution. Pass a theme ID to get fully resolved values for that product.',
  },
  {
    title: '2 — Resolve tokens for a theme',
    code: `const tokens = getComponentTokens('dot')\n// → { 'button.filled.bg.default': '#0077C8', ... }`,
    desc: 'Results are cached per theme. The returned object maps every component token key to its fully resolved value (hex color, number, etc.).',
  },
  {
    title: '3 — Apply to component styles',
    code: `style={{ background: tokens['button.filled.bg.default'] }}`,
    desc: 'Use dot-notation keys to access token values directly in inline styles. Every component page in this doc lists its full token set with resolved values per theme.',
  },
]

export default function TokensArchitecture() {
  const [activeTheme, setActiveTheme] = useState('dot')
  const semanticTokens = getSemanticTokens(activeTheme)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--brand-600)', marginBottom: 12 }}>
          Foundations
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--text-primary)', marginBottom: 16 }}>
          Token Architecture
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 620 }}>
          AWF uses a <strong>three-layer token system</strong> that separates raw values from semantic meaning,
          and semantic meaning from component-specific assignments.
          This architecture enables full multi-theme support across {products.length} ARCAD products
          without touching a single line of component code.
        </p>
      </div>

      {/* Three layers */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.3px', color: 'var(--text-primary)', marginBottom: 24 }}>
          The three layers
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16 }}>
          {[
            {
              name: 'Primitive tokens',
              count: stats.primitives,
              color: '#64748b',
              accentBg: 'var(--bg-secondary)',
              description: 'The foundation layer. Raw values with no semantic meaning: complete color palettes, spacing scale, type sizes, border radii. These are never referenced directly in components — they exist only to feed the semantic layer.',
              examples: ['color.neutral.50 → #f8fafc', 'color.brand.DOT.600 → #0077C8', 'numbers.spacing.md → 16', 'numbers.font-size.sm → 13'],
              note: `${stats.primitives} tokens across color, spacing, and typography scales.`,
            },
            {
              name: 'Semantic tokens',
              count: stats.semantic,
              color: '#0077C8',
              accentBg: '#e0f4f8',
              description: 'The meaning layer. Each token carries a purposeful role — "background of a brand surface", "primary text color", "focus ring stroke". Switching themes changes what these resolve to, but no component code changes.',
              examples: ['color.bg.brand.default', 'color.text.primary', 'color.icon.on-brand', 'color.stroke.focus'],
              note: `${stats.semantic} tokens covering backgrounds, text, icons, strokes, and status categories.`,
            },
            {
              name: 'Component tokens',
              count: stats.components,
              color: '#0099b8',
              accentBg: '#e0f4fd',
              description: 'The precision layer. Component-scoped token assignments: the exact token for the background of a filled button in its default state, the stroke of a focused input, the text color of an active nav item. These always reference semantic tokens, never raw values.',
              examples: ['button.filled.bg.default', 'input.outlined.stroke.focus', 'table.header.bg.contrast', 'toast.stroke.success'],
              note: `${stats.components} tokens across ${stats.components_count} components.`,
            },
          ].map((layer, i) => (
            <div key={layer.name} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr',
              border: '1px solid var(--stroke-primary)',
              borderRadius: i === 0 ? '12px 12px 4px 4px' : i === 2 ? '4px 4px 12px 12px' : '4px',
              overflow: 'hidden',
            }}>
              <div style={{ background: layer.accentBg, padding: '24px 20px', borderRight: '1px solid var(--stroke-primary)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: layer.color, marginBottom: 10 }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: layer.color, marginBottom: 4 }}>{layer.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{layer.count} tokens</div>
              </div>
              <div style={{ padding: '24px', background: 'var(--bg-primary)' }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 14 }}>
                  {layer.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {layer.examples.map(ex => (
                    <code key={ex} style={{
                      fontSize: 11, background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: 4,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>{ex}</code>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{layer.note}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center' }}>
          Primitives → Semantic → Component · Each layer references the one below.
          Switching a theme only replaces the Semantic layer.
        </p>
      </section>

      {/* Product themes */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.3px', color: 'var(--text-primary)', marginBottom: 10 }}>
          Product themes
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
          Each ARCAD product maps to a distinct semantic token set. The primitive and component layers are shared across all products;
          only the semantic layer is swapped when changing themes.
        </p>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Theme tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid var(--stroke-primary)',
            background: 'var(--bg-secondary)', overflowX: 'auto',
          }}>
            {VISIBLE_THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTheme(t.id)}
                style={{
                  padding: '10px 18px', fontSize: 12, fontWeight: activeTheme === t.id ? 600 : 400,
                  color: activeTheme === t.id ? t.color : 'var(--text-secondary)',
                  borderBottom: activeTheme === t.id ? `2px solid ${t.color}` : '2px solid transparent',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  borderRadius: 0, whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, display: 'inline-block', flexShrink: 0 }} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Sample resolved tokens — grouped */}
          <div style={{ padding: '20px 24px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {TOKEN_GROUPS.map(group => {
              const resolvedKeys = group.keys.filter(k => semanticTokens[k])
              return (
                <div key={group.label}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: group.accent ? 'var(--brand-600)' : 'var(--text-tertiary)' }}>
                      {group.label}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{group.note}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {resolvedKeys.map(key => {
                      const val = semanticTokens[key]
                      const isHex = typeof val === 'string' && val.startsWith('#')
                      return (
                        <div key={key} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 8,
                        }}>
                          {isHex && (
                            <div style={{
                              width: 22, height: 22, borderRadius: 5, background: val,
                              border: '1px solid var(--stroke-primary)', flexShrink: 0,
                            }} />
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{key}</div>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-tertiary)' }}>{val}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Usage in code */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.3px', color: 'var(--text-primary)', marginBottom: 24 }}>
          Using tokens in code
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CODE_STEPS.map(step => (
            <div key={step.title} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{
                padding: '10px 16px', background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--stroke-primary)',
                fontSize: 12, fontWeight: 600, color: 'var(--text-primary)',
              }}>
                {step.title}
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-primary)' }}>
                <pre style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                  color: 'var(--brand-600)', background: 'var(--bg-secondary)',
                  padding: '10px 14px', borderRadius: 6, overflow: 'auto', marginBottom: 12,
                  whiteSpace: 'pre-wrap',
                }}>{step.code}</pre>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Naming convention */}
      <section>
        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.3px', color: 'var(--text-primary)', marginBottom: 16 }}>
          Naming convention
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          Component tokens follow a four-segment pattern. Every segment adds specificity,
          making tokens both predictable and self-documenting.
        </p>

        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 10,
          padding: '18px 24px', border: '1px solid var(--stroke-primary)', marginBottom: 20,
        }}>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, color: 'var(--text-primary)', letterSpacing: '.04em' }}>
            [component].[variant].[property].[state]
          </code>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {NAMING_EXAMPLES.map(ex => (
            <div key={ex.token} style={{
              padding: '14px 16px', background: 'var(--bg-primary)',
              border: '1px solid var(--stroke-primary)', borderRadius: 8,
            }}>
              <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--brand-600)', display: 'block', marginBottom: 6 }}>
                {ex.token}
              </code>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{ex.breakdown}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
