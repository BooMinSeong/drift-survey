'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import to ensure client-only rendering
const FloatingElementsInner = dynamic(() => import('./FloatingElements'), {
  ssr: false,
  loading: () => null
})

export default function ClientOnlyFloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <FloatingElementsInner />
}