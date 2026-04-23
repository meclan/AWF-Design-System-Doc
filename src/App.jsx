import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TopNav from './components/TopNav.jsx'
import ContextSidebar from './components/ContextSidebar.jsx'
import Placeholder from './pages/Placeholder.jsx'
import Home from './pages/Home.jsx'
import ComponentsOverview from './pages/ComponentsOverview.jsx'
import ComponentPage from './pages/ComponentPage.jsx'
import TokensArchitecture from './pages/TokensArchitecture.jsx'
import TokensColor from './pages/TokensColor.jsx'
import FoundationsTypography from './pages/FoundationsTypography.jsx'
import FoundationsSpacing from './pages/FoundationsSpacing.jsx'
import FoundationsElevation from './pages/FoundationsElevation.jsx'
import FoundationsMotion from './pages/FoundationsMotion.jsx'
import IconsExplorer from './pages/IconsExplorer.jsx'
import GuideTheming from './pages/GuideTheming.jsx'
import GuideTokenUsage from './pages/GuideTokenUsage.jsx'
import GuideGettingStarted from './pages/GuideGettingStarted.jsx'
import AboutIntroduction from './pages/AboutIntroduction.jsx'
import AboutChangelog from './pages/AboutChangelog.jsx'

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
            <Route path="/about"           element={<AboutIntroduction />} />
            <Route path="/about/changelog" element={<AboutChangelog />} />

            {/* Guides */}
            <Route path="/guides"                 element={<GuideGettingStarted />} />
            <Route path="/guides/getting-started" element={<GuideGettingStarted />} />
            <Route path="/guides/theming"         element={<GuideTheming />} />
            <Route path="/guides/tokens"          element={<GuideTokenUsage />} />

            {/* Foundations */}
            <Route path="/foundations"            element={<TokensArchitecture />} />
            <Route path="/foundations/tokens"     element={<TokensArchitecture />} />
            <Route path="/foundations/color"      element={<TokensColor />} />
            <Route path="/foundations/typography" element={<FoundationsTypography />} />
            <Route path="/foundations/spacing"    element={<FoundationsSpacing />} />
            <Route path="/foundations/elevation"  element={<FoundationsElevation />} />
            <Route path="/foundations/motion"     element={<FoundationsMotion />} />
            <Route path="/foundations/icons"      element={<IconsExplorer />} />

            {/* Themes redirect (keep old URLs working) */}
            <Route path="/themes"             element={<TokensArchitecture />} />
            <Route path="/themes/tokens"      element={<TokensArchitecture />} />
            <Route path="/themes/color"       element={<TokensColor />} />
            <Route path="/themes/typography"  element={<FoundationsTypography />} />
            <Route path="/themes/spacing"     element={<FoundationsSpacing />} />
            <Route path="/themes/elevation"   element={<FoundationsElevation />} />
            <Route path="/themes/motion"      element={<FoundationsMotion />} />

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
