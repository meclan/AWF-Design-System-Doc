import React, { useState, useEffect } from 'react'
import { useBrandTheme } from '../../contexts/BrandThemeContext.jsx'
import BrandThemeSwitcher from '../../components/BrandThemeSwitcher.jsx'
import { THEMES, getComponentTokens } from '../../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

// ─── Token extractor ──────────────────────────────────────────────────────────
// No dedicated guidecue tokens — derived from tooltip + button + brand

function getGuideCueColors(t) {
  return {
    bg:          t['tooltip.bg']                    || '#1c252e',
    title:       '#ffffff',
    body:        '#c4cdd5',   // color/text/subtlest from Figma
    counter:     '#919eab',   // color/text/subtle from Figma
    brand:       t['tabs.indicator']                || '#07a2b6',
    btnRadius:   (typeof t['button.size.xs.radius'] === 'number' ? t['button.size.xs.radius'] : null) ?? 6,
    btnPadX:     t['button.size.xs.padding-x']      || 12,
    btnPadY:     t['button.size.xs.padding-y']      || 6,
    btnFontSize: t['button.size.xs.font-size']      || 12,
    radius:      12,
    padding:     12,
    shadow:      '0px 2px 4px rgba(171,190,209,0.6)',
  }
}

// ─── Shared layout primitives ─────────────────────────────────────────────────

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
      {visual && <div style={{ padding: '28px 20px', background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '28px 20px', background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>{visual}</div>}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── GuideCue bubble ──────────────────────────────────────────────────────────

function GuideCueBubble({ C, title, body, step = 1, totalSteps = 1, onDismiss, onNext, showClose = true }) {
  const isMulti    = totalSteps > 1
  const isLast     = step === totalSteps
  const ctaLabel   = (!isMulti || isLast) ? 'Got it' : 'Next'

  return (
    <div style={{
      background: C.bg,
      borderRadius: C.radius,
      padding: C.padding,
      boxShadow: C.shadow,
      width: 240,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flexShrink: 0,
    }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.title, fontFamily: 'Poppins, sans-serif', lineHeight: 1.4 }}>{title}</span>
        {isMulti && showClose && (
          <button
            onClick={onDismiss}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: C.counter, padding: 0, lineHeight: 1,
              fontSize: 14, flexShrink: 0, marginTop: -1,
            }}
            aria-label="Dismiss"
          >✕</button>
        )}
      </div>

      {/* Body */}
      <p style={{ fontSize: 12, color: C.body, margin: 0, lineHeight: 1.55, fontFamily: 'Poppins, sans-serif' }}>{body}</p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
        {isMulti && (
          <span style={{ fontSize: 12, color: C.counter, fontFamily: 'Poppins, sans-serif' }}>{step} of {totalSteps}</span>
        )}
        <button
          onClick={onNext}
          style={{
            background: C.brand,
            color: '#fff',
            border: 'none',
            borderRadius: C.btnRadius,
            padding: `${C.btnPadY}px ${C.btnPadX}px`,
            fontSize: C.btnFontSize,
            fontFamily: 'Poppins, sans-serif',
            cursor: 'pointer',
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        >{ctaLabel}</button>
      </div>
    </div>
  )
}

// CSS triangle arrow pointing toward the target
function Arrow({ C, direction }) {
  const size = 13
  const depth = 10
  const t = `${depth}px solid ${C.bg}`
  const s = `${size}px solid transparent`
  const styles = {
    bottom: { borderLeft: s, borderRight: s, borderTop: t,    width: 0, height: 0, alignSelf: 'center' },
    top:    { borderLeft: s, borderRight: s, borderBottom: t, width: 0, height: 0, alignSelf: 'center' },
    right:  { borderTop: s, borderBottom: s, borderLeft: t,   width: 0, height: 0, alignSelf: 'center' },
    left:   { borderTop: s, borderBottom: s, borderRight: t,  width: 0, height: 0, alignSelf: 'center' },
  }
  return <div style={styles[direction]} />
}

// Full placed guide cue (bubble + arrow, arranged around a target)
function PlacedGuideCue({ C, placement, children, ...bubbleProps }) {
  // placement = which side of the target the cue appears on
  // arrow direction = toward the target (opposite side of cue)
  const arrowDir = { top: 'top', bottom: 'bottom', left: 'left', right: 'right' }[placement]

  if (placement === 'bottom') {
    // Cue above target: arrow at bottom of cue
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <GuideCueBubble C={C} {...bubbleProps} />
        <Arrow C={C} direction="bottom" />
        {children}
      </div>
    )
  }
  if (placement === 'top') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {children}
        <Arrow C={C} direction="top" />
        <GuideCueBubble C={C} {...bubbleProps} />
      </div>
    )
  }
  if (placement === 'right') {
    // Cue to the right of target: arrow at left side of cue
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {children}
        <Arrow C={C} direction="left" />
        <GuideCueBubble C={C} {...bubbleProps} />
      </div>
    )
  }
  if (placement === 'left') {
    // Cue to the left of target: arrow at right side of cue
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <GuideCueBubble C={C} {...bubbleProps} />
        <Arrow C={C} direction="right" />
        {children}
      </div>
    )
  }
  return null
}

