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

// ─── Do / Don't with optional visual slot ────────────────────────────────────

function DoBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && (
        <div style={{ padding: '16px 18px', background: '#ffffff', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 60 }}>
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
        <div style={{ padding: '16px 18px', background: '#ffffff', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 60 }}>
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

// ─── Static button renderer ───────────────────────────────────────────────────
// NOTE: sz() does NOT include strokeW — pass it explicitly to avoid name conflicts.

function Btn({
  bg, color, stroke, strokeW = 1.5,
  px = 20, py = 10, fs = 16, r = 8, gap = 8,
  label = 'Button', startIcon = false, endIcon = false,
  fullWidth = false, fixedWidth,
  disabled = false,
}) {
  const IconSvg = () => (
    <svg width={Math.max(12, fs - 4)} height={Math.max(12, fs - 4)} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5.5v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap, paddingTop: py, paddingBottom: py, paddingLeft: px, paddingRight: px,
      fontSize: fs, fontWeight: 500, lineHeight: 1,
      borderRadius: r,
      background: bg || 'transparent',
      color,
      border: stroke ? `${strokeW}px solid ${stroke}` : 'none',
      cursor: disabled ? 'not-allowed' : 'default',
      width: fullWidth ? '100%' : fixedWidth ? fixedWidth : 'auto',
      boxSizing: 'border-box',
      userSelect: 'none', whiteSpace: 'nowrap',
    }}>
      {startIcon && <IconSvg />}
      <span>{label}</span>
      {endIcon && <IconSvg />}
    </div>
  )
}

