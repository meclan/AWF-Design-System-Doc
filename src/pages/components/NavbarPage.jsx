import React, { useState } from 'react'
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
  const s = { info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', label: 'Note' }, warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', label: 'Warning' } }[type]
  return <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: s.text, lineHeight: 1.65 }}><strong>{s.label}:</strong> {children}</div>
}
function DoBox({ children, visual }) {
  return (
    <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 8, overflow: 'hidden' }}>
      {visual && <div style={{ padding: '16px', background: 'var(--bg-primary)', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '16px', background: 'var(--bg-primary)', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Color palettes ───────────────────────────────────────────────────────────

function getLightPalette(t, bg) {
  const brandMid  = t['tabs.indicator']   || '#07a2b6'
  const brandDark = t['tabs.text.active'] || '#05606d'
  return {
    bg,
    brandMid,
    brandDark,
    divider:         t['navbar.divider']              || '#dfe3e8',
    sectionLabel:    t['navbar.section-label.text']   || '#c4cdd5',
    itemTextDefault: t['navbar.item.text.default']    || '#454f5b',
    itemTextActive:  t['navbar.item.text.active']     || brandMid,
    itemBgDefault:   'transparent',
    itemBgHover:     'rgba(7,162,182,0.10)',
    itemBgActive:    t['navbar.item.bg.active']       || '#def0f4',
    itemIconDefault: '#454f5b',
    itemIconActive:  brandMid,
    chevron:         '#c4cdd5',
    subDivider:      t['navbar.sub-item.divider']     || '#c4cdd5',
    subTextDefault:  '#454f5b',
    subTextActive:   brandMid,
    headerTextBrand: t['navbar.header.text-brand']    || brandDark,
    headerTextSub:   '#919eab',
    footerText:      t['navbar.footer.version-text']  || '#919eab',
    toggleBg:        '#ecf6fa',
    toggleIcon:      brandMid,
    isDark:          false,
  }
}

const DARK_PALETTES = {
  'dark-brand': {
    bg: '#05606d', divider: 'rgba(255,255,255,0.14)', sectionLabel: '#919eab',
    itemTextDefault: '#ffffff', itemTextActive: '#9fefff',
    itemBgDefault: 'transparent', itemBgHover: 'rgba(0,66,75,0.6)', itemBgActive: '#00424b',
    itemIconDefault: '#ffffff', itemIconActive: '#9fefff', chevron: 'rgba(255,255,255,0.5)',
    subDivider: 'rgba(255,255,255,0.2)', subTextDefault: 'rgba(255,255,255,0.8)', subTextActive: '#9fefff',
    headerTextBrand: '#f4f6f8', headerTextSub: '#919eab', footerText: '#c4cdd5',
    toggleBg: '#00424b', toggleIcon: '#9fefff', isDark: true,
  },
  'dark-deep': {
    bg: '#00424b', divider: 'rgba(255,255,255,0.14)', sectionLabel: '#919eab',
    itemTextDefault: '#ffffff', itemTextActive: '#9fefff',
    itemBgDefault: 'transparent', itemBgHover: '#008394', itemBgActive: '#05606d',
    itemIconDefault: '#ffffff', itemIconActive: '#9fefff', chevron: 'rgba(255,255,255,0.5)',
    subDivider: 'rgba(255,255,255,0.2)', subTextDefault: 'rgba(255,255,255,0.8)', subTextActive: '#9fefff',
    headerTextBrand: '#f4f6f8', headerTextSub: '#919eab', footerText: '#c4cdd5',
    toggleBg: '#05606d', toggleIcon: '#9fefff', isDark: true,
  },
  'dark-grey': {
    bg: '#1c252e', divider: 'rgba(255,255,255,0.10)', sectionLabel: '#919eab',
    itemTextDefault: '#ffffff', itemTextActive: '#9fefff',
    itemBgDefault: 'transparent', itemBgHover: 'rgba(7,162,182,0.35)', itemBgActive: '#454f5b',
    itemIconDefault: '#ffffff', itemIconActive: '#9fefff', chevron: 'rgba(255,255,255,0.5)',
    subDivider: 'rgba(255,255,255,0.2)', subTextDefault: 'rgba(255,255,255,0.8)', subTextActive: '#9fefff',
    headerTextBrand: '#f4f6f8', headerTextSub: '#919eab', footerText: '#c4cdd5',
    toggleBg: '#454f5b', toggleIcon: '#9fefff', isDark: true,
  },
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icon = ({ d, size = 18, color = 'currentColor', fill = 'none', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={{ flexShrink: 0 }}>
    <path d={d} stroke={fill === 'none' ? color : 'none'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ICONS = {
  dashboard:  'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  analytics:  'M18 20V10M12 20V4M6 20v-6',
  reports:    'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  folder:     'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
  team:       'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  settings:   'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  help:       'M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01',
  logout:     'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  bell:       'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  search:     'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  user:       'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  chevdown:   'M6 9l6 6 6-6',
  sidebar:    'M3 3h18v18H3zM9 3v18',
  menu:       'M3 12h18M3 6h18M3 18h18',
  plus:       'M12 5v14M5 12h14',
  map:        'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16',
}

function NavIcon({ name, size = 18, color = 'currentColor' }) {
  const d = ICONS[name] || ICONS.dashboard
  return <Icon d={d} size={size} color={color} />
}

// ─── Nav data ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'analytics', icon: 'analytics', label: 'Analytics' },
  { id: 'reports',   icon: 'reports',   label: 'Reports' },
  { type: 'section', label: 'WORKSPACE' },
  { id: 'projects',  icon: 'folder',    label: 'Projects', children: [
    { id: 'proj-mine',   label: 'My projects' },
    { id: 'proj-shared', label: 'Shared' },
    { id: 'proj-archive',label: 'Archive' },
  ]},
  { id: 'map',       icon: 'map',       label: 'Map view' },
  { id: 'team',      icon: 'team',      label: 'Team' },
  { type: 'section', label: 'ADMIN' },
  { id: 'settings',  icon: 'settings',  label: 'Settings' },
]

const BOTTOM_ITEMS = [
  { id: 'help',   icon: 'help',   label: 'Help' },
  { id: 'logout', icon: 'logout', label: 'Log out' },
]

// ─── Sidebar component ────────────────────────────────────────────────────────

function NavItem({ item, activeId, onSelect, collapsed, expanded, onToggle, C, scale = 1 }) {
  const isActive   = activeId === item.id || (item.children && item.children.some(c => c.id === activeId))
  const isExpanded = expanded === item.id
  const [hovered, setHovered] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  const textColor = isActive ? C.itemTextActive : C.itemTextDefault
  const iconColor = isActive ? C.itemIconActive : C.itemIconDefault
  const bg        = isActive ? C.itemBgActive : hovered ? C.itemBgHover : C.itemBgDefault

  const fs  = 14 * scale
  const gap = Math.round(16 * scale)
  const pad = Math.round(8 * scale)
  const iconSz = Math.round(18 * scale)

  return (
    <div style={{ userSelect: 'none' }}>
      <button
        onClick={() => {
          if (hasChildren && !collapsed) onToggle(item.id)
          else onSelect(item.id)
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : gap,
          justifyContent: collapsed ? 'center' : 'space-between',
          width: '100%', padding: pad, borderRadius: 8,
          background: bg, border: 'none', cursor: 'pointer',
          transition: 'background .15s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : gap }}>
          <NavIcon name={item.icon} size={iconSz} color={iconColor} />
          {!collapsed && (
            <span style={{ fontSize: fs, fontFamily: 'Poppins, sans-serif', fontWeight: isActive ? 500 : 400, color: textColor, whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
          )}
        </div>
        {!collapsed && hasChildren && (
          <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s', display: 'flex' }}>
            <NavIcon name="chevdown" size={Math.round(14 * scale)} color={C.chevron} />
          </span>
        )}
      </button>
      {/* Sub-items */}
      {!collapsed && hasChildren && isExpanded && (
        <div style={{ marginLeft: Math.round(18 * scale), paddingLeft: Math.round(14 * scale), borderLeft: `1px solid ${C.subDivider}`, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2, marginBottom: 2 }}>
          {item.children.map(child => {
            const childActive = child.id === activeId
            const [ch, setCh] = useState(false)
            return (
              <button
                key={child.id}
                onClick={() => onSelect(child.id)}
                onMouseEnter={() => setCh(true)}
                onMouseLeave={() => setCh(false)}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: `${Math.round(4 * scale)}px ${Math.round(10 * scale)}px`,
                  borderRadius: 100, border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: childActive ? C.itemBgActive : ch ? C.itemBgHover : 'transparent',
                  transition: 'background .15s',
                }}
              >
                <span style={{ fontSize: Math.round(13 * scale), fontFamily: 'Poppins, sans-serif', fontWeight: childActive ? 500 : 300, color: childActive ? C.subTextActive : C.subTextDefault, whiteSpace: 'nowrap' }}>
                  {child.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Sidebar({ C, collapsed, onToggle, activeId, onSelect, expanded, onExpand, scale = 1, height = '100%' }) {
  const W = collapsed ? Math.round(58 * scale) : Math.round(220 * scale)
  const px = Math.round(collapsed ? 0 : 16 * scale)
  const py = Math.round(10 * scale)

  return (
    <div style={{
      width: W, minWidth: W, height,
      background: C.bg,
      display: 'flex', flexDirection: 'column',
      transition: 'width .25s cubic-bezier(.4,0,.2,1)',
      overflow: 'hidden', flexShrink: 0,
      borderRight: C.isDark ? 'none' : `1px solid ${C.divider}`,
    }}>
      {/* Toggle */}
      <div style={{ padding: py, display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', flexShrink: 0 }}>
        <button
          onClick={onToggle}
          style={{
            width: Math.round(34 * scale), height: Math.round(34 * scale), borderRadius: 8,
            background: C.toggleBg, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <NavIcon name="sidebar" size={Math.round(16 * scale)} color={C.toggleIcon} />
        </button>
      </div>

      {/* Header */}
      <div style={{ padding: `${Math.round(4 * scale)}px ${px || Math.round(10 * scale)}px`, display: 'flex', alignItems: 'center', gap: Math.round(10 * scale), flexShrink: 0, overflow: 'hidden' }}>
        <div style={{ width: Math.round(32 * scale), height: Math.round(32 * scale), borderRadius: 6, background: C.brandMid || '#07a2b6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: Math.round(12 * scale), fontWeight: 700, color: '#fff' }}>A</span>
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: Math.round(14 * scale), fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.headerTextBrand, lineHeight: 1.2 }}>Arcad</div>
            <div style={{ fontSize: Math.round(10 * scale), fontFamily: 'Poppins, sans-serif', color: C.headerTextSub, lineHeight: 1.2 }}>v4.2.1</div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: C.divider, margin: `${Math.round(6 * scale)}px 0`, flexShrink: 0 }} />

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: `${py}px ${Math.round(8 * scale)}px` }}>
        {NAV_ITEMS.map((item, i) => {
          if (item.type === 'section') {
            if (collapsed) return null
            return (
              <div key={i} style={{ padding: `${Math.round(10 * scale)}px ${Math.round(8 * scale)}px ${Math.round(4 * scale)}px`, fontSize: Math.round(10 * scale), fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: C.sectionLabel, letterSpacing: '.07em', textTransform: 'uppercase' }}>
                {item.label}
              </div>
            )
          }
          return (
            <NavItem
              key={item.id}
              item={item}
              activeId={activeId}
              onSelect={onSelect}
              collapsed={collapsed}
              expanded={expanded}
              onToggle={onExpand}
              C={C}
              scale={scale}
            />
          )
        })}
      </div>

      {/* Bottom divider + utilities */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ height: 1, background: C.divider }} />
        <div style={{ padding: `${py}px ${Math.round(8 * scale)}px`, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {BOTTOM_ITEMS.map(item => {
            const [hov, setHov] = useState(false)
            return (
              <button
                key={item.id}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: Math.round(16 * scale),
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: Math.round(8 * scale), borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: hov ? C.itemBgHover : 'transparent',
                  width: '100%', transition: 'background .15s',
                }}
              >
                <NavIcon name={item.icon} size={Math.round(16 * scale)} color={C.itemTextDefault} />
                {!collapsed && <span style={{ fontSize: Math.round(13 * scale), fontFamily: 'Poppins, sans-serif', fontWeight: 400, color: C.itemTextDefault }}>{item.label}</span>}
              </button>
            )
          })}
        </div>
        {/* Footer */}
        {!collapsed && (
          <>
            <div style={{ height: 1, background: C.divider }} />
            <div style={{ padding: `${Math.round(10 * scale)}px ${Math.round(16 * scale)}px` }}>
              <div style={{ fontSize: Math.round(10 * scale), fontFamily: 'Poppins, sans-serif', fontWeight: 300, color: C.footerText, lineHeight: 1.6 }}>
                Design System v2.4.0<br />© 2025 Arcad Software
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Top Header Bar component ─────────────────────────────────────────────────

const HEADER_ITEMS = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'analytics', icon: 'analytics', label: 'Analytics' },
  { id: 'reports',   icon: 'reports',   label: 'Reports' },
  { id: 'team',      icon: 'team',      label: 'Team' },
]

function TopHeaderBar({ C, activeId, onSelect, height = 52, scale = 1, showIcons = true }) {
  const [openUser, setOpenUser] = useState(false)
  const fs  = Math.round(13 * scale)
  const pad = Math.round(9 * scale)
  const iconSz = Math.round(16 * scale)

  return (
    <div style={{
      height, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `0 ${Math.round(20 * scale)}px`,
      background: C.bg,
      borderBottom: `1px solid ${C.divider}`,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(10 * scale), flexShrink: 0 }}>
        <div style={{ width: Math.round(28 * scale), height: Math.round(28 * scale), borderRadius: 6, background: C.brandMid || '#07a2b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: Math.round(11 * scale), fontWeight: 700, color: '#fff' }}>A</span>
        </div>
        <span style={{ fontSize: Math.round(14 * scale), fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.headerTextBrand, whiteSpace: 'nowrap' }}>Arcad</span>
      </div>

      {/* Nav items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
        {HEADER_ITEMS.map(item => {
          const isActive = item.id === activeId
          const [hov, setHov] = useState(false)
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: Math.round(7 * scale),
                padding: `${pad}px ${Math.round(12 * scale)}px`,
                borderRadius: 8, border: 'none', cursor: 'pointer',
                background: isActive ? C.itemBgActive : hov ? C.itemBgHover : 'transparent',
                transition: 'background .15s',
              }}
            >
              {showIcons && <NavIcon name={item.icon} size={iconSz} color={isActive ? C.itemIconActive : C.itemIconDefault} />}
              <span style={{ fontSize: fs, fontFamily: 'Poppins, sans-serif', fontWeight: isActive ? 500 : 400, color: isActive ? C.itemTextActive : C.itemTextDefault, whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(6 * scale), flexShrink: 0 }}>
        {[{ name: 'search' }, { name: 'bell' }].map(btn => {
          const [hov, setHov] = useState(false)
          return (
            <button
              key={btn.name}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{ width: Math.round(32 * scale), height: Math.round(32 * scale), borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: hov ? C.itemBgHover : 'transparent', transition: 'background .15s' }}
            >
              <NavIcon name={btn.name} size={iconSz} color={C.itemIconDefault} />
            </button>
          )
        })}
        {/* User avatar */}
        <div style={{ width: Math.round(30 * scale), height: Math.round(30 * scale), borderRadius: '50%', background: C.brandMid || '#07a2b6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <span style={{ fontSize: Math.round(11 * scale), fontWeight: 600, color: '#fff' }}>JD</span>
        </div>
      </div>
    </div>
  )
}

// ─── Live demo ────────────────────────────────────────────────────────────────

const VARIANT_OPTIONS = [
  { id: 'light-grey',  label: 'Light — Grey',  group: 'light' },
  { id: 'light-brand', label: 'Light — Brand',  group: 'light' },
  { id: 'light-white', label: 'Light — White',  group: 'light' },
  { id: 'dark-brand',  label: 'Dark — Brand 800', group: 'dark' },
  { id: 'dark-deep',   label: 'Dark — Brand 900', group: 'dark' },
  { id: 'dark-grey',   label: 'Dark — Grey 800',  group: 'dark' },
]

function LiveDemo({ baseTokens }) {
  const [variantId, setVariantId] = useState('light-grey')
  const [collapsed, setCollapsed] = useState(false)
  const [activeId, setActiveId] = useState('dashboard')
  const [expanded, setExpanded] = useState(null)

  const bgs = {
    'light-grey':  baseTokens['navbar.bg.default'] || '#fbfcfd',
    'light-brand': baseTokens['navbar.bg.brand']   || '#f2fafb',
    'light-white': baseTokens['navbar.bg.white']   || '#ffffff',
  }

  const C = variantId.startsWith('dark')
    ? { ...DARK_PALETTES[variantId], brandMid: baseTokens['tabs.indicator'] || '#07a2b6', brandDark: baseTokens['tabs.text.active'] || '#05606d' }
    : getLightPalette(baseTokens, bgs[variantId])

  const brandMid = baseTokens['tabs.indicator'] || '#07a2b6'

  const btnBase = (active) => ({
    padding: '5px 11px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer',
    border: `1px solid ${active ? brandMid : 'var(--stroke-primary)'}`,
    background: active ? brandMid : 'var(--bg-primary)',
    color: active ? '#fff' : 'var(--text-secondary)',
  })

  const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Variant</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {VARIANT_OPTIONS.map(v => (
              <button key={v.id} onClick={() => setVariantId(v.id)} style={btnBase(variantId === v.id)}>{v.label}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>State</div>
          <button onClick={() => setCollapsed(v => !v)} style={btnBase(collapsed)}>Collapsed</button>
        </div>
      </div>

      {/* App frame */}
      <div style={{ height: 360, display: 'flex', border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
        <Sidebar
          C={C}
          collapsed={collapsed}
          onToggle={() => setCollapsed(v => !v)}
          activeId={activeId}
          onSelect={(id) => { setActiveId(id); setExpanded(null) }}
          expanded={expanded}
          onExpand={toggleExpand}
          scale={0.88}
          height="100%"
        />
        {/* Page content */}
        <div style={{ flex: 1, background: 'var(--bg-primary)', padding: 20, overflowY: 'auto' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, textTransform: 'capitalize' }}>
            {activeId.replace('proj-', '').replace('-', ' ')}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>Welcome back, Jane.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            {['Total users', 'Active now', 'Revenue'].map((l, i) => (
              <div key={l} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px', border: '1px solid var(--stroke-primary)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{['1,284', '42', '$98K'][i]}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 80, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--stroke-primary)' }} />
        </div>
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
      <div style={{ flex: '0 0 200px', position: 'relative' }}>
        <div style={{ background: C.bgDefault || '#fbfcfd', border: '1px solid #dfe3e8', borderRadius: 10, overflow: 'visible', height: 420, display: 'flex', flexDirection: 'column' }}>
          {/* ① Toggle */}
          <div style={{ padding: 8, display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#ecf6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <NavIcon name="sidebar" size={14} color={C.brandMid} />
            </div>
            <div style={{ position: 'absolute', top: 4, right: -22 }}>{badge(1)}</div>
          </div>

          {/* ② Header */}
          <div style={{ padding: '4px 12px 8px', display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            <div style={{ width: 28, height: 28, borderRadius: 5, background: C.brandMid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>A</span>
            </div>
            <div>
              <div style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.brandDark }}>Arcad</div>
              <div style={{ fontSize: 9, color: '#919eab' }}>v4.2.1</div>
            </div>
            <div style={{ position: 'absolute', top: 4, right: -22 }}>{badge(2)}</div>
          </div>
          <div style={{ height: 1, background: '#dfe3e8', position: 'relative' }}>
            <div style={{ position: 'absolute', right: -22, top: -9 }}>{badge(3)}</div>
          </div>

          {/* ③ Section label */}
          <div style={{ padding: '8px 12px 4px', fontSize: 9, fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#c4cdd5', letterSpacing: '.07em', position: 'relative' }}>
            MAIN
            <div style={{ position: 'absolute', right: -22, top: 4 }}>{badge(4)}</div>
          </div>

          {/* ④ Nav item - default */}
          <div style={{ margin: '1px 8px', padding: '7px 8px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
            <NavIcon name="dashboard" size={14} color="#454f5b" />
            <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', color: '#454f5b' }}>Dashboard</span>
            <div style={{ position: 'absolute', right: -22, top: 4 }}>{badge(5)}</div>
          </div>

          {/* ⑤ Nav item - active */}
          <div style={{ margin: '1px 8px', padding: '7px 8px', borderRadius: 8, background: '#def0f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <NavIcon name="folder" size={14} color={C.brandMid} />
              <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.brandMid }}>Projects</span>
            </div>
            <NavIcon name="chevdown" size={12} color="#c4cdd5" />
            <div style={{ position: 'absolute', right: -22, top: 4 }}>{badge(6)}</div>
          </div>

          {/* ⑥ Sub-items */}
          <div style={{ marginLeft: 22, paddingLeft: 12, borderLeft: '1px solid #c4cdd5', marginTop: 2, marginBottom: 2, position: 'relative' }}>
            <div style={{ position: 'absolute', right: -22, top: 0 }}>{badge(7)}</div>
            {['My projects', 'Shared'].map((l, i) => (
              <div key={l} style={{ padding: '4px 10px', borderRadius: 100, fontSize: 11, fontFamily: 'Poppins, sans-serif', fontWeight: i === 0 ? 500 : 300, color: i === 0 ? C.brandMid : '#454f5b', background: i === 0 ? '#def0f4' : 'transparent', marginBottom: 1 }}>{l}</div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{ height: 1, background: '#dfe3e8', position: 'relative' }}>
              <div style={{ position: 'absolute', right: -22, top: -9 }}>{badge(8)}</div>
            </div>
            <div style={{ padding: '8px 12px', fontSize: 9, fontFamily: 'Poppins, sans-serif', fontWeight: 300, color: '#919eab' }}>
              Design System v2.4.0<br />© 2025 Arcad Software
            </div>
          </div>
        </div>
      </div>

      {/* Callouts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 260, maxWidth: 360 }}>
        <AnatomyCallout n={1} title="Collapse toggle" desc="40×40px button that collapses or expands the sidebar. Shows only icons in collapsed state." />
        <AnatomyCallout n={2} title="Product header" desc="Logo mark + product name + version subtitle. Only the logo mark is visible in collapsed state." />
        <AnatomyCallout n={3} title="Divider" desc="1px horizontal line separating the header from navigation items and sections from each other." />
        <AnatomyCallout n={4} title="Section label" desc="Uppercase category label grouping related nav items. Hidden when collapsed." />
        <AnatomyCallout n={5} title="Nav item (default)" desc="Icon + label row. 8px padding, 8px border radius, 24px icon-label gap." />
        <AnatomyCallout n={6} title="Nav item (active)" desc="Brand-colored icon + medium-weight label + filled background. Chevron rotates 180° when expanded." />
        <AnatomyCallout n={7} title="Sub-items" desc="Indented children connected by a vertical left line. Pill border radius (100px). Light weight text, medium when active." />
        <AnatomyCallout n={8} title="Footer" desc="Version string and copyright. Hidden in collapsed state. Bottom utility actions (Help, Logout) above the footer." />
      </div>
    </div>
  )
}

// ─── Variant grid ─────────────────────────────────────────────────────────────

function VariantThumbnail({ C, label, bg }) {
  const activeC = C.itemTextActive || '#07a2b6'
  const activeBg = C.itemBgActive || '#def0f4'
  const defaultC = C.itemTextDefault || '#454f5b'
  return (
    <div>
      <div style={{ background: bg, border: C.isDark ? 'none' : '1px solid #dfe3e8', borderRadius: 10, overflow: 'hidden', width: 150 }}>
        {/* Toggle */}
        <div style={{ padding: 8, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: C.toggleBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <NavIcon name="sidebar" size={12} color={C.toggleIcon} />
          </div>
        </div>
        {/* Header */}
        <div style={{ padding: '0 10px 6px', display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 4, background: C.brandMid || '#07a2b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>A</span>
          </div>
          <span style={{ fontSize: 10, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.headerTextBrand }}>Arcad</span>
        </div>
        <div style={{ height: 1, background: C.divider }} />
        {/* Items */}
        <div style={{ padding: '6px 6px' }}>
          {[{icon:'dashboard',label:'Dashboard',active:false},{icon:'analytics',label:'Analytics',active:true},{icon:'reports',label:'Reports',active:false}].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 6px', borderRadius: 6, marginBottom: 1, background: item.active ? activeBg : 'transparent' }}>
              <NavIcon name={item.icon} size={12} color={item.active ? activeC : defaultC} />
              <span style={{ fontSize: 10, fontFamily: 'Poppins, sans-serif', fontWeight: item.active ? 500 : 400, color: item.active ? activeC : defaultC }}>{item.label}</span>
            </div>
          ))}
          <div style={{ fontSize: 8, fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: C.sectionLabel, letterSpacing: '.06em', padding: '6px 6px 2px', textTransform: 'uppercase' }}>WORKSPACE</div>
          {[{icon:'folder',label:'Projects',active:false},{icon:'team',label:'Team',active:false}].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 6px', borderRadius: 6, marginBottom: 1 }}>
              <NavIcon name={item.icon} size={12} color={defaultC} />
              <span style={{ fontSize: 10, fontFamily: 'Poppins, sans-serif', color: defaultC }}>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: C.divider }} />
        <div style={{ padding: '4px 6px 6px', fontSize: 8, fontFamily: 'Poppins, sans-serif', fontWeight: 300, color: C.footerText, lineHeight: 1.5 }}>
          v2.4.0 · © 2025 Arcad
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>{label}</div>
    </div>
  )
}

// ─── Collapsed state demo ─────────────────────────────────────────────────────

function CollapsedComparison({ C }) {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', padding: '24px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10, textAlign: 'center' }}>Expanded (300px)</div>
        <div style={{ background: C.bgDefault || '#fbfcfd', border: '1px solid #dfe3e8', borderRadius: 8, overflow: 'hidden', width: 180, height: 280, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#ecf6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><NavIcon name="sidebar" size={13} color={C.brandMid} /></div>
          </div>
          <div style={{ padding: '4px 10px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 4, background: C.brandMid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>A</span></div>
            <div><div style={{ fontSize: 11, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.brandDark }}>Arcad</div><div style={{ fontSize: 9, color: '#919eab' }}>v4.2.1</div></div>
          </div>
          <div style={{ height: 1, background: '#dfe3e8' }} />
          <div style={{ padding: '6px 8px', flex: 1 }}>
            {[{icon:'dashboard',label:'Dashboard',active:true},{icon:'analytics',label:'Analytics',active:false},{icon:'folder',label:'Projects',active:false}].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 7px', borderRadius: 6, marginBottom: 1, background: item.active ? (C.itemBgActive || '#def0f4') : 'transparent' }}>
                <NavIcon name={item.icon} size={13} color={item.active ? C.brandMid : '#454f5b'} />
                <span style={{ fontSize: 11, fontFamily: 'Poppins, sans-serif', fontWeight: item.active ? 500 : 400, color: item.active ? C.brandMid : '#454f5b' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center', paddingBottom: 20 }}>
        <span style={{ fontSize: 22, color: 'var(--text-tertiary)' }}>→</span>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10, textAlign: 'center' }}>Collapsed (90px)</div>
        <div style={{ background: C.bgDefault || '#fbfcfd', border: '1px solid #dfe3e8', borderRadius: 8, overflow: 'hidden', width: 58, height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ padding: '8px 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#ecf6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><NavIcon name="sidebar" size={13} color={C.brandMid} /></div>
          </div>
          <div style={{ padding: '4px 0 8px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 24, height: 24, borderRadius: 4, background: C.brandMid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>A</span></div>
          </div>
          <div style={{ height: 1, background: '#dfe3e8', width: '100%' }} />
          <div style={{ padding: '6px 0', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {[{icon:'dashboard',active:true},{icon:'analytics',active:false},{icon:'folder',active:false}].map((item, i) => (
              <div key={i} style={{ width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.active ? (C.itemBgActive || '#def0f4') : 'transparent' }}>
                <NavIcon name={item.icon} size={15} color={item.active ? C.brandMid : '#454f5b'} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 200, alignSelf: 'center', paddingBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Collapsed state</div>
        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2 }}>
          <li>Width shrinks from 300px → 90px</li>
          <li>Labels, section headers and footer text are hidden</li>
          <li>Icons remain centered and retain their active state color</li>
          <li>Toggle button remains visible for re-expansion</li>
          <li>Only the logo mark shows (product name hides)</li>
          <li>Use <Code>aria-label</Code> on each icon-only item</li>
        </ul>
      </div>
    </div>
  )
}

// ─── Top Header Bar section ───────────────────────────────────────────────────

function HeaderBarDemo({ C }) {
  const [activeId, setActiveId] = useState('dashboard')
  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 10, overflow: 'hidden' }}>
      <TopHeaderBar C={C} activeId={activeId} onSelect={setActiveId} />
      <div style={{ padding: '20px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 120 }}>
        <div style={{ height: 14, background: 'var(--bg-secondary)', borderRadius: 4, width: '60%' }} />
        <div style={{ height: 10, background: 'var(--bg-secondary)', borderRadius: 4, width: '40%' }} />
        <div style={{ height: 10, background: 'var(--bg-secondary)', borderRadius: 4, width: '50%' }} />
      </div>
    </div>
  )
}

function HeaderBarAnatomyDiagram({ C }) {
  const badge = (n) => (
    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</span>
  )
  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 100%', maxWidth: '100%', position: 'relative' }}>
        <div style={{ background: C.bgDefault || '#fbfcfd', border: '1px solid #dfe3e8', borderRadius: 8, overflow: 'visible', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', position: 'relative' }}>
          {/* ① Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            <div style={{ width: 26, height: 26, borderRadius: 5, background: C.brandMid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>A</span></div>
            <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.brandDark }}>Arcad</span>
            <div style={{ position: 'absolute', top: -20, left: 0 }}>{badge(1)}</div>
          </div>
          {/* ② Nav items */}
          <div style={{ display: 'flex', gap: 4, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)' }}>{badge(2)}</div>
            {[{icon:'dashboard',label:'Dashboard',active:true},{icon:'analytics',label:'Analytics',active:false},{icon:'reports',label:'Reports',active:false}].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 7, background: item.active ? (C.itemBgActive || '#def0f4') : 'transparent' }}>
                <NavIcon name={item.icon} size={12} color={item.active ? C.brandMid : '#454f5b'} />
                <span style={{ fontSize: 10, fontFamily: 'Poppins, sans-serif', fontWeight: item.active ? 500 : 400, color: item.active ? C.brandMid : '#454f5b' }}>{item.label}</span>
              </div>
            ))}
          </div>
          {/* ③ Actions */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -20, right: 0 }}>{badge(3)}</div>
            {['search','bell'].map(n => (
              <div key={n} style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NavIcon name={n} size={13} color="#454f5b" />
              </div>
            ))}
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.brandMid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: '#fff' }}>JD</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 220 }}>
          {badge(1)}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Logo + product name</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Anchored to the left. Same token as sidebar header.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 220 }}>
          {badge(2)}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Horizontal nav items</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Centered. Same icon + label pattern, same token states. Active item uses filled pill background.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 220 }}>
          {badge(3)}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Actions + avatar</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Search, notifications, and user avatar anchored to the right.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Use case: full layout ────────────────────────────────────────────────────

function UseCaseMockup({ C }) {
  const [activeId, setActiveId] = useState('analytics')
  const [headerActive, setHeaderActive] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [expanded, setExpanded] = useState(null)

  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', maxWidth: '100%' }}>
      {/* Chrome */}
      <div style={{ background: '#141a21', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: '#9ca3af' }}>myapp.io / dashboard</span>
      </div>

      {/* Top header bar */}
      <TopHeaderBar
        C={{ ...C, bgDefault: '#ffffff', bg: '#ffffff' }}
        activeId={headerActive}
        onSelect={setHeaderActive}
        height={46}
        scale={0.9}
      />

      {/* Body */}
      <div style={{ display: 'flex', height: 300 }}>
        <Sidebar
          C={C}
          collapsed={collapsed}
          onToggle={() => setCollapsed(v => !v)}
          activeId={activeId}
          onSelect={(id) => { setActiveId(id); setExpanded(null) }}
          expanded={expanded}
          onExpand={(id) => setExpanded(prev => prev === id ? null : id)}
          scale={0.78}
          height="100%"
        />
        {/* Content */}
        <div style={{ flex: 1, padding: '16px', background: 'var(--bg-primary)', overflowY: 'auto' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, textTransform: 'capitalize' }}>
            {activeId.replace('proj-', '').replace('-', ' ')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
            {['1,284 Users', '42 Online', '$98K Revenue'].map(l => (
              <div key={l} style={{ background: 'var(--bg-secondary)', borderRadius: 7, padding: '10px', border: '1px solid var(--stroke-primary)', fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{l}</div>
            ))}
          </div>
          <div style={{ height: 60, background: 'var(--bg-secondary)', borderRadius: 7, border: '1px solid var(--stroke-primary)' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Token reference ──────────────────────────────────────────────────────────

function TokenRow({ name, value, usage }) {
  return (
    <tr>
      <td style={{ padding: '7px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--brand-600)', borderBottom: '1px solid var(--stroke-primary)' }}>{name}</td>
      <td style={{ padding: '7px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{value}</td>
      <td style={{ padding: '7px 12px', fontSize: 11, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{usage}</td>
    </tr>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function NavbarPage() {
  const [themeId, setThemeId] = useState(VISIBLE_THEMES[0].id)
  const t = VISIBLE_THEMES.find(x => x.id === themeId) || VISIBLE_THEMES[0]
  const tokens = getComponentTokens(t.id)

  const brandMid  = tokens['tabs.indicator']   || '#07a2b6'
  const brandDark = tokens['tabs.text.active'] || '#05606d'

  const lightBgs = {
    'light-grey':  tokens['navbar.bg.default'] || '#fbfcfd',
    'light-brand': tokens['navbar.bg.brand']   || '#f2fafb',
    'light-white': tokens['navbar.bg.white']   || '#ffffff',
  }

  const LIGHT_PALETTES = {
    'light-grey':  getLightPalette(tokens, lightBgs['light-grey']),
    'light-brand': getLightPalette(tokens, lightBgs['light-brand']),
    'light-white': getLightPalette(tokens, lightBgs['light-white']),
  }

  const enrichedDark = Object.fromEntries(
    Object.entries(DARK_PALETTES).map(([k, v]) => [k, { ...v, brandMid, brandDark }])
  )

  const C = LIGHT_PALETTES['light-grey']  // default for anatomy/use case

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 32px 96px', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Navigation</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: 0 }}>Navbar</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Theme:</span>
          {VISIBLE_THEMES.map(th => (
            <button
              key={th.id}
              onClick={() => setThemeId(th.id)}
              style={{
                padding: '4px 12px', borderRadius: 6,
                border: `1px solid ${th.id === themeId ? brandMid : 'var(--stroke-primary)'}`,
                background: th.id === themeId ? brandMid : 'var(--bg-primary)',
                color: th.id === themeId ? '#fff' : 'var(--text-secondary)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}
            >{th.name}</button>
          ))}
        </div>
      </div>
      <Lead>
        The Navbar is the primary vertical sidebar navigation for AWF applications. It is collapsible, supports hierarchical sub-menus, and comes in <strong>3 light</strong> and <strong>3 dark</strong> variants. A companion <strong>Top Header Bar</strong> is also provided for layouts that need both a horizontal top bar and a sidebar.
      </Lead>

      {/* ── Overview ────────────────────────────────────────────────────── */}
      <SectionAnchor id="overview" />
      <H2>Overview</H2>
      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
        <div style={{ padding: '24px 28px', background: 'var(--bg-primary)' }}>
          <LiveDemo baseTokens={tokens} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div>
          <H3>When to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>As the primary navigation for a multi-page application.</li>
            <li>When the product has 5–15 distinct sections that need persistent access.</li>
            <li>When hierarchical navigation (parent → children) is needed.</li>
            <li>When screen real estate allows a persistent left rail.</li>
          </ul>
        </div>
        <div>
          <H3>When not to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>Simple apps with 2–4 sections — use a Tab bar instead.</li>
            <li>Mobile-first layouts — use a bottom navigation or hamburger menu.</li>
            <li>On narrow screens below 768px — collapse or replace with an overlay.</li>
          </ul>
        </div>
      </div>

      <Divider />

      {/* ── Anatomy ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>
      <AnatomyDiagram C={C} />

      <Divider />

      {/* ── Light variants ───────────────────────────────────────────────── */}
      <SectionAnchor id="variants-light" />
      <H2>Variants — Light</H2>
      <P>Three background options for light-mode applications. All share the same item state colors and tokens — only the background differs.</P>
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px', background: 'var(--bg-secondary)', borderRadius: 10, justifyContent: 'center', marginBottom: 8 }}>
        {[
          { id: 'light-grey',  label: 'V01 — Grey 50' },
          { id: 'light-brand', label: 'V02 — Brand ghost' },
          { id: 'light-white', label: 'V03 — White' },
        ].map(v => (
          <VariantThumbnail key={v.id} C={LIGHT_PALETTES[v.id]} bg={lightBgs[v.id]} label={v.label} />
        ))}
      </div>

      <Divider />

      {/* ── Dark variants ────────────────────────────────────────────────── */}
      <SectionAnchor id="variants-dark" />
      <H2>Variants — Dark</H2>
      <P>
        Three dark-mode backgrounds. Each dark variant uses a light cyan (<Code>#9fefff</Code>) as the active item color for maximum contrast against the dark surface. Dark variant token values are defined at the product semantic layer — not in the shared component tokens.
      </P>
      <InfoBox>
        Dark variant colors are <strong>not</strong> in <Code>components.json</Code>. They are provided as product-level semantic overrides set per application. The component token file only covers the light variants.
      </InfoBox>
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px', background: '#1c2432', borderRadius: 10, justifyContent: 'center', marginBottom: 8 }}>
        {[
          { id: 'dark-brand', label: 'V01 — Brand 800' },
          { id: 'dark-deep',  label: 'V02 — Brand 900' },
          { id: 'dark-grey',  label: 'V03 — Grey 800' },
        ].map(v => (
          <VariantThumbnail key={v.id} C={enrichedDark[v.id]} bg={enrichedDark[v.id].bg} label={v.label} />
        ))}
      </div>

      <Divider />

      {/* ── Collapsed state ──────────────────────────────────────────────── */}
      <SectionAnchor id="collapsed" />
      <H2>Collapsed state</H2>
      <P>Clicking the toggle button compresses the sidebar to icon-only mode (90px). This preserves navigation without consuming horizontal space.</P>
      <CollapsedComparison C={C} />

      <Divider />

      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <SectionAnchor id="header-bar" />
      <H2>Top Header Bar</H2>
      <P>
        The Top Header Bar is a companion component for layouts that use both a top bar and a sidebar. It uses the same token set as the sidebar for consistent active and hover states. The logo anchors to the left, navigation items center in the bar, and utility actions (search, notifications, avatar) sit on the right.
      </P>
      <H3>Interactive demo</H3>
      <HeaderBarDemo C={C} />

      <div style={{ marginTop: 32 }}>
        <H3>Anatomy</H3>
        <HeaderBarAnatomyDiagram C={C} />
      </div>

      <div style={{ marginTop: 24 }}>
        <H3>Sidebar vs. Top Header Bar</H3>
        <div style={{ overflowX: 'auto', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                {['', 'Sidebar Navbar', 'Top Header Bar'].map(h => (
                  <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Orientation',       'Vertical (left)',            'Horizontal (top)'],
                ['Best for',          '5–15 sections, hierarchical', '3–6 flat sections'],
                ['Sub-menus',         '✓ Expandable in-place',      '✗ Use Popover Menu instead'],
                ['Collapsible',       '✓ Icon-only mode (90px)',    '✗ Fixed height'],
                ['Dark variants',     '✓ 3 dark variants',          '✓ Uses same tokens'],
                ['Token prefix',      'navbar.*',                   'navbar.* (shared)'],
                ['Combine together',  '✓ Use both in same layout',  '✓ Sits above sidebar'],
              ].map(([label, ...cells]) => (
                <tr key={label}>
                  <td style={{ padding: '8px 14px', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--stroke-primary)', whiteSpace: 'nowrap' }}>{label}</td>
                  {cells.map((c, i) => (
                    <td key={i} style={{ padding: '8px 14px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Divider />

      {/* ── Usage rules ─────────────────────────────────────────────────── */}
      <SectionAnchor id="usage" />
      <H2>Usage guidelines</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox>
          Always pair an icon with a label. Icons speed up recognition for returning users; labels help new users orient themselves. Both must be present in expanded state.
        </DoBox>
        <DontBox>
          Don't add more than one level of nesting. Sub-items work well, but sub-sub-items create deep hierarchy that's hard to scan. Restructure the IA instead.
        </DontBox>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox>
          Keep the active state on only one item at a time (single selection). If a sub-item is active, highlight it — not its parent — as the primary active element.
        </DoBox>
        <DontBox>
          Don't mix dark and light variants within the same navigation. Choose one per product and stay consistent across all screens.
        </DontBox>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox>
          Use section labels (uppercase category headers) to group related items. Keep group sizes to 2–5 items. Sections help users predict where to look.
        </DoBox>
        <DontBox>
          Don't put more than 3–4 items in the bottom utility area (Help, Settings, Logout). It should only contain app-level utilities, not page navigation.
        </DontBox>
      </div>

      <Divider />

      {/* ── Use case ────────────────────────────────────────────────────── */}
      <SectionAnchor id="use-case" />
      <H2>Use case — App layout with sidebar + header bar</H2>
      <P>
        A complete app shell combining both components: the Top Header Bar provides product-level navigation, while the sidebar provides section-level navigation within the current product area. The sidebar is collapsible; clicking items updates the content area.
      </P>
      <UseCaseMockup C={C} />

      <Divider />

      {/* ── Accessibility ───────────────────────────────────────────────── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['nav / aria-label',     'Wrap the sidebar in <nav aria-label="Main navigation">. If both a sidebar and header bar are present, give each a distinct label.'],
          ['aria-current="page"',  'Apply aria-current="page" to the active nav item so screen readers announce the current location.'],
          ['aria-expanded',        'On items with sub-menus, toggle aria-expanded="true/false" when the group is opened or closed.'],
          ['aria-label (collapsed)','In collapsed (icon-only) state, each button must have aria-label matching the item label since the visible text is hidden.'],
          ['keyboard navigation',  'Tab moves between items. Enter/Space activates or toggles expand/collapse. Arrow keys (Up/Down) navigate within a group.'],
          ['Focus visible',        'Never suppress focus ring styles. The sidebar is keyboard-only-navigable — focus rings are essential.'],
          ['Toggle button',        'The collapse toggle must have a clear aria-label: "Collapse navigation" / "Expand navigation" to reflect its current action.'],
        ].map(([label, text]) => (
          <div key={label} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8, alignItems: 'flex-start' }}>
            <Code>{label}</Code>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{text}</span>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Token reference ─────────────────────────────────────────────── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>
      <InfoBox>Only light-variant tokens are defined in <Code>components.json</Code>. Dark variant colors are set at the product semantic layer.</InfoBox>

      {[
        { title: 'Layout', rows: [
          ['navbar.width-expanded',  '300',                       'Expanded sidebar width (px)'],
          ['navbar.width-collapsed', '90',                        'Collapsed sidebar width (px)'],
          ['navbar.divider',         '{color.stroke.subtle}',     'All horizontal dividers'],
        ]},
        { title: 'Background', rows: [
          ['navbar.bg.default', '{color.bg.subtlest} — #fbfcfd',  'V01 — grey-50 background'],
          ['navbar.bg.brand',   '{color.bg.brand.ghost} — #f2fafb', 'V02 — brand-ghost background'],
          ['navbar.bg.white',   '{color.bg.overlay} — #ffffff',   'V03 — white background'],
        ]},
        { title: 'Header', rows: [
          ['navbar.header.text-brand',    '{color.text.brand.strongest}', 'Product name color'],
          ['navbar.header.text-subtitle', '{color.text.subtle}',          'Version / subtitle color'],
          ['navbar.header.logo-size',     '{numbers.icon-size.xxl}',      'Logo mark size'],
        ]},
        { title: 'Nav item', rows: [
          ['navbar.item.text.default',         '{color.text.secondary} — #454f5b', 'Default label color'],
          ['navbar.item.text.active',          '{color.text.brand.default} — #07a2b6', 'Active label color'],
          ['navbar.item.text.active-contrasted','{color.text.brand.strong}',       'Active label on dark bg'],
          ['navbar.item.text.font-size',       '{numbers.font-size.md} — 16px',    'Nav item font size'],
          ['navbar.item.text.font-weight-default','{numbers.font-weight.regular}', 'Default font weight'],
          ['navbar.item.text.font-weight-active', '{numbers.font-weight.medium}',  'Active font weight'],
          ['navbar.item.bg.default',           '{color.bg.transparent}',           'Default background'],
          ['navbar.item.bg.hover',             '{color.bg.brand.default-10%}',     'Hover background (10% tint)'],
          ['navbar.item.bg.active',            '{color.bg.brand.subtle} — #def0f4', 'Active background'],
          ['navbar.item.icon.default',         '{color.icon.primary}',              'Default icon color'],
          ['navbar.item.icon.active',          '{color.icon.brand.default}',        'Active icon color'],
          ['navbar.item.radius',               '{numbers.radius.md} — 8px',        'Item border radius'],
          ['navbar.item.padding-x',            '{numbers.spacing.2xs} — 8px',      'Horizontal padding'],
          ['navbar.item.padding-y',            '{numbers.spacing.2xs} — 8px',      'Vertical padding'],
          ['navbar.item.gap',                  '{numbers.spacing.xl} — 24px',      'Icon–label gap'],
          ['navbar.item.chevron',              '{color.icon.tertiary}',             'Chevron color'],
        ]},
        { title: 'Section label', rows: [
          ['navbar.section-label.text',       '{color.text.subtlest} — #c4cdd5',  'Label text color'],
          ['navbar.section-label.font-size',  '{numbers.font-size.xs}',            'Label font size'],
          ['navbar.section-label.font-weight','{numbers.font-weight.semi-bold}',   'Label font weight'],
          ['navbar.section-label.padding-x',  '{numbers.spacing.xl} — 24px',      'Label horizontal padding'],
        ]},
        { title: 'Sub-item', rows: [
          ['navbar.sub-item.text.default',         '{color.text.secondary}',      'Default sub-item color'],
          ['navbar.sub-item.text.active',          '{color.text.brand.default}',  'Active sub-item color'],
          ['navbar.sub-item.text.font-size',       '{numbers.font-size.sm}',      'Sub-item font size (14px)'],
          ['navbar.sub-item.text.font-weight-default','{numbers.font-weight.light}', 'Default sub-item weight'],
          ['navbar.sub-item.text.font-weight-active', '{numbers.font-weight.medium}', 'Active sub-item weight'],
          ['navbar.sub-item.bg.hover',             '{color.bg.brand.default-10%}','Sub-item hover bg'],
          ['navbar.sub-item.bg.active',            '{color.bg.brand.subtle}',     'Sub-item active bg'],
          ['navbar.sub-item.radius',               '{numbers.radius.full} — 100px','Pill border radius'],
          ['navbar.sub-item.divider',              '{color.stroke.secondary}',    'Vertical connector line'],
          ['navbar.sub-item.padding-x',            '{numbers.spacing.sm} — 12px', 'Horizontal padding'],
          ['navbar.sub-item.padding-y',            '{numbers.spacing.4xs}',       'Vertical padding'],
          ['navbar.sub-item.gap',                  '{numbers.spacing.4xs}',       'Gap between sub-items'],
        ]},
        { title: 'Footer', rows: [
          ['navbar.footer.version-text', '{color.text.subtle}',          'Footer text color'],
          ['navbar.footer.font-size',    '{numbers.font-size.xxs}',      'Footer font size'],
          ['navbar.footer.font-weight',  '{numbers.font-weight.light}',  'Footer font weight'],
          ['navbar.footer.logo-size',    '{numbers.icon-size.md}',       'Footer logo size'],
        ]},
      ].map(section => (
        <div key={section.title} style={{ marginBottom: 24 }}>
          <H3>{section.title}</H3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '7px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)', width: '38%' }}>Token</th>
                  <th style={{ padding: '7px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)', width: '35%' }}>Value</th>
                  <th style={{ padding: '7px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Usage</th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map(([name, value, usage]) => (
                  <TokenRow key={name} name={name} value={value} usage={usage} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

    </div>
  )
}
