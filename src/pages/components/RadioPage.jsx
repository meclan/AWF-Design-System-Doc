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

// ─── Static Radio button renderer ─────────────────────────────────────────────
// The "checked" visual uses a thick border technique — no separate inner dot.
// white background + thick brand border → inner white circle = "dot" illusion.

function RBtn({ checked = false, disabled = false, hover = false, size = 24, t }) {
  const uncheckedBw = t['radio.stroke.unchecked.width'] || 1.5
  // Scale checked border proportionally from 24px base (token value = 6)
  const checkedBwBase = t['radio.stroke.checked.width'] || 6
  const checkedBw = Math.round(checkedBwBase * (size / 24))

  const borderWidth = checked ? checkedBw : uncheckedBw
  const borderColor = checked
    ? (disabled ? t['radio.stroke.checked.disabled'] : t['radio.stroke.checked.default'])
    : (disabled ? t['radio.stroke.unchecked.disabled'] : hover ? t['radio.stroke.unchecked.hover'] : t['radio.stroke.unchecked.default-brand'])

  const bg = disabled
    ? 'transparent'
    : checked
      ? t['radio.bg.checked.default']
      : hover ? t['radio.bg.unchecked.hover'] : t['radio.bg.unchecked.default']

  const ringSize = Math.round(size / 4)
  const boxShadow = hover && !disabled ? `0 0 0 ${ringSize}px ${t['radio.hover-shadow']}` : 'none'

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      border: `${borderWidth}px solid ${borderColor || 'transparent'}`,
      boxSizing: 'border-box',
      flexShrink: 0,
      boxShadow,
      transition: 'background .12s, box-shadow .12s, border-width .12s',
    }} />
  )
}

// ─── Interactive live Radio (module-level for hooks) ──────────────────────────

function RBtnLive({ checked, onChange, size = 24, t, label, sublabel, disabled = false }) {
  const [hov, setHov] = useState(false)
  const labelColor = disabled ? t['radio.label-disabled'] : t['radio.label']

  return (
    <div
      onClick={!disabled ? onChange : undefined}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: sublabel ? 'flex-start' : 'center', gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none',
      }}
    >
      <div style={{ paddingTop: sublabel ? 2 : 0 }}>
        <RBtn checked={checked} disabled={disabled} hover={hov} size={size} t={t} />
      </div>
      {(label || sublabel) && (
        <div>
          {label && <div style={{ fontSize: size === 20 ? 12 : 14, color: labelColor, lineHeight: 1.4, fontWeight: checked ? 500 : 400 }}>{label}</div>}
          {sublabel && <div style={{ fontSize: 12, color: disabled ? t['radio.label-disabled'] : 'var(--text-tertiary)', lineHeight: 1.4, marginTop: 2 }}>{sublabel}</div>}
        </div>
      )}
    </div>
  )
}

// ─── State grid card ──────────────────────────────────────────────────────────

