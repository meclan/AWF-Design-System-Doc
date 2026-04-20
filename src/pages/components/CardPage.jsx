import React, { useState } from 'react'
import { THEMES, getComponentTokens } from '../../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

// ─── Shadow map ───────────────────────────────────────────────────────────────
const SHADOWS = {
  Z1: '0px 1px 4px rgba(171,190,209,0.3)',
  Z2: '0px 4px 8px rgba(171,190,209,0.4)',
  Z3: '0px 8px 20px rgba(171,190,209,0.5)',
  Z4: '0px 16px 32px rgba(171,190,209,0.6)',
  none: 'none',
}

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
      {visual && <div style={{ padding: '20px 18px', background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '20px 18px', background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>{visual}</div>}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Color extractor ──────────────────────────────────────────────────────────

function getCardColors(t) {
  const brandMid = t['tabs.indicator'] || '#07a2b6'
  return {
    brandMid,
    // Style tokens
    ghost:    { bg: 'transparent', stroke: 'transparent', shadow: SHADOWS.none,  radius: 12 },
    outlined: { bg: t['card.style.outlined.bg'] || '#ffffff', stroke: t['card.style.outlined.stroke'] || '#dfe3e8', shadow: SHADOWS.none, radius: 12 },
    raised:   { bg: t['card.style.raised.bg']   || '#ffffff', stroke: 'transparent', shadow: SHADOWS.Z2, radius: 12 },
    clickable:{ bg: t['card.style.clickable.bg'] || '#ffffff', stroke: 'transparent', shadow: SHADOWS.Z2, shadowHover: SHADOWS.Z3, radius: 12 },
    // Structure tokens
    headerTitle:    t['card.structure.header.title']    || 'var(--text-primary)',
    headerSubtitle: t['card.structure.header.subtitle'] || 'var(--text-tertiary)',
    divider:        t['card.divider']                   || '#dfe3e8',
    // Content padding values
    paddingSm: 12,
    paddingMd: 24,
    paddingLg: 32,
    paddingNone: 0,
  }
}

// ─── Card primitive components ────────────────────────────────────────────────

function CardShell({ style = 'outlined', C, children, clickable = false, width, minHeight }) {
  const [hovered, setHovered] = useState(false)
  const s = C[style] || C.outlined
  const shadow = (clickable && hovered) ? (s.shadowHover || SHADOWS.Z3) : s.shadow
  const transform = clickable && hovered ? 'translateY(-2px)' : 'none'

  return (
    <div
      onMouseEnter={() => clickable && setHovered(true)}
      onMouseLeave={() => clickable && setHovered(false)}
      style={{
        background: s.bg,
        border: s.stroke !== 'transparent' ? `1px solid ${s.stroke}` : 'none',
        borderRadius: s.radius,
        boxShadow: shadow,
        cursor: clickable ? 'pointer' : 'default',
        transition: 'box-shadow .2s, transform .2s',
        transform,
        overflow: 'hidden',
        width,
        minHeight,
      }}
    >
      {children}
    </div>
  )
}

function CardHeader({ title, subtitle, action, C, padX = 24, padY = 20 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: `${padY}px ${padX}px`, gap: 12 }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 400, color: C.headerTitle, fontFamily: 'Poppins, sans-serif', lineHeight: 1.4 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: C.headerSubtitle, marginTop: 3, lineHeight: 1.5 }}>{subtitle}</div>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}

function CardDivider({ C }) {
  return <div style={{ height: 1, background: C.divider, flexShrink: 0 }} />
}

function CardContent({ children, padding = 24 }) {
  return <div style={{ padding }}>{children}</div>
}

function CardFooter({ children, C, padX = 24, padY = 16 }) {
  return (
    <>
      <CardDivider C={C} />
      <div style={{ padding: `${padY}px ${padX}px`, display: 'flex', alignItems: 'center', gap: 8 }}>
        {children}
      </div>
    </>
  )
}

// ─── Demo placeholder bits ────────────────────────────────────────────────────

function SkeletonLine({ w = '100%', h = 10, mb = 0 }) {
  return <div style={{ width: w, height: h, borderRadius: 4, background: 'var(--bg-secondary)', marginBottom: mb }} />
}

