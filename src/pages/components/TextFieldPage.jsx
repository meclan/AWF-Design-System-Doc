import React, { useState, useRef } from 'react'
import { THEMES, getComponentTokens } from '../../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

// ─── Color blend helper ───────────────────────────────────────────────────────

function blendWithWhite(hex, opacity) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const toHex = n => Math.round(n).toString(16).padStart(2, '0')
  return `#${toHex(r * opacity + 255 * (1 - opacity))}${toHex(g * opacity + 255 * (1 - opacity))}${toHex(b * opacity + 255 * (1 - opacity))}`
}

// ─── Token extractor ──────────────────────────────────────────────────────────

function getInputColors(t) {
  const brand = t['tabs.indicator'] || '#07a2b6'
  const n = k => (typeof t[k] === 'number' ? t[k] : null)
  return {
    brand,
    // ── Outlined ──────────────────────────────────────────────────────────────
    bgWhite:         t['inputfield.outlined.container.bg.white']          || '#ffffff',
    bgLabel:         t['inputfield.outlined.container.bg.label']          || '#ffffff',
    strokeDefault:   t['inputfield.outlined.container.stroke.default']    || '#c4cdd5',
    strokeHover:     t['inputfield.outlined.container.stroke.hover']      || '#637381',
    strokeFocused:   t['inputfield.outlined.container.stroke.focused']    || brand,
    strokeDisabled:  t['inputfield.outlined.container.stroke.disabled']   || '#dfe3e8',
    strokeIncorrect: t['inputfield.outlined.container.stroke.incorrect']   || '#f6643f',
    radius:          n('inputfield.outlined.container.radius')             ?? 8,
    focusShadow:     t['inputfield.outlined.container.focused-shadow']    || '#9fefff',
    hoverShadow:     t['inputfield.outlined.container.hover-shadow']      || '#dfe3e8',
    labelDefault:    t['inputfield.outlined.label.default']               || '#919eab',
    labelFilled:     t['inputfield.outlined.label.default-filled']        || '#637381',
    labelFocused:    t['inputfield.outlined.label.focused']               || '#454f5b',
    labelDisabled:   t['inputfield.outlined.label.disabled']              || '#c4cdd5',
    labelIncorrect:  t['inputfield.outlined.label.incorrect']             || '#f6643f',
    paddingX:        n('inputfield.outlined.size.padding-x')              ?? 16,
    paddingLg:       n('inputfield.outlined.size.lg.padding-y')           ?? 12,
    paddingMd:       n('inputfield.outlined.size.md.padding-y')           ?? 8,
    paddingSm:       n('inputfield.outlined.size.sm.padding-y')           ?? 4,
    valueDefault:    t['inputfield.outlined.value.default']               || '#141a21',
    valueDisabled:   t['inputfield.outlined.value.disabled']              || '#c4cdd5',
    placeholder:     t['inputfield.outlined.placeholder-color']           || '#c4cdd5',
    helperDefault:   t['inputfield.outlined.helper.default']              || '#637381',
    helperIncorrect: t['inputfield.outlined.helper.incorrect']            || '#f6643f',
    iconDefault:     t['inputfield.outlined.icon.default']                || '#637381',
    iconDisabled:    t['inputfield.outlined.icon.disabled']               || '#c4cdd5',
    // ── Filled ────────────────────────────────────────────────────────────────
    filledBg:          t['inputfield.filled.container.bg.default']        || '#f4f6f8',
    filledBgHover:     t['inputfield.filled.container.bg.hover']          || '#dfe3e8',
    filledBgIncorrect: t['inputfield.filled.container.bg.incorrect']      || '#fee8e2',
    filledBgDisabled:  t['inputfield.filled.container.bg.disabled']       || '#f4f6f8',
    filledStroke:      t['inputfield.filled.container.stroke.focused']    || '#919eab',
    filledLabelDefault:  t['inputfield.filled.label.default']             || '#919eab',
    filledLabelFilled:   t['inputfield.filled.label.default-filled']      || '#637381',
    filledLabelFocused:  t['inputfield.filled.label.focused']             || '#454f5b',
    filledLabelDisabled: t['inputfield.filled.label.disabled']            || '#c4cdd5',
    filledLabelIncorrect:t['inputfield.filled.label.incorrect']           || '#f6643f',
    filledValue:         '#454f5b',
    filledValueDisabled: '#c4cdd5',
    filledPlaceholder:   '#c4cdd5',
    // Brand filled – derived from brand color
    brandBg:          blendWithWhite(brand, 0.10),
    brandBgHover:     blendWithWhite(brand, 0.16),
    brandStroke:      t['inputfield.filled-brand.stroke.focused']               || '#9FEFFF',//blendWithWhite(brand, 0.50),
  }
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const WarningIcon = ({ color = '#f6643f', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill={color} />
  </svg>
)
const EyeIcon = ({ color = '#637381', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill={color} />
  </svg>
)
const InfoIcon = ({ color = '#637381', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill={color} />
  </svg>
)

// ─── Shared page primitives ───────────────────────────────────────────────────

function SectionAnchor({ id }) {
  return <span id={id} style={{ display: 'block', marginTop: -80, paddingTop: 80 }} />
}
function H2({ children }) {
  return <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--text-primary)', marginBottom: 12, marginTop: 56 }}>{children}</h2>
}
function H3({ children }) {
  return <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, marginTop: 28 }}>{children}</h3>
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
function Rule() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--stroke-primary)', margin: '48px 0' }} />
}
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

// ─── Outlined field: static display ──────────────────────────────────────────
// state: 'default' | 'hover' | 'focused' | 'disabled' | 'error'
// content: 'empty' | 'placeholder' | 'value'

