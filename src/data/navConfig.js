import { COMPONENTS_CONFIG, COMPONENT_CATEGORIES } from './componentsConfig.js'

export const TOP_NAV = [
  { label: 'About',      path: '/about' },
  { label: 'Guides',     path: '/guides' },
  { label: 'Foundations', path: '/foundations' },
  { label: 'Components', path: '/components' },
  { label: 'Patterns',   path: '/patterns' },
]

export const SIDEBAR_NAV = {
  '/about': [
    { label: 'Introduction', path: '/about' },
    { label: 'Changelog',    path: '/about/changelog' },
  ],
  '/guides': [
    { label: 'Getting started', path: '/guides/getting-started' },
    { label: 'Theming guide',   path: '/guides/theming' },
    { label: 'Token usage',     path: '/guides/tokens' },
  ],
  '/foundations': [
    { label: 'Token Architecture', path: '/foundations/tokens' },
    { label: 'Color',              path: '/foundations/color' },
    { label: 'Typography',         path: '/foundations/typography' },
    { label: 'Spacing',            path: '/foundations/spacing' },
    { label: 'Elevation',          path: '/foundations/elevation' },
    { label: 'Motion',             path: '/foundations/motion' },
    { label: 'Icons',              path: '/foundations/icons' },
  ],
  '/components': [
    { label: 'Overview', path: '/components', end: true },
    ...COMPONENT_CATEGORIES.map(group => ({
      group,
      items: COMPONENTS_CONFIG
        .filter(c => c.category === group)
        .map(c => ({ label: c.name, path: c.path })),
    })),
  ],
  '/patterns': [
    { label: 'Overview', path: '/patterns' },
  ],
}

export const SEARCH_INDEX = [
  // Components (auto-generated from config)
  ...COMPONENTS_CONFIG.map(c => ({
    label: c.name,
    path: c.path,
    section: 'Components',
    desc: c.desc.slice(0, 80),
  })),
  // Foundations
  { label: 'Token Architecture', path: '/foundations/tokens',      section: 'Foundations', desc: 'Three-layer token system' },
  { label: 'Color',              path: '/foundations/color',       section: 'Foundations', desc: 'Color palettes and semantic tokens' },
  { label: 'Typography',         path: '/foundations/typography',  section: 'Foundations', desc: 'Type scale and font tokens' },
  { label: 'Spacing',            path: '/foundations/spacing',     section: 'Foundations', desc: 'Spacing scale and layout tokens' },
  { label: 'Elevation',          path: '/foundations/elevation',   section: 'Foundations', desc: 'Shadow and depth tokens' },
  { label: 'Motion',             path: '/foundations/motion',      section: 'Foundations', desc: 'Animation and transition tokens' },
  { label: 'Icons',              path: '/foundations/icons',       section: 'Foundations', desc: 'Icon registry and governance model' },
  // Guides
  { label: 'Getting Started', path: '/guides/getting-started', section: 'Guides', desc: 'Set up AWF in your project' },
  { label: 'Theming Guide',   path: '/guides/theming',          section: 'Guides', desc: 'Customize and apply product themes' },
  { label: 'Token Usage',     path: '/guides/tokens',           section: 'Guides', desc: 'How to use design tokens in code' },
]
