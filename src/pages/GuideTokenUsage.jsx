import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { THEMES, getComponentTokens, getSemanticTokens } from '../data/tokens/index.js'
import { useBrandTheme } from '../contexts/BrandThemeContext.jsx'
import BrandThemeSwitcher from '../components/BrandThemeSwitcher.jsx'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionAnchor({ id }) {
  return <span id={id} style={{ display: 'block', marginTop: -80, paddingTop: 80 }} />
}

function H2({ children }) {
  return (
    <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--text-primary)', marginBottom: 12, marginTop: 56 }}>
      {children}
    </h2>
  )
}

function H3({ children }) {
  return (
    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10, marginTop: 28 }}>
      {children}
    </h3>
  )
}

function Lead({ children }) {
  return <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20 }}>{children}</p>
}

function P({ children }) {
  return <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 14 }}>{children}</p>
}

function Code({ children }) {
  return (
    <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: 'var(--bg-secondary)', color: 'var(--brand-600)', padding: '1px 6px', borderRadius: 4 }}>
      {children}
    </code>
  )
}

function CodeBlock({ children, lang = '' }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(children).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div style={{ position: 'relative', marginBottom: 20 }}>
      {lang && (
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderBottom: 'none', padding: '5px 12px', borderRadius: '6px 6px 0 0', display: 'inline-block' }}>
          {lang}
        </div>
      )}
      <pre style={{ margin: 0, padding: '16px 20px', background: '#0f172a', color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.65, borderRadius: lang ? '0 6px 6px 6px' : 6, overflowX: 'auto', whiteSpace: 'pre' }}>
        {children}
      </pre>
      <button
        onClick={copy}
        style={{
          position: 'absolute', top: lang ? 32 : 10, right: 10,
          fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 4,
          background: copied ? '#22c55e22' : '#ffffff18', color: copied ? '#22c55e' : '#94a3b8',
          border: '1px solid ' + (copied ? '#22c55e44' : '#ffffff18'), cursor: 'pointer', transition: 'all 150ms',
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

function DoBox({ title, children }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, padding: '14px 18px', marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 6 }}>
        ✓ {title || 'Do'}
      </div>
      <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}

function DontBox({ title, children }) {
  return (
    <div style={{ border: '1px solid #fecaca', background: '#fef2f2', borderRadius: 8, padding: '14px 18px', marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 6 }}>
        ✗ {title || "Don't"}
      </div>
      <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}

function InfoBox({ type = 'info', children }) {
  const styles = {
    info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', label: 'Note' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', label: 'Warning' },
    planned: { bg: '#faf5ff', border: '#e9d5ff', text: '#6b21a8', label: 'Planned' },
  }
  const s = styles[type] || styles.info
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: s.text, lineHeight: 1.65 }}>
      <strong>{s.label}: </strong>{children}
    </div>
  )
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--stroke-primary)', margin: '48px 0' }} />
}

