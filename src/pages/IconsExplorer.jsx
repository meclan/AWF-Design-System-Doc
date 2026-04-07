import React, { useState, useCallback } from 'react'
import * as LucideIcons from 'lucide-react'
import registry from '../data/icon-registry.json'

const CATEGORIES = ['all', 'Actions & verbs', 'Navigation & disclosure', 'Status & feedback', 'Objects & concepts']

const CATEGORY_STYLE = {
  'Actions & verbs':        { color: '#0369a1', bg: '#e0f2fe' },
  'Navigation & disclosure':{ color: '#7e22ce', bg: '#faf5ff' },
  'Status & feedback':      { color: '#9a3412', bg: '#fff7ed' },
  'Objects & concepts':     { color: '#166534', bg: '#f0fdf4' },
}

const GOVERNANCE_SECTIONS = [
  {
    title: 'Core principles',
    items: [
      'One semantic action = one canonical icon.',
      'Prefer Lucide by default for all icons.',
      'MUI icons are reserved exclusively for: Success, Warning, Error, User, Users/Group, Team. All other icons must use Lucide.',
      'Do not introduce alternative icons for the same meaning without Design System review.',
      'Use the canonical semantic name (column "name") consistently in Figma, code, docs, and Storybook.',
    ],
  },
  {
    title: 'Category vocabulary',
    items: [
      'Actions & verbs — user-triggered operations on data or UI state (add, edit, delete, save…)',
      'Navigation & disclosure — move between views, show/hide panels, expand/collapse (chevrons, menus…)',
      'Status & feedback — system states and semantic feedback (info, success, warning, error, loading…)',
      'Objects & concepts — nouns representing entities or features (file, user, calendar, database…)',
    ],
  },
  {
    title: 'MUI exceptions',
    items: [
      'Success → CheckCircleRounded (MUI) — used in Toast, Banner, and Status Badge',
      'Warning → WarningRounded (MUI) — used in Toast, Banner, and Status Badge',
      'Error → ErrorRounded (MUI) — used in Toast, Banner, and Status Badge',
      'User → PersonRounded (MUI) — used in profile, avatar, and user selectors',
      'Users / Group → PeopleRounded (MUI) — used for group and multi-user contexts',
      'Team → GroupsRounded (MUI) — used for organisational team contexts',
      'All MUI icons include a Lucide fallback (shown in the registry) for contexts where MUI is unavailable.',
    ],
  },
  {
    title: 'Selection rules',
    items: [
      'Favour recognition over originality — use the most widely understood icon for the action.',
      'Maintain visual consistency: outline style within the Lucide library.',
      'Reject near-duplicates unless they express a genuinely distinct semantic.',
      'Avoid using the same icon for both destructive and neutral actions.',
      'Never use colour alone to convey meaning — pair icons with labels or ARIA attributes.',
    ],
  },
  {
    title: 'Contribution workflow',
    items: [
      '1. Check this registry first — the icon may already exist under a different semantic name.',
      '2. If no match: propose the semantic intent, candidate icon, category, and bilingual tags (EN + FR).',
      '3. Review and approval by Design System owner.',
      '4. Add to registry JSON + Figma icon library + Storybook explorer.',
      '5. Update icon-registry.json, navConfig search index, and any related documentation.',
    ],
  },
  {
    title: 'QA checklist',
    items: [
      'Semantic name matches the action or concept it represents',
      'Icon exists in the approved library (Lucide or MUI exception list)',
      'Component name is correct and matches the library export',
      'Search tags include both EN and FR synonyms',
      'No duplicate semantic in the registry',
      'Icon is used at an approved DS size (16, 20, or 24px)',
      'Any size override is exceptional and documented',
      'MUI icons are only used for the 6 approved semantic entries',
    ],
  },
]

function MuiBadge() {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '.08em',
      color: '#854d0e', background: '#fef9c3',
      padding: '2px 6px', borderRadius: 99, textTransform: 'uppercase',
    }}>MUI</span>
  )
}

