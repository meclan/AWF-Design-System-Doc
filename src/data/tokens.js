// AWF Design System — Token data
// Source: Figma variable exports

export const stats = {
  primitives: 233,
  semantic: 90,
  components: 693,
  components_count: 22,
  modes: 10,
}

export const componentList = [
  { name: 'Button', tokens: 184, status: 'stable', category: 'Actions', path: '/components/button' },
  { name: 'Input field', tokens: 104, status: 'stable', category: 'Forms', path: '/components/input' },
  { name: 'Badge', tokens: 50, status: 'stable', category: 'Display', path: '/components/badge' },
  { name: 'Navbar', tokens: 49, status: 'stable', category: 'Navigation', path: '/components/nav' },
  { name: 'Date Picker', tokens: 42, status: 'stable', category: 'Forms', path: '/components/datepicker' },
  { name: 'Card', tokens: 29, status: 'stable', category: 'Layout', path: '/components/card' },
  { name: 'Stepper', tokens: 25, status: 'stable', category: 'Navigation', path: '/components/stepper' },
  { name: 'Banner', tokens: 24, status: 'stable', category: 'Feedback', path: '/components/feedback' },
  { name: 'Toast', tokens: 21, status: 'stable', category: 'Feedback', path: '/components/feedback' },
  { name: 'Pagination', tokens: 19, status: 'stable', category: 'Navigation', path: '/components/pagination' },
  { name: 'Radio', tokens: 18, status: 'stable', category: 'Forms', path: '/components/forms' },
  { name: 'Modal', tokens: 18, status: 'stable', category: 'Overlay', path: '/components/overlay' },
  { name: 'Checkbox', tokens: 15, status: 'stable', category: 'Forms', path: '/components/forms' },
  { name: 'Page', tokens: 10, status: 'stable', category: 'Layout', path: '/components/page' },
  { name: 'Breadcrumb', tokens: 10, status: 'stable', category: 'Navigation', path: '/components/breadcrumb' },
  { name: 'Tabs', tokens: 8, status: 'stable', category: 'Navigation', path: '/components/tabs' },
  { name: 'Side Panel', tokens: 7, status: 'stable', category: 'Overlay', path: '/components/overlay' },
  { name: 'Popover', tokens: 7, status: 'stable', category: 'Overlay', path: '/components/overlay' },
  { name: 'Spinner', tokens: 6, status: 'stable', category: 'Feedback', path: '/components/feedback' },
  { name: 'Tooltip', tokens: 9, status: 'stable', category: 'Overlay', path: '/components/overlay' },
  { name: 'Skeleton', tokens: 5, status: 'stable', category: 'Feedback', path: '/components/feedback' },
  { name: 'Table', tokens: 34, status: 'stable', category: 'Display', path: '/components/table' },
]

export const products = [
  { name: 'DOT Anonymizer', color: '#0077C8', light: '#e0f4f8' },
  { name: 'Discover', color: '#F6AE40', light: '#fef3dc' },
  { name: 'Drops', color: '#17AFE6', light: '#e0f4fd' },
  { name: 'CoChecker', color: '#2F9071', light: '#d9f2ea' },
  { name: 'MR Connector', color: '#7993FF', light: '#EFEFFF' },
  { name: 'Verifier', color: '#29938A', light: '#E9F8F6' },
]

export const layers = [
  {
    name: 'Primitives',
    count: 233,
    description: 'Raw values — color palettes, spacing scale, typography, radii. Never used directly in components.',
    color: '#64748b',
    tokens: ['color/neutral/50–900', 'color/brand/DOT/50–900', 'numbers/spacing/xxs–xxxxxl', 'numbers/font-size/xs–4xl']
  },
  {
    name: 'Semantic',
    count: 90,
    description: 'Meaningful aliases — each token carries intent. Switch modes to change the entire theme automatically.',
    color: '#0077C8',
    tokens: ['color/bg/brand/default', 'color/text/primary', 'color/icon/on-brand', 'color/stroke/focus']
  },
  {
    name: 'Component',
    count: 693,
    description: 'Component-scoped tokens — precise assignments for each state and part of every component.',
    color: '#0099b8',
    tokens: ['button/filled/bg/default', 'input/outlined/stroke/focus', 'table/header/bg/contrast', 'nav/item/text/active']
  },
]
