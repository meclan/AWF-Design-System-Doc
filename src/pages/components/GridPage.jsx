import React, { useState } from 'react'
import { THEMES, getComponentTokens } from '../../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

// ─── Grid constants ───────────────────────────────────────────────────────────

const COLS = 12
const SIDEBAR_EXPANDED  = 260
const SIDEBAR_COLLAPSED = 60

const BREAKPOINTS = [
  { name: 'lg',  min: 1024, cols: 12, gutter: 16, margin: 16,  label: 'Small laptop'    },
  { name: 'xl',  min: 1440, cols: 12, gutter: 24, margin: 24,  label: 'Desktop'         },
  { name: 'xxl', min: 1920, cols: 12, gutter: 24, margin: 32,  label: 'Wide screen'     },
]

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionAnchor({ id }) {
  return <span id={id} style={{ display: 'block', marginTop: -80, paddingTop: 80 }} />
}
function H2({ children }) {
  return <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--text-primary)', marginBottom: 12, marginTop: 56 }}>{children}</h2>
}
function H3({ children }) {
  return <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, marginTop: 28 }}>{children}</h3>
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
function Rule() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--stroke-primary)', margin: '48px 0' }} />
}
function DoBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && <div style={{ padding: '24px 20px', background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>{visual}</div>}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 5 }}>✓ Do</div>
        <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}
function DontBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #fecaca', background: '#fef2f2', borderRadius: 8, overflow: 'hidden' }}>
      {visual && <div style={{ padding: '24px 20px', background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>{visual}</div>}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Token extractor ──────────────────────────────────────────────────────────

function getGridColors(t) {
  return {
    brand:        t['tabs.indicator']              || '#07a2b6',
    surface:      t['card.style.outlined.bg']      || '#ffffff',
    stroke:       t['card.style.outlined.stroke']  || '#dfe3e8',
    navbarBg:     t['navbar.bg']                   || '#f3f6f9',
    textPrimary:  t['page.header.title']           || '#111827',
    textSecondary:t['page.header.description']     || '#6b7280',
    activeBg:     t['navbar.item.active.bg']       || '#e8f4f6',
  }
}

// ─── Column Visualizer ────────────────────────────────────────────────────────

function ColumnVisualizer({ C, highlightSpan = 0, highlightStart = 0, gutter = 24 }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Column grid */}
      <div style={{ display: 'flex', gap: gutter, padding: `0 0` }}>
        {Array.from({ length: COLS }, (_, i) => {
          const inSpan = highlightSpan > 0 && i >= highlightStart && i < highlightStart + highlightSpan
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 32,
                borderRadius: 4,
                background: inSpan ? C.brand : C.brand + '25',
                transition: 'background .2s',
                position: 'relative',
              }}
            >
              <span style={{
                position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
                fontSize: 9, color: C.textSecondary, fontFamily: 'JetBrains Mono, monospace',
                opacity: i % 2 === 0 ? 1 : 0.5,
              }}>{i + 1}</span>
            </div>
          )
        })}
      </div>
      {/* Gutter label */}
      {gutter > 0 && (
        <div style={{
          position: 'absolute', top: '50%', left: `calc(${(1 / COLS) * 100}% + 2px)`,
          transform: 'translateY(-50%)', width: gutter - 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 9, color: C.brand, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>{gutter}px</span>
        </div>
      )}
    </div>
  )
}

// ─── Span Demo Row ────────────────────────────────────────────────────────────

function SpanRow({ C, span, gutter = 24, label }) {
  const pct = (span / COLS) * 100
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: gutter, height: 28 }}>
        {/* Filled span */}
        <div style={{
          flexBasis: `${pct}%`, maxWidth: `${pct}%`,
          background: C.brand,
          borderRadius: 4,
          display: 'flex', alignItems: 'center', paddingLeft: 8,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
            {label || `${span} col`}
          </span>
        </div>
        {/* Remaining space */}
        {span < COLS && (
          <div style={{
            flex: 1,
            background: C.brand + '18',
            borderRadius: 4,
            border: `1px dashed ${C.brand}55`,
          }} />
        )}
      </div>
    </div>
  )
}

