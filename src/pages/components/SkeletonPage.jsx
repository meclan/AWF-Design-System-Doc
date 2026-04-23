import React, { useState, useEffect } from 'react'
import { useBrandTheme } from '../../contexts/BrandThemeContext.jsx'
import BrandThemeSwitcher from '../../components/BrandThemeSwitcher.jsx'
import { THEMES, getComponentTokens } from '../../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

// ─── Inject shimmer keyframe once ─────────────────────────────────────────────

function ShimmerStyle() {
  useEffect(() => {
    if (document.getElementById('awf-shimmer-style')) return
    const tag = document.createElement('style')
    tag.id = 'awf-shimmer-style'
    tag.textContent = `@keyframes awf-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`
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
    bg:           t['skeleton.bg']           || '#f4f6f8',
    shimmer:      t['skeleton.shimmer']      || '#eef0f2',
    radiusText:   n('skeleton.radius.text')  ?? 6,
    radiusBlock:  n('skeleton.radius.block') ?? 8,
    radiusCircle: n('skeleton.radius.circle') ?? 100,
  }
}

// ─── Bone (base skeleton element) ─────────────────────────────────────────────

function Bone({ C, width = '100%', height = 12, radius, animate = true, style = {} }) {
  const r = radius !== undefined ? radius : C.radiusText
  return (
    <div style={{
      width, height, borderRadius: r, flexShrink: 0,
      background: animate
        ? `linear-gradient(90deg, ${C.bg} 25%, ${C.shimmer} 50%, ${C.bg} 75%)`
        : C.bg,
      backgroundSize: '200% 100%',
      animation: animate ? 'awf-shimmer 1.6s ease-in-out infinite' : 'none',
      ...style,
    }} />
  )
}

// ─── Pattern skeletons ────────────────────────────────────────────────────────

function TextSkeleton({ C, lines = 3, animate = true }) {
  // Widths that look like natural text: full, 85%, 72%, 60%, 90%…
  const widths = ['100%', '85%', '72%', '60%', '90%', '78%', '55%']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }, (_, i) => (
        <Bone key={i} C={C} width={widths[i % widths.length]} height={12} animate={animate} />
      ))}
    </div>
  )
}

function HeadingSkeleton({ C, animate = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Bone C={C} width="55%" height={16} animate={animate} />
      <Bone C={C} width="38%" height={10} animate={animate} />
    </div>
  )
}

function CardSkeleton({ C, animate = true }) {
  return (
    <div style={{
      background: '#fff', borderRadius: C.radiusBlock + 4,
      border: '1px solid #eef0f2',
      boxShadow: '0 2px 8px rgba(0,0,0,.06)',
      overflow: 'hidden', width: '100%', maxWidth: 320,
    }}>
      {/* Header block */}
      <Bone C={C} width="100%" height={44} radius={0} animate={animate} />
      {/* Body */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bone C={C} width="80%" height={12} animate={animate} />
        <Bone C={C} width="92%" height={12} animate={animate} />
        <Bone C={C} width="70%" height={12} animate={animate} />
        <Bone C={C} width="60%" height={12} animate={animate} style={{ marginTop: 4 }} />
      </div>
    </div>
  )
}

function TableSkeleton({ C, rows = 5, animate = true }) {
  const lineWidths = ['62%', '75%', '55%', '80%', '48%']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%', maxWidth: 400 }}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 0',
          borderBottom: i < rows - 1 ? `1px solid ${C.shimmer}` : 'none',
        }}>
          <Bone C={C} width={lineWidths[i % lineWidths.length]} height={10} animate={animate} />
          <Bone C={C} width={28} height={10} radius={C.radiusBlock} animate={animate} />
        </div>
      ))}
    </div>
  )
}

function ProfileSkeleton({ C, animate = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* Avatar */}
      <Bone C={C} width={40} height={40} radius={C.radiusCircle} animate={animate} />
      {/* Lines */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bone C={C} width="55%" height={12} animate={animate} />
        <Bone C={C} width="35%" height={10} animate={animate} />
      </div>
    </div>
  )
}

