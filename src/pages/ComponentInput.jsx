import React from 'react'
import StubPage from '../components/StubPage.jsx'

export default function ComponentInput() {
  return (
    <StubPage
      name="Input"
      category="Forms"
      tokenPrefix="inputfield"
      description="Text input field for collecting user data. Supports leading and trailing icons, hint text, validation states (error, success), and disabled state. Available in outlined and filled variants."
    />
  )
}
