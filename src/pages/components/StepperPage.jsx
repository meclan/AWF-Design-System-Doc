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
      {visual && <div style={{ padding: '20px 18px', background: 'var(--bg-primary)', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '20px 18px', background: 'var(--bg-primary)', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Token-driven color palette ───────────────────────────────────────────────
// tabs.indicator   = color.stroke.brand.default  (brand mid, changes per theme)
// tabs.text.active = color.text.brand.strongest  (brand dark, changes per theme)

function getStepColors(t) {
  const brandMid  = t['tabs.indicator']    || '#07a2b6'
  const brandDark = t['tabs.text.active']  || '#05606d'
  return {
    active:         brandMid,
    completedBadge: brandDark,
    completedLabel: brandDark,
    connectorDone:  brandMid,
    activeLabel:    '#141a21',
    pendingLabel:   '#454f5b',
    subtitle:       '#637381',
    connector:      '#c4cdd5',
    pendingBorder:  '#c4cdd5',
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon({ size = 16, color = '#ffffff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill={color} />
    </svg>
  )
}
function ChevronRight({ size = 14, color = '#919eab' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill={color} />
    </svg>
  )
}

// ─── Stepper ──────────────────────────────────────────────────────────────────
// variant: 'base' | 'numbered' | 'inline'
// onSelect(index) — called when a completed step is clicked (all variants)

function Stepper({ steps = [], currentStep = 0, variant = 'numbered', t = {}, onSelect }) {
  const C = getStepColors(t)
  if (variant === 'inline') return <StepperInline steps={steps} currentStep={currentStep} C={C} onSelect={onSelect} />

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep
        const isActive    = i === currentStep
        const isPending   = i > currentStep
        const isClickable = isCompleted && !!onSelect

        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
            {/* Indicator row — fixed 24px height so labels never shift */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 10 }}>
              {/* Left connector */}
              <div style={{ flex: 1, height: 2, background: i === 0 ? 'transparent' : (isCompleted || isActive ? C.connectorDone : C.connector), transition: 'background .3s' }} />

              {/* Badge — all variants use same 24px outer box to keep alignment */}
              {variant === 'base' ? (
                // Dots: fixed 24px wrapper, inner dot scales
                <button
                  onClick={isClickable ? () => onSelect(i) : undefined}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Step ${i + 1}: ${step.label}${isCompleted ? ' – completed' : isActive ? ' – current' : ' – upcoming'}`}
                  style={{
                    width: 24, height: 24, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'none', border: 'none', padding: 0,
                    cursor: isClickable ? 'pointer' : 'default',
                  }}
                >
                  <span style={{
                    width:  isCompleted ? 16 : (isActive ? 12 : 8),
                    height: isCompleted ? 16 : (isActive ? 12 : 8),
                    borderRadius: '50%',
                    background: isCompleted ? C.completedBadge : (isActive ? C.active : 'transparent'),
                    border: isPending ? `2px solid ${C.pendingBorder}` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .2s',
                    flexShrink: 0,
                  }}>
                    {isCompleted && <CheckIcon size={10} color="#fff" />}
                  </span>
                </button>
              ) : (
                // Numbered: 24px circle with number or check
                <button
                  onClick={isClickable ? () => onSelect(i) : undefined}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Step ${i + 1}: ${step.label}${isCompleted ? ' – completed' : isActive ? ' – current' : ' – upcoming'}`}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: isCompleted ? C.completedBadge : (isActive ? C.active : 'transparent'),
                    border: isPending ? `1.5px solid ${C.pendingBorder}` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: isClickable ? 'pointer' : 'default',
                    padding: 0, transition: 'all .2s',
                  }}
                >
                  {isCompleted
                    ? <CheckIcon size={13} color="#fff" />
                    : <span style={{ fontSize: 11, fontWeight: 400, color: isActive ? '#fff' : C.pendingLabel, lineHeight: 1 }}>{i + 1}</span>
                  }
                </button>
              )}

              {/* Right connector */}
              <div style={{ flex: 1, height: 2, background: i === steps.length - 1 ? 'transparent' : (isCompleted ? C.connectorDone : C.connector), transition: 'background .3s' }} />
            </div>

            {/* Label */}
            <div style={{ textAlign: 'center', paddingInline: 4 }}>
              <div style={{
                fontSize: 10, fontWeight: isActive ? 600 : 400, textTransform: 'uppercase', letterSpacing: '.06em',
                color: isCompleted ? C.completedLabel : (isActive ? C.activeLabel : C.pendingLabel),
                marginBottom: 2, lineHeight: 1.3, transition: 'color .2s',
              }}>
                {step.label}
              </div>
              {step.subtitle && (
                <div style={{ fontSize: 9, color: C.subtitle, lineHeight: 1.4 }}>{step.subtitle}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Inline variant ───────────────────────────────────────────────────────────
// Completed AND active steps are clickable buttons that navigate back

function StepperInline({ steps = [], currentStep = 0, C, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep
        const isActive    = i === currentStep
        const isClickable = isCompleted && !!onSelect

        return (
          <React.Fragment key={i}>
            <button
              onClick={isClickable ? () => onSelect(i) : undefined}
              aria-current={isActive ? 'step' : undefined}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                background: 'none', border: 'none', padding: 0,
                cursor: isClickable ? 'pointer' : 'default',
                //textDecoration: isClickable ? 'underline' : 'none',
                textDecorationColor: C.completedLabel,
              }}
            >
              <span style={{
                fontSize: 11, fontWeight: isActive ? 600 : 400,
                color: isCompleted ? C.completedLabel : (isActive ? C.activeLabel : C.pendingLabel),
                transition: 'color .2s',
              }}>
                {i + 1}. {step.label}
              </span>
              {step.subtitle && (
                <span style={{ fontSize: 9, color: C.subtitle }}>{step.subtitle}</span>
              )}
            </button>
            {i < steps.length - 1 && <ChevronRight size={12} color={C.subtitle} />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Live demo ────────────────────────────────────────────────────────────────

const DEMO_STEPS_3 = [
  { label: 'Account definition',  subtitle: 'Authentication & login' },
  { label: 'Identification',      subtitle: 'Personal information'   },
  { label: 'Profile assignment',  subtitle: 'Assign roles'           },
]
const DEMO_STEPS_4 = [
  { label: 'Account',    subtitle: 'Authentication' },
  { label: 'Identity',   subtitle: 'Personal info'  },
  { label: 'Profiles',   subtitle: 'Assign roles'   },
  { label: 'Review',     subtitle: 'Confirm & save' },
]

function StepperLive({ t }) {
  const [variant,     setVariant]     = useState('numbered')
  const [stepCount,   setStepCount]   = useState(3)
  const [currentStep, setCurrentStep] = useState(0)

  const C     = getStepColors(t)
  const steps = stepCount === 3 ? DEMO_STEPS_3 : DEMO_STEPS_4
  const safeStep = Math.min(currentStep, steps.length - 1)

  const btnBase = (active) => ({
    padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
    border: `1px solid ${active ? C.active : 'var(--stroke-primary)'}`,
    background: active ? C.active + '18' : 'var(--bg-primary)',
    color:      active ? C.active : 'var(--text-secondary)',
  })

  return (
    <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
      {/* Preview */}
      <div style={{ padding: '32px 28px 24px', background: 'var(--bg-primary)' }}>
        <Stepper
          steps={steps}
          currentStep={safeStep}
          variant={variant}
          t={t}
          onSelect={setCurrentStep}
        />
        {/* Step nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={safeStep === 0}
            style={{ padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: `1px solid ${safeStep === 0 ? '#c4cdd5' : C.active}`, color: safeStep === 0 ? '#c4cdd5' : C.active, background: 'transparent', cursor: safeStep === 0 ? 'default' : 'pointer' }}
          >← Previous</button>
          <span style={{ fontSize: 12, color: C.subtitle, alignSelf: 'center' }}>Step {safeStep + 1} of {steps.length}</span>
          <button
            onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
            disabled={safeStep === steps.length - 1}
            style={{ padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: 'none', background: safeStep === steps.length - 1 ? '#c4cdd5' : C.active, color: '#fff', cursor: safeStep === steps.length - 1 ? 'default' : 'pointer' }}
          >Next →</button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '14px 20px', display: 'flex', flexWrap: 'wrap', gap: 20, borderTop: '1px solid var(--stroke-primary)' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Variant</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[['numbered', 'Numbered'], ['base', 'Dots'], ['inline', 'Inline']].map(([v, label]) => (
              <button key={v} style={btnBase(variant === v)} onClick={() => setVariant(v)}>{label}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Steps</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[3, 4].map(n => (
              <button key={n} style={{ ...btnBase(stepCount === n), width: 36 }} onClick={() => { setStepCount(n); setCurrentStep(0) }}>{n}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',  label: 'Overview'      },
  { id: 'anatomy',   label: 'Anatomy'       },
  { id: 'states',    label: 'Step states'   },
  { id: 'variants',  label: 'Variants'      },
  { id: 'usage',     label: 'Usage rules'   },
  { id: 'usecase',   label: 'Use case'      },
  { id: 'a11y',      label: 'Accessibility' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function StepperPage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

  const t = getComponentTokens(activeTheme)
  const C = getStepColors(t)

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    const ids = TOC.map(i => i.id)
    function onScroll() {
      const mainTop   = main.getBoundingClientRect().top
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

  const demoSteps = DEMO_STEPS_3

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Navigation</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Stepper</h1>
          <Lead>
            A <strong>sequential progress indicator</strong> that guides users through a multi-step workflow. Each step is clearly marked as completed, active, or pending — giving users a sense of progress and allowing navigation back to completed steps.
          </Lead>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', paddingTop: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>Preview theme:</span>
            {VISIBLE_THEMES.map(th => (
              <button key={th.id} onClick={() => setActiveTheme(th.id)} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                border: `2px solid ${activeTheme === th.id ? th.color : 'var(--stroke-primary)'}`,
                background: activeTheme === th.id ? th.color + '18' : 'transparent',
                color:      activeTheme === th.id ? th.color : 'var(--text-secondary)',
              }}>
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: th.color, marginRight: 5, verticalAlign: 'middle' }} />
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW ────────────────────────────────────────────────────── */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <StepperLive t={t} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 10 }}>When to use</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              <li>For multi-step forms or wizards (2–5 steps)</li>
              <li>When step order is mandatory and steps must be completed sequentially</li>
              <li>When users need to track progress through a long process</li>
              <li>For onboarding flows, checkout, or entity creation wizards</li>
            </ul>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 10 }}>When not to use</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              <li>When steps can be completed in any order — use a checklist instead</li>
              <li>When there is only one step — no progress indicator needed</li>
              <li>For non-linear navigation — use <strong>Tabs</strong></li>
              <li>When more than 5 steps are required — consider splitting the flow</li>
            </ul>
          </div>
        </div>

        <Divider />

        {/* ── ANATOMY ─────────────────────────────────────────────────────── */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <P>The stepper is composed of step nodes connected by lines. Each node has a visual indicator (badge) and an optional label with subtitle.</P>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '36px 24px 40px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <Stepper steps={[
              { label: 'Account definition', subtitle: 'Auth & login' },
              { label: 'Identification',     subtitle: 'Personal info' },
              { label: 'Profile assignment', subtitle: 'Assign roles'  },
            ]} currentStep={1} variant="numbered" t={t} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 28 }}>
            {[
              { n: 1, label: 'Step indicator',  desc: 'Circle badge: check (done), filled number (active), outlined (pending).' },
              { n: 2, label: 'Connector line',  desc: 'Horizontal rule. Brand colour when done, neutral when pending.' },
              { n: 3, label: 'Step label',      desc: 'Uppercase, 10px. Weight and colour reflect step state.' },
              { n: 4, label: 'Step subtitle',   desc: 'Optional 9px helper text in tertiary colour.' },
            ].map(({ n, label, desc }) => (
              <div key={n} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#637381', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{n}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ── STATES ──────────────────────────────────────────────────────── */}
        <SectionAnchor id="states" />
        <H2>Step states</H2>
        <P>Every step node exists in one of three states. All three are visible simultaneously in the strip.</P>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {/* Pending */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
            <div style={{ padding: '28px 20px 20px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: `1.5px solid ${C.pendingBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12, color: C.pendingLabel }}>3</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '.06em', color: C.pendingLabel }}>Profile assignment</div>
                <div style={{ fontSize: 9, color: C.subtitle, marginTop: 2 }}>Assign roles</div>
              </div>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 3 }}>Pending</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>Not yet reached. Outlined circle, neutral text. Non-interactive.</div>
            </div>
          </div>

          {/* Active */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
            <div style={{ padding: '28px 20px 20px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.active, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12, color: '#fff' }}>2</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: C.activeLabel }}>Identification</div>
                <div style={{ fontSize: 9, color: C.subtitle, marginTop: 2 }}>Personal info</div>
              </div>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 3 }}>Active</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>Current step. Brand-filled badge, bold dark label. Only one active at a time.</div>
            </div>
          </div>

          {/* Completed */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
            <div style={{ padding: '28px 20px 20px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.completedBadge, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckIcon size={15} color="#fff" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '.06em', color: C.completedLabel }}>Account definition</div>
                <div style={{ fontSize: 9, color: C.subtitle, marginTop: 2 }}>Auth & login</div>
              </div>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 3 }}>Completed</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>Done. Check icon, brand badge & label. Connector turns brand colour.</div>
            </div>
          </div>
        </div>

        <Divider />

        {/* ── VARIANTS ────────────────────────────────────────────────────── */}
        <SectionAnchor id="variants" />
        <H2>Variants</H2>

        <H3>Numbered</H3>
        <P>Default variant. Each step shows a numbered 24px circle. Best when step numbers are meaningful and users may want to reference them. Clicking a completed step navigates back to it.</P>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '28px 24px', border: '1px solid var(--stroke-primary)' }}>
          <Stepper steps={demoSteps} currentStep={1} variant="numbered" t={t} />
        </div>

        <H3>Dots</H3>
        <P>Minimal variant using small dots instead of numbered circles. All dots share the same 24px bounding box, so labels stay perfectly aligned regardless of state. Use when step count is self-evident.</P>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '28px 24px', border: '1px solid var(--stroke-primary)' }}>
          <Stepper steps={demoSteps} currentStep={1} variant="base" t={t} />
        </div>

        <H3>Inline</H3>
        <P>Compact text-only variant with numbered labels and chevron separators. Completed steps are underlined and <strong>clickable</strong> — clicking them navigates back. Use inside modals or wherever vertical space is limited.</P>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '20px 24px', border: '1px solid var(--stroke-primary)' }}>
          <Stepper steps={demoSteps} currentStep={1} variant="inline" t={t} />
        </div>

        <Divider />

        {/* ── USAGE ───────────────────────────────────────────────────────── */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DoBox
            visual={
              <div style={{ width: '100%', maxWidth: 380 }}>
                <Stepper steps={[{ label: 'Account' }, { label: 'Identity' }, { label: 'Review' }]} currentStep={1} variant="numbered" t={t} />
              </div>
            }
          >
            Keep step labels short (1–2 words). Users should understand the goal of each step at a glance.
          </DoBox>
          <DontBox
            visual={
              <div style={{ width: '100%', maxWidth: 380 }}>
                <Stepper steps={[{ label: 'Set up authentication credentials' }, { label: 'Enter all identification details' }, { label: 'Assign and configure profiles' }]} currentStep={1} variant="numbered" t={t} />
              </div>
            }
          >
            Don't use long, sentence-style labels. They overflow the indicator and are hard to scan.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <DoBox>
            Limit wizards to 3–5 steps. If a process needs more, group related actions into a single step with sub-tasks or split the wizard into distinct flows.
          </DoBox>
          <DontBox>
            Don't use a stepper for non-linear tasks where steps can be skipped or reordered. Use a checklist or a different navigation pattern instead.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <DoBox>
            Allow users to navigate back to completed steps by clicking their badge or label. Always preserve data entered in previous steps.
          </DoBox>
          <DontBox>
            Don't lock all previous steps after completion unless the business logic genuinely prevents editing. Locking frustrates users who made a mistake earlier.
          </DontBox>
        </div>

        <Divider />

        {/* ── USE CASE ────────────────────────────────────────────────────── */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <P>A common pattern is a modal or card wizard for entity creation. The stepper sits in the card header; the active step's form renders below; navigation buttons sit in the sticky footer. Click Previous or the completed step badge to go back.</P>

        <WizardMockup t={t} />

        <Divider />

        {/* ── ACCESSIBILITY ───────────────────────────────────────────────── */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <P>The stepper implements a <Code>role="list"</Code> / <Code>role="listitem"</Code> structure so screen readers can enumerate steps and announce progress.</P>

        <div style={{ borderRadius: 8, border: '1px solid var(--stroke-primary)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', padding: '8px 14px' }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Attribute / Pattern</span>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Behaviour</span>
          </div>
          {[
            { key: 'role="list"',           val: 'Applied to the stepper container so screen readers enumerate step count.' },
            { key: 'role="listitem"',        val: 'Applied to each step node.' },
            { key: 'aria-current="step"',    val: 'Set on the active step\'s indicator so assistive tech announces "current step".' },
            { key: 'aria-label',             val: 'Each step button gets an aria-label like "Step 2 of 4: Identification – active".' },
            { key: 'aria-disabled="true"',   val: 'Pending steps that are not navigable should have aria-disabled to block keyboard activation.' },
            { key: 'aria-live="polite"',     val: 'A live region announces the current step name when the user advances or goes back.' },
            { key: 'Tab key',               val: 'Focus moves to the Previous and Next buttons in the footer — not through step badges unless they are interactive (completed steps).' },
            { key: 'Focus management',       val: 'When advancing a step, focus should move to the first focusable element in the new step\'s form content.' },
          ].map(({ key, val }, i, arr) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '9px 14px', borderBottom: i < arr.length - 1 ? '1px solid var(--stroke-primary)' : 'none', alignItems: 'start' }}>
              <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{key}</code>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{val}</span>
            </div>
          ))}
        </div>

        <InfoBox type="info" style={{ marginTop: 20 }}>
          Always ensure the form inside each step panel has a visible heading (<Code>h2</Code> or <Code>h3</Code>) describing what the user is filling in. This gives screen-reader users context without relying solely on the step label.
        </InfoBox>

      </div>

      {/* ── TOC ───────────────────────────────────────────────────────────── */}
      <div style={{ width: 200, flexShrink: 0, position: 'sticky', top: 80, padding: '48px 24px 48px 0', alignSelf: 'flex-start' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-tertiary)', marginBottom: 12 }}>On this page</div>
        {TOC.map(item => (
          <a key={item.id} href={`#${item.id}`} onClick={e => {
            e.preventDefault()
            const el = document.getElementById(item.id)
            const main = document.querySelector('main')
            if (el && main) main.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' })
          }} style={{
            display: 'block', padding: '5px 10px', fontSize: 13, borderRadius: 5, textDecoration: 'none', marginBottom: 2,
            color:      activeSection === item.id ? 'var(--brand-600)' : 'var(--text-secondary)',
            background: activeSection === item.id ? 'var(--bg-secondary)' : 'transparent',
            fontWeight: activeSection === item.id ? 600 : 400,
            borderLeft: activeSection === item.id ? '2px solid var(--brand-600)' : '2px solid transparent',
          }}>{item.label}</a>
        ))}
      </div>

    </div>
  )
}

// ─── Wizard mockup ────────────────────────────────────────────────────────────

function WizardMockup({ t }) {
  const [step, setStep] = useState(0)
  const C = getStepColors(t)

  const steps = [
    { label: 'Account',  subtitle: 'Auth & login'   },
    { label: 'Identity', subtitle: 'Personal info'  },
    { label: 'Profiles', subtitle: 'Assign roles'   },
  ]

  const formContent = [
    [
      { label: 'Authentication', placeholder: 'Select an authentication type…', type: 'select' },
      { label: 'Login',          placeholder: 'Enter a login…' },
      { label: 'Password',       placeholder: 'Enter a password…' },
      { label: 'Expiration date',placeholder: 'Select expiration date…', type: 'select' },
    ],
    [
      { label: 'Title',      placeholder: 'Select a title…', type: 'select' },
      { label: 'First name', placeholder: 'Enter first name…' },
      { label: 'Last name',  placeholder: 'Enter last name…' },
      { label: 'Email',      placeholder: 'Enter email…' },
    ],
    [
      { label: 'Profile',      placeholder: 'Select a profile…', type: 'select' },
      { label: 'Access level', placeholder: 'Select access level…', type: 'select' },
    ],
  ]

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,.1)', background: 'var(--bg-primary)', maxWidth: 520, border: '1px solid var(--stroke-primary)' }}>
      {/* Card header */}
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--stroke-primary)' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.completedBadge, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>U</span>
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Add User</span>
      </div>

      {/* Stepper strip */}
      <div style={{ padding: '20px 24px 8px' }}>
        <Stepper steps={steps} currentStep={step} variant="numbered" t={t} onSelect={setStep} />
      </div>

      {/* Form area */}
      <div style={{ padding: '16px 24px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>{steps[step].label}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {formContent[step].map(({ label, placeholder, type }) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: 12 }}>
              <label style={{ fontSize: 12, color: '#637381' }}>{label}</label>
              <div style={{ background: '#ecf6fa', borderRadius: 5, padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#919eab' }}>{placeholder}</span>
                {type === 'select' && <ChevronRight size={10} color="#919eab" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 24px', borderTop: '1px solid var(--stroke-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={{ padding: '7px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: `1px solid ${C.active}`, color: C.active, background: 'transparent', cursor: 'pointer' }}>Cancel</button>
        <div style={{ display: 'flex', gap: 8 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: '7px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: 'none', background: '#ecf6fa', color: C.active, cursor: 'pointer' }}>Previous</button>
          )}
          <button onClick={() => step < steps.length - 1 && setStep(s => s + 1)} style={{ padding: '7px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: 'none', background: step === steps.length - 1 ? C.completedBadge : C.active, color: '#fff', cursor: step === steps.length - 1 ? 'default' : 'pointer' }}>
            {step === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
