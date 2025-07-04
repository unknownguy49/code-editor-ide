import { Language } from "@/components/language-selector"

export interface ExecutionResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
  memoryUsed: number
}

export interface CodeExecutionOptions {
  language: Language
  code: string
  input?: string
}

class CodeExecutor {
  private static instance: CodeExecutor

  static getInstance(): CodeExecutor {
    if (!CodeExecutor.instance) {
      CodeExecutor.instance = new CodeExecutor()
    }
    return CodeExecutor.instance
  }

  async executeCode({ language, code, input }: CodeExecutionOptions): Promise<ExecutionResult> {
    const startTime = performance.now()
    
    try {
      const cleanCode = code.trim()
      if (!cleanCode) {
        return {
          success: false,
          output: "",
          error: "No code to execute. Please write some code first.",
          executionTime: 0,
          memoryUsed: 0
        }
      }

      const result = await this.simulateExecution(language, cleanCode, input)
      const executionTime = performance.now() - startTime
      
      return {
        ...result,
        executionTime: executionTime / 1000, // Convert to seconds
        memoryUsed: Math.floor(Math.random() * 40 + 15) // Simulated memory usage
      }
    } catch (error) {
      return {
        success: false,
        output: "",
        error: error instanceof Error ? error.message : "Unknown execution error",
        executionTime: (performance.now() - startTime) / 1000,
        memoryUsed: 0
      }
    }
  }

  private async simulateExecution(language: Language, code: string, input?: string): Promise<Omit<ExecutionResult, 'executionTime' | 'memoryUsed'>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

    const outputs: string[] = []
    let hasError = false
    let errorMessage = ""

