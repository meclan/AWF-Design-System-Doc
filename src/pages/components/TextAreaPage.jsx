import React, { useState, useRef, useEffect } from 'react'
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

// ─── Token extractor (same namespace as TextField) ────────────────────────────

function getColors(t) {
  const brand = t['tabs.indicator'] || '#07a2b6'
  const n = k => (typeof t[k] === 'number' ? t[k] : null)
  return {
    brand,
    bgWhite:         t['inputfield.outlined.container.bg.white']       || '#ffffff',
    bgLabel:         t['inputfield.outlined.container.bg.label']       || '#ffffff',
    strokeDefault:   t['inputfield.outlined.container.stroke.default'] || '#c4cdd5',
    strokeHover:     t['inputfield.outlined.container.stroke.hover']   || '#637381',
    strokeFocused:   t['inputfield.outlined.container.stroke.focused'] || brand,
    strokeDisabled:  t['inputfield.outlined.container.stroke.disabled']|| '#dfe3e8',
    strokeIncorrect: t['inputfield.outlined.container.stroke.incorrect']|| '#f6643f',
    radius:          n('inputfield.outlined.container.radius')          ?? 8,
    focusShadow:     t['inputfield.outlined.container.focused-shadow'] || '#9fefff',
    hoverShadow:     t['inputfield.outlined.container.hover-shadow']   || '#dfe3e8',
    labelDefault:    t['inputfield.outlined.label.default']            || '#919eab',
    labelFilled:     t['inputfield.outlined.label.default-filled']     || '#637381',
    labelFocused:    t['inputfield.outlined.label.focused']            || '#454f5b',
    labelDisabled:   t['inputfield.outlined.label.disabled']           || '#c4cdd5',
    labelIncorrect:  t['inputfield.outlined.label.incorrect']          || '#f6643f',
    paddingX:        n('inputfield.outlined.size.padding-x')           ?? 16,
    valueDefault:    t['inputfield.outlined.value.default']            || '#141a21',
    valueDisabled:   t['inputfield.outlined.value.disabled']           || '#c4cdd5',
    placeholder:     t['inputfield.outlined.placeholder-color']        || '#c4cdd5',
    helperDefault:   t['inputfield.outlined.helper.default']           || '#637381',
    helperIncorrect: t['inputfield.outlined.helper.incorrect']         || '#f6643f',
    // Filled
    filledBg:           t['inputfield.filled.container.bg.default']    || '#f4f6f8',
    filledBgHover:      t['inputfield.filled.container.bg.hover']      || '#dfe3e8',
    filledBgIncorrect:  t['inputfield.filled.container.bg.incorrect']  || '#fee8e2',
    filledBgDisabled:   t['inputfield.filled.container.bg.disabled']   || '#f4f6f8',
    filledStroke:       t['inputfield.filled.container.stroke.focused']|| '#919eab',
    filledLabelDefault: t['inputfield.filled.label.default']           || '#919eab',
    filledLabelFilled:  t['inputfield.filled.label.default-filled']    || '#637381',
    filledLabelFocused: t['inputfield.filled.label.focused']           || '#454f5b',
    filledLabelDisabled:t['inputfield.filled.label.disabled']          || '#c4cdd5',
    filledLabelIncorrect:t['inputfield.filled.label.incorrect']        || '#f6643f',
    filledValue:        '#454f5b',
    filledPlaceholder:  '#c4cdd5',
    brandBg:            blendWithWhite(brand, 0.10),
    brandBgHover:       blendWithWhite(brand, 0.16),
    brandStroke:        t['inputfield.filled-brand.stroke.focused']    || '#9fefff',
  }
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

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
const ResizeHandle = ({ color = '#919eab' }) => (
  <svg width={10} height={10} viewBox="0 0 10 10" style={{ position: 'absolute', right: 5, bottom: 5, pointerEvents: 'none', opacity: 0.6 }}>
    <line x1="10" y1="3" x2="3" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="6" x2="6" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="9" x2="9" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// ─── Page primitives ──────────────────────────────────────────────────────────

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
function StateLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 8 }}>{children}</div>
}

// ─── Static textarea field ────────────────────────────────────────────────────
// variant: 'outlined' | 'neutral' | 'brand'
// content: 'empty' | 'placeholder' | 'value'
// state:   'default' | 'hover' | 'focused' | 'disabled' | 'error'

