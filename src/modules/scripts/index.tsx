"use client";

import React, { useState, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import {
  Folder,
  File,
  Plus,
  Save,
  Play,
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Code,
  FileText,
  Zap,
} from "lucide-react";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

const CodeEditorPage: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>("main.ts");
  const [openTabs, setOpenTabs] = useState<string[]>(["main.ts"]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const editorRef = useRef<any>(null);

  const [files, setFiles] = useState<Record<string, FileNode>>({
    "main.ts": {
      id: "main.ts",
      name: "main.ts",
      type: "file",
      language: "typescript",
      content: `// Welcome to your code editor!
// This editor supports full TypeScript with autocomplete

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
    console.log(\`User \${user.name} added successfully\`);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getActiveUsers(): User[] {
    return this.users.filter(user => user.isActive);
  }
}

// Try typing "userService." to see autocomplete in action
const userService = new UserService();

const newUser: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  isActive: true
};

userService.addUser(newUser);
`,
    },
    "utils.ts": {
      id: "utils.ts",
      name: "utils.ts",
      type: "file",
      language: "typescript",
      content: `// Utility functions for your low-code platform

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`);
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}
`,
    },
    "components.tsx": {
      id: "components.tsx",
      name: "components.tsx",
      type: "file",
      language: "typescript",
      content: `import React from 'react';

// Sample React components for your low-code platform

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={\`bg-white rounded-lg shadow-md p-6 \${className}\`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
};
`,
    },
  });

  const [projectStructure] = useState<FileNode[]>([
    {
      id: "src",
      name: "src",
      type: "folder",
      isOpen: true,
      children: [
        { id: "main.ts", name: "main.ts", type: "file" },
        { id: "utils.ts", name: "utils.ts", type: "file" },
        { id: "components.tsx", name: "components.tsx", type: "file" },
      ],
    },
  ]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"],
      strict: true,
      noImplicitAny: false,
      skipLibCheck: true,
    });

    // Configure JavaScript compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      checkJs: false,
      strict: false,
      noImplicitAny: false,
      skipLibCheck: true,
    });

    // Configure TypeScript diagnostics
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });

    // Configure JavaScript diagnostics to be more permissive
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: true,
    });

    // Create models for all files to ensure proper language detection
    Object.keys(files).forEach((fileId) => {
      const file = files[fileId];
      const uri = monaco.Uri.parse(`file:///${file.name}`);
      const existingModel = monaco.editor.getModel(uri);

      if (!existingModel) {
        monaco.editor.createModel(
          file.content || "",
          getFileLanguage(file.name),
          uri
        );
      }
    });

    // Add extra libraries for better autocomplete
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare module 'react' {
        import * as React from 'react';
        export = React;
        export as namespace React;
        
        export interface Component<P = {}, S = {}, SS = any> {}
        export interface ComponentClass<P = {}> {}
        export interface FunctionComponent<P = {}> {
          (props: P & { children?: ReactNode }): ReactElement | null;
        }
        export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {}
        export type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;
        export type ReactFragment = {} | ReactNodeArray;
        export interface ReactNodeArray extends Array<ReactNode> {}
        export type ReactPortal = {};
        export type JSXElementConstructor<P> = ((props: P) => ReactElement | null) | (new (props: P) => Component<P, any>);
        export type FC<P = {}> = FunctionComponent<P>;
        export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prevState: S) => S)) => void];
        export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        export function useRef<T>(initialValue: T): { current: T };
        export function useRef<T>(initialValue: T | null): { current: T | null };
        export function useRef<T = undefined>(): { current: T | undefined };
      }
      
      declare global {
        interface Console {
          log(message?: any, ...optionalParams: any[]): void;
          error(message?: any, ...optionalParams: any[]): void;
          warn(message?: any, ...optionalParams: any[]): void;
        }
        var console: Console;
      }
    `,
      "console.d.ts"
    );

    // Set editor theme
    monaco.editor.setTheme("vs-dark");
  };

  const openFile = (fileId: string) => {
    setActiveFile(fileId);
    if (!openTabs.includes(fileId)) {
      setOpenTabs([...openTabs, fileId]);
    }
  };

  const closeTab = (fileId: string) => {
    const newTabs = openTabs.filter((id) => id !== fileId);
    setOpenTabs(newTabs);
    if (activeFile === fileId && newTabs.length > 0) {
      setActiveFile(newTabs[newTabs.length - 1]);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      setFiles((prev) => ({
        ...prev,
        [activeFile]: {
          ...prev[activeFile],
          content: value,
        },
      }));
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm ${
            activeFile === node.id ? "bg-gray-600" : ""
          }`}
          onClick={() => node.type === "file" && openFile(node.id)}
        >
          {node.type === "folder" ? (
            <>
              {node.isOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <Folder size={16} className="mx-1 text-blue-400" />
            </>
          ) : (
            <>
              <div style={{ width: 16 }} />
              {node.name.endsWith(".tsx") || node.name.endsWith(".jsx") ? (
                <Code size={16} className="mx-1 text-blue-400" />
              ) : (
                <FileText size={16} className="mx-1 text-gray-400" />
              )}
            </>
          )}
          <span className="text-gray-200">{node.name}</span>
        </div>
        {node.type === "folder" &&
          node.isOpen &&
          node.children &&
          renderFileTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="text-blue-400" size={20} />
            <span className="text-white font-semibold">Code Editor</span>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="text-gray-400 hover:text-white transition-colors p-1"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={16} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <Save size={16} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <Play size={16} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-gray-200 font-medium text-sm">
                PROJECT EXPLORER
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {renderFileTree(projectStructure)}
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-gray-800 border-b border-gray-700 flex">
            {openTabs.map((tabId) => (
              <div
                key={tabId}
                className={`flex items-center px-3 py-2 border-r border-gray-700 cursor-pointer text-sm ${
                  activeFile === tabId
                    ? "bg-gray-900 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveFile(tabId)}
              >
                <FileText size={14} className="mr-2" />
                <span>{files[tabId]?.name}</span>
                <button
                  className="ml-2 hover:bg-gray-600 rounded p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tabId);
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-1">
            {activeFile && files[activeFile] ? (
              <MonacoEditor
                height="100%"
                path={files[activeFile].name}
                value={files[activeFile].content || ""}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
                options={{
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  minimap: { enabled: true },
                  suggestOnTriggerCharacters: true,
                  acceptSuggestionOnEnter: "on",
                  tabCompletion: "on",
                  wordBasedSuggestions: "currentDocument",
                  quickSuggestions: {
                    other: true,
                    comments: true,
                    strings: true,
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Code size={48} className="mx-auto mb-4" />
                  <p>Select a file to start editing</p>
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="bg-gray-800 border-t border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>TypeScript</span>
              <span>UTF-8</span>
              <span>LF</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Ln 1, Col 1</span>
              <span>Spaces: 2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <button
        className="fixed top-14 left-2 z-10 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
    </div>
  );

  // Helper function to determine file language based on extension
  function getFileLanguage(fileName: string): string {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "ts":
        return "typescript";
      case "tsx":
        return "typescript";
      case "js":
        return "javascript";
      case "jsx":
        return "javascript";
      case "json":
        return "json";
      case "css":
        return "css";
      case "html":
        return "html";
      case "md":
        return "markdown";
      default:
        return "typescript";
    }
  }
};

export default CodeEditorPage;
