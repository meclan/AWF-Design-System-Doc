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
        <div style={{ padding: '16px 18px', background: '#ffffff', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', minHeight: 64 }}>
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
        <div style={{ padding: '16px 18px', background: '#ffffff', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', minHeight: 64 }}>
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

// ─── Status Badge config ──────────────────────────────────────────────────────

const STATUS_TYPES = {
  success: { bg: '#d9f6df', text: '#02bf2b', dot: '#02bf2b', label: 'Success' },
  warning: { bg: '#feede2', text: '#f6873f', dot: '#f6873f', label: 'Warning' },
  danger:  { bg: '#fee8e2', text: '#f6643f', dot: '#f6643f', label: 'Danger'  },
  info:    { bg: '#f4f6f8', text: '#0190f6', dot: '#0190f6', label: 'Info'    },
}

const SIZE_CONFIG = {
  lg: { fontSize: 13, paddingX: 10, paddingY: 4, dotSize: 7 },
  md: { fontSize: 12, paddingX: 8,  paddingY: 3, dotSize: 6 },
  sm: { fontSize: 11, paddingX: 6,  paddingY: 2, dotSize: 5 },
}

// ─── StatusBadge component ────────────────────────────────────────────────────

function StatusBadge({ type = 'success', size = 'md', showDot = false, label }) {
  const cfg = STATUS_TYPES[type] || STATUS_TYPES.success
  const sz  = SIZE_CONFIG[size]  || SIZE_CONFIG.md
  const text = label !== undefined ? label : cfg.label
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg,
      color: cfg.text,
      borderRadius: 100,
      padding: `${sz.paddingY}px ${sz.paddingX}px`,
      fontSize: sz.fontSize,
      fontWeight: 400,
      lineHeight: 1,
      whiteSpace: 'nowrap',
    }}>
      {showDot && (
        <span style={{
          width: sz.dotSize, height: sz.dotSize,
          borderRadius: '50%',
          background: cfg.dot,
          flexShrink: 0,
        }} />
      )}
      {text}
    </span>
  )
}

// ─── Live preview ─────────────────────────────────────────────────────────────

function StatusBadgeLive() {
  const [type, setType]       = useState('success')
  const [size, setSize]       = useState('md')
  const [showDot, setShowDot] = useState(false)

  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ padding: '32px 24px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>
        <StatusBadge type={type} size={size} showDot={showDot} />
      </div>
      <div style={{ padding: '16px 20px', background: 'var(--bg-primary)', borderTop: '1px solid var(--stroke-primary)', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Type */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Type</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Object.keys(STATUS_TYPES).map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${type === t ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
                background: type === t ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: type === t ? 'var(--brand-600)' : 'var(--text-secondary)',
                fontWeight: type === t ? 600 : 400,
              }}>{t}</button>
            ))}
          </div>
        </div>
        {/* Size */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Size</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['lg', 'md', 'sm'].map(s => (
              <button key={s} onClick={() => setSize(s)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${size === s ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
                background: size === s ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: size === s ? 'var(--brand-600)' : 'var(--text-secondary)',
                fontWeight: size === s ? 600 : 400,
              }}>{s}</button>
            ))}
          </div>
        </div>
        {/* Dot */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Dot indicator</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={showDot} onChange={e => setShowDot(e.target.checked)} style={{ cursor: 'pointer' }} />
            Show dot
          </label>
        </div>
      </div>
    </div>
  )
}

// ─── TOC ──────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',  label: 'Overview'       },
  { id: 'anatomy',   label: 'Anatomy'        },
  { id: 'types',     label: 'Types'          },
  { id: 'sizes',     label: 'Sizes'          },
  { id: 'usage',     label: 'Usage rules'    },
  { id: 'usecase',   label: 'Use case'       },
  { id: 'a11y',      label: 'Accessibility'  },
  { id: 'tokens',    label: 'Token reference'},
]

