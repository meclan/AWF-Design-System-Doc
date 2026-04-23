import React, { useState, useEffect } from 'react'
import { useBrandTheme } from '../../contexts/BrandThemeContext.jsx'
import BrandThemeSwitcher from '../../components/BrandThemeSwitcher.jsx'
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
  return <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: 'var(--bg-secondary)', color: 'var(--brand-600)', paddingTop: 1, paddingBottom: 1, paddingLeft: 6, paddingRight: 6, borderRadius: 4 }}>{children}</code>
}
function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--stroke-primary)', margin: '48px 0' }} />
}
function InfoBox({ type = 'info', children }) {
  const s = {
    info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', label: 'Note' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', label: 'Warning' },
  }[type]
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, marginBottom: 16, fontSize: 13, color: s.text, lineHeight: 1.65 }}>
      <strong>{s.label}:</strong> {children}
    </div>
  )
}
function DoBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && <div style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 18, paddingRight: 18, background: '#f8fafc', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>{visual}</div>}
      <div style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 18, paddingRight: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#16a34a', marginBottom: 5 }}>✓ Do</div>
        <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}
function DontBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #fecaca', background: '#fef2f2', borderRadius: 8, overflow: 'hidden' }}>
      {visual && <div style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 18, paddingRight: 18, background: '#f8fafc', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>{visual}</div>}
      <div style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 18, paddingRight: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Color extractor ─────────────────────────────────────────────────────────

function getColors(t) {
  const n = k => (typeof t[k] === 'number' ? t[k] : null)
  const brand = t['tabs.indicator'] || '#07a2b6'
  return {
    brand,
    // Header
    headerBgDefault:      t['table.header.bg.default']          || '#f0f9fa',
    headerBgContrasted:   t['table.header.bg.contrasted']       || '#0e7490',
    headerBgGhost:        t['table.header.bg.ghost']            || '#f8fafc',
    headerTextDefault:    t['table.header.text.default']        || '#637381',
    headerTextContrasted: t['table.header.text.contrasted']     || '#ffffff',
    headerSortDefault:    t['table.header.icon-sort.default']   || '#919eab',
    headerSortContrasted: t['table.header.icon-sort.contrasted']|| '#ffffff',
    headerSortActive:     t['table.header.icon-sort.active']    || brand,
    headerPx:             n('table.header.padding-x')           ?? 8,
    headerPy:             n('table.header.padding-y')           ?? 8,
    // Rows
    rowBgDefault:   t['table.row.bg.default']      || '#ffffff',
    rowBgHover:     t['table.row.bg.hover']        || '#f9fafb',
    rowBgSelected:  t['table.row.bg.selected']     || '#e0f4f8',
    rowText:        t['table.row.font-color']       || '#141a21',
    rowDivider:     t['table.row.divider']          || '#f4f6f8',
    rowSelStroke:   t['table.row.selected-stroke']  || brand,
    rowPx:          n('table.row.padding-x')        ?? 8,
    rowHeightDef:   n('table.row.height.default')   ?? 48,
    rowHeightCmp:   n('table.row.height.compact')   ?? 40,
    rowHeightRlx:   n('table.row.height.relaxed')   ?? 64,
    // Bulk
    bulkBg:    t['table.bulk.bg']        || '#0e7490',
    bulkText:  t['table.bulk.text']      || '#ffffff',
    bulkPx:    n('table.bulk.padding-x') ?? 12,
    bulkPy:    n('table.bulk.padding-y') ?? 6,
    bulkGap:   n('table.bulk.gap')       ?? 8,
    // Toolbar
    toolbarBg:  t['table.toolbar.bg']        || '#f8fafc',
    toolbarText:t['table.toolbar.text']       || '#637381',
    toolbarPx:  n('table.toolbar.padding-x') ?? 12,
    toolbarPy:  n('table.toolbar.padding-y') ?? 12,
    toolbarGap: n('table.toolbar.gap')       ?? 4,
    // Filterbar
    filterBg:  t['table.filterbar.bg']        || '#f8fafc',
    filterText:t['table.filterbar.text']       || '#637381',
    filterPx:  n('table.filterbar.padding-x') ?? 12,
    filterPy:  n('table.filterbar.padding-y') ?? 12,
    filterGap: n('table.filterbar.gap')        ?? 4,
  }
}

// ─── Sample data ─────────────────────────────────────────────────────────────

const SAMPLE_ROWS = [
  { id: 1, name: 'Alice Martin',   role: 'Frontend Dev',    dept: 'Engineering', status: 'Active',   date: '2024-03-12' },
  { id: 2, name: 'Bob Chen',       role: 'Product Manager', dept: 'Product',     status: 'Active',   date: '2024-01-08' },
  { id: 3, name: 'Clara Dupont',   role: 'UX Designer',     dept: 'Design',      status: 'Inactive', date: '2023-11-20' },
  { id: 4, name: 'David Kumar',    role: 'Backend Dev',     dept: 'Engineering', status: 'Active',   date: '2024-02-15' },
  { id: 5, name: 'Eva Schneider',  role: 'Data Analyst',    dept: 'Analytics',   status: 'Pending',  date: '2024-04-01' },
  { id: 6, name: 'Frank Osei',     role: 'DevOps',          dept: 'Engineering', status: 'Active',   date: '2023-09-30' },
]

const COLS = [
  { key: 'name',   label: 'Name',       sortable: true,  width: '22%' },
  { key: 'role',   label: 'Role',       sortable: true,  width: '20%' },
  { key: 'dept',   label: 'Department', sortable: true,  width: '18%' },
  { key: 'status', label: 'Status',     sortable: false, width: '14%' },
  { key: 'date',   label: 'Date',       sortable: true,  width: '14%' },
]

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function SortIcon({ dir = 'neutral', color = '#919eab', size = 12 }) {
  if (dir === 'asc') {
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
        <path d="M6 2L10 8H2L6 2Z" fill={color} />
      </svg>
    )
  }
  if (dir === 'desc') {
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
        <path d="M6 10L2 4H10L6 10Z" fill={color} />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 1L9 5H3L6 1Z" fill={color} opacity="0.5" />
      <path d="M6 11L3 7H9L6 11Z" fill={color} opacity="0.5" />
    </svg>
  )
}

