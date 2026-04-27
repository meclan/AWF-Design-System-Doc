import React from 'react'
import {
  SectionAnchor, H2, H3, Lead, P, Code, CodeBlock,
  DoBox, DontBox, InfoBox, Divider, PageShell,
} from '../components/DocPrims.jsx'

// ─── Motion scales ───────────────────────────────────────────────────────────
// These tokens are design-system intent — not yet in the primitive JSON.
// When they are promoted, the same names map 1:1 to new primitives.

const DURATIONS = [
  { key: 'instant', ms: 0,   use: 'No-op — state swaps that must feel immediate (form validation, typing).' },
  { key: 'xs',      ms: 80,  use: 'Hover shimmer, toggle, switch — micro-feedback.' },
  { key: 'sm',      ms: 120, use: 'Button press, icon scale, ripple — default UI feedback.' },
  { key: 'md',      ms: 200, use: 'Popover, tooltip, dropdown open/close.' },
  { key: 'lg',      ms: 300, use: 'Modal, side panel, full-sheet drawer.' },
  { key: 'xl',      ms: 500, use: 'Page transition, toast entry — once per interaction.' },
]

const EASINGS = [
  { key: 'linear',      css: 'linear',                          use: 'Progress bars, steady fades — motion with no acceleration.' },
  { key: 'out',         css: 'cubic-bezier(0.16, 1, 0.3, 1)',    use: 'Default UI easing — starts fast, settles gracefully. Open animations.' },
  { key: 'in-out',      css: 'cubic-bezier(0.65, 0, 0.35, 1)',   use: 'Two-way motion — swipes, slides, scrollers that reverse.' },
  { key: 'emphasized',  css: 'cubic-bezier(0.2, 0, 0, 1)',       use: 'Modal entry, hero reveals — stronger anticipation, slower settle.' },
]

const PATTERNS = [
  { name: 'Fade',   duration: 'sm',  easing: 'out',        use: 'Toast, tooltip, inline banners.' },
  { name: 'Scale',  duration: 'sm',  easing: 'out',        use: 'Popover, dropdown — combined with fade.' },
  { name: 'Slide',  duration: 'md',  easing: 'out',        use: 'Side panel, sheet — direction matches anchor edge.' },
  { name: 'Overlay',duration: 'lg',  easing: 'emphasized', use: 'Modal — backdrop fades while dialog slides up.' },
]

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'principles', label: 'Principles' },
  { id: 'duration',   label: 'Duration scale' },
  { id: 'easing',     label: 'Easing curves' },
  { id: 'patterns',   label: 'Common patterns' },
  { id: 'a11y',       label: 'Reduced motion' },
  { id: 'rules',      label: "Do's & Don'ts" },
]

// ─── Animated preview helpers ────────────────────────────────────────────────

function PreviewBox({ durationMs, easing }) {
  return (
    <div style={{
      width: 44, height: 28, borderRadius: 6,
      background: 'var(--brand-500, #3b82f6)',
      animation: `awfMotionDemo ${durationMs}ms ${easing} infinite alternate`,
    }} />
  )
}

