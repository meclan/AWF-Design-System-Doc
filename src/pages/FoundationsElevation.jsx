import React from 'react'
import {
  SectionAnchor, H2, H3, Lead, P, Code, CodeBlock,
  DoBox, DontBox, InfoBox, Divider, PageShell,
} from '../components/DocPrims.jsx'

// ─── Z-scale — token name maps to Figma effect style ──────────────────────────
// The primitive value is the Figma effect key (Z1..Z4). Each step below pairs
// the token with its canonical CSS fallback so web code can render parity.

const ELEVATION = [
  {
    key: 'xs',   figma: 'Z1',
    cssShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.04)',
    use: 'Resting card, inline input — barely lifts off the page.',
  },
  {
    key: 'sm',   figma: 'Z2',
    cssShadow: '0 2px 4px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.04)',
    use: 'Hovered card, navbar on scroll, sticky footer.',
  },
  {
    key: 'md',   figma: 'Z3',
    cssShadow: '0 8px 16px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.06)',
    use: 'Popover, dropdown, select menu, toast — floating UI.',
  },
  {
    key: 'lg',   figma: 'Z4',
    cssShadow: '0 20px 40px rgba(15, 23, 42, 0.12), 0 4px 8px rgba(15, 23, 42, 0.06)',
    use: 'Modal, dialog, full-screen side panel — user focus required.',
  },
  {
    key: 'focus', figma: 'focus',
    cssShadow: '0 0 0 3px rgba(59, 130, 246, 0.35)',
    use: 'Focus ring — applied on keyboard focus of any interactive element.',
    isFocus: true,
  },
]

