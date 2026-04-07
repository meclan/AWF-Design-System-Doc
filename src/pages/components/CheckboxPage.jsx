import React, { useState, useEffect } from 'react'
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
        <div style={{ padding: '16px 18px', background: '#ffffff', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 64 }}>
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
        <div style={{ padding: '16px 18px', background: '#ffffff', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 64 }}>
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

// ─── Checkbox icon SVGs ────────────────────────────────────────────────────────

function IcoCheck({ size = 10, sw = 1.5, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ display: 'block' }}>
      <path d="M1.5 5L4 7.5L8.5 2" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IcoIndeterminate({ size = 10, sw = 1.5, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ display: 'block' }}>
      <path d="M2 5H8" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
}

// ─── Static Checkbox renderer ─────────────────────────────────────────────────
// Renders a single checkbox box (no label) in a given state.
// Used in state grids and size demos.

function CBox({ checked = false, indeterminate = false, disabled = false, hover = false, size = 16, t }) {
  const isOn = checked || indeterminate

  const bg = disabled
    ? (isOn ? t['checkbox.bg.checked.disabled'] : t['checkbox.bg.unchecked.disabled'])
    : (isOn
        ? t['checkbox.bg.checked.default']
        : hover ? t['checkbox.bg.unchecked.hover'] : t['checkbox.bg.unchecked.default'])

  const strokeColor = disabled
    ? (isOn ? 'transparent' : t['checkbox.stroke.unchecked.disabled'])
    : (isOn ? t['checkbox.stroke.checked.default'] : t['checkbox.stroke.unchecked.default-brand'])

  const iconColor = t['checkbox.checkmarkIcon'] || '#ffffff'
  const r = Math.round((t['checkbox.radius'] || 4) * (size / 16))
  const ringSize = Math.round(size / 4)
  const ringColor = isOn
    ? (t['checkbox.stroke.checked.hover'] || t['checkbox.bg.unchecked.hover'])
    : t['checkbox.bg.unchecked.hover']
  const boxShadow = hover && !disabled ? `0 0 0 ${ringSize}px ${ringColor}` : 'none'
  const bw = size >= 14 ? 1.5 : 1
  const iconSize = Math.round(size * 0.65)
  const sw = size >= 14 ? 1.5 : 1.2

  // Treat transparent / rgba(255,255,255,0) / #ffffff00 as no visible border
  const isTransparent = !strokeColor
    || strokeColor === 'transparent'
    || strokeColor === 'rgba(255,255,255,0)'
    || strokeColor === '#ffffff00'
    || strokeColor === '#fff0'

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: r,
      background: bg,
      border: `${bw}px solid ${isTransparent ? 'transparent' : strokeColor}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow,
      boxSizing: 'border-box',
      transition: 'background .12s, box-shadow .12s',
    }}>
      {checked && !indeterminate && <IcoCheck size={iconSize} sw={sw} color={iconColor} />}
      {indeterminate && <IcoIndeterminate size={iconSize} sw={sw} color={iconColor} />}
    </div>
  )
}

// ─── Interactive live Checkbox (module-level component so hooks work) ─────────

function CBoxLive({ checked, indeterminate = false, onChange, size = 16, t, label, disabled = false }) {
  const [hov, setHov] = useState(false)
  const labelColor = disabled ? t['checkbox.label-disabled'] : t['checkbox.label']

  return (
    <div
      onClick={!disabled ? onChange : undefined}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none',
      }}
    >
      <CBox checked={checked} indeterminate={indeterminate} disabled={disabled} hover={hov} size={size} t={t} />
      {label && <span style={{ fontSize: size === 12 ? 12 : 14, color: labelColor, lineHeight: 1.4 }}>{label}</span>}
    </div>
  )
}

// ─── State grid card ──────────────────────────────────────────────────────────

function CheckboxStateCard({ title, desc, t, size = 16 }) {
  const rows = [
    { label: 'Unchecked',     checked: false, indeterminate: false },
    { label: 'Checked',       checked: true,  indeterminate: false },
    { label: 'Indeterminate', checked: false, indeterminate: true  },
  ]
  const cols = [
    { label: 'Default',  hover: false, disabled: false },
    { label: 'Hover',    hover: true,  disabled: false },
    { label: 'Disabled', hover: false, disabled: true  },
  ]

  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
      {(title || desc) && (
        <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
          {title && <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: desc ? 2 : 0 }}>{title}</div>}
          {desc && <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>}
        </div>
      )}
      <div style={{ padding: '20px 24px', background: 'var(--bg-primary)' }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(3, 1fr)', marginBottom: 10, alignItems: 'center' }}>
          <div />
          {cols.map(c => (
            <div key={c.label} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', textAlign: 'center' }}>{c.label}</div>
          ))}
        </div>
        {/* Rows */}
        {rows.map(row => (
          <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '120px repeat(3, 1fr)', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', fontWeight: 500 }}>{row.label}</div>
            {cols.map(col => (
              <div key={col.label} style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
                <CBox
                  checked={row.checked}
                  indeterminate={row.indeterminate}
                  hover={col.hover}
                  disabled={col.disabled}
                  size={size}
                  t={t}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
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
                {isHex ? <span style={{ width: 18, height: 18, borderRadius: 4, background: value, border: '1px solid rgba(0,0,0,.12)', display: 'inline-block' }} /> : <span />}
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
  { id: 'overview',      label: 'Overview' },
  { id: 'states',        label: 'States' },
  { id: 'indeterminate', label: 'Indeterminate' },
  { id: 'sizes',         label: 'Sizes' },
  { id: 'usage',         label: 'Usage rules' },
  { id: 'usecase',       label: 'Use case' },
  { id: 'a11y',          label: 'Accessibility' },
  { id: 'tokens',        label: 'Token reference' },
]

// ─── Filter demo items ────────────────────────────────────────────────────────

const FILTER_CATEGORIES = [
  { label: 'Design',      count: 4  },
  { label: 'Development', count: 12 },
  { label: 'Marketing',   count: 5  },
  { label: 'Product',     count: 8  },
  { label: 'Analytics',   count: 2  },
]

const DEMO_ITEMS = [
  'Accept the terms and conditions',
  'Subscribe to release notes',
  'Remember this device for 30 days',
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckboxPage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

  // Interactive demo state
  const [demoChecked, setDemoChecked] = useState([true, false, false])

  // Use case — filter panel state
  const [filterSel, setFilterSel] = useState([true, true, false, true, false])

  const t = getComponentTokens(activeTheme)
  const theme = VISIBLE_THEMES.find(th => th.id === activeTheme) || VISIBLE_THEMES[0]

  const sizeMd = parseInt(t['checkbox.size-md']) || 16
  const sizeSm = parseInt(t['checkbox.size-sm']) || 12

  // Filter panel helpers
  const allFilterSel     = filterSel.every(Boolean)
  const noneFilterSel    = filterSel.every(v => !v)
  const filterIndeterminate = !allFilterSel && !noneFilterSel
  const filterSelectedCount = filterSel.filter(Boolean).length

  function toggleAllFilter() {
    if (allFilterSel) setFilterSel(filterSel.map(() => false))
    else setFilterSel(filterSel.map(() => true))
  }

  // Scroll spy — listens on <main> (the actual scrolling container)
  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    const ids = TOC.map(item => item.id)
    function onScroll() {
      const mainTop = main.getBoundingClientRect().top
      const threshold = 140
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - mainTop <= threshold) current = id
      }
      setActiveSection(current)
    }
    main.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => main.removeEventListener('scroll', onScroll)
  }, [])

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Forms</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Checkbox</h1>
          <Lead>
            A binary input control that lets users select one or more items from a list independently. Supports <strong>checked</strong>, <strong>unchecked</strong>, and <strong>indeterminate</strong> states.
          </Lead>
          {/* Theme switcher */}
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
          Checkboxes allow users to select <strong>one or more options independently</strong> from a list. Unlike radio buttons, each checkbox has its own binary state — checking one does not affect the others. They are commonly used in forms, filter panels, settings dialogs, and data tables.
        </P>
        <P>
          The component has two sizes — <strong>Default (16 px)</strong> and <strong>Small (12 px)</strong> — and three value states: <strong>unchecked</strong>, <strong>checked</strong>, and <strong>indeterminate</strong>. Each value state has its own default, hover, and disabled interaction state.
        </P>

        {/* When to use / not */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Selecting multiple options from a list',
              '"Select all / none" in tables or filter panels',
              'Form fields where a user explicitly opts in',
              'Settings that can be toggled independently',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Selecting exactly one option → use Radio Button',
              'Toggling a system-level setting → use Switch',
              'Activating a toolbar tool → use Toggle button',
              'Choosing from mutually exclusive options',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        {/* Anatomy */}
        <H3>Anatomy</H3>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ padding: '24px 32px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
            {/* Visual */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 6 }}>
              {/* Annotated checkbox */}
              <div style={{ position: 'relative' }}>
                <CBox checked size={sizeMd} t={t} />
                <div style={{ position: 'absolute', left: -3, top: -3, width: sizeMd + 6, height: sizeMd + 6, border: '1.5px dashed #94a3b8', borderRadius: (t['checkbox.radius'] || 4) + 3, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.05em', textTransform: 'uppercase' }}>① Box</div>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ fontSize: 14, color: t['checkbox.label'] }}>Remember me</span>
                <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.05em', textTransform: 'uppercase' }}>② Label</div>
              </div>
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 220, paddingTop: 4 }}>
              {[
                ['① Control box',   'The visual square input. Shows checkmark or dash when active. Uses brand color when checked.'],
                ['② Label',         'Optional descriptive text. Uses secondary text color, grayed out when disabled.'],
                ['  Icon',          'Checkmark (checked) or horizontal dash (indeterminate). Always rendered in white.'],
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
          Three value states — <strong>unchecked</strong>, <strong>checked</strong>, and <strong>indeterminate</strong> — each with three interaction states: <strong>default</strong>, <strong>hover</strong>, and <strong>disabled</strong>.
        </Lead>

        <CheckboxStateCard
          title="All states"
          desc="The hover column shows the ripple ring effect that appears on mouse-over. Disabled checkboxes are non-interactive and use muted colors."
          t={t}
          size={sizeMd}
        />

        {/* Hover detail */}
        <InfoBox type="info">
          The hover state uses a <strong>radial ring</strong> (box-shadow) around the control box, not a background fill. This keeps the visual footprint minimal while still providing clear feedback. Ring color comes from <Code>checkbox.bg.unchecked.hover</Code> / <Code>checkbox.stroke.checked.hover</Code>.
        </InfoBox>

        {/* Interactive demo */}
        <H3>Live demo</H3>
        <P>
          Hover and click the checkboxes below to see state transitions in real time with your active theme.
        </P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Interactive — hover and click to toggle</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Default size (16 px)</span>
          </div>
          <div style={{ padding: '28px 32px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {DEMO_ITEMS.map((label, i) => (
              <CBoxLive
                key={label}
                checked={demoChecked[i]}
                onChange={() => setDemoChecked(prev => prev.map((v, idx) => idx === i ? !v : v))}
                label={label}
                t={t}
                size={sizeMd}
              />
            ))}
            <div style={{ borderTop: '1px solid var(--stroke-primary)', marginTop: 4, paddingTop: 16 }}>
              <CBoxLive
                checked={false}
                disabled
                label="This option is unavailable (disabled)"
                t={t}
                size={sizeMd}
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ Indeterminate ════════════════════════════════════════════════════════ */}
        <SectionAnchor id="indeterminate" />
        <H2>Indeterminate</H2>
        <Lead>
          The <strong>indeterminate</strong> (or partial) state is used when a parent checkbox controls a group of child checkboxes and only <em>some</em> of them are checked. It is programmatic — it cannot be set by a user clicking the checkbox directly.
        </Lead>
        <P>
          Visually, it uses the same brand-filled background as the checked state, but replaces the checkmark with a horizontal <strong>dash icon</strong>. This clearly communicates a partial selection without implying full selection.
        </P>

        {/* Visual comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Unchecked',     checked: false, indeterminate: false, note: 'No children selected' },
            { label: 'Indeterminate', checked: false, indeterminate: true,  note: 'Some children selected' },
            { label: 'Checked',       checked: true,  indeterminate: false, note: 'All children selected' },
          ].map(item => (
            <div key={item.label} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: 'var(--bg-primary)' }}>
              <CBox checked={item.checked} indeterminate={item.indeterminate} size={sizeMd} t={t} />
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.5 }}>{item.note}</div>
            </div>
          ))}
        </div>

        <H3>When to use indeterminate</H3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Common patterns</div>
            {[
              '"Select all" rows in a data table with row-level checkboxes',
              'Parent category checkbox when some items in the group are selected',
              'Bulk action toolbar with mixed selection state',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Interaction rules</div>
            {[
              'Clicking a "select all" in indeterminate state → selects all',
              'Clicking a "select all" in checked state → deselects all',
              'Users cannot place a checkbox in indeterminate via click — only code can set it',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Sizes ════════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="sizes" />
        <H2>Sizes</H2>
        <Lead>
          Two sizes are available. The <strong>Default (MD)</strong> size is the standard for most form contexts. <strong>Small (SM)</strong> is suited for dense UIs such as data tables, inline filters, or compact settings panels.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {[
            { sizeKey: 'md', label: 'Default', size: sizeMd, token: 'checkbox.size-md', note: 'Standard forms, settings, filter panels' },
            { sizeKey: 'sm', label: 'Small',   size: sizeSm, token: 'checkbox.size-sm', note: 'Data tables, dense lists, compact UIs' },
          ].map(({ sizeKey, label, size, token, note }) => (
            <div key={sizeKey} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{label}</span>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--brand-600)', background: 'var(--bg-primary)', padding: '2px 7px', borderRadius: 4 }}>{size} px</code>
              </div>
              <div style={{ padding: '20px 20px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Three states side by side */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <CBox checked={false} size={size} t={t} />
                  <CBox checked={true}  size={size} t={t} />
                  <CBox indeterminate   size={size} t={t} />
                </div>
                {/* Label example */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CBox checked={true} size={size} t={t} />
                  <span style={{ fontSize: size === 12 ? 12 : 14, color: t['checkbox.label'] }}>Label example</span>
                </div>
                <div style={{ paddingTop: 4, borderTop: '1px solid var(--stroke-primary)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Token: <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{token}</code></div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{note}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <InfoBox>
          Both sizes share the same token set — only <Code>checkbox.size-md</Code> / <Code>checkbox.size-sm</Code> differ. Border radius, colors, and icons all scale proportionally from the 16 px base.
        </InfoBox>

        <Divider />

        {/* ══ Usage rules ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>
        <Lead>
          Guidelines for writing clear labels and placing checkboxes correctly in layouts.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <DoBox
            visual={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Receive email notifications', 'Receive SMS alerts', 'Weekly digest'].map((label, i) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CBox checked={i === 0} size={sizeMd} t={t} />
                    <span style={{ fontSize: 13, color: t['checkbox.label'] }}>{label}</span>
                  </div>
                ))}
              </div>
            }
          >
            Use concise, positive-action labels. Position the label to the right of the checkbox. Each item should be independently selectable.
          </DoBox>
          <DontBox
            visual={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Do not send me emails', 'Do not receive SMS', 'No digest'].map((label, i) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CBox checked={i === 0} size={sizeMd} t={t} />
                    <span style={{ fontSize: 13, color: t['checkbox.label'] }}>{label}</span>
                  </div>
                ))}
              </div>
            }
          >
            Avoid negative or double-negative labels. "Do not send me emails" when checked is confusing. Prefer "Receive email notifications".
          </DontBox>

          <DoBox
            visual={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CBox indeterminate size={sizeMd} t={t} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: t['checkbox.label'] }}>All notifications</span>
                </div>
                <div style={{ marginLeft: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['Email', 'Push', 'SMS'].map((l, i) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CBox checked={i < 2} size={sizeSm} t={t} />
                      <span style={{ fontSize: 12, color: t['checkbox.label'] }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            Use a parent checkbox with indeterminate state to represent a group. Indent children visually to show the hierarchy.
          </DoBox>
          <DontBox
            visual={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].slice(0, 4).map((l) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CBox size={sizeMd} t={t} />
                    <span style={{ fontSize: 13, color: t['checkbox.label'] }}>{l}</span>
                  </div>
                ))}
              </div>
            }
          >
            Don't use checkboxes for mutually exclusive options. If only one day can be selected, use Radio buttons instead.
          </DontBox>

          <DoBox>
            Group related checkboxes together under a clear section heading. Use consistent spacing so users can scan the list quickly.
          </DoBox>
          <DontBox>
            Don't use a checkbox as an immediate action trigger. Checking a box should represent state, not fire an irreversible action. Use a Button for actions.
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case — Filter panel</H2>
        <Lead>
          A common pattern: a filter sidebar with a <strong>"Select all"</strong> parent checkbox that automatically enters the indeterminate state when only some items are selected. Click the items below to interact.
        </Lead>

        {/* Filter panel demo */}
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Interactive filter panel — click items to toggle</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Default size (16 px)</span>
          </div>
          <div style={{ padding: '24px', background: 'var(--bg-primary)', display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Filter sidebar */}
            <div style={{
              background: '#ffffff', borderRadius: 10, border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,.06)', width: 240, flexShrink: 0, overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>Filter by category</span>
                {filterSelectedCount > 0 && (
                  <button
                    onClick={() => setFilterSel(filterSel.map(() => false))}
                    style={{ fontSize: 11, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                  >
                    Clear
                  </button>
                )}
              </div>
              {/* Select all */}
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9' }}>
                <CBoxLive
                  checked={allFilterSel}
                  indeterminate={filterIndeterminate}
                  onChange={toggleAllFilter}
                  label={`All categories ${filterSelectedCount > 0 ? `(${filterSelectedCount} of ${FILTER_CATEGORIES.length})` : ''}`}
                  size={sizeMd}
                  t={t}
                />
              </div>
              {/* Individual items */}
              <div style={{ padding: '8px 14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {FILTER_CATEGORIES.map((cat, i) => (
                  <div key={cat.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <CBoxLive
                      checked={filterSel[i]}
                      onChange={() => setFilterSel(prev => prev.map((v, idx) => idx === i ? !v : v))}
                      label={cat.label}
                      size={sizeMd}
                      t={t}
                    />
                    <span style={{ fontSize: 11, color: '#94a3b8', background: '#f8fafc', borderRadius: 10, padding: '1px 7px', flexShrink: 0 }}>{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Annotation table */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Behavior legend</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Select all — unchecked', 'Click → selects all items'],
                  ['Select all — indeterminate', 'Click → selects all items'],
                  ['Select all — checked', 'Click → deselects all items'],
                  ['Individual item',  'Toggles independently; parent updates to reflect group state'],
                  ['Clear button',     'Deselects all items; appears only when ≥1 item is selected'],
                ].map(([trigger, effect]) => (
                  <div key={trigger} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8, fontSize: 12, alignItems: 'start' }}>
                    <span style={{ color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{trigger}</span>
                    <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>→ {effect}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ Accessibility ═══════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <Lead>
          Checkboxes must be keyboard navigable and properly announced to screen readers.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '16px 18px', background: 'var(--bg-primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Keyboard interaction</div>
            {[
              ['Tab',        'Move focus to the next checkbox'],
              ['Shift+Tab',  'Move focus to the previous checkbox'],
              ['Space',      'Toggle the focused checkbox'],
            ].map(([key, desc]) => (
              <div key={key} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 8, fontSize: 12, marginBottom: 7, alignItems: 'start' }}>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{key}</code>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</span>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '16px 18px', background: 'var(--bg-primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>ARIA attributes</div>
            {[
              ['role="checkbox"',     'Applied to the interactive element'],
              ['aria-checked',        '"true", "false", or "mixed" (indeterminate)'],
              ['aria-label',          'Required when there is no visible label'],
              ['aria-disabled',       '"true" when the checkbox is disabled'],
              ['aria-describedby',    'Links to helper text or error messages'],
            ].map(([attr, desc]) => (
              <div key={attr} style={{ display: 'grid', gridTemplateColumns: '145px 1fr', gap: 8, fontSize: 12, marginBottom: 7, alignItems: 'start' }}>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{attr}</code>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <InfoBox type="warning">
          The <strong>indeterminate</strong> state must be set via the <Code>aria-checked="mixed"</Code> attribute. The HTML <Code>indeterminate</Code> property is visual-only and is not announced by all screen readers without explicit ARIA.
        </InfoBox>

        <H3>Label requirements</H3>
        <P>
          Every checkbox must have an associated visible label. If the label is placed outside the element's structure, use <Code>aria-labelledby</Code> to reference it. Never use placeholder or tooltip text as the sole accessible name.
        </P>

        <Divider />

        {/* ══ Token reference ══════════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>
          All checkbox tokens are prefixed with <Code>checkbox.</Code> and resolve from semantic color and spacing aliases. Values shown for the <strong>{theme.label}</strong> theme.
        </Lead>

        <TokenTable tokens={t} prefix="checkbox" />

      </div>

      {/* ── Right TOC aside ────────────────────────────────────────────────────── */}
      <aside style={{ width: 200, flexShrink: 0, position: 'sticky', top: 80, padding: '52px 24px 48px 0', alignSelf: 'flex-start' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>On this page</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {TOC.map(item => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  display: 'block',
                  fontSize: 12,
                  padding: '5px 10px',
                  borderRadius: 6,
                  borderLeft: isActive ? '2px solid var(--brand-600)' : '2px solid transparent',
                  color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--brand-50)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: 'none',
                  transition: 'all .12s',
                  lineHeight: 1.5,
                }}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
      </aside>

    </div>
  )
}