function PhaseTag({ n, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, marginTop: 32 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-600)',
        color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{n}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
    </div>
  )
}

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'anatomy',    label: 'Token anatomy' },
  { id: 'layers',     label: 'JSON structure' },
  { id: 'resolution', label: 'Resolution flow' },
  { id: 'api',        label: 'JavaScript API' },
  { id: 'css',        label: 'CSS variables' },
  { id: 'add-theme',  label: 'Adding a theme' },
  { id: 'rules',      label: 'Do / Don\'t rules' },
  { id: 'mistakes',   label: 'Common mistakes' },
  { id: 'migration',  label: 'Migration strategy' },
]

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GuideTokenUsage() {
  const { brandTheme: previewTheme, setBrandTheme: setPreviewTheme } = useBrandTheme()
  const [resolvedKey, setResolvedKey] = useState(null)

  const compTokens = getComponentTokens(previewTheme)
  const semTokens  = getSemanticTokens(previewTheme)

  const DEMO_TOKENS = [
    { key: 'button.primary.bg.default',    layer: 'component', label: 'Primary button BG' },
    { key: 'button.primary.bg.hover',      layer: 'component', label: 'Primary button BG hover' },
    { key: 'button.primary.color.label',   layer: 'component', label: 'Primary button label' },
    { key: 'color.bg.brand.default',       layer: 'semantic',  label: 'Brand default BG' },
    { key: 'color.bg.brand.subtle',        layer: 'semantic',  label: 'Brand subtle BG' },
    { key: 'color.text.primary',           layer: 'semantic',  label: 'Primary text' },
    { key: 'color.bg.default',             layer: 'semantic',  label: 'Default BG (neutral)' },
  ]

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Main content ─────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>
            Guides · Token Usage
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>
            Token Usage
          </h1>
          <Lead>
            A complete reference for working with design tokens in AWF — from raw JSON anatomy to resolved CSS values,
            practical API usage, and a migration strategy for adopting tokens in existing products.
          </Lead>
          <Lead>
            Tokens are the single source of truth for every visual decision. Understanding how they are structured and
            resolved is essential for building consistent, themeable UI.
          </Lead>
        </div>

        <Divider />

        {/* ── 1. Token anatomy ─────────────────────────────────── */}
        <SectionAnchor id="anatomy" />
        <H2>Token anatomy</H2>
        <Lead>
          All AWF tokens follow the{' '}
          <a href="https://design-tokens.github.io/community-group/format/" target="_blank" rel="noreferrer" style={{ color: 'var(--brand-600)' }}>
            W3C Design Tokens Community Group format
          </a>{' '}
          (also used by Tokens Studio for Figma). Each token is a JSON object with at least a <Code>$type</Code> and a <Code>$value</Code>.
        </Lead>

        <H3>Raw token structure (Tokens Studio / W3C format)</H3>
        <CodeBlock lang="json">{`{
  "color": {
    "bg": {
      "brand": {
        "default": {
          "$type":  "color",
          "$value": "{color.brand.DOT.600}",
          "$extensions": {
            "com.figma.scopes": ["ALL_SCOPES"]
          }
        }
      }
    }
  }
}`}</CodeBlock>

        <P>
          The key path mirrors the token name: <Code>color.bg.brand.default</Code>. The <Code>$value</Code> is either
          a hex color (<Code>#1a56db</Code>) or a reference to another token (<Code>{`{color.brand.DOT.600}`}</Code>).
          References are resolved at build time via the resolver.
        </P>

        <H3>After flattening and resolution</H3>
        <P>
          The resolver flattens nested JSON into dot-notation keys and resolves all references to their final hex values.
          What was a 4-level nested object becomes a simple lookup table.
        </P>
        <CodeBlock lang="js">{`// flattenTokens() output (before resolution):
{
  "color.bg.brand.default": "{color.brand.DOT.600}",
  "color.brand.DOT.600":    "#1a56db",
}

// resolveAll() output (final resolved map):
{
  "color.bg.brand.default": "#1a56db",  // reference chased
  "color.brand.DOT.600":    "#1a56db",
}`}</CodeBlock>

        <InfoBox type="info">
          The resolver handles chained references (up to 8 levels deep). A component token can reference a semantic token,
          which references a primitive — all resolved to a single hex value.
        </InfoBox>

        <Divider />

        {/* ── 2. JSON structure per layer ─────────────────────────────── */}
        <SectionAnchor id="layers" />
        <H2>JSON structure per layer</H2>
        <Lead>
          AWF tokens are organized into three layers — <strong>primitives</strong>, <strong>semantic</strong>,
          and <strong>component</strong>. This section shows the exact JSON shape for each. For the conceptual
          breakdown (what each layer is for, token counts, the dependency rule), see{' '}
          <Link to="/foundations/tokens" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>Foundations → Token Architecture</Link>.
        </Lead>

        <H3>Layer 1 — Primitives (<Code>primitives.json</Code>)</H3>
        <P>Primitives define the raw palette. They are never used directly in UI — they exist only to be referenced by semantic tokens.</P>
        <CodeBlock lang="json">{`// primitives.json (excerpt)
{
  "color": {
    "brand": {
      "DOT": {
        "600": { "$type": "color", "$value": "#1a56db" },
        "700": { "$type": "color", "$value": "#1e429f" },
        "800": { "$type": "color", "$value": "#1e3a8a" }
      },
      "Drops": {
        "500": { "$type": "color", "$value": "#7c3aed" }
      }
    },
    "neutral": {
      "50":  { "$type": "color", "$value": "#f8fafc" },
      "900": { "$type": "color", "$value": "#0f172a" }
    }
  }
}`}</CodeBlock>

        <H3>Layer 2 — Semantic (<Code>{`{ProductId}-Light.json`}</Code>)</H3>
        <P>
          Semantic tokens assign meaning to primitives. Each product has its own semantic file mapping the same token
          names to different brand colors. Neutral tokens point to the shared neutral palette and resolve identically
          across all themes.
        </P>
        <CodeBlock lang="json">{`// DOT-Light.json — semantic tokens for DOT Anonymizer
{
  "color": {
    "bg": {
      "brand": {
        "default": { "$type": "color", "$value": "{color.brand.DOT.600}" },
        "hover":   { "$type": "color", "$value": "{color.brand.DOT.700}" },
        "strong":  { "$type": "color", "$value": "{color.brand.DOT.800}" },
        "subtle":  { "$type": "color", "$value": "{color.brand.DOT.50}"  }
      },
      "default": { "$type": "color", "$value": "{color.neutral.50}" }
    },
    "text": {
      "primary":   { "$type": "color", "$value": "{color.neutral.900}" },
      "secondary":  { "$type": "color", "$value": "{color.neutral.600}" }
    }
  }
}

// CoChecker-Light.json — same token names, different brand
{
  "color": {
    "bg": {
      "brand": {
        "default": { "$type": "color", "$value": "{color.brand.CoChecker.600}" }
      }
    }
  }
}`}</CodeBlock>

        <H3>Layer 3 — Component (<Code>components.json</Code>)</H3>
        <P>Component tokens reference semantic tokens only — never primitives directly. They capture decisions specific to one component (e.g. which semantic color a button's background uses).</P>
        <CodeBlock lang="json">{`// components.json (excerpt — button component)
{
  "button": {
    "primary": {
      "bg": {
        "default":  { "$type": "color", "$value": "{color.bg.brand.default}" },
        "hover":    { "$type": "color", "$value": "{color.bg.brand.hover}"   },
        "pressed":  { "$type": "color", "$value": "{color.bg.brand.pressed}" },
        "disabled": { "$type": "color", "$value": "{color.bg.disabled}"      }
      },
      "color": {
        "label":    { "$type": "color", "$value": "{color.text.on-brand}"    }
      }
    },
    "icon": {
      "ghost": {
        "bg": {
          "default": { "$type": "color", "$value": "{color.bg.transparent}"     },
          "hover":   { "$type": "color", "$value": "{color.bg.brand.hover-subtle}" }
        }
      }
    }
  }
}`}</CodeBlock>

        <Divider />

        {/* ── 3. Resolution flow ─────────────────────────────────── */}
        <SectionAnchor id="resolution" />
        <H2>Resolution flow</H2>
        <Lead>
          When you call <Code>getComponentTokens('dot')</Code>, the resolver walks the reference chain from component → semantic → primitive → hex.
        </Lead>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Resolution chain — DOT Anonymizer theme</div>
          {[
            { label: 'Component token', value: 'button.primary.bg.default', arrow: true, color: '#166534', bg: '#dcfce7' },
            { label: 'References semantic', value: 'color.bg.brand.default  →  {color.brand.DOT.600}', arrow: true, color: '#7e22ce', bg: '#f3e8ff' },
            { label: 'References primitive', value: 'color.brand.DOT.600  →  #1a56db', arrow: true, color: '#0369a1', bg: '#e0f2fe' },
            { label: 'Final hex value', value: '#1a56db', arrow: false, color: '#374151', bg: '#f1f5f9' },
          ].map((step, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 6, background: step.bg, border: `1px solid ${step.color}22` }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: step.color, minWidth: 130 }}>{step.label}</span>
                <code style={{ fontSize: 12, color: '#1e293b', fontFamily: 'JetBrains Mono, monospace' }}>{step.value}</code>
              </div>
              {step.arrow && <div style={{ textAlign: 'center', fontSize: 16, color: 'var(--text-tertiary)', lineHeight: 1.2, padding: '2px 0' }}>↓</div>}
            </div>
          ))}
        </div>

        <P>
          For a different product (e.g. CoChecker), the same component token <Code>button.primary.bg.default</Code> resolves through
          a different semantic file to a different primitive, yielding a different hex — without any change to component code.
        </P>

        <Divider />

        {/* ── 4. JavaScript API ─────────────────────────────────────── */}
        <SectionAnchor id="api" />
        <H2>JavaScript API</H2>
        <Lead>
          The token API is exposed from <Code>src/data/tokens/index.js</Code>. Import only what you need — all functions are memoized.
        </Lead>

        <H3>getComponentTokens(themeId)</H3>
        <P>Returns a flat object of all resolved component tokens for the given theme. This is the most commonly used function.</P>
        <CodeBlock lang="js">{`import { getComponentTokens } from '@/data/tokens'

// Returns: { "button.primary.bg.default": "#1a56db", ... }
const tokens = getComponentTokens('dot')

// Usage in a component:
function PrimaryButton({ label }) {
  const tokens = getComponentTokens('dot')
  return (
    <button style={{ background: tokens['button.primary.bg.default'] }}>
      {label}
    </button>
  )
}

// With React context (recommended):
function PrimaryButton({ label }) {
  const { themeId } = useTheme()               // from ThemeContext
  const tokens = getComponentTokens(themeId)
  return (
    <button style={{ background: tokens['button.primary.bg.default'] }}>
      {label}
    </button>
  )
}`}</CodeBlock>

        <InfoBox type="info">
          <Code>getComponentTokens</Code> is memoized per theme ID. Calling it multiple times with the same argument returns the same
          cached object — no performance penalty.
        </InfoBox>

        <H3>getSemanticTokens(themeId)</H3>
        <P>Returns the resolved semantic token map. Use this when you need layout-level tokens (backgrounds, text colors) that are not tied to a specific component.</P>
        <CodeBlock lang="js">{`import { getSemanticTokens } from '@/data/tokens'

const sem = getSemanticTokens('cochecker')
// sem["color.bg.brand.default"]  → "#7c3aed"  (CoChecker brand)
// sem["color.text.primary"]      → "#0f172a"  (same across all themes)
// sem["color.bg.default"]        → "#f8fafc"  (same across all themes)`}</CodeBlock>

        <H3>THEMES array</H3>
        <P>Array of all registered product themes. Filter out variant themes for user-facing UIs.</P>
        <CodeBlock lang="js">{`import { THEMES } from '@/data/tokens'

// THEMES shape:
// [
//   { id: 'dot',      label: 'DOT Anonymizer', color: '#1a56db', semanticJson: {...} },
//   { id: 'drops',    label: 'Drops',           color: '#7c3aed', semanticJson: {...} },
//   ...
// ]

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))`}</CodeBlock>

        <H3>Live token preview</H3>
        <P>Select a product theme to see how the same token names resolve to different values.</P>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {VISIBLE_THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setPreviewTheme(t.id)}
                style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', border: '2px solid',
                  borderColor: previewTheme === t.id ? t.color : 'var(--stroke-primary)',
                  background: previewTheme === t.id ? t.color + '18' : 'transparent',
                  color: previewTheme === t.id ? t.color : 'var(--text-secondary)',
                  transition: 'all 120ms',
                }}
              >
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: t.color, marginRight: 6, verticalAlign: 'middle' }} />
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px', gap: 8, padding: '6px 10px', borderBottom: '1px solid var(--stroke-primary)', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Token</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Layer</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Resolved value</span>
            </div>
            {DEMO_TOKENS.map(({ key, layer, label }) => {
              const map = layer === 'component' ? compTokens : semTokens
              const value = map[key]
              const isColor = value && value.startsWith('#')
              return (
                <div
                  key={key}
                  onClick={() => setResolvedKey(resolvedKey === key ? null : key)}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 100px 120px',
                    gap: 8, padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                    background: resolvedKey === key ? 'var(--brand-50)' : 'transparent',
                    transition: 'background 100ms',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>{key}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</div>
                  </div>
                  <div>
                    <span style={{
                      fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em',
                      padding: '2px 7px', borderRadius: 4,
                      background: layer === 'component' ? '#dcfce7' : '#e0f2fe',
                      color: layer === 'component' ? '#166534' : '#0369a1',
                    }}>
                      {layer}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isColor && <span style={{ width: 16, height: 16, borderRadius: 4, background: value, border: '1px solid rgba(0,0,0,.12)', flexShrink: 0 }} />}
                    <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{value || '—'}</code>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Divider />

        {/* ── 5. CSS variables ──────────────────────────────────────── */}
        <SectionAnchor id="css" />
        <H2>CSS variables approach</H2>
        <Lead>
          While the JavaScript API is the recommended approach for AWF components, you can also expose resolved tokens
          as CSS custom properties on the root element — useful for styling legacy markup or third-party widgets.
        </Lead>

        <H3>Injecting tokens as CSS variables</H3>
        <CodeBlock lang="js">{`import { getSemanticTokens } from '@/data/tokens'

function applyThemeAsCssVars(themeId) {
  const tokens = getSemanticTokens(themeId)
  const root = document.documentElement

  for (const [key, value] of Object.entries(tokens)) {
    // "color.bg.brand.default" → "--color-bg-brand-default"
    const cssVar = '--' + key.replaceAll('.', '-')
    root.style.setProperty(cssVar, value)
  }
}

// Call on mount and on theme change:
applyThemeAsCssVars('dot')`}</CodeBlock>

        <H3>Using the injected variables in CSS</H3>
        <CodeBlock lang="css">{`.my-button {
  background-color: var(--color-bg-brand-default);
  color:            var(--color-text-on-brand);
}

.my-button:hover {
  background-color: var(--color-bg-brand-hover);
}`}</CodeBlock>

        <InfoBox type="warning">
          CSS variables set via <Code>element.style.setProperty</Code> override any global stylesheet rules
          (high specificity). Make sure this is intentional and scoped correctly when mixing with existing styles.
        </InfoBox>

        <Divider />

        {/* ── 6. Adding a theme ─────────────────────────────────────── */}
        <SectionAnchor id="add-theme" />
        <H2>Adding a new product theme</H2>
        <Lead>
          Adding a theme to AWF requires changes to exactly three files. The component layer requires no changes —
          this is by design.
        </Lead>

        <PhaseTag n={1} label="Add brand primitives to primitives.json" />
        <P>Add your new brand color palette as a new entry under <Code>color.brand</Code>. Follow the same step structure (50–950).</P>
        <CodeBlock lang="json">{`// primitives.json — add brand palette
{
  "color": {
    "brand": {
      "NewProduct": {
        "50":  { "$type": "color", "$value": "#ecfdf5" },
        "100": { "$type": "color", "$value": "#d1fae5" },
        "500": { "$type": "color", "$value": "#10b981" },
        "600": { "$type": "color", "$value": "#059669" },
        "700": { "$type": "color", "$value": "#047857" },
        "800": { "$type": "color", "$value": "#065f46" },
        "900": { "$type": "color", "$value": "#064e3b" }
      }
    }
  }
}`}</CodeBlock>

        <PhaseTag n={2} label="Create a semantic file for the new theme" />
        <P>Copy an existing semantic file (e.g. <Code>DOT-Light.json</Code>) and replace all brand references with your new palette key.</P>
        <CodeBlock lang="json">{`// src/data/tokens/source/semantic/NewProduct-Light.json
{
  "color": {
    "bg": {
      "brand": {
        "default": { "$type": "color", "$value": "{color.brand.NewProduct.600}" },
        "hover":   { "$type": "color", "$value": "{color.brand.NewProduct.700}" },
        "strong":  { "$type": "color", "$value": "{color.brand.NewProduct.800}" },
        "subtle":  { "$type": "color", "$value": "{color.brand.NewProduct.100}" },
        "subtlest":{ "$type": "color", "$value": "{color.brand.NewProduct.50}"  }
      }
    }
  }
  // Keep neutral tokens identical to the existing themes
}`}</CodeBlock>

        <PhaseTag n={3} label="Register the theme in index.js" />
        <CodeBlock lang="js">{`// src/data/tokens/index.js

import newProductLight from './source/semantic/NewProduct-Light.json'

// Add to brandPalettes:
export const brandPalettes = {
  // ... existing entries
  newproduct: getPalette(resolvedPrimitives, 'color.brand.NewProduct'),
}

// Add to THEMES array:
export const THEMES = [
  // ... existing themes
  {
    id:           'newproduct',
    label:        'New Product',
    color:        brandStep(brandPalettes.newproduct, '600'),
    semanticJson: newProductLight,
  },
]`}</CodeBlock>

        <InfoBox type="info">
          That's all. <Code>getComponentTokens('newproduct')</Code> will now work automatically. No changes needed to
          component files, the resolver, or the CSS layer.
        </InfoBox>

        <Divider />

        {/* ── 7. Do / Don't ────────────────────────────────────────── */}
        <SectionAnchor id="rules" />
        <H2>Do / Don't rules</H2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <DoBox title="Use component tokens in components">
            Always consume <Code>getComponentTokens(themeId)</Code> in component styling. Component tokens have been
            mapped to the right semantic decisions for each element.
          </DoBox>
          <DontBox title="Don't use semantic tokens in components">
            Semantic tokens (e.g. <Code>color.bg.brand.default</Code>) are intended for layout and page-level decisions,
            not individual component properties. Bypassing the component layer makes auditing harder.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <DoBox title="Reference semantic tokens from component tokens">
            Component tokens must only reference semantic tokens. This maintains the correct dependency direction
            and ensures theme switching works automatically.
          </DoBox>
          <DontBox title="Don't skip layers in token references">
            Component tokens must not reference primitives directly (e.g. <Code>{`{color.brand.DOT.600}`}</Code>).
            That would hardcode the brand color to a specific product, breaking other themes.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <DoBox title="Keep semantic token names theme-agnostic">
            Token names like <Code>color.bg.brand.default</Code> express intent, not a specific product color.
            They work identically across all theme files.
          </DoBox>
          <DontBox title="Don't name tokens after specific products">
            Avoid names like <Code>color.bg.dot-blue</Code> or <Code>color.bg.cochecker-purple</Code>. These cannot
            be reused across themes and break the abstraction model.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <DoBox title="Add primitives before semantic tokens">
            Always define the full brand palette in <Code>primitives.json</Code> before creating a semantic file.
            Semantic tokens must always resolve to an existing primitive.
          </DoBox>
          <DontBox title="Don't hardcode hex values in semantic files">
            Every <Code>$value</Code> in a semantic file should be a reference (<Code>{`{color.brand.X.600}`}</Code>),
            never a raw hex string. Raw hex in semantic files makes later palette changes require two edits instead of one.
          </DontBox>
        </div>

        <Divider />

        {/* ── 8. Common mistakes ───────────────────────────────────── */}
        <SectionAnchor id="mistakes" />
        <H2>Common mistakes</H2>

        <H3>1. Using hardcoded colors instead of tokens</H3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✗ Wrong</div>
            <CodeBlock lang="jsx">{`<button style={{ background: '#1a56db' }}>
  Submit
</button>`}</CodeBlock>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✓ Right</div>
            <CodeBlock lang="jsx">{`const tokens = getComponentTokens(themeId)
<button style={{
  background: tokens['button.primary.bg.default']
}}>
  Submit
</button>`}</CodeBlock>
          </div>
        </div>

        <H3>2. Skipping the component layer and using semantic directly</H3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✗ Wrong</div>
            <CodeBlock lang="jsx">{`const sem = getSemanticTokens(themeId)
<button style={{
  background: sem['color.bg.brand.default']
}}>
  Submit
</button>`}</CodeBlock>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✓ Right</div>
            <CodeBlock lang="jsx">{`const tokens = getComponentTokens(themeId)
<button style={{
  background: tokens['button.primary.bg.default']
}}>
  Submit
</button>`}</CodeBlock>
          </div>
        </div>

        <H3>3. Referencing a primitive directly in a component token</H3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✗ Wrong (components.json)</div>
            <CodeBlock lang="json">{`{
  "button": {
    "primary": {
      "bg": {
        "default": {
          "$value": "{color.brand.DOT.600}"
        }
      }
    }
  }
}`}</CodeBlock>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✓ Right (components.json)</div>
            <CodeBlock lang="json">{`{
  "button": {
    "primary": {
      "bg": {
        "default": {
          "$value": "{color.bg.brand.default}"
        }
      }
    }
  }
}`}</CodeBlock>
          </div>
        </div>
        <P>Referencing a primitive directly in components.json locks the token to the DOT brand. Changing to <Code>{`{color.bg.brand.default}`}</Code> makes it resolve correctly for every theme.</P>

        <H3>4. Not using the memoized API — re-resolving on every render</H3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✗ Wrong</div>
            <CodeBlock lang="jsx">{`// Building a fresh resolver inside the component
function MyButton() {
  const raw = flattenTokens(components)
  // ... manual resolution every render
}`}</CodeBlock>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✓ Right</div>
            <CodeBlock lang="jsx">{`// getComponentTokens is memoized — safe to call anywhere
function MyButton() {
  const { themeId } = useTheme()
  const tokens = getComponentTokens(themeId)
  // ...
}`}</CodeBlock>
          </div>
        </div>

        <H3>5. Hardcoding the theme ID in components</H3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✗ Wrong</div>
            <CodeBlock lang="jsx">{`// Component only works for DOT theme
const tokens = getComponentTokens('dot')`}</CodeBlock>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✓ Right</div>
            <CodeBlock lang="jsx">{`// Theme comes from context — works for any product
const { themeId } = useTheme()
const tokens = getComponentTokens(themeId)`}</CodeBlock>
          </div>
        </div>

        <Divider />

        {/* ── 9. Migration strategy ─────────────────────────────────── */}
        <SectionAnchor id="migration" />
        <H2>Migration strategy</H2>
        <Lead>
          If you are adopting the AWF token system in an existing product that uses hardcoded colors or a partial
          token setup, follow these phases in order. Each phase can be done incrementally — you do not need to migrate
          everything at once.
        </Lead>

        <InfoBox type="warning">
          Do not attempt to migrate the semantic and component layers simultaneously. Migrate primitives first,
          then semantic, then component. Mixing layers during migration leads to unresolvable references.
        </InfoBox>

        <PhaseTag n={0} label="Audit — inventory your current values" />
        <P>Before writing any token, audit your current codebase to understand what values exist.</P>
        <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: 24, marginBottom: 16 }}>
          <li>Search for hardcoded hex colors: <Code>grep -r "#[0-9a-fA-F]" src/</Code></li>
          <li>List all <Code>rgba(</Code> and <Code>hsl(</Code> values</li>
          <li>Identify repeated values — these become your palette steps</li>
          <li>Map each color to a role: brand, neutral, status (danger/warning/success)</li>
          <li>Count how many distinct colors exist — aim to reduce to &lt;30 primitives per brand</li>
        </ul>

        <PhaseTag n={1} label="Extract primitives" />
        <P>Define the raw color palette in <Code>primitives.json</Code>. No references at this stage — only hex values.</P>
        <CodeBlock lang="json">{`// primitives.json — start with your brand and neutral palette
{
  "color": {
    "brand": {
      "MyProduct": {
        "50":  { "$type": "color", "$value": "#f0fdf4" },
        "500": { "$type": "color", "$value": "#22c55e" },
        "600": { "$type": "color", "$value": "#16a34a" },
        "700": { "$type": "color", "$value": "#15803d" }
      }
    },
    "neutral": {
      "50":  { "$type": "color", "$value": "#f8fafc" },
      "900": { "$type": "color", "$value": "#0f172a" }
    }
  }
}`}</CodeBlock>

        <PhaseTag n={2} label="Map semantic tokens" />
        <P>Create a semantic file that maps intent names to primitives. Each semantic token name should answer: "what is this color used for?"</P>
        <CodeBlock lang="json">{`// MyProduct-Light.json — semantic mapping
{
  "color": {
    "bg": {
      "brand": {
        "default": { "$type": "color", "$value": "{color.brand.MyProduct.600}" },
        "hover":   { "$type": "color", "$value": "{color.brand.MyProduct.700}" },
        "subtle":  { "$type": "color", "$value": "{color.brand.MyProduct.50}"  }
      },
      "default": { "$type": "color", "$value": "{color.neutral.50}" }
    },
    "text": {
      "primary":  { "$type": "color", "$value": "{color.neutral.900}" },
      "on-brand": { "$type": "color", "$value": "#ffffff" }
    }
  }
}`}</CodeBlock>

        <PhaseTag n={3} label="Assign component tokens" />
        <P>Update <Code>components.json</Code> to reference semantic tokens for every component property. This is the most time-intensive phase — work component by component.</P>
        <CodeBlock lang="json">{`// components.json — assign semantic refs to each component slot
{
  "button": {
    "primary": {
      "bg": {
        "default":  { "$type": "color", "$value": "{color.bg.brand.default}" },
        "hover":    { "$type": "color", "$value": "{color.bg.brand.hover}"   },
        "disabled": { "$type": "color", "$value": "{color.bg.disabled}"      }
      },
      "color": {
        "label": { "$type": "color", "$value": "{color.text.on-brand}" }
      }
    }
  }
}`}</CodeBlock>

        <PhaseTag n={4} label="Replace hardcoded values in UI code" />
        <P>Systematically replace every hardcoded color in component files with a token lookup.</P>
        <CodeBlock lang="jsx">{`// Before migration:
<button style={{ background: '#16a34a', color: '#fff' }}>
  Save
</button>

// After migration:
const tokens = getComponentTokens(themeId)
<button style={{
  background: tokens['button.primary.bg.default'],
  color:      tokens['button.primary.color.label'],
}}>
  Save
</button>`}</CodeBlock>
        <P>Work file by file and test visually at each step. Use your Phase 0 audit list to track progress.</P>

        <PhaseTag n={5} label="Test and validate" />
        <P>Run all tokens through the resolver and verify the output visually across all themes.</P>
        <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: 24, marginBottom: 16 }}>
          <li>Call <Code>getComponentTokens(themeId)</Code> for every registered theme and log <Code>undefined</Code> values — these indicate broken references</li>
          <li>Render a component "cheatsheet" page showing all components across all themes simultaneously</li>
          <li>Check contrast ratios: text-on-brand tokens must meet WCAG AA (4.5:1)</li>
          <li>Verify dark mode (if applicable): repeat the same audit for dark semantic files</li>
          <li>Remove all hardcoded values from the original audit — zero remaining is the goal</li>
        </ul>

        <InfoBox type="planned">
          A future CLI tool is planned that will automate the Phase 0 audit and generate a report of all hardcoded values
          found in the codebase, mapped to their nearest token equivalent.
        </InfoBox>

        <div style={{ marginTop: 48, padding: '20px 24px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--stroke-primary)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Related</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/guides/theming" style={{ fontSize: 13, color: 'var(--brand-600)', textDecoration: 'none' }}>← Theming Guide</Link>
            <Link to="/foundations/tokens" style={{ fontSize: 13, color: 'var(--brand-600)', textDecoration: 'none' }}>Token Architecture →</Link>
          </div>
        </div>

      </div>

      {/* ── TOC sidebar ──────────────────────────────────────────── */}
      <aside style={{
        width: 200, flexShrink: 0, position: 'sticky', top: 'calc(var(--topnav-height) + 32px)',
        alignSelf: 'flex-start', padding: '48px 24px 0 0',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>
          On this page
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TOC.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none', padding: '4px 8px', borderRadius: 4, transition: 'all 100ms' }}
              onMouseEnter={e => { e.target.style.color = 'var(--brand-600)'; e.target.style.background = 'var(--brand-50)' }}
              onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent' }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <BrandThemeSwitcher />
      </aside>

    </div>
  )
}
