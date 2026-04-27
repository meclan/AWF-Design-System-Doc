import React from 'react'

export function SectionAnchor({ id }) {
  return <span id={id} style={{ display: 'block', marginTop: -80, paddingTop: 80 }} />
}
export function H2({ children }) {
  return <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--text-primary)', marginBottom: 12, marginTop: 56 }}>{children}</h2>
}
export function H3({ children }) {
  return <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, marginTop: 24 }}>{children}</h3>
}
export function Lead({ children }) {
  return <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20 }}>{children}</p>
}
export function P({ children }) {
  return <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 14 }}>{children}</p>
}
export function Code({ children }) {
  return <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: 'var(--bg-secondary)', color: 'var(--brand-600)', padding: '1px 6px', borderRadius: 4 }}>{children}</code>
}
export function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--stroke-primary)', margin: '48px 0' }} />
}
export function InfoBox({ type = 'info', children, style }) {
  const s = {
    info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', label: 'Note' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', label: 'Warning' },
  }[type]
  return <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: s.text, lineHeight: 1.65, ...style }}><strong>{s.label}:</strong> {children}</div>
}
export function RowLabel({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>{children}</div>
}
export function DoBox({ children, visual, visualMinHeight = 60, visualBg = '#ffffff', visualPadding = '16px 18px' }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && (
        <div style={{ padding: visualPadding, background: visualBg, borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: visualMinHeight }}>
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
export function DontBox({ children, visual, visualMinHeight = 60, visualBg = '#ffffff', visualPadding = '16px 18px' }) {
  return (
    <div style={{ border: '1px solid #fecaca', background: '#fef2f2', borderRadius: 8, overflow: 'hidden' }}>
      {visual && (
        <div style={{ padding: visualPadding, background: visualBg, borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: visualMinHeight }}>
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
