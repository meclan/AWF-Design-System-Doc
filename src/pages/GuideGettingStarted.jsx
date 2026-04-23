import React from 'react'
import { Link } from 'react-router-dom'
import {
  PageShell, SectionAnchor, H2, H3, P, Code, CodeBlock,
  InfoBox, DoBox, DontBox, Divider,
} from '../components/DocPrims.jsx'

const TOC = [
  { id: 'prereqs',     label: 'Prerequisites' },
  { id: 'install',     label: 'Install' },
  { id: 'provider',    label: 'Add the theme provider' },
  { id: 'first',       label: 'Your first component' },
  { id: 'switch',      label: 'Switch themes at runtime' },
  { id: 'styling',     label: 'Styling with tokens' },
  { id: 'figma',       label: 'Designers — Figma setup' },
  { id: 'checklist',   label: 'Setup checklist' },
  { id: 'troubleshoot',label: 'Troubleshooting' },
  { id: 'next',        label: 'Next steps' },
]

const RELATED = [
  { to: '/guides/theming',     label: 'Theming Guide →' },
  { to: '/guides/tokens',      label: 'Token Usage →' },
  { to: '/foundations/tokens', label: 'Token Architecture →' },
]

// ─── Presentational helpers ──────────────────────────────────────────────────

function StepNumber({ n }) {
  return (
    <span style={{
      width: 28, height: 28, borderRadius: '50%',
      background: 'var(--brand-600)', color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 700, flexShrink: 0,
    }}>{n}</span>
  )
}

