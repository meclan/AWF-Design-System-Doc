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
        <div style={{ padding: '20px 18px', background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, minHeight: 80 }}>
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
        <div style={{ padding: '20px 18px', background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, minHeight: 80 }}>
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
        <div style={{ maxHeight: 380, overflowY: 'auto' }}>
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

const ICON_PATHS = {
  chevronLeft:       'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  chevronRight:      'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  chevronDoubleLeft: 'M17.59 18L19 16.59 14.42 12 19 7.41 17.59 6l-6 6zM11 6l-6 6 6 6 1.41-1.41L7.83 12l4.58-4.59z',
  chevronDoubleRight:'M6.41 6L5 7.41 9.58 12 5 16.59 6.41 18l6-6zm6 0l-1.41 1.41L15.17 12l-4.58 4.59L12 18l6-6z',
  expandMore:        'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
}

function MuiSvg({ d, size = 16, color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

// ─── Page number computation ──────────────────────────────────────────────────

function getPages(current, total, siblings = 1, boundaries = 1, truncation = true) {
  if (!truncation || total <= boundaries * 2 + siblings * 2 + 3) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const shown = new Set()
  for (let i = 1; i <= Math.min(boundaries, total); i++) shown.add(i)
  for (let i = Math.max(1, total - boundaries + 1); i <= total; i++) shown.add(i)
  for (let i = Math.max(1, current - siblings); i <= Math.min(total, current + siblings); i++) shown.add(i)

  const sorted = [...shown].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
}

// ─── Pagination config ────────────────────────────────────────────────────────

const VARIANT_CFG = {
  default:    { bg: '#ecf6fa', text: '#637381', label: 'Default'  },
  'in-table': { bg: '#c8e5eb', text: '#454f5b', label: 'In Table' },
  ghost:      { bg: 'transparent', text: '#637381', label: 'Ghost' },
  neutral:    { bg: '#f4f6f8', text: '#637381', label: 'Neutral'  },
}

const BTN = {
  default:  { bg: '#ffffff', text: '#637381', border: '#c4cdd5' },
  hover:    { bg: '#dfe3e8', text: '#454f5b', border: '#c4cdd5' },
  active:   { bg: '#07a2b6', text: '#ffffff', border: 'transparent' },
  disabled: { bg: '#f4f6f8', text: '#c4cdd5', border: 'transparent' },
}

const BTN_SIZE = 36   // px — matches token pagination.page.default-size
const BTN_RADIUS = 10 // px — matches token pagination.page.radius

// ─── PageButton ───────────────────────────────────────────────────────────────

function PageButton({ children, isActive = false, isDisabled = false, onClick, title, minWidth }) {
  const [hovered, setHovered] = useState(false)
  const state = isDisabled ? 'disabled' : isActive ? 'active' : hovered ? 'hover' : 'default'
  const s = BTN[state]
  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={title}
      disabled={isDisabled}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={isDisabled ? 'true' : undefined}
      style={{
        minWidth: minWidth || BTN_SIZE,
        height: BTN_SIZE,
        padding: '0 6px',
        borderRadius: BTN_RADIUS,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.text,
        fontSize: 14,
        fontWeight: isActive ? 500 : 400,
        fontFamily: 'inherit',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 2,
        transition: 'background 100ms, border-color 100ms, color 100ms',
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  )
}

// ─── Ellipsis ─────────────────────────────────────────────────────────────────

function Ellipsis() {
  return (
    <span style={{
      width: BTN_SIZE, height: BTN_SIZE,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, color: '#919eab', flexShrink: 0, letterSpacing: 2,
    }}>
      ···
    </span>
  )
}

// ─── PaginationBar ────────────────────────────────────────────────────────────

function PaginationBar({
  totalItems = 100,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  siblings = 1,
  boundaries = 1,
  truncation = true,
  showResultCount = true,
  showFirstLast = false,
  showPageSizer = true,
  pageSizeOptions = [5, 10, 25, 50],
  onPageSizeChange,
  variant = 'default',
}) {
  const vcfg = VARIANT_CFG[variant] || VARIANT_CFG.default
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const pages = getPages(currentPage, totalPages, siblings, boundaries, truncation)

  const from = (currentPage - 1) * pageSize + 1
  const to   = Math.min(currentPage * pageSize, totalItems)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: vcfg.bg,
      borderRadius: BTN_RADIUS,
      padding: '12px 16px',
      gap: 12,
      flexWrap: 'wrap',
      border: variant === 'ghost' ? '1px dashed var(--stroke-primary)' : 'none',
    }}>
      {/* Left — result count */}
      {showResultCount ? (
        <span style={{ fontSize: 13, color: vcfg.text, whiteSpace: 'nowrap' }}>
          Showing <strong style={{ color: variant === 'in-table' ? '#1c252e' : 'var(--text-primary)' }}>{from}–{to}</strong> of <strong style={{ color: variant === 'in-table' ? '#1c252e' : 'var(--text-primary)' }}>{totalItems}</strong> results
        </span>
      ) : <span />}

      {/* Center — navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* First page */}
        {showFirstLast && (
          <PageButton
            isDisabled={currentPage === 1}
            onClick={() => onPageChange?.(1)}
            title="First page"
          >
            <MuiSvg d={ICON_PATHS.chevronDoubleLeft} size={14} />
          </PageButton>
        )}
        {/* Previous */}
        <PageButton
          isDisabled={currentPage === 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          title="Previous page"
        >
          <MuiSvg d={ICON_PATHS.chevronLeft} size={14} />
        </PageButton>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === '...' ? (
            <Ellipsis key={`dots-${i}`} />
          ) : (
            <PageButton
              key={p}
              isActive={p === currentPage}
              onClick={() => onPageChange?.(p)}
              title={`Page ${p}`}
            >
              {p}
            </PageButton>
          )
        )}

        {/* Next */}
        <PageButton
          isDisabled={currentPage === totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          title="Next page"
        >
          <MuiSvg d={ICON_PATHS.chevronRight} size={14} />
        </PageButton>
        {/* Last page */}
        {showFirstLast && (
          <PageButton
            isDisabled={currentPage === totalPages}
            onClick={() => onPageChange?.(totalPages)}
            title="Last page"
          >
            <MuiSvg d={ICON_PATHS.chevronDoubleRight} size={14} />
          </PageButton>
        )}
      </div>

      {/* Right — page sizer */}
      {showPageSizer ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange?.(Number(e.target.value))}
            style={{
              height: BTN_SIZE,
              padding: '0 28px 0 10px',
              borderRadius: BTN_RADIUS,
              border: `1px solid #c4cdd5`,
              background: '#ffffff',
              color: '#454f5b',
              fontSize: 13,
              fontFamily: 'inherit',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='14' height='14' fill='%23637381'%3E%3Cpath d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              outline: 'none',
            }}
          >
            {pageSizeOptions.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span style={{ fontSize: 13, color: vcfg.text, whiteSpace: 'nowrap' }}>per page</span>
        </div>
      ) : <span />}
    </div>
  )
}

