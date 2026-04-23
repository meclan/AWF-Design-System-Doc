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
function RowLabel({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>{children}</div>
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

// ─── Icon button primitives ──────────────────────────────────────────────────

function IcoSvg({ size = 18, sw = 1.5, shape = 'plus' }) {
  if (shape === 'edit') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <path d="M11.5 2.5l2 2-7.5 7.5-3 .5.5-3L11.5 2.5z" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  if (shape === 'trash') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <path d="M3 4h10M5.5 4V2.5h5V4M4 4v9.5a1 1 0 001 1h6a1 1 0 001-1V4" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  if (shape === 'check') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  if (shape === 'close') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
  if (shape === 'more') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <circle cx="3" cy="8" r=".9" fill="currentColor" />
      <circle cx="8" cy="8" r=".9" fill="currentColor" />
      <circle cx="13" cy="8" r=".9" fill="currentColor" />
    </svg>
  )
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
}

function IBtn({ bg, color, stroke, strokeW = 1.5, size = 40, r = 6, iconSize = 18, iSw = 1.5, icon = 'plus' }) {
  return (
    <div style={{
      width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      borderRadius: r, background: bg || 'transparent', color,
      border: stroke ? `${strokeW}px solid ${stroke}` : 'none',
    }}>
      <IcoSvg size={iconSize} sw={iSw} shape={icon} />
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
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder={`Filter ${prefix} tokens…`}
        style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 6, border: '1px solid var(--stroke-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
      />
      <div style={{ borderRadius: 8, border: '1px solid var(--stroke-primary)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 40px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', padding: '8px 14px' }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Token</span>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Resolved value</span>
          <span />
        </div>
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
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

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',    label: 'Overview' },
  { id: 'demo',        label: 'Live demo' },
  { id: 'anatomy',     label: 'Anatomy' },
  { id: 'appearance',  label: 'Appearance' },
  { id: 'states',      label: 'States' },
  { id: 'sizes',       label: 'Sizes' },
  { id: 'shape',       label: 'Shape' },
  { id: 'usage',       label: 'Usage rules' },
  { id: 'usecase',     label: 'Use case' },
  { id: 'a11y',        label: 'Accessibility' },
  { id: 'tokens',      label: 'Token reference' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IconButtonPage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [activeSection, setActiveSection] = useState('overview')
  const [iconRounded,   setIconRounded]   = useState(false)
  const [demoAppearance, setDemoAppearance] = useState('ghost')
  const [demoIntent,    setDemoIntent]    = useState('brand')
  const [demoSize,      setDemoSize]      = useState('md')

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

  const t = getComponentTokens(activeTheme)
  const theme = VISIBLE_THEMES.find(th => th.id === activeTheme) || VISIBLE_THEMES[0]

  // Appearance configs
  const ig = {
    ghost: {
      brand:   { bg: 'transparent', bgHover: t['button.icon.ghost.bg.hover'],        color: t['button.icon.ghost.color.brand'],   colorDisabled: t['button.icon.ghost.color.disabled'] },
      neutral: { bg: 'transparent', bgHover: t['button.icon.ghost.bg.hover'],        color: t['button.icon.ghost.color.neutral'], colorDisabled: t['button.icon.ghost.color.disabled'] },
      danger:  { bg: 'transparent', bgHover: t['button.icon.ghost.bg.hover-danger'], color: t['button.icon.ghost.color.danger'],  colorDisabled: t['button.icon.ghost.color.disabled'] },
    },
    outlined: {
      neutral: { bg: t['button.icon.outlined.bg.default'], bgHover: t['button.icon.outlined.bg.hover'],        color: t['button.icon.outlined.color.neutral'], stroke: t['button.icon.outlined.stroke.neutral'], strokeDisabled: t['button.icon.outlined.stroke.disabled'], colorDisabled: t['button.icon.outlined.color.disabled'] },
      danger:  { bg: t['button.icon.outlined.bg.default'], bgHover: t['button.icon.outlined.bg.hover-danger'], color: t['button.icon.outlined.color.danger'],  stroke: t['button.icon.outlined.stroke.danger'],  strokeDisabled: t['button.icon.outlined.stroke.disabled'], colorDisabled: t['button.icon.outlined.color.disabled'] },
    },
    soft: {
      brand:  { bg: t['button.icon.soft.bg.default'], bgHover: t['button.icon.soft.bg.hover'],        color: t['button.icon.soft.color.brand'],  colorDisabled: t['button.icon.soft.color.disabled'], bgDisabled: t['button.icon.soft.bg.disabled'] },
      danger: { bg: t['button.icon.soft.bg.danger'],  bgHover: t['button.icon.soft.bg.hover-danger'], color: t['button.icon.soft.color.danger'], colorDisabled: t['button.icon.soft.color.disabled'], bgDisabled: t['button.icon.soft.bg.disabled'] },
    },
    full: {
      brand:  { bg: t['button.icon.full.bg.default'], bgHover: t['button.icon.full.bg.hover'],        color: t['button.icon.full.color.default'], colorDisabled: t['button.icon.full.color.disabled'], bgDisabled: t['button.icon.full.bg.disabled'] },
      danger: { bg: t['button.icon.full.bg.danger'],  bgHover: t['button.icon.full.bg.hover-danger'], color: t['button.icon.full.color.danger'],  colorDisabled: t['button.icon.full.color.disabled'], bgDisabled: t['button.icon.full.bg.disabled'] },
    },
  }

  const iSizes = [
    { key: 'lg', label: 'LG', box: t['button.icon.size.lg.box-width'] || 48, r: t['button.icon.size.lg.radius'] || 8, sw: t['button.icon.size.lg.icon-weight'] || 1.5, iconSize: 20 },
    { key: 'md', label: 'MD', box: t['button.icon.size.md.box-width'] || 40, r: t['button.icon.size.md.radius'] || 6, sw: t['button.icon.size.md.icon-weight'] || 1.5, iconSize: 18 },
    { key: 'sm', label: 'SM', box: t['button.icon.size.sm.box-width'] || 32, r: t['button.icon.size.sm.radius'] || 4, sw: t['button.icon.size.sm.icon-weight'] || 1,   iconSize: 16 },
    { key: 'xs', label: 'XS', box: t['button.icon.size.xs.box-width'] || 24, r: t['button.icon.size.xs.radius'] || 4, sw: t['button.icon.size.xs.icon-weight'] || 1,   iconSize: 14 },
  ]

  const baseR = t['button.icon.radius'] || 8
  const fullR = t['button.icon.rounded-radius'] || 100
  const curR  = iconRounded ? fullR : baseR

  const MD  = { size: 40, iconSize: 18, iSw: 1.5 }
  const MDR = { ...MD, r: curR }

  const ICON_APPEARANCES = [
    {
      key: 'ghost', label: 'Ghost',
      desc: 'No background, lowest weight. Default for toolbar actions where the icon is self-explanatory.',
      intents: [
        { label: 'Brand',   v: ig.ghost.brand },
        { label: 'Neutral', v: ig.ghost.neutral },
        { label: 'Danger',  v: ig.ghost.danger },
      ],
      stateRows: [
        { label: 'Brand',  intent: ig.ghost.brand },
        { label: 'Danger', intent: ig.ghost.danger },
      ],
    },
    {
      key: 'outlined', label: 'Outlined',
      desc: 'Border and transparent background. Matches the visual weight of the outlined label button.',
      intents: [
        { label: 'Neutral', v: ig.outlined.neutral },
        { label: 'Danger',  v: ig.outlined.danger },
      ],
      stateRows: [
        { label: 'Neutral', intent: ig.outlined.neutral },
        { label: 'Danger',  intent: ig.outlined.danger },
      ],
    },
    {
      key: 'soft', label: 'Soft',
      desc: 'Subtle tinted background. Use to indicate a selected or "on" state within a toolbar.',
      intents: [
        { label: 'Brand',  v: ig.soft.brand },
        { label: 'Danger', v: ig.soft.danger },
      ],
      stateRows: [
        { label: 'Brand',  intent: ig.soft.brand },
        { label: 'Danger', intent: ig.soft.danger },
      ],
    },
    {
      key: 'full', label: 'Filled',
      desc: 'Solid background, highest emphasis. Use for the single most prominent action in a compact context.',
      intents: [
        { label: 'Brand',  v: ig.full.brand },
        { label: 'Danger', v: ig.full.danger },
      ],
      stateRows: [
        { label: 'Brand',  intent: ig.full.brand },
        { label: 'Danger', intent: ig.full.danger },
      ],
    },
  ]

  // Resolve demo intent fallback if selected combination is unavailable
  const availableIntents = Object.keys(ig[demoAppearance])
  const safeIntent = availableIntents.includes(demoIntent) ? demoIntent : availableIntents[0]
  const demoConfig = ig[demoAppearance][safeIntent]
  const demoSizeSpec = iSizes.find(s => s.key === demoSize) || iSizes[1]

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
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Icon Button</h1>
          <Lead>
            A compact button that carries a single icon with no visible label. Used in toolbars, action bars, and dense UI surfaces where space is at a premium and the icon's meaning is universally understood.
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
          Icon buttons share the same token system and interaction model as labeled buttons, but they communicate their meaning entirely through an icon. Every icon button <strong>must</strong> carry an <Code>aria-label</Code> for screen readers, and the icon should belong to the vocabulary understood by your users.
        </P>
        <P>
          Four appearances are available — <strong>Ghost</strong>, <strong>Outlined</strong>, <strong>Soft</strong>, and <strong>Filled</strong> — each supporting brand, neutral, and danger intents. Four sizes cover dense to spacious contexts: LG, MD (default), SM, and XS.
        </P>

        {/* When to use / not */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Toolbar and action-bar actions (edit, delete, duplicate, share)',
              'Compact surfaces where a labeled button would not fit',
              'Repeated actions per row in a table (row actions)',
              'Universally recognised icons (close, search, settings)',
              'As the trigger for a popover menu (e.g., an ellipsis "more" button)',
            ].map(item => (
              <div key={item} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, paddingLeft: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: '#16a34a' }}>✓</span>{item}
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Primary page-level actions — use a labeled button',
              'Destructive confirm flows (Delete, Cancel subscription)',
              'Actions with no well-established icon vocabulary',
              'Mobile layouts where tap targets need explicit labels',
              'When a tooltip is the only affordance — the icon must stand alone',
            ].map(item => (
              <div key={item} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, paddingLeft: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: '#dc2626' }}>✗</span>{item}
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Live demo ═══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="demo" />
        <H2>Live demo</H2>
        <Lead>
          Combine appearance, intent, size, and shape to preview any icon button configuration in the current theme.
        </Lead>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--bg-primary)', minHeight: 140 }}>
            <IBtn
              bg={demoConfig.bg}
              color={demoConfig.color}
              stroke={demoConfig.stroke}
              strokeW={1.5}
              size={demoSizeSpec.box}
              iconSize={demoSizeSpec.iconSize}
              iSw={demoSizeSpec.sw}
              r={iconRounded ? fullR : demoSizeSpec.r}
              icon="plus"
            />
          </div>
          <div style={{ borderTop: '1px solid var(--stroke-primary)', background: 'var(--bg-secondary)', padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {[
              { label: 'Appearance', value: demoAppearance,   options: ['ghost','outlined','soft','full'], set: setDemoAppearance },
              { label: 'Intent',     value: safeIntent,       options: availableIntents,                    set: setDemoIntent },
              { label: 'Size',       value: demoSize,         options: ['lg','md','sm','xs'],               set: setDemoSize },
              { label: 'Shape',      value: iconRounded ? 'rounded' : 'square', options: ['square','rounded'], set: v => setIconRounded(v === 'rounded') },
            ].map(ctrl => (
              <div key={ctrl.label}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>{ctrl.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {ctrl.options.map(opt => {
                    const isActive = ctrl.value === opt
                    return (
                      <button key={opt} onClick={() => ctrl.set(opt)} style={{
                        padding: '4px 10px', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                        border: '1px solid var(--stroke-primary)', borderRadius: 4,
                        background: isActive ? 'var(--brand-600)' : 'var(--bg-primary)',
                        color:      isActive ? '#fff' : 'var(--text-secondary)',
                        textTransform: 'capitalize',
                      }}>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Anatomy ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <P>
          An icon button is a square tap target with a centred glyph. Its dimensions are driven entirely by size tokens — box width, border radius, icon size, and stroke weight all scale together.
        </P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '40px 24px', marginBottom: 24, background: 'var(--bg-primary)', display: 'flex', gap: 60, alignItems: 'center', justifyContent: 'center' }}>
          {/* Visual */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -28, border: '1px dashed var(--stroke-primary)', borderRadius: 14, pointerEvents: 'none' }} />
            <IBtn bg={t['button.icon.full.bg.default']} color={t['button.icon.full.color.default']} {...MD} r={baseR} icon="plus" />
            <div style={{ position: 'absolute', top: '50%', right: -80, transform: 'translateY(-50%)', fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
              <div style={{ borderTop: '1px dashed var(--stroke-primary)', width: 60, marginBottom: 4 }} />
              Container
            </div>
            <div style={{ position: 'absolute', top: -14, left: '100%', marginLeft: 8, fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>Icon (18 px)</div>
          </div>
          {/* Legend */}
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
            {[
              ['Container',    'Square box defined by box-width & radius'],
              ['Glyph',        'Centred icon at size defined by icon-size token'],
              ['Padding',      'Internal space between container and glyph'],
              ['Stroke weight','Controls the line-thickness of the icon'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 12 }}>
                <span style={{ color: 'var(--text-tertiary)' }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Appearance ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="appearance" />
        <H2>Appearance</H2>
        <Lead>
          Four appearances cover a spectrum from quiet (Ghost) to prominent (Filled). Pick the lowest weight that still communicates the action clearly.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          {ICON_APPEARANCES.map(ap => (
            <div key={ap.key} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{ap.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ap.desc}</div>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 18, background: 'var(--bg-primary)' }}>
                <div>
                  <RowLabel>Color (intent)</RowLabel>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {ap.intents.map(intent => (
                      <div key={intent.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <IBtn bg={intent.v.bg} color={intent.v.color} stroke={intent.v.stroke} strokeW={1.5} {...MDR} />
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{intent.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ States ══════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="states" />
        <H2>States</H2>
        <Lead>
          Every icon button supports Default, Hover, and Disabled states. Filled and Soft appearances additionally expose a disabled-background token.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          {ICON_APPEARANCES.map(ap => (
            <div key={ap.key} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{ap.label}</div>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-primary)' }}>
                {ap.stateRows.map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: 72, fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', flexShrink: 0 }}>{row.label}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <IBtn bg={row.intent.bg} color={row.intent.color} stroke={row.intent.stroke} strokeW={1.5} {...MDR} />
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Default</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <IBtn bg={row.intent.bgHover} color={row.intent.color} stroke={row.intent.stroke} strokeW={1.5} {...MDR} />
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Hover</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <IBtn bg={row.intent.bgDisabled || 'transparent'} color={row.intent.colorDisabled} stroke={row.intent.strokeDisabled} strokeW={1.5} {...MDR} />
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Disabled</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Sizes ═══════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="sizes" />
        <H2>Sizes</H2>
        <P>
          Four sizes map one-to-one with the labeled button sizes. <strong>MD</strong> is the default for most contexts; use SM/XS for row actions and dense toolbars.
        </P>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 20 }}>
            {iSizes.map(s => (
              <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <IBtn bg={t['button.icon.full.bg.default']} color={t['button.icon.full.color.default']} size={s.box} r={s.r} iconSize={s.iconSize} iSw={s.sw} icon="plus" />
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--stroke-primary)', paddingTop: 14, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['Property', 'LG', 'MD ★', 'SM', 'XS'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Property' ? 'left' : 'center', padding: '6px 12px', color: 'var(--text-tertiary)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid var(--stroke-primary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { prop: 'Box size',      values: iSizes.map(s => `${s.box}px`) },
                  { prop: 'Border radius', values: iSizes.map(s => `${s.r}px`) },
                  { prop: 'Icon weight',   values: iSizes.map(s => `${s.sw}px`) },
                  { prop: 'Padding',       keys: ['lg','md','sm','xs'], tokenSuffix: 'padding' },
                ].map(row => (
                  <tr key={row.prop}>
                    <td style={{ padding: '7px 12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)', fontWeight: 500 }}>{row.prop}</td>
                    {(row.values || row.keys.map(k => `${t['button.icon.size.'+k+'.'+row.tokenSuffix] || '–'}px`)).map((v, i) => (
                      <td key={i} style={{ padding: '7px 12px', textAlign: 'center', borderBottom: '1px solid var(--stroke-primary)', color: 'var(--text-primary)', background: i === 1 ? 'var(--brand-50)' : 'transparent' }}>
                        <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{v}</code>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>★ Default size</div>
          </div>
        </div>

        <Divider />

        {/* ══ Shape ═══════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="shape" />
        <H2>Shape</H2>
        <P>
          Icon buttons expose two radius tokens: <Code>button.icon.radius</Code> (square, default) and{' '}
          <Code>button.icon.rounded-radius</Code> (full, 100 px). Use the toggle to compare all appearances side by side.
        </P>
        <div style={{ display: 'flex', marginBottom: 14 }}>
          {[{ label: 'Square', val: false }, { label: 'Full', val: true }].map((opt, i) => (
            <button
              key={String(opt.val)}
              onClick={() => setIconRounded(opt.val)}
              style={{
                padding: '7px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                border: '1px solid var(--stroke-primary)',
                background: iconRounded === opt.val ? 'var(--brand-600)' : 'var(--bg-secondary)',
                color: iconRounded === opt.val ? '#fff' : 'var(--text-secondary)',
                borderRadius: i === 0 ? '6px 0 0 6px' : '0 6px 6px 0',
                transition: 'background .15s, color .15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '20px 24px', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 14 }}>
            {ICON_APPEARANCES.map(ap => (
              <div key={ap.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <IBtn
                  bg={ap.intents[0].v.bg}
                  color={ap.intents[0].v.color}
                  stroke={ap.intents[0].v.stroke}
                  strokeW={1.5}
                  {...MD}
                  r={curR}
                />
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>{ap.label}</span>
              </div>
            ))}
          </div>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-tertiary)' }}>
            border-radius: {curR}px — {iconRounded ? 'button.icon.rounded-radius' : 'button.icon.radius'}
          </code>
        </div>

        <Divider />

        {/* ══ Usage rules ═════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>
        <Lead>
          Icon buttons rely entirely on their glyph to communicate — apply these rules to keep them legible and accessible.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <DoBox visual={
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IBtn bg={ig.ghost.brand.bgHover} color={ig.ghost.brand.color} {...MD} r={baseR} icon="edit" />
              <div style={{ fontSize: 11, color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4, padding: '3px 8px' }}>aria-label="Edit record"</div>
            </div>
          }>
            Always provide an <Code>aria-label</Code> describing the action. The icon alone is not sufficient for screen readers.
          </DoBox>
          <DontBox visual={
            <IBtn bg={ig.ghost.brand.bgHover} color={ig.ghost.brand.color} {...MD} r={baseR} icon="trash" />
          }>
            Don't use an icon button for complex or destructive primary actions that require a visible label to avoid mistakes.
          </DontBox>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <DoBox visual={
            <div style={{ display: 'flex', gap: 6 }}>
              <IBtn bg={ig.ghost.neutral.bg} color={ig.ghost.neutral.color} {...MD} r={baseR} icon="edit" />
              <IBtn bg={ig.ghost.neutral.bg} color={ig.ghost.neutral.color} {...MD} r={baseR} icon="check" />
              <IBtn bg={ig.ghost.neutral.bg} color={ig.ghost.neutral.color} {...MD} r={baseR} icon="more" />
            </div>
          }>
            Use <strong>Ghost</strong> for toolbars and action bars — it provides the lowest visual noise when multiple icon buttons are grouped.
          </DoBox>
          <DontBox visual={
            <div style={{ display: 'flex', gap: 6 }}>
              <IBtn bg={ig.full.brand.bg} color={ig.full.brand.color} {...MD} r={baseR} icon="edit" />
              <IBtn bg={ig.full.brand.bg} color={ig.full.brand.color} {...MD} r={baseR} icon="check" />
              <IBtn bg={ig.full.brand.bg} color={ig.full.brand.color} {...MD} r={baseR} icon="more" />
            </div>
          }>
            Don't use <strong>Filled</strong> for every icon in a toolbar — it creates too much visual noise. Reserve it for the single most prominent action.
          </DontBox>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <DoBox visual={
            <IBtn bg={ig.soft.danger.bg} color={ig.soft.danger.color} {...MD} r={baseR} icon="trash" />
          }>
            Use the <strong>Danger</strong> intent to flag destructive row actions (delete, remove) so the semantic colour backs up the icon.
          </DoBox>
          <DontBox visual={
            <IBtn bg={ig.full.brand.bg} color={ig.full.brand.color} size={22} iconSize={12} iSw={1.3} r={4} icon="plus" />
          }>
            Don't use XS size for a primary tap target — the 24 px box is below most platforms' recommended minimum (≥ 32 px for touch, 24 px for pointer only).
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <Lead>
          A common pattern: a table row with inline row actions. Icon buttons keep the row compact while exposing common per-row operations.
        </Lead>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 140px', padding: '10px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>
            <span>Name</span>
            <span>Status</span>
            <span>Owner</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>
          {[
            { name: 'Quarterly growth plan',    status: 'Active',  owner: 'A. Rivera' },
            { name: 'API v3 migration',         status: 'Draft',   owner: 'L. Chen'   },
            { name: 'Brand refresh proposal',   status: 'Review',  owner: 'M. Doe'    },
          ].map(row => (
            <div key={row.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 140px', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--stroke-primary)', background: 'var(--bg-primary)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{row.name}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.status}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.owner}</span>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <IBtn bg={ig.ghost.neutral.bg} color={ig.ghost.neutral.color} size={32} iconSize={16} iSw={1.3} r={4} icon="edit" />
                <IBtn bg={ig.ghost.neutral.bg} color={ig.ghost.neutral.color} size={32} iconSize={16} iSw={1.3} r={4} icon="more" />
                <IBtn bg={ig.ghost.danger.bg}  color={ig.ghost.danger.color}  size={32} iconSize={16} iSw={1.3} r={4} icon="trash" />
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.65 }}>
          Row actions typically use the <strong>Ghost + SM</strong> combination with a neutral intent for non-destructive operations and a danger intent for remove/delete.
        </div>

        <Divider />

        {/* ══ Accessibility ═══════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <Lead>
          Icon buttons carry no visible label — accessibility depends entirely on how the component is wired up to assistive technology.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, marginBottom: 18 }}>
          {[
            ['aria-label',         'Required on every icon button. Describe the action, not the icon (e.g., "Delete project", not "Trash icon").'],
            ['Tooltip',            'Add a tooltip with the same text as the aria-label so sighted users also see the action name.'],
            ['Focus ring',         'Visible keyboard focus ring is inherited from the button token system. Do not remove the outline.'],
            ['Tap target',         'Minimum 32 × 32 px (pointer) or 40 × 40 px (touch). Never use XS as the sole trigger on touch devices.'],
            ['Colour contrast',    'Icon vs background must meet WCAG AA 3:1 for non-text. All appearance tokens are tuned to pass across themes.'],
            ['Role & state',       <>Use a native <Code>{'<button>'}</Code> element. If the button toggles state, expose <Code>aria-pressed</Code>.</>],
          ].map(([k, v]) => (
            <React.Fragment key={k}>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{k}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{v}</div>
            </React.Fragment>
          ))}
        </div>

        <InfoBox type="warning">
          A bare icon with only a tooltip is <strong>not</strong> accessible — assistive technology may ignore the tooltip. The <Code>aria-label</Code> must be set directly on the button element.
        </InfoBox>

        {/* Icon library pointer */}
        <div style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Icon library</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Browse all 71 available icons across 4 categories (Actions, Navigation, Status, Objects). Prefer Lucide Icons — MUI is limited to 6 approved exceptions.</div>
          </div>
          <a href="/foundations/icons" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ padding: '8px 16px', background: 'var(--brand-600)', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
              Browse icons →
            </div>
          </a>
        </div>

        <Divider />

        {/* ══ Token reference ═════════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>
          All Icon Button tokens are prefixed with <Code>button.icon.</Code>. Values shown for the <strong>{theme.label}</strong> theme.
        </Lead>

        <TokenTable tokens={t} prefix="button.icon" />

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
