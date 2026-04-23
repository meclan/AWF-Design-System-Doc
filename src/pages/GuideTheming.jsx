import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { THEMES, getSemanticTokens } from '../data/tokens/index.js'
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
      <button onClick={copy} style={{ position: 'absolute', top: lang ? 36 : 8, right: 8, padding: '3px 8px', fontSize: 10, borderRadius: 4, border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: '#94a3b8', cursor: 'pointer' }}>
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}

function DoBox({ children }) {
  return (
    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid #16a34a', borderRadius: 8, padding: '14px 18px', marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#16a34a', marginBottom: 8 }}>✓ Do</div>
      <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}

function DontBox({ children }) {
  return (
    <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderLeft: '4px solid #dc2626', borderRadius: 8, padding: '14px 18px', marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#dc2626', marginBottom: 8 }}>✕ Don't</div>
      <div style={{ fontSize: 13, color: '#991b1b', lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}

function InfoBox({ children, type = 'info' }) {
  const styles = {
    info:    { bg: '#eff6ff', border: '#bfdbfe', left: '#2563eb', text: '#1e40af', label: 'ℹ Note' },
    warning: { bg: '#fffbeb', border: '#fde68a', left: '#d97706', text: '#92400e', label: '⚠ Important' },
    planned: { bg: '#faf5ff', border: '#e9d5ff', left: '#7c3aed', text: '#5b21b6', label: '◷ Planned' },
  }
  const s = styles[type]
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderLeft: `4px solid ${s.left}`, borderRadius: 8, padding: '14px 18px', marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: s.left, marginBottom: 6 }}>{s.label}</div>
      <div style={{ fontSize: 13, color: s.text, lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}

function StatusPill({ label, type }) {
  const colors = { live: { bg: '#f0fdf4', text: '#16a34a' }, planned: { bg: '#faf5ff', text: '#7c3aed' }, wip: { bg: '#fffbeb', text: '#d97706' } }
  const c = colors[type] || colors.live
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.text, background: c.bg, padding: '2px 8px', borderRadius: 99 }}>
      {label}
    </span>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--stroke-primary)', margin: '40px 0' }} />
}

// ─── Table of contents ────────────────────────────────────────────────────────

const TOC = [
  { id: 'model',      label: 'The AWF theming model' },
  { id: 'themes',     label: 'Available themes' },
  { id: 'designers',  label: 'For designers (Figma)' },
  { id: 'developers', label: 'For developers' },
  { id: 'multi',      label: 'Multi-product logic' },
  { id: 'rules',      label: "Do's & Don'ts" },
  { id: 'mistakes',   label: 'Common mistakes' },
]

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GuideTheming() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const semanticTokens = getSemanticTokens(activeTheme)
  const brandSamples = ['color.bg.brand.default', 'color.bg.brand.strong', 'color.bg.brand.subtle', 'color.bg.brand.subtlest']

  return (
    <div style={{ display: 'flex', gap: 40, maxWidth: 1060, margin: '0 auto', padding: '48px 40px 80px' }}>

      {/* Main content */}
      <article style={{ flex: 1, minWidth: 0 }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--brand-600)', marginBottom: 12 }}>Guides</div>
          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-.6px', color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.1 }}>
            Theming Guide
          </h1>
          <Lead>
            AWF supports multiple product themes from a single shared component library.
            This guide explains how the theming model works, how to apply themes in Figma and code,
            and what rules to follow to keep your implementation consistent and maintainable.
          </Lead>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 99, border: '1px solid var(--stroke-primary)' }}>For Designers</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 99, border: '1px solid var(--stroke-primary)' }}>For Developers</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 99, border: '1px solid var(--stroke-primary)' }}>Multi-product</span>
          </div>
        </div>

        {/* ── Section 1: Model ─────────────────────────────────────────── */}
        <SectionAnchor id="model" />
        <H2>The AWF theming model</H2>
        <Lead>
          AWF uses a <strong>three-layer token architecture</strong>. Only the middle layer — semantic tokens — changes between products.
          The primitive and component layers are fully shared across every theme.
        </Lead>

        <P>
          When a user switches from DOT Anonymizer to CoChecker, only the semantic token set swaps — the entire component library renders correctly without any code changes. This is the core promise of the AWF theming model.
        </P>

        <InfoBox type="info">
          The full structural breakdown — layer diagram, token counts, naming convention, and resolution flow — lives in <Link to="/foundations/tokens" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>Foundations → Token Architecture</Link>. This guide focuses on <em>how to apply</em> themes; the Foundations page is the structural reference.
        </InfoBox>

        <Divider />

        {/* ── Section 2: Available themes ──────────────────────────────── */}
        <SectionAnchor id="themes" />
        <H2>Available themes</H2>
        <Lead>
          AWF currently ships with six product light themes. Dark mode and an accessible theme are in active planning.
        </Lead>

        {/* Theme table */}
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Product</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Theme ID</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Brand colour</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {VISIBLE_THEMES.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < VISIBLE_THEMES.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{t.label}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{t.id}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 5, background: t.color, border: '1px solid var(--stroke-primary)' }} />
                      <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-tertiary)' }}>{t.color}</code>
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px' }}><StatusPill label="Light · Live" type="live" /></td>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid var(--stroke-primary)', background: 'var(--bg-subtle)' }}>
                <td style={{ padding: '10px 16px', color: 'var(--text-tertiary)', fontStyle: 'italic' }} colSpan={2}>All products</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Per-product palette</td>
                <td style={{ padding: '10px 16px' }}><StatusPill label="Dark · Planned" type="planned" /></td>
              </tr>
              <tr style={{ background: 'var(--bg-subtle)' }}>
                <td style={{ padding: '10px 16px', color: 'var(--text-tertiary)', fontStyle: 'italic' }} colSpan={2}>All products</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>High-contrast palette</td>
                <td style={{ padding: '10px 16px' }}><StatusPill label="Accessible · Planned" type="planned" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <H3>Dark mode — how it will work</H3>
        <P>
          Dark mode will be a new semantic token set layered on top of each product's existing primitive palette.
          The component layer stays completely unchanged — only semantic tokens will have a dark variant.
          The theme ID will follow the pattern <Code>dot-dark</Code>, <Code>drops-dark</Code>, etc.
        </P>

        <H3>Accessible theme — how it will work</H3>
        <P>
          The accessible theme will use higher-contrast values for all interactive, status, and focus tokens to meet WCAG 2.1 AA (and AA+ for critical states).
          It is designed for users with colour vision deficiencies and will be togglable independently of the product theme.
        </P>

        <InfoBox type="planned">
          Dark mode and the accessible theme are not yet available in the token source files. The semantic JSON structure is designed to accommodate them — adding a new mode requires only a new JSON file and a one-line registry entry.
        </InfoBox>

        <Divider />

        {/* ── Section 3: Designers ─────────────────────────────────────── */}
        <SectionAnchor id="designers" />
        <H2>For designers — Figma</H2>
        <Lead>
          AWF themes are distributed as Figma Variables. Every component in the Figma library is connected to these variables, so switching a product theme updates the entire file instantly.
        </Lead>

        <H3>Applying a theme in Figma</H3>
        <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            { step: '1', text: 'Open the Figma file for the product you are designing.' },
            { step: '2', text: 'Click the canvas (deselect all). In the right panel, find the Variables section under "Local variables".' },
            { step: '3', text: 'Select the semantic mode matching your product (e.g. "DOT Light"). The entire file updates immediately.' },
            { step: '4', text: 'Verify that all components render correctly — especially status colours (success, warning, error) and brand surfaces.' },
          ].map(item => (
            <li key={item.step} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, display: 'flex', gap: 12 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--brand-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{item.step}</span>
              {item.text}
            </li>
          ))}
        </ol>

        <H3>Variable naming in Figma</H3>
        <P>
          Figma Variables follow the same dot-notation as the JSON token source. The variable group hierarchy mirrors the token structure:
        </P>
        <CodeBlock lang="figma variable path">
{`color/bg/brand/default   →  color.bg.brand.default
color/text/primary       →  color.text.primary
button/filled/bg/default →  button.filled.bg.default`}
        </CodeBlock>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          <DoBox>
            <strong>Use Figma Variables for all colour decisions.</strong>
            {' '}Variables auto-update when switching themes — you get correct values for free.
          </DoBox>
          <DontBox>
            <strong>Do not detach values from Variables.</strong>
            {' '}Hardcoding hex values in Figma breaks theme switching and creates divergence from the token source.
          </DontBox>
          <DoBox>
            <strong>Test your design in all product themes.</strong>
            {' '}A layout that looks fine in DOT may have contrast issues in Discover (yellow brand).
          </DoBox>
          <DontBox>
            <strong>Do not use primitive variables directly.</strong>
            {' '}Never pick from <Code>color/brand/DOT/600</Code> — always use semantic variables like <Code>color/bg/brand/default</Code>.
          </DontBox>
        </div>

        <Divider />

        {/* ── Section 4: Developers ────────────────────────────────────── */}
        <SectionAnchor id="developers" />
        <H2>For developers — app-level wiring</H2>
        <Lead>
          This section covers the high-level shape of a themed AWF app. For the complete API surface
          (function signatures, CSS variables, adding a theme, migration strategy), see
          {' '}<Link to="/guides/tokens" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>Token Usage</Link>.
        </Lead>

        <H3>Providing a theme through context</H3>
        <P>
          For applications that need to switch themes at runtime (e.g. based on user settings or the current product module), wrap your component tree in a theme context at the application root:
        </P>
        <CodeBlock lang="javascript">
{`// ThemeContext.js
import { getComponentTokens } from 'data/tokens'
const ThemeContext = React.createContext(null)

export function ThemeProvider({ productId, children }) {
  const tokens = getComponentTokens(productId)
  return (
    <ThemeContext.Provider value={tokens}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTokens = () => React.useContext(ThemeContext)

// In a component:
function PrimaryButton({ label }) {
  const tokens = useTokens()
  return (
    <button style={{ background: tokens['button.filled.bg.default'] }}>
      {label}
    </button>
  )
}`}
        </CodeBlock>

        <InfoBox type="info">
          One theme context at the application root. Resolved tokens are cached per theme ID — no runtime overhead after the first render.
        </InfoBox>

        <H3>Live token preview — switch theme</H3>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--stroke-primary)', background: 'var(--bg-secondary)', overflowX: 'auto' }}>
            {VISIBLE_THEMES.map(t => (
              <button key={t.id} onClick={() => setActiveTheme(t.id)} style={{ padding: '8px 16px', fontSize: 12, fontWeight: activeTheme === t.id ? 600 : 400, color: activeTheme === t.id ? t.color : 'var(--text-secondary)', borderBottom: activeTheme === t.id ? `2px solid ${t.color}` : '2px solid transparent', background: 'transparent', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, display: 'inline-block', flexShrink: 0 }} />
                {t.id}
              </button>
            ))}
          </div>
          <div style={{ padding: '16px', background: 'var(--bg-primary)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {brandSamples.filter(k => semanticTokens[k]).map(key => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'var(--bg-secondary)', borderRadius: 7 }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: semanticTokens[key], border: '1px solid var(--stroke-primary)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-secondary)' }}>{key}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-tertiary)' }}>{semanticTokens[key]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          <DoBox>
            <strong>Always derive colours from tokens.</strong>
            {' '}Use <Code>tokens['button.filled.bg.default']</Code>, never <Code>#0077C8</Code>.
          </DoBox>
          <DontBox>
            <strong>Do not call <Code>getComponentTokens()</Code> inside render for every component.</strong>
            {' '}Call it once at the app level or in a context — results are cached but the lookup still has overhead.
          </DontBox>
        </div>

        <Divider />

        {/* ── Section 5: Multi-product ─────────────────────────────────── */}
        <SectionAnchor id="multi" />
        <H2>Multi-product logic</H2>
        <Lead>
          Each ARCAD product has exactly one theme. Follow these rules when building cross-product features or embedding widgets.
        </Lead>

        <H3>One product = one theme ID</H3>
        <P>
          The theme ID maps directly to the product context. Determine it from the application shell, not from user preferences or component props.
        </P>
        <CodeBlock lang="javascript">
{`// Good — derive theme from app config
const productId = appConfig.product // 'dot' | 'drops' | ...
const tokens    = getComponentTokens(productId)

// Bad — do not let individual components choose their theme
function MyButton({ theme }) {               // ← don't do this
  const tokens = getComponentTokens(theme)   // ← don't do this
}`}
        </CodeBlock>

        <H3>Embedding cross-product widgets</H3>
        <P>
          If a feature from Product A is embedded inside Product B's UI, it should render with Product B's theme.
          There is only one active theme context per viewport — do not nest theme providers.
        </P>

        <H3>Shared infrastructure components</H3>
        <P>
          Infrastructure-level components (login page, error boundary, maintenance screen) that appear before the product context is known should use the DOT theme as the default. It is the primary corporate identity.
        </P>

        <Divider />

        {/* ── Section 6: Rules ─────────────────────────────────────────── */}
        <SectionAnchor id="rules" />
        <H2>Design &amp; process Do's &amp; Don'ts</H2>
        <Lead>
          These are the high-level design and team-workflow rules. For the code-level rules
          (API usage, token references in JSON), see{' '}
          <Link to="/guides/tokens#rules" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>Token Usage → Do / Don't rules</Link>.
        </Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          <DoBox>Design and test every new component against all 6 product themes before shipping. A layout that works in DOT blue can fail contrast in Discover yellow.</DoBox>
          <DontBox>Assume DOT is the only theme, or hardcode product colours in CSS / inline styles / design files.</DontBox>
          <DoBox>Keep the theme ID at the application root and pass tokens down via context.</DoBox>
          <DontBox>Let individual components or pages pick their own theme. One viewport = one active theme.</DontBox>
          <DoBox>Contribute new tokens to the source JSON and let the resolver handle all themes.</DoBox>
          <DontBox>Create one-off per-product CSS overrides. If a component looks wrong in a theme, fix the token, not the component.</DontBox>
          <DoBox>Use the semantic token name to communicate design intent in PRs and design reviews.</DoBox>
          <DontBox>Override component tokens with magic hex values. All exceptions require a new token.</DontBox>
        </div>

        <Divider />

        {/* ── Section 7: Common design mistakes ────────────────────────── */}
        <SectionAnchor id="mistakes" />
        <H2>Common design &amp; process mistakes</H2>
        <Lead>
          Patterns we've seen break theming over time — all at the design/team-workflow level.
          For code-level anti-patterns (hardcoded hex, wrong token layer, missed caching), see{' '}
          <Link to="/guides/tokens#mistakes" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>Token Usage → Common mistakes</Link>.
        </Lead>

        {[
          {
            title: '1. Designing only in DOT and never testing other themes',
            why: 'Discover uses a yellow brand (#F6AE40) and Drops uses purple. A design reviewed only in DOT\'s blue may fail WCAG contrast on other brand surfaces. Always verify in all 6 themes before shipping — at design-review time, not at QA time.',
          },
          {
            title: '2. Detaching values from Figma Variables',
            why: 'Hardcoding a hex in Figma breaks theme switching for every screen it touches. Always select from Variables (the semantic layer), never paste a raw hex.',
          },
          {
            title: '3. Using primitive variables directly in designs',
            why: 'Primitives like color/brand/DOT/600 have no semantic meaning — they exist only to feed semantic tokens. Picking them in Figma or code creates implicit DOT-only dependencies that are invisible until another theme is applied.',
          },
          {
            title: '4. Mixing theme contexts in a single viewport',
            why: 'One product page has one active theme. Nesting theme providers (header in DOT, sidebar in CoChecker) looks interesting in mocks but creates visual inconsistency and extremely hard-to-debug layouts.',
          },
          {
            title: '5. Introducing one-off per-product CSS overrides',
            why: 'If a component looks wrong in a specific theme, the fix is always at the token level — either the component token (wrong semantic reference), the semantic token (wrong primitive), or a new primitive. Per-product CSS defeats the three-layer model entirely.',
          },
        ].map(item => (
          <div key={item.title} style={{ marginBottom: 24 }}>
            <H3>{item.title}</H3>
            <P>{item.why}</P>
          </div>
        ))}

      </article>

      {/* ── Sticky TOC ───────────────────────────────────────────────────── */}
      <aside style={{ width: 176, flexShrink: 0, alignSelf: 'flex-start', position: 'sticky', top: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>On this page</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TOC.map(item => (
            <a key={item.id} href={`#${item.id}`} style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none', padding: '4px 8px', borderRadius: 5, borderLeft: '2px solid transparent', transition: 'all 100ms' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand-600)'; e.currentTarget.style.borderLeftColor = 'var(--brand-600)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderLeftColor = 'transparent' }}>
              {item.label}
            </a>
          ))}
        </nav>
        <div style={{ marginTop: 24, padding: '12px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--stroke-primary)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Related</div>
          <Link to="/foundations/tokens" style={{ fontSize: 12, color: 'var(--brand-600)', display: 'block', marginBottom: 4 }}>Token Architecture</Link>
          <Link to="/guides/tokens" style={{ fontSize: 12, color: 'var(--brand-600)', display: 'block' }}>Token Usage →</Link>
        </div>
      </aside>

    </div>
  )
}
