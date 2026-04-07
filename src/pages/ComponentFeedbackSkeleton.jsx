import React from 'react'
import StubPage from '../components/StubPage.jsx'

export default function ComponentFeedbackSkeleton() {
  return (
    <StubPage
      name="Skeleton"
      category="Feedback"
      tokenPrefix="skeleton"
      description="Content placeholder shown while data is loading. Mirrors the shape of the forthcoming content to prevent layout shift and reduce perceived wait time. Prefer Skeleton over Spinner for content-heavy screens."
    />
  )
}
