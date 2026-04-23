import React, { useState, useRef, useEffect } from 'react'
import { useBrandTheme } from '../../contexts/BrandThemeContext.jsx'
import BrandThemeSwitcher from '../../components/BrandThemeSwitcher.jsx'
import { THEMES, getComponentTokens } from '../../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

function blendWithWhite(hex, opacity) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const toHex = n => Math.round(n).toString(16).padStart(2, '0')
  return `#${toHex(r * opacity + 255 * (1-opacity))}${toHex(g * opacity + 255 * (1-opacity))}${toHex(b * opacity + 255 * (1-opacity))}`
}

function getColors(t) {
  const brand = t['tabs.indicator'] || '#07a2b6'
  const n = k => (typeof t[k] === 'number' ? t[k] : null)
  return {
    brand,
    bgWhite:         t['inputfield.outlined.container.bg.white']        || '#ffffff',
    bgLabel:         t['inputfield.outlined.container.bg.label']        || '#ffffff',
    strokeDefault:   t['inputfield.outlined.container.stroke.default']  || '#c4cdd5',
    strokeHover:     t['inputfield.outlined.container.stroke.hover']    || '#637381',
    strokeFocused:   t['inputfield.outlined.container.stroke.focused']  || brand,
    strokeDisabled:  t['inputfield.outlined.container.stroke.disabled'] || '#dfe3e8',
    strokeIncorrect: t['inputfield.outlined.container.stroke.incorrect']|| '#f6643f',
    radius:          n('inputfield.outlined.container.radius')           ?? 8,
    focusShadow:     t['inputfield.outlined.container.focused-shadow']  || '#9fefff',
    hoverShadow:     t['inputfield.outlined.container.hover-shadow']    || '#dfe3e8',
    labelDefault:    t['inputfield.outlined.label.default']             || '#919eab',
    labelFilled:     t['inputfield.outlined.label.default-filled']      || '#637381',
    labelFocused:    t['inputfield.outlined.label.focused']             || '#454f5b',
    labelDisabled:   t['inputfield.outlined.label.disabled']            || '#c4cdd5',
    labelIncorrect:  t['inputfield.outlined.label.incorrect']           || '#f6643f',
    paddingX:        n('inputfield.outlined.size.padding-x')            ?? 16,
    paddingY:        n('inputfield.outlined.size.lg.padding-y')         ?? 12,
    valueDefault:    t['inputfield.outlined.value.default']             || '#141a21',
    valueDisabled:   t['inputfield.outlined.value.disabled']            || '#c4cdd5',
    placeholder:     t['inputfield.outlined.placeholder-color']         || '#919eab',
    helperDefault:   t['inputfield.outlined.helper.default']            || '#637381',
    helperIncorrect: t['inputfield.outlined.helper.incorrect']          || '#f6643f',
    filledBg:        t['inputfield.filled.container.bg.default']        || '#f4f6f8',
    filledBgHover:   t['inputfield.filled.container.bg.hover']          || '#dfe3e8',
    filledBgDisabled:t['inputfield.filled.container.bg.disabled']       || '#f4f6f8',
    filledBgIncorrect:t['inputfield.filled.container.bg.incorrect']     || '#fee8e2',
    filledStroke:    t['inputfield.filled.container.stroke.focused']    || '#919eab',
    filledLabelDefault: t['inputfield.filled.label.default']            || '#919eab',
    filledLabelFilled:  t['inputfield.filled.label.default-filled']     || '#637381',
    filledLabelFocused: t['inputfield.filled.label.focused']            || '#454f5b',
    filledLabelDisabled:t['inputfield.filled.label.disabled']           || '#c4cdd5',
    filledLabelIncorrect:t['inputfield.filled.label.incorrect']         || '#f6643f',
    filledValue:     '#454f5b',
    filledPlaceholder:'#919eab',
    brandBg:         t['inputfield.filled-brand.container.bg.default'],//blendWithWhite(brand, 0.10), 
    brandBgHover:    t['inputfield.filled-brand.container.bg.hover'],//blendWithWhite(brand, 0.16),
    brandStroke:     t['inputfield.filled-brand.container.stroke.focused'],      //|| '#9fefff',//inputfield.filled-brand.container.stroke.focused
    // Dropdown
    menuHoverBg:     '#f4f6f8',
    menuSelectedBg:  '#dfe3e8',
    menuShadow:      '0px 4px 8px rgba(171,190,209,0.4)',
  }
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const OPTIONS = [
  { value: 'design',      label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'product',     label: 'Product' },
  { value: 'marketing',   label: 'Marketing' },
  { value: 'operations',  label: 'Operations' },
  { value: 'finance',     label: 'Finance' },
]

const GROUPED_OPTIONS = [
  { group: 'Technical', items: OPTIONS.slice(0, 3) },
  { group: 'Business',  items: OPTIONS.slice(3) },
]

// ─── SVG icons ────────────────────────────────────────────────────────────────

const ChevronIcon = ({ color = '#637381', open = false }) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
    <path d="M7 10l5 5 5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const CheckIcon = ({ color = '#454f5b', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const WarningIcon = ({ color = '#f6643f', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill={color} />
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

// ─── Dropdown menu (shared between static + live) ─────────────────────────────

function DropdownMenu({ C, options, selected, onSelect, multi, grouped }) {
  const [hov, setHov] = useState(null)

  const renderOption = (opt) => {
    const isSel = selected.includes(opt.value)
    // Multi-select: no bg on selected (checkbox shows state). Single: subtle bg on selected.
    const bg = multi
      ? (hov === opt.value ? C.menuHoverBg : 'transparent')
      : (isSel ? C.menuSelectedBg : hov === opt.value ? C.menuHoverBg : 'transparent')

    return (
      <div key={opt.value}
        onMouseEnter={() => setHov(opt.value)}
        onMouseLeave={() => setHov(null)}
        onClick={() => onSelect(opt.value)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 6, cursor: 'pointer', margin: '2px 0',
          background: bg,
          fontSize: 14, fontFamily: 'Poppins, sans-serif', color: '#141a21',
          transition: 'background .1s', userSelect: 'none',
        }}
      >
        {multi ? (
          <div style={{
            width: 16, height: 16, borderRadius: 4, flexShrink: 0,
            background: isSel ? C.brand : 'transparent',
            border: `1.5px solid ${isSel ? C.brand : '#919eab'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isSel && <CheckIcon color="#fff" size={10} />}
          </div>
        ) : (
          <div style={{ width: 14, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            {isSel && <CheckIcon color={C.brand} size={14} />}
          </div>
        )}
        <span>{opt.label}</span>
      </div>
    )
  }

  const groups = grouped ? GROUPED_OPTIONS : null

  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
      background: '#ffffff', borderRadius: 12,
      border: '1px solid var(--stroke-primary)',
      boxShadow: C.menuShadow,
      padding: '6px', maxHeight: 280, overflowY: 'auto',
    }}>
      {groups
        ? groups.map(({ group, items: grpItems }, gi) => (
          <div key={group}>
            <div style={{ padding: '6px 12px 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: '#919eab' }}>{group}</div>
            {grpItems.map(renderOption)}
            {gi < groups.length - 1 && (
              <div style={{ height: 1, background: 'var(--stroke-primary)', margin: '4px 6px' }} />
            )}
          </div>
        ))
        : options.map(renderOption)
      }
    </div>
  )
}

// ─── Static select trigger ────────────────────────────────────────────────────
// state: 'default' | 'hover' | 'open' | 'filled' | 'disabled' | 'error'
// variant: 'outlined' | 'neutral' | 'brand'

function SField({ C, variant = 'outlined', state = 'default', selectedLabel = '', label = 'Department', helper = false }) {
  const isOutlined = variant === 'outlined'
  const isError    = state === 'error'
  const isOpen     = state === 'open'
  const isDisabled = state === 'disabled'
  const isHover    = state === 'hover'
  const isBrand    = variant === 'brand'
  const hasValue   = !!selectedLabel

  const labelUp = isOutlined ? (hasValue || isOpen || state === 'filled') : true
  const py      = C.paddingY

  let bg, borderColor, borderWidth, shadow, labelColor, textColor, labelBg, chevronColor

  if (isOutlined) {
    bg          = (isHover || isOpen) ? C.bgWhite : 'transparent'
    borderColor = isError ? C.strokeIncorrect : isOpen ? C.strokeFocused : isHover ? C.strokeHover : isDisabled ? C.strokeDisabled : C.strokeDefault
    borderWidth = (isError || isOpen) ? 2 : 1
    shadow      = isOpen ? `0 0 0 3px ${C.focusShadow}` : isHover ? `0 0 0 4px ${C.hoverShadow}` : 'none'
    labelColor  = isError ? C.labelIncorrect : isOpen ? C.labelFocused : (isHover || labelUp) ? C.labelFilled : isDisabled ? C.labelDisabled : C.labelDefault
    textColor   = hasValue ? (isDisabled ? C.valueDisabled : C.valueDefault) : C.placeholder
    labelBg     = labelUp ? C.bgLabel : 'transparent'
    chevronColor= isDisabled ? C.valueDisabled : C.valueDefault
  } else {
    bg          = isError ? C.filledBgIncorrect : isHover ? (isBrand ? C.brandBgHover : C.filledBgHover) : isDisabled ? C.filledBgDisabled : isBrand ? C.brandBg : C.filledBg
    borderColor = isOpen ? (isBrand ? C.brandStroke : C.filledStroke) : 'transparent'
    borderWidth = 3
    shadow      = 'none'
    labelColor  = isError ? C.filledLabelIncorrect : isOpen ? C.filledLabelFocused : isDisabled ? C.filledLabelDisabled : C.filledLabelFilled
    textColor   = hasValue ? (isDisabled ? '#c4cdd5' : C.filledValue) : C.filledPlaceholder
    labelBg     = 'transparent'
    chevronColor= isDisabled ? '#c4cdd5' : C.filledValue
  }

  const labelTop  = isOutlined ? (labelUp ? 12 : 12 + py + 12) : 10
  const labelLeft = isOutlined ? (labelUp ? 13 : C.paddingX) : C.paddingX
  const labelSize = isOutlined ? (labelUp ? 14 : 16) : 12

  return (
    <div style={{ width: '100%', opacity: isDisabled ? 0.55 : 1 }}>
      <div style={{ position: 'relative', paddingTop: isOutlined ? 12 : 0 }}>
        {isOutlined ? (
          /* ── Outlined inner box ──────────────────────────────────────── */
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            paddingLeft: C.paddingX, paddingRight: C.paddingX,
            height: py * 2 + 24,
            background: bg,
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: C.radius,
            boxShadow: shadow, cursor: 'pointer',
            transition: 'all .15s', userSelect: 'none',
          }}>
            <span style={{ flex: 1, fontSize: 16, fontFamily: 'Poppins, sans-serif', color: textColor, lineHeight: '24px' }}>
              {selectedLabel || '\u00a0'}
            </span>
            <ChevronIcon color={chevronColor} open={isOpen} />
          </div>
        ) : (
          /* ── Filled inner box — label at top:6, value at bottom:6 ───── */
          <div style={{
            position: 'relative',
            height: 62,
            background: bg,
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: C.radius,
            boxShadow: shadow, cursor: 'pointer',
            transition: 'all .15s', userSelect: 'none',
          }}>
            <span style={{ position: 'absolute', top: 6, left: C.paddingX, fontSize: 12, fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: labelColor, lineHeight: '16px', pointerEvents: 'none' }}>{label}</span>
            <div style={{ position: 'absolute', bottom: 6, left: C.paddingX, right: C.paddingX, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ flex: 1, fontSize: 16, fontFamily: 'Poppins, sans-serif', color: textColor, lineHeight: '24px' }}>
                {selectedLabel || <span style={{ color: C.filledPlaceholder }}>Select an option</span>}
              </span>
              <ChevronIcon color={chevronColor} open={isOpen} />
            </div>
          </div>
        )}

        {/* Floating label (outlined) */}
        {isOutlined && (
          <span style={{
            position: 'absolute', left: labelLeft, top: labelTop,
            transform: 'translateY(-50%)',
            background: labelBg, padding: labelUp ? '0 4px' : '0',
            fontSize: labelSize, fontWeight: labelUp ? 500 : 400,
            fontFamily: 'Poppins, sans-serif', color: labelColor,
            whiteSpace: 'nowrap', lineHeight: '24px',
            transition: 'all .15s', pointerEvents: 'none',
          }}>{label}</span>
        )}
      </div>

      {helper && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 4px', marginTop: 4 }}>
          {isError ? <WarningIcon color={C.helperIncorrect} /> : <InfoIcon color={C.helperDefault} />}
          <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', color: isError ? C.helperIncorrect : C.helperDefault }}>
            {isError ? 'Please select a valid option.' : 'Helper text'}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Live interactive select ──────────────────────────────────────────────────

function LiveSelect({ C, variant = 'outlined', multi = false, grouped = false, showHelper = false, error = false, label = 'Department' }) {
  const [isOpen,      setOpen]    = useState(false)
  const [selected,    setSelected]= useState([])
  const [highlighted, setHighlit] = useState(-1)
  const [hovered,     setHover]   = useState(false)
  const containerRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    function onDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false); setHighlit(-1)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function handleKeyDown(e) {
    const flatOptions = OPTIONS
    if (!isOpen) {
      if (['ArrowDown','ArrowUp','Enter',' '].includes(e.key)) {
        setOpen(true); setHighlit(0); e.preventDefault()
      }
    } else {
      if (e.key === 'ArrowDown') { setHighlit(h => Math.min(h + 1, flatOptions.length - 1)); e.preventDefault() }
      else if (e.key === 'ArrowUp') { setHighlit(h => Math.max(h - 1, 0)); e.preventDefault() }
      else if (e.key === 'Enter' || e.key === ' ') { if (highlighted >= 0) select(flatOptions[highlighted].value); e.preventDefault() }
      else if (e.key === 'Escape') { setOpen(false); setHighlit(-1); e.preventDefault() }
    }
  }

  function select(value) {
    if (multi) {
      setSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
    } else {
      setSelected([value]); setOpen(false); setHighlit(-1)
    }
  }

  const isOutlined  = variant === 'outlined'
  const isBrand     = variant === 'brand'
  const hasValue    = selected.length > 0
  const labelUp     = isOutlined ? (hasValue || isOpen) : true
  const py          = C.paddingY

  const displayText = multi
    ? selected.length === 0 ? '' : selected.length === 1 ? OPTIONS.find(o => o.value === selected[0])?.label : `${selected.length} selected`
    : OPTIONS.find(o => o.value === selected[0])?.label || ''

  let bg, borderColor, borderWidth, shadow, labelColor, textColor, labelBg, chevronColor

  if (isOutlined) {
    bg          = (hovered || isOpen) ? C.bgWhite : 'transparent'
    borderColor = error ? C.strokeIncorrect : isOpen ? C.strokeFocused : hovered ? C.strokeHover : C.strokeDefault
    borderWidth = (error || isOpen) ? 2 : 1
    shadow      = isOpen ? `0 0 0 3px ${C.focusShadow}` : hovered ? `0 0 0 4px ${C.hoverShadow}` : 'none'
    labelColor  = error ? C.labelIncorrect : isOpen ? C.labelFocused : (hovered || labelUp) ? C.labelFilled : C.labelDefault
    textColor   = hasValue ? C.valueDefault : C.placeholder
    labelBg     = labelUp ? C.bgLabel : 'transparent'
    chevronColor= C.valueDefault
  } else {
    bg          = error ? C.filledBgIncorrect : hovered ? (isBrand ? C.brandBgHover : C.filledBgHover) : isBrand ? C.brandBg : C.filledBg
    borderColor = isOpen ? (isBrand ? C.brandStroke : C.filledStroke) : 'transparent'
    borderWidth = 3; shadow = 'none'
    labelColor  = error ? C.filledLabelIncorrect : isOpen ? C.filledLabelFocused : C.filledLabelFilled
    textColor   = hasValue ? C.filledValue : C.filledPlaceholder
    labelBg     = 'transparent'
    chevronColor= C.filledValue
  }

  const labelTop  = isOutlined ? (labelUp ? 12 : 12 + py + 12) : 10
  const labelLeft = isOutlined ? (labelUp ? 13 : C.paddingX) : C.paddingX

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative' }} onKeyDown={handleKeyDown} tabIndex={0}
      role="combobox" aria-haspopup="listbox" aria-expanded={isOpen} aria-label={label}>

      {/* Trigger */}
      <div style={{ position: 'relative', paddingTop: isOutlined ? 12 : 0 }}>
        {isOutlined ? (
          /* ── Outlined trigger ────────────────────────────────────────── */
          <div
            onClick={() => { setOpen(o => !o); if (!isOpen) setHighlit(0) }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              paddingLeft: C.paddingX, paddingRight: C.paddingX,
              height: py * 2 + 24,
              background: bg, border: `${borderWidth}px solid ${borderColor}`,
              borderRadius: C.radius, boxShadow: shadow,
              cursor: 'pointer', transition: 'background .15s, border-color .15s, box-shadow .15s',
              userSelect: 'none',
            }}
          >
            <span style={{ flex: 1, fontSize: 16, fontFamily: 'Poppins, sans-serif', color: textColor, lineHeight: '24px' }}>
              {displayText || '\u00a0'}
            </span>
            <ChevronIcon color={chevronColor} open={isOpen} />
          </div>
        ) : (
          /* ── Filled trigger — label top:6, value bottom:6 ───────────── */
          <div
            onClick={() => { setOpen(o => !o); if (!isOpen) setHighlit(0) }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              position: 'relative', height: 62,
              background: bg, border: `${borderWidth}px solid ${borderColor}`,
              borderRadius: C.radius, boxShadow: shadow,
              cursor: 'pointer', transition: 'background .15s, border-color .15s, box-shadow .15s',
              userSelect: 'none',
            }}
          >
            <span style={{ position: 'absolute', top: 6, left: C.paddingX, fontSize: 12, fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: labelColor, lineHeight: '16px', pointerEvents: 'none', transition: 'color .15s' }}>{label}</span>
            <div style={{ position: 'absolute', bottom: 6, left: C.paddingX, right: C.paddingX, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ flex: 1, fontSize: 16, fontFamily: 'Poppins, sans-serif', color: textColor, lineHeight: '24px' }}>
                {displayText || <span style={{ color: C.filledPlaceholder }}>Select an option</span>}
              </span>
              <ChevronIcon color={chevronColor} open={isOpen} />
            </div>
          </div>
        )}

        {isOutlined && (
          <span style={{
            position: 'absolute', left: labelLeft, top: labelTop, transform: 'translateY(-50%)',
            background: labelBg, padding: labelUp ? '0 4px' : '0',
            fontSize: labelUp ? 14 : 16, fontWeight: labelUp ? 500 : 400,
            fontFamily: 'Poppins, sans-serif', color: labelColor,
            whiteSpace: 'nowrap', lineHeight: '24px', transition: 'all .15s', pointerEvents: 'none',
          }}>{label}</span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <DropdownMenu C={C} options={OPTIONS} selected={selected} onSelect={select} multi={multi} grouped={grouped} />
      )}

      {/* Helper */}
      {(showHelper || error) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 4px', marginTop: 4 }}>
          {error ? <WarningIcon color={C.helperIncorrect} /> : <InfoIcon color={C.helperDefault} />}
          <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', color: error ? C.helperIncorrect : C.helperDefault }}>
            {error ? 'Please select a valid option.' : 'Helper text'}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Static dropdown preview (for anatomy section) ────────────────────────────

function StaticDropdown({ C, selected = ['engineering'], multi = false }) {
  const [hov, setHov] = useState(null)
  return (
    <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid var(--stroke-primary)', boxShadow: C.menuShadow, padding: '6px', minWidth: 200 }}>
      {OPTIONS.map(opt => {
        const isSel = selected.includes(opt.value)
        const bg = multi
          ? (hov === opt.value ? C.menuHoverBg : 'transparent')
          : (isSel ? C.menuSelectedBg : hov === opt.value ? C.menuHoverBg : 'transparent')
        return (
          <div key={opt.value}
            onMouseEnter={() => setHov(opt.value)} onMouseLeave={() => setHov(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 6, cursor: 'pointer', margin: '2px 0',
              background: bg,
              fontSize: 14, fontFamily: 'Poppins, sans-serif', color: '#141a21',
            }}>
            {multi ? (
              <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, background: isSel ? C.brand : 'transparent', border: `1.5px solid ${isSel ? C.brand : '#919eab'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSel && <CheckIcon color="#fff" size={10} />}
              </div>
            ) : (
              <div style={{ width: 14, flexShrink: 0 }}>{isSel && <CheckIcon color={C.brand} size={14} />}</div>
            )}
            {opt.label}
          </div>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'demo',          label: 'Interactive demo' },
  { id: 'states',        label: 'States' },
  { id: 'anatomy',       label: 'Anatomy' },
  { id: 'groups',        label: 'Groups' },
  { id: 'label',         label: 'Label' },
  { id: 'variants',      label: 'Variants' },
  { id: 'dosdonts',      label: 'Do\'s & Don\'ts' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'tokens',        label: 'Token reference' },
]

export default function SelectPage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [activeSection, setActiveSection] = useState('demo')
  const [variant,     setVariant]   = useState('outlined')
  const [demoMulti,   setMulti]     = useState(false)
  const [demoGrouped, setGrouped]   = useState(false)
  const [demoHelper,  setHelper]    = useState(false)
  const [demoError,   setError]     = useState(false)

  const theme  = VISIBLE_THEMES.find(t => t.id === activeTheme) || VISIBLE_THEMES[0]
  const tokens = getComponentTokens(theme.id)
  const C      = getColors(tokens)
  const THEME_COLORS = VISIBLE_THEMES.map(t => getComponentTokens(t.id)['tabs.indicator'] || '#07a2b6')

  const isOutlined = variant === 'outlined'

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
      <div style={{ flex: 1, minWidth: 0, padding: '40px 56px 96px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: C.brand }}>Forms</span>
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', marginBottom: 16 }}>Select</h1>

      <Lead>
        The Select lets users pick one option (or multiple, with checkboxes) from a predefined dropdown list. It inherits all visual tokens from the Text Field and follows the same three-variant system: <strong>Outlined</strong>, <strong>Filled Neutral</strong>, and <strong>Filled Brand</strong>. The dropdown panel uses the same visual style as the Popover Menu.
      </Lead>

      {/* Variant rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: C.brand + '10', borderRadius: 10, marginBottom: 32, border: `1px solid ${C.brand}30`, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.brand, marginRight: 4 }}>⚠ Variant rule:</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>Use the same variant as your Text Field and Text Area. Never mix form variants within one product.</span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {[['outlined','Outlined'],['neutral','Filled Neutral'],['brand','Filled Brand']].map(([val, lbl]) => (
          <button key={val} onClick={() => setVariant(val)} style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
            background: variant === val ? C.brand : 'transparent',
            color: variant === val ? '#fff' : 'var(--text-secondary)',
            border: `1px solid ${variant === val ? C.brand : 'var(--stroke-primary)'}`,
            transition: 'all .15s',
          }}>{lbl}</button>
        ))}
      </div>

      <Rule />

      {/* ── Demo ── */}
      <SectionAnchor id="demo" />
      <H2>Interactive demo</H2>
      <P>Click the trigger to open the dropdown. Use <Code>↑</Code> <Code>↓</Code> to navigate, <Code>Enter</Code> to select, <Code>Esc</Code> to close.</P>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        {[
          [demoMulti,   () => setMulti(v => !v),   'Multi-select'],
          [demoGrouped, () => setGrouped(v => !v), 'Option groups'],
          [demoHelper,  () => setHelper(v => !v),  'Helper text'],
          [demoError,   () => setError(v => !v),   'Error state'],
        ].map(([val, toggle, lbl]) => (
          <div key={lbl}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>{lbl}</div>
            <button onClick={toggle} style={{
              padding: '4px 14px', borderRadius: 6, fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
              background: val ? C.brand : 'transparent', color: val ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${val ? C.brand : 'var(--stroke-primary)'}`,
            }}>{val ? 'On' : 'Off'}</button>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--stroke-primary)', borderRadius: 12, padding: '32px 40px', display: 'flex', justifyContent: 'center', minHeight: 340 }}>
        <div style={{ width: 320, paddingTop: isOutlined ? 0 : 0 }}>
          <LiveSelect C={C} variant={variant} multi={demoMulti} grouped={demoGrouped} showHelper={demoHelper} error={demoError} />
        </div>
      </div>

      <Rule />

      {/* ── States ── */}
      <SectionAnchor id="states" />
      <H2>States</H2>
      <P>The Select trigger shares the same visual state set as the Text Field. The dropdown has its own hover and selected states on each option item.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
        <div><StateLabel>Default — empty</StateLabel><SField C={C} variant={variant} state="default" /></div>
        <div><StateLabel>Filled — has selection</StateLabel><SField C={C} variant={variant} state="filled" selectedLabel="Engineering" /></div>
        <div><StateLabel>Hover</StateLabel><SField C={C} variant={variant} state="hover" selectedLabel="Engineering" /></div>
        <div><StateLabel>Open / focused</StateLabel><SField C={C} variant={variant} state="open" selectedLabel="Engineering" /></div>
        <div><StateLabel>Disabled</StateLabel><SField C={C} variant={variant} state="disabled" selectedLabel="Engineering" /></div>
        <div><StateLabel>Error</StateLabel><SField C={C} variant={variant} state="error" selectedLabel="" helper /></div>
      </div>

      <Rule />

      {/* ── Dropdown anatomy ── */}
      <SectionAnchor id="anatomy" />
      <H2>Dropdown anatomy</H2>
      <P>The dropdown panel matches the Popover Menu visual style — white background, 1px border, 12px radius, Z2 shadow. Option items have 8px/12px padding and 6px radius.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <H3>Single-select</H3>
          <P>A leading checkmark (in brand color) marks the selected item. The selected row uses a neutral tinted background.</P>
          <StaticDropdown C={C} selected={['engineering']} multi={false} />
        </div>
        <div>
          <H3>Multi-select</H3>
          <P>Each option has a checkbox. Checked items use the brand color for the checkbox fill. Multiple items can be selected simultaneously.</P>
          <StaticDropdown C={C} selected={['design','product']} multi={true} />
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {[
          ['Option — default',  'No background. Poppins Regular 14px.'],
          ['Option — hover',    `Background: ${C.menuHoverBg}. Triggered on mouse enter.`],
          ['Option — selected', `Background: ${C.menuSelectedBg}. Leading check or filled checkbox.`],
          ['Dropdown container','White bg, 1px border, border-radius 12px, Z2 shadow (0 4px 8px rgba(171,190,209,0.4)).'],
        ].map(([title, desc]) => (
          <div key={title} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.brand, flexShrink: 0, marginTop: 5 }} />
            <div><strong style={{ color: 'var(--text-primary)' }}>{title}:</strong> {desc}</div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Option groups ── */}
      <SectionAnchor id="groups" />
      <H2>Option groups</H2>
      <P>Group options under section labels when the list is long or the items fall into clear categories. Group labels are 11px uppercase, non-interactive, and separated by a divider.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <H3>Without groups</H3>
          <StaticDropdown C={C} selected={[]} />
        </div>
        <div>
          <H3>With groups</H3>
          <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid var(--stroke-primary)', boxShadow: C.menuShadow, padding: '6px', minWidth: 200 }}>
            {GROUPED_OPTIONS.map(({ group, items }, gi) => (
              <div key={group}>
                <div style={{ padding: '6px 12px 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: '#919eab' }}>{group}</div>
                {items.map(opt => (
                  <div key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', margin: '2px 0', borderRadius: 6, fontSize: 14, fontFamily: 'Poppins, sans-serif', color: '#141a21' }}>
                    <div style={{ width: 14 }} />
                    {opt.label}
                  </div>
                ))}
                {gi < GROUPED_OPTIONS.length - 1 && <div style={{ height: 1, background: 'var(--stroke-primary)', margin: '4px 6px' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Rule />

      {/* ── Label behavior ── */}
      <SectionAnchor id="label" />
      <H2>Label behavior</H2>

      {isOutlined ? (
        <>
          <H3>Floating label — Outlined</H3>
          <P>The label sits inside the trigger at full size when empty. When an option is selected or the dropdown opens, it floats up to the top border with a white background — identical to the Text Field outlined pattern.</P>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div><StateLabel>1. Empty</StateLabel><SField C={C} variant="outlined" state="default" /></div>
            <div><StateLabel>2. Open (label floats)</StateLabel><SField C={C} variant="outlined" state="open" /></div>
            <div><StateLabel>3. Selection made</StateLabel><SField C={C} variant="outlined" state="filled" selectedLabel="Engineering" /></div>
          </div>
        </>
      ) : (
        <>
          <H3>Fixed label — Filled</H3>
          <P>For filled variants, the label is always visible at 12px in the top-left of the trigger. Only the label color changes on open or error — the trigger height never changes.</P>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div><StateLabel>1. Empty</StateLabel><SField C={C} variant={variant} state="default" /></div>
            <div><StateLabel>2. Open</StateLabel><SField C={C} variant={variant} state="open" /></div>
            <div><StateLabel>3. Selection made</StateLabel><SField C={C} variant={variant} state="filled" selectedLabel="Engineering" /></div>
          </div>
        </>
      )}

      <Rule />

      {/* ── All variants ── */}
      <SectionAnchor id="variants" />
      <H2>All three variants</H2>
      <P>All three variants shown at filled (has-selection) state for direct comparison. Your choice must match the rest of the form.</P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { v: 'outlined', lbl: 'Outlined' },
          { v: 'neutral',  lbl: 'Filled Neutral' },
          { v: 'brand',    lbl: 'Filled Brand' },
        ].map(({ v, lbl }) => (
          <div key={v} style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', border: variant === v ? `2px solid ${C.brand}` : '1px solid var(--stroke-primary)' }}>
            <div style={{ padding: '20px 20px 4px' }}>
              <SField C={C} variant={v} state="filled" selectedLabel="Engineering" />
            </div>
            <div style={{ padding: '10px 20px 14px', fontSize: 13, fontWeight: 600, color: variant === v ? C.brand : 'var(--text-secondary)' }}>
              {lbl}{variant === v ? ' — active' : ''}
            </div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Do / Don't ── */}
      <SectionAnchor id="dosdonts" />
      <H2>Do & Don't</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <DoBox visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 260 }}>
            <SField C={C} variant={variant} state="default" label="Country" />
            <SField C={C} variant={variant} state="default" label="State / Province" />
          </div>
        }>
          Use progressive disclosure — show dependent selects only when relevant. A "State" select only appears once a Country has been chosen.
        </DoBox>
        <DontBox visual={
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #919eab' }} />
            <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #919eab' }} />
            <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #919eab', background: C.brand }} />
          </div>
        }>
          Don't use a Select when there are fewer than 4 options. Use Radio buttons instead — they show all choices at once and require fewer interactions.
        </DontBox>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DoBox visual={
          <SField C={C} variant={variant} state="default" label="Department" helper={false} />
        }>
          Always provide a visible label. Never rely solely on placeholder text to describe the field — it disappears once a selection is made.
        </DoBox>
        <DontBox visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 260 }}>
            <SField C={C} variant="outlined" state="filled" selectedLabel="Edit" />
            <SField C={C} variant="outlined" state="filled" selectedLabel="Delete" />
          </div>
        }>
          Don't use a Select as a navigation or action menu. Selects persist a user's chosen value; for actions (copy, delete, go to page), use a Popover Menu or Button instead.
        </DontBox>
      </div>

      <Rule />

      {/* ── Accessibility ── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>

      <H3>Keyboard navigation</H3>
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              {['Key', 'Behavior'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['↓ Arrow Down', 'Open dropdown (if closed). Move highlight to next option.'],
              ['↑ Arrow Up', 'Move highlight to previous option.'],
              ['Enter / Space', 'Open dropdown (if closed). Select highlighted option.'],
              ['Escape', 'Close dropdown without changing selection.'],
              ['Tab', 'Close dropdown and move focus to next focusable element.'],
              ['Click outside', 'Close dropdown without changing selection.'],
            ].map(([key, behavior]) => (
              <tr key={key} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
                <td style={{ padding: '8px 14px' }}><Code>{key}</Code></td>
                <td style={{ padding: '8px 14px', color: 'var(--text-secondary)' }}>{behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['role="combobox"',     'The trigger element carries role="combobox" with aria-haspopup="listbox" and aria-expanded to reflect open state.'],
          ['role="listbox"',      'The dropdown panel carries role="listbox". Each option has role="option" and aria-selected.'],
          ['aria-labelledby',     'Link the trigger to a <label> via aria-labelledby or use aria-label directly. Never rely on placeholder text for accessible naming.'],
          ['Error announcement',  'Bind the error message to the trigger via aria-describedby so screen readers announce it on focus.'],
          ['Disabled options',    'Mark disabled options with aria-disabled="true". They remain in the DOM but are skipped by keyboard navigation and cannot be selected.'],
        ].map(([title, detail]) => (
          <div key={title} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.brand, flexShrink: 0, marginTop: 7 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}><Code>{title}</Code></div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{detail}</div>
            </div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Token reference ── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>
      <P>The Select inherits all tokens from the Text Field (<Code>inputfield.*</Code>) and adds two dropdown-specific tokens for option item backgrounds.</P>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              {['Token', 'Resolved value', 'Role'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['inputfield.outlined.container.stroke.default',   C.strokeDefault,   'Trigger border — default'],
              ['inputfield.outlined.container.stroke.hover',     C.strokeHover,     'Trigger border — hover'],
              ['inputfield.outlined.container.stroke.focused',   C.strokeFocused,   'Trigger border — open'],
              ['inputfield.outlined.container.stroke.incorrect', C.strokeIncorrect, 'Trigger border — error'],
              ['inputfield.outlined.container.focused-shadow',   C.focusShadow,     'Glow ring — open'],
              ['inputfield.outlined.container.hover-shadow',     C.hoverShadow,     'Glow ring — hover'],
              ['inputfield.outlined.label.default',              C.labelDefault,    'Label — empty'],
              ['inputfield.outlined.label.default-filled',       C.labelFilled,     'Label — has selection'],
              ['inputfield.outlined.label.focused',              C.labelFocused,    'Label — open'],
              ['inputfield.outlined.label.incorrect',            C.labelIncorrect,  'Label — error'],
              ['inputfield.outlined.value.default',              C.valueDefault,    'Selected value text'],
              ['inputfield.outlined.placeholder-color',          C.placeholder,     'Placeholder / empty text'],
              ['— (neutral/200)',                                C.menuHoverBg,     'Option — hover bg (from neutral palette)'],
              ['— (neutral/300)',                                C.menuSelectedBg,  'Option — selected bg (single-select only)'],
            ].map(([key, val, role]) => (
              <tr key={key} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
                <td style={{ padding: '8px 14px' }}><Code>{key}</Code></td>
                <td style={{ padding: '8px 14px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 14, height: 14, borderRadius: 3, background: val, border: '1px solid var(--stroke-primary)', display: 'inline-block', flexShrink: 0 }} />
                    <code style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>{val}</code>
                  </span>
                </td>
                <td style={{ padding: '8px 14px', color: 'var(--text-secondary)' }}>{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      </div>

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
