"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type ThemeName = "light" | "gradient" | "minimal" | "hacker" | "pastel"

export interface Theme {
  name: ThemeName
  displayName: string
  background: string
  foreground: string
  card: string
  cardForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  border: string
  input: string
  ring: string
  editor: {
    background: string
    foreground: string
    selection: string
    lineNumber: string
    keyword: string
    string: string
    comment: string
    function: string
    variable: string
  }
  button: {
    primary: string
    primaryHover: string
    secondary: string
    secondaryHover: string
  }
  glass: {
    background: string
    border: string
    shadow: string
  }
}

const themes: Record<ThemeName, Theme> = {
  light: {
    name: "light",
    displayName: "Modern Light",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    foreground: "#1a202c",
    card: "rgba(255, 255, 255, 0.8)",
    cardForeground: "#1a202c",
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    secondary: "#e2e8f0",
    secondaryForeground: "#475569",
    accent: "#06b6d4",
    accentForeground: "#ffffff",
    border: "rgba(203, 213, 225, 0.5)",
    input: "rgba(255, 255, 255, 0.9)",
    ring: "#3b82f6",
    editor: {
      background: "rgba(255, 255, 255, 0.95)",
      foreground: "#1a202c",
      selection: "rgba(59, 130, 246, 0.2)",
      lineNumber: "#94a3b8",
      keyword: "#7c3aed",
      string: "#059669",
      comment: "#6b7280",
      function: "#dc2626",
      variable: "#0891b2",
    },
    button: {
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      primaryHover: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
      secondary: "rgba(255, 255, 255, 0.8)",
      secondaryHover: "rgba(255, 255, 255, 0.9)",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.25)",
      border: "rgba(255, 255, 255, 0.18)",
      shadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    },
  },
  gradient: {
    name: "gradient",
    displayName: "Futuristic Gradient",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    foreground: "#ffffff",
    card: "rgba(255, 255, 255, 0.1)",
    cardForeground: "#ffffff",
    primary: "#ff6b6b",
    primaryForeground: "#ffffff",
    secondary: "rgba(255, 255, 255, 0.2)",
    secondaryForeground: "#ffffff",
    accent: "#4ecdc4",
    accentForeground: "#1a202c",
    border: "rgba(255, 255, 255, 0.2)",
    input: "rgba(255, 255, 255, 0.15)",
    ring: "#ff6b6b",
    editor: {
      background: "rgba(0, 0, 0, 0.3)",
      foreground: "#ffffff",
      selection: "rgba(255, 107, 107, 0.3)",
      lineNumber: "rgba(255, 255, 255, 0.5)",
      keyword: "#ff6b6b",
      string: "#4ecdc4",
      comment: "rgba(255, 255, 255, 0.6)",
      function: "#feca57",
      variable: "#48dbfb",
    },
    button: {
      primary: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
      primaryHover: "linear-gradient(135deg, #ff5252 0%, #ffb74d 100%)",
      secondary: "rgba(255, 255, 255, 0.2)",
      secondaryHover: "rgba(255, 255, 255, 0.3)",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.1)",
      border: "rgba(255, 255, 255, 0.2)",
      shadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    },
  },
  minimal: {
    name: "minimal",
    displayName: "Clean Minimal",
    background: "#ffffff",
    foreground: "#000000",
    card: "#ffffff",
    cardForeground: "#000000",
    primary: "#000000",
    primaryForeground: "#ffffff",
    secondary: "#f8f9fa",
    secondaryForeground: "#6c757d",
    accent: "#6c757d",
    accentForeground: "#ffffff",
    border: "#e9ecef",
    input: "#ffffff",
    ring: "#000000",
    editor: {
      background: "#ffffff",
      foreground: "#000000",
      selection: "rgba(0, 0, 0, 0.1)",
      lineNumber: "#adb5bd",
      keyword: "#000000",
      string: "#495057",
      comment: "#adb5bd",
      function: "#000000",
      variable: "#6c757d",
    },
    button: {
      primary: "#000000",
      primaryHover: "#343a40",
      secondary: "#f8f9fa",
      secondaryHover: "#e9ecef",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.8)",
      border: "rgba(0, 0, 0, 0.1)",
      shadow: "0 2px 10px 0 rgba(0, 0, 0, 0.1)",
    },
  },
  hacker: {
    name: "hacker",
    displayName: "Hacker Terminal",
    background: "radial-gradient(ellipse at center, #0d1117 0%, #000000 100%)",
    foreground: "#00ff00",
    card: "rgba(0, 255, 0, 0.05)",
    cardForeground: "#00ff00",
    primary: "#00ff00",
    primaryForeground: "#000000",
    secondary: "rgba(0, 255, 0, 0.1)",
    secondaryForeground: "#00ff00",
    accent: "#39ff14",
    accentForeground: "#000000",
    border: "rgba(0, 255, 0, 0.3)",
    input: "rgba(0, 0, 0, 0.8)",
    ring: "#00ff00",
    editor: {
      background: "rgba(0, 0, 0, 0.9)",
      foreground: "#00ff00",
      selection: "rgba(0, 255, 0, 0.2)",
      lineNumber: "rgba(0, 255, 0, 0.5)",
      keyword: "#39ff14",
      string: "#00ffff",
      comment: "rgba(0, 255, 0, 0.6)",
      function: "#ffff00",
      variable: "#ff00ff",
    },
    button: {
      primary: "linear-gradient(135deg, #00ff00 0%, #39ff14 100%)",
      primaryHover: "linear-gradient(135deg, #00cc00 0%, #2bcc0f 100%)",
      secondary: "rgba(0, 255, 0, 0.1)",
      secondaryHover: "rgba(0, 255, 0, 0.2)",
    },
    glass: {
      background: "rgba(0, 255, 0, 0.05)",
      border: "rgba(0, 255, 0, 0.2)",
      shadow: "0 8px 32px 0 rgba(0, 255, 0, 0.2)",
    },
  },
  pastel: {
    name: "pastel",
    displayName: "Soft Pastel",
    background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ffecd2 100%)",
    foreground: "#5d4e75",
    card: "rgba(255, 255, 255, 0.7)",
    cardForeground: "#5d4e75",
    primary: "#ff9a9e",
    primaryForeground: "#ffffff",
    secondary: "rgba(255, 255, 255, 0.8)",
    secondaryForeground: "#5d4e75",
    accent: "#a8e6cf",
    accentForeground: "#5d4e75",
    border: "rgba(255, 255, 255, 0.3)",
    input: "rgba(255, 255, 255, 0.9)",
    ring: "#ff9a9e",
    editor: {
      background: "rgba(255, 255, 255, 0.9)",
      foreground: "#5d4e75",
      selection: "rgba(255, 154, 158, 0.3)",
      lineNumber: "rgba(93, 78, 117, 0.5)",
      keyword: "#ff6b9d",
      string: "#95e1d3",
      comment: "rgba(93, 78, 117, 0.6)",
      function: "#feca57",
      variable: "#a8e6cf",
    },
    button: {
      primary: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      primaryHover: "linear-gradient(135deg, #ff8a95 0%, #fdb5e5 100%)",
      secondary: "rgba(255, 255, 255, 0.8)",
      secondaryHover: "rgba(255, 255, 255, 0.9)",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.3)",
      border: "rgba(255, 255, 255, 0.4)",
      shadow: "0 8px 32px 0 rgba(255, 154, 158, 0.2)",
    },
  },
}

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (theme: ThemeName) => void
  themes: Record<ThemeName, Theme>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>("light")

  useEffect(() => {
    const saved = localStorage.getItem("code-editor-theme") as ThemeName
    if (saved && themes[saved]) {
      setCurrentThemeName(saved)
    }
  }, [])

  const setTheme = (theme: ThemeName) => {
    setCurrentThemeName(theme)
    localStorage.setItem("code-editor-theme", theme)
  }

  const value = {
    currentTheme: themes[currentThemeName],
    setTheme,
    themes,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
