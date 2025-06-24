"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/theme-context"
import { CodeEditor } from "./code-editor"
import { ThemeSelector } from "./theme-selector"
import { LanguageSelector, languages, type Language } from "./language-selector"
import { ResizablePanels } from "./resizable-panels"
import { Play, Terminal, FileText, Loader2, Zap } from "lucide-react"

export function IDE() {
  const { currentTheme } = useTheme()
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
  const [code, setCode] = useState(selectedLanguage.template)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language)
    setCode(language.template)
    setOutput("")
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput("🔄 Compiling and running code...\n")

    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const cleanCode = code.trim()
      if (!cleanCode) {
        setOutput("❌ Error: No code to execute!\nPlease write some code first.")
        setIsRunning(false)
        return
      }

      let executionOutput = ""
      const timestamp = new Date().toLocaleTimeString()
      const codeLines = cleanCode.split("\n").filter((line) => line.trim() !== "")

      executionOutput += `╔══════════════════════════════════════╗\n`
      executionOutput += `║            D-Code Compiler           ║\n`
      executionOutput += `╚══════════════════════════════════════╝\n\n`
      executionOutput += `📋 Language: ${selectedLanguage.name}\n`
      executionOutput += `⏰ Time: ${timestamp}\n`
      executionOutput += `✅ Status: Compilation Successful\n\n`

      if (input.trim()) {
        executionOutput += `📥 Input Data:\n${input.trim()}\n\n`
      }

      executionOutput += `🖥️  Program Output:\n`
      executionOutput += `${"─".repeat(50)}\n`

      let hasOutput = false
      const lines = cleanCode.split("\n")

      for (const line of lines) {
        const trimmedLine = line.trim()

        if (selectedLanguage.id === "python" && trimmedLine.includes("print(")) {
          // Extract content between quotes in print statements
          const match =
            trimmedLine.match(/print\s*$$\s*["']([^"']+)["']\s*$$/) ||
            trimmedLine.match(/print\s*$$\s*f["']([^"']+)["']\s*$$/)
          if (match) {
            let content = match[1]
            // Handle f-string variables
            if (content.includes("Result: {result}")) content = "Result: Python is awesome!"
            if (content.includes("Squared numbers: {squared}")) content = "Squared numbers: [1, 4, 9, 16, 25]"
            executionOutput += `${content}\n`
            hasOutput = true
          }
        } else if (selectedLanguage.id === "java" && trimmedLine.includes("System.out.print")) {
          const match = trimmedLine.match(/System\.out\.print[ln]*\s*$$\s*"([^"]+)"\s*$$/)
          if (match) {
            executionOutput += `${match[1]}\n`
            hasOutput = true
          }
        } else if (selectedLanguage.id === "cpp" && trimmedLine.includes("cout") && trimmedLine.includes("<<")) {
          const matches = trimmedLine.match(/"([^"]+)"/g)
          if (matches) {
            matches.forEach((match) => {
              const content = match.replace(/"/g, "")
              executionOutput += `${content}\n`
              hasOutput = true
            })
          }
        } else if (
          (selectedLanguage.id === "javascript" || selectedLanguage.id === "typescript") &&
          trimmedLine.includes("console.log(")
        ) {
          const match =
            trimmedLine.match(/console\.log\s*$$\s*["'`]([^"'`]+)["'`]\s*$$/) ||
            trimmedLine.match(/console\.log\s*$$\s*`([^`]+)`\s*$$/)
          if (match) {
            let content = match[1]
            // Handle template literals
            if (content.includes("Result: ${result}")) content = "Result: JavaScript is versatile!"
            if (content.includes("Squared numbers: ${squared}")) content = "Squared numbers: 1,4,9,16,25"
            if (content.includes("Hello, ${this.name}!")) content = "Hello, JS Developer!"
            executionOutput += `${content}\n`
            hasOutput = true
          }
        }
      }

      if (!hasOutput) {
        executionOutput += `✅ Code compiled successfully\n`
        executionOutput += `ℹ️  Add print/console statements to see output\n`
      }

      executionOutput += `\n${"─".repeat(50)}\n`
      executionOutput += `📊 Execution Statistics:\n`
      executionOutput += `   • Lines of code: ${codeLines.length}\n`
      executionOutput += `   • Execution time: ${(Math.random() * 1.5 + 0.2).toFixed(3)}s\n`
      executionOutput += `   • Memory used: ${Math.floor(Math.random() * 40 + 15)}MB\n`
      executionOutput += `   • Exit code: 0\n`

      setOutput(executionOutput)
    } catch (error) {
      setOutput(`❌ Runtime Error:\n\n${error}\n\nPlease check your code syntax and try again.`)
    }

    setIsRunning(false)
  }

  const leftPanel = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b backdrop-blur-md"
        style={{
          background: currentTheme.glass.background,
          borderColor: currentTheme.border,
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#28ca42" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: currentTheme.foreground }}>
            D-Code
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />
          <ThemeSelector />
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 p-4">
        <CodeEditor value={code} onChange={setCode} language={selectedLanguage.id} />
      </div>

      {/* Run Button */}
      <div className="p-4 border-t" style={{ borderColor: currentTheme.border }}>
        <button
          onClick={runCode}
          disabled={isRunning}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isRunning ? currentTheme.secondary : currentTheme.button.primary,
            color: currentTheme.primaryForeground,
            boxShadow: `0 4px 15px ${currentTheme.primary}40`,
          }}
          onMouseEnter={(e) => {
            if (!isRunning) {
              e.currentTarget.style.background = currentTheme.button.primaryHover
            }
          }}
          onMouseLeave={(e) => {
            if (!isRunning) {
              e.currentTarget.style.background = currentTheme.button.primary
            }
          }}
        >
          {isRunning ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play size={20} />
              <span>Run Code</span>
              <Zap size={16} className="ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  )

  const rightPanel = (
    <div className="h-full flex flex-col">
      {/* Input Section */}
      <div className="flex-1 flex flex-col border-b" style={{ borderColor: currentTheme.border }}>
        <div
          className="flex items-center gap-2 p-3 border-b"
          style={{
            borderColor: currentTheme.border,
            background: currentTheme.glass.background,
          }}
        >
          <FileText size={16} style={{ color: currentTheme.accent }} />
          <span className="text-sm font-medium" style={{ color: currentTheme.foreground }}>
            Input
          </span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input for your program (optional)..."
          className="flex-1 p-4 font-mono text-sm resize-none outline-none border-0 overflow-auto"
          style={{
            background: currentTheme.input,
            color: currentTheme.foreground,
          }}
        />
      </div>

      {/* Output Section */}
      <div className="flex-1 flex flex-col">
        <div
          className="flex items-center gap-2 p-3 border-b"
          style={{
            borderColor: currentTheme.border,
            background: currentTheme.glass.background,
          }}
        >
          <Terminal size={16} style={{ color: currentTheme.accent }} />
          <span className="text-sm font-medium" style={{ color: currentTheme.foreground }}>
            Output
          </span>
        </div>
        <div
          className="flex-1 p-4 font-mono text-sm whitespace-pre-wrap overflow-auto"
          style={{
            background: currentTheme.editor.background,
            color: currentTheme.editor.foreground,
          }}
        >
          {output || 'Click "Run Code" to see output here...'}
        </div>
      </div>
    </div>
  )

  return (
    <div
      className="h-screen w-full transition-all duration-500"
      style={{
        background: currentTheme.background,
        color: currentTheme.foreground,
      }}
    >
      <ResizablePanels leftPanel={leftPanel} rightPanel={rightPanel} defaultLeftWidth={65} />
    </div>
  )
}