function Step({ n, title, children }) {
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
      <StepNumber n={n} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

function ChecklistItem({ children }) {
  return (
    <li style={{
      listStyle: 'none',
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '8px 0',
      borderBottom: '1px solid var(--stroke-primary)',
      fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        border: '1.5px solid var(--brand-600)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--brand-600)', fontSize: 11, fontWeight: 700,
      }}>✓</span>
      {children}
    </li>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function GuideGettingStarted() {
  return (
    <PageShell
      eyebrow="Guides"
      title="Getting Started"
      lead="Install AWF in a React project, wire the theme context, and render your first themed component. This guide assumes no prior knowledge of the AWF token model."
      toc={TOC}
      relatedLinks={RELATED}
    >
      {/* ── Prerequisites ─────────────────────────────────────────────── */}
      <SectionAnchor id="prereqs" />
      <H2>Prerequisites</H2>
      <P>
        AWF targets modern React applications. To follow this guide end to end you need:
      </P>
      <ul style={{ paddingLeft: 20, marginBottom: 20, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
        <li>React <Code>18+</Code> (hooks and Suspense are used throughout).</li>
        <li>A bundler that handles ES modules — Vite, Next.js, Remix, or Webpack 5.</li>
        <li>Node.js <Code>18+</Code> for your local toolchain.</li>
        <li>Access to the ARCAD internal npm registry (see the installation section below).</li>
      </ul>

      <InfoBox type="info">
        If you are adding AWF to an existing app, you do <strong>not</strong> need to remove your current styling solution in one go. AWF components are scoped and can coexist with legacy CSS during migration.
      </InfoBox>

      <Divider />

      {/* ── Install ───────────────────────────────────────────────────── */}
      <SectionAnchor id="install" />
      <H2>Install</H2>
      <P>
        AWF is published as two internal packages. The component library depends on the tokens package, so installing both together is simplest.
      </P>

      <CodeBlock lang="bash">
{`# With npm
npm install @arcad/awf @arcad/awf-tokens

# With pnpm
pnpm add @arcad/awf @arcad/awf-tokens

# With yarn
yarn add @arcad/awf @arcad/awf-tokens`}
      </CodeBlock>

      <P>
        Then import the global stylesheet once at your application entry point. It registers the CSS variables that every AWF component reads from.
      </P>

      <CodeBlock lang="javascript">
{`// src/main.jsx (or src/index.jsx)
import '@arcad/awf/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)`}
      </CodeBlock>

      <InfoBox type="warning">
        The stylesheet must be imported <strong>before</strong> any AWF component is rendered. Import it at the top of your entry file, not inside a component.
      </InfoBox>

      <Divider />

      {/* ── Provider ──────────────────────────────────────────────────── */}
      <SectionAnchor id="provider" />
      <H2>Add the theme provider</H2>
      <P>
        AWF components read their tokens from a single context. Wrap your application in <Code>BrandThemeProvider</Code> and pass the product ID that matches your app.
      </P>

      <CodeBlock lang="javascript">
{`// src/App.jsx
import { BrandThemeProvider } from '@arcad/awf'

export default function App() {
  return (
    <BrandThemeProvider brand="dot">
      {/* your app */}
    </BrandThemeProvider>
  )
}`}
      </CodeBlock>

      <P>
        The <Code>brand</Code> prop accepts any of the following theme IDs:
      </P>

      <div style={{
        border: '1px solid var(--stroke-primary)', borderRadius: 10,
        overflow: 'hidden', marginBottom: 24,
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Product</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Theme ID</th>
            </tr>
          </thead>
          <tbody>
            {[
              { product: 'DOT Anonymizer', id: 'dot' },
              { product: 'Discover',       id: 'discover' },
              { product: 'Drops',          id: 'drops' },
              { product: 'CoChecker',      id: 'cochecker' },
              { product: 'MR Connector',   id: 'mrconnector' },
              { product: 'Verifier',       id: 'verifier' },
            ].map((row, i, arr) => (
              <tr key={row.id} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', color: 'var(--text-primary)' }}>{row.product}</td>
                <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{row.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DoBox>
        <strong>One provider at the application root.</strong>{' '}
        Pick the product ID from your app config, not from component props.
      </DoBox>
      <DontBox>
        <strong>Do not nest providers.</strong>{' '}
        One viewport = one theme. Embedded cross-product widgets should render with the host product's theme.
      </DontBox>

      <Divider />

      {/* ── First component ───────────────────────────────────────────── */}
      <SectionAnchor id="first" />
      <H2>Your first component</H2>
      <P>
        With the provider in place, any AWF component works out of the box. Here's a minimal example using <Code>Button</Code>, <Code>TextField</Code>, and <Code>Banner</Code>:
      </P>

      <CodeBlock lang="jsx">
{`import { Button, TextField, Banner } from '@arcad/awf'

function LoginForm() {
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Banner variant="info">
        Sign in with your ARCAD SSO credentials.
      </Banner>

      <TextField
        label="Email"
        type="email"
        placeholder="you@arcadsoftware.com"
      />
      <TextField
        label="Password"
        type="password"
      />

      <Button variant="filled" size="md">Sign in</Button>
    </form>
  )
}`}
      </CodeBlock>

      <P>
        That's it — the button, fields, and banner pick up the active theme automatically. Switch the <Code>brand</Code> prop on the provider and every component re-renders with the new colours.
      </P>

      <Divider />

      {/* ── Runtime switch ────────────────────────────────────────────── */}
      <SectionAnchor id="switch" />
      <H2>Switch themes at runtime</H2>
      <P>
        For apps that need to change theme without a full reload (e.g. a product-portal switcher, or a preview tool), lift the <Code>brand</Code> into state.
      </P>

      <CodeBlock lang="jsx">
{`import { useState } from 'react'
import { BrandThemeProvider, Button } from '@arcad/awf'

const THEMES = ['dot', 'discover', 'drops', 'cochecker', 'mrconnector', 'verifier']

export default function App() {
  const [brand, setBrand] = useState('dot')
  return (
    <BrandThemeProvider brand={brand}>
      <nav style={{ display: 'flex', gap: 8 }}>
        {THEMES.map(t => (
          <Button
            key={t}
            variant={brand === t ? 'filled' : 'outlined'}
            onClick={() => setBrand(t)}
          >
            {t}
          </Button>
        ))}
      </nav>
      {/* rest of app */}
    </BrandThemeProvider>
  )
}`}
      </CodeBlock>

      <InfoBox type="info">
        Token resolution is memoised per theme ID. Switching between themes is effectively free after the first render.
      </InfoBox>

      <Divider />

      {/* ── Styling ───────────────────────────────────────────────────── */}
      <SectionAnchor id="styling" />
      <H2>Styling with tokens</H2>
      <P>
        When you need custom surfaces (a page background, a bespoke card), read from the same tokens the components use. Every semantic token is exposed as a CSS variable after the stylesheet is imported.
      </P>

      <CodeBlock lang="css">
{`/* CSS variable form — works anywhere CSS is valid */
.dashboard {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-stroke-subtle);
}

.dashboard-heading {
  color: var(--color-text-brand);
  font-size: var(--font-size-lg);
}`}
      </CodeBlock>

      <P>
        From React, you can also read the resolved JS map via the <Code>useTokens()</Code> hook:
      </P>

      <CodeBlock lang="jsx">
{`import { useTokens } from '@arcad/awf'

function CustomCard({ children }) {
  const t = useTokens()
  return (
    <div style={{
      background: t['color.bg.surface'],
      color:      t['color.text.primary'],
      border:    \`1px solid \${t['color.stroke.subtle']}\`,
      borderRadius: 10,
      padding: 16,
    }}>
      {children}
    </div>
  )
}`}
      </CodeBlock>

      <DoBox>
        <strong>Always read from tokens.</strong>{' '}
        Use <Code>var(--color-bg-surface)</Code> or <Code>t['color.bg.surface']</Code>, never a raw hex.
      </DoBox>
      <DontBox>
        <strong>Do not reach into primitive tokens directly.</strong>{' '}
        Primitives like <Code>color.brand.DOT.600</Code> lock your code to a single theme. Always go through the semantic layer.
      </DontBox>

      <P>
        For the full catalogue of semantic and component tokens, see{' '}
        <Link to="/guides/tokens" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>
          Token Usage
        </Link>.
      </P>

      <Divider />

      {/* ── Figma ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="figma" />
      <H2>Designers — Figma setup</H2>
      <P>
        AWF ships a shared Figma library with Variables for every token. Enabling it takes under a minute.
      </P>

      <Step n="1" title="Enable the library">
        In Figma, open <strong>Assets → Libraries</strong> (the book icon in the left sidebar). Find <em>AWF — Arcad Web Framework</em> and toggle it on.
      </Step>
      <Step n="2" title="Select the product mode">
        Click the canvas to deselect. In the right panel, open <strong>Local variables</strong> and pick the mode that matches your product (for example <Code>DOT · Light</Code>). The canvas updates instantly.
      </Step>
      <Step n="3" title="Use semantic variables only">
        When choosing a colour, pick from the <Code>color/bg/…</Code>, <Code>color/text/…</Code>, <Code>color/stroke/…</Code> groups. Never pick a primitive from <Code>color/brand/DOT/*</Code>.
      </Step>
      <Step n="4" title="Preview in multiple themes">
        Before handoff, cycle through at least three modes to check contrast and brand-colour interactions. A yellow-brand theme (Discover) often reveals issues that DOT's blue hides.
      </Step>

      <InfoBox type="info">
        Full Figma workflow, naming conventions, and do/don't rules live in the{' '}
        <Link to="/guides/theming#designers" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>
          Theming Guide → For designers (Figma)
        </Link>.
      </InfoBox>

      <Divider />

      {/* ── Checklist ─────────────────────────────────────────────────── */}
      <SectionAnchor id="checklist" />
      <H2>Setup checklist</H2>
      <P>
        A quick self-check — if every item is true, your AWF setup is production-ready.
      </P>

      <ul style={{
        listStyle: 'none', padding: 0, margin: '0 0 24px',
        border: '1px solid var(--stroke-primary)',
        borderRadius: 10, overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}>
        <li style={{ padding: '0 16px' }}>
          <ChecklistItem><code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>@arcad/awf</code> and <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>@arcad/awf-tokens</code> are installed.</ChecklistItem>
        </li>
        <li style={{ padding: '0 16px' }}>
          <ChecklistItem>The AWF stylesheet is imported once in your entry file.</ChecklistItem>
        </li>
        <li style={{ padding: '0 16px' }}>
          <ChecklistItem><Code>BrandThemeProvider</Code> wraps your entire app at the root.</ChecklistItem>
        </li>
        <li style={{ padding: '0 16px' }}>
          <ChecklistItem>The <Code>brand</Code> prop comes from your product config — not from component-level props.</ChecklistItem>
        </li>
        <li style={{ padding: '0 16px' }}>
          <ChecklistItem>Custom styles reference semantic tokens (<Code>var(--color-bg-surface)</Code>), never raw hexes.</ChecklistItem>
        </li>
        <li style={{ padding: '0 16px', borderBottom: 'none' }}>
          <ChecklistItem>Designs have been reviewed in at least three product themes before implementation.</ChecklistItem>
        </li>
      </ul>

      <Divider />

      {/* ── Troubleshooting ───────────────────────────────────────────── */}
      <SectionAnchor id="troubleshoot" />
      <H2>Troubleshooting</H2>

      <H3>Components render unstyled or in the wrong colour</H3>
      <P>
        Most likely the stylesheet isn't loaded. Confirm <Code>import '@arcad/awf/styles.css'</Code> appears in your entry file, and that the import runs before any component mounts.
      </P>

      <H3>Brand colour does not change when I update <Code>brand</Code></H3>
      <P>
        Check that your app is wrapped in exactly one <Code>BrandThemeProvider</Code>. A second, nested provider will win for its subtree. If you've added custom CSS, look for hard-coded hex values that override the token-driven properties.
      </P>

      <H3>TypeScript says <Code>brand</Code> is not a valid prop</H3>
      <P>
        Make sure you are importing types from <Code>@arcad/awf</Code> and not from a sub-path. The package exports its types from the root entry.
      </P>

      <H3>Figma variables show the wrong mode</H3>
      <P>
        Mode is set per-file. Open the right panel, click into <strong>Local variables</strong>, and switch the mode selector at the top.
      </P>

      <Divider />

      {/* ── Next ──────────────────────────────────────────────────────── */}
      <SectionAnchor id="next" />
      <H2>Next steps</H2>
      <P>
        You've got AWF rendering in your app. From here:
      </P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { to: '/guides/theming',      label: 'Theming Guide',      desc: 'The full theming model — Figma setup, runtime switching, multi-product rules.' },
          { to: '/guides/tokens',       label: 'Token Usage',        desc: 'Full API: useTokens, CSS variables, adding a token, migration strategy.' },
          { to: '/foundations/tokens',  label: 'Token Architecture', desc: 'The three-layer model, resolution flow, and naming convention.' },
          { to: '/components',          label: 'Browse components',  desc: 'Live demos, token references, and guidance for every AWF component.' },
        ].map(link => (
          <Link key={link.to} to={link.to} style={{
            display: 'block',
            padding: '16px 18px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--stroke-primary)',
            borderRadius: 10,
            textDecoration: 'none',
            transition: 'border-color 120ms',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-600)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--stroke-primary)'}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-600)', marginBottom: 4 }}>
              {link.label} →
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {link.desc}
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  )
}