function OField({ C, label = 'Label', content = 'empty', state = 'default', size = 'lg', leadIcon = false, trailIcon = false, helper = false }) {
  const isError    = state === 'error'
  const isFocused  = state === 'focused'
  const isDisabled = state === 'disabled'
  const isHover    = state === 'hover'
  const hasContent = content !== 'empty'
  const labelUp    = hasContent || isFocused

  const py = size === 'lg' ? C.paddingLg : size === 'md' ? C.paddingMd : C.paddingSm

  const borderColor   = isError ? C.strokeIncorrect : isFocused ? C.strokeFocused : isHover ? C.strokeHover : isDisabled ? C.strokeDisabled : C.strokeDefault
  const borderWidth   = (isError || isFocused) ? 2 : 1
  const boxShadow     = isFocused ? `0 0 0 3px ${C.focusShadow}` : isHover ? `0 0 0 4px ${C.hoverShadow}` : 'none'
  const bg            = (isHover || isFocused) ? C.bgWhite : 'transparent'

  const labelColor    = isError ? C.labelIncorrect : isFocused ? C.labelFocused : (isHover || labelUp) ? C.labelFilled : isDisabled ? C.labelDisabled : C.labelDefault
  const textColor     = content === 'value' ? (isDisabled ? C.valueDisabled : C.valueDefault) : C.placeholder
  const labelTop      = labelUp ? 12 : 12 + py + 12
  const labelLeft     = labelUp ? 13 : C.paddingX + (leadIcon ? 34 : 0)

  const text = content === 'value' ? 'Value' : content === 'placeholder' ? 'Placeholder' : ''

  return (
    <div style={{ width: '100%', opacity: isDisabled ? 0.55 : 1 }}>
      <div style={{ position: 'relative', paddingTop: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: `${py}px ${C.paddingX}px`,
          background: bg,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: C.radius,
          boxShadow,
          transition: 'all .15s',
          minHeight: 24 + py * 2,
        }}>
          {leadIcon && <WarningIcon color={isError ? C.strokeIncorrect : C.iconDefault} size={20} />}
          <span style={{ flex: 1, fontSize: 16, fontFamily: 'Poppins, sans-serif', color: textColor, lineHeight: '24px' }}>
            {text}{isFocused ? '|' : ''}
          </span>
          {trailIcon && <EyeIcon color={isDisabled ? C.iconDisabled : C.iconDefault} />}
        </div>
        <span style={{
          position: 'absolute', left: labelLeft, top: labelTop,
          transform: 'translateY(-50%)',
          background: labelUp ? C.bgLabel : 'transparent',
          padding: labelUp ? '0 4px' : '0',
          fontSize: labelUp ? 14 : 16,
          fontWeight: labelUp ? 500 : 400,
          fontFamily: 'Poppins, sans-serif',
          color: labelColor,
          whiteSpace: 'nowrap', lineHeight: '24px',
          transition: 'all .15s',
          pointerEvents: 'none',
        }}>{label}</span>
      </div>
      {helper && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', marginTop: 2 }}>
          {isError ? <WarningIcon color={C.helperIncorrect} size={16} /> : <InfoIcon color={C.helperDefault} />}
          <span style={{ fontSize: 12, color: isError ? C.helperIncorrect : C.helperDefault, fontFamily: 'Poppins, sans-serif' }}>Helper text</span>
        </div>
      )}
    </div>
  )
}

// ─── Filled field: static display ─────────────────────────────────────────────
// colorScheme: 'neutral' | 'brand'
// content: 'empty' | 'placeholder' | 'value'  — 'empty' = single-line unfloated

