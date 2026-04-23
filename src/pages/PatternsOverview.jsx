import React from 'react'
import { Link } from 'react-router-dom'
import {
  PageShell, SectionAnchor, H2, H3, P, Code, InfoBox, Divider,
} from '../components/DocPrims.jsx'

const TOC = [
  { id: 'what',           label: 'What is a pattern?' },
  { id: 'vs-components',  label: 'Patterns vs components' },
  { id: 'catalog',        label: 'Pattern catalog' },
  { id: 'forms',          label: 'Forms & validation' },
  { id: 'data',           label: 'Data display & tables' },
  { id: 'empty',          label: 'Empty & loading states' },
  { id: 'errors',         label: 'Error handling' },
  { id: 'navigation',     label: 'Navigation & wayfinding' },
  { id: 'feedback',       label: 'Feedback & confirmation' },
  { id: 'contribute',     label: 'Contributing a pattern' },
]

const RELATED = [
  { to: '/components',         label: 'Browse components →' },
  { to: '/guides/theming',     label: 'Theming Guide →' },
  { to: '/foundations/tokens', label: 'Token Architecture →' },
]

// ─── Data ────────────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  live:    { bg: '#f0fdf4', text: '#16a34a', label: 'Live'     },
  draft:   { bg: '#fffbeb', text: '#d97706', label: 'Draft'    },
  planned: { bg: '#faf5ff', text: '#7c3aed', label: 'Planned'  },
}

const PATTERNS = [
  {
    id: 'forms',
    title: 'Forms & validation',
    status: 'draft',
    summary: 'End-to-end form composition — labels, helper text, inline validation, submit flows, and multi-step wizards.',
    uses: ['TextField', 'Select', 'Checkbox', 'Radio', 'Button', 'Banner', 'Stepper'],
    rules: [
      'Label every input — never rely on placeholder text alone.',
      'Show validation inline at the field level; summarise at the top for long forms.',
      'Disable the submit button only after a destructive click; use inline validation before.',
      'Group related fields with a Fieldset and a short heading.',
      'Confirm destructive submissions with a Modal, never a native browser dialog.',
    ],
  },
  {
    id: 'data',
    title: 'Data display & tables',
    status: 'draft',
    summary: 'Composing Table, Pagination, Filters, and bulk actions into a complete data experience.',
    uses: ['Table', 'Pagination', 'Tag', 'SearchBar', 'Select', 'IconButton', 'Modal'],
    rules: [
      'Default column widths should fit the 95th-percentile value; allow manual resize for outliers.',
      'Put bulk-action controls in a sticky bar that appears on selection — not a separate toolbar.',
      'Show the total row count next to the page indicator, not inside the pagination.',
      'Use Skeletons during initial load and a Spinner during page transitions.',
      'Empty table states must include a primary action (e.g. "Add your first record").',
    ],
  },
  {
    id: 'empty',
    title: 'Empty & loading states',
    status: 'draft',
    summary: 'First-time, filtered-empty, and loading states that avoid dead-ends and feel alive.',
    uses: ['Skeleton', 'Spinner', 'Button', 'Card'],
    rules: [
      'Distinguish first-time empty ("no data yet") from filter empty ("no results") — they need different actions.',
      'Skeletons for predictable shapes (lists, tables, cards); Spinners for unknown-duration work.',
      'Keep copy short and human. "Nothing here yet." beats "No records match the current filter criteria."',
      'Always offer a next step — a CTA, a docs link, or a clear-filter button.',
    ],
  },
  {
    id: 'errors',
    title: 'Error handling',
    status: 'draft',
    summary: 'Network failures, form errors, permission denials, and unrecoverable errors — each with the right pattern.',
    uses: ['Banner', 'Toast', 'Modal', 'Button'],
    rules: [
      'Toast for transient, recoverable errors ("Failed to save — retry?").',
      'Banner for persistent, page-level errors that block the user\'s current task.',
      'Modal for errors that require a decision (confirm, cancel, escalate).',
      'Never blame the user — describe what happened and what they can do next.',
      'Log the technical detail; show the user an actionable summary.',
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation & wayfinding',
    status: 'planned',
    summary: 'Top nav, side panels, breadcrumbs, and in-page section navigation working together.',
    uses: ['Navbar', 'SidePanel', 'Breadcrumbs', 'Tabs', 'SectionNav'],
    rules: [
      'A user should always know where they are (breadcrumbs), where they can go (nav), and how to get back (back link or breadcrumb root).',
      'Limit breadcrumbs to three levels. Collapse with an ellipsis beyond that.',
      'Use Tabs for sibling views of the same thing; use Navbar for distinct sections.',
      'SectionNav on long pages (800 px+ of content) — anchored to the right on desktop.',
    ],
  },
  {
    id: 'feedback',
    title: 'Feedback & confirmation',
    status: 'planned',
    summary: 'Confirmations, undo patterns, and progress feedback for long-running operations.',
    uses: ['Toast', 'Modal', 'Banner', 'Spinner', 'Button'],
    rules: [
      'Confirm only truly destructive actions — save, edit, and most creates should not prompt.',
      'Prefer Undo (in a Toast) over a Confirm modal when reversal is cheap.',
      'For long-running work, show determinate progress if possible; indeterminate only as a fallback.',
      'Close the loop: every user action gets explicit feedback within 300 ms, even if the work is still in flight.',
    ],
  },
]

// ─── Presentational helpers ──────────────────────────────────────────────────

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.planned
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
      color: s.text, background: s.bg,
      padding: '3px 9px', borderRadius: 99,
    }}>{s.label}</span>
  )
}

