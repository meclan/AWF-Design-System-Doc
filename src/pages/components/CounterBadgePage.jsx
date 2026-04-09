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
        <div style={{ padding: '16px 18px', background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 72 }}>
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
        <div style={{ padding: '16px 18px', background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 72 }}>
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

// ─── Counter badge config ─────────────────────────────────────────────────────

function getColorConfig(t) {
  return {
    dark:    { bg: t['badge.counter.bg.dark']    || '#141a21', text: t['badge.counter.text.inverse'] || '#ffffff', label: 'Dark'    },
    neutral: { bg: t['badge.counter.bg.neutral'] || '#c4cdd5', text: t['badge.counter.text.inverse'] || '#141a21', label: 'Neutral' },
    light:   { bg: t['badge.counter.bg.light']   || '#ffffff', text: t['badge.counter.text.inverse'] || '#141a21', label: 'Light', border: '#e0e5ea' },
    brand:   { bg: t['badge.counter.bg.brand']   || '#07a2b6', text: t['badge.counter.text.default'] || '#ffffff', label: 'Brand'   },
    success: { bg: t['badge.counter.bg.success'] || '#02bf2b', text: '#ffffff', label: 'Success' },
    warning: { bg: t['badge.counter.bg.warning'] || '#f6873f', text: '#ffffff', label: 'Warning' },
    danger:  { bg: t['badge.counter.bg.danger']  || '#f6643f', text: '#ffffff', label: 'Danger'  },
  }
}

const SIZE_CONFIG = {
  lg: { height: 32, minWidth: 32, fontSize: 14, paddingX: 8  },
  md: { height: 24, minWidth: 24, fontSize: 12, paddingX: 6  },
  sm: { height: 16, minWidth: 16, fontSize: 10, paddingX: 4  },
}

// Bell icon (MUI NotificationsRounded)
const BELL_PATH = 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z'
// Mail icon (MUI MailRounded)
const MAIL_PATH = 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z'
// Cart icon (MUI ShoppingCartRounded)
const CART_PATH = 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7.5 17H19v-2H7.84c-.17 0-.3-.13-.3-.3l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2z'
// Chat icon (MUI ChatRounded)
const CHAT_PATH = 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z'

function MuiSvg({ path, size = 20, color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

// ─── CounterBadge component ───────────────────────────────────────────────────

function CounterBadge({ color = 'dark', size = 'md', count = 3, overflow = false, colorConfig = {} }) {
  const cfg = colorConfig[color] || colorConfig.dark || {}
  const sz  = SIZE_CONFIG[size]  || SIZE_CONFIG.md

  const label = overflow ? '99+' : count > 99 ? '99+' : String(count)

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: sz.minWidth, height: sz.height,
      padding: count === 1 ? 0 : `0 ${sz.paddingX}px`,
      borderRadius: 100,
      background: cfg.bg,
      color: cfg.text,
      fontSize: sz.fontSize,
      fontWeight: 400,
      lineHeight: 1,
      boxShadow: '0px 4px 8px rgba(0,0,0,0.25)',
      border: cfg.border ? `1px solid ${cfg.border}` : 'none',
      boxSizing: 'border-box',
      whiteSpace: 'nowrap',
      userSelect: 'none',
    }}>
      {label}
    </span>
  )
}

// ─── IconWithBadge — shows overlay positioning ────────────────────────────────

function IconWithBadge({ iconPath, badgeColor, badgeSize, count, label, colorConfig }) {
  const sz = SIZE_CONFIG[badgeSize] || SIZE_CONFIG.md
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <MuiSvg path={iconPath} size={22} color="currentColor" />
        </div>
        <span style={{ position: 'absolute', top: -(sz.height / 2 - 4), right: -(sz.minWidth / 2 - 4) }}>
          <CounterBadge color={badgeColor} size={badgeSize} count={count} colorConfig={colorConfig} />
        </span>
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</span>
    </div>
  )
}

// ─── Live preview ─────────────────────────────────────────────────────────────

