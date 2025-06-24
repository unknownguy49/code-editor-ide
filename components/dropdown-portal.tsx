"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface DropdownPortalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  triggerRect: DOMRect | null
}

export function DropdownPortal({ isOpen, onClose, children, triggerRect }: DropdownPortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (isOpen) {
      // Add event listener to close dropdown when clicking outside
      const handleClickOutside = (e: MouseEvent) => {
        onClose()
      }

      document.addEventListener("click", handleClickOutside)
      return () => {
        document.removeEventListener("click", handleClickOutside)
      }
    }
  }, [isOpen, onClose])

  if (!mounted || !isOpen || !triggerRect) return null

  // Position the dropdown below the trigger element
  const style = {
    position: "fixed" as const,
    top: `${triggerRect.bottom + window.scrollY + 8}px`,
    left: `${triggerRect.left + window.scrollX}px`,
    zIndex: 999999, // Extremely high z-index
  }

  // Stop propagation to prevent the dropdown from closing when clicking inside it
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return createPortal(
    <div style={style} onClick={handleClick}>
      {children}
    </div>,
    document.body,
  )
}
