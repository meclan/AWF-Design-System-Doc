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
        <div style={{ padding: '16px 18px', background: '#ffffff', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', minHeight: 64 }}>
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
        <div style={{ padding: '16px 18px', background: '#ffffff', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', minHeight: 64 }}>
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

function TokenTable({ tokens, prefix }) {
  const [filter, setFilter] = useState('')
  const rows = Object.entries(tokens).filter(([k]) => k.startsWith(prefix)).sort(([a], [b]) => a.localeCompare(b))
  const filtered = filter ? rows.filter(([k]) => k.includes(filter)) : rows
  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder={`Filter ${prefix} tokens…`}
        style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 6, border: '1px solid var(--stroke-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
      />
      <div style={{ borderRadius: 8, border: '1px solid var(--stroke-primary)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 40px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', padding: '8px 14px' }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Token</span>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)' }}>Resolved value</span>
          <span />
        </div>
        <div style={{ maxHeight: 340, overflowY: 'auto' }}>
          {filtered.length === 0 && <div style={{ padding: '16px 14px', fontSize: 13, color: 'var(--text-tertiary)' }}>No match for "{filter}"</div>}
          {filtered.map(([key, value]) => {
            const isHex = typeof value === 'string' && /^#[0-9a-fA-F]/.test(value)
            return (
              <div key={key} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 40px', padding: '8px 14px', borderBottom: '1px solid var(--stroke-primary)', alignItems: 'center' }}>
                <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{key}</code>
                <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-tertiary)' }}>{String(value)}</code>
                {isHex ? <span style={{ width: 18, height: 18, borderRadius: 999, background: value, border: '1px solid rgba(0,0,0,.12)', display: 'inline-block' }} /> : <span />}
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>{filtered.length} tokens</div>
    </div>
  )
}

// ─── Tag variant config ───────────────────────────────────────────────────────

const TAG_VARIANTS = {
  default:  { bg: '#def0f4', text: '#05606d', border: 'transparent',      closeColor: '#05606d', label: 'Default'  },
  outlined: { bg: 'transparent', text: '#05606d', border: '#c4cdd5',      closeColor: '#637381', label: 'Outlined' },
  neutral:  { bg: '#dfe3e8', text: '#454f5b', border: 'transparent',      closeColor: '#454f5b', label: 'Neutral'  },
  'on-brand':{ bg: '#07a2b659', text: '#ffffff', border: 'transparent',   closeColor: '#ffffff', label: 'On Brand' },
  disabled: { bg: '#f4f6f8', text: '#c4cdd5', border: 'transparent',      closeColor: '#c4cdd5', label: 'Disabled' },
}

// Close icon SVG path (MUI CloseRounded)
const CLOSE_PATH = 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'

function CloseIcon({ size = 12 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={CLOSE_PATH} />
    </svg>
  )
}

// ─── Tag component ────────────────────────────────────────────────────────────

function Tag({ variant = 'default', label, onRemove, disabled = false }) {
  const cfg = TAG_VARIANTS[disabled ? 'disabled' : variant] || TAG_VARIANTS.default
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg,
      color: cfg.text,
      border: `1px solid ${cfg.border}`,
      borderRadius: 100,
      padding: '3px 10px 3px 10px',
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      cursor: disabled ? 'not-allowed' : 'default',
      opacity: disabled ? 0.9 : 1,
      width: 'fit-content',
    }}>
      {label}
      {onRemove && !disabled && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          style={{
            background: 'none', border: 'none', padding: 0, margin: 0,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            color: cfg.closeColor, lineHeight: 1, opacity: 0.8,
            marginLeft: 2,
          }}
        >
          <CloseIcon size={12} />
        </button>
      )}
      {disabled && (
        <span style={{ display: 'flex', alignItems: 'center', color: cfg.closeColor, opacity: 0.5, marginLeft: 2 }}>
          <CloseIcon size={12} />
        </span>
      )}
    </span>
  )
}

// ─── Live preview ─────────────────────────────────────────────────────────────

const INITIAL_TAGS = ['Design system', 'Components', 'Tokens', 'Accessibility', 'React']
const SUGGESTIONS  = ['Figma', 'Typography', 'Motion', 'Dark mode', 'Theming', 'Grid', 'Spacing']

function TagLive() {
  const [variant,  setVariant]  = useState('default')
  const [tags,     setTags]     = useState(INITIAL_TAGS.slice(0, 3))
  const [input,    setInput]    = useState('')
  const [disabled, setDisabled] = useState(false)

  function addTag(label) {
    const trimmed = label.trim()
    if (trimmed && !tags.includes(trimmed) && tags.length < 8) {
      setTags(t => [...t, trimmed])
    }
    setInput('')
  }

  function removeTag(label) {
    setTags(t => t.filter(x => x !== label))
  }

  const available = SUGGESTIONS.filter(s => !tags.includes(s))

  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ padding: '28px 24px', background: 'var(--bg-primary)', minHeight: 100 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          {tags.map(t => (
            <Tag key={t} variant={variant} label={t} disabled={disabled} onRemove={() => removeTag(t)} />
          ))}
          {!disabled && tags.length < 8 && (
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(input) } }}
              placeholder="Add tag…"
              style={{
                border: '1px dashed var(--stroke-primary)', borderRadius: 100,
                padding: '3px 12px', fontSize: 13, color: 'var(--text-secondary)',
                background: 'transparent', outline: 'none', fontFamily: 'inherit',
                minWidth: 90, cursor: 'text',
              }}
            />
          )}
        </div>
        {!disabled && available.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginRight: 2 }}>Suggestions:</span>
            {available.slice(0, 4).map(s => (
              <button key={s} onClick={() => addTag(s)} style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 100, cursor: 'pointer',
                border: '1px dashed var(--stroke-primary)', background: 'transparent',
                color: 'var(--text-secondary)', fontFamily: 'inherit',
              }}>+ {s}</button>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: '16px 20px', background: 'var(--bg-primary)', borderTop: '1px solid var(--stroke-primary)', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Variant</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {Object.keys(TAG_VARIANTS).map(v => (
              <button key={v} onClick={() => setVariant(v)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${variant === v ? 'var(--brand-600)' : 'var(--stroke-primary)'}`,
                background: variant === v ? 'var(--brand-50)' : 'var(--bg-secondary)',
                color: variant === v ? 'var(--brand-600)' : 'var(--text-secondary)',
                fontWeight: variant === v ? 600 : 400,
              }}>{v}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>State</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} style={{ cursor: 'pointer' }} />
            Disabled
          </label>
        </div>
      </div>
    </div>
  )
}

// ─── TOC ──────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',  label: 'Overview'       },
  { id: 'anatomy',   label: 'Anatomy'        },
  { id: 'variants',  label: 'Variants'       },
  { id: 'states',    label: 'States'         },
  { id: 'usage',     label: 'Usage rules'    },
  { id: 'usecase',   label: 'Use case'       },
  { id: 'a11y',      label: 'Accessibility'  },
  { id: 'tokens',    label: 'Token reference'},
]

const TAG_TOKENS_STATIC = {
  'badge.tag.bg.default':       '#def0f4',
  'badge.tag.bg.neutral':       '#dfe3e8',
  'badge.tag.bg.outlined':      'transparent',
  'badge.tag.bg.on-brand':      '#07a2b659',
  'badge.tag.bg.disabled':      '#f4f6f8',
  'badge.tag.text.default':     '#05606d',
  'badge.tag.text.neutral':     '#454f5b',
  'badge.tag.text.outlined':    '#05606d',
  'badge.tag.text.on-brand':    '#ffffff',
  'badge.tag.text.disabled':    '#c4cdd5',
  'badge.tag.stroke.default':   'transparent',
  'badge.tag.stroke.outlined':  '#c4cdd5',
  'badge.tag.icon-close.default':   '#05606d',
  'badge.tag.icon-close.outlined':  '#637381',
  'badge.tag.icon-close.neutral':   '#454f5b',
  'badge.tag.icon-close.on-brand':  '#ffffff',
  'badge.tag.icon-close.disabled':  '#c4cdd5',
  'badge.tag.radius':           '100px',
  'badge.tag.font-size':        '13px',
  'badge.tag.font-weight':      '400',
  'badge.tag.padding':          '3px 10px',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TagPage() {
  const [activeTheme,   setActiveTheme]   = useState('dot')
  const [activeSection, setActiveSection] = useState('overview')

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

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, padding: '48px 56px 96px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Components · Feedback & Status</span>
            <span style={{ fontSize: 11, color: 'var(--stroke-primary)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Stable</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: '0 0 16px' }}>Tag</h1>
          <Lead>
            A <strong>dismissible metadata label</strong> attached to content items. Tags let users apply, filter, and remove categorical labels inline — making them interactive counterparts to the read-only Status Badge.
          </Lead>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', paddingTop: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>Preview theme:</span>
            {VISIBLE_THEMES.map(th => (
              <button key={th.id} onClick={() => setActiveTheme(th.id)} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '2px solid',
                borderColor: activeTheme === th.id ? th.color : 'var(--stroke-primary)',
                background:  activeTheme === th.id ? th.color + '18' : 'transparent',
                color:       activeTheme === th.id ? th.color : 'var(--text-secondary)',
                transition: 'all 120ms', fontFamily: 'inherit',
              }}>
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: th.color, marginRight: 5, verticalAlign: 'middle' }} />
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live demo */}
        <TagLive />

        <Divider />

        {/* ══ Overview ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="overview" />
        <H2>Overview</H2>
        <P>
          Tags are <strong>interactive chips</strong> used in two main contexts: as applied filters that can be removed from a search or list, and as metadata labels attached to records (tasks, posts, issues). The × close button is the primary affordance — it lets users clear a tag without leaving the current view.
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 8 }}>When to use</div>
            {[
              'Showing active filters with a remove action',
              'Displaying multi-value metadata (categories, labels)',
              'Allowing free-form tagging in forms or content editors',
              'Grouping or categorising content items',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 8 }}>When not to use</div>
            {[
              'Read-only status labels → use Status Badge',
              'Numeric counts → use Counter Badge',
              'Single-select options → use a Radio group',
              'Navigation items → use Tabs or a Nav link',
            ].map((txt, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 }}>• {txt}</div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Anatomy ═══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="anatomy" />
        <H2>Anatomy</H2>
        <Lead>A tag is a pill with a text label and an optional close button.</Lead>

        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '32px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
            <div style={{ position: 'relative' }}>
              <Tag variant="default" label="Design system" onRemove={() => {}} />
              <div style={{ position: 'absolute', top: -20, left: 6, fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>① Label</div>
              <div style={{ position: 'absolute', top: -20, right: -4, fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>② Close</div>
            </div>
          </div>
          <div style={{ padding: '16px 24px', background: 'var(--bg-primary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
            {[
              ['① Label',       'Short descriptive text. Use nouns or noun phrases: "React", "Bug fix", "High priority". Avoid verbs.'],
              ['② Close (×)',   '12px × icon button. Always include for user-added or filter tags. Omit for read-only display tags.'],
              ['Pill shape',    'Full border-radius (100px). Consistent height regardless of content. Never wraps to multiple lines.'],
              ['Border',        'Transparent by default. Only the outlined variant uses a visible 1px border.'],
            ].map(([name, desc]) => (
              <div key={name} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', minWidth: 80, flexShrink: 0 }}>{name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ══ Variants ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="variants" />
        <H2>Variants</H2>
        <Lead>Five visual variants cover different surface contexts and brand needs.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            {
              variant: 'default',
              title: 'Default',
              desc: 'Brand-tinted background with dark brand text. The go-to variant for general tagging on light surfaces.',
              when: 'Category labels, applied filters, standard metadata',
            },
            {
              variant: 'outlined',
              title: 'Outlined',
              desc: 'Transparent background with a subtle border. Blends into dense UIs without visual noise.',
              when: 'Secondary filters, lightweight metadata on busy surfaces',
            },
            {
              variant: 'neutral',
              title: 'Neutral',
              desc: 'Light grey background with secondary text. Semantic-free — use when color association would be misleading.',
              when: 'System-generated labels, technical tags, archived items',
            },
            {
              variant: 'on-brand',
              title: 'On Brand',
              desc: 'Semi-transparent brand color background with white text. Use directly on brand-colored surfaces.',
              when: 'Tags on brand banners, hero sections, or colored card headers',
            },
            {
              variant: 'disabled',
              title: 'Disabled',
              desc: 'Muted grey — visually inactive. The × is shown but non-functional to preserve layout continuity.',
              when: 'Tags in a read-only or locked form state',
            },
          ].map(row => (
            <div key={row.variant} style={{
              display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: 16, alignItems: 'start',
              padding: '16px 20px', background: row.variant === 'on-brand' ? '#07A2B6' : 'var(--bg-secondary)',
              border: '1px solid var(--stroke-primary)', borderRadius: 8,
            }}>
              <div><Tag
                variant={row.variant}
                disabled={row.variant === 'disabled'}
                label={row.title}
                onRemove={row.variant !== 'disabled' ? () => {} : undefined}
              /></div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: row.variant === 'on-brand' ? '#fff' : 'var(--text-primary)', marginBottom: 4 }}>{row.title}</div>
                <div style={{ fontSize: 12, color: row.variant === 'on-brand' ? 'rgba(255,255,255,.8)' : 'var(--text-secondary)', lineHeight: 1.55 }}>{row.desc}</div>
              </div>
              <div style={{ fontSize: 12, color: row.variant === 'on-brand' ? 'rgba(255,255,255,.7)' : 'var(--text-tertiary)', lineHeight: 1.55 }}>
                <strong style={{ color: row.variant === 'on-brand' ? 'rgba(255,255,255,.9)' : 'var(--text-secondary)' }}>Use for: </strong>{row.when}
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ States ════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="states" />
        <H2>States</H2>
        <Lead>Tags have three interactive states beyond their default appearance.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          {[
            {
              label: 'Default',
              desc: 'Resting state. Label and close icon at full opacity.',
              render: () => <Tag variant="default" label="Components" onRemove={() => {}} />,
            },
            {
              label: 'Hover (close)',
              desc: 'Close icon opacity lifts to 100% to signal interactivity. No change to label.',
              render: () => (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: '#def0f4', color: '#05606d', borderRadius: 100,
                  padding: '3px 10px', fontSize: 13, fontWeight: 400,
                }}>
                  Components
                  <span style={{ display: 'flex', alignItems: 'center', color: '#05606d', opacity: 1 }}>
                    <CloseIcon size={12} />
                  </span>
                </span>
              ),
            },
            {
              label: 'Disabled',
              desc: 'Muted colors, no pointer events. Close icon is visible but non-interactive.',
              render: () => <Tag variant="disabled" label="Components" disabled />,
            },
          ].map(row => (
            <div key={row.label} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 64 }}>
                {row.render()}
              </div>
              <div style={{ padding: '12px 14px', background: 'var(--bg-primary)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{row.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{row.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ══ Usage ═════════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usage" />
        <H2>Usage rules</H2>
        <Lead>Guidelines for using Tags correctly and consistently.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <DoBox
            visual={
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Tag variant="default" label="React" onRemove={() => {}} />
                <Tag variant="default" label="TypeScript" onRemove={() => {}} />
                <Tag variant="default" label="Design system" onRemove={() => {}} />
              </div>
            }
          >
            Use <strong>concise noun phrases</strong>. Tags work best as 1–3 word labels. "React", "High priority", "Design system".
          </DoBox>
          <DontBox
            visual={
              <Tag variant="default" label="Please tag this item with the correct category" onRemove={() => {}} />
            }
          >
            Do not put <strong>long sentences</strong> in a tag. The pill shape breaks visually and truncation is unexpected.
          </DontBox>
          <DoBox
            visual={
              <div style={{ display: 'flex', gap: 6 }}>
                <Tag variant="default" label="Bug" onRemove={() => {}} />
                <Tag variant="neutral" label="v2.1" onRemove={() => {}} />
                <Tag variant="outlined" label="Archived" onRemove={() => {}} />
              </div>
            }
          >
            Mix variants <strong>intentionally</strong> — default for user-managed tags, neutral for system labels, outlined for secondary metadata.
          </DoBox>
          <DontBox
            visual={
              <div style={{ display: 'flex', gap: 6 }}>
                <Tag variant="default" label="Bug" onRemove={() => {}} />
                <Tag variant="on-brand" label="v2.1" onRemove={() => {}} />
                <Tag variant="on-brand" label="Archived" onRemove={() => {}} />
              </div>
            }
          >
            Do not mix variants <strong>arbitrarily</strong>. On-brand is reserved for brand-colored surfaces, not used alongside default tags.
          </DontBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DoBox>
            Always include a <strong>remove (×) button</strong> on user-added tags so they can be cleared without an extra step. Omit it only for display-only tags that cannot be changed.
          </DoBox>
          <DontBox>
            Do not exceed <strong>5–7 tags</strong> in a single field without a "show more" overflow. Tag clouds become unreadable past this point.
          </DontBox>
          <DoBox>
            Provide an <strong>input or suggestion list</strong> alongside the tag field so users know how to add new tags. A free-text input with Enter-to-add is the most common pattern.
          </DoBox>
          <DontBox>
            Never use tags as <strong>navigation elements</strong>. Clicking a tag should filter or remove it — not navigate to a new page. Use a Link or Button for navigation.
          </DontBox>
        </div>

        <Divider />

        {/* ══ Use case ══════════════════════════════════════════════════════════ */}
        <SectionAnchor id="usecase" />
        <H2>Use case</H2>
        <Lead>Two common patterns: active filter chips and inline record metadata.</Lead>

        {/* Filter bar mockup */}
        <H3>Active filter chips</H3>
        <P>When a user applies filters to a list, each active filter appears as a tag. Removing a tag immediately updates the results.</P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>Filters:</span>
            <Tag variant="default" label="Status: Active" onRemove={() => {}} />
            <Tag variant="default" label="Assignee: Me" onRemove={() => {}} />
            <Tag variant="default" label="Priority: High" onRemove={() => {}} />
            <button style={{ fontSize: 12, color: '#0190f6', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', fontFamily: 'inherit' }}>Clear all</button>
          </div>
          <div style={{ padding: '10px 16px', background: 'var(--bg-primary)' }}>
            {[
              { name: 'Deploy new release pipeline',   assignee: 'Marc D.', priority: 'High' },
              { name: 'Fix search indexing latency',   assignee: 'Marc D.', priority: 'High' },
              { name: 'Audit access control policies', assignee: 'Marc D.', priority: 'High' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--stroke-primary)' : 'none' }}>
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{row.name}</span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{row.assignee}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inline metadata */}
        <H3>Inline record metadata</H3>
        <P>Tags attached to a record in a detail view, editable by the owner.</P>
        <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, padding: '20px 24px', background: 'var(--bg-secondary)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-tertiary)', marginBottom: 12 }}>Issue #4421 — "Sidebar collapse state not persisted"</div>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, alignItems: 'start' }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', paddingTop: 2 }}>Labels</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Tag variant="default"  label="Bug" onRemove={() => {}} />
              <Tag variant="neutral"  label="Frontend" onRemove={() => {}} />
              <Tag variant="outlined" label="Good first issue" onRemove={() => {}} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', paddingTop: 2 }}>Milestone</span>
            <Tag variant="neutral" label="v2.3 release" onRemove={() => {}} />
          </div>
        </div>

        <Divider />

        {/* ══ Accessibility ═════════════════════════════════════════════════════ */}
        <SectionAnchor id="a11y" />
        <H2>Accessibility</H2>
        <Lead>Tags must be usable by keyboard and screen reader without a pointer.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            ['Close button',         'Render the × as a <button> with aria-label="Remove [label]". Never a plain <span> with onClick.'],
            ['Keyboard removal',     'The close button must be reachable by Tab. Pressing Enter or Space removes the tag. Focus should move to the next tag or the input.'],
            ['List container',       'Wrap the tag group in role="list" with each tag as role="listitem" so screen readers announce the count.'],
            ['Input announcement',   'After a tag is added or removed, announce the change via aria-live="polite" on the container region.'],
            ['Disabled state',       'Set aria-disabled="true" on the container — do not remove the close button from the DOM, as this changes layout.'],
            ['Color contrast',       'All variant text/background combinations meet WCAG AA (4.5:1). The outlined variant must always be checked against its actual surface background.'],
          ].map(([term, desc]) => (
            <div key={term} style={{ display: 'flex', gap: 16, alignItems: 'baseline', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--stroke-primary)', borderRadius: 8 }}>
              <code style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--brand-600)', minWidth: 160, flexShrink: 0 }}>{term}</code>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
            </div>
          ))}
        </div>

        <InfoBox type="info">
          The outlined variant has a transparent background. Always verify contrast against the surface it sits on — it may fail on colored backgrounds.
        </InfoBox>

        <Divider />

        {/* ══ Token reference ═══════════════════════════════════════════════════ */}
        <SectionAnchor id="tokens" />
        <H2>Token reference</H2>
        <Lead>All Tag visual properties map to the <Code>badge.tag.*</Code> token set.</Lead>
        <TokenTable tokens={TAG_TOKENS_STATIC} prefix="badge.tag" />

      </div>

      {/* ── TOC (right sidebar) ──────────────────────────────────────────────── */}
      <div style={{
        width: 200, flexShrink: 0, position: 'sticky', top: 80,
        padding: '48px 0 48px 0', alignSelf: 'flex-start',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8, paddingLeft: 12 }}>On this page</div>
        {TOC.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
              display: 'block', padding: '4px 12px', borderRadius: 4,
              fontSize: 13, textDecoration: 'none', lineHeight: 1.5,
              color: activeSection === item.id ? 'var(--brand-600)' : 'var(--text-secondary)',
              fontWeight: activeSection === item.id ? 600 : 400,
              background: activeSection === item.id ? 'var(--brand-50)' : 'transparent',
              borderLeft: activeSection === item.id ? '2px solid var(--brand-600)' : '2px solid transparent',
              transition: 'all 120ms',
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

    </div>
  )
}