function IconPreview({ entry }) {
  const isMui = entry.library === 'mui'
  // For MUI icons: try to render the lucideFallback at reduced opacity as a hint
  const FallbackIcon = isMui && entry.lucideFallback ? LucideIcons[entry.lucideFallback] : null
  const LucideIcon = !isMui ? LucideIcons[entry.component] : null

  if (isMui) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        {FallbackIcon
          ? <FallbackIcon size={24} color="var(--text-tertiary)" strokeWidth={1.8} style={{ opacity: 0.5 }} />
          : <span style={{ fontSize: 24, color: 'var(--text-tertiary)', lineHeight: 1 }}>◻</span>
        }
        <MuiBadge />
      </div>
    )
  }

  if (LucideIcon) {
    return <LucideIcon size={24} color="var(--text-primary)" strokeWidth={1.8} />
  }

  // Icon not found in installed Lucide version
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 18, color: 'var(--text-tertiary)' }}>?</span>
      <span style={{ fontSize: 9, color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>not found</span>
    </div>
  )
}

function IconTile({ entry }) {
  const [copied, setCopied] = useState(null)
  const catStyle = CATEGORY_STYLE[entry.category] || {}

  function copy(value, field) {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(field)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div style={{
      background: 'var(--bg-primary)',
      border: '1px solid var(--stroke-primary)',
      borderRadius: 12,
      padding: '14px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {/* Preview area */}
      <div style={{
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-secondary)', borderRadius: 8,
      }}>
        <IconPreview entry={entry} />
      </div>

      {/* Name + category */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5 }}>
          {entry.label}
        </div>
        <span style={{
          fontSize: 9, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase',
          color: catStyle.color, background: catStyle.bg,
          padding: '2px 7px', borderRadius: 99,
        }}>{entry.category}</span>
      </div>

      {/* Component name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <code style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-tertiary)' }}>
          {entry.component}
        </code>
        {entry.library === 'mui' && <MuiBadge />}
      </div>

      {/* Lucide fallback (for MUI icons) */}
      {entry.lucideFallback && (
        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ color: 'var(--brand-600)', fontWeight: 500 }}>Lucide fallback:</span>
          <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{entry.lucideFallback}</code>
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {entry.tags.slice(0, 4).map(tag => (
          <span key={tag} style={{
            fontSize: 10, color: 'var(--text-tertiary)', background: 'var(--bg-secondary)',
            padding: '1px 6px', borderRadius: 4,
          }}>{tag}</span>
        ))}
      </div>

      {/* Copy buttons */}
      <div style={{ display: 'flex', gap: 5, marginTop: 'auto' }}>
        <button
          onClick={() => copy(entry.name, 'name')}
          style={{
            flex: 1, padding: '5px 0', borderRadius: 6,
            border: '1px solid var(--stroke-primary)',
            fontSize: 10, fontWeight: 500, cursor: 'pointer',
            background: copied === 'name' ? 'var(--brand-50)' : 'var(--bg-secondary)',
            color: copied === 'name' ? 'var(--brand-600)' : 'var(--text-secondary)',
            transition: 'all 120ms',
          }}
        >{copied === 'name' ? '✓' : 'name'}</button>
        <button
          onClick={() => copy(entry.component, 'comp')}
          style={{
            flex: 1, padding: '5px 0', borderRadius: 6,
            border: '1px solid var(--stroke-primary)',
            fontSize: 10, fontWeight: 500, cursor: 'pointer',
            background: copied === 'comp' ? 'var(--brand-50)' : 'var(--bg-secondary)',
            color: copied === 'comp' ? 'var(--brand-600)' : 'var(--text-secondary)',
            transition: 'all 120ms',
          }}
        >{copied === 'comp' ? '✓' : 'component'}</button>
      </div>
    </div>
  )
}

