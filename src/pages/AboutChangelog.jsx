import React from 'react'
import { Link } from 'react-router-dom'
import {
  PageShell, SectionAnchor, H2, P, Code, InfoBox,
} from '../components/DocPrims.jsx'

// ─── Data ────────────────────────────────────────────────────────────────────
// Each entry becomes a section in the TOC. `type` drives the coloured pill.
// Add new releases at the top.

const RELEASES = [
  {
    id: 'v0-4-0',
    version: '0.4.0',
    date: '2026-04-23',
    tag: 'current',
    summary: 'Documentation site polish: canonical TOC, scroll-spy, About & Guides content.',
    changes: [
      { type: 'added',   text: 'About → Introduction page with full overview of AWF, principles, architecture, and product list.' },
      { type: 'added',   text: 'About → Changelog page (you are here).' },
      { type: 'added',   text: 'Guides → Getting Started page with install, theme provider setup, and first-component example.' },
      { type: 'added',   text: 'Scroll-spy on all Foundations pages — the right-side TOC now highlights the current section as you scroll.' },
      { type: 'added',   text: 'Automatic scroll reset when navigating between component pages (e.g. Checkbox → Toggle).' },
      { type: 'fixed',   text: 'inputfield.filled-brand.container.stroke.focused token now resolves correctly per theme (was stuck at #9fefff).' },
      { type: 'fixed',   text: 'TablePage and DatePickerPage no longer render blank — removed orphan themeIdx / themeId references left over from the rename.' },
      { type: 'changed', text: 'Every component page now uses the canonical right-aside TOC style (matches SpinnerPage).' },
    ],
  },
  {
    id: 'v0-3-0',
    version: '0.3.0',
    date: '2026-04-16',
    tag: 'minor',
    summary: 'Component page standardisation — 17 pages brought to the canonical layout.',
    changes: [
      { type: 'added',   text: 'Canonical right-side sticky TOC + BrandThemeSwitcher across 17 component pages.' },
      { type: 'added',   text: 'TooltipPage: full documentation with placements, content guidance, and accessibility notes.' },
      { type: 'changed', text: 'TextFieldPage, TextAreaPage, SelectPage: full rewrite around the component-token reference model.' },
      { type: 'changed', text: 'SkeletonPage and SpinnerPage now share a unified feedback-component layout.' },
      { type: 'changed', text: 'BrandThemeSwitcher extracted to a shared component so every page uses identical theme controls.' },
    ],
  },
  {
    id: 'v0-2-0',
    version: '0.2.0',
    date: '2026-03-02',
    tag: 'minor',
    summary: 'Foundations pages and the Token Architecture reference.',
    changes: [
      { type: 'added',   text: 'Foundations → Token Architecture with three-layer diagram and resolution walkthrough.' },
      { type: 'added',   text: 'Foundations → Color, Typography, Spacing, Elevation, Motion, Icons.' },
      { type: 'added',   text: 'Guides → Theming Guide and Token Usage.' },
      { type: 'added',   text: 'Shared DocPrims primitives (SectionAnchor, H2/H3, Lead, P, Code, CodeBlock, InfoBox, Do/DontBox, PageShell).' },
      { type: 'changed', text: 'Navigation sidebar now reflects Foundations / Guides / About top-level split.' },
    ],
  },
  {
    id: 'v0-1-0',
    version: '0.1.0',
    date: '2026-01-20',
    tag: 'initial',
    summary: 'First internal release — component catalogue and theme switcher.',
    changes: [
      { type: 'added', text: 'Initial component catalogue (22 families) with live demos.' },
      { type: 'added', text: 'Brand theme switcher covering the 6 product themes: DOT, Discover, Drops, CoChecker, MR Connector, Verifier.' },
      { type: 'added', text: 'Token pipeline: primitives → semantic → component, resolved at build time.' },
      { type: 'added', text: 'Home page with stats, quick links, and product chips.' },
    ],
  },
]

const TOC = RELEASES.map(r => ({ id: r.id, label: `v${r.version}` }))

const RELATED = [
  { to: '/about',                   label: 'Introduction →' },
  { to: '/guides/getting-started',  label: 'Getting Started →' },
]

// ─── Presentational helpers ──────────────────────────────────────────────────

const CHANGE_STYLES = {
  added:   { bg: '#f0fdf4', text: '#166534', label: 'Added'   },
  changed: { bg: '#eff6ff', text: '#1e40af', label: 'Changed' },
  fixed:   { bg: '#fffbeb', text: '#92400e', label: 'Fixed'   },
  removed: { bg: '#fff1f2', text: '#991b1b', label: 'Removed' },
  planned: { bg: '#faf5ff', text: '#5b21b6', label: 'Planned' },
}

function ChangePill({ type }) {
  const s = CHANGE_STYLES[type] || CHANGE_STYLES.added
  return (
    <span style={{
      display: 'inline-block', flexShrink: 0,
      width: 68, textAlign: 'center',
      fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
      color: s.text, background: s.bg,
      padding: '2px 0', borderRadius: 4,
    }}>{s.label}</span>
  )
}

const TAG_STYLES = {
  current: { bg: '#16a34a', text: '#fff',       label: 'Current' },
  minor:   { bg: 'var(--bg-secondary)', text: 'var(--text-secondary)', label: 'Minor' },
  initial: { bg: '#7c3aed', text: '#fff',       label: 'Initial' },
}

function VersionTag({ tag }) {
  const s = TAG_STYLES[tag] || TAG_STYLES.minor
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
      color: s.text, background: s.bg,
      padding: '3px 9px', borderRadius: 99,
    }}>{s.label}</span>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AboutChangelog() {
  return (
    <PageShell
      eyebrow="About"
      title="Changelog"
      lead="Every notable change to the AWF documentation site and the underlying token pipeline. Releases follow semantic versioning at the docs-site level — the pre-1.0 numbering reflects an evolving internal deliverable."
      toc={TOC}
      relatedLinks={RELATED}
    >
      <InfoBox type="info">
        This changelog covers the AWF documentation site (the website you're reading). The
        underlying token JSON and Figma Variables are versioned separately — see{' '}
        <Link to="/foundations/tokens" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>
          Foundations → Token Architecture
        </Link>
        {' '}for the token pipeline versioning model.
      </InfoBox>

      {RELEASES.map(release => (
        <React.Fragment key={release.id}>
          <SectionAnchor id={release.id} />

          {/* Release header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap',
            marginTop: 40, marginBottom: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <H2>v{release.version}</H2>
              <VersionTag tag={release.tag} />
            </div>
            <div style={{
              fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--text-tertiary)',
            }}>
              {release.date}
            </div>
          </div>

          <P>{release.summary}</P>

          {/* Change list */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--stroke-primary)',
            borderRadius: 10,
            padding: '8px 0',
            marginBottom: 32,
          }}>
            {release.changes.map((c, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '84px 1fr',
                alignItems: 'start',
                gap: 14,
                padding: '10px 18px',
                borderBottom: i < release.changes.length - 1 ? '1px solid var(--stroke-primary)' : 'none',
              }}>
                <div style={{ paddingTop: 2 }}><ChangePill type={c.type} /></div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {c.text}
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}

      <InfoBox type="planned">
        Upcoming: dark-mode theme variant, accessible (high-contrast) theme variant, and a Patterns
        section with form and data-table compositions. See the{' '}
        <Link to="/guides/theming#themes" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>
          Theming Guide
        </Link>{' '}
        for the planned rollout. Request a new token or flag a regression via the{' '}
        <Code>#awf-design-system</Code> channel.
      </InfoBox>
    </PageShell>
  )
}
