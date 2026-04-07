import React from 'react'

export default function Placeholder({ title }) {
  return (
    <div style={{
      maxWidth: 'var(--content-max)', margin: '0 auto', padding: '48px 40px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', textAlign: 'center',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'var(--bg-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, marginBottom: 20,
      }}>◌</div>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, letterSpacing: '-.4px' }}>{title}</h1>
      <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>This section is coming soon.</p>
    </div>
  )
}
