import React, { useState, useEffect } from 'react'
import { useBrandTheme } from '../../contexts/BrandThemeContext.jsx'
import BrandThemeSwitcher from '../../components/BrandThemeSwitcher.jsx'
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
function DoBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && <div style={{ padding: '24px 20px', background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '24px 20px', background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Token extractor ──────────────────────────────────────────────────────────

function getDividerColors(t) {
  return {
    // Stroke colors from resolved sub-tokens
    colorDefault: t['card.style.outlined.stroke']     || '#dfe3e8',
    colorSubtle:  t['page.divider']                   || '#eef0f3',
    colorStrong:  t['navbar.sub-item.divider']        || '#c4c9d0',
    // UI chrome
    brand:        t['tabs.indicator']                 || '#07a2b6',
    surface:      t['card.style.outlined.bg']         || '#ffffff',
    stroke:       t['card.style.outlined.stroke']     || '#dfe3e8',
    textPrimary:  t['page.header.title']              || '#111827',
    textSecondary:t['page.header.description']        || '#6b7280',
  }
}

// ─── Divider primitives ───────────────────────────────────────────────────────

function HDivider({ color, weight = 1, style = 'solid', insetLeft = 0, insetRight = 0 }) {
  return (
    <div style={{
      marginLeft: insetLeft,
      marginRight: insetRight,
      height: weight,
      background: style === 'solid' ? color : 'transparent',
      backgroundImage: style === 'dashed'
        ? `repeating-linear-gradient(90deg, ${color} 0, ${color} 8px, transparent 8px, transparent 14px)`
        : style === 'dotted'
        ? `repeating-linear-gradient(90deg, ${color} 0, ${color} 3px, transparent 3px, transparent 8px)`
        : 'none',
    }} />
  )
}

function VDivider({ color, weight = 1, height = '100%' }) {
  return (
    <div style={{
      width: weight,
      height,
      background: color,
      flexShrink: 0,
    }} />
  )
}

function LabeledDivider({ color, label, C }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, height: 1, background: color }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: C.textSecondary, fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: color }} />
    </div>
  )
}

// ─── Demo wrapper ─────────────────────────────────────────────────────────────

function DemoBox({ label, children, minHeight = 0 }) {
  return (
    <div>
      {label && <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>{label}</div>}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 10,
        padding: 24,
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 0,
      }}>
        {children}
      </div>
    </div>
  )
}

// ─── Mock content block ───────────────────────────────────────────────────────

function TextBlock({ C, title, lines = 2 }) {
  return (
    <div>
      {title && <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, fontFamily: 'Poppins, sans-serif', marginBottom: 6 }}>{title}</div>}
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} style={{ height: 8, borderRadius: 4, background: 'var(--stroke-primary)', marginBottom: 6, width: i === lines - 1 ? '65%' : '100%' }} />
      ))}
    </div>
  )
}

// ─── Token table ──────────────────────────────────────────────────────────────