const Z_LAYERS = [
  { name: 'base',      z: 0,    use: 'Default page content, cards, tables.' },
  { name: 'sticky',    z: 10,   use: 'Sticky headers, scroll-pinned navbars.' },
  { name: 'dropdown',  z: 100,  use: 'Select menus, autocomplete, context menus.' },
  { name: 'popover',   z: 200,  use: 'Popover menus, tooltips anchored to triggers.' },
  { name: 'modal',     z: 1000, use: 'Full-overlay modals, dialogs.' },
  { name: 'toast',     z: 1100, use: 'Stacked toast notifications — above modals.' },
]

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'principles', label: 'Principles' },
  { id: 'scale',      label: 'Shadow scale' },
  { id: 'focus',      label: 'Focus ring' },
  { id: 'z-index',    label: 'Z-index layers' },
  { id: 'rules',      label: "Do's & Don'ts" },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FoundationsElevation() {
  return (
    <PageShell
      title="Elevation"
      lead="A small, purposeful shadow scale that communicates interactive depth — not visual polish. Elevation is shared across every product theme."
      toc={TOC}
      relatedLinks={[
        { to: '/foundations/tokens',   label: 'Token Architecture' },
        { to: '/foundations/spacing',  label: 'Spacing' },
      ]}
    >
      {/* ── Principles ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="principles" />
      <H2>Principles</H2>
      <Lead>
        Shadows mean something. Every step in the scale maps to a specific interaction layer — not to a visual preference.
      </Lead>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { t: 'Four interactive layers', d: 'Z1-Z4 map to Resting, Hover, Floating, and Modal. Anything that does not fit one of these four layers is not elevated.' },
          { t: 'Focus is elevation too',  d: 'The focus ring uses the shadow token system. Keyboard focus is as structural as a modal overlay.' },
          { t: 'Theme-invariant',         d: 'Shadows never change between product themes. A DOT modal and a Drops modal cast exactly the same shadow.' },
        ].map(b => (
          <div key={b.t} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '16px 18px', background: 'var(--bg-secondary)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{b.t}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b.d}</div>
          </div>
        ))}
      </div>

      <InfoBox type="info">
        The primitive values are Figma effect keys (<Code>Z1</Code>, <Code>Z2</Code>, <Code>Z3</Code>, <Code>Z4</Code>, <Code>focus</Code>). Web code applies matching CSS box-shadows listed in the scale below. Designers pick the token in Figma; developers pull the CSS parity.
      </InfoBox>

      <Divider />

      {/* ── Scale ──────────────────────────────────────────────────────────── */}
      <SectionAnchor id="scale" />
      <H2>Shadow scale</H2>
      <Lead>Four interactive steps plus a dedicated focus-ring token.</Lead>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 20 }}>
        {ELEVATION.filter(e => !e.isFocus).map(e => (
          <div key={e.key} style={{ background: 'var(--bg-subtle)', borderRadius: 12, padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 260, padding: 20, background: 'var(--bg-primary)', borderRadius: 10, boxShadow: e.cssShadow }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 6 }}>shadow.{e.key}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Figma: {e.figma}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{e.use}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Token</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Figma effect</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>CSS equivalent</th>
            </tr>
          </thead>
          <tbody>
            {ELEVATION.map((e, i) => (
              <tr key={e.key} style={{ borderBottom: i < ELEVATION.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>shadow.{e.key}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{e.figma}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-tertiary)', wordBreak: 'break-word' }}>{e.cssShadow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Divider />

      {/* ── Focus ──────────────────────────────────────────────────────────── */}
      <SectionAnchor id="focus" />
      <H2>Focus ring</H2>
      <Lead>
        The focus ring is the accessibility contract of the product. It uses the dedicated <Code>shadow.focus</Code> token and renders consistently on every interactive element.
      </Lead>

      <div style={{ background: 'var(--bg-subtle)', borderRadius: 12, padding: 32, display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <button style={{
          padding: '10px 18px', borderRadius: 6, border: '1px solid var(--brand-500, #3b82f6)',
          background: 'var(--brand-500, #3b82f6)', color: '#fff', fontWeight: 500, fontSize: 13, cursor: 'pointer',
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.35)',
        }}>
          Focused button
        </button>
        <input style={{
          padding: '8px 12px', borderRadius: 6, border: '1px solid var(--brand-500, #3b82f6)',
          fontSize: 13, outline: 'none',
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.35)',
        }} placeholder="Focused input" />
      </div>

      <P>
        The ring is 3 px wide and uses a 35 % brand-tinted colour. It sits <em>outside</em> the element's border so it never clips. Never remove or substitute this ring unless the replacement meets WCAG 2.1 SC 2.4.7 (Focus Visible).
      </P>

      <Divider />

      {/* ── Z-index ────────────────────────────────────────────────────────── */}
      <SectionAnchor id="z-index" />
      <H2>Z-index layers</H2>
      <Lead>
        Z-index is stepped, not arbitrary. Use the named layer that matches a component's role so overlays always stack predictably.
      </Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Layer</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>z-index</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {Z_LAYERS.map((l, i) => (
              <tr key={l.name} style={{ borderBottom: i < Z_LAYERS.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{l.name}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{l.z}</td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>{l.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3>Using the tokens in code</H3>
      <CodeBlock lang="tsx">
{`import { getComponentTokens } from 'data/tokens'

const t = getComponentTokens('dot')

<div style={{
  boxShadow:    t['shadow.md'],   // popover / dropdown
  borderRadius: t['radius.lg'],
}}>
  Floating panel
</div>`}
      </CodeBlock>

      <Divider />

      {/* ── Rules ──────────────────────────────────────────────────────────── */}
      <SectionAnchor id="rules" />
      <H2>Do's &amp; Don'ts</H2>
      <Lead>Shadows are one of the easiest tokens to abuse. Stay on the scale.</Lead>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <DoBox>Pick the lowest elevation that works. A resting card rarely needs more than <Code>shadow.xs</Code>.</DoBox>
        <DontBox>Invent custom shadows for marketing polish — stay on the 4-step scale.</DontBox>
        <DoBox>Use <Code>shadow.md</Code> for everything floating (popover, dropdown, toast).</DoBox>
        <DontBox>Use <Code>shadow.lg</Code> on hover states. LG is reserved for modals and full dialogs.</DontBox>
        <DoBox>Keep the focus ring on every interactive element. Use <Code>shadow.focus</Code>.</DoBox>
        <DontBox>Remove the default focus ring to match a mock. Replace it only with an equivalent visible alternative.</DontBox>
        <DoBox>Use the z-index layer names above for stacking context.</DoBox>
        <DontBox>Hard-code <Code>z-index: 9999</Code> anywhere in product code.</DontBox>
      </div>

      <InfoBox type="warning">
        Dark mode will add a second shadow scale tuned for dark surfaces — the token names stay the same, only the CSS values change. Component code will not need to change.
      </InfoBox>
    </PageShell>
  )
}
