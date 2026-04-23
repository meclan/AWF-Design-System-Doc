import React, { useState, useEffect, useCallback } from 'react'
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

// ─── Token-driven colors ──────────────────────────────────────────────────────
// tabs.indicator   = color.stroke.brand.default (brand mid)
// tabs.text.active = color.text.brand.strongest (brand dark)

function getModalColors(t) {
  const brandMid  = t['tabs.indicator']   || '#07a2b6'
  const brandDark = t['tabs.text.active'] || '#05606d'
  return {
    brandMid,
    brandDark,
    modalBg:        '#ffffff',
    overlayBg:      'rgba(20, 26, 33, 0.62)',
    headerIconBg:   brandMid,
    headerIconColor:'#ffffff',
    headerText:     '#141a21',
    closeDefault:   '#919eab',
    closeHover:     '#454f5b',
    divider:        '#e0e5ea',
    bodyText:       '#454f5b',
    labelText:      '#637381',
    inputBg:        '#ecf6fa',
    inputBorder:    '#c4cdd5',
    shadow:         '0px 8px 16px rgba(171, 190, 209, 0.4)',
    footerShadow:   '0px -4px 16px rgba(0, 0, 0, 0.08)',
    dangerBg:       '#dc2626',
    dangerHover:    '#b91c1c',
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon({ size = 18, color = '#919eab' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}
function LockIcon({ size = 22, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth={2} />
      <path d="M8 11V7a4 4 0 018 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}
function UserIcon({ size = 22, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth={2} />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}
function TrashIcon({ size = 22, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CheckCircleIcon({ size = 48, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <path d="M8 12l3 3 5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function WarningIcon({ size = 48, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 9v4M12 17h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  )
}
function ChevronIcon({ size = 14, color = '#919eab' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Modal building blocks ────────────────────────────────────────────────────

function ModalHeader({ icon, title, onClose, C, centered = false }) {
  const [hoverClose, setHoverClose] = useState(false)
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: centered ? 'center' : 'space-between',
      padding: '20px 28px',
      flexDirection: centered ? 'column' : 'row',
      gap: centered ? 10 : 0,
      position: 'relative',
    }}>
      {centered ? (
        <>
          {onClose && (
            <button
              onClick={onClose}
              onMouseEnter={() => setHoverClose(true)}
              onMouseLeave={() => setHoverClose(false)}
              style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 4 }}
            >
              <CloseIcon color={hoverClose ? C.closeHover : C.closeDefault} />
            </button>
          )}
          {icon && (
            <span style={{ width: 64, height: 64, borderRadius: '50%', background: C.headerIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 4 }}>
              {icon}
            </span>
          )}
          <span style={{ fontSize: 20, fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: C.headerText, textAlign: 'center' }}>{title}</span>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {icon && (
              <span style={{ width: 48, height: 48, borderRadius: '50%', background: C.headerIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
              </span>
            )}
            <span style={{ fontSize: 22, fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: C.headerText }}>{title}</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              onMouseEnter={() => setHoverClose(true)}
              onMouseLeave={() => setHoverClose(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 4, flexShrink: 0 }}
            >
              <CloseIcon color={hoverClose ? C.closeHover : C.closeDefault} />
            </button>
          )}
        </>
      )}
    </div>
  )
}

function ModalDividerLine({ C }) {
  return <div style={{ height: 1, background: C.divider }} />
}

function ModalBody({ children, maxHeight = '55vh' }) {
  return (
    <div style={{ padding: '20px 28px', overflowY: 'auto', maxHeight }}>
      {children}
    </div>
  )
}

function ModalFooter({ children, C, centered = false }) {
  return (
    <>
      <div style={{ height: 1, background: C.divider, boxShadow: C.footerShadow }} />
      <div style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: centered ? 'center' : 'flex-end', gap: 10 }}>
        {children}
      </div>
    </>
  )
}

// ─── Button helpers ───────────────────────────────────────────────────────────

function BtnOutlined({ children, onClick, C, neutral = false }) {
  const [hover, setHover] = useState(false)
  const borderColor = neutral ? '#c4cdd5' : C.brandMid
  const textColor   = neutral ? '#454f5b' : C.brandMid
  const hoverBg     = neutral ? '#f4f6f8' : '#f0faf9'
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '8px 18px',
        borderRadius: 6,
        border: `1px solid ${borderColor}`,
        background: hover ? hoverBg : 'transparent',
        color: textColor,
        fontSize: 13,
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 300,
        cursor: 'pointer',
        transition: 'background .15s',
      }}
    >{children}</button>
  )
}
function BtnFilled({ children, onClick, C, danger = false }) {
  const [hover, setHover] = useState(false)
  const bg = danger ? (hover ? C.dangerHover : C.dangerBg) : (hover ? C.brandDark : C.brandMid)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '8px 18px',
        borderRadius: 6,
        border: 'none',
        background: bg,
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 300,
        cursor: 'pointer',
        transition: 'background .15s',
      }}
    >{children}</button>
  )
}

