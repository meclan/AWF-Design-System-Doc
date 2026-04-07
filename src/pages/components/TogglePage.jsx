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

// ─── Toolbar icon SVGs ────────────────────────────────────────────────────────

function IcoSidebar({ size = 16, sw = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <rect x="1.5" y="2.5" width="13" height="11" rx="2" stroke="currentColor" strokeWidth={sw} />
      <path d="M5.5 2.5v11" stroke="currentColor" strokeWidth={sw} />
    </svg>
  )
}
function IcoGrid({ size = 16, sw = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth={sw} />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth={sw} />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth={sw} />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth={sw} />
    </svg>
  )
}
function IcoList({ size = 16, sw = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <path d="M5 4h8M5 8h8M5 12h8" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
      <circle cx="2.5" cy="4" r="1" fill="currentColor" />
      <circle cx="2.5" cy="8" r="1" fill="currentColor" />
      <circle cx="2.5" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}
function IcoColumns({ size = 16, sw = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <rect x="1.5" y="2.5" width="5.5" height="11" rx="1.5" stroke="currentColor" strokeWidth={sw} />
      <rect x="9" y="2.5" width="5.5" height="11" rx="1.5" stroke="currentColor" strokeWidth={sw} />
    </svg>
  )
}
function IcoBold({ size = 16, sw = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <path d="M4 3h5a3 3 0 0 1 0 6H4V3z" stroke="currentColor" strokeWidth={sw} strokeLinejoin="round" />
      <path d="M4 9h5.5a3.5 3.5 0 0 1 0 7H4V9z" stroke="currentColor" strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  )
}
function IcoItalic({ size = 16, sw = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <path d="M10 3H6M10 13H6M9 3L7 13" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
}
function IcoFilter({ size = 16, sw = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
}
function IcoSearch({ size = 16, sw = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth={sw} />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
}

// ─── Toolbar prototype icons (24×24 viewBox, matching prototype SVG paths) ───

function IcoHand({ size = 17, sw = 1.65 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M18 11V8a2 2 0 0 0-4 0v3M14 8V6a2 2 0 0 0-4 0v5M10 9V5a2 2 0 0 0-4 0v8l-1-1a2 2 0 0 0-3 3l4 4a6 6 0 0 0 6 0l2-2a6 6 0 0 0 0-8" stroke="currentColor" strokeWidth={sw} />
    </svg>
  )
}
function IcoCursor({ size = 17, sw = 1.65 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="m4 4 7.07 17 2.51-7.39L21 11.07z" stroke="currentColor" strokeWidth={sw} />
    </svg>
  )
}
function IcoFrame({ size = 17, sw = 1.65 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={sw} />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={sw} />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={sw} />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={sw} />
    </svg>
  )
}
function IcoUndo({ size = 17, sw = 1.65 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M9 14 4 9l5-5" stroke="currentColor" strokeWidth={sw} />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" stroke="currentColor" strokeWidth={sw} />
    </svg>
  )
}
function IcoRedo({ size = 17, sw = 1.65 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="m15 14 5-5-5-5" stroke="currentColor" strokeWidth={sw} />
      <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" stroke="currentColor" strokeWidth={sw} />
    </svg>
  )
}
function IcoColors({ size = 17, sw = 1.65 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" stroke="currentColor" strokeWidth={sw * 0.5} />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" stroke="currentColor" strokeWidth={sw * 0.5} />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" stroke="currentColor" strokeWidth={sw * 0.5} />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" stroke="currentColor" strokeWidth={sw * 0.5} />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" stroke="currentColor" strokeWidth={sw} />
    </svg>
  )
}
function IcoBranches({ size = 17, sw = 1.65 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth={sw} />
      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth={sw} />
      <path d="M6 21V9a9 9 0 0 0 9 9" stroke="currentColor" strokeWidth={sw} />
    </svg>
  )
}
function IcoZoomOut({ size = 17, sw = 1.65 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={sw} />
      <path d="M8 12h8" stroke="currentColor" strokeWidth={sw} />
    </svg>
  )
}

// ─── Toolbar helpers ──────────────────────────────────────────────────────────

function ToolSep() {
  return <div style={{ width: 1, height: 22, background: 'var(--stroke-primary)', margin: '0 4px', flexShrink: 0 }} />
}

// Hoverable toggle button for the toolbar use case
function ToolBtn({ Icon, isActive, onClick, tooltip, onBg, onColor, hoverBg }) {
  const [hov, setHov] = useState(false)
  const bg    = isActive ? onBg    : hov ? hoverBg : 'transparent'
  const color = isActive ? onColor : hov ? '#334155' : '#94a3b8'
  return (
    <div
      title={tooltip}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 8, background: bg, color, cursor: 'pointer', flexShrink: 0,
        transition: 'background .13s, color .13s',
      }}
    >
      <Icon size={17} sw={1.65} />
    </div>
  )
}

// Non-toggle action button (undo, redo, zoom)
function ToolAction({ Icon, tooltip }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      title={tooltip}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 8, background: hov ? '#f1f5f9' : 'transparent', color: hov ? '#334155' : '#94a3b8',
        cursor: 'pointer', flexShrink: 0, transition: 'background .13s, color .13s',
      }}
    >
      <Icon size={17} sw={1.65} />
    </div>
  )
}

