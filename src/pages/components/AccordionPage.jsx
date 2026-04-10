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
  const s = {
    info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', label: 'Note' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', label: 'Warning' },
  }[type]
  return <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: s.text, lineHeight: 1.65 }}><strong>{s.label}:</strong> {children}</div>
}
function DoBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && (
        <div style={{ padding: '20px 18px', background: 'var(--bg-primary)', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
          {visual}
        </div>
      )}
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
      {visual && (
        <div style={{ padding: '20px 18px', background: 'var(--bg-primary)', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
          {visual}
        </div>
      )}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

// Play-arrow triangle — rotates 90° when open (points down), 0° when closed (points right)
function PlayArrow({ open = false, size = 16, color = '#637381' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill={color}
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform .2s ease', flexShrink: 0 }}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

// ─── Accordion primitives ─────────────────────────────────────────────────────

const SIZE_PY = { sm: 8, md: 12, lg: 16 }
const HOVER_BG = '#f4f6f8'
const CONTENT_COLOR = '#454f5b'
const DIVIDER_COLOR = '#e0e5ea'

function AccordionItem({
  title,
  children,
  variant = 'default',   // 'default' | 'card'
  size = 'md',
  isOpen = false,
  onToggle,
  forceHover = false,    // for static state demos
}) {
  const [hovered, setHovered] = useState(false)
  const py = SIZE_PY[size] ?? 12
  const isHov = hovered || forceHover
  const bg = isHov ? HOVER_BG : 'var(--bg-primary)'

  const headerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', padding: `${py}px 20px`,
    background: bg, border: 'none', cursor: onToggle ? 'pointer' : 'default',
    textAlign: 'left', transition: 'background .15s',
    ...(variant === 'card' ? { borderRadius: isOpen ? '10px 10px 0 0' : 10 } : {}),
  }

  return (
    <div
      style={variant === 'card' ? {
        borderRadius: 10, border: `1px solid ${DIVIDER_COLOR}`, overflow: 'hidden',
        background: 'var(--bg-primary)',
      } : {}}
    >
      <button
        aria-expanded={isOpen}
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={headerStyle}
      >
        <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {title}
        </span>
        <PlayArrow open={isOpen} color={isOpen ? 'var(--brand-600, #07a2b6)' : '#637381'} />
      </button>

      {isOpen && (
        <div style={{ padding: `4px 20px ${py + 4}px`, fontSize: 13, color: CONTENT_COLOR, lineHeight: 1.7 }}>
          {children}
        </div>
      )}
    </div>
  )
}

function AccordionGroup({ items, variant = 'default', size = 'md', multi = false, defaultOpen = [0] }) {
  const [openSet, setOpenSet] = useState(new Set(defaultOpen))

  function toggle(i) {
    setOpenSet(prev => {
      const next = new Set(prev)
      if (next.has(i)) {
        next.delete(i)
      } else {
        if (!multi) next.clear()
        next.add(i)
      }
      return next
    })
  }

  return (
    <div style={
      variant === 'default'
        ? { border: `1px solid ${DIVIDER_COLOR}`, borderRadius: 10, overflow: 'hidden' }
        : { display: 'flex', flexDirection: 'column', gap: 8 }
    }>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <AccordionItem
            title={item.title}
            variant={variant}
            size={size}
            isOpen={openSet.has(i)}
            onToggle={() => toggle(i)}
          >
            {item.content}
          </AccordionItem>
          {/* Divider between items in default variant */}
          {variant === 'default' && i < items.length - 1 && (
            <div style={{ height: 1, background: DIVIDER_COLOR }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── Live demo ───────────────────────────────────────────────────────────────

const DEMO_ITEMS = [
  {
    title: 'What is a design system?',
    content: 'A design system is a collection of reusable components, tokens, and guidelines that teams use to build consistent digital products at scale.',
  },
  {
    title: 'When should I use an accordion?',
    content: 'Use an accordion when you need to present multiple sections of content in a compact space, allowing users to expand only what they need to read.',
  },
  {
    title: 'Can accordion items be nested?',
    content: 'Avoid nesting accordions inside other accordions — it creates a confusing information hierarchy. Consider a different layout instead.',
  },
  {
    title: 'How many items should an accordion have?',
    content: 'Aim for 3–7 items. Too few items may not justify the extra interaction cost; too many can overwhelm and make content hard to locate.',
  },
]

function AccordionLive() {
  const [variant, setVariant] = useState('default')
  const [size,    setSize]    = useState('md')
  const [multi,   setMulti]   = useState(false)
  const [count,   setCount]   = useState(3)
  // Reset open state when controls change
  const [key, setKey] = useState(0)

  function change(fn) { fn(); setKey(k => k + 1) }

  const btnBase = (active) => ({
    padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
    border: '1px solid',
    borderColor: active ? '#07a2b6' : 'var(--stroke-primary)',
    background:  active ? '#07a2b618' : 'var(--bg-primary)',
    color:       active ? '#07a2b6'   : 'var(--text-secondary)',
  })

  return (
    <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
      {/* Preview */}
      <div style={{ padding: '28px 24px', background: 'var(--bg-primary)' }}>
        <AccordionGroup
          key={`${variant}-${size}-${multi}-${count}-${key}`}
          items={DEMO_ITEMS.slice(0, count)}
          variant={variant}
          size={size}
          multi={multi}
          defaultOpen={[0]}
        />
      </div>

      {/* Controls */}
      <div style={{ padding: '14px 20px', display: 'flex', flexWrap: 'wrap', gap: 20, borderTop: '1px solid var(--stroke-primary)' }}>
        {/* Variant */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Variant</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['default', 'card'].map(v => (
              <button key={v} style={btnBase(variant === v)} onClick={() => change(() => setVariant(v))}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Size</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[['sm', 'S'], ['md', 'M'], ['lg', 'L']].map(([v, label]) => (
              <button key={v} style={btnBase(size === v)} onClick={() => change(() => setSize(v))}>{label}</button>
            ))}
          </div>
        </div>

        {/* Multi-expand */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Multi-expand</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[['Off', false], ['On', true]].map(([label, val]) => (
              <button key={label} style={btnBase(multi === val)} onClick={() => change(() => setMulti(val))}>{label}</button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Items</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[2, 3, 4].map(n => (
              <button key={n} style={{ ...btnBase(count === n), width: 32 }} onClick={() => change(() => setCount(n))}>{n}</button>
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
  { id: 'states',    label: 'States'        },
  { id: 'variants',  label: 'Variants'      },
  { id: 'sizes',     label: 'Sizes'         },
  { id: 'usage',     label: 'Usage rules'   },
  { id: 'usecase',   label: 'Use case'      },
  { id: 'a11y',      label: 'Accessibility' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AccordionPage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

  // Accordion has no brand tokens — theme switcher kept for page consistency
  const t = getComponentTokens(activeTheme)

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

  // Static demo helpers
  const sampleItems = DEMO_ITEMS.slice(0, 3)

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Navigation</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Accordion</h1>
          <Lead>
            A <strong>vertically stacked list of collapsible sections</strong>. Each section has a trigger header and a content panel that expands or collapses on click — ideal for progressively disclosing information in constrained spaces.
          </Lead>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', paddingTop: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>Preview theme:</span>
            {VISIBLE_THEMES.map(th => (
              <button key={th.id} onClick={() => setActiveTheme(th.id)} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '2px solid',
                borderColor: activeTheme === th.id ? th.color : 'var(--stroke-primary)',
                background:  activeTheme === th.id ? th.color + '18' : 'transparent',
                color:       activeTheme === th.id ? th.color : 'var(--text-secondary)',
              }}>{th.label}</button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW ──────────────────────────────────────────────────────── */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <AccordionLive />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 10 }}>When to use</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              <li>To show multiple collapsible sections in a compact vertical space</li>
              <li>For FAQs, settings panels, filter groups, or help content</li>
              <li>When most users need only a subset of the available sections</li>
              <li>To reduce initial page length without hiding critical content</li>
            </ul>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 10 }}>When not to use</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              <li>When all content needs to be read — use a normal page layout</li>
              <li>For sequential steps — use a <strong>Stepper</strong> instead</li>
              <li>When only 1 or 2 sections exist — the extra interaction isn't worth it</li>
              <li>For primary navigation — use <strong>Tabs</strong> or a <strong>Side panel</strong></li>
            </ul>
          </div>
        </div>

        <Divider />

        {/* ── ANATOMY ───────────────────────────────────────────────────────── */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <P>An accordion is composed of one or more items, each with a trigger header and a collapsible content panel. The first item below is expanded to show all parts.</P>

        <div style={{ position: 'relative', background: 'var(--bg-secondary)', borderRadius: 12, padding: '32px 24px 40px' }}>
          {/* Annotated accordion — first item open */}
          <div style={{ border: `1px solid ${DIVIDER_COLOR}`, borderRadius: 10, overflow: 'hidden', maxWidth: 520, margin: '0 auto' }}>
            {/* Item 1 — open */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'var(--bg-primary)' }}>
                <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-primary)' }}>What is a design system?</span>
                <PlayArrow open={true} color='#07a2b6' />
              </div>
              <div style={{ padding: '4px 20px 16px', fontSize: 13, color: CONTENT_COLOR, lineHeight: 1.7, background: 'var(--bg-primary)' }}>
                A collection of reusable components, tokens, and guidelines for building consistent digital products.
              </div>
            </div>
            <div style={{ height: 1, background: DIVIDER_COLOR }} />
            {/* Item 2 — closed */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'var(--bg-primary)' }}>
              <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-primary)' }}>When should I use an accordion?</span>
              <PlayArrow open={false} color='#637381' />
            </div>
          </div>

          {/* Callout labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 24 }}>
            {[
              { n: 1, label: 'Trigger header',  desc: 'Full-width button; hover changes background.' },
              { n: 2, label: 'Label',            desc: 'The section title. Regular weight, primary text.' },
              { n: 3, label: 'Expand icon',      desc: 'Rotates 90° on expand. Brand colour when open.' },
              { n: 4, label: 'Content panel',    desc: 'Revealed when open. Light text, comfortable line-height.' },
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

        {/* ── STATES ────────────────────────────────────────────────────────── */}
        <SectionAnchor id="states" />
        <H2>States</H2>
        <P>Each accordion trigger has three interactive states. The content panel is shown only in the expanded state.</P>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {/* Collapsed */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
            <div style={{ padding: '20px 16px', background: 'var(--bg-primary)' }}>
              <div style={{ border: `1px solid ${DIVIDER_COLOR}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--bg-primary)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Section title</span>
                  <PlayArrow open={false} color='#637381' />
                </div>
              </div>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 3 }}>Collapsed</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>Default resting state. Content panel is hidden.</div>
            </div>
          </div>

          {/* Hover */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
            <div style={{ padding: '20px 16px', background: 'var(--bg-primary)' }}>
              <div style={{ border: `1px solid ${DIVIDER_COLOR}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: HOVER_BG }}>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Section title</span>
                  <PlayArrow open={false} color='#637381' />
                </div>
              </div>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 3 }}>Hover</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>Background shifts to <Code>#f4f6f8</Code> on mouse-over.</div>
            </div>
          </div>

          {/* Expanded */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
            <div style={{ padding: '20px 16px', background: 'var(--bg-primary)' }}>
              <div style={{ border: `1px solid ${DIVIDER_COLOR}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--bg-primary)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Section title</span>
                  <PlayArrow open={true} color='#07a2b6' />
                </div>
                <div style={{ padding: '4px 16px 12px', fontSize: 12, color: CONTENT_COLOR, lineHeight: 1.65 }}>
                  The content panel is visible. Text is light-weight and muted.
                </div>
              </div>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)', marginBottom: 3 }}>Expanded</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>Panel revealed. Icon rotates 90° and turns brand colour.</div>
            </div>
          </div>
        </div>

        <Divider />

        {/* ── VARIANTS ──────────────────────────────────────────────────────── */}
        <SectionAnchor id="variants" />
        <H2>Variants</H2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Default */}
          <div>
            <H3>Default</H3>
            <P>All items share a single bordered container. Thin divider lines separate sections. Use for inline page content or FAQ lists.</P>
            <AccordionGroup items={sampleItems} variant="default" defaultOpen={[0]} />
          </div>

          {/* Card */}
          <div>
            <H3>Card</H3>
            <P>Each item is an independent rounded card with its own border. Use in sidebars, panels, or wherever vertical spacing is generous.</P>
            <AccordionGroup items={sampleItems} variant="card" defaultOpen={[0]} />
          </div>
        </div>

        <Divider />

        {/* ── SIZES ─────────────────────────────────────────────────────────── */}
        <SectionAnchor id="sizes" />
        <H2>Sizes</H2>
        <P>Three sizes control the vertical padding of the trigger header. Choose based on the density of the surrounding layout.</P>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { size: 'sm', label: 'Small', py: 8,  note: 'Dense UIs, filter panels, sidebar navigation' },
            { size: 'md', label: 'Medium', py: 12, note: 'Default — suitable for most contexts' },
            { size: 'lg', label: 'Large', py: 16,  note: 'Marketing pages, generous whitespace layouts' },
          ].map(({ size, label, py, note }) => (
            <div key={size} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 200px', gap: 16, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>py: {py}px</div>
              </div>
              <div style={{ border: `1px solid ${DIVIDER_COLOR}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${py}px 20px`, background: 'var(--bg-primary)' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Section title</span>
                  <PlayArrow open={false} color='#637381' />
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>{note}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ── USAGE ─────────────────────────────────────────────────────────── */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DoBox
            visual={
              <div style={{ width: '100%', maxWidth: 340 }}>
                <AccordionGroup
                  items={[
                    { title: 'Billing', content: 'Manage your subscription, payment methods and invoices.' },
                    { title: 'Security', content: 'Set up two-factor authentication and manage sessions.' },
                    { title: 'Notifications', content: 'Choose which events trigger email or push notifications.' },
                  ]}
                  variant="default"
                  defaultOpen={[]}
                />
              </div>
            }
          >
            Write short, descriptive trigger labels (1–4 words). Users should know what to expect before expanding.
          </DoBox>

          <DontBox
            visual={
              <div style={{ width: '100%', maxWidth: 340 }}>
                <AccordionGroup
                  items={[
                    { title: 'Click here to find out more about our billing options and subscription plans', content: 'Content here.' },
                    { title: 'Read this section carefully for important security information', content: 'Content here.' },
                  ]}
                  variant="default"
                  defaultOpen={[]}
                />
              </div>
            }
          >
            Don't write long, sentence-style trigger labels. They wrap awkwardly and slow the user down.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <DoBox>
            Use the single-expand (exclusive) mode by default. This keeps the visual footprint predictable and helps users understand the hierarchy.
          </DoBox>
          <DontBox>
            Don't nest an accordion inside another accordion. It creates confusing layered disclosure — restructure the content instead.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <DoBox>
            Keep all panels roughly the same depth. Wildly different content lengths between panels create jarring layout shifts.
          </DoBox>
          <DontBox>
            Don't use accordions to hide content that all users need to read. Use a regular page layout so nothing is missed.
          </DontBox>
        </div>

        <Divider />

        {/* ── USE CASE ──────────────────────────────────────────────────────── */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <P>Accordions are frequently used in filter sidebars to organise large sets of filter options into labelled, collapsible groups — keeping the panel compact until the user needs a specific group.</P>

        {/* Filter sidebar mockup */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0, border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', maxWidth: 720 }}>
          {/* Sidebar */}
          <div style={{ borderRight: '1px solid var(--stroke-primary)', background: 'var(--bg-primary)', padding: '16px 0' }}>
            <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Filters</span>
              <button style={{ fontSize: 11, color: '#07a2b6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Clear all</button>
            </div>
            <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Filter groups as accordion */}
              {[
                {
                  title: 'Component Filters',
                  content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
                      {['Button', 'Modal', 'Table', 'Form'].map(name => (
                        <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          <input type="checkbox" defaultChecked={name === 'Button'} style={{ accentColor: '#07a2b6' }} />
                          {name}
                        </label>
                      ))}
                    </div>
                  ),
                },
                {
                  title: 'Functional Tree Filters',
                  content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
                      {['Frontend', 'Backend', 'Design', 'DevOps'].map(name => (
                        <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          <input type="checkbox" style={{ accentColor: '#07a2b6' }} />
                          {name}
                        </label>
                      ))}
                    </div>
                  ),
                },
                {
                  title: 'Working Lists',
                  content: (
                    <div style={{ paddingBottom: 8, fontSize: 12, color: 'var(--text-tertiary)' }}>No working lists available.</div>
                  ),
                },
              ].map((item, i, arr) => (
                <React.Fragment key={i}>
                  <AccordionItem
                    title={item.title}
                    variant="default"
                    size="sm"
                    isOpen={i === 0}
                    onToggle={() => {}}
                  >
                    {item.content}
                  </AccordionItem>
                  {i < arr.length - 1 && <div style={{ height: 1, background: DIVIDER_COLOR, margin: '0 4px' }} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Main content area placeholder */}
          <div style={{ background: 'var(--bg-secondary)', padding: '20px 24px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Components</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['Button', 'Modal', 'Table', 'Form', 'Tag', 'Tooltip'].map(name => (
                <div key={name} style={{ background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--stroke-primary)', padding: '10px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>
                  {name}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-tertiary)' }}>6 components · filtered by: Button</div>
          </div>
        </div>

        <Divider />

        {/* ── ACCESSIBILITY ─────────────────────────────────────────────────── */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <P>The accordion implements the <strong>WAI-ARIA Accordion pattern</strong> for full keyboard and screen-reader support.</P>

        <div style={{ borderRadius: 8, border: '1px solid var(--stroke-primary)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', padding: '8px 14px' }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Attribute / Key</span>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Behaviour</span>
          </div>
          {[
            { key: 'role="button" / <button>',  val: 'Each trigger is a native button — keyboard focusable and activatable with Enter or Space.' },
            { key: 'aria-expanded',             val: '"true" on the trigger when its panel is open; "false" when closed.' },
            { key: 'aria-controls',             val: 'Each trigger references its content panel by ID.' },
            { key: 'aria-labelledby',           val: 'Each panel references its trigger by ID so screen readers announce the section name.' },
            { key: 'Enter / Space',             val: 'Toggle the focused accordion item open or closed.' },
            { key: 'Tab / Shift+Tab',           val: 'Move focus between accordion triggers and other interactive elements on the page.' },
            { key: 'Home / End',                val: 'Move focus to the first or last accordion trigger in the group.' },
            { key: 'hidden / display:none',     val: 'Collapsed panels must be completely hidden from the accessibility tree — not just visually.' },
          ].map(({ key, val }, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '9px 14px', borderBottom: i < 7 ? '1px solid var(--stroke-primary)' : 'none', alignItems: 'start' }}>
              <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{key}</code>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{val}</span>
            </div>
          ))}
        </div>

        <InfoBox type="info" style={{ marginTop: 20 }}>
          If accordion triggers contain only an icon (no visible text), provide an <Code>aria-label</Code> describing the action, e.g. <Code>aria-label="Expand Billing section"</Code>.
        </InfoBox>

      </div>

      {/* ── TOC sidebar ───────────────────────────────────────────────────── */}
      <div style={{ width: 200, flexShrink: 0, position: 'sticky', top: 80, padding: '48px 24px 48px 0', alignSelf: 'flex-start' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-tertiary)', marginBottom: 12 }}>On this page</div>
        {TOC.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={e => {
              e.preventDefault()
              const el = document.getElementById(item.id)
              const main = document.querySelector('main')
              if (el && main) main.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' })
            }}
            style={{
              display: 'block', padding: '5px 10px', fontSize: 13, borderRadius: 5, textDecoration: 'none', marginBottom: 2,
              color:      activeSection === item.id ? 'var(--brand-600)' : 'var(--text-secondary)',
              background: activeSection === item.id ? 'var(--bg-secondary)' : 'transparent',
              fontWeight: activeSection === item.id ? 600 : 400,
              borderLeft: activeSection === item.id ? '2px solid var(--brand-600)' : '2px solid transparent',
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

    </div>
  )
}
