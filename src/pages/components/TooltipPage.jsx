import React, { useState } from 'react'
import { THEMES, getComponentTokens } from '../../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

const SHADOW_Z1 = '0px 2px 8px rgba(0,0,0,0.28)'

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
function InfoBox({ children }) {
  return <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#1e40af', lineHeight: 1.65 }}><strong>Note:</strong> {children}</div>
}
function DoBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && <div style={{ padding: '28px 18px', background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '28px 18px', background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>{visual}</div>}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Token extractor ──────────────────────────────────────────────────────────

function getTooltipColors(t) {
  return {
    bg:         t['tooltip.bg']          || '#1c252e',
    text:       t['tooltip.text']        || '#ffffff',
    radius:     (typeof t['tooltip.radius'] === 'number' ? t['tooltip.radius'] : null) ?? 6,
    paddingX:   t['tooltip.padding-x']   || 8,
    paddingY:   t['tooltip.padding-y']   || 6,
    fontSize:   t['tooltip.font-size']   || 11,
    fontWeight: t['tooltip.font-weight'] || 400,
    maxWidth:   t['tooltip.max-width']   || 240,
    // Page chrome
    brand:      t['tabs.indicator']                || '#07a2b6',
    surface:    t['card.style.outlined.bg']        || '#ffffff',
    stroke:     t['card.style.outlined.stroke']    || '#dfe3e8',
    textPrimary:   t['page.header.title']          || '#111827',
    textSecondary: t['page.header.description']    || '#6b7280',
  }
}

// ─── Arrow sizes ──────────────────────────────────────────────────────────────

const AW = 7  // arrow half-width (square side = AW * 2)
const GAP = AW + 4  // gap between trigger edge and tooltip bubble

function getPlacementStyles(placement) {
  const bubble = {}
  const arrow  = { position: 'absolute', width: AW * 2, height: AW * 2, transform: 'rotate(45deg)' }

  if (placement.startsWith('top')) {
    bubble.bottom = `calc(100% + ${GAP}px)`
    arrow.bottom = -(AW - 1)
    if (placement === 'top')       { bubble.left = '50%'; bubble.transform = 'translateX(-50%)'; arrow.left = '50%'; arrow.marginLeft = -AW }
    if (placement === 'top-start') { bubble.left = 0; arrow.left = AW * 2 }
    if (placement === 'top-end')   { bubble.right = 0; arrow.right = AW * 2 }
  }
  if (placement.startsWith('bottom')) {
    bubble.top = `calc(100% + ${GAP}px)`
    arrow.top = -(AW - 1)
    if (placement === 'bottom')       { bubble.left = '50%'; bubble.transform = 'translateX(-50%)'; arrow.left = '50%'; arrow.marginLeft = -AW }
    if (placement === 'bottom-start') { bubble.left = 0; arrow.left = AW * 2 }
    if (placement === 'bottom-end')   { bubble.right = 0; arrow.right = AW * 2 }
  }
  if (placement.startsWith('left')) {
    bubble.right = `calc(100% + ${GAP}px)`
    arrow.right = -(AW - 1)
    if (placement === 'left')       { bubble.top = '50%'; bubble.transform = 'translateY(-50%)'; arrow.top = '50%'; arrow.marginTop = -AW }
    if (placement === 'left-start') { bubble.top = 0; arrow.top = AW * 2 }
    if (placement === 'left-end')   { bubble.bottom = 0; arrow.bottom = AW * 2 }
  }
  if (placement.startsWith('right')) {
    bubble.left = `calc(100% + ${GAP}px)`
    arrow.left = -(AW - 1)
    if (placement === 'right')       { bubble.top = '50%'; bubble.transform = 'translateY(-50%)'; arrow.top = '50%'; arrow.marginTop = -AW }
    if (placement === 'right-start') { bubble.top = 0; arrow.top = AW * 2 }
    if (placement === 'right-end')   { bubble.bottom = 0; arrow.bottom = AW * 2 }
  }
  return { bubble, arrow }
}

// ─── Tooltip bubble ───────────────────────────────────────────────────────────

function TooltipBubble({ C, label, placement = 'top' }) {
  const { bubble, arrow } = getPlacementStyles(placement)
  return (
    <div style={{ position: 'absolute', ...bubble, zIndex: 100, pointerEvents: 'none' }}>
      {/* Arrow */}
      <div style={{ ...arrow, background: C.bg }} />
      {/* Bubble */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: C.bg,
        color: C.text,
        borderRadius: C.radius,
        padding: `${C.paddingY}px ${C.paddingX}px`,
        fontSize: C.fontSize,
        fontWeight: C.fontWeight,
        fontFamily: 'Poppins, sans-serif',
        boxShadow: SHADOW_Z1,
        lineHeight: 1.5,
        width: 'max-content',
        maxWidth: C.maxWidth,
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }}>
        {label}
      </div>
    </div>
  )
}