// ─── Sidebar-aware layout mockup ──────────────────────────────────────────────

function LayoutMockup({ C, sidebarWidth, viewportLabel, gutter, margin, cols }) {
  const TOTAL_W = 420
  const scale = TOTAL_W / 1440
  const scaledSidebar = Math.round(sidebarWidth * scale)
  const contentW = TOTAL_W - scaledSidebar
  const scaledGutter = Math.round(gutter * scale)
  const scaledMargin = Math.round(margin * scale)
  const innerW = contentW - scaledMargin * 2
  const colW = (innerW - scaledGutter * (cols - 1)) / cols

  return (
    <div style={{ border: `1px solid ${C.stroke}`, borderRadius: 10, overflow: 'hidden', background: C.surface }}>
      {/* Viewport label */}
      <div style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderBottom: `1px solid ${C.stroke}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif' }}>{viewportLabel}</span>
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{cols} cols · {gutter}px gutter · {margin}px margin</span>
      </div>

      <div style={{ display: 'flex', height: 100 }}>
        {/* Sidebar */}
        <div style={{
          width: scaledSidebar, flexShrink: 0,
          background: C.navbarBg,
          display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, gap: 4,
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              width: sidebarWidth === SIDEBAR_COLLAPSED ? 20 : scaledSidebar - 12,
              height: 8, borderRadius: 4,
              background: i === 1 ? C.brand + '40' : C.stroke,
            }} />
          ))}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: `8px ${scaledMargin}px` }}>
          {/* Column overlays */}
          <div style={{ display: 'flex', gap: scaledGutter, height: '100%' }}>
            {Array.from({ length: cols }, (_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: C.brand + '18',
                  borderRadius: 2,
                  border: `1px solid ${C.brand}33`,
                }}
              />
            ))}
          </div>
          {/* Margin indicators */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: scaledMargin,
            background: `repeating-linear-gradient(45deg, ${C.brand}15, ${C.brand}15 2px, transparent 2px, transparent 6px)`,
          }} />
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: scaledMargin,
            background: `repeating-linear-gradient(-45deg, ${C.brand}15, ${C.brand}15 2px, transparent 2px, transparent 6px)`,
          }} />
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, padding: '6px 12px', borderTop: `1px solid ${C.stroke}`, background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: C.brand + '30', border: `1px solid ${C.brand}55`, borderRadius: 2 }} />
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Column</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: `repeating-linear-gradient(45deg, ${C.brand}30, ${C.brand}30 2px, transparent 2px, transparent 6px)`, borderRadius: 2 }} />
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Margin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: C.navbarBg, border: `1px solid ${C.stroke}`, borderRadius: 2 }} />
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
            Sidebar {sidebarWidth === SIDEBAR_EXPANDED ? `(expanded · ${SIDEBAR_EXPANDED}px)` : `(collapsed · ${SIDEBAR_COLLAPSED}px)`}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Spacing token table ──────────────────────────────────────────────────────

const SPACING_TOKENS = [
  { name: 'spacing.xxxs', value: 6,  alias: '—',        use: 'Micro gap, dense list item padding' },
  { name: 'spacing.xs',   value: 10, alias: '—',        use: 'Icon padding, chip padding' },
  { name: 'spacing.sm',   value: 12, alias: '—',        use: 'Compact gutter (4-col grid)' },
  { name: 'spacing.md',   value: 16, alias: 'space040', use: 'Default gutter & margin (md)' },
  { name: 'spacing.lg',   value: 20, alias: '—',        use: 'Card padding' },
  { name: 'spacing.xl',   value: 24, alias: 'space050', use: 'Default gutter & margin (lg, xl)' },
  { name: 'spacing.xxl',  value: 32, alias: '—',        use: 'Outer margin (xl, xxl breakpoints)' },
  { name: 'spacing.xxxl', value: 40, alias: '—',        use: 'Section spacing' },
]

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GridPage() {
  const [themeIdx, setThemeIdx] = useState(0)
  const [activeSpan, setActiveSpan] = useState(6)
  const [sidebarState, setSidebarState] = useState('expanded') // 'expanded' | 'collapsed'
  const [activeBp, setActiveBp] = useState(1) // index into BREAKPOINTS

  const theme = VISIBLE_THEMES[themeIdx]
  const tokens = getComponentTokens(theme.id)
  const C = getGridColors(tokens)
  const THEME_COLORS = VISIBLE_THEMES.map(t => getComponentTokens(t.id)['tabs.indicator'] || '#07a2b6')

  const bp = BREAKPOINTS[activeBp]
  const sidebarW = sidebarState === 'expanded' ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED

  const SPANS = [
    { span: 12, label: 'Full width — 12 col' },
    { span: 9,  label: '9 col (¾)' },
    { span: 8,  label: '8 col (⅔)' },
    { span: 6,  label: '6 col (½)' },
    { span: 4,  label: '4 col (⅓)' },
    { span: 3,  label: '3 col (¼)' },
    { span: 2,  label: '2 col' },
    { span: 1,  label: '1 col' },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 32px 80px' }}>

      {/* ── Header ── */}
      <SectionAnchor id="top" />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-secondary)', marginBottom: 8 }}>LAYOUT & OVERLAY</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.8px', color: 'var(--text-primary)', margin: 0 }}>Grid</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif' }}>Theme:</span>
          {VISIBLE_THEMES.map((t, i) => (
            <button key={t.id} onClick={() => setThemeIdx(i)} title={t.label} style={{
              width: 22, height: 22, borderRadius: '50%', background: THEME_COLORS[i], cursor: 'pointer', padding: 0, boxSizing: 'border-box',
              border: i === themeIdx ? '2px solid var(--text-primary)' : '2px solid transparent',
              outline: i === themeIdx ? '2px solid var(--bg-primary)' : 'none', outlineOffset: -4,
              transition: 'border-color .15s',
            }} />
          ))}
        </div>
      </div>

      <Lead>
        The Grid is the spatial backbone of every ARCAD screen. It defines a 12-column flexbox layout with consistent gutters and margins across three desktop breakpoints — small laptop, desktop, and wide screen. Because ARCAD products are sidebar-driven, the grid is <strong>sidebar-aware</strong> — columns fill the available content area, not the full viewport.
      </Lead>

      <Rule />

      {/* ── Interactive column visualizer ── */}
      <SectionAnchor id="overview" />
      <H2>Column visualizer</H2>
      <P>The grid is always <strong>12 columns</strong>. Gutters (the gaps between columns) and margins (the space between the grid and the container edge) scale with the breakpoint.</P>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Span:</span>
            {[1, 2, 3, 4, 6, 8, 9, 12].map(s => (
              <button key={s} onClick={() => setActiveSpan(s)} style={{
                padding: '3px 9px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
                background: activeSpan === s ? C.brand : 'transparent',
                color: activeSpan === s ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${activeSpan === s ? C.brand : 'var(--stroke-primary)'}`,
                transition: 'all .15s',
              }}>{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Gutter:</span>
            {[16, 24].map(g => (
              <button key={g} onClick={() => {}} style={{
                padding: '3px 9px', borderRadius: 6, fontSize: 12,
                fontFamily: 'JetBrains Mono, monospace', cursor: 'default',
                background: bp.gutter === g ? C.brand + '20' : 'transparent',
                color: bp.gutter === g ? C.brand : 'var(--text-secondary)',
                border: `1px solid ${bp.gutter === g ? C.brand + '60' : 'var(--stroke-primary)'}`,
              }}>{g}px</button>
            ))}
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>(set by breakpoint below)</span>
          </div>
        </div>

        {/* Column strip */}
        <div style={{ padding: `0 ${bp.margin}px` }}>
          <ColumnVisualizer C={C} highlightSpan={activeSpan} highlightStart={0} gutter={bp.gutter} />
        </div>
        <div style={{ marginTop: 28, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 14, background: C.brand, borderRadius: 3 }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Active span ({activeSpan} of 12 = {Math.round((activeSpan / 12) * 100)}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 14, background: C.brand + '25', borderRadius: 3 }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Remaining columns</span>
          </div>
        </div>
      </div>

      <Rule />

      {/* ── Breakpoints ── */}
      <SectionAnchor id="breakpoints" />
      <H2>Breakpoints</H2>
      <P>ARCAD is a desktop-only design system. Three breakpoints cover small laptop through wide screen. Select a row to preview the column grid and layout mockups below.</P>

      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Breakpoint', 'Min width', 'Label', 'Columns', 'Gutter', 'Margin'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BREAKPOINTS.map((row, i) => (
              <tr
                key={row.name}
                onClick={() => setActiveBp(i)}
                style={{
                  borderBottom: '1px solid var(--stroke-primary)',
                  background: activeBp === i ? C.brand + '10' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background .15s',
                }}
              >
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {activeBp === i && <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.brand, flexShrink: 0 }} />}
                    <Code>{row.name}</Code>
                  </div>
                </td>
                <td style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{row.min}px</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{row.label}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: activeBp === i ? C.brand : 'var(--text-primary)' }}>{row.cols}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{row.gutter}px</td>
                <td style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{row.margin}px</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Rule />

      {/* ── Sidebar-aware layout ── */}
      <SectionAnchor id="sidebar" />
      <H2>Sidebar-aware layout</H2>
      <P>Unlike most design systems, ARCAD's grid is defined relative to the <strong>content area</strong> — the space to the right of the sidebar. The sidebar exists in two states: expanded (240px) and collapsed (56px). Columns always fill the remaining width.</P>

      {/* Sidebar toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['expanded', 'collapsed'].map(state => (
          <button
            key={state}
            onClick={() => setSidebarState(state)}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
              background: sidebarState === state ? C.brand : 'transparent',
              color: sidebarState === state ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${sidebarState === state ? C.brand : 'var(--stroke-primary)'}`,
              transition: 'all .15s',
            }}
          >
            {state === 'expanded' ? `Expanded (${SIDEBAR_EXPANDED}px)` : `Collapsed (${SIDEBAR_COLLAPSED}px)`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {BREAKPOINTS.map((row, i) => (
          <LayoutMockup
            key={row.name}
            C={C}
            sidebarWidth={sidebarW}
            viewportLabel={`${row.name} — ${row.min}px+`}
            gutter={row.gutter}
            margin={row.margin}
            cols={row.cols}
          />
        ))}
      </div>

      {/* Effective content widths table */}
      <H3>Effective content widths</H3>
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Viewport', 'Sidebar', 'Content area', '12-col width', 'Column width'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { vp: 1024, bp: BREAKPOINTS[0] },
              { vp: 1440, bp: BREAKPOINTS[1] },
              { vp: 1920, bp: BREAKPOINTS[2] },
            ].flatMap(({ vp, bp }) =>
              [SIDEBAR_EXPANDED, SIDEBAR_COLLAPSED].map(sw => {
                const contentArea = vp - sw
                const innerW = contentArea - bp.margin * 2
                const colW = Math.round((innerW - bp.gutter * (bp.cols - 1)) / bp.cols)
                return (
                  <tr key={`${vp}-${sw}`} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
                    <td style={{ padding: '9px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{vp}px</td>
                    <td style={{ padding: '9px 14px', color: 'var(--text-secondary)' }}>{sw === SIDEBAR_EXPANDED ? 'Expanded' : 'Collapsed'} ({sw}px)</td>
                    <td style={{ padding: '9px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{contentArea}px</td>
                    <td style={{ padding: '9px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{contentArea - bp.margin * 2}px</td>
                    <td style={{ padding: '9px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: C.brand, fontWeight: 600 }}>~{colW}px</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Rule />

      {/* ── Span system ── */}
      <SectionAnchor id="spans" />
      <H2>Span system</H2>
      <P>Content elements span 1 to 12 columns. Use proportional spans to create consistent visual rhythm — prefer halves, thirds, and quarters over arbitrary values.</P>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '24px 24px 16px' }}>
        {SPANS.map(({ span, label }) => (
          <SpanRow key={span} C={C} span={span} gutter={bp.gutter} label={label} />
        ))}
      </div>

      <H3>Recommended spans</H3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 8 }}>
        {[
          { span: 12, label: 'Full',        use: 'Page hero, data tables, full-width banners' },
          { span: 6,  label: 'Half',        use: 'Two-column layouts, card pairs' },
          { span: 4,  label: 'Third',       use: 'Three-up card grids, stat blocks' },
          { span: 3,  label: 'Quarter',     use: 'Four-up card grids, metric tiles' },
          { span: 9,  label: '¾ width',     use: 'Main content with a narrow sidebar' },
          { span: 8,  label: '⅔ width',     use: 'Primary content column' },
          { span: 2,  label: '2 col',       use: 'Compact action areas, labels' },
          { span: 1,  label: '1 col',       use: 'Thin controls, status indicators' },
        ].map(({ span, label, use }) => (
          <div key={span} style={{ background: C.surface, border: `1px solid ${C.stroke}`, borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.brand, fontFamily: 'Poppins, sans-serif' }}>{span}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>col — {label}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{use}</div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Offset ── */}
      <SectionAnchor id="offset" />
      <H2>Offset</H2>
      <P>An offset pushes a column block to the right by N columns. Offsets center or right-align content within the grid without adding invisible filler elements. Offset is always relative to the start of the content area (after margin).</P>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '24px 24px 16px' }}>
        {[
          { span: 8, offset: 0, label: '8 col, no offset' },
          { span: 8, offset: 2, label: '8 col, 2 col offset (centered)' },
          { span: 6, offset: 3, label: '6 col, 3 col offset (centered)' },
          { span: 4, offset: 8, label: '4 col, 8 col offset (right)' },
        ].map(({ span, offset, label }) => (
          <div key={label} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: bp.gutter, height: 28 }}>
              {/* Offset ghost */}
              {offset > 0 && (
                <div style={{
                  flexBasis: `${(offset / COLS) * 100}%`, maxWidth: `${(offset / COLS) * 100}%`,
                  border: `1px dashed ${C.brand}40`, borderRadius: 4, flexShrink: 0,
                }} />
              )}
              {/* Filled span */}
              <div style={{
                flexBasis: `${(span / COLS) * 100}%`, maxWidth: `${(span / COLS) * 100}%`,
                background: C.brand, borderRadius: 4, flexShrink: 0,
                display: 'flex', alignItems: 'center', paddingLeft: 8,
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {/* Remaining */}
              {offset + span < COLS && (
                <div style={{ flex: 1, background: C.brand + '18', borderRadius: 4, border: `1px dashed ${C.brand}55` }} />
              )}
            </div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Spacing scale ── */}
      <SectionAnchor id="spacing" />
      <H2>Spacing scale</H2>
      <P>The grid uses the primitive spacing scale for gutters and margins. All values are multiples of <strong>4px</strong> (the base unit). The same scale drives component padding and section spacing throughout the design system.</P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        {SPACING_TOKENS.map(({ name, value }) => (
          <div key={name} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: Math.min(value, 48), height: 6, borderRadius: 3, background: C.brand }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}>{value}px</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{name}</div>
          </div>
        ))}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
        <thead>
          <tr style={{ background: 'var(--bg-secondary)' }}>
            {['Token', 'Value', 'Used for'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--stroke-primary)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SPACING_TOKENS.map(({ name, value, use }) => (
            <tr key={name} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
              <td style={{ padding: '9px 14px' }}><Code>{name}</Code></td>
              <td style={{ padding: '9px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{value}px</td>
              <td style={{ padding: '9px 14px', color: 'var(--text-secondary)' }}>{use}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Rule />

      {/* ── Do/Don't ── */}
      <SectionAnchor id="guidance" />
      <H2>Guidance</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DoBox
          visual={
            <div style={{ width: '100%', display: 'flex', gap: 8 }}>
              {[6, 6].map((s, i) => (
                <div key={i} style={{ flex: s, height: 32, background: C.brand + '40', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.brand }}>6 col</span>
                </div>
              ))}
            </div>
          }
        >
          Align elements to grid columns. Use span values that divide evenly (12, 6, 4, 3) to create consistent rhythm.
        </DoBox>
        <DontBox
          visual={
            <div style={{ width: '100%', display: 'flex', gap: 8 }}>
              {[5, 7].map((s, i) => (
                <div key={i} style={{ flex: s, height: 32, background: '#fca5a5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#dc2626' }}>{s} col</span>
                </div>
              ))}
            </div>
          }
        >
          Don't use arbitrary spans (5+7, 11, 7) that break the proportional system and make layouts hard to align.
        </DontBox>
        <DoBox
          visual={
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ width: '100%', height: 14, background: C.brand + '40', borderRadius: 3 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                {[4, 4, 4].map((s, i) => <div key={i} style={{ flex: 1, height: 28, background: C.brand + '25', borderRadius: 3 }} />)}
              </div>
            </div>
          }
        >
          Nest content blocks within the grid — a full-width header over a three-column card row is a valid and common pattern.
        </DoBox>
        <DontBox
          visual={
            <div style={{ width: '100%', display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, height: 40, background: '#fca5a5', borderRadius: 3 }} />
              <div style={{ width: 3, height: 40, background: '#dc2626' }} />
              <div style={{ flex: 1, height: 40, background: '#fca5a5', borderRadius: 3 }} />
            </div>
          }
        >
          Don't use pixel-fixed widths for primary layout regions. Always use column spans so content adapts when the sidebar toggles.
        </DontBox>
      </div>

      <Rule />

      {/* ── Accessibility ── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[
          ['Reading order',      'The visual column order must match the DOM order. Never use CSS order to reorder content that users navigate sequentially — this breaks keyboard and screen-reader order.'],
          ['Hidden columns',     'When a column is hidden at a breakpoint, use display:none (not visibility:hidden or opacity:0) so that hidden content is also removed from the focus order.'],
          ['Landmark regions',   'Columns are purely layout — they carry no semantic meaning. Wrap content regions with appropriate landmarks (<main>, <aside>, <nav>) regardless of the column they sit in.'],
          ['Responsive focus',   'When sidebar toggles (collapsed ↔ expanded), verify that the focused element does not lose focus or shift unexpectedly. The grid should reflow without resetting the keyboard position.'],
          ['Min click target',   'Even on desktop, interactive elements should meet the 32×32px minimum click target. In a narrow column (1–2 col), reduce padding or increase the span rather than shrinking the control.'],
        ].map(([term, desc]) => (
          <div key={term} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, fontSize: 13, padding: '10px 0', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{term}</span>
            <span style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Token reference ── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>
      <P>The grid has no dedicated component tokens. It derives its visual properties from the primitive spacing scale and from card/surface tokens for content area rendering.</P>
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Token', 'Resolved value', 'Role'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['card.style.outlined.bg',     tokens['card.style.outlined.bg'],     'Content area surface color'],
              ['card.style.outlined.stroke',  tokens['card.style.outlined.stroke'],  'Content area border color'],
              ['card.style.outlined.shadow',  tokens['card.style.outlined.shadow'],  'Content area elevation'],
              ['card.style.outlined.radius',  tokens['card.style.outlined.radius'],  'Content area corner radius'],
              ['card.style.ghost.bg',         tokens['card.style.ghost.bg'],         'Ghost/transparent content area'],
              ['card.style.ghost.radius',     tokens['card.style.ghost.radius'],     'Ghost content area corner radius'],
            ].map(([key, val, role]) => (
              <tr key={key} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
                <td style={{ padding: '9px 14px' }}><Code>{key}</Code></td>
                <td style={{ padding: '9px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {typeof val === 'string' && val.startsWith('#') && (
                      <div style={{ width: 14, height: 14, borderRadius: 3, background: val, border: '1px solid rgba(0,0,0,.1)', flexShrink: 0 }} />
                    )}
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{val ?? '—'}</span>
                  </div>
                </td>
                <td style={{ padding: '9px 14px', color: 'var(--text-secondary)' }}>{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
