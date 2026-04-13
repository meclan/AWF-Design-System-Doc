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
  const s = { info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', label: 'Note' }, warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', label: 'Warning' } }[type]
  return <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: s.text, lineHeight: 1.65 }}><strong>{s.label}:</strong> {children}</div>
}
function DoBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && <div style={{ padding: '16px', background: 'var(--bg-primary)', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '16px', background: 'var(--bg-primary)', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Token-driven colors ──────────────────────────────────────────────────────

function getSidePanelColors(t) {
  const brandMid  = t['tabs.indicator']   || '#07a2b6'
  const brandDark = t['tabs.text.active'] || '#05606d'
  return {
    brandMid,
    brandDark,
    panelBg:      '#ffffff',
    panelBorder:  '#dfe3e8',
    divider:      '#e0e5ea',
    titleText:    '#1c252e',
    bodyText:     '#454f5b',
    labelText:    '#637381',
    closeDefault: '#919eab',
    closeHover:   '#454f5b',
    shadow:       '-6px 0 24px rgba(171, 190, 209, 0.35)',
    overlayBg:    'rgba(20, 26, 33, 0.45)',
    inputBg:      '#f4f6f8',
    inputBorder:  '#c4cdd5',
    chipBg:       '#ecf6fa',
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon({ size = 16, color = '#919eab' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}
function FilterIcon({ size = 14, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ChevronDown({ size = 14, color = '#919eab' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function SlidersIcon({ size = 14, color = '#637381' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="4" y1="21" x2="4" y2="14" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1="4" y1="10" x2="4" y2="3"  stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1="12" y1="21" x2="12" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1="12" y1="8"  x2="12" y2="3"  stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1="20" y1="21" x2="20" y2="16" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1="20" y1="12" x2="20" y2="3"  stroke={color} strokeWidth={2} strokeLinecap="round" />
      <circle cx="4"  cy="12" r="2" stroke={color} strokeWidth={2} fill="white" />
      <circle cx="12" cy="10" r="2" stroke={color} strokeWidth={2} fill="white" />
      <circle cx="20" cy="14" r="2" stroke={color} strokeWidth={2} fill="white" />
    </svg>
  )
}
function InfoIcon({ size = 13, color = '#637381' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}

// ─── Side Panel component ─────────────────────────────────────────────────────

function SidePanel({ isOpen, onClose, title, width = 300, mode = 'overlay', footer, children, C }) {
  const [closeHover, setCloseHover] = useState(false)
  return (
    <div style={{
      position: 'absolute',
      top: 0, right: 0, bottom: 0,
      width: isOpen ? width : 0,
      minWidth: 0,
      background: C.panelBg,
      borderLeft: isOpen ? `1px solid ${C.panelBorder}` : 'none',
      boxShadow: isOpen ? C.shadow : 'none',
      overflow: 'hidden',
      transition: 'width .28s cubic-bezier(.4,0,.2,1)',
      zIndex: mode === 'overlay' ? 20 : 5,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: C.titleText, fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}>{title}</span>
        <button
          onClick={onClose}
          onMouseEnter={() => setCloseHover(true)}
          onMouseLeave={() => setCloseHover(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 4, flexShrink: 0 }}
        >
          <CloseIcon size={16} color={closeHover ? C.closeHover : C.closeDefault} />
        </button>
      </div>
      {/* Divider */}
      <div style={{ height: 1, background: C.divider, flexShrink: 0 }} />
      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '14px 16px' }}>
        {children}
      </div>
      {/* Footer */}
      {footer && (
        <>
          <div style={{ height: 1, background: C.divider, flexShrink: 0 }} />
          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0 }}>
            {footer}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Filter panel body content ────────────────────────────────────────────────

function FilterPanelContent({ C }) {
  const [status, setStatus] = useState(['Active'])
  const statuses = ['Active', 'Inactive', 'Pending', 'Archived']
  const toggle = (s) => setStatus(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Date range */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: C.labelText, marginBottom: 8 }}>Date range</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {['From', 'To'].map(l => (
            <div key={l}>
              <div style={{ fontSize: 11, color: C.labelText, marginBottom: 3 }}>{l}</div>
              <div style={{ background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 6, padding: '6px 10px', fontSize: 12, color: C.inputBorder }}>YYYY-MM-DD</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 1, background: C.divider }} />
      {/* Status */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: C.labelText, marginBottom: 8 }}>Status</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {statuses.map(s => {
            const active = status.includes(s)
            return (
              <button
                key={s}
                onClick={() => toggle(s)}
                style={{
                  padding: '4px 10px', borderRadius: 12,
                  border: `1px solid ${active ? C.brandMid : C.inputBorder}`,
                  background: active ? C.chipBg : 'transparent',
                  color: active ? C.brandMid : C.labelText,
                  fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
                  fontWeight: active ? 500 : 400,
                }}
              >{s}</button>
            )
          })}
        </div>
      </div>
      <div style={{ height: 1, background: C.divider }} />
      {/* Region */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: C.labelText, marginBottom: 8 }}>Region</div>
        <div style={{ background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 6, padding: '7px 10px', fontSize: 12, color: C.inputBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>All regions</span>
          <ChevronDown size={12} color={C.inputBorder} />
        </div>
      </div>
    </div>
  )
}

// ─── App frame (mini mockup) ──────────────────────────────────────────────────

function AppFrame({ isOpen, onOpen, onClose, panelWidth, mode, showFooter, title, C, children, height = 300 }) {
  return (
    <div style={{
      position: 'relative',
      height: 400,
      border: '1px solid var(--stroke-primary)',
      borderRadius: 8,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
    }}>
      {/* App toolbar */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'var(--bg-primary)', zIndex: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard</span>
        <button
          onClick={() => isOpen ? onClose() : onOpen()}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 6, border: 'none',
            background: C.brandMid, color: '#fff',
            fontSize: 11, fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
          }}
        >
          <FilterIcon size={11} color="#fff" />
          {isOpen ? 'Close' : 'Filters'}
        </button>
      </div>

      {/* Content + panel row */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
        {/* Overlay backdrop */}
        {isOpen && mode === 'overlay' && (
          <div
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: C.overlayBg, zIndex: 10 }}
          />
        )}
        {/* Main content */}
        <div style={{
          flex: 1,
          padding: 14,
          transition: 'margin-right .28s cubic-bezier(.4,0,.2,1)',
          marginRight: (isOpen && mode === 'push') ? panelWidth : 0,
          overflowY: 'auto',
        }}>
          {children}
        </div>
        {/* Side panel */}
        <SidePanel
          isOpen={isOpen}
          onClose={onClose}
          title={title || 'Filters'}
          width={panelWidth}
          mode={mode}
          C={C}
          footer={showFooter ? (
            <>
              <button onClick={onClose} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #c4cdd5', background: 'transparent', color: '#454f5b', fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>Reset</button>
              <button onClick={onClose} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: C.brandMid, color: '#fff', fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>Apply</button>
            </>
          ) : null}
        >
          <FilterPanelContent C={C} />
        </SidePanel>
      </div>
    </div>
  )
}

// ─── Placeholder table rows (for app frames) ──────────────────────────────────

function PlaceholderTable({ rows = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 8 }}>
          <div style={{ height: 14, background: 'var(--bg-secondary)', borderRadius: 4, flex: 2 }} />
          <div style={{ height: 14, background: 'var(--bg-secondary)', borderRadius: 4, flex: 1 }} />
          <div style={{ height: 14, background: 'var(--bg-secondary)', borderRadius: 4, flex: 1 }} />
        </div>
      ))}
    </div>
  )
}

// ─── Live demo ────────────────────────────────────────────────────────────────

function LiveDemo({ t }) {
  const tokens = getComponentTokens(t.id)
  const C = getSidePanelColors(tokens)
  const [isOpen, setIsOpen] = useState(false)
  const [size, setSize] = useState('md')
  const [mode, setMode] = useState('overlay')
  const [showFooter, setShowFooter] = useState(true)

  const widths = { sm: 220, md: 270, lg: 310 }
  const panelWidth = widths[size]

  const btnBase = (active) => ({
    padding: '5px 12px', borderRadius: 6,
    border: `1px solid ${active ? C.brandMid : 'var(--stroke-primary)'}`,
    background: active ? C.brandMid : 'var(--bg-primary)',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: 11, fontWeight: 500, cursor: 'pointer',
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20, alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Size</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['sm','Small'],['md','Default'],['lg','Large']].map(([k,l]) => (
              <button key={k} onClick={() => setSize(k)} style={btnBase(size === k)}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Behavior</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['overlay','Overlay'],['push','Push']].map(([k,l]) => (
              <button key={k} onClick={() => { setMode(k); setIsOpen(false) }} style={btnBase(mode === k)}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Options</div>
          <button onClick={() => setShowFooter(v => !v)} style={btnBase(showFooter)}>Footer</button>
        </div>
      </div>
      <AppFrame
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        panelWidth={panelWidth}
        mode={mode}
        showFooter={showFooter}
        C={C}
        height={320}
      >
        <PlaceholderTable rows={5} />
      </AppFrame>
    </div>
  )
}

// ─── Anatomy diagram ──────────────────────────────────────────────────────────

function AnatomyCallout({ n, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{n}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  )
}

function AnatomyDiagram({ C }) {
  const badge = (n, style = {}) => (
    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style }}>{n}</span>
  )

  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Diagram */}
      <div style={{ flex: '0 0 480px', maxWidth: '100%', position: 'relative' }}>
        <div style={{ height: 380, border: '1px solid var(--stroke-primary)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--bg-primary)' }}>
          {/* Toolbar */}
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-primary)', zIndex: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.brandMid, borderRadius: 5, padding: '4px 10px' }}>
              <FilterIcon size={11} color="#fff" />
              <span style={{ fontSize: 11, color: '#fff' }}>Filters</span>
            </div>
          </div>

          {/* Body row */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
            {/* Overlay — ① */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,26,33,0.30)', zIndex: 10 }}>
              {badge(1, { position: 'absolute', top: 8, left: 8 })}
            </div>
            {/* Main content */}
            <div style={{ flex: 1, padding: 12 }}>
              <PlaceholderTable rows={3} />
            </div>
            {/* Panel — ② */}
            <div style={{ width: 200, background: C.panelBg, borderLeft: `1px solid ${C.panelBorder}`, boxShadow: C.shadow, display: 'flex', flexDirection: 'column', zIndex: 20, position: 'relative' }}>
              {badge(2, { position: 'absolute', top: -10, left: -10, zIndex: 30 })}
              {/* Panel header — ③ */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', position: 'relative' }}>
                {badge(3, { position: 'absolute', top: 4, left: -20 })}
                <span style={{ fontSize: 13, fontWeight: 600, color: C.titleText, fontFamily: 'Poppins, sans-serif' }}>Filters</span>
                <CloseIcon size={14} color={C.closeDefault} />
              </div>
              {/* Divider — ④ */}
              <div style={{ height: 1, background: C.divider, position: 'relative' }}>
                {badge(4, { position: 'absolute', right: -20, top: -9 })}
              </div>
              {/* Body — ⑤ */}
              <div style={{ flex: 1, padding: '10px 12px', overflow: 'hidden', position: 'relative' }}>
                {badge(5, { position: 'absolute', top: 4, right: -20 })}
                {[60, 80, 50].map((w, i) => (
                  <div key={i} style={{ height: 10, background: 'var(--bg-secondary)', borderRadius: 4, marginBottom: 8, width: `${w}%` }} />
                ))}
              </div>
              {/* Footer — ⑥ */}
              <div style={{ height: 1, background: C.divider }} />
              <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'flex-end', gap: 6, position: 'relative' }}>
                {badge(6, { position: 'absolute', top: 4, left: -20 })}
                <div style={{ padding: '3px 8px', borderRadius: 4, border: '1px solid #c4cdd5', fontSize: 10, color: '#454f5b' }}>Reset</div>
                <div style={{ padding: '3px 8px', borderRadius: 4, background: C.brandMid, fontSize: 10, color: '#fff' }}>Apply</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Callouts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 240, maxWidth: 320, paddingTop: 4 }}>
        <AnatomyCallout n={1} title="Overlay" desc="Semi-transparent backdrop that dims the page. Present in Overlay mode; absent in Push mode." />
        <AnatomyCallout n={2} title="Panel container" desc="White card attached to the right edge. Width: 275px (sm), 300px (md), or 350px (lg)." />
        <AnatomyCallout n={3} title="Header" desc="Panel title on the left, close (✕) button on the right. Always visible at the top." />
        <AnatomyCallout n={4} title="Divider" desc="1px separator between header and body, and between body and footer." />
        <AnatomyCallout n={5} title="Body" desc="Scrollable content area. Holds form fields, filters, navigation, or structured info." />
        <AnatomyCallout n={6} title="Footer (optional)" desc="Sticky action bar. Typically holds Reset + Apply (filter) or Cancel + Save (form) buttons." />
      </div>
    </div>
  )
}

