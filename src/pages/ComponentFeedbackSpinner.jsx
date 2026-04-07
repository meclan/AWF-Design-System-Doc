import React from 'react'
import StubPage from '../components/StubPage.jsx'

export default function ComponentFeedbackSpinner() {
  return (
    <StubPage
      name="Spinner"
      category="Feedback"
      tokenPrefix="spinner"
      description="Circular loading indicator for indeterminate progress states. Use when a process is underway and its duration is unknown. Prefer Skeleton for content loading within a layout."
    />
  )
}
