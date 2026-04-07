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

// ─── Size constants (hardcoded from Figma — tokens not yet defined) ───────────
// Medium: 54×32 track, 24px thumb, 4px padding
// Small:  42×24 track, 18px thumb, 3px padding

const SIZES = {
  md: { trackW: 54, trackH: 32, thumbD: 24, pad: 4 },
  sm: { trackW: 42, trackH: 24, thumbD: 18, pad: 3 },
}

// ─── Static Switch renderer ───────────────────────────────────────────────────

function SBtn({ on = false, disabled = false, hover = false, size = 'md', t }) {
  const { trackW, trackH, thumbD, pad } = SIZES[size] || SIZES.md
  const travel = trackW - thumbD - 2 * pad

  const trackBg = disabled
    ? (on ? t['button.switch.bg.on.disabled'] : t['button.switch.bg.off.disabled'])
    : on
      ? (hover ? t['button.switch.bg.on.hover']  : t['button.switch.bg.on.default'])
      : (hover ? t['button.switch.bg.off.hover'] : t['button.switch.bg.off.default'])

  return (
    <div style={{
      width: trackW, height: trackH,
      borderRadius: 999,
      background: trackBg,
      position: 'relative',
      flexShrink: 0,
      transition: 'background .2s',
      opacity: disabled ? 0.75 : 1,
    }}>
      <div style={{
        position: 'absolute',
        top: pad, left: pad,
        width: thumbD, height: thumbD,
        borderRadius: '50%',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(16,24,40,.2), 0 1px 2px rgba(16,24,40,.12)',
        transform: `translateX(${on ? travel : 0}px)`,
        transition: 'transform .2s cubic-bezier(.4,0,.2,1)',
      }} />
    </div>
  )
}

// ─── Interactive live Switch (module-level for hooks) ─────────────────────────

function SBtnLive({ on, onToggle, size = 'md', t, label, sublabel, disabled = false, labelSide = 'right' }) {
  const [hov, setHov] = useState(false)
  const textColor   = disabled ? 'var(--text-tertiary)' : 'var(--text-secondary)'
  const labelSize   = size === 'sm' ? 12 : 14

  const switchEl = (
    <div
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', flexShrink: 0 }}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <SBtn on={on} disabled={disabled} hover={hov} size={size} t={t} />
    </div>
  )

  return (
    <div
      onClick={!disabled ? onToggle : undefined}
      style={{ display: 'inline-flex', alignItems: sublabel ? 'flex-start' : 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none' }}
    >
      {labelSide === 'left' && (label || sublabel) && (
        <div>
          {label    && <div style={{ fontSize: labelSize, color: textColor, lineHeight: 1.4, fontWeight: on && !disabled ? 500 : 400 }}>{label}</div>}
          {sublabel && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.4, marginTop: 2 }}>{sublabel}</div>}
        </div>
      )}
      <div style={{ paddingTop: sublabel ? 2 : 0 }}>{switchEl}</div>
      {labelSide === 'right' && (label || sublabel) && (
        <div>
          {label    && <div style={{ fontSize: labelSize, color: textColor, lineHeight: 1.4, fontWeight: on && !disabled ? 500 : 400 }}>{label}</div>}
          {sublabel && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.4, marginTop: 2 }}>{sublabel}</div>}
        </div>
      )}
    </div>
  )
}

// ─── Segmented (label/icon) switch ───────────────────────────────────────────
// The special pill variant from Figma: two labeled sides, active side uses brand bg

function SegSwitch({ options, value, onChange, t }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'stretch',
      background: t['button.switch.bg.off.default'],
      borderRadius: 999, overflow: 'hidden',
    }}>
      {options.map((opt, i) => {
        const isOn = value === opt.id
        return (
          <div
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', cursor: 'pointer',
              borderRadius: isOn ? 999 : 0,
              background: isOn ? t['button.switch.bg.on.default'] : 'transparent',
              color: isOn ? (t['button.switch.content.default'] || '#fff') : (t['button.switch.content.inverse'] || '#141a21'),
              fontSize: 13, fontWeight: isOn ? 600 : 400,
              transition: 'background .2s, color .2s',
              userSelect: 'none',
            }}
          >
            {opt.icon && <span style={{ fontSize: 14, lineHeight: 1 }}>{opt.icon}</span>}
            {opt.label}
          </div>
        )
      })}
    </div>
  )
}