function CounterBadgeLive({ colorConfig = {} }) {
  const [color,    setColor]    = useState('dark')
  const [size,     setSize]     = useState('md')
  const [count,    setCount]    = useState(3)
  const [overflow, setOverflow] = useState(false)

  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ padding: '32px 24px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, minHeight: 100 }}>
        {/* Standalone */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <CounterBadge color={color} size={size} count={count} overflow={overflow} colorConfig={colorConfig} />
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>standalone</span>
        </div>
        {/* On icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-primary)', border: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <MuiSvg path={BELL_PATH} size={22} />
            </div>
            <span style={{ position: 'absolute', top: -6, right: -6 }}>
              <CounterBadge color={color} size={size} count={count} overflow={overflow} colorConfig={colorConfig} />
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>on icon</span>
        </div>
      </div>
      <div style={{ padding: '16px 20px', background: 'var(--bg-primary)', borderTop: '1px solid var(--stroke-primary)', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Color */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Color</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {Object.keys(colorConfig).map(c => (
              <button key={c} onClick={() => setColor(c)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${color === c ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
                background: color === c ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: color === c ? 'var(--brand-600)' : 'var(--text-secondary)',
                fontWeight: color === c ? 600 : 400,
              }}>{c}</button>
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
        {/* Count */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Count</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 5, 12, 99, 100].map(n => (
              <button key={n} onClick={() => { setCount(n); setOverflow(false) }} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${count === n && !overflow ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
                background: count === n && !overflow ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: count === n && !overflow ? 'var(--brand-600)' : 'var(--text-secondary)',
                fontWeight: count === n && !overflow ? 600 : 400,
              }}>{n}</button>
            ))}
            <button onClick={() => setOverflow(true)} style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${overflow ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
              background: overflow ? 'var(--brand-50)' : 'var(--bg-secondary)',
              color: overflow ? 'var(--brand-600)' : 'var(--text-secondary)',
              fontWeight: overflow ? 600 : 400,
            }}>99+</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TOC ──────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',   label: 'Overview'       },
  { id: 'anatomy',    label: 'Anatomy'        },
  { id: 'colors',     label: 'Colors'         },
  { id: 'sizes',      label: 'Sizes'          },
  { id: 'overflow',   label: 'Overflow'       },
  { id: 'positioning',label: 'Positioning'    },
  { id: 'usage',      label: 'Usage rules'    },
  { id: 'usecase',    label: 'Use case'       },
  { id: 'a11y',       label: 'Accessibility'  },
  { id: 'tokens',     label: 'Token reference'},
]

const COUNTER_TOKENS_STATIC = {
  'badge.number.bg.dark':         '#141a21',
  'badge.number.bg.neutral':      '#c4cdd5',
  'badge.number.bg.light':        '#ffffff',
  'badge.number.bg.brand':        '#07a2b6',
  'badge.number.bg.success':      '#02bf2b',
  'badge.number.bg.warning':      '#f6873f',
  'badge.number.bg.danger':       '#f6643f',
  'badge.number.text.default':    '#ffffff',
  'badge.number.text.dark':       '#141a21',
  'badge.number.radius':          '100px',
  'badge.number.shadow':          '0px 4px 8px rgba(0,0,0,0.25)',
  'badge.number.font-weight':     '400',
  'badge.number.size.lg.height':  '32px',
  'badge.number.size.lg.font-size': '14px',
  'badge.number.size.md.height':  '24px',
  'badge.number.size.md.font-size': '12px',
  'badge.number.size.sm.height':  '16px',
  'badge.number.size.sm.font-size': '10px',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CounterBadgePage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

  const t = getComponentTokens(activeTheme)
  const colorConfig = getColorConfig(t)

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
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Counter Badge</h1>
          <Lead>
            A <strong>small numeric overlay</strong> placed on top of an icon, button, or avatar to indicate a count — unread messages, pending tasks, or queued notifications. Counter badges are always positioned absolutely relative to their host element.
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
        <CounterBadgeLive colorConfig={colorConfig} />

        <Divider />

        {/* ══ Overview ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <P>
          Counter badges are <strong>floating numeric labels</strong> that sit at the corner of an icon or UI element. They are always positioned absolutely — never inline with text. Their primary job is to direct attention toward a quantity that needs the user's focus, such as the number of unread notifications or items pending review.
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Unread notification or message counts on nav icons',
              'Pending item totals on cart or inbox icons',
              'Task queue depth overlaid on an avatar or button',
              'Alert counts on a dashboard widget header',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Semantic status of a record → use Status Badge',
              'Dismissible labels or filters → use Tag',
              'Large numeric values that need context → use a stat card',
              'Inline with body text or table cells → use a plain number',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Anatomy ═══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <Lead>A counter badge is a single pill element positioned at the corner of a host element.</Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '40px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60 }}>
            {/* Annotated badge on icon */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-primary)', border: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  <MuiSvg path={BELL_PATH} size={24} />
                </div>
                <span style={{ position: 'absolute', top: -8, right: -8 }}>
                  <CounterBadge color="dark" size="md" count={4} colorConfig={colorConfig} />
                </span>
              </div>
              {/* Annotations */}
              <div style={{ position: 'absolute', top: -30, right: -20, fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>① Count</div>
              <div style={{ position: 'absolute', bottom: -22, left: 6, fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>② Host element</div>
            </div>
          </div>
          <div style={{ padding: '16px 24px', background: 'var(--bg-primary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
            {[
              ['① Count',        'The number displayed. Caps at 99 — values above show "99+". A dot (no number) may be used for zero-count presence signals.'],
              ['② Host element', 'The icon, button, or avatar the badge overlays. Must have position: relative to anchor the badge correctly.'],
              ['Pill shape',     'Always circular when the count is 1 digit (minWidth = height). Stretches horizontally for 2+ digits.'],
              ['Shadow',         '0px 4px 8px rgba(0,0,0,0.25) — lifts the badge above the host element and keeps it legible on any surface.'],
            ].map(([name, desc]) => (
              <div key={name} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', minWidth: 100, flexShrink: 0 }}>{name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Colors ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="colors" />
        <H2>Colors</H2>
        <Lead>Seven color options — from neutral to semantic — let the badge match the urgency and surface it sits on.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { color: 'dark',    desc: 'Default. Strong contrast on any light surface. The safest choice when urgency is neutral.' },
            { color: 'neutral', desc: 'Subtle grey. Use when the count is informational and should not alarm.' },
            { color: 'light',   desc: 'White with a subtle border. For use on dark-background surfaces.' },
            { color: 'brand',   desc: 'Brand teal. Use to tie the count to a primary brand action (e.g., cart, inbox).' },
            { color: 'success', desc: 'Green. Signals a positive count — completed items, resolved alerts.' },
            { color: 'warning', desc: 'Amber. Signals a count that needs attention but is not yet critical.' },
            { color: 'danger',  desc: 'Red. Signals urgency — unread critical alerts, overdue items.' },
          ].map(row => (
            <div key={row.color} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 16px', background: row.color === 'light' ? '#e5e7eb' : 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <CounterBadge color={row.color} size="md" count={3} colorConfig={colorConfig} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{colorConfig[row.color]?.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{row.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Sizes ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="sizes" />
        <H2>Sizes</H2>
        <Lead>Three sizes scale with the host icon — always pick the size that keeps the badge proportional.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { size: 'lg', hostSize: 56, iconSize: 28, desc: '32px height · 14px font — use on large icons (56px+), avatar overlays, or prominent action buttons.' },
            { size: 'md', hostSize: 40, iconSize: 22, desc: '24px height · 12px font — default. Use on standard 40px nav icons and toolbar buttons.' },
            { size: 'sm', hostSize: 28, iconSize: 16, desc: '16px height · 10px font — use on compact icons (28px or smaller) in dense interfaces.' },
          ].map(row => (
            <div key={row.size} style={{ display: 'grid', gridTemplateColumns: '60px 80px 1fr', gap: 16, alignItems: 'center', padding: '14px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>{row.size}</div>
              <div style={{ position: 'relative', display: 'inline-flex', width: row.hostSize, height: row.hostSize }}>
                <div style={{ width: row.hostSize, height: row.hostSize, borderRadius: 10, background: 'var(--bg-primary)', border: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  <MuiSvg path={BELL_PATH} size={row.iconSize} />
                </div>
                <span style={{ position: 'absolute', top: -6, right: -8 }}>
                  <CounterBadge color="dark" size={row.size} count={5} colorConfig={colorConfig} />
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{row.desc}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Overflow ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="overflow" />
        <H2>Overflow</H2>
        <Lead>Counts above 99 display as "99+" to prevent the badge from growing too wide.</Lead>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '24px', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 20 }}>
          {[1, 9, 12, 42, 99].map(n => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <CounterBadge color="dark" size="md" count={n} colorConfig={colorConfig} />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{n}</span>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <CounterBadge color="dark" size="md" count={100} colorConfig={colorConfig} />
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>100 → 99+</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <CounterBadge color="dark" size="md" count={999} colorConfig={colorConfig} />
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>999 → 99+</span>
          </div>
        </div>

        <P>The "99+" string is a fixed label — do not display the actual count in a tooltip or adjacent text unless your use case genuinely requires precision (e.g., a data table header).</P>

        <Divider />

        {/* ══ Positioning ═══════════════════════════════════════════════════════ */}
        <SectionAnchor id="positioning" />
        <H2>Positioning</H2>
        <Lead>Counter badges always sit at the top-right corner of their host element. Use CSS position: absolute on the badge inside a position: relative host.</Lead>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '28px 24px', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 20 }}>
          <IconWithBadge iconPath={BELL_PATH}  badgeColor="danger"  badgeSize="md" count={4}  label="Notifications" colorConfig={colorConfig} />
          <IconWithBadge iconPath={MAIL_PATH}  badgeColor="brand"   badgeSize="md" count={12} label="Messages" colorConfig={colorConfig} />
          <IconWithBadge iconPath={CART_PATH}  badgeColor="dark"    badgeSize="md" count={3}  label="Cart" colorConfig={colorConfig} />
          <IconWithBadge iconPath={CHAT_PATH}  badgeColor="success" badgeSize="md" count={99} label="Chat" colorConfig={colorConfig} />
        </div>

        <H3>CSS recipe</H3>
        <div style={{ background: '#1c252e', borderRadius: 8, padding: '16px 20px', marginBottom: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.75, color: '#c4cdd5', overflowX: 'auto' }}>
          <div><span style={{ color: '#637381' }}>{'/* Host element */'}</span></div>
          <div><span style={{ color: '#0190f6' }}>.icon-wrapper</span> {'{'}</div>
          <div>{'  '}<span style={{ color: '#02bf2b' }}>position</span>{': relative;'}</div>
          <div>{'  '}<span style={{ color: '#02bf2b' }}>display</span>{': inline-flex;'}</div>
          <div>{'}'}</div>
          <div style={{ marginTop: 8 }}><span style={{ color: '#637381' }}>{'/* Counter badge */'}</span></div>
          <div><span style={{ color: '#0190f6' }}>.counter-badge</span> {'{'}</div>
          <div>{'  '}<span style={{ color: '#02bf2b' }}>position</span>{': absolute;'}</div>
          <div>{'  '}<span style={{ color: '#02bf2b' }}>top</span>{': -8px;'}</div>
          <div>{'  '}<span style={{ color: '#02bf2b' }}>right</span>{': -8px;'}</div>
          <div>{'}'}</div>
        </div>

        <InfoBox type="info">
          Adjust the <Code>top</Code> and <Code>right</Code> offset based on the badge size — sm badges use -4px, md use -8px, lg use -10px. The badge should overlap the host's corner, not float away from it.
        </InfoBox>

        <Divider />

        {/* ══ Usage ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>
        <Lead>Counter badges are high-attention elements — use them deliberately.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <DoBox
            visual={
              <IconWithBadge iconPath={BELL_PATH} badgeColor="danger" badgeSize="md" count={3} label="Alerts" colorConfig={colorConfig} />
            }
          >
            Use <strong>danger</strong> color for counts representing errors or critical alerts. The red color signals urgency immediately.
          </DoBox>
          <DontBox
            visual={
              <IconWithBadge iconPath={BELL_PATH} badgeColor="success" badgeSize="md" count={3} label="Alerts" colorConfig={colorConfig} />
            }
          >
            Do not use <strong>success</strong> color for alert counts. Green implies a positive state, which contradicts an unresolved alert.
          </DontBox>
          <DoBox
            visual={
              <div style={{ display: 'flex', gap: 24 }}>
                <IconWithBadge iconPath={BELL_PATH} badgeColor="dark" badgeSize="sm" count={2} label="sm on small" colorConfig={colorConfig} />
                <IconWithBadge iconPath={CART_PATH}  badgeColor="dark" badgeSize="md" count={2} label="md on medium" colorConfig={colorConfig} />
              </div>
            }
          >
            Match the badge size to the <strong>host icon size</strong>. A large badge on a small icon dominates the layout.
          </DoBox>
          <DontBox
            visual={
              <IconWithBadge iconPath={BELL_PATH} badgeColor="dark" badgeSize="lg" count={2} label="lg on small" colorConfig={colorConfig} />
            }
          >
            Do not put a <strong>large badge on a small icon</strong>. The badge should complement the host, not overpower it.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DoBox>
            Cap displayed counts at <strong>99</strong> and show "99+" for anything above. Displaying raw large numbers (e.g., 2 841) in a tiny badge is illegible.
          </DoBox>
          <DontBox>
            Do not show a counter badge with a count of <strong>0</strong>. Either hide the badge entirely, or replace it with a dot-only presence indicator.
          </DontBox>
          <DoBox>
            Place the badge at the <strong>top-right corner</strong> of the host element consistently across the entire application.
          </DoBox>
          <DontBox>
            Never place a counter badge <strong>inline with text</strong> or inside a paragraph. It is an overlay element only.
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <Lead>Counter badges in a real navigation bar and a notification panel.</Lead>

        {/* Nav bar mockup */}
        <H3>Navigation bar</H3>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '12px 20px', background: '#1c252e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>ARCAD</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {[
                { icon: CHAT_PATH,  count: 7,  color: 'brand' },
                { icon: BELL_PATH,  count: 3,  color: 'danger' },
                { icon: CART_PATH,  count: 12, color: 'dark' },
              ].map((item, i) => (
                <div key={i} style={{ position: 'relative', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4cdd5', cursor: 'pointer' }}>
                  <MuiSvg path={item.icon} size={20} />
                  <span style={{ position: 'absolute', top: -4, right: -4 }}>
                    <CounterBadge color={item.color} size="sm" count={item.count} colorConfig={colorConfig} />
                  </span>
                </div>
              ))}
              <div style={{ width: 32, height: 32, borderRadius: 999, background: '#0190f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>JD</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '10px 16px', background: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-tertiary)' }}>
            Counter badges on nav icons: chat (brand), alerts (danger), cart (dark/neutral).
          </div>
        </div>

        {/* Notification panel */}
        <H3>Notification panel header</H3>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
              <CounterBadge color="danger" size="md" count={3} colorConfig={colorConfig} />
            </div>
            <span style={{ fontSize: 12, color: '#0190f6', cursor: 'pointer' }}>Mark all read</span>
          </div>
          {[
            { title: 'Deployment failed', time: '2 min ago',   color: 'danger'  },
            { title: 'New comment on #4421', time: '14 min ago', color: 'brand' },
            { title: 'Backup completed',  time: '1 h ago',    color: 'success' },
          ].map((notif, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < 2 ? '1px solid var(--stroke-primary)' : 'none', background: 'var(--bg-primary)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: colorConfig[notif.color]?.bg, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{notif.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{notif.time}</div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Accessibility ═════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <Lead>Counter badges are visually prominent but invisible to screen readers without explicit annotation.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            ['aria-label on host',  'Add aria-label="X notifications" to the parent icon button. "Notifications (3)" is better than a bare icon — the count is included in the label.'],
            ['Live region',         'Wrap the badge in aria-live="polite" aria-atomic="true" so count changes are announced without requiring focus.'],
            ['Don\'t read the badge', 'Apply aria-hidden="true" to the <span> containing the badge number — the count is already embedded in the host\'s aria-label.'],
            ['Color only',          'Color alone must never distinguish badge meaning (e.g., danger from brand). The host element\'s label must convey context.'],
            ['Focus',               'The badge itself is never focusable. Only the host icon button receives focus.'],
          ].map(([term, desc]) => (
            <div key={term} style={{ display: 'flex', gap: 16, alignItems: 'baseline', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <code style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--brand-600)', minWidth: 180, flexShrink: 0 }}>{term}</code>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
            </div>
          ))}
        </div>

        <InfoBox type="info">
          The recommended pattern: <Code>{'<button aria-label="Notifications (3)">'}</Code> with <Code>{'<span aria-hidden="true">3</span>'}</Code> inside the badge. The button label conveys both the action and the count.
        </InfoBox>

        <Divider />

        {/* ══ Token reference ═══════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>All counter badge visual properties map to the <Code>badge.number.*</Code> token set.</Lead>
        <TokenTable tokens={t} prefix="badge.counter" />

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
