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

// ─── Toast type config ────────────────────────────────────────────────────────
// Two variants:
//   dark  (default) — bg #1c252e, white text   → used on LIGHT pages for high contrast
//   light           — bg #ffffff, dark text     → used on DARK pages for high contrast
// Icon: color = status color, bg = soft 16% of status color (both variants)

const TOAST_TYPES = {
  success: {
    strokeColor: '#02bf2b',
    iconBg:      '#02bf2b28',  // token: color.bg.success.default-25%
    iconColor:   '#02bf2b',    // token: color.icon.success
  },
  warning: {
    strokeColor: '#f6873f',
    iconBg:      '#f6873f28',  // token: color.bg.warning.default-25%
    iconColor:   '#f6873f',    // token: color.icon.warning
  },
  danger: {
    strokeColor: '#f6643f',
    iconBg:      '#f6643f28',  // token: color.bg.danger.default-25%
    iconColor:   '#f6643f',    // token: color.icon.danger
  },
  info: {
    strokeColor: '#0190f6',
    iconBg:      '#0190f628',  // token: color.bg.info
    iconColor:   '#0190f6',    // token: color.icon.info
  },
  loading: {
    strokeColor: '#919eab',
    iconBg:      '#919eab28',
    iconColor:   '#919eab',
  },
}

// ─── MUI-style SVG icons (embedded paths — same rendering as @mui/icons-material) ─

// Shared renderer — fill="currentColor" mirrors MUI's SvgIcon behaviour
function MuiSvg({ path, size = 24, spin = false }) {
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size}
      fill="currentColor" aria-hidden="true"
      style={spin ? { animation: 'toast-spin 1s linear infinite' } : undefined}
    >
      <path d={path} />
    </svg>
  )
}

// MUI icon path registry
const MUI_PATHS = {
  // CheckCircleRounded
  success: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  // WarningRounded
  warning: 'M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3zM12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z',
  // ErrorRounded
  danger:  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
  // InfoRounded
  info:    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  // CachedRounded (loading / progress)
  loading: 'M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z',
  // CloseRounded
  close:   'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
}