// ─── State grid ───────────────────────────────────────────────────────────────

function SwitchStateCard({ t, size = 'md' }) {
  const cols = [
    { label: 'Default', hover: false, disabled: false },
    { label: 'Hover',   hover: true,  disabled: false },
    { label: 'Disabled',hover: false, disabled: true  },
  ]
  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>All states</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          The thumb slides between left (Off) and right (On). Track background color changes on hover and carries disabled opacity.
        </div>
      </div>
      <div style={{ padding: '20px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(3, 1fr)', marginBottom: 10 }}>
          <div />
          {cols.map(c => (
            <div key={c.label} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', textAlign: 'center' }}>{c.label}</div>
          ))}
        </div>
        {[{ label: 'On', on: true }, { label: 'Off', on: false }].map(row => (
          <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '80px repeat(3, 1fr)', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', fontWeight: 500 }}>{row.label}</div>
            {cols.map(col => (
              <div key={col.label} style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
                <SBtn on={row.on} hover={col.hover} disabled={col.disabled} size={size} t={t} />
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
  { id: 'states',    label: 'States' },
  { id: 'sizes',     label: 'Sizes' },
  { id: 'behavior',  label: 'Behavior' },
  { id: 'usage',     label: 'Usage rules' },
  { id: 'usecase',   label: 'Use case' },
  { id: 'a11y',      label: 'Accessibility' },
  { id: 'tokens',    label: 'Token reference' },
]

// ─── Settings items for use case ─────────────────────────────────────────────

const SETTINGS = [
  { id: 'notifications', label: 'Push notifications',   sublabel: 'Receive alerts on your device',          default: true  },
  { id: 'email',         label: 'Email digest',          sublabel: 'Weekly summary of your activity',       default: true  },
  { id: 'darkmode',      label: 'Dark mode',             sublabel: 'Use dark theme across the application', default: false },
  { id: 'autosave',      label: 'Auto-save drafts',      sublabel: 'Save changes automatically every 30 s', default: true  },
  { id: 'analytics',     label: 'Share usage analytics', sublabel: 'Help us improve the product',           default: false },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SwitchPage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

  // Live demo state
  const [demoOn, setDemoOn] = useState(true)

  // Settings panel state
  const [settings, setSettings] = useState(
    Object.fromEntries(SETTINGS.map(s => [s.id, s.default]))
  )

  // Segmented switch demo
  const [segVal, setSegVal] = useState('search')
  const [segVal2, setSegVal2] = useState('month')

  const t = getComponentTokens(activeTheme)
  const theme = VISIBLE_THEMES.find(th => th.id === activeTheme) || VISIBLE_THEMES[0]

  function toggleSetting(id) {
    setSettings(prev => ({ ...prev, [id]: !prev[id] }))
  }

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

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Forms</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Switch</h1>
          <Lead>
            An on/off control for toggling a setting or feature <strong>immediately</strong>, without requiring a confirm action. The change takes effect the moment the switch is flipped.
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
          A Switch is a binary control — it has exactly two states: <strong>On</strong> and <strong>Off</strong>. It differs fundamentally from a Checkbox in that it triggers an <strong>immediate effect</strong> without requiring a form submission. Use it for settings, preferences, and feature flags that take effect in real time.
        </P>
        <P>
          The component comes in two sizes — <strong>Medium (54×32 px)</strong> and <strong>Small (42×24 px)</strong> — and supports a special <strong>segmented variant</strong> with labeled or icon-annotated sides for binary choice contexts (e.g., "Search / Filters").
        </P>

        {/* When to use / not */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Toggling a system or app setting that takes effect immediately',
              'Enabling or disabling a feature (dark mode, notifications)',
              'Binary options where the current state is always visible',
              'Replacing an "Apply" flow for simple on/off preferences',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Selecting from a list of items → use Checkbox or Radio',
              'When the change requires a Save button to take effect → use Checkbox',
              'Activating a toolbar tool that stays active → use Toggle button',
              'Switching between two named views (e.g. Grid / List) → use segmented Toggle',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        {/* Anatomy */}
        <H3>Anatomy</H3>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ padding: '24px 32px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
            {/* Annotated visual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <SBtn on size="md" t={t} />
                  <div style={{ position: 'absolute', left: -3, top: -3, right: -3, bottom: -3, border: '1.5px dashed #94a3b8', borderRadius: 999, pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.05em', textTransform: 'uppercase' }}>① Track</div>
                </div>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Dark mode</span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 4 }}>On</span>
              </div>
              <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <SBtn on={false} size="md" t={t} />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Dark mode</span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 4 }}>Off</span>
              </div>
            </div>
            {/* Legend */}
            <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['① Track',  'The pill-shaped container. Changes color from gray (Off) to brand (On). Always fully rounded.'],
                ['② Thumb',  'The circular white knob. Slides left (Off) or right (On) with a smooth eased transition.'],
                ['  Label',  'Always positioned beside the switch (left or right). Describes the feature, not the state.'],
                ['  State hint', 'Optional "On/Off" text indicator. Useful when the label alone is ambiguous.'],
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
        <Lead>
          Two value states (<strong>On</strong> and <strong>Off</strong>) × three interaction states (<strong>default</strong>, <strong>hover</strong>, <strong>disabled</strong>). Hover darkens the track; disabled reduces opacity and blocks interaction.
        </Lead>

        <SwitchStateCard t={t} size="md" />

        {/* Live demo */}
        <H3>Live demo</H3>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Click to toggle — watch the thumb animate</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>State: {demoOn ? 'On' : 'Off'}</span>
          </div>
          <div style={{ padding: '36px 32px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SBtnLive on={demoOn} onToggle={() => setDemoOn(v => !v)} label="Enable feature flag" sublabel="Applies immediately to all users" t={t} size="md" />
            <SBtnLive on={!demoOn} onToggle={() => setDemoOn(v => !v)} label="Maintenance mode" sublabel="Locks the dashboard for editing" t={t} size="md" />
            <div style={{ borderTop: '1px solid var(--stroke-primary)', paddingTop: 20 }}>
              <SBtnLive on={false} disabled label="Legacy API support" sublabel="Deprecated — contact support to enable" t={t} size="md" />
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ Sizes ════════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="sizes" />
        <H2>Sizes</H2>
        <Lead>
          Two sizes ship with the component. Size tokens are pending — pixel values are directly derived from the Figma specification and will be tokenized in a future release.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {[
            { key: 'md', label: 'Medium', note: 'Standard forms, settings pages, modals', ...SIZES.md },
            { key: 'sm', label: 'Small',  note: 'Compact panels, data tables, dense UIs', ...SIZES.sm },
          ].map(item => (
            <div key={item.key} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{item.label}</span>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--brand-600)', background: 'var(--bg-primary)', padding: '2px 7px', borderRadius: 4 }}>{item.trackW}×{item.trackH} px</code>
              </div>
              <div style={{ padding: '20px 20px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <SBtn on={true}  size={item.key} t={t} />
                  <SBtn on={false} size={item.key} t={t} />
                  <SBtn on={false} disabled size={item.key} t={t} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <SBtn on size={item.key} t={t} />
                  <span style={{ fontSize: item.key === 'sm' ? 12 : 14, color: 'var(--text-secondary)' }}>Feature enabled</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', paddingTop: 4, borderTop: '1px solid var(--stroke-primary)', lineHeight: 1.5 }}>
                  Track {item.trackW}×{item.trackH} px · Thumb {item.thumbD} px · Padding {item.pad} px<br />
                  {item.note}
                </div>
              </div>
            </div>
          ))}
        </div>

        <InfoBox>
          Size tokens (<Code>switch.size-md</Code>, <Code>switch.size-sm</Code>) are not yet defined. The pixel values above come directly from the Figma specification. Once tokenized, the sizes table will reference them automatically.
        </InfoBox>

        <Divider />

        {/* ══ Behavior ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="behavior" />
        <H2>Behavior</H2>
        <Lead>
          Switches act on a single tap or click. Unlike form checkboxes, there is <strong>no submit step</strong>. The change is immediate and must be reversible.
        </Lead>

        <H3>Standard switch</H3>
        <P>
          The standard switch flips a single binary setting. The thumb animates from one side to the other in 200 ms using an ease-in-out curve (<Code>cubic-bezier(.4,0,.2,1)</Code>). Track background color transitions simultaneously.
        </P>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '16px 18px', background: 'var(--bg-primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Animation spec</div>
            {[
              ['Duration',    '200 ms'],
              ['Easing',      'cubic-bezier(.4, 0, .2, 1) — material ease'],
              ['Properties',  'transform (thumb) + background-color (track)'],
              ['Reduced motion', 'Set duration to 0 ms when prefers-reduced-motion'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 8, fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{k}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '16px 18px', background: 'var(--bg-primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Interaction rules</div>
            {[
              ['Click / tap',       'Flip the switch immediately'],
              ['Disabled',          'No interaction, no visual feedback'],
              ['No confirmation',   'Change is instant — no dialog needed'],
              ['Reversible',        'Always show both states; user can flip back'],
              ['Loading state',     'Optionally show a spinner in the thumb during async operations'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 8, fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{k}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <H3>Segmented (label/icon) variant</H3>
        <P>
          The segmented variant shows both options simultaneously inside the pill. The active side uses the brand background; the inactive side is transparent. Use when the two options have distinct named identities and the user should see both choices at all times.
        </P>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', gap: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Interactive segmented switches</span>
          </div>
          <div style={{ padding: '32px 32px', background: 'var(--bg-primary)', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>With icons + labels</div>
              <SegSwitch
                value={segVal}
                onChange={setSegVal}
                t={t}
                options={[
                  { id: 'search',  label: 'Search',  icon: '⌕' },
                  { id: 'filters', label: 'Filters', icon: '⊟' },
                ]}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Labels only</div>
              <SegSwitch
                value={segVal2}
                onChange={setSegVal2}
                t={t}
                options={[
                  { id: 'month', label: 'Monthly' },
                  { id: 'year',  label: 'Annually' },
                ]}
              />
            </div>
          </div>
        </div>

        <InfoBox>
          The segmented switch is <strong>not</strong> a replacement for a Toggle button group or Tab bar. Use it only when the two options are semantically a "switch" (binary mode selection) rather than independent tool toggles or navigation.
        </InfoBox>

        <Divider />

        {/* ══ Usage rules ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <DoBox
            visual={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SBtn on={true} size="md" t={t} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Dark mode</span>
              </div>
            }
          >
            Label the switch with the feature name — not the state. "Dark mode" is correct. The visual position of the thumb communicates on/off.
          </DoBox>
          <DontBox
            visual={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SBtn on={true} size="md" t={t} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Turn dark mode on</span>
              </div>
            }
          >
            Don't start the label with "Turn on/off" or "Enable/Disable". These verbs are redundant — the switch control already communicates the action.
          </DontBox>

          <DoBox
            visual={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['notifications', 'Notifications', true], ['email', 'Email digest', false]].map(([id, label, on]) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <SBtn on={on} size="md" t={t} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                  </div>
                ))}
              </div>
            }
          >
            Use switches in vertical lists for settings panels. Each switch controls an independent setting. Keep labels concise and left-aligned.
          </DoBox>
          <DontBox
            visual={
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                {[['A', true], ['B', false], ['C', true]].map(([label, on]) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <SBtn on={on} size="md" t={t} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Option {label}</span>
                  </div>
                ))}
              </div>
            }
          >
            Don't arrange switches horizontally in a grid. It's harder to scan and breaks the label-control relationship. Stick to a single vertical column.
          </DontBox>

          <DoBox>
            Confirm destructive or irreversible changes (e.g., deleting data, disabling security) with a dialog <em>before</em> applying them — even if the control is a switch.
          </DoBox>
          <DontBox>
            Don't use a switch inside a form that requires a Save/Submit button to commit changes. Users expect an immediate effect. Use a Checkbox instead.
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case — Settings panel</H2>
        <Lead>
          The most common use case for switches: a settings page where each row controls a distinct preference and changes take effect immediately. Click any switch below to toggle it.
        </Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '10px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Interactive settings panel</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              {Object.values(settings).filter(Boolean).length} of {SETTINGS.length} enabled
            </span>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: 24 }}>
            <div style={{
              background: '#ffffff', borderRadius: 10, border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,.06)', overflow: 'hidden', maxWidth: 480,
            }}>
              {/* Panel header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Notification preferences</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Manage how and when we contact you</div>
              </div>
              {/* Settings rows */}
              {SETTINGS.map((s, i) => (
                <div
                  key={s.id}
                  onClick={() => toggleSetting(s.id)}
                  style={{
                    padding: '14px 20px',
                    borderBottom: i < SETTINGS.length - 1 ? '1px solid #f1f5f9' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', gap: 16,
                    transition: 'background .1s',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: settings[s.id] ? 600 : 400, color: '#0f172a', marginBottom: 1 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{s.sublabel}</div>
                  </div>
                  <SBtnLive
                    on={settings[s.id]}
                    onToggle={e => { e?.stopPropagation?.(); toggleSetting(s.id) }}
                    size="md"
                    t={t}
                  />
                </div>
              ))}
              {/* Footer */}
              <div style={{ padding: '10px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  onClick={() => setSettings(Object.fromEntries(SETTINGS.map(s => [s.id, false])))}
                  style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                >
                  Disable all
                </button>
                <button
                  onClick={() => setSettings(Object.fromEntries(SETTINGS.map(s => [s.id, true])))}
                  style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: t['button.switch.bg.on.default'] || '#07a2b6', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  Enable all
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
          A Switch must be keyboard operable and clearly communicate its current state to screen readers.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '16px 18px', background: 'var(--bg-primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Keyboard interaction</div>
            {[
              ['Tab',        'Move focus to the switch'],
              ['Shift+Tab',  'Move focus away from the switch'],
              ['Space',      'Toggle the switch between On and Off'],
              ['Enter',      'Also toggles in some implementations'],
            ].map(([key, desc]) => (
              <div key={key} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 8, fontSize: 12, marginBottom: 7, alignItems: 'start' }}>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{key}</code>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</span>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '16px 18px', background: 'var(--bg-primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>ARIA attributes</div>
            {[
              ['role="switch"',    'Applied to the interactive element'],
              ['aria-checked',     '"true" when On, "false" when Off'],
              ['aria-label',       'Required when no visible label is present'],
              ['aria-disabled',    '"true" when the switch is disabled'],
              ['aria-describedby', 'Links to sublabel or helper text'],
            ].map(([attr, desc]) => (
              <div key={attr} style={{ display: 'grid', gridTemplateColumns: '145px 1fr', gap: 8, fontSize: 12, marginBottom: 7, alignItems: 'start' }}>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{attr}</code>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <InfoBox type="warning">
          Use <Code>role="switch"</Code> rather than <Code>role="checkbox"</Code>. Screen readers announce switch state as "on/off" rather than "checked/unchecked", which better matches the user's mental model for a setting control.
        </InfoBox>

        <Divider />

        {/* ══ Token reference ══════════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>
          Switch tokens are prefixed with <Code>button.switch.</Code>. Size tokens are not yet defined — track and thumb dimensions are currently hardcoded from the Figma spec. Values shown for the <strong>{theme.label}</strong> theme.
        </Lead>

        <TokenTable tokens={t} prefix="button.switch" />

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
      </aside>

    </div>
  )
}