export default function IconsExplorer() {
  const [query, setQuery]           = useState('')
  const [activeCategory, setCategory] = useState('all')
  const [openSection, setOpenSection] = useState(null)

  const filtered = registry.filter(entry => {
    const matchesCat = activeCategory === 'all' || entry.category === activeCategory
    if (!matchesCat) return false
    if (!query) return true
    const q = query.toLowerCase()
    return (
      entry.name.toLowerCase().includes(q) ||
      entry.label.toLowerCase().includes(q) ||
      entry.component.toLowerCase().includes(q) ||
      entry.tags.some(t => t.toLowerCase().includes(q))
    )
  })

  // Category counts
  const countFor = cat => cat === 'all' ? registry.length : registry.filter(e => e.category === cat).length

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 40px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--brand-600)', marginBottom: 12 }}>
          Foundations
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--text-primary)', marginBottom: 12 }}>
          Icon Registry
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 600 }}>
          {registry.length} canonical icons across 4 categories. One semantic action = one icon.
          Lucide by default — MUI only for Success, Warning, Error, User, Users, and Team.
        </p>
      </div>

      {/* Search + category filter */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 340 }}>
          <span style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)', fontSize: 14, pointerEvents: 'none',
          }}>⌕</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search name, component, tag (EN/FR)…"
            style={{
              width: '100%', padding: '8px 32px 8px 30px',
              fontSize: 13, borderRadius: 8,
              border: '1px solid var(--stroke-primary)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              outline: 'none', fontFamily: 'Poppins, sans-serif',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-tertiary)', fontSize: 14, padding: '2px 4px',
              }}
            >✕</button>
          )}
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '1px solid var(--stroke-primary)' }}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat
          const label = cat === 'all' ? 'All' : cat
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '9px 16px', fontSize: 12, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--brand-600)' : '2px solid transparent',
                background: 'transparent', border: 'none', cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 120ms', marginBottom: -1,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {label}
              <span style={{
                fontSize: 10, padding: '1px 5px', borderRadius: 99,
                background: isActive ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: isActive ? 'var(--brand-600)' : 'var(--text-tertiary)',
                fontWeight: 500,
              }}>{countFor(cat)}</span>
            </button>
          )
        })}
      </div>

      {/* Recommended sizes note */}
      <div style={{
        display: 'flex', gap: 20, alignItems: 'center',
        marginBottom: 24, padding: '10px 16px',
        background: 'var(--bg-secondary)', borderRadius: 8,
        border: '1px solid var(--stroke-primary)',
      }}>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>Approved sizes</span>
        {[16, 20, 24].map(s => (
          <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <LucideIcons.Plus size={s} color="var(--text-secondary)" strokeWidth={1.8} />
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>{s}px</span>
          </span>
        ))}
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>
          Use DS spacing tokens — no arbitrary overrides.
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)', fontSize: 14 }}>
          No icons match &ldquo;{query}&rdquo;
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 10, marginBottom: 64,
        }}>
          {filtered.map(entry => <IconTile key={entry.name} entry={entry} />)}
        </div>
      )}

      {/* Governance model */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.3px', color: 'var(--text-primary)', marginBottom: 8 }}>
          Icon governance model
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          This registry is the single source of truth for cross-product icons. All teams must follow these rules.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {GOVERNANCE_SECTIONS.map((section, i) => {
            const isOpen = openSection === i
            const isFirst = i === 0
            const isLast = i === GOVERNANCE_SECTIONS.length - 1
            return (
              <div key={section.title} style={{
                border: '1px solid var(--stroke-primary)',
                borderRadius: isFirst ? '10px 10px 3px 3px' : isLast ? '3px 3px 10px 10px' : '3px',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setOpenSection(isOpen ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 18px',
                    background: isOpen ? 'var(--brand-50)' : 'var(--bg-secondary)',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 120ms',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: isOpen ? 'var(--brand-600)' : 'var(--text-primary)' }}>
                    {section.title}
                  </span>
                  <span style={{
                    fontSize: 12, color: 'var(--text-tertiary)',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 180ms', display: 'inline-block',
                  }}>▾</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '14px 18px', background: 'var(--bg-primary)', borderTop: '1px solid var(--stroke-primary)' }}>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {section.items.map(item => (
                        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          <span style={{ color: 'var(--brand-600)', flexShrink: 0 }}>·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
