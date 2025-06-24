"use client"

import React, { useState, useRef, useCallback } from "react"
import { useTheme } from "@/contexts/theme-context"

interface ResizablePanelsProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  defaultLeftWidth?: number
}

export function ResizablePanels({ leftPanel, rightPanel, defaultLeftWidth = 60 }: ResizablePanelsProps) {
  const { currentTheme } = useTheme()
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // Constrain between 20% and 80%
      const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth))
      setLeftWidth(constrainedWidth)
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div ref={containerRef} className="flex h-full">
      {/* Left Panel */}
      <div className="transition-all duration-200" style={{ width: `${leftWidth}%` }}>
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        className="w-1 cursor-col-resize group relative flex-shrink-0 transition-all duration-200 hover:w-2"
        style={{
          background: currentTheme.border,
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute inset-0 group-hover:bg-opacity-50 transition-all duration-200"
          style={{
            background: `${currentTheme.accent}40`,
          }}
        />
        {isDragging && (
          <div
            className="absolute inset-0"
            style={{
              background: currentTheme.accent,
              boxShadow: `0 0 10px ${currentTheme.accent}`,
            }}
          />
        )}
      </div>

      {/* Right Panel */}
      <div className="transition-all duration-200" style={{ width: `${100 - leftWidth}%` }}>
        {rightPanel}
      </div>
    </div>
  )
}