function FField({ C, label = 'Label', content = 'empty', state = 'default', size = 'lg', colorScheme = 'neutral', leadIcon = false, trailIcon = false, helper = false, floatingLabel = false }) {
  const isError    = state === 'error'
  const isFocused  = state === 'focused'
  const isDisabled = state === 'disabled'
  const isHover    = state === 'hover'
  const hasValue   = content === 'value'
  const hasText    = content === 'placeholder' || hasValue

  const containerH = 62   // fixed height for floating-label filled field (both sizes)

  const bg = isError ? C.filledBgIncorrect
    : isHover   ? (colorScheme === 'brand' ? C.brandBgHover : C.filledBgHover)
    : isDisabled? C.filledBgDisabled
    : colorScheme === 'brand' ? C.brandBg : C.filledBg

  const focusStroke  = colorScheme === 'brand' ? C.brandStroke : C.filledStroke
  const labelColor   = isError ? C.filledLabelIncorrect : isFocused ? C.filledLabelFocused : isDisabled ? C.filledLabelDisabled : C.filledLabelFilled
  const textColor    = hasValue ? (isDisabled ? C.filledValueDisabled : C.filledValue) : C.filledPlaceholder
  const displayText  = hasValue ? 'Value' : content === 'placeholder' ? 'Placeholder…' : ''

  // ── Floating-label variant (label slides from center to top) ──────────────
  if (floatingLabel) {
    const floated = isFocused || hasText
    return (
      <div style={{ width: '100%', opacity: isDisabled ? 0.55 : 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          height: containerH, padding: '0 16px',
          background: bg,
          border: isFocused ? `3px solid ${focusStroke}` : '3px solid transparent',
          borderRadius: C.radius, position: 'relative', boxSizing: 'border-box',
        }}>
          {leadIcon && <WarningIcon color={isError ? C.strokeIncorrect : C.iconDefault} size={20} />}
          <div style={{ flex: 1, minWidth: 0, position: 'relative', alignSelf: 'stretch' }}>
            {/* Label: absolutely positioned, slides between center and top */}
            <div style={{
              position: 'absolute', left: 0, pointerEvents: 'none',
              top: floated ? 6 : '50%',
              transform: floated ? 'none' : 'translateY(-50%)',
              fontSize: floated ? 12 : 16,
              fontWeight: floated ? 500 : 400,
              fontFamily: 'Poppins, sans-serif',
              lineHeight: floated ? '16px' : '24px',
              color: floated ? labelColor : C.filledLabelDefault,
            }}>{label}</div>
            {/* Value row: visible only when floated */}
            <div style={{
              position: 'absolute', bottom: 6, left: 0, right: 0,
              fontSize: 16, fontFamily: 'Poppins, sans-serif', lineHeight: '24px',
              color: displayText ? textColor : C.filledPlaceholder,
              opacity: floated ? 1 : 0,
            }}>
              {displayText || (isFocused ? '|' : '')}
            </div>
          </div>
          {trailIcon && <EyeIcon color={isDisabled ? C.iconDisabled : C.iconDefault} />}
        </div>
        {helper && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 12px', marginTop: 2 }}>
            {isError ? <WarningIcon color={C.helperIncorrect} size={16} /> : <InfoIcon color={C.helperDefault} />}
            <span style={{ fontSize: 12, color: isError ? C.helperIncorrect : C.helperDefault, fontFamily: 'Poppins, sans-serif' }}>Helper text</span>
          </div>
        )}
      </div>
    )
  }

  // ── Fixed-label variant (label always small at top, height never changes) ────
  const py = size === 'lg' ? 10 : 6
  return (
    <div style={{ width: '100%', opacity: isDisabled ? 0.55 : 1 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: `${py}px 16px`,
        background: bg,
        border: isFocused ? `3px solid ${focusStroke}` : '3px solid transparent',
        borderRadius: C.radius, transition: 'all .15s',
      }}>
        {leadIcon && <WarningIcon color={isError ? C.strokeIncorrect : C.iconDefault} size={20} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Label always at top, only color changes */}
          <div style={{ fontSize: 12, fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: labelColor, lineHeight: '16px', marginBottom: 2, transition: 'color .15s' }}>{label}</div>
          <div style={{ fontSize: 16, fontFamily: 'Poppins, sans-serif', lineHeight: '24px', color: displayText ? textColor : C.filledPlaceholder }}>
            {displayText || (isFocused ? '|' : <span style={{ opacity: 0.4 }}>Type something…</span>)}
          </div>
        </div>
        {trailIcon && <EyeIcon color={isDisabled ? C.iconDisabled : C.iconDefault} />}
      </div>
      {helper && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 12px', marginTop: 2 }}>
          {isError ? <WarningIcon color={C.helperIncorrect} size={16} /> : <InfoIcon color={C.helperDefault} />}
          <span style={{ fontSize: 12, color: isError ? C.helperIncorrect : C.helperDefault, fontFamily: 'Poppins, sans-serif' }}>Helper text</span>
        </div>
      )}
    </div>
  )
}

// ─── Live interactive outlined field ─────────────────────────────────────────

