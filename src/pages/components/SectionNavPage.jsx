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

// ─── Token-driven colors ──────────────────────────────────────────────────────
// tabs.indicator   = color.stroke.brand.default  (brand mid, changes per theme)
// tabs.text.active = color.text.brand.strongest  (brand dark, changes per theme)

function getSectionNavColors(t) {
  const brandMid  = t['tabs.indicator']   || '#07a2b6'
  const brandDark = t['tabs.text.active'] || '#05606d'
  return {
    brandMid,
    brandDark,
    titleColor:       '#141a21',
    textDefault:      '#454f5b',
    textActive:       brandMid,
    bgActive:         t['sectionnav.bg-active'] || '#ecf6fa',
    numberBgDefault:  '#f4f6f8',
    numberBgActive:   brandMid,
    numberColorDefault: '#637381',
    numberColorActive:  '#ffffff',
    verticalLine:     '#c4cdd5',
    hoverBg:          '#f4f6f8',
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronDown({ size = 16, color = '#454f5b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── SectionNavSubmenu component ─────────────────────────────────────────────

function SectionNavSubmenuItem({ item, activeId, onSelect, C }) {
  const [open, setOpen] = useState(item.defaultOpen ?? false)
  const hasChildren = item.children && item.children.length > 0
  const isParentActive = hasChildren && item.children.some(c => c.id === activeId)

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setOpen(v => !v)
          else if (onSelect) onSelect(item.id)
        }}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '8px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontSize: 15,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 300,
          color: isParentActive ? C.titleColor : C.textDefault,
          lineHeight: 1.4,
        }}>
          {item.label}
        </span>
        {hasChildren && (
          <span style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>
            <ChevronDown size={16} color={C.textDefault} />
          </span>
        )}
      </button>

      {hasChildren && open && (
        <div style={{ position: 'relative', marginLeft: 12, paddingLeft: 16, marginBottom: 4 }}>
          {/* vertical line */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: C.verticalLine }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {item.children.map(child => {
              const isActive = child.id === activeId
              return (
                <button
                  key={child.id}
                  onClick={() => onSelect && onSelect(child.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '5px 0',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{
                    fontSize: 14,
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: isActive ? 500 : 300,
                    color: isActive ? C.textActive : C.textDefault,
                    lineHeight: 1.4,
                  }}>
                    {child.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function SectionNavSubmenu({ title, items, activeId, onSelect, C }) {
  return (
    <div style={{ width: 220 }}>
      {title && (
        <div style={{ fontSize: 18, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.titleColor, marginBottom: 16 }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map(item => (
          <SectionNavSubmenuItem key={item.id} item={item} activeId={activeId} onSelect={onSelect} C={C} />
        ))}
      </div>
    </div>
  )
}

// ─── SectionNavNumbered component ────────────────────────────────────────────

function SectionNavNumbered({ title, items, activeId, onSelect, C }) {
  return (
    <div style={{ width: 220 }}>
      {title && (
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: C.textDefault, marginBottom: 12 }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item, i) => {
          const isActive = item.id === activeId
          return (
            <button
              key={item.id}
              onClick={() => onSelect && onSelect(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 8,
                borderRadius: 8,
                background: isActive ? C.bgActive : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background .15s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.hoverBg }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Number badge */}
              <span style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                flexShrink: 0,
                background: isActive ? C.numberBgActive : C.numberBgDefault,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
                color: isActive ? C.numberColorActive : C.numberColorDefault,
                transition: 'background .15s, color .15s',
              }}>
                {i + 1}
              </span>
              <span style={{
                fontSize: 15,
                fontFamily: 'Poppins, sans-serif',
                fontWeight: isActive ? 500 : 300,
                color: isActive ? C.textActive : C.textDefault,
                lineHeight: 1.35,
              }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Live demo ────────────────────────────────────────────────────────────────

const SUBMENU_ITEMS = [
  {
    id: 'general', label: 'General',
    defaultOpen: true,
    children: [
      { id: 'profile',      label: 'Profile' },
      { id: 'account',      label: 'Account' },
      { id: 'appearance',   label: 'Appearance' },
    ],
  },
  {
    id: 'workspace', label: 'Workspace',
    defaultOpen: false,
    children: [
      { id: 'members',      label: 'Members' },
      { id: 'billing',      label: 'Billing' },
      { id: 'integrations', label: 'Integrations' },
    ],
  },
  { id: 'security',      label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
]

const NUMBERED_ITEMS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'usage',        label: 'Usage' },
  { id: 'props',        label: 'Props' },
  { id: 'examples',     label: 'Examples' },
]

function SectionNavLive({ t }) {
  const C = getSectionNavColors(getComponentTokens(t.id))
  const [variant, setVariant] = useState('submenu')
  const [activeId, setActiveId] = useState('account')

  const btnBase = (active) => ({
    padding: '6px 14px',
    borderRadius: 6,
    border: `1px solid ${active ? C.brandMid : 'var(--stroke-primary)'}`,
    background: active ? C.brandMid : 'var(--bg-primary)',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', minHeight: 260 }}>
        {['submenu', 'numbered'].map(v => (
          <button key={v} onClick={() => { setVariant(v); setActiveId(v === 'submenu' ? 'account' : 'usage') }} style={btnBase(variant === v)}>
            {v === 'submenu' ? 'Submenu' : 'Numbered'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px', background: 'var(--bg-primary)', borderRadius: 10, minHeight: 260 }}>
        {variant === 'submenu' ? (
          <SectionNavSubmenu
            title="Settings"
            items={SUBMENU_ITEMS}
            activeId={activeId}
            onSelect={setActiveId}
            C={C}
          />
        ) : (
          <SectionNavNumbered
            title="On this page"
            items={NUMBERED_ITEMS}
            activeId={activeId}
            onSelect={setActiveId}
            C={C}
          />
        )}
      </div>
    </div>
  )
}

// ─── Anatomy callout helpers ──────────────────────────────────────────────────

function AnatomyCallout({ number, title, description }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        {number}
      </span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{description}</div>
      </div>
    </div>
  )
}

// ─── Static anatomy diagrams ──────────────────────────────────────────────────

function AnatomySubmenu() {
  const C = getSectionNavColors({})
  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Diagram */}
      <div style={{ padding: '20px 24px', background: 'var(--bg-secondary)', borderRadius: 10, minWidth: 200 }}>
        <div style={{ position: 'relative' }}>
          {/* 1 - title */}
          <div style={{ fontSize: 16, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: C.titleColor, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>Settings</span>
            <span style={{ fontSize: 10, width: 16, height: 16, borderRadius: '50%', background: '#141a21', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>1</span>
          </div>
          {/* Parent row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', gap: 8 }}>
            <span style={{ fontSize: 14, fontFamily: 'Poppins, sans-serif', fontWeight: 300, color: C.textDefault, display: 'flex', gap: 4, alignItems: 'center' }}>
              General
              <span style={{ fontSize: 10, width: 16, height: 16, borderRadius: '50%', background: '#141a21', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</span>
            </span>
            <ChevronDown size={14} color={C.textDefault} />
          </div>
          {/* Sub-items */}
          <div style={{ position: 'relative', marginLeft: 12, paddingLeft: 14 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: C.verticalLine }} />
            <span style={{ fontSize: 10, width: 16, height: 16, borderRadius: '50%', background: '#141a21', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: 4 }}>3</span>
            {['Profile', 'Account', 'Appearance'].map((l, i) => (
              <div key={l} style={{ padding: '5px 0', fontSize: 13, fontFamily: 'Poppins, sans-serif', fontWeight: l === 'Account' ? 500 : 300, color: l === 'Account' ? C.textActive : C.textDefault }}>
                {l}
                {l === 'Account' && <span style={{ fontSize: 10, width: 16, height: 16, borderRadius: '50%', background: '#141a21', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginLeft: 4 }}>4</span>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0' }}>
            <span style={{ fontSize: 14, fontFamily: 'Poppins, sans-serif', fontWeight: 300, color: C.textDefault }}>Workspace</span>
            <ChevronDown size={14} color={C.textDefault} />
          </div>
          <div style={{ padding: '7px 0', fontSize: 14, fontFamily: 'Poppins, sans-serif', fontWeight: 300, color: C.textDefault }}>Security</div>
        </div>
      </div>
      {/* Callouts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 260, maxWidth: 360 }}>
        <AnatomyCallout number={1} title="Title" description="Optional label that names the navigation group (e.g. 'Settings')." />
        <AnatomyCallout number={2} title="Parent section" description="Collapsible group header. Shows a chevron to indicate expandable sub-items." />
        <AnatomyCallout number={3} title="Vertical track" description="1px line aligning sub-items under their parent section." />
        <AnatomyCallout number={4} title="Active sub-item" description="Currently selected item — brand color text, medium weight." />
      </div>
    </div>
  )
}

function AnatomyNumbered() {
  const C = getSectionNavColors({})
  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Diagram */}
      <div style={{ padding: '20px 24px', background: 'var(--bg-secondary)', borderRadius: 10, minWidth: 200 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: C.textDefault, marginBottom: 10, display: 'flex', gap: 4, alignItems: 'center' }}>
          On this page
          <span style={{ fontSize: 10, width: 16, height: 16, borderRadius: '50%', background: '#141a21', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>1</span>
        </div>
        {NUMBERED_ITEMS.map((item, i) => {
          const isActive = item.id === 'usage'
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8, background: isActive ? C.bgActive : 'transparent' }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: isActive ? C.numberBgActive : C.numberBgDefault, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: isActive ? C.numberColorActive : C.numberColorDefault, flexShrink: 0 }}>
                {i + 1}
                {i === 0 && <span style={{ position: 'absolute', fontSize: 10, width: 16, height: 16, borderRadius: '50%', background: '#141a21', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginLeft: 28, marginTop: -28 }}>2</span>}
              </span>
              <span style={{ fontSize: 14, fontFamily: 'Poppins, sans-serif', fontWeight: isActive ? 500 : 300, color: isActive ? C.textActive : C.textDefault }}>
                {item.label}
                {isActive && <span style={{ fontSize: 10, width: 16, height: 16, borderRadius: '50%', background: '#141a21', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginLeft: 4 }}>3</span>}
              </span>
            </div>
          )
        })}
      </div>
      {/* Callouts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 260, maxWidth: 360 }}>
        <AnatomyCallout number={1} title="Section title" description="Short uppercase label indicating the nav's purpose (e.g. 'On this page')." />
        <AnatomyCallout number={2} title="Number badge" description="Circular badge showing the position. Fills with brand color when active." />
        <AnatomyCallout number={3} title="Active row" description="Highlighted row with brand-colored badge, text, and a subtle tinted background." />
      </div>
    </div>
  )
}

// ─── States table ─────────────────────────────────────────────────────────────

function StatesTable({ C }) {
  const states = [
    { name: 'Default',   color: C.textDefault, weight: 300, bg: 'transparent',  badge: null },
    { name: 'Hover',     color: C.textDefault, weight: 300, bg: C.hoverBg,      badge: null },
    { name: 'Active',    color: C.textActive,  weight: 500, bg: C.bgActive,     badge: C.numberBgActive },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {states.map(s => (
        <div key={s.name} style={{ border: '1px solid var(--stroke-primary)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '20px 16px', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8, background: s.bg, width: 160 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: s.badge ?? C.numberBgDefault, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: s.badge ? '#fff' : C.numberColorDefault, flexShrink: 0 }}>
                2
              </span>
              <span style={{ fontSize: 14, fontFamily: 'Poppins, sans-serif', fontWeight: s.weight, color: s.color }}>Installation</span>
            </div>
          </div>
          <div style={{ padding: '8px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Use case mockup ──────────────────────────────────────────────────────────

function UseCaseMockup({ C }) {
  const [activeId, setActiveId] = useState('billing')
  const CONTENT = {
    profile:      { title: 'Profile', desc: 'Update your name, avatar and bio.' },
    account:      { title: 'Account', desc: 'Manage your email, password, and linked accounts.' },
    appearance:   { title: 'Appearance', desc: 'Choose your preferred theme and display density.' },
    members:      { title: 'Members', desc: 'Invite people and manage their roles in your workspace.' },
    billing:      { title: 'Billing', desc: 'View invoices, update your plan, and manage payment methods.' },
    integrations: { title: 'Integrations', desc: 'Connect third-party tools like Slack, Jira, or GitHub.' },
    security:     { title: 'Security', desc: 'Configure 2FA, manage sessions, and view audit logs.' },
    notifications:{ title: 'Notifications', desc: 'Control how and when you receive notifications.' },
  }
  const content = CONTENT[activeId] || CONTENT.billing
  return (
    <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', maxWidth: 720, margin: '0 auto' }}>
      {/* App bar */}
      <div style={{ background: '#141a21', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: '#9ca3af' }}>myapp.io / settings</span>
      </div>
      {/* Layout */}
      <div style={{ display: 'flex', background: 'var(--bg-primary)', minHeight: 300 }}>
        {/* Sidebar */}
        <div style={{ width: 200, borderRight: '1px solid var(--stroke-primary)', padding: '24px 16px', flexShrink: 0 }}>
          <SectionNavSubmenu
            title="Settings"
            items={[
              { id: 'general-grp', label: 'General', defaultOpen: true, children: [
                { id: 'profile',    label: 'Profile' },
                { id: 'account',    label: 'Account' },
                { id: 'appearance', label: 'Appearance' },
              ]},
              { id: 'workspace-grp', label: 'Workspace', defaultOpen: true, children: [
                { id: 'members',      label: 'Members' },
                { id: 'billing',      label: 'Billing' },
                { id: 'integrations', label: 'Integrations' },
              ]},
              { id: 'security',      label: 'Security' },
              { id: 'notifications', label: 'Notifications' },
            ]}
            activeId={activeId}
            onSelect={setActiveId}
            C={C}
          />
        </div>
        {/* Main content */}
        <div style={{ flex: 1, padding: '32px 28px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{content.title}</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{content.desc}</div>
          <div style={{ height: 1, background: 'var(--stroke-primary)', marginBottom: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1, 2].map(i => (
              <div key={i} style={{ height: 36, borderRadius: 6, background: 'var(--bg-secondary)', width: i === 1 ? '70%' : '50%' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Token reference ──────────────────────────────────────────────────────────

function TokenRow({ name, value, resolved }) {
  return (
    <tr>
      <td style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--brand-600)', borderBottom: '1px solid var(--stroke-primary)' }}>{name}</td>
      <td style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{value}</td>
      <td style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--stroke-primary)' }}>{resolved}</td>
    </tr>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SectionNavPage() {
  const [themeId, setThemeId] = useState(VISIBLE_THEMES[0].id)
  const t = VISIBLE_THEMES.find(t => t.id === themeId) || VISIBLE_THEMES[0]
  const tokens = getComponentTokens(t.id)
  const C = getSectionNavColors(tokens)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 32px 96px', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Navigation</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: 0 }}>Section Nav</h1>
        {/* Theme selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Theme:</span>
          {VISIBLE_THEMES.map(th => (
            <button
              key={th.id}
              onClick={() => setThemeId(th.id)}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                border: `1px solid ${th.id === themeId ? C.brandMid : 'var(--stroke-primary)'}`,
                background: th.id === themeId ? C.brandMid : 'var(--bg-primary)',
                color: th.id === themeId ? '#fff' : 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {th.name}
            </button>
          ))}
        </div>
      </div>
      <Lead>
        Section Nav provides in-page or section-level navigation. It comes in two variants: a <strong>submenu</strong> for hierarchical settings-style navigation and a <strong>numbered</strong> list for anchored in-page navigation ("On this page").
      </Lead>

      {/* ── Overview ────────────────────────────────────────────────────── */}
      <SectionAnchor id="overview" />
      <H2>Overview</H2>
      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
        <div style={{ padding: '24px 28px', background: 'var(--bg-secondary)' }}>
          <SectionNavLive t={t} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div>
          <H3>When to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>Navigating between multiple settings sections or grouped pages.</li>
            <li>Showing anchor links to headings within a long document page.</li>
            <li>Providing persistent, visible location awareness within a layout.</li>
          </ul>
        </div>
        <div>
          <H3>When not to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>Top-level app navigation — use a Sidebar or Navbar instead.</li>
            <li>When there are fewer than 3 items — a simple link list suffices.</li>
            <li>For wizard-style step tracking — use Stepper instead.</li>
          </ul>
        </div>
      </div>

      <Divider />

      {/* ── Anatomy ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>
      <H3>Submenu variant</H3>
      <AnatomySubmenu />
      <H3 style={{ marginTop: 32 }}>Numbered variant</H3>
      <AnatomyNumbered />

      <Divider />

      {/* ── States ──────────────────────────────────────────────────────── */}
      <SectionAnchor id="states" />
      <H2>States</H2>
      <P>Both variants share the same interactive states for their row items.</P>
      <StatesTable C={C} />

      <Divider />

      {/* ── Variants ────────────────────────────────────────────────────── */}
      <SectionAnchor id="variants" />
      <H2>Variants</H2>

      <H3>Submenu</H3>
      <P>
        Used for hierarchical navigation with grouped sections. Each parent can be expanded or collapsed to reveal child items. Only one level of nesting is supported. The active sub-item is highlighted in brand color; the parent stays default.
      </P>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px', background: 'var(--bg-secondary)', borderRadius: 10, marginBottom: 24 }}>
        <SectionNavSubmenu
          title="Settings"
          items={SUBMENU_ITEMS}
          activeId="account"
          C={C}
        />
      </div>

      <H3>Numbered</H3>
      <P>
        Used to list anchored headings in a long document, typically in a right rail. Each item has a numbered badge; the active row gets a brand-filled badge and a tinted background. Intended for one level of items only — no nesting.
      </P>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px', background: 'var(--bg-secondary)', borderRadius: 10, marginBottom: 24 }}>
        <SectionNavNumbered
          title="On this page"
          items={NUMBERED_ITEMS}
          activeId="usage"
          C={C}
        />
      </div>

      <Divider />

      {/* ── Usage rules ─────────────────────────────────────────────────── */}
      <SectionAnchor id="usage" />
      <H2>Usage guidelines</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <DoBox
          visual={
            <SectionNavSubmenu
              title="Settings"
              items={[{ id: 'g', label: 'General', defaultOpen: true, children: [{ id: 'p', label: 'Profile' }, { id: 'a', label: 'Account' }] }]}
              activeId="a"
              C={getSectionNavColors({})}
            />
          }
        >
          Expand only the section that contains the active item. Collapse others by default to reduce visual noise.
        </DoBox>
        <DontBox
          visual={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 180 }}>
              {['Profile', 'Account', 'Appearance', 'Members', 'Billing', 'Integrations', 'Security', 'Notifications'].map(l => (
                <div key={l} style={{ fontSize: 13, fontFamily: 'Poppins, sans-serif', color: '#454f5b' }}>{l}</div>
              ))}
            </div>
          }
        >
          Don't flatten all items into a single list when there is clear grouping — use the submenu variant's collapsible groups.
        </DontBox>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <DoBox
          visual={
            <SectionNavNumbered
              title="On this page"
              items={NUMBERED_ITEMS.slice(0, 4)}
              activeId="installation"
              C={getSectionNavColors({})}
            />
          }
        >
          Use the numbered variant in a right rail, only when a left nav already exists. It gives readers a quick map of the page.
        </DoBox>
        <DontBox
          visual={
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SectionNavNumbered
                title="On this page"
                items={[...NUMBERED_ITEMS, { id: 'faq', label: 'FAQ' }, { id: 'changelog', label: 'Changelog' }, { id: 'support', label: 'Support' }, { id: 'more', label: 'More resources' }]}
                activeId="faq"
                C={getSectionNavColors({})}
              />
            </div>
          }
        >
          Avoid listing more than 6–7 items in the numbered variant. If the page has many sections, consider grouping them with headings instead.
        </DontBox>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <DoBox>
          Keep labels short (1–4 words). They should match the section headings exactly so the user can orient themselves.
        </DoBox>
        <DontBox>
          Don't add more than one level of nesting in the submenu variant. Deep hierarchies are hard to scan and belong in a sidebar.
        </DontBox>
      </div>

      <Divider />

      {/* ── Use case ────────────────────────────────────────────────────── */}
      <SectionAnchor id="use-case" />
      <H2>Use case — Settings page</H2>
      <P>
        The submenu variant is the standard pattern for settings pages. The navigation lives in a left rail, allowing quick switching between grouped settings sections without a full page reload.
      </P>
      <UseCaseMockup C={C} />

      <Divider />

      {/* ── Accessibility ───────────────────────────────────────────────── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <InfoBox>
        Section Nav items are interactive buttons — they must be keyboard-navigable and communicate active state to assistive technology.
      </InfoBox>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['role', 'Use <nav> as the container with an aria-label (e.g., "Settings navigation" or "On this page").'],
          ['aria-current', 'Apply aria-current="page" or aria-current="true" to the active item.'],
          ['aria-expanded', 'For submenu parents, toggle aria-expanded="true/false" on the button when the section opens or closes.'],
          ['keyboard', 'All items and chevron buttons must be reachable via Tab and activatable with Enter or Space.'],
          ['focus', 'Ensure visible focus rings on all interactive elements. Do not suppress :focus-visible styles.'],
          ['color', "Active state must not rely on color alone — font-weight change from light to medium provides a second cue."],
        ].map(([label, text]) => (
          <div key={label} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <Code>{label}</Code>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{text}</span>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Token reference ─────────────────────────────────────────────── */}
      <SectionAnchor id="tokens" />
      <H2>Token reference</H2>
      <P>Section Nav has minimal design tokens. Brand colors are derived from shared semantic tokens.</P>

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
            <TokenRow name="sectionnav.font-size.sub-menu" value="{numbers.font-size.sm}" resolved="Sub-item font size" />
            <TokenRow name="tabs.indicator" value="color.stroke.brand.default" resolved="Active text & badge color (brand mid)" />
            <TokenRow name="tabs.text.active" value="color.text.brand.strongest" resolved="Active text on dark bg (brand dark)" />
            <TokenRow name="sectionnav.text.default" value="#454f5b" resolved="Default item text color" />
            <TokenRow name="sectionnav.text.active" value="#07a2b6 (brand mid)" resolved="Active sub-item text" />
            <TokenRow name="sectionnav.bg-active" value="#ecf6fa" resolved="Active row background (numbered)" />
            <TokenRow name="sectionnav.number.bg.default" value="#f4f6f8" resolved="Number badge background (default)" />
            <TokenRow name="sectionnav.number.color.default" value="#637381" resolved="Number badge text (default)" />
          </tbody>
        </table>
      </div>

    </div>
  )
}
