"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useTheme } from "@/contexts/theme-context";
import { Palette, ChevronDown } from "lucide-react";
import { DropdownPortal } from "./dropdown-portal";

export function ThemeSelector() {
  const { currentTheme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
    setIsOpen(!isOpen);
  };

  const handleThemeChange = (theme: string) => {
    setTheme(theme as any);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 min-w-[140px] min-h-[42px]"
        style={{
          background: currentTheme.button.secondary,
          color: currentTheme.secondaryForeground,
          border: `1px solid ${currentTheme.border}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = currentTheme.button.secondaryHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = currentTheme.button.secondary;
        }}
      >
        <Palette size={16} />
        <span className="text-sm font-medium flex-1 text-left leading-tight">
          {currentTheme.displayName}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <DropdownPortal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRect={buttonRect}
      >
        <div
          className="w-48 rounded-lg overflow-hidden backdrop-blur-md"
          style={{
            background: currentTheme.glass.background,
            border: `1px solid ${currentTheme.glass.border}`,
            boxShadow: currentTheme.glass.shadow,
          }}
        >
          {Object.values(themes).map((theme) => (
            <button
              key={theme.name}
              onClick={() => handleThemeChange(theme.name)}
              className="w-full px-4 py-3 text-left text-sm transition-colors duration-200"
              style={{
                color: currentTheme.foreground,
                background:
                  currentTheme.name === theme.name
                    ? currentTheme.accent + "20"
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                if (currentTheme.name !== theme.name) {
                  e.currentTarget.style.background = currentTheme.accent + "10";
                }
              }}
              onMouseLeave={(e) => {
                if (currentTheme.name !== theme.name) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{
                    background: theme.primary,
                    borderColor: theme.border,
                  }}
                />
                <span className="font-medium">{theme.displayName}</span>
              </div>
            </button>
          ))}
        </div>
      </DropdownPortal>
    </div>
  );
}