function UsesChip({ name }) {
  return (
    <code style={{
      fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
      background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
      padding: '2px 8px', borderRadius: 4,
      border: '1px solid var(--stroke-primary)',
    }}>{name}</code>
  )
}

function PatternCard({ pattern }) {
  return (
    <div style={{
      border: '1px solid var(--stroke-primary)',
      borderRadius: 12,
      background: 'var(--bg-primary)',
      padding: '20px 22px',
      marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {pattern.title}
        </h3>
        <StatusPill status={pattern.status} />
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>
        {pattern.summary}
      </p>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>
          Built from
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {pattern.uses.map(c => <UsesChip key={c} name={c} />)}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>
          Key rules
        </div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {pattern.rules.map(r => (
            <li key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <span style={{ color: 'var(--brand-600)', flexShrink: 0, fontWeight: 700 }}>·</span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PatternsOverview() {
  return (
    <PageShell
      eyebrow="Patterns"
      title="Patterns"
      lead="Patterns describe how AWF components compose into complete user experiences. Where a component answers ‘what is a button?’, a pattern answers ‘how do we build a form?’, ‘how do we handle empty states?’, or ‘how do we confirm a destructive action?’"
      toc={TOC}
      relatedLinks={RELATED}
    >
      {/* ── What is a pattern? ─────────────────────────────────────────── */}
      <SectionAnchor id="what" />
      <H2>What is a pattern?</H2>
      <P>
        A pattern is a <strong>reusable composition</strong> of two or more components, plus the
        behavioural and content rules that make them work together. It is the layer between
        individual components and full product features — where consistency across teams matters
        most.
      </P>
      <P>
        A pattern is not a component. You won't import it from <Code>@arcad/awf</Code>. Instead,
        each pattern page documents the components involved, how to connect them, when to use
        this pattern vs another, and the copy / accessibility rules that go with it.
      </P>

      <InfoBox type="info">
        The Patterns section is being actively built out. Draft patterns below are reference
        material — detailed pages with full examples will land over the next few releases.
        Follow the{' '}
        <Link to="/about/changelog" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>changelog</Link>
        {' '}for updates.
      </InfoBox>

      <Divider />

      {/* ── Patterns vs components ─────────────────────────────────────── */}
      <SectionAnchor id="vs-components" />
      <H2>Patterns vs components</H2>
      <P>
        Two systems, two scopes. Know which one you need before you start designing.
      </P>

      <div style={{
        border: '1px solid var(--stroke-primary)', borderRadius: 10,
        overflow: 'hidden', marginBottom: 24,
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Dimension</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Components</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Patterns</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Scope',         'Single UI element',                 'Composition of multiple elements'],
              ['Answer',        '"What does a button look like?"',   '"How do we confirm a destructive action?"'],
              ['Versioned in',  'The component library package',      'This documentation site'],
              ['Imported',      'Yes — via @arcad/awf',              'No — referenced as guidance'],
              ['Primary output',"API + visual spec + accessibility", "Composition rules + copy + behaviour"],
            ].map(([dim, c, p], i, arr) => (
              <tr key={dim} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{dim}</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{c}</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Divider />

      {/* ── Catalog ────────────────────────────────────────────────────── */}
      <SectionAnchor id="catalog" />
      <H2>Pattern catalog</H2>
      <P>
        Six foundational patterns cover the vast majority of cross-product flows. Each is scoped
        below with the components it leans on and the rules that keep it consistent across products.
      </P>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24,
      }}>
        {PATTERNS.map(p => (
          <a
            key={p.id}
            href={`#${p.id}`}
            onClick={e => {
              e.preventDefault()
              document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              display: 'block',
              padding: '12px 14px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--stroke-primary)',
              borderRadius: 10,
              textDecoration: 'none',
              transition: 'border-color 120ms',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-600)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--stroke-primary)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-600)' }}>{p.title} →</span>
              <StatusPill status={p.status} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>
              {p.uses.length} components
            </div>
          </a>
        ))}
      </div>

      <Divider />

      {/* ── Forms ──────────────────────────────────────────────────────── */}
      <SectionAnchor id="forms" />
      <H2>Forms &amp; validation</H2>
      <PatternCard pattern={PATTERNS[0]} />

      <H3>When to use this pattern</H3>
      <P>
        Any time the user is entering structured information: settings pages, create/edit flows,
        filters, authentication. For a single inline input (search, quick add), use the{' '}
        <Link to="/components/searchbar" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>SearchBar</Link>
        {' '}component directly — it already encapsulates the right behaviour.
      </P>

      <Divider />

      {/* ── Data ───────────────────────────────────────────────────────── */}
      <SectionAnchor id="data" />
      <H2>Data display &amp; tables</H2>
      <PatternCard pattern={PATTERNS[1]} />

      <H3>Variants</H3>
      <P>
        For datasets under ~20 items with no sorting/filtering, consider a simple list or a
        grid of <Link to="/components/card" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>Cards</Link>
        {' '}instead. Tables pay off at higher row counts and when columns carry distinct semantics.
      </P>

      <Divider />

      {/* ── Empty ──────────────────────────────────────────────────────── */}
      <SectionAnchor id="empty" />
      <H2>Empty &amp; loading states</H2>
      <PatternCard pattern={PATTERNS[2]} />

      <Divider />

      {/* ── Errors ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="errors" />
      <H2>Error handling</H2>
      <PatternCard pattern={PATTERNS[3]} />

      <Divider />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <SectionAnchor id="navigation" />
      <H2>Navigation &amp; wayfinding</H2>
      <PatternCard pattern={PATTERNS[4]} />

      <Divider />

      {/* ── Feedback ───────────────────────────────────────────────────── */}
      <SectionAnchor id="feedback" />
      <H2>Feedback &amp; confirmation</H2>
      <PatternCard pattern={PATTERNS[5]} />

      <Divider />

      {/* ── Contributing ───────────────────────────────────────────────── */}
      <SectionAnchor id="contribute" />
      <H2>Contributing a pattern</H2>
      <P>
        If you encounter a cross-product flow that three or more teams build independently,
        that's a candidate pattern. Draft it using the template in the internal wiki
        (<Code>awf/patterns/TEMPLATE.md</Code>) and open a discussion in{' '}
        <Code>#awf-design-system</Code>.
      </P>

      <H3>What a pattern page must include</H3>
      <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
        <li><strong>Scope</strong> — which problem it solves, and explicitly which it doesn't.</li>
        <li><strong>Components used</strong> — a complete list with links to their individual pages.</li>
        <li><strong>At least one live example</strong> — composed from AWF components, themed with the default brand.</li>
        <li><strong>Rules</strong> — three-to-seven do/don't rules, each actionable and testable.</li>
        <li><strong>Accessibility</strong> — keyboard, focus, ARIA, and announcement behaviour.</li>
        <li><strong>Copy guidance</strong> — tone, length, and localisation notes.</li>
      </ul>

      <InfoBox type="planned">
        A full interactive example-sandbox — inspired by the component pages' live demos — will
        ship with every stable pattern page. Draft pages document the rules first; examples
        follow.
      </InfoBox>
    </PageShell>
  )
}
