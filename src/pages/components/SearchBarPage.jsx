import React, { useState, useRef, useEffect } from 'react'
import { THEMES, getComponentTokens } from '../../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

function getColors(t) {
  const n = k => (typeof t[k] === 'number' ? t[k] : null)
  const brand = t['tabs.indicator'] || '#07a2b6'
  return {
    brand,
    bgDefault:      t['searchbar.bg.default']                 || '#ffffff',
    bgHover:        t['searchbar.bg.hover']                   || '#e0f4f8',
    strokeDefault:  t['searchbar.stroke.default']             || '#c4cdd5',
    strokeActive:   t['searchbar.stroke.active']              || brand,
    strokeDisabled: t['searchbar.stroke.disabled']            || '#dfe3e8',
    shadowActive:   t['searchbar.shadow-color-active']        || '#9fefff',
    textPlaceholder:t['searchbar.text.placeholder']           || '#919eab',
    textActive:     t['searchbar.text.active']                || '#141a21',
    textDisabled:   t['searchbar.text.disabled']              || '#c4cdd5',
    iconSearch:     t['searchbar.icon.search-icon']           || '#637381',
    iconDisabled:   t['searchbar.icon.disabled']              || '#c4cdd5',
    closeBg:        t['searchbar.icon.close.bg']              || '#e0f4f8',
    closeColor:     t['searchbar.icon.close.color']           || brand,
    closeBgHover:   t['searchbar.icon.close.bg-hover']        || '#b3e3ee',
    radiusRound:    n('searchbar.radius.round')               ?? 999,
    radius12:       n('searchbar.radius.radius-12')           ?? 12,
    radius8:        n('searchbar.radius.radius-8')            ?? 8,
    radiusNone:     n('searchbar.radius.none')                ?? 0,
    lgPaddingY:     n('searchbar.size.lg.padding-y')          ?? 10,
    lgPaddingX:     n('searchbar.size.lg.padding-x')          ?? 16,
    mdPaddingY:     n('searchbar.size.md.padding-y')          ?? 8,
    mdPaddingX:     n('searchbar.size.md.padding-x')          ?? 14,
    smPaddingY:     n('searchbar.size.sm.padding-y')          ?? 6,
    smPaddingX:     n('searchbar.size.sm.padding-x')          ?? 12,
    lgFontSize:     n('searchbar.text.font-size.lg')          ?? 16,
    mdFontSize:     n('searchbar.text.font-size.md')          ?? 14,
    smFontSize:     n('searchbar.text.font-size.sm')          ?? 12,
  }
}

// ─── Suggestion data ───────────────────────────────────────────────────────────

const SUGGESTIONS = ['Dashboard overview', 'Data visualisation', 'Design tokens', 'Documentation', 'Developer guide']

// ─── SVG icons ────────────────────────────────────────────────────────────────