function FormSkeleton({ C, animate = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 320 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Bone C={C} width="30%" height={10} animate={animate} />
          <Bone C={C} width="100%" height={36} radius={C.radiusBlock} animate={animate} />
        </div>
      ))}
      <Bone C={C} width="40%" height={36} radius={C.radiusBlock} animate={animate} style={{ alignSelf: 'flex-end' }} />
    </div>
  )
}

// ─── Page primitives ──────────────────────────────────────────────────────────

function SectionAnchor({ id }) { return <span id={id} style={{ display: 'block', marginTop: -80, paddingTop: 80 }} /> }
function H2({ children }) { return <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--text-primary)', marginBottom: 12, marginTop: 56 }}>{children}</h2> }
function H3({ children }) { return <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, marginTop: 28 }}>{children}</h3> }
function Lead({ children }) { return <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20 }}>{children}</p> }
function P({ children }) { return <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 14 }}>{children}</p> }
function Code({ children }) { return <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: 'var(--bg-secondary)', color: 'var(--brand-600)', padding: '1px 6px', borderRadius: 4 }}>{children}</code> }
function Rule() { return <hr style={{ border: 'none', borderTop: '1px solid var(--stroke-primary)', margin: '48px 0' }} /> }
function StateLabel({ children }) { return <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 10 }}>{children}</div> }

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
  ['skeleton.bg',           'Base bone colour — the static fill'],
  ['skeleton.shimmer',      'Shimmer highlight colour — sweeps left to right'],
  ['skeleton.radius.text',  'Border-radius for text lines (sm)'],
  ['skeleton.radius.block', 'Border-radius for blocks, cards, fields (md)'],
  ['skeleton.radius.circle','Border-radius for circular elements (full = 100px)'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

const PATTERNS = ['Text', 'Card', 'Table / List', 'Profile', 'Form']

const TOC = [
  ['demo',       'Interactive demo'],
  ['anatomy',    'Anatomy'],
  ['patterns',   'Patterns'],
  ['animation',  'Animation'],
  ['usage',      'Usage guidelines'],
  ['comparison', 'Spinner vs Skeleton'],
  ['a11y',       'Accessibility'],
  ['tokens',     'Token reference'],
]

export default function SkeletonPage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [demoPattern, setDemoPattern] = useState('Card')
  const [animate,     setAnimate]     = useState(true)
  const [activeSection, setActiveSection] = useState('demo')

  const tokens = getComponentTokens(activeTheme)
  const C      = getColors(tokens)

  useEffect(() => {
    const main = document.querySelector('main') || window
    const onScroll = () => {
      const ids = TOC.map(([id]) => id)
      const scrollTop = main === window ? window.scrollY : main.scrollTop
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + (main === window ? 0 : main.scrollTop) - 120
        if (scrollTop >= top) current = id
      }
      setActiveSection(current)
    }
    main.addEventListener('scroll', onScroll)
    onScroll()
    return () => main.removeEventListener('scroll', onScroll)
  }, [])

  const pill   = { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: 'pointer', border: '1px solid var(--stroke-primary)' }
  const active = on => on ? { background: C.brand, color: '#fff', border: `1px solid ${C.brand}` } : { background: 'transparent', color: 'var(--text-secondary)' }

  function DemoPattern({ pattern, C, animate }) {
    if (pattern === 'Text')         return <TextSkeleton C={C} lines={5} animate={animate} />
    if (pattern === 'Card')         return <CardSkeleton C={C} animate={animate} />
    if (pattern === 'Table / List') return <TableSkeleton C={C} rows={5} animate={animate} />
    if (pattern === 'Profile')      return <ProfileSkeleton C={C} animate={animate} />
    if (pattern === 'Form')         return <FormSkeleton C={C} animate={animate} />
    return null
  }

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ flex: 1, maxWidth: 960, margin: '0 auto', padding: '40px 32px 80px' }}>
      <ShimmerStyle />

      {/* ── Header ── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: C.brand }}>Feedback & Status</span>
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', marginBottom: 16 }}>Skeleton</h1>

      <Lead>
        Skeleton screens display low-fidelity placeholders that mirror the layout of incoming content. They reduce perceived wait time, prevent layout shift, and signal to users that something is loading — without the anxiety of a blank page or a blocking spinner.
      </Lead>

      <Rule />

      {/* ── Interactive demo ── */}
      <SectionAnchor id="demo" />
      <H2>Interactive demo</H2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Pattern picker */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {PATTERNS.map(p => (
            <button key={p} onClick={() => setDemoPattern(p)} style={{ ...pill, ...active(demoPattern === p) }}>{p}</button>
          ))}
        </div>
        {/* Shimmer toggle */}
        <div
          onClick={() => setAnimate(a => !a)}
          style={{ ...pill, ...active(animate), cursor: 'pointer', userSelect: 'none' }}>
          {animate ? '⏸ Pause shimmer' : '▶ Play shimmer'}
        </div>
      </div>

      <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: '40px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
        <div style={{ width: '100%', maxWidth: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DemoPattern pattern={demoPattern} C={C} animate={animate} />
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: 6 }}>
        Pause the shimmer to inspect the static layout of the skeleton.
      </p>

      <Rule />

      {/* ── Anatomy ── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>
      <P>Every skeleton is built from a single primitive called a <strong>Bone</strong>. Bones are div elements with a fixed background colour (<Code>skeleton.bg</Code>) and a shimmer gradient sweep driven by a CSS animation. The three shape variants — line, block, circle — differ only in their border-radius token.</P>

      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Shape demos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: '0 0 auto' }}>
          <div>
            <StateLabel>Line (text)</StateLabel>
            <Bone C={C} width={180} height={12} radius={C.radiusText} animate={true} />
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>radius: skeleton.radius.text ({C.radiusText}px)</div>
          </div>
          <div>
            <StateLabel>Block (image / card header)</StateLabel>
            <Bone C={C} width={180} height={40} radius={C.radiusBlock} animate={true} />
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>radius: skeleton.radius.block ({C.radiusBlock}px)</div>
          </div>
          <div>
            <StateLabel>Circle (avatar / icon)</StateLabel>
            <Bone C={C} width={40} height={40} radius={C.radiusCircle} animate={true} />
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>radius: skeleton.radius.circle ({C.radiusCircle}px)</div>
          </div>
        </div>

        {/* Anatomy callouts */}
        <div style={{ flex: 1, minWidth: 220 }}>
          {[
            ['Base fill', `skeleton.bg — the resting background colour of every bone. Chosen to sit comfortably against both white and lightly tinted surfaces.`],
            ['Shimmer highlight', `skeleton.shimmer — a subtly lighter tone that sweeps left→right at 1.6 s/cycle, giving the impression of light reflecting off a surface.`],
            ['Shimmer gradient', 'Implemented as a CSS linear-gradient: bg 25% → shimmer 50% → bg 75% with background-size: 200%. The animation shifts background-position from -200% to 200%.'],
            ['Border-radius', 'Three tokens map to the three semantic shapes: text lines use radius.sm (6 px), blocks use radius.md (8 px), circles use radius.full (100 px).'],
          ].map(([t, d]) => (
            <div key={t} style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t} — </span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{d}</span>
            </div>
          ))}
        </div>
      </div>

      <Rule />

      {/* ── Patterns ── */}
      <SectionAnchor id="patterns" />
      <H2>Patterns</H2>
      <P>Compose bones into patterns that mirror the real layout as closely as possible. The goal is not a pixel-perfect replica but a faithful approximation of proportions and hierarchy.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* Text */}
        <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 10 }}>
          <StateLabel>Text block</StateLabel>
          <TextSkeleton C={C} lines={5} animate={true} />
          <P style={{ marginTop: 10 }}>For body copy, use full-width and narrowing lines to mimic natural text wrapping. Last line always shorter — ~50–65% width.</P>
        </div>

        {/* Heading */}
        <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 10 }}>
          <StateLabel>Heading + subtitle</StateLabel>
          <HeadingSkeleton C={C} animate={true} />
          <P style={{ marginTop: 10 }}>Use a taller bone (16 px) for the heading, a shorter one (10 px) for the subtitle. Keep widths distinct to communicate hierarchy.</P>
        </div>

        {/* Card */}
        <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StateLabel>Elevated card</StateLabel>
          <CardSkeleton C={C} animate={true} />
          <P>Mirror the card's real structure: header block with radius:0 (flush), then body lines. The card shell itself uses a white background + shadow.</P>
        </div>

        {/* Table / list */}
        <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 10 }}>
          <StateLabel>Table / list</StateLabel>
          <TableSkeleton C={C} rows={5} animate={true} />
          <P style={{ marginTop: 10 }}>Each row has a line on the left and a small action block on the right, separated by a thin divider. Vary line widths to feel organic.</P>
        </div>

        {/* Profile */}
        <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 10 }}>
          <StateLabel>Profile / user row</StateLabel>
          <ProfileSkeleton C={C} animate={true} />
          <P style={{ marginTop: 10 }}>Circle for the avatar, two lines for name + role. Avatar uses <Code>skeleton.radius.circle</Code>.</P>
        </div>

        {/* Form */}
        <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 10 }}>
          <StateLabel>Form</StateLabel>
          <FormSkeleton C={C} animate={true} />
          <P style={{ marginTop: 10 }}>Label line (short, thin) + input block per field. Use <Code>skeleton.radius.block</Code> on input bones to match real field radius.</P>
        </div>

      </div>

      <Rule />

      {/* ── Animation ── */}
      <SectionAnchor id="animation" />
      <H2>Animation</H2>
      <P>The shimmer is a CSS <Code>linear-gradient</Code> animated via <Code>background-position</Code>. This approach requires no DOM manipulation or JS timers — it runs entirely in the compositor thread for smooth performance even during heavy JavaScript work.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          ['Speed', '1.6 s per cycle. Slow enough to feel calm, fast enough to clearly signal activity. Do not make it faster than 1 s (feels frantic) or slower than 2.5 s (feels broken).'],
          ['Direction', 'Left → right, matching natural reading direction. The gradient is 200% wide so it enters from the left edge and exits to the right edge in one cycle.'],
          ['Sync', "All bones on a page share the same animation keyframe and duration. Because they are rendered at different times, they'll be phase-shifted — this is intentional and gives a natural, non-robotic feel."],
          ['Reduced motion', 'When prefers-reduced-motion: reduce is detected, disable the animation and show only the static base colour. The skeleton is still useful — it reserves space without motion.'],
        ].map(([t, d]) => (
          <div key={t} style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{d}</div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Do / Don't ── */}
      <SectionAnchor id="usage" />
      <H2>Usage guidelines</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        <DoBox visual={<CardSkeleton C={C} animate={true} />}>
          Mirror the real layout as closely as possible — same number of lines, approximate widths, same component shape. The skeleton should feel like the content is almost ready.
        </DoBox>
        <DontBox visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
            {[1,2,3,4,5,6,7].map(i => <Bone key={i} C={C} width="100%" height={12} animate={true} />)}
          </div>
        }>
          Don't use all-equal-width lines of the same height. Uniform skeletons feel generic and don't help users anticipate the real layout.
        </DontBox>

        <DoBox visual={<ProfileSkeleton C={C} animate={true} />}>
          Use circles for avatars and icons — <Code>skeleton.radius.circle</Code> produces the correct fully-rounded shape. Match the real component's actual dimensions.
        </DoBox>
        <DontBox visual={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Bone C={C} width={40} height={40} radius={C.radiusBlock} animate={true} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Bone C={C} width="55%" height={12} animate={true} />
              <Bone C={C} width="35%" height={10} animate={true} />
            </div>
          </div>
        }>
          Don't use a square block where a circle avatar is expected. It signals the wrong shape and causes a jarring swap when real content loads.
        </DontBox>

        <DoBox visual={
          <div style={{ display: 'flex', gap: 16 }}>
            <TextSkeleton C={C} lines={3} animate={true} />
          </div>
        }>
          Show the skeleton for the full loading period, then swap in real content in one step. Avoid partially loading — e.g. showing text while the image is still loading.
        </DoBox>
        <DontBox visual={
          <div style={{ display: 'flex', gap: 16 }}>
            <Bone C={C} width="100%" height={12} animate={false} style={{ opacity: 0.3 }} />
          </div>
        }>
          Don't leave the skeleton visible indefinitely. Set a timeout (e.g. 10 s) after which you show an error state. A frozen skeleton with no feedback is worse than an explicit error.
        </DontBox>

      </div>

      <Rule />

      {/* ── When to use spinner vs skeleton ── */}
      <SectionAnchor id="comparison" />
      <H2>Spinner vs Skeleton</H2>
      <P>Both communicate loading — but their use cases are distinct:</P>

      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['', 'Spinner', 'Skeleton'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Load duration',        'Unknown / very short (< 1–2 s)',        'Any duration when layout is known'],
              ['Layout known?',        'No',                                    'Yes — bones mirror real content'],
              ['Blocks interaction?',  'Usually (modal/overlay)',               'No — layout is reserved, feels faster'],
              ['Perceived wait time',  'Higher — blank or blocked state',       'Lower — content feels imminent'],
              ['Best for',            'Form submit, file upload, background sync','Page load, list fetch, card load'],
            ].map(([label, spinner, skeleton], i) => (
              <tr key={label} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-subtle)' }}>
                <td style={{ padding: '9px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--stroke-primary)' }}>{label}</td>
                <td style={{ padding: '9px 14px', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{spinner}</td>
                <td style={{ padding: '9px 14px', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{skeleton}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Rule />

      {/* ── Accessibility ── */}
      <SectionAnchor id="a11y" />
      <H2>Accessibility</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          ['aria-busy', 'Add aria-busy="true" to the container wrapping the skeleton. When loading completes, set it to false. Screen readers announce the change, signalling that content is ready.'],
          ['aria-label', 'Provide aria-label="Loading…" (or a specific label like "Loading user list") on the skeleton container so screen readers announce something meaningful.'],
          ['aria-live', 'Wrap the loading region in aria-live="polite" so the "content ready" announcement doesn\'t interrupt the user\'s current reading position.'],
          ['Role', 'Use role="status" on the skeleton wrapper. This is a live region with an implicit aria-live="polite".'],
          ['Reduced motion', 'Respect prefers-reduced-motion: reduce. Disable the shimmer animation and show a static bone. The skeleton still reserves space and communicates loading without motion.'],
          ['Focus management', 'When the skeleton disappears and real content loads, move focus to the first interactive element in the newly loaded content so keyboard users are not left in a void.'],
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
      <H2>Token reference</H2>
      <P>All skeleton tokens live under the <Code>skeleton.*</Code> namespace and are resolved via <Code>getComponentTokens(themeId)</Code>.</P>

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

      <aside style={{
        width: 200,
        flexShrink: 0,
        position: 'sticky',
        top: 40,
        padding: '40px 16px',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-secondary)', marginBottom: 12 }}>On this page</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
          {TOC.map(([id, label]) => (
            <a key={id} href={`#${id}`}
               style={{
                 fontSize: 13,
                 color: activeSection === id ? C.brand : 'var(--text-secondary)',
                 fontWeight: activeSection === id ? 600 : 400,
                 textDecoration: 'none',
                 padding: '4px 8px',
                 borderLeft: activeSection === id ? `2px solid ${C.brand}` : '2px solid transparent',
                 transition: 'color .15s ease',
               }}>
              {label}
            </a>
          ))}
        </nav>
        <BrandThemeSwitcher />
      </aside>
    </div>
  )
}
