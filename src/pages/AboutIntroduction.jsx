import React from 'react'
import { Link } from 'react-router-dom'
import {
  PageShell, SectionAnchor, H2, H3, P, Code, InfoBox, Divider,
} from '../components/DocPrims.jsx'
import { products, stats } from '../data/tokens.js'

const TOC = [
  { id: 'what',         label: 'What is AWF?' },
  { id: 'why',          label: 'Why it exists' },
  { id: 'principles',   label: 'Design principles' },
  { id: 'architecture', label: 'Architecture at a glance' },
  { id: 'products',     label: 'Products using AWF' },
  { id: 'scope',        label: 'What this site covers' },
  { id: 'audience',     label: 'Who this is for' },
  { id: 'next',         label: 'Next steps' },
]

const RELATED = [
  { to: '/guides/getting-started', label: 'Getting Started →' },
  { to: '/about/changelog',        label: 'Changelog →' },
]

// ─── Small presentational helpers specific to this page ───────────────────────

function PrincipleCard({ title, text, icon }) {
  return (
    <div style={{
      background: 'var(--bg-primary)',
      border: '1px solid var(--stroke-primary)',
      borderRadius: 10,
      padding: '18px 20px',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'var(--brand-50)', color: 'var(--brand-600)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 700, marginBottom: 10,
      }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {text}
      </div>
    </div>
  )
}

function LayerRow({ name, count, desc, color }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '120px 80px 1fr',
      alignItems: 'center',
      gap: 20,
      padding: '14px 18px',
      borderBottom: '1px solid var(--stroke-primary)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</span>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>
        {count} tokens
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {desc}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AboutIntroduction() {
  return (
    <PageShell
      eyebrow="About"
      title="Introduction"
      lead={`AWF — the Arcad Web Framework — is the unified design language and token system that powers every ARCAD product. It gives design and engineering a single source of truth for colour, typography, spacing, motion, and component behaviour across ${products.length} products.`}
      toc={TOC}
      relatedLinks={RELATED}
    >
      {/* ── What is AWF? ───────────────────────────────────────────────── */}
      <SectionAnchor id="what" />
      <H2>What is AWF?</H2>
      <P>
        AWF is a shared UI framework: a catalogue of components, a three-layer token system,
        and a set of guidelines that together define the ARCAD product experience. It is consumed
        by every product team — from DOT Anonymizer to Verifier — and rendered through a single
        component library with product-specific theming.
      </P>
      <P>
        Concretely, AWF ships with {stats.components_count} component families, {stats.components} component tokens,
        {' '}{stats.semantic} semantic tokens, and {stats.primitives} primitive tokens across {stats.modes} active modes.
        The same components render under every product theme without any code changes.
      </P>

      <Divider />

      {/* ── Why it exists ──────────────────────────────────────────────── */}
      <SectionAnchor id="why" />
      <H2>Why it exists</H2>
      <P>
        Before AWF, each ARCAD product maintained its own components, palette, and type scale. Visual
        drift was inevitable: buttons rendered differently across products, status colours diverged,
        and design reviews spent as much time on consistency as on usability.
      </P>
      <P>
        AWF centralises the parts that should be identical across products (behaviour, anatomy,
        spacing, motion) and parameterises the parts that must differ (brand colour, product identity)
        through a token layer. The goal is simple: one decision, applied everywhere.
      </P>

      <InfoBox type="info">
        AWF is not a visual reset. It preserves each product's brand personality — only the
        structural and behavioural layers are shared. A Drops button and a Verifier button have
        identical anatomy and interaction, but different brand colours.
      </InfoBox>

      <Divider />

      {/* ── Principles ─────────────────────────────────────────────────── */}
      <SectionAnchor id="principles" />
      <H2>Design principles</H2>
      <P>
        Every decision in AWF — from token naming to component API — is weighed against four principles:
      </P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
        <PrincipleCard
          icon="◆"
          title="Token-first"
          text="Nothing in a component is a raw hex or magic number. Every visual property resolves through the token pipeline, which makes theming, dark mode, and accessibility upgrades trivial."
        />
        <PrincipleCard
          icon="⎔"
          title="Product-neutral components"
          text="Components never know which product they render in. They pull from the active theme via a single context. This keeps the library small and brand switches instantaneous."
        />
        <PrincipleCard
          icon="⇅"
          title="Designer ↔ developer parity"
          text="Figma Variables and code tokens share the same names and the same semantics. A token you see in Figma is the token you reference in code."
        />
        <PrincipleCard
          icon="✓"
          title="Accessibility is a default"
          text="Focus states, colour contrast, keyboard affordances, and ARIA wiring are built into every component — not bolted on. If it ships in AWF, it meets WCAG 2.1 AA."
        />
      </div>

      <Divider />

      {/* ── Architecture ───────────────────────────────────────────────── */}
      <SectionAnchor id="architecture" />
      <H2>Architecture at a glance</H2>
      <P>
        AWF uses a three-layer token architecture. Components reference only the component layer;
        the semantic layer is the single point of per-product customisation; primitives are the raw
        palette.
      </P>

      <div style={{
        border: '1px solid var(--stroke-primary)',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 24,
        background: 'var(--bg-primary)',
      }}>
        <LayerRow
          name="Primitives"
          count={stats.primitives}
          desc="Raw values — colour scales, spacing steps, font sizes, radii. Shared across every theme."
          color="#64748b"
        />
        <LayerRow
          name="Semantic"
          count={stats.semantic}
          desc="Intent-carrying aliases (bg.brand.default, text.primary). This is the only layer that varies between products."
          color="var(--brand-600)"
        />
        <LayerRow
          name="Component"
          count={stats.components}
          desc="Per-component, per-state bindings (button.filled.bg.default). Pre-resolved; components read directly from this layer."
          color="#10b981"
        />
      </div>

      <P>
        A component asks for <Code>button.filled.bg.default</Code>. That token resolves to a
        semantic token like <Code>color.bg.brand.default</Code>, which in turn resolves to a primitive
        like <Code>color.brand.DOT.600</Code>. Switching products swaps only the semantic layer — every
        downstream token updates automatically.
      </P>

      <InfoBox type="info">
        The full technical breakdown — layer diagrams, resolution flow, naming convention — lives in{' '}
        <Link to="/foundations/tokens" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>
          Foundations → Token Architecture
        </Link>.
      </InfoBox>

      <Divider />

      {/* ── Products ───────────────────────────────────────────────────── */}
      <SectionAnchor id="products" />
      <H2>Products using AWF</H2>
      <P>
        AWF currently powers {products.length} ARCAD products. Each product has exactly one theme ID;
        the brand colour below is the semantic <Code>color.bg.brand.default</Code> for that theme.
      </P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
        {products.map(p => (
          <div key={p.name} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--stroke-primary)',
            borderRadius: 10,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: p.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
              <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-tertiary)' }}>{p.color}</div>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Site scope ─────────────────────────────────────────────────── */}
      <SectionAnchor id="scope" />
      <H2>What this site covers</H2>
      <P>
        This documentation site is the canonical reference for everything shipped under AWF. It is
        organised into five top-level sections:
      </P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'About',       desc: 'The why behind AWF, the changelog, and this overview.' },
          { label: 'Guides',      desc: 'Step-by-step playbooks: getting started, theming, token usage.' },
          { label: 'Foundations', desc: 'Structural reference — token architecture, colour, typography, spacing, elevation, motion, icons.' },
          { label: 'Components',  desc: `All ${stats.components_count} component families with live demos, token references, guidance, and accessibility notes.` },
          { label: 'Patterns',    desc: 'Higher-level compositions: forms, data tables, empty states, error handling. Work in progress.' },
        ].map(row => (
          <div key={row.label} style={{
            display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16,
            padding: '10px 14px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--stroke-primary)',
            borderRadius: 8,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{row.desc}</span>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Audience ───────────────────────────────────────────────────── */}
      <SectionAnchor id="audience" />
      <H2>Who this is for</H2>

      <H3>Designers</H3>
      <P>
        You'll find the Figma Variables model, component anatomy, and do/don't rules for every
        component. Every token you see here has a 1:1 mapping to a Figma Variable — the same name,
        the same semantics.
      </P>

      <H3>Developers</H3>
      <P>
        You'll find installable packages, runtime APIs for switching themes, and full token
        references. Every component page includes a working demo and a token table you can copy
        from. Start with{' '}
        <Link to="/guides/getting-started" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>Getting Started</Link>.
      </P>

      <H3>Product managers & stakeholders</H3>
      <P>
        The About and Foundations sections give the business context — what AWF is, which products
        use it, and how theming scales across the ARCAD portfolio.
      </P>

      <Divider />

      {/* ── Next steps ─────────────────────────────────────────────────── */}
      <SectionAnchor id="next" />
      <H2>Next steps</H2>
      <P>
        Pick the path that matches your role:
      </P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { to: '/guides/getting-started', label: 'Getting Started',     desc: 'Install AWF in a React project and render your first themed component.' },
          { to: '/guides/theming',         label: 'Theming Guide',       desc: 'Apply product themes in Figma and in code. Dark mode and accessible theme plans.' },
          { to: '/foundations/tokens',     label: 'Token Architecture',  desc: 'The full three-layer model: diagrams, resolution flow, naming convention.' },
          { to: '/components',             label: 'Browse components',   desc: `All ${stats.components_count} component families with live demos and token references.` },
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
