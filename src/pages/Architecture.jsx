import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { stats, layers } from '../data/tokens.js'
import { THEMES, getSemanticTokens } from '../data/tokens/index.js'

// ─── Data ────────────────────────────────────────────────────────────────────

const LAYER_COLORS = ['#64748b', '#0077C8', '#0099b8']
const LAYER_BG     = ['#64748b12', '#0077C812', '#0099b812']

/** Hardcoded resolution chain for the "Follow a token" demo — left to right: raw → usage */
const CHAIN = [
  {
    layer: 'Primitive',
    layerIndex: 0,
    token: 'color.brand.{PRODUCT}.600',
    description: 'Raw palette step — the only place hex values live. Defined once per brand palette.',
    references: null,
  },
  {
    layer: 'Semantic',
    layerIndex: 1,
    token: 'color.bg.brand.default',
    description: 'Semantic alias — carries intent: "brand background, default state". References the primitive.',
    references: 'color.brand.{PRODUCT}.600',
  },
  {
    layer: 'Component',
    layerIndex: 2,
    token: 'button.filled.bg.default',
    description: 'Component-scoped token — precisely assigned to a button part and state.',
    references: 'color.bg.brand.default',
  },
]

const NAMING_RULES = [
  {
    icon: '✦',
    title: 'Semantic over literal',
    good: 'color.bg.brand.default',
    bad: 'color.teal.600',
    desc: 'Tokens describe intent, not the color itself. This is what makes theming possible.',
  },
  {
    icon: '⬡',
    title: 'Component tokens never hold raw values',
    good: 'button.filled.bg.default → color.bg.brand.default',
    bad: 'button.filled.bg.default → #07A2B6',
    desc: 'Component tokens always reference a Semantic token. Never skip a layer.',
  },
  {
    icon: '◈',
    title: 'State in the last segment',
    good: 'color.bg.brand.default / .hover / .pressed',
    bad: 'color.default-bg-brand / color.hover-bg-brand',
    desc: 'Keep the state variant at the end to allow clean grouping and autocomplete.',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function CodeChip({ children, color, bg }) {
  return (
    <code style={{
      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
      color: color ?? 'var(--text-secondary)',
      background: bg ?? 'var(--bg-secondary)',
      padding: '3px 9px', borderRadius: 5,
      whiteSpace: 'nowrap',
      letterSpacing: '.01em',
    }}>
      {children}
    </code>
  )
}

function LayerBadge({ index }) {
  const color = LAYER_COLORS[index]
  const labels = ['Primitive', 'Semantic', 'Component']
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, letterSpacing: '.07em',
      textTransform: 'uppercase',
      color, background: color + '18',
      padding: '2px 8px', borderRadius: 99,
    }}>
      {labels[index]}
    </span>
  )
}

// ─── Section 1 : Three-layer diagram ─────────────────────────────────────────

