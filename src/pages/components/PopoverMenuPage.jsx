import React, { useState, useEffect, useRef } from 'react'
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
      {visual && <div style={{ padding: '20px 18px', background: 'var(--bg-primary)', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
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
      {visual && <div style={{ padding: '20px 18px', background: 'var(--bg-primary)', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{visual}</div>}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#dc2626', marginBottom: 5 }}>✗ Don't</div>
        <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Color palettes — light & dark ───────────────────────────────────────────
// These are static per-skin values pulled from popover.light.* / popover.dark.* tokens

const LIGHT = {
  bg:         '#ffffff',
  stroke:     '#c4cdd5',
  divider:    '#e0e5ea',
  title:      '#454f5b',
  text:       '#637381',
  subtleText: '#919eab',
  subtitle:   '#c4cdd5',
  hoverItem:  '#f4f6f8',
  icon:       '#454f5b',
  danger:     '#f6643f',
}
const DARK = {
  bg:         '#141a21',
  stroke:     '#919eab',
  divider:    '#454f5b',
  title:      '#ffffff',
  text:       '#c4cdd5',
  subtleText: '#919eab',
  subtitle:   '#637381',
  hoverItem:  '#454f5b',
  icon:       '#c4cdd5',
  danger:     '#f6643f',
}

function getSkin(skin) { return skin === 'dark' ? DARK : LIGHT }

// Brand mid for theme-reactive UI elements (trigger button, etc.)
function getBrandMid(t) {
  return t['tabs.indicator'] || '#07a2b6'
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function DotsIcon({ size = 16, color = '#637381' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="5"  r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
    </svg>
  )
}
function UserIcon({ size = 15, color = '#637381' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth={1.8} />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  )
}
function SettingsIcon({ size = 15, color = '#637381' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  )
}
function ShareIcon({ size = 15, color = '#637381' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CopyIcon({ size = 15, color = '#637381' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth={1.8} />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  )
}
function TrashIcon({ size = 15, color = '#f6643f' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CloseIcon({ size = 14, color = '#919eab' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}
function FolderIcon({ size = 15, color = '#637381' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function MoveIcon({ size = 15, color = '#637381' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── PopoverMenu primitives ───────────────────────────────────────────────────

function MenuDivider({ skin }) {
  const C = getSkin(skin)
  return <div style={{ height: 1, background: C.divider, margin: '4px 0' }} />
}

function MenuItem({ icon, label, state = 'default', skin = 'light', onClick }) {
  const C = getSkin(skin)
  const [hovered, setHovered] = useState(false)
  const isDisabled = state === 'disabled'
  const isDanger   = state === 'danger'
  const isSubtle   = state === 'subtle'

  const textColor = isDanger
    ? C.danger
    : isDisabled
    ? C.subtitle
    : isSubtle
    ? C.subtleText
    : hovered
    ? (skin === 'dark' ? '#ffffff' : C.title)
    : C.text

  const iconColor = isDanger ? C.danger : isDisabled ? C.subtitle : isSubtle ? C.subtleText : C.icon

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: 'calc(100% - 8px)',
        margin: '0 4px',
        padding: '8px 10px',
        borderRadius: 8,
        background: hovered && !isDisabled ? C.hoverItem : 'transparent',
        border: 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        transition: 'background .12s',
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      {icon && (
        <span style={{ display: 'flex', flexShrink: 0 }}>
          {React.cloneElement(icon, { color: iconColor })}
        </span>
      )}
      <span style={{ fontSize: 13, fontFamily: 'Poppins, sans-serif', fontWeight: 300, color: textColor, lineHeight: 1.4, whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
  )
}

// ─── Full PopoverMenu container ───────────────────────────────────────────────

function PopoverMenu({ items, title, skin = 'light', onClose, width = 204 }) {
  const C = getSkin(skin)
  const [hoverClose, setHoverClose] = useState(false)
  return (
    <div style={{
      width,
      background: C.bg,
      borderRadius: 12,
      border: `1px solid ${C.stroke}`,
      boxShadow: '0px 4px 8px rgba(171, 190, 209, 0.4)',
      padding: '8px 0',
      overflow: 'hidden',
    }}>
      {title && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 14px 8px' }}>
            <span style={{ fontSize: 13, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.title }}>{title}</span>
            {onClose && (
              <button
                onClick={onClose}
                onMouseEnter={() => setHoverClose(true)}
                onMouseLeave={() => setHoverClose(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', borderRadius: 4 }}
              >
                <CloseIcon color={hoverClose ? C.title : C.subtleText} />
              </button>
            )}
          </div>
          <MenuDivider skin={skin} />
        </>
      )}
      {items.map((item, i) =>
        item === '---'
          ? <MenuDivider key={i} skin={skin} />
          : <MenuItem key={i} {...item} skin={skin} />
      )}
    </div>
  )
}

// ─── Standard menu items used across demos ────────────────────────────────────

const FILE_MENU_ITEMS = [
  { icon: <UserIcon />,     label: 'View profile' },
  { icon: <SettingsIcon />, label: 'Preferences' },
  '---',
  { icon: <ShareIcon />,    label: 'Share' },
  { icon: <CopyIcon />,     label: 'Duplicate' },
  { icon: <MoveIcon />,     label: 'Move to' },
  '---',
  { icon: <TrashIcon />,    label: 'Delete', state: 'danger' },
]

const SIMPLE_MENU_ITEMS = [
  { label: 'Edit' },
  { label: 'Rename' },
  '---',
  { label: 'Archive' },
  { label: 'Delete', state: 'danger' },
]

// ─── Live demo ────────────────────────────────────────────────────────────────

function LiveDemo({ t }) {
  const tokens = getComponentTokens(t.id)
  const brandMid = getBrandMid(tokens)
  const [skin, setSkin] = useState('light')
  const [showTitle, setShowTitle] = useState(false)
  const [showIcons, setShowIcons] = useState(true)
  const [open, setOpen] = useState(true)

  const btnBase = (active) => ({
    padding: '5px 12px', borderRadius: 6,
    border: `1px solid ${active ? brandMid : 'var(--stroke-primary)'}`,
    background: active ? brandMid : 'var(--bg-primary)',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: 11, fontWeight: 500, cursor: 'pointer',
  })

  const items = showIcons ? FILE_MENU_ITEMS : SIMPLE_MENU_ITEMS

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24, alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Skin</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['light', 'dark'].map(s => (
              <button key={s} onClick={() => setSkin(s)} style={btnBase(skin === s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Options</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setShowTitle(v => !v)} style={btnBase(showTitle)}>Title</button>
            <button onClick={() => setShowIcons(v => !v)} style={btnBase(showIcons)}>Icons</button>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'start',
        padding: '24px 24px',
        background: /*skin === 'dark' ? '#1c2432' :*/ 'var(--bg-secondary)',
        borderRadius: 10,
        minHeight: 320,
        gap: 24,
        flexWrap: 'wrap',
      }}>
        {/* Trigger zone */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              width: 32, height: 32, borderRadius: 6,
              border: `1px solid ${skin === 'dark' ? '#454f5b' : 'var(--stroke-primary)'}`,
              background: skin === 'dark' ? '#1c2432' : 'var(--bg-primary)',
              color: skin === 'dark' ? '#c4cdd5' : '#637381',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <DotsIcon size={16} color={skin === 'dark' ? '#c4cdd5' : '#637381'} />
          </button>
          {open && (
            <div style={{ position: 'absolute', top: 38, right: 0, zIndex: 10 }}>
              <PopoverMenu
                items={items}
                title={showTitle ? 'Options' : undefined}
                skin={skin}
                onClose={showTitle ? () => setOpen(false) : undefined}
              />
            </div>
          )}
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

function AnatomyDiagram() {
  const badge = (n) => (
    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</span>
  )
  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Diagram */}
      <div style={{ flex: '0 0 220px' }}>
        <div style={{ position: 'relative', background: LIGHT.bg, borderRadius: 12, border: `1px solid ${LIGHT.stroke}`, boxShadow: '0px 4px 8px rgba(171,190,209,0.4)', padding: '8px 0', overflow: 'visible' }}>
          {/* ① Container badge */}
          <div style={{ position: 'absolute', top: -10, right: -10 }}>{badge(1)}</div>

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 14px 8px', position: 'relative' }}>
            <span style={{ fontSize: 13, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: LIGHT.title }}>Options</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CloseIcon color={LIGHT.subtleText} />
            </div>
            <div style={{ position: 'absolute', top: 0, left: 2 }}>{badge(2)}</div>
          </div>

          {/* Divider */}
          <div style={{ position: 'relative' }}>
            <div style={{ height: 1, background: LIGHT.divider, margin: '0' }} />
            <div style={{ position: 'absolute', top: -9, right: -10 }}>{badge(3)}</div>
          </div>

          {/* Default item */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '2px 4px', padding: '8px 10px', borderRadius: 8, position: 'relative' }}>
            <UserIcon color={LIGHT.icon} />
            <span style={{ fontSize: 13, fontFamily: 'Poppins, sans-serif', fontWeight: 300, color: LIGHT.text }}>View profile</span>
            <div style={{ position: 'absolute', top: 0, right: -20 }}>{badge(4)}</div>
          </div>

          {/* Hovered item */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '2px 4px', padding: '8px 10px', borderRadius: 8, background: LIGHT.hoverItem, position: 'relative' }}>
            <SettingsIcon color={LIGHT.icon} />
            <span style={{ fontSize: 13, fontFamily: 'Poppins, sans-serif', fontWeight: 300, color: LIGHT.title }}>Preferences</span>
            <div style={{ position: 'absolute', top: 0, right: -20 }}>{badge(5)}</div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: LIGHT.divider, margin: '4px 0' }} />

          {/* Danger item */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '2px 4px', padding: '8px 10px', borderRadius: 8, position: 'relative' }}>
            <TrashIcon color={LIGHT.danger} />
            <span style={{ fontSize: 13, fontFamily: 'Poppins, sans-serif', fontWeight: 300, color: LIGHT.danger }}>Delete</span>
            <div style={{ position: 'absolute', top: 0, right: -20 }}>{badge(6)}</div>
          </div>
        </div>
      </div>

      {/* Callouts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 260, maxWidth: 360, paddingTop: 4 }}>
        <AnatomyCallout n={1} title="Container" desc="Floating card with 12px radius, 1px border, and a Z2 drop shadow. Fixed width (204px)." />
        <AnatomyCallout n={2} title="Title (optional)" desc="Concise label describing the context of the menu. Accompanied by an optional close icon." />
        <AnatomyCallout n={3} title="Divider" desc="1px horizontal separator that groups related items. Used between logical action groups." />
        <AnatomyCallout n={4} title="Default item" desc="Icon + label row. Icon and text use tertiary/secondary colors at rest." />
        <AnatomyCallout n={5} title="Hovered item" desc="Background fills with secondary color (#f4f6f8 light / #454f5b dark) and text darkens." />
        <AnatomyCallout n={6} title="Danger item" desc="Destructive actions. Text and icon use the danger color (#f6643f). Same hover behavior." />
      </div>
    </div>
  )
}

// ─── States table ─────────────────────────────────────────────────────────────

function StatesSection() {
  const states = [
    { label: 'Default',  item: { icon: <SettingsIcon />, label: 'Preferences',  state: 'default'  } },
    { label: 'Hover',    item: { icon: <SettingsIcon />, label: 'Preferences',  state: 'default'  }, forceHover: true },
    { label: 'Subtle',   item: { icon: <ShareIcon />,    label: 'Share',        state: 'subtle'   } },
    { label: 'Disabled', item: { icon: <CopyIcon />,     label: 'Duplicate',   state: 'disabled' } },
    { label: 'Danger',   item: { icon: <TrashIcon />,    label: 'Delete',       state: 'danger'   } },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
      {states.map(({ label, item, forceHover }) => (
        <div key={label} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '16px 10px', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', borderRadius: 8,
              background: forceHover ? LIGHT.hoverItem : 'transparent',
              minWidth: 110,
            }}>
              {item.icon && React.cloneElement(item.icon, {
                color: item.state === 'danger' ? LIGHT.danger : item.state === 'disabled' ? LIGHT.subtitle : item.state === 'subtle' ? LIGHT.subtleText : LIGHT.icon
              })}
              <span style={{
                fontSize: 12, fontFamily: 'Poppins, sans-serif', fontWeight: 300,
                color: item.state === 'danger' ? LIGHT.danger : item.state === 'disabled' ? LIGHT.subtitle : item.state === 'subtle' ? LIGHT.subtleText : forceHover ? LIGHT.title : LIGHT.text,
                opacity: item.state === 'disabled' ? 0.6 : 1,
              }}>{item.label}</span>
            </div>
          </div>
          <div style={{ padding: '6px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Variant previews ─────────────────────────────────────────────────────────

function VariantSideBySide() {
  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', padding: '32px 24px', background: '#ffffff', borderRadius: 10 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', textAlign: 'center', marginBottom: 12 }}>Light</div>
        <PopoverMenu items={FILE_MENU_ITEMS} title="Options" skin="light" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', textAlign: 'center', marginBottom: 12 }}>Dark</div>
        <PopoverMenu items={FILE_MENU_ITEMS} title="Options" skin="dark" />
      </div>
    </div>
  )
}

// ─── Use case: file manager ───────────────────────────────────────────────────

const FILES = [
  { name: 'Q4 Report.pdf',       type: 'PDF',    size: '2.4 MB',  modified: 'Today' },
  { name: 'Design mockups.fig',  type: 'Figma',  size: '18.1 MB', modified: 'Yesterday' },
  { name: 'Data export.xlsx',    type: 'Excel',  size: '840 KB',  modified: 'Dec 12' },
  { name: 'Project brief.docx',  type: 'Word',   size: '320 KB',  modified: 'Dec 10' },
]

const FILE_ACTIONS = [
  { icon: <FolderIcon />, label: 'Open' },
  { icon: <ShareIcon />,  label: 'Share' },
  { icon: <CopyIcon />,   label: 'Duplicate' },
  { icon: <MoveIcon />,   label: 'Move to' },
  '---',
  { icon: <TrashIcon />,  label: 'Delete', state: 'danger' },
]

function UseCaseMockup({ brandMid }) {
  const [openRow, setOpenRow] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpenRow(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', maxWidth: 720, margin: '0 auto' }}>
      {/* App bar */}
      <div style={{ background: '#141a21', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: '#9ca3af' }}>myapp.io / files</span>
      </div>
      {/* Toolbar */}
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--stroke-primary)', background: 'var(--bg-primary)' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>My Files</span>
        <div style={{ padding: '6px 14px', borderRadius: 6, background: brandMid, color: '#fff', fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>+ Upload</div>
      </div>
      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 90px 40px', gap: 0, padding: '8px 20px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>
        {['Name', 'Type', 'Size', 'Modified', ''].map(h => (
          <div key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</div>
        ))}
      </div>
      {/* Rows */}
      {FILES.map((file, i) => (
        <div key={file.name} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 80px 90px 90px 40px', alignItems: 'center', padding: '10px 20px', borderBottom: i < FILES.length - 1 ? '1px solid var(--stroke-primary)' : 'none', background: 'var(--bg-primary)' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{file.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{file.type}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{file.size}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{file.modified}</div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => setOpenRow(openRow === i ? null : i)}
              style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--stroke-primary)', background: openRow === i ? 'var(--bg-secondary)' : 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <DotsIcon size={14} color="#637381" />
            </button>
            {openRow === i && (
              <div style={{ position: 'absolute', top: 32, right: 0, zIndex: 100 }}>
                <PopoverMenu
                  items={FILE_ACTIONS}
                  skin="light"
                  onClose={() => setOpenRow(null)}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Token reference ──────────────────────────────────────────────────────────

function TokenRow({ name, value, usage }) {
  return (
    <tr>
      <td style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--brand-600)', borderBottom: '1px solid var(--stroke-primary)' }}>{name}</td>
      <td style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{value}</td>
      <td style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{usage}</td>
    </tr>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',      label: 'Overview' },
  { id: 'anatomy',       label: 'Anatomy' },
  { id: 'states',        label: 'States' },
  { id: 'variants',      label: 'Variants' },
  { id: 'usage',         label: 'Usage guidelines' },
  { id: 'use-case',      label: 'Use cases' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'tokens',        label: 'Token reference' },
]

export default function PopoverMenuPage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [activeSection, setActiveSection] = useState('overview')
  const t = VISIBLE_THEMES.find(x => x.id === activeTheme) || VISIBLE_THEMES[0]
  const tokens = getComponentTokens(t.id)
  const brandMid = getBrandMid(tokens)

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
      <div style={{ flex: 1, minWidth: 0, padding: '40px 56px 96px', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Layout & Overlay</span>
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: 0, marginBottom: 8 }}>Popover Menu</h1>
      <Lead>
        The Popover Menu is a floating contextual panel triggered by a user action (click or right-click). It surfaces a list of actions or navigation options without navigating away. It is most often used as a sub-menu for table row actions, card menus, and user account options.
      </Lead>

      {/* ── Overview ────────────────────────────────────────────────────── */}
      <SectionAnchor id="overview" />
      <H2>Overview</H2>
      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
        <div style={{ padding: '24px 28px', background: 'var(--bg-primary)' }}>
          <LiveDemo t={t} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div>
          <H3>When to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>Row-level actions in tables or lists (edit, delete, share…).</li>
            <li>Card or tile overflow menus triggered by a "⋮" button.</li>
            <li>User account/avatar dropdown for profile and settings links.</li>
            <li>Contextual right-click actions on interactive elements.</li>
          </ul>
        </div>
        <div>
          <H3>When not to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>For primary navigation — use Sidebar or Navbar instead.</li>
            <li>When all actions should always be visible — use inline buttons.</li>
            <li>For rich content previews — use a Popover (non-menu) or Drawer.</li>
            <li>If there are more than 8–10 items — consider a dedicated page or modal.</li>
          </ul>
        </div>
      </div>

      <Divider />

      {/* ── Anatomy ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>
      <AnatomyDiagram />

      <Divider />

      {/* ── States ──────────────────────────────────────────────────────── */}
      <SectionAnchor id="states" />
      <H2>States</H2>
      <P>Each menu item can be in one of the following states. States apply independently per row.</P>
      <StatesSection />

      <Divider />

      {/* ── Variants ────────────────────────────────────────────────────── */}
      <SectionAnchor id="variants" />
      <H2>Variants</H2>

      <H3>Light & Dark</H3>
      <P>
        The Popover Menu comes in two skins. Use <strong>Light</strong> on standard page surfaces (white or light gray backgrounds). Use <strong>Dark</strong> on dark surfaces, dark sidebars, or to provide strong contrast on media-heavy interfaces.
      </P>
      <VariantSideBySide />

      <div style={{ marginTop: 28 }}>
        <H3>With title</H3>
        <P>An optional title row can be added when the menu's purpose needs clarification — for example, showing the name of the selected item or describing the action group.</P>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: '28px 24px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Without title</div>
            <PopoverMenu items={SIMPLE_MENU_ITEMS} skin="light" />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>With title + close</div>
            <PopoverMenu items={SIMPLE_MENU_ITEMS} title="File actions" skin="light" onClose={() => {}} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>With icons</div>
            <PopoverMenu items={FILE_MENU_ITEMS.slice(0, 5)} skin="light" />
          </div>
        </div>
      </div>

      <Divider />

      {/* ── Usage rules ─────────────────────────────────────────────────── */}
      <SectionAnchor id="usage" />
      <H2>Usage guidelines</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox
          visual={
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
              <PopoverMenu items={[
                { icon: <SettingsIcon />, label: 'Preferences' },
                { icon: <ShareIcon />,   label: 'Share' },
                '---',
                { icon: <TrashIcon />,   label: 'Delete', state: 'danger' },
              ]} skin="light" />
            </div>
          }
        >
          Group related actions with dividers. Keep the most destructive action (Delete) last and visually distinct in red.
        </DoBox>
        <DontBox
          visual={
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
              <PopoverMenu items={[
                { label: 'Delete', state: 'danger' },
                { label: 'Preferences' },
                { label: 'Share' },
                { label: 'Cancel' },
                { label: 'Open' },
                { label: 'Rename' },
                { label: 'Archive' },
                { label: 'Export' },
              ]} skin="light" />
            </div>
          }
        >
          Don't mix unrelated actions without grouping, and avoid placing destructive actions at the top where they can be triggered accidentally.
        </DontBox>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox>
          Keep labels short and action-oriented: "Delete", "Rename", "Share". If the action needs a qualifier, add it briefly: "Move to archive".
        </DoBox>
        <DontBox>
          Don't use sentence-case labels or descriptions inside menu items ("This will delete the file permanently"). Reserve explanations for a confirmation modal.
        </DontBox>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox>
          Position the menu so it stays within the viewport. Open it below and aligned to the trigger by default; flip to above or the opposite side when close to an edge.
        </DoBox>
        <DontBox>
          Don't keep a Popover Menu open while another one is already open. Opening a second menu should close the first automatically.
        </DontBox>
      </div>

      <Divider />

      {/* ── Use case ────────────────────────────────────────────────────── */}
      <SectionAnchor id="use-case" />
      <H2>Use case — File manager</H2>
      <P>
        Each file row exposes a "⋮" overflow button. Clicking it opens a Popover Menu with row-level actions. Clicking outside or selecting an action closes the menu.
      </P>
      <UseCaseMockup brandMid={brandMid} />

      <Divider />

      {/* ── Accessibility ───────────────────────────────────────────────── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <InfoBox>
        Popover Menus must be navigable by keyboard and correctly communicate their role and state to screen readers.
      </InfoBox>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['role="menu"',        'The popover container should have role="menu". Each item should use role="menuitem" (or "menuitemcheckbox" / "menuitemradio" if applicable).'],
          ['aria-haspopup',      'Add aria-haspopup="menu" to the trigger button so screen readers announce that clicking opens a menu.'],
          ['aria-expanded',      'Toggle aria-expanded="true/false" on the trigger button to reflect whether the menu is currently open.'],
          ['keyboard navigation','Arrow Up/Down navigates between items. Home/End jumps to first/last item. Enter or Space activates. Escape closes the menu and returns focus to the trigger.'],
          ['Focus management',   'When the menu opens, move focus to the first non-disabled item. When it closes, return focus to the trigger.'],
          ['Disabled items',     'Mark disabled items with aria-disabled="true" rather than removing them from the DOM, so screen reader users are aware they exist.'],
          ['Danger items',       'Don\'t rely on color alone to communicate danger. Prefix labels with an icon and consider adding aria-label with explicit destructive intent.'],
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
      <P>Tokens are organized in <Code>popover.light.*</Code> and <Code>popover.dark.*</Code> sub-groups, plus shared structural tokens.</P>

      <H3>Structural</H3>
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Token</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Value</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Usage</th>
            </tr>
          </thead>
          <tbody>
            <TokenRow name="popover.radius"    value="{numbers.radius.xl} — 12px"  usage="Border radius of the floating panel" />
            <TokenRow name="popover.padding-x" value="{numbers.spacing.sm} — 12px" usage="Horizontal padding inside the container" />
            <TokenRow name="popover.padding-y" value="{numbers.spacing.2xs} — 8px" usage="Vertical padding inside the container" />
            <TokenRow name="popover.shadow"    value="Z2 alias"                    usage="Drop shadow: 0px 4px 8px rgba(171,190,209,.4)" />
          </tbody>
        </table>
      </div>

      <H3>Light skin</H3>
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Token</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Value</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Usage</th>
            </tr>
          </thead>
          <tbody>
            <TokenRow name="popover.light.bg"          value="{color.bg.overlay} — #fff"          usage="Panel background" />
            <TokenRow name="popover.light.stroke"       value="{color.stroke.primary} — #c4cdd5"   usage="Panel border" />
            <TokenRow name="popover.light.divider"      value="{color.stroke.subtlest} — #e0e5ea"  usage="Separator between groups" />
            <TokenRow name="popover.light.hover-item"   value="{color.bg.secondary} — #f4f6f8"     usage="Item background on hover" />
            <TokenRow name="popover.light.title"        value="{color.text.secondary} — #454f5b"   usage="Title text and hover item label" />
            <TokenRow name="popover.light.text"         value="{color.text.tertiary} — #637381"    usage="Default item label" />
            <TokenRow name="popover.light.subtle-text"  value="{color.text.subtle} — #919eab"      usage="Subtle / muted item label" />
            <TokenRow name="popover.light.subtitle"     value="{color.text.subtlest} — #c4cdd5"    usage="Disabled / subtitle text" />
            <TokenRow name="popover.light.icon"         value="{color.icon.primary} — #454f5b"     usage="Icon color at rest" />
          </tbody>
        </table>
      </div>

      <H3>Dark skin</H3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Token</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Value</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--stroke-primary)' }}>Usage</th>
            </tr>
          </thead>
          <tbody>
            <TokenRow name="popover.dark.bg"          value="{color.bg.inverse} — #141a21"         usage="Panel background" />
            <TokenRow name="popover.dark.stroke"      value="{color.stroke.secondary} — #919eab"   usage="Panel border" />
            <TokenRow name="popover.dark.divider"     value="{color.stroke.tertiary} — #454f5b"    usage="Separator between groups" />
            <TokenRow name="popover.dark.hover-item"  value="{color.bg.on-black} — #454f5b"        usage="Item background on hover" />
            <TokenRow name="popover.dark.title"       value="{color.text.inverse} — #ffffff"        usage="Title text and hover label" />
            <TokenRow name="popover.dark.text"        value="{color.text.subtlest} — #c4cdd5"      usage="Default item label" />
            <TokenRow name="popover.dark.subtle-text" value="{color.text.subtle} — #919eab"        usage="Subtle / muted item label" />
            <TokenRow name="popover.dark.subtitle"    value="{color.text.tertiary} — #637381"      usage="Disabled / subtitle text" />
            <TokenRow name="popover.dark.icon"        value="{color.icon.tertiary} — #c4cdd5"      usage="Icon color at rest" />
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
