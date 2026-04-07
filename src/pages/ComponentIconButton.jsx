import React from 'react'
import StubPage from '../components/StubPage.jsx'

export default function ComponentIconButton() {
  return (
    <StubPage
      name="Icon Button"
      category="Actions"
      tokenPrefix="button"
      description="Icon-only action button for compact UIs where label space is unavailable. Shares the same variants, intents, and token set as Button. Always requires an aria-label for accessibility."
    />
  )
}
