import React from 'react'
import {
  SectionAnchor, H2, H3, Lead, P, Code, CodeBlock,
  DoBox, DontBox, InfoBox, Divider, PageShell,
} from '../components/DocPrims.jsx'

// ─── Typography scales (from primitives.json) ──────────────────────────────────

const FONT_FAMILIES = [
  { key: 'default', name: 'Poppins',     role: 'UI — headings, labels, body copy',                    stack: "'Poppins', system-ui, sans-serif" },
  { key: 'mono',    name: 'Courier New', role: 'Code snippets, token keys, monospaced identifiers',   stack: "'JetBrains Mono', 'Courier New', monospace" },
]

const FONT_SIZES = [
  { key: 'xxxs', px: 10, use: 'Microcopy — legal footers, metadata only' },
  { key: 'xxs',  px: 12, use: 'Secondary caption text, table hint rows, pill labels' },
  { key: 'xs',   px: 14, use: 'Default body copy, form inputs, component labels' },
  { key: 'sm',   px: 16, use: 'Prominent body text, subtitles, interactive labels' },
  { key: 'md',   px: 18, use: 'Introductory paragraphs, feature summaries' },
  { key: 'lg',   px: 20, use: 'H3 — sub-section headings in long-form content' },
  { key: 'xl',   px: 24, use: 'H2 — section headings on doc pages and dashboards' },
  { key: 'xxl',  px: 28, use: 'H1 in application pages — standard page title' },
  { key: 'xxxl', px: 32, use: 'Marketing page H1 — hero titles and onboarding only' },
  { key: 'xxxxl',px: 40, use: 'Display — reserved for splash screens, empty states' },
]

const FONT_WEIGHTS = [
  { key: 'light',     weight: 300, use: 'Soft numeric displays — rare, prefer regular' },
  { key: 'regular',   weight: 400, use: 'Default body weight for all long-form copy' },
  { key: 'medium',    weight: 500, use: 'Emphasis inside body, table column headers' },
  { key: 'semi-bold', weight: 600, use: 'Section headings, interactive labels, active tabs' },
  { key: 'bold',      weight: 700, use: 'Page titles (H1/H2), strong callouts' },
]

