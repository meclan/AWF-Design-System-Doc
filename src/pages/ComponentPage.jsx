import React, { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { COMPONENTS_CONFIG } from '../data/componentsConfig.js'
import StubPage from '../components/StubPage.jsx'
import Placeholder from './Placeholder.jsx'

// Dedicated full-doc pages — add new entries here as components are documented
import ButtonPage        from './components/ButtonPage.jsx'
import TogglePage        from './components/TogglePage.jsx'
import CheckboxPage      from './components/CheckboxPage.jsx'
import RadioPage         from './components/RadioPage.jsx'
import SwitchPage        from './components/SwitchPage.jsx'
import ComposerButtonPage from './components/ComposerButtonPage.jsx'
import SplitButtonPage   from './components/SplitButtonPage.jsx'
import BannerPage        from './components/BannerPage.jsx'
import ToastPage         from './components/ToastPage.jsx'
import StatusBadgePage   from './components/StatusBadgePage.jsx'
import TagPage           from './components/TagPage.jsx'
import CounterBadgePage  from './components/CounterBadgePage.jsx'
import PaginationPage    from './components/PaginationPage.jsx'
import BreadcrumbsPage   from './components/BreadcrumbsPage.jsx'

const FULL_PAGES = {
  '/components/button':          ButtonPage,
  '/components/toggle':          TogglePage,
  '/components/checkbox':        CheckboxPage,
  '/components/radio':           RadioPage,
  '/components/switch':          SwitchPage,
  '/components/composer-button': ComposerButtonPage,
  '/components/split-button':    SplitButtonPage,
  '/components/feedback/banner': BannerPage,
  '/components/feedback/toast':  ToastPage,
  '/components/badge':           StatusBadgePage,
  '/components/tag':             TagPage,
  '/components/counter-badge':   CounterBadgePage,
  '/components/pagination':      PaginationPage,
  '/components/breadcrumbs':     BreadcrumbsPage,
}

export default function ComponentPage() {
  const { '*': slug } = useParams()
  const path = `/components/${slug}`
  const comp = COMPONENTS_CONFIG.find(c => c.path === path)

  if (!comp) return <Placeholder title="Component not found" />

  const FullPage = FULL_PAGES[path]
  if (FullPage) return <FullPage />

  return (
    <StubPage
      name={comp.name}
      category={comp.category}
      tokenPrefix={comp.tokenPrefix}
      description={comp.desc}
    />
  )
}
