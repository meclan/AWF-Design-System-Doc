import React, { useState, useEffect } from 'react'
import { THEMES, getComponentTokens } from '../../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

// ─── Inject spin keyframe once ────────────────────────────────────────────────

const SPIN_CSS = `@keyframes awf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`

function SpinStyle() {
  useEffect(() => {
    if (document.getElementById('awf-spin-style')) return
    const tag = document.createElement('style')
    tag.id = 'awf-spin-style'
    tag.textContent = SPIN_CSS
    document.head.appendChild(tag)
  }, [])
  return null
}

// ─── Token extraction ──────────────────────────────────────────────────────────

function getColors(t) {
  const n = k => (typeof t[k] === 'number' ? t[k] : null)
  const brand = t['tabs.indicator'] || '#07a2b6'
  return {
    brand,
    // Arc colours
    colorDefault:  t['spinner.color.default']  || brand,
    colorOnBrand:  t['spinner.color.on-brand'] || '#ffffff',
    colorSubtle:   t['spinner.color.subtle']   || '#919eab',
    // Track (light background ring) — not in tokens, derived
    trackDefault:  '#eef0f2',
    trackSubtle:   '#eef0f2',
    trackOnBrand:  'rgba(255,255,255,0.3)',
    // Sizes from tokens
    sizeSm: n('spinner.size.sm') ?? 16,
    sizeMd: n('spinner.size.md') ?? 24,
    sizeLg: n('spinner.size.lg') ?? 40,
  }
}

// ─── Spinner SVG ──────────────────────────────────────────────────────────────
// percent = null  → indeterminate (spinning)
// percent = 0-100 → determinate  (static arc)

function SpinnerSVG({ size = 24, arcColor, trackColor, percent = null, duration = '1s' }) {
  const sw   = Math.max(1.5, Math.round(size * 0.11))
  const r    = size / 2 - sw / 2
  const circ = 2 * Math.PI * r
  const cx   = size / 2

  const isDeterminate = percent !== null && percent !== undefined

  // Indeterminate: show 75% arc and spin the SVG
  // Determinate: show percent% arc, starting at 12-o'clock (rotate -90°)
  const dashArr = circ
  const dashOff = isDeterminate
    ? circ * (1 - Math.max(0, Math.min(100, percent)) / 100)
    : circ * 0.25      // show 75% of arc

  const rotation = isDeterminate ? `rotate(-90 ${cx} ${cx})` : undefined

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      style={{
        display: 'block', flexShrink: 0,
        ...(isDeterminate ? {} : {
          animation: `awf-spin ${duration} linear infinite`,
          transformOrigin: 'center',
        }),
      }}
    >
      {/* Track */}
      <circle cx={cx} cy={cx} r={r} stroke={trackColor} strokeWidth={sw} />
      {/* Arc */}
      <circle
        cx={cx} cy={cx} r={r}
        stroke={arcColor} strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={dashArr}
        strokeDashoffset={dashOff}
        transform={rotation}
      />
    </svg>
  )
}

// ─── Spinner (with optional % label) ─────────────────────────────────────────

function Spinner({ C, size = 'md', color = 'default', percent = null, speed = '1s' }) {
  const px = size === 'sm' ? C.sizeSm : size === 'lg' ? C.sizeLg : C.sizeMd

  const arcColor   = color === 'subtle' ? C.colorSubtle : color === 'on-brand' ? C.colorOnBrand : C.colorDefault
  const trackColor = color === 'subtle' ? C.trackSubtle  : color === 'on-brand' ? C.trackOnBrand  : C.trackDefault

  const showPct = percent !== null && percent !== undefined
  const labelSize = Math.max(8, Math.round(px * 0.22))

  return (
    <div style={{ position: 'relative', width: px, height: px, flexShrink: 0 }}>
      <SpinnerSVG size={px} arcColor={arcColor} trackColor={trackColor} percent={percent} duration={speed} />
      {showPct && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: labelSize, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
          color: arcColor, lineHeight: 1, pointerEvents: 'none',
        }}>
          {Math.round(percent)}%
        </div>
      )}
    </div>
  )
}