const SearchIcon = ({ color = '#637381', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const CloseIcon = ({ color = '#07a2b6', size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)
const SpinnerIcon = ({ color = '#07a2b6', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" strokeOpacity="0.25" />
    <path d="M3 12a9 9 0 019-9" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const InfoIcon = ({ color = '#637381', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill={color} />
  </svg>
)

// ─── Page primitives ──────────────────────────────────────────────────────────

function SectionAnchor({ id }) { return <span id={id} style={{ display: 'block', marginTop: -80, paddingTop: 80 }} /> }
function H2({ children }) { return <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--text-primary)', marginBottom: 12, marginTop: 56 }}>{children}</h2> }
function H3({ children }) { return <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, marginTop: 28 }}>{children}</h3> }
function Lead({ children }) { return <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20 }}>{children}</p> }
function P({ children }) { return <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 14 }}>{children}</p> }
function Code({ children }) { return <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: 'var(--bg-secondary)', color: 'var(--brand-600)', padding: '1px 6px', borderRadius: 4 }}>{children}</code> }
function Rule() { return <hr style={{ border: 'none', borderTop: '1px solid var(--stroke-primary)', margin: '48px 0' }} /> }
function StateLabel({ children }) { return <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 8 }}>{children}</div> }
function DoBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && <div style={{ padding: '24px 20px', background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '24px 20px', background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>{visual}</div>}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Size & radius helpers ────────────────────────────────────────────────────

function sizeProps(C, size) {
  if (size === 'lg') return { py: C.lgPaddingY, px: C.lgPaddingX, fontSize: C.lgFontSize, iconSize: 20, clearSize: 22 }
  if (size === 'sm') return { py: C.smPaddingY, px: C.smPaddingX, fontSize: C.smFontSize, iconSize: 16, clearSize: 18 }
  return                 { py: C.mdPaddingY, px: C.mdPaddingX, fontSize: C.mdFontSize, iconSize: 18, clearSize: 20 }
}

function radiusValue(C, radius) {
  if (radius === 'round')     return C.radiusRound
  if (radius === 'radius-8')  return C.radius8
  if (radius === 'none')      return C.radiusNone
  return C.radius12
}

// ─── Static search bar (display only) ─────────────────────────────────────────

function SBar({ C, size = 'md', radius = 'radius-12', state = 'default', value = '', loading = false }) {
  const { py, px, fontSize, iconSize, clearSize } = sizeProps(C, size)
  const r = radiusValue(C, radius)

  const isFocused  = state === 'focused'
  const isDisabled = state === 'disabled'
  const isHover    = state === 'hover'
  const hasValue   = !!value

  const isUnderline = radius === 'none'
  const borderColor = isDisabled ? C.strokeDisabled : isFocused ? C.strokeActive : C.strokeDefault
  const borderWidth = isFocused ? 2 : 1
  const bg          = isDisabled ? C.bgDefault : isHover ? C.bgHover : C.bgDefault
  const shadow      = (!isUnderline && isFocused) ? `0 0 0 3px ${C.shadowActive}` : 'none'
  const iconColor   = isDisabled ? C.iconDisabled : C.iconSearch
  const textColor   = hasValue ? (isDisabled ? C.textDisabled : C.textActive) : C.textPlaceholder

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: `${py}px ${px}px`,
      background: bg,
      ...(isUnderline
        ? { border: 'none', borderBottom: `${borderWidth}px solid ${borderColor}`, borderRadius: 0 }
        : { border: `${borderWidth}px solid ${borderColor}`, borderRadius: r }
      ),
      boxShadow: shadow,
      opacity: isDisabled ? 0.55 : 1,
      transition: 'all .15s',
      userSelect: 'none',
    }}>
      {loading
        ? <SpinnerIcon color={isDisabled ? C.iconDisabled : C.strokeActive} size={iconSize} />
        : <SearchIcon color={iconColor} size={iconSize} />
      }
      <span style={{ flex: 1, fontSize, fontFamily: 'Poppins, sans-serif', color: textColor, lineHeight: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value || 'Search…'}
      </span>
      {hasValue && !isDisabled && !loading && (
        <div style={{
          width: clearSize, height: clearSize, borderRadius: '50%', flexShrink: 0,
          background: C.closeBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CloseIcon color={C.closeColor} size={clearSize - 10} />
        </div>
      )}
    </div>
  )
}

// ─── Live interactive search bar ───────────────────────────────────────────────

function LiveSearch({ C, size = 'md', radius = 'radius-12', disabled = false, showSuggestions = false }) {
  const [value,   setValue]  = useState('')
  const [focused, setFocused]= useState(false)
  const [hovered, setHover]  = useState(false)
  const [clearHov,setClearH] = useState(false)
  const [hovSug,  setHovSug] = useState(null)
  const inputRef  = useRef(null)
  const containerRef = useRef(null)

  const filtered = showSuggestions && value.length > 0
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(value.toLowerCase()))
    : []
  const isOpen = showSuggestions && focused && filtered.length > 0

  useEffect(() => {
    function onDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setFocused(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const { py, px, fontSize, iconSize, clearSize } = sizeProps(C, size)
  const r = radiusValue(C, radius)

  const isUnderline = radius === 'none'
  const borderColor = disabled ? C.strokeDisabled : focused ? C.strokeActive : C.strokeDefault
  const borderWidth = focused ? 2 : 1
  const bg          = disabled ? C.bgDefault : hovered ? C.bgHover : C.bgDefault
  const shadow      = (!isUnderline && focused) ? `0 0 0 3px ${C.shadowActive}` : 'none'
  const iconColor   = disabled ? C.iconDisabled : C.iconSearch

  function clear() { setValue(''); inputRef.current?.focus() }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => !disabled && inputRef.current?.focus()}
        onMouseEnter={() => !disabled && setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: `${py}px ${px}px`,
          background: bg,
          ...(isUnderline
            ? { border: 'none', borderBottom: `${borderWidth}px solid ${borderColor}`, borderRadius: 0 }
            : { border: `${borderWidth}px solid ${borderColor}`, borderRadius: isOpen ? `${r}px ${r}px 0 0` : r }
          ),
          boxShadow: shadow,
          opacity: disabled ? 0.55 : 1,
          transition: 'background .15s, border-color .15s, box-shadow .15s',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      >
        <SearchIcon color={iconColor} size={iconSize} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          disabled={disabled}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search…"
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize, fontFamily: 'Poppins, sans-serif',
            color: C.textActive, cursor: disabled ? 'not-allowed' : 'text',
          }}
        />
        {value && !disabled && (
          <div
            onClick={e => { e.stopPropagation(); clear() }}
            onMouseEnter={() => setClearH(true)}
            onMouseLeave={() => setClearH(false)}
            style={{
              width: clearSize, height: clearSize, borderRadius: '50%', flexShrink: 0,
              background: clearHov ? C.closeBgHover : C.closeBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background .15s',
            }}
          >
            <CloseIcon color={C.closeColor} size={clearSize - 10} />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 40,
          background: '#fff', border: `1px solid ${C.strokeActive}`, borderTop: 'none',
          borderRadius: `0 0 ${r}px ${r}px`,
          boxShadow: '0px 4px 8px rgba(171,190,209,0.4)',
          padding: '4px',
        }}>
          {filtered.map(s => (
            <div
              key={s}
              onMouseEnter={() => setHovSug(s)} onMouseLeave={() => setHovSug(null)}
              onMouseDown={() => { setValue(s); setFocused(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
                background: hovSug === s ? C.bgHover : 'transparent',
                fontSize: fontSize, fontFamily: 'Poppins, sans-serif', color: C.textActive,
                transition: 'background .1s',
              }}
            >
              <SearchIcon color={C.iconSearch} size={iconSize - 2} />
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Anatomy diagram ──────────────────────────────────────────────────────────

function AnatomyBar({ C }) {
  const labels = [
    { x: '8%', y: '135%', text: '① Search icon', align: 'center' },
    { x: '42%', y: '135%', text: '② Input area', align: 'center' },
    { x: '82%', y: '135%', text: '③ Clear button', align: 'center' },
  ]
  return (
    <div style={{ position: 'relative', padding: '0 0 56px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: C.bgDefault, border: `2px solid ${C.strokeActive}`, borderRadius: C.radius12, boxShadow: `0 0 0 3px ${C.shadowActive}` }}>
        <SearchIcon color={C.iconSearch} size={20} />
        <span style={{ flex: 1, fontSize: 15, fontFamily: 'Poppins, sans-serif', color: C.textActive, lineHeight: '24px' }}>Design tokens</span>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.closeBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CloseIcon color={C.closeColor} size={10} />
        </div>
      </div>
      {/* Annotation lines */}
      {[
        { left: '13%',  top: '100%', height: 28 },
        { left: '46%',  top: '100%', height: 28 },
        { left: '86%',  top: '100%', height: 28 },
      ].map((l, i) => (
        <div key={i} style={{ position: 'absolute', left: l.left, top: l.top, width: 1, height: l.height, background: 'var(--stroke-primary)' }} />
      ))}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-around' }}>
        {['① Search icon', '② Input area', '③ Clear button'].map(t => (
          <span key={t} style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif' }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Spinner keyframes injected once ─────────────────────────────────────────

const spinStyle = <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

// ─── Token table ──────────────────────────────────────────────────────────────

const TOKEN_ROWS = [
  ['searchbar.bg.default',              'Container background (rest)'],
  ['searchbar.bg.hover',                'Container background (hover)'],
  ['searchbar.stroke.default',          'Border colour (rest)'],
  ['searchbar.stroke.active',           'Border colour (focused)'],
  ['searchbar.stroke.disabled',         'Border colour (disabled)'],
  ['searchbar.shadow-color-active',     'Focus ring colour'],
  ['searchbar.text.placeholder',        'Placeholder text colour'],
  ['searchbar.text.active',             'Input text colour'],
  ['searchbar.text.disabled',           'Disabled text colour'],
  ['searchbar.icon.search-icon',        'Search icon colour'],
  ['searchbar.icon.disabled',           'Icon colour (disabled)'],
  ['searchbar.icon.close.bg',           'Clear button background'],
  ['searchbar.icon.close.color',        'Clear button icon colour'],
  ['searchbar.icon.close.bg-hover',     'Clear button background (hover)'],
  ['searchbar.radius.round',            'Border-radius — pill'],
  ['searchbar.radius.radius-12',        'Border-radius — default'],
  ['searchbar.radius.radius-8',         'Border-radius — compact'],
  ['searchbar.radius.none',             'Border-radius — square'],
  ['searchbar.size.lg.padding-y',       'Vertical padding — large'],
  ['searchbar.size.lg.padding-x',       'Horizontal padding — large'],
  ['searchbar.size.md.padding-y',       'Vertical padding — medium'],
  ['searchbar.size.md.padding-x',       'Horizontal padding — medium'],
  ['searchbar.size.sm.padding-y',       'Vertical padding — small'],
  ['searchbar.size.sm.padding-x',       'Horizontal padding — small'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchBarPage() {
  const [themeIdx,   setThemeIdx]  = useState(0)
  const [demoSize,   setSize]      = useState('md')
  const [demoRadius, setRadius]    = useState('radius-12')
  const [demoDisabled, setDisabled]= useState(false)
  const [demoSuggest, setSuggest]  = useState(false)

  const theme  = VISIBLE_THEMES[themeIdx]
  const tokens = getComponentTokens(theme.id)
  const C      = getColors(tokens)
  const THEME_COLORS = VISIBLE_THEMES.map(t => getComponentTokens(t.id)['tabs.indicator'] || '#07a2b6')

  const pill = { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: 'pointer', border: '1px solid var(--stroke-primary)' }
  const active = (on) => on ? { background: C.brand, color: '#fff', border: `1px solid ${C.brand}` } : { background: 'transparent', color: 'var(--text-secondary)' }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 32px 80px' }}>
      {spinStyle}

      {/* ── Header ── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: C.brand }}>Forms</span>
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', marginBottom: 8 }}>Searchbar</h1>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {VISIBLE_THEMES.map((t, i) => (
          <button key={t.id} onClick={() => setThemeIdx(i)} style={{
            ...pill, ...active(themeIdx === i),
          }}>{t.name}</button>
        ))}
      </div>

      <Lead>
        The Searchbar lets users filter content or query data by typing a keyword. It combines a leading search icon, a text input, and a conditional clear button. Its brand-tinted hover state and shape variants make it adaptable across contexts — from compact toolbars to prominent hero search fields.
      </Lead>

      <Rule />

      {/* ── Live demo ── */}
      <SectionAnchor id="demo" />
      <H2>Interactive demo</H2>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '32px 24px', marginBottom: 12 }}>
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          <LiveSearch C={C} size={demoSize} radius={demoRadius} disabled={demoDisabled} showSuggestions={demoSuggest} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, padding: '16px 0', borderTop: '1px solid var(--stroke-primary)' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>Size</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['sm', 'md', 'lg'].map(s => (
              <button key={s} onClick={() => setSize(s)} style={{ ...pill, ...active(demoSize === s) }}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>Radius</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[['none','None'],['radius-8','8'],['radius-12','12'],['round','Round']].map(([v,l]) => (
              <button key={v} onClick={() => setRadius(v)} style={{ ...pill, ...active(demoRadius === v) }}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>Options</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setDisabled(d => !d)} style={{ ...pill, ...active(demoDisabled) }}>Disabled</button>
            <button onClick={() => setSuggest(s => !s)} style={{ ...pill, ...active(demoSuggest) }}>Suggestions</button>
          </div>
        </div>
      </div>

      <Rule />

      {/* ── Anatomy ── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>
      <P>The searchbar is a composite of three always-visible elements plus one conditional element.</P>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '40px 32px', marginBottom: 24 }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <AnatomyBar C={C} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          ['① Search icon', 'Always present. Communicates the field\'s purpose at a glance. Color shifts between the resting icon tint and the disabled tint.'],
          ['② Input area', 'Accepts free-form text. Placeholder text uses a lighter weight and colour. The field grows horizontally to fill its container.'],
          ['③ Clear button', 'Appears only when the field has a value. A small pill with brand-tinted background. Click to clear and re-focus the field.'],
          ['④ Spinner (optional)', 'Replaces the search icon during async operations (e.g. server-side search). Disappears once results are ready.'],
        ].map(([title, desc]) => (
          <div key={title} style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── States ── */}
      <SectionAnchor id="states" />
      <H2>States</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {[
          { label: 'Default', state: 'default', value: '' },
          { label: 'Hover', state: 'hover', value: '' },
          { label: 'Focused', state: 'focused', value: '' },
          { label: 'With value', state: 'focused', value: 'Design tokens' },
          { label: 'Disabled', state: 'disabled', value: '' },
          { label: 'Loading', state: 'default', value: 'dash', loading: true },
        ].map(({ label, state, value, loading }) => (
          <div key={label}>
            <StateLabel>{label}</StateLabel>
            <SBar C={C} state={state} value={value} loading={loading} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <H3>State details</H3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['Default', 'Neutral border, white background, muted search icon, placeholder text in light weight.'],
            ['Hover', 'Brand-subtlest background tint. No border change — the background alone signals interactivity.'],
            ['Focused', 'Brand-coloured 2px border + focus ring shadow. Background returns to white to maximise contrast with typed text.'],
            ['With value', 'Clear button (③) appears. User text is rendered in the primary text colour with regular weight.'],
            ['Disabled', '55% opacity on the entire component. Cursor changes to not-allowed. Non-interactive.'],
            ['Loading', 'The search icon is replaced by a spinning indicator. The clear button is hidden. No layout shift.'],
          ].map(([title, desc]) => (
            <div key={title} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
              <div style={{ width: 90, flexShrink: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <Rule />

      {/* ── Sizes ── */}
      <SectionAnchor id="sizes" />
      <H2>Sizes</H2>
      <P>Three sizes cover most use cases. Choose based on the density of the surrounding UI, not the importance of the search action.</P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { size: 'lg', label: 'Large', desc: 'Hero search, command palettes, standalone search pages.' },
          { size: 'md', label: 'Medium', desc: 'Default for most page-level search bars and filtering fields.' },
          { size: 'sm', label: 'Small', desc: 'Dense data tables, compact toolbars, inline list filters.' },
        ].map(({ size, label, desc }) => (
          <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 80, flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{size}</div>
            </div>
            <div style={{ flex: 1 }}>
              <SBar C={C} size={size} value="" />
            </div>
            <div style={{ width: 220, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Radius variants ── */}
      <SectionAnchor id="radius" />
      <H2>Shape variants</H2>
      <P>Border-radius is a stylistic choice that should match the overall roundness of the UI. Use the same radius across all form fields in a given view.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[
          { radius: 'none',      label: 'Underline',    token: 'searchbar.radius.none' },
          { radius: 'radius-8',  label: 'Radius 8', token: 'searchbar.radius.radius-8' },
          { radius: 'radius-12', label: 'Radius 12 (default)', token: 'searchbar.radius.radius-12' },
          { radius: 'round',     label: 'Round / Pill', token: 'searchbar.radius.round' },
        ].map(({ radius, label, token }) => (
          <div key={radius}>
            <StateLabel>{label}</StateLabel>
            <SBar C={C} radius={radius} value="" />
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{token}</div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Suggestions ── */}
      <SectionAnchor id="suggestions" />
      <H2>With suggestions</H2>
      <P>Enable the <Code>suggestions</Code> toggle in the demo above to try the typeahead variant. When suggestions are provided, a dropdown appears below the field as the user types. Selecting a suggestion populates the field and closes the dropdown.</P>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '32px 24px' }}>
        <div style={{ maxWidth: 440, margin: '0 auto', position: 'relative' }}>
          {/* Static preview of an open suggestion dropdown */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: `${C.mdPaddingY}px ${C.mdPaddingX}px`,
            background: C.bgDefault,
            border: `2px solid ${C.strokeActive}`,
            borderRadius: `${C.radius12}px ${C.radius12}px 0 0`,
            boxShadow: `0 0 0 3px ${C.shadowActive}`,
          }}>
            <SearchIcon color={C.iconSearch} size={18} />
            <span style={{ flex: 1, fontSize: C.mdFontSize, fontFamily: 'Poppins, sans-serif', color: C.textActive, lineHeight: '24px' }}>des</span>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.closeBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloseIcon color={C.closeColor} size={10} />
            </div>
          </div>
          <div style={{
            background: '#fff', border: `1px solid ${C.strokeActive}`, borderTop: 'none',
            borderRadius: `0 0 ${C.radius12}px ${C.radius12}px`,
            boxShadow: '0px 4px 8px rgba(171,190,209,0.4)',
            padding: '4px',
          }}>
            {['Dashboard overview', 'Design tokens', 'Developer guide'].map((s, i) => (
              <div key={s} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
                background: i === 1 ? C.bgHover : 'transparent',
                fontSize: C.mdFontSize, fontFamily: 'Poppins, sans-serif', color: C.textActive,
              }}>
                <SearchIcon color={C.iconSearch} size={16} />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          ['When to use', 'Use the suggestions variant when you can predict what the user is looking for — navigation items, commands, recent searches, or a finite dataset.'],
          ['When to avoid', 'Avoid suggestions for free-text queries where results cannot be anticipated (e.g. full-text document search). In those cases, a simple search bar is better.'],
        ].map(([title, desc]) => (
          <div key={title} style={{ padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Behaviour ── */}
      <SectionAnchor id="behaviour" />
      <H2>Behaviour</H2>

      <H3>Clear button</H3>
      <P>The clear button appears as soon as the input has a value and disappears when the field is empty. Clicking it clears the value, re-focuses the input, and — when suggestions are open — closes the dropdown. It is never shown in the <Code>disabled</Code> or <Code>loading</Code> states.</P>

      <H3>Search trigger</H3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          ['Instant / live filter', 'The search result updates on every keystroke (onChange). Use for in-page filtering where latency is negligible.'],
          ['On submit', 'The search triggers on Enter / ↵. Use for server-side or expensive queries where debouncing is insufficient.'],
        ].map(([title, desc]) => (
          <div key={title} style={{ padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</div>
          </div>
        ))}
      </div>

      <H3>Keyboard interactions</H3>
      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--stroke-primary)', marginTop: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Key', 'Action'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Tab', 'Move focus into / out of the searchbar'],
              ['Shift + Tab', 'Move focus backward'],
              ['Enter / ↵', 'Submit the search query'],
              ['Escape', 'Clear focus; if suggestions are open, close the dropdown'],
              ['↑ / ↓', 'Navigate suggestion list (when dropdown is open)'],
              ['Enter on suggestion', 'Select highlighted suggestion, populate field, close dropdown'],
            ].map(([key, action], i) => (
              <tr key={key} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-subtle)' }}>
                <td style={{ padding: '8px 14px', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', borderBottom: '1px solid var(--stroke-primary)', whiteSpace: 'nowrap' }}>{key}</td>
                <td style={{ padding: '8px 14px', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Rule />

      {/* ── Do / Don't ── */}
      <SectionAnchor id="usage" />
      <H2>Usage guidelines</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
        <DoBox visual={<SBar C={C} value="" radius="radius-12" />}>
          Use placeholder text to hint at the scope — "Search components…" rather than the generic "Search…" when context is specific.
        </DoBox>
        <DontBox visual={<SBar C={C} value="" state="default" />}>
          Don't display an error or warning state when a search returns no results — that is expected behaviour, not a user error.
        </DontBox>
        <DoBox visual={<SBar C={C} value="Design tokens" state="focused" />}>
          Show the clear button as soon as the field has a value so users can quickly reset without selecting all text.
        </DoBox>
        <DontBox visual={
          <div style={{ width: '100%', display: 'flex', gap: 8, alignItems: 'center' }}>
            <SBar C={C} value="" size="sm" />
            <SBar C={C} value="" size="lg" />
          </div>
        }>
          Don't mix searchbar sizes within the same view unless the layouts are clearly distinct sections.
        </DontBox>
        <DoBox visual={<SBar C={C} value="" radius="round" />}>
          Pair a round/pill radius with equally round buttons and inputs in the same UI for visual consistency.
        </DoBox>
        <DontBox>
          Don't rely solely on placeholder text as the label. If the searchbar needs a persisted label, place it above the field or use an accessible <Code>aria-label</Code>.
        </DontBox>
      </div>

      <Rule />

      {/* ── Accessibility ── */}
      <SectionAnchor id="a11y" />
      <H2>Accessibility</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          ['role / type', 'Add role="search" to the wrapping form or section, and use type="text" (or type="search") on the <input>. The type="search" attribute enables browser-level semantics.'],
          ['Labelling', 'Always provide an accessible name via aria-label="Search" or aria-labelledby referencing a visible heading. Placeholder text alone is not sufficient.'],
          ['Clear button', 'The clear button must have an accessible name: aria-label="Clear search". Its visibility change (empty ↔ value) should not cause a page reflow.'],
          ['Loading state', 'When the spinner replaces the search icon, add an aria-live="polite" region to announce "Searching…" and "X results found" to screen-reader users.'],
          ['Placeholder contrast', 'Per WCAG 1.4.3, placeholder text is exempt from the 4.5:1 contrast requirement. However, test at the lowest contrast your themes produce.'],
          ['Focus management', 'After clearing the field via the clear button, return focus to the <input>. Do not leave focus on the (now-hidden) clear button.'],
        ].map(([title, desc]) => (
          <div key={title} style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Token reference ── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>
      <P>All tokens are resolved through <Code>getComponentTokens(themeId)</Code> and cascade from the theme's semantic layer.</P>

      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Token', 'Resolved value', 'Role'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOKEN_ROWS.map(([token, role], i) => {
              const raw = tokens[token]
              const isColor = typeof raw === 'string' && raw.startsWith('#')
              const isNum   = typeof raw === 'number'
              return (
                <tr key={token} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-subtle)' }}>
                  <td style={{ padding: '7px 14px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--brand-600)', borderBottom: '1px solid var(--stroke-primary)', whiteSpace: 'nowrap' }}>{token}</td>
                  <td style={{ padding: '7px 14px', fontSize: 12, borderBottom: '1px solid var(--stroke-primary)', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isColor && <div style={{ width: 12, height: 12, borderRadius: 3, background: raw, border: '1px solid rgba(0,0,0,.08)', flexShrink: 0 }} />}
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>
                        {isColor ? raw : isNum ? `${raw}px` : raw ?? '—'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '7px 14px', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{role}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}
