import React from 'react'
import StubPage from '../components/StubPage.jsx'

export default function ComponentButton() {
  return (
    <StubPage
      name="Button"
      category="Actions"
      tokenPrefix="button"
      description="Interactive element for triggering actions and page navigation. Supports four variants (filled, soft, outlined, text) combined with four intents (brand, danger, neutral, strong), plus size and full-width options."
    />
  )
}
