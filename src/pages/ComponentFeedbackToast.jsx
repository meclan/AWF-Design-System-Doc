import React from 'react'
import StubPage from '../components/StubPage.jsx'

export default function ComponentFeedbackToast() {
  return (
    <StubPage
      name="Toast"
      category="Feedback"
      tokenPrefix="toast"
      description="Short-lived notification messages stacked in a corner of the viewport. Supports five types: success, danger, warning, info, and progress (loading). Toasts auto-dismiss after a configurable duration."
    />
  )
}
