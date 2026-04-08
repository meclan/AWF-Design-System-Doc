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

// ─── Banner type config ───────────────────────────────────────────────────────

const BANNER_TYPES = {
  info: {
    bg: '#f9fafb',
    stroke: '#0190f6',
    icon: '#0190f6',
    label: 'Info',
    iconSvg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="7" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="5" r=".75" fill="currentColor" />
      </svg>
    ),
  },
  warning: {
    bg: '#feede2',
    stroke: '#f6873f',
    icon: '#f6873f',
    label: 'Warning',
    iconSvg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
        <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="8" y1="6.5" x2="8" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r=".75" fill="currentColor" />
      </svg>
    ),
  },
  danger: {
    bg: '#fee8e2',
    stroke: '#f6643f',
    icon: '#f6643f',
    label: 'Danger',
    iconSvg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  success: {
    bg: '#d9f6df',
    stroke: '#02bf2b',
    icon: '#02bf2b',
    label: 'Success',
    iconSvg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 8L7 10.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  neutral: {
    bg: '#f9fafb',
    stroke: '#919eab',
    icon: '#454f5b',
    label: 'Neutral',
    iconSvg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
        <path d="M8 2a4 4 0 0 1 4 4v3l1.5 2H2.5L4 9V6a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6.5 12a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
}

const IcoClose = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'block' }}>
    <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// ─── Banner component ─────────────────────────────────────────────────────────