function LayerDiagram() {
  const [hovered, setHovered] = useState(null)

  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '.08em',
          textTransform: 'uppercase', color: 'var(--text-tertiary)',
          marginBottom: 8,
        }}>
          01 — The system
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--text-primary)', marginBottom: 8 }}>
          Three-layer architecture
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 520 }}>
          Each layer has one responsibility. Values live in Primitives, meaning lives in Semantic,
          usage lives in Component. Never skip a layer.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, position: 'relative' }}>
        {layers.map((layer, i) => {
          const isHov = hovered === i
          return (
            <div key={layer.name} style={{ display: 'flex', alignItems: 'stretch' }}>
              {/* Arrow connector */}
              {i > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 0, position: 'relative', zIndex: 1,
                }}>
                  <div style={{
                    position: 'absolute',
                    width: 32, height: 2,
                    background: `linear-gradient(90deg, ${LAYER_COLORS[i-1]}, ${LAYER_COLORS[i]})`,
                    left: -16,
                    display: 'flex', alignItems: 'center',
                  }}>
                    <div style={{
                      position: 'absolute', right: -1,
                      width: 0, height: 0,
                      borderLeft: `6px solid ${LAYER_COLORS[i]}`,
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                    }} />
                  </div>
                </div>
              )}

              {/* Layer card */}
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  flex: 1,
                  background: 'var(--bg-primary)',
                  border: `1px solid ${isHov ? LAYER_COLORS[i] : 'var(--stroke-primary)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: 28,
                  marginLeft: i > 0 ? 24 : 0,
                  animation: `fadeUp 400ms ease ${i * 100}ms both`,
                  transition: 'border-color 200ms, box-shadow 200ms',
                  boxShadow: isHov ? `0 0 0 3px ${LAYER_COLORS[i]}18` : 'none',
                  position: 'relative', overflow: 'hidden',
                  cursor: 'default',
                }}
              >
                {/* Top bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: LAYER_COLORS[i],
                  opacity: isHov ? 1 : .6,
                  transition: 'opacity 200ms',
                }} />

                {/* Layer number */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 20,
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
                    textTransform: 'uppercase', color: LAYER_COLORS[i],
                    opacity: .7,
                  }}>
                    Layer {i + 1}
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: LAYER_COLORS[i],
                    background: LAYER_COLORS[i] + '18',
                    padding: '3px 10px', borderRadius: 99,
                  }}>
                    {layer.count} tokens
                  </div>
                </div>

                {/* Name */}
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--text-primary)', marginBottom: 10 }}>
                  {layer.name}
                </div>

                {/* Description */}
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>
                  {layer.description}
                </div>

                {/* Sample tokens */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {layer.tokens.map(t => (
                    <CodeChip key={t} color={LAYER_COLORS[i]} bg={LAYER_COLORS[i] + '10'}>
                      {t}
                    </CodeChip>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Section 2 : Resolution chain ────────────────────────────────────────────

function ResolutionChain() {
  const [activeStep, setActiveStep] = useState(null)

  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '.08em',
          textTransform: 'uppercase', color: 'var(--text-tertiary)',
          marginBottom: 8,
        }}>
          02 — Resolution
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--text-primary)', marginBottom: 8 }}>
          Follow a token
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 520 }}>
          Every component token resolves through two alias hops to reach a raw value.
          Hover each step to understand its role.
        </p>
      </div>

      {/* Chain track */}
      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--stroke-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 36,
        animation: 'fadeUp 400ms ease 100ms both',
      }}>
        {/* Step nodes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
          {/* Raw hex value — leftmost node */}
          <div
            onMouseEnter={() => setActiveStep(3)}
            onMouseLeave={() => setActiveStep(null)}
            style={{
              flexShrink: 0,
              background: activeStep === 3 ? '#07A2B6' : '#07A2B620',
              border: `1.5px solid ${activeStep === 3 ? '#07A2B6' : '#07A2B640'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              cursor: 'default',
              transition: 'all 150ms ease',
              minWidth: 100,
              textAlign: 'center',
            }}
          >
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '.07em',
              textTransform: 'uppercase',
              color: activeStep === 3 ? 'rgba(255,255,255,.7)' : '#07A2B6',
              display: 'block', marginBottom: 6,
            }}>
              Raw value
            </span>
            <span style={{
              fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700, color: activeStep === 3 ? '#fff' : '#07A2B6',
              letterSpacing: '.04em',
            }}>
              #07A2B6
            </span>
          </div>
          <div style={{ flexShrink: 0, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 16 }}>→</div>

          {CHAIN.map((step, i) => {
            const color  = LAYER_COLORS[step.layerIndex]
            const isHov  = activeStep === i
            const tokenDisplay = step.token.replace('{PRODUCT}', 'DOT')
            return (
              <React.Fragment key={i}>
                {/* Node */}
                <div
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                  style={{
                    flex: 1,
                    background: isHov ? color + '10' : 'var(--bg-subtle)',
                    border: `1.5px solid ${isHov ? color : 'var(--stroke-primary)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 16px',
                    cursor: 'default',
                    transition: 'all 150ms ease',
                    boxShadow: isHov ? `0 0 0 3px ${color}18` : 'none',
                  }}
                >
                  <LayerBadge index={step.layerIndex} />
                  <div style={{
                    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                    color: isHov ? color : 'var(--text-primary)',
                    fontWeight: 500, marginTop: 8,
                    transition: 'color 150ms',
                    letterSpacing: '.01em',
                    wordBreak: 'break-all',
                  }}>
                    {tokenDisplay}
                  </div>
                </div>

                {/* Arrow */}
                {i < CHAIN.length - 1 && (
                  <div style={{
                    flexShrink: 0, width: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-tertiary)', fontSize: 16,
                  }}>
                    →
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Step detail panel */}
        <div style={{
          borderTop: '1px solid var(--stroke-primary)',
          paddingTop: 20,
          minHeight: 52,
        }}>
          {activeStep !== null && activeStep < 3 ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, animation: 'fadeUp 200ms ease both' }}>
              <div style={{
                width: 3, alignSelf: 'stretch', borderRadius: 2,
                background: LAYER_COLORS[CHAIN[activeStep]?.layerIndex],
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {CHAIN[activeStep].layer} layer
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {CHAIN[activeStep].description}
                </div>
                {CHAIN[activeStep].references && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>References →</span>
                    <CodeChip>{CHAIN[activeStep].references.replace('{PRODUCT}', 'DOT')}</CodeChip>
                  </div>
                )}
              </div>
            </div>
          ) : activeStep === 3 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeUp 200ms ease both' }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: '#07A2B6', border: '1px solid rgba(0,0,0,.08)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                  Raw hex value — source of truth
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  The only place an actual color lives. It is stored in <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>color.brand.DOT.600</code> and every token above aliases it — never copies it.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              Hover a step to learn its role in the resolution chain →
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Section 3 : Theming model ────────────────────────────────────────────────

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

function ThemingModel() {
  const [activeToken, setActiveToken] = useState('color.bg.brand.default')

  const TOKEN_OPTIONS = [
    { key: 'color.bg.brand.default',   label: 'bg.brand.default',   hint: '→ brand.600' },
    { key: 'color.bg.brand.subtle',    label: 'bg.brand.subtle',    hint: '→ brand.200' },
    { key: 'color.bg.brand.subtlest',  label: 'bg.brand.subtlest',  hint: '→ brand.100' },
  ]

  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '.08em',
          textTransform: 'uppercase', color: 'var(--text-tertiary)',
          marginBottom: 8,
        }}>
          03 — Theming
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--text-primary)', marginBottom: 8 }}>
          One token, six resolutions
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560 }}>
          The Component and Semantic token names never change across products.
          Only the Primitive palette referenced by the Semantic layer changes — one mode switch, everything adapts.
        </p>
      </div>

      {/* Token selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {TOKEN_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => setActiveToken(opt.key)}
            style={{
              padding: '6px 14px', borderRadius: 99,
              fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 500,
              background: activeToken === opt.key ? 'var(--text-primary)' : 'var(--bg-primary)',
              color: activeToken === opt.key ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: `1px solid ${activeToken === opt.key ? 'var(--text-primary)' : 'var(--stroke-primary)'}`,
              cursor: 'pointer',
              transition: 'all 150ms ease',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {opt.label}
            <span style={{
              fontSize: 10, opacity: .55,
              fontWeight: 400, letterSpacing: '.02em',
            }}>
              {opt.hint}
            </span>
          </button>
        ))}
      </div>

      {/* Theme resolution grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 12,
        animation: 'fadeUp 400ms ease 100ms both',
      }}>
        {VISIBLE_THEMES.map((theme, i) => {
          const tokens  = getSemanticTokens(theme.id)
          const value   = tokens[activeToken]
          const hasValue = value && !value.startsWith('{')
          return (
            <div
              key={theme.id}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--stroke-primary)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                animation: `fadeUp 400ms ease ${i * 50 + 80}ms both`,
              }}
            >
              {/* Color preview */}
              <div style={{
                height: 64,
                background: hasValue ? value : 'var(--bg-secondary)',
                display: 'flex', alignItems: 'flex-end',
                padding: '0 12px 8px',
              }}>
                {hasValue && (
                  <span style={{
                    fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600, letterSpacing: '.04em',
                    color: value ? (parseInt(value.slice(1,3),16)*299 + parseInt(value.slice(3,5),16)*587 + parseInt(value.slice(5,7),16)*114)/1000 > 140 ? 'rgba(0,0,0,.45)' : 'rgba(255,255,255,.65)' : '',
                  }}>
                    {value?.toUpperCase()}
                  </span>
                )}
              </div>
              {/* Info */}
              <div style={{ padding: '10px 12px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.color, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {theme.label}
                  </div>
                </div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-tertiary)', letterSpacing: '.02em' }}>
                  {hasValue ? value?.toUpperCase() : '—'}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      <div style={{
        marginTop: 16,
        padding: '14px 20px',
        background: 'var(--bg-primary)',
        border: '1px solid var(--stroke-primary)',
        borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <div style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>💡</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          The token <CodeChip>{activeToken}</CodeChip> is the same string in Figma, in code, and in every component.
          Switch between options to see how the same semantic category (brand.default / subtle / subtlest) maps to different palette steps — and how each resolves to a unique hex per product theme.
        </div>
      </div>
    </section>
  )
}

// ─── Section 4 : Naming rules ─────────────────────────────────────────────────

function NamingRules() {
  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '.08em',
          textTransform: 'uppercase', color: 'var(--text-tertiary)',
          marginBottom: 8,
        }}>
          04 — Conventions
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--text-primary)', marginBottom: 8 }}>
          Naming rules
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 520 }}>
          Consistent naming is what makes the system readable, predictable, and autocomplete-friendly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {NAMING_RULES.map((rule, i) => (
          <div
            key={rule.title}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--stroke-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              animation: `fadeUp 400ms ease ${i * 80}ms both`,
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 12 }}>{rule.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>
              {rule.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 16 }}>
              {rule.desc}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginTop: 2, flexShrink: 0 }}>✓</span>
                <CodeChip color="#16a34a" bg="#16a34a10">{rule.good}</CodeChip>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', marginTop: 2, flexShrink: 0 }}>✕</span>
                <CodeChip color="#dc2626" bg="#dc262610">{rule.bad}</CodeChip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Architecture() {
  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '48px 48px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 56, animation: 'fadeUp 400ms ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #64748b 0%, #0099b8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>⬡</div>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '.08em',
            textTransform: 'uppercase', color: 'var(--text-tertiary)',
          }}>
            Get started
          </div>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', color: 'var(--text-primary)', marginBottom: 10 }}>
          Token architecture
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 580 }}>
          AWF is built on a three-layer token system that separates <strong>values</strong>,
          <strong> meaning</strong>, and <strong>usage</strong>. This separation is what enables
          consistent theming across {stats.components_count} components and 6 products from a single source of truth.
        </p>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
          {[
            { value: stats.primitives, label: 'Primitive tokens', color: LAYER_COLORS[0] },
            { value: stats.semantic,   label: 'Semantic tokens',  color: LAYER_COLORS[1] },
            { value: stats.components, label: 'Component tokens', color: LAYER_COLORS[2] },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1px', color: s.color, fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <LayerDiagram />
      <ResolutionChain />
      <ThemingModel />
      <NamingRules />

    </div>
  )
}
