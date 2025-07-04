"use client";

import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/contexts/theme-context";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const { currentTheme } = useTheme();
  const editorRef = useRef<any>(null);

  // Update theme when currentTheme changes
  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco;
      if (monaco) {
        // Helper function to convert any color to hex
        const convertToHex = (color: string): string => {
          if (color.startsWith("#")) {
            return color.replace("#", "");
          }
          if (color.startsWith("rgba") || color.startsWith("rgb")) {
            // For rgba/rgb colors, extract values and convert to hex
            const values = color.match(/\d+/g);
            if (values && values.length >= 3) {
              const r = parseInt(values[0]);
              const g = parseInt(values[1]);
              const b = parseInt(values[2]);
              return ((1 << 24) + (r << 16) + (g << 8) + b)
                .toString(16)
                .slice(1);
            }
          }
          // Fallback colors
          return currentTheme.name === "light" ? "ffffff" : "1e1e1e";
        };

        const colors = {
          background: convertToHex(currentTheme.editor.background),
          foreground: convertToHex(currentTheme.editor.foreground),
          selection: convertToHex(currentTheme.editor.selection),
          lineNumber: convertToHex(currentTheme.editor.lineNumber),
          border: convertToHex(currentTheme.border),
          keyword: convertToHex(currentTheme.editor.keyword),
          string: convertToHex(currentTheme.editor.string),
          comment: convertToHex(currentTheme.editor.comment),
          function: convertToHex(currentTheme.editor.function),
          variable: convertToHex(currentTheme.editor.variable),
        };

        const customTheme = {
          base: (currentTheme.name === "light" ? "vs" : "vs-dark") as
            | "vs"
            | "vs-dark",
          inherit: true,
          rules: [
            { token: "comment", foreground: colors.comment },
            { token: "keyword", foreground: colors.keyword },
            { token: "string", foreground: colors.string },
            { token: "function", foreground: colors.function },
            { token: "variable", foreground: colors.variable },
            { token: "identifier", foreground: colors.variable },
            { token: "type", foreground: colors.keyword },
            { token: "number", foreground: colors.string },
          ],
          colors: {
            "editor.background": "#" + colors.background,
            "editor.foreground": "#" + colors.foreground,
            "editor.lineHighlightBackground": "#" + colors.selection,
            "editorLineNumber.foreground": "#" + colors.lineNumber,
            "editor.selectionBackground": "#" + colors.selection,
            "editorWidget.background": "#" + colors.background,
            "editorSuggestWidget.background": "#" + colors.background,
            "editorHoverWidget.background": "#" + colors.background,
          },
        };

        monaco.editor.defineTheme("custom-theme", customTheme);
        monaco.editor.setTheme("custom-theme");
      }
    }
  }, [currentTheme]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Helper function to convert any color to hex
    const convertToHex = (color: string): string => {
      if (color.startsWith("#")) {
        return color.replace("#", "");
      }
      if (color.startsWith("rgba") || color.startsWith("rgb")) {
        // For rgba/rgb colors, extract values and convert to hex
        const values = color.match(/\d+/g);
        if (values && values.length >= 3) {
          const r = parseInt(values[0]);
          const g = parseInt(values[1]);
          const b = parseInt(values[2]);
          return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
      }
      // Fallback colors
      return currentTheme.name === "light" ? "ffffff" : "1e1e1e";
    };

    // Get appropriate base colors for Monaco
    const getMonacoColors = () => {
      const isLight = currentTheme.name === "light";

      return {
        background: convertToHex(currentTheme.editor.background),
        foreground: convertToHex(currentTheme.editor.foreground),
        selection: convertToHex(currentTheme.editor.selection),
        lineNumber: convertToHex(currentTheme.editor.lineNumber),
        border: convertToHex(currentTheme.border),
        keyword: convertToHex(currentTheme.editor.keyword),
        string: convertToHex(currentTheme.editor.string),
        comment: convertToHex(currentTheme.editor.comment),
        function: convertToHex(currentTheme.editor.function),
        variable: convertToHex(currentTheme.editor.variable),
      };
    };

    const colors = getMonacoColors();

    // Define custom theme
    const customTheme = {
      base: (currentTheme.name === "light" ? "vs" : "vs-dark") as
        | "vs"
        | "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: colors.comment },
        { token: "keyword", foreground: colors.keyword },
        { token: "string", foreground: colors.string },
        { token: "function", foreground: colors.function },
        { token: "variable", foreground: colors.variable },
        { token: "identifier", foreground: colors.variable },
        { token: "type", foreground: colors.keyword },
        { token: "number", foreground: colors.string },
      ],
      colors: {
        "editor.background": "#" + colors.background,
        "editor.foreground": "#" + colors.foreground,
        "editor.lineHighlightBackground": "#" + colors.selection,
        "editorLineNumber.foreground": "#" + colors.lineNumber,
        "editor.selectionBackground": "#" + colors.selection,
        "editorWidget.background": "#" + colors.background,
        "editorSuggestWidget.background": "#" + colors.background,
        "editorHoverWidget.background": "#" + colors.background,
      },
    };

    monaco.editor.defineTheme("custom-theme", customTheme);
    monaco.editor.setTheme("custom-theme");
  };

  const getMonacoLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      javascript: "javascript",
      typescript: "typescript",
      python: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
    };
    return languageMap[lang] || "javascript";
  };

  return (
    <div
      className="relative h-full rounded-lg overflow-hidden transition-all duration-300"
      style={{
        border: `1px solid ${currentTheme.border}`,
        boxShadow: currentTheme.glass.shadow,
      }}
    >
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: "line",
          automaticLayout: true,
          fontSize: 14,
          fontFamily:
            '"Fira Code", "JetBrains Mono", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
          fontLigatures: true,
          lineNumbers: "on",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          folding: true,
          glyphMargin: true,
          lineNumbersMinChars: 3,
          lineDecorationsWidth: 10,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          suggest: {
            insertMode: "replace",
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
          parameterHints: {
            enabled: true,
          },
          hover: {
            enabled: true,
          },
          contextmenu: true,
          mouseWheelZoom: true,
        }}
      />
    </div>
  );
}
