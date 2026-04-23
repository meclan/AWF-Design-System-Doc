import React, { useState, useEffect, useRef } from 'react'
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
      {visual && <div style={{ padding: '20px 18px', background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '20px 18px', background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>{visual}</div>}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Token extractor ──────────────────────────────────────────────────────────

function getPageColors(t) {
  return {
    bg:              t['page.bg']                       || '#f5f7fa',
    divider:         t['page.divider']                  || '#e5e7eb',
    headerTitle:     t['page.header.title']             || 'var(--text-primary)',
    headerDesc:      t['page.header.description']       || 'var(--text-tertiary)',
    titleSize:       t['page.header.font-size-title']   || 28,
    titleWeight:     t['page.header.font-weight-title'] || 500,
    descSize:        t['page.header.font-size-desc']    || 14,
    descWeight:      t['page.header.font-weight-desc']  || 400,
    paddingX:        t['page.padding-x']                || 48,
    paddingY:        t['page.padding-y']                || 24,
    // Derived from semantic
    brand:           t['tabs.indicator']                || '#07a2b6',
    surface:         t['card.style.outlined.bg']        || '#ffffff',
    navbarBg:        '#FBFCFD',
    stroke:          t['card.style.outlined.stroke']    || '#dfe3e8',
    textPrimary:     t['page.header.title']             || '#111827',
    textSecondary:   t['page.header.description']       || '#6b7280',
  }
}

// ─── Mini SVG icons ───────────────────────────────────────────────────────────

function Icon({ name, size = 14, color = 'currentColor' }) {
  const paths = {
    home:       <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>,
    chevright:  <polyline points="9 18 15 12 9 6"/>,
    plus:       <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    download:   <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    filter:     <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>,
    dots:       <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>,
    settings:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    search:     <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    grid:       <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    table:      <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></>,
    nav:        <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    users:      <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    chart:      <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

// ─── Mini sidebar for layout demos ───────────────────────────────────────────

function MiniSidebar({ C, activeId = 'dashboard' }) {
  const items = [
    { id: 'dashboard', icon: 'chart', label: 'Dashboard' },
    { id: 'users',     icon: 'users', label: 'Users' },
    { id: 'projects',  icon: 'grid',  label: 'Projects' },
    { id: 'settings',  icon: 'settings', label: 'Settings' },
  ]
  return (
    <div style={{
      width: 180, flexShrink: 0,
      background: C.navbarBg,
      display: 'flex', flexDirection: 'column',
      padding: '12px 8px',
      gap: 2,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', marginBottom: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>A</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, fontFamily: 'Poppins, sans-serif' }}>Arcad</span>
      </div>
      {items.map(item => {
        const isActive = item.id === activeId
        return (
          <div key={item.id} style={{
            alignSelf: 'flex-start',
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px', borderRadius: 8,
            background: isActive ? C.brand + '18' : 'transparent',
          }}>
            <Icon name={item.icon} size={14} color={isActive ? C.brand : C.textSecondary} />
            <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', fontWeight: isActive ? 500 : 400, color: isActive ? C.brand : C.textSecondary }}>
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Page Header component ────────────────────────────────────────────────────

function PageHeader({ C, title, description, breadcrumbs, actions, sticky = false, scrolled = false }) {
  return (
    <div style={{
      background: C.bg,
      borderBottom: `1px solid ${C.divider}`,
      padding: `${C.paddingY}px ${C.paddingX}px`,
      ...(sticky ? { position: 'sticky', top: 0, zIndex: 10 } : {}),
      ...(sticky && scrolled ? { boxShadow: '0 2px 8px rgba(0,0,0,.08)' } : {}),
    }}>
      {breadcrumbs && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Icon name="chevright" size={12} color={C.textSecondary} />}
              <span style={{ fontSize: 12, color: i === breadcrumbs.length - 1 ? C.textPrimary : C.textSecondary, fontFamily: 'Poppins, sans-serif', fontWeight: i === breadcrumbs.length - 1 ? 500 : 400 }}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: C.titleSize, fontWeight: C.titleWeight, color: C.headerTitle, fontFamily: 'Poppins, sans-serif', letterSpacing: '-.3px', lineHeight: 1.2 }}>
            {title}
          </div>
          {description && (
            <div style={{ fontSize: C.descSize, fontWeight: C.descWeight, color: C.headerDesc, fontFamily: 'Poppins, sans-serif', marginTop: 6, lineHeight: 1.5 }}>
              {description}
            </div>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingTop: 4 }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Tiny button primitives for demos ────────────────────────────────────────

function DemoBtn({ label, icon, primary, C }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
      background: primary ? C.brand : C.surface,
      border: primary ? 'none' : `1px solid ${C.stroke}`,
      fontSize: 12, fontFamily: 'Poppins, sans-serif', fontWeight: 500,
      color: primary ? '#fff' : C.textPrimary,
      flexShrink: 0,
    }}>
      {icon && <Icon name={icon} size={12} color={primary ? '#fff' : C.textPrimary} />}
      {label}
    </div>
  )
}

// ─── Full layout mockup ───────────────────────────────────────────────────────

function LayoutMockup({ C, variant = 'with-sidebar' }) {
  const hasNav = variant !== 'full-width'
  return (
    <div style={{
      border: `1px solid ${C.stroke}`,
      borderRadius: 10,
      overflow: 'hidden',
      height: 500,
      display: 'flex',
      // Outer shell uses the navbar bg so gap corners blend in
      background: hasNav ? C.navbarBg : C.bg,
    }}>
      {hasNav && <MiniSidebar C={C} activeId="dashboard" />}
      {/* Page area floats over the navbar with left corner radius */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
        background: C.bg,
        borderTopLeftRadius: hasNav ? 12 : 0,
        borderBottomLeftRadius: hasNav ? 12 : 0,
        // Two-layer shadow:
        // 1) Hard shadow with navbar color traces the curved corners → fills the gap
        // 2) Drop shadow gives elevation above the navbar
        boxShadow: hasNav
          ? ` 0 4px 16px rgba(0,0,0,.22)` // Shadow only, no gap-fill needed since bg is same as navbar -14px 0 0 0 ${C.navbarBg},
          : 'none',
        position: 'relative', zIndex: 1,
        overflow: 'hidden',
      }}>
        <PageHeader
          C={C}
          title="Dashboard"
          description="Overview of your workspace activity."
          breadcrumbs={['Home', 'Dashboard']}
          actions={
            <>
              <DemoBtn label="Export" icon="download" C={C} />
              <DemoBtn label="New report" icon="plus" primary C={C} />
            </>
          }
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: `${C.paddingY}px ${C.paddingX}px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[['Visits', '12,485'], ['Signups', '1,230'], ['Revenue', '$48K']].map(([k, v]) => (
              <div key={k} style={{ background: C.surface, border: `1px solid ${C.stroke}`, borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, color: C.textSecondary, fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{k}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, fontFamily: 'Poppins, sans-serif' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, background: C.surface, border: `1px solid ${C.stroke}`, borderRadius: 8, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: C.textSecondary, fontFamily: 'Poppins, sans-serif' }}>Chart area</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Header variant demos ─────────────────────────────────────────────────────

function HeaderVariantDemo({ C, label, title, description, breadcrumbs, actions }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>{label}</div>
      <div style={{ border: `1px solid ${C.stroke}`, borderRadius: 8, overflow: 'hidden', background: C.bg }}>
        <PageHeader C={C} title={title} description={description} breadcrumbs={breadcrumbs} actions={actions} />
      </div>
    </div>
  )
}

// ─── Sticky header demo ───────────────────────────────────────────────────────

function StickyDemo({ C }) {
  const scrollRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = () => {
    if (scrollRef.current) setScrolled(scrollRef.current.scrollTop > 10)
  }

  return (
    <div style={{
      border: `1px solid ${C.stroke}`,
      borderRadius: 10,
      overflow: 'hidden',
      height: 280,
      display: 'flex',
      background: C.navbarBg,
    }}>
      <MiniSidebar C={C} activeId="projects" />
      {/* Page area with left radius + gap-fill shadow */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
        background: C.bg,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        boxShadow: ` 0 4px 16px rgba(0,0,0,.22)`, 
        position: 'relative', zIndex: 1,
        overflow: 'hidden',
      }}>
        {/* Single scroll container — sticky header works via position:sticky inside it */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
        >
          <PageHeader
            C={C}
            title="Projects"
            description="All active projects in your workspace."
            breadcrumbs={['Home', 'Projects']}
            actions={<DemoBtn label="New project" icon="plus" primary C={C} />}
            sticky
            scrolled={scrolled}
          />
          <div style={{ padding: `${C.paddingY}px ${C.paddingX}px` }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 0', borderBottom: `1px solid ${C.divider}`,
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: C.brand + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="grid" size={12} color={C.brand} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.textPrimary, fontFamily: 'Poppins, sans-serif' }}>Project {i + 1}</div>
                  <div style={{ fontSize: 11, color: C.textSecondary, fontFamily: 'Poppins, sans-serif' }}>Last updated 2 days ago</div>
                </div>
                <div style={{ fontSize: 11, padding: '3px 8px', borderRadius: 100, background: i % 3 === 0 ? '#dcfce7' : i % 3 === 1 ? '#fef9c3' : '#f1f5f9', color: i % 3 === 0 ? '#16a34a' : i % 3 === 1 ? '#ca8a04' : '#64748b', fontFamily: 'Poppins, sans-serif' }}>
                  {i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Review' : 'Draft'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Token table ──────────────────────────────────────────────────────────────

function TokenTable({ themeId, rows }) {
  const tokens = getComponentTokens(themeId)
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--stroke-primary)' }}>
          {['Token', 'Value', 'Role'].map(h => (
            <th key={h} style={{ textAlign: 'left', padding: '6px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([key, role]) => {
          const val = tokens[key]
          return (
            <tr key={key} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
              <td style={{ padding: '8px 10px' }}><Code>{key}</Code></td>
              <td style={{ padding: '8px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {typeof val === 'string' && val.startsWith('#') && (
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: val, border: '1px solid rgba(0,0,0,.1)', flexShrink: 0 }} />
                  )}
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{val ?? '—'}</span>
                </div>
              </td>
              <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>{role}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',      label: 'Overview' },
  { id: 'usage',         label: 'When to use' },
  { id: 'anatomy',       label: 'Anatomy' },
  { id: 'header',        label: 'Header zone' },
  { id: 'sticky',        label: 'Sticky behavior' },
  { id: 'layout',        label: 'Layout patterns' },
  { id: 'guidance',      label: 'Guidance' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'tokens',        label: 'Token reference' },
]

export default function PagePage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [activeSection, setActiveSection] = useState('overview')
  const theme = VISIBLE_THEMES.find(t => t.id === activeTheme) || VISIBLE_THEMES[0]
  const tokens = getComponentTokens(theme.id)
  const C = getPageColors(tokens)

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
      <div style={{ flex: 1, minWidth: 0, padding: '40px 56px 96px' }}>

      {/* ── Header ── */}
      <SectionAnchor id="top" />
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-secondary)', marginBottom: 8 }}>LAYOUT & OVERLAY</div>
      <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.8px', color: 'var(--text-primary)', margin: 0, marginBottom: 8 }}>Page</h1>

      <Lead>
        Page is the outermost layout wrapper for a full application view. It provides the page background, a structured header zone (title, description, breadcrumbs, actions), and a scrollable content area with consistent padding. It is designed to work alongside the Navbar component as the primary application shell.
      </Lead>

      <Divider />

      {/* ── Overview ── */}
      <SectionAnchor id="overview" />
      <H2>Overview</H2>
      <LayoutMockup C={C} />
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 3 }}>With sidebar (most common)</strong>
          The Navbar sits on the left and the Page fills the remaining space. The Page Header stays aligned with the content area, not the sidebar.
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 3 }}>Without sidebar</strong>
          For full-width views (onboarding, focused tasks) the Page expands to fill the entire viewport width.
        </div>
      </div>

      <Divider />

      {/* ── When to use ── */}
      <SectionAnchor id="usage" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <H2>When to use</H2>
          <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, paddingLeft: 18, marginTop: 0 }}>
            <li>Every primary application view — dashboards, list pages, detail screens</li>
            <li>Any route that needs a titled header and a scrollable content region</li>
            <li>When you need consistent horizontal/vertical padding across the app</li>
            <li>When actions belong to the view itself (Export, New item) rather than a specific element</li>
          </ul>
        </div>
        <div>
          <H2>When not to use</H2>
          <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, paddingLeft: 18, marginTop: 0 }}>
            <li>Modals and side panels — use their own header zones instead</li>
            <li>Nested sub-sections within a page — use a section header or Card instead</li>
            <li>Landing or marketing pages — Page is for authenticated app views</li>
          </ul>
        </div>
      </div>

      <Divider />

      {/* ── Anatomy ── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>
      <div style={{ border: `1px solid ${C.stroke}`, borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
        {/* Annotated version */}
        <div style={{ position: 'relative' }}>
          <LayoutMockup C={C} />
          {/* Callout badges */}
          {[
            { n: 1, label: 'Page wrapper',  top: '10%',  left: '2%'  },
            { n: 2, label: 'Navbar',        top: '30%',  left: '2%'  },
            { n: 3, label: 'Page header',   top: '10%',  right: '4%' },
            { n: 4, label: 'Breadcrumbs',   top: '22%',  right: '4%' },
            { n: 5, label: 'Content area',  bottom: '12%', right: '4%' },
          ].map(({ n, label, ...pos }) => (
            <div key={n} style={{ position: 'absolute', ...pos, display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: C.brand, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Poppins, sans-serif' }}>{n}</div>
              <div style={{ background: 'rgba(0,0,0,.65)', color: '#fff', fontSize: 11, fontFamily: 'Poppins, sans-serif', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          ['1', 'Page wrapper', 'Full-height container. Background is `page.bg`. Sits beside the Navbar.'],
          ['2', 'Navbar', 'The sidebar navigation. A sibling component — see Navbar docs.'],
          ['3', 'Page header', 'Fixed-height zone at the top. Contains breadcrumbs, title, description, actions. Can be sticky.'],
          ['4', 'Breadcrumbs', 'Optional contextual path. Uses the Breadcrumbs component.'],
          ['5', 'Content area', 'Scrollable main region below the header. Padding is controlled by `page.padding-x` / `page.padding-y`.'],
        ].map(([n, label, desc]) => (
          <div key={n} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.brand, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontFamily: 'Poppins, sans-serif' }}>{n}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, fontFamily: 'Poppins, sans-serif' }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Page Header variants ── */}
      <SectionAnchor id="header" />
      <H2>Page Header</H2>
      <P>The page header is the primary context anchor for every view. It supports up to four zones: breadcrumbs (optional), title (required), description (optional), and actions (optional).</P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <HeaderVariantDemo
          C={C}
          label="Title only"
          title="Users"
        />
        <HeaderVariantDemo
          C={C}
          label="With description"
          title="Users"
          description="Manage all workspace members and their permissions."
        />
        <HeaderVariantDemo
          C={C}
          label="With breadcrumbs"
          title="Analytics"
          breadcrumbs={['Home', 'Reports', 'Analytics']}
        />
        <HeaderVariantDemo
          C={C}
          label="With actions"
          title="Projects"
          description="All active projects in your workspace."
          breadcrumbs={['Home', 'Projects']}
          actions={
            <>
              <DemoBtn label="Filter" icon="filter" C={C} />
              <DemoBtn label="New project" icon="plus" primary C={C} />
            </>
          }
        />
      </div>

      <Divider />

      {/* ── Sticky header ── */}
      <SectionAnchor id="sticky" />
      <H2>Sticky header</H2>
      <P>When the content area is long enough to scroll, the page header can be made sticky so the title and actions remain accessible. Scroll the demo below to see the shadow appear on scroll.</P>
      <InfoBox type="info">
        The sticky header adds a subtle box-shadow on scroll to reinforce the separation between the header and scrolled content. This shadow is not a design token — it is applied programmatically when <Code>scrollTop {'>'} 0</Code>.
      </InfoBox>
      <StickyDemo C={C} />

      <Divider />

      {/* ── Layout patterns ── */}
      <SectionAnchor id="layout" />
      <H2>Layout patterns</H2>

      <H3>With sidebar Navbar</H3>
      <P>The most common pattern. The Navbar occupies a fixed-width column on the left; the Page fills the rest. The page header spans the full width of the Page column only.</P>
      <LayoutMockup C={C} variant="with-sidebar" />

      <H3>Full width (no sidebar)</H3>
      <P>For focused tasks, onboarding flows, or settings screens where the Navbar is hidden or collapsed to a top bar. The Page expands to fill the viewport.</P>
      <LayoutMockup C={C} variant="full-width" />

      <InfoBox type="info">
        For defining the internal content grid within the page, see the <a href="/components/grid" style={{ color: C.brand, textDecoration: 'none', fontWeight: 500 }}>Grid component</a>. Page handles the outer shell; Grid handles column layout inside the content area.
      </InfoBox>

      <Divider />

      {/* ── Guidance ── */}
      <SectionAnchor id="guidance" />
      <H2>Guidance</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DoBox
          visual={
            <div style={{ border: `1px solid ${C.stroke}`, borderRadius: 8, overflow: 'hidden', width: '100%', background: C.bg }}>
              <PageHeader C={C} title="Dashboard" breadcrumbs={['Home', 'Dashboard']} actions={<DemoBtn label="Export" icon="download" C={C} />} />
              <div style={{ height: 36, background: C.bg }} />
            </div>
          }
        >
          Put page-level actions (Export, New item) in the header action zone — they stay visible and clearly belong to the whole view.
        </DoBox>
        <DontBox
          visual={
            <div style={{ border: `1px solid ${C.stroke}`, borderRadius: 8, overflow: 'hidden', width: '100%', background: C.bg }}>
              <PageHeader C={C} title="Dashboard" />
              <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                <DemoBtn label="Export" C={C} />
                <DemoBtn label="New" primary C={C} />
              </div>
            </div>
          }
        >
          Don't place page-level actions floating inside the content area — they're hard to find and lose their structural meaning.
        </DontBox>
        <DoBox
          visual={
            <div style={{ border: `1px solid ${C.stroke}`, borderRadius: 8, overflow: 'hidden', width: '100%', background: C.bg }}>
              <div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px' }}>
                {['Home', 'Projects', 'Active'].map((crumb, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <Icon name="chevright" size={10} color={C.textSecondary} />}
                    <span style={{ fontSize: 11, color: i === 2 ? C.textPrimary : C.textSecondary, fontFamily: 'Poppins, sans-serif' }}>{crumb}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          }
        >
          Use breadcrumbs when the page is nested 2+ levels deep. They help users orient and backtrack quickly.
        </DoBox>
        <DontBox
          visual={
            <div style={{ border: `1px solid ${C.stroke}`, borderRadius: 8, overflow: 'hidden', width: '100%', background: C.bg }}>
              <div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px' }}>
                {['Home', 'Dashboard'].map((crumb, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <Icon name="chevright" size={10} color={C.textSecondary} />}
                    <span style={{ fontSize: 11, color: C.textSecondary, fontFamily: 'Poppins, sans-serif' }}>{crumb}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          }
        >
          Don't add breadcrumbs on top-level pages — "Home / Dashboard" adds no orientation value and clutters the header.
        </DontBox>
      </div>

      <Divider />

      {/* ── Accessibility ── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['Landmark roles', 'Wrap the page content area in a <main> element so screen readers can jump directly to the primary content.'],
          ['heading hierarchy', 'The page title should always be an <h1>. Section headings inside the content area start at <h2> and cascade downward.'],
          ['Skip link', "Provide a 'Skip to main content' link that bypasses the Navbar and header, jumping directly to the <main> element."],
          ['Focus on route change', 'When the route changes, move focus to the page title (<h1>) so keyboard and screen reader users are informed of the new view.'],
          ['Breadcrumb nav', 'Wrap breadcrumbs in a <nav aria-label="Breadcrumb"> and mark the current page item with aria-current="page".'],
        ].map(([term, desc]) => (
          <div key={term} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, fontSize: 13, padding: '10px 0', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{term}</span>
            <span style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Token reference ── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>

      <H3>Page surface</H3>
      <TokenTable themeId={theme.id} rows={[
        ['page.bg',      'Page background color'],
        ['page.divider', 'Divider between header and content'],
      ]} />

      <H3>Page header</H3>
      <TokenTable themeId={theme.id} rows={[
        ['page.header.title',            'Title text color'],
        ['page.header.description',      'Description text color'],
        ['page.header.font-size-title',  'Title font size (px)'],
        ['page.header.font-weight-title','Title font weight'],
        ['page.header.font-size-desc',   'Description font size (px)'],
        ['page.header.font-weight-desc', 'Description font weight'],
      ]} />

      <H3>Spacing</H3>
      <TokenTable themeId={theme.id} rows={[
        ['page.padding-x', 'Horizontal padding for header and content'],
        ['page.padding-y', 'Vertical padding for header and content'],
      ]} />

      </div>

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
        <BrandThemeSwitcher />
      </aside>
    </div>
  )
}