const BADGE_TOKENS_STATIC = {
  'badge.status.bg.success':   '#d9f6df',
  'badge.status.bg.warning':   '#feede2',
  'badge.status.bg.danger':    '#fee8e2',
  'badge.status.bg.info':      '#f4f6f8',
  'badge.status.text.success': '#02bf2b',
  'badge.status.text.warning': '#f6873f',
  'badge.status.text.danger':  '#f6643f',
  'badge.status.text.info':    '#0190f6',
  'badge.status.radius':       '100px',
  'badge.status.padding-x':    '8px',
  'badge.status.padding-y':    '3px',
  'badge.status.font-size':    '12px',
  'badge.status.font-weight':  '400',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StatusBadgePage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

  const t = getComponentTokens(activeTheme)

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

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Feedback & Status</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Status Badge</h1>
          <Lead>
            A <strong>compact pill-shaped label</strong> used to communicate the semantic state of an entity — active, inactive, pending, or at risk — directly inline with content. Status badges are purely informational and never interactive.
          </Lead>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', paddingTop: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>Preview theme:</span>
            {VISIBLE_THEMES.map(th => (
              <button key={th.id} onClick={() => setActiveTheme(th.id)} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '2px solid',
                borderColor: activeTheme === th.id ? th.color : 'var(--stroke-primary)',
                background:  activeTheme === th.id ? th.color + '18' : 'transparent',
                color:       activeTheme === th.id ? th.color : 'var(--text-secondary)',
                transition: 'all 120ms', fontFamily: 'inherit',
              }}>
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: th.color, marginRight: 5, verticalAlign: 'middle' }} />
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live demo */}
        <StatusBadgeLive />

        <Divider />

        {/* ══ Overview ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <P>
          Status badges surface <strong>semantic state at a glance</strong>. They attach to rows in tables, cards, list items, and page headers to communicate one of four intents: success, warning, danger, or info. Because they are read-only labels, they carry no hover state or click handler.
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Show the current state of a record (order, task, user)',
              'Surface severity in a list or data table row',
              'Label a section or card with its health status',
              'Summarise system or service state in dashboards',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Clickable filters or chips → use Tag instead',
              'Numeric counts or unread indicators → use Counter Badge',
              'Inline validation messages → use an inline error/helper text',
              'Actions the user can trigger → use a Button',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Anatomy ═══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <Lead>A status badge is made of two optional elements inside a pill container.</Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '32px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
            {/* Annotated — dot variant */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <StatusBadge type="success" size="lg" showDot label="Active" />
                <div style={{ position: 'absolute', top: -20, left: -4, fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>① Dot</div>
                <div style={{ position: 'absolute', top: -20, right: -4, fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>② Label</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>with dot</span>
            </div>
            {/* Without dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <StatusBadge type="success" size="lg" label="Active" />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>label only</span>
            </div>
          </div>
          <div style={{ padding: '16px 24px', background: 'var(--bg-primary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
            {[
              ['① Dot',      'Optional 6px colored circle matching the status color. Use when space is limited or extra visual weight is needed.'],
              ['② Label',    'Short text describing the state. Keep to 1–2 words: "Active", "Pending", "At risk", "Resolved".'],
              ['Pill shape', 'Full border-radius (100px) with soft status-tinted background. Never a square.'],
              ['No icon',    'Status badges do not use icons — the color and label carry the full semantic meaning.'],
            ].map(([name, desc]) => (
              <div key={name} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', minWidth: 80, flexShrink: 0 }}>{name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Types ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="types" />
        <H2>Types</H2>
        <Lead>Four semantic types — each with a dedicated background, text color, and dot color.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { type: 'success', label: 'Success', examples: ['Active', 'Resolved', 'Approved', 'Completed'], desc: 'System is healthy, task is done, or action succeeded.' },
            { type: 'warning', label: 'Warning', examples: ['Expiring', 'Pending', 'Review', 'Degraded'],  desc: 'Attention required but not yet critical. Something may need action soon.' },
            { type: 'danger',  label: 'Danger',  examples: ['Error', 'Rejected', 'Blocked', 'Critical'],   desc: 'An error or critical failure state. Requires immediate attention.' },
            { type: 'info',    label: 'Info',    examples: ['Draft', 'Scheduled', 'Inactive', 'Archived'], desc: 'Neutral informational state — no urgency implied.' },
          ].map(row => (
            <div key={row.type} style={{ display: 'grid', gridTemplateColumns: '65px 1fr 1fr', gap: 16, alignItems: 'start', padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <div><StatusBadge type={row.type} size="md" label={row.label} /></div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{row.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{row.desc}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {row.examples.map(ex => (
                  <StatusBadge key={ex} type={row.type} size="sm" label={ex} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dot variant showcase */}
        <H3>With dot indicator</H3>
        <P>Add a dot when you need additional visual emphasis — for instance in a compact table column or a sidebar list where size is constrained.</P>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '20px 24px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(STATUS_TYPES).map(([type, cfg]) => (
            <StatusBadge key={type} type={type} size="md" showDot label={cfg.label} />
          ))}
        </div>

        <Divider />

        {/* ══ Sizes ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="sizes" />
        <H2>Sizes</H2>
        <Lead>Three sizes adapt to their context — dense tables, standard content, or prominent headers.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { size: 'lg', label: 'Large',  desc: '13px · padding 4px 10px — use in cards, page headers, and prominent status displays.' },
            { size: 'md', label: 'Medium', desc: '12px · padding 3px 8px — default. Use in most contexts: tables, lists, detail panels.' },
            { size: 'sm', label: 'Small',  desc: '11px · padding 2px 6px — use when space is tight, e.g. a tag inside a compact chip group.' },
          ].map(row => (
            <div key={row.size} style={{ display: 'grid', gridTemplateColumns: '100px 70px 1fr', gap: 16, alignItems: 'center', padding: '14px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</div>
              <div><StatusBadge type="success" size={row.size} /></div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{row.desc}</div>
            </div>
          ))}
        </div>

        {/* Size comparison all types */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '20px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 14 }}>All sizes × all types</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['lg', 'md', 'sm'].map(size => (
              <div key={size} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', width: 24, textAlign: 'right', flexShrink: 0 }}>{size}</span>
                {Object.entries(STATUS_TYPES).map(([type, cfg]) => (
                  <StatusBadge key={type} type={type} size={size} label={cfg.label} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Usage ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>
        <Lead>Follow these rules to keep status badges clear and consistent.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <DoBox
            visual={
              <div style={{ display: 'flex', gap: 8 }}>
                <StatusBadge type="success" label="Active" />
                <StatusBadge type="warning" label="Expiring" />
                <StatusBadge type="danger"  label="Error" />
              </div>
            }
          >
            Use <strong>1–2 word labels</strong> in noun or adjective form: "Active", "Pending review", "Resolved". Keep them consistent across the same entity type.
          </DoBox>
          <DontBox
            visual={
              <StatusBadge type="success" label="The record was successfully processed" />
            }
          >
            Do not put <strong>full sentences</strong> inside a badge. Truncation will occur and the pill shape breaks down visually.
          </DontBox>
          <DoBox
            visual={
              <div style={{ display: 'flex', gap: 8 }}>
                <StatusBadge type="success" label="Active" />
                <StatusBadge type="warning" label="Pending" />
              </div>
            }
          >
            Pick the <strong>most accurate type</strong>. "Pending" is a warning state, not info — it implies action is needed.
          </DoBox>
          <DontBox
            visual={
              <div style={{ display: 'flex', gap: 8 }}>
                <StatusBadge type="info" label="Pending" />
                <StatusBadge type="info" label="Error" />
                <StatusBadge type="info" label="Active" />
              </div>
            }
          >
            Do not use <strong>info for all states</strong>. Treating every status as neutral removes the value of semantic color coding.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DoBox>
            Place the badge <strong>adjacent to the entity label</strong> — in a table cell, next to a name, or in a card footer. Align vertically center with surrounding text.
          </DoBox>
          <DontBox>
            Do not stack <strong>multiple badges</strong> of the same type on a single item. If a record has more than one status, consider a more structured data pattern.
          </DontBox>
          <DoBox>
            Use the <strong>dot variant</strong> in compact layouts (dense tables, sidebar lists) where the pill adds too much visual mass.
          </DoBox>
          <DontBox>
            Never make a status badge <strong>interactive</strong> (clickable, focusable). Use a Tag if you need a removable or selectable chip.
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <Lead>Status badges shine in data-dense surfaces where state must be communicated instantly without words.</Lead>

        {/* Data table mockup */}
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Orders — data table</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Status badge in a table row next to each record.</div>
          </div>
          <div style={{ background: 'var(--bg-primary)' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '8px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              {['Order', 'Customer', 'Amount', 'Status'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>{h}</span>
              ))}
            </div>
            {[
              { id: '#8821', customer: 'Acme Corp',    amount: '€ 4 200', type: 'success', status: 'Delivered' },
              { id: '#8820', customer: 'Stark Ltd',    amount: '€ 1 750', type: 'warning', status: 'Pending'   },
              { id: '#8819', customer: 'Wayne Ent.',   amount: '€ 9 300', type: 'danger',  status: 'Failed'    },
              { id: '#8818', customer: 'Initech Inc.', amount: '€ 560',   type: 'info',    status: 'Draft'     },
            ].map((row, i) => (
              <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 16px', borderBottom: i < 3 ? '1px solid var(--stroke-primary)' : 'none', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{row.id}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.customer}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{row.amount}</span>
                <div><StatusBadge type={row.type} size="sm" label={row.status} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Card grid mockup */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { name: 'Production API',  uptime: '99.98%', type: 'success', status: 'Operational' },
            { name: 'Staging API',     uptime: '99.12%', type: 'warning', status: 'Degraded'    },
            { name: 'Analytics Jobs',  uptime: '100%',   type: 'success', status: 'Operational' },
            { name: 'Email Service',   uptime: '0%',     type: 'danger',  status: 'Outage'      },
          ].map(card => (
            <div key={card.name} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{card.name}</span>
                <StatusBadge type={card.type} size="sm" showDot label={card.status} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Uptime: <strong style={{ color: 'var(--text-secondary)' }}>{card.uptime}</strong></div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Accessibility ═════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <Lead>Status badges must convey state through more than color alone.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            ['Text label',          'Never rely on color alone. The label text must identify the state independently of the badge color.'],
            ['role="status"',       'Wrap a live-updating badge in a region with role="status" and aria-live="polite" so screen readers announce changes.'],
            ['Contrast ratio',      'Status badge text against its background must meet at least 4.5:1 (WCAG AA). All four semantic colors are pre-validated.'],
            ['aria-label on dot',   'If you render a dot without a visible label, add an aria-label or aria-description on the parent element to describe the state.'],
            ['Keyboard',            'Status badges are not interactive. They must not receive focus and must not have tab-index or click handlers.'],
          ].map(([term, desc]) => (
            <div key={term} style={{ display: 'flex', gap: 16, alignItems: 'baseline', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <code style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--brand-600)', minWidth: 160, flexShrink: 0 }}>{term}</code>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
            </div>
          ))}
        </div>

        <InfoBox type="warning">
          Never use a status badge as the <em>only</em> indicator for a critical state. Always pair it with a label that makes the meaning legible in plain text (e.g., "Error", not just a red dot).
        </InfoBox>

        <Divider />

        {/* ══ Token reference ═══════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>All status badge visual properties map to the <Code>badge.status.*</Code> token set.</Lead>
        <TokenTable tokens={BADGE_TOKENS_STATIC} prefix="badge" />

      </div>

      {/* ── TOC (right sidebar) ──────────────────────────────────────────────── */}
      <div style={{
        width: 200, flexShrink: 0, position: 'sticky', top: 80,
        padding: '48px 0 48px 0', alignSelf: 'flex-start',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8, paddingLeft: 12 }}>On this page</div>
        {TOC.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
              display: 'block', padding: '4px 12px', borderRadius: 4,
              fontSize: 13, textDecoration: 'none', lineHeight: 1.5,
              color: activeSection === item.id ? 'var(--brand-600)' : 'var(--text-secondary)',
              fontWeight: activeSection === item.id ? 600 : 400,
              background: activeSection === item.id ? 'var(--brand-50)' : 'transparent',
              borderLeft: activeSection === item.id ? '2px solid var(--brand-600)' : '2px solid transparent',
              transition: 'all 120ms',
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

    </div>
  )
}