const LINE_HEIGHTS = [
  { key: 'tight',   value: 1.2,  use: 'Headings — balances visual weight with readability' },
  { key: 'normal',  value: 1.5,  use: 'Default body copy across the product' },
  { key: 'relaxed', value: 1.75, use: 'Long-form reading — doc pages, release notes' },
]

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'principles',  label: 'Principles' },
  { id: 'family',      label: 'Font family' },
  { id: 'size',        label: 'Size scale' },
  { id: 'weight',      label: 'Weight scale' },
  { id: 'line-height', label: 'Line height' },
  { id: 'hierarchy',   label: 'Hierarchy' },
  { id: 'rules',       label: "Do's & Don'ts" },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FoundationsTypography() {
  return (
    <PageShell
      title="Typography"
      lead="A compact type system built on one UI typeface and a predictable size, weight, and line-height scale. Typography is the same across every product theme — only colour changes."
      toc={TOC}
      relatedLinks={[
        { to: '/foundations/tokens', label: 'Token Architecture' },
        { to: '/foundations/color',  label: 'Color' },
      ]}
    >
      {/* ── Principles ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="principles" />
      <H2>Principles</H2>
      <Lead>
        One UI typeface. A 10-step size scale. Five weights. Three line heights. Those four scales describe every piece of text in every AWF product.
      </Lead>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { t: 'Shared across themes',  d: 'Typography never forks per product. Only colour and logo change between DOT, Drops, CoChecker, Discover, and MR Connector.' },
          { t: 'Scale over spec',        d: 'Pick a scale step; never hand-set pixel sizes. Scales guarantee vertical rhythm and cross-platform consistency.' },
          { t: 'Legibility first',       d: 'Body copy is 14 px minimum. Never ship UI text below that unless it is a genuine caption or metadata.' },
        ].map(b => (
          <div key={b.t} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '16px 18px', background: 'var(--bg-secondary)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{b.t}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b.d}</div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Family ─────────────────────────────────────────────────────────── */}
      <SectionAnchor id="family" />
      <H2>Font family</H2>
      <Lead>
        Poppins is the single UI typeface across every product. A monospace is used only inside code blocks and token keys.
      </Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Token</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Family</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Preview</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {FONT_FAMILIES.map((f, i) => (
              <tr key={f.key} style={{ borderBottom: i < FONT_FAMILIES.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>font.family.{f.key}</td>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{f.name}</td>
                <td style={{ padding: '12px 16px', fontFamily: f.stack, color: 'var(--text-primary)', fontSize: 16 }}>Ag · 1234 · Typography</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>{f.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InfoBox type="info">
        Poppins is loaded at weights 300, 400, 500, 600, and 700 — matching the weight scale below. Never introduce a new weight without a token update.
      </InfoBox>

      <Divider />

      {/* ── Size ──────────────────────────────────────────────────────────── */}
      <SectionAnchor id="size" />
      <H2>Size scale</H2>
      <Lead>
        Ten sizes from 10 px to 40 px. Every piece of text in the product maps to one of these steps.
      </Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 170 }}>Token</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 70 }}>Value</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Sample</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: '36%' }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {FONT_SIZES.map((s, i) => (
              <tr key={s.key} style={{ borderBottom: i < FONT_SIZES.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>font-size.{s.key}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{s.px}px</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-primary)', fontSize: s.px, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Ag — Typography</td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>{s.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Divider />

      {/* ── Weight ─────────────────────────────────────────────────────────── */}
      <SectionAnchor id="weight" />
      <H2>Weight scale</H2>
      <Lead>Five weights cover every level of emphasis. 400 is the default; 500 is the first step of emphasis in body copy.</Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Token</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>CSS value</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Sample</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {FONT_WEIGHTS.map((w, i) => (
              <tr key={w.key} style={{ borderBottom: i < FONT_WEIGHTS.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>font-weight.{w.key}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{w.weight}</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-primary)', fontWeight: w.weight, fontSize: 15 }}>The quick brown fox</td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>{w.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Divider />

      {/* ── Line height ────────────────────────────────────────────────────── */}
      <SectionAnchor id="line-height" />
      <H2>Line height</H2>
      <Lead>
        Three ratios paired by purpose: tight for headings, normal for UI copy, relaxed for long-form reading.
      </Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 180 }}>Token</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 80 }}>Value</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {LINE_HEIGHTS.map((l, i) => (
              <tr key={l.key} style={{ borderBottom: i < LINE_HEIGHTS.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>line-height.{l.key}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{l.value}</td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>{l.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Divider />

      {/* ── Hierarchy ──────────────────────────────────────────────────────── */}
      <SectionAnchor id="hierarchy" />
      <H2>Recommended hierarchy</H2>
      <Lead>A reference pairing of size, weight, and line height for each role. Use it as a default; deviate only with a documented reason.</Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '4px 0', background: 'var(--bg-primary)', marginBottom: 20 }}>
        {[
          { role: 'Display',       size: 40, weight: 700, lh: 1.1,  sample: 'Empty state headline' },
          { role: 'Page title',    size: 28, weight: 700, lh: 1.2,  sample: 'Data protection overview' },
          { role: 'Section H2',    size: 24, weight: 700, lh: 1.25, sample: 'Getting started' },
          { role: 'Sub-section H3',size: 20, weight: 600, lh: 1.3,  sample: 'Project settings' },
          { role: 'Prominent body',size: 16, weight: 500, lh: 1.5,  sample: 'Highlights the primary piece of supporting copy.' },
          { role: 'Body default',  size: 14, weight: 400, lh: 1.6,  sample: 'Default interface copy shared across every product view.' },
          { role: 'Caption',       size: 12, weight: 400, lh: 1.5,  sample: 'Secondary metadata and hint text.' },
          { role: 'Micro',         size: 10, weight: 600, lh: 1.4,  sample: 'UPPER-CASE LABELS — SECTION EYEBROWS.' },
        ].map((r, i, arr) => (
          <div key={r.role} style={{ padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--stroke-primary)' : 'none', display: 'grid', gridTemplateColumns: '160px 80px 1fr', gap: 16, alignItems: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{r.role}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-tertiary)' }}>{r.size}/{r.weight}</div>
            <div style={{ fontSize: r.size, fontWeight: r.weight, lineHeight: r.lh, color: 'var(--text-primary)' }}>{r.sample}</div>
          </div>
        ))}
      </div>

      <H3>Using the tokens in code</H3>
      <P>Tokens resolve to primitive values. Apply them via inline style or a CSS variable. Never read directly from primitives.</P>

      <CodeBlock lang="tsx">
{`import { getComponentTokens } from 'data/tokens'

const t = getComponentTokens('dot')

<h2 style={{
  fontFamily: t['font.family.default'],
  fontSize:   t['font-size.xl'],      // 24
  fontWeight: t['font-weight.bold'],  // 700
  lineHeight: t['line-height.tight'], // 1.2
}}>
  Section heading
</h2>`}
      </CodeBlock>

      <Divider />

      {/* ── Rules ──────────────────────────────────────────────────────────── */}
      <SectionAnchor id="rules" />
      <H2>Do's &amp; Don'ts</H2>
      <Lead>Small, repeated type violations degrade the product faster than almost any other style issue. Follow the scale.</Lead>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <DoBox>Pick the nearest scale step, even if the design calls for an odd size — scales guarantee rhythm.</DoBox>
        <DontBox>Type in raw pixel values like <Code>font-size: 15px</Code> or <Code>font-size: 13px</Code>.</DontBox>
        <DoBox>Use weight 500 for the first step of body emphasis; keep 700 for headings and strong callouts.</DoBox>
        <DontBox>Use italic to add emphasis inside UI — reserve italic for citations and foreign words.</DontBox>
        <DoBox>Match line height to size step: tighter for large display text, relaxed for long-form reading.</DoBox>
        <DontBox>Tighten line height below 1.4 for body copy — it breaks readability at 14 px.</DontBox>
        <DoBox>Scale responsively by swapping to the next lower step on mobile, not by percentage shrinking.</DoBox>
        <DontBox>Introduce a new weight or size step locally. Add it as a primitive instead.</DontBox>
      </div>

      <InfoBox type="warning">
        Headings above 32 px are reserved for marketing pages and empty states. Do not use display sizes inside regular product screens — they break the scan hierarchy and eat vertical space.
      </InfoBox>
    </PageShell>
  )
}