// ─── Fake field row (for demos) ───────────────────────────────────────────────

function FieldRow({ label, placeholder, C, type = 'text' }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: C.labelText, marginBottom: 5 }}>{label}</div>
      <div style={{
        background: C.inputBg,
        border: `1px solid ${C.inputBorder}`,
        borderRadius: 6,
        padding: '9px 12px',
        fontSize: 13,
        color: C.inputBorder,
        fontFamily: 'Poppins, sans-serif',
      }}>
        {placeholder}
      </div>
    </div>
  )
}

// ─── Change Password modal content ───────────────────────────────────────────

function ChangePasswordContent({ C }) {
  return (
    <>
      <FieldRow label="Current password" placeholder="••••••••" C={C} />
      <FieldRow label="New password" placeholder="Enter new password" C={C} />
      <FieldRow label="Confirm new password" placeholder="Confirm new password" C={C} />
    </>
  )
}

// ─── Add User modal content ───────────────────────────────────────────────────

const STEPPER_STEPS = ['Account', 'Profile', 'Permissions']

function StepperHeader({ step, C }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '10px 28px', background: '#f8fafc', borderBottom: `1px solid ${C.divider}` }}>
      {STEPPER_STEPS.map((s, i) => {
        const isActive    = i === step
        const isCompleted = i < step
        return (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isCompleted ? C.brandDark : isActive ? C.brandMid : '#e0e5ea',
                fontSize: 11, fontWeight: 600,
                color: (isCompleted || isActive) ? '#fff' : '#919eab',
                flexShrink: 0,
              }}>
                {isCompleted ? '✓' : i + 1}
              </span>
              <span style={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', fontWeight: isActive ? 600 : 400, color: isActive ? C.headerText : '#919eab', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPPER_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1, background: i < step ? C.brandMid : '#e0e5ea', margin: '0 8px' }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function AddUserContent({ C }) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
        <FieldRow label="First name" placeholder="Enter first name" C={C} />
        <FieldRow label="Last name" placeholder="Enter last name" C={C} />
      </div>
      <FieldRow label="Email address" placeholder="user@example.com" C={C} />
      <FieldRow label="Role" placeholder="Select a role" C={C} />
    </>
  )
}

// ─── Real modal (fixed overlay) ───────────────────────────────────────────────

function ModalOverlay({ isOpen, onClose, size, variant, C }) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const [step, setStep] = useState(0)

  if (!isOpen) return null

  const widths = { sm: 400, md: 488, lg: 640 }
  const w = widths[size] || 488
  const centered = variant === 'announcement'
  const isMultiStep = variant === 'multistep'

  const headerIcon = variant === 'danger'
    ? <TrashIcon size={22} color="#fff" />
    : isMultiStep
    ? <UserIcon  size={22} color="#fff" />
    : variant === 'announcement'
    ? <CheckCircleIcon size={28} color="#fff" />
    : <LockIcon  size={22} color="#fff" />

  const iconBg = variant === 'danger' ? '#dc2626' : variant === 'announcement' ? '#16a34a' : C.brandMid

  const headerTitle = {
    standard:     'Change Password',
    multistep:    'Add User',
    announcement: 'Changes saved!',
    danger:       'Delete Project',
  }[variant] || 'Modal'

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, background: C.overlayBg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24 }}
    >
      <div style={{ width: w, maxWidth: '95vw', background: C.modalBg, borderRadius: 20, overflow: 'hidden', boxShadow: C.shadow }}>
       
        {/* Header */}
        <ModalHeader
          icon={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: centered ? 64 : 48, height: centered ? 64 : 48, borderRadius: '50%', background: iconBg }}>{headerIcon}</span>}
          title={headerTitle}
          onClose={onClose}
          C={{ ...C, headerIconBg: iconBg }}
          centered={centered}
        />

        <ModalDividerLine C={C} />

        {/* Multi-step stepper header */}
        {isMultiStep && <StepperHeader step={step} C={C} />}

        {/* Body */}
        <ModalBody>
          {variant === 'standard' && <ChangePasswordContent C={C} />}
          {variant === 'multistep' && <AddUserContent C={C} />}
          {variant === 'announcement' && (
            <p style={{ textAlign: 'center', fontSize: 14, color: C.bodyText, lineHeight: 1.75, margin: 0 }}>
              Your profile changes have been saved successfully. All your settings are now up to date.
            </p>
          )}
          {variant === 'danger' && (
            <p style={{ fontSize: 14, color: C.bodyText, lineHeight: 1.75, margin: 0 }}>
              Are you sure you want to delete <strong>"Acme Corp Dashboard"</strong>? This will permanently remove all associated data, members, and history. This action cannot be undone.
            </p>
          )}
        </ModalBody>

        {/* Footer */}
        <ModalFooter C={C} centered={centered}>
          {variant === 'standard' && (
            <>
              <BtnOutlined onClick={onClose} C={C}>Cancel</BtnOutlined>
              <BtnFilled onClick={onClose} C={C}>Save changes</BtnFilled>
            </>
          )}
          {variant === 'multistep' && (
            <>
              <BtnOutlined onClick={onClose} C={C}>Cancel</BtnOutlined>
              {step > 0 && <BtnOutlined onClick={() => setStep(s => s - 1)} C={C}>Previous</BtnOutlined>}
              {step < STEPPER_STEPS.length - 1
                ? <BtnFilled onClick={() => setStep(s => s + 1)} C={C}>Next</BtnFilled>
                : <BtnFilled onClick={onClose} C={C}>Create user</BtnFilled>
              }
            </>
          )}
          {variant === 'announcement' && (
            <BtnFilled onClick={onClose} C={C}>Got it</BtnFilled>
          )}
          {variant === 'danger' && (
            <>
              <BtnOutlined onClick={onClose} C={C} neutral>Cancel</BtnOutlined>
              <BtnFilled onClick={onClose} C={C} danger>Delete</BtnFilled>
            </>
          )}
        </ModalFooter>
      </div>
    </div>
  )
}

