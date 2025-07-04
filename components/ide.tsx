"use client";

import { useState, useCallback, useMemo } from "react";
import { useTheme } from "@/contexts/theme-context";
import { CodeEditor } from "./code-editor";
import { ThemeSelector } from "./theme-selector";
import {
  LanguageSelector,
  languages,
  type Language,
} from "./language-selector";
import { ResizablePanels } from "./resizable-panels";
import {
  Play,
  Terminal,
  FileText,
  Loader2,
  Zap,
  AlertCircle,
  CheckCircle,
  Keyboard,
} from "lucide-react";
import { codeExecutor, type ExecutionResult } from "@/lib/code-executor";
import {
  useKeyboardShortcuts,
  type KeyboardShortcut,
} from "@/hooks/use-keyboard-shortcuts";

export function IDE() {
  const { currentTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages[0]
  );
  const [code, setCode] = useState<string>(selectedLanguage.template);
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastExecution, setLastExecution] = useState<ExecutionResult | null>(
    null
  );
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);

  const handleLanguageChange = useCallback((language: Language) => {
    setSelectedLanguage(language);
    setCode(language.template);
    setOutput("");
    setLastExecution(null);
  }, []);

  const formatExecutionOutput = useCallback(
    (result: ExecutionResult): string => {
      const timestamp = new Date().toLocaleTimeString();
      let formattedOutput = "";

      formattedOutput += `╔══════════════════════════════════════╗\n`;
      formattedOutput += `║            D-Code Compiler           ║\n`;
      formattedOutput += `╚══════════════════════════════════════╝\n\n`;
      formattedOutput += `📋 Language: ${selectedLanguage.name}\n`;
      formattedOutput += `⏰ Time: ${timestamp}\n`;

      if (result.success) {
        formattedOutput += `✅ Status: Execution Successful\n\n`;

        if (input.trim()) {
          formattedOutput += `📥 Input Data:\n${input.trim()}\n\n`;
        }

        formattedOutput += `🖥️  Program Output:\n`;
        formattedOutput += `${"─".repeat(50)}\n`;
        formattedOutput += `${result.output}\n`;
      } else {
        formattedOutput += `❌ Status: Execution Failed\n\n`;
        formattedOutput += `🚨 Error Details:\n`;
        formattedOutput += `${"─".repeat(50)}\n`;
        formattedOutput += `${result.error || "Unknown error occurred"}\n`;

        if (result.output) {
          formattedOutput += `\n📤 Partial Output:\n`;
          formattedOutput += `${result.output}\n`;
        }
      }

      formattedOutput += `\n${"─".repeat(50)}\n`;
      formattedOutput += `📊 Execution Statistics:\n`;
      formattedOutput += `   • Execution time: ${result.executionTime.toFixed(
        3
      )}s\n`;
      formattedOutput += `   • Memory used: ${result.memoryUsed}MB\n`;
      formattedOutput += `   • Exit code: ${result.success ? 0 : 1}\n`;

      return formattedOutput;
    },
    [selectedLanguage, input]
  );

  const runCode = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput("🔄 Compiling and running code...\n");

    try {
      const result = await codeExecutor.executeCode({
        language: selectedLanguage,
        code,
        input: input || undefined,
      });

      setLastExecution(result);
      const formattedOutput = formatExecutionOutput(result);
      setOutput(formattedOutput);
    } catch (error) {
      const errorResult: ExecutionResult = {
        success: false,
        output: "",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        executionTime: 0,
        memoryUsed: 0,
      };
      setLastExecution(errorResult);
      setOutput(formatExecutionOutput(errorResult));
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, selectedLanguage, code, input, formatExecutionOutput]);

  const clearOutput = useCallback(() => {
    setOutput("");
    setLastExecution(null);
  }, []);

  const nextLanguage = useCallback(() => {
    const currentIndex = languages.findIndex(
      (lang) => lang.id === selectedLanguage.id
    );
    const nextIndex = (currentIndex + 1) % languages.length;
    handleLanguageChange(languages[nextIndex]);
  }, [selectedLanguage, handleLanguageChange]);

  const prevLanguage = useCallback(() => {
    const currentIndex = languages.findIndex(
      (lang) => lang.id === selectedLanguage.id
    );
    const prevIndex =
      currentIndex === 0 ? languages.length - 1 : currentIndex - 1;
    handleLanguageChange(languages[prevIndex]);
  }, [selectedLanguage, handleLanguageChange]);

  const shortcuts: KeyboardShortcut[] = useMemo(
    () => [
      {
        key: "Enter",
        ctrlKey: true,
        action: runCode,
        description: "Run code",
      },
      {
        key: "k",
        ctrlKey: true,
        action: clearOutput,
        description: "Clear output",
      },
      {
        key: "ArrowRight",
        ctrlKey: true,
        altKey: true,
        action: nextLanguage,
        description: "Next language",
      },
      {
        key: "ArrowLeft",
        ctrlKey: true,
        altKey: true,
        action: prevLanguage,
        description: "Previous language",
      },
      {
        key: "/",
        ctrlKey: true,
        action: () => setShowShortcuts(!showShortcuts),
        description: "Toggle shortcuts help",
      },
    ],
    [runCode, clearOutput, nextLanguage, prevLanguage, showShortcuts]
  );

  useKeyboardShortcuts(shortcuts);

  const isCodeEmpty = useMemo(() => !code.trim(), [code]);

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
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#ff5f57" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#ffbd2e" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#28ca42" }}
            />
          </div>
          <h1
            className="text-xl font-bold"
            style={{ color: currentTheme.foreground }}
          >
            D-Code
          </h1>
          {lastExecution && (
            <div className="flex items-center gap-2 text-sm">
              {lastExecution.success ? (
                <CheckCircle size={16} style={{ color: "#28ca42" }} />
              ) : (
                <AlertCircle size={16} style={{ color: "#ff5f57" }} />
              )}
              <span
                style={{
                  color: lastExecution.success ? "#28ca42" : "#ff5f57",
                }}
              >
                {lastExecution.success ? "Success" : "Error"}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors duration-300 text-sm min-h-[42px]"
            style={{
              background: showShortcuts
                ? currentTheme.accent + "20"
                : currentTheme.button.secondary,
              color: currentTheme.secondaryForeground,
              border: `1px solid ${currentTheme.border}`,
            }}
            title="Keyboard Shortcuts (Ctrl+/)"
          >
            <Keyboard size={14} />
          </button>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
          <ThemeSelector />
        </div>
      </div>

      {/* Shortcuts Help Panel */}
      {showShortcuts && (
        <div
          className="p-4 border-b"
          style={{
            borderColor: currentTheme.border,
            background: currentTheme.glass.background,
          }}
        >
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: currentTheme.foreground }}
          >
            Keyboard Shortcuts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between items-center">
                <span style={{ color: currentTheme.foreground }}>
                  {shortcut.description}
                </span>
                <code
                  className="px-2 py-1 rounded"
                  style={{
                    background: currentTheme.secondary,
                    color: currentTheme.secondaryForeground,
                  }}
                >
                  {[
                    shortcut.ctrlKey && "Ctrl",
                    shortcut.metaKey && "Cmd",
                    shortcut.altKey && "Alt",
                    shortcut.shiftKey && "Shift",
                    shortcut.key === " " ? "Space" : shortcut.key,
                  ]
                    .filter(Boolean)
                    .join(" + ")}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 p-4">
        <CodeEditor
          value={code}
          onChange={setCode}
          language={selectedLanguage.id}
        />
      </div>

      {/* Action Buttons */}
      <div
        className="p-4 border-t space-y-3"
        style={{ borderColor: currentTheme.border }}
      >
        <button
          onClick={runCode}
          disabled={isRunning || isCodeEmpty}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isRunning
              ? currentTheme.secondary
              : currentTheme.button.primary,
            color: currentTheme.primaryForeground,
            boxShadow: `0 4px 15px ${currentTheme.primary}40`,
          }}
          onMouseEnter={(e) => {
            if (!isRunning && !isCodeEmpty) {
              e.currentTarget.style.background =
                currentTheme.button.primaryHover;
            }
          }}
          onMouseLeave={(e) => {
            if (!isRunning && !isCodeEmpty) {
              e.currentTarget.style.background = currentTheme.button.primary;
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
              <span>{isCodeEmpty ? "No Code to Run" : "Run Code"}</span>
              {!isCodeEmpty && <Zap size={16} className="ml-1" />}
            </>
          )}
        </button>

        {output && (
          <button
            onClick={clearOutput}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 min-h-[42px]"
            style={{
              background: currentTheme.button.secondary,
              color: currentTheme.secondaryForeground,
              border: `1px solid ${currentTheme.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                currentTheme.button.secondaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = currentTheme.button.secondary;
            }}
          >
            Clear Output
          </button>
        )}
      </div>
    </div>
  );

  const rightPanel = (
    <div className="h-full flex flex-col">
      {/* Input Section */}
      <div
        className="flex-1 flex flex-col border-b"
        style={{ borderColor: currentTheme.border }}
      >
        <div
          className="flex items-center justify-between gap-2 p-3 border-b"
          style={{
            borderColor: currentTheme.border,
            background: currentTheme.glass.background,
          }}
        >
          <div className="flex items-center gap-2">
            <FileText size={16} style={{ color: currentTheme.accent }} />
            <span
              className="text-sm font-medium"
              style={{ color: currentTheme.foreground }}
            >
              Input
            </span>
          </div>
          <span
            className="text-xs"
            style={{ color: currentTheme.editor.lineNumber }}
          >
            Optional program input
          </span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input for your program (optional)..."
          className="flex-1 p-4 font-mono text-sm resize-none outline-none border-0 overflow-auto transition-colors duration-300"
          style={{
            background: currentTheme.input,
            color: currentTheme.foreground,
          }}
        />
      </div>

      {/* Output Section */}
      <div className="flex-1 flex flex-col">
        <div
          className="flex items-center justify-between gap-2 p-3 border-b"
          style={{
            borderColor: currentTheme.border,
            background: currentTheme.glass.background,
          }}
        >
          <div className="flex items-center gap-2">
            <Terminal size={16} style={{ color: currentTheme.accent }} />
            <span
              className="text-sm font-medium"
              style={{ color: currentTheme.foreground }}
            >
              Output
            </span>
          </div>
          {lastExecution && (
            <div className="flex items-center gap-2 text-xs">
              <span style={{ color: currentTheme.editor.lineNumber }}>
                {lastExecution.executionTime.toFixed(3)}s
              </span>
              <span style={{ color: currentTheme.editor.lineNumber }}>
                {lastExecution.memoryUsed}MB
              </span>
            </div>
          )}
        </div>
        <div
          className="flex-1 p-4 font-mono text-sm whitespace-pre-wrap overflow-auto transition-colors duration-300"
          style={{
            background: currentTheme.editor.background,
            color: currentTheme.editor.foreground,
          }}
        >
          {output || (
            <div style={{ color: currentTheme.editor.lineNumber }}>
              Click "Run Code" to see output here...
              <br />
              <br />
              💡 Tips:
              <br />
              • Use print() for Python
              <br />
              • Use console.log() for JavaScript/TypeScript
              <br />
              • Use System.out.println() for Java
              <br />• Use cout &lt;&lt; for C++
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="h-screen w-full transition-all duration-500"
      style={{
        background: currentTheme.background,
        color: currentTheme.foreground,
      }}
    >
      <ResizablePanels
        leftPanel={leftPanel}
        rightPanel={rightPanel}
        defaultLeftWidth={65}
      />
    </div>
  );
}