function EasingSVG({ cubic }) {
  // Render the cubic-bezier curve as an SVG for visual reference.
  // cubic format: "cubic-bezier(a, b, c, d)" or "linear"
  const match = /cubic-bezier\(([^)]+)\)/.exec(cubic)
  const [a, b, c, d] = match ? match[1].split(',').map(Number) : [0, 0, 1, 1]
  return (
    <svg width="60" height="30" viewBox="0 0 60 30" style={{ overflow: 'visible' }}>
      <path
        d={`M 0 30 C ${a * 60} ${30 - b * 30}, ${c * 60} ${30 - d * 30}, 60 0`}
        stroke="var(--brand-500, #3b82f6)" strokeWidth="1.5" fill="none"
      />
      <line x1="0" y1="30" x2="60" y2="0" stroke="var(--text-tertiary)" strokeWidth="0.5" strokeDasharray="2 2" opacity={0.4} />
    </svg>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FoundationsMotion() {
  return (
    <PageShell
      title="Motion"
      lead="Motion is state made legible. It shows that something happened, where it came from, and where attention should go next — not that the UI is animated."
      toc={TOC}
      relatedLinks={[
        { to: '/foundations/tokens',    label: 'Token Architecture' },
        { to: '/foundations/elevation', label: 'Elevation' },
      ]}
    >
      <style>{`
        @keyframes awfMotionDemo {
          from { transform: translateX(0); }
          to   { transform: translateX(40px); }
        }
      `}</style>

      {/* ── Principles ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="principles" />
      <H2>Principles</H2>
      <Lead>
        Motion is purposeful. It explains an interaction — open, close, appear, swap — in under half a second. Anything longer distracts; anything shorter disappears.
      </Lead>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { t: 'Fast by default',     d: '120 ms is the default UI transition. Raise only for overlays and large movements — never for everyday hovers.' },
          { t: 'Purposeful, not decorative', d: 'Every animation answers a question: what changed? where did it come from? where will it settle?' },
          { t: 'Respect the user',    d: 'All motion honours the system-level Reduced Motion preference. Parallax, bounce, spring-back are opt-in.' },
        ].map(b => (
          <div key={b.t} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '16px 18px', background: 'var(--bg-secondary)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{b.t}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b.d}</div>
          </div>
        ))}
      </div>

      <InfoBox type="planned">
        Motion tokens are not yet part of the primitive JSON. The scales below are the canonical design intent — the values every ARCAD product should use today. Promotion to primitives is scheduled.
      </InfoBox>

      <Divider />

      {/* ── Duration ───────────────────────────────────────────────────────── */}
      <SectionAnchor id="duration" />
      <H2>Duration scale</H2>
      <Lead>Six durations from 0 to 500 ms. Most of the product runs on <Code>sm</Code> (120 ms).</Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 180 }}>Token</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 80 }}>Value</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 90 }}>Preview</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {DURATIONS.map((d, i) => (
              <tr key={d.key} style={{ borderBottom: i < DURATIONS.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>motion.duration.{d.key}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{d.ms}ms</td>
                <td style={{ padding: '10px 16px' }}>
                  {d.ms > 0 ? <PreviewBox durationMs={d.ms} easing="cubic-bezier(0.16, 1, 0.3, 1)" /> : <div style={{ width: 44, height: 28, borderRadius: 6, background: 'var(--bg-secondary)', border: '1px dashed var(--stroke-primary)' }} />}
                </td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>{d.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Divider />

      {/* ── Easing ─────────────────────────────────────────────────────────── */}
      <SectionAnchor id="easing" />
      <H2>Easing curves</H2>
      <Lead>Four curves cover every UI motion. <Code>out</Code> is the default — it mimics a physical object settling.</Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 180 }}>Token</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 100 }}>Curve</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)', width: 150 }}>Preview</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {EASINGS.map((e, i) => (
              <tr key={e.key} style={{ borderBottom: i < EASINGS.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>motion.easing.{e.key}</td>
                <td style={{ padding: '10px 16px' }}>
                  {e.css === 'linear' ? (
                    <svg width="60" height="30"><line x1="0" y1="30" x2="60" y2="0" stroke="var(--brand-500, #3b82f6)" strokeWidth="1.5" /></svg>
                  ) : <EasingSVG cubic={e.css} />}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <PreviewBox durationMs={600} easing={e.css} />
                </td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>{e.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Divider />

      {/* ── Patterns ───────────────────────────────────────────────────────── */}
      <SectionAnchor id="patterns" />
      <H2>Common patterns</H2>
      <Lead>Default pairings — use them as the first choice before introducing a custom transition.</Lead>

      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Pattern</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Duration</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Easing</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {PATTERNS.map((p, i) => (
              <tr key={p.name} style={{ borderBottom: i < PATTERNS.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{p.duration}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{p.easing}</td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>{p.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3>Using the tokens in code</H3>
      <CodeBlock lang="css">
{`/* Recommended CSS custom properties mirroring the token names */
:root {
  --motion-duration-sm: 120ms;
  --motion-duration-md: 200ms;
  --motion-easing-out:  cubic-bezier(0.16, 1, 0.3, 1);
}

.popover {
  transition: opacity var(--motion-duration-md) var(--motion-easing-out),
              transform var(--motion-duration-md) var(--motion-easing-out);
}`}
      </CodeBlock>

      <Divider />

      {/* ── Reduced motion ─────────────────────────────────────────────────── */}
      <SectionAnchor id="a11y" />
      <H2>Reduced motion</H2>
      <Lead>
        Every animated component respects the user's operating-system motion preference. When <Code>prefers-reduced-motion</Code> is on, transitions collapse to an instant state swap — never left partially animated.
      </Lead>

      <CodeBlock lang="css">
{`/* Global rule applied at the root layout */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}`}
      </CodeBlock>

      <P>
        For components that rely on motion to carry meaning (stepper, toast entry, route transition), provide a non-motion alternative — usually a crossfade, never a silent state swap that could look like a glitch.
      </P>

      <Divider />

      {/* ── Rules ──────────────────────────────────────────────────────────── */}
      <SectionAnchor id="rules" />
      <H2>Do's &amp; Don'ts</H2>
      <Lead>Motion is the fastest way to make a product feel cheap. Every rule below is written in blood.</Lead>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <DoBox>Default to <Code>sm</Code> (120 ms) with <Code>out</Code> easing. Raise only with a reason.</DoBox>
        <DontBox>Animate every hover for polish — it feels laggy. Hover feedback should be instant or &lt; 80 ms.</DontBox>
        <DoBox>Use <Code>emphasized</Code> easing for modals and major overlays. Use <Code>out</Code> everywhere else.</DoBox>
        <DontBox>Bounce, overshoot, or spring-back transitions. We are not a consumer social app.</DontBox>
        <DoBox>Honour <Code>prefers-reduced-motion</Code> at the global CSS level — one rule covers the whole product.</DoBox>
        <DontBox>Hand-roll reduced-motion fallbacks per component. It inevitably misses cases.</DontBox>
        <DoBox>Animate transform and opacity only. Both are GPU-accelerated and never cause layout thrash.</DoBox>
        <DontBox>Animate width, height, top, left, or margin. They trigger layout on every frame.</DontBox>
      </div>

      <InfoBox type="warning">
        If a motion feels good at 60 FPS on a dev laptop but noticeable on a mid-tier machine, it is already too long. Always profile on a throttled device before merging a new transition.
      </InfoBox>
    </PageShell>
  )
}