function ChevronIcon({ dir = 'right', color = '#637381', size = 14 }) {
  const d = dir === 'right' ? 'M5 3L9 7L5 11' : 'M9 3L5 7L9 11'
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon({ color = '#ffffff', size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1.5 5L4 7.5L8.5 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon({ color = '#637381', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 3L11 11M11 3L3 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FilterIcon({ color = '#637381', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 3h10M4 7h6M6 11h2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon({ color = '#ffffff', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M7 2v10M2 7h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon({ color = '#919eab', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="6" r="4" stroke={color} strokeWidth="1.3" />
      <path d="M9.5 9.5L12.5 12.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function DotsIcon({ color = '#637381', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="3" cy="7" r="1.2" fill={color} />
      <circle cx="7" cy="7" r="1.2" fill={color} />
      <circle cx="11" cy="7" r="1.2" fill={color} />
    </svg>
  )
}

// Density toggle icons — rows of different heights
function DensityIcon({ type, color = '#637381', size = 16 }) {
  if (type === 'compact') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect x="2" y="3"  width="12" height="2"   rx="0.5" fill={color} />
        <rect x="2" y="7"  width="12" height="2"   rx="0.5" fill={color} />
        <rect x="2" y="11" width="12" height="2"   rx="0.5" fill={color} />
      </svg>
    )
  }
  if (type === 'relaxed') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect x="2" y="2"    width="12" height="3.5" rx="0.5" fill={color} />
        <rect x="2" y="6.25" width="12" height="3.5" rx="0.5" fill={color} />
        <rect x="2" y="10.5" width="12" height="3.5" rx="0.5" fill={color} />
      </svg>
    )
  }
  // default
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="2.5"  width="12" height="3" rx="0.5" fill={color} />
      <rect x="2" y="6.5"  width="12" height="3" rx="0.5" fill={color} />
      <rect x="2" y="10.5" width="12" height="3" rx="0.5" fill={color} />
    </svg>
  )
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

function Checkbox({ checked, indeterminate, onChange, C }) {
  const bg = (checked || indeterminate) ? C.brand : '#ffffff'
  const border = (checked || indeterminate) ? C.brand : '#c4cdd5'
  return (
    <div
      onClick={onChange}
      style={{
        width: 14,
        height: 14,
        borderRadius: 3,
        border: `1.5px solid ${border}`,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background .12s, border-color .12s',
      }}
    >
      {checked && !indeterminate && <CheckIcon color="#ffffff" size={8} />}
      {indeterminate && (
        <div style={{ width: 8, height: 1.5, background: '#ffffff', borderRadius: 1 }} />
      )}
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
// FIX: borderRadius: 4 (rectangle) to match Figma, not pill (100)

function StatusBadge({ status, brand }) {
  const cfg = {
    Active:   { bg: '#dbf6e1', color: '#02bf2b' },
    Inactive: { bg: '#f4f6f8', color: '#637381' },
    Pending:  { bg: '#fff7ed', color: '#c2410c' },
    Cancel:   { bg: '#ffe3d7', color: '#f6643f' },
  }[status] || { bg: '#f4f6f8', color: '#637381' }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 400,
      fontFamily: 'Poppins, sans-serif',
      background: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

// ─── Toolbar (redesigned) ─────────────────────────────────────────────────────
// Search left · Density toggle · Filter with badge · Add button

function Toolbar({ C, showFilter, filterCount, onToggleFilter, density, onDensityChange, searchQuery, onSearch }) {
  // ── Normal mode (always visible) ───────────────────────────────────────────
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: C.toolbarBg,
      paddingTop: C.toolbarPy,
      paddingBottom: C.toolbarPy,
      paddingLeft: C.toolbarPx,
      paddingRight: C.toolbarPx,
      fontFamily: 'Poppins, sans-serif',
      borderBottom: `1px solid ${C.rowDivider}`,
    }}>

      {/* Search input */}
      <div style={{ position: 'relative', flex: '0 0 200px' }}>
        <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
          <SearchIcon color="#919eab" size={13} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search…"
          style={{
            boxSizing: 'border-box',
            width: '100%',
            height: 32,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 28,
            paddingRight: 8,
            border: `1px solid ${C.rowDivider}`,
            borderRadius: 6,
            fontSize: 12,
            fontFamily: 'Poppins, sans-serif',
            color: 'var(--text-primary)',
            background: 'var(--bg-primary)',
            outline: 'none',
          }}
        />
      </div>

      {/* Filters button — adjacent to search */}
      <button
        onClick={onToggleFilter}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          height: 32,
          background: showFilter ? `${C.brand}1a` : 'transparent',
          border: `1px solid ${showFilter ? C.brand + '60' : C.rowDivider}`,
          borderRadius: 6,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 10,
          paddingRight: 10,
          fontSize: 12,
          color: showFilter ? C.brand : C.toolbarText,
          fontFamily: 'Poppins, sans-serif',
          cursor: 'pointer',
          transition: 'background .12s, border-color .12s',
          flexShrink: 0,
        }}
      >
        <FilterIcon color={showFilter ? C.brand : C.toolbarText} size={13} />
        Filters
        {filterCount > 0 && (
          <span style={{
            background: C.brand,
            color: '#ffffff',
            borderRadius: 100,
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1,
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 5,
            paddingRight: 5,
            minWidth: 16,
            textAlign: 'center',
          }}>
            {filterCount}
          </span>
        )}
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Density toggle */}
      <div style={{ display: 'flex', border: `1px solid ${C.rowDivider}`, borderRadius: 6, overflow: 'hidden' }}>
        {['compact', 'default', 'relaxed'].map((d, i) => (
          <button
            key={d}
            onClick={() => onDensityChange(d)}
            title={d.charAt(0).toUpperCase() + d.slice(1) + ' density'}
            style={{
              width: 32,
              height: 32,
              border: 'none',
              borderRight: i < 2 ? `1px solid ${C.rowDivider}` : 'none',
              background: density === d ? `${C.brand}1a` : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background .12s',
            }}
          >
            <DensityIcon type={d} color={density === d ? C.brand : C.toolbarText} size={14} />
          </button>
        ))}
      </div>

      {/* Add button */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          height: 32,
          background: C.brand,
          border: 'none',
          borderRadius: 6,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 12,
          paddingRight: 12,
          fontSize: 12,
          fontWeight: 500,
          color: '#ffffff',
          fontFamily: 'Poppins, sans-serif',
          cursor: 'pointer',
        }}
      >
        <PlusIcon color="#ffffff" size={13} />
        Add
      </button>
    </div>
  )
}

// ─── Bulk action bar (floats above the table header when rows are selected) ───

function BulkBar({ C, selectedCount, onClearSelection }) {
  const [hovClose, setHovClose] = useState(false)
  if (selectedCount === 0) return null

  return (
    <div style={{
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      borderRadius: 12,//'12px 12px 0 0',
      gap: C.bulkGap,
      background: C.bulkBg,
      paddingTop: C.bulkPy,
      paddingBottom: C.bulkPy,
      paddingLeft: C.bulkPx,
      paddingRight: C.bulkPx,
      fontFamily: 'Poppins, sans-serif',
    }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: C.bulkText, flex: 1 }}>
        {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
      </span>
      {['Edit', 'Export'].map(label => (
        <button key={label} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, paddingTop: 4, paddingBottom: 4, paddingLeft: 10, paddingRight: 10, fontSize: 12, color: C.bulkText, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>
          {label}
        </button>
      ))}
      <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, paddingTop: 4, paddingBottom: 4, paddingLeft: 10, paddingRight: 10, fontSize: 12, color: '#f87171', fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>
        Delete
      </button>
      <button
        onMouseEnter={() => setHovClose(true)}
        onMouseLeave={() => setHovClose(false)}
        onClick={onClearSelection}
        style={{ background: hovClose ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <CloseIcon color={C.bulkText} size={14} />
      </button>
    </div>
  )
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

function FilterBar({ C, visible, filters, onRemoveFilter }) {
  if (!visible) return null
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: C.filterGap,
      background: C.filterBg,
      paddingTop: C.filterPy,
      paddingBottom: C.filterPy,
      paddingLeft: C.filterPx,
      paddingRight: C.filterPx,
      borderBottom: `1px solid ${C.rowDivider}`,
      fontFamily: 'Poppins, sans-serif',
    }}>
      <span style={{ fontSize: 12, color: C.filterText, fontWeight: 500, marginRight: 4 }}>Filters:</span>
      {filters.map(f => (
        <div key={f} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: `${C.brand}14`,
          border: `1px solid ${C.brand}30`,
          borderRadius: 100,
          paddingTop: 2, paddingBottom: 2, paddingLeft: 9, paddingRight: 6,
          fontSize: 11, color: C.brand, fontFamily: 'Poppins, sans-serif',
        }}>
          {f}
          <button onClick={() => onRemoveFilter(f)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}>
            <CloseIcon color={C.brand} size={11} />
          </button>
        </div>
      ))}
      {filters.length > 0 && (
        <button onClick={() => filters.forEach(f => onRemoveFilter(f))} style={{ background: 'transparent', border: 'none', fontSize: 11, color: C.brand, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Poppins, sans-serif', paddingTop: 0, paddingBottom: 0, paddingLeft: 4, paddingRight: 0 }}>
          Clear all
        </button>
      )}
      {filters.length === 0 && (
        <span style={{ fontSize: 12, color: C.filterText, fontStyle: 'italic' }}>No active filters</span>
      )}
    </div>
  )
}

// ─── Table head ───────────────────────────────────────────────────────────────

function TableHead({ C, cols, variant, sortCol, sortDir, onSort, selectionMode, allSelected, someSelected, onSelectAll }) {
  const bgMap    = { default: C.headerBgDefault,   contrasted: C.headerBgContrasted,    ghost: C.headerBgGhost }
  const textMap  = { default: C.headerTextDefault,  contrasted: C.headerTextContrasted,  ghost: C.headerTextDefault }
  const sortMap  = { default: C.headerSortDefault,  contrasted: C.headerSortContrasted,  ghost: C.headerSortDefault }

  const bg          = bgMap[variant]  || C.headerBgDefault
  const text        = textMap[variant] || C.headerTextDefault
  const sortDefault = sortMap[variant] || C.headerSortDefault

  return (
    <thead>
      <tr style={{ background: bg }}>
        {selectionMode === 'multi' && (
          <th style={{
            width: 40,
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: C.headerPx + 4,
            paddingRight: C.headerPx,
            textAlign: 'center',
            borderBottom: `1px solid ${C.rowDivider}`,
          }}>
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={onSelectAll}
              C={C}
            />
          </th>
        )}
        {cols.map(col => {
          const isActive = sortCol === col.key
          const sortColor = isActive ? C.headerSortActive : sortDefault
          const dir = isActive ? sortDir : 'neutral'
          return (
            <th
              key={col.key}
              style={{
                width: col.width,
                paddingTop: C.headerPy,
                paddingBottom: C.headerPy,
                paddingLeft: C.headerPx,
                paddingRight: C.headerPx,
                textAlign: 'left',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'Poppins, sans-serif',
                color: text,
                borderBottom: `1px solid ${C.rowDivider}`,
                whiteSpace: 'nowrap',
                cursor: col.sortable ? 'pointer' : 'default',
                userSelect: 'none',
              }}
              onClick={() => col.sortable && onSort(col.key)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {col.label}
                {col.sortable && <SortIcon dir={dir} color={sortColor} size={11} />}
              </div>
            </th>
          )
        })}
        <th style={{
          width: '12%',
          paddingTop: C.headerPy,
          paddingBottom: C.headerPy,
          paddingLeft: C.headerPx,
          paddingRight: C.headerPx,
          fontSize: 12,
          fontWeight: 500,
          fontFamily: 'Poppins, sans-serif',
          color: text,
          borderBottom: `1px solid ${C.rowDivider}`,
          textAlign: 'right',
        }}>
          Actions
        </th>
      </tr>
    </thead>
  )
}

// ─── Action cell (hover-revealed, 2 primary + overflow ⋯) ────────────────────

function ActionCell({ C, hovered }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const primary  = [
    { label: 'Edit',   color: C.brand },
    { label: 'View',   color: C.rowText },
  ]
  const overflow = [
    { label: 'Delete', color: '#ef4444' },
    { label: 'Export', color: C.rowText },
  ]

  const show = hovered || menuOpen

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, opacity: show ? 1 : 0, transition: 'opacity .12s' }}>
        {primary.map(a => (
          <button
            key={a.label}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 500,
              color: a.color,
              fontFamily: 'Poppins, sans-serif',
              paddingTop: 3,
              paddingBottom: 3,
              paddingLeft: 6,
              paddingRight: 6,
              borderRadius: 4,
            }}
          >
            {a.label}
          </button>
        ))}

        {/* ⋯ overflow button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
            style={{
              width: 26,
              height: 26,
              border: `1px solid ${menuOpen ? C.brand + '50' : 'transparent'}`,
              borderRadius: 4,
              background: menuOpen ? `${C.brand}14` : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background .12s',
            }}
          >
            <DotsIcon color={menuOpen ? C.brand : C.rowText} size={13} />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              background: '#ffffff',
              border: `1px solid ${C.rowDivider}`,
              borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,.12)',
              zIndex: 200,
              minWidth: 120,
              paddingTop: 4,
              paddingBottom: 4,
            }}>
              {overflow.map(a => (
                <button
                  key={a.label}
                  onClick={e => { e.stopPropagation(); setMenuOpen(false) }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    paddingTop: 7,
                    paddingBottom: 7,
                    paddingLeft: 12,
                    paddingRight: 12,
                    fontSize: 12,
                    fontWeight: 500,
                    color: a.color,
                    fontFamily: 'Poppins, sans-serif',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.rowBgHover }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Table row ────────────────────────────────────────────────────────────────
// FIX: borderLeft applied to first <td> (not <tr>) — collapsed tables ignore tr borders

function TableRow({ C, row, cols, density, selected, hovered, selectionMode, onSelect, onHover }) {
  const h = { default: C.rowHeightDef, compact: C.rowHeightCmp, relaxed: C.rowHeightRlx }[density] || C.rowHeightDef
  const bg = selected ? C.rowBgSelected : (hovered ? C.rowBgHover : C.rowBgDefault)

  return (
    <tr
      style={{ background: bg, height: h, transition: 'background .12s', cursor: selectionMode === 'single' ? 'pointer' : 'default'}}
      onMouseEnter={() => onHover(row.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => selectionMode === 'single' && onSelect(row.id)}
    >
      {selectionMode === 'multi' && (
        // Checkbox cell — carries the left accent via inset box-shadow (no border-left leak)
        <td style={{
          width: 40,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: C.rowPx + 4,
          paddingRight: C.rowPx,
          borderBottom: `1px solid ${C.rowDivider}`,
          boxShadow: selected ? `inset 3px 0 0 ${C.rowSelStroke}` : 'none',
          textAlign: 'center',
          verticalAlign: 'middle',
        }}>
          <Checkbox checked={selected} indeterminate={false} onChange={() => onSelect(row.id)} C={C} />
        </td>
      )}

      {cols.map((col, idx) => {
        // In non-multi mode the first data cell carries the left accent border
        const isFirst = selectionMode !== 'multi' && idx === 0
        return (
          <td
            key={col.key}
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: C.rowPx,
              paddingRight: C.rowPx,
              fontSize: 12,
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              color: C.rowText,
              borderBottom: `1px solid ${C.rowDivider}`,
              boxShadow: isFirst && selected ? `inset 3px 0 0 ${C.rowSelStroke}` : 'none',
              verticalAlign: 'middle',
              whiteSpace: 'nowrap',
            }}
          >
            {col.key === 'status'
              ? <StatusBadge status={row[col.key]} brand={C.brand} />
              : row[col.key]
            }
          </td>
        )
      })}

      {/* Actions cell */}
      <td style={{
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: C.rowPx,
        paddingRight: C.rowPx,
        borderBottom: `1px solid ${C.rowDivider}`,
        verticalAlign: 'middle',
      }}>
        <ActionCell C={C} hovered={hovered} />
      </td>
    </tr>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
