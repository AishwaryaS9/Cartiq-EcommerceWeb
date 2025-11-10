'use client'
import { useEffect } from "react"

const Loading = () => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading content, please wait..."
    >
      <div
        className="w-11 h-11 rounded-full border-3 border-secondary border-t-primary animate-spin"
        aria-hidden="true"
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Loading