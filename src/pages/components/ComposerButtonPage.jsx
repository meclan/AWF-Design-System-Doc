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

function IcoChevron({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Static Composer item ─────────────────────────────────────────────────────

function CItem({ label, state = 'default', hasDropdown = false, t }) {
  const isActive = state === 'active'
  const isHover  = state === 'hover'
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 16px',
      borderRadius: t['button.composer.button-radius'] || 6,
      background: isActive ? t['button.composer.bg.active']
                : isHover  ? t['button.composer.bg.hover']
                : 'transparent',
      color: isActive ? t['button.composer.active-text'] : t['button.composer.text'],
      boxShadow: isActive ? '0 1px 4px rgba(0,0,0,.15)' : 'none',
      fontSize: t['button.composer.font-size'] || 14,
      fontWeight: 400,
      userSelect: 'none',
      whiteSpace: 'nowrap',
    }}>
      {label}
      {hasDropdown && <IcoChevron size={10} />}
    </div>
  )
}

function CBar({ items, t }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: t['button.composer.bg.container'],
      borderRadius: t['button.composer.container-radius'] || 8,
      padding: 4,
    }}>
      {items.map((item, i) => <CItem key={i} {...item} t={t} />)}
    </div>
  )
}

// ─── Interactive Composer (module-level for hooks) ────────────────────────────

const LIVE_ITEMS = [
  { id: 'table',    label: 'Table' },
  { id: 'kanban',   label: 'Kanban' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'more',     label: 'More', hasDropdown: true },
]