// Both styles share the exact same visual design (colors match the header variant).
// paginationStyle only controls structure:
//   'attached'  → rendered inside the table container, flush against the last row
//   'detached'  → rendered outside the table container, with a gap + border-radius

function Pagination({ C, variant = 'contrasted', page, total, perPage, onPage, onPerPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to   = Math.min(page * perPage, total)

  // Colors always follow the active header variant
  const bg       = { default: C.headerBgDefault, contrasted: C.headerBgContrasted, ghost: C.headerBgGhost }[variant] ?? C.headerBgDefault
  const textColor= { default: C.headerTextDefault, contrasted: C.headerTextContrasted, ghost: C.headerTextDefault }[variant] ?? C.headerTextDefault
  // For dark headers, use semi-transparent white borders; for light, use the row divider
  const isDark   = variant === 'contrasted'
  const btnBorder= isDark ? '1px solid rgba(255,255,255,0.3)' : `1px solid ${C.rowDivider}`

  const getPageNums = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const s = new Set([1, totalPages, page])
    if (page > 1)          s.add(page - 1)
    if (page < totalPages) s.add(page + 1)
    return [...s].sort((a, b) => a - b)
  }
  const pageNums = getPageNums()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 16,
      paddingRight: 16,
      background: bg,
      fontFamily: 'Poppins, sans-serif',
    }}>
      {/* Left: result count */}
      <span style={{ fontSize: 13, color: textColor, whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif' }}>
        Showing {from}–{to} of {total} results
      </span>

      {/* Right: page nav + per-page */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Page navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => onPage(page - 1)}
            disabled={page === 1}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: btnBorder,
              background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.35 : 1,
            }}
          >
            <ChevronIcon dir="left" color={textColor} size={13} />
          </button>

          {pageNums.map((p, idx) => {
            const prev = pageNums[idx - 1]
            const showEllipsis = prev && p - prev > 1
            return (
              <React.Fragment key={p}>
                {showEllipsis && (
                  <span style={{ fontSize: 13, color: textColor, opacity: 0.5, paddingLeft: 2, paddingRight: 2, userSelect: 'none' }}>…</span>
                )}
                <button
                  onClick={() => onPage(p)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: p === page ? 'none' : btnBorder,
                    background: p === page ? C.brand : 'transparent',
                    color: p === page ? '#ffffff' : textColor,
                    fontSize: 13,
                    fontFamily: 'Poppins, sans-serif',
                    cursor: 'pointer',
                    fontWeight: p === page ? 600 : 400,
                  }}
                >
                  {p}
                </button>
              </React.Fragment>
            )
          })}

          <button
            onClick={() => onPage(page + 1)}
            disabled={page === totalPages}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: btnBorder,
              background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.35 : 1,
            }}
          >
            <ChevronIcon dir="right" color={textColor} size={13} />
          </button>
        </div>

        {/* Per-page selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            value={perPage}
            onChange={e => { onPerPageChange(+e.target.value); onPage(1) }}
            style={{
              height: 32,
              paddingTop: 3, paddingBottom: 3, paddingLeft: 10, paddingRight: 6,
              fontSize: 13,
              fontFamily: 'Poppins, sans-serif',
              border: btnBorder,
              borderRadius: 8,
              background: isDark ? 'rgba(255,255,255,0.12)' : 'var(--bg-primary)',
              color: textColor,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span style={{ fontSize: 13, color: textColor, whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif' }}>
            per page
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
// FIX: two buttons — primary "Add" + secondary "Clear filters"

function EmptyState({ C }) {
  return (
    <tr>
      <td colSpan={99} style={{ paddingTop: 56, paddingBottom: 56, textAlign: 'center', borderBottom: `1px solid ${C.rowDivider}` }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <svg width={44} height={44} viewBox="0 0 44 44" fill="none">
            <rect x="7" y="11" width="30" height="24" rx="3" stroke={C.headerSortDefault} strokeWidth="1.5" />
            <path d="M7 18h30" stroke={C.headerSortDefault} strokeWidth="1.5" />
            <path d="M14 26h16M14 31h9" stroke={C.headerSortDefault} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}>
            No results found
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif', maxWidth: 260, lineHeight: 1.65 }}>
            No records match your current filters. Adjust the filters or add a new entry.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {/* Primary action */}
            <button style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: C.brand,
              border: 'none',
              borderRadius: 6,
              paddingTop: 7, paddingBottom: 7, paddingLeft: 14, paddingRight: 14,
              fontSize: 12, fontWeight: 500,
              color: '#ffffff',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer',
            }}>
              <PlusIcon color="#fff" size={12} />
              Add
            </button>
            {/* Secondary action */}
            <button style={{
              background: 'transparent',
              border: `1px solid ${C.rowDivider}`,
              borderRadius: 6,
              paddingTop: 7, paddingBottom: 7, paddingLeft: 14, paddingRight: 14,
              fontSize: 12, fontWeight: 500,
              color: C.toolbarText,
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer',
            }}>
              Clear filters
            </button>
          </div>
        </div>
      </td>
    </tr>
  )
}

