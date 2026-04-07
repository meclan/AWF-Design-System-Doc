import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TopNav from './components/TopNav.jsx'
import ContextSidebar from './components/ContextSidebar.jsx'
import Placeholder from './pages/Placeholder.jsx'
import Home from './pages/Home.jsx'
import ComponentsOverview from './pages/ComponentsOverview.jsx'
import ComponentPage from './pages/ComponentPage.jsx'
import TokensArchitecture from './pages/TokensArchitecture.jsx'
import IconsExplorer from './pages/IconsExplorer.jsx'
import GuideTheming from './pages/GuideTheming.jsx'
import GuideTokenUsage from './pages/GuideTokenUsage.jsx'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopNav />
      <div style={{
        display: 'flex', flex: 1, overflow: 'hidden',
        marginTop: 'var(--topnav-height)',
      }}>
        <ContextSidebar />
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-subtle)' }}>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* About */}
            <Route path="/about"           element={<Placeholder title="Introduction" />} />
            <Route path="/about/changelog" element={<Placeholder title="Changelog" />} />

            {/* Guides */}
            <Route path="/guides"                 element={<Placeholder title="Guides" />} />
            <Route path="/guides/getting-started" element={<Placeholder title="Getting Started" />} />
            <Route path="/guides/theming"         element={<GuideTheming />} />
            <Route path="/guides/tokens"          element={<GuideTokenUsage />} />

            {/* Foundations */}
            <Route path="/foundations"            element={<TokensArchitecture />} />
            <Route path="/foundations/tokens"     element={<TokensArchitecture />} />
            <Route path="/foundations/color"      element={<Placeholder title="Color" />} />
            <Route path="/foundations/typography" element={<Placeholder title="Typography" />} />
            <Route path="/foundations/spacing"    element={<Placeholder title="Spacing" />} />
            <Route path="/foundations/elevation"  element={<Placeholder title="Elevation" />} />
            <Route path="/foundations/motion"     element={<Placeholder title="Motion" />} />
            <Route path="/foundations/icons"      element={<IconsExplorer />} />

            {/* Themes redirect (keep old URLs working) */}
            <Route path="/themes"             element={<TokensArchitecture />} />
            <Route path="/themes/tokens"      element={<TokensArchitecture />} />
            <Route path="/themes/color"       element={<Placeholder title="Color" />} />
            <Route path="/themes/typography"  element={<Placeholder title="Typography" />} />
            <Route path="/themes/spacing"     element={<Placeholder title="Spacing" />} />
            <Route path="/themes/elevation"   element={<Placeholder title="Elevation" />} />
            <Route path="/themes/motion"      element={<Placeholder title="Motion" />} />

            {/* Components — overview + catch-all dynamic page */}
            <Route path="/components"   element={<ComponentsOverview />} />
            <Route path="/components/*" element={<ComponentPage />} />

            {/* Patterns */}
            <Route path="/patterns" element={<Placeholder title="Patterns" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