// ─── Live demo ────────────────────────────────────────────────────────────────

function ModalLive({ t }) {
  const tokens = getComponentTokens(t.id)
  const C = getModalColors(tokens)
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState('md')
  const [variant, setVariant] = useState('standard')
  const onClose = useCallback(() => setOpen(false), [])

  const btnBase = (active) => ({
    padding: '5px 12px', borderRadius: 6,
    border: `1px solid ${active ? C.brandMid : 'var(--stroke-primary)'}`,
    background: active ? C.brandMid : 'var(--bg-primary)',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: 11, fontWeight: 500, cursor: 'pointer',
  })

  const VARIANTS = [
    { id: 'standard',     label: 'Standard' },
    { id: 'multistep',    label: 'Multi-step' },
    { id: 'announcement', label: 'Announcement' },
    { id: 'danger',       label: 'Danger' },
  ]
  const SIZES = [
    { id: 'sm', label: 'Small' },
    { id: 'md', label: 'Default' },
    { id: 'lg', label: 'Large' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20, alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Variant</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {VARIANTS.map(v => (
              <button key={v.id} onClick={() => setVariant(v.id)} style={btnBase(variant === v.id)}>{v.label}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Size</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {SIZES.map(s => (
              <button key={s.id} onClick={() => setSize(s.id)} style={btnBase(size === s.id)}>{s.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: '10px 24px', borderRadius: 8, border: 'none',
            background: C.brandMid, color: '#fff',
            fontSize: 14, fontFamily: 'Poppins, sans-serif', fontWeight: 400, cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          Open modal →
        </button>
      </div>

      <ModalOverlay isOpen={open} onClose={onClose} size={size} variant={variant} C={C} />
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
  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Inline modal preview — no overlay */}
      <div style={{ position: 'relative', flex: '0 0 340px' }}>
        {/* Overlay hint */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,26,33,.12)', borderRadius: 10, zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, background: C.modalBg, borderRadius: 16, overflow: 'hidden', boxShadow: C.shadow }}>
          {/* ① Overlay label */}
          <div style={{ position: 'absolute', top: -28, left: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Overlay</span>
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 38, height: 38, borderRadius: '50%', background: C.headerIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LockIcon size={18} color="#fff" />
              </span>
              <span style={{ fontSize: 16, fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: C.headerText }}>
                Change Password
              </span>
            </div>
            <span style={{ display: 'flex' }}><CloseIcon size={16} color={C.closeDefault} /></span>
          </div>
          {/* Callout badges on diagram */}
          <div style={{ position: 'absolute', top: 20, left: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
          </div>
          <div style={{ position: 'absolute', top: 14, left: 58, display: 'flex' }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 22 }}>3</span>
          </div>
          <div style={{ position: 'absolute', top: 14, right: 14 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 22 }}>4</span>
          </div>

          <div style={{ height: 1, background: C.divider }} />

          {/* Body */}
          <div style={{ padding: '16px 20px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>5</span>
            {[['Current password', '••••••••'], ['New password', 'Enter new password']].map(([l, p]) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 500, color: C.labelText, marginBottom: 3 }}>{l}</div>
                <div style={{ background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 5, padding: '6px 10px', fontSize: 11, color: C.inputBorder }}>{p}</div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: C.divider, boxShadow: C.footerShadow }} />

          {/* Footer */}
          <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8, position: 'relative' }}>
            <span style={{ position: 'absolute', top: 4, left: 8, width: 18, height: 18, borderRadius: '50%', background: '#141a21', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>6</span>
            <div style={{ padding: '5px 12px', borderRadius: 5, border: `1px solid ${C.brandMid}`, color: C.brandMid, fontSize: 11, fontFamily: 'Poppins, sans-serif' }}>Cancel</div>
            <div style={{ padding: '5px 12px', borderRadius: 5, background: C.brandMid, color: '#fff', fontSize: 11, fontFamily: 'Poppins, sans-serif' }}>Save</div>
          </div>
        </div>
      </div>

      {/* Callouts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 240, maxWidth: 340, paddingTop: 8 }}>
        <AnatomyCallout n={1} title="Overlay" desc="Semi-transparent backdrop that dims the page and blocks interaction with content behind the modal." />
        <AnatomyCallout n={2} title="Container" desc="White card with 20px radius and a soft drop shadow. Sets max-width per size variant." />
        <AnatomyCallout n={3} title="Header icon" desc="Brand-colored circular icon visually identifies the action category." />
        <AnatomyCallout n={4} title="Close button" desc="Dismisses the modal without submitting. Always present for non-blocking actions." />
        <AnatomyCallout n={5} title="Body" desc="Scrollable content area. Contains form fields, descriptions, or structured data." />
        <AnatomyCallout n={6} title="Footer" desc="Sticky action bar with a subtle top shadow. Cancel left, primary CTA right." />
      </div>
    </div>
  )
}

// ─── Sizes section ────────────────────────────────────────────────────────────

function SizesPreview({ C }) {
  const sizes = [
    { key: 'sm', label: 'Small', width: 300, note: '~400px — Confirmations, simple alerts' },
    { key: 'md', label: 'Default', width: 380, note: '~488px — Form dialogs, inputs' },
    { key: 'lg', label: 'Large', width: 460, note: '~640px — Complex forms, multi-section' },
  ]
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
      {sizes.map(s => (
        <div key={s.key} style={{ flex: `0 0 ${s.width}px`, maxWidth: '100%' }}>
          <div style={{ background: C.modalBg, borderRadius: 12, overflow: 'hidden', boxShadow: C.shadow, border: '1px solid var(--stroke-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: C.headerIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LockIcon size={14} color="#fff" />
                </span>
                <span style={{ fontSize: 14, fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: C.headerText }}>Change Password</span>
              </div>
              <CloseIcon size={14} color={C.closeDefault} />
            </div>
            <div style={{ height: 1, background: C.divider }} />
            <div style={{ padding: '12px 18px' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ height: 28, background: C.inputBg, borderRadius: 5, marginBottom: 8, border: `1px solid ${C.inputBorder}` }} />
              ))}
            </div>
            <div style={{ height: 1, background: C.divider }} />
            <div style={{ padding: '10px 18px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <div style={{ padding: '4px 10px', borderRadius: 4, border: `1px solid ${C.brandMid}`, color: C.brandMid, fontSize: 11 }}>Cancel</div>
              <div style={{ padding: '4px 10px', borderRadius: 4, background: C.brandMid, color: '#fff', fontSize: 11 }}>Save</div>
            </div>
          </div>
          <div style={{ marginTop: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.note}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Variant previews ─────────────────────────────────────────────────────────

function StandardPreview({ C }) {
  return (
    <div style={{ maxWidth: 400, background: C.modalBg, borderRadius: 14, overflow: 'hidden', boxShadow: C.shadow }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 40, height: 40, borderRadius: '50%', background: C.headerIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LockIcon size={18} color="#fff" />
          </span>
          <span style={{ fontSize: 16, fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: C.headerText }}>Change Password</span>
        </div>
        <CloseIcon size={16} color={C.closeDefault} />
      </div>
      <div style={{ height: 1, background: C.divider }} />
      <div style={{ padding: '16px 22px' }}>
        {[['Current password', '••••••••'], ['New password', 'Enter new password'], ['Confirm new password', 'Confirm new password']].map(([l, p]) => (
          <div key={l} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: C.labelText, marginBottom: 3 }}>{l}</div>
            <div style={{ background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 5, padding: '7px 10px', fontSize: 12, color: C.inputBorder, fontFamily: 'Poppins, sans-serif' }}>{p}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: C.divider, boxShadow: C.footerShadow }} />
      <div style={{ padding: '12px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <div style={{ padding: '6px 14px', borderRadius: 5, border: `1px solid ${C.brandMid}`, color: C.brandMid, fontSize: 12, fontFamily: 'Poppins, sans-serif' }}>Cancel</div>
        <div style={{ padding: '6px 14px', borderRadius: 5, background: C.brandMid, color: '#fff', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}>Save changes</div>
      </div>
    </div>
  )
}

function AnnouncementPreview({ C }) {
  return (
    <div style={{ maxWidth: 380, background: C.modalBg, borderRadius: 14, overflow: 'hidden', boxShadow: C.shadow }}>
      <div style={{ padding: '24px 22px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative' }}>
        <button style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
          <CloseIcon size={14} color={C.closeDefault} />
        </button>
        <span style={{ width: 60, height: 60, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircleIcon size={28} color="#fff" />
        </span>
        <span style={{ fontSize: 17, fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: C.headerText, textAlign: 'center' }}>Changes saved!</span>
      </div>
      <div style={{ height: 1, background: C.divider }} />
      <div style={{ padding: '14px 22px', textAlign: 'center', fontSize: 13, color: C.bodyText, lineHeight: 1.7 }}>
        Your profile changes have been saved successfully. All your settings are now up to date.
      </div>
      <div style={{ height: 1, background: C.divider, boxShadow: C.footerShadow }} />
      <div style={{ padding: '12px 22px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: '6px 22px', borderRadius: 5, background: C.brandMid, color: '#fff', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}>Got it</div>
      </div>
    </div>
  )
}

function MultiStepPreview({ C }) {
  return (
    <div style={{ maxWidth: 400, background: C.modalBg, borderRadius: 14, overflow: 'hidden', boxShadow: C.shadow }}>
      {/* Stepper bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', background: '#f8fafc', borderBottom: `1px solid ${C.divider}`, gap: 0 }}>
        {STEPPER_STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: i === 0 ? C.brandDark : i === 1 ? C.brandMid : '#e0e5ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: i < 2 ? '#fff' : '#919eab', flexShrink: 0 }}>
                {i === 0 ? '✓' : i + 1}
              </span>
              <span style={{ fontSize: 11, fontFamily: 'Poppins, sans-serif', fontWeight: i === 1 ? 600 : 400, color: i === 1 ? C.headerText : '#919eab', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: i === 0 ? C.brandMid : '#e0e5ea', margin: '0 6px' }} />}
          </React.Fragment>
        ))}
      </div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 38, height: 38, borderRadius: '50%', background: C.headerIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserIcon size={16} color="#fff" />
          </span>
          <span style={{ fontSize: 15, fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: C.headerText }}>Add User</span>
        </div>
        <CloseIcon size={15} color={C.closeDefault} />
      </div>
      <div style={{ height: 1, background: C.divider }} />
      <div style={{ padding: '14px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 10px' }}>
          {['First name', 'Last name'].map(l => (
            <div key={l} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: C.labelText, marginBottom: 3 }}>{l}</div>
              <div style={{ background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 5, padding: '6px 8px', fontSize: 11, color: C.inputBorder }}></div>
            </div>
          ))}
        </div>
        {['Email address', 'Role'].map(l => (
          <div key={l} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: C.labelText, marginBottom: 3 }}>{l}</div>
            <div style={{ background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 5, padding: '6px 8px', fontSize: 11, color: C.inputBorder }}></div>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: C.divider, boxShadow: C.footerShadow }} />
      <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <div style={{ padding: '5px 12px', borderRadius: 5, border: `1px solid ${C.brandMid}`, color: C.brandMid, fontSize: 11, fontFamily: 'Poppins, sans-serif' }}>Previous</div>
        <div style={{ padding: '5px 12px', borderRadius: 5, background: C.brandMid, color: '#fff', fontSize: 11, fontFamily: 'Poppins, sans-serif' }}>Next</div>
      </div>
    </div>
  )
}

function DangerPreview({ C }) {
  return (
    <div style={{ maxWidth: 380, background: C.modalBg, borderRadius: 14, overflow: 'hidden', boxShadow: C.shadow }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 40, height: 40, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrashIcon size={18} color="#fff" />
          </span>
          <span style={{ fontSize: 16, fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: C.headerText }}>Delete Project</span>
        </div>
        <CloseIcon size={16} color={C.closeDefault} />
      </div>
      <div style={{ height: 1, background: C.divider }} />
      <div style={{ padding: '16px 22px', fontSize: 13, color: C.bodyText, lineHeight: 1.75 }}>
        Are you sure you want to delete <strong>"Acme Corp Dashboard"</strong>? This will permanently remove all data. This action cannot be undone.
      </div>
      <div style={{ height: 1, background: C.divider, boxShadow: C.footerShadow }} />
      <div style={{ padding: '12px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <div style={{ padding: '6px 14px', borderRadius: 5, border: `1px solid #C4CDD5`, color: '#454F5B', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}>Cancel</div>
        <div style={{ padding: '6px 14px', borderRadius: 5, background: '#dc2626', color: '#fff', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}>Delete</div>
      </div>
    </div>
  )
}

// ─── Token row ────────────────────────────────────────────────────────────────

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
  { id: 'sizes',         label: 'Sizes' },
  { id: 'variants',      label: 'Variants' },
  { id: 'usage',         label: 'Usage guidelines' },
  { id: 'use-case',      label: 'Use cases' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'tokens',        label: 'Token reference' },
]

export default function ModalPage() {
  const { brandTheme: activeTheme, setBrandTheme: setActiveTheme } = useBrandTheme()
  const [activeSection, setActiveSection] = useState('overview')
  const t = VISIBLE_THEMES.find(x => x.id === activeTheme) || VISIBLE_THEMES[0]
  const tokens = getComponentTokens(t.id)
  const C = getModalColors(tokens)

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
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--text-primary)', margin: 0, marginBottom: 8 }}>Modal</h1>
      <Lead>
        Modals are focused overlay dialogs that interrupt the current experience to capture user input, confirm a destructive action, or deliver an important message. They block interaction with the background until dismissed.
      </Lead>

      {/* ── Overview ────────────────────────────────────────────────────── */}
      <SectionAnchor id="overview" />
      <H2>Overview</H2>
      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
        <div style={{ padding: '24px 28px', background: 'var(--bg-primary)' }}>
          <ModalLive t={t} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div>
          <H3>When to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>Collecting focused input (forms, settings changes).</li>
            <li>Confirming a destructive or irreversible action.</li>
            <li>Displaying a critical message that requires acknowledgement.</li>
            <li>Guiding through a short multi-step workflow.</li>
          </ul>
        </div>
        <div>
          <H3>When not to use</H3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>Complex tasks with many steps — use a dedicated page instead.</li>
            <li>Non-critical notifications — use Toast or Banner.</li>
            <li>Contextual details on hover — use a Tooltip or Popover.</li>
            <li>Side-by-side comparison or reference while interacting — use a Drawer.</li>
          </ul>
        </div>
      </div>

      <Divider />

      {/* ── Anatomy ─────────────────────────────────────────────────────── */}
      <SectionAnchor id="anatomy" />
      <H2>Anatomy</H2>
      <AnatomyDiagram C={C} />

      <Divider />

      {/* ── Sizes ───────────────────────────────────────────────────────── */}
      <SectionAnchor id="sizes" />
      <H2>Sizes</H2>
      <P>Three predefined widths cover the majority of use cases. Choose the smallest size that comfortably contains the content.</P>
      <SizesPreview C={C} />

      <Divider />

      {/* ── Variants ────────────────────────────────────────────────────── */}
      <SectionAnchor id="variants" />
      <H2>Variants</H2>

      <H3>Standard</H3>
      <P>The default modal for form interactions. Header contains a brand-colored icon + title + close button. Body holds fields or content. Footer has Cancel and a primary CTA. Ideal for editing settings, managing records, or any focused data entry.</P>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 24px', background: 'var(--bg-secondary)', borderRadius: 10, marginBottom: 28 }}>
        <StandardPreview C={C} />
      </div>

      <H3>Announcement</H3>
      <P>Centered layout used for confirmations, success states, or alerts that deliver a single message. The icon is larger and centered, the title and body text are centered, and the CTA is minimal (one or two buttons).</P>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 24px', background: 'var(--bg-secondary)', borderRadius: 10, marginBottom: 28 }}>
        <AnnouncementPreview C={C} />
      </div>

      <H3>Multi-step</H3>
      <P>Adds a stepper progress bar above the header to guide users through a sequential workflow without leaving the current context. Completed steps show a checkmark; the active step is highlighted in brand color.</P>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 24px', background: 'var(--bg-secondary)', borderRadius: 10, marginBottom: 28 }}>
        <MultiStepPreview C={C} />
      </div>

      <H3>Danger / Destructive</H3>
      <P>A confirmation modal for irreversible actions. The header icon and primary CTA use a red color instead of the brand color to signal the severity of the action. Always describe the exact consequence in the body.</P>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 24px', background: 'var(--bg-secondary)', borderRadius: 10, marginBottom: 28 }}>
        <DangerPreview C={C} />
      </div>

      <Divider />

      {/* ── Usage rules ─────────────────────────────────────────────────── */}
      <SectionAnchor id="usage" />
      <H2>Usage guidelines</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox
          visual={
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#141a21', fontFamily: 'Poppins, sans-serif', marginBottom: 4 }}>Delete this project?</div>
              <div style={{ fontSize: 12, color: '#454f5b', lineHeight: 1.6 }}>This will remove all data. This cannot be undone.</div>
            </div>
          }
        >
          Write a clear, action-oriented title and explain the consequence in the body. Make the stakes obvious.
        </DoBox>
        <DontBox
          visual={
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#141a21', fontFamily: 'Poppins, sans-serif', marginBottom: 4 }}>Are you sure?</div>
              <div style={{ fontSize: 12, color: '#454f5b' }}>Click OK to confirm.</div>
            </div>
          }
        >
          Don't use vague titles like "Are you sure?" or generic button labels like "OK". Users must understand what will happen.
        </DontBox>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox>
          Keep modal content focused. A modal should do exactly one thing — editing a record, confirming a deletion, or collecting a form. If the task grows complex, use a dedicated page.
        </DoBox>
        <DontBox>
          Don't stack modals on top of other modals. Only one modal can be open at a time. If secondary confirmation is needed, use an inline warning within the existing modal body.
        </DontBox>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <DoBox>
          Always provide an explicit way to cancel — either the close button (✕) or a "Cancel" button in the footer. Users should never feel trapped.
        </DoBox>
        <DontBox>
          Don't use a modal for content that requires scrolling through large amounts of text. If the body content is too long, link to a full page instead.
        </DontBox>
      </div>

      <Divider />

      {/* ── Use case ────────────────────────────────────────────────────── */}
      <SectionAnchor id="use-case" />
      <H2>Use case — Settings page</H2>
      <P>A common pattern: a settings page with a "Change Password" action. Clicking the button opens the standard modal with a form. The background page is dimmed to focus attention on the task.</P>
      <UseCaseMockup C={C} />

      <Divider />

      {/* ── Accessibility ───────────────────────────────────────────────── */}
      <SectionAnchor id="accessibility" />
      <H2>Accessibility</H2>
      <InfoBox>
        Modals must trap focus, support keyboard dismissal, and announce their role to assistive technology. These behaviors are non-negotiable.
      </InfoBox>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['role / aria-modal', 'Set role="dialog" and aria-modal="true" on the modal container to signal to screen readers that background content is inert.'],
          ['aria-labelledby', 'Point aria-labelledby at the modal title element so screen readers announce the dialog name when it opens.'],
          ['Focus trap', 'When a modal opens, move focus to the first interactive element inside it. Tab and Shift+Tab must cycle within the modal only.'],
          ['Focus restore', 'When the modal closes, return focus to the element that triggered it (e.g. the "Change Password" button).'],
          ['Escape to close', 'Pressing Escape must dismiss the modal (except for blocking critical dialogs where explicit confirmation is required).'],
          ['Overlay click', 'Clicking the backdrop should dismiss non-blocking modals. Avoid for destructive confirmations.'],
          ['aria-describedby', 'If the modal has a descriptive body text, reference it with aria-describedby on the dialog element for richer screen reader context.'],
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
            <TokenRow name="modal.bg"                      value="{color.bg.primary}"           usage="Modal card background color" />
            <TokenRow name="modal.radius"                  value="{numbers.radius.xxl} — 20px"  usage="Border radius of the modal card" />
            <TokenRow name="modal.margin"                  value="{numbers.spacing.2xl} — 32px" usage="Inner horizontal padding" />
            <TokenRow name="modal.gap"                     value="{numbers.spacing.xl}"         usage="Vertical gap between modal sections" />
            <TokenRow name="modal.shadow"                  value="Z2 alias"                     usage="Drop shadow on the modal card" />
            <TokenRow name="modal.overlay.bg"              value="{color.bg.inverse}"           usage="Backdrop fill color" />
            <TokenRow name="modal.overlay.opacity"         value="{numbers.opacity.subtle}"     usage="Backdrop opacity level" />
            <TokenRow name="modal.header.icon.bg"          value="{color.bg.brand.default}"     usage="Circular icon container background" />
            <TokenRow name="modal.header.icon.color"       value="{color.icon.on-brand}"        usage="Icon color on brand background" />
            <TokenRow name="modal.header.icon.icon-size"   value="{numbers.icon-size.xxl}"      usage="Icon size inside header badge" />
            <TokenRow name="modal.header.icon.radius"      value="{numbers.radius.full}"        usage="Makes the icon container circular" />
            <TokenRow name="modal.header.text.color"       value="{color.text.primary}"         usage="Modal title text color" />
            <TokenRow name="modal.header.text.font-size"   value="{numbers.font-size.xl} — 24px" usage="Modal title font size" />
            <TokenRow name="modal.header.text.font-weight" value="{numbers.font-weight.semi-bold}" usage="Modal title font weight" />
            <TokenRow name="modal.header.close.color"      value="{color.icon.secondary}"       usage="Close button icon color (default)" />
            <TokenRow name="modal.header.close.hover"      value="{color.icon.primary}"         usage="Close button icon color (hover)" />
            <TokenRow name="modal.header.close.size"       value="{numbers.icon-size.md}"       usage="Close icon size" />
            <TokenRow name="modal.header.gap"              value="{numbers.spacing.sm}"         usage="Gap between header icon and title" />
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

// ─── Use-case mockup (defined after helpers) ──────────────────────────────────

function UseCaseMockup({ C }) {
  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])

  return (
    <>
      <div style={{ border: '1px solid var(--stroke-primary)', borderRadius: 12, overflow: 'hidden', maxWidth: 720, margin: '0 auto' }}>
        {/* Chrome bar */}
        <div style={{ background: '#141a21', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: '#9ca3af' }}>myapp.io / settings / security</span>
        </div>
        {/* Page layout */}
        <div style={{ display: 'flex', background: 'var(--bg-primary)', minHeight: 280 }}>
          {/* Sidebar */}
          <div style={{ width: 180, borderRight: '1px solid var(--stroke-primary)', padding: '20px 14px', flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: '#141a21', marginBottom: 14 }}>Settings</div>
            {[['General', false], ['Security', true], ['Notifications', false], ['Billing', false]].map(([l, a]) => (
              <div key={l} style={{ padding: '7px 10px', borderRadius: 6, fontSize: 13, fontFamily: 'Poppins, sans-serif', fontWeight: a ? 500 : 300, color: a ? C.brandMid : '#454f5b', background: a ? C.inputBg : 'transparent', marginBottom: 2 }}>{l}</div>
            ))}
          </div>
          {/* Main content */}
          <div style={{ flex: 1, padding: '24px 28px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Security</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Manage your password and two-factor authentication.</div>
            {/* Section */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '16px 18px', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Password</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Last changed 3 months ago</div>
                </div>
                <button
                  onClick={() => setOpen(true)}
                  style={{ padding: '7px 16px', borderRadius: 6, border: `1px solid ${C.brandMid}`, background: 'transparent', color: C.brandMid, fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}
                >
                  Change password
                </button>
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Two-factor authentication</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Add an extra layer of security</div>
                </div>
                <div style={{ padding: '7px 16px', borderRadius: 6, border: `1px solid ${C.brandMid}`, color: C.brandMid, fontSize: 12, fontFamily: 'Poppins, sans-serif', opacity: 0.5 }}>Enable 2FA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real modal */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
          style={{ position: 'fixed', inset: 0, background: C.overlayBg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24 }}
        >
          <div style={{ width: 440, maxWidth: '95vw', background: C.modalBg, borderRadius: 20, overflow: 'hidden', boxShadow: C.shadow }}>
            <ModalHeader
              icon={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', background: C.headerIconBg }}><LockIcon size={22} color="#fff" /></span>}
              title="Change Password"
              onClose={onClose}
              C={C}
            />
            <ModalDividerLine C={C} />
            <ModalBody maxHeight="70vh">
              <ChangePasswordContent C={C} />
            </ModalBody>
            <ModalFooter C={C}>
              <BtnOutlined onClick={onClose} C={C}>Cancel</BtnOutlined>
              <BtnFilled onClick={onClose} C={C}>Save changes</BtnFilled>
            </ModalFooter>
          </div>
        </div>
      )}
    </>
  )
}
