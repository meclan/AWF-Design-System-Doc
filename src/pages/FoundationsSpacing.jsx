import React from 'react'
import {
  SectionAnchor, H2, H3, Lead, P, Code, CodeBlock,
  DoBox, DontBox, InfoBox, Divider, PageShell,
} from '../components/DocPrims.jsx'

// ─── Scales (from primitives.json) ───────────────────────────────────────────

// Canonical spacing steps, deduplicated and ordered by value.
// (Aliases like 3xs/2xs/xxs collapse to the same primitive value — shown as one row.)
const SPACING = [
  { key: 'none',  px: 0,  use: 'Reset — explicit zero where 0 communicates intent.' },
  { key: '5xs',   px: 2,  use: 'Hairline offsets inside icons and dense tokens.' },
  { key: 'xxxxs', px: 4,  use: 'Icon + label pair, chip internal padding.' },
  { key: 'xxxs',  px: 6,  use: 'Tag internal padding, compact inline gaps.' },
  { key: 'xxs',   px: 8,  use: 'Small component padding — toggles, counters.' },
  { key: 'xs',    px: 10, use: 'Row gaps inside forms, secondary list items.' },
  { key: 'sm',    px: 12, use: 'Default gap between sibling form fields.' },
  { key: 'md',    px: 16, use: 'Default card padding, primary rhythm unit.' },
  { key: 'lg',    px: 20, use: 'Generous card padding, section inner margin.' },
  { key: 'xl',    px: 24, use: 'Block gap between sections within a page.' },
  { key: 'xxl',   px: 32, use: 'Page-level gap between major regions.' },
  { key: 'xxxl',  px: 40, use: 'Page header-to-content breathing room.' },
  { key: 'xxxxl', px: 48, use: 'Top-level shell padding on wider viewports.' },
  { key: 'xxxxxl',px: 64, use: 'Hero / splash / marketing blocks only.' },
]

const RADIUS = [
  { key: 'none', px: 0,   use: 'Data tables, structured layouts, dividers.' },
  { key: 'xs',   px: 4,   use: 'Tag / chip — compact interactive labels.' },
  { key: 'sm',   px: 6,   use: 'Button, inputs, small controls.' },
  { key: 'md',   px: 8,   use: 'Badge, toast, popover.' },
  { key: 'lg',   px: 10,  use: 'Cards, modal panels, dropdown menus.' },
  { key: 'xl',   px: 12,  use: 'Prominent cards, navbar floating surfaces.' },
  { key: 'xxl',  px: 20,  use: 'Pill-shaped buttons, hero containers.' },
  { key: 'full', px: 100, use: 'Avatars, circular indicators, fully-pill buttons.' },
]

