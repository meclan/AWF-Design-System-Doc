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

// ─── SVG Icons ────────────────────────────────────────────────────────────────

// Small right chevron (separator)
function ChevronRight({ size = 7, color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  )
}

// Home icon (MUI HomeRounded)
function HomeIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  )
}

// Slash separator (alternative)
function SlashSep({ color = 'currentColor' }) {
  return (
    <span style={{ fontSize: 12, color, lineHeight: 1, flexShrink: 0, opacity: 0.5, margin: '0 2px' }}>/</span>
  )
}

// ─── Breadcrumb component ─────────────────────────────────────────────────────

function Breadcrumbs({
  items = [],
  t = {},
  showHomeIcon = false,
  separator = 'chevron',
  maxItems = 0,
}) {
  const [expanded, setExpanded] = useState(false)

  const textDefault  = t['breadcrumb.text.default']  || '#919eab'
  const textHover    = t['breadcrumb.text.hover']     || '#454f5b'
  const textActive   = t['breadcrumb.text.active']    || '#454f5b'
  const textDisabled = t['breadcrumb.text.disabled']  || '#c4cdd5'
  const sepColor     = t['breadcrumb.separator']      || '#919eab'
  const fsDefault    = 12
  const fsActive     = 14
  const fwDefault    = 400
  const fwActive     = 500
  const gap          = 8

  // Collapse logic
  let visible = items
  let collapsed = false
  if (maxItems > 0 && items.length > maxItems && !expanded) {
    const first = items.slice(0, 1)
    const last  = items.slice(-(maxItems - 1))
    visible = [...first, { label: '···', ellipsis: true }, ...last]
    collapsed = true
  }

  const Separator = () => separator === 'slash'
    ? <SlashSep color={sepColor} />
    : <ChevronRight size={7} color={sepColor} />

  return (
    <nav aria-label="breadcrumb">
      <ol style={{ display: 'flex', alignItems: 'center', gap, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
        {showHomeIcon && (
          <>
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <a href="#" aria-label="Home" onClick={e => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', color: textDefault, textDecoration: 'none' }}>
                <HomeIcon size={14} color={textDefault} />
              </a>
            </li>
            <li aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}><Separator /></li>
          </>
        )}

        {visible.map((item, i) => {
          const isLast     = i === visible.length - 1
          const isActive   = isLast && !item.ellipsis
          const isEllipsis = !!item.ellipsis

          return (
            <React.Fragment key={i}>
              <li style={{ display: 'flex', alignItems: 'center' }}>
                {isEllipsis ? (
                  <button
                    onClick={() => setExpanded(true)}
                    aria-label="Show full path"
                    style={{
                      background: 'none', border: 'none', padding: '0 2px', cursor: 'pointer', fontFamily: 'inherit',
                      fontSize: fsDefault, color: textDefault, lineHeight: 1,
                    }}
                  >
                    ···
                  </button>
                ) : isActive ? (
                  <span
                    aria-current="page"
                    style={{
                      fontSize: fsActive, fontWeight: fwActive,
                      color: item.disabled ? textDisabled : textActive,
                      lineHeight: 1,
                    }}
                  >
                    {item.label}
                  </span>
                ) : (
                  <BreadcrumbItem
                    label={item.label}
                    disabled={item.disabled}
                    textDefault={textDefault}
                    textHover={textHover}
                    textDisabled={textDisabled}
                    fsDefault={fsDefault}
                    fwDefault={fwDefault}
                  />
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}><Separator /></li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

function BreadcrumbItem({ label, disabled, textDefault, textHover, textDisabled, fsDefault, fwDefault }) {
  const [hovered, setHovered] = useState(false)
  const color = disabled ? textDisabled : hovered ? textHover : textDefault
  return (
    <a
      href="#"
      onClick={e => e.preventDefault()}
      aria-disabled={disabled ? 'true' : undefined}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: fsDefault, fontWeight: fwDefault, color,
        textDecoration: hovered && !disabled ? 'underline' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        lineHeight: 1, transition: 'color 100ms',
        pointerEvents: disabled ? 'none' : undefined,
      }}
    >
      {label}
    </a>
  )
}

// ─── Live demo ────────────────────────────────────────────────────────────────

function BreadcrumbsLive({ t }) {
  const [itemCount,    setItemCount]    = useState(4)
  const [showHome,     setShowHome]     = useState(false)
  const [separator,    setSeparator]    = useState('chevron')
  const [maxItems,     setMaxItems]     = useState(0)

  const ALL_ITEMS = [
    { label: 'Settings' },
    { label: 'Organization' },
    { label: 'User management' },
    { label: 'Roles' },
    { label: 'Permissions Profiles' },
  ]

  const items = ALL_ITEMS.slice(0, itemCount)

  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
      {/* Preview */}
      <div style={{ padding: '32px 28px', background: 'var(--bg-secondary)', minHeight: 80, display: 'flex', alignItems: 'center' }}>
        <Breadcrumbs items={items} t={t} showHomeIcon={showHome} separator={separator} maxItems={maxItems} />
      </div>

      {/* Controls */}
      <div style={{ padding: '16px 20px', background: 'var(--bg-primary)', borderTop: '1px solid var(--stroke-primary)', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Items */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Items</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setItemCount(n)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${itemCount === n ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
                background: itemCount === n ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: itemCount === n ? 'var(--brand-600)' : 'var(--text-secondary)',
                fontWeight: itemCount === n ? 600 : 400,
              }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Separator</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['chevron', 'slash'].map(s => (
              <button key={s} onClick={() => setSeparator(s)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${separator === s ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
                background: separator === s ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: separator === s ? 'var(--brand-600)' : 'var(--text-secondary)',
                fontWeight: separator === s ? 600 : 400,
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Collapse */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Collapse (max items)</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[{ label: 'Off', v: 0 }, { label: '3', v: 3 }, { label: '2', v: 2 }].map(({ label, v }) => (
              <button key={v} onClick={() => setMaxItems(v)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${maxItems === v ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
                background: maxItems === v ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: maxItems === v ? 'var(--brand-600)' : 'var(--text-secondary)',
                fontWeight: maxItems === v ? 600 : 400,
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Options</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={showHome} onChange={e => setShowHome(e.target.checked)} style={{ cursor: 'pointer' }} />
            Home icon
          </label>
        </div>
      </div>
    </div>
  )
}

// ─── TOC ──────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',   label: 'Overview'        },
  { id: 'anatomy',    label: 'Anatomy'         },
  { id: 'states',     label: 'States'          },
  { id: 'options',    label: 'Options'         },
  { id: 'usage',      label: 'Usage rules'     },
  { id: 'usecase',    label: 'Use case'        },
  { id: 'a11y',       label: 'Accessibility'   },
  { id: 'tokens',     label: 'Token reference' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BreadcrumbsPage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

  const t = getComponentTokens(activeTheme)

  // Resolved token values (for inline use)
  const textDefault  = t['breadcrumb.text.default']  || '#919eab'
  const textHover    = t['breadcrumb.text.hover']     || '#454f5b'
  const textActive   = t['breadcrumb.text.active']    || '#454f5b'
  const textDisabled = t['breadcrumb.text.disabled']  || '#c4cdd5'
  const sepColor     = t['breadcrumb.separator']      || '#919eab'

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

  // Shorthand for a static breadcrumb demo
  const Demo = ({ items, separator = 'chevron', maxItems = 0, showHomeIcon = false }) => (
    <Breadcrumbs items={items} t={t} separator={separator} maxItems={maxItems} showHomeIcon={showHomeIcon} />
  )

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Navigation</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Breadcrumbs</h1>
          <Lead>
            A <strong>secondary navigation trail</strong> that shows the user's location within the application hierarchy. Each crumb is a link to a parent level — the last item is the current page and is not a link.
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
        <BreadcrumbsLive t={t} />

        <Divider />

        {/* ══ Overview ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <P>
          Breadcrumbs reveal the user's exact location in a hierarchical structure and provide one-click access to any parent level. They act as a secondary navigation aid — never the primary way to move through an app — and are always placed at the top of a page, below the top navigation bar.
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Hierarchical structures with 2+ levels of depth',
              'Apps where users frequently navigate back to parent pages',
              'Pages that can be reached from multiple entry points',
              'Admin panels, settings pages, file systems, catalogues',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Single-level apps — there are no parent pages to link to',
              'Wizards or flows — use a stepper instead',
              'Mobile viewports narrower than 360px — collapse or omit',
              'When the top nav already makes context obvious',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Anatomy ═══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <Lead>A breadcrumb trail is a flat row of links separated by visual dividers, ending with the current page label.</Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '40px 32px', background: 'var(--bg-secondary)' }}>
            {/* Annotated demo */}
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {/* ① Link item */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <span style={{ fontSize: 12, color: textDefault, textDecoration: 'underline', cursor: 'pointer' }}>Settings</span>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap', letterSpacing: '.06em' }}>① Link item</span>
              </div>
              {/* Sep */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingBottom: 22 }}>
                <ChevronRight size={7} color={sepColor} />
              </div>
              {/* ② Link item */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <span style={{ fontSize: 12, color: textDefault, textDecoration: 'underline', cursor: 'pointer' }}>User management</span>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap', letterSpacing: '.06em' }}>② Separator</span>
              </div>
              {/* Sep */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingBottom: 22 }}>
                <ChevronRight size={7} color={sepColor} />
              </div>
              {/* ③ Active item */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: textActive }}>Permissions Profiles</span>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap', letterSpacing: '.06em' }}>③ Current page</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 24px', background: 'var(--bg-primary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
            {[
              ['① Link item',     '12px · Regular · subtle text. Clickable — navigates to that level. Underlines on hover. Each item is an <a> inside a <li>.'],
              ['② Separator',     'Small right chevron (7px) or slash. Non-interactive. Colour matches the default link text to keep visual weight low.'],
              ['③ Current page',  '14px · Medium · secondary text. Not a link — represents where the user is now. Marked with aria-current="page".'],
              ['<nav> wrapper',   'The entire trail is inside a <nav aria-label="breadcrumb"> containing an <ol> list, making it discoverable by screen readers.'],
            ].map(([name, desc]) => (
              <div key={name} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', minWidth: 110, flexShrink: 0 }}>{name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ States ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="states" />
        <H2>States</H2>
        <Lead>Individual breadcrumb items have four visual states.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            {
              label: 'Default',
              desc: '12px · Regular. Subtle text color — visually quieter than the current page.',
              render: () => (
                <span style={{ fontSize: 12, color: textDefault, fontWeight: 400, lineHeight: 1 }}>Settings</span>
              ),
            },
            {
              label: 'Hover',
              desc: 'Text color shifts to secondary. Underline appears. Cursor changes to pointer.',
              render: () => (
                <span style={{ fontSize: 12, color: textHover, fontWeight: 400, textDecoration: 'underline', lineHeight: 1, cursor: 'pointer' }}>Settings</span>
              ),
            },
            {
              label: 'Active (current)',
              desc: '14px · Medium · secondary text. Not a link. Always the last item.',
              render: () => (
                <span style={{ fontSize: 14, color: textActive, fontWeight: 500, lineHeight: 1 }}>Permissions Profiles</span>
              ),
            },
            {
              label: 'Disabled',
              desc: 'Muted text. No hover or pointer events. Rare — only for temporarily unavailable levels.',
              render: () => (
                <span style={{ fontSize: 12, color: textDisabled, fontWeight: 400, lineHeight: 1, cursor: 'not-allowed' }}>Settings</span>
              ),
            },
          ].map(row => (
            <div key={row.label} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '24px 16px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 72 }}>
                {row.render()}
              </div>
              <div style={{ padding: '10px 14px', background: 'var(--bg-primary)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{row.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{row.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Options ═══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="options" />
        <H2>Options</H2>
        <Lead>Breadcrumbs can be configured to suit different navigational contexts.</Lead>

        {/* Separator */}
        <H3>Separator style</H3>
        <P>The default separator is a small right chevron (<Code>›</Code>). A forward slash (<Code>/</Code>) is an alternative for more technical interfaces.</P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Chevron (default)', sep: 'chevron' },
            { label: 'Slash',             sep: 'slash'   },
          ].map(row => (
            <div key={row.sep} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'center', padding: '14px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{row.label}</span>
              <Demo items={[{ label: 'Settings' }, { label: 'User management' }, { label: 'Permissions Profiles' }]} separator={row.sep} />
            </div>
          ))}
        </div>

        {/* Home icon */}
        <H3>Home icon</H3>
        <P>Optionally replace the first text crumb with a house icon to save horizontal space and reinforce the "root" concept visually.</P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'center', padding: '14px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>Without home icon</span>
            <Demo items={[{ label: 'Settings' }, { label: 'User management' }, { label: 'Permissions Profiles' }]} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'center', padding: '14px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>With home icon</span>
            <Demo items={[{ label: 'User management' }, { label: 'Permissions Profiles' }]} showHomeIcon />
          </div>
        </div>

        {/* Collapse */}
        <H3>Collapsing long trails</H3>
        <P>When the hierarchy is very deep, set a <Code>maxItems</Code> limit. Middle items collapse into a <Code>···</Code> button. Clicking it expands the full trail.</P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Full trail (5 items)',    maxItems: 0 },
            { label: 'Collapsed (max 3)',        maxItems: 3 },
            { label: 'Collapsed (max 2)',        maxItems: 2 },
          ].map(row => (
            <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, alignItems: 'center', padding: '14px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{row.label}</span>
              <Demo items={[
                { label: 'Settings' },
                { label: 'Organization' },
                { label: 'User management' },
                { label: 'Roles' },
                { label: 'Permissions Profiles' },
              ]} maxItems={row.maxItems} />
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Usage rules ═══════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>
        <Lead>Keep breadcrumbs short, consistent, and always oriented toward the hierarchy — not the user's click history.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <DoBox
            visual={
              <Demo items={[{ label: 'Settings' }, { label: 'User management' }, { label: 'Permissions Profiles' }]} />
            }
          >
            Reflect the <strong>site hierarchy</strong>, not the browser history. "Settings › User management › Permissions Profiles" matches the app structure regardless of how the user arrived.
          </DoBox>
          <DontBox
            visual={
              <Demo items={[{ label: 'Dashboard' }, { label: 'Settings' }, { label: 'Permissions Profiles' }]} />
            }
          >
            Do not mirror the <strong>navigation history</strong>. If the user arrived from Dashboard before entering Settings, the breadcrumb still shows the structural path — not the click sequence.
          </DontBox>

          <DoBox
            visual={
              <Demo items={[{ label: 'Settings' }, { label: 'Permissions Profiles' }]} />
            }
          >
            The <strong>current page</strong> is always the last item and is not a link. It tells users where they are without asking them to click.
          </DoBox>
          <DontBox
            visual={
              <Demo items={[{ label: 'Settings' }]} />
            }
          >
            Don't use a breadcrumb when there is <strong>only one level</strong>. A single-item trail adds no navigational value and clutters the header.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DoBox>
            Place breadcrumbs <strong>consistently</strong> — always directly below the global navigation bar and above the page title. Never inside a card, modal, or sidebar.
          </DoBox>
          <DontBox>
            Do not use breadcrumbs as the <strong>primary navigation</strong>. They are a wayfinding aid. The main nav, back button, and sidebar are the primary means of moving through the app.
          </DontBox>
          <DoBox>
            Keep crumb labels <strong>short and exact</strong> — use the page title as the label. "User management" is better than "Manage users and their access". Truncate with an ellipsis if a label exceeds ~24 characters.
          </DoBox>
          <DontBox>
            Avoid more than <strong>5 levels</strong> without collapsing. A trail that wraps to a second line breaks the layout and makes the hierarchy feel unmanageable.
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <Lead>Breadcrumbs in a typical admin settings page header.</Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          {/* Top nav bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: '#1c252e', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', letterSpacing: '.02em' }}>ARCAD</span>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Dashboard', 'Projects', 'Settings', 'Reports'].map(item => (
                <span key={item} style={{ fontSize: 12, color: item === 'Settings' ? '#ffffff' : '#919eab', fontWeight: item === 'Settings' ? 600 : 400, cursor: 'pointer' }}>{item}</span>
              ))}
            </div>
            <div style={{ width: 28, height: 28, borderRadius: 999, background: '#07a2b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>JD</span>
            </div>
          </div>

          {/* Page header area with breadcrumb */}
          <div style={{ padding: '16px 24px 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
            <div style={{ marginBottom: 10 }}>
              <Demo items={[{ label: 'Settings' }, { label: 'User management' }, { label: 'Permissions Profiles' }]} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Permissions Profiles</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 16px' }}>Manage role-based access profiles and assign them to users across your organization.</p>
            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--stroke-primary)', marginLeft: -24, marginRight: -24, paddingLeft: 24 }}>
              {['Profiles', 'Permissions', 'Audit log'].map((tab, i) => (
                <div key={tab} style={{
                  padding: '10px 16px', fontSize: 13, cursor: 'pointer',
                  color: i === 0 ? 'var(--brand-600)' : 'var(--text-secondary)',
                  fontWeight: i === 0 ? 600 : 400,
                  borderBottom: i === 0 ? '2px solid var(--brand-600)' : '2px solid transparent',
                  marginBottom: -1,
                }}>
                  {tab}
                </div>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div style={{ padding: '16px 24px', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { name: 'Super Admin',   users: 3,  perms: 'Full access'        },
                { name: 'Manager',       users: 12, perms: 'Read + Write'       },
                { name: 'Viewer',        users: 47, perms: 'Read only'          },
              ].map(row => (
                <div key={row.name} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px', background: 'var(--bg-secondary)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{row.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{row.perms}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{row.users} users assigned</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ Accessibility ═════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <Lead>Breadcrumbs must be identifiable as a navigation landmark and each item must be reachable by keyboard.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            ['<nav aria-label>',      'Wrap the breadcrumb in <nav aria-label="breadcrumb">. Screen readers announce it as a distinct navigation landmark, separate from the main nav.'],
            ['<ol> list',             'Use an ordered list (<ol>) to convey the sequential, hierarchical nature of the trail. Each crumb is a <li>.'],
            ['aria-current="page"',   'Apply aria-current="page" to the last item (the current page span). Screen readers announce "page 3 of 3, current" or similar.'],
            ['No link on last item',  'The current page must NOT be a link. Using a <span> instead of <a> prevents users from "clicking on where they already are".'],
            ['aria-label on icon',    'If a home icon replaces the first text crumb, give its <a> an aria-label="Home" so screen readers read it correctly.'],
            ['Keyboard: Tab',         'Each link must be reachable by Tab. Separators (chevrons) are aria-hidden and not focusable.'],
            ['Collapsed state',       'The "···" expand button must have aria-label="Show full breadcrumb path" and be keyboard-activatable with Enter/Space.'],
          ].map(([term, desc]) => (
            <div key={term} style={{ display: 'flex', gap: 16, alignItems: 'baseline', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <code style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--brand-600)', minWidth: 160, flexShrink: 0 }}>{term}</code>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
            </div>
          ))}
        </div>

        <InfoBox type="info">
          Breadcrumbs are supplemental navigation — they must never be the only way to reach a parent page. Always ensure the main navigation and browser back button work independently.
        </InfoBox>

        <Divider />

        {/* ══ Token reference ═══════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>All breadcrumb visual properties map to the <Code>breadcrumb.*</Code> token set.</Lead>
        <TokenTable tokens={t} prefix="breadcrumb" />

      </div>

      {/* ── TOC sidebar ──────────────────────────────────────────────────────── */}
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
