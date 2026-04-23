import React, { useState, useEffect } from 'react'
import { useBrandTheme } from '../../contexts/BrandThemeContext.jsx'
import BrandThemeSwitcher from '../../components/BrandThemeSwitcher.jsx'
import { THEMES, getComponentTokens } from '../../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionAnchor({ id }) {
  return <span id={id} style={{ display: 'block', marginTop: -80, paddingTop: 80 }} />
}
function H2({ children }) {
  return <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--text-primary)', marginBottom: 12, marginTop: 56 }}>{children}</h2>
}
function H3({ children }) {
  return <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, marginTop: 24 }}>{children}</h3>
}
function Lead({ children }) {
  return <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20 }}>{children}</p>
}
function P({ children }) {
  return <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 14 }}>{children}</p>
}
function Code({ children }) {
  return <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: 'var(--bg-secondary)', color: 'var(--brand-600)', padding: '1px 6px', borderRadius: 4 }}>{children}</code>
}
function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--stroke-primary)', margin: '48px 0' }} />
}
function InfoBox({ type = 'info', children }) {
  const s = {
    info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', label: 'Note' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', label: 'Warning' },
  }[type]
  return <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: s.text, lineHeight: 1.65 }}><strong>{s.label}:</strong> {children}</div>
}
function DoBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && (
        <div style={{ padding: '16px 18px', background: '#ffffff', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 64 }}>
          {visual}
        </div>
      )}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 5 }}>✓ Do</div>
        <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}
function DontBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #fecaca', background: '#fef2f2', borderRadius: 8, overflow: 'hidden' }}>
      {visual && (
        <div style={{ padding: '16px 18px', background: '#ffffff', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 64 }}>
          {visual}
        </div>
      )}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Chevron icon ─────────────────────────────────────────────────────────────

function IcoChevron({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Static split button renderer ────────────────────────────────────────────
// hoverPart: null | 'main' | 'chev'

function SplitBtn({ label = 'Action', appearance = 'outlined', size = 'md', hoverPart = null, disabled = false, t }) {
  const px  = t[`button.size.${size}.padding-x`]       || (size === 'lg' ? 24 : size === 'sm' ? 16 : 20)
  const py  = t[`button.size.${size}.padding-y`]       || (size === 'lg' ? 12 : size === 'sm' ? 8  : 10)
  const fs  = t[`button.size.${size}.font-size`]       || (size === 'lg' ? 20 : size === 'sm' ? 14 : 16)
  const r   = t[`button.size.${size}.radius`]          || 10
  const sw  = t[`button.size.${size}.stroke-weight`]   || 1.5
  const chevSz = size === 'lg' ? 14 : size === 'sm' ? 10 : 12
  const chevPx = size === 'lg' ? 10 : size === 'sm' ? 6  : 8

  const isFilled = appearance !== 'outlined'

  // Per-appearance token values
  const ap = {
    outlined: {
      mainBg:    hoverPart === 'main' ? (t['button.outlined.bg.hover-neutral'] || '#f4f6f8') : (t['button.outlined.bg.default'] || '#fff'),
      mainColor: t['button.outlined.text.neutral'],
      chevBg:    hoverPart === 'chev' ? (t['button.icon.outlined.bg.hover']    || '#f4f6f8') : (t['button.icon.outlined.bg.default'] || '#fff'),
      chevColor: t['button.outlined.text.neutral'],
      strokeC:   t['button.outlined.stroke.neutral'] || '#c4cdd5',
    },
    primary: {
      mainBg:    t['button.filled.bg.default'],
      mainColor: t['button.filled.text.default'],
      chevBg:    t['button.filled.bg.default'],
      chevColor: t['button.filled.text.default'],
      strokeC:   'rgba(255,255,255,.3)',
    },
    secondary: {
      mainBg:    t['button.filled.bg.secondary'] || '#05606d',
      mainColor: t['button.filled.text.default'],
      chevBg:    t['button.filled.bg.secondary'] || '#05606d',
      chevColor: t['button.filled.text.default'],
      strokeC:   'rgba(255,255,255,.3)',
    },
    danger: {
      mainBg:    t['button.filled.bg.danger'],
      mainColor: t['button.filled.text.default'],
      chevBg:    t['button.filled.bg.danger'],
      chevColor: t['button.filled.text.default'],
      strokeC:   'rgba(255,255,255,.3)',
    },
  }[appearance] || {}

  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {/* Main action */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingLeft: px, paddingRight: px, paddingTop: py, paddingBottom: py,
        fontSize: fs, fontWeight: 500, lineHeight: 1.5,
        background: ap.mainBg,
        color: ap.mainColor,
        borderTop:    isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
        borderBottom: isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
        borderLeft:   isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
        borderRight: 'none',
        borderTopLeftRadius: r,
        borderBottomLeftRadius: r,
        userSelect: 'none', whiteSpace: 'nowrap',
        transition: 'background .12s',
      }}>
        {label}
      </div>
      {/* Chevron trigger */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingLeft: chevPx, paddingRight: chevPx, paddingTop: py, paddingBottom: py,
        background: ap.chevBg,
        color: ap.chevColor,
        borderTop:    isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
        borderBottom: isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
        borderRight:  isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
        borderLeft:   `${sw}px solid ${ap.strokeC}`,
        borderTopRightRadius: r,
        borderBottomRightRadius: r,
        transition: 'background .12s',
      }}>
        <IcoChevron size={chevSz} />
      </div>
    </div>
  )
}