const BORDERS = [
  { key: 'none',    px: 0,   use: 'No border — fully-filled surface.' },
  { key: 'subtle',  px: 0.5, use: 'Hairline division, retina-only.' },
  { key: 'default', px: 1,   use: 'Default component border.' },
  { key: 'strong',  px: 2,   use: 'Focus ring, selected state, tab underline.' },
]

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'principles', label: 'Principles' },
  { id: 'spacing',    label: 'Spacing scale' },
  { id: 'radius',     label: 'Radius scale' },
  { id: 'borders',    label: 'Border width' },
  { id: 'layout',     label: 'Layout patterns' },
  { id: 'rules',      label: "Do's & Don'ts" },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SpacingRow({ name, px, use, last }) {
  return (
    <tr style={{ borderBottom: last ? 'none' : '1px solid var(--stroke-primary)' }}>
      <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{name}</td>
      <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{px}px</td>
      <td style={{ padding: '10px 16px' }}>
        <div style={{ width: px, height: 10, background: 'var(--brand-500, #3b82f6)', borderRadius: 2, minWidth: 1 }} />
      </td>
      <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>{use}</td>
    </tr>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FoundationsSpacing() {
  return (
    <PageShell
      title="Spacing, radius &amp; borders"
      lead="A shared geometry set that keeps layout rhythm consistent across every product theme. Spacing, radius, and border width are defined once at the primitive layer and reused everywhere."
      toc={TOC}
      relatedLinks={[
        { to: '/foundations/tokens', label: 'Token Architecture' },
        { to: '/foundations/typography', label: 'Typography' },
      ]}
    >
      {/* ── Principles ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="principles" />
      <H2>Principles</H2>
      <Lead>
        Spacing is measured in a fixed set of steps, not arbitrary pixels. Radius follows the same philosophy — a small, memorable scale covers every rounded surface in the product.
      </Lead>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { t: '4-px base grid',    d: 'Every spacing step is a multiple of 4 (with two exceptions for hairlines at 2 px). This matches every design tool default and keeps math simple.' },
          { t: 'Scale over guess',  d: 'Pick a scale step; never free-type pixel values. Scales guarantee rhythm between unrelated components.' },
          { t: 'Theme-invariant',   d: 'Spacing, radius, and border widths never change between product themes. Only colour swaps.' },
        ].map(b => (
          <div key={b.t} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '16px 18px', background: 'var(--bg-secondary)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{b.t}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b.d}</div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Spacing ────────────────────────────────────────────────────────── */}
      <SectionAnchor id="spacing" />
      <H2>Spacing scale</H2>
      <Lead>
        14 steps from 0 to 64 px. Use <Code>md</Code> (16 px) as the default rhythm unit — most component padding and section gaps derive from it.
      </Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 170 }}>Token</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 70 }}>Value</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 90 }}>Preview</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {SPACING.map((s, i) => (
              <SpacingRow key={s.key} name={`spacing.${s.key}`} px={s.px} use={s.use} last={i === SPACING.length - 1} />
            ))}
          </tbody>
        </table>
      </div>

      <InfoBox type="info">
        Spacing tokens also exist as aliases <Code>2xs</Code>, <Code>3xs</Code>, <Code>4xs</Code>, <Code>5xs</Code> on the same underlying values — prefer the descriptive names above.
      </InfoBox>

      <Divider />

      {/* ── Radius ─────────────────────────────────────────────────────────── */}
      <SectionAnchor id="radius" />
      <H2>Radius scale</H2>
      <Lead>
        Eight steps from flat edges to fully pill-shaped. Pair radius with component purpose — sharper for structural surfaces, rounder for interactive controls.
      </Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 170 }}>Token</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 70 }}>Value</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 110 }}>Preview</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {RADIUS.map((r, i) => (
              <tr key={r.key} style={{ borderBottom: i < RADIUS.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>radius.{r.key}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{r.px}px</td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: 40, height: 28, background: 'var(--brand-100, #dbeafe)', border: '1px solid var(--brand-500, #3b82f6)', borderRadius: r.px > 28 ? 14 : r.px }} />
                </td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>{r.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Divider />

      {/* ── Borders ────────────────────────────────────────────────────────── */}
      <SectionAnchor id="borders" />
      <H2>Border width</H2>
      <Lead>
        Four widths cover every stroke in the product — from hairline dividers to the 2 px focus ring.
      </Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 200 }}>Token</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 80 }}>Value</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 110 }}>Preview</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {BORDERS.map((b, i) => (
              <tr key={b.key} style={{ borderBottom: i < BORDERS.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>border-width.{b.key}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{b.px}px</td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: 60, height: 24, background: 'var(--bg-secondary)', border: b.px ? `${b.px}px solid var(--brand-500, #3b82f6)` : '0', borderRadius: 6 }} />
                </td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>{b.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Divider />

      {/* ── Layout ─────────────────────────────────────────────────────────── */}
      <SectionAnchor id="layout" />
      <H2>Layout patterns</H2>
      <Lead>Typical pairings — proven defaults for each surface type.</Lead>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {[
          { title: 'Card',       radius: 10, pad: 20, text: 'radius.lg + spacing.lg' },
          { title: 'Modal',      radius: 12, pad: 24, text: 'radius.xl + spacing.xl' },
          { title: 'Button',     radius: 6,  pad: 10, text: 'radius.sm + spacing.xs' },
          { title: 'Tag',        radius: 4,  pad: 6,  text: 'radius.xs + spacing.xxxs' },
        ].map(p => (
          <div key={p.title} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: 16, background: 'var(--bg-primary)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>{p.title}</div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: p.radius, padding: p.pad, fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>
              {p.text}
            </div>
          </div>
        ))}
      </div>

      <H3>Using the tokens in code</H3>
      <CodeBlock lang="tsx">
{`import { getComponentTokens } from 'data/tokens'

const t = getComponentTokens('dot')

<div style={{
  padding:      t['spacing.lg'],       // 20
  borderRadius: t['radius.lg'],        // 10
  border:       \`\${t['border-width.default']}px solid \${t['color.stroke.primary']}\`,
}}>
  Card
</div>`}
      </CodeBlock>

      <Divider />

      {/* ── Rules ──────────────────────────────────────────────────────────── */}
      <SectionAnchor id="rules" />
      <H2>Do's &amp; Don'ts</H2>
      <Lead>Spacing violations compound. A single off-grid pad inside a card multiplies every time the card is used.</Lead>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <DoBox>Pick the closest scale step even if it changes the design by 2 px — consistency wins.</DoBox>
        <DontBox>Use raw values like <Code>padding: 15px</Code> or <Code>margin: 18px</Code>.</DontBox>
        <DoBox>Use 16 px as the default inner padding and 24 px as the default section gap.</DoBox>
        <DontBox>Invent mid-scale values (e.g. 18, 22, 30). They break alignment across components.</DontBox>
        <DoBox>Use radius consistently per component type — matching radius for all buttons, all cards, all inputs.</DoBox>
        <DontBox>Mix radii inside one component (e.g. card with rounded top, square bottom) without a reason.</DontBox>
        <DoBox>Reserve 2 px borders for focus, selection, and tab underline — they read as states.</DoBox>
        <DontBox>Use 2 px as a component default border. It looks heavy and competes with focus rings.</DontBox>
      </div>

      <InfoBox type="warning">
        If a design needs a spacing value that does not exist, fix the scale — don't ship a one-off pixel. Add or propose a new primitive and let every consumer benefit.
      </InfoBox>
    </PageShell>
  )
}
