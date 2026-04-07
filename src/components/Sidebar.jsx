import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const nav = [
  {
    section: 'Get started',
    items: [
      { label: 'Overview',     path: '/',             icon: '◈' },
      { label: 'Architecture', path: '/architecture', icon: '⬡' },
      { label: 'Changelog',    path: '/changelog',    icon: '◎' },
    ]
  },
  {
    section: 'Foundations',
    items: [
      { label: 'Color',      path: '/tokens/color',      icon: '◐' },
      { label: 'Typography', path: '/tokens/typography', icon: 'Aa' },
      { label: 'Spacing',    path: '/tokens/spacing',    icon: '⊹' },
      { label: 'Elevation',  path: '/tokens/elevation',  icon: '◫' },
      { label: 'Motion',     path: '/tokens/motion',     icon: '◌' },
    ]
  },
  {
    section: 'Components',
    items: [
      { label: 'Button',      path: '/components/button',      icon: '▣' },
      { label: 'Icon Button', path: '/components/icon-button', icon: '⊡' },
      { label: 'Input field', path: '/components/input',       icon: '▤' },
      { label: 'Badge',       path: '/components/badge',       icon: '◉' },
      { label: 'Table',       path: '/components/table',       icon: '▦' },
      {
        label: 'Navigation',
        icon: '◧',
        children: [
          { label: 'Controls',    path: '/components/nav',        icon: '⇄' },
          { label: 'Navbar',      path: '/components/navbar',     icon: '☰' },
          { label: 'Side Panel',  path: '/components/side-panel', icon: '▷' },
        ]
      },
      {
        label: 'Feedback',
        icon: '◈',
        children: [
          { label: 'Banner',   path: '/components/feedback/banner',   icon: '⊟' },
          { label: 'Toast',    path: '/components/feedback/toast',    icon: '◱' },
          { label: 'Spinner',  path: '/components/feedback/spinner',  icon: '◌' },
          { label: 'Skeleton', path: '/components/feedback/skeleton', icon: '▭' },
        ]
      },
      { label: 'Overlay',  path: '/components/overlay',  icon: '◱' },
      { label: 'Forms',    path: '/components/forms',    icon: '▢' },
    ]
  },
  {
    section: 'Theming',
    items: [
      { label: 'Products',  path: '/theming/products', icon: '◑' },
      { label: 'Dark mode', path: '/theming/dark',     icon: '◗' },
    ]
  }
]

// Collect all child paths for a group item
function childPaths(item) {
  return item.children?.map(c => c.path) ?? []
}

export default function Sidebar() {
  const location  = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  // Track which expandable groups are open (by label)
  // Auto-expand groups whose child is active
  const [expandedGroups, setExpandedGroups] = useState(() => {
    const initial = new Set()
    nav.forEach(section => {
      section.items.forEach(item => {
        if (item.children && item.children.some(c => location.pathname === c.path)) {
          initial.add(item.label)
        }
      })
    })
    return initial
  })

  const toggleGroup = (label) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  // Is any child of this group item currently active?
  const isGroupActive = (item) => item.children?.some(c => location.pathname === c.path) ?? false

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: collapsed ? '8px 0' : '7px 20px',
    justifyContent: collapsed ? 'center' : 'flex-start',
    fontSize: 13,
    fontWeight: isActive ? 500 : 400,
    color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
    background: isActive ? 'var(--brand-50)' : 'transparent',
    borderLeft: isActive ? '2px solid var(--brand-600)' : '2px solid transparent',
    transition: 'all 120ms',
    textDecoration: 'none',
  })

  return (
    <aside style={{
      width: collapsed ? 60 : 'var(--sidebar-width)',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      borderRight: '1px solid var(--stroke-primary)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 200ms ease',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>

      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '24px 20px 20px',
        borderBottom: '1px solid var(--stroke-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 10,
      }}>
        {!collapsed && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'linear-gradient(135deg, var(--brand-400), var(--brand-600))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '-.5px'
              }}>ADS</div>
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-.2px' }}>Arcad</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2, letterSpacing: '.08em', textTransform: 'uppercase', paddingLeft: 36 }}>
              Design System
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'var(--bg-secondary)',
            color: 'var(--text-tertiary)',
            fontSize: 14, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {nav.map(group => (
          <div key={group.section} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', padding: '12px 20px 4px' }}>
                {group.section}
              </div>
            )}
            {group.items.map(item => {
              // Item with children (expandable group)
              if (item.children) {
                const isOpen    = expandedGroups.has(item.label)
                const groupActive = isGroupActive(item)

                if (collapsed) {
                  // In collapsed mode, show the group icon pointing to the first child
                  return (
                    <NavLink key={item.label} to={item.children[0].path}
                      style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '8px 0', fontSize: 14, color: groupActive ? 'var(--brand-600)' : 'var(--text-secondary)',
                        textDecoration: 'none',
                      })}>
                      <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{item.icon}</span>
                    </NavLink>
                  )
                }

                return (
                  <div key={item.label}>
                    {/* Group header button */}
                    <button
                      onClick={() => toggleGroup(item.label)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '7px 20px',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: groupActive ? 500 : 400,
                        color: groupActive ? 'var(--brand-600)' : 'var(--text-secondary)',
                        borderLeft: groupActive ? '2px solid var(--brand-600)' : '2px solid transparent',
                        transition: 'all 120ms', textAlign: 'left',
                      }}>
                      <span style={{ fontSize: 14, flexShrink: 0, width: 18, textAlign: 'center' }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
                    </button>

                    {/* Children */}
                    {isOpen && (
                      <div style={{ paddingLeft: 28, borderLeft: '1px solid var(--stroke-primary)', marginLeft: 28, marginBottom: 4 }}>
                        {item.children.map(child => (
                          <NavLink key={child.path} to={child.path}
                            style={({ isActive }) => ({
                              display: 'flex', alignItems: 'center', gap: 8,
                              padding: '6px 16px 6px 8px',
                              fontSize: 12, fontWeight: isActive ? 500 : 400,
                              color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
                              background: isActive ? 'var(--brand-50)' : 'transparent',
                              borderRadius: 6, textDecoration: 'none',
                              transition: 'all 120ms',
                            })}>
                            <span style={{ fontSize: 12, flexShrink: 0, width: 16, textAlign: 'center' }}>{child.icon}</span>
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              // Regular item
              return (
                <NavLink key={item.path} to={item.path} end={item.path === '/'} style={linkStyle}>
                  <span style={{ fontSize: 14, flexShrink: 0, width: 18, textAlign: 'center' }}>{item.icon}</span>
                  {!collapsed && item.label}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--stroke-primary)', fontSize: 11, color: 'var(--text-tertiary)' }}>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>v1.0.0 — March 2026</div>
          <div>ARCAD Software</div>
        </div>
      )}
    </aside>
  )
}
