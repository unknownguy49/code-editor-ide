"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useTheme } from "@/contexts/theme-context";
import { Code, ChevronDown } from "lucide-react";
import { DropdownPortal } from "./dropdown-portal";

export interface Language {
  id: string;
  name: string;
  extension: string;
  template: string;
  version?: string;
  description?: string;
}

export const languages: readonly Language[] = [
  {
    id: "python",
    name: "Python",
    extension: ".py",
    version: "3.11",
    description: "High-level programming language",
    template: `# Welcome to Python!
def hello_world():
    print("Hello, World!")
    return "Python is awesome!"

# Call the function
result = hello_world()
print(f"Result: {result}")

# Try some basic operations
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"Squared numbers: {squared}")
`,
  },
  {
    id: "java",
    name: "Java",
    extension: ".java",
    version: "17",
    description: "Object-oriented programming language",
    template: `// Welcome to Java!
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Create an instance and call method
        Main app = new Main();
        String result = app.greet("Java Developer");
        System.out.println(result);
        
        // Try some basic operations
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.print("Numbers: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
    
    public String greet(String name) {
        return "Hello, " + name + "! Java is powerful!";
    }
}
`,
  },
  {
    id: "cpp",
    name: "C++",
    extension: ".cpp",
    version: "20",
    description: "Systems programming language",
    template: `// Welcome to C++!
#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Greeter {
public:
    string greet(const string& name) {
        return "Hello, " + name + "! C++ is fast!";
    }
};

int main() {
    cout << "Hello, World!" << endl;
    
    // Create instance and call method
    Greeter greeter;
    string result = greeter.greet("C++ Developer");
    cout << result << endl;
    
    // Try some basic operations
    vector<int> numbers = {1, 2, 3, 4, 5};
    cout << "Numbers: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}
`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    extension: ".js",
    version: "ES2023",
    description: "Dynamic web programming language",
    template: `// Welcome to JavaScript!
function helloWorld() {
    console.log("Hello, World!");
    return "JavaScript is versatile!";
}

// Call the function
const result = helloWorld();
console.log(\`Result: \${result}\`);

// Try some basic operations
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(x => x ** 2);
console.log(\`Squared numbers: \${squared}\`);

// Object example
const person = {
    name: "JS Developer",
    greet() {
        return \`Hello, \${this.name}!\`;
    }
};

console.log(person.greet());
`,
  },
  {
    id: "typescript",
    name: "TypeScript",
    extension: ".ts",
    version: "5.0",
    description: "Typed superset of JavaScript",
    template: `// Welcome to TypeScript!
interface Person {
    name: string;
    age: number;
    greet(): string;
}

class Developer implements Person {
    constructor(public name: string, public age: number) {}
    
    greet(): string {
        return \`Hello, I'm \${this.name}, a TypeScript developer!\`;
    }
}

function helloWorld(): string {
    console.log("Hello, World!");
    return "TypeScript adds type safety!";
}

// Usage
const result: string = helloWorld();
console.log(\`Result: \${result}\`);

const dev: Person = new Developer("TS Developer", 25);
console.log(dev.greet());

// Array with types
const numbers: number[] = [1, 2, 3, 4, 5];
const squared: number[] = numbers.map((x: number) => x ** 2);
console.log(\`Squared numbers: \${squared}\`);
`,
  },
] as const;

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const { currentTheme } = useTheme();
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

  const handleLanguageChange = (language: Language) => {
    onLanguageChange(language);
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
        <Code size={16} />
        <span className="text-sm font-medium flex-1 text-left leading-tight">
          {selectedLanguage.name}
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
          className="w-56 rounded-lg overflow-hidden backdrop-blur-md"
          style={{
            background: currentTheme.glass.background,
            border: `1px solid ${currentTheme.glass.border}`,
            boxShadow: currentTheme.glass.shadow,
          }}
        >
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => handleLanguageChange(language)}
              className="w-full px-4 py-3 text-left text-sm transition-colors duration-200"
              style={{
                color: currentTheme.foreground,
                background:
                  selectedLanguage.id === language.id
                    ? currentTheme.accent + "20"
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                if (selectedLanguage.id !== language.id) {
                  e.currentTarget.style.background = currentTheme.accent + "10";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLanguage.id !== language.id) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <div className="flex items-start gap-3">
                <Code size={16} className="mt-0.5 flex-shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium leading-tight">
                    {language.name}
                  </span>
                  <div className="flex items-center gap-2 text-xs opacity-75 mt-0.5">
                    {language.version && (
                      <span className="leading-tight">{language.version}</span>
                    )}
                    {language.description && language.version && <span>•</span>}
                    {language.description && (
                      <span className="leading-tight truncate">
                        {language.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </DropdownPortal>
    </div>
  );
}