// ─── Behavior comparison frames ───────────────────────────────────────────────

function BehaviorFrames({ C }) {
  const PANEL_W = 200

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Overlay */}
      <div>
        <H3>Overlay</H3>
        <P>The panel slides in on top of the page content. A semi-transparent backdrop dims the background and blocks interaction. Clicking the backdrop dismisses the panel.</P>
        <div style={{ height: 200, border: '1px solid var(--stroke-primary)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--stroke-primary)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard</span>
            <div style={{ padding: '3px 8px', background: C.brandMid, borderRadius: 4, fontSize: 10, color: '#fff' }}>Filters ▸</div>
          </div>
          <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
            {/* dimmed content */}
            <div style={{ flex: 1, padding: 10, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,26,33,.30)', zIndex: 1 }} />
              <PlaceholderTable rows={3} />
            </div>
            {/* panel — full height */}
            <div style={{ width: PANEL_W, background: C.panelBg, borderLeft: `1px solid ${C.panelBorder}`, boxShadow: C.shadow, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderBottom: `1px solid ${C.divider}` }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.titleText }}>Filters</span>
                <CloseIcon size={12} color={C.closeDefault} />
              </div>
              <div style={{ flex: 1, padding: 10 }}>
                {[70, 50, 85].map((w, i) => <div key={i} style={{ height: 8, background: '#f0f0f0', borderRadius: 4, marginBottom: 8, width: `${w}%` }} />)}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong>Use when:</strong> content behind the panel doesn't need to stay accessible. Best for filters, settings, or forms that require full attention.
        </div>
      </div>

      {/* Push */}
      <div>
        <H3>Push</H3>
        <P>The panel slides in and compresses the main content area to fit both on screen simultaneously. No backdrop is shown — the user can continue interacting with the page.</P>
        <div style={{ height: 200, border: '1px solid var(--stroke-primary)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--stroke-primary)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard</span>
            <div style={{ padding: '3px 8px', background: C.brandMid, borderRadius: 4, fontSize: 10, color: '#fff' }}>Filters ▸</div>
          </div>
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* compressed content */}
            <div style={{ flex: 1, padding: 10 }}>
              <PlaceholderTable rows={3} />
            </div>
            {/* panel */}
            <div style={{ width: PANEL_W, background: C.panelBg, borderLeft: `1px solid ${C.panelBorder}`, boxShadow: C.shadow, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderBottom: `1px solid ${C.divider}` }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.titleText }}>Filters</span>
                <CloseIcon size={12} color={C.closeDefault} />
              </div>
              <div style={{ flex: 1, padding: 10 }}>
                {[70, 50, 85].map((w, i) => <div key={i} style={{ height: 8, background: '#f0f0f0', borderRadius: 4, marginBottom: 8, width: `${w}%` }} />)}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong>Use when:</strong> users need to see and interact with the main content while the panel is open — e.g., live-filtering a table or comparing data.
        </div>
      </div>
    </div>
  )
}