function ComposerLive({ t }) {
  const [active, setActive] = useState('table')
  const [hov, setHov]       = useState(null)
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: t['button.composer.bg.container'],
      borderRadius: t['button.composer.container-radius'] || 8,
      padding: 4,
    }}>
      {LIVE_ITEMS.map(item => {
        const isActive = active === item.id
        const isHover  = hov === item.id && !isActive
        return (
          <div
            key={item.id}
            onClick={() => !item.hasDropdown && setActive(item.id)}
            onMouseEnter={() => setHov(item.id)}
            onMouseLeave={() => setHov(null)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 16px',
              borderRadius: t['button.composer.button-radius'] || 6,
              background: isActive ? t['button.composer.bg.active']
                        : isHover  ? t['button.composer.bg.hover']
                        : 'transparent',
              color: isActive ? t['button.composer.active-text'] : t['button.composer.text'],
              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,.15)' : 'none',
              fontSize: t['button.composer.font-size'] || 14,
              fontWeight: 400,
              cursor: 'pointer',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              transition: 'background .15s, box-shadow .15s',
            }}
          >
            {item.label}
            {item.hasDropdown && <IcoChevron size={10} />}
          </div>
        )
      })}
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
  { id: 'overview',  label: 'Overview' },
  { id: 'anatomy',   label: 'Anatomy' },
  { id: 'states',    label: 'States' },
  { id: 'sizes',     label: 'Sizes' },
  { id: 'usage',     label: 'Usage rules' },
  { id: 'usecase',   label: 'Use case' },
  { id: 'a11y',      label: 'Accessibility' },
  { id: 'tokens',    label: 'Token reference' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComposerButtonPage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

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

  // Static state examples
  const stateItems = [
    [
      { label: 'Table',    state: 'active' },
      { label: 'Kanban',   state: 'default' },
      { label: 'Calendar', state: 'default' },
    ],
    [
      { label: 'Table',    state: 'default' },
      { label: 'Kanban',   state: 'hover' },
      { label: 'Calendar', state: 'default' },
    ],
    [
      { label: 'Table',    state: 'default' },
      { label: 'Kanban',   state: 'default' },
      { label: 'Calendar', state: 'default' },
    ],
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
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Composer</h1>
          <Lead>
            A compact, pill-shaped tab strip for switching between views or sections within a surface. Items can be default, hovered, active, or carry a dropdown indicator for secondary menus.
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
          The Composer is a compact navigation control that lives inside a page header, toolbar, or panel. It groups a small set of related views — like Table, Kanban, and Calendar — into a single pill-shaped strip. One item is always active; others can be hovered or carry a dropdown arrow for additional options.
        </P>

        {/* When to use / not */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Switching between 2–5 related views on the same page (Table / Kanban / Calendar)',
              'Compact spaces where full-size Tabs would take too much room',
              'Toolbar or header navigation for a data surface or panel',
              'When one option from a small, flat set must always be selected',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'More than 5 options — use a Tabs component or Select dropdown',
              'Primary page-level navigation → use Navbar or Tabs',
              'Binary on/off choice → use a Toggle or Switch',
              'Triggering actions rather than switching views → use Button',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Anatomy ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <Lead>The Composer consists of an outer container pill and a set of item chips inside it. The active item is visually elevated; items with secondary actions carry a chevron indicator.</Lead>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '24px 32px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ paddingTop: 8 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <CBar
                  items={[
                    { label: 'Table',    state: 'active' },
                    { label: 'Kanban',   state: 'default' },
                    { label: 'More',     state: 'default', hasDropdown: true },
                  ]}
                  t={t}
                />
                <div style={{ position: 'absolute', left: -3, top: -3, right: -3, bottom: -3, border: '1.5px dashed #94a3b8', borderRadius: (t['button.composer.container-radius'] || 8) + 3, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.05em', textTransform: 'uppercase' }}>① Container</div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['① Container',  'Outer pill with a subtle filled background. Provides visual grouping and padding around items.'],
                ['② Item chip',  'Individual clickable item. Transparent by default; gains background on hover or active.'],
                ['③ Active bg',  'Elevated chip with brand-tinted fill and a soft drop shadow — marks the selected view.'],
                ['④ Chevron',    'Optional arrow icon on items that open a dropdown or secondary menu on click.'],
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
        <Lead>Each item within the Composer can be in one of three interaction states. Only one item is active at a time.</Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>All item states</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Active · Hover · Default</div>
          </div>
          <div style={{ padding: '24px 28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Active — selected view',   items: stateItems[0] },
              { label: 'Hover — pointer over item', items: stateItems[1] },
              { label: 'Default — resting',         items: stateItems[2] },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic', minWidth: 200, flexShrink: 0 }}>{row.label}</div>
                <CBar items={row.items} t={t} />
              </div>
            ))}
          </div>
        </div>

        <H3>Live demo</H3>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Click to switch active item — hover over any item</span>
          </div>
          <div style={{ padding: '32px', background: 'var(--bg-primary)', display: 'flex', justifyContent: 'center' }}>
            <ComposerLive t={t} />
          </div>
        </div>

        <Divider />

        {/* ══ Sizes ════════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="sizes" />
        <H2>Sizes</H2>
        <Lead>
          The Composer does not have fixed size tokens — sizing is left to the developer with a recommendation to follow the icon button 8-step scale. The item padding and font size are controlled via <Code>button.composer.font-size</Code>.
        </Lead>
        <InfoBox type="info">
          Size tokens for the Composer are not yet defined. Developers should align item height with the surrounding toolbar using the same size scale as icon buttons (XS 24 / SM 32 / MD 40 / LG 48 px). Horizontal padding is fixed at 16 px per item.
        </InfoBox>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '24px 28px', background: 'var(--bg-primary)', display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {[
              { label: 'SM',  py: 2,  px: 12, fs: 12 },
              { label: 'MD ★',py: 4,  px: 16, fs: 14 },
              { label: 'LG',  py: 6,  px: 20, fs: 16 },
            ].map(sz => (
              <div key={sz.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: t['button.composer.bg.container'],
                  borderRadius: t['button.composer.container-radius'] || 8,
                  padding: 4,
                }}>
                  {[
                    { label: 'Option A', active: true  },
                    { label: 'Option B', active: false },
                    { label: 'Option C', active: false },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: `${sz.py}px ${sz.px}px`,
                      borderRadius: t['button.composer.button-radius'] || 6,
                      background: item.active ? t['button.composer.bg.active'] : 'transparent',
                      color: item.active ? t['button.composer.active-text'] : t['button.composer.text'],
                      boxShadow: item.active ? '0 1px 4px rgba(0,0,0,.15)' : 'none',
                      fontSize: sz.fs, fontWeight: 400,
                      whiteSpace: 'nowrap',
                    }}>{item.label}</div>
                  ))}
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600 }}>{sz.label}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Usage rules ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <DoBox
            visual={
              <CBar items={[
                { label: 'Table', state: 'active' },
                { label: 'Kanban', state: 'default' },
                { label: 'Calendar', state: 'default' },
              ]} t={t} />
            }
          >
            Use 2–5 concise, noun-based labels. Keep label length uniform to maintain a balanced strip.
          </DoBox>
          <DontBox
            visual={
              <CBar items={[
                { label: 'My Custom Table Layout', state: 'active' },
                { label: 'List', state: 'default' },
              ]} t={t} />
            }
          >
            Don't use long or inconsistent labels. Each item should be scannable at a glance.
          </DontBox>
        </div>

        <P>
          Always ensure one item is active. An empty (no active selection) Composer state is never valid. If the surface has no current view, default to the first item.
        </P>
        <P>
          Use the dropdown variant only when a single item can expand to reveal closely related sub-options. Don't use it as a catch-all "more actions" menu.
        </P>

        <Divider />

        {/* ══ Use case ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <Lead>A project management panel header using the Composer to switch between data views.</Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          {/* Mock app toolbar */}
          <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--stroke-primary)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Sprint 24 — Tasks</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>48 items · 12 in progress</div>
            </div>
            <ComposerLive t={t} />
          </div>
          {/* Mock content area */}
          <div style={{ padding: '24px 20px', background: 'var(--bg-secondary)', minHeight: 160 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {['Backlog', 'To do', 'In progress', 'Done'].map(col => (
                <div key={col} style={{ background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--stroke-primary)', padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 8 }}>{col}</div>
                  {[1, 2].map(n => (
                    <div key={n} style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: '8px 10px', marginBottom: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                      Task item {n}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ Accessibility ════════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['role="tablist"', 'Add to the Composer container. Each item gets role="tab".'],
            ['aria-selected="true"',  'Set on the active item. Remove or set false on all others.'],
            ['tabindex',              'Active item: tabindex="0". Inactive: tabindex="-1". Arrow keys navigate between items.'],
            ['aria-controls',         'Each tab should reference its corresponding tabpanel via aria-controls="panelId".'],
            ['Keyboard: arrows',      '← / → move focus between items within the strip.'],
            ['Keyboard: Enter/Space', 'Activates the focused item.'],
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
          Composer tokens are prefixed with <Code>button.composer.</Code>. Values shown for the <strong>{theme.label}</strong> theme.
        </P>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Theme:</span>
          {VISIBLE_THEMES.map(th => (
            <button key={th.id} onClick={() => setActiveTheme(th.id)} style={{
              width: 22, height: 22, borderRadius: '50%', border: `3px solid ${activeTheme === th.id ? th.color : 'transparent'}`,
              background: th.color, cursor: 'pointer', outline: 'none', transition: 'border .12s',
            }} title={th.label} />
          ))}
        </div>
        <TokenTable tokens={t} prefix="button.composer" />

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
      </div>

    </div>
  )
}