// ─── Beacon / hotspot ─────────────────────────────────────────────────────────

function Beacon({ color }) {
  return (
    <div style={{ position: 'relative', width: 12, height: 12 }}>
      <style>{`
        @keyframes gcPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(3);   opacity: 0; }
        }
      `}</style>
      {/* Pulse ring */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: color,
        animation: 'gcPulse 1.5s ease-out infinite',
      }} />
      {/* Solid dot */}
      <div style={{
        position: 'absolute', inset: 2, borderRadius: '50%',
        background: color,
      }} />
    </div>
  )
}

// ─── Target element mock ──────────────────────────────────────────────────────

function TargetButton({ C, label = 'New feature', showBeacon = false }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <div style={{
        padding: '8px 16px',
        background: 'var(--bg-secondary)',
        border: `2px solid ${C.brand}`,
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        color: C.brand,
        fontFamily: 'Poppins, sans-serif',
        whiteSpace: 'nowrap',
      }}>{label}</div>
      {showBeacon && (
        <div style={{
          position: 'absolute',
          top: -6, right: -6,
        }}>
          <Beacon color={C.brand} />
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const DEMO_STEPS = [
  { title: 'New feature',      body: 'This is a new feature. You should try it out.' },
  { title: 'Second step',      body: "Here's what you can do next with this feature." },
  { title: 'Almost there',     body: 'Just one more thing to know about this flow.' },
  { title: "You're all set!",  body: "You've completed the tour. Enjoy the new feature." },
]

const TOC = [
  { id: 'demo',          label: 'Interactive demo' },
  { id: 'anatomy',       label: 'Anatomy' },
  { id: 'variants',      label: 'Variants' },
  { id: 'placement',     label: 'Arrow placement' },
  { id: 'beacon',        label: 'Beacon' },
  { id: 'behavior',      label: 'Button label behavior' },
  { id: 'usage',         label: 'When to use' },
  { id: 'guidance',      label: 'Guidance' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'tokens',        label: 'Token reference' },
]

export default function GuideCuePage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [activeSection, setActiveSection] = useState('demo')
  const [placement,  setPlacement]  = useState('bottom')
  const [variant,    setVariant]    = useState('multi')   // 'standalone' | 'multi'
  const [step,       setStep]       = useState(1)
  const [dismissed,  setDismissed]  = useState(false)

  const theme  = VISIBLE_THEMES.find(t => t.id === activeTheme) || VISIBLE_THEMES[0]
  const tokens = getComponentTokens(theme.id)
  const C      = getGuideCueColors(tokens)

  const totalSteps = variant === 'standalone' ? 1 : 4
  const currentStep = DEMO_STEPS[Math.min(step - 1, DEMO_STEPS.length - 1)]

  function handleNext() {
    if (step >= totalSteps) { setDismissed(true); return }
    setStep(s => s + 1)
  }
  function handleDismiss() { setDismissed(true) }

  function resetDemo() {
    setStep(1)
    setDismissed(false)
  }

  // Scroll spy
  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    const ids = TOC.map(item => item.id)
    function onScroll() {
      const mainTop = main.getBoundingClientRect().top
      const threshold = 140
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - mainTop <= threshold) current = id
      }
      setActiveSection(current)
    }
    main.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => main.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '40px 56px 96px', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Header ── */}
      <SectionAnchor id="top" />
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-secondary)', marginBottom: 8 }}>LAYOUT & OVERLAY</div>
        <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.8px', color: 'var(--text-primary)', margin: 0 }}>Guide Cue</h1>
      </div>

      <Lead>
        Guide Cues are contextual onboarding overlays that introduce users to new features or guide them through multi-step flows. They anchor to a specific UI element, highlight it with an optional beacon, and walk users through steps without interrupting the full page.
      </Lead>

      <Rule />

      {/* ── Live demo ── */}
      <SectionAnchor id="demo" />
      <H2>Interactive demo</H2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20, alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>Variant</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['standalone', 'Standalone'], ['multi', 'Multi-step']].map(([val, lbl]) => (
              <button key={val} onClick={() => { setVariant(val); resetDemo() }} style={{
                padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
                background: variant === val ? C.brand : 'transparent',
                color: variant === val ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${variant === val ? C.brand : 'var(--stroke-primary)'}`,
                transition: 'all .15s',
              }}>{lbl}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>Placement</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['bottom', 'top', 'right', 'left'].map(p => (
              <button key={p} onClick={() => setPlacement(p)} style={{
                padding: '5px 12px', borderRadius: 7, fontSize: 12,
                fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
                background: placement === p ? C.brand + '18' : 'transparent',
                color: placement === p ? C.brand : 'var(--text-secondary)',
                border: `1px solid ${placement === p ? C.brand + '60' : 'var(--stroke-primary)'}`,
                transition: 'all .15s',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo canvas */}
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 14,
        minHeight: 280,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40, position: 'relative', overflow: 'hidden',
      }}>
        {dismissed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Guide Cue dismissed.</span>
            <button onClick={resetDemo} style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: C.brand, color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
            }}>Restart</button>
          </div>
        ) : (
          <PlacedGuideCue
            C={C}
            placement={placement}
            title={currentStep.title}
            body={currentStep.body}
            step={step}
            totalSteps={totalSteps}
            onNext={handleNext}
            onDismiss={handleDismiss}
          >
            <TargetButton C={C} showBeacon={variant === 'multi'} />
          </PlacedGuideCue>
        )}
      </div>

      <Rule />

      {/* ── Anatomy ── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>
      <P>The Guide Cue is composed of a dark container, directional arrow, and three content zones. The close button and step counter are only present in the multi-step variant.</P>

      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Annotated cue */}
        <div style={{ position: 'relative', paddingTop: 8, paddingBottom: 20, paddingLeft: 8, paddingRight: 8, flexShrink: 0 }}>
          {/* Callout lines */}
          {/* We'll do a static render with numbers overlaid */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              background: C.bg, borderRadius: C.radius, padding: C.padding,
              width: 240, display: 'flex', flexDirection: 'column', gap: 8,
              boxShadow: C.shadow,
            }}>
              {/* Title + close */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.title, fontFamily: 'Poppins, sans-serif' }}>New feature</span>
                <span style={{ color: C.counter, fontSize: 14, lineHeight: 1 }}>✕</span>
              </div>
              <p style={{ fontSize: 12, color: C.body, margin: 0, lineHeight: 1.55, fontFamily: 'Poppins, sans-serif' }}>
                This is a new feature. You should try it out.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                <span style={{ fontSize: 12, color: C.counter, fontFamily: 'Poppins, sans-serif' }}>2 of 4</span>
                <span style={{
                  background: C.brand, color: '#fff', borderRadius: C.btnRadius,
                  padding: `${C.btnPadY}px ${C.btnPadX}px`,
                  fontSize: C.btnFontSize, fontFamily: 'Poppins, sans-serif',
                }}>Next</span>
              </div>
            </div>
            <Arrow C={C} direction="bottom" />

            {/* Callout badges */}
            {[
              { label: '1', top: -10, right: -10,  note: 'Container' },
              { label: '2', top: 6,   right: -32,  note: 'Dismiss (✕)' },
              { label: '3', top: 6,   left: -32,   note: 'Title' },
              { label: '4', top: 42,  left: -32,   note: 'Body text' },
              { label: '5', bottom: 24, left: -32, note: 'Step counter' },
              { label: '6', bottom: 24, right: -32, note: 'CTA button' },
              { label: '7', bottom: -10, right: -10, note: 'Arrow / caret' },
            ].map(({ label, note, ...pos }) => (
              <div key={label} style={{ position: 'absolute', ...pos }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: C.brand, color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Poppins, sans-serif', flexShrink: 0,
                }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, minWidth: 200 }}>
          {[
            ['1', 'Container',    'Dark background, 12px padding, 12px radius, Z1 shadow.'],
            ['2', 'Dismiss (✕)', 'Closes the flow early. Multi-step only — absent in standalone.'],
            ['3', 'Title',        'Short feature name. Bold, white, 12px Poppins.'],
            ['4', 'Body text',    'Explanatory copy. Muted, 12px, max ~215px wide.'],
            ['5', 'Step counter', '"N of M" progress. Multi-step only.'],
            ['6', 'CTA button',   '"Next" on intermediate steps, "Got it" on final or standalone.'],
            ['7', 'Arrow / caret','Points toward the anchored element. Rotates with placement.'],
          ].map(([num, name, desc]) => (
            <div key={num} style={{ display: 'flex', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--stroke-primary)' }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: C.brand, color: '#fff',
                fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Poppins, sans-serif', flexShrink: 0, marginTop: 2,
              }}>{num}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Rule />

      {/* ── Variants ── */}
      <SectionAnchor id="variants" />
      <H2>Variants</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Standalone */}
        <div>
          <H3>Standalone</H3>
          <P>Used when there is only a single thing to explain. No pagination, no close button. The only way to dismiss is via the "Got it" CTA.</P>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <GuideCueBubble C={C} title="Quick tip" body="Click here to export your data as CSV or PDF." step={1} totalSteps={1} onNext={() => {}} />
            <Arrow C={C} direction="bottom" />
            <TargetButton C={C} label="Export" />
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['Single step (totalSteps = 1)', 'No close button', 'No step counter', 'CTA always reads "Got it"'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.brand, flexShrink: 0 }} />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Multi-step */}
        <div>
          <H3>Multi-step</H3>
          <P>Used for feature tours across multiple UI elements. Shows step counter, close button, and an animated beacon on the target.</P>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <GuideCueBubble C={C} title="New feature" body="This is a new feature. You should try it out." step={2} totalSteps={4} onNext={() => {}} onDismiss={() => {}} />
            <Arrow C={C} direction="bottom" />
            <TargetButton C={C} label="New feature" showBeacon />
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['Up to 6 steps (totalSteps > 1)', 'Close (✕) button for early exit', '"N of M" step counter', '"Next" → "Got it" on final step', 'Animated beacon on target element'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.brand, flexShrink: 0 }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Rule />

      {/* ── Arrow placement ── */}
      <SectionAnchor id="placement" />
      <H2>Arrow placement</H2>
      <P>The Guide Cue can appear on any of the four sides of its anchor element. The arrow always points toward the anchor. Choose the placement that keeps the cue within the viewport and away from surrounding content.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { placement: 'bottom', label: 'bottom', desc: 'Cue above element — most common' },
          { placement: 'top',    label: 'top',    desc: 'Cue below element' },
          { placement: 'right',  label: 'right',  desc: 'Cue to the right of element' },
          { placement: 'left',   label: 'left',   desc: 'Cue to the left of element' },
        ].map(({ placement: p, label, desc }) => (
          <div key={p} style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140 }}>
              <PlacedGuideCue
                C={C}
                placement={p}
                title="Feature title"
                body="Short explanation of the feature."
                step={1}
                totalSteps={1}
                onNext={() => {}}
              >
                <TargetButton C={C} label="Target" />
              </PlacedGuideCue>
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--stroke-primary)', display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <Code>{label}</Code>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</span>
            </div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Beacon ── */}
      <SectionAnchor id="beacon" />
      <H2>Beacon</H2>
      <P>The beacon is an animated pulsing ring that highlights the target element in multi-step flows. It draws attention to the relevant UI affordance before the user reads the cue. The beacon respects <Code>prefers-reduced-motion</Code> — when the user has reduced motion enabled, the pulse animation is suppressed.</P>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 32, display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'On a button',  el: <TargetButton C={C} label="Analyze" showBeacon /> },
          { label: 'On an icon',
            el: (
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--stroke-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚙️</div>
                <div style={{ position: 'absolute', top: -5, right: -5 }}><Beacon color={C.brand} /></div>
              </div>
            )
          },
          { label: 'On a menu item',
            el: (
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <div style={{ padding: '6px 14px', background: 'var(--stroke-primary)', borderRadius: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}>Reports</div>
                <div style={{ position: 'absolute', top: -5, right: -5 }}><Beacon color={C.brand} /></div>
              </div>
            )
          },
        ].map(({ label, el }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            {el}
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif' }}>{label}</span>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Button label logic ── */}
      <SectionAnchor id="behavior" />
      <H2>Button label behavior</H2>
      <P>The primary CTA label changes automatically based on where the user is in the flow. This can be overridden with a custom <Code>buttonText</Code> prop.</P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Standalone', cta: 'Got it', desc: 'Always "Got it" — there is no next step.' },
          { label: 'Intermediate step', cta: 'Next', desc: 'Steps 1 through N−1 of a multi-step flow.' },
          { label: 'Final step', cta: 'Got it', desc: 'Step N of N — confirms completion.' },
        ].map(({ label, cta, desc }) => (
          <div key={label} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</div>
            <div style={{
              display: 'inline-block', background: C.brand, color: '#fff',
              borderRadius: C.btnRadius, padding: `${C.btnPadY}px ${C.btnPadX}px`,
              fontSize: C.btnFontSize, fontFamily: 'Poppins, sans-serif', marginBottom: 10,
            }}>{cta}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      <H3>Dismissal methods</H3>
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Method', 'Standalone', 'Multi-step'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Click CTA ("Got it" / "Next")', '✓', '✓'],
              ['Click close (✕) button',        '—', '✓'],
              ['Press Esc key',                 '✓ → CTA', '✓ → Dismiss'],
            ].map(([method, standalone, multi]) => (
              <tr key={method} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
                <td style={{ padding: '9px 14px', color: 'var(--text-secondary)' }}>{method}</td>
                <td style={{ padding: '9px 14px', fontWeight: 600, color: standalone === '✓' || standalone.includes('✓') ? C.brand : 'var(--text-secondary)' }}>{standalone}</td>
                <td style={{ padding: '9px 14px', fontWeight: 600, color: multi === '✓' || multi.includes('✓') ? C.brand : 'var(--text-secondary)' }}>{multi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Rule />

      {/* ── When to use ── */}
      <SectionAnchor id="usage" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <H2>When to use</H2>
          <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: 18, marginTop: 0 }}>
            <li>Onboarding a new user to a product for the first time</li>
            <li>Introducing a newly released feature to existing users</li>
            <li>Walking through a multi-step workflow (up to 6 steps)</li>
            <li>Drawing attention to a specific UI element or affordance</li>
          </ul>
        </div>
        <div>
          <H2>When not to use</H2>
          <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: 18, marginTop: 0 }}>
            <li>To drive re-engagement with existing features users already know</li>
            <li>As a persistent helper tooltip — use Tooltip instead</li>
            <li>More than once for the same feature to the same user</li>
            <li>When two Guide Cues would be visible simultaneously</li>
            <li>For flows longer than 6 steps — consider a Modal walkthrough</li>
          </ul>
        </div>
      </div>

      <Rule />

      {/* ── Guidance ── */}
      <SectionAnchor id="guidance" />
      <H2>Guidance</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DoBox
          visual={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <GuideCueBubble C={C} title="New export options" body="You can now export as CSV, PDF, or Excel." step={1} totalSteps={1} onNext={() => {}} />
              <Arrow C={C} direction="bottom" />
              <TargetButton C={C} label="Export ↓" />
            </div>
          }
        >
          Use Guide Cue only for <strong>new</strong> features. The component signals novelty — users learn to associate it with freshly released functionality.
        </DoBox>
        <DontBox
          visual={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <GuideCueBubble C={C} title="Pro tip" body="Click here to filter results." step={1} totalSteps={1} onNext={() => {}} />
              <Arrow C={C} direction="bottom" />
              <TargetButton C={C} label="Filter" />
            </div>
          }
        >
          Don't use Guide Cue to explain features that have existed for a long time. Use a Tooltip or inline help text instead.
        </DontBox>
        <DoBox
          visual={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <GuideCueBubble C={C} title="Step 3 of 4" body="Configure your settings here." step={3} totalSteps={4} onNext={() => {}} onDismiss={() => {}} />
              <Arrow C={C} direction="bottom" />
              <TargetButton C={C} label="Settings" showBeacon />
            </div>
          }
        >
          Keep multi-step flows to 6 steps or fewer. Each step should introduce one concept and anchor to a single UI element.
        </DoBox>
        <DontBox
          visual={
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              {[{title:'Tour A', body:'Step 1'}, {title:'Tour B', body:'Start here'}].map(({title, body}) => (
                <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                  <GuideCueBubble C={C} title={title} body={body} step={1} totalSteps={2} onNext={() => {}} onDismiss={() => {}} />
                  <Arrow C={C} direction="bottom" />
                  <TargetButton C={C} label="Element" showBeacon />
                </div>
              ))}
            </div>
          }
        >
          Don't show more than one Guide Cue at a time. Concurrent flows create ambiguity about which to follow and which to dismiss.
        </DontBox>
      </div>

      <Rule />

      {/* ── Accessibility ── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[
          ['Focus on open',       'When the Guide Cue opens, focus moves to the primary CTA button — not the close button. This ensures keyboard users can immediately proceed or dismiss.'],
          ['Esc key',             'Esc closes the Guide Cue in all variants. In standalone mode it fires the CTA callback; in multi-step it fires the dismiss (✕) callback.'],
          ['Reduced motion',      'The beacon pulse animation and staggered open/close transitions are suppressed when the user\'s OS has prefers-reduced-motion enabled.'],
          ['Dismiss mode',        'The underlying tooltip uses dismissMode="manual" — it never auto-closes from outside clicks or blur, giving the user full control.'],
          ['Hidden step content', 'Steps not yet shown must not be in the DOM or must be aria-hidden — do not pre-render all steps with display:none.'],
          ['Width consistency',   'In multi-step flows, fix the cue width across all steps so the layout does not shift when content changes between steps.'],
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
      <P>Guide Cue has no dedicated component tokens. It borrows from the tooltip and button token sets, supplemented by Figma-specified neutral color values.</P>
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
              ['tooltip.bg',                 tokens['tooltip.bg'] || '#1c252e',  'Container background'],
              ['tabs.indicator',             tokens['tabs.indicator'] || '#07a2b6', 'CTA button & beacon color'],
              ['button.size.xs.radius',      tokens['button.size.xs.radius'],     'CTA button corner radius'],
              ['button.size.xs.padding-x',   tokens['button.size.xs.padding-x'],  'CTA button horizontal padding'],
              ['button.size.xs.padding-y',   tokens['button.size.xs.padding-y'],  'CTA button vertical padding'],
              ['button.size.xs.font-size',   tokens['button.size.xs.font-size'],  'CTA button font size'],
              ['—',                          '#ffffff',    'Title text (Figma spec)'],
              ['—',                          '#c4cdd5',    'Body text — color/text/subtlest (Figma spec)'],
              ['—',                          '#919eab',    'Step counter — color/text/subtle (Figma spec)'],
            ].map(([key, val, role]) => (
              <tr key={key + role} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
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

      <aside style={{ width: 200, flexShrink: 0, position: 'sticky', top: 80, padding: '52px 24px 48px 0', alignSelf: 'flex-start' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>On this page</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {TOC.map(item => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  display: 'block',
                  fontSize: 12,
                  padding: '5px 10px',
                  borderRadius: 6,
                  borderLeft: isActive ? '2px solid var(--brand-600)' : '2px solid transparent',
                  color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--brand-50)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: 'none',
                  transition: 'all .12s',
                  lineHeight: 1.5,
                }}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
        <BrandThemeSwitcher />
      </aside>
    </div>
  )
}
