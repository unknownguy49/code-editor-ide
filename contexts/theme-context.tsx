"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

export type ThemeName = "light" | "gradient" | "minimal" | "hacker" | "pastel";

export interface Theme {
  name: ThemeName;
  displayName: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  input: string;
  ring: string;
  editor: {
    background: string;
    foreground: string;
    selection: string;
    lineNumber: string;
    keyword: string;
    string: string;
    comment: string;
    function: string;
    variable: string;
  };
  button: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
  };
  glass: {
    background: string;
    border: string;
    shadow: string;
  };
}

const themes: Record<ThemeName, Theme> = {
  light: {
    name: "light",
    displayName: "Modern Light",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    foreground: "#1e293b",
    card: "#ffffff",
    cardForeground: "#1e293b",
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    secondary: "#f1f5f9",
    secondaryForeground: "#475569",
    accent: "#0ea5e9",
    accentForeground: "#ffffff",
    border: "#d1d5db",
    input: "#ffffff",
    ring: "#3b82f6",
    editor: {
      background: "#ffffff",
      foreground: "#1e293b",
      selection: "transparent",
      lineNumber: "#64748b",
      keyword: "#9333ea",
      string: "#16a34a",
      comment: "#6b7280",
      function: "#ea580c",
      variable: "#0284c7",
    },
    button: {
      primary: "#3b82f6",
      primaryHover: "#2563eb",
      secondary: "#f1f5f9",
      secondaryHover: "#e2e8f0",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.8)",
      border: "rgba(148, 163, 184, 0.3)",
      shadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
  },
  gradient: {
    name: "gradient",
    displayName: "Futuristic Gradient",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
    foreground: "#ffffff",
    card: "rgba(255, 255, 255, 0.1)",
    cardForeground: "#ffffff",
    primary: "#ff6b6b",
    primaryForeground: "#ffffff",
    secondary: "rgba(255, 255, 255, 0.15)",
    secondaryForeground: "#e2e8f0",
    accent: "#4ecdc4",
    accentForeground: "#1a202c",
    border: "rgba(255, 255, 255, 0.2)",
    input: "rgba(255, 255, 255, 0.1)",
    ring: "#ff6b6b",
    editor: {
      background: "rgba(0, 0, 0, 0.4)",
      foreground: "#ffffff",
      selection: "transparent",
      lineNumber: "rgba(255, 255, 255, 0.6)",
      keyword: "#ff79c6",
      string: "#50fa7b",
      comment: "rgba(255, 255, 255, 0.5)",
      function: "#ffb86c",
      variable: "#8be9fd",
    },
    button: {
      primary: "#ff6b6b",
      primaryHover: "#ff5252",
      secondary: "rgba(255, 255, 255, 0.15)",
      secondaryHover: "rgba(255, 255, 255, 0.25)",
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
    foreground: "#0f172a",
    card: "#ffffff",
    cardForeground: "#0f172a",
    primary: "#0f172a",
    primaryForeground: "#ffffff",
    secondary: "#f8fafc",
    secondaryForeground: "#475569",
    accent: "#64748b",
    accentForeground: "#ffffff",
    border: "#e2e8f0",
    input: "#ffffff",
    ring: "#0f172a",
    editor: {
      background: "#ffffff",
      foreground: "#0f172a",
      selection: "transparent",
      lineNumber: "#94a3b8",
      keyword: "#7c2d12",
      string: "#166534",
      comment: "#94a3b8",
      function: "#b91c1c",
      variable: "#1e40af",
    },
    button: {
      primary: "#0f172a",
      primaryHover: "#1e293b",
      secondary: "#f8fafc",
      secondaryHover: "#f1f5f9",
    },
    glass: {
      background: "rgba(248, 250, 252, 0.8)",
      border: "rgba(148, 163, 184, 0.2)",
      shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    },
  },
  hacker: {
    name: "hacker",
    displayName: "Hacker Terminal",
    background: "radial-gradient(ellipse at center, #0a0e14 0%, #000000 100%)",
    foreground: "#00ff41",
    card: "rgba(0, 255, 65, 0.05)",
    cardForeground: "#00ff41",
    primary: "#00ff41",
    primaryForeground: "#000000",
    secondary: "rgba(0, 255, 65, 0.1)",
    secondaryForeground: "#00ff41",
    accent: "#39ff14",
    accentForeground: "#000000",
    border: "rgba(0, 255, 65, 0.3)",
    input: "rgba(0, 0, 0, 0.8)",
    ring: "#00ff41",
    editor: {
      background: "#0a0e14",
      foreground: "#00ff41",
      selection: "transparent",
      lineNumber: "rgba(0, 255, 65, 0.6)",
      keyword: "#b3d9ff",
      string: "#ffffcc",
      comment: "rgba(0, 255, 65, 0.5)",
      function: "#ffccb3",
      variable: "#e6ccff",
    },
    button: {
      primary: "#00ff41",
      primaryHover: "#00cc33",
      secondary: "rgba(0, 255, 65, 0.1)",
      secondaryHover: "rgba(0, 255, 65, 0.2)",
    },
    glass: {
      background: "rgba(0, 255, 65, 0.05)",
      border: "rgba(0, 255, 65, 0.2)",
      shadow: "0 8px 32px 0 rgba(0, 255, 65, 0.2)",
    },
  },
  pastel: {
    name: "pastel",
    displayName: "Soft Pastel",
    background:
      "linear-gradient(135deg, #fef3f2 0%, #fef2f2 50%, #fef3f2 100%)",
    foreground: "#4c1d95",
    card: "rgba(255, 255, 255, 0.8)",
    cardForeground: "#4c1d95",
    primary: "#ec4899",
    primaryForeground: "#ffffff",
    secondary: "rgba(255, 255, 255, 0.9)",
    secondaryForeground: "#4c1d95",
    accent: "#06b6d4",
    accentForeground: "#ffffff",
    border: "rgba(236, 72, 153, 0.2)",
    input: "rgba(255, 255, 255, 0.95)",
    ring: "#ec4899",
    editor: {
      background: "rgba(255, 255, 255, 0.95)",
      foreground: "#4c1d95",
      selection: "transparent",
      lineNumber: "rgba(76, 29, 149, 0.6)",
      keyword: "#7c3aed",
      string: "#059669",
      comment: "rgba(76, 29, 149, 0.5)",
      function: "#ea580c",
      variable: "#0369a1",
    },
    button: {
      primary: "#ec4899",
      primaryHover: "#db2777",
      secondary: "rgba(255, 255, 255, 0.9)",
      secondaryHover: "rgba(255, 255, 255, 1)",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.4)",
      border: "rgba(236, 72, 153, 0.3)",
      shadow:
        "0 4px 6px -1px rgba(236, 72, 153, 0.1), 0 2px 4px -1px rgba(236, 72, 153, 0.06)",
    },
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: ThemeName) => void;
  themes: Record<ThemeName, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>("light");

  useEffect(() => {
    const saved = localStorage.getItem("code-editor-theme") as ThemeName;
    if (saved && themes[saved]) {
      setCurrentThemeName(saved);
    }
  }, []);

  const setTheme = (theme: ThemeName) => {
    setCurrentThemeName(theme);
    localStorage.setItem("code-editor-theme", theme);
  };

  const value = {
    currentTheme: themes[currentThemeName],
    setTheme,
    themes,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
