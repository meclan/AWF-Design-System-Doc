import React, { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { COMPONENTS_CONFIG } from '../data/componentsConfig.js'
import StubPage from '../components/StubPage.jsx'
import Placeholder from './Placeholder.jsx'

// Dedicated full-doc pages — add new entries here as components are documented
import ButtonPage        from './components/ButtonPage.jsx'
import IconButtonPage    from './components/IconButtonPage.jsx'
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
import TabsPage          from './components/TabsPage.jsx'
import AccordionPage     from './components/AccordionPage.jsx'
import StepperPage      from './components/StepperPage.jsx'
import SectionNavPage   from './components/SectionNavPage.jsx'
import ModalPage        from './components/ModalPage.jsx'
import PopoverMenuPage  from './components/PopoverMenuPage.jsx'
import SidePanelPage   from './components/SidePanelPage.jsx'
import NavbarPage      from './components/NavbarPage.jsx'
import CardPage        from './components/CardPage.jsx'
import PagePage        from './components/PagePage.jsx'
import TooltipPage     from './components/TooltipPage.jsx'
import DividerPage     from './components/DividerPage.jsx'
import GridPage        from './components/GridPage.jsx'
import GuideCuePage    from './components/GuideCuePage.jsx'
import TextFieldPage   from './components/TextFieldPage.jsx'
import TextAreaPage    from './components/TextAreaPage.jsx'
import SelectPage      from './components/SelectPage.jsx'
import SearchBarPage   from './components/SearchBarPage.jsx'
import DatePickerPage  from './components/DatePickerPage.jsx'
import SpinnerPage     from './components/SpinnerPage.jsx'
import SkeletonPage    from './components/SkeletonPage.jsx'
import TablePage       from './components/TablePage.jsx'

const FULL_PAGES = {
  '/components/button':          ButtonPage,
  '/components/icon-button':     IconButtonPage,
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
  '/components/tabs':            TabsPage,
  '/components/accordion':       AccordionPage,
  '/components/stepper':         StepperPage,
  '/components/section-nav':     SectionNavPage,
  '/components/modal':           ModalPage,
  '/components/popover':         PopoverMenuPage,
  '/components/side-panel':      SidePanelPage,
  '/components/navbar':          NavbarPage,
  '/components/card':            CardPage,
  '/components/page':            PagePage,
  '/components/tooltip':         TooltipPage,
  '/components/divider':         DividerPage,
  '/components/grid':            GridPage,
  '/components/guide-cue':       GuideCuePage,
  '/components/input':           TextFieldPage,
  '/components/textarea':        TextAreaPage,
  '/components/select':          SelectPage,
  '/components/searchbar':       SearchBarPage,
  '/components/datepicker':      DatePickerPage,
  '/components/feedback/spinner':  SpinnerPage,
  '/components/feedback/skeleton': SkeletonPage,
  '/components/table':             TablePage,
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