// ─── Live demo ────────────────────────────────────────────────────────────────

function PaginationLive() {
  const [page,          setPage]          = useState(3)
  const [pageSize,      setPageSize]      = useState(10)
  const [variant,       setVariant]       = useState('default')
  const [showCount,     setShowCount]     = useState(true)
  const [showSizer,     setShowSizer]     = useState(true)
  const [showFirstLast, setShowFirstLast] = useState(false)
  const [truncation,    setTruncation]    = useState(true)
  const [siblings,      setSiblings]      = useState(1)
  const [boundaries,    setBoundaries]    = useState(1)
  const totalItems = 247

  function handlePageSizeChange(n) {
    setPageSize(n)
    setPage(1)
  }

  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
      {/* Preview area */}
      <div style={{ padding: '28px 24px', background: 'var(--bg-secondary)', minHeight: 90, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%' }}>
          <PaginationBar
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={page}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            siblings={siblings}
            boundaries={boundaries}
            truncation={truncation}
            showResultCount={showCount}
            showPageSizer={showSizer}
            showFirstLast={showFirstLast}
            variant={variant}
          />
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '16px 20px', background: 'var(--bg-primary)', borderTop: '1px solid var(--stroke-primary)', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Variant */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Variant</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {Object.entries(VARIANT_CFG).map(([v, cfg]) => (
              <button key={v} onClick={() => setVariant(v)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${variant === v ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
                background: variant === v ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: variant === v ? 'var(--brand-600)' : 'var(--text-secondary)',
                fontWeight: variant === v ? 600 : 400,
              }}>{cfg.label}</button>
            ))}
          </div>
        </div>

        {/* Siblings */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Siblings</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3].map(n => (
              <button key={n} onClick={() => setSiblings(n)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${siblings === n ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
                background: siblings === n ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: siblings === n ? 'var(--brand-600)' : 'var(--text-secondary)',
                fontWeight: siblings === n ? 600 : 400,
              }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Options checkboxes */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Options</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['Truncation (ellipsis)', truncation,    setTruncation],
              ['Result count',         showCount,     setShowCount],
              ['Page size selector',   showSizer,     setShowSizer],
              ['First / Last buttons', showFirstLast, setShowFirstLast],
            ].map(([label, val, set]) => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} style={{ cursor: 'pointer' }} />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TOC ──────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',    label: 'Overview'        },
  { id: 'anatomy',     label: 'Anatomy'         },
  { id: 'variants',    label: 'Variants'        },
  { id: 'states',      label: 'States'          },
  { id: 'options',     label: 'Options'         },
  { id: 'usage',       label: 'Usage rules'     },
  { id: 'usecase',     label: 'Use case'        },
  { id: 'a11y',        label: 'Accessibility'   },
  { id: 'tokens',      label: 'Token reference' },
]

const PAGINATION_TOKENS_STATIC = {
  'pagination.container.bg':              '#ecf6fa',
  'pagination.container.bg-in-table':    '#c8e5eb',
  'pagination.container.bg-ghost':       'transparent',
  'pagination.container.bg-neutral':     '#f4f6f8',
  'pagination.container.text':           '#637381',
  'pagination.container.text-inverse':   '#ffffff',
  'pagination.container.radius':         '10px',
  'pagination.container.padding-x':      '16px',
  'pagination.container.padding-y':      '12px',
  'pagination.page.bg.default':          '#ffffff',
  'pagination.page.bg.active':           '#07a2b6',
  'pagination.page.bg.hover':            '#dfe3e8',
  'pagination.page.bg.disabled':         '#f4f6f8',
  'pagination.page.content.default':     '#637381',
  'pagination.page.content.active':      '#ffffff',
  'pagination.page.content.disabled':    '#c4cdd5',
  'pagination.page.stroke.default':      '#c4cdd5',
  'pagination.page.stroke.active':       'transparent',
  'pagination.page.stroke.disabled':     'transparent',
  'pagination.page.stroke.width':        '0.5px',
  'pagination.page.radius':              '10px',
  'pagination.page.default-size':        '36px',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PaginationPage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

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
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Navigation</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Pagination</h1>
          <Lead>
            A <strong>navigation bar for paginated datasets</strong>. Allows users to move between pages of results, control how many items appear per page, and stay oriented within a large collection — without being overwhelmed by it all at once.
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
        <PaginationLive />

        <Divider />

        {/* ══ Overview ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <P>
          Pagination breaks large datasets into manageable pages. Each page shows a fixed number of items and the pagination bar tells the user where they are, how many items exist, and gives them controls to move forward, backward, or jump to a specific page.
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'More than 25 items in a listing, table, or search results',
              'Navigating between sections of a multi-step form or wizard',
              'Inside data tables to control row count per view',
              'When infinite scroll is inappropriate (e.g. structured data)',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              '25 items or fewer — display all without pagination',
              'Continuously loading feeds — use infinite scroll instead',
              'Contextual overlays or modals — keep content compact',
              'When users need to compare items across pages — load all',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Anatomy ═══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <Lead>The pagination bar is a single flex row with three regions: result count, navigation, and page-size selector.</Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          {/* Annotated visual */}
          <div style={{ padding: '32px 24px', background: 'var(--bg-secondary)' }}>
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <PaginationBar
                totalItems={100}
                pageSize={10}
                currentPage={4}
                showFirstLast={false}
                siblings={1}
                boundaries={1}
                truncation={true}
                showResultCount={true}
                showPageSizer={true}
                variant="default"
              />
              {/* Annotation labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingLeft: 4, paddingRight: 80 }}>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#64748b' }}>① Result count</span>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#64748b' }}>② Navigation</span>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#64748b' }}>③ Page sizer</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ padding: '16px 24px', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
              {[
                ['① Result count',    'Required. "Showing X–Y of Z results". Keeps users oriented without needing to count rows. May be hidden on mobile.'],
                ['② Prev / Next',     'Required. Always present. Disabled when on the first or last page. Minimum touch target: 36px.'],
                ['② Page numbers',    'Required. The active page uses the brand background. Inactive pages have a white bg + subtle border.'],
                ['② Ellipsis (···)',  'Optional. Appears when truncation is enabled and pages are collapsed. Non-interactive.'],
                ['② First / Last',    'Optional. Double-chevron buttons jump to pages 1 or N. Shown when the dataset is very large.'],
                ['③ Page size',       'Optional. Native select or styled dropdown. Changes the number of items per page and resets to page 1.'],
              ].map(([name, desc]) => (
                <div key={name} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', minWidth: 100, flexShrink: 0 }}>{name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ Variants ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="variants" />
        <H2>Variants</H2>
        <Lead>Four container variants adapt the pagination bar to different surface contexts.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {[
            {
              variant: 'default',
              title: 'Default',
              desc: 'Light brand-tinted background. The standard variant for standalone pagination bars below search results or listing pages.',
              bg: 'var(--bg-secondary)',
            },
            {
              variant: 'in-table',
              title: 'In Table',
              desc: 'Slightly more saturated brand teal. Use as a table footer directly attached to a data grid, providing visual continuity with the table header.',
              bg: 'var(--bg-secondary)',
            },
            {
              variant: 'neutral',
              title: 'Neutral',
              desc: 'Neutral grey background. Semantic-free — use when the brand color would conflict with a surrounding UI region.',
              bg: 'var(--bg-secondary)',
            },
            {
              variant: 'ghost',
              title: 'Ghost',
              desc: 'Transparent background with a dashed outline (shown here for illustration). The pagination blends into whatever surface it sits on.',
              bg: 'var(--bg-secondary)',
            },
          ].map(row => (
            <div key={row.variant}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                {row.title} <span style={{ fontWeight: 400, color: 'var(--text-tertiary)', marginLeft: 6 }}>{row.desc}</span>
              </div>
              <PaginationBar
                totalItems={85}
                pageSize={10}
                currentPage={3}
                showResultCount={true}
                showPageSizer={true}
                truncation={true}
                siblings={1}
                boundaries={1}
                variant={row.variant}
              />
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ States ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="states" />
        <H2>States</H2>
        <Lead>Each page button moves through six visual states during interaction.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            {
              label: 'Default',
              desc: 'White background, subtle border, secondary text.',
              render: () => (
                <button style={{ width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_RADIUS, border: '1px solid #c4cdd5', background: '#fff', color: '#637381', fontSize: 14, fontFamily: 'inherit', cursor: 'default' }}>5</button>
              ),
            },
            {
              label: 'Hover',
              desc: 'Background shifts to a light grey, text darkens.',
              render: () => (
                <button style={{ width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_RADIUS, border: '1px solid #c4cdd5', background: '#dfe3e8', color: '#454f5b', fontSize: 14, fontFamily: 'inherit', cursor: 'default' }}>5</button>
              ),
            },
            {
              label: 'Active / Selected',
              desc: 'Brand teal background, white text, no border.',
              render: () => (
                <button style={{ width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_RADIUS, border: '1px solid transparent', background: '#07a2b6', color: '#fff', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'default' }}>5</button>
              ),
            },
            {
              label: 'Focus',
              desc: 'Keyboard focus ring (2px offset) around the button. Tab order: first item → sequential → last item.',
              render: () => (
                <button style={{ width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_RADIUS, border: '1px solid #c4cdd5', background: '#fff', color: '#637381', fontSize: 14, fontFamily: 'inherit', cursor: 'default', outline: '2px solid #07a2b6', outlineOffset: 2 }}>5</button>
              ),
            },
            {
              label: 'Disabled',
              desc: 'Applied to Prev when on page 1, Next when on the last page. Muted colors, no pointer events.',
              render: () => (
                <button style={{ width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_RADIUS, border: '1px solid transparent', background: '#f4f6f8', color: '#c4cdd5', fontSize: 14, fontFamily: 'inherit', cursor: 'not-allowed', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MuiSvg d={ICON_PATHS.chevronLeft} size={14} color="#c4cdd5" />
                </button>
              ),
            },
            {
              label: 'Ellipsis',
              desc: 'Non-interactive. Appears between boundary buttons and siblings when pages are truncated.',
              render: () => <Ellipsis />,
            },
          ].map(row => (
            <div key={row.label} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 72 }}>
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
        <Lead>Pagination is highly configurable — show only the parts relevant to your use case.</Lead>

        {/* Truncation */}
        <H3>Truncation (ellipsis)</H3>
        <P>When there are many pages, the bar collapses distant pages into an ellipsis (···), keeping only the boundary pages and the siblings around the active page visible. The number of pages at which truncation kicks in depends on the <Code>siblings</Code> and <Code>boundaries</Code> values.</P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Active page near start', page: 2 },
            { label: 'Active page in middle', page: 12 },
            { label: 'Active page near end',   page: 24 },
          ].map(row => (
            <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'right' }}>{row.label}</span>
              <PaginationBar totalItems={250} pageSize={10} currentPage={row.page} showResultCount={false} showPageSizer={false} truncation={true} siblings={1} boundaries={1} variant="default" />
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'right' }}>Truncation off</span>
            <PaginationBar totalItems={60} pageSize={10} currentPage={3} showResultCount={false} showPageSizer={false} truncation={false} siblings={1} boundaries={1} variant="default" />
          </div>
        </div>

        {/* Siblings */}
        <H3>Siblings</H3>
        <P>Controls how many page buttons appear on each side of the active page. More siblings = more visible context, but more horizontal space.</P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'right' }}>siblings = {s}</span>
              <PaginationBar totalItems={200} pageSize={10} currentPage={10} showResultCount={false} showPageSizer={false} truncation={true} siblings={s} boundaries={1} variant="default" />
            </div>
          ))}
        </div>

        {/* First / Last buttons */}
        <H3>First &amp; Last buttons</H3>
        <P>Add double-chevron buttons to jump to the first or last page. Useful for very large datasets where getting back to page 1 would require many clicks.</P>
        <div style={{ marginBottom: 20 }}>
          <PaginationBar totalItems={500} pageSize={10} currentPage={25} showResultCount={true} showPageSizer={false} showFirstLast={true} truncation={true} siblings={1} boundaries={1} variant="default" />
        </div>

        {/* Page size selector */}
        <H3>Page size selector</H3>
        <P>Lets users choose how many items appear per page. Standard options are 5, 10, 25, 50. Changing the page size always resets to page 1.</P>
        <div style={{ marginBottom: 20 }}>
          <PaginationBar totalItems={247} pageSize={25} currentPage={2} showResultCount={true} showPageSizer={true} truncation={true} siblings={1} boundaries={1} variant="default" />
        </div>

        <Divider />

        {/* ══ Usage ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>
        <Lead>Keep pagination predictable, consistent, and easy to find.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <DoBox
            visual={
              <div style={{ width: '100%' }}>
                <PaginationBar totalItems={120} pageSize={10} currentPage={2} showResultCount={true} showPageSizer={false} truncation={true} siblings={1} boundaries={1} variant="default" />
              </div>
            }
          >
            Show pagination <strong>only when there are more than 25 items</strong>. Fewer items should all be visible at once — adding pagination to small lists creates unnecessary friction.
          </DoBox>
          <DontBox
            visual={
              <div style={{ width: '100%' }}>
                <PaginationBar totalItems={12} pageSize={10} currentPage={1} showResultCount={true} showPageSizer={false} truncation={false} siblings={1} boundaries={1} variant="default" />
              </div>
            }
          >
            Don't use pagination for <strong>fewer than 25 results</strong>. A single-page bar with only 2 items is misleading and makes the UI feel unnecessarily complex.
          </DontBox>
          <DoBox
            visual={
              <div style={{ width: '100%' }}>
                <PaginationBar totalItems={200} pageSize={10} currentPage={5} showResultCount={true} showPageSizer={true} truncation={true} siblings={1} boundaries={1} variant="default" />
              </div>
            }
          >
            Always show the <strong>result count</strong> alongside pagination. "Showing 41–50 of 200 results" gives users the context to decide whether to page forward or refine their search.
          </DoBox>
          <DontBox>
            Don't rely on pagination <strong>alone</strong> to help users find an item. Always pair it with search, sort, or filter controls so users can narrow down results instead of browsing every page.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DoBox>
            <strong>Reset to page 1</strong> whenever the user changes a filter, sort order, or page size. Staying on page 7 of a newly filtered 12-item result is confusing.
          </DoBox>
          <DontBox>
            Don't let the pagination bar <strong>wrap onto multiple lines</strong>. If the viewport is narrow, reduce the number of visible page buttons (fewer siblings) or switch to a compact variant that shows only prev/next and a page indicator.
          </DontBox>
          <DoBox>
            Position pagination <strong>consistently</strong> — always at the bottom of the content it controls, full-width aligned with the content edge. Never float it or place it in a sidebar.
          </DoBox>
          <DontBox>
            Don't use pagination for <strong>infinite-scroll or "load more" patterns</strong>. If the user can't see a total page count, classic pagination loses its value — use progressive loading instead.
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <Lead>Pagination in two common contexts: standalone page results and inline inside a data table.</Lead>

        {/* Search results */}
        <H3>Pagination on a results page</H3>
        <P>Below a search result list, the pagination bar sits full-width, visually separate from the result rows. The result count tells users how deep the dataset is, and the page size selector lets them trade breadth for depth.</P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Directory search results</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>User searched "invoice" — 247 results across 25 pages.</div>
          </div>
          <div style={{ background: 'var(--bg-primary)' }}>
            {[
              { id: 'INV-8821', title: 'Invoice — Acme Corp Q4 2024',    date: '12 Jan 2025', amount: '€ 4 200' },
              { id: 'INV-8820', title: 'Invoice — Stark Ltd November',    date: '08 Jan 2025', amount: '€ 1 750' },
              { id: 'INV-8819', title: 'Credit note — Wayne Enterprises', date: '03 Jan 2025', amount: '€ -320' },
            ].map((row, i) => (
              <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px 100px', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--stroke-primary)', alignItems: 'center' }}>
                <code style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>{row.id}</code>
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{row.title}</span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{row.date}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}>{row.amount}</span>
              </div>
            ))}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--stroke-primary)', textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>… 7 more rows …</div>
            <div style={{ padding: '12px 16px' }}>
              <PaginationBar totalItems={247} pageSize={10} currentPage={3} showResultCount={true} showPageSizer={true} truncation={true} siblings={1} boundaries={1} variant="default" />
            </div>
          </div>
        </div>

        {/* Data table */}
        <H3>Pagination inside a data table</H3>
        <P>When embedded in a table, use the <Code>in-table</Code> variant. The slightly more saturated container connects visually to the table header and signals that the pagination controls this specific table.</P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '10px 16px', background: '#07a2b6', borderBottom: '1px solid rgba(0,0,0,.1)' }}>
            {['Name', 'Role', 'Department', 'Status'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#ffffff' }}>{h}</span>
            ))}
          </div>
          {/* Rows */}
          {[
            { name: 'Marie Dupont',   role: 'Product Manager',  dept: 'Product',     status: 'Active'    },
            { name: 'James Wright',   role: 'Senior Engineer',  dept: 'Engineering', status: 'Active'    },
            { name: 'Yasmine Khalil', role: 'UX Designer',      dept: 'Design',      status: 'On leave'  },
            { name: 'Carlos Mendes',  role: 'Data Analyst',     dept: 'Analytics',   status: 'Active'    },
          ].map((row, i) => (
            <div key={row.name} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '10px 16px', borderBottom: '1px solid var(--stroke-primary)', background: 'var(--bg-primary)', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{row.name}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.role}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.dept}</span>
              <span style={{ fontSize: 12, color: row.status === 'Active' ? '#02bf2b' : '#f6873f' }}>{row.status}</span>
            </div>
          ))}
          {/* Pagination footer */}
          <PaginationBar totalItems={148} pageSize={10} currentPage={2} showResultCount={true} showPageSizer={true} truncation={true} siblings={1} boundaries={1} variant="in-table" />
        </div>

        <Divider />

        {/* ══ Accessibility ═════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <Lead>Pagination must be a fully navigable landmark for keyboard and screen reader users.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            ['<nav aria-label>',       'Wrap the entire pagination component in a <nav> element with aria-label="pagination" so screen readers identify it as a navigation landmark.'],
            ['aria-current="page"',    'Apply aria-current="page" to the active page button. Screen readers announce "page 4, current" instead of just "page 4".'],
            ['aria-label on buttons',  'Each page button must have an accessible label: aria-label="Go to page 4". Prev/Next: aria-label="Go to previous page" / "Go to next page".'],
            ['aria-disabled="true"',   'Use aria-disabled="true" on the Prev button when on page 1, and on Next when on the last page. Keep the element in the DOM (don\'t remove it) to preserve the expected tab order.'],
            ['Keyboard: Tab',          'Tab moves focus sequentially through all enabled pagination buttons. Disabled buttons are skipped (tabindex="-1").'],
            ['Keyboard: Enter / Space','Activates the focused page button — equivalent to clicking it. Both keys must work.'],
            ['Ellipsis',               'The ellipsis (···) is not focusable and carries no interactive role. It needs no aria label.'],
            ['Live region',            'Wrap page content in aria-live="polite" aria-atomic="true" so content changes are announced after navigation, without re-reading the entire page.'],
          ].map(([term, desc]) => (
            <div key={term} style={{ display: 'flex', gap: 16, alignItems: 'baseline', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <code style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--brand-600)', minWidth: 180, flexShrink: 0 }}>{term}</code>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
            </div>
          ))}
        </div>

        <InfoBox type="info">
          Minimum touch target for every button is <strong>36×36px</strong>. On mobile, increase to 44×44px. Never reduce the hit area below this even if the visual size is smaller.
        </InfoBox>

        <Divider />

        {/* ══ Token reference ═══════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>All pagination visual properties map to the <Code>pagination.*</Code> token set.</Lead>
        <TokenTable tokens={PAGINATION_TOKENS_STATIC} prefix="pagination" />

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