// Small square icon button placeholder (for the "fit with icon button" example)
function IconBtn({ bg, color, stroke, strokeW = 1.5, size = 36, r = 8 }) {
  return (
    <div style={{
      width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: r, background: bg || 'transparent', color,
      border: stroke ? `${strokeW}px solid ${stroke}` : 'none',
      flexShrink: 0,
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// ─── Appearance section ───────────────────────────────────────────────────────

function AppearanceSection({ title, description, intents, stateRows, iconRows, note }) {
  return (
    <div style={{ marginBottom: 48, border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '18px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{description}</div>
      </div>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column',background: 'var(--bg-primary)', gap: 24 }}>
        <div>
          <RowLabel>Color (intent)</RowLabel>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {intents.map(intent => (
              <div key={intent.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Btn {...intent.btn} />
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>{intent.label}</span>
              </div>
            ))}
          </div>
        </div>
        {stateRows && stateRows.length > 0 && (
          <div>
            <RowLabel>States</RowLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stateRows.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  {row.label && <div style={{ width: 80, fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', flexShrink: 0 }}>{row.label}</div>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {row.states.map(s => (
                      <div key={s.state} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <Btn {...s.btn} />
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{s.state}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {iconRows && (
          <div>
            <RowLabel>Icon</RowLabel>
            <div style={{ display: 'flex', gap: 10 }}>
              {iconRows.map(r => (
                <div key={r.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <Btn {...r.btn} />
                  <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {note && <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{note}</div>}
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
  { id: 'anatomy',     label: 'Anatomy' },
  { id: 'states',      label: 'States' },
  { id: 'appearance',  label: 'Appearance' },
  { id: 'sizes',       label: 'Sizes' },
  { id: 'icon-sides',  label: 'Icon sides' },
  { id: 'custom',      label: 'Customization' },
  { id: 'usage',       label: 'Usage rules' },
  { id: 'a11y',        label: 'Accessibility' },
  { id: 'tokens',      label: 'Token reference' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ButtonPage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [tokenTab,      setTokenTab]      = useState('button.filled')
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
  const t = getComponentTokens(activeTheme)
  const theme = VISIBLE_THEMES.find(th => th.id === activeTheme) || VISIBLE_THEMES[0]

  // Size shortcuts — does NOT include strokeW to avoid naming conflict with stroke color
  function sz(s) {
    return {
      px:  t[`button.size.${s}.padding-x`],
      py:  t[`button.size.${s}.padding-y`],
      fs:  t[`button.size.${s}.font-size`],
      r:   t[`button.size.${s}.radius`],
      gap: t[`button.size.${s}.gap`],
    }
  }
  function sw(s) { return t[`button.size.${s}.stroke-weight`] || 1.5 }

  // ── Appearance definitions ─────────────────────────────────────────────────

  const APPEARANCES = [
    {
      title: 'Filled',
      description: 'Highest visual emphasis. Use for the single primary action on a page or dialog. Solid brand-color background.',
      intents: [
        { label: 'Primary',   btn: { bg: t['button.filled.bg.default'],  color: t['button.filled.text.default'], label: 'Primary',   ...sz('md') } },
        { label: 'Secondary', btn: { bg: t['button.filled.bg.strong'],   color: t['button.filled.text.default'], label: 'Secondary', ...sz('md') } },
        { label: 'Danger',    btn: { bg: t['button.filled.bg.danger'],   color: t['button.filled.text.default'], label: 'Danger',    ...sz('md') } },
        { label: 'Disabled',  btn: { bg: t['button.filled.bg.disabled'], color: t['button.filled.text.disabled'], label: 'Disabled', ...sz('md'), disabled: true } },
      ],
      stateRows: [
        { label: 'Primary', states: [
          { state: 'Default', btn: { bg: t['button.filled.bg.default'],       color: t['button.filled.text.default'], label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.filled.bg.hover'],         color: t['button.filled.text.default'], label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.filled.bg.pressed'],       color: t['button.filled.text.default'], label: 'Pressed', ...sz('md') } },
        ]},
        { label: 'Secondary', states: [
          { state: 'Default', btn: { bg: t['button.filled.bg.strong'],        color: t['button.filled.text.default'], label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.filled.bg.hover-strong'],  color: t['button.filled.text.default'], label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.filled.bg.hover-strong'],  color: t['button.filled.text.default'], label: 'Pressed', ...sz('md') } },
        ]},
        { label: 'Danger', states: [
          { state: 'Default', btn: { bg: t['button.filled.bg.danger'],        color: t['button.filled.text.default'], label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.filled.bg.hover-danger'],  color: t['button.filled.text.default'], label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.filled.bg.hover-danger'],  color: t['button.filled.text.default'], label: 'Pressed', ...sz('md') } },
        ]},
      ],
      iconRows: [
        { label: 'Start icon', btn: { bg: t['button.filled.bg.default'], color: t['button.filled.text.default'], label: 'Button', startIcon: true, ...sz('md') } },
        { label: 'End icon',   btn: { bg: t['button.filled.bg.default'], color: t['button.filled.text.default'], label: 'Button', endIcon: true,   ...sz('md') } },
      ],
    },
    {
      title: 'Soft',
      description: 'Moderate emphasis with a subtle background tint. Suitable for secondary CTAs and supporting actions in data-dense interfaces.',
      intents: [
        { label: 'Primary',   btn: { bg: t['button.soft.bg.default'],  color: t['button.soft.text.default'],         label: 'Primary',   ...sz('md') } },
        { label: 'Secondary', btn: { bg: t['button.soft.bg.default'],  color: t['button.soft.text.default-strong'],  label: 'Secondary', ...sz('md') } },
        { label: 'Neutral',   btn: { bg: t['button.soft.bg.neutral'],  color: t['button.soft.text.default-neutral'], label: 'Neutral',   ...sz('md') } },
        { label: 'Danger',    btn: { bg: t['button.soft.bg.danger'],   color: t['button.soft.text.danger'],          label: 'Danger',    ...sz('md') } },
        { label: 'Disabled',  btn: { bg: t['button.soft.bg.disabled'], color: t['button.soft.text.disabled'],        label: 'Disabled',  ...sz('md'), disabled: true } },
      ],
      stateRows: [
        { label: 'Primary', states: [
          { state: 'Default', btn: { bg: t['button.soft.bg.default'],  color: t['button.soft.text.default'], label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.soft.bg.hover'],    color: t['button.soft.text.default'], label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.soft.bg.pressed'],  color: t['button.soft.text.default'], label: 'Pressed', ...sz('md') } },
        ]},
        { label: 'Neutral', states: [
          { state: 'Default', btn: { bg: t['button.soft.bg.neutral'],         color: t['button.soft.text.default-neutral'], label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.soft.bg.hover-neutral'],   color: t['button.soft.text.default-neutral'], label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.soft.bg.pressed-neutral'], color: t['button.soft.text.default-neutral'], label: 'Pressed', ...sz('md') } },
        ]},
        { label: 'Danger', states: [
          { state: 'Default', btn: { bg: t['button.soft.bg.danger'],          color: t['button.soft.text.danger'], label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.soft.bg.hover-danger'],    color: t['button.soft.text.danger'], label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.soft.bg.pressed-danger'],  color: t['button.soft.text.danger'], label: 'Pressed', ...sz('md') } },
        ]},
      ],
      iconRows: [
        { label: 'Start icon', btn: { bg: t['button.soft.bg.default'], color: t['button.soft.text.default'], label: 'Button', startIcon: true, ...sz('md') } },
        { label: 'End icon',   btn: { bg: t['button.soft.bg.default'], color: t['button.soft.text.default'], label: 'Button', endIcon: true,   ...sz('md') } },
      ],
      note: '* Secondary variant takes brand hover and pressed states.',
    },
    {
      title: 'Outlined',
      description: 'Transparent background with a visible border. Pairs well with a filled button to define a secondary action with low visual fill.',
      intents: [
        { label: 'Primary',   btn: { color: t['button.outlined.text.default'],  stroke: t['button.outlined.stroke.default'],  strokeW: sw('md'), label: 'Primary',   ...sz('md') } },
        { label: 'Secondary', btn: { color: t['button.outlined.text.strong'],   stroke: t['button.outlined.stroke.strong'],   strokeW: sw('md'), label: 'Secondary', ...sz('md') } },
        { label: 'Neutral',   btn: { color: t['button.outlined.text.neutral'],  stroke: t['button.outlined.stroke.neutral'],  strokeW: sw('md'), label: 'Neutral',   ...sz('md') } },
        { label: 'Danger',    btn: { color: t['button.outlined.text.danger'],   stroke: t['button.outlined.stroke.danger'],   strokeW: sw('md'), label: 'Danger',    ...sz('md') } },
        { label: 'Disabled',  btn: { color: t['button.outlined.text.disabled'], stroke: t['button.outlined.stroke.disabled'], strokeW: sw('md'), label: 'Disabled',  ...sz('md'), disabled: true } },
      ],
      stateRows: [
        { label: 'Primary', states: [
          { state: 'Default', btn: { color: t['button.outlined.text.default'], stroke: t['button.outlined.stroke.default'], strokeW: sw('md'), label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.outlined.bg.hover'],    color: t['button.outlined.text.hover'],   stroke: t['button.outlined.stroke.default'], strokeW: sw('md'), label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.outlined.bg.pressed'],  color: t['button.outlined.text.default'], stroke: t['button.outlined.stroke.default'], strokeW: sw('md'), label: 'Pressed', ...sz('md') } },
        ]},
        { label: 'Neutral', states: [
          { state: 'Default', btn: { color: t['button.outlined.text.neutral'], stroke: t['button.outlined.stroke.neutral'], strokeW: sw('md'), label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.outlined.bg.hover-neutral'],   color: t['button.outlined.text.neutral'], stroke: t['button.outlined.stroke.neutral'], strokeW: sw('md'), label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.outlined.bg.pressed-neutral'], color: t['button.outlined.text.neutral'], stroke: t['button.outlined.stroke.neutral'], strokeW: sw('md'), label: 'Pressed', ...sz('md') } },
        ]},
        { label: 'Danger', states: [
          { state: 'Default', btn: { color: t['button.outlined.text.danger'], stroke: t['button.outlined.stroke.danger'], strokeW: sw('md'), label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.outlined.bg.hover-danger'],   color: t['button.outlined.text.danger'], stroke: t['button.outlined.stroke.danger'], strokeW: sw('md'), label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.outlined.bg.pressed-danger'], color: t['button.outlined.text.danger'], stroke: t['button.outlined.stroke.danger'], strokeW: sw('md'), label: 'Pressed', ...sz('md') } },
        ]},
      ],
      iconRows: [
        { label: 'Start icon', btn: { color: t['button.outlined.text.default'], stroke: t['button.outlined.stroke.default'], strokeW: sw('md'), label: 'Button', startIcon: true, ...sz('md') } },
        { label: 'End icon',   btn: { color: t['button.outlined.text.default'], stroke: t['button.outlined.stroke.default'], strokeW: sw('md'), label: 'Button', endIcon: true,   ...sz('md') } },
      ],
      note: '* Secondary strong variant takes brand hover and pressed states.',
    },
    {
      title: 'Text',
      description: 'No background or border by default. Lowest visual weight. Use for low-priority actions, inline contextual links, or tertiary hierarchy.',
      intents: [
        { label: 'Primary',   btn: { color: t['button.text.text.default'],  label: 'Primary',   ...sz('md') } },
        { label: 'Secondary', btn: { color: t['button.text.text.strong'],   label: 'Secondary', ...sz('md') } },
        { label: 'Neutral',   btn: { color: t['button.text.text.neutral'],  label: 'Neutral',   ...sz('md') } },
        { label: 'Danger',    btn: { color: t['button.text.text.danger'],   label: 'Danger',    ...sz('md') } },
        { label: 'Black',     btn: { color: t['button.text.text.black'],    label: 'Black',     ...sz('md') } },
        { label: 'Disabled',  btn: { color: t['button.text.text.disabled'], label: 'Disabled',  ...sz('md'), disabled: true } },
      ],
      stateRows: [
        { label: 'Primary', states: [
          { state: 'Default', btn: { color: t['button.text.text.default'],                               label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.text.bg.hover-brand'],   color: t['button.text.text.default'], label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.text.bg.pressed-brand'], color: t['button.text.text.default'], label: 'Pressed', ...sz('md') } },
        ]},
        { label: 'Neutral', states: [
          { state: 'Default', btn: { color: t['button.text.text.neutral'],                                     label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.text.bg.hover-neutral'],   color: t['button.text.text.neutral'], label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.text.bg.pressed-neutral'], color: t['button.text.text.neutral'], label: 'Pressed', ...sz('md') } },
        ]},
        { label: 'Danger', states: [
          { state: 'Default', btn: { color: t['button.text.text.danger'],                                    label: 'Default', ...sz('md') } },
          { state: 'Hover',   btn: { bg: t['button.text.bg.hover-danger'],   color: t['button.text.text.danger'], label: 'Hover',   ...sz('md') } },
          { state: 'Pressed', btn: { bg: t['button.text.bg.pressed-danger'], color: t['button.text.text.danger'], label: 'Pressed', ...sz('md') } },
        ]},
      ],
      iconRows: [
        { label: 'Start icon', btn: { color: t['button.text.text.default'], label: 'Button', startIcon: true, ...sz('md') } },
        { label: 'End icon',   btn: { color: t['button.text.text.default'], label: 'Button', endIcon: true,   ...sz('md') } },
      ],
      note: '* Black variant takes neutral hover and pressed states.',
    },
  ]

  const TOKEN_TABS = [
    { key: 'button.filled',   label: 'Filled' },
    { key: 'button.soft',     label: 'Soft' },
    { key: 'button.outlined', label: 'Outlined' },
    { key: 'button.text',     label: 'Text' },
    { key: 'button.icon',     label: 'Icon button' },
    { key: 'button.size',     label: 'Size' },
  ]

  // Shorthand button renders used in do/dont visuals
  const fBtn  = (label) => <Btn bg={t['button.filled.bg.default']}  color={t['button.filled.text.default']}  label={label} px={14} py={7} fs={13} r={6} gap={6} />
  const sBtn  = (label) => <Btn bg={t['button.soft.bg.default']}    color={t['button.soft.text.default']}    label={label} px={14} py={7} fs={13} r={6} gap={6} />
  const oBtn  = (label) => <Btn color={t['button.outlined.text.default']} stroke={t['button.outlined.stroke.default']} strokeW={1.5} label={label} px={14} py={7} fs={13} r={6} gap={6} />
  const oNBtn  = (label) => <Btn color={t['button.outlined.text.neutral']} stroke={t['button.outlined.stroke.neutral']} strokeW={1.5} label={label} px={14} py={7} fs={13} r={6} gap={6} />
  const tBtn  = (label) => <Btn color={t['button.text.text.default']} label={label} px={14} py={7} fs={13} r={6} gap={6} />
  const dBtn  = (label) => <Btn bg={t['button.filled.bg.danger']}    color={t['button.filled.text.default']} label={label} px={14} py={7} fs={13} r={6} gap={6} />

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Actions</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Button</h1>
          <Lead>
            Buttons are a type of call to action (CTA) the user can click or press. Button labels should indicate the type of action that will occur when the button is pressed.
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

        <Divider />

        {/* ── Overview ──────────────────────────────────────────────────────── */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <P>Buttons are available in four appearances (filled, soft, outlined, text), five sizes, and multiple semantic intents. Default sizes and appearances cover the vast majority of product use cases.</P>

        {/* When to use / not */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Triggering a single, clearly-defined action (Save, Submit, Delete)',
              'The primary call-to-action on a page, modal, or form',
              'Secondary or tertiary actions paired alongside a primary button',
              'Destructive operations that require explicit, deliberate user intent',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Activating a persistent on/off state → use a Toggle or Switch',
              'Navigating between pages without a side effect → use a Link',
              'Selecting from a list of mutually exclusive options → use Radio',
              'Placing more than one primary action on the same surface',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <DoBox visual={<>{oBtn('Cancel')} {fBtn('Save changes')}</>}>
            Use concise, verb-first labels. Place the primary action on the right, dismiss/cancel on the left.
          </DoBox>
          <DontBox visual={<>{fBtn('Next')} {fBtn('Submit')}</>}>
            Don't use two filled buttons side by side. Only one primary action per context.
          </DontBox>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <DoBox visual={<>{oNBtn('Cancel')} {dBtn('Delete')}</>}>
            Pair a danger action with a neutral dismiss to give users an easy exit.
          </DoBox>
          <DontBox visual={<>{dBtn('Cancel')} {dBtn('Delete')}</>}>
            Don't use danger styling for non-destructive actions like "Cancel".
          </DontBox>
        </div>

        <H3>Hierarchy example</H3>
        <P>When multiple actions coexist, establish a clear visual pyramid. The example below shows the three tiers in context — the same pattern used in wizards, modals, and multi-step forms.</P>

        {/* Visual hierarchy example — inspired by Figma */}
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '28px 32px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            {/* Numbered labels */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {[
                { n: 3, btn: oBtn('Cancel'),   label: 'Tertiary — Text or Outlined' },
                { n: 2, btn: sBtn('Previous'), label: 'Secondary — Soft' },
                { n: 1, btn: fBtn('Next'),     label: 'Primary — Filled' },
              ].map(({ n, btn, label }) => (
                <div key={n} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    width: 20, height: 20, borderRadius: '50%',
                    border: '2px solid var(--stroke-primary)', background: 'var(--bg-primary)',
                    fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1,
                  }}>{n}</div>
                  {btn}
                </div>
              ))}
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderLeft: '1px solid var(--stroke-primary)', paddingLeft: 20 }}>
              {[
                { n: 1, label: 'Filled', desc: 'Primary action' },
                { n: 2, label: 'Soft',   desc: 'Secondary action' },
                { n: 3, label: 'Outlined / Text', desc: 'Tertiary action' },
              ].map(({ n, label, desc }) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--stroke-primary)', background: 'var(--bg-primary)', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
                  <span style={{ color: 'var(--text-tertiary)' }}>— {desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ── Anatomy ───────────────────────────────────────────────────────── */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <Lead>A button consists of a container, a label, and optional flanking icons. The focus ring follows the application's global focus style.</Lead>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '24px 32px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 8 }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <Btn bg={t['button.filled.bg.default']} color={t['button.filled.text.default']} label="Save changes" startIcon {...sz('md')} />
                <div style={{ position: 'absolute', left: -3, top: -3, right: -3, bottom: -3, border: '1.5px dashed #94a3b8', borderRadius: (t['button.size.md.radius'] || 8) + 3, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.05em', textTransform: 'uppercase' }}>① Container</div>
              </div>
              <div style={{ marginTop: 8 }}>
                <Btn bg={t['button.filled.bg.default']} color={t['button.filled.text.default']} label="Save changes" startIcon endIcon {...sz('md')} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['① Container',  'Background fill, border, and border-radius. Transparent for Outlined and Text variants.'],
                ['② Label',      'Verb-first, sentence-case text. Describes the resulting action, not the element type.'],
                ['③ Start icon', 'Optional. Placed before the label to reinforce the action type.'],
                ['④ End icon',   'Optional. Placed after the label — signals direction, expansion, or external link.'],
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

        {/* ── States ────────────────────────────────────────────────────────── */}
        <SectionAnchor id="states" />
        <H2>States</H2>
        <Lead>
          All button variants support four interaction states. Values resolve live from the <strong>{theme.label}</strong> theme.
        </Lead>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>Filled — brand intent</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>States apply identically to Soft, Outlined, and Text variants</div>
          </div>
          <div style={{ padding: '24px 28px', background: 'var(--bg-primary)', display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {[
              { label: 'Default', bg: t['button.filled.bg.default'],  color: t['button.filled.text.default'],  disabled: false },
              { label: 'Hover',   bg: t['button.filled.bg.hover'],    color: t['button.filled.text.default'],  disabled: false },
              { label: 'Pressed', bg: t['button.filled.bg.pressed'],  color: t['button.filled.text.default'],  disabled: false },
              { label: 'Disabled',bg: t['button.filled.bg.disabled'], color: t['button.filled.text.disabled'], disabled: true  },
            ].map(({ label, bg, color, disabled }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Btn bg={bg} color={color} label="Button" {...sz('md')} disabled={disabled} />
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ── Appearance ────────────────────────────────────────────────────── */}
        <SectionAnchor id="appearance" />
        <H2>Appearance</H2>
        <Lead>
          Four appearance variants define the visual weight of a button. All color values resolve live from the <strong>{theme.label}</strong> theme tokens.
        </Lead>

        {APPEARANCES.map(ap => (
          <AppearanceSection key={ap.title} {...ap} />
        ))}

        <Divider />

        {/* ── Sizes ─────────────────────────────────────────────────────────── */}
        <SectionAnchor id="sizes" />
        <H2>Sizes</H2>
        <Lead>
          Five sizes are available. The <strong>Medium</strong> size covers the majority of use cases. Custom sizing is allowed only by adjusting typography and internal padding — always respect aspect ratio, accessibility, and spacing rules.
        </Lead>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '24px 28px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 24 }}>
            {[
              { key: 'xl', label: 'XLarge' },
              { key: 'lg', label: 'Large' },
              { key: 'md', label: 'Medium ★' },
              { key: 'sm', label: 'Small' },
              { key: 'xs', label: 'XSmall' },
            ].map(({ key, label }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Btn bg={t['button.filled.bg.default']} color={t['button.filled.text.default']} label={label} {...sz(key)} />
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>{key.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--stroke-primary)', paddingTop: 16, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['Property', 'XLarge', 'Large', 'Medium ★', 'Small', 'XSmall'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Property' ? 'left' : 'center', padding: '6px 12px', color: 'var(--text-tertiary)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid var(--stroke-primary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { prop: 'H. padding',  token: 'padding-x',    unit: 'px' },
                  { prop: 'V. padding',  token: 'padding-y',    unit: 'px' },
                  { prop: 'Gap',         token: 'gap',          unit: 'px' },
                  { prop: 'Font size',   token: 'font-size',    unit: 'px' },
                  { prop: 'Line height', token: 'line-height',  unit: '' },
                  { prop: 'Border radius', token: 'radius',     unit: 'px' },
                  { prop: 'Stroke weight', token: 'stroke-weight', unit: 'px' },
                ].map(row => (
                  <tr key={row.prop}>
                    <td style={{ padding: '7px 12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)', fontWeight: 500 }}>{row.prop}</td>
                    {['xl','lg','md','sm','xs'].map(k => (
                      <td key={k} style={{ padding: '7px 12px', textAlign: 'center', borderBottom: '1px solid var(--stroke-primary)', color: 'var(--text-primary)', background: k === 'md' ? 'var(--brand-50)' : 'transparent' }}>
                        <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                          {t[`button.size.${k}.${row.token}`]}{row.unit}
                        </code>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>★ Default size — used in most product UIs</div>
          </div>
        </div>

        <Divider />

        {/* ── Icon sides ─────────────────────────────────────────────────────── */}
        <SectionAnchor id="icon-sides" />
        <H2>Icon sides</H2>
        <Lead>
          Any button variant can include an icon before (start) or after (end) the label. Icons should reinforce the label — never replace it in a labeled button.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {[
            { title: 'Start icon', desc: 'Placed before the label. Use to reinforce the action type (e.g., a save icon before "Save changes"). Best for recognizable icon–action pairings.', startIcon: true },
            { title: 'End icon',   desc: 'Placed after the label. Use to indicate directionality or show that clicking opens something (e.g., a chevron for "Continue" or a dropdown arrow).', endIcon: true },
          ].map(col => (
            <div key={col.title} style={{ border: '1px solid var(--stroke-primary)',background: 'var(--bg-primary)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{col.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{col.desc}</div>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Btn bg={t['button.filled.bg.default']}  color={t['button.filled.text.default']}  label="Filled"   {...sz('md')} {...col} />
                <Btn bg={t['button.soft.bg.default']}    color={t['button.soft.text.default']}    label="Soft"     {...sz('md')} {...col} />
                <Btn color={t['button.outlined.text.default']} stroke={t['button.outlined.stroke.default']} strokeW={sw('md')} label="Outlined" {...sz('md')} {...col} />
                <Btn color={t['button.text.text.default']} label="Text" {...sz('md')} {...col} />
              </div>
            </div>
          ))}
        </div>

        <InfoBox type="info">
          A button with only an icon and no label is a distinct component. See the{' '}
          <a href="/components/icon-button" style={{ color: 'var(--brand-600)', textDecoration: 'none', fontWeight: 500 }}>Icon Button page →</a> for its full spec, tokens, and accessibility rules.
        </InfoBox>

        <Divider />

        {/* ── Customization ─────────────────────────────────────────────────── */}
        <SectionAnchor id="custom" />
        <H2>Customization</H2>
        <Lead>
          The button exposes a limited set of customization options. These are escape hatches for specific layout constraints — default variants should cover the vast majority of use cases.
        </Lead>

        <InfoBox type="warning">
          Custom overrides bypass the token system and can break visual consistency across themes. Always use a default appearance first. Only customize when a specific layout constraint cannot be addressed by the standard sizes or appearances.
        </InfoBox>

        {/* Full width */}
        <H3>Full width</H3>
        <P>Use the <Code>fullWidth</Code> prop to fill the button to 100% of its container. Commonly used in mobile layouts, modals, or form footers.</P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '20px 24px', marginBottom: 24, maxWidth: 480 }}>
          <Btn bg={t['button.filled.bg.default']} color={t['button.filled.text.default']} label="Full Width Button" fullWidth {...sz('md')} />
        </div>

        {/* Pill / full corner */}
        <H3>Full corner radius</H3>
        <P>Override border radius to <Code>100px</Code> (the <Code>numbers.radius.full</Code> token) for a pill-shaped button. Use sparingly and only where the pill shape is intentional (e.g. floating action buttons, tags).</P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '20px 24px', marginBottom: 8, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Button preview */}
          <Btn bg={t['button.filled.bg.default']} color={t['button.filled.text.default']} label="Custom" r={100} />
          {/* Spec table */}
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 2 }}>
            {[
              ['Width', 'Hug'],
              ['Height', 'Hug'],
              ['Horizontal padding', `${t['button.size.md.padding-x']}px`],
              ['Vertical padding',   `${t['button.size.md.padding-y']}px`],
              ['Line height', '150%'],
              ['Font size', `${t['button.size.md.font-size']}px`],
              ['Border radius', '100px'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: 'var(--text-tertiary)', minWidth: 140 }}>{k}</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <DoBox visual={
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn color={t['button.outlined.text.default']} stroke={t['button.outlined.stroke.default']} strokeW={1.5} label="Cancel" r={100} px={14} py={7} fs={13} gap={6} />
              <Btn bg={t['button.soft.bg.default']} color={t['button.soft.text.default']} label="Previous" r={100} px={14} py={7} fs={13} gap={6} />
              <Btn bg={t['button.filled.bg.default']} color={t['button.filled.text.default']} label="Next" r={100} px={14} py={7} fs={13} gap={6} />
            </div>
          }>
            Use full corner consistently across <em>all</em> buttons in the same group so the shapes remain harmonious.
          </DoBox>
          <DontBox visual={
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn color={t['button.outlined.text.default']} stroke={t['button.outlined.stroke.default']} strokeW={1.5} label="Cancel" r={6} px={14} py={7} fs={13} gap={6} />
              <Btn bg={t['button.filled.bg.default']} color={t['button.filled.text.default']} label="Next" r={100} px={14} py={7} fs={13} gap={6} />
            </div>
          }>
            Don't mix pill and standard corner radius in the same button group — it creates visual inconsistency.
          </DontBox>
        </div>

        {/* Fixed equal width */}
        <H3>Fixed equal width</H3>
        <P>Sometimes buttons in a group need a fixed width to appear visually balanced in the UI, regardless of label length. Set all buttons to the same fixed width.</P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, background: 'var(--bg-primary)', padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 12 }}>
            Sometimes we want to fix the button size to have harmony in the UI. In these cases, you can custom and fix the width of the button.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn color={t['button.outlined.text.default']} stroke={t['button.outlined.stroke.default']} strokeW={1.5} label="Cancel"   fixedWidth={90} {...sz('sm')} />
            <Btn bg={t['button.soft.bg.default']} color={t['button.soft.text.default']}                             label="Previous"  fixedWidth={90} {...sz('sm')} />
            <Btn bg={t['button.filled.bg.default']} color={t['button.filled.text.default']}                         label="Next"      fixedWidth={90} {...sz('sm')} />
          </div>
        </div>

        {/* Custom height for icon button alignment */}
        <H3>Custom height — aligning with Icon Button</H3>
        <P>When a labeled button sits beside an Icon Button, adjust the vertical padding so both components share the same height. Use the icon button's size token as a reference.</P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '20px 24px', background: 'var(--bg-primary)', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 12 }}>
            Custom the height, when a button is beside an icon button to fit the height.
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Large button with same height as the icon button (32px = box-width of sm icon btn) */}
            <Btn bg={t['button.outlined.bg.default']} color={t['button.outlined.text.default']} stroke={t['button.outlined.stroke.default']} label="Large" height={36} px={20} fs={14} r={6} gap={6} />
            <IconBtn bg={t['button.filled.bg.default']} color={t['button.filled.text.default']} size={36} r={6} />
          </div>
        </div>

        <Divider />

        {/* ── Usage rules ────────────────────────────────────────────────────── */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>

        <H3>Labels</H3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <DoBox visual={<>{fBtn('Save changes')} {oBtn('Discard')}</>}>
            Use <strong>verb-first</strong> labels: "Save changes", "Delete record", "Open settings". 2–4 words is ideal.
          </DoBox>
          <DontBox visual={<>{fBtn('OK')} {oBtn('Yes')}</>}>
            Don't use vague labels like "OK" or "Yes". Users shouldn't have to recall context to understand the action.
          </DontBox>
        </div>

        <H3>Hierarchy and placement</H3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <DoBox visual={<>{oBtn('Cancel')} {fBtn('Confirm')}</>}>
            Place the <strong>primary action on the right</strong>, dismiss/cancel on the left in dialogs and forms.
          </DoBox>
          <DontBox visual={<>{fBtn('Confirm')} {oBtn('Cancel')}</>}>
            Don't reverse the order. Placing a primary action on the left can lead to accidental confirmations with keyboard navigation.
          </DontBox>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <DoBox visual={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', gap: 4 }}>{dBtn('Delete')}</span>
              <span style={{ display: 'inline-flex', gap: 4 }}>{oBtn('Cancel')}{fBtn('Save')}</span>
            </div>
          }>
            Visually <strong>isolate danger buttons</strong> — left-align them while keeping primary/secondary actions right-aligned.
          </DoBox>
          <DontBox visual={<>{fBtn('Save')} {dBtn('Delete')} {oBtn('Cancel')}</>}>
            Don't group a danger button between primary actions. Its red color signals risk but proximity undercuts that warning.
          </DontBox>
        </div>

        <H3>Loading and async</H3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <DoBox>
            Show a loading indicator inside the button and disable it while a request is in progress to prevent duplicate submissions.
          </DoBox>
          <DontBox>
            Don't leave the button enabled during async operations. Users will click again, causing duplicate requests.
          </DontBox>
        </div>

        <Divider />

        {/* ── Accessibility ──────────────────────────────────────────────────── */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <P>All AWF button color pairings are verified for WCAG 2.1 AA contrast (minimum 4.5:1 for text).</P>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {[
            { rule: 'Keyboard activation',    detail: 'All buttons must be focusable with Tab and activatable with Enter and Space. Never remove the focus ring.' },
            { rule: 'aria-disabled vs disabled', detail: 'Use aria-disabled="true" when the button should remain in tab order but be non-interactive (e.g. with a tooltip explaining why). Use the HTML disabled attribute only when the button should be completely skipped by screen readers.' },
            { rule: 'Touch target size',      detail: 'Minimum touch target is 44×44px (WCAG 2.5.5). The Medium size (~36px height) may need a transparent padding wrapper on mobile contexts.' },
            { rule: 'Loading state',          detail: 'Announce loading with aria-busy="true" and a visually-hidden "Loading…" text alongside the spinner.' },
            { rule: 'Button vs link',         detail: 'Use <button> for actions (submit, open dialog, toggle). Use <a> for navigation. Never style a link as a button just for visual reasons.' },
          ].map(({ rule, detail }) => (
            <div key={rule} style={{ padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--stroke-primary)', display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{rule}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{detail}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ── Token reference ────────────────────────────────────────────────── */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>All resolved values for the <strong>{theme.label}</strong> theme. Switch the preview theme above to see values for other products.</Lead>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {TOKEN_TABS.map(tab => (
            <button key={tab.key} onClick={() => setTokenTab(tab.key)} style={{
              padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid',
              borderColor: tokenTab === tab.key ? 'var(--brand-600)' : 'var(--stroke-primary)',
              background:  tokenTab === tab.key ? 'var(--brand-600)' : 'transparent',
              color:       tokenTab === tab.key ? '#fff' : 'var(--text-secondary)',
              transition: 'all 120ms',
            }}>
              {tab.label}
            </button>
          ))}
        </div>
        <TokenTable tokens={t} prefix={tokenTab} />

      </div>

      {/* ── TOC sidebar ──────────────────────────────────────────────────────── */}
      <aside style={{ width: 200, flexShrink: 0, position: 'sticky', top: 'calc(var(--topnav-height, 64px) + 32px)', alignSelf: 'flex-start', padding: '48px 24px 0 0' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>On this page</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TOC.map(item => {
            const isActive = activeSection === item.id
            return (
              <a key={item.id} href={`#${item.id}`}
                style={{
                  fontSize: 12,
                  color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: isActive ? 'var(--brand-50)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive ? '2px solid var(--brand-600)' : '2px solid transparent',
                  transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--brand-600)'; e.currentTarget.style.background = 'var(--brand-50)' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' } }}
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