function TokenTable({ themeId, rows }) {
  const tokens = getComponentTokens(themeId)
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--stroke-primary)' }}>
          {['Token', 'Resolved value', 'Role'].map(h => (
            <th key={h} style={{ textAlign: 'left', padding: '6px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([key, role]) => {
          const val = tokens[key]
          return (
            <tr key={key} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
              <td style={{ padding: '8px 10px' }}><Code>{key}</Code></td>
              <td style={{ padding: '8px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {typeof val === 'string' && val.startsWith('#') && (
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: val, border: '1px solid rgba(0,0,0,.1)', flexShrink: 0 }} />
                  )}
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{val ?? '—'}</span>
                </div>
              </td>
              <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>{role}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// ─── Table of contents ────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',      label: 'Overview' },
  { id: 'usage',         label: 'Usage' },
  { id: 'orientation',   label: 'Orientation' },
  { id: 'variants',      label: 'Variants' },
  { id: 'labeled',       label: 'Labeled divider' },
  { id: 'inset',         label: 'Inset divider' },
  { id: 'spacing',       label: 'Spacing' },
  { id: 'guidance',      label: "Do's & Don'ts" },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'tokens',        label: 'Token reference' },
]

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DividerPage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [activeSection, setActiveSection] = useState('overview')
  const theme = VISIBLE_THEMES.find(t => t.id === activeTheme) || VISIBLE_THEMES[0]
  const tokens = getComponentTokens(theme.id)
  const C = getDividerColors(tokens)

  const THEME_COLORS = VISIBLE_THEMES.map(t => getComponentTokens(t.id)['tabs.indicator'] || '#07a2b6')

  // Scroll spy — listens on <main> (the actual scrolling container)
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
      <div style={{ flex: 1, minWidth: 0, padding: '40px 56px 96px' }}>

      {/* ── Header ── */}
      <SectionAnchor id="top" />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-secondary)', marginBottom: 8 }}>LAYOUT & OVERLAY</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.8px', color: 'var(--text-primary)', margin: 0 }}>Divider</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif' }}>Theme:</span>
          {VISIBLE_THEMES.map((t, i) => (
            <button key={t.id} onClick={() => setActiveTheme(t.id)} title={t.label} style={{
              width: 22, height: 22, borderRadius: '50%', background: THEME_COLORS[i], cursor: 'pointer', padding: 0, boxSizing: 'border-box',
              border: t.id === activeTheme ? '2px solid var(--text-primary)' : '2px solid transparent',
              outline: t.id === activeTheme ? '2px solid var(--bg-primary)' : 'none', outlineOffset: -4,
              transition: 'border-color .15s',
            }} />
          ))}
        </div>
      </div>

      <Lead>
        Divider is a thin line that creates visual separation between content sections. It exists in two orientations — horizontal and vertical — and supports styling variants for weight, line style, and spacing. It can optionally carry a text label to introduce the sections it divides.
      </Lead>

      <Divider />

      {/* ── Overview ── */}
      <SectionAnchor id="overview" />
      <H2>Overview</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        <DemoBox label="Horizontal">
          <TextBlock C={C} title="Section A" lines={2} />
          <div style={{ margin: '16px 0' }}>
            <HDivider color={C.colorDefault} />
          </div>
          <TextBlock C={C} title="Section B" lines={2} />
        </DemoBox>

        <DemoBox label="Vertical">
          <div style={{ display: 'flex', gap: 0, height: 80 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 20 }}>
              <TextBlock C={C} lines={2} />
            </div>
            <VDivider color={C.colorDefault} height="100%" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 20 }}>
              <TextBlock C={C} lines={2} />
            </div>
          </div>
        </DemoBox>

        <DemoBox label="With label">
          <TextBlock C={C} lines={1} />
          <div style={{ margin: '16px 0' }}>
            <LabeledDivider color={C.colorDefault} label="or" C={C} />
          </div>
          <TextBlock C={C} lines={1} />
        </DemoBox>

        <DemoBox label="Inset">
          <TextBlock C={C} title="List item 1" lines={1} />
          <div style={{ margin: '10px 0' }}>
            <HDivider color={C.colorDefault} insetLeft={32} />
          </div>
          <TextBlock C={C} title="List item 2" lines={1} />
          <div style={{ margin: '10px 0' }}>
            <HDivider color={C.colorDefault} insetLeft={32} />
          </div>
          <TextBlock C={C} title="List item 3" lines={1} />
        </DemoBox>
      </div>

      <Divider />

      {/* ── When to use ── */}
      <SectionAnchor id="usage" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <H2>When to use</H2>
          <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 18, marginTop: 0 }}>
            <li>Separating distinct content sections within a page or card</li>
            <li>Dividing list items where vertical rhythm alone is insufficient</li>
            <li>Splitting a layout into columns (vertical divider)</li>
            <li>Introducing a new content group with a labeled divider (e.g. "or", "this week")</li>
          </ul>
        </div>
        <div>
          <H2>When not to use</H2>
          <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 18, marginTop: 0 }}>
            <li>As a substitute for spacing — add margin/padding first</li>
            <li>Between every item in a list — use spacing or a subtle background instead</li>
            <li>To create decorative ornamentation — dividers are structural, not decorative</li>
            <li>Inside tight UI like dropdowns or compact toolbars where a group separator suffices</li>
          </ul>
        </div>
      </div>

      <Divider />

      {/* ── Orientation ── */}
      <SectionAnchor id="orientation" />
      <H2>Orientation</H2>

      <H3>Horizontal</H3>
      <P>The default orientation. Spans the full width of its container. Used between rows of content, sections, or form groups.</P>
      <DemoBox>
        <TextBlock C={C} title="Personal information" lines={2} />
        <div style={{ margin: '20px 0' }}>
          <HDivider color={C.colorDefault} />
        </div>
        <TextBlock C={C} title="Billing address" lines={2} />
        <div style={{ margin: '20px 0' }}>
          <HDivider color={C.colorDefault} />
        </div>
        <TextBlock C={C} title="Payment method" lines={2} />
      </DemoBox>

      <H3>Vertical</H3>
      <P>Used to split content side by side. Height is inherited from the parent flex or grid container. Common in toolbars, stat rows, and split panels.</P>
      <DemoBox>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, height: 64 }}>
          {[['12,485', 'Visits'], ['1,230', 'Signups'], ['$48K', 'Revenue']].map(([val, label], i) => (
            <React.Fragment key={label}>
              {i > 0 && <VDivider color={C.colorDefault} />}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, fontFamily: 'Poppins, sans-serif' }}>{val}</span>
                <span style={{ fontSize: 11, color: C.textSecondary, fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '.07em' }}>{label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </DemoBox>

      <Divider />

      {/* ── Variants ── */}
      <SectionAnchor id="variants" />
      <H2>Variants</H2>

      <H3>Weight</H3>
      <P>Dividers come in two stroke weights. Default (1px) for most separations; strong (2px) for major section breaks or high-contrast needs.</P>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DemoBox label="Default — 1px">
          <TextBlock C={C} lines={2} />
          <div style={{ margin: '16px 0' }}><HDivider color={C.colorDefault} weight={1} /></div>
          <TextBlock C={C} lines={2} />
        </DemoBox>
        <DemoBox label="Strong — 2px">
          <TextBlock C={C} lines={2} />
          <div style={{ margin: '16px 0' }}><HDivider color={C.colorDefault} weight={2} /></div>
          <TextBlock C={C} lines={2} />
        </DemoBox>
      </div>

      <H3>Line style</H3>
      <P>Solid is the default and appropriate for almost all cases. Dashed and dotted are available for lightweight visual groupings or to signal an incomplete or pending boundary.</P>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Solid', style: 'solid' },
          { label: 'Dashed', style: 'dashed' },
          { label: 'Dotted', style: 'dotted' },
        ].map(({ label, style }) => (
          <DemoBox key={label} label={label}>
            <HDivider color={C.colorDefault} style={style} />
          </DemoBox>
        ))}
      </div>

      <H3>Color</H3>
      <P>Three semantic color levels map to the stroke token scale:</P>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Subtle',  color: C.colorSubtle,  note: 'page.divider',              desc: 'In-page sections, low contrast' },
          { label: 'Default', color: C.colorDefault, note: 'card.style.outlined.stroke', desc: 'Card and form separators' },
          { label: 'Strong',  color: C.colorStrong,  note: 'navbar.sub-item.divider',    desc: 'High contrast emphasis' },
        ].map(({ label, color, note, desc }) => (
          <div key={label}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>{label}</div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '20px 16px' }}>
              <HDivider color={color} />
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color, border: '1px solid rgba(0,0,0,.1)', flexShrink: 0 }} />
                <Code>{color}</Code>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
              <Code>{note}</Code><br />{desc}
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── With label ── */}
      <SectionAnchor id="labeled" />
      <H2>Labeled divider</H2>
      <P>A text label centered within the divider. Common in authentication flows ("or sign in with"), timeline separators ("this week"), and content groupings. The label is presentational — it does not need a landmark role.</P>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {['or', 'This week', 'Section 2'].map(label => (
          <DemoBox key={label} label={`"${label}"`}>
            <LabeledDivider color={C.colorDefault} label={label} C={C} />
          </DemoBox>
        ))}
      </div>

      <Divider />

      {/* ── Inset ── */}
      <SectionAnchor id="inset" />
      <H2>Inset</H2>
      <P>An inset divider starts at a horizontal offset. Used in lists where the left edge is occupied by an avatar or icon — the divider aligns to the text content, not the row edge.</P>
      <DemoBox>
        {[
          { icon: '🧑', name: 'Alice Martin', meta: 'Product Designer' },
          { icon: '🧑', name: 'Bob Chen', meta: 'Front-end Engineer' },
          { icon: '🧑', name: 'Clara Diaz', meta: 'Engineering Manager' },
        ].map(({ icon, name, meta }, i) => (
          <React.Fragment key={name}>
            {i > 0 && <div style={{ marginTop: 0, marginBottom: 0 }}><HDivider color={C.colorDefault} insetLeft={48} /></div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.brand + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, fontFamily: 'Poppins, sans-serif' }}>{name}</div>
                <div style={{ fontSize: 11, color: C.textSecondary, fontFamily: 'Poppins, sans-serif' }}>{meta}</div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </DemoBox>

      <Divider />

      {/* ── Spacing ── */}
      <SectionAnchor id="spacing" />
      <H2>Spacing</H2>
      <P>The divider itself has no built-in margin. Spacing above and below is the responsibility of the surrounding layout — typically set with margin on the parent sections or via a spacing utility. Recommended values:</P>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          ['4px',  'Inside compact lists'],
          ['8px',  'Between dense form rows'],
          ['16px', 'General section break'],
          ['32px', 'Major page section break'],
        ].map(([val, desc]) => (
          <div key={val} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', marginBottom: 4 }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Guidance ── */}
      <SectionAnchor id="guidance" />
      <H2>Guidance</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DoBox
          visual={
            <div style={{ width: '100%' }}>
              <TextBlock C={C} title="Billing" lines={1} />
              <div style={{ margin: '12px 0' }}><HDivider color={C.colorDefault} /></div>
              <TextBlock C={C} title="Shipping" lines={1} />
            </div>
          }
        >
          Use a divider to separate genuinely distinct content groups that need a clear visual boundary.
        </DoBox>
        <DontBox
          visual={
            <div style={{ width: '100%' }}>
              {[1, 2, 3].map(i => (
                <div key={i}>
                  <TextBlock C={C} lines={1} />
                  {i < 3 && <div style={{ margin: '4px 0' }}><HDivider color={C.colorDefault} /></div>}
                </div>
              ))}
            </div>
          }
        >
          Don't add a divider between every item. When items are already separated by spacing and share the same type, the divider adds visual noise.
        </DontBox>
        <DoBox
          visual={
            <div style={{ width: '100%' }}>
              <LabeledDivider color={C.colorDefault} label="or" C={C} />
            </div>
          }
        >
          Use a labeled divider to introduce an alternative action clearly — it reduces ambiguity between two equivalent options.
        </DoBox>
        <DontBox
          visual={
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <LabeledDivider color={C.colorDefault} label="Section 1" C={C} />
              <LabeledDivider color={C.colorDefault} label="Section 2" C={C} />
            </div>
          }
        >
          Don't use labeled dividers as headings. Use a proper heading element (<Code>h2</Code>–<Code>h6</Code>) for content section titles instead.
        </DontBox>
      </div>

      <Divider />

      {/* ── Accessibility ── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {[
          ['role="separator"',  'A decorative horizontal line rendered as <hr> automatically has separator semantics. If implemented as a <div>, add role="separator" explicitly.'],
          ['aria-orientation', 'For vertical dividers, add aria-orientation="vertical" so assistive technologies announce the correct orientation.'],
          ['Decorative use',   'If the divider is purely decorative (e.g. inside a card that already has clear sections), add aria-hidden="true" to avoid unnecessary announcements.'],
          ['Color contrast',   'The divider line alone does not need to meet WCAG 3:1 contrast — it is a non-text element used for layout, not to convey information.'],
          ['Labeled divider',  'The text label in a labeled divider is presentational. Do not wrap it in a heading element. If the label introduces a form section, use <fieldset> + <legend> instead.'],
        ].map(([term, desc]) => (
          <div key={term} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, fontSize: 13, padding: '10px 0', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{term}</span>
            <span style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Token reference ── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>
      <P>Divider has no dedicated top-level token. It reads from the stroke color scale, which is shared with other structural components. The table below shows the three most relevant sub-token references.</P>
      <TokenTable themeId={theme.id} rows={[
        ['card.style.outlined.stroke',  'Default divider — primary stroke color'],
        ['page.divider',                'Subtle divider — used in page-level separators'],
        ['navbar.sub-item.divider',     'Strong divider — higher contrast secondary stroke'],
        ['card.divider',                'Divider inside Card component'],
        ['sidepanel.divider',           'Divider inside Side Panel component'],
        ['popover.divider',             'Divider inside Popover component'],
      ]} />

      </div>

      {/* ── Right TOC aside ────────────────────────────────────────────────────── */}
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