function RadioStateCard({ title, desc, t, size = 24 }) {
  const rows = [
    { label: 'Unchecked', checked: false },
    { label: 'Checked',   checked: true  },
  ]
  const cols = [
    { label: 'Default',  hover: false, disabled: false },
    { label: 'Hover',    hover: true,  disabled: false },
    { label: 'Disabled', hover: false, disabled: true  },
  ]

  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
      {(title || desc) && (
        <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
          {title && <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: desc ? 2 : 0 }}>{title}</div>}
          {desc && <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>}
        </div>
      )}
      <div style={{ padding: '20px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(3, 1fr)', marginBottom: 10, alignItems: 'center' }}>
          <div />
          {cols.map(c => (
            <div key={c.label} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', textAlign: 'center' }}>{c.label}</div>
          ))}
        </div>
        {rows.map(row => (
          <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '120px repeat(3, 1fr)', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', fontWeight: 500 }}>{row.label}</div>
            {cols.map(col => (
              <div key={col.label} style={{ display: 'flex', justifyContent: 'center', padding: '14px 0' }}>
                <RBtn checked={row.checked} hover={col.hover} disabled={col.disabled} size={size} t={t} />
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
                {isHex ? <span style={{ width: 18, height: 18, borderRadius: '50%', background: value, border: '1px solid rgba(0,0,0,.12)', display: 'inline-block' }} /> : <span />}
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
  { id: 'overview', label: 'Overview' },
  { id: 'states',   label: 'States' },
  { id: 'group',    label: 'Radio group' },
  { id: 'sizes',    label: 'Sizes' },
  { id: 'usage',    label: 'Usage rules' },
  { id: 'usecase',  label: 'Use case' },
  { id: 'a11y',     label: 'Accessibility' },
  { id: 'tokens',   label: 'Token reference' },
]

// ─── Pricing plans for use case demo ─────────────────────────────────────────

const PLANS = [
  { id: 'free',       label: 'Free',       price: '$0',   period: '/month',  desc: 'Up to 3 projects, 1 GB storage',   badge: null },
  { id: 'starter',    label: 'Starter',    price: '$9',   period: '/month',  desc: '20 projects, 10 GB, priority support', badge: 'Popular' },
  { id: 'pro',        label: 'Pro',        price: '$29',  period: '/month',  desc: 'Unlimited projects, 100 GB, API access', badge: null },
  { id: 'enterprise', label: 'Enterprise', price: 'Custom', period: '',     desc: 'SLA, SSO, dedicated support',        badge: null },
]

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard delivery',  sublabel: '3–5 business days' },
  { id: 'express',  label: 'Express delivery',   sublabel: '1–2 business days'  },
  { id: 'same',     label: 'Same-day delivery',  sublabel: 'Order before 12:00 pm'  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RadioPage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [activeSection, setActiveSection] = useState('overview')

  // Interactive demo
  const [demoVal,     setDemoVal]     = useState('starter')
  const [deliveryVal, setDeliveryVal] = useState('standard')
  const [groupHoriz,  setGroupHoriz]  = useState('b')

  const t = getComponentTokens(activeTheme)
  const theme = VISIBLE_THEMES.find(th => th.id === activeTheme) || VISIBLE_THEMES[0]

  const sizeMd = parseInt(t['radio.size-md']) || 24
  const sizeSm = parseInt(t['radio.size-sm']) || 20

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
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Forms</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Radio button</h1>
          <Lead>
            A single-select input control. Radio buttons are always used in a <strong>group</strong> — selecting one automatically deselects the previously active option. Exactly one option in the group is always selected.
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
          Radio buttons enforce a <strong>single selection</strong> within a group. They are the go-to control when a user must choose exactly one option from a visible list — and seeing all options simultaneously matters for the decision.
        </P>
        <P>
          The checked state is expressed through a <strong>thick-border technique</strong>: a white background surrounded by a thick brand-colored border creates the inner-dot illusion without a separate element. This keeps the component lightweight and fully token-driven.
        </P>

        {/* When to use / not */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Choosing one option from a small set (2–7 items)',
              'Options are mutually exclusive (selecting one voids others)',
              'All options should be visible without interaction (no dropdown)',
              'Users benefit from comparing options side-by-side',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Multiple selections needed → use Checkbox',
              'More than 7 options → use Select (dropdown) to save space',
              'Binary on/off preference → use Switch',
              'No "none" option is valid but user should be able to deselect → use Checkbox',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        {/* Anatomy */}
        <H3>Anatomy</H3>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ padding: '24px 32px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
            {/* Visual — annotated */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
              {/* Checked */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <RBtn checked size={sizeMd} t={t} />
                  <div style={{ position: 'absolute', left: -3, top: -3, width: sizeMd + 6, height: sizeMd + 6, border: '1.5px dashed #94a3b8', borderRadius: '50%', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.05em', textTransform: 'uppercase' }}>① Control</div>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ fontSize: 14, color: t['radio.label'], fontWeight: 500 }}>Selected option</span>
                  <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.05em', textTransform: 'uppercase' }}>② Label</div>
                </div>
              </div>
              {/* Unchecked */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                <RBtn checked={false} size={sizeMd} t={t} />
                <span style={{ fontSize: 14, color: t['radio.label'] }}>Another option</span>
              </div>
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 220 }}>
              {[
                ['① Control circle', 'Always circular. Unchecked = thin brand border. Checked = thick brand border + white bg (creates inner-dot illusion).'],
                ['② Label',          'Required. Positioned to the right of the control. Disabled state uses muted text color.'],
                ['  Sublabel',        'Optional secondary line for additional context (description, price, etc.).'],
                ['  Group',           'Radio buttons are never standalone. Always grouped under a shared field label.'],
              ].map(([name, desc]) => (
                <div key={name} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', minWidth: 110, flexShrink: 0 }}>{name}</span>
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
          Two value states — <strong>unchecked</strong> and <strong>checked</strong> — each with three interaction states: <strong>default</strong>, <strong>hover</strong>, and <strong>disabled</strong>.
        </Lead>

        <RadioStateCard
          title="All states"
          desc="The hover state shows the same radial ring as the Checkbox. The checked state uses a thick border (token: radio.stroke.checked.width) to render the inner dot without a separate SVG."
          t={t}
          size={sizeMd}
        />

        <InfoBox type="info">
          The checked state has <strong>no SVG icon</strong>. Instead, it uses <Code>border: {t['radio.stroke.checked.width'] || 6}px solid brandColor</Code> on a white background. This means the "inner dot" size is purely controlled by the <Code>radio.stroke.checked.width</Code> token — increase it for a bolder dot, decrease it for a subtler one.
        </InfoBox>

        {/* Live interactive demo */}
        <H3>Live demo</H3>
        <P>
          A radio group enforces single-selection. Selecting any option automatically deactivates the previous one.
        </P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Notification frequency</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Single-select group · Default size</span>
          </div>
          <div style={{ padding: '28px 32px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['Immediately', 'Once per hour', 'Daily digest', 'Weekly summary'].map((label, i) => {
              const val = label.toLowerCase().replace(/ /g, '-')
              return (
                <RBtnLive
                  key={val}
                  checked={demoVal === val}
                  onChange={() => setDemoVal(val)}
                  label={label}
                  t={t}
                  size={sizeMd}
                />
              )
            })}
            <div style={{ borderTop: '1px solid var(--stroke-primary)', marginTop: 4, paddingTop: 16 }}>
              <RBtnLive
                checked={false}
                disabled
                label="Custom schedule (unavailable)"
                t={t}
                size={sizeMd}
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ Radio group ═════════════════════════════════════════════════════════ */}
        <SectionAnchor id="group" />
        <H2>Radio group</H2>
        <Lead>
          Radio buttons always appear in a named group. The group carries the shared label, helper text, and error state. Individual radio buttons within the group only carry their own option label.
        </Lead>

        <H3>Vertical layout (default)</H3>
        <P>
          Vertical stacking is the standard. It's easier to scan, especially when labels are longer or when sublabels are present. Recommended for most forms.
        </P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Vertical — with sublabels</span>
          </div>
          <div style={{ padding: '24px 32px', background: 'var(--bg-primary)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>Delivery method</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {DELIVERY_OPTIONS.map(opt => (
                <RBtnLive
                  key={opt.id}
                  checked={deliveryVal === opt.id}
                  onChange={() => setDeliveryVal(opt.id)}
                  label={opt.label}
                  sublabel={opt.sublabel}
                  t={t}
                  size={sizeMd}
                />
              ))}
            </div>
          </div>
        </div>

        <H3>Horizontal layout</H3>
        <P>
          Use horizontal layout only when labels are short (1–2 words) and there are 2–4 options. Avoid for longer labels as they can be hard to parse and may break at small viewport widths.
        </P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Horizontal — short labels only</span>
          </div>
          <div style={{ padding: '24px 32px', background: 'var(--bg-primary)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>View mode</div>
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { id: 'a', label: 'Personal' },
                { id: 'b', label: 'Business' },
                { id: 'c', label: 'Team' },
              ].map(opt => (
                <RBtnLive
                  key={opt.id}
                  checked={groupHoriz === opt.id}
                  onChange={() => setGroupHoriz(opt.id)}
                  label={opt.label}
                  t={t}
                  size={sizeMd}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', padding: '8px 16px' }}>
            {['Layout', 'Best for', 'Avoid when'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>{h}</span>
            ))}
          </div>
          {[
            ['Vertical',    'Long labels, sublabels, 3+ options',              'Horizontal space is very constrained'],
            ['Horizontal',  'Short labels (1–2 words), 2–4 options',           'Labels > 2 words, mobile viewports'],
          ].map(([layout, best, avoid]) => (
            <div key={layout} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '10px 16px', borderBottom: '1px solid var(--stroke-primary)', fontSize: 12, gap: 8 }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{layout}</span>
              <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{best}</span>
              <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{avoid}</span>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Sizes ════════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="sizes" />
        <H2>Sizes</H2>
        <Lead>
          Two sizes are available. The <strong>Default (MD, 24 px)</strong> is used for standard forms. <strong>Small (SM, 20 px)</strong> is suited for dense interfaces, inline filters, and compact settings panels.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {[
            { sizeKey: 'md', label: 'Default',  size: sizeMd, token: 'radio.size-md', note: 'Standard forms, settings, modals' },
            { sizeKey: 'sm', label: 'Small',    size: sizeSm, token: 'radio.size-sm', note: 'Data tables, dense lists, compact UIs' },
          ].map(({ sizeKey, label, size, token, note }) => (
            <div key={sizeKey} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{label}</span>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--brand-600)', background: 'var(--bg-primary)', padding: '2px 7px', borderRadius: 4 }}>{size} px</code>
              </div>
              <div style={{ padding: '20px 20px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <RBtn checked={false} size={size} t={t} />
                  <RBtn checked={true}  size={size} t={t} />
                  <RBtn checked={false} disabled size={size} t={t} />
                  <RBtn checked={true}  disabled size={size} t={t} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RBtn checked size={size} t={t} />
                  <span style={{ fontSize: size === 20 ? 12 : 14, color: t['radio.label'] }}>Selected option</span>
                </div>
                <div style={{ paddingTop: 4, borderTop: '1px solid var(--stroke-primary)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Token: <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{token}</code></div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{note}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Usage rules ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>
        <Lead>
          Guidelines for labeling, grouping, and ordering radio button options clearly.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <DoBox
            visual={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#64748b', marginBottom: 2 }}>Preferred contact method</div>
                {[['email', 'Email', true], ['phone', 'Phone', false], ['post', 'Post', false]].map(([id, label, checked]) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RBtn checked={checked} size={sizeMd} t={t} />
                    <span style={{ fontSize: 13, color: t['radio.label'] }}>{label}</span>
                  </div>
                ))}
              </div>
            }
          >
            Always include a descriptive group label above the radio group. Use a logical order (most common first, or alphabetical) and one-word or short labels.
          </DoBox>
          <DontBox
            visual={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['a', 'Click here for option A', true], ['b', 'Option B (not A)', false], ['c', 'Alternative to the above', false]].map(([id, label, checked]) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RBtn checked={checked} size={sizeMd} t={t} />
                    <span style={{ fontSize: 13, color: t['radio.label'] }}>{label}</span>
                  </div>
                ))}
              </div>
            }
          >
            Don't use vague or relative labels like "the above" or "alternative". Each option must be understandable on its own.
          </DontBox>

          <DoBox>
            Pre-select a default value when one option is the most common or recommended. Mark it visually if needed (e.g., "Recommended" badge). Never leave a group with no selection if a sensible default exists.
          </DoBox>
          <DontBox>
            Don't use radio buttons for binary yes/no choices. Use a Switch or Checkbox instead. Radio groups imply there are meaningful alternatives to compare.
          </DontBox>

          <DoBox
            visual={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#64748b', marginBottom: 2 }}>Subscription tier</div>
                {[['free', 'Free', '$0/mo', false], ['pro', 'Pro', '$9/mo', true]].map(([id, label, sub, checked]) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ paddingTop: 2 }}><RBtn checked={checked} size={sizeMd} t={t} /></div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: t['radio.label'] }}>{label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            Use a sublabel to add essential context (pricing, description) directly under the option label. Keep sublabels concise — one line max.
          </DoBox>
          <DontBox>
            Don't put too many options in a radio group (7+). When the list grows long, switch to a Select component. Radio groups are for visible comparison, not scrollable lists.
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case — Pricing plan selector</H2>
        <Lead>
          A radio group is ideal for plan or tier selection: users need to compare options side-by-side before committing. Each option uses a sublabel for price and feature summary.
        </Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Interactive — click a plan to select it</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Default size (24 px)</span>
          </div>
          <div style={{ padding: '24px', background: 'var(--bg-primary)' }}>
            <div style={{
              background: '#ffffff', borderRadius: 10, border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,.06)', overflow: 'hidden', maxWidth: 480,
            }}>
              {/* Modal header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Choose your plan</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>You can change or cancel anytime.</div>
              </div>
              {/* Plan options */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {PLANS.map((plan, i) => {
                  const isSelected = demoVal === plan.id
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setDemoVal(plan.id)}
                      style={{
                        padding: '14px 20px',
                        borderBottom: i < PLANS.length - 1 ? '1px solid #f1f5f9' : 'none',
                        background: isSelected ? (t['radio.bg.unchecked.hover'] || '#f0f9ff') + '60' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 14,
                        transition: 'background .12s',
                      }}
                    >
                      <RBtnLive
                        checked={isSelected}
                        onChange={() => setDemoVal(plan.id)}
                        size={sizeMd}
                        t={t}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: isSelected ? 600 : 500, color: '#0f172a' }}>{plan.label}</span>
                          {plan.badge && (
                            <span style={{ fontSize: 10, fontWeight: 700, background: t['radio.stroke.checked.default'] || '#07a2b6', color: '#fff', padding: '2px 7px', borderRadius: 10, letterSpacing: '.04em' }}>{plan.badge}</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, lineHeight: 1.4 }}>{plan.desc}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{plan.price}</span>
                        {plan.period && <span style={{ fontSize: 11, color: '#94a3b8' }}>{plan.period}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Footer */}
              <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Selected: <strong style={{ color: '#0f172a' }}>{PLANS.find(p => p.id === demoVal)?.label}</strong>
                </span>
                <button style={{ padding: '7px 16px', borderRadius: 6, border: 'none', background: t['radio.stroke.checked.default'] || '#07a2b6', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  Continue →
                </button>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ Accessibility ═══════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <Lead>
          Radio groups have specific ARIA roles and keyboard patterns that differ from individual controls.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '16px 18px', background: 'var(--bg-primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Keyboard interaction</div>
            {[
              ['Tab',        'Move focus into the radio group (focuses selected option or first)'],
              ['↑ / ←',     'Move to the previous option and select it'],
              ['↓ / →',     'Move to the next option and select it'],
              ['Space',      'Select the focused option (if not already selected)'],
              ['Shift+Tab',  'Move focus out of the radio group'],
            ].map(([key, desc]) => (
              <div key={key} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 8, fontSize: 12, marginBottom: 7, alignItems: 'start' }}>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{key}</code>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</span>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '16px 18px', background: 'var(--bg-primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>ARIA attributes</div>
            {[
              ['role="radiogroup"',   'Applied to the group wrapper element'],
              ['role="radio"',        'Applied to each individual radio control'],
              ['aria-checked',        '"true" or "false" on each radio option'],
              ['aria-labelledby',     'References the group heading/legend text'],
              ['aria-disabled',       '"true" on disabled options'],
              ['aria-describedby',    'Links to helper text or error messages'],
            ].map(([attr, desc]) => (
              <div key={attr} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 8, fontSize: 12, marginBottom: 7, alignItems: 'start' }}>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{attr}</code>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <InfoBox type="warning">
          Radio groups use <strong>roving tabindex</strong>: only the selected option has <Code>tabindex="0"</Code>; all other options have <Code>tabindex="-1"</Code>. Arrow keys then move focus and selection within the group. Tab exits the group entirely. Do not give each radio its own tab stop.
        </InfoBox>

        <Divider />

        {/* ══ Token reference ══════════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>
          All radio tokens are prefixed with <Code>radio.</Code>. Values shown for the <strong>{theme.label}</strong> theme.
        </Lead>

        <TokenTable tokens={t} prefix="radio" />

      </div>

      {/* ── Right TOC aside ────────────────────────────────────────────────────── */}
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