// ─── Interactive split button (module-level for hooks) ────────────────────────

function SplitBtnLive({ label, appearance, size = 'md', disabled = false, t }) {
  const [hovPart, setHovPart] = useState(null)
  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'stretch', opacity: disabled ? 0.5 : 1 }}
    >
      {(() => {
        const px  = t[`button.size.${size}.padding-x`]     || (size === 'lg' ? 24 : size === 'sm' ? 16 : 20)
        const py  = t[`button.size.${size}.padding-y`]     || (size === 'lg' ? 12 : size === 'sm' ? 8  : 10)
        const fs  = t[`button.size.${size}.font-size`]     || (size === 'lg' ? 20 : size === 'sm' ? 14 : 16)
        const r   = t[`button.size.${size}.radius`]        || 10
        const sw  = t[`button.size.${size}.stroke-weight`] || 1.5
        const chevSz = size === 'lg' ? 14 : size === 'sm' ? 10 : 12
        const chevPx = size === 'lg' ? 10 : size === 'sm' ? 6  : 8
        const isFilled = appearance !== 'outlined'
        const ap = {
          outlined: {
            mainBg:    hovPart === 'main' ? (t['button.outlined.bg.hover-neutral'] || '#f4f6f8') : (t['button.outlined.bg.default'] || '#fff'),
            mainColor: t['button.outlined.text.neutral'],
            chevBg:    hovPart === 'chev' ? (t['button.icon.outlined.bg.hover']    || '#f4f6f8') : (t['button.icon.outlined.bg.default'] || '#fff'),
            chevColor: t['button.outlined.text.neutral'],
            strokeC:   t['button.outlined.stroke.neutral'] || '#c4cdd5',
          },
          primary: {
            mainBg:    hovPart === 'main' ? (t['button.filled.bg.hover'] || '#1d4ed8') : (t['button.filled.bg.default'] || '#2563eb'),
            mainColor: t['button.filled.text.default'],
            chevBg:    hovPart === 'chev' ? (t['button.filled.bg.hover'] || '#1d4ed8') : (t['button.filled.bg.default'] || '#2563eb'),
            chevColor: t['button.filled.text.default'],
            strokeC:   'rgba(255,255,255,.3)',
          },
          secondary: {
            mainBg:    hovPart === 'main' ? '#044f5a' : (t['button.filled.bg.secondary'] || '#05606d'),
            mainColor: t['button.filled.text.default'],
            chevBg:    hovPart === 'chev' ? '#044f5a' : (t['button.filled.bg.secondary'] || '#05606d'),
            chevColor: t['button.filled.text.default'],
            strokeC:   'rgba(255,255,255,.3)',
          },
          danger: {
            mainBg:    hovPart === 'main' ? (t['button.filled.bg.hover-danger'] || '#b91c1c') : (t['button.filled.bg.danger'] || '#dc2626'),
            mainColor: t['button.filled.text.default'],
            chevBg:    hovPart === 'chev' ? (t['button.filled.bg.hover-danger'] || '#b91c1c') : (t['button.filled.bg.danger'] || '#dc2626'),
            chevColor: t['button.filled.text.default'],
            strokeC:   'rgba(255,255,255,.3)',
          },
        }[appearance] || {}
        return (
          <>
            <div
              onMouseEnter={() => !disabled && setHovPart('main')}
              onMouseLeave={() => setHovPart(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                paddingLeft: px, paddingRight: px, paddingTop: py, paddingBottom: py,
                fontSize: fs, fontWeight: 500, lineHeight: 1.5,
                background: ap.mainBg, color: ap.mainColor,
                borderTop:    isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
                borderBottom: isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
                borderLeft:   isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
                borderRight: 'none',
                borderTopLeftRadius: r, borderBottomLeftRadius: r,
                cursor: disabled ? 'not-allowed' : 'pointer',
                userSelect: 'none', whiteSpace: 'nowrap',
                transition: 'background .12s',
              }}
            >
              {label}
            </div>
            <div
              onMouseEnter={() => !disabled && setHovPart('chev')}
              onMouseLeave={() => setHovPart(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                paddingLeft: chevPx, paddingRight: chevPx, paddingTop: py, paddingBottom: py,
                background: ap.chevBg, color: ap.chevColor,
                borderTop:    isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
                borderBottom: isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
                borderRight:  isFilled ? 'none' : `${sw}px solid ${ap.strokeC}`,
                borderLeft:   `${sw}px solid ${ap.strokeC}`,
                borderTopRightRadius: r, borderBottomRightRadius: r,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'background .12s',
              }}
            >
              <IcoChevron size={chevSz} />
            </div>
          </>
        )
      })()}
    </div>
  )
}