// ─── Page primitives ──────────────────────────────────────────────────────────

function SectionAnchor({ id }) { return <span id={id} style={{ display: 'block', marginTop: -80, paddingTop: 80 }} /> }
function H2({ c }) { return <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--text-primary)', marginBottom: 12, marginTop: 56 }}>{c}</h2> }
function H3({ c }) { return <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, marginTop: 28 }}>{c}</h3> }
function Lead({ children }) { return <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20 }}>{children}</p> }
function P({ children }) { return <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 14 }}>{children}</p> }
function Code({ children }) { return <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: 'var(--bg-secondary)', color: 'var(--brand-600)', padding: '1px 6px', borderRadius: 4 }}>{children}</code> }
function Rule() { return <hr style={{ border: 'none', borderTop: '1px solid var(--stroke-primary)', margin: '48px 0' }} /> }
function StateLabel({ children }) { return <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 10 }}>{children}</div> }

function Swatch({ label, bg, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 72, height: 72, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: bg === '#ffffff' ? '1px solid #eef0f2' : 'none' }}>
        {children}
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>{label}</span>
    </div>
  )
}

function DoBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && <div style={{ padding: '24px 20px', background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 80 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '24px 20px', background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 80 }}>{visual}</div>}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Token rows ───────────────────────────────────────────────────────────────

