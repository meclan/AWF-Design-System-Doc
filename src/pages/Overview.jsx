import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { stats, componentList, products, layers } from '../data/tokens.js'

const categories = [...new Set(componentList.map(c => c.category))]

function StatCard({ value, label, delay = 0 }) {
  return (
    <div style={{
      background: 'var(--bg-primary)',
      border: '1px solid var(--stroke-primary)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px 28px',
      animation: `fadeUp 400ms ease ${delay}ms both`,
    }}>
      <div style={{
        fontSize: 36, fontWeight: 700, letterSpacing: '-1.5px',
        color: 'var(--brand-600)', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6, fontWeight: 500, letterSpacing: '.04em' }}>
        {label}
      </div>
    </div>
  )
}

function LayerCard({ layer, index }) {
  return (
    <div style={{
      background: 'var(--bg-primary)',
      border: '1px solid var(--stroke-primary)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      animation: `fadeUp 400ms ease ${index * 80 + 100}ms both`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: layer.color,
        opacity: .7,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: layer.color }}>
          Layer {index + 1}
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: layer.color,
          background: layer.color + '18',
          padding: '3px 10px', borderRadius: 99,
        }}>
          {layer.count} tokens
        </div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
        {layer.name}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
        {layer.description}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {layer.tokens.map(t => (
          <code key={t} style={{
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--text-tertiary)',
            background: 'var(--bg-secondary)',
            padding: '3px 8px', borderRadius: 4,
            width: 'fit-content',
          }}>{t}</code>
        ))}
      </div>
    </div>
  )
}

function ComponentGrid() {
  return (
    <div>
      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '.1em',
            textTransform: 'uppercase', color: 'var(--text-tertiary)',
            marginBottom: 8,
          }}>{cat}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {componentList.filter(c => c.category === cat).map(comp => (
              <Link key={comp.name} to={comp.path} style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--stroke-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'border-color 130ms, box-shadow 130ms',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--brand-400)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--stroke-primary)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{comp.name}</span>
                <span style={{
                  fontSize: 10, color: 'var(--brand-600)', fontWeight: 600,
                  background: 'var(--brand-50)', padding: '1px 6px', borderRadius: 99,
                  fontVariantNumeric: 'tabular-nums',
                }}>{comp.tokens}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ProductsRow() {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {products.map(p => (
        <div key={p.name} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-primary)',
          border: '1px solid var(--stroke-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 14px',
          fontSize: 12, fontWeight: 500,
          color: 'var(--text-secondary)',
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: p.color, flexShrink: 0,
          }} />
          {p.name}
        </div>
      ))}
    </div>
  )
}

export default function Overview() {
  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '48px 40px' }}>

      {/* Hero */}
      <div style={{ marginBottom: 56, animation: 'fadeUp 350ms ease both' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
          color: 'var(--brand-600)', background: 'var(--brand-50)',
          padding: '4px 12px', borderRadius: 99, marginBottom: 20,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-400)', display: 'inline-block' }} />
          ARCAD Web Framework
        </div>
        <h1 style={{
          fontSize: 44, fontWeight: 700, letterSpacing: '-1.5px',
          lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: 16,
        }}>
          ARCAD Design System
        </h1>
        <p style={{
          fontSize: 17, color: 'var(--text-secondary)', maxWidth: 560,
          lineHeight: 1.7, fontWeight: 400,
        }}>
          A unified token architecture and component library powering all ARCAD web products.
          Built on a three-layer system — Primitives, Semantic, and Component tokens.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
        marginBottom: 56,
      }}>
        <StatCard value={stats.primitives} label="Primitive tokens" delay={0} />
        <StatCard value={stats.semantic} label="Semantic tokens" delay={60} />
        <StatCard value={stats.components} label="Component tokens" delay={120} />
        <StatCard value={stats.components_count} label="Components" delay={180} />
      </div>

      {/* Architecture */}
      <section style={{ marginBottom: 56 }}>
        <SectionHeader
          title="Three-layer architecture"
          description="Each layer has a single responsibility. Primitives hold values, Semantic holds meaning, Components hold usage."
          action={{ label: 'View architecture →', to: '/architecture' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {layers.map((layer, i) => <LayerCard key={layer.name} layer={layer} index={i} />)}
        </div>
      </section>

      {/* Products */}
      <section style={{ marginBottom: 56 }}>
        <SectionHeader
          title="Multi-product theming"
          description="One component library, six product themes. Switching themes is a single mode change in Figma or a CSS variable swap in code."
          action={{ label: 'View theming →', to: '/theming/products' }}
        />
        <ProductsRow />
      </section>

      {/* Components */}
      <section style={{ marginBottom: 56 }}>
        <SectionHeader
          title="Component library"
          description={`${stats.components_count} components fully tokenized. Each token traces back through Semantic to Primitives.`}
          action={{ label: 'View components →', to: '/components/button' }}
        />
        <ComponentGrid />
      </section>

      {/* Principles */}
      <section>
        <SectionHeader title="Design principles" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { title: 'Semantic over literal', desc: 'Tokens describe intent, not appearance. color/bg/brand/default, not color/teal/600.' },
            { title: 'YAGNI', desc: "Don't create tokens for hypothetical future needs. Add them when a real use case appears." },
            { title: 'Single source of truth', desc: 'Component tokens never hold raw values. They always reference Semantic tokens.' },
          ].map((p, i) => (
            <div key={p.title} style={{
              padding: 24,
              background: 'var(--bg-primary)',
              border: '1px solid var(--stroke-primary)',
              borderRadius: 'var(--radius-lg)',
              animation: `fadeUp 400ms ease ${i * 80 + 100}ms both`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                {p.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

function SectionHeader({ title, description, action }) {
  return (
    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.4px', color: 'var(--text-primary)', marginBottom: description ? 6 : 0 }}>
          {title}
        </h2>
        {description && (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.6 }}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link to={action.to} style={{
          fontSize: 12, fontWeight: 500, color: 'var(--brand-600)',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {action.label}
        </Link>
      )}
    </div>
  )
}