// ─── Live table ───────────────────────────────────────────────────────────────

function LiveTable({ C, variant, density, onDensityChange = () => {}, selectionMode, showPagination, emptyState, paginationStyle = 'detached' }) {
  const [sortCol,      setSortCol]   = useState('name')
  const [sortDir,      setSortDir]   = useState('asc')
  const [selectedRows, setSelected]  = useState(new Set())
  const [hoveredRow,   setHovered]   = useState(null)
  const [showFilter,   setShowFilter]= useState(false)
  const [activeFilters,setFilters]   = useState(['Engineering', 'Active'])
  const [page,         setPage]      = useState(1)
  const [perPage,      setPerPage]   = useState(5)
  const [search,       setSearch]    = useState('')

  const handleSort = (key) => {
    if (sortCol === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(key); setSortDir('asc') }
  }

  const handleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (selectionMode === 'single') {
        next.clear()
        if (!prev.has(id)) next.add(id)
      } else {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedRows.size === SAMPLE_ROWS.length) setSelected(new Set())
    else setSelected(new Set(SAMPLE_ROWS.map(r => r.id)))
  }

  // Search filter
  const filtered = search.trim()
    ? SAMPLE_ROWS.filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
      )
    : SAMPLE_ROWS

  const sorted = [...filtered].sort((a, b) => {
    const va = a[sortCol] || ''
    const vb = b[sortCol] || ''
    const cmp = va < vb ? -1 : va > vb ? 1 : 0
    return sortDir === 'asc' ? cmp : -cmp
  })

  const displayRows  = emptyState ? [] : sorted
  const pagedRows    = showPagination ? displayRows.slice((page - 1) * perPage, page * perPage) : displayRows
  const allSelected  = selectedRows.size === SAMPLE_ROWS.length
  const someSelected = selectedRows.size > 0 && !allSelected

  return (
    <div style={{
      borderRadius: 8,
      border: `1px solid ${C.rowDivider}`,
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,.06)',
    }}>
      <Toolbar
        C={C}
        showFilter={showFilter}
        filterCount={activeFilters.length}
        onToggleFilter={() => setShowFilter(f => !f)}
        density={density}
        onDensityChange={onDensityChange}
        searchQuery={search}
        onSearch={q => { setSearch(q); setPage(1) }}
      />
      <FilterBar
        C={C}
        visible={showFilter}
        filters={activeFilters}
        onRemoveFilter={f => setFilters(prev => prev.filter(x => x !== f))}
      />
      {/* 12px inset keeps table aligned with the search bar */}
      <div style={{ padding: 12 }}>
        {/* Bulk bar: sibling of inner clip, gets rounded top corners on its own */}
        <BulkBar
          C={C}
          selectedCount={selectedRows.size}
          onClearSelection={() => setSelected(new Set())}
        />
        {/* Inner clip: always rounds all corners; BulkBar above it covers the top corners when visible */}
        <div style={{ overflow: 'hidden', borderRadius: 12}}>
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins, sans-serif' }}>
            <TableHead
              C={C}
              cols={COLS}
              variant={variant}
              sortCol={sortCol}
              sortDir={sortDir}
              onSort={handleSort}
              selectionMode={selectionMode}
              allSelected={allSelected}
              someSelected={someSelected}
              onSelectAll={handleSelectAll}
            />
            <tbody>
              {pagedRows.length === 0
                ? <EmptyState C={C} />
                : pagedRows.map(row => (
                    <TableRow
                      key={row.id}
                      C={C}
                      row={row}
                      cols={COLS}
                      density={density}
                      selected={selectedRows.has(row.id)}
                      hovered={hoveredRow === row.id}
                      selectionMode={selectionMode}
                      onSelect={handleSelect}
                      onHover={setHovered}
                    />
                  ))
              }
            </tbody>
          </table>
          </div>

          {/* ATTACHED: fused to table bottom, clipped + rounded by the inner wrapper */}
          {showPagination && !emptyState && paginationStyle === 'attached' && (
            <Pagination
              C={C}
              variant={variant}
              page={page}
              total={displayRows.length}
              perPage={perPage}
              onPage={setPage}
              onPerPageChange={n => { setPerPage(n); setPage(1) }}
            />
          )}
        </div>{/* end inner clip */}

        {/* DETACHED: separate block below, same 12px inset, own border-radius */}
        {showPagination && !emptyState && paginationStyle === 'detached' && (
          <div style={{ marginTop: 8, borderRadius: 12, overflow: 'hidden' }}>
            <Pagination
              C={C}
              variant={variant}
              page={page}
              total={displayRows.length}
              perPage={perPage}
              onPage={setPage}
              onPerPageChange={n => { setPerPage(n); setPage(1) }}
            />
          </div>
        )}
      </div>{/* end 12px padding wrapper */}
    </div>
  )
}

// ─── Static mini table (for variant/density previews) ────────────────────────
// FIX: borderLeft on first <td>, not <tr>