function ToastIcon({ type }) {
  const cfg = TOAST_TYPES[type] || TOAST_TYPES.info
  return (
    <div style={{
      width: 48, height: 48,
      borderRadius: 10,           // token: numbers.radius.lg
      flexShrink: 0,
      background: cfg.iconBg,
      color: cfg.iconColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <MuiSvg path={MUI_PATHS[type] || MUI_PATHS.info} size={24} spin={type === 'loading'} />
    </div>
  )
}

// ─── Toast item component ─────────────────────────────────────────────────────

// variant="dark"  → bg #1c252e, white text  (for use on LIGHT UI pages)
// variant="light" → bg #ffffff, dark text   (for use on DARK UI pages)
function ToastItem({ type = 'success', title, description, actionLabel, dismissible = true, onDismiss, variant = 'dark' }) {
  const cfg = TOAST_TYPES[type] || TOAST_TYPES.info
  const isDark = variant === 'dark'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: isDark ? '#1c252e' : '#ffffff',  // token: toast.bg
      borderRadius: 10,                             // token: toast.radius
      padding: 8,                                   // token: toast.padding
      border: `1.5px solid ${cfg.strokeColor}`,
      boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      <ToastIcon type={type} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 400, color: isDark ? '#ffffff' : '#141a21', lineHeight: 1.4, textTransform: 'capitalize' }}>
          {title}
        </div>
        {description && (
          <div style={{ fontSize: 14, color: isDark ? '#c4cdd5' : '#637381', lineHeight: 1.55, marginTop: 2 }}>{description}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {actionLabel && (
          <button style={{
            background: 'none', border: 'none', padding: '0 4px', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, color: '#0190f6',
            fontFamily: 'inherit', lineHeight: 1,
          }}>
            {actionLabel}
          </button>
        )}
        {dismissible && (
          <button
            onClick={onDismiss}
            style={{
              background: 'none', border: 'none', padding: 4, cursor: 'pointer',
              color: isDark ? '#ffffff' : '#637381',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 4, lineHeight: 1,
            }}
            aria-label="Dismiss notification"
          >
            <MuiSvg path={MUI_PATHS.close} size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Toast stack illustration ─────────────────────────────────────────────────
// Collapsed: top toast visible, 2 ghost toasts peek below
// Hover: expand → show up to 3 toasts + "x more" pill
// Click "x more": show all toasts

const STACK_TOASTS = [
  { id: 1, type: 'success', title: 'Changes saved',       description: 'Your profile was updated.' },
  { id: 2, type: 'info',    title: 'Information message', description: null },
  { id: 3, type: 'danger',  title: 'Danger message',      description: null },
  { id: 4, type: 'warning', title: 'Session expiring',    description: null },
  { id: 5, type: 'loading', title: 'Syncing records',     description: null },
]

function ToastStack() {
  const [hovered,   setHovered]   = useState(false)
  const [expanded,  setExpanded]  = useState(false)

  const SHOW_ON_HOVER = 3   // toasts visible while hovering (before "more" click)
  const total   = STACK_TOASTS.length
  const visible = expanded ? total : (hovered ? SHOW_ON_HOVER : 1)
  const extra   = total - SHOW_ON_HOVER  // toasts hidden behind "x more" pill

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setExpanded(false) }}
      style={{ width: '100%', maxWidth: 420, margin: '0 auto', userSelect: 'none' }}
    >
      {/* ── Collapsed state — top toast + 2 ghost peeks below ── */}
      {!hovered && (
        <div style={{ position: 'relative', paddingBottom: 14 }}>
          {/* Ghost peek 2 (deepest) */}
          <div style={{
            position: 'absolute', top: 10, left: '50%',
            transform: 'translateX(-50%) scaleX(0.88)',
            transformOrigin: 'top center',
            width: '100%', opacity: 0.35, pointerEvents: 'none',
          }}>
            <ToastItem type="warning" title="Session expiring" dismissible={false} />
          </div>
          {/* Ghost peek 1 */}
          <div style={{
            position: 'absolute', top: 5, left: '50%',
            transform: 'translateX(-50%) scaleX(0.94)',
            transformOrigin: 'top center',
            width: '100%', opacity: 0.6, pointerEvents: 'none',
          }}>
            <ToastItem type="info" title="Information message" dismissible={false} />
          </div>
          {/* Front toast */}
          <div style={{ position: 'relative', zIndex: 3 }}>
            <ToastItem type="success" title="Changes saved" description="Your profile was updated." dismissible={false} />
          </div>
        </div>
      )}

      {/* ── Hover / Expanded state — list of toasts ── */}
      {hovered && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {STACK_TOASTS.slice(0, visible).map(t => (
            <ToastItem key={t.id} type={t.type} title={t.title} description={t.description} dismissible={false} />
          ))}
          {/* "x more notifications" pill */}
          {!expanded && extra > 0 && (
            <button
              onClick={() => setExpanded(true)}
              style={{
                alignSelf: 'flex-end',
                background: '#f4f6f8',
                border: '1px solid #919eab',
                borderRadius: 8,
                padding: '4px 12px',
                fontSize: 13,
                fontWeight: 500,
                color: '#454545',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 120ms',
              }}
            >
              {extra} more notification{extra > 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Interactive live demo ────────────────────────────────────────────────────

const DEMO_TOASTS = [
  { id: 'success', type: 'success', title: 'Profile updated',    description: 'Your changes have been saved successfully.' },
  { id: 'danger',  type: 'danger',  title: 'Upload failed',      description: 'The file exceeds the 50 MB size limit.'       },
  { id: 'warning', type: 'warning', title: 'Session expiring',   description: 'You will be logged out in 5 minutes.'         },
  { id: 'info',    type: 'info',    title: 'New version available', description: 'Refresh to apply the latest update.'       },
]

function ToastLive() {
  const [visible, setVisible] = useState(DEMO_TOASTS.map(t => t.id))

  function dismiss(id) {
    setVisible(prev => prev.filter(v => v !== id))
  }

  function reset() {
    setVisible(DEMO_TOASTS.map(t => t.id))
  }

  return (
    <div>
      <div style={{
        background: 'var(--bg-primary)', borderRadius: 12, padding: '28px 24px',
        border: '1px solid var(--stroke-primary)',
        minHeight: 280, position: 'relative',
      }}>
        {/* Corner label */}
        <div style={{ position: 'absolute', top: 12, left: 16, fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
          Live preview
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16 }}>
          {DEMO_TOASTS.filter(t => visible.includes(t.id)).map(toast => (
            <ToastItem
              key={toast.id}
              type={toast.type}
              title={toast.title}
              description={toast.description}
              onDismiss={() => dismiss(toast.id)}
              variant="dark"
            />
          ))}
          {visible.length === 0 && (
            <div style={{ textAlign: 'center', color: '#4b5a68', fontSize: 13, paddingTop: 32 }}>
              All toasts dismissed
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <button
          onClick={reset}
          style={{
            padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)',
            color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Reset toasts
        </button>
      </div>
    </div>
  )
}

// ─── TOC ──────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',  label: 'Overview'        },
  { id: 'anatomy',   label: 'Anatomy'          },
  { id: 'types',     label: 'Types'            },
  { id: 'variants',  label: 'Variants'         },
  { id: 'stacking',  label: 'Stacking'         },
  { id: 'usage',     label: 'Usage rules'      },
  { id: 'usecase',   label: 'Use case'         },
  { id: 'a11y',      label: 'Accessibility'    },
  { id: 'tokens',    label: 'Token reference'  },
]

// ─── Hardcoded token set (DOT theme) for TokenTable ───────────────────────────

const TOAST_TOKENS_STATIC = {
  'toast.bg':                      '#ffffff',
  'toast.title':                   '#141a21',
  'toast.description':             '#637381',
  'toast.close-icon':              '#637381',
  'toast.action-link':             '#0190f6',
  'toast.icon.color.success':      '#02bf2b',
  'toast.icon.color.warning':      '#f6873f',
  'toast.icon.color.danger':       '#f6643f',
  'toast.icon.color.info':         '#0190f6',
  'toast.icon.color.loading':      '#919eab',
  'toast.icon.bg.success':         '#02bf2b28',
  'toast.icon.bg.warning':         '#f6873f28',
  'toast.icon.bg.danger':          '#f6643f28',
  'toast.icon.bg.info':            '#0190f628',
  'toast.icon.bg.loading':         '#919eab28',
  'toast.icon.bg-size':            '48',
  'toast.icon.icon-size':          '24',
  'toast.icon.bg.radius':          '10',
  'toast.icon.bg.opacity':         '25',
  'toast.stroke.success':          '#02bf2b',
  'toast.stroke.warning':          '#f6873f',
  'toast.stroke.danger':           '#f6643f',
  'toast.stroke.info':             '#0190f6',
  'toast.stroke.loading':          '#919eab',
  'toast.padding':                 '8',
  'toast.radius':                  '10',
  'toast.font-size-title':         '16',
  'toast.font-size-description':   '14',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToastPage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [activeSection, setActiveSection] = useState('overview')

  const t = getComponentTokens(activeTheme)
  const theme = VISIBLE_THEMES.find(th => th.id === activeTheme) || VISIBLE_THEMES[0]

  // Scroll spy
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

      {/* Spinner keyframes injected once */}
      <style>{`@keyframes toast-spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Feedback</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Toast</h1>
          <Lead>
            A <strong>transient notification</strong> that appears briefly to inform the user of a system event — a successful save, a failed upload, a background process completing — without interrupting their workflow.
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
                fontFamily: 'inherit',
              }}>
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: th.color, marginRight: 5, verticalAlign: 'middle' }} />
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live demo */}
        <ToastLive />

        <Divider />

        {/* ══ Overview ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <P>
          Toasts are <strong>non-blocking</strong> alerts anchored to a corner of the viewport (typically bottom-right). They auto-dismiss after a few seconds and can optionally be dismissed manually. They are always themed dark (<Code>#1c252e</Code> background) regardless of the app's light/dark mode, giving them a consistent visual weight.
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Confirming a completed action (save, send, copy)',
              'Reporting a background error that didn\'t block the user',
              'Signaling an in-progress operation (upload, sync)',
              'Delivering low-priority system messages',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Errors that require user action → use an inline error or modal',
              'Confirmations before a destructive action → use a dialog',
              'Persistent status that the user may need to reference → use a banner',
              'Form validation messages → use inline field-level errors',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Anatomy ═══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <Lead>A toast has four distinct regions, each serving a specific purpose.</Lead>

        {/* Annotated toast */}
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '28px 32px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Annotated visual — dark toast on light bg = light UI context */}
            <div style={{ position: 'relative', maxWidth: 420 }}>
              <ToastItem type="success" title="Changes saved" description="Your profile was updated successfully." actionLabel="Undo" variant="dark" />
              {/* Annotation labels */}
              <div style={{ position: 'absolute', top: -22, left: 8, fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>① Icon box</div>
              <div style={{ position: 'absolute', top: -22, left: 70, fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>② Content</div>
              <div style={{ position: 'absolute', top: -22, right: 48, fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>③ Action</div>
              <div style={{ position: 'absolute', top: -22, right: 4, fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>④ Close</div>
            </div>
          </div>
          {/* Legend */}
          <div style={{ padding: '16px 24px', background: 'var(--bg-primary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
            {[
              ['① Left border',  '3px colored stripe — communicates the type at a glance, even before reading the title.'],
              ['② Icon box',     '48×48px rounded container (radius 10). Colored background at 25% opacity + 24px icon.'],
              ['③ Content area', 'Title (white, 16px medium) and optional description (grey, 14px) for added context.'],
              ['④ Action link',  'Optional single text-link in brand blue. Use for quick undo or navigation.'],
              ['⑤ Close button', 'Optional × to dismiss. Always include for toasts without auto-dismiss.'],
            ].map(([name, desc]) => (
              <div key={name} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', minWidth: 100, flexShrink: 0 }}>{name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Types ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="types" />
        <H2>Types</H2>
        <Lead>
          Five semantic types map directly to a specific intent. The type drives the left border color, icon background, and icon color.
        </Lead>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 12, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { type: 'success', title: 'File exported',       description: 'report-2024-q4.xlsx was downloaded to your device.' },
            { type: 'danger',  title: 'Deletion failed',     description: 'The record is referenced by 3 other items.' },
            { type: 'warning', title: 'Session expiring',    description: 'Your session will expire in 5 minutes. Save your work.' },
            { type: 'info',    title: 'Update available',    description: 'Version 3.2.0 is ready. Refresh to apply.' },
            { type: 'loading', title: 'Syncing records',     description: 'Importing 1 402 rows — this may take a moment.' },
          ].map(cfg => (
            <ToastItem key={cfg.type} type={cfg.type} title={cfg.title} description={cfg.description} dismissible={false} variant="dark" />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 12 }}>
          {[
            { type: 'success', label: 'Success', color: '#02bf2b', note: 'Completed action' },
            { type: 'danger',  label: 'Danger',  color: '#f6643f', note: 'Failed action' },
            { type: 'warning', label: 'Warning', color: '#f6873f', note: 'Potential issue' },
            { type: 'info',    label: 'Info',    color: '#0190f6', note: 'Neutral update' },
            { type: 'loading', label: 'Loading', color: '#919eab', note: 'In-progress' },
          ].map(cfg => (
            <div key={cfg.type} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '10px 12px', borderLeft: `3px solid ${cfg.color}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{cfg.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{cfg.note}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Variants ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="variants" />
        <H2>Variants</H2>
        <Lead>
          The four structural variants can be combined freely. Pick only the elements you need — a title alone is often sufficient.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* No close button */}
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '16px', background: '#0f1923' }}>
              <ToastItem type="info" title="Auto-dismissed in 4 s" dismissible={false} />
            </div>
            <div style={{ padding: '10px 14px', background: 'var(--bg-primary)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 4 }}>No close button</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>Use for auto-dismiss toasts where manual dismissal is unnecessary.</div>
            </div>
          </div>

          {/* With description */}
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '16px', background: '#0f1923' }}>
              <ToastItem type="success" title="Report generated" description="Your Q4 report is ready to download." dismissible={false} />
            </div>
            <div style={{ padding: '10px 14px', background: 'var(--bg-primary)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 4 }}>With description</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>Add a description when the title alone lacks enough context for the user to act.</div>
            </div>
          </div>

          {/* With action link */}
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '16px', background: '#0f1923' }}>
              <ToastItem type="danger" title="5 items deleted" actionLabel="Undo" />
            </div>
            <div style={{ padding: '10px 14px', background: 'var(--bg-primary)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 4 }}>With action link</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>A single text link for reversible actions (Undo) or quick navigation (View). Never more than one action.</div>
            </div>
          </div>

          {/* Long message */}
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '16px', background: '#0f1923' }}>
              <ToastItem type="warning" title="Configuration mismatch detected" description="The deployment target differs from the last known environment. Review settings before continuing." dismissible={false} />
            </div>
            <div style={{ padding: '10px 14px', background: 'var(--bg-primary)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 4 }}>Long message</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>The card stretches vertically; the icon box remains top-aligned. Keep description under 3 lines.</div>
            </div>
          </div>

        </div>

        <Divider />

        {/* ══ Stacking ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="stacking" />
        <H2>Stacking</H2>
        <Lead>
          When multiple toasts are queued, they collapse into a stacked view — newest toast on top, older toasts peek below. Hover to expand up to 3 toasts; click <em>"x more notifications"</em> to reveal all.
        </Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '40px 24px 32px', background: 'var(--bg-secondary)' }}>
            <ToastStack />
          </div>
          <div style={{ padding: '12px 20px', background: 'var(--bg-primary)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Collapsed',     desc: 'Top toast visible, 2 ghost toasts peek below at reduced scale.' },
              { label: 'Hover',         desc: 'Stack expands into a vertical list showing up to 3 toasts.' },
              { label: '"x more" pill', desc: 'Shown when >3 toasts queued. Click to reveal all remaining.' },
            ].map(row => (
              <div key={row.label} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 2 }}>{row.label}</strong>
                {row.desc}
              </div>
            ))}
          </div>
        </div>

        <InfoBox type="info">
          Hover the stack above to see the expand interaction. The "x more notifications" pill appears when more than 3 toasts are queued; clicking it reveals all of them.
        </InfoBox>
        <P>
          Limit automatic expansion to <strong>3 toasts</strong>. If a fourth arrives, the oldest drops off the queue. The "x more" pill is a safety valve — not a default UI.
        </P>

        <Divider />

        {/* ══ Usage ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>
        <Lead>Follow these rules to keep toasts useful and trustworthy.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <DoBox
            visual={
              <div style={{ background: '#0f1923', borderRadius: 8, padding: 12, width: '100%' }}>
                <ToastItem type="success" title="Draft saved" dismissible={false} />
              </div>
            }
          >
            Use a short, <strong>action-confirming title</strong> in past tense. "Draft saved", "Link copied", "File deleted".
          </DoBox>
          <DontBox
            visual={
              <div style={{ background: '#0f1923', borderRadius: 8, padding: 12, width: '100%' }}>
                <ToastItem type="success" title="The operation was completed. Please check your recent activity to verify the result." dismissible={false} />
              </div>
            }
          >
            Do not write <strong>paragraphs in the title</strong>. Keep it to a single short sentence. Use the description for context.
          </DontBox>
          <DoBox
            visual={
              <div style={{ background: '#0f1923', borderRadius: 8, padding: 12, width: '100%' }}>
                <ToastItem type="danger" title="Export failed" description="Check your internet connection and try again." actionLabel="Retry" />
              </div>
            }
          >
            For <strong>recoverable errors</strong>, provide a single action link (Retry, Undo) so the user can act immediately.
          </DoBox>
          <DontBox
            visual={
              <div style={{ background: '#0f1923', borderRadius: 8, padding: 12, width: '100%' }}>
                <ToastItem type="danger" title="Export failed" actionLabel="Retry" />
              </div>
            }
          >
            Do not use <strong>danger type for non-errors</strong>. Reserve danger for genuine failures, not warnings or neutral updates.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DoBox>
            Always <strong>auto-dismiss</strong> success and info toasts after 4–6 seconds. Loading toasts should persist until the operation completes.
          </DoBox>
          <DontBox>
            Never stack more than <strong>3 toasts</strong> at once. Queue additional ones and surface them as earlier toasts are dismissed.
          </DontBox>
          <DoBox>
            Place toasts in a <strong>fixed corner</strong> of the viewport (bottom-right on desktop, bottom-center on mobile) so users develop a spatial memory for them.
          </DoBox>
          <DontBox>
            Do not use toasts for <strong>critical errors</strong> that block the user from continuing. Those belong in a Dialog or an inline alert.
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <Lead>
          Two realistic scenarios — a successful save and a failed upload — showing how toasts fit into a typical workflow.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Save success */}
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Save: success</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>User clicks "Save profile" — server confirms.</div>
            </div>
            {/* Fake form UI */}
            <div style={{ padding: '16px', background: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <div style={{ height: 32, borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)' }} />
                <div style={{ height: 32, borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)' }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ height: 30, width: 100, borderRadius: 6, background: 'var(--brand-600)', opacity: 0.9 }} />
                </div>
              </div>
              <div style={{ background: '#0f1923', borderRadius: 8, padding: 10 }}>
                <ToastItem type="success" title="Profile saved" description="Your changes are now live." dismissible={false} />
              </div>
            </div>
          </div>

          {/* Upload error */}
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>File upload: error</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>User uploads a file — server rejects it (size limit).</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <div style={{ height: 56, borderRadius: 8, background: 'var(--bg-secondary)', border: '2px dashed var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>report-final-v2-FINAL.xlsx (68 MB)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ height: 30, width: 100, borderRadius: 6, background: '#6b7280', opacity: 0.6 }} />
                </div>
              </div>
              <div style={{ background: '#0f1923', borderRadius: 8, padding: 10 }}>
                <ToastItem type="danger" title="Upload failed" description="File exceeds the 50 MB limit. Compress and retry." actionLabel="Retry" dismissible={false} />
              </div>
            </div>
          </div>

        </div>

        {/* Loading → success sequence */}
        <H3>Loading to success sequence</H3>
        <P>
          When an async operation starts, show a loading toast. Replace it with a success or danger toast once the result is known. Never show both simultaneously.
        </P>
        <div style={{ background: '#0f1923', borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#4b5a68', minWidth: 60 }}>Step 1</div>
            <div style={{ flex: 1 }}>
              <ToastItem type="loading" title="Syncing 1 402 records…" dismissible={false} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#4b5a68', minWidth: 60 }}>Step 2</div>
            <div style={{ flex: 1 }}>
              <ToastItem type="success" title="Sync complete" description="1 402 records updated — last synced just now." dismissible={false} />
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ Accessibility ═════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <Lead>Toasts must be perceivable and operable without sight or a pointer.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            ['role="status"',        'Use on the toast container for success / info / loading types. Screen readers announce the content politely when it appears.'],
            ['role="alert"',         'Use for danger and warning toasts. Triggers an immediate, assertive announcement — use sparingly.'],
            ['aria-live="polite"',   'Applied to the toast region. Queues announcements so they don\'t interrupt in-progress reading.'],
            ['aria-label on close',  'The × button must carry aria-label="Dismiss notification" (or a more specific label) since it has no visible text.'],
            ['Focus management',     'Do not steal keyboard focus when a toast appears. Users should be able to Tab into the toast region to reach the close button and action link.'],
            ['Auto-dismiss timing',  'Success toasts: 5 s. Info: 5 s. Warning: 8 s (user may need to read). Loading: no auto-dismiss. Danger: no auto-dismiss. Always respect prefers-reduced-motion.'],
          ].map(([term, desc]) => (
            <div key={term} style={{ display: 'flex', gap: 16, alignItems: 'baseline', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <code style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--brand-600)', minWidth: 160, flexShrink: 0 }}>{term}</code>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
            </div>
          ))}
        </div>

        <InfoBox type="warning">
          Never rely on color alone to communicate toast type. The icon and the title text must convey the same information as the stroke/icon color for users with color vision deficiency.
        </InfoBox>

        <Divider />

        {/* ══ Token reference ═══════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>
          All toast visual properties are driven by the <Code>toast.*</Code> token set. The values below reflect the DOT theme.
        </Lead>
        <TokenTable tokens={TOAST_TOKENS_STATIC} prefix="toast" />

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
        <BrandThemeSwitcher />
      </div>

    </div>
  )
}