// ─── Token table ──────────────────────────────────────────────────────────────

function TokenTable({ tokens, prefix }) {
  const [filter, setFilter] = useState('')
  const rows = Object.entries(tokens).filter(([k]) => k.startsWith(prefix)).sort(([a], [b]) => a.localeCompare(b))
  const filtered = filter ? rows.filter(([k]) => k.includes(filter)) : rows
  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder={`Filter ${prefix} tokens…`}
        style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 6, border: '1px solid var(--stroke-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
      />
      <div style={{ borderRadius: 8, border: '1px solid var(--stroke-primary)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 40px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', padding: '8px 14px' }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Token</span>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Resolved value</span>
          <span />
        </div>
        <div style={{ maxHeight: 340, overflowY: 'auto' }}>
          {filtered.length === 0 && <div style={{ padding: '16px 14px', fontSize: 13, color: 'var(--text-tertiary)' }}>No match for "{filter}"</div>}
          {filtered.map(([key, value]) => {
            const isHex = typeof value === 'string' && /^#[0-9a-fA-F]/.test(value)
            return (
              <div key={key} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 40px', padding: '8px 14px', borderBottom: '1px solid var(--stroke-primary)', alignItems: 'center' }}>
                <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{key}</code>
                <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-tertiary)' }}>{String(value)}</code>
                {isHex ? <span style={{ width: 18, height: 18, borderRadius: 999, background: value, border: '1px solid rgba(0,0,0,.12)', display: 'inline-block' }} /> : <span />}
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>{filtered.length} tokens</div>
    </div>
  )
}

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',    label: 'Overview' },
  { id: 'anatomy',     label: 'Anatomy' },
  { id: 'states',      label: 'States' },
  { id: 'appearances', label: 'Appearances' },
  { id: 'sizes',       label: 'Sizes' },
  { id: 'behavior',    label: 'Behavior' },
  { id: 'usage',       label: 'Usage rules' },
  { id: 'usecase',     label: 'Use case' },
  { id: 'a11y',        label: 'Accessibility' },
  { id: 'tokens',      label: 'Token reference' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SplitButtonPage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [activeSection, setActiveSection] = useState('overview')
  const [tokenTab,      setTokenTab]      = useState('button.outlined')

  const t = getComponentTokens(activeTheme)
  const theme = VISIBLE_THEMES.find(th => th.id === activeTheme) || VISIBLE_THEMES[0]

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    const ids = TOC.map(i => i.id)
    function onScroll() {
      const mainTop = main.getBoundingClientRect().top
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - mainTop <= 140) current = id
      }
      setActiveSection(current)
    }
    main.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => main.removeEventListener('scroll', onScroll)
  }, [])

  const TOKEN_TABS = [
    { key: 'button.outlined', label: 'Outlined' },
    { key: 'button.filled',   label: 'Filled' },
    { key: 'button.size',     label: 'Sizes' },
  ]

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Actions</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Split Button</h1>
          <Lead>
            A two-part button that separates a primary action from a secondary dropdown trigger. The left part executes the main action immediately; the right chevron reveals additional related actions in a popover.
          </Lead>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', paddingTop: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>Preview theme:</span>
            {VISIBLE_THEMES.map(th => (
              <button key={th.id} onClick={() => setActiveTheme(th.id)} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '2px solid',
                borderColor: activeTheme === th.id ? th.color : 'var(--stroke-primary)',
                background:  activeTheme === th.id ? th.color + '18' : 'transparent',
                color:       activeTheme === th.id ? th.color : 'var(--text-secondary)',
                transition: 'all 120ms',
              }}>
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: th.color, marginRight: 5, verticalAlign: 'middle' }} />
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ Overview ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <P>
          The Split Button combines a labeled primary action with a dropdown trigger in a single compound control. It is visually joined — sharing the same height and appearance — but functionally split: clicking the label fires the default action, while the chevron opens a popover with related secondary actions.
        </P>
        <P>
          It comes in four appearance variants (Neutral/Outlined, Primary, Secondary, Danger) and inherits all three standard sizes from the Button component.
        </P>

        {/* When to use / not */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'A dominant action has close siblings that share the same context (Export → CSV / Excel / PDF)',
              'Space is constrained and a dropdown replaces multiple individual buttons',
              'A user commonly repeats the same action but occasionally needs alternatives',
              'Workflow actions with multiple output formats or destinations',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'All options are equally important — use individual buttons or a Button Group',
              'Only one action exists — use a standard Button',
              'The default action changes based on the last selection — use a persistent dropdown button',
              'Actions are unrelated — the dropdown should only hold closely related alternatives',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Anatomy ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <Lead>Two visually joined parts sharing the same height. A thin separator between them signals the split interaction.</Lead>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '24px 32px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ paddingTop: 8 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <SplitBtn label="Export" appearance="outlined" size="md" t={t} />
                <div style={{ position: 'absolute', left: -3, top: -3, right: -3, bottom: -3, border: '1.5px dashed #94a3b8', borderRadius: (t['button.size.md.radius'] || 10) + 3, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.05em', textTransform: 'uppercase' }}>Split Button</div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['① Main action', 'Label-bearing button. Fires the primary action on click. Left-rounded corners.'],
                ['② Separator',  'A subtle vertical divider (border-left on chevron). Visually signals the two zones.'],
                ['③ Chevron',    'Icon-only trigger that opens a dropdown popover with secondary actions. Right-rounded corners.'],
              ].map(([name, desc]) => (
                <div key={name} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', minWidth: 100, flexShrink: 0 }}>{name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ States ══════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="states" />
        <H2>States</H2>
        <Lead>
          Hover is tracked independently per part — main action and chevron each respond to their own hover zone. Values resolve from the <strong>{theme.label}</strong> theme.
        </Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>Neutral (Outlined) — all states</div>
          </div>
          <div style={{ padding: '24px 28px', background: 'var(--bg-primary)', display: 'flex', gap: 28, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {[
              { label: 'Default',         hoverPart: null },
              { label: 'Hover — main',    hoverPart: 'main' },
              { label: 'Hover — chevron', hoverPart: 'chev' },
              { label: 'Disabled',        hoverPart: null, disabled: true },
            ].map(({ label, hoverPart, disabled }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <SplitBtn label="Export" appearance="outlined" size="md" hoverPart={hoverPart} disabled={!!disabled} t={t} />
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <H3>Live demo</H3>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Hover over each zone separately — main action or chevron</span>
          </div>
          <div style={{ padding: '32px', background: 'var(--bg-primary)', display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <SplitBtnLive label="Export" appearance="outlined" size="md" t={t} />
            <SplitBtnLive label="Deploy" appearance="primary" size="md" t={t} />
            <SplitBtnLive label="Archive" appearance="secondary" size="md" t={t} />
            <SplitBtnLive label="Delete" appearance="danger" size="md" t={t} />
          </div>
        </div>

        <Divider />

        {/* ══ Appearances ════════════════════════════════════════════════════════= */}
        <SectionAnchor id="appearances" />
        <H2>Appearances</H2>
        <Lead>
          Four appearance variants matching the Button component hierarchy. The separator divider adapts — a border for Outlined, a translucent rule for Filled.
        </Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {[
            { key: 'outlined',  label: 'Neutral — Outlined', desc: 'Default. Use for secondary or tertiary split actions. Border follows the button.outlined token system.' },
            { key: 'primary',   label: 'Primary',            desc: 'Filled brand color. Use for the dominant split action on a page or dialog.' },
            { key: 'secondary', label: 'Secondary',          desc: 'Filled secondary brand. Use for confirmatory or flow-advancing actions.' },
            { key: 'danger',    label: 'Danger',             desc: 'Filled destructive intent. The label must make the risk explicit (e.g., "Delete", "Purge").' },
          ].map(ap => (
            <div key={ap.key} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '12px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{ap.label}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ap.desc}</span>
              </div>
              <div style={{ padding: '20px 24px', background: 'var(--bg-primary)', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                <SplitBtn label="Main Action" appearance={ap.key} size="md" t={t} />
                <SplitBtnLive label="Interactive" appearance={ap.key} size="md" t={t} />
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Sizes ════════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="sizes" />
        <H2>Sizes</H2>
        <Lead>
          Three sizes inherited from the Button size tokens. The chevron zone scales proportionally with font-size and padding.
        </Lead>
        <InfoBox type="info">
          Dedicated <Code>button.split.size.*</Code> tokens are not yet defined. The Split Button inherits sizing from <Code>button.size.*</Code> — the same scale used by all button variants.
        </InfoBox>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '24px 28px', background: 'var(--bg-primary)', display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {[
              { size: 'lg', label: 'Large' },
              { size: 'md', label: 'Medium ★' },
              { size: 'sm', label: 'Small' },
            ].map(({ size, label }) => (
              <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <SplitBtn label="Export" appearance="outlined" size={size} t={t} />
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Behavior ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="behavior" />
        <H2>Behavior</H2>
        <H3>Dropdown / popover</H3>
        <P>
          Clicking the chevron opens a popover anchored to the right edge of the split button. The popover contains a list of related secondary actions. It dismisses on outside click, on Escape, or when an action is selected.
        </P>

        {/* Dropdown preview */}
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, marginBottom: 24 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', borderRadius: '10px 10px 0 0' }}>
            Chevron dropdown — illustration (not interactive in this preview)
          </div>
          <div style={{ padding: '28px 32px 120px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'flex-start', gap: 16, justifyContent: 'center', borderRadius: '0 0 10px 10px', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <SplitBtn label="Export" appearance="outlined" size="md" hoverPart="chev" t={t} />
              {/* Popover illustration */}
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                background: 'var(--bg-primary)', border: '1px solid var(--stroke-primary)',
                borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,.12)',
                padding: '6px 0', minWidth: 160, zIndex: 10,
              }}>
                {['Export as CSV', 'Export as Excel', 'Export as PDF'].map((action, i) => (
                  <div key={i} style={{
                    padding: '8px 14px', fontSize: 13, color: 'var(--text-primary)',
                    background: i === 0 ? 'var(--bg-secondary)' : 'transparent',
                    cursor: 'pointer',
                  }}>
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <H3>Independent hover zones</H3>
        <P>
          The main action and chevron are separate interactive targets. Hovering one does not affect the other. Each zone has its own hover background and cursor, making the split clearly perceivable.
        </P>

        <Divider />

        {/* ══ Usage rules ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <DoBox
            visual={<SplitBtn label="Export" appearance="outlined" size="md" t={t} />}
          >
            Label the main action clearly with a verb. The dropdown must only contain variations of that same action.
          </DoBox>
          <DontBox
            visual={<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <SplitBtn label="Export" appearance="primary" size="md" t={t} />
              <SplitBtn label="Export" appearance="danger" size="md" t={t} />
            </div>}
          >
            Don't use more than one Split Button for the same action in the same context. Choose the appropriate appearance.
          </DontBox>
        </div>

        <P>
          The default action should be the most commonly performed one. Users will click the label far more often than the chevron — ensure it does the right thing without opening the dropdown.
        </P>
        <P>
          Keep the dropdown list short (2–5 items). If you need more options, consider a dedicated action menu or dropdown button instead.
        </P>

        <Divider />

        {/* ══ Use case ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <Lead>A workflow actions toolbar where each operation has multiple output options.</Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '14px 20px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Report Q4 2024 — Actions</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>3 items selected</span>
          </div>
          <div style={{ padding: '20px 24px', background: 'var(--bg-primary)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <SplitBtnLive label="Export"  appearance="outlined"  size="md" t={t} />
            <SplitBtnLive label="Deploy"  appearance="primary"   size="md" t={t} />
            <SplitBtnLive label="Archive" appearance="secondary" size="md" t={t} />
            <div style={{ flex: 1 }} />
            <SplitBtnLive label="Delete"  appearance="danger"    size="md" t={t} />
          </div>
          <div style={{ padding: '16px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--stroke-primary)', fontSize: 12, color: 'var(--text-tertiary)' }}>
            ↑ Hover over each button's chevron zone to see the independent hover state
          </div>
        </div>

        <Divider />

        {/* ══ Accessibility ════════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['role="group"',         'Wrap both parts in a group element to convey the compound nature.'],
            ['aria-label on button', 'The main action button should have an explicit label or aria-label matching the action.'],
            ['aria-haspopup="menu"', 'Set on the chevron trigger to signal it opens a menu.'],
            ['aria-expanded',        'Toggle true/false on the chevron based on dropdown open state.'],
            ['aria-controls',        'Set on the chevron button pointing to the popover/menu id.'],
            ['Keyboard: Tab',        'Tab navigates between main action and chevron (they are separate focusable elements).'],
            ['Keyboard: Enter/Space','Activates the focused element — either fires the action or opens the dropdown.'],
            ['Keyboard: Escape',     'Closes the dropdown popover if open, returns focus to the chevron.'],
          ].map(([attr, desc]) => (
            <div key={attr} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8, alignItems: 'baseline' }}>
              <Code>{attr}</Code>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</span>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Token reference ══════════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <P>
          The Split Button does not have a dedicated <Code>button.split.*</Code> namespace yet — it composes from existing button and icon button tokens. Dedicated split tokens are planned for a future release. Values shown for the <strong>{theme.label}</strong> theme.
        </P>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {TOKEN_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setTokenTab(tab.key)}
              style={{
                padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                border: `1px solid ${tokenTab === tab.key ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
                background: tokenTab === tab.key ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: tokenTab === tab.key ? 'var(--brand-600)' : 'var(--text-secondary)',
              }}
            >
              {tab.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          {VISIBLE_THEMES.map(th => (
            <button key={th.id} onClick={() => setActiveTheme(th.id)} style={{
              width: 22, height: 22, borderRadius: '50%', border: `3px solid ${activeTheme === th.id ? th.color : 'transparent'}`,
              background: th.color, cursor: 'pointer', outline: 'none', transition: 'border .12s',
            }} title={th.label} />
          ))}
        </div>
        <TokenTable tokens={t} prefix={tokenTab} />

      </div>

      {/* ── TOC sidebar ───────────────────────────────────────────────────────── */}
      <div style={{ width: 200, flexShrink: 0, position: 'sticky', top: 80, padding: '48px 0 96px 24px', alignSelf: 'flex-start' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>ON THIS PAGE</div>
        {TOC.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={e => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }) }}
            style={{
              display: 'block', padding: '5px 10px', marginBottom: 2, borderRadius: 6, fontSize: 13, textDecoration: 'none',
              fontWeight: activeSection === item.id ? 600 : 400,
              color:      activeSection === item.id ? 'var(--brand-600)' : 'var(--text-secondary)',
              background: activeSection === item.id ? 'var(--brand-50)' : 'transparent',
              borderLeft: activeSection === item.id ? '2px solid var(--brand-600)' : '2px solid transparent',
              transition: 'all .12s',
            }}
          >
            {item.label}
          </a>
        ))}
        <BrandThemeSwitcher />
      </div>

    </div>
  )
}
