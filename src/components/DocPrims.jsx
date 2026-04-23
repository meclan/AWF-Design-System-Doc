import React, { useState } from 'react'

/**
 * Shared documentation primitives used by the Foundations pages
 * (Typography, Spacing, Elevation, Motion). Kept here so each page
 * stays focused on its own content.
 */

export function SectionAnchor({ id }) {
  return <span id={id} style={{ display: 'block', marginTop: -80, paddingTop: 80 }} />
}

export function H2({ children }) {
  return (
    <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--text-primary)', marginBottom: 12, marginTop: 56 }}>
      {children}
    </h2>
  )
}

export function H3({ children }) {
  return (
    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10, marginTop: 28 }}>
      {children}
    </h3>
  )
}

export function Lead({ children }) {
  return <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20 }}>{children}</p>
}

export function P({ children }) {
  return <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 14 }}>{children}</p>
}

export function Code({ children }) {
  return (
    <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: 'var(--bg-secondary)', color: 'var(--brand-600)', padding: '1px 6px', borderRadius: 4 }}>
      {children}
    </code>
  )
}

export function CodeBlock({ children, lang = '' }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(children).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div style={{ position: 'relative', marginBottom: 20 }}>
      {lang && (
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderBottom: 'none', padding: '5px 12px', borderRadius: '6px 6px 0 0', display: 'inline-block' }}>
          {lang}
        </div>
      )}
      <pre style={{ margin: 0, padding: '16px 20px', background: '#0f172a', color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.65, borderRadius: lang ? '0 6px 6px 6px' : 6, overflowX: 'auto', whiteSpace: 'pre' }}>
        {children}
      </pre>
      <button onClick={copy} style={{ position: 'absolute', top: lang ? 36 : 8, right: 8, padding: '3px 8px', fontSize: 10, borderRadius: 4, border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: '#94a3b8', cursor: 'pointer' }}>
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}

export function DoBox({ children }) {
  return (
    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid #16a34a', borderRadius: 8, padding: '14px 18px', marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#16a34a', marginBottom: 8 }}>✓ Do</div>
      <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}

export function DontBox({ children }) {
  return (
    <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderLeft: '4px solid #dc2626', borderRadius: 8, padding: '14px 18px', marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#dc2626', marginBottom: 8 }}>✕ Don't</div>
      <div style={{ fontSize: 13, color: '#991b1b', lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}

export function InfoBox({ children, type = 'info' }) {
  const styles = {
    info:    { bg: '#eff6ff', border: '#bfdbfe', left: '#2563eb', text: '#1e40af', label: 'ℹ Note' },
    warning: { bg: '#fffbeb', border: '#fde68a', left: '#d97706', text: '#92400e', label: '⚠ Important' },
    planned: { bg: '#faf5ff', border: '#e9d5ff', left: '#7c3aed', text: '#5b21b6', label: '◷ Planned' },
  }
  const s = styles[type]
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderLeft: `4px solid ${s.left}`, borderRadius: 8, padding: '14px 18px', marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: s.left, marginBottom: 6 }}>{s.label}</div>
      <div style={{ fontSize: 13, color: s.text, lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}

export function Divider() {
  return <div style={{ height: 1, background: 'var(--stroke-primary)', margin: '40px 0' }} />
}

export function PageShell({ eyebrow = 'Foundations', title, lead, children, toc, relatedLinks = [] }) {
  return (
    <div style={{ display: 'flex', gap: 40, maxWidth: 1060, margin: '0 auto', padding: '48px 40px 80px' }}>
      <article style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--brand-600)', marginBottom: 12 }}>{eyebrow}</div>
          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-.6px', color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.1 }}>
            {title}
          </h1>
          <Lead>{lead}</Lead>
        </div>
        {children}
      </article>

      <aside style={{ width: 176, flexShrink: 0, alignSelf: 'flex-start', position: 'sticky', top: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>On this page</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {toc.map(item => (
            <a key={item.id} href={`#${item.id}`} style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none', padding: '4px 8px', borderRadius: 5, borderLeft: '2px solid transparent', transition: 'all 100ms' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand-600)'; e.currentTarget.style.borderLeftColor = 'var(--brand-600)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderLeftColor = 'transparent' }}>
              {item.label}
            </a>
          ))}
        </nav>
        {relatedLinks.length > 0 && (
          <div style={{ marginTop: 24, padding: '12px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--stroke-primary)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Related</div>
            {relatedLinks.map(l => (
              <a key={l.to} href={l.to} style={{ fontSize: 12, color: 'var(--brand-600)', display: 'block', marginBottom: 4, textDecoration: 'none' }}>{l.label}</a>
            ))}
          </div>
        )}
      </aside>
    </div>
  )
}
