import React, { useState, useMemo } from 'react'
import {
  THEMES,
  neutralPalette,
  brandPalettes,
  statusPalettes,
  getSemanticTokens,
} from '../data/tokens/index.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isLight(hex) {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return true
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 140
}

/**
 * Group a flat semantic map into nested structure:
 * { bg: { _base: [...], brand: [...], danger: [...] }, text: {...}, ... }
 * Filters Figma typo tokens (sucess without 's').
 */
function groupSemantic(flat) {
  const groups = {}
  for (const [key, value] of Object.entries(flat)) {
    if (!value || typeof value !== 'string' || value.startsWith('{')) continue
    if (key.includes('.sucess')) continue // filter Figma typo
    const parts = key.split('.')
    if (parts.length < 3) continue
    const group    = parts[1] // bg, text, icon, stroke
    const subgroup = parts.length > 3 ? parts[2] : '_base'
    if (!groups[group]) groups[group] = {}
    if (!groups[group][subgroup]) groups[group][subgroup] = []
    groups[group][subgroup].push({ key, value })
  }
  return groups
}

const SUBGROUP_ORDER = ['_base', 'brand', 'link', 'danger', 'warning', 'success', 'info', 'nav']
const SUBGROUP_LABELS = {
  _base:   null, // no header
  brand:   'Brand',
  link:    'Link',
  danger:  'Danger',
  warning: 'Warning',
  success: 'Success',
  info:    'Info',
  nav:     'Nav',
}

function sortSubgroups(subgroupMap) {
  const known = SUBGROUP_ORDER.filter(k => subgroupMap[k])
  const others = Object.keys(subgroupMap).filter(k => !SUBGROUP_ORDER.includes(k)).sort()
  return [...known, ...others]
}

const SEMANTIC_GROUP_LABELS = {
  bg:     'Background',
  text:   'Text',
  icon:   'Icon',
  stroke: 'Stroke',
}

const STATUS_PALETTE_LABELS = {
  red:    'Danger',
  green:  'Success',
  orange: 'Warning',
  blue:   'Info / Link',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div style={{ marginBottom: 40, animation: 'fadeUp 400ms ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #0077C8 0%, #17AFE6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>🎨</div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
          Foundations
        </div>
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', color: 'var(--text-primary)', marginBottom: 10 }}>
        Color tokens
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 600 }}>
        AWF uses a 3-layer color system: <strong>Primitives</strong> define the raw palette,
        <strong> Semantic</strong> tokens assign meaning, and <strong>Component</strong> tokens
        bind values to specific UI parts. Switch themes to see how each product brand adapts.
      </p>
    </div>
  )
}