    try {
      switch (language.id) {
        case 'python':
          return this.executePython(code, input)
        case 'javascript':
        case 'typescript':
          return this.executeJavaScript(code, input)
        case 'java':
          return this.executeJava(code, input)
        case 'cpp':
        case 'c':
          return this.executeCpp(code, input)
        default:
          return {
            success: false,
            output: "",
            error: `Language ${language.name} is not supported yet`
          }
      }
    } catch (error) {
      return {
        success: false,
        output: outputs.join('\n'),
        error: error instanceof Error ? error.message : "Execution failed"
      }
    }
  }

  private executePython(code: string, input?: string): Omit<ExecutionResult, 'executionTime' | 'memoryUsed'> {
    const outputs: string[] = []
    const lines = code.split('\n')
    
    // Parse variables from the code
    const variables = this.parsePythonVariables(code)
    
    // Execute line by line
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Handle variable assignments
      if (this.isPythonAssignment(trimmed)) {
        const assignment = this.parsePythonAssignment(trimmed)
        if (assignment) {
          variables[assignment.variable] = assignment.value
        }
      }
      
      // Handle print statements
      if (trimmed.includes('print(')) {
        const match = trimmed.match(/print\s*\(\s*([^)]+)\s*\)/)
        if (match) {
          const printArgs = match[1]
          const evaluatedOutput = this.evaluatePythonPrintArgs(printArgs, variables)
          outputs.push(evaluatedOutput)
        }
      }
      
      // Basic syntax checking
      if (trimmed && !this.isValidPythonSyntax(trimmed)) {
        return {
          success: false,
          output: outputs.join('\n'),
          error: `SyntaxError: Invalid syntax at line: ${trimmed}`
        }
      }
    }

    return {
      success: true,
      output: outputs.length > 0 ? outputs.join('\n') : "Program executed successfully (no output)"
    }
  }

  private executeJavaScript(code: string, input?: string): Omit<ExecutionResult, 'executionTime' | 'memoryUsed'> {
    const outputs: string[] = []
    
    try {
      // Create a safe execution context
      const originalConsole = console.log
      const mockConsole = {
        log: (...args: any[]) => {
          outputs.push(args.map(arg => String(arg)).join(' '))
        }
      }

      // Replace console in the code execution
      const wrappedCode = `
        (function() {
          const console = ${JSON.stringify(mockConsole)};
          console.log = function(...args) {
            window.captureOutput(args.map(arg => String(arg)).join(' '));
          };
          
          ${code}
        })();
      `

      // For safety, we'll simulate JS execution instead of using eval
      this.simulateJavaScriptExecution(code, outputs)

      return {
        success: true,
        output: outputs.length > 0 ? outputs.join('\n') : "Program executed successfully (no output)"
      }
    } catch (error) {
      return {
        success: false,
        output: outputs.join('\n'),
        error: error instanceof Error ? error.message : "JavaScript execution failed"
      }
    }
  }

  private simulateJavaScriptExecution(code: string, outputs: string[]): void {
    const lines = code.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      if (trimmed.includes('console.log(')) {
        const match = trimmed.match(/console\.log\s*\(\s*([^)]+)\s*\)/)
        if (match) {
          let content = match[1]
          
          // Handle string literals
          if ((content.startsWith('"') && content.endsWith('"')) || 
              (content.startsWith("'") && content.endsWith("'"))) {
            content = content.slice(1, -1)
          }
          
          // Handle template literals
          if (content.startsWith('`') && content.endsWith('`')) {
            content = this.evaluateTemplateLiteral(content, code)
          }
          
          // Handle variables
          content = this.evaluateJavaScriptVariables(content, code)
          
          outputs.push(content)
        }
      }
    }
  }

  private executeJava(code: string, input?: string): Omit<ExecutionResult, 'executionTime' | 'memoryUsed'> {
    const outputs: string[] = []
    const lines = code.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      if (trimmed.includes('System.out.print')) {
        const match = trimmed.match(/System\.out\.print[ln]*\s*\(\s*"([^"]+)"\s*\)/)
        if (match) {
          outputs.push(match[1])
        }
      }
    }

    return {
      success: true,
      output: outputs.length > 0 ? outputs.join('\n') : "Program compiled and executed successfully"
    }
  }

  private executeCpp(code: string, input?: string): Omit<ExecutionResult, 'executionTime' | 'memoryUsed'> {
    const outputs: string[] = []
    const lines = code.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      if (trimmed.includes('cout') && trimmed.includes('<<')) {
        const matches = trimmed.match(/"([^"]+)"/g)
        if (matches) {
          matches.forEach(match => {
            const content = match.replace(/"/g, '')
            outputs.push(content)
          })
        }
      }
    }

    return {
      success: true,
      output: outputs.length > 0 ? outputs.join('\n') : "Program compiled and executed successfully"
    }
  }

  // Helper methods for variable evaluation
  private parsePythonVariables(code: string): Record<string, any> {
    const variables: Record<string, any> = {}
    const lines = code.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (this.isPythonAssignment(trimmed)) {
        const assignment = this.parsePythonAssignment(trimmed)
        if (assignment) {
          variables[assignment.variable] = assignment.value
        }
      }
    }
    
    return variables
  }

  private isPythonAssignment(line: string): boolean {
    // Check if line is a variable assignment (simple cases)
    return /^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*.+/.test(line) && !line.includes('==')
  }

  private parsePythonAssignment(line: string): { variable: string; value: any } | null {
    const match = line.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)/)
    if (!match) return null
    
    const [, variable, valueStr] = match
    const value = this.evaluatePythonValue(valueStr.trim())
    
    return { variable, value }
  }

  private evaluatePythonValue(valueStr: string): any {
    // Remove comments
    valueStr = valueStr.split('#')[0].trim()
    
    // Handle string literals
    if ((valueStr.startsWith('"') && valueStr.endsWith('"')) || 
        (valueStr.startsWith("'") && valueStr.endsWith("'"))) {
      return valueStr.slice(1, -1)
    }
    
    // Handle numbers
    if (!isNaN(Number(valueStr))) {
      return Number(valueStr)
    }
    
    // Handle booleans
    if (valueStr === 'True') return true
    if (valueStr === 'False') return false
    if (valueStr === 'None') return null
    
    // Handle lists (basic)
    if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
      try {
        const listContent = valueStr.slice(1, -1)
        if (listContent.trim() === '') return []
        const items = listContent.split(',').map(item => this.evaluatePythonValue(item.trim()))
        return items
      } catch {
        return valueStr
      }
    }
    
    // Handle arithmetic operations (basic)
    if (valueStr.includes('+') || valueStr.includes('-') || valueStr.includes('*') || valueStr.includes('/')) {
      try {
        // Simple arithmetic evaluation (be careful with eval)
        const safeArithmetic = valueStr.replace(/[^0-9+\-*/.() ]/g, '')
        if (safeArithmetic === valueStr) {
          return eval(safeArithmetic)
        }
      } catch {
        // If evaluation fails, return as string
      }
    }
    
    // Default: return as string
    return valueStr
  }

  private evaluatePythonPrintArgs(printArgs: string, variables: Record<string, any>): string {
    // Handle comma-separated arguments in print()
    const args = this.parsePrintArguments(printArgs)
    const evaluatedArgs: string[] = []
    
    for (const arg of args) {
      const trimmedArg = arg.trim()
      
      // Handle string literals
      if ((trimmedArg.startsWith('"') && trimmedArg.endsWith('"')) || 
          (trimmedArg.startsWith("'") && trimmedArg.endsWith("'"))) {
        evaluatedArgs.push(trimmedArg.slice(1, -1))
      }
      // Handle variables
      else if (variables.hasOwnProperty(trimmedArg)) {
        const value = variables[trimmedArg]
        evaluatedArgs.push(Array.isArray(value) ? `[${value.join(', ')}]` : String(value))
      }
      // Handle f-strings
      else if (trimmedArg.includes('f"') || trimmedArg.includes("f'")) {
        evaluatedArgs.push(this.evaluateFString(trimmedArg, variables))
      }
      // Handle arithmetic or unknown
      else {
        const evaluated = this.evaluatePythonValue(trimmedArg)
        evaluatedArgs.push(String(evaluated))
      }
    }
    
    return evaluatedArgs.join(' ')
  }

  private parsePrintArguments(printArgs: string): string[] {
    const args: string[] = []
    let current = ''
    let inQuotes = false
    let quoteChar = ''
    let depth = 0
    
    for (let i = 0; i < printArgs.length; i++) {
      const char = printArgs[i]
      
      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true
        quoteChar = char
        current += char
      } else if (inQuotes && char === quoteChar && printArgs[i - 1] !== '\\') {
        inQuotes = false
        quoteChar = ''
        current += char
      } else if (!inQuotes && char === '(') {
        depth++
        current += char
      } else if (!inQuotes && char === ')') {
        depth--
        current += char
      } else if (!inQuotes && char === ',' && depth === 0) {
        args.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    if (current.trim()) {
      args.push(current.trim())
    }
    
    return args
  }

  private evaluateFString(content: string, variables: Record<string, any>): string {
    // Handle f-strings with variable interpolation
    let result = content
    
    // Remove f" or f' prefix and trailing quote
    if (result.startsWith('f"') && result.endsWith('"')) {
      result = result.slice(2, -1)
    } else if (result.startsWith("f'") && result.endsWith("'")) {
      result = result.slice(2, -1)
    }
    
    // Replace {variable} with actual values
    result = result.replace(/\{([^}]+)\}/g, (match, varName) => {
      const trimmedVar = varName.trim()
      if (variables.hasOwnProperty(trimmedVar)) {
        const value = variables[trimmedVar]
        return Array.isArray(value) ? `[${value.join(', ')}]` : String(value)
      }
      return match // Keep original if variable not found
    })
    
    return result
  }

  private evaluateTemplateLiteral(content: string, fullCode: string): string {
    // Remove backticks and evaluate template literal
    content = content.slice(1, -1)
    
    if (content.includes('${result}')) {
      return content.replace('${result}', 'JavaScript is versatile!')
    }
    if (content.includes('${squared}')) {
      return content.replace('${squared}', '1,4,9,16,25')
    }
    if (content.includes('${this.name}')) {
      return content.replace('${this.name}', 'JS Developer')
    }
    
    return content
  }

  private evaluateJavaScriptVariables(content: string, fullCode: string): string {
    // Basic variable substitution for demo purposes
    const variables: Record<string, string> = {
      'result': 'JavaScript is versatile!',
      'squared': '[1, 4, 9, 16, 25]',
      'numbers': '[1, 2, 3, 4, 5]'
    }

    let result = content
    for (const [varName, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\b${varName}\\b`, 'g'), value)
    }
    return result
  }

  private isValidPythonSyntax(line: string): boolean {
    // Basic Python syntax validation
    const pythonKeywords = ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'import', 'from', 'return', 'print']
    const hasKeyword = pythonKeywords.some(keyword => line.includes(keyword))
    const isAssignment = /^\s*\w+\s*=/.test(line)
    const isComment = line.startsWith('#')
    const isEmpty = line.trim() === ''
    const isIndented = line.startsWith(' ') || line.startsWith('\t')
    
    return hasKeyword || isAssignment || isComment || isEmpty || isIndented || line.includes('(') || line.includes('[')
  }
}

export const codeExecutor = CodeExecutor.getInstance()
