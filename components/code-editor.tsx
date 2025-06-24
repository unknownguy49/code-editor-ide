"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "@/contexts/theme-context"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const { currentTheme } = useTheme()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineNumbers, setLineNumbers] = useState<number[]>([1])

  useEffect(() => {
    const lines = value.split("\n").length
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1))
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = value.substring(0, start) + "  " + value.substring(end)
      onChange(newValue)

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  return (
    <div
      className="relative h-full rounded-lg transition-all duration-300"
      style={{
        background: currentTheme.editor.background,
        border: `1px solid ${currentTheme.border}`,
        boxShadow: currentTheme.glass.shadow,
        overflow: "hidden",
      }}
    >
      <div className="flex h-full">
        {/* Line Numbers */}
        <div
          className="flex flex-col text-right px-3 py-4 text-sm font-mono select-none border-r"
          style={{
            color: currentTheme.editor.lineNumber,
            borderColor: currentTheme.border,
            background: `${currentTheme.editor.background}dd`,
            overflowY: "auto",
            maxHeight: "100%",
          }}
        >
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6 h-6">
              {num}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 overflow-auto">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-4 font-mono text-sm leading-6 resize-none outline-none border-0"
            style={{
              color: currentTheme.editor.foreground,
              caretColor: currentTheme.editor.foreground,
              background: currentTheme.editor.background,
              minHeight: "100%",
            }}
            placeholder={`Start coding in ${language}...`}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