// ─── Hoverable tooltip wrapper ────────────────────────────────────────────────

function HoverTooltip({ C, label, placement = 'top', children }) {
  const [visible, setVisible] = useState(false)
  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <TooltipBubble C={C} label={label} placement={placement} />}
    </div>
  )
}

// ─── Mini SVG icons ───────────────────────────────────────────────────────────

function Icon({ name, size = 16, color = 'currentColor' }) {
  const paths = {
    edit:     <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:    <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    share:    <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    copy:     <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    info:     <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    lock:     <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    star:     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

// ─── Icon button trigger ──────────────────────────────────────────────────────

function IconBtn({ icon, C, disabled = false }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 8,
      background: disabled ? 'var(--bg-secondary)' : C.surface,
      border: `1px solid ${C.stroke}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      flexShrink: 0,
    }}>
      <Icon name={icon} size={15} color={disabled ? C.textSecondary : C.textPrimary} />
    </div>
  )
}

// ─── Interactive overview demo ────────────────────────────────────────────────

function OverviewDemo({ C }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: 12,
      padding: '48px 32px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 48,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Icon toolbar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 11, color: C.textSecondary, fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '.07em' }}>Icon toolbar</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { icon: 'edit',     label: 'Rename',   placement: 'top' },
            { icon: 'copy',     label: 'Duplicate', placement: 'top' },
            { icon: 'share',    label: 'Share with team', placement: 'top' },
            { icon: 'download', label: 'Export as CSV', placement: 'top' },
            { icon: 'trash',    label: 'Delete permanently', placement: 'top' },
          ].map(({ icon, label, placement }) => (
            <HoverTooltip key={icon} C={C} label={label} placement={placement}>
              <IconBtn icon={icon} C={C} />
            </HoverTooltip>
          ))}
        </div>
      </div>

      {/* Info sprinkle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 11, color: C.textSecondary, fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '.07em' }}>Info sprinkle</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.surface, border: `1px solid ${C.stroke}`, borderRadius: 8, padding: '10px 16px' }}>
          <span style={{ fontSize: 13, fontFamily: 'Poppins, sans-serif', color: C.textPrimary }}>API rate limit</span>
          <HoverTooltip C={C} label="Maximum 1,000 requests per minute per API key. Exceeding this limit returns a 429 error." placement="right">
            <div style={{ cursor: 'pointer', display: 'flex' }}>
              <Icon name="info" size={14} color={C.textSecondary} />
            </div>
          </HoverTooltip>
        </div>
      </div>

      {/* Disabled state */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 11, color: C.textSecondary, fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '.07em' }}>Disabled action</div>
        <HoverTooltip C={C} label="Upgrade to Pro to export data" placement="bottom">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8,
            background: 'var(--bg-secondary)',
            border: `1px solid ${C.stroke}`,
            fontSize: 13, fontFamily: 'Poppins, sans-serif',
            color: C.textSecondary,
            cursor: 'not-allowed', opacity: 0.55,
          }}>
            <Icon name="lock" size={13} color={C.textSecondary} />
            Export
          </div>
        </HoverTooltip>
      </div>

      {/* Truncated text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 11, color: C.textSecondary, fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '.07em' }}>Truncated text</div>
        <HoverTooltip C={C} label="Q4 2024 — Global Infrastructure Resilience & Performance Audit Report" placement="bottom">
          <div style={{
            width: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontSize: 13, fontFamily: 'Poppins, sans-serif', color: C.textPrimary,
            background: C.surface, border: `1px solid ${C.stroke}`,
            borderRadius: 8, padding: '10px 12px', cursor: 'default',
          }}>
            Q4 2024 — Global Infrastructure…
          </div>
        </HoverTooltip>
      </div>
    </div>
  )
}

// ─── Placement visualization ──────────────────────────────────────────────────

function TriggerPill({ C, label = 'Trigger' }) {
  return (
    <div style={{
      padding: '7px 16px', borderRadius: 8,
      background: C.surface, border: `1px solid ${C.stroke}`,
      fontSize: 12, fontFamily: 'Poppins, sans-serif',
      color: C.textPrimary, whiteSpace: 'nowrap',
    }}>
      {label}
    </div>
  )
}

function CrossPlacementViz({ C }) {
  return (
    <div style={{
      position: 'relative',
      height: 260,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-secondary)',
      borderRadius: 12,
    }}>
      <div style={{ position: 'relative' }}>
        <TriggerPill C={C} label="Element" />
        <TooltipBubble C={C} label="Top" placement="top" />
        <TooltipBubble C={C} label="Right" placement="right" />
        <TooltipBubble C={C} label="Bottom" placement="bottom" />
        <TooltipBubble C={C} label="Left" placement="left" />
      </div>
    </div>
  )
}

// ─── Alignment variants (top-start / top / top-end) ──────────────────────────

function AlignmentViz({ C }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: 12,
      padding: '60px 32px 32px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24,
    }}>
      {[
        { placement: 'top-start', label: 'Short label' },
        { placement: 'top',       label: 'Tooltip label' },
        { placement: 'top-end',   label: 'Short label' },
      ].map(({ placement, label }) => (
        <div key={placement} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44 }}>
          <div style={{ position: 'relative', width: 120 }}>
            <TriggerPill C={C} label="Trigger" />
            <TooltipBubble C={C} label={label} placement={placement} />
          </div>
          <div style={{ fontSize: 11, fontFamily: 'Poppins, sans-serif', color: C.textSecondary, textAlign: 'center' }}>
            <Code>{placement}</Code>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Max-width demo ───────────────────────────────────────────────────────────

function ContentDemo({ C }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: 12,
      padding: '48px 32px 32px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 32,
    }}>
      {[
        { label: 'Single word',   text: 'Rename',   note: 'Short label — tooltip wraps trigger width' },
        { label: 'Short phrase',  text: 'Save as template',  note: 'A few words — common pattern' },
        { label: 'Long sentence', text: 'Triggers a full re-index of all workspace data. This may take a few minutes.', note: `Wraps at max-width (${C.maxWidth}px)` },
      ].map(({ label, text, note }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44 }}>
          <div style={{ position: 'relative' }}>
            <TriggerPill C={C} label={label} />
            <TooltipBubble C={C} label={text} placement="top" />
          </div>
          <div style={{ fontSize: 11, color: C.textSecondary, fontFamily: 'Poppins, sans-serif', textAlign: 'center', lineHeight: 1.5 }}>{note}</div>
        </div>
      ))}
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

export default function TooltipPage() {
  const [themeIdx, setThemeIdx] = useState(0)
  const theme = VISIBLE_THEMES[themeIdx]
  const tokens = getComponentTokens(theme.id)
  const C = getTooltipColors(tokens)

  const THEME_COLORS = VISIBLE_THEMES.map(t => {
    const tk = getComponentTokens(t.id)
    return tk['tabs.indicator'] || '#07a2b6'
  })

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 32px 80px' }}>

      {/* ── Header ── */}
      <SectionAnchor id="top" />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-secondary)', marginBottom: 8 }}>LAYOUT & OVERLAY</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.8px', color: 'var(--text-primary)', margin: 0 }}>Tooltip</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif' }}>Theme:</span>
          {VISIBLE_THEMES.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setThemeIdx(i)}
              title={t.label}
              style={{
                width: 22, height: 22, borderRadius: '50%',
                background: THEME_COLORS[i],
                border: i === themeIdx ? '2px solid var(--text-primary)' : '2px solid transparent',
                outline: i === themeIdx ? '2px solid var(--bg-primary)' : 'none',
                outlineOffset: -4,
                cursor: 'pointer', padding: 0,
                boxSizing: 'border-box',
                transition: 'border-color .15s',
              }}
            />
          ))}
        </div>
      </div>

      <Lead>
        Tooltip is a transient, non-interactive overlay that reveals supplementary information when the user hovers over — or focuses — a trigger element. It disappears when the pointer leaves or focus moves away. Tooltips are display-only: they never contain links, buttons, or form controls.
      </Lead>

      <Divider />

      {/* ── Overview ── */}
      <SectionAnchor id="overview" />
      <H2>Overview</H2>
      <P>Hover over any element below to trigger its tooltip.</P>
      <OverviewDemo C={C} />

      <Divider />

      {/* ── When to use ── */}
      <SectionAnchor id="usage" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <H2>When to use</H2>
          <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 18, marginTop: 0 }}>
            <li>Labelling unlabelled icon buttons</li>
            <li>Expanding on truncated or ellipsed text</li>
            <li>Clarifying an abbreviation or technical term</li>
            <li>Explaining why an action is disabled</li>
            <li>Providing supplementary context for an info sprinkle (ⓘ)</li>
          </ul>
        </div>
        <div>
          <H2>When not to use</H2>
          <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 18, marginTop: 0 }}>
            <li>Essential information — if users must read it, don't hide it in a tooltip</li>
            <li>Links or call-to-action content — use a Popover instead</li>
            <li>Rich content (images, lists) — use a Popover or inline definition</li>
            <li>On mobile touch-only surfaces — hover tooltips are inaccessible on touch</li>
            <li>On interactive controls that already have a visible label</li>
          </ul>
        </div>
      </div>

      <Divider />

      {/* ── Anatomy ── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0 20px', background: 'var(--bg-secondary)', borderRadius: 12, marginBottom: 16 }}>
        {/* Annotated tooltip */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <TriggerPill C={C} label="Trigger element" />

          {/* Tooltip bubble (always visible) */}
          <div style={{ position: 'absolute', bottom: `calc(100% + ${GAP}px)`, left: '50%', transform: 'translateX(-50%)', zIndex: 10, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', width: AW * 2, height: AW * 2, background: C.bg, transform: 'rotate(45deg)', bottom: -(AW - 1), left: '50%', marginLeft: -AW }} />
            <div style={{ position: 'relative', zIndex: 1, background: C.bg, color: C.text, borderRadius: typeof C.radius === 'number' ? `${C.radius}px` : C.radius, padding: `${C.paddingY}px ${C.paddingX}px`, fontSize: C.fontSize, fontWeight: C.fontWeight, fontFamily: 'Poppins, sans-serif', boxShadow: SHADOW_Z1, whiteSpace: 'nowrap' }}>
              Tooltip label text
            </div>
          </div>

          {/* Callout lines */}
          {/* Arrow callout */}
          <div style={{ position: 'absolute', bottom: '100%', left: '50%', marginBottom: 2, whiteSpace: 'nowrap', transform: 'translateX(30px)', fontSize: 11, color: C.brand, fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
            ② Arrow (pointer)
          </div>
          {/* Bubble callout */}
          <div style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 40, whiteSpace: 'nowrap', transform: 'translateX(calc(100% + 8px))', fontSize: 11, color: C.brand, fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
            ① Container (bubble)
          </div>
          {/* Trigger callout */}
          <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translate(calc(100% + 8px), -50%)', whiteSpace: 'nowrap', fontSize: 11, color: C.brand, fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
            ③ Trigger element
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          ['①', 'Container', 'The tooltip bubble. Dark inverse background with white text, subtle shadow, small border-radius. Max-width constrains long labels.'],
          ['②', 'Arrow / pointer', 'A rotated square that visually anchors the tooltip to its trigger. Direction changes with placement.'],
          ['③', 'Trigger', 'Any focusable or hoverable element — icon button, text, badge, or form label. The tooltip is associated via aria-describedby.'],
        ].map(([n, label, desc]) => (
          <div key={n} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.brand, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontFamily: 'Poppins, sans-serif' }}>{n.replace(/[①②③]/, (m) => ['1','2','3'][['①','②','③'].indexOf(m)])}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, fontFamily: 'Poppins, sans-serif' }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Placements ── */}
      <SectionAnchor id="placements" />
      <H2>Placements</H2>
      <P>Tooltips support four primary directions. The tooltip repositions automatically if it would overflow the viewport.</P>

      <CrossPlacementViz C={C} />

      <H3>Alignment variants</H3>
      <P>Each direction supports three alignments: <Code>start</Code> (left/top edge), <Code>center</Code> (default), and <Code>end</Code> (right/bottom edge). Shown here for <Code>top</Code>.</P>
      <AlignmentViz C={C} />

      <Divider />

      {/* ── Content ── */}
      <SectionAnchor id="content" />
      <H2>Content</H2>
      <P>Tooltips are text-only. Labels can be a single word, a short phrase, or a full sentence. Long content wraps at <Code>tooltip.max-width</Code> ({C.maxWidth}px).</P>
      <ContentDemo C={C} />

      <H3>Writing guidelines</H3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          ['Be concise',     'Keep labels under 80 characters. If you need more, use a Popover.'],
          ['No punctuation', 'Skip the period at the end of short labels. Full sentences in long tooltips may include punctuation.'],
          ['Sentence case',  'Use sentence case, not Title Case or ALL CAPS.'],
          ['Active voice',   'Prefer "Save as template" over "Saves as a new template in your library."'],
        ].map(([term, desc]) => (
          <div key={term} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, fontSize: 13, padding: '9px 0', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{term}</span>
            <span style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Delay ── */}
      <SectionAnchor id="behavior" />
      <H2>Behavior</H2>
      <H3>Show / hide delay</H3>
      <P>Tooltips use an intentional delay before appearing to prevent flicker when the cursor passes over the trigger incidentally. The hide delay is shorter so the interface feels responsive.</P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          ['Show delay',   '300 ms', 'Prevents unwanted tooltips on fast cursor movement'],
          ['Hide delay',   '100 ms', 'Tooltip dismisses quickly when pointer leaves'],
          ['Focus delay',  '0 ms',   'Keyboard focus shows tooltip immediately'],
        ].map(([term, val, desc]) => (
          <div key={term} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif', marginBottom: 4 }}>{term}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', marginBottom: 6 }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>

      <H3>Persistence</H3>
      <P>Tooltips dismiss when: the pointer leaves the trigger, the trigger loses focus, the user presses <Code>Esc</Code>, or the page scrolls. They never persist on their own.</P>

      <Divider />

      {/* ── Guidance ── */}
      <SectionAnchor id="guidance" />
      <H2>Guidance</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DoBox
          visual={
            <HoverTooltip C={C} label="Delete item" placement="top">
              <IconBtn icon="trash" C={C} />
            </HoverTooltip>
          }
        >
          Use tooltips to label unlabelled icon buttons. A tooltip is the minimum requirement for an icon-only action.
        </DoBox>
        <DontBox
          visual={
            <HoverTooltip C={C} label="Click here to delete this item from your workspace. This action cannot be undone. Please make sure you want to proceed before clicking." placement="top">
              <IconBtn icon="trash" C={C} />
            </HoverTooltip>
          }
        >
          Don't write instructions or warnings in tooltips. Essential information must be always visible — not hidden behind hover.
        </DontBox>
        <DoBox
          visual={
            <HoverTooltip C={C} label="Upgrade to Pro to access this feature" placement="bottom">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--bg-secondary)', border: `1px solid ${C.stroke}`, fontSize: 12, fontFamily: 'Poppins, sans-serif', color: C.textSecondary, opacity: 0.6, cursor: 'not-allowed' }}>
                <Icon name="star" size={13} color={C.textSecondary} />
                Advanced export
              </div>
            </HoverTooltip>
          }
        >
          Explain why a control is disabled via tooltip. This reduces frustration and guides users toward the right action.
        </DoBox>
        <DontBox
          visual={
            <HoverTooltip C={C} label="Learn more →" placement="bottom">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Poppins, sans-serif', color: C.brand, cursor: 'pointer' }}>
                <Icon name="info" size={14} color={C.brand} />
                Need help?
              </div>
            </HoverTooltip>
          }
        >
          Don't put links or calls-to-action inside tooltips. Interactive content in a tooltip is inaccessible via keyboard.
        </DontBox>
      </div>

      <Divider />

      {/* ── Accessibility ── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['role="tooltip"',      'The tooltip container must have role="tooltip". This communicates its purpose to assistive technologies.'],
          ['aria-describedby',    'The trigger element should set aria-describedby pointing to the tooltip\'s id so screen readers announce the tooltip text after the trigger label.'],
          ['Keyboard trigger',    'Tooltips must appear on :focus as well as :hover. Keyboard users navigating with Tab must be able to read all tooltip content.'],
          ['Escape to dismiss',   'Pressing Escape must hide the tooltip. This follows the ARIA Authoring Practices for tooltips (APG).'],
          ['No interactive content', 'Never place focusable elements (links, buttons) inside a tooltip. If you need interactive content, use a Popover.'],
          ['Touch devices',       'Do not rely solely on tooltips to convey information on touch-only devices. Consider using visible labels or a bottom sheet instead.'],
        ].map(([term, desc]) => (
          <div key={term} style={{ display: 'grid', gridTemplateColumns: '172px 1fr', gap: 12, fontSize: 13, padding: '10px 0', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{term}</span>
            <span style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Token reference ── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>
      <TokenTable themeId={theme.id} rows={[
        ['tooltip.bg',          'Tooltip background (dark inverse)'],
        ['tooltip.text',        'Tooltip text color (inverse)'],
        ['tooltip.radius',      'Border radius of the bubble'],
        ['tooltip.padding-x',   'Horizontal padding inside the bubble'],
        ['tooltip.padding-y',   'Vertical padding inside the bubble'],
        ['tooltip.font-size',   'Label font size'],
        ['tooltip.font-weight', 'Label font weight'],
        ['tooltip.max-width',   'Maximum width before text wraps (px)'],
        ['tooltip.shadow',      'Shadow level reference (Z1)'],
      ]} />

    </div>
  )
}