function BannerComp({ type = 'info', title, description, actions, dismissible = true, onDismiss }) {
  const cfg = BANNER_TYPES[type] || BANNER_TYPES.info
  const [hoverClose, setHoverClose] = useState(false)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: '24px',
      background: cfg.bg,
      borderRadius: 10,
      border: `1px solid ${cfg.stroke}`,
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Header row: icon + title + close button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Icon — solid colored circle with white icon */}
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: cfg.stroke,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#ffffff',
          }}>
            {cfg.iconSvg}
          </div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#141a21', lineHeight: 1.4, textTransform: 'capitalize' }}>
            {title}
          </div>
        </div>

        {/* Close button */}
        {dismissible && (
          <button
            onClick={onDismiss}
            onMouseEnter={() => setHoverClose(true)}
            onMouseLeave={() => setHoverClose(false)}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: hoverClose ? 'rgba(69,79,91,.12)' : 'transparent',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#454f5b',
              flexShrink: 0,
              padding: 0,
              transition: 'background 120ms',
            }}
            aria-label="Dismiss banner"
          >
            <IcoClose />
          </button>
        )}
      </div>

      {/* Body — indented 40px (32px icon + 8px gap) */}
      {(description || actions) && (
        <div style={{ paddingLeft: 40, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {description && (
            <div style={{ fontSize: 16, fontWeight: 400, color: '#637381', lineHeight: 1.6 }}>
              {description}
            </div>
          )}
          {actions && (
            <div style={{ display: 'flex', gap: 12 }}>
              {actions.map((action, i) => (
                <button
                  key={i}
                  style={{
                    padding: '10px 20px',
                    fontSize: 16,
                    fontWeight: 400,
                    borderRadius: 8,
                    border: i === 0 ? '1.5px solid #c4cdd5' : 'none',
                    background: '#ffffff',
                    color: '#454f5b',
                    cursor: 'pointer',
                    lineHeight: 1.5,
                    textTransform: 'capitalize',
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Interactive live demo ────────────────────────────────────────────────────

function BannerLive() {
  const initialBanners = [
    { id: 'warning', type: 'warning', title: 'Action required', description: 'Your subscription expires in 3 days. Renew now to avoid interruption.', actions: ['Renew now', 'Remind me later'] },
    { id: 'success', type: 'success', title: 'Changes saved', description: 'Your profile settings have been updated successfully.' },
    { id: 'danger',  type: 'danger',  title: 'Deployment failed', description: 'The latest build could not be deployed. Check the error log for details.', actions: ['View log'] },
    { id: 'info',    type: 'info',    title: 'New features available', description: 'Version 4.2 introduces the redesigned navigation and dark mode support.' },
  ]
  const [dismissed, setDismissed] = useState([])
  const visible = initialBanners.filter(b => !dismissed.includes(b.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 14, color: 'var(--text-tertiary)' }}>
          All banners dismissed.{' '}
          <button onClick={() => setDismissed([])} style={{ background: 'none', border: 'none', color: 'var(--brand-600)', cursor: 'pointer', fontSize: 14, padding: 0, fontWeight: 500 }}>Reset</button>
        </div>
      )}
      {visible.map(b => (
        <BannerComp
          key={b.id}
          type={b.type}
          title={b.title}
          description={b.description}
          actions={b.actions}
          dismissible
          onDismiss={() => setDismissed(prev => [...prev, b.id])}
        />
      ))}
    </div>
  )
}

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',  label: 'Overview' },
  { id: 'anatomy',   label: 'Anatomy' },
  { id: 'types',     label: 'Types' },
  { id: 'states',    label: 'States' },
  { id: 'usage',     label: 'Usage rules' },
  { id: 'usecase',   label: 'Use case' },
  { id: 'a11y',      label: 'Accessibility' },
  { id: 'tokens',    label: 'Token reference' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BannerPage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

  const t = getComponentTokens(activeTheme)
  const theme = VISIBLE_THEMES.find(th => th.id === activeTheme) || VISIBLE_THEMES[0]

  // Scroll spy — listens on <main>
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

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Feedback</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Banner</h1>
          <Lead>
            A full-width contextual message bar used to communicate <strong>important information</strong>, warnings, errors, or confirmations at a page or section level. Banners are persistent until dismissed or the condition resolves.
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

        {/* ── Interactive live demo ──────────────────────────────────────────── */}
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 40 }}>
          <div style={{ padding: '12px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Interactive demo — click × to dismiss</span>
          </div>
          <div style={{ padding: '20px 24px', background: 'var(--bg-primary)' }}>
            <BannerLive />
          </div>
        </div>

        {/* ══ Overview ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <P>
          Banners communicate <strong>system-level or page-level messages</strong> that require the user's attention. They appear at the top of a page or section, span the full width of the content area, and remain visible until explicitly dismissed or until the triggering condition is resolved.
        </P>
        <P>
          Unlike toasts, banners are not time-limited — they are appropriate when the message is persistent or when the user needs to take action before continuing.
        </P>

        {/* When to use / not */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Communicating a critical system status (e.g. service degradation)',
              'Warning the user before a destructive or irreversible action',
              'Confirming a successful operation at page level',
              'Surfacing actionable information that persists until resolved',
              'Showing a persistent informational notice (e.g. billing warning)',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Brief, transient feedback → use Toast / Snackbar',
              'Inline field-level validation → use Input error state',
              'Blocking the user until they respond → use Modal / Dialog',
              'Marketing or promotional messages (avoid overuse)',
              'Multiple simultaneous banners stacked (max 1–2 at a time)',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Anatomy ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <Lead>
          Each banner has four parts: a colored <strong>left border accent</strong>, an <strong>icon</strong> representing the type, a <strong>content area</strong> (title, description, optional actions), and an optional <strong>close button</strong>.
        </Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '28px 32px', background: 'var(--bg-primary)' }}>
            {/* Annotated banner */}
            <div style={{ position: 'relative', marginBottom: 40 }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '20px 20px',
                background: '#feede2',
                borderRadius: 10,
                borderLeft: '4px solid #f6873f',
              }}>
                {/* Icon */}
                <div style={{ width: 32, height: 32, borderRadius: 6, background: '#f6873f20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#f6873f' }}>
                  {BANNER_TYPES.warning.iconSvg}
                </div>
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#141a21', marginBottom: 4 }}>Your trial expires in 2 days</div>
                  <div style={{ fontSize: 13, color: '#637381', lineHeight: 1.6, marginBottom: 10 }}>Upgrade your plan to keep access to all features.</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ padding: '4px 12px', fontSize: 12, fontWeight: 500, borderRadius: 5, border: '1.5px solid #f6873f', background: 'transparent', color: '#f6873f', cursor: 'default' }}>Upgrade now</button>
                    <button style={{ padding: '4px 12px', fontSize: 12, fontWeight: 500, borderRadius: 5, border: '1.5px solid #919eab', background: 'transparent', color: '#637381', cursor: 'default' }}>Remind me</button>
                  </div>
                </div>
                {/* Close */}
                <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#454f5b' }}>
                  <IcoClose />
                </div>
              </div>

              {/* Annotation callouts */}
              <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
                {[
                  ['① Left border', 'Colored 4 px accent. Maps to banner.stroke.[type]'],
                  ['② Icon',        'Type icon in a tinted square. Color from banner.icon.[type]'],
                  ['③ Title',       'Short imperative label. font-weight 500, 16 px'],
                  ['④ Description', 'Supporting context. font-weight 400, secondary color'],
                  ['⑤ Actions',     'Optional outlined action buttons below the description'],
                  ['⑥ Close ×',     'Dismiss control. Color from banner.close-icon token'],
                ].map(([name, desc]) => (
                  <div key={name} style={{ display: 'flex', gap: 8, alignItems: 'baseline', minWidth: 220 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{name}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ Types ═══════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="types" />
        <H2>Types</H2>
        <Lead>
          Five semantic types cover the full range of feedback contexts. Each type has a distinct icon, left-border accent, and subtle background tint.
        </Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {Object.entries(BANNER_TYPES).map(([typeKey, cfg]) => (
            <div key={typeKey}>
              <BannerComp
                type={typeKey}
                title={cfg.label}
                description={`Use the ${cfg.label.toLowerCase()} banner for ${
                  typeKey === 'info'    ? 'neutral informational messages and guidance.' :
                  typeKey === 'warning' ? 'situations that may need attention before proceeding.' :
                  typeKey === 'danger'  ? 'errors, failures, or destructive actions that require intervention.' :
                  typeKey === 'success' ? 'confirmation that an action or process completed successfully.' :
                                          'general system notices with no strong semantic weight.'
                }`}
                dismissible={false}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { type: 'info',    hex: '#0190f6', label: 'Info',    desc: 'Guidance, tips, neutral status' },
            { type: 'warning', hex: '#f6873f', label: 'Warning', desc: 'Needs attention, expiry, limits' },
            { type: 'danger',  hex: '#f6643f', label: 'Danger',  desc: 'Errors, failures, data loss' },
            { type: 'success', hex: '#02bf2b', label: 'Success', desc: 'Confirmation, completion' },
            { type: 'neutral', hex: '#919eab', label: 'Neutral', desc: 'Low-priority system notices' },
          ].map(({ hex, label, desc }) => (
            <div key={label} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: hex, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ States ══════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="states" />
        <H2>States</H2>
        <Lead>
          Banners support four compositional states depending on the context: title only, title + description, with action buttons, and dismissible.
        </Lead>

        <H3>Title only</H3>
        <P>The minimal form — use when the title alone is self-explanatory and no further action is needed.</P>
        <div style={{ marginBottom: 20 }}>
          <BannerComp type="success" title="Changes saved successfully." dismissible={false} />
        </div>

        <H3>With description</H3>
        <P>Add a description to provide supporting context or next steps when the title alone is insufficient.</P>
        <div style={{ marginBottom: 20 }}>
          <BannerComp
            type="info"
            title="Scheduled maintenance"
            description="The platform will be unavailable on Saturday, April 12 from 02:00 to 04:00 UTC. Please save your work before then."
            dismissible={false}
          />
        </div>

        <H3>With actions</H3>
        <P>Include one or two action buttons when the banner requires an explicit response. The primary action uses the type accent color; secondary uses neutral.</P>
        <div style={{ marginBottom: 20 }}>
          <BannerComp
            type="warning"
            title="Your storage is almost full"
            description="You are using 94% of your 10 GB limit. Free up space or upgrade your plan to continue."
            actions={['Upgrade plan', 'Manage files']}
            dismissible={false}
          />
        </div>

        <H3>Dismissible</H3>
        <P>When the user can acknowledge and hide the banner, include a × close button on the right. Manage visibility state in the parent component.</P>
        <div style={{ marginBottom: 20 }}>
          <BannerComp
            type="info"
            title="New keyboard shortcuts available"
            description="Press Ctrl+K to open the command palette from anywhere in the app."
            dismissible
            onDismiss={() => {}}
          />
        </div>

        <InfoBox type="info">
          Always provide an <Code>aria-label="Dismiss banner"</Code> on the close button so screen readers can identify the action.
        </InfoBox>

        <Divider />

        {/* ══ Usage ═══════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>
        <Lead>
          Follow these guidelines to maintain a consistent and accessible experience across all banner placements.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <DoBox
            visual={
              <BannerComp
                type="danger"
                title="Build #42 failed"
                description="Check the error log and re-trigger the deployment."
                actions={['View log']}
                dismissible={false}
              />
            }
          >
            Use a single, specific banner that matches the severity of the situation. Include a clear action when the user needs to respond.
          </DoBox>
          <DontBox
            visual={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                <BannerComp type="info"    title="Info message"    dismissible={false} />
                <BannerComp type="warning" title="Warning message" dismissible={false} />
                <BannerComp type="danger"  title="Error message"   dismissible={false} />
              </div>
            }
          >
            Don't stack multiple banners simultaneously. Prioritize the most critical message and show others sequentially or in a notification center.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <DoBox>
            Write banner titles as concise, action-oriented phrases. Keep descriptions under 2 sentences.
          </DoBox>
          <DontBox>
            Don't use a banner for transient success messages like "Saved!" — use a Toast instead. Banners are for persistent or actionable information.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <DoBox>
            Match the banner type to the semantic weight of the message. Use <Code>danger</Code> only for genuine errors or data loss risk.
          </DoBox>
          <DontBox>
            Don't use <Code>danger</Code> or <Code>warning</Code> banners for routine informational messages. Overuse of high-severity types causes alert fatigue.
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <Lead>
          A billing settings page where the user's account has an overdue invoice. The banner persists at the top of the page until the payment is resolved.
        </Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '12px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Billing · Settings</span>
          </div>
          <div style={{ padding: '24px 28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <BannerComp
              type="danger"
              title="Payment overdue — account suspended"
              description="Your last invoice of $149.00 (March 2026) is 12 days past due. Service access will be fully revoked in 3 days. Please update your payment method or contact support."
              actions={['Update payment method', 'Contact support']}
              dismissible={false}
            />

            {/* Fake billing card */}
            <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '20px 24px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Billing overview</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Current plan', value: 'Pro · $149 / mo' },
                  { label: 'Next billing date', value: 'Apr 1, 2026' },
                  { label: 'Payment method', value: 'Visa ···· 4242' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <P>
          The <Code>danger</Code> banner sits above the page content and cannot be dismissed, reflecting that the user must resolve the issue to continue using the service. Both action buttons are present — a primary CTA and a secondary support path — to cover the two most likely responses.
        </P>

        <Divider />

        {/* ══ Accessibility ═══════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <Lead>
          Banners must be perceivable and operable for all users, including those using assistive technologies.
        </Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {[
            {
              title: 'Role and live region',
              body: <>Use <Code>role="alert"</Code> on <Code>danger</Code> and <Code>warning</Code> banners to trigger an immediate screen reader announcement. For <Code>info</Code>, <Code>success</Code>, and <Code>neutral</Code> types, use <Code>role="status"</Code> (polite). Do not apply both simultaneously.</>
            },
            {
              title: 'Close button label',
              body: <>The × close button must have <Code>aria-label="Dismiss banner"</Code> since it contains no visible text. Never use an icon-only button without an accessible label.</>
            },
            {
              title: 'Color is not the only indicator',
              body: 'The type icon and the title text must convey the banner\'s intent independently of its color. This ensures compliance for users with color vision deficiencies.'
            },
            {
              title: 'Focus management',
              body: <>When a banner is injected dynamically (e.g. after a form submit), programmatically move focus to it or ensure the live region announces it. When dismissed, return focus to the nearest meaningful element.</>
            },
            {
              title: 'Keyboard access',
              body: <>All interactive elements — action buttons and the close button — must be reachable and activatable via keyboard. Ensure a visible focus ring is present (use <Code>:focus-visible</Code>).</>
            },
            {
              title: 'Contrast ratio',
              body: 'All text inside the banner must meet WCAG AA minimum contrast of 4.5:1 against the banner background. The provided tokens satisfy this requirement for both light and dark themes.'
            },
          ].map(({ title, body }) => (
            <div key={title} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 18px', background: 'var(--bg-primary)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{body}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Token reference ══════════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>
          All banner visual properties are driven by design tokens. The table below shows resolved values for the current theme. Switch themes above to inspect other products.
        </Lead>

        <InfoBox type="info">
          Token values shown are from the <strong>DOT (default)</strong> theme. Select a different theme in the header to compare resolved values across products.
        </InfoBox>

        {/* Static token table since banner tokens are hardcoded (not yet in components.json) */}
        <div style={{ borderRadius: 8, border: '1px solid var(--stroke-primary)', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 40px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', padding: '8px 14px' }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Token</span>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Value (DOT)</span>
            <span />
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {[
              ['banner.bg.info',               '#f9fafb'],
              ['banner.bg.neutral',             '#f9fafb'],
              ['banner.bg.warning',             '#feede2'],
              ['banner.bg.danger',              '#fee8e2'],
              ['banner.bg.success',             '#d9f6df'],
              ['banner.stroke.info',            '#0190f6'],
              ['banner.stroke.neutral',         '#919eab'],
              ['banner.stroke.warning',         '#f6873f'],
              ['banner.stroke.danger',          '#f6643f'],
              ['banner.stroke.success',         '#02bf2b'],
              ['banner.icon.info',              '#0190f6'],
              ['banner.icon.neutral',           '#454f5b'],
              ['banner.icon.warning',           '#f6873f'],
              ['banner.icon.danger',            '#f6643f'],
              ['banner.icon.success',           '#02bf2b'],
              ['banner.text.title',             '#141a21'],
              ['banner.text.description',       '#637381'],
              ['banner.close-icon',             '#454f5b'],
              ['banner.padding-x',              '24'],
              ['banner.padding-y',              '24'],
              ['banner.gap',                    '10'],
              ['banner.font-size',              '16'],
              ['banner.font-weight-title',      '500'],
              ['banner.font-weight-desc',       '400'],
              ['banner.radius',                 '10'],
            ].map(([key, value]) => {
              const isHex = /^#[0-9a-fA-F]/.test(value)
              return (
                <div key={key} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 40px', padding: '8px 14px', borderBottom: '1px solid var(--stroke-primary)', alignItems: 'center' }}>
                  <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{key}</code>
                  <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-tertiary)' }}>{value}</code>
                  {isHex
                    ? <span style={{ width: 18, height: 18, borderRadius: 4, background: value, border: '1px solid rgba(0,0,0,.12)', display: 'inline-block' }} />
                    : <span />}
                </div>
              )
            })}
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8 }}>25 tokens</div>

      </div>

      {/* ── TOC sidebar ────────────────────────────────────────────────────────── */}
      <div style={{ width: 200, flexShrink: 0, padding: '48px 24px 48px 0', position: 'sticky', top: 0, maxHeight: '100vh', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>On this page</div>
        {TOC.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
              display: 'block',
              padding: '5px 10px',
              fontSize: 13,
              borderRadius: 6,
              marginBottom: 2,
              textDecoration: 'none',
              fontWeight: activeSection === item.id ? 600 : 400,
              color:      activeSection === item.id ? 'var(--brand-600)' : 'var(--text-secondary)',
              background: activeSection === item.id ? 'var(--brand-50)'  : 'transparent',
              transition: 'all 100ms',
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

    </div>
  )
}