// ─── Static toggle button renderer ───────────────────────────────────────────

function TBtn({ bg, color, stroke, strokeW = 1.5, size = 40, r = 8, Icon = IcoSidebar, iconSize = 18, iSw = 1.5, onClick, style }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: size, height: size,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        borderRadius: r, background: bg || 'transparent', color,
        border: stroke ? `${strokeW}px solid ${stroke}` : 'none',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background .12s, color .12s',
        ...style,
      }}
    >
      <Icon size={iconSize} sw={iSw} />
    </div>
  )
}

// ─── Appearance card — states grid ───────────────────────────────────────────

function ToggleAppCard({ title, desc, offRow, onRow, r = 8, size = 48 }) {
  const iconSize = Math.round(size * 0.4)
  const iSw = size >= 40 ? 1.5 : 1
  const MD = { size, r, iconSize, iSw, Icon: IcoSidebar }
  const COL_HEADERS = ['Default', 'Hover', 'Disabled']
  const rows = [
    { label: 'Off', cols: [offRow.default, offRow.hover, offRow.disabled] },
    { label: 'On',  cols: [onRow.default,  onRow.hover,  onRow.disabled] },
  ]

  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
      </div>
      <div style={{ padding: '16px 18px', background: 'var(--bg-primary)' }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: `40px repeat(3, ${size + 16}px)`, marginBottom: 10, alignItems: 'center' }}>
          <div />
          {COL_HEADERS.map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', textAlign: 'center' }}>{h}</div>
          ))}
        </div>
        {/* Off / On rows */}
        {rows.map(row => (
          <div key={row.label} style={{ display: 'grid', gridTemplateColumns: `40px repeat(3, ${size + 16}px)`, alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', fontWeight: 500 }}>{row.label}</div>
            {row.cols.map((col, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                <TBtn {...MD} {...col} />
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
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder={`Filter ${prefix} tokens…`}
        style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 6, border: '1px solid var(--stroke-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
      />
      <div style={{ borderRadius: 8, border: '1px solid var(--stroke-primary)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 40px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', padding: '8px 14px' }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Token</span>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Resolved value</span>
          <span />
        </div>
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
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
  { id: 'overview',    label: 'Overview' },
  { id: 'anatomy',     label: 'Anatomy' },
  { id: 'states',      label: 'States' },
  { id: 'behavior',    label: 'Behavior types' },
  { id: 'appearance',  label: 'Appearance' },
  { id: 'sizes',       label: 'Sizes' },
  { id: 'usage',       label: 'Usage rules' },
  { id: 'usecase',     label: 'Use case' },
  { id: 'a11y',        label: 'Accessibility' },
  { id: 'tokens',      label: 'Token reference' },
]

const TOKEN_TABS = [
  { key: 'button.toggle.ghost',    label: 'Ghost' },
  { key: 'button.toggle.outlined', label: 'Outlined' },
  { key: 'button.toggle.size',     label: 'Sizes' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TogglePage() {
  const [activeTheme,    setActiveTheme]    = useState('dot')
  const [tokenTab,       setTokenTab]       = useState('button.toggle.ghost')
  const [activeSection,  setActiveSection]  = useState('overview')

  // Demo — multi-select: each toggle is independent
  const [multiActive, setMultiActive] = useState([false, true, false, false, false, false])
  // Demo — single-select: only one active at a time (radio)
  const [radioActive, setRadioActive] = useState(1)
  // Use case toolbar — tool group (single-select) + view group (multi-select)
  const [toolActive,  setToolActive]  = useState(0)
  const [viewActive,  setViewActive]  = useState({ grid: false, colors: true, branches: false })

  const t = getComponentTokens(activeTheme)
  const theme = VISIBLE_THEMES.find(th => th.id === activeTheme) || VISIBLE_THEMES[0]
  const r = t['button.toggle.radius'] || 8

  // ── Ghost tokens ─────────────────────────────────────────────────────────────
  const g = {
    off:    { bg: t['button.toggle.ghost.bg.off.default'],    color: t['button.toggle.ghost.color.off.default'] },
    offH:   { bg: t['button.toggle.ghost.bg.off.hover'],      color: t['button.toggle.ghost.color.off.hover'] },
    on:     { bg: t['button.toggle.ghost.bg.on.default'],     color: t['button.toggle.ghost.color.on.default'] },
    onH:    { bg: t['button.toggle.ghost.bg.on.hover'],       color: t['button.toggle.ghost.color.on.hover'] },
    disOff: { bg: t['button.toggle.ghost.bg.off.default'],    color: t['button.toggle.ghost.color.disabled'] },
    disOn:  { bg: t['button.toggle.ghost.bg.on.disabled'],    color: t['button.toggle.ghost.color.disabled'] },
  }

  // ── Outlined tokens ──────────────────────────────────────────────────────────
  const o = {
    off:    { bg: t['button.toggle.outlined.bg.off.default'],  color: t['button.toggle.outlined.color.off.default'],  stroke: t['button.toggle.outlined.stroke.off.default'] },
    offH:   { bg: t['button.toggle.outlined.bg.off.hover'],    color: t['button.toggle.outlined.color.off.hover'],    stroke: t['button.toggle.outlined.stroke.off.darker'] },
    on:     { bg: t['button.toggle.outlined.bg.on.default'],   color: t['button.toggle.outlined.color.on.default'],   stroke: t['button.toggle.outlined.stroke.on.default'] },
    onH:    { bg: t['button.toggle.outlined.bg.on.hover'],     color: t['button.toggle.outlined.color.on.hover'],     stroke: t['button.toggle.outlined.stroke.on.default'] },
    disOff: { bg: t['button.toggle.outlined.bg.off.default'],  color: t['button.toggle.outlined.color.disabled'],     stroke: t['button.toggle.outlined.stroke.off.disabled'] },
    disOn:  { bg: t['button.toggle.outlined.bg.on.disabled'],  color: t['button.toggle.outlined.color.disabled'],     stroke: t['button.toggle.outlined.stroke.off.disabled'] },
  }

  // ── Sizes — mirrors icon button scale (token keys kept for reference) ─────────
  const SIZES = [
    { key: 'xs', label: 'XS',   box: t['button.icon.size.xs.box-width'] || 24, iconSize: 11, iSw: 1 },
    { key: 'sm', label: 'SM',   box: t['button.icon.size.sm.box-width'] || 32, iconSize: 14, iSw: 1.5 },
    { key: 'md', label: 'MD ★', box: t['button.icon.size.md.box-width'] || 40, iconSize: 18, iSw: 1.5 },
    { key: 'lg', label: 'LG',   box: t['button.icon.size.lg.box-width'] || 48, iconSize: 22, iSw: 1.5 },
  ]

  // ── Toolbar demo icons ────────────────────────────────────────────────────────
  const MULTI_ICONS  = [IcoSidebar, IcoFilter, IcoSearch, IcoGrid, IcoList, IcoColumns]
  const RADIO_ICONS  = [IcoGrid, IcoList, IcoColumns]

  // ── Scroll spy — listens on <main> (the actual scrolling container) ───────────
  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    const ids = TOC.map(item => item.id)
    function onScroll() {
      const mainTop = main.getBoundingClientRect().top
      const threshold = 140 // px below main top
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - mainTop <= threshold) {
          current = id
        }
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
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Actions</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Toggle button</h1>
          <Lead>
            An icon-only button that switches between an <strong>active</strong> and <strong>inactive</strong> state. Used in toolbars and action bars where multiple binary options need to be displayed compactly.
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
          Toggle buttons are icon-only controls built for toolbars. They differ from regular buttons in that they maintain a persistent <strong>on/off state</strong> — pressing one does not immediately execute and complete an action; it activates or deactivates a feature that stays until changed.
        </P>
        <P>
          They come in two appearances — <strong>Ghost</strong> and <strong>Outlined</strong> — and support two selection behaviors: <strong>multi-select</strong> (independent toggles) and <strong>single-select</strong> (radio-style). The active state is always signaled by the brand toggle background color.
        </P>

        {/* When to use / not */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Activating a persistent UI tool (filter, bold text, sidebar)',
              'Switching between views in a compact toolbar (grid vs. list)',
              'Multiple independent binary controls grouped in a toolbar',
            ].map((txt, i) => <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>• {txt}</div>)}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Triggering a one-shot action → use a regular Button',
              'Toggling a system-level setting (Wi-Fi, dark mode) → use a Switch',
              'Selecting from labeled choices with equal visual weight → use a Group',
            ].map((txt, i) => <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>• {txt}</div>)}
          </div>
        </div>

        <Divider />

        {/* ══ Anatomy ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <Lead>A toggle button is an icon-only container with a persistent on/off state. The icon conveys the feature being toggled.</Lead>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '24px 32px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', paddingTop: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative' }}>
                  <TBtn bg={g.off.bg} color={g.off.color} size={40} r={r} Icon={IcoSidebar} iconSize={18} iSw={1.5} />
                  <div style={{ position: 'absolute', left: -3, top: -3, right: -3, bottom: -3, border: '1.5px dashed #94a3b8', borderRadius: r + 3, pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.05em', textTransform: 'uppercase' }}>① Container</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 14 }}>Off</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative' }}>
                  <TBtn bg={g.on.bg} color={g.on.color} size={40} r={r} Icon={IcoSidebar} iconSize={18} iSw={1.5} />
                  <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.05em', textTransform: 'uppercase' }}>② Active bg</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 14 }}>On</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['① Container',  'Square or rounded box. Transparent (Ghost) or white with border (Outlined) when Off.'],
                ['② Active bg',  'Brand-colored fill when On. Consistent across Ghost and Outlined variants.'],
                ['③ Icon',       'Describes the controlled feature. Color shifts from muted (Off) to brand/white (On).'],
              ].map(([name, desc]) => (
                <div key={name} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', minWidth: 90, flexShrink: 0 }}>{name}</span>
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
          Off and On each support Default, Hover, and Disabled. Values resolve live from the <strong>{theme.label}</strong> theme.
        </Lead>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
          {[
            {
              variant: 'Ghost',
              rows: [
                { label: 'Off', cols: [g.off, g.offH, g.disOff] },
                { label: 'On',  cols: [g.on,  g.onH,  g.disOn ] },
              ],
            },
            {
              variant: 'Outlined',
              rows: [
                { label: 'Off', cols: [o.off, o.offH, o.disOff] },
                { label: 'On',  cols: [o.on,  o.onH,  o.disOn ] },
              ],
            },
          ].map(({ variant, rows }) => (
            <div key={variant} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{variant}</div>
              <div style={{ padding: '16px 20px', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '36px repeat(3, 1fr)', marginBottom: 8 }}>
                  <div />
                  {['Default', 'Hover', 'Disabled'].map(h => (
                    <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', textAlign: 'center' }}>{h}</div>
                  ))}
                </div>
                {rows.map(row => (
                  <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '36px repeat(3, 1fr)', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', fontWeight: 500 }}>{row.label}</div>
                    {row.cols.map((tok, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                        <TBtn bg={tok.bg} color={tok.color} stroke={tok.stroke} size={36} r={r} Icon={IcoSidebar} iconSize={15} iSw={1.5} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Behavior types ══════════════════════════════════════════════════════ */}
        <SectionAnchor id="behavior" />
        <H2>Behavior types</H2>
        <Lead>
          Toggle buttons support two distinct selection behaviors. The behavior is determined at the group level — not by the individual button token.
        </Lead>

        {/* Multi-select */}
        <H3>Multi-select — independent toggles</H3>
        <P>
          Each button controls an independent binary state. Any number of buttons can be active simultaneously. Use for features that are truly orthogonal — activating one does not affect the others.
        </P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Multi-select — click any button to toggle</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Ghost appearance</span>
          </div>
          <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
            {/* Realistic app toolbar — white card */}
            <div style={{ background: '#ffffff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.06)', overflow: 'hidden', width: '100%', maxWidth: 520 }}>
              {/* Fake title bar */}
              <div style={{ padding: '8px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f87171' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#9ca3af', fontWeight: 500, marginRight: 30 }}>Document editor</span>
              </div>
              {/* Toolbar row */}
              <div style={{ padding: '6px 10px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* File/Edit fake menus */}
                {['File', 'Edit', 'View'].map(label => (
                  <div key={label} style={{ padding: '3px 8px', fontSize: 12, color: '#6b7280', borderRadius: 4, cursor: 'default' }}>{label}</div>
                ))}
                <div style={{ width: 1, height: 16, background: '#e5e7eb', margin: '0 6px' }} />
                {/* Ghost toggle buttons */}
                {MULTI_ICONS.map((Icon, i) => {
                  const isOn = multiActive[i]
                  return (
                    <TBtn
                      key={i}
                      bg={isOn ? g.on.bg : 'transparent'}
                      color={isOn ? g.on.color : '#9ca3af'}
                      size={32} r={r} Icon={Icon} iconSize={15} iSw={1.5}
                      onClick={() => setMultiActive(prev => prev.map((v, idx) => idx === i ? !v : v))}
                    />
                  )
                })}
              </div>
              {/* Fake content */}
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[['70%', '90%'], ['85%', '55%'], ['60%', '75%']].map(([w1, w2], i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, width: w1 }} />
                    <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, width: w2 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Single-select */}
        <H3>Single-select — radio behavior</H3>
        <P>
          Only one button in the group can be active at a time. Activating a button automatically deactivates the previously active one. Use for mutually exclusive view modes or states — exactly one option must always be selected.
        </P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Single-select — only one active at a time</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Outlined appearance</span>
          </div>
          <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
            {/* Realistic data table header */}
            <div style={{ background: '#ffffff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.06)', overflow: 'hidden', width: '100%', maxWidth: 520 }}>
              {/* Table toolbar */}
              <div style={{ padding: '8px 14px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, background: '#e5e7eb' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Records</span>
                  <span style={{ fontSize: 11, color: '#9ca3af', background: '#f3f4f6', borderRadius: 10, padding: '1px 7px' }}>48</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {/* Outlined single-select view toggle */}
                  <div style={{ display: 'flex', gap: 3 }}>
                    {RADIO_ICONS.map((Icon, i) => {
                      const isOn = radioActive === i
                      return (
                        <TBtn
                          key={i}
                          bg={isOn ? o.on.bg : o.off.bg}
                          color={isOn ? o.on.color : o.off.color}
                          stroke={isOn ? o.on.stroke : o.off.stroke}
                          size={30} r={r} Icon={Icon} iconSize={14} iSw={1.5}
                          onClick={() => setRadioActive(i)}
                        />
                      )
                    })}
                  </div>
                  <div style={{ width: 1, height: 16, background: '#e5e7eb' }} />
                  <div style={{ padding: '4px 10px', background: '#f3f4f6', borderRadius: 5, fontSize: 11, color: '#6b7280' }}>Filter</div>
                </div>
              </div>
              {/* Fake table rows */}
              {[['John Smith', 'Manager', '#dcfce7', '#166534'], ['Marie Dupont', 'Developer', '#eff6ff', '#1e40af'], ['Alex Kim', 'Designer', '#fef3c7', '#92400e']].map(([name, role, bg, col]) => (
                <div key={name} style={{ padding: '9px 14px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: col, flexShrink: 0 }}>{name[0]}</div>
                  <div style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginLeft: 'auto' }}>{role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Multi-select</div>
            {[
              ['State init',  'Can start with 0, 1, or N items active'],
              ['Can be all off', 'Yes — all buttons can be inactive'],
              ['Aria pattern', 'Each button: role="button" aria-pressed'],
              ['Example',     'Bold + Italic + Underline in a text editor'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8, fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{k}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Single-select</div>
            {[
              ['State init',  'Exactly one item must always be active'],
              ['Can be all off', 'No — one option is always selected'],
              ['Aria pattern', 'role="radiogroup" + role="radio" aria-checked'],
              ['Example',     'Grid / List / Column view switcher'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8, fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{k}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <InfoBox type="info">
          The visual design is identical for both behaviors. The difference is purely in the interaction logic managed by the parent component — the toggle button itself is unaware of the group behavior.
        </InfoBox>

        <Divider />

        {/* ══ Appearance ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="appearance" />
        <H2>Appearance</H2>
        <Lead>
          Two appearances for different surface contexts. Both share the same on/off state model — the active brand background is the primary visual signal.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <ToggleAppCard
            title="Ghost"
            desc="No background or border when off. Preferred for toolbars on neutral light surfaces — the lowest visual weight."
            size={48}
            r={r}
            offRow={{
              default:  { bg: g.off.bg,    color: g.off.color },
              hover:    { bg: g.offH.bg,   color: g.offH.color },
              disabled: { bg: g.disOff.bg, color: g.disOff.color },
            }}
            onRow={{
              default:  { bg: g.on.bg,    color: g.on.color },
              hover:    { bg: g.onH.bg,   color: g.onH.color },
              disabled: { bg: g.disOn.bg, color: g.disOn.color },
            }}
          />
          <ToggleAppCard
            title="Outlined"
            desc="White background with a visible border when off. Use on non-white surfaces or when the toggle must remain visible without activation."
            size={48}
            r={r}
            offRow={{
              default:  { bg: o.off.bg,    color: o.off.color,    stroke: o.off.stroke },
              hover:    { bg: o.offH.bg,   color: o.offH.color,   stroke: o.offH.stroke },
              disabled: { bg: o.disOff.bg, color: o.disOff.color, stroke: o.disOff.stroke },
            }}
            onRow={{
              default:  { bg: o.on.bg,    color: o.on.color,    stroke: o.on.stroke },
              hover:    { bg: o.onH.bg,   color: o.onH.color,   stroke: o.onH.stroke },
              disabled: { bg: o.disOn.bg, color: o.disOn.color, stroke: o.disOn.stroke },
            }}
          />
        </div>

        <InfoBox type="info">
          The <strong>On</strong> state uses <Code>button.toggle.*.bg.on.default</Code> — a tinted brand background that adapts to all themes. The icon color shifts to <Code>color.icon.brand.default</Code>.
        </InfoBox>
        <InfoBox type="info">
          For <strong>Outlined</strong>, the border becomes transparent when active (<Code>button.toggle.outlined.stroke.on.default</Code> → <Code>transparent</Code>). The brand fill provides sufficient visual affordance.
        </InfoBox>

        <Divider />

        {/* ══ Sizes ═══════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="sizes" />
        <H2>Sizes</H2>
        <Lead>
          Toggle buttons share the same four-step size scale as Icon buttons. <strong>MD</strong> (32 px) is the default for most toolbar contexts.
        </Lead>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', marginBottom: 24 }}>
            {SIZES.map(s => (
              <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <TBtn bg={g.on.bg} color={g.on.color} size={s.box} r={r} Icon={IcoSidebar} iconSize={s.iconSize} iSw={s.iSw} />
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--stroke-primary)', paddingTop: 14, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['Property', 'XS', 'SM', 'MD ★', 'LG'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Property' ? 'left' : 'center', padding: '6px 12px', color: 'var(--text-tertiary)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid var(--stroke-primary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { prop: 'Token key',     values: SIZES.map(s => `icon.size.${s.key}.box-width`) },
                  { prop: 'Box size',      values: SIZES.map(s => `${s.box}px`) },
                  { prop: 'Border radius', values: SIZES.map(() => `${r}px`) },
                ].map(row => (
                  <tr key={row.prop}>
                    <td style={{ padding: '7px 12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)', fontWeight: 500 }}>{row.prop}</td>
                    {row.values.map((v, i) => (
                      <td key={i} style={{ padding: '7px 12px', textAlign: 'center', borderBottom: '1px solid var(--stroke-primary)', color: 'var(--text-primary)', background: i === 2 ? 'var(--brand-50)' : 'transparent' }}>
                        <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{v}</code>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>★ Default size</div>
          </div>
        </div>

        <Divider />

        {/* ══ Usage rules ═════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <DoBox visual={
            <div style={{ display: 'flex', gap: 4, padding: '6px', background: 'var(--bg-secondary)', borderRadius: r + 4 }}>
              {[false, true, true].map((isOn, i) => (
                <TBtn key={i} bg={isOn ? g.on.bg : g.off.bg} color={isOn ? g.on.color : g.off.color}
                  size={32} r={r} Icon={[IcoBold, IcoItalic, IcoFilter][i]} />
              ))}
            </div>
          }>
            Use <strong>Ghost</strong> for toolbars on neutral surfaces. Multiple buttons can be active simultaneously when they control independent options.
          </DoBox>
          <DontBox visual={
            <div style={{ display: 'flex', gap: 4, padding: '6px', background: 'var(--bg-secondary)', borderRadius: r + 4 }}>
              {[true, true, true].map((isOn, i) => (
                <TBtn key={i} bg={isOn ? g.on.bg : g.off.bg} color={isOn ? g.on.color : g.off.color}
                  size={32} r={r} Icon={[IcoGrid, IcoList, IcoColumns][i]} />
              ))}
            </div>
          }>
            Don't allow all buttons to be active at once in a single-select group — exactly one view mode should always be selected.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <DoBox visual={
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TBtn bg={g.on.bg} color={g.on.color} size={32} r={r} Icon={IcoGrid} />
              <div style={{ fontSize: 10, color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4, padding: '3px 7px', lineHeight: 1.5 }}>
                aria-label="Grid view"<br />aria-pressed="true"
              </div>
            </div>
          }>
            Always provide <Code>aria-label</Code> and keep <Code>aria-pressed</Code> in sync with the visual state. For single-select, use <Code>role="radiogroup"</Code> + <Code>aria-checked</Code>.
          </DoBox>
          <DontBox visual={
            <div style={{ display: 'flex', gap: 4 }}>
              <TBtn bg={g.on.bg} color={g.on.color} size={32} r={r} Icon={IcoFilter} />
              <span style={{ alignSelf: 'center', fontSize: 11, color: '#7f1d1d', fontWeight: 500 }}>Apply filter</span>
            </div>
          }>
            Don't use a Toggle button for one-shot actions (delete, submit, apply). A persistent visual state implies the action is reversible and ongoing — use a regular Button instead.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <DoBox visual={
            <div style={{ display: 'flex', gap: 4, padding: '6px', background: '#e2e8f0', borderRadius: r + 4 }}>
              {[false, true, false].map((isOn, i) => (
                <TBtn key={i} bg={isOn ? o.on.bg : o.off.bg} color={isOn ? o.on.color : o.off.color} stroke={isOn ? o.on.stroke : o.off.stroke}
                  size={32} r={r} Icon={[IcoSidebar, IcoFilter, IcoSearch][i]} />
              ))}
            </div>
          }>
            Use <strong>Outlined</strong> when the toolbar sits on a non-white or colored surface — the visible border anchors each button even in the off state.
          </DoBox>
          <DontBox visual={
            <div style={{ display: 'flex', gap: 4, padding: '6px', background: 'var(--bg-secondary)', borderRadius: r + 4 }}>
              {[false, true, false].map((isOn, i) => (
                <TBtn key={i} bg={isOn ? o.on.bg : o.off.bg} color={isOn ? o.on.color : o.off.color} stroke={isOn ? o.on.stroke : o.off.stroke}
                  size={32} r={r} Icon={[IcoSidebar, IcoFilter, IcoSearch][i]} />
              ))}
            </div>
          }>
            Don't mix Ghost and Outlined in the same toolbar — keep appearance consistent within a single group to maintain visual rhythm.
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <Lead>
          A design toolbar combining a <strong>single-select tool group</strong> (only one tool active at a time) with an independent <strong>multi-select view group</strong> and non-toggle action buttons — a typical real-world composition.
        </Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Design editor toolbar — interactive demo</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Ghost appearance</span>
          </div>
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, background: '#edf1f7' }}>
            {/* The toolbar */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 2,
              background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12,
              padding: 6, boxShadow: '0 2px 8px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.06)',
            }}>
              {/* Group 1 — tools (single-select) */}
              <ToolBtn Icon={IcoHand}   isActive={toolActive === 0} onClick={() => setToolActive(0)} tooltip="Hand (V)"     onBg={g.on.bg} onColor={g.on.color} hoverBg={g.offH.bg} />
              <ToolBtn Icon={IcoCursor} isActive={toolActive === 1} onClick={() => setToolActive(1)} tooltip="Select (S)"   onBg={g.on.bg} onColor={g.on.color} hoverBg={g.offH.bg} />
              <ToolBtn Icon={IcoFrame}  isActive={toolActive === 2} onClick={() => setToolActive(2)} tooltip="Frame (F)"    onBg={g.on.bg} onColor={g.on.color} hoverBg={g.offH.bg} />

              <ToolSep />

              {/* Group 2 — history (non-toggle, ghost actions) */}
              <ToolAction Icon={IcoUndo} tooltip="Undo (Ctrl+Z)" />
              <ToolAction Icon={IcoRedo} tooltip="Redo (Ctrl+Y)" />

              <ToolSep />

              {/* Group 3 — views (multi-select) */}
              <ToolBtn Icon={IcoFrame}    isActive={viewActive.grid}     onClick={() => setViewActive(v => ({ ...v, grid:     !v.grid }))}     tooltip="Grid (G)"   onBg={g.on.bg} onColor={g.on.color} hoverBg={g.offH.bg} />
              <ToolBtn Icon={IcoColors}   isActive={viewActive.colors}   onClick={() => setViewActive(v => ({ ...v, colors:   !v.colors }))}   tooltip="Colors"     onBg={g.on.bg} onColor={g.on.color} hoverBg={g.offH.bg} />
              <ToolBtn Icon={IcoBranches} isActive={viewActive.branches} onClick={() => setViewActive(v => ({ ...v, branches: !v.branches }))} tooltip="Branches"   onBg={g.on.bg} onColor={g.on.color} hoverBg={g.offH.bg} />
              <ToolAction Icon={IcoZoomOut} tooltip="Zoom out" />
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 11, color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: g.on.bg, border: `1px solid ${g.on.color}` }} />
                <span>Ghost · on — active tool / view</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: 'transparent', border: '1px dashed #94a3b8' }} />
                <span>Ghost · off — inactive button</span>
              </div>
              <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Hover for tooltip</span>
            </div>
          </div>
        </div>

        {/* Annotation table */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 8 }}>
          {[
            { group: 'Group 1 — Tools', behavior: 'Single-select', note: 'Exactly one tool always active. Selecting Hand deactivates Select and Frame.' },
            { group: 'Group 2 — History', behavior: 'Action (no state)', note: 'Undo and Redo fire an action on click. They have no persistent on/off state — use a regular ghost icon button.' },
            { group: 'Group 3 — Views', behavior: 'Multi-select', note: 'Grid, Colors and Branches are independent. Multiple can be active simultaneously. Zoom out is a plain action.' },
          ].map(row => (
            <div key={row.group} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{row.group}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-600)', marginBottom: 6 }}>{row.behavior}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.note}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Accessibility ════════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <Lead>
          Toggle buttons must expose their state change to assistive technologies. The visual indicator (background change) has no text equivalent, so ARIA attributes are mandatory.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Multi-select markup */}
          <div>
            <H3>Multi-select markup</H3>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 18px' }}>
              <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.9, margin: 0, overflowX: 'auto' }}>{`<div role="toolbar" aria-label="Text format">
  <button
    type="button"
    aria-label="Bold"
    aria-pressed={isBold}
    onClick={toggleBold}
  >
    <BoldIcon aria-hidden="true" />
  </button>
  <button
    type="button"
    aria-label="Italic"
    aria-pressed={isItalic}
    onClick={toggleItalic}
  >
    <ItalicIcon aria-hidden="true" />
  </button>
</div>`}</pre>
            </div>
          </div>
          {/* Single-select markup */}
          <div>
            <H3>Single-select markup</H3>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 18px' }}>
              <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.9, margin: 0, overflowX: 'auto' }}>{`<div
  role="radiogroup"
  aria-label="View mode"
>
  <button
    type="button"
    role="radio"
    aria-label="Grid view"
    aria-checked={view === 'grid'}
    onClick={() => setView('grid')}
  >
    <GridIcon aria-hidden="true" />
  </button>
  <button
    type="button"
    role="radio"
    aria-label="List view"
    aria-checked={view === 'list'}
    onClick={() => setView('list')}
  >
    <ListIcon aria-hidden="true" />
  </button>
</div>`}</pre>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {[
            { attr: 'aria-pressed',  note: 'Multi-select — "true" when active, "false" when inactive. Updated on every state change.' },
            { attr: 'aria-checked',  note: 'Single-select — used with role="radio". "true" for the active item in the group.' },
            { attr: 'aria-label',    note: 'Required. Describe the feature being toggled, not the state itself.' },
            { attr: 'aria-disabled', note: 'Use instead of the disabled HTML attribute when the button must remain focusable.' },
          ].map(row => (
            <div key={row.attr} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 6, fontSize: 13, alignItems: 'start' }}>
              <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--brand-600)', marginTop: 1 }}>{row.attr}</code>
              <span style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.note}</span>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Token reference ══════════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>
          All toggle tokens reference semantic aliases. Switch theme above to inspect resolved values per product.
        </Lead>
        <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: '1px solid var(--stroke-primary)' }}>
          {TOKEN_TABS.map(tab => (
            <button key={tab.key} onClick={() => setTokenTab(tab.key)} style={{
              padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: 'transparent', border: 'none',
              color: tokenTab === tab.key ? 'var(--brand-600)' : 'var(--text-secondary)',
              borderBottom: tokenTab === tab.key ? '2px solid var(--brand-600)' : '2px solid transparent',
              marginBottom: -1, transition: 'color .15s',
            }}>{tab.label}</button>
          ))}
        </div>
        <TokenTable tokens={t} prefix={tokenTab} />

      </div>

      {/* ── TOC sidebar ─────────────────────────────────────────────────────── */}
      <aside style={{ width: 200, flexShrink: 0, position: 'sticky', top: 'calc(var(--topnav-height, 64px) + 32px)', alignSelf: 'flex-start', padding: '48px 24px 0 0' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>On this page</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TOC.map(item => {
            const isActive = activeSection === item.id
            return (
              <a key={item.id} href={`#${item.id}`}
                style={{
                  fontSize: 12,
                  color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: isActive ? 'var(--brand-50)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive ? '2px solid var(--brand-600)' : '2px solid transparent',
                  transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--brand-600)'; e.currentTarget.style.background = 'var(--brand-50)' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' } }}
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