const TOKEN_ROWS = [
  ['spinner.color.default',  'Arc colour — default (brand)'],
  ['spinner.color.on-brand', 'Arc colour — on brand background (white)'],
  ['spinner.color.subtle',   'Arc colour — subtle (tertiary gray)'],
  ['spinner.size.sm',        'Diameter — small (16 px)'],
  ['spinner.size.md',        'Diameter — medium (24 px)'],
  ['spinner.size.lg',        'Diameter — large (40 px)'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SpinnerPage() {
  const [themeIdx,  setThemeIdx]  = useState(0)
  const [demoColor, setDemoColor] = useState('default')
  const [demoSize,  setDemoSize]  = useState('md')
  const [demoMode,  setDemoMode]  = useState('indeterminate')  // 'indeterminate' | 'determinate'
  const [demoPct,   setDemoPct]   = useState(65)

  const theme  = VISIBLE_THEMES[themeIdx]
  const tokens = getComponentTokens(theme.id)
  const C      = getColors(tokens)

  const pill   = { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: 'pointer', border: '1px solid var(--stroke-primary)' }
  const active = on => on ? { background: C.brand, color: '#fff', border: `1px solid ${C.brand}` } : { background: 'transparent', color: 'var(--text-secondary)' }

  // On-brand bg for demo
  const demoBg = demoColor === 'on-brand' ? C.brand : '#f8fafc'
  const demoBorder = demoColor === 'on-brand' ? 'none' : '1px solid var(--stroke-primary)'

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 32px 80px' }}>
      <SpinStyle />

      {/* ── Header ── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: C.brand }}>Feedback & Status</span>
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', marginBottom: 8 }}>Spinner</h1>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {VISIBLE_THEMES.map((t, i) => (
          <button key={t.id} onClick={() => setThemeIdx(i)} style={{ ...pill, ...active(themeIdx === i) }}>{t.label}</button>
        ))}
      </div>

      <Lead>
        The Spinner signals that the system is working. Use it for <strong>indeterminate</strong> loading — when the duration is unknown or very short — or in <strong>determinate</strong> mode to communicate measurable progress as a percentage. It comes in three sizes and three colour variants that adapt to light, dark, and brand backgrounds.
      </Lead>

      <Rule />

      {/* ── Interactive demo ── */}
      <SectionAnchor id="demo" />
      <H2 c="Interactive demo" />

      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Mode */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[['indeterminate','Indeterminate'],['determinate','Determinate']].map(([v,l]) => (
            <button key={v} onClick={() => setDemoMode(v)} style={{ ...pill, ...active(demoMode === v) }}>{l}</button>
          ))}
        </div>
        {/* Color */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[['default','Default'],['subtle','Subtle'],['on-brand','On Brand']].map(([v,l]) => (
            <button key={v} onClick={() => setDemoColor(v)} style={{ ...pill, ...active(demoColor === v) }}>{l}</button>
          ))}
        </div>
        {/* Size */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[['sm','Small'],['md','Medium'],['lg','Large']].map(([v,l]) => (
            <button key={v} onClick={() => setDemoSize(v)} style={{ ...pill, ...active(demoSize === v) }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Percent slider (determinate only) */}
      {demoMode === 'determinate' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif', minWidth: 70 }}>Progress</span>
          <input type="range" min={0} max={100} value={demoPct} onChange={e => setDemoPct(Number(e.target.value))}
            style={{ width: 200, accentColor: C.brand }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', minWidth: 36 }}>{demoPct}%</span>
        </div>
      )}

      <div style={{ background: demoBg, border: demoBorder, borderRadius: 12, padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4, minHeight: 120 }}>
        <Spinner
          key={`${themeIdx}-${demoColor}-${demoSize}`}
          C={C}
          size={demoSize}
          color={demoColor}
          percent={demoMode === 'determinate' ? demoPct : null}
        />
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
        {demoMode === 'indeterminate' ? 'Indeterminate — spins continuously at 1 turn/second.' : 'Determinate — arc length reflects the progress value.'}
      </p>

      <Rule />

      {/* ── Anatomy ── */}
      <SectionAnchor id="anatomy" />
      <H2 c="Anatomy" />
      <P>The Spinner is composed of two concentric SVG circles: the <strong>track</strong> (full circle, low-opacity background) and the <strong>arc</strong> (partial stroke, high-contrast foreground). In indeterminate mode the SVG rotates continuously via a CSS animation. In determinate mode the SVG is static and the arc length reflects the percentage.</P>

      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
        {/* Annotated anatomy diagram */}
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <svg width={120} height={120} viewBox="0 0 120 120" fill="none">
            {/* Track */}
            <circle cx={60} cy={60} r={46} stroke={C.trackDefault} strokeWidth={10} />
            {/* Arc (static, ~270°) */}
            <circle cx={60} cy={60} r={46} stroke={C.colorDefault} strokeWidth={10}
              strokeLinecap="round" strokeDasharray={289} strokeDashoffset={72} />
          </svg>
          {/* Labels */}
          <div style={{ position: 'absolute', top: 6, left: 128, fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Arc (foreground stroke)</div>
          <div style={{ position: 'absolute', top: 40, left: 128, fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Track (background ring)</div>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          {[
            ['Track', 'Full 360° ring drawn at low opacity. Communicates the total range of possible progress. Not independently token-defined — derived from the surface colour.'],
            ['Arc', 'Partial stroke drawn on top of the track. Colour comes from the active spinner.color.* token. strokeLinecap: round for softly tapered ends.'],
            ['Percentage label', 'Only shown in determinate mode. Centred inside the ring. Font-size scales with the spinner diameter (~22% of px).'],
          ].map(([t, d]) => (
            <div key={t} style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t} — </span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{d}</span>
            </div>
          ))}
        </div>
      </div>

      <Rule />

      {/* ── Colours ── */}
      <SectionAnchor id="colors" />
      <H2 c="Colours" />
      <P>Three colour variants cover the full range of surface contexts. Choose the one that provides adequate contrast against the parent background.</P>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <Swatch label="Default" bg="#f8fafc">
          <Spinner C={C} size="lg" color="default" />
        </Swatch>
        <Swatch label="Subtle" bg="#f8fafc">
          <Spinner C={C} size="lg" color="subtle" />
        </Swatch>
        <Swatch label="On Brand" bg={C.brand}>
          <Spinner C={C} size="lg" color="on-brand" />
        </Swatch>
      </div>

      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          ['Default',  'token: spinner.color.default',  'Use on white or light-grey surfaces. Draws from the brand primary colour.'],
          ['Subtle',   'token: spinner.color.subtle',   'Use when a low-emphasis loading state is needed — e.g. inline within muted content.'],
          ['On Brand', 'token: spinner.color.on-brand', 'Use on brand-coloured backgrounds (buttons, hero sections). The arc renders in white.'],
        ].map(([name, token, desc]) => (
          <div key={name} style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{name}</div>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: C.brand, marginBottom: 6 }}>{token}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Sizes ── */}
      <SectionAnchor id="sizes" />
      <H2 c="Sizes" />
      <P>Three sizes map to the design system's icon-size scale. Choose based on the surrounding content density — smaller for inline or compact contexts, larger for full-page loading states.</P>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        {[
          ['sm', 'Small',  'spinner.size.sm', `${C.sizeSm}px`, 'Inline loaders, table cells, compact UI'],
          ['md', 'Medium', 'spinner.size.md', `${C.sizeMd}px`, 'Default — buttons, cards, form fields'],
          ['lg', 'Large',  'spinner.size.lg', `${C.sizeLg}px`, 'Full-panel or page-level loading states'],
        ].map(([s, label, tok, px, usage]) => (
          <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Spinner C={C} size={s} color="default" />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: C.brand, marginTop: 2 }}>{tok}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{px}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, maxWidth: 120, lineHeight: 1.5 }}>{usage}</div>
            </div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Determinate (with %) ── */}
      <SectionAnchor id="determinate" />
      <H2 c="Determinate mode" />
      <P>When the progress percentage is known, pass a <Code>percent</Code> value (0–100). The arc length reflects the percentage and the SVG stops spinning. A percentage label is rendered inside the ring, scaled proportionally to the spinner diameter.</P>

      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {[0, 25, 50, 75, 100].map(pct => (
          <div key={pct} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Spinner C={C} size="lg" color="default" percent={pct} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif' }}>{pct}%</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <H3 c="Subtle — determinate" />
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {[25, 50, 75, 100].map(pct => (
            <div key={pct} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Spinner C={C} size="lg" color="subtle" percent={pct} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif' }}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <Rule />

      {/* ── Behaviour ── */}
      <SectionAnchor id="behaviour" />
      <H2 c="Behaviour" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          ['Indeterminate', 'Default mode. The SVG rotates at 360°/s (1 turn per second). Use when the system cannot report a completion percentage — e.g. initial data fetching or background sync.'],
          ['Determinate', 'Use when progress can be measured. The arc grows clockwise from the 12-o\'clock position. A percentage label is shown inside the ring. Update the value in real time to animate progress.'],
          ['Delay', 'Do not show the spinner immediately. Add a ~300 ms delay before rendering it to avoid flickering for very fast operations. Hide it as soon as loading is complete.'],
          ['Minimum visible time', 'If the spinner appears, keep it visible for at least 300 ms. Flashing in and out in under 200 ms is worse than no feedback at all.'],
          ['Overlaying content', 'For full-page loading, overlay the page with a semi-transparent scrim + centred spinner rather than replacing content. This prevents layout shift on completion.'],
          ['Button loading state', "Replace a button's label with a small (sm) spinner and disable the button to prevent double-submit. Use the on-brand variant when the button has a brand background."],
        ].map(([title, desc]) => (
          <div key={title} style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Do / Don't ── */}
      <SectionAnchor id="usage" />
      <H2 c="Usage guidelines" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DoBox visual={<Spinner C={C} size="md" color="default" />}>
          Show the spinner only after a short delay (≥ 300 ms) to avoid flickering for fast operations.
        </DoBox>
        <DontBox visual={
          <div style={{ display: 'flex', gap: 8 }}>
            <Spinner C={C} size="sm" color="default" />
            <Spinner C={C} size="sm" color="default" />
            <Spinner C={C} size="sm" color="default" />
          </div>
        }>
          Don't use multiple spinners simultaneously on the same page. Combine into one centralised loading state instead.
        </DontBox>
        <DoBox visual={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: C.brand, padding: '8px 16px', borderRadius: 8 }}>
            <Spinner C={C} size="sm" color="on-brand" />
            <span style={{ fontSize: 13, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>Saving…</span>
          </div>
        }>
          Pair the <Code>on-brand</Code> variant with brand-coloured surfaces. Always accompany the spinner with a descriptive text label.
        </DoBox>
        <DontBox visual={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: C.brand, padding: '8px 16px', borderRadius: 8 }}>
            <Spinner C={C} size="sm" color="default" />
            <span style={{ fontSize: 13, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>Saving…</span>
          </div>
        }>
          Don't use the <Code>default</Code> (brand-teal) variant on brand-coloured backgrounds — it disappears into the surface.
        </DontBox>
        <DoBox visual={<Spinner C={C} size="lg" color="default" percent={68} />}>
          Use determinate mode with a real percentage when the progress is measurable. Always update the value in real time.
        </DoBox>
        <DontBox visual={<Spinner C={C} size="lg" color="default" percent={3} />}>
          Don't show a determinate spinner stuck at a very low value (0–5%) for a long time. Switch to indeterminate if you can't update the value regularly.
        </DontBox>
      </div>

      <Rule />

      {/* ── Accessibility ── */}
      <SectionAnchor id="a11y" />
      <H2 c="Accessibility" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          ['Role', 'Add role="status" to the spinner wrapper so that assistive technologies announce it as a live region without interrupting the user.'],
          ['aria-label', 'Provide aria-label="Loading" (or a more descriptive string, e.g. "Uploading file") on the spinner container. Never rely on the visual alone.'],
          ['aria-live', 'Wrap the spinner in a container with aria-live="polite" so screen readers announce the loading state when it appears, without interrupting the current reading position.'],
          ['aria-valuenow', 'For determinate spinners, add role="progressbar" with aria-valuenow, aria-valuemin="0", aria-valuemax="100" and aria-label describing what is progressing.'],
          ['Reduced motion', 'Respect prefers-reduced-motion. When the user has enabled it, pause the rotation animation or switch to a static partial arc so the spinner is still visible without continuous movement.'],
          ['Focus', 'The spinner itself is not focusable. If a loading overlay blocks the page, trap focus inside the overlay and restore it when loading completes.'],
        ].map(([title, desc]) => (
          <div key={title} style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Token reference ── */}
      <SectionAnchor id="tokens" />
      <H2 c="Token reference" />
      <P>All spinner tokens live under the <Code>spinner.*</Code> namespace and are resolved via <Code>getComponentTokens(themeId)</Code>.</P>

      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Token', 'Value', 'Role'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOKEN_ROWS.map(([token, role], i) => {
              const raw     = tokens[token]
              const isColor = typeof raw === 'string' && raw.startsWith('#')
              const isNum   = typeof raw === 'number'
              return (
                <tr key={token} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-subtle)' }}>
                  <td style={{ padding: '7px 14px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--brand-600)', borderBottom: '1px solid var(--stroke-primary)', whiteSpace: 'nowrap' }}>{token}</td>
                  <td style={{ padding: '7px 14px', fontSize: 12, borderBottom: '1px solid var(--stroke-primary)', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isColor && <div style={{ width: 12, height: 12, borderRadius: 3, background: raw, border: '1px solid rgba(0,0,0,.08)', flexShrink: 0 }} />}
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>
                        {isColor ? raw : isNum ? `${raw}px` : raw ?? '—'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '7px 14px', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{role}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}