function DemoBtn({ primary, C, children, small }) {
  const fs = small ? 12 : 13
  const px = small ? 10 : 14
  const py = small ? 5 : 7
  return (
    <button style={{
      padding: `${py}px ${px}px`, borderRadius: 6, fontSize: fs, fontWeight: 500, cursor: 'pointer',
      border: primary ? 'none' : `1px solid var(--stroke-primary)`,
      background: primary ? (C.brandMid) : 'var(--bg-primary)',
      color: primary ? '#fff' : 'var(--text-secondary)',
    }}>
      {children}
    </button>
  )
}

// ─── Live demo ────────────────────────────────────────────────────────────────

const STYLE_OPTIONS = [
  { id: 'ghost',    label: 'Ghost' },
  { id: 'outlined', label: 'Outlined' },
  { id: 'raised',   label: 'Raised' },
  { id: 'clickable',label: 'Clickable' },
]

function LiveDemo({ C }) {
  const [styleId, setStyleId] = useState('outlined')

  const btnBase = (active) => ({
    padding: '5px 11px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer',
    border: `1px solid ${active ? C.brandMid : 'var(--stroke-primary)'}`,
    background: active ? C.brandMid : 'var(--bg-primary)',
    color: active ? '#fff' : 'var(--text-secondary)',
  })

  const descriptions = {
    ghost:    'No background, no border, no shadow. Use inside already-elevated surfaces.',
    outlined: 'White background with a 1px border. Default style for most content groupings.',
    raised:   'White background with a Z2 drop shadow. Creates visual depth without a border.',
    clickable:'Raised card that lifts to Z3 on hover. Use when the entire card is interactive.',
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Style</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {STYLE_OPTIONS.map(s => (
              <button key={s.id} onClick={() => setStyleId(s.id)} style={btnBase(styleId === s.id)}>{s.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '40px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 340 }}>
          <CardShell style={styleId} C={C} clickable={styleId === 'clickable'}>
            <CardHeader
              title="Analytics Overview"
              subtitle="Last 30 days"
              action={<DemoBtn C={C} small>Export</DemoBtn>}
              C={C}
            />
            <CardDivider C={C} />
            <CardContent padding={24}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[['Visits', '12,485'], ['Signups', '1,230'], ['Revenue', '$48K']].map(([label, val]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{val}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
              <SkeletonLine h={8} mb={6} />
              <SkeletonLine w="70%" h={8} />
            </CardContent>
            <CardFooter C={C}>
              <DemoBtn C={C} primary>View report</DemoBtn>
              <DemoBtn C={C}>Share</DemoBtn>
            </CardFooter>
          </CardShell>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 12, textAlign: 'center', fontStyle: 'italic' }}>
        {descriptions[styleId]}
      </p>
    </div>
  )
}

// ─── Anatomy diagram ──────────────────────────────────────────────────────────

function AnatomyDiagram({ C }) {
  const badge = (n) => (
    <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</span>
  )
  const callout = (n, title, desc) => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      {badge(n)}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Card diagram */}
      <div style={{ flex: '0 0 280px', position: 'relative' }}>
        <div style={{ border: `1px solid ${C.outlined.stroke}`, borderRadius: 12, overflow: 'visible', background: C.outlined.bg }}>
          {/* ① Container */}
          <div style={{ position: 'absolute', top: -10, right: -28 }}>{badge(1)}</div>

          {/* ② Header */}
          <div style={{ padding: '18px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 4, left: -28 }}>{badge(2)}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.headerTitle, fontFamily: 'Poppins, sans-serif' }}>Card title</div>
              <div style={{ fontSize: 11, color: C.headerSubtitle, marginTop: 2 }}>Subtitle text</div>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid var(--stroke-primary)', fontSize: 11, color: 'var(--text-secondary)', background: 'var(--bg-primary)' }}>Action</div>
          </div>

          {/* ③ Divider */}
          <div style={{ height: 1, background: C.divider, position: 'relative' }}>
            <div style={{ position: 'absolute', left: -28, top: -10 }}>{badge(3)}</div>
          </div>

          {/* ④ Content area */}
          <div style={{ padding: '16px 20px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -28, top: 8 }}>{badge(4)}</div>
            <SkeletonLine h={8} mb={8} />
            <SkeletonLine w="80%" h={8} mb={8} />
            <SkeletonLine w="60%" h={8} />
          </div>

          {/* ③ Footer divider */}
          <div style={{ height: 1, background: C.divider }} />

          {/* ⑤ Footer */}
          <div style={{ padding: '12px 20px', display: 'flex', gap: 8, position: 'relative' }}>
            <div style={{ position: 'absolute', left: -28, top: 8 }}>{badge(5)}</div>
            <div style={{ padding: '5px 12px', borderRadius: 5, background: C.brandMid, fontSize: 11, color: '#fff', fontWeight: 500 }}>Primary</div>
            <div style={{ padding: '5px 12px', borderRadius: 5, border: '1px solid var(--stroke-primary)', fontSize: 11, color: 'var(--text-secondary)' }}>Secondary</div>
          </div>
        </div>
      </div>

      {/* Callouts */}
      <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {callout(1, 'Container', 'The outer surface. Style (ghost, outlined, raised, clickable) controls background, border, and shadow.')}
        {callout(2, 'Header', 'Title + optional subtitle and action slot. Padding: 24px horizontal, 20px vertical.')}
        {callout(3, 'Divider', 'Thin 1px separator between header, content, and footer sections. Color: card.divider.')}
        {callout(4, 'Content area', 'The main body. Accepts any content. Padding size controlled by the consumer (sm/md/lg or none).')}
        {callout(5, 'Footer', 'Optional action row at the bottom. Typically holds primary + secondary buttons.')}
      </div>
    </div>
  )
}

// ─── Styles grid ──────────────────────────────────────────────────────────────

function StyleCard({ styleId, label, desc, C }) {
  const [hov, setHov] = useState(false)
  const s = C[styleId] || C.outlined
  const shadow = (styleId === 'clickable' && hov) ? (s.shadowHover || SHADOWS.Z3) : s.shadow
  const transform = styleId === 'clickable' && hov ? 'translateY(-2px)' : 'none'

  return (
    <div style={{ flex: '1 1 180px', minWidth: 0 }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: s.bg, border: s.stroke !== 'transparent' ? `1px solid ${s.stroke}` : '1px solid transparent',
          borderRadius: s.radius, boxShadow: shadow, cursor: styleId === 'clickable' ? 'pointer' : 'default',
          transition: 'box-shadow .2s, transform .2s', transform,
          padding: '16px',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
          {label}
        </div>
        <SkeletonLine h={7} mb={5} />
        <SkeletonLine w="75%" h={7} mb={5} />
        <SkeletonLine w="55%" h={7} />
      </div>
      <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, marginTop: 3 }}>{desc}</div>
    </div>
  )
}

// ─── Structure section ────────────────────────────────────────────────────────

function StructureDemo({ C }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Header only */}
      <div>
        <H3>Header</H3>
        <P>Combines a title, optional subtitle, and optional action slot. All three are independent.</P>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 20 }}>
          <CardShell style="outlined" C={C}>
            <CardHeader title="Card title" subtitle="Optional subtitle" action={<DemoBtn C={C} small>Action</DemoBtn>} C={C} />
          </CardShell>
          <div style={{ marginTop: 12 }}>
            <CardShell style="outlined" C={C}>
              <CardHeader title="Title only" C={C} />
            </CardShell>
          </div>
          <div style={{ marginTop: 12 }}>
            <CardShell style="outlined" C={C}>
              <CardHeader title="With action" action={<DemoBtn C={C} small primary>New</DemoBtn>} C={C} />
            </CardShell>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div>
        <H3>Divider</H3>
        <P>Separates card sections. Use between header and content, or between content and footer.</P>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 20 }}>
          <CardShell style="outlined" C={C}>
            <CardHeader title="Section A" C={C} />
            <CardDivider C={C} />
            <CardContent padding={20}>
              <SkeletonLine h={8} mb={6} />
              <SkeletonLine w="70%" h={8} />
            </CardContent>
            <CardDivider C={C} />
            <CardHeader title="Section B" C={C} />
          </CardShell>
        </div>
      </div>

      {/* Content padding */}
      <div>
        <H3>Content padding</H3>
        <P>Choose from 4 padding sizes to match your content density.</P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'None (0px)',  pad: 0,   token: 'card.structure.content.no-padding' },
            { label: 'Small (12px)', pad: 12, token: 'card.structure.content.padding-sm' },
            { label: 'Medium (24px)', pad: 24,token: 'card.structure.content.padding-md' },
            { label: 'Large (32px)', pad: 32, token: 'card.structure.content.padding-lg' },
          ].map(({ label, pad, token }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, border: `1px solid ${C.outlined.stroke}`, borderRadius: 8 }}>
                <div style={{ padding: pad, background: pad === 0 ? 'var(--bg-secondary)' : 'transparent', minHeight: pad === 0 ? 28 : 0 }}>
                  {pad > 0 && <SkeletonLine h={7} />}
                </div>
              </div>
              <div style={{ flexShrink: 0, minWidth: 200 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--brand-600)' }}>{token}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div>
        <H3>Footer</H3>
        <P>Optional action row at the card bottom. Separated from content by a divider.</P>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 20 }}>
          <CardShell style="outlined" C={C}>
            <CardHeader title="With footer" C={C} />
            <CardDivider C={C} />
            <CardContent padding={20}>
              <SkeletonLine h={8} mb={6} />
              <SkeletonLine w="60%" h={8} />
            </CardContent>
            <CardFooter C={C}>
              <DemoBtn C={C} primary>Confirm</DemoBtn>
              <DemoBtn C={C}>Cancel</DemoBtn>
            </CardFooter>
          </CardShell>
        </div>
      </div>
    </div>
  )
}

