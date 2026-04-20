import React, { useState, useRef, useEffect } from 'react'
import { THEMES, getComponentTokens } from '../../data/tokens/index.js'

const VISIBLE_THEMES = THEMES.filter(t => !t.id.startsWith('variant'))

// ─── Date utilities ────────────────────────────────────────────────────────────

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEKDAYS    = ['Mo','Tu','We','Th','Fr','Sa','Su']

function calendarGrid(year, month) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const days   = new Date(year, month + 1, 0).getDate()
  const grid   = Array(offset).fill(null)
  for (let d = 1; d <= days; d++) grid.push(d)
  while (grid.length % 7) grid.push(null)
  return grid
}
function dk(y, m, d)  { return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` }
function todayKey()   { const n = new Date(); return dk(n.getFullYear(), n.getMonth(), n.getDate()) }
function prevMY(y, m) { return m === 0  ? [y-1, 11] : [y, m-1] }
function nextMY(y, m) { return m === 11 ? [y+1,  0] : [y, m+1] }
// Key is already YYYY-MM-DD – return as-is for display
function fmtKey(k)    { return k || '' }
const TODAY = todayKey()

// ─── Token extraction ──────────────────────────────────────────────────────────

function getColors(t) {
  const n = k => (typeof t[k] === 'number' ? t[k] : null)
  const brand = t['tabs.indicator'] || '#07a2b6'
  return {
    brand,
    // Trigger — inherits from inputfield.outlined
    trigBg:          t['inputfield.outlined.container.bg.white']         || '#ffffff',
    trigStroke:      t['inputfield.outlined.container.stroke.default']   || '#c4cdd5',
    trigStrokeHov:   t['inputfield.outlined.container.stroke.hover']     || '#637381',
    trigStrokeFoc:   t['inputfield.outlined.container.stroke.focused']   || brand,
    trigShadowFoc:   t['inputfield.outlined.container.focused-shadow']   || '#9fefff',
    trigShadowHov:   t['inputfield.outlined.container.hover-shadow']     || '#dfe3e8',
    trigLabelDef:    t['inputfield.outlined.label.default']              || '#919eab',
    trigLabelFil:    t['inputfield.outlined.label.default-filled']       || '#637381',
    trigLabelFoc:    t['inputfield.outlined.label.focused']              || '#454f5b',
    trigLabelBg:     t['inputfield.outlined.container.bg.label']         || '#ffffff',
    trigValue:       t['inputfield.outlined.value.default']              || '#141a21',
    trigPlaceholder: t['inputfield.outlined.placeholder-color']          || '#919eab',
    trigRadius:      n('inputfield.outlined.container.radius')           ?? 8,
    trigPy:          n('inputfield.outlined.size.lg.padding-y')         ?? 12,
    trigPx:          n('inputfield.outlined.size.padding-x')            ?? 16,
    // Trigger icon
    iconDefault: t['datepicker.trigger.icon.default'] || '#637381',
    iconActive:  t['datepicker.trigger.icon.active']  || brand,
    // Panel
    panelBg:     t['datepicker.panel.bg']     || '#ffffff',
    panelStroke: t['datepicker.panel.stroke'] || '#dfe3e8',
    panelDivider:t['datepicker.panel.divider']|| '#f4f6f8',
    panelRadius: n('datepicker.panel.radius') ?? 8,
    panelShadow: '0 4px 16px rgba(0,0,0,.10), 0 2px 4px rgba(0,0,0,.06)',
    // Header
    headerText:    t['datepicker.header.text']          || '#637381',
    headerChev:    t['datepicker.header.chevron']       || '#637381',
    headerChevHov: t['datepicker.header.chevron-hover'] || '#141a21',
    headerYear:    t['datepicker.header.year']          || brand,
    headerStroke:  t['datepicker.header.stroke']        || '#dfe3e8',
    // Weekday
    weekText: t['datepicker.weekday.text'] || '#454f5b',
    // Day
    dayBgDef:  t['datepicker.day.bg.default']  || 'transparent',
    dayBgHov:  t['datepicker.day.bg.hover']    || '#f4f6f8',
    dayBgSel:  t['datepicker.day.bg.selected'] || brand,
    dayBgRng:  t['datepicker.day.bg.in-range'] || '#e0f4f8',
    dayTxtDef: t['datepicker.day.text.default']   || '#141a21',
    dayTxtSel: t['datepicker.day.text.selected']  || '#ffffff',
    dayTxtRng: t['datepicker.day.text.in-range']  || brand,
    dayTxtTod: t['datepicker.day.text.today']     || brand,
    dayTxtDis: t['datepicker.day.text.disabled']  || '#c4cdd5',
    dayRadius: n('datepicker.day.radius') ?? 4,
    daySize:   n('datepicker.day.size')   ?? 35,
    // Preset
    presetBgDef:  t['datepicker.preset.bg.default']  || 'transparent',
    presetBgHov:  t['datepicker.preset.bg.hover']    || '#f4f6f8',
    presetBgSel:  t['datepicker.preset.bg.selected'] || '#e0f4f8',
    presetTxtDef: t['datepicker.preset.text.default']  || '#141a21',
    presetTxtSel: t['datepicker.preset.text.selected'] || brand,
    presetRadius: n('datepicker.preset.radius') ?? 6,
    presetPx:     n('datepicker.preset.padding-x') ?? 10,
    presetPy:     n('datepicker.preset.padding-y') ?? 6,
    // Hours / time
    hoursBg:   t['datepicker.hours.bg']   || '#f4f6f8',
    hoursText: t['datepicker.hours.text'] || '#637381',
  }
}

// ─── Preset ranges ─────────────────────────────────────────────────────────────

function getPresets() {
  const n  = new Date()
  const y  = n.getFullYear(), mo = n.getMonth(), d = n.getDate()
  const kd = (yr, mn, dy) => dk(yr, mn, dy)
  const daysAgo = days => { const p = new Date(n); p.setDate(d - days); return kd(p.getFullYear(), p.getMonth(), p.getDate()) }

  // Last-month: correctly derive year + 0-indexed month
  const lmYear = mo === 0 ? y - 1 : y
  const lmMo   = mo === 0 ? 11 : mo - 1
  const lmDays = new Date(lmYear, lmMo + 1, 0).getDate()   // days in last month

  return [
    { id: 'custom',    label: 'Custom date range', start: null,                   end: null },
    { id: 'today',     label: 'Today',             start: kd(y,mo,d),             end: kd(y,mo,d) },
    { id: 'last7',     label: 'Last 7 days',       start: daysAgo(6),             end: kd(y,mo,d) },
    { id: 'last14',    label: 'Last 14 days',      start: daysAgo(13),            end: kd(y,mo,d) },
    { id: 'thisMonth', label: 'This month',        start: kd(y,mo,1),             end: kd(y,mo,d) },
    { id: 'lastMonth', label: 'Last month',        start: kd(lmYear,lmMo,1),      end: kd(lmYear,lmMo,lmDays) },
    { id: 'thisYear',  label: 'This year',         start: kd(y,0,1),              end: kd(y,mo,d) },
  ]
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

const CalIcon = ({ color = '#637381', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth="1.8" />
    <path d="M3 9h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 2v3M16 2v3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="8"  cy="13" r="1" fill={color} />
    <circle cx="12" cy="13" r="1" fill={color} />
    <circle cx="16" cy="13" r="1" fill={color} />
    <circle cx="8"  cy="17" r="1" fill={color} />
    <circle cx="12" cy="17" r="1" fill={color} />
  </svg>
)
const ChevLeft = ({ color = '#637381', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ChevRight = ({ color = '#637381', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ChevDown = ({ color = '#637381', size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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
      {visual && <div style={{ padding: '24px 20px', background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '24px 20px', background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, C, label }) {
  return (
    <div onClick={() => onChange(!checked)}
      style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
      <div style={{
        width: 36, height: 20, borderRadius: 10, flexShrink: 0,
        background: checked ? C.brand : '#dfe3e8',
        position: 'relative', transition: 'background .2s',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        }} />
      </div>
      {label && (
        <span style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: 'var(--text-primary)' }}>{label}</span>
      )}
    </div>
  )
}

// ─── Time segment input ───────────────────────────────────────────────────────

function TimeSegment({ value, onChange, max }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={e => {
        // Allow typing: only keep digits, max 2 chars
        const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
        if (raw === '') { onChange('00'); return }
        onChange(raw)                        // update while typing
      }}
      onBlur={e => {
        // Clamp and pad on blur
        const v = Math.max(0, Math.min(max, parseInt(e.target.value) || 0))
        onChange(String(v).padStart(2, '0'))
      }}
      style={{
        width: 24, textAlign: 'center', border: 'none', background: 'transparent',
        fontSize: 13, fontFamily: 'Poppins, sans-serif', color: 'inherit',
        outline: 'none', padding: 0,
      }}
    />
  )
}

// Time row: "From  00 : 00 : 00  AM ▾" or "To  11 : 59 : 59  PM ▾"
function TimeRow({ C, label, h, m, s, ap, onH, onM, onS, onAP }) {
  const sep = <span style={{ color: C.hoursText, userSelect: 'none', padding: '0 1px' }}>:</span>
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: C.headerText, minWidth: 28 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', background: C.hoursBg, borderRadius: 6, padding: '5px 10px', color: C.dayTxtDef }}>
        <TimeSegment value={h} onChange={onH} max={12} />
        {sep}
        <TimeSegment value={m} onChange={onM} max={59} />
        {sep}
        <TimeSegment value={s} onChange={onS} max={59} />
      </div>
      <div onClick={() => onAP(ap === 'AM' ? 'PM' : 'AM')}
        style={{ display: 'flex', alignItems: 'center', gap: 4, background: C.hoursBg, borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 13, fontFamily: 'Poppins, sans-serif', color: C.brand, fontWeight: 500 }}>
        {ap}
        <ChevDown color={C.brand} size={10} />
      </div>
    </div>
  )
}

// Compact time display for header (read-only)
function TimeBadge({ C, h, m, s }) {
  return (
    <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', color: C.hoursText, letterSpacing: '.02em' }}>
      {h} : {m} : {s}
    </span>
  )
}

// ─── Year dropdown ────────────────────────────────────────────────────────────

function YearDropdown({ C, year, onSelect, onClose, anchorRef }) {
  const dropRef = useRef(null)
  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = currentYear - 10; y <= currentYear + 10; y++) years.push(y)

  useEffect(() => {
    function h(e) {
      if (
        dropRef.current && !dropRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) onClose()
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  // Scroll selected year into view
  useEffect(() => {
    if (dropRef.current) {
      const sel = dropRef.current.querySelector('[data-selected]')
      if (sel) sel.scrollIntoView({ block: 'center' })
    }
  }, [])

  return (
    <div ref={dropRef} style={{
      position: 'absolute', top: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)',
      background: C.panelBg, border: `1px solid ${C.panelStroke}`, borderRadius: 8,
      boxShadow: C.panelShadow, zIndex: 300, maxHeight: 180, overflowY: 'auto',
      minWidth: 72,
    }}>
      {years.map(y => {
        const isSel = y === year
        return (
          <div key={y}
            data-selected={isSel || undefined}
            onClick={e => { e.stopPropagation(); onSelect(y); onClose() }}
            style={{
              padding: '6px 16px', fontSize: 13, fontFamily: 'Poppins, sans-serif',
              fontWeight: isSel ? 600 : 400, cursor: 'pointer',
              color: isSel ? C.brand : C.dayTxtDef,
              background: isSel ? C.dayBgRng : 'transparent',
              transition: 'background .1s',
            }}>
            {y}
          </div>
        )
      })}
    </div>
  )
}

// ─── Trigger field ────────────────────────────────────────────────────────────

function TriggerField({
  C, label = 'Date', value = '', placeholder = 'YYYY-MM-DD',
  focused = false, hovered = false, disabled = false,
  onClick, onMouseEnter, onMouseLeave,
}) {
  const hasValue   = !!value
  const labelUp    = hasValue || focused

  const borderColor = disabled ? '#dfe3e8' : focused ? C.trigStrokeFoc : hovered ? C.trigStrokeHov : C.trigStroke
  const borderWidth = focused ? 2 : 1
  const shadow      = focused ? `0 0 0 3px ${C.trigShadowFoc}` : hovered ? `0 0 0 4px ${C.trigShadowHov}` : 'none'
  const labelColor  = disabled ? '#c4cdd5' : focused ? C.trigLabelFoc : labelUp ? C.trigLabelFil : C.trigLabelDef

  // Floating label: sits on the top border when up, centred inside field when down
  const labelTop  = labelUp ? 12 : 12 + C.trigPy + 12   // 12 = paddingTop of wrapper
  const labelLeft = labelUp ? 13 : C.trigPx
  const labelSize = labelUp ? 14 : 16

  // Placeholder text only shown when focused with no value (format hint)
  const displayText = hasValue ? value : (focused ? placeholder : '\u00a0')
  const textColor   = hasValue ? C.trigValue : C.trigPlaceholder

  return (
    <div style={{ width: '100%', opacity: disabled ? 0.55 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
    >
      <div style={{ position: 'relative', paddingTop: 12 }}>
        {/* Field box */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          paddingLeft: C.trigPx, paddingRight: C.trigPx,
          height: C.trigPy * 2 + 24,
          background: C.trigBg,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: C.trigRadius,
          boxShadow: shadow,
          transition: 'all .15s', userSelect: 'none',
        }}>
          <span style={{
            flex: 1, fontSize: 16, fontFamily: 'Poppins, sans-serif',
            color: textColor, lineHeight: '24px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {displayText}
          </span>
          <CalIcon color={focused ? C.iconActive : C.iconDefault} size={20} />
        </div>

        {/* Floating label */}
        <span style={{
          position: 'absolute', left: labelLeft, top: labelTop, transform: 'translateY(-50%)',
          background: labelUp ? C.trigLabelBg : 'transparent',
          padding: labelUp ? '0 4px' : '0',
          fontSize: labelSize, fontWeight: labelUp ? 500 : 400,
          fontFamily: 'Poppins, sans-serif', color: labelColor,
          whiteSpace: 'nowrap', lineHeight: '24px',
          transition: 'all .15s', pointerEvents: 'none',
        }}>{label}</span>
      </div>
    </div>
  )
}

// ─── Calendar header ──────────────────────────────────────────────────────────

function CalHeader({
  C, year, month, onPrev, onNext,
  showPrev = true, showNext = true,
  onYearChange,
}) {
  const [hovP,     setHovP]     = useState(false)
  const [hovN,     setHovN]     = useState(false)
  const [yearOpen, setYearOpen] = useState(false)
  const yearBtnRef = useRef(null)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
      {/* Prev arrow */}
      <div
        onClick={showPrev ? onPrev : undefined}
        onMouseEnter={() => setHovP(true)} onMouseLeave={() => setHovP(false)}
        style={{
          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 6, cursor: showPrev ? 'pointer' : 'default',
          background: hovP && showPrev ? C.dayBgHov : 'transparent',
          opacity: showPrev ? 1 : 0, flexShrink: 0,
        }}>
        <ChevLeft color={hovP ? C.headerChevHov : C.headerChev} />
      </div>

      {/* Month + Year */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
        {/* Month name — normal text colour */}
        <span style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: C.headerText }}>
          {MONTH_NAMES[month]}
        </span>

        {/* Year — brand colour, clickable dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            ref={yearBtnRef}
            onClick={() => onYearChange && setYearOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              cursor: onYearChange ? 'pointer' : 'default',
              padding: '2px 4px', borderRadius: 4,
              background: yearOpen ? C.dayBgHov : 'transparent',
              transition: 'background .1s', userSelect: 'none',
            }}>
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif', color: C.headerYear }}>
              {year}
            </span>
            {onYearChange && <ChevDown color={C.headerYear} size={10} />}
          </div>

          {yearOpen && onYearChange && (
            <YearDropdown
              C={C} year={year}
              onSelect={y => { onYearChange(y); setYearOpen(false) }}
              onClose={() => setYearOpen(false)}
              anchorRef={yearBtnRef}
            />
          )}
        </div>
      </div>

      {/* Next arrow */}
      <div
        onClick={showNext ? onNext : undefined}
        onMouseEnter={() => setHovN(true)} onMouseLeave={() => setHovN(false)}
        style={{
          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 6, cursor: showNext ? 'pointer' : 'default',
          background: hovN && showNext ? C.dayBgHov : 'transparent',
          opacity: showNext ? 1 : 0, flexShrink: 0,
        }}>
        <ChevRight color={hovN ? C.headerChevHov : C.headerChev} />
      </div>
    </div>
  )
}

// ─── Day grid ─────────────────────────────────────────────────────────────────

function DayGrid({ C, year, month, selected, rangeStart, rangeEnd, hoverKey, onDay, onHoverDay, disabledFn }) {
  const [hovDay, setHovDay] = useState(null)   // locally tracked for cell hover bg
  const grid = calendarGrid(year, month)
  const rows = []
  for (let r = 0; r < grid.length / 7; r++) rows.push(grid.slice(r*7, r*7+7))

  return (
    <div onMouseLeave={() => setHovDay(null)}>
      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${C.daySize}px)`, marginBottom: 4 }}>
        {WEEKDAYS.map(w => (
          <div key={w} style={{ width: C.daySize, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, fontFamily: 'Poppins, sans-serif', color: C.weekText, letterSpacing: '.04em' }}>{w}</div>
        ))}
      </div>
      {/* Day rows */}
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${C.daySize}px)` }}>
          {row.map((d, ci) => {
            if (!d) return <div key={ci} style={{ width: C.daySize, height: C.daySize }} />
            const key      = dk(year, month, d)
            const isToday  = key === TODAY
            const isSel    = selected === key || rangeStart === key || rangeEnd === key
            const isStart  = rangeStart === key
            const isEnd    = rangeEnd === key
            const isInRng  = rangeStart && rangeEnd && key > rangeStart && key < rangeEnd
            const isHovRng = rangeStart && !rangeEnd && hoverKey && key > rangeStart && key < hoverKey
            const isDis    = disabledFn ? disabledFn(key) : false
            const isCellHov = hovDay === key && !isSel && !isInRng && !isHovRng && !isDis

            let bg  = C.dayBgDef
            let col = isDis ? C.dayTxtDis : isToday ? C.dayTxtTod : C.dayTxtDef
            let fw  = isToday ? 600 : 400

            if (isSel)                    { bg = C.dayBgSel; col = C.dayTxtSel; fw = 600 }
            else if (isInRng || isHovRng) { bg = C.dayBgRng; col = C.dayTxtRng }
            else if (isCellHov)           { bg = C.dayBgHov }

            // Range edge rounding — flat on the inner edge
            const rL = (isStart || (!rangeStart && isSel)) ? C.dayRadius : (isInRng || isHovRng) ? 0 : C.dayRadius
            const rR = (isEnd   || (!rangeEnd   && isSel)) ? C.dayRadius : (isInRng || isHovRng) ? 0 : C.dayRadius

            return (
              <div key={ci}
                onMouseEnter={() => {
                  setHovDay(key)
                  if (!isDis && onHoverDay) onHoverDay(key)
                }}
                onClick={() => !isDis && onDay && onDay(key, d)}
                style={{
                  width: C.daySize, height: C.daySize,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: bg,
                  borderRadius: `${rL}px ${rR}px ${rR}px ${rL}px`,
                  fontSize: 13, fontWeight: fw, fontFamily: 'Poppins, sans-serif',
                  color: col, cursor: isDis ? 'default' : 'pointer',
                  opacity: isDis ? 0.4 : 1,
                  userSelect: 'none', transition: 'background .1s',
                }}
              >{d}</div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ─── Panel wrapper ────────────────────────────────────────────────────────────

function Panel({ C, children, style }) {
  return (
    <div style={{
      background: C.panelBg, border: `1px solid ${C.panelStroke}`,
      borderRadius: C.panelRadius, boxShadow: C.panelShadow,
      padding: 20, display: 'inline-block',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Action button ────────────────────────────────────────────────────────────

function ActionBtn({ C, children, onClick, variant = 'ghost' }) {
  const [hov, setHov] = useState(false)
  const isPrimary = variant === 'primary'
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500, fontFamily: 'Poppins, sans-serif',
        cursor: 'pointer', border: isPrimary ? 'none' : `1px solid ${C.panelStroke}`,
        background: isPrimary ? C.brand : hov ? C.dayBgHov : 'transparent',
        color: isPrimary ? '#fff' : C.headerText,
        opacity: isPrimary && hov ? 0.88 : 1, transition: 'all .15s',
      }}>
      {children}
    </button>
  )
}

// ─── Live single date picker ──────────────────────────────────────────────────

function LiveSinglePicker({ C, label = 'Date', disabled = false }) {
  const now = new Date()
  const [open,     setOpen]    = useState(false)
  const [year,     setYear]    = useState(now.getFullYear())
  const [month,    setMonth]   = useState(now.getMonth())
  const [selected, setSelected]= useState(null)
  const [hovered,  setHovered] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function selectDay(key) { setSelected(key); setOpen(false) }
  function goP() { const [y,m] = prevMY(year, month); setYear(y); setMonth(m) }
  function goN() { const [y,m] = nextMY(year, month); setYear(y); setMonth(m) }

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <TriggerField
        C={C} label={label}
        value={selected ? fmtKey(selected) : ''}
        placeholder="YYYY-MM-DD"
        focused={open} hovered={hovered} disabled={disabled}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      />
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100 }}>
          <Panel C={C}>
            <CalHeader
              C={C} year={year} month={month}
              onPrev={goP} onNext={goN}
              onYearChange={y => setYear(y)}
            />
            <DayGrid C={C} year={year} month={month} selected={selected}
              onDay={selectDay} onHoverDay={() => {}} />
          </Panel>
        </div>
      )}
    </div>
  )
}

// ─── Live range picker ────────────────────────────────────────────────────────

function LiveRangePicker({ C, disabled = false }) {
  const now = new Date()
  const [open,     setOpen]    = useState(false)
  const [lyear,    setLYear]   = useState(now.getFullYear())
  const [lmonth,   setLMonth]  = useState(now.getMonth())
  const [start,    setStart]   = useState(null)
  const [end,      setEnd]     = useState(null)
  const [pending,  setPending] = useState({ start: null, end: null })
  const [hov,      setHov]     = useState(null)
  const [hovPres,  setHovPres] = useState(null)
  const [selPres,  setSelPres] = useState('custom')
  const [trigHov,  setTrigHov] = useState(false)
  // Time
  const [showTime, setShowTime]= useState(false)
  const [fromTime, setFromTime]= useState({ h: '00', m: '00', s: '00', ap: 'AM' })
  const [toTime,   setToTime]  = useState({ h: '11', m: '59', s: '59', ap: 'PM' })

  const ref     = useRef(null)
  const PRESETS = getPresets()

  const [ryear, rmonth] = nextMY(lyear, lmonth)

  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function goP() { const [y,m] = prevMY(lyear, lmonth); setLYear(y); setLMonth(m) }
  function goN() { const [y,m] = nextMY(lyear, lmonth); setLYear(y); setLMonth(m) }

  // Year change handlers — ryear always follows lmonth, so adjusting left year is straightforward
  function onLeftYearChange(newY) { setLYear(newY) }
  function onRightYearChange(newRY) {
    const [newLY, newLM] = prevMY(newRY, rmonth)
    setLYear(newLY); setLMonth(newLM)
  }

  function pickDay(key) {
    if (!pending.start || (pending.start && pending.end)) {
      setPending({ start: key, end: null }); setSelPres('custom')
    } else {
      const s = pending.start
      setPending({ start: key < s ? key : s, end: key < s ? s : key })
      setSelPres('custom')
    }
  }

  function applyPreset(p) {
    setSelPres(p.id)
    if (p.start) {
      setPending({ start: p.start, end: p.end })
      // Navigate the left calendar to the start date's month
      const parts = p.start.split('-')
      const sy = parseInt(parts[0]), sm = parseInt(parts[1]) - 1
      setLYear(sy); setLMonth(sm)
    } else {
      setPending({ start: null, end: null })
    }
  }

  function apply()  { setStart(pending.start); setEnd(pending.end); setOpen(false) }
  function clear()  { setPending({ start: null, end: null }); setSelPres('custom') }
  function cancel() { setPending({ start: start, end: end }); setOpen(false) }

  const fmtTimePart = t => `${t.h}:${t.m}:${t.s} ${t.ap}`
  const trigValue = start && end
    ? `${fmtKey(start)}${showTime ? ' '+fmtTimePart(fromTime) : ''}  →  ${fmtKey(end)}${showTime ? ' '+fmtTimePart(toTime) : ''}`
    : start ? fmtKey(start) : ''

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <TriggerField
        C={C} label="Date range" value={trigValue}
        placeholder="YYYY-MM-DD"
        focused={open} hovered={trigHov} disabled={disabled}
        onClick={() => { setOpen(o => !o); if (!open) setPending({ start, end }) }}
        onMouseEnter={() => setTrigHov(true)} onMouseLeave={() => setTrigHov(false)}
      />
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100 }}>
          <Panel C={C} style={{ padding: 0 }}>
            <div style={{ display: 'flex' }}>
              {/* ── Preset sidebar ── */}
              <div style={{ width: 190, padding: '16px 10px', borderRight: `1px solid ${C.panelDivider}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {PRESETS.map(p => {
                  const isSel = selPres === p.id
                  const isHov = hovPres === p.id
                  return (
                    <div key={p.id}
                      onMouseEnter={() => setHovPres(p.id)} onMouseLeave={() => setHovPres(null)}
                      onClick={() => applyPreset(p)}
                      style={{
                        padding: `${C.presetPy}px ${C.presetPx}px`, borderRadius: C.presetRadius,
                        fontSize: 13, fontFamily: 'Poppins, sans-serif',
                        fontWeight: isSel ? 500 : 400,
                        color: isSel ? C.presetTxtSel : C.presetTxtDef,
                        background: isSel ? C.presetBgSel : isHov ? C.presetBgHov : C.presetBgDef,
                        cursor: 'pointer', transition: 'background .1s',
                      }}>
                      {p.label}
                    </div>
                  )
                })}
              </div>

              {/* ── Two-month grid area ── */}
              <div style={{ padding: 20 }}>
                {/* Two calendars */}
                <div style={{ display: 'flex', gap: 24 }}>
                  {/* Left month */}
                  <div>
                    <CalHeader
                      C={C} year={lyear} month={lmonth}
                      onPrev={goP} onNext={goN}
                      showPrev={true} showNext={false}
                      onYearChange={onLeftYearChange}
                    />
                    <DayGrid C={C} year={lyear} month={lmonth}
                      rangeStart={pending.start} rangeEnd={pending.end} hoverKey={hov}
                      onDay={pickDay} onHoverDay={setHov} />
                  </div>
                  {/* Divider */}
                  <div style={{ width: 1, background: C.panelDivider, alignSelf: 'stretch' }} />
                  {/* Right month */}
                  <div>
                    <CalHeader
                      C={C} year={ryear} month={rmonth}
                      onPrev={goP} onNext={goN}
                      showPrev={false} showNext={true}
                      onYearChange={onRightYearChange}
                    />
                    <DayGrid C={C} year={ryear} month={rmonth}
                      rangeStart={pending.start} rangeEnd={pending.end} hoverKey={hov}
                      onDay={pickDay} onHoverDay={setHov} />
                  </div>
                </div>

                {/* ── Time row (visible when Set Time is on) ── */}
                {showTime && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.panelDivider}` }}>
                    <TimeRow
                      C={C} label="From"
                      h={fromTime.h} m={fromTime.m} s={fromTime.s} ap={fromTime.ap}
                      onH={v => setFromTime(t => ({ ...t, h: v }))}
                      onM={v => setFromTime(t => ({ ...t, m: v }))}
                      onS={v => setFromTime(t => ({ ...t, s: v }))}
                      onAP={v => setFromTime(t => ({ ...t, ap: v }))}
                    />
                    <TimeRow
                      C={C} label="To"
                      h={toTime.h} m={toTime.m} s={toTime.s} ap={toTime.ap}
                      onH={v => setToTime(t => ({ ...t, h: v }))}
                      onM={v => setToTime(t => ({ ...t, m: v }))}
                      onS={v => setToTime(t => ({ ...t, s: v }))}
                      onAP={v => setToTime(t => ({ ...t, ap: v }))}
                    />
                  </div>
                )}

                {/* ── Action bar ── */}
                <div style={{
                  borderTop: `1px solid ${C.panelDivider}`, marginTop: 16, paddingTop: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  {/* Left: Set Time toggle */}
                  <Toggle C={C} checked={showTime} onChange={setShowTime} label="Set Time" />
                  {/* Right: Clear + Cancel + Apply */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ActionBtn C={C} onClick={clear}  variant="ghost">Clear</ActionBtn>
                    <ActionBtn C={C} onClick={cancel} variant="ghost">Cancel</ActionBtn>
                    <ActionBtn C={C} onClick={apply}  variant="primary">Apply</ActionBtn>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}

// ─── Static calendar (for docs sections) ─────────────────────────────────────

function StaticCal({ C, year = 2025, month = 9, selected = null, rangeStart = null, rangeEnd = null, disabledFn }) {
  return (
    <Panel C={C} style={{ display: 'block' }}>
      <CalHeader C={C} year={year} month={month} onPrev={() => {}} onNext={() => {}} />
      <DayGrid C={C} year={year} month={month} selected={selected}
        rangeStart={rangeStart} rangeEnd={rangeEnd}
        onDay={() => {}} onHoverDay={() => {}} disabledFn={disabledFn} />
    </Panel>
  )
}

// ─── Token rows ───────────────────────────────────────────────────────────────

const TOKEN_ROWS = [
  ['datepicker.trigger.icon.default', 'Calendar icon — resting'],
  ['datepicker.trigger.icon.active',  'Calendar icon — focused'],
  ['datepicker.panel.bg',             'Panel background'],
  ['datepicker.panel.stroke',         'Panel border'],
  ['datepicker.panel.divider',        'Internal divider'],
  ['datepicker.panel.shadow',         'Panel shadow level'],
  ['datepicker.panel.radius',         'Panel border-radius'],
  ['datepicker.header.text',          'Month/year label'],
  ['datepicker.header.chevron',       'Navigation arrow'],
  ['datepicker.header.chevron-hover', 'Navigation arrow — hover'],
  ['datepicker.header.year',          'Month name colour'],
  ['datepicker.header.stroke',        'Header bottom stroke'],
  ['datepicker.weekday.text',         'Weekday label colour'],
  ['datepicker.day.bg.default',       'Day cell background'],
  ['datepicker.day.bg.hover',         'Day cell — hover'],
  ['datepicker.day.bg.selected',      'Day cell — selected'],
  ['datepicker.day.bg.in-range',      'Day cell — in range'],
  ['datepicker.day.text.default',     'Day text'],
  ['datepicker.day.text.selected',    'Day text — selected'],
  ['datepicker.day.text.in-range',    'Day text — in range'],
  ['datepicker.day.text.today',       'Day text — today'],
  ['datepicker.day.text.disabled',    'Day text — disabled'],
  ['datepicker.day.radius',           'Day cell radius'],
  ['datepicker.day.size',             'Day cell size'],
  ['datepicker.preset.bg.default',    'Preset item background'],
  ['datepicker.preset.bg.hover',      'Preset item — hover'],
  ['datepicker.preset.bg.selected',   'Preset item — selected'],
  ['datepicker.preset.text.default',  'Preset text'],
  ['datepicker.preset.text.selected', 'Preset text — selected'],
  ['datepicker.preset.radius',        'Preset item radius'],
  ['datepicker.preset.padding-x',     'Preset horizontal padding'],
  ['datepicker.preset.padding-y',     'Preset vertical padding'],
  ['datepicker.hours.bg',             'Time input background'],
  ['datepicker.hours.text',           'Time input text'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DatePickerPage() {
  const [themeIdx, setThemeIdx] = useState(0)
  const [demoMode, setDemoMode] = useState('single')

  const theme  = VISIBLE_THEMES[themeIdx]
  const tokens = getComponentTokens(theme.id)
  const C      = getColors(tokens)

  const pill   = { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: 'pointer', border: '1px solid var(--stroke-primary)' }
  const active = on => on ? { background: C.brand, color: '#fff', border: `1px solid ${C.brand}` } : { background: 'transparent', color: 'var(--text-secondary)' }

  // Fixed reference month for static displays: October 2025
  const REF_Y = 2025, REF_M = 9

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 32px 80px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: C.brand }}>Forms</span>
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', marginBottom: 8 }}>Date Picker</h1>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {VISIBLE_THEMES.map((t, i) => (
          <button key={t.id} onClick={() => setThemeIdx(i)} style={{ ...pill, ...active(themeIdx === i) }}>{t.name}</button>
        ))}
      </div>

      <Lead>
        The Date Picker lets users select a single date or a date range from a calendar panel. The trigger inherits all visual tokens from the <strong>Outlined Text Field</strong>; the calendar panel has its own dedicated token set. Two modes are available: <strong>Single Date</strong> — which auto-closes on selection — and <strong>Date Range</strong> — which stays open until the user clicks Apply, and supports preset range shortcuts and an optional time selector.
      </Lead>

      <Rule />

      {/* ── Interactive demo ── */}
      <SectionAnchor id="demo" />
      <H2>Interactive demo</H2>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[['single','Single Date'],['range','Date Range']].map(([v,l]) => (
          <button key={v} onClick={() => setDemoMode(v)} style={{ ...pill, ...active(demoMode === v) }}>{l}</button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '32px 24px', marginBottom: 4 }}>
        <div style={{ maxWidth: 380, margin: '0 auto' }}>
          {demoMode === 'single'
            ? <LiveSinglePicker key={`sp-${themeIdx}`} C={C} label="Date filter" />
            : <LiveRangePicker  key={`rp-${themeIdx}`} C={C} />
          }
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>Click the trigger field to open the calendar panel.</p>

      <Rule />

      {/* ── Anatomy ── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>

      <H3>Trigger</H3>
      <P>The trigger is an outlined text field with a calendar icon replacing the trailing slot. It uses floating-label behaviour — the label rides up to the border when a value is selected or when the panel is open. In the empty focused state, the format hint <Code>YYYY-MM-DD</Code> appears as placeholder. All visual tokens come from the <Code>inputfield.outlined</Code> namespace.</P>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <StateLabel>Empty / default</StateLabel>
          <TriggerField C={C} label="Date filter" placeholder="YYYY-MM-DD" />
        </div>
        <div>
          <StateLabel>Focused (format hint shown)</StateLabel>
          <TriggerField C={C} label="Date filter" placeholder="YYYY-MM-DD" focused />
        </div>
        <div>
          <StateLabel>With value</StateLabel>
          <TriggerField C={C} label="Date filter" value="2025-10-15" />
        </div>
        <div>
          <StateLabel>Disabled</StateLabel>
          <TriggerField C={C} label="Date filter" placeholder="YYYY-MM-DD" disabled />
        </div>
      </div>

      <H3>Panel</H3>
      <P>The calendar panel floats below the trigger. It contains a navigation header with a clickable year dropdown, weekday labels, and a 7-column day grid. The range variant adds a preset sidebar on the left and action buttons at the bottom. When "Set Time" is toggled on, time inputs appear in the header and below the grids.</P>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div>
          <StateLabel>① Navigation header</StateLabel>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            Month name + clickable year (opens a year dropdown). Prev/next arrows step one month at a time.
          </div>
          <StateLabel>② Weekday row</StateLabel>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            Mo → Su abbreviations. Always Monday-first.
          </div>
          <StateLabel>③ Day grid</StateLabel>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            6 rows × 7 columns. Empty cells outside the current month. Day size controlled by <Code>datepicker.day.size</Code>.
          </div>
        </div>
        <StaticCal C={C} year={REF_Y} month={REF_M} selected="2025-10-15" />
      </div>

      <Rule />

      {/* ── Day states ── */}
      <SectionAnchor id="states" />
      <H2>Day states</H2>
      <P>Each day cell can be in one of six visual states, determined independently per cell on each render.</P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {/* Default */}
        <div>
          <StateLabel>Default</StateLabel>
          <Panel C={C} style={{ display: 'block' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${C.daySize}px)` }}>
              {[12,13,14,16].map(d => (
                <div key={d} style={{ width: C.daySize, height: C.daySize, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: 'Poppins, sans-serif', color: C.dayTxtDef, borderRadius: C.dayRadius }}>{d}</div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Today */}
        <div>
          <StateLabel>Today</StateLabel>
          <Panel C={C} style={{ display: 'block' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${C.daySize}px)` }}>
              {[12,13,14,16].map((d, i) => (
                <div key={d} style={{ width: C.daySize, height: C.daySize, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: i===1?600:400, fontFamily: 'Poppins, sans-serif', color: i===1?C.dayTxtTod:C.dayTxtDef, borderRadius: C.dayRadius }}>{d}</div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Selected */}
        <div>
          <StateLabel>Selected</StateLabel>
          <Panel C={C} style={{ display: 'block' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${C.daySize}px)` }}>
              {[12,13,14,16].map((d, i) => (
                <div key={d} style={{ width: C.daySize, height: C.daySize, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: i===1?600:400, fontFamily: 'Poppins, sans-serif', color: i===1?C.dayTxtSel:C.dayTxtDef, background: i===1?C.dayBgSel:'transparent', borderRadius: C.dayRadius }}>{d}</div>
              ))}
            </div>
          </Panel>
        </div>

        {/* In-range */}
        <div>
          <StateLabel>In range</StateLabel>
          <Panel C={C} style={{ display: 'block' }}>
            <div style={{ display: 'flex' }}>
              {[[10,C.dayBgSel,C.dayTxtSel,C.dayRadius,0],[11,C.dayBgRng,C.dayTxtRng,0,0],[12,C.dayBgRng,C.dayTxtRng,0,0],[14,C.dayBgSel,C.dayTxtSel,0,C.dayRadius]].map(([d,bg,col,rL,rR]) => (
                <div key={d} style={{ width: C.daySize, height: C.daySize, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: 'Poppins, sans-serif', color: col, background: bg, borderRadius: `${rL}px ${rR}px ${rR}px ${rL}px` }}>{d}</div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Disabled */}
        <div>
          <StateLabel>Disabled</StateLabel>
          <Panel C={C} style={{ display: 'block' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${C.daySize}px)` }}>
              {[12,13,14,16].map((d, i) => (
                <div key={d} style={{ width: C.daySize, height: C.daySize, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: 'Poppins, sans-serif', color: i===1||i===2?C.dayTxtDis:C.dayTxtDef, opacity: i===1||i===2?0.4:1, borderRadius: C.dayRadius }}>{d}</div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Hover */}
        <div>
          <StateLabel>Hover</StateLabel>
          <Panel C={C} style={{ display: 'block' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${C.daySize}px)` }}>
              {[12,13,14,16].map((d, i) => (
                <div key={d} style={{ width: C.daySize, height: C.daySize, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: 'Poppins, sans-serif', color: C.dayTxtDef, background: i===1?C.dayBgHov:'transparent', borderRadius: C.dayRadius }}>{d}</div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Rule />

      {/* ── Modes ── */}
      <SectionAnchor id="modes" />
      <H2>Modes</H2>

      <H3>Single date</H3>
      <P>One trigger field. The panel shows a single month view. Clicking any day immediately closes the panel and populates the trigger with the selected date in <Code>YYYY-MM-DD</Code> format.</P>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 280px' }}>
          <TriggerField C={C} label="Date filter" value="2025-10-15" />
        </div>
        <StaticCal C={C} year={REF_Y} month={REF_M} selected="2025-10-15" />
      </div>

      <H3>Date range — with presets</H3>
      <P>One trigger field showing start → end. The panel stays open until the user clicks <strong>Apply</strong>. A preset sidebar provides common relative ranges. The <strong>Set Time</strong> toggle in the action bar reveals time inputs in the header and a From/To time row below each calendar.</P>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '0 0 360px' }}>
          <TriggerField C={C} label="Date range" value="2025-10-06  →  2025-10-19" />
        </div>
      </div>

      {/* Static range panel preview */}
      <Panel C={C} style={{ display: 'inline-flex', padding: 0 }}>
        <div style={{ display: 'flex' }}>
          {/* Preset sidebar */}
          <div style={{ width: 190, padding: '16px 10px', borderRight: `1px solid ${C.panelDivider}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {getPresets().map((p, i) => (
              <div key={p.id} style={{ padding: `${C.presetPy}px ${C.presetPx}px`, borderRadius: C.presetRadius, fontSize: 13, fontFamily: 'Poppins, sans-serif', fontWeight: i===3?500:400, color: i===3?C.presetTxtSel:C.presetTxtDef, background: i===3?C.presetBgSel:C.presetBgDef }}>{p.label}</div>
            ))}
          </div>
          {/* Two-month grids */}
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <CalHeader C={C} year={REF_Y} month={REF_M} onPrev={()=>{}} onNext={()=>{}} showPrev={true} showNext={false} />
                <DayGrid C={C} year={REF_Y} month={REF_M} rangeStart="2025-10-06" rangeEnd="2025-10-19" onDay={()=>{}} onHoverDay={()=>{}} />
              </div>
              <div style={{ width: 1, background: C.panelDivider }} />
              <div>
                <CalHeader C={C} year={REF_Y} month={10} onPrev={()=>{}} onNext={()=>{}} showPrev={false} showNext={true} />
                <DayGrid C={C} year={REF_Y} month={10} rangeStart="2025-10-06" rangeEnd="2025-10-19" onDay={()=>{}} onHoverDay={()=>{}} />
              </div>
            </div>
            {/* Action bar */}
            <div style={{ borderTop: `1px solid ${C.panelDivider}`, marginTop: 16, paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Toggle C={C} checked={false} onChange={() => {}} label="Set Time" />
              <div style={{ display: 'flex', gap: 8 }}>
                {['Clear','Cancel','Apply'].map((l, i) => (
                  <div key={l} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500, fontFamily: 'Poppins, sans-serif', cursor: 'default', border: i===2?'none':`1px solid ${C.panelStroke}`, background: i===2?C.brand:'transparent', color: i===2?'#fff':C.headerText }}>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Rule />

      {/* ── Behaviour ── */}
      <SectionAnchor id="behaviour" />
      <H2>Behaviour</H2>

      <H3>Panel open / close</H3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          ['Single date', 'The panel opens on trigger click and auto-closes as soon as a day is selected. No explicit Apply is needed.'],
          ['Date range', 'The panel stays open after selecting start and end days. The user must click Apply to confirm, or Cancel/click outside to discard.'],
          ['Outside click', 'Clicking outside the panel + trigger always dismisses the panel without applying pending changes.'],
          ['Disabled dates', 'Disabled days are rendered at 40% opacity and cannot be clicked. Always pair with an explanation (tooltip or helper text).'],
        ].map(([title, desc]) => (
          <div key={title} style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</div>
          </div>
        ))}
      </div>

      <H3>Year navigation</H3>
      <P>Clicking the year in the calendar header opens a dropdown list covering ±10 years from today. Selecting a year jumps the calendar view immediately while preserving the current month. In the two-month range view each calendar has its own year dropdown; selecting from the right calendar shifts both panels so they remain consecutive.</P>

      <H3>Set Time</H3>
      <P>The <strong>Set Time</strong> toggle (bottom-left of the range panel) reveals hour / minute / second inputs for both the start and end of the range. The AM/PM selector cycles on click. When Set Time is active, the selected time is also shown in the calendar header next to the month/year and is appended to the trigger field value on Apply.</P>

      <H3>Range selection flow</H3>
      <P>Clicking a day with no start set → sets the start. Clicking again → if earlier than start, becomes the new start; otherwise becomes the end. While a start is set but no end, hovering previews the range using the <Code>in-range</Code> background colour.</P>

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
              ['Enter / Space',   'Open the panel when trigger is focused'],
              ['Escape',          'Close the panel without applying changes'],
              ['Tab / Shift+Tab', 'Move focus between trigger, nav arrows, day grid, and action buttons'],
              ['↑ ↓ ← →',         'Navigate between day cells within the grid'],
              ['Enter on a day',  'Select the focused day'],
              ['Enter on Apply',  'Confirm range selection and close panel'],
              ['Enter on Cancel', 'Discard changes and close panel'],
              ['Home / End',      'Jump to the first / last day of the current month'],
              ['Page Up / Down',  'Navigate to the previous / next month'],
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DoBox visual={<TriggerField C={C} label="Date filter" value="2025-10-15" />}>
          Always show a visible label so users understand what date is being requested, even when a value is present.
        </DoBox>
        <DontBox visual={<TriggerField C={C} label="" value="" placeholder="Pick a date…" focused />}>
          Don't rely on placeholder text alone. Placeholders vanish on focus and are not reliably accessible.
        </DontBox>
        <DoBox>
          Clearly explain why certain dates are disabled — with a tooltip or helper text — so users understand the constraint.
        </DoBox>
        <DontBox>
          Don't show an error state when the user hasn't selected a date yet. Validate only on form submit or when focus leaves the trigger.
        </DontBox>
        <DoBox visual={<TriggerField C={C} label="Date range" value="2025-10-06  →  2025-10-19" />}>
          Use the range mode with presets for dashboards where relative ranges (Last 7 days, This month…) are common.
        </DoBox>
        <DontBox>
          Don't use a date picker to select a year or month only — a plain Select component is more appropriate and avoids unnecessary complexity.
        </DontBox>
      </div>

      <Rule />

      {/* ── Accessibility ── */}
      <SectionAnchor id="a11y" />
      <H2>Accessibility</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          ['Trigger role', 'The trigger should be a <button> with aria-haspopup="dialog" and aria-expanded reflecting the open state.'],
          ['Panel role', 'The calendar panel should have role="dialog" and aria-label="Choose date" (or aria-labelledby pointing to the month/year heading).'],
          ['Day grid', 'Use role="grid" on the day table with role="row" rows and role="gridcell" cells. Each cell needs aria-label="15 October 2025" and aria-selected for selected days.'],
          ['Today', 'Mark today with aria-current="date" so screen readers announce it distinctly.'],
          ['Disabled dates', 'Set aria-disabled="true" on disabled day cells. Never rely on visual opacity alone.'],
          ['Range', 'Announce range endpoints with aria-label — "Start date: 6 October 2025" and "End date: 19 October 2025".'],
          ['Focus management', 'When the panel opens, move focus to the selected day (or today if none). When it closes, return focus to the trigger.'],
          ['Timezone', 'Surface the active timezone near the trigger or in the panel header when date/time selection is timezone-sensitive.'],
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
      <P>Trigger tokens come from <Code>inputfield.outlined.*</Code>. Panel tokens use the <Code>datepicker.*</Code> namespace. All are resolved via <Code>getComponentTokens(themeId)</Code>.</P>

      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--stroke-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Token', 'Value', 'Role'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOKEN_ROWS.map(([token, role], i) => {
              const raw     = tokens[token]
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