function SectionTabs({ active, onChange }) {
  const tabs = [
    { id: 'primitives', label: 'Primitives' },
    { id: 'semantic',   label: 'Semantic' },
  ]
  return (
    <div style={{
      display: 'flex', gap: 4,
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      padding: 4,
      width: 'fit-content',
      marginBottom: 36,
      animation: 'fadeUp 400ms ease 60ms both',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '7px 20px',
            borderRadius: 'calc(var(--radius-md) - 2px)',
            fontSize: 13, fontWeight: 500,
            background: active === tab.id ? 'var(--bg-primary)' : 'transparent',
            color: active === tab.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
            boxShadow: active === tab.id ? 'var(--shadow-sm)' : 'none',
            border: active === tab.id ? '1px solid var(--stroke-primary)' : '1px solid transparent',
            transition: 'all 150ms ease',
            cursor: 'pointer',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function SectionTitle({ children, delay = 0 }) {
  return (
    <h2 style={{
      fontSize: 13, fontWeight: 600, letterSpacing: '.06em',
      textTransform: 'uppercase', color: 'var(--text-tertiary)',
      marginBottom: 16,
      animation: `fadeUp 400ms ease ${delay}ms both`,
    }}>
      {children}
    </h2>
  )
}

/** A horizontal palette strip: one row of color swatches */
function PaletteStrip({ steps, label, delay = 0 }) {
  const [hovered, setHovered] = useState(null)
  if (!steps || steps.length === 0) return null
  return (
    <div style={{ marginBottom: 28, animation: `fadeUp 400ms ease ${delay}ms both` }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
        {label}
      </div>
      {/* Fixed-height wrapper — no layout shift on hover */}
      <div style={{ display: 'flex', gap: 0, height: 72, borderRadius: 'var(--radius-md)', overflow: 'visible', border: '1px solid var(--stroke-primary)', position: 'relative' }}>
        {steps.map(({ step, value }, i) => {
          const light = isLight(value)
          const isHov = hovered === step
          const isFirst = i === 0
          const isLast  = i === steps.length - 1
          return (
            <div
              key={step}
              onMouseEnter={() => setHovered(step)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: 1,
                height: '100%',
                background: value,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0 0 8px',
                cursor: 'default',
                position: 'relative',
                zIndex: isHov ? 2 : 0,
                transform: isHov ? 'scaleY(1.18)' : 'scaleY(1)',
                transformOrigin: 'bottom center',
                transition: 'transform 150ms ease',
                borderRadius: isFirst ? '6px 0 0 6px' : isLast ? '0 6px 6px 0' : 0,
              }}
            >
              {isHov && (
                <span style={{
                  position: 'absolute', bottom: 28,
                  fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                  color: light ? 'rgba(0,0,0,.5)' : 'rgba(255,255,255,.65)',
                  letterSpacing: '.02em', whiteSpace: 'nowrap',
                }}>
                  {value?.toUpperCase()}
                </span>
              )}
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: light ? 'rgba(0,0,0,.55)' : 'rgba(255,255,255,.75)',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '.02em',
              }}>
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Section: all primitive palettes */
function PrimitivesSection() {
  const productPalettes = [
    { id: 'dot',         label: 'Brand · DOT Anonymizer',  steps: brandPalettes.dot         },
    { id: 'drops',       label: 'Brand · Drops',            steps: brandPalettes.drops       },
    { id: 'discover',    label: 'Brand · Discover',         steps: brandPalettes.discover    },
    { id: 'cochecker',   label: 'Brand · CoChecker',        steps: brandPalettes.cochecker   },
    { id: 'mrconnector', label: 'Brand · MR Connector',     steps: brandPalettes.mrconnector },
    { id: 'verifier',    label: 'Brand · Verifier',         steps: brandPalettes.verifier    },
  ].filter(p => p.steps && p.steps.length > 0)

  const statusEntries = Object.entries(statusPalettes).filter(([, steps]) => steps && steps.length > 0)

  return (
    <div>
      {/* Neutral */}
      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--stroke-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 28,
        marginBottom: 20,
        animation: 'fadeUp 400ms ease 100ms both',
      }}>
        <SectionTitle>Neutral</SectionTitle>
        <PaletteStrip steps={neutralPalette} label="color.neutral" />
      </div>

      {/* Brand palettes */}
      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--stroke-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 28,
        marginBottom: 20,
        animation: 'fadeUp 400ms ease 160ms both',
      }}>
        <SectionTitle>Brand palettes</SectionTitle>
        {productPalettes.map((p, i) => (
          <PaletteStrip key={p.id} steps={p.steps} label={p.label} delay={i * 40} />
        ))}
      </div>

      {/* Status palettes */}
      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--stroke-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 28,
        animation: 'fadeUp 400ms ease 220ms both',
      }}>
        <SectionTitle>Status colors</SectionTitle>
        {statusEntries.map(([key, steps], i) => (
          <PaletteStrip
            key={key}
            steps={steps}
            label={`color.${key} · ${STATUS_PALETTE_LABELS[key] ?? key}`}
            delay={i * 40}
          />
        ))}
      </div>
    </div>
  )
}

/** A single semantic token row */
function TokenRow({ tokenKey, value }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  const shortKey = tokenKey.replace(/^color\./, '')
  const light = isLight(value)

  return (
    <div
      onClick={copy}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 10px', borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'background 120ms',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Swatch */}
      <div style={{
        width: 24, height: 24, borderRadius: 5, flexShrink: 0,
        background: value,
        border: '1px solid rgba(0,0,0,.08)',
      }} />
      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 500,
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text-primary)',
          letterSpacing: '.01em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {shortKey}
        </div>
      </div>
      {/* Value */}
      <div style={{
        fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
        color: copied ? 'var(--brand-600)' : 'var(--text-tertiary)',
        letterSpacing: '.03em',
        transition: 'color 150ms',
        flexShrink: 0,
      }}>
        {copied ? 'Copied!' : value?.toUpperCase()}
      </div>
    </div>
  )
}

/** Semantic tokens section with theme switcher */
function SemanticSection() {
  const [activeTheme, setActiveTheme]   = useState('dot')
  const [collapsed, setCollapsed]       = useState({})
  const visibleThemes = THEMES.filter(t => !t.id.startsWith('variant'))

  const semanticGroups = useMemo(() => {
    const tokens = getSemanticTokens(activeTheme)
    return groupSemantic(tokens)
  }, [activeTheme])

  const groupOrder   = ['bg', 'text', 'icon', 'stroke']
  const currentTheme = THEMES.find(t => t.id === activeTheme)

  const toggleCollapse = (group) =>
    setCollapsed(prev => ({ ...prev, [group]: !prev[group] }))

  return (
    <div>
      {/* Theme switcher */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap',
        marginBottom: 28,
        animation: 'fadeUp 400ms ease 80ms both',
      }}>
        {visibleThemes.map(theme => {
          const active = theme.id === activeTheme
          const textColor = isLight(theme.color) ? '#1a1a1a' : '#ffffff'
          return (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px',
                borderRadius: 99,
                fontSize: 12, fontWeight: 500,
                background: active ? theme.color : 'var(--bg-primary)',
                color: active ? textColor : 'var(--text-secondary)',
                border: `1px solid ${active ? theme.color : 'var(--stroke-primary)'}`,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: active ? (isLight(theme.color) ? 'rgba(0,0,0,.3)' : 'rgba(255,255,255,.6)') : theme.color,
                flexShrink: 0,
              }} />
              {theme.label}
            </button>
          )
        })}
      </div>

      {/* Token groups — 4 cols on wide screens, 2 cols on small screens (auto via minmax) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16,
        alignItems: 'start',
      }}>
        {groupOrder.map((group, gi) => {
          const subgroupMap = semanticGroups[group]
          if (!subgroupMap) return null
          const totalCount  = Object.values(subgroupMap).reduce((n, arr) => n + arr.length, 0)
          const subgroupKeys = sortSubgroups(subgroupMap)
          const isCollapsed  = !!collapsed[group]

          return (
            <div
              key={group}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--stroke-primary)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                animation: `fadeUp 400ms ease ${gi * 60 + 120}ms both`,
              }}
            >
              {/* Group header — clickable to collapse */}
              <div
                onClick={() => toggleCollapse(group)}
                style={{
                  padding: '14px 16px 12px',
                  borderBottom: isCollapsed ? 'none' : '1px solid var(--stroke-primary)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{
                  width: 4, height: 16, borderRadius: 2,
                  background: currentTheme?.color ?? 'var(--brand-600)',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {SEMANTIC_GROUP_LABELS[group] ?? group}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
                    {totalCount} tokens
                  </div>
                </div>
                {/* Chevron */}
                <div style={{
                  width: 20, height: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-tertiary)',
                  transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms ease',
                  fontSize: 12,
                }}>
                  ▾
                </div>
              </div>

              {/* Subgroups — hidden when collapsed */}
              {!isCollapsed && subgroupKeys.map((sub, si) => {
                const entries = subgroupMap[sub]
                const label   = sub in SUBGROUP_LABELS ? SUBGROUP_LABELS[sub] : sub
                return (
                  <div key={sub}>
                    {label && (
                      <div style={{
                        padding: '10px 16px 4px',
                        fontSize: 10, fontWeight: 600,
                        letterSpacing: '.07em', textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                        borderTop: si > 0 ? '1px solid var(--stroke-primary)' : undefined,
                        marginTop: si > 0 ? 4 : 0,
                      }}>
                        {label}
                      </div>
                    )}
                    <div style={{ padding: si === 0 && !label ? '8px 4px 4px' : '4px 4px' }}>
                      {entries.map(({ key, value }) => (
                        <TokenRow key={key} tokenKey={key} value={value} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TokensColor() {
  const [section, setSection] = useState('primitives')

  return (
    <div style={{ padding: '48px 48px 80px' }}>
      {/* Header + tabs constrained for readability */}
      <div style={{ maxWidth: 'var(--content-max)' }}>
        <PageHeader />
        <SectionTabs active={section} onChange={setSection} />
      </div>
      {section === 'primitives'
        ? <div style={{ maxWidth: 'var(--content-max)' }}><PrimitivesSection /></div>
        : <SemanticSection />
      }
    </div>
  )
}
