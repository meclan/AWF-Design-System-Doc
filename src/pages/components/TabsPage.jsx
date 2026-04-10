import React, { useState, useEffect, useRef } from 'react'
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
        <div style={{ padding: '20px 18px', background: 'var(--bg-primary)', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 64 }}>
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
        <div style={{ padding: '20px 18px', background: 'var(--bg-primary)', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 64 }}>
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

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeft({ size = 20, color = '#454f5b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill={color} />
    </svg>
  )
}
function ChevronRight({ size = 20, color = '#454f5b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill={color} />
    </svg>
  )
}

// ─── TabStrip ─────────────────────────────────────────────────────────────────

function TabStrip({
  items = [],
  activeIndex = 0,
  onSelect,
  scrollable = false,
  t = {},
  fullWidth = false,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const scrollRef = useRef(null)

  const textDefault      = t['tabs.text.default']        || '#454f5b'
  const textActive       = t['tabs.text.active']         || '#05606d'
  const textHover        = t['tabs.text.hover']          || '#07a2b6'
  const textDisabled     = t['tabs.text.disabled']       || '#c4cdd5'
  const indicatorColor   = t['tabs.indicator']           || '#07a2b6'
  const indicatorWidth   = t['tabs.indicator-width']     || 3
  const lineColor        = t['tabs.line']                || '#e0e5ea'
  const chevronActive    = t['tabs.chevron-active']      || '#454f5b'
  const chevronDisabled  = t['tabs.chevron-disabled']    || '#c4cdd5'
  const fwDefault        = t['tabs.font-weight.default'] || 300
  const fwActive         = t['tabs.font-weight.active']  || 500

  function getTextColor(i, disabled) {
    if (disabled)       return textDisabled
    if (i === activeIndex) return textActive
    if (i === hoveredIndex) return textHover
    return textDefault
  }
  function getFontWeight(i, disabled) {
    if (disabled) return fwDefault
    if (i === activeIndex) return fwActive
    return fwDefault
  }

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 140, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ position: 'relative', width: fullWidth ? '100%' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {/* Left chevron */}
        {scrollable && (
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll tabs left"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 36, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
          >
            <ChevronLeft size={18} color={chevronActive} />
          </button>
        )}

        {/* Tab list */}
        <div
          ref={scrollRef}
          role="tablist"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 0,
            flex: fullWidth ? 1 : undefined,
            overflowX: scrollable ? 'hidden' : undefined,
            borderBottom: `1px solid ${lineColor}`,
            position: 'relative',
          }}
        >
          {items.map((item, i) => {
            const disabled = item.disabled || false
            const isActive = i === activeIndex
            const color    = getTextColor(i, disabled)
            const fw       = getFontWeight(i, disabled)
            return (
              <button
                key={i}
                role="tab"
                aria-selected={isActive}
                aria-disabled={disabled}
                tabIndex={isActive ? 0 : -1}
                disabled={disabled}
                onClick={() => !disabled && onSelect && onSelect(i)}
                onMouseEnter={() => !disabled && setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  position: 'relative',
                  padding: '0 20px 12px',
                  background: 'none',
                  border: 'none',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: fw,
                  color,
                  whiteSpace: 'nowrap',
                  transition: 'color .15s',
                  outline: 'none',
                  flexShrink: 0,
                  flex: fullWidth ? 1 : undefined,
                }}
              >
                {item.label}
                {/* Active indicator */}
                {isActive && !disabled && (
                  <span style={{
                    position: 'absolute',
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: indicatorWidth,
                    background: indicatorColor,
                    borderRadius: `${indicatorWidth}px ${indicatorWidth}px 0 0`,
                  }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Right chevron */}
        {scrollable && (
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll tabs right"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 36, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
          >
            <ChevronRight size={18} color={chevronActive} />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── TabsLive ────────────────────────────────────────────────────────────────

const ALL_LABELS = ['Overview', 'Administration', 'Credentials', 'Diagrams', 'Settings', 'Permissions', 'Audit log']

function TabsLive({ t }) {
  const [activeIndex,   setActiveIndex]   = useState(0)
  const [tabCount,      setTabCount]      = useState(4)
  const [scrollable,    setScrollable]    = useState(false)
  const [disabledIndex, setDisabledIndex] = useState(null)

  const items = ALL_LABELS.slice(0, tabCount).map((label, i) => ({
    label,
    disabled: i === disabledIndex,
  }))

  const chevronActive = t['tabs.chevron-active'] || '#454f5b'

  return (
    <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
      {/* Live preview */}
      <div style={{ padding: '32px 28px 0', background: 'var(--bg-primary)' }}>
        <TabStrip
          items={items}
          activeIndex={Math.min(activeIndex, items.length - 1)}
          onSelect={setActiveIndex}
          scrollable={scrollable}
          t={t}
          fullWidth
        />
        {/* Panel placeholder */}
        <div style={{ padding: '20px 4px 24px', minHeight: 56 }}>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>
            Content for <strong style={{ color: 'var(--text-secondary)' }}>{items[Math.min(activeIndex, items.length - 1)]?.label}</strong> tab
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start', borderTop: '1px solid var(--stroke-primary)' }}>
        {/* Tab count */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Tabs</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[3, 4, 5, 6, 7].map(n => (
              <button key={n} onClick={() => { setTabCount(n); setDisabledIndex(null) }} style={{
                width: 32, height: 28, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid',
                borderColor: tabCount === n ? chevronActive : 'var(--stroke-primary)',
                background:  tabCount === n ? (t['tabs.text.active'] ? t['tabs.text.active'] + '18' : '#05606d18') : 'var(--bg-primary)',
                color:       tabCount === n ? (t['tabs.text.active'] || '#05606d') : 'var(--text-secondary)',
              }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Scrollable */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Scrollable</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['Off', 'On'].map(v => {
              const on = v === 'On'
              return (
                <button key={v} onClick={() => setScrollable(on)} style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid',
                  borderColor: scrollable === on ? chevronActive : 'var(--stroke-primary)',
                  background:  scrollable === on ? (t['tabs.text.active'] ? t['tabs.text.active'] + '18' : '#05606d18') : 'var(--bg-primary)',
                  color:       scrollable === on ? (t['tabs.text.active'] || '#05606d') : 'var(--text-secondary)',
                }}>{v}</button>
              )
            })}
          </div>
        </div>

        {/* Disabled tab */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Disabled tab</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setDisabledIndex(disabledIndex === null ? 2 : null)} style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid',
              borderColor: disabledIndex !== null ? chevronActive : 'var(--stroke-primary)',
              background:  disabledIndex !== null ? (t['tabs.text.active'] ? t['tabs.text.active'] + '18' : '#05606d18') : 'var(--bg-primary)',
              color:       disabledIndex !== null ? (t['tabs.text.active'] || '#05606d') : 'var(--text-secondary)',
            }}>{disabledIndex !== null ? 'On' : 'Off'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview', label: 'Overview'       },
  { id: 'anatomy',  label: 'Anatomy'        },
  { id: 'states',   label: 'States'         },
  { id: 'options',  label: 'Options'        },
  { id: 'usage',    label: 'Usage rules'    },
  { id: 'usecase',  label: 'Use case'       },
  { id: 'a11y',     label: 'Accessibility'  },
  { id: 'tokens',   label: 'Token reference'},
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TabsPage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

  const t = getComponentTokens(activeTheme)

  const textDefault    = t['tabs.text.default']        || '#454f5b'
  const textActive     = t['tabs.text.active']         || '#05606d'
  const textHover      = t['tabs.text.hover']          || '#07a2b6'
  const textDisabled   = t['tabs.text.disabled']       || '#c4cdd5'
  const indicatorColor = t['tabs.indicator']           || '#07a2b6'
  const indicatorWidth = t['tabs.indicator-width']     || 3
  const lineColor      = t['tabs.line']                || '#e0e5ea'
  const chevronActive  = t['tabs.chevron-active']      || '#454f5b'

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

  // Shorthand static demo
  const Demo = ({ items, activeIndex = 0, scrollable = false }) => (
    <TabStrip items={items} activeIndex={activeIndex} t={t} scrollable={scrollable} />
  )

  const baseItems = [
    { label: 'Overview' },
    { label: 'Administration' },
    { label: 'Settings' },
    { label: 'Reports' },
  ]

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Navigation</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Tabs</h1>
          <Lead>
            A <strong>horizontal navigation strip</strong> that lets users switch between related views within the same context, without leaving the page. Only one tab panel is visible at a time.
          </Lead>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', paddingTop: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>Preview theme:</span>
            {VISIBLE_THEMES.map(th => (
              <button key={th.id} onClick={() => setActiveTheme(th.id)} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '2px solid',
                borderColor: activeTheme === th.id ? th.color : 'var(--stroke-primary)',
                background:  activeTheme === th.id ? th.color + '18' : 'transparent',
                color:       activeTheme === th.id ? th.color : 'var(--text-secondary)',
              }}>{th.label}</button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW ──────────────────────────────────────────────────────── */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <TabsLive t={t} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 10 }}>When to use</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              <li>To organise related content into sections users can switch between</li>
              <li>When content sections are parallel and independent (not sequential)</li>
              <li>For in-page filtering or view switching (e.g. table vs. chart)</li>
              <li>When you have 2 – 6 clearly labelled views</li>
            </ul>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 10 }}>When not to use</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              <li>For multi-step workflows — use a <strong>Stepper</strong> instead</li>
              <li>When comparing content side by side — use a <strong>Segmented control</strong></li>
              <li>When you have more than 6 tabs — use a <strong>Select / dropdown</strong></li>
              <li>For top-level page navigation — use the <strong>Nav bar</strong></li>
            </ul>
          </div>
        </div>

        <Divider />

        {/* ── ANATOMY ───────────────────────────────────────────────────────── */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <P>The tab strip is composed of four distinct elements. The indicator and track together form a clear active/inactive contrast.</P>

        <div style={{ position: 'relative', background: 'var(--bg-secondary)', borderRadius: 12, padding: '48px 24px 56px', marginTop: 8 }}>
          {/* Rendered tab strip */}
          <div style={{ display: 'flex', alignItems: 'flex-end', borderBottom: `1px solid ${lineColor}`, gap: 0, position: 'relative' }}>
            {/* Tab 1 — Active */}
            <div style={{ position: 'relative', padding: '0 24px 14px' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: textActive, whiteSpace: 'nowrap' }}>Overview</span>
              <span style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: indicatorWidth, background: indicatorColor, borderRadius: `${indicatorWidth}px ${indicatorWidth}px 0 0` }} />
            </div>
            {/* Tab 2 — Hover */}
            <div style={{ position: 'relative', padding: '0 24px 14px' }}>
              <span style={{ fontSize: 14, fontWeight: 300, color: textHover, whiteSpace: 'nowrap' }}>Administration</span>
            </div>
            {/* Tab 3 — Default */}
            <div style={{ position: 'relative', padding: '0 24px 14px' }}>
              <span style={{ fontSize: 14, fontWeight: 300, color: textDefault, whiteSpace: 'nowrap' }}>Settings</span>
            </div>
            {/* Tab 4 — Disabled */}
            <div style={{ position: 'relative', padding: '0 24px 14px' }}>
              <span style={{ fontSize: 14, fontWeight: 300, color: textDisabled, whiteSpace: 'nowrap' }}>Permissions</span>
            </div>
          </div>

          {/* Annotations */}
          {/* 1 - Tab item */}
          <div style={{ position: 'absolute', top: 16, left: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#637381', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
          </div>
          {/* 2 - Indicator */}
          <div style={{ position: 'absolute', bottom: 16, left: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#637381', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
          </div>
          {/* 3 - Track */}
          <div style={{ position: 'absolute', bottom: 16, right: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#637381', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>
          {[
            { n: 1, label: 'Tab item', desc: 'Clickable button with label. Text weight and color change per state.' },
            { n: 2, label: 'Indicator', desc: 'A thick bar anchored to the bottom of the active tab. Driven by tabs.indicator token.' },
            { n: 3, label: 'Track', desc: 'Full-width horizontal line below all tabs. Driven by tabs.line token.' },
          ].map(({ n, label, desc }) => (
            <div key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#637381', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{n}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ── STATES ────────────────────────────────────────────────────────── */}
        <SectionAnchor id="states" />
        <H2>States</H2>
        <P>Each tab item transitions smoothly between four visual states. Only one tab is active at a time; the indicator follows it.</P>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 8 }}>
          {[
            {
              label: 'Default',
              color: textDefault,
              fw: 300,
              showIndicator: false,
              desc: 'Resting state. Light font weight, secondary text colour.',
            },
            {
              label: 'Hover',
              color: textHover,
              fw: 300,
              showIndicator: false,
              desc: 'Cursor over an inactive tab. Text shifts to brand colour.',
            },
            {
              label: 'Active',
              color: textActive,
              fw: 500,
              showIndicator: true,
              desc: 'Selected tab. Medium weight, brand-strongest text, indicator underline.',
            },
            {
              label: 'Disabled',
              color: textDisabled,
              fw: 300,
              showIndicator: false,
              desc: 'Unavailable tab. Muted text, pointer-events disabled.',
            },
          ].map(({ label, color, fw, showIndicator, desc }) => (
            <div key={label} style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
              <div style={{ padding: '24px 20px 0', background: 'var(--bg-primary)', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', paddingBottom: 14 }}>
                  <span style={{ fontSize: 14, fontWeight: fw, color, whiteSpace: 'nowrap' }}>{label}</span>
                  {showIndicator && (
                    <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: indicatorWidth, background: indicatorColor, borderRadius: `${indicatorWidth}px ${indicatorWidth}px 0 0` }} />
                  )}
                </div>
              </div>
              <div style={{ borderBottom: `1px solid ${lineColor}`, margin: '0 0 0 0', height: 1 }} />
              <div style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <InfoBox type="info" style={{ marginTop: 20 }}>
          Focus state is not shown above but follows the global focus-ring token. Keyboard users navigate between tabs using <Code>←</Code> / <Code>→</Code> arrow keys (roving tabindex pattern).
        </InfoBox>

        <Divider />

        {/* ── OPTIONS ───────────────────────────────────────────────────────── */}
        <SectionAnchor id="options" />
        <H2>Options</H2>

        <H3>Scrollable</H3>
        <P>
          When the number of tabs exceeds the available horizontal space, enable the scrollable variant. Left and right chevron buttons appear, powered by <Code>tabs.chevron-active</Code> and <Code>tabs.chevron-disabled</Code> tokens.
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
            <div style={{ padding: '24px 20px', background: 'var(--bg-primary)' }}>
              <Demo items={baseItems} activeIndex={0} />
            </div>
            <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-tertiary)' }}>Default — no scroll controls</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
            <div style={{ padding: '24px 20px', background: 'var(--bg-primary)' }}>
              <Demo
                items={[...baseItems, { label: 'Permissions' }, { label: 'Audit log' }]}
                activeIndex={0}
                scrollable
              />
            </div>
            <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-tertiary)' }}>Scrollable — chevron controls appear</div>
          </div>
        </div>

        <H3 style={{ marginTop: 28 }}>Disabled tabs</H3>
        <P>Individual tabs can be disabled to indicate a feature or section that is temporarily unavailable. Disabled tabs are not interactive and do not receive focus.</P>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)', display: 'inline-block', minWidth: 340 }}>
          <div style={{ padding: '24px 24px', background: 'var(--bg-primary)' }}>
            <Demo
              items={[
                { label: 'Overview' },
                { label: 'Settings' },
                { label: 'Permissions', disabled: true },
                { label: 'Reports' },
              ]}
              activeIndex={0}
            />
          </div>
          <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-tertiary)' }}>Third tab is disabled — muted, non-interactive</div>
        </div>

        <Divider />

        {/* ── USAGE ─────────────────────────────────────────────────────────── */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DoBox
            visual={
              <Demo
                items={[{ label: 'Overview' }, { label: 'Settings' }, { label: 'Reports' }]}
                activeIndex={0}
              />
            }
          >
            Keep tab labels concise — ideally 1–2 words. Short labels are easier to scan and prevent wrapping.
          </DoBox>
          <DontBox
            visual={
              <Demo
                items={[{ label: 'Project Overview & Summary' }, { label: 'Administration Panel' }, { label: 'Reports' }]}
                activeIndex={0}
              />
            }
          >
            Don't use long, multi-word labels. They make the tab strip cluttered and hard to scan quickly.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <DoBox
            visual={
              <Demo
                items={[{ label: 'Overview' }, { label: 'Settings' }, { label: 'Reports' }]}
                activeIndex={0}
              />
            }
          >
            Use tabs for parallel, peer-level content that users might want to compare or switch between freely.
          </DoBox>
          <DontBox
            visual={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                <Demo items={[{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }]} activeIndex={0} />
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, textAlign: 'center' }}>Use a Stepper for sequential steps</p>
              </div>
            }
          >
            Don't use tabs for sequential workflows or wizards where the user must complete steps in order.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <DoBox
            visual={
              <Demo
                items={[{ label: 'Overview' }, { label: 'Settings' }, { label: 'Users' }]}
                activeIndex={0}
              />
            }
          >
            Limit tabs to 2–6 items. A small set is scannable at a glance without cognitive overload.
          </DoBox>
          <DontBox
            visual={
              <Demo
                items={[
                  { label: 'Overview' },
                  { label: 'Settings' },
                  { label: 'Users' },
                  { label: 'Reports' },
                  { label: 'Billing' },
                  { label: 'Audit' },
                  { label: 'Integrations' },
                ]}
                activeIndex={0}
                scrollable
              />
            }
          >
            Don't exceed 6–7 tabs. When there are too many, consider a sidebar navigation or a select dropdown instead.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <DoBox>
            Use tabs to switch between different representations of the same dataset (e.g. table view / chart view).
          </DoBox>
          <DontBox>
            Don't nest tabs inside tabs. If you need sub-sections, restructure the page or use an accordion.
          </DontBox>
        </div>

        <Divider />

        {/* ── USE CASE ──────────────────────────────────────────────────────── */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <P>Tabs are commonly used in settings pages, dashboards, and product detail screens to separate thematic sections of the same entity.</P>

        {/* Settings page mockup */}
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-primary)' }}>
          {/* App nav */}
          <div style={{ background: '#1a2332', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 24, height: 48 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '.03em' }}>ARCAD</span>
            <div style={{ display: 'flex', gap: 20, marginLeft: 12 }}>
              {['Dashboard', 'Projects', 'Settings'].map((item, i) => (
                <span key={item} style={{ fontSize: 12, color: i === 2 ? '#fff' : 'rgba(255,255,255,.5)', fontWeight: i === 2 ? 600 : 400, cursor: 'pointer' }}>{item}</span>
              ))}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: indicatorColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700 }}>CM</div>
            </div>
          </div>

          {/* Page header */}
          <div style={{ padding: '24px 28px 0', borderBottom: `1px solid ${lineColor}` }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 6 }}>
              <span style={{ color: textDefault }}>Workspace</span>
              <span style={{ margin: '0 6px' }}>›</span>
              <span style={{ color: textActive, fontWeight: 500 }}>Settings</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>Workspace Settings</h2>
            {/* Tabs strip */}
            <TabStrip
              items={[
                { label: 'General' },
                { label: 'Members' },
                { label: 'Integrations' },
                { label: 'Security' },
                { label: 'Billing' },
              ]}
              activeIndex={2}
              t={t}
              fullWidth
            />
          </div>

          {/* Panel content */}
          <div style={{ padding: '24px 28px' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Integrations</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.65 }}>Connect third-party services to extend the capabilities of your workspace.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { name: 'Confluence', status: 'Connected',    dot: '#02bf2b' },
                { name: 'Jira',       status: 'Connected',    dot: '#02bf2b' },
                { name: 'Slack',      status: 'Not connected',dot: '#c4cdd5' },
              ].map(({ name, status, dot }) => (
                <div key={name} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{status}</span>
                    </div>
                  </div>
                  <button style={{ fontSize: 11, padding: '4px 10px', borderRadius: 5, border: `1px solid ${indicatorColor}`, color: indicatorColor, background: 'transparent', cursor: 'pointer', fontWeight: 500 }}>
                    {status === 'Connected' ? 'Manage' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ── ACCESSIBILITY ─────────────────────────────────────────────────── */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <P>The Tabs component follows the <strong>WAI-ARIA Tabs design pattern</strong> to ensure keyboard operability and screen-reader compatibility.</P>

        <div style={{ borderRadius: 8, border: '1px solid var(--stroke-primary)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', padding: '8px 14px' }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Attribute / Key</span>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Behaviour</span>
          </div>
          {[
            { key: 'role="tablist"',            val: 'Applied to the container wrapping all tab buttons.' },
            { key: 'role="tab"',                val: 'Applied to each individual tab button.' },
            { key: 'role="tabpanel"',           val: 'Applied to each content panel; hidden panels use aria-hidden="true".' },
            { key: 'aria-selected',             val: '"true" on the active tab; "false" on all others.' },
            { key: 'aria-controls',             val: 'Each tab references its panel by ID.' },
            { key: 'aria-labelledby',           val: 'Each panel references its tab by ID.' },
            { key: 'aria-disabled="true"',      val: 'On disabled tabs; they remain in the DOM but are not interactive.' },
            { key: '← / → Arrow keys',         val: 'Move focus between tabs within the tablist (roving tabindex). Tab is activated on focus.' },
            { key: 'Home / End',                val: 'Jump focus to the first or last tab.' },
            { key: 'Tab key',                   val: 'Moves focus into and out of the tablist; only the selected tab is in the page tab order.' },
          ].map(({ key, val }, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '9px 14px', borderBottom: i < 9 ? '1px solid var(--stroke-primary)' : 'none', alignItems: 'start' }}>
              <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{key}</code>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{val}</span>
            </div>
          ))}
        </div>

        <InfoBox type="info" style={{ marginTop: 20 }}>
          Always provide an <Code>aria-label</Code> on the <Code>role="tablist"</Code> container when the purpose isn't clear from surrounding context (e.g., <Code>aria-label="Workspace settings sections"</Code>).
        </InfoBox>

        <Divider />

        {/* ── TOKEN REFERENCE ───────────────────────────────────────────────── */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <P>All visual properties of the Tabs component are driven by design tokens. Switching the preview theme above updates the brand-sensitive tokens in real time.</P>
        <TokenTable tokens={t} prefix="tabs" />

      </div>

      {/* ── TOC sidebar ───────────────────────────────────────────────────── */}
      <div style={{ width: 200, flexShrink: 0, position: 'sticky', top: 80, padding: '48px 24px 48px 0', alignSelf: 'flex-start' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-tertiary)', marginBottom: 12 }}>On this page</div>
        {TOC.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={e => {
              e.preventDefault()
              const el = document.getElementById(item.id)
              const main = document.querySelector('main')
              if (el && main) main.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' })
            }}
            style={{
              display: 'block', padding: '5px 10px', fontSize: 13, borderRadius: 5, textDecoration: 'none', marginBottom: 2,
              color:      activeSection === item.id ? 'var(--brand-600)' : 'var(--text-secondary)',
              background: activeSection === item.id ? 'var(--bg-secondary)' : 'transparent',
              fontWeight: activeSection === item.id ? 600 : 400,
              borderLeft: activeSection === item.id ? `2px solid var(--brand-600)` : '2px solid transparent',
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

    </div>
  )
}