const SAMPLE_VALUE   = 'Design is how it works, not just how it looks. Great products feel effortless because every detail has been considered.'
const SAMPLE_SHORT   = 'Leave a comment or describe the issue in detail.'

function TAField({ C, variant = 'outlined', content = 'empty', state = 'default', rows = 4, label = 'Label', helper = false, counter = false, maxLength = 200, showResize = true }) {
  const isOutlined = variant === 'outlined'
  const isError    = state === 'error'
  const isFocused  = state === 'focused'
  const isDisabled = state === 'disabled'
  const isHover    = state === 'hover'
  const hasContent = content !== 'empty'
  const labelUp    = isOutlined ? (hasContent || isFocused) : true   // filled: always at top

  const py = 16
  const px = C.paddingX

  // ── Colors ──────────────────────────────────────────────────────────────────
  let bg, borderColor, borderWidth, shadow, labelColor, textColor, labelBg

  if (isOutlined) {
    bg          = (isHover || isFocused) ? C.bgWhite : 'transparent'
    borderColor = isError ? C.strokeIncorrect : isFocused ? C.strokeFocused : isHover ? C.strokeHover : isDisabled ? C.strokeDisabled : C.strokeDefault
    borderWidth = (isError || isFocused) ? 2 : 1
    shadow      = isFocused ? `0 0 0 3px ${C.focusShadow}` : isHover ? `0 0 0 4px ${C.hoverShadow}` : 'none'
    labelColor  = isError ? C.labelIncorrect : isFocused ? C.labelFocused : (isHover || labelUp) ? C.labelFilled : isDisabled ? C.labelDisabled : C.labelDefault
    textColor   = content === 'value' ? (isDisabled ? C.valueDisabled : C.valueDefault) : C.placeholder
    labelBg     = labelUp ? C.bgLabel : 'transparent'
  } else {
    const isBrand = variant === 'brand'
    bg          = isError ? C.filledBgIncorrect : isHover ? (isBrand ? C.brandBgHover : C.filledBgHover) : isDisabled ? C.filledBgDisabled : isBrand ? C.brandBg : C.filledBg
    borderColor = isFocused ? (isBrand ? C.brandStroke : C.filledStroke) : 'transparent'
    borderWidth = 3
    shadow      = 'none'
    labelColor  = isError ? C.filledLabelIncorrect : isFocused ? C.filledLabelFocused : isDisabled ? C.filledLabelDisabled : C.filledLabelFilled
    textColor   = content === 'value' ? C.filledValue : C.filledPlaceholder
    labelBg     = 'transparent'
  }

  const displayText = content === 'value' ? SAMPLE_VALUE : content === 'placeholder' ? SAMPLE_SHORT : ''
  const charCount   = displayText.length

  // ── Floating-label top position (outlined only) ───────────────────────────
  const labelTop  = isOutlined ? (labelUp ? 12 : 12 + py + 12) : 10
  const labelLeft = isOutlined ? (labelUp ? 13 : px) : px
  const labelSize = isOutlined ? (labelUp ? 14 : 16) : 12
  const labelWeight = (labelUp || !isOutlined) ? 500 : 400

  const minH = rows * 24 + py * 2 + (isOutlined ? 0 : 20) // extra top padding for filled label

  return (
    <div style={{ width: '100%', opacity: isDisabled ? 0.55 : 1 }}>
      <div style={{ position: 'relative', paddingTop: isOutlined ? 12 : 0 }}>

        {/* Textarea box */}
        <div style={{ position: 'relative' }}>
          {/* Filled: fixed small label always at top */}
          {!isOutlined && (
            <div style={{
              position: 'absolute', top: py, left: px, right: px,
              fontSize: 12, fontWeight: 500, fontFamily: 'Poppins, sans-serif',
              color: labelColor, lineHeight: '16px', pointerEvents: 'none', zIndex: 1,
            }}>{label}</div>
          )}

          <div style={{
            fontSize: 16, fontFamily: 'Poppins, sans-serif', color: textColor,
            lineHeight: '24px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            minHeight: minH,
            padding: !isOutlined
              ? `${py + 20}px ${px}px ${py}px`   // extra top for label
              : `${py}px ${px}px`,
            background: bg,
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: C.radius,
            boxShadow: shadow,
            transition: 'all .15s',
            resize: 'none',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {displayText || (isFocused ? <span style={{ borderLeft: `2px solid ${textColor}` }}>&nbsp;</span> : null)}
          </div>

          {/* Resize handle visual */}
          {showResize && !isDisabled && <ResizeHandle color={isError ? C.strokeIncorrect : labelColor} />}
        </div>

        {/* Floating label (outlined only) */}
        {isOutlined && (
          <span style={{
            position: 'absolute', left: labelLeft, top: labelTop,
            transform: 'translateY(-50%)',
            background: labelBg, padding: labelUp ? '0 4px' : '0',
            fontSize: labelSize, fontWeight: labelWeight,
            fontFamily: 'Poppins, sans-serif', color: labelColor,
            whiteSpace: 'nowrap', lineHeight: '24px',
            transition: 'all .15s', pointerEvents: 'none',
          }}>{label}</span>
        )}
      </div>

      {/* Helper row */}
      {(helper || counter) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px', marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {helper && (isError ? <WarningIcon color={C.helperIncorrect} /> : <InfoIcon color={C.helperDefault} />)}
            {helper && <span style={{ fontSize: 12, color: isError ? C.helperIncorrect : C.helperDefault, fontFamily: 'Poppins, sans-serif' }}>Helper text</span>}
          </div>
          {counter && <span style={{ fontSize: 12, color: C.labelDefault, fontFamily: 'Poppins, sans-serif' }}>{charCount}/{maxLength}</span>}
        </div>
      )}
    </div>
  )
}

// ─── Live interactive textarea ────────────────────────────────────────────────

function LiveTA({ C, variant = 'outlined', rows = 4, label = 'Label', showHelper = false, showCounter = false, maxLength = 200, resize = 'vertical', error = false, autoGrow = false }) {
  const [val, setVal]       = useState('')
  const [focused, setFocus] = useState(false)
  const [hovered, setHover] = useState(false)
  const taRef               = useRef(null)

  useEffect(() => {
    if (autoGrow && taRef.current) {
      taRef.current.style.height = 'auto'
      taRef.current.style.height = taRef.current.scrollHeight + 'px'
    }
  }, [val, autoGrow])

  const isOutlined = variant === 'outlined'
  const isBrand    = variant === 'brand'
  const labelUp    = isOutlined ? (focused || !!val) : true
  const py         = 16
  const px         = C.paddingX

  let bg, borderColor, borderWidth, shadow, labelColor, textColor, labelBg

  if (isOutlined) {
    bg          = (hovered || focused) ? C.bgWhite : 'transparent'
    borderColor = error ? C.strokeIncorrect : focused ? C.strokeFocused : hovered ? C.strokeHover : C.strokeDefault
    borderWidth = (error || focused) ? 2 : 1
    shadow      = focused ? `0 0 0 3px ${C.focusShadow}` : hovered ? `0 0 0 4px ${C.hoverShadow}` : 'none'
    labelColor  = error ? C.labelIncorrect : focused ? C.labelFocused : (hovered || labelUp) ? C.labelFilled : C.labelDefault
    textColor   = C.valueDefault
    labelBg     = labelUp ? C.bgLabel : 'transparent'
  } else {
    bg          = error ? C.filledBgIncorrect : hovered ? (isBrand ? C.brandBgHover : C.filledBgHover) : isBrand ? C.brandBg : C.filledBg
    borderColor = focused ? (isBrand ? C.brandStroke : C.filledStroke) : 'transparent'
    borderWidth = 3
    shadow      = 'none'
    labelColor  = error ? C.filledLabelIncorrect : focused ? C.filledLabelFocused : C.filledLabelFilled
    textColor   = C.filledValue
    labelBg     = 'transparent'
  }

  const labelTop  = labelUp ? 12 : 12 + py + 12
  const labelLeft = labelUp ? 13 : px
  const minH      = rows * 24 + py * 2 + (isOutlined ? 0 : 20)
  const charCount = val.length
  const overLimit = charCount > maxLength

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', paddingTop: isOutlined ? 12 : 0 }}>
        <div style={{ position: 'relative' }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* Filled: fixed label */}
          {!isOutlined && (
            <div style={{
              position: 'absolute', top: py, left: px, right: px,
              fontSize: 12, fontWeight: 500, fontFamily: 'Poppins, sans-serif',
              color: labelColor, lineHeight: '16px', pointerEvents: 'none', zIndex: 1,
              transition: 'color .15s',
            }}>{label}</div>
          )}

          <textarea
            ref={taRef}
            style={{
              display: 'block', width: '100%', boxSizing: 'border-box',
              minHeight: minH,
              padding: !isOutlined ? `${py + 20}px ${px}px ${py}px` : `${py}px ${px}px`,
              background: bg,
              border: `${borderWidth}px solid ${borderColor}`,
              borderRadius: C.radius,
              boxShadow: shadow,
              transition: 'background .15s, border-color .15s, box-shadow .15s',
              resize: autoGrow ? 'none' : resize,
              outline: 'none',
              fontSize: 16, fontFamily: 'Poppins, sans-serif',
              color: textColor, lineHeight: '24px',
              '::placeholder': { color: C.placeholder },
            }}
            placeholder={isOutlined ? (labelUp ? 'Type your message…' : '') : 'Type your message…'}
            value={val}
            onChange={e => setVal(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
          {!autoGrow && <ResizeHandle color={labelColor} />}
        </div>

        {/* Floating label (outlined) */}
        {isOutlined && (
          <span style={{
            position: 'absolute', left: labelLeft, top: labelTop,
            transform: 'translateY(-50%)',
            background: labelBg, padding: labelUp ? '0 4px' : '0',
            fontSize: labelUp ? 14 : 16, fontWeight: labelUp ? 500 : 400,
            fontFamily: 'Poppins, sans-serif', color: labelColor,
            whiteSpace: 'nowrap', lineHeight: '24px',
            transition: 'all .15s', pointerEvents: 'none',
          }}>{label}</span>
        )}
      </div>

      {/* Helper & counter row */}
      {(showHelper || showCounter || error) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px', marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {(showHelper || error) && (error ? <WarningIcon color={C.helperIncorrect} /> : <InfoIcon color={C.helperDefault} />)}
            {(showHelper || error) && (
              <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', color: error ? C.helperIncorrect : C.helperDefault }}>
                {error ? 'This field contains an error.' : 'Helper text'}
              </span>
            )}
          </div>
          {showCounter && (
            <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', color: overLimit ? C.helperIncorrect : C.helperDefault }}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TextAreaPage() {
  const [themeIdx,    setThemeIdx]    = useState(0)
  const [variant,     setVariant]     = useState('outlined')
  const [demoResize,  setDemoResize]  = useState('vertical')
  const [demoHelper,  setHelper]      = useState(false)
  const [demoCounter, setCounter]     = useState(false)
  const [demoError,   setError]       = useState(false)
  const [demoAutoGrow,setAutoGrow]    = useState(false)
  const [demoRows,    setDemoRows]    = useState(4)

  const theme  = VISIBLE_THEMES[themeIdx]
  const tokens = getComponentTokens(theme.id)
  const C      = getColors(tokens)
  const THEME_COLORS = VISIBLE_THEMES.map(t => getComponentTokens(t.id)['tabs.indicator'] || '#07a2b6')

  const isOutlined   = variant === 'outlined'
  const colorScheme  = variant === 'brand' ? 'brand' : 'neutral'

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 32px 80px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: C.brand }}>Forms</span>
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', marginBottom: 8 }}>Text Area</h1>

      {/* Theme switcher */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {VISIBLE_THEMES.map((t, i) => (
          <button key={t.id} onClick={() => setThemeIdx(i)} style={{
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
            background: themeIdx === i ? THEME_COLORS[i] : 'transparent',
            color: themeIdx === i ? '#fff' : 'var(--text-secondary)',
            border: `1px solid ${themeIdx === i ? THEME_COLORS[i] : 'var(--stroke-primary)'}`,
          }}>{t.name}</button>
        ))}
      </div>

      <Lead>
        The Text Area is a multi-line input for free-form text — descriptions, comments, notes, or any content requiring more than a single line. It inherits all visual tokens from the Text Field and supports the same three variants: <strong>Outlined</strong>, <strong>Filled Neutral</strong>, and <strong>Filled Brand</strong>.
      </Lead>

      {/* ── Variant rule banner ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 16px', background: C.brand + '10',
        borderRadius: 10, marginBottom: 32, border: `1px solid ${C.brand}30`,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.brand, marginRight: 4 }}>⚠ Variant rule:</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>Use the same variant as your Text Field. If the rest of your forms use Outlined, Text Area must be Outlined too. Never mix variants within one product.</span>
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

      {/* ── Interactive demo ── */}
      <SectionAnchor id="demo" />
      <H2>Interactive demo</H2>
      <P>Click the field to focus and type. The label floats up (Outlined) or stays fixed at the top (Filled). Drag the bottom-right corner to resize.</P>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>Rows</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[2, 3, 4, 6].map(r => (
              <button key={r} onClick={() => setDemoRows(r)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
                background: demoRows === r ? C.brand : 'transparent',
                color: demoRows === r ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${demoRows === r ? C.brand : 'var(--stroke-primary)'}`,
              }}>{r}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>Resize</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['none', 'None'], ['vertical', 'Vertical'], ['both', 'Both']].map(([v, lbl]) => (
              <button key={v} onClick={() => { setDemoResize(v); setAutoGrow(false) }} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
                background: !demoAutoGrow && demoResize === v ? C.brand : 'transparent',
                color: !demoAutoGrow && demoResize === v ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${!demoAutoGrow && demoResize === v ? C.brand : 'var(--stroke-primary)'}`,
              }}>{lbl}</button>
            ))}
          </div>
        </div>
        {[
          [demoAutoGrow, () => setAutoGrow(v => !v), 'Auto-grow'],
          [demoHelper,   () => setHelper(v => !v),   'Helper text'],
          [demoCounter,  () => setCounter(v => !v),  'Counter'],
          [demoError,    () => setError(v => !v),    'Error state'],
        ].map(([val, toggle, lbl]) => (
          <div key={lbl}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-secondary)', marginBottom: 6 }}>{lbl}</div>
            <button onClick={toggle} style={{
              padding: '4px 14px', borderRadius: 6, fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
              background: val ? C.brand : 'transparent',
              color: val ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${val ? C.brand : 'var(--stroke-primary)'}`,
            }}>{val ? 'On' : 'Off'}</button>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--stroke-primary)', borderRadius: 12, padding: '32px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 380 }}>
          <LiveTA
            C={C} variant={variant} rows={demoRows}
            resize={demoResize} autoGrow={demoAutoGrow}
            showHelper={demoHelper} showCounter={demoCounter}
            error={demoError} maxLength={200}
          />
        </div>
      </div>

      <Rule />

      {/* ── States ── */}
      <SectionAnchor id="states" />
      <H2>States</H2>
      <P>The Text Area shares the same state set as the Text Field. Outlined changes the border; Filled changes the background.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
        {isOutlined ? (
          <>
            <div><StateLabel>Default — empty</StateLabel><TAField C={C} variant="outlined" content="empty" rows={3} /></div>
            <div><StateLabel>Default — with value</StateLabel><TAField C={C} variant="outlined" content="value" rows={3} /></div>
            <div><StateLabel>Placeholder</StateLabel><TAField C={C} variant="outlined" content="placeholder" rows={3} /></div>
            <div><StateLabel>Hover</StateLabel><TAField C={C} variant="outlined" state="hover" content="value" rows={3} /></div>
            <div><StateLabel>Focused</StateLabel><TAField C={C} variant="outlined" state="focused" content="value" rows={3} /></div>
            <div><StateLabel>Disabled</StateLabel><TAField C={C} variant="outlined" state="disabled" content="value" rows={3} /></div>
            <div><StateLabel>Error</StateLabel><TAField C={C} variant="outlined" state="error" content="value" rows={3} helper counter /></div>
            <div><StateLabel>Error — empty</StateLabel><TAField C={C} variant="outlined" state="error" content="empty" rows={3} helper /></div>
          </>
        ) : (
          <>
            <div><StateLabel>Default — empty</StateLabel><TAField C={C} variant={variant} content="empty" rows={3} /></div>
            <div><StateLabel>Default — with value</StateLabel><TAField C={C} variant={variant} content="value" rows={3} /></div>
            <div><StateLabel>Placeholder</StateLabel><TAField C={C} variant={variant} content="placeholder" rows={3} /></div>
            <div><StateLabel>Hover</StateLabel><TAField C={C} variant={variant} state="hover" content="value" rows={3} /></div>
            <div><StateLabel>Focused</StateLabel><TAField C={C} variant={variant} state="focused" content="value" rows={3} /></div>
            <div><StateLabel>Disabled</StateLabel><TAField C={C} variant={variant} state="disabled" content="value" rows={3} /></div>
            <div><StateLabel>Error</StateLabel><TAField C={C} variant={variant} state="error" content="value" rows={3} helper counter /></div>
            <div><StateLabel>Error — empty</StateLabel><TAField C={C} variant={variant} state="error" content="empty" rows={3} helper /></div>
          </>
        )}
      </div>

      <Rule />

      {/* ── Height ── */}
      <SectionAnchor id="height" />
      <H2>Height & rows</H2>
      <P>Control visible height through the <Code>rows</Code> prop. Each row is one line of text (24px line-height + padding). Minimum recommended: <strong>3 rows</strong>. The user can always resize beyond this if resize is enabled.</P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { rows: 2, label: '2 rows', note: 'Compact — short additions, inline forms' },
          { rows: 4, label: '4 rows (default)', note: 'Standard — comments, descriptions' },
          { rows: 6, label: '6 rows', note: 'Extended — long-form content, support tickets' },
        ].map(({ rows, label, note }) => (
          <div key={rows} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, alignItems: 'start' }}>
            <div style={{ paddingTop: isOutlined ? 12 : 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{note}</div>
            </div>
            <TAField C={C} variant={variant} content="placeholder" rows={rows} showResize={false} />
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
          <P>When the field is empty and unfocused, the label sits inside at full size — acting as a placeholder hint. On focus or when text is present, it floats up and straddles the top border with a white background clipping the border beneath.</P>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div><StateLabel>1. Empty</StateLabel><TAField C={C} variant="outlined" content="empty" rows={3} /></div>
            <div><StateLabel>2. Focused (label floats)</StateLabel><TAField C={C} variant="outlined" state="focused" content="empty" rows={3} /></div>
            <div><StateLabel>3. Has value</StateLabel><TAField C={C} variant="outlined" content="value" rows={3} /></div>
          </div>
        </>
      ) : (
        <>
          <H3>Fixed label — Filled</H3>
          <P>The label is always rendered at 12px in the top-left corner of the field, inside the container. Height never changes — only the label color shifts on focus or error. The typing zone is always clearly separated below the label.</P>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div><StateLabel>1. Empty</StateLabel><TAField C={C} variant={variant} content="empty" rows={3} /></div>
            <div><StateLabel>2. Focused</StateLabel><TAField C={C} variant={variant} state="focused" content="empty" rows={3} /></div>
            <div><StateLabel>3. Has value</StateLabel><TAField C={C} variant={variant} content="value" rows={3} /></div>
          </div>
        </>
      )}

      <Rule />

      {/* ── Resize ── */}
      <SectionAnchor id="resize" />
      <H2>Resize behavior</H2>
      <P>Four resize strategies are available. Choose based on how predictable the layout needs to be. The resize handle (shown as three diagonal lines in the bottom-right corner) is always visible when resizing is enabled.</P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {[
          { resize: 'none',     autoGrow: false, label: 'No resize',    note: 'Fixed height. Use when content length is predictable or layout must remain stable.' },
          { resize: 'vertical', autoGrow: false, label: 'Vertical only', note: 'Recommended default. User controls height, width stays locked to the form column.' },
          { resize: 'both',     autoGrow: false, label: 'Both axes',    note: 'Use sparingly. May disrupt surrounding layout. Suitable for full-page editors.' },
          { resize: 'none',     autoGrow: true,  label: 'Auto-grow',    note: 'Height grows automatically as the user types. Best for chat or inline comment inputs.' },
        ].map(({ resize, autoGrow, label, note }) => (
          <div key={label} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'start' }}>
            <div style={{ paddingTop: isOutlined ? 12 : 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3, lineHeight: 1.5 }}>{note}</div>
            </div>
            <LiveTA C={C} variant={variant} rows={3} resize={resize} autoGrow={autoGrow} label={label} />
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Helper + counter ── */}
      <SectionAnchor id="helper" />
      <H2>Helper text & character counter</H2>
      <P>The helper row sits below the field. It holds a helper/error message on the left and an optional character counter on the right. Both are independent — show either, both, or neither.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 24 }}>
        <div>
          <StateLabel>Helper text only</StateLabel>
          <TAField C={C} variant={variant} content="value" rows={3} helper />
        </div>
        <div>
          <StateLabel>Counter only</StateLabel>
          <TAField C={C} variant={variant} content="value" rows={3} counter maxLength={200} />
        </div>
        <div>
          <StateLabel>Helper + counter</StateLabel>
          <TAField C={C} variant={variant} content="value" rows={3} helper counter maxLength={200} />
        </div>
        <div>
          <StateLabel>Error + helper + counter</StateLabel>
          <TAField C={C} variant={variant} state="error" content="placeholder" rows={3} helper counter maxLength={200} />
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '16px 20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
              {['Element', 'Color — default', 'Color — error', 'Font'].map(h => (
                <th key={h} style={{ padding: '6px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Helper text', C.helperDefault, C.helperIncorrect, '12px Regular'],
              ['Counter',     C.labelDefault,  C.labelDefault,    '12px Regular'],
              ['Icon',        C.helperDefault,  C.helperIncorrect, '14px SVG'],
            ].map(([el, col, errCol, font]) => (
              <tr key={el} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>{el}</td>
                <td style={{ padding: '8px 12px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: col, display: 'inline-block' }} /><code style={{ fontSize: 11 }}>{col}</code></span></td>
                <td style={{ padding: '8px 12px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: errCol, display: 'inline-block' }} /><code style={{ fontSize: 11 }}>{errCol}</code></span></td>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{font}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Rule />

      {/* ── All variants ── */}
      <SectionAnchor id="variants" />
      <H2>All three variants</H2>
      <P>All three variants shown at the same focused state for direct comparison. Pick the one matching your Text Field variant and use it everywhere.</P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { v: 'outlined', label: 'Outlined' },
          { v: 'neutral',  label: 'Filled Neutral' },
          { v: 'brand',    label: 'Filled Brand' },
        ].map(({ v, label }) => (
          <div key={v} style={{
            background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden',
            border: variant === v ? `2px solid ${C.brand}` : '1px solid var(--stroke-primary)',
          }}>
            <div style={{ padding: '20px 20px 4px' }}>
              <TAField C={C} variant={v} state="focused" content="value" rows={3} />
            </div>
            <div style={{ padding: '10px 20px 14px', fontSize: 13, fontWeight: 600, color: variant === v ? C.brand : 'var(--text-secondary)' }}>
              {label}{variant === v ? ' — active' : ''}
            </div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── When to use ── */}
      <SectionAnchor id="usage" />
      <H2>When to use</H2>
      <P>Use a Text Area when the user's response is expected to be more than one or two short words — descriptions, notes, comments, or support messages. Use a Text Field for everything else.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        {[
          ['✓ Use Text Area for', ['Descriptions (product, project, bio)', 'Comments or feedback', 'Support messages or bug reports', 'Address fields', 'Any multi-sentence response']],
          ['✗ Use Text Field instead for', ['Name, email, phone, search', 'Single-word answers', 'Short labels or codes', 'Inline edits in tables', 'Autocomplete or suggestion fields']],
        ].map(([title, items]) => (
          <div key={title} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: title.startsWith('✓') ? '#16a34a' : '#dc2626', marginBottom: 10 }}>{title}</div>
            {items.map(item => (
              <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <span style={{ color: title.startsWith('✓') ? '#16a34a' : '#dc2626', fontWeight: 700 }}>{title.startsWith('✓') ? '→' : '×'}</span>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Do / Don't ── */}
      <SectionAnchor id="dosdonts" />
      <H2>Do & Don't</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <DoBox visual={
          <div style={{ width: 280 }}>
            <TAField C={C} variant={variant} content="placeholder" rows={4} helper />
          </div>
        }>
          Provide a helpful placeholder text that gives users an example of what to write. Pair it with helper text below for guidance on length or format.
        </DoBox>
        <DontBox visual={
          <div style={{ width: 280 }}>
            <TAField C={C} variant={variant} content="empty" rows={2} showResize={false} />
          </div>
        }>
          Don't use a Text Area with only 2 rows for content that could easily run longer. Users should see at least 3–4 lines to understand the expected scope of the response.
        </DontBox>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DoBox visual={
          <div style={{ width: 280 }}>
            <TAField C={C} variant={variant} content="value" rows={4} counter maxLength={200} />
          </div>
        }>
          Show a character counter when you enforce a maximum length. This lets users track their remaining space in real time.
        </DoBox>
        <DontBox visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 280 }}>
            <TAField C={C} variant="outlined" content="value" rows={3} showResize={false} />
            <TAField C={C} variant="neutral" content="value" rows={3} showResize={false} />
          </div>
        }>
          Don't mix Text Area variants. If your Text Field uses Outlined, your Text Area must too. Mixing variants breaks visual consistency across the form.
        </DontBox>
      </div>

      <Rule />

      {/* ── Accessibility ── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          ['Always use a visible label', 'Placeholder text alone is not sufficient. When the field is focused and text is typed, the placeholder disappears — leaving sighted and assistive-tech users without context.'],
          ['Associate label with textarea', 'Use <label for="…"> pointing to the textarea\'s id, or wrap both inside a <label> element. Never rely on visual proximity alone.'],
          ['Announce character limit', 'If a maxLength is enforced, surface the remaining count in an aria-live region so screen reader users hear updates as they type.'],
          ['Communicate errors clearly', 'Tie error messages to the field via aria-describedby. Error color alone is not sufficient for users with color vision deficiency.'],
          ['Resize must be keyboard-accessible', 'The CSS resize handle is mouse-only. Provide an explicit height or rows control (e.g. a stepper or min/max-height) so keyboard users can adjust the area.'],
          ['Min-height matters', 'A textarea that is too short forces horizontal scrolling of content. Minimum 3 rows ensures the typing area is legible without scrolling.'],
        ].map(([title, detail]) => (
          <div key={title} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.brand, flexShrink: 0, marginTop: 7 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{detail}</div>
            </div>
          </div>
        ))}
      </div>

      <Rule />

      {/* ── Token reference ── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>
      <P>The Text Area inherits all tokens from the Text Field. No textarea-specific tokens exist — both components share the <Code>inputfield.*</Code> namespace.</P>

      <H3>Outlined tokens</H3>
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '0 0 1px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              {['Token', 'Resolved value', 'Role'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['inputfield.outlined.container.stroke.default',   C.strokeDefault,   'Border — default'],
              ['inputfield.outlined.container.stroke.hover',     C.strokeHover,     'Border — hover'],
              ['inputfield.outlined.container.stroke.focused',   C.strokeFocused,   'Border — focused'],
              ['inputfield.outlined.container.stroke.incorrect', C.strokeIncorrect, 'Border — error'],
              ['inputfield.outlined.container.stroke.disabled',  C.strokeDisabled,  'Border — disabled'],
              ['inputfield.outlined.container.focused-shadow',   C.focusShadow,     'Outer glow — focused'],
              ['inputfield.outlined.container.hover-shadow',     C.hoverShadow,     'Outer glow — hover'],
              ['inputfield.outlined.container.radius',           C.radius + 'px',   'Border radius'],
              ['inputfield.outlined.label.default',              C.labelDefault,    'Label — empty'],
              ['inputfield.outlined.label.default-filled',       C.labelFilled,     'Label — floated'],
              ['inputfield.outlined.label.focused',              C.labelFocused,    'Label — focused'],
              ['inputfield.outlined.label.incorrect',            C.labelIncorrect,  'Label — error'],
              ['inputfield.outlined.label.disabled',             C.labelDisabled,   'Label — disabled'],
              ['inputfield.outlined.value.default',              C.valueDefault,    'Value text'],
              ['inputfield.outlined.placeholder-color',          C.placeholder,     'Placeholder text'],
              ['inputfield.outlined.helper.default',             C.helperDefault,   'Helper / counter text'],
              ['inputfield.outlined.helper.incorrect',           C.helperIncorrect, 'Helper / counter — error'],
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

      <H3>Filled tokens</H3>
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '0 0 1px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--stroke-primary)' }}>
              {['Token', 'Resolved value', 'Role'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['inputfield.filled.container.bg.default',    C.filledBg,           'Neutral bg'],
              ['inputfield.filled.container.bg.hover',      C.filledBgHover,      'Neutral bg — hover'],
              ['inputfield.filled.container.bg.incorrect',  C.filledBgIncorrect,  'Error bg'],
              ['inputfield.filled.container.bg.disabled',   C.filledBgDisabled,   'Disabled bg'],
              ['inputfield.filled.container.stroke.focused',C.filledStroke,       'Neutral focus border'],
              ['— (derived)',                               C.brandBg,            'Brand bg = brand @ 10% on white'],
              ['— (derived)',                               C.brandStroke,        'Brand focus border'],
              ['inputfield.filled.label.default',           C.filledLabelDefault, 'Fixed label — default'],
              ['inputfield.filled.label.default-filled',    C.filledLabelFilled,  'Fixed label — has value'],
              ['inputfield.filled.label.focused',           C.filledLabelFocused, 'Fixed label — focused'],
              ['inputfield.filled.label.incorrect',         C.filledLabelIncorrect,'Fixed label — error'],
              ['inputfield.filled.label.disabled',          C.filledLabelDisabled,'Fixed label — disabled'],
            ].map(([key, val, role]) => (
              <tr key={key + role} style={{ borderBottom: '1px solid var(--stroke-primary)' }}>
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
  )
}