function MiniTable({ C, variant, density, rows = SAMPLE_ROWS.slice(0, 2), showCheckbox = false, title = null }) {
  const bgMap  = { default: C.headerBgDefault,  contrasted: C.headerBgContrasted, ghost: C.headerBgGhost }
  const textMap= { default: C.headerTextDefault, contrasted: C.headerTextContrasted, ghost: C.headerTextDefault }
  const sortMap= { default: C.headerSortDefault, contrasted: C.headerSortContrasted, ghost: C.headerSortDefault }

  const hBg   = bgMap[variant]   || C.headerBgDefault
  const hText = textMap[variant] || C.headerTextDefault
  const hSort = sortMap[variant] || C.headerSortDefault
  const h     = { default: C.rowHeightDef, compact: C.rowHeightCmp, relaxed: C.rowHeightRlx }[density] || C.rowHeightDef

  const miniCols = [
    { key: 'name',   label: 'Name',   sortable: true  },
    { key: 'role',   label: 'Role',   sortable: true  },
    { key: 'status', label: 'Status', sortable: false },
  ]

  return (
    <div>
      {title && <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{title}</div>}
      <div style={{ borderRadius: 8, border: `1px solid ${C.rowDivider}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins, sans-serif' }}>
          <thead>
            <tr style={{ background: hBg }}>
              {showCheckbox && (
                <th style={{ width: 36, paddingTop: 7, paddingBottom: 7, paddingLeft: 12, paddingRight: 8, borderBottom: `1px solid ${C.rowDivider}` }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, border: '1.5px solid #c4cdd5', background: '#fff' }} />
                </th>
              )}
              {miniCols.map(col => (
                <th key={col.key} style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 10, paddingRight: 10, textAlign: 'left', fontSize: 11, fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: hText, borderBottom: `1px solid ${C.rowDivider}`, whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.sortable && <SortIcon dir="neutral" color={hSort} size={10} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isSel = idx === 0 && showCheckbox
              return (
                <tr key={row.id} style={{ background: isSel ? C.rowBgSelected : C.rowBgDefault, height: h }}>
                  {showCheckbox && (
                    // Checkbox cell carries left border
                    <td style={{
                      paddingTop: 0, paddingBottom: 0,
                      paddingLeft: isSel ? (12 - 3) : 12,
                      paddingRight: 8,
                      borderBottom: `1px solid ${C.rowDivider}`,
                      borderLeft: isSel ? `3px solid ${C.rowSelStroke}` : '3px solid transparent',
                      verticalAlign: 'middle',
                    }}>
                      <div style={{ width: 12, height: 12, borderRadius: 2, border: `1.5px solid ${isSel ? C.brand : '#c4cdd5'}`, background: isSel ? C.brand : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSel && <CheckIcon color="#fff" size={7} />}
                      </div>
                    </td>
                  )}
                  {miniCols.map((col, colIdx) => {
                    const isFirstData = !showCheckbox && colIdx === 0
                    return (
                      <td key={col.key} style={{
                        paddingTop: 0, paddingBottom: 0,
                        paddingLeft: isFirstData ? (isSel ? 10 - 3 : 10) : 10,
                        paddingRight: 10,
                        fontSize: 11,
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        color: C.rowText,
                        borderBottom: `1px solid ${C.rowDivider}`,
                        borderLeft: isFirstData ? (isSel ? `3px solid ${C.rowSelStroke}` : '3px solid transparent') : 'none',
                        verticalAlign: 'middle',
                        whiteSpace: 'nowrap',
                      }}>
                        {col.key === 'status' ? <StatusBadge status={row[col.key]} brand={C.brand} /> : row[col.key]}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Anatomy diagram ──────────────────────────────────────────────────────────

function AnatomyCallout({ n, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{n}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  )
}

function AnatomyDiagram({ C }) {
  const badge = (n) => (
    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</span>
  )

  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Diagram */}
      <div style={{ flex: '1 1 360px', minWidth: 320 }}>
        <div style={{ borderRadius: 8, border: `1px solid ${C.rowDivider}`, overflow: 'visible', boxShadow: '0 1px 3px rgba(0,0,0,.06)', position: 'relative' }}>

          {/* ① Toolbar */}
          <div style={{ position: 'relative', background: C.toolbarBg, paddingTop: C.toolbarPy, paddingBottom: C.toolbarPy, paddingLeft: C.toolbarPx, paddingRight: C.toolbarPx, display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${C.rowDivider}` }}>
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--bg-primary)', border: `1px solid ${C.rowDivider}`, borderRadius: 5, paddingTop: 4, paddingBottom: 4, paddingLeft: 7, paddingRight: 24, flex: '0 0 auto' }}>
              <SearchIcon color="#919eab" size={11} />
              <span style={{ fontSize: 10, color: '#919eab', fontFamily: 'Poppins, sans-serif' }}>Search…</span>
            </div>
            <div style={{ flex: 1 }} />
            {/* Density */}
            <div style={{ display: 'flex', border: `1px solid ${C.rowDivider}`, borderRadius: 4, overflow: 'hidden' }}>
              {['compact','default','relaxed'].map((d, i) => (
                <div key={d} style={{ width: 22, height: 22, background: d === 'default' ? `${C.brand}18` : 'transparent', borderRight: i < 2 ? `1px solid ${C.rowDivider}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DensityIcon type={d} color={d === 'default' ? C.brand : C.toolbarText} size={12} />
                </div>
              ))}
            </div>
            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${C.brand}18`, border: `1px solid ${C.brand}40`, borderRadius: 5, paddingTop: 4, paddingBottom: 4, paddingLeft: 7, paddingRight: 7 }}>
              <FilterIcon color={C.brand} size={11} />
              <span style={{ fontSize: 10, color: C.brand, fontFamily: 'Poppins, sans-serif' }}>Filters</span>
              <span style={{ background: C.brand, color: '#fff', borderRadius: 100, fontSize: 9, fontWeight: 700, paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1 }}>2</span>
            </div>
            {/* Add */}
            <div style={{ background: C.brand, borderRadius: 5, paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <PlusIcon color="#fff" size={11} />
              <span style={{ fontSize: 10, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>Add</span>
            </div>
            <div style={{ position: 'absolute', top: -10, right: -10 }}>{badge(1)}</div>
          </div>

          {/* ② Filter bar */}
          <div style={{ position: 'relative', background: C.filterBg, paddingTop: 7, paddingBottom: 7, paddingLeft: C.filterPx, paddingRight: C.filterPx, display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${C.rowDivider}` }}>
            <span style={{ fontSize: 11, color: C.filterText, fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>Filters:</span>
            {['Engineering', 'Active'].map(f => (
              <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${C.brand}14`, border: `1px solid ${C.brand}30`, borderRadius: 100, paddingTop: 2, paddingBottom: 2, paddingLeft: 7, paddingRight: 5, fontSize: 10, color: C.brand, fontFamily: 'Poppins, sans-serif' }}>
                {f} <CloseIcon color={C.brand} size={9} />
              </span>
            ))}
            <div style={{ position: 'absolute', top: -10, right: -10 }}>{badge(2)}</div>
          </div>

          {/* ③ Header row */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: C.headerBgDefault, display: 'grid', gridTemplateColumns: '1fr 1fr 80px', borderBottom: `1px solid ${C.rowDivider}` }}>
              {['Name', 'Role', 'Status'].map(label => (
                <div key={label} style={{ paddingTop: C.headerPy, paddingBottom: C.headerPy, paddingLeft: C.headerPx, paddingRight: C.headerPx, fontSize: 11, fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: C.headerTextDefault, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {label} {label !== 'Status' && <SortIcon dir="neutral" color={C.headerSortDefault} size={10} />}
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', top: -10, right: -10 }}>{badge(3)}</div>
          </div>

          {/* ④⑤ Data rows */}
          {SAMPLE_ROWS.slice(0, 3).map((row, idx) => {
            const isSel = idx === 1
            return (
              <div key={row.id} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 80px', background: isSel ? C.rowBgSelected : (idx === 2 ? C.rowBgHover : C.rowBgDefault), height: C.rowHeightDef, borderBottom: `1px solid ${C.rowDivider}` }}>
                {['name', 'role', 'status'].map((key, ki) => (
                  <div key={key} style={{
                    paddingTop: 0, paddingBottom: 0,
                    paddingLeft: ki === 0 ? (isSel ? C.rowPx - 3 : C.rowPx) : C.rowPx,
                    paddingRight: C.rowPx,
                    fontSize: 11, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.rowText,
                    display: 'flex', alignItems: 'center',
                    borderLeft: ki === 0 ? (isSel ? `3px solid ${C.rowSelStroke}` : '3px solid transparent') : 'none',
                  }}>
                    {key === 'status' ? <StatusBadge status={row[key]} brand={C.brand} /> : row[key]}
                  </div>
                ))}
                {idx === 1 && <div style={{ position: 'absolute', top: -10, right: -10 }}>{badge(4)}</div>}
                {idx === 2 && <div style={{ position: 'absolute', top: -10, right: -10 }}>{badge(5)}</div>}
              </div>
            )
          })}

          {/* ⑥ Pagination footer */}
          <div style={{ position: 'relative', background: C.toolbarBg, paddingTop: 9, paddingBottom: 9, paddingLeft: C.headerPx + 4, paddingRight: C.headerPx + 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.rowDivider}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 10, color: C.toolbarText, fontFamily: 'Poppins, sans-serif' }}>Rows per page:</span>
              <div style={{ fontSize: 10, color: C.rowText, border: `1px solid ${C.rowDivider}`, borderRadius: 4, paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5, fontFamily: 'Poppins, sans-serif' }}>5</div>
            </div>
            <span style={{ fontSize: 10, color: C.toolbarText, fontFamily: 'Poppins, sans-serif' }}>1–5 of 24</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {[1, 2, 3].map(p => (
                <div key={p} style={{ width: 20, height: 20, borderRadius: 4, border: `1px solid ${p === 1 ? C.brand : C.rowDivider}`, background: p === 1 ? C.brand : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: p === 1 ? '#fff' : C.toolbarText, fontFamily: 'Poppins, sans-serif', fontWeight: p === 1 ? 600 : 400 }}>{p}</div>
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: -10, right: -10 }}>{badge(6)}</div>
          </div>
        </div>
      </div>

      {/* Callouts */}
      <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AnatomyCallout n={1} title="Toolbar" desc="Search input on the left, then density toggle, filter button with active count badge, and primary Add button on the right. Switches to bulk action bar when rows are selected." />
        <AnatomyCallout n={2} title="Filter bar" desc="Appears below the toolbar when toggled. Shows removable filter tags and a 'Clear all' link. The filter button badge reflects the active filter count." />
        <AnatomyCallout n={3} title="Header row" desc="Sortable column headers with sort direction icons. Supports three visual variants: default, contrasted, and ghost." />
        <AnatomyCallout n={4} title="Selected row" desc="Brand-subtle background with a 3px left border in brand color on the first cell. Checkbox is checked in multi-select mode." />
        <AnatomyCallout n={5} title="Hover row" desc="Subtle background tint on mouse-over. Row actions (Edit, View + overflow ⋯) fade in on hover." />
        <AnatomyCallout n={6} title="Pagination footer" desc="Per-page selector on the left, result range in the centre, page navigation on the right. Uses ellipsis (…) for large page counts." />
      </div>
    </div>
  )
}

// ─── Token reference ──────────────────────────────────────────────────────────

const TOKEN_ROWS = [
  ['table.header.bg.default',          'Header background — default'],
  ['table.header.bg.contrasted',       'Header background — high contrast'],
  ['table.header.bg.ghost',            'Header background — ghost'],
  ['table.header.text.default',        'Header text — default'],
  ['table.header.text.contrasted',     'Header text — high contrast'],
  ['table.header.icon-sort.default',   'Sort icon — idle'],
  ['table.header.icon-sort.contrasted','Sort icon — high contrast'],
  ['table.header.icon-sort.active',    'Sort icon — active column'],
  ['table.header.font-size',           'Header font size'],
  ['table.header.font-weight',         'Header font weight'],
  ['table.header.padding-x',           'Header horizontal padding'],
  ['table.header.padding-y',           'Header vertical padding'],
  ['table.row.bg.default',             'Row background'],
  ['table.row.bg.hover',               'Row background — hover'],
  ['table.row.bg.selected',            'Row background — selected'],
  ['table.row.font-color',             'Row text colour'],
  ['table.row.divider',                'Row bottom border'],
  ['table.row.selected-stroke',        'Selected row left accent'],
  ['table.row.font-size',              'Row font size'],
  ['table.row.font-weight',            'Row font weight'],
  ['table.row.padding-x',              'Row horizontal padding'],
  ['table.row.height.default',         'Row height — default'],
  ['table.row.height.compact',         'Row height — compact'],
  ['table.row.height.relaxed',         'Row height — relaxed'],
  ['table.bulk.bg',                    'Bulk action bar background'],
  ['table.bulk.text',                  'Bulk action bar text'],
  ['table.bulk.close-icon',            'Bulk action bar close icon'],
  ['table.bulk.padding-x',             'Bulk bar horizontal padding'],
  ['table.bulk.padding-y',             'Bulk bar vertical padding'],
  ['table.bulk.gap',                   'Bulk bar gap between elements'],
  ['table.toolbar.bg',                 'Toolbar background'],
  ['table.toolbar.text',               'Toolbar text'],
  ['table.toolbar.padding-x',          'Toolbar horizontal padding'],
  ['table.toolbar.padding-y',          'Toolbar vertical padding'],
  ['table.toolbar.gap',                'Toolbar gap'],
  ['table.filterbar.bg',               'Filter bar background'],
  ['table.filterbar.text',             'Filter bar text'],
  ['table.filterbar.padding-x',        'Filter bar horizontal padding'],
  ['table.filterbar.padding-y',        'Filter bar vertical padding'],
  ['table.filterbar.gap',              'Filter bar gap'],
]

// ─── Main page ────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'demo',          label: 'Interactive demo' },
  { id: 'anatomy',       label: 'Anatomy' },
  { id: 'variants',      label: 'Variants' },
  { id: 'density',       label: 'Density' },
  { id: 'selection',     label: 'Selection' },
  { id: 'sorting',       label: 'Sorting' },
  { id: 'empty-state',   label: 'Empty state' },
  { id: 'pagination',    label: 'Pagination' },
  { id: 'behaviour',     label: 'Behaviour' },
  { id: 'usage',         label: 'Usage guidelines' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'tokens',        label: 'Token reference' },
]

export default function TablePage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [activeSection, setActiveSection] = useState('demo')
  const t = VISIBLE_THEMES.find(x => x.id === activeTheme) || VISIBLE_THEMES[0]
  const tokens = getComponentTokens(t.id)
  const C = getColors(tokens)

  // Interactive demo controls
  const [demoVariant,         setDemoVariant]         = useState('contrasted')
  const [demoDensity,         setDemoDensity]         = useState('default')
  const [demoSelection,       setDemoSelection]       = useState('multi')
  const [demoPagination,      setDemoPagination]      = useState(true)
  const [demoEmpty,           setDemoEmpty]           = useState(false)
  const [demoPaginationStyle, setDemoPaginationStyle] = useState('attached')

  const btnBase = (active) => ({
    paddingTop: 5, paddingBottom: 5, paddingLeft: 11, paddingRight: 11,
    borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer',
    border: `1px solid ${active ? C.brand : 'var(--stroke-primary)'}`,
    background: active ? C.brand : 'var(--bg-primary)',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontFamily: 'Poppins, sans-serif',
  })

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
      <div style={{ flex: 1, minWidth: 0, paddingTop: 40, paddingBottom: 96, paddingLeft: 56, paddingRight: 56, fontFamily: 'Poppins, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Layout & Data</span>
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: 0, marginBottom: 8, fontFamily: 'Poppins, sans-serif' }}>Table</h1>
      <Lead>
        The Table component is a full-featured data grid for displaying, sorting, filtering, and selecting rows of structured data. It supports three header variants, three density modes, single/multi-row selection with a bulk action bar, row-level action overflow menus, and a toolbar with integrated search and density controls.
      </Lead>

      {/* ── Interactive demo ─────────────────────────────────────────────── */}
      <SectionAnchor id="demo" />
      <H2>Interactive demo</H2>
      <P>Use the density toggle inside the toolbar to switch between compact, default, and relaxed row heights. The toolbar density toggle and these controls stay in sync.</P>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Header variant</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['default', 'contrasted', 'ghost'].map(v => (
              <button key={v} onClick={() => setDemoVariant(v)} style={btnBase(demoVariant === v)}>{v}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Density</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['compact', 'default', 'relaxed'].map(v => (
              <button key={v} onClick={() => setDemoDensity(v)} style={btnBase(demoDensity === v)}>{v}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Selection</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['none', 'single', 'multi'].map(v => (
              <button key={v} onClick={() => setDemoSelection(v)} style={btnBase(demoSelection === v)}>{v}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Options</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setDemoPagination(v => !v)} style={btnBase(demoPagination)}>Pagination</button>
            <button onClick={() => setDemoEmpty(v => !v)} style={btnBase(demoEmpty)}>Empty state</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Pagination style</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['attached', 'detached'].map(v => (
              <button key={v} onClick={() => setDemoPaginationStyle(v)} style={btnBase(demoPaginationStyle === v)}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      <LiveTable
        key={`${themeId}-${demoVariant}-${demoSelection}`}
        C={C}
        variant={demoVariant}
        density={demoDensity}
        onDensityChange={setDemoDensity}
        selectionMode={demoSelection}
        showPagination={demoPagination}
        emptyState={demoEmpty}
        paginationStyle={demoPaginationStyle}
      />

      <Divider />

      {/* ── Anatomy ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>
      <P>The table is composed of six stacked regions. Each is independently styled via design tokens.</P>
      <AnatomyDiagram C={C} />

      <Divider />

      {/* ── Variants ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="variants" />
      <H2>Header variants</H2>
      <P>Three background options for the header row. The <strong>default</strong> variant uses a subtle brand tint. <strong>Contrasted</strong> uses the brand strong color with white text — suited for high-emphasis tables. <strong>Ghost</strong> uses a near-white background for a de-emphasized header.</P>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <MiniTable C={C} variant="default"    density="default" title="Default" />
        <MiniTable C={C} variant="contrasted" density="default" title="Contrasted" />
        <MiniTable C={C} variant="ghost"      density="default" title="Ghost" />
      </div>

      <Divider />

      {/* ── Row density ──────────────────────────────────────────────────── */}
      <SectionAnchor id="density" />
      <H2>Row density</H2>
      <P>Row height is controlled by the density toggle in the toolbar or via props. Use <strong>compact</strong> for data-dense dashboards, <strong>default</strong> for standard lists, and <strong>relaxed</strong> when rows contain multi-line content or need extra breathing room.</P>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <MiniTable C={C} variant="default" density="compact"  title={`Compact (${C.rowHeightCmp}px)`} />
        <MiniTable C={C} variant="default" density="default"  title={`Default (${C.rowHeightDef}px)`} />
        <MiniTable C={C} variant="default" density="relaxed"  title={`Relaxed (${C.rowHeightRlx}px)`} />
      </div>

      <Divider />

      {/* ── Selection ────────────────────────────────────────────────────── */}
      <SectionAnchor id="selection" />
      <H2>Selection</H2>
      <P>The table supports three selection modes. In <strong>single</strong> mode, clicking a row selects it (no checkbox). In <strong>multi</strong> mode, checkboxes appear in the first column — selecting any row triggers the bulk action bar in the toolbar.</P>

      <H3>Single selection</H3>
      <div style={{ marginBottom: 20 }}>
        <div style={{ borderRadius: 8, border: `1px solid ${C.rowDivider}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins, sans-serif' }}>
            <thead>
              <tr style={{ background: C.headerBgDefault }}>
                {['Name', 'Role', 'Status'].map(label => (
                  <th key={label} style={{ paddingTop: C.headerPy, paddingBottom: C.headerPy, paddingLeft: C.headerPx, paddingRight: C.headerPx, textAlign: 'left', fontSize: 11, fontWeight: 500, color: C.headerTextDefault, fontFamily: 'Poppins, sans-serif', borderBottom: `1px solid ${C.rowDivider}` }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ROWS.slice(0, 3).map((row, idx) => {
                const isSel = idx === 1
                return (
                  <tr key={row.id} style={{ background: isSel ? C.rowBgSelected : (idx === 0 ? C.rowBgHover : C.rowBgDefault), height: C.rowHeightDef, cursor: 'pointer' }}>
                    {['name', 'role', 'status'].map((key, ki) => (
                      <td key={key} style={{
                        paddingTop: 0, paddingBottom: 0,
                        paddingLeft: ki === 0 ? (isSel ? C.rowPx - 3 : C.rowPx) : C.rowPx,
                        paddingRight: C.rowPx,
                        fontSize: 11,
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        color: C.rowText,
                        borderBottom: `1px solid ${C.rowDivider}`,
                        borderLeft: ki === 0 ? (isSel ? `3px solid ${C.rowSelStroke}` : '3px solid transparent') : 'none',
                        verticalAlign: 'middle',
                      }}>
                        {key === 'status' ? <StatusBadge status={row[key]} brand={C.brand} /> : row[key]}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>Row 2 is in selected state; row 1 is in hover state.</div>
      </div>

      <H3>Multi-select with bulk action bar</H3>
      <div style={{ borderRadius: 8, border: `1px solid ${C.rowDivider}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
        {/* Bulk bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: C.bulkGap, background: C.bulkBg, paddingTop: C.bulkPy, paddingBottom: C.bulkPy, paddingLeft: C.bulkPx, paddingRight: C.bulkPx }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: C.bulkText, flex: 1, fontFamily: 'Poppins, sans-serif' }}>2 items selected</span>
          {['Edit', 'Export'].map(label => (
            <button key={label} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, paddingTop: 4, paddingBottom: 4, paddingLeft: 10, paddingRight: 10, fontSize: 12, color: C.bulkText, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>{label}</button>
          ))}
          <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, paddingTop: 4, paddingBottom: 4, paddingLeft: 10, paddingRight: 10, fontSize: 12, color: '#f87171', fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>Delete</button>
          <button style={{ background: 'transparent', border: 'none', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CloseIcon color={C.bulkText} size={13} />
          </button>
        </div>
        <MiniTable C={C} variant="default" density="default" rows={SAMPLE_ROWS.slice(0, 3)} showCheckbox />
      </div>

      <Divider />

      {/* ── Sorting ──────────────────────────────────────────────────────── */}
      <SectionAnchor id="sorting" />
      <H2>Sorting</H2>
      <P>Clicking a sortable column header cycles through: neutral → ascending → descending. The active sort column displays a filled directional arrow in brand color; all others show a subtle neutral double-arrow.</P>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {(['neutral', 'asc', 'desc']).map((dir, i) => (
          <div key={dir}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{['Neutral', 'Ascending', 'Descending'][i]}</div>
            <div style={{ borderRadius: 8, border: `1px solid ${C.rowDivider}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins, sans-serif' }}>
                <thead>
                  <tr style={{ background: C.headerBgDefault }}>
                    {[{ label: 'Name', active: dir !== 'neutral' }, { label: 'Role', active: false }].map(col => (
                      <th key={col.label} style={{ paddingTop: C.headerPy, paddingBottom: C.headerPy, paddingLeft: C.headerPx, paddingRight: C.headerPx, textAlign: 'left', fontSize: 11, fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: C.headerTextDefault, borderBottom: `1px solid ${C.rowDivider}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {col.label}
                          <SortIcon dir={col.active ? dir : 'neutral'} color={col.active ? C.headerSortActive : C.headerSortDefault} size={10} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_ROWS.slice(0, 2).map(row => (
                    <tr key={row.id} style={{ background: C.rowBgDefault, height: C.rowHeightDef }}>
                      {['name', 'role'].map((key, ki) => (
                        <td key={key} style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: ki === 0 ? C.rowPx : C.rowPx, paddingRight: C.rowPx, fontSize: 11, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.rowText, borderBottom: `1px solid ${C.rowDivider}`, borderLeft: ki === 0 ? '3px solid transparent' : 'none', verticalAlign: 'middle' }}>
                          {row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      <SectionAnchor id="empty-state" />
      <H2>Empty state</H2>
      <P>When there are no rows to display — for example after applying filters with no matches — the table renders a centred empty state with an icon, explanatory text, a primary <strong>Add</strong> button, and a secondary <strong>Clear filters</strong> button.</P>
      <div style={{ borderRadius: 8, border: `1px solid ${C.rowDivider}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins, sans-serif' }}>
          <thead>
            <tr style={{ background: C.headerBgDefault }}>
              {COLS.slice(0, 4).map(col => (
                <th key={col.key} style={{ paddingTop: C.headerPy, paddingBottom: C.headerPy, paddingLeft: C.headerPx, paddingRight: C.headerPx, textAlign: 'left', fontSize: 11, fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: C.headerTextDefault, borderBottom: `1px solid ${C.rowDivider}` }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <EmptyState C={C} />
          </tbody>
        </table>
      </div>

      <Divider />

      {/* ── Pagination variants ───────────────────────────────────────────── */}
      <SectionAnchor id="pagination" />
      <H2>Pagination variants</H2>
      <P>Two pagination styles are available. <strong>Attached</strong> fuses the footer to the table using the contrasted background — a bookend effect that visually closes the table. <strong>Detached</strong> uses a neutral background and is visually separated from the table body.</P>

      <H3>Attached</H3>
      <P>Matches the contrasted header background. Best used when the table uses the contrasted header variant.</P>
      <LiveTable
        key={`${themeId}-attach`}
        C={C}
        variant="contrasted"
        density="default"
        selectionMode="multi"
        showPagination={true}
        emptyState={false}
        paginationStyle="attached"
        onDensityChange={() => {}}
      />

      <H3>Detached</H3>
      <P>Neutral gray footer that reads as a separate control strip. Works with any header variant.</P>
      <LiveTable
        key={`${themeId}-detach`}
        C={C}
        variant="default"
        density="default"
        selectionMode="multi"
        showPagination={true}
        emptyState={false}
        paginationStyle="detached"
        onDensityChange={() => {}}
      />

      <Divider />

      {/* ── Behaviour ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="behaviour" />
      <H2>Behaviour</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { title: 'Sorting',       desc: 'Click any sortable column header to sort ascending. Click again to reverse. A third click returns to unsorted state. Only one column is sorted at a time.' },
          { title: 'Selection',     desc: 'Single-select mode highlights a row on click. Multi-select shows checkboxes and a header checkbox for select-all. The toolbar switches to the bulk action bar as soon as one row is selected.' },
          { title: 'Bulk actions',  desc: 'The bulk action bar appears in the toolbar when selectedCount > 0. It shows the count, contextual action buttons, and a × button to clear the selection.' },
          { title: 'Row actions',   desc: 'Actions fade in on row hover. Up to 2 primary actions are shown inline; remaining actions appear in an overflow ⋯ menu that opens on click and closes on selection or outside-click.' },
          { title: 'Pagination',    desc: 'Shows a per-page selector (5/10/20/50), a result range, and page navigation with smart ellipsis for large page counts. Changing per-page resets to page 1.' },
          { title: 'Filter bar',    desc: 'Toggled by the Filters button in the toolbar. Shows active filter tags with individual × remove buttons. The Filters button badge reflects the active count.' },
          { title: 'Search',        desc: 'The search input in the toolbar filters rows client-side on every keystroke. Changing the query resets to page 1.' },
          { title: 'Density',       desc: 'The density toggle in the toolbar cycles between compact (40 px), default (48 px), and relaxed (64 px) row heights. State is lifted to parent via onDensityChange.' },
        ].map(item => (
          <div key={item.title} style={{ background: 'var(--bg-secondary)', borderRadius: 8, paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, border: '1px solid var(--stroke-primary)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, fontFamily: 'Poppins, sans-serif' }}>{item.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, fontFamily: 'Poppins, sans-serif' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Do / Don't ───────────────────────────────────────────────────── */}
      <SectionAnchor id="usage" />
      <H2>Do / Don't</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <DoBox>
          Always provide column labels. Even if a column's content is self-evident (e.g., a status badge), a header gives screen readers and keyboard users an anchor for sorting and filtering.
        </DoBox>
        <DontBox>
          Don't use the table for simple lists with only one or two columns. A plain list or a card grid will be less visually heavy and easier to scan.
        </DontBox>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <DoBox>
          Limit inline row actions to two. Put any additional actions in the overflow ⋯ menu so the row stays compact and scannable.
        </DoBox>
        <DontBox>
          Don't mix density modes within the same page. Pick a single density and apply it consistently across all tables in the product.
        </DontBox>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <DoBox>
          Keep the bulk action bar focused: expose 2–4 contextual actions (Edit, Export, Delete) that apply to the selected rows. Avoid generic actions that don't relate to the data type.
        </DoBox>
        <DontBox>
          Don't remove the empty state. Always render a meaningful message with an Add CTA and a Clear filters fallback when there are no rows — a blank table body appears broken.
        </DontBox>
      </div>

      <Divider />

      {/* ── Accessibility ─────────────────────────────────────────────────── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['<table> semantics',   'Always use a real <table> element with <thead>, <tbody>, <th>, and <td>. Do not replicate table structure with divs — screen readers rely on native table semantics for row/column announcement.'],
          ['scope attribute',     'Add scope="col" to each <th> in the header row so assistive technologies can associate data cells with their column header correctly.'],
          ['aria-sort',           'Apply aria-sort="ascending" | "descending" | "none" to the currently sorted column\'s <th>. This tells screen readers which column is sorted and in which direction.'],
          ['aria-selected',       'Add aria-selected="true" to each selected <tr> in both single and multi-select modes. This communicates row selection state to screen readers.'],
          ['Keyboard navigation', 'Tab should move focus between interactive elements (checkboxes, sort headers, action buttons, pagination). Arrow keys can navigate within the table body.'],
          ['Focus management',    'When the bulk action bar appears after a selection, move focus to the first action button. When dismissed, return focus to the row that triggered the change.'],
          ['Overflow menu',       'The ⋯ overflow button must have an aria-label (e.g., "More actions for Alice Martin"). Dismiss the menu on Escape and return focus to the trigger button.'],
        ].map(([label, text]) => (
          <div key={label} style={{ display: 'flex', gap: 12, paddingTop: 10, paddingBottom: 10, paddingLeft: 14, paddingRight: 14, background: 'var(--bg-secondary)', borderRadius: 8, alignItems: 'flex-start' }}>
            <Code>{label}</Code>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'Poppins, sans-serif' }}>{text}</span>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Token reference ───────────────────────────────────────────────── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>
      <InfoBox>All table tokens are resolved from semantic tokens and are theme-aware. The values shown change when you switch the theme at the top of the page.</InfoBox>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'Poppins, sans-serif' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)', width: '40%' }}>Token</th>
              <th style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)', width: '18%' }}>Resolved value</th>
              <th style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Usage</th>
            </tr>
          </thead>
          <tbody>
            {TOKEN_ROWS.map(([token, usage]) => {
              const raw = tokens[token]
              const isColor  = typeof raw === 'string' && raw.startsWith('#')
              const isNumber = typeof raw === 'number'
              return (
                <tr key={token}>
                  <td style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 12, paddingRight: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--brand-600)', borderBottom: '1px solid var(--stroke-primary)' }}>
                    {token}
                  </td>
                  <td style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 12, paddingRight: 12, borderBottom: '1px solid var(--stroke-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      {isColor && (
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: raw, border: '1px solid rgba(0,0,0,.08)', flexShrink: 0 }} />
                      )}
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)' }}>
                        {raw !== undefined ? (isNumber ? `${raw}px` : raw) : '—'}
                      </span>
                    </div>
                  </td>
                  <td style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 12, paddingRight: 12, fontSize: 11, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
                    {usage}
                  </td>
                </tr>
              )
            })}
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