// ─── Sizes preview ────────────────────────────────────────────────────────────

function SizesPreview({ C }) {
  const SIZES = [
    { key: 'sm', label: 'Small', token: 'sidepanel.width.sm', px: 275, note: 'Compact navigation sub-menus, brief settings lists.' },
    { key: 'md', label: 'Default', token: 'sidepanel.width.md', px: 300, note: 'Filters, form panels, and most standard use cases.' },
    { key: 'lg', label: 'Large', token: 'sidepanel.width.lg', px: 350, note: 'Complex forms, detail views, multi-section content.' },
  ]

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      {SIZES.map(s => (
        <div key={s.key} style={{ flex: '1 1 220px' }}>
          {/* Panel card */}
          <div style={{ background: C.panelBg, borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.panelBorder}`, boxShadow: '0 2px 8px rgba(171,190,209,.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: `1px solid ${C.divider}` }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.titleText, fontFamily: 'Poppins, sans-serif' }}>Filters</span>
              <CloseIcon size={14} color={C.closeDefault} />
            </div>
            <div style={{ padding: '12px 14px' }}>
              {[80, 60, 70].map((w, i) => <div key={i} style={{ height: 10, background: 'var(--bg-secondary)', borderRadius: 4, marginBottom: 8, width: `${w}%` }} />)}
            </div>
            <div style={{ borderTop: `1px solid ${C.divider}`, padding: '10px 14px', display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              <div style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #c4cdd5', fontSize: 11, color: '#454f5b' }}>Reset</div>
              <div style={{ padding: '4px 10px', borderRadius: 4, background: C.brandMid, fontSize: 11, color: '#fff' }}>Apply</div>
            </div>
          </div>
          {/* Label */}
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.label}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.px}px</span>
            </div>
            <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--brand-600)' }}>{s.token}</code>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>{s.note}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Use-case mockup (full filter panel) ─────────────────────────────────────

const TABLE_DATA = [
  { name: 'Acme Corp',     region: 'EMEA',  status: 'Active',   revenue: '$128K' },
  { name: 'ByteWorks',     region: 'APAC',  status: 'Pending',  revenue: '$54K'  },
  { name: 'Cloud Nine',    region: 'NAM',   status: 'Active',   revenue: '$312K' },
  { name: 'Delta Systems', region: 'EMEA',  status: 'Inactive', revenue: '$89K'  },
  { name: 'Echo Labs',     region: 'NAM',   status: 'Active',   revenue: '$204K' },
]

function UseCaseMockup({ C }) {
  const [open, setOpen] = useState(false)

  return (
    <AppFrame
      isOpen={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      panelWidth={270}
      mode="push"
      showFooter={true}
      title="Filters"
      C={C}
      height={380}
    >
      {/* Real table */}
      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, overflow: 'hidden', fontSize: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 80px 70px', padding: '7px 12px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
          {['Name','Region','Status','Revenue'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-tertiary)' }}>{h}</div>
          ))}
        </div>
        {TABLE_DATA.map((row, i) => (
          <div key={row.name} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 80px 70px', padding: '9px 12px', borderBottom: i < TABLE_DATA.length - 1 ? '1px solid var(--stroke-primary)' : 'none', background: 'var(--bg-primary)' }}>
            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.name}</div>
            <div style={{ color: 'var(--text-secondary)' }}>{row.region}</div>
            <div>
              <span style={{
                padding: '2px 7px', borderRadius: 8, fontSize: 11, fontWeight: 500,
                background: row.status === 'Active' ? '#d1fae5' : row.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                color: row.status === 'Active' ? '#065f46' : row.status === 'Pending' ? '#92400e' : '#991b1b',
              }}>{row.status}</span>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>{row.revenue}</div>
          </div>
        ))}
      </div>
    </AppFrame>
  )
}

// ─── Token reference ──────────────────────────────────────────────────────────

function TokenRow({ name, value, usage }) {
  return (
    <tr>
      <td style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--brand-600)', borderBottom: '1px solid var(--stroke-primary)' }}>{name}</td>
      <td style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{value}</td>
      <td style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{usage}</td>
    </tr>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SidePanelPage() {
  const [themeId, setThemeId] = useState(VISIBLE_THEMES[0].id)
  const t = VISIBLE_THEMES.find(x => x.id === themeId) || VISIBLE_THEMES[0]
  const tokens = getComponentTokens(t.id)
  const C = getSidePanelColors(tokens)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 32px 96px', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Layout & Overlay</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: 0 }}>Side Panel</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Theme:</span>
          {VISIBLE_THEMES.map(th => (
            <button
              key={th.id}
              onClick={() => setThemeId(th.id)}
              style={{
                padding: '4px 12px', borderRadius: 6,
                border: `1px solid ${th.id === themeId ? C.brandMid : 'var(--stroke-primary)'}`,
                background: th.id === themeId ? C.brandMid : 'var(--bg-primary)',
                color: th.id === themeId ? '#fff' : 'var(--text-secondary)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}
            >
              {th.name}
            </button>
          ))}
        </div>
      </div>
      <Lead>
        The Side Panel is a sliding overlay or push panel anchored to the right edge of the page. It surfaces contextual content — filters, settings, detail views — without navigating away. It is triggered by a CTA button and can either <strong>overlay</strong> the page or <strong>push</strong> the content to make room.
      </Lead>

      {/* ── Overview ────────────────────────────────────────────────────── */}
      <SectionAnchor id="overview" />
      <H2>Overview</H2>
      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
        <div style={{ padding: '24px 28px', background: 'var(--bg-primary)' }}>
          <LiveDemo t={t} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div>
          <H3>When to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>Filtering or refining data in a table or list view.</li>
            <li>Editing record details without leaving the main context.</li>
            <li>Displaying related info that enriches the current view.</li>
            <li>Step-by-step configuration that benefits from page context.</li>
          </ul>
        </div>
        <div>
          <H3>When not to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>Simple, quick actions — use a Modal or Popover Menu.</li>
            <li>Critical destructive confirmations — use a Modal.</li>
            <li>Primary navigation — use Sidebar or Navbar.</li>
            <li>Deeply complex tasks with many sub-steps — navigate to a page.</li>
          </ul>
        </div>
      </div>

      <InfoBox>
        The Side Panel always opens from the <strong>right</strong> to avoid competing with the application's left navigation sidebar.
      </InfoBox>

      <Divider />

      {/* ── Anatomy ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>
      <AnatomyDiagram C={C} />

      <Divider />

      {/* ── Behaviors ───────────────────────────────────────────────────── */}
      <SectionAnchor id="behavior" />
      <H2>Behavior modes</H2>
      <BehaviorFrames C={C} />

      <Divider />

      {/* ── Sizes ───────────────────────────────────────────────────────── */}
      <SectionAnchor id="sizes" />
      <H2>Sizes</H2>
      <P>Three fixed widths are available via token. The size should reflect the complexity of the panel content — choose the smallest size that comfortably fits the content.</P>
      <SizesPreview C={C} />

      <Divider />

      {/* ── Usage rules ─────────────────────────────────────────────────── */}
      <SectionAnchor id="usage" />
      <H2>Usage guidelines</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox>
          Use <strong>Push</strong> mode when users need to see and interact with the main content while the panel is open — for example, live-filtering a table and watching results update.
        </DoBox>
        <DontBox>
          Don't use Push mode on narrow screens or when the compressed content area becomes too small to be usable. Fall back to Overlay below a breakpoint (e.g. below 768px).
        </DontBox>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox>
          Keep the panel title concise and descriptive — "Filters", "Edit record", "User details". It should immediately tell the user what the panel is for.
        </DoBox>
        <DontBox>
          Don't open multiple side panels simultaneously. If a sub-action within the panel requires another panel, replace the current panel content or use breadcrumb-style back navigation inside it.
        </DontBox>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox>
          Always provide an explicit close mechanism — both the ✕ button in the header and, in Overlay mode, clicking the backdrop should dismiss the panel.
        </DoBox>
        <DontBox>
          Don't put critical or irreversible actions (e.g. "Delete") in the Side Panel footer without a confirmation step. Use a Modal for those.
        </DontBox>
      </div>

      <Divider />

      {/* ── Use case ────────────────────────────────────────────────────── */}
      <SectionAnchor id="use-case" />
      <H2>Use case — Data table with filter panel</H2>
      <P>
        Click <strong>Filters</strong> in the toolbar to open the Side Panel in Push mode. The table content compresses to the left while the panel shows active filter controls. Apply or Reset to close.
      </P>
      <UseCaseMockup C={C} />

      <Divider />

      {/* ── Accessibility ───────────────────────────────────────────────── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <InfoBox>
        Side Panels must manage focus correctly and be navigable by keyboard. In Overlay mode, background content must be made inert.
      </InfoBox>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['role / aria-label',    'Wrap the panel in <aside> or a <div role="complementary"> with an aria-label matching the panel title (e.g. "Filters panel").'],
          ['Focus management',     'Move focus to the first interactive element inside the panel when it opens. Restore focus to the trigger button when it closes.'],
          ['Focus trap (Overlay)', 'In Overlay mode, trap Tab and Shift+Tab within the panel so users cannot interact with the dimmed background.'],
          ['Escape to close',      'Pressing Escape must always close the panel and restore focus to the trigger — in both Overlay and Push modes.'],
          ['aria-expanded',        'Toggle aria-expanded="true/false" on the trigger button to reflect whether the panel is currently open.'],
          ['Push mode inertness',  'In Push mode, do NOT make background content inert — users must still be able to interact with the table or page.'],
          ['Scroll',               'Body content inside the panel must be independently scrollable. Use overflow-y: auto on the body section.'],
        ].map(([label, text]) => (
          <div key={label} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8, alignItems: 'flex-start' }}>
            <Code>{label}</Code>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{text}</span>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Token reference ─────────────────────────────────────────────── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Token</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Value</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Usage</th>
            </tr>
          </thead>
          <tbody>
            <TokenRow name="sidepanel.bg"         value="{color.bg.primary} — #ffffff"       usage="Panel background color" />
            <TokenRow name="sidepanel.stroke"      value="{color.stroke.subtle} — #dfe3e8"    usage="Left border of the panel card" />
            <TokenRow name="sidepanel.divider"     value="{color.stroke.subtle} — #dfe3e8"    usage="Horizontal dividers between header / body / footer" />
            <TokenRow name="sidepanel.width.sm"    value="275"                                usage="Small panel width (275px)" />
            <TokenRow name="sidepanel.width.md"    value="300"                                usage="Default panel width (300px)" />
            <TokenRow name="sidepanel.width.lg"    value="350"                                usage="Large panel width (350px)" />
            <TokenRow name="sidepanel.padding-x"   value="{numbers.spacing.md} — 16px"       usage="Horizontal padding inside the panel body" />
          </tbody>
        </table>
      </div>

    </div>
  )
}