// ─── Composition examples ─────────────────────────────────────────────────────

function CompositionExamples({ C }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>

      {/* Stat card */}
      <div>
        <H3>Stat card</H3>
        <CardShell style="raised" C={C}>
          <CardContent padding={20}>
            <div style={{ fontSize: 11, color: C.headerSubtitle, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Revenue MTD</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 8 }}>$48,200</div>
            <div style={{ fontSize: 12, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>↑ 12.4%</span>
              <span style={{ color: 'var(--text-tertiary)' }}>vs last month</span>
            </div>
          </CardContent>
        </CardShell>
      </div>

      {/* List card */}
      <div>
        <H3>List card</H3>
        <CardShell style="outlined" C={C}>
          <CardHeader title="Recent activity" C={C} />
          <CardDivider C={C} />
          <div>
            {['User signup', 'Export generated', 'Settings updated'].map((item, i) => (
              <div key={item} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < 2 ? `1px solid ${C.divider}` : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-secondary)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{item}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{['2 min ago', '1h ago', '3h ago'][i]}</div>
                </div>
              </div>
            ))}
          </div>
        </CardShell>
      </div>

      {/* Clickable card */}
      <div>
        <H3>Clickable card</H3>
        <CardShell style="clickable" C={C} clickable>
          <CardContent padding={20}>
            <div style={{ width: '100%', height: 80, background: 'var(--bg-secondary)', borderRadius: 8, marginBottom: 12 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Report Q4 2025</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>Annual financial summary and key metrics overview.</div>
            <span style={{ fontSize: 11, color: C.brandMid, fontWeight: 500 }}>Read more →</span>
          </CardContent>
        </CardShell>
      </div>

    </div>
  )
}

// ─── Token reference ──────────────────────────────────────────────────────────

function TokenTable({ rows }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: 'var(--bg-secondary)' }}>
            {['Token', 'Value', 'Usage'].map(h => (
              <th key={h} style={{ padding: '7px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, value, usage]) => (
            <tr key={name}>
              <td style={{ padding: '7px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--brand-600)', borderBottom: '1px solid var(--stroke-primary)' }}>{name}</td>
              <td style={{ padding: '7px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{value}</td>
              <td style={{ padding: '7px 12px', fontSize: 11, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CardPage() {
  const [themeId, setThemeId] = useState(VISIBLE_THEMES[0].id)
  const t   = VISIBLE_THEMES.find(x => x.id === themeId) || VISIBLE_THEMES[0]
  const tokens = getComponentTokens(t.id)
  const C  = getCardColors(tokens)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 32px 96px', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Layout & Overlay</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: 0 }}>Card</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Theme:</span>
          {VISIBLE_THEMES.map(th => (
            <button
              key={th.id}
              onClick={() => setThemeId(th.id)}
              style={{
                width: 20, height: 20, borderRadius: '50%', border: `2px solid ${th.id === themeId ? th.color : 'transparent'}`,
                background: th.color, cursor: 'pointer', padding: 0, outline: 'none',
                boxShadow: th.id === themeId ? `0 0 0 2px white, 0 0 0 4px ${th.color}` : 'none',
              }}
            />
          ))}
        </div>
      </div>
      <Lead>
        Card is a surface container that groups related content and actions. It provides visual structure through background, border, or elevation — without prescribing what goes inside. Cards support 4 styles and a composable structure: header, divider, content, and footer.
      </Lead>

      {/* ── Overview ────────────────────────────────────────────────────── */}
      <SectionAnchor id="overview" />
      <H2>Overview</H2>
      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
        <div style={{ padding: '28px 28px' }}>
          <LiveDemo C={C} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div>
          <H3>When to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2.1 }}>
            <li>Grouping related content that belongs together (metrics, form sections, list items)</li>
            <li>Creating visual separation between independent data sets</li>
            <li>Navigational surfaces where an entire area should be clickable</li>
            <li>Dashboard widgets or summary panels</li>
          </ul>
        </div>
        <div>
          <H3>When not to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2.1 }}>
            <li>Don't nest cards more than one level deep — use a divider instead</li>
            <li>Don't use a card if the content is a form page (use a page layout)</li>
            <li>Don't use ghost style on white backgrounds — it will be invisible</li>
            <li>Don't mix card styles on the same grid without a clear reason</li>
          </ul>
        </div>
      </div>

      <Divider />

      {/* ── Anatomy ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>
      <P>A card is composed of up to four sections, all optional. Mix and match to fit your content.</P>
      <AnatomyDiagram C={C} />

      <Divider />

      {/* ── Styles ──────────────────────────────────────────────────────── */}
      <SectionAnchor id="styles" />
      <H2>Styles</H2>
      <P>Four visual styles control the card's surface treatment. All share the same structure tokens — only the container appearance differs.</P>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <StyleCard styleId="ghost"     label="Ghost"     desc="No background, border, or shadow. Use inside elevated surfaces." C={C} />
          <StyleCard styleId="outlined"  label="Outlined"  desc="White background + 1px border. The default style for content cards." C={C} />
          <StyleCard styleId="raised"    label="Raised"    desc="White background + Z2 drop shadow. Elevates without a border." C={C} />
          <StyleCard styleId="clickable" label="Clickable" desc="Raised card that lifts to Z3 on hover. For fully clickable areas." C={C} />
        </div>
      </div>

      <InfoBox>
        The ghost style is transparent — it only makes sense inside a surface that already has visual depth (e.g., a raised card or a page section with a background color).
      </InfoBox>

      <Divider />

      {/* ── Structure ───────────────────────────────────────────────────── */}
      <SectionAnchor id="structure" />
      <H2>Structure</H2>
      <P>Cards are composable. Each sub-component (header, divider, content, footer) is independent and can be used in any combination.</P>
      <StructureDemo C={C} />

      <Divider />

      {/* ── Composition ─────────────────────────────────────────────────── */}
      <SectionAnchor id="composition" />
      <H2>Composition examples</H2>
      <P>Common patterns built from the card primitives. Hover the clickable card to see the elevation change.</P>
      <CompositionExamples C={C} />

      <Divider />

      {/* ── Do/Don't ────────────────────────────────────────────────────── */}
      <SectionAnchor id="guidance" />
      <H2>Guidance</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox visual={
          <div style={{ display: 'flex', gap: 12 }}>
            {['outlined','outlined','outlined'].map((s, i) => (
              <div key={i} style={{ flex: 1, border: `1px solid ${C.outlined.stroke}`, borderRadius: 8, padding: '10px', background: C.outlined.bg }}>
                <SkeletonLine h={6} mb={6} />
                <SkeletonLine w="70%" h={6} />
              </div>
            ))}
          </div>
        }>
          Use the same card style consistently within a grid or list.
        </DoBox>
        <DontBox visual={
          <div style={{ display: 'flex', gap: 12 }}>
            {[C.outlined, C.raised, C.ghost].map((s, i) => (
              <div key={i} style={{ flex: 1, border: i === 0 ? `1px solid ${s.stroke}` : 'none', borderRadius: 8, padding: '10px', background: s.bg, boxShadow: i === 1 ? SHADOWS.Z2 : 'none' }}>
                <SkeletonLine h={6} mb={6} />
                <SkeletonLine w="70%" h={6} />
              </div>
            ))}
          </div>
        }>
          Don't mix card styles arbitrarily — it creates inconsistent visual hierarchy.
        </DontBox>
        <DoBox visual={
          <div style={{ border: `1px solid ${C.outlined.stroke}`, borderRadius: 10, background: C.outlined.bg, padding: '12px 16px', width: 200 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>User profile</div>
            <SkeletonLine h={6} mb={5} />
            <SkeletonLine w="60%" h={6} />
          </div>
        }>
          Group content that is semantically related and belongs together.
        </DoBox>
        <DontBox visual={
          <div style={{ border: `1px solid ${C.outlined.stroke}`, borderRadius: 10, background: C.outlined.bg, padding: '12px 16px', width: 200 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Section A</div>
            <div style={{ border: `1px solid ${C.outlined.stroke}`, borderRadius: 7, background: 'var(--bg-secondary)', padding: '8px', margin: '4px 0 8px' }}>
              <SkeletonLine h={6} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Section B</div>
            <div style={{ border: `1px solid ${C.outlined.stroke}`, borderRadius: 7, background: 'var(--bg-secondary)', padding: '8px' }}>
              <SkeletonLine h={6} />
            </div>
          </div>
        }>
          Don't nest cards — use a divider to separate sections within the same card.
        </DontBox>
      </div>

      <Divider />

      {/* ── Accessibility ────────────────────────────────────────────────── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['Clickable cards', 'Render as a <button> or <a> element, not a <div>, so keyboard and screen reader users can interact.'],
          ['aria-label', "When the card has no visible heading, add aria-label to describe the card's purpose."],
          ['Focus ring', 'Ensure focusable cards display a visible focus ring. The design system focus token provides this.'],
          ['Nested actions', 'Avoid placing interactive elements inside a clickable card — the entire surface is already interactive.'],
        ].map(([term, desc]) => (
          <div key={term} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, fontSize: 13, padding: '10px 0', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{term}</span>
            <span style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Token reference ──────────────────────────────────────────────── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>

      <H3>Style — Ghost</H3>
      <TokenTable rows={[
        ['card.style.ghost.bg',     '{color.bg.transparent}',      'Background color'],
        ['card.style.ghost.stroke', '{color.stroke.transparent}',  'Border color'],
        ['card.style.ghost.shadow', 'none',                        'Box shadow'],
        ['card.style.ghost.radius', '{numbers.radius.lg} — 12px',  'Border radius'],
      ]} />

      <H3>Style — Outlined</H3>
      <TokenTable rows={[
        ['card.style.outlined.bg',     '{color.bg.primary}',           'Background color'],
        ['card.style.outlined.stroke', '{color.stroke.primary}',       'Border color'],
        ['card.style.outlined.shadow', 'none',                         'Box shadow'],
        ['card.style.outlined.radius', '{numbers.radius.lg} — 12px',   'Border radius'],
      ]} />

      <H3>Style — Raised</H3>
      <TokenTable rows={[
        ['card.style.raised.bg',     '{color.bg.primary}',          'Background color'],
        ['card.style.raised.stroke', '{color.stroke.transparent}',  'Border (none)'],
        ['card.style.raised.shadow', 'Z2',                          'Drop shadow: 0px 4px 8px rgba(171,190,209,.4)'],
        ['card.style.raised.radius', '{numbers.radius.lg} — 12px',  'Border radius'],
      ]} />

      <H3>Style — Clickable</H3>
      <TokenTable rows={[
        ['card.style.clickable.bg',           '{color.bg.primary}',          'Background color'],
        ['card.style.clickable.stroke',       '{color.stroke.transparent}',  'Border (none)'],
        ['card.style.clickable.shadow-default','Z2',                         'Default shadow'],
        ['card.style.clickable.shadow-hover', 'Z3',                          'Hover shadow: 0px 8px 20px rgba(171,190,209,.5)'],
        ['card.style.clickable.radius',       '{numbers.radius.lg} — 12px',  'Border radius'],
      ]} />

      <H3>Structure</H3>
      <TokenTable rows={[
        ['card.structure.header.title',         '{color.text.primary}',              'Header title color'],
        ['card.structure.header.subtitle',      '{color.text.tertiary}',             'Header subtitle color'],
        ['card.structure.header.font-size-title','{numbers.font-size.lg} — 18px',   'Title font size'],
        ['card.structure.header.font-size-subtitle','{numbers.font-size.sm} — 14px','Subtitle font size'],
        ['card.structure.header.font-weight',   '{numbers.font-weight.regular}',     'Header font weight'],
        ['card.structure.header.padding-x',     '{numbers.spacing.xl} — 24px',      'Header horizontal padding'],
        ['card.structure.header.padding-y',     '{numbers.spacing.lg} — 20px',      'Header vertical padding'],
        ['card.structure.content.padding-sm',   '{numbers.spacing.sm} — 12px',      'Small content padding'],
        ['card.structure.content.padding-md',   '{numbers.spacing.xl} — 24px',      'Medium content padding (default)'],
        ['card.structure.content.padding-lg',   '{numbers.spacing.2xl} — 32px',     'Large content padding'],
        ['card.structure.content.no-padding',   '{numbers.spacing.none} — 0px',     'No padding (flush content)'],
        ['card.divider',                        '{color.stroke.primary}',            'Divider line color'],
      ]} />

    </div>
  )
}