function LiveOutlined({ C, size = 'lg', label = 'Label', showHelper = false, showLead = false, showTrail = false, error = false }) {
  const [val, setVal]       = useState('')
  const [focused, setFocus] = useState(false)
  const [hovered, setHover] = useState(false)

  const isErr    = error
  const labelUp  = focused || !!val
  const py       = size === 'lg' ? C.paddingLg : size === 'md' ? C.paddingMd : C.paddingSm
  const bColor   = isErr ? C.strokeIncorrect : focused ? C.strokeFocused : hovered ? C.strokeHover : C.strokeDefault
  const bWidth   = (isErr || focused) ? 2 : 1
  const shadow   = focused ? `0 0 0 3px ${C.focusShadow}` : hovered ? `0 0 0 4px ${C.hoverShadow}` : 'none'
  const bg       = (hovered || focused) ? C.bgWhite : 'transparent'
  const lColor   = isErr ? C.labelIncorrect : focused ? C.labelFocused : (hovered || labelUp) ? C.labelFilled : C.labelDefault
  const labelTop = labelUp ? 12 : 12 + py + 12
  const labelLeft= labelUp ? 13 : C.paddingX + (showLead ? 34 : 0)

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', paddingTop: 12 }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: `${py}px ${C.paddingX}px`,
            background: bg,
            border: `${bWidth}px solid ${bColor}`,
            borderRadius: C.radius,
            boxShadow: shadow,
            transition: 'all .15s',
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {showLead && <WarningIcon color={isErr ? C.strokeIncorrect : C.iconDefault} size={20} />}
          <input
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent',
              fontSize: 16, fontFamily: 'Poppins, sans-serif',
              color: C.valueDefault, minWidth: 0, lineHeight: '24px',
            }}
            placeholder={labelUp ? 'Type something…' : ''}
            value={val}
            onChange={e => setVal(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
          {showTrail && <EyeIcon color={C.iconDefault} />}
        </div>
        <label style={{
          position: 'absolute', left: labelLeft, top: labelTop,
          transform: 'translateY(-50%)',
          background: labelUp ? C.bgLabel : 'transparent',
          padding: labelUp ? '0 4px' : '0',
          fontSize: labelUp ? 14 : 16,
          fontWeight: labelUp ? 500 : 400,
          fontFamily: 'Poppins, sans-serif',
          color: lColor,
          whiteSpace: 'nowrap', lineHeight: '24px',
          transition: 'all .15s', pointerEvents: 'none',
        }}>{label}</label>
      </div>
      {(showHelper || isErr) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', marginTop: 2 }}>
          {isErr ? <WarningIcon color={C.helperIncorrect} size={16} /> : <InfoIcon color={C.helperDefault} />}
          <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', color: isErr ? C.helperIncorrect : C.helperDefault }}>
            {isErr ? 'This field contains an error.' : 'Helper text'}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Live interactive filled field ────────────────────────────────────────────

function LiveFilled({ C, size = 'lg', label = 'Label', colorScheme = 'neutral', showHelper = false, showLead = false, showTrail = false, error = false, floatingLabel = false }) {
  const [val, setVal]       = useState('')
  const [focused, setFocus] = useState(false)
  const [hovered, setHover] = useState(false)
  const inputRef            = useRef(null)

  const containerH  = 62   // fixed height for floating-label mode
  const py          = size === 'lg' ? 10 : 6
  const floated     = focused || !!val   // used only in floating-label mode

  const bg = error ? C.filledBgIncorrect
    : hovered   ? (colorScheme === 'brand' ? C.brandBgHover : C.filledBgHover)
    : colorScheme === 'brand' ? C.brandBg : C.filledBg

  const focusStroke  = colorScheme === 'brand' ? C.brandStroke : C.filledStroke
  const labelColor   = error ? C.filledLabelIncorrect : focused ? C.filledLabelFocused : C.filledLabelFilled

  // ── Floating-label mode ────────────────────────────────────────────────────
  if (floatingLabel) {
    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            height: containerH, padding: '0 16px', boxSizing: 'border-box',
            background: bg,
            border: focused ? `3px solid ${focusStroke}` : '3px solid transparent',
            borderRadius: C.radius, position: 'relative', cursor: 'text',
            transition: 'background .15s, border-color .15s',
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => inputRef.current?.focus()}
        >
          {showLead && <WarningIcon color={error ? C.strokeIncorrect : C.iconDefault} size={20} />}
          <div style={{ flex: 1, minWidth: 0, position: 'relative', alignSelf: 'stretch' }}>
            {/* Label slides from center (empty) to top (focused / has value) */}
            <div style={{
              position: 'absolute', left: 0, pointerEvents: 'none',
              top: floated ? 6 : '50%',
              transform: floated ? 'none' : 'translateY(-50%)',
              fontSize: floated ? 12 : 16,
              fontWeight: floated ? 500 : 400,
              fontFamily: 'Poppins, sans-serif',
              lineHeight: floated ? '16px' : '24px',
              color: floated ? labelColor : C.filledLabelDefault,
              transition: 'top .15s, transform .15s, font-size .15s, color .15s',
              whiteSpace: 'nowrap',
            }}>{label}</div>
            {/* Input: always mounted, invisible until label floats */}
            <input
              ref={inputRef}
              style={{
                position: 'absolute', bottom: 6, left: 0, width: '100%',
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 16, fontFamily: 'Poppins, sans-serif',
                color: C.filledValue, caretColor: C.filledValue, padding: 0,
                lineHeight: '24px',
                opacity: floated ? 1 : 0,
                transition: 'opacity .1s',
              }}
              placeholder={floated ? 'Type something…' : ''}
              value={val}
              onChange={e => setVal(e.target.value)}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </div>
          {showTrail && <EyeIcon color={C.iconDefault} />}
        </div>
        {(showHelper || error) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 12px', marginTop: 2 }}>
            {error ? <WarningIcon color={C.helperIncorrect} size={16} /> : <InfoIcon color={C.helperDefault} />}
            <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', color: error ? C.helperIncorrect : C.helperDefault }}>
              {error ? 'This field contains an error.' : 'Helper text'}
            </span>
          </div>
        )}
      </div>
    )
  }

  // ── Fixed-label mode (label always small at top) ───────────────────────────
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: `${py}px 16px`,
          background: bg,
          border: focused ? `3px solid ${focusStroke}` : '3px solid transparent',
          borderRadius: C.radius, transition: 'all .15s', cursor: 'text',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {showLead && <WarningIcon color={error ? C.strokeIncorrect : C.iconDefault} size={20} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: labelColor, lineHeight: '16px', marginBottom: 2, transition: 'color .15s', pointerEvents: 'none' }}>{label}</div>
          <input
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent',
              fontSize: 16, fontFamily: 'Poppins, sans-serif',
              color: C.filledValue, padding: 0, lineHeight: '24px',
            }}
            placeholder="Type something…"
            value={val}
            onChange={e => setVal(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        </div>
        {showTrail && <EyeIcon color={C.iconDefault} />}
      </div>
      {(showHelper || error) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 12px', marginTop: 2 }}>
          {error ? <WarningIcon color={C.helperIncorrect} size={16} /> : <InfoIcon color={C.helperDefault} />}
          <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', color: error ? C.helperIncorrect : C.helperDefault }}>
            {error ? 'This field contains an error.' : 'Helper text'}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── State label chip ─────────────────────────────────────────────────────────

function StateLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 8 }}>{children}</div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TextFieldPage() {
  const [themeIdx,  setThemeIdx]  = useState(0)
  const [variant,   setVariant]   = useState('outlined')   // 'outlined' | 'neutral' | 'brand'
  const [demoSize,  setDemoSize]  = useState('lg')
  const [demoHelper,    setHelper]        = useState(false)
  const [demoLead,      setLead]          = useState(false)
  const [demoTrail,     setTrail]         = useState(false)
  const [demoError,     setError]         = useState(false)
  const [demoFloating,  setDemoFloating]  = useState(false)   // filled label style

  const theme  = VISIBLE_THEMES[themeIdx]
  const tokens = getComponentTokens(theme.id)
  const C      = getInputColors(tokens)
  const THEME_COLORS = VISIBLE_THEMES.map(t => getComponentTokens(t.id)['tabs.indicator'] || '#07a2b6')

  const isOutlined = variant === 'outlined'
  const colorScheme = variant === 'brand' ? 'brand' : 'neutral'

  // Outlined sizes
  const OUTLINED_SIZES = [
    { key: 'lg', label: 'Large',  py: C.paddingLg, note: 'Default, most form layouts' },
    { key: 'md', label: 'Medium', py: C.paddingMd, note: 'Compact forms, toolbars' },
    { key: 'sm', label: 'Small',  py: C.paddingSm, note: 'Dense UI, data-heavy views' },
  ]
  const FILLED_SIZES = [
    { key: 'lg', label: 'Large',  py: 56, note: 'Default, most form layouts' },
    { key: 'md', label: 'Medium', py: 48, note: 'Compact forms' },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 32px 80px' }}>

      {/* ── Header ── */}
      <SectionAnchor id="top" />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-secondary)', marginBottom: 8 }}>FORMS</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.8px', color: 'var(--text-primary)', margin: 0 }}>Text Field</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif' }}>Theme:</span>
          {VISIBLE_THEMES.map((t, i) => (
            <button key={t.id} onClick={() => setThemeIdx(i)} title={t.label} style={{
              width: 22, height: 22, borderRadius: '50%', background: THEME_COLORS[i],
              cursor: 'pointer', padding: 0, boxSizing: 'border-box',
              border: i === themeIdx ? '2px solid var(--text-primary)' : '2px solid transparent',
              outline: i === themeIdx ? '2px solid var(--bg-primary)' : 'none', outlineOffset: -4,
              transition: 'border-color .15s',
            }} />
          ))}
        </div>
      </div>

      <Lead>
        The Text Field is a single-line input for free-form text entry. It exists in three visual variants — <strong>Outlined</strong>, <strong>Filled Neutral</strong>, and <strong>Filled Brand</strong>. Each supports a floating label (outlined) or fixed label (filled), helper text, validation states, and optional leading/trailing icons.
      </Lead>

      {/* ── Variant selector ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 16px', background: C.brand + '10',
        borderRadius: 10, marginBottom: 32, border: `1px solid ${C.brand}30`,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.brand, marginRight: 4 }}>⚠ Variant rule:</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>Pick one variant and use it everywhere in your product — for Text Field, Text Area, Select, and all other inputs. Do not mix variants.</span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {[['outlined', 'Outlined'], ['neutral', 'Filled Neutral'], ['brand', 'Filled Brand']].map(([val, lbl]) => (
          <button key={val} onClick={() => setVariant(val)} style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
            background: variant === val ? C.brand : 'transparent',
            color: variant === val ? '#fff' : 'var(--text-secondary)',
            border: `1px solid ${variant === val ? C.brand : 'var(--stroke-primary)'}`,
            transition: 'all .15s',
          }}>{lbl}</button>
        ))}
      </div>

      <Rule />

      {/* ── Live demo ── */}
      <SectionAnchor id="demo" />
      <H2>Interactive demo</H2>
      <P>Click the field below to focus it and trigger the floating label. Type to enter a value.</P>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        {isOutlined && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>Size</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['lg', 'md', 'sm'].map(s => (
                <button key={s} onClick={() => setDemoSize(s)} style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
                  background: demoSize === s ? C.brand : 'transparent',
                  color: demoSize === s ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${demoSize === s ? C.brand : 'var(--stroke-primary)'}`,
                }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {!isOutlined && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>Size</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['lg', 'md'].map(s => (
                <button key={s} onClick={() => setDemoSize(s)} style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
                  background: demoSize === s ? C.brand : 'transparent',
                  color: demoSize === s ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${demoSize === s ? C.brand : 'var(--stroke-primary)'}`,
                }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {!isOutlined && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>Label style</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['fixed', 'Fixed'], ['floating', 'Floating']].map(([v, lbl]) => (
                <button key={v} onClick={() => setDemoFloating(v === 'floating')} style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
                  background: (v === 'floating') === demoFloating ? C.brand : 'transparent',
                  color: (v === 'floating') === demoFloating ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${(v === 'floating') === demoFloating ? C.brand : 'var(--stroke-primary)'}`,
                }}>{lbl}</button>
              ))}
            </div>
          </div>
        )}
        {[
          [demoHelper, setHelper, 'Helper text'],
          [demoLead,   setLead,   'Leading icon'],
          [demoTrail,  setTrail,  'Trailing icon'],
          [demoError,  setError,  'Error state'],
        ].map(([val, set, lbl]) => (
          <div key={lbl}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>{lbl}</div>
            <button onClick={() => set(!val)} style={{
              padding: '4px 14px', borderRadius: 6, fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
              background: val ? C.brand : 'transparent',
              color: val ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${val ? C.brand : 'var(--stroke-primary)'}`,
            }}>{val ? 'On' : 'Off'}</button>
          </div>
        ))}
      </div>

      {/* Live field */}
      <div style={{ background: 'var(--bg-primary)',border: `1px solid ${'var(--stroke-primary)'}`, borderRadius: 12, padding: '32px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 320 }}>
          {isOutlined ? (
            <LiveOutlined C={C} size={demoSize} showHelper={demoHelper} showLead={demoLead} showTrail={demoTrail} error={demoError} />
          ) : (
            <LiveFilled C={C} size={demoSize} colorScheme={colorScheme} showHelper={demoHelper} showLead={demoLead} showTrail={demoTrail} error={demoError} floatingLabel={demoFloating} />
          )}
        </div>
      </div>

      <Rule />

      {/* ── States ── */}
      <SectionAnchor id="states" />
      <H2>States</H2>
      <P>All variants share the same set of states. The visual treatment differs: outlined changes the border, filled changes the background.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
        {isOutlined ? (
          <>
            <div><StateLabel>Default — empty</StateLabel><OField C={C} state="default" content="empty" /></div>
            <div><StateLabel>Default — with value</StateLabel><OField C={C} state="default" content="value" /></div>
            <div><StateLabel>Placeholder</StateLabel><OField C={C} state="default" content="placeholder" /></div>
            <div><StateLabel>Hover</StateLabel><OField C={C} state="hover" content="placeholder" /></div>
            <div><StateLabel>Focused</StateLabel><OField C={C} state="focused" content="value" /></div>
            <div><StateLabel>Disabled</StateLabel><OField C={C} state="disabled" content="value" /></div>
            <div><StateLabel>Error</StateLabel><OField C={C} state="error" content="value" helper /></div>
            <div><StateLabel>Error — empty</StateLabel><OField C={C} state="error" content="empty" helper /></div>
          </>
        ) : (
          <>
            <div><StateLabel>Default — empty</StateLabel><FField C={C} state="default" content="empty" colorScheme={colorScheme} /></div>
            <div><StateLabel>Default — with value</StateLabel><FField C={C} state="default" content="value" colorScheme={colorScheme} /></div>
            <div><StateLabel>Placeholder</StateLabel><FField C={C} state="default" content="placeholder" colorScheme={colorScheme} /></div>
            <div><StateLabel>Hover</StateLabel><FField C={C} state="hover" content="value" colorScheme={colorScheme} /></div>
            <div><StateLabel>Focused</StateLabel><FField C={C} state="focused" content="value" colorScheme={colorScheme} /></div>
            <div><StateLabel>Disabled</StateLabel><FField C={C} state="disabled" content="value" colorScheme={colorScheme} /></div>
            <div><StateLabel>Error</StateLabel><FField C={C} state="error" content="value" colorScheme={colorScheme} helper /></div>
            <div><StateLabel>Error — empty</StateLabel><FField C={C} state="error" content="empty" colorScheme={colorScheme} helper /></div>
          </>
        )}
      </div>

      <Rule />

      {/* ── Sizes ── */}
      <SectionAnchor id="sizes" />
      <H2>Sizes</H2>
      <P>{isOutlined ? 'Outlined has three sizes — Large (default), Medium, and Small — differentiated by vertical padding.' : 'Filled has two sizes — Large (default) and Medium. Filled does not support the Small variant.'}</P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(isOutlined ? OUTLINED_SIZES : FILLED_SIZES).map(({ key, label, py, note }) => (
          <div key={key} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 220px', gap: 16, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{isOutlined ? `padding-y: ${py}px` : `height: ${py}px`}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{note}</div>
            </div>
            <div>
              {isOutlined
                ? <OField C={C} state="default" content="placeholder" size={key} />
                : <FField C={C} state="default" content="placeholder" size={key} colorScheme={colorScheme} />
              }
            </div>
            <div>
              {isOutlined
                ? <OField C={C} state="focused" content="value" size={key} />
                : <FField C={C} state="focused" content="value" size={key} colorScheme={colorScheme} />
              }
            </div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Label behavior ── */}
      <SectionAnchor id="label" />
      <H2>Label behavior</H2>

      {isOutlined ? (
        <>
          <H3>Floating label — Outlined</H3>
          <P>When the field is empty and unfocused, the label sits inside the input as a placeholder. On focus or when a value is entered, it floats up and straddles the top border with a white background masking the stroke beneath it.</P>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div><StateLabel>1. Empty</StateLabel><OField C={C} state="default" content="empty" /></div>
            <div><StateLabel>2. Focused (label floats)</StateLabel><OField C={C} state="focused" content="empty" /></div>
            <div><StateLabel>3. Has value</StateLabel><OField C={C} state="default" content="value" /></div>
          </div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Label inside (empty)', '16px, regular weight, label color'],
              ['Label floated', '14px, medium weight, white bg, sits on top border'],
              ['Label on hover', 'Floated label color darkens to secondary'],
              ['Label on error', 'Floated label turns error orange'],
            ].map(([state, detail]) => (
              <div key={state} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.brand, flexShrink: 0, marginTop: 5 }} />
                <div><strong style={{ color: 'var(--text-primary)' }}>{state}:</strong> {detail}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <H3>Option A — Fixed label</H3>
          <P>The label sits permanently at the top of the field at 12px. The field height is always identical — only the label color shifts on focus. Use this when the label must always be visible without animation.</P>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            <div><StateLabel>1. Empty</StateLabel><FField C={C} state="default" content="empty" colorScheme={colorScheme} /></div>
            <div><StateLabel>2. Focused</StateLabel><FField C={C} state="focused" content="empty" colorScheme={colorScheme} /></div>
            <div><StateLabel>3. Has value</StateLabel><FField C={C} state="default" content="value" colorScheme={colorScheme} /></div>
          </div>

          <H3>Option B — Floating label</H3>
          <P>When the field is empty and unfocused, the label sits centered inside at 16px — acting as a placeholder. On focus or when a value is entered, it slides up to 12px at the top. Height never changes.</P>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div><StateLabel>1. Empty (label as hint)</StateLabel><FField C={C} state="default" content="empty" colorScheme={colorScheme} floatingLabel /></div>
            <div><StateLabel>2. Focused (label slides up)</StateLabel><FField C={C} state="focused" content="empty" colorScheme={colorScheme} floatingLabel /></div>
            <div><StateLabel>3. Has value</StateLabel><FField C={C} state="default" content="value" colorScheme={colorScheme} floatingLabel /></div>
          </div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Option A — Fixed', 'Label always visible at top. No animation. Cleaner in dense UIs.'],
              ['Option B — Floating', 'Label acts as placeholder when empty, slides to top on focus.'],
              ['Both options', 'Same field height in all states — no layout shift ever.'],
              ['Pick one', 'Apply the same label style to every filled input in your product.'],
            ].map(([title, detail]) => (
              <div key={title} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.brand, flexShrink: 0, marginTop: 5 }} />
                <div><strong style={{ color: 'var(--text-primary)' }}>{title}:</strong> {detail}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <Rule />

      {/* ── Variants side by side ── */}
      <SectionAnchor id="variants" />
      <H2>All three variants</H2>
      <P>Here all three variants are shown at the same state for direct comparison. Pick the one that fits your product context and use it exclusively.</P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
        {[
          { v: 'outlined', label: 'Outlined', field: <OField C={C} state="focused" content="value" /> },
          { v: 'neutral',  label: 'Filled Neutral', field: <FField C={C} state="focused" content="value" colorScheme="neutral" /> },
          { v: 'brand',    label: 'Filled Brand',   field: <FField C={C} state="focused" content="value" colorScheme="brand" /> },
        ].map(({ v, label, field }) => (
          <div key={v} style={{
            background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden',
            border: variant === v ? `2px solid ${C.brand}` : '1px solid var(--stroke-primary)',
          }}>
            <div style={{ padding: '20px 20px 4px' }}>{field}</div>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
              {variant === v && <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: C.brand }}>Active</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Outlined',     desc: 'Material-style floating label. Clean, formal, works on any background. Higher cognitive contrast between field and page.' },
          { label: 'Filled Neutral', desc: 'Subtle grey tint. Approachable, low-emphasis. Good for high-density forms where borders would feel heavy.' },
          { label: 'Filled Brand',   desc: 'Light brand tint. Gives the form a product-specific personality. Focus ring uses brand color.' },
        ].map(({ label, desc }) => (
          <div key={label} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>{label}</strong>
            {desc}
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Icons ── */}
      <SectionAnchor id="icons" />
      <H2>Icons</H2>
      <P>Text fields support a leading icon (left, inside the container) and a trailing icon (right). Leading icons help identify the field type at a glance. Trailing icons trigger actions like clear, show/hide password, or copy.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <StateLabel>Leading icon only</StateLabel>
          {isOutlined
            ? <OField C={C} state="default" content="value" leadIcon />
            : <FField C={C} state="default" content="value" colorScheme={colorScheme} leadIcon />
          }
        </div>
        <div>
          <StateLabel>Trailing icon only</StateLabel>
          {isOutlined
            ? <OField C={C} state="default" content="value" trailIcon />
            : <FField C={C} state="default" content="value" colorScheme={colorScheme} trailIcon />
          }
        </div>
        <div>
          <StateLabel>Both icons</StateLabel>
          {isOutlined
            ? <OField C={C} state="focused" content="value" leadIcon trailIcon />
            : <FField C={C} state="focused" content="value" colorScheme={colorScheme} leadIcon trailIcon />
          }
        </div>
        <div>
          <StateLabel>Icons — error state</StateLabel>
          {isOutlined
            ? <OField C={C} state="error" content="value" leadIcon trailIcon helper />
            : <FField C={C} state="error" content="value" colorScheme={colorScheme} leadIcon trailIcon helper />
          }
        </div>
      </div>

      <Rule />

      {/* ── Helper text & validation ── */}
      <SectionAnchor id="helper" />
      <H2>Helper text & validation</H2>
      <P>Helper text appears below the field. In the default state it provides context or format hints. In the error state it is replaced by the error message, accompanied by a warning icon. Trigger validation on blur, not on change — do not show errors while the user is still typing.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <StateLabel>Default helper</StateLabel>
          {isOutlined
            ? <OField C={C} state="default" content="value" helper />
            : <FField C={C} state="default" content="value" colorScheme={colorScheme} helper />
          }
        </div>
        <div>
          <StateLabel>Error + helper</StateLabel>
          {isOutlined
            ? <OField C={C} state="error" content="value" helper />
            : <FField C={C} state="error" content="value" colorScheme={colorScheme} helper />
          }
        </div>
      </div>

      <div style={{ marginTop: 20, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Slot', 'When shown', 'Trigger'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Helper text', 'Always visible below field when provided', 'Static, from props'],
              ['Error message', 'Replaces helper text when field is invalid', 'On blur (not on change)'],
              ['Warning icon', 'Accompanies any error message', 'Same as error message'],
            ].map(([slot, when, trigger]) => (
              <tr key={slot} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
                <td style={{ padding: '9px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{slot}</td>
                <td style={{ padding: '9px 14px', color: 'var(--text-secondary)' }}>{when}</td>
                <td style={{ padding: '9px 14px', color: 'var(--text-secondary)' }}>{trigger}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Rule />

      {/* ── Do/Don't ── */}
      <SectionAnchor id="guidance" />
      <H2>Guidance</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DoBox visual={<div style={{ width: 280 }}><OField C={C} state="default" content="value" /></div>}>
          Always provide a visible label. The label is required — never use placeholder text as the only label, as it disappears when the user types.
        </DoBox>
        <DontBox visual={
          <div style={{ position: 'relative', paddingTop: 12, width: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: `${C.paddingLg}px ${C.paddingX}px`, border: `1px solid ${C.strokeDefault}`, borderRadius: C.radius }}>
              <span style={{ fontSize: 16, fontFamily: 'Poppins, sans-serif', color: C.placeholder }}>Email address</span>
            </div>
          </div>
        }>
          Don't use placeholder text as a substitute for a label. Placeholder text vanishes on input, leaving users without context.
        </DontBox>
        <DoBox visual={<div style={{ width: 280 }}><OField C={C} state="error" content="value" helper /></div>}>
          Show error messages with both colour change and a warning icon. Colour alone is not sufficient for accessibility.
        </DoBox>
        <DontBox visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
            <OField C={C} state="default" content="value" />
            <FField C={C} state="default" content="value" colorScheme="neutral" />
          </div>
        }>
          Don't mix field variants in the same product. Pick Outlined, Filled Neutral, or Filled Brand — then apply it to every input consistently.
        </DontBox>
      </div>

      <Rule />

      {/* ── Accessibility ── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[
          ['Label required',    'Every field must have a visible label associated via htmlFor/id. Never skip the label prop — placeholder text is not an accessible alternative.'],
          ['Error icon',        'Error states must include a visible icon (not colour alone). Screen readers announce the icon alongside the error text.'],
          ['Validation timing', 'Trigger validation on blur, not on keystroke. Showing errors while the user types creates unnecessary noise for screen reader users.'],
          ['Disabled vs readonly', 'Disabled fields are excluded from tab order. Read-only fields remain focusable and are announced to screen readers. Prefer read-only when the value should be communicated.'],
          ['Colour contrast',   'Placeholder text (#c4cdd5 on white) is intentionally below WCAG 4.5:1. This is acceptable by spec for placeholder — the label above always meets contrast.'],
          ['Focus ring',        'The 3px focus ring uses the brand shadow colour. Ensure the brand colour provides sufficient contrast against the page background (WCAG 3:1 minimum for focus indicators).'],
          ['Autocomplete',      'Set the HTML autocomplete attribute where appropriate (email, new-password, given-name, etc.) to assist users with memory or motor impairments.'],
        ].map(([term, desc]) => (
          <div key={term} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, fontSize: 13, padding: '10px 0', borderBottom: '1px solid var(--stroke-primary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{term}</span>
            <span style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</span>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Token reference ── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>
      <P>Tokens are prefixed <Code>inputfield.outlined.*</Code> for the outlined variant and <Code>inputfield.filled.*</Code> for both filled variants. The brand filled variant derives its background from the brand color at 10% opacity blended with white.</P>

      <H3>Outlined tokens</H3>
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Token', 'Value', 'Role'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '9px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['inputfield.outlined.container.stroke.default',  C.strokeDefault,   'Default border'],
              ['inputfield.outlined.container.stroke.focused',  C.strokeFocused,   'Focused border (brand)'],
              ['inputfield.outlined.container.stroke.incorrect',C.strokeIncorrect,  'Error border'],
              ['inputfield.outlined.container.stroke.disabled', C.strokeDisabled,   'Disabled border'],
              ['inputfield.outlined.container.focused-shadow',  C.focusShadow,     'Focus ring glow color'],
              ['inputfield.outlined.container.radius',          C.radius + 'px',   'Corner radius'],
              ['inputfield.outlined.label.default',             C.labelDefault,    'Label as placeholder (empty)'],
              ['inputfield.outlined.label.default-filled',      C.labelFilled,     'Floating label (has value)'],
              ['inputfield.outlined.label.focused',             C.labelFocused,    'Floating label (focused)'],
              ['inputfield.outlined.label.incorrect',           C.labelIncorrect,  'Label in error state'],
              ['inputfield.outlined.value.default',             C.valueDefault,    'User-entered value text'],
              ['inputfield.outlined.placeholder-color',         C.placeholder,     'Placeholder text'],
              ['inputfield.outlined.helper.default',            C.helperDefault,   'Helper text'],
              ['inputfield.outlined.helper.incorrect',          C.helperIncorrect, 'Error helper text'],
              ['inputfield.outlined.size.padding-x',            C.paddingX + 'px', 'Horizontal padding'],
              ['inputfield.outlined.size.lg.padding-y',         C.paddingLg + 'px','Large vertical padding'],
              ['inputfield.outlined.size.md.padding-y',         C.paddingMd + 'px','Medium vertical padding'],
              ['inputfield.outlined.size.sm.padding-y',         C.paddingSm + 'px','Small vertical padding'],
            ].map(([key, val, role]) => (
              <tr key={key} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
                <td style={{ padding: '8px 14px' }}><Code>{key}</Code></td>
                <td style={{ padding: '8px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {typeof val === 'string' && val.startsWith('#') && (
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: val, border: '1px solid rgba(0,0,0,.1)', flexShrink: 0 }} />
                    )}
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)' }}>{val ?? '—'}</span>
                  </div>
                </td>
                <td style={{ padding: '8px 14px', color: 'var(--text-secondary)', fontSize: 12 }}>{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3>Filled tokens</H3>
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Token', 'Value', 'Role'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '9px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['inputfield.filled.container.bg.default',   C.filledBg,        'Neutral bg (default)'],
              ['inputfield.filled.container.bg.hover',     C.filledBgHover,   'Neutral bg (hover)'],
              ['inputfield.filled.container.bg.incorrect', C.filledBgIncorrect,'Error bg (both variants)'],
              ['inputfield.filled.container.stroke.focused',C.filledStroke,   'Neutral focus border'],
              ['— (derived)',                              C.brandBg,         'Brand bg = brand 10% on white'],
              ['— (derived)',                              C.brandStroke,     'Brand focus border = brand 50%'],
              ['inputfield.filled.label.default',          C.filledLabelDefault,  'Empty field label'],
              ['inputfield.filled.label.default-filled',   C.filledLabelFilled,   'Fixed label (default)'],
              ['inputfield.filled.label.focused',          C.filledLabelFocused,  'Fixed label (focused)'],
              ['inputfield.filled.label.incorrect',        C.filledLabelIncorrect,'Label in error state'],
            ].map(([key, val, role]) => (
              <tr key={key + role} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
                <td style={{ padding: '8px 14px' }}><Code>{key}</Code></td>
                <td style={{ padding: '8px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {typeof val === 'string' && val.startsWith('#') && (
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: val, border: '1px solid rgba(0,0,0,.1)', flexShrink: 0 }} />
                    )}
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)' }}>{val ?? '—'}</span>
                  </div>
                </td>
                <td style={{ padding: '8px 14px', color: 'var(--text-secondary)', fontSize: 12 }}>{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
