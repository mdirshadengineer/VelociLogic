import React from "react";
import { AppNodeData } from "src/lib/types";

// This node expects data.code (string) and optionally data.language (string)
type CodeBlockNodeProps = {
  data: AppNodeData & {
    code?: string;
    language?: string;
  };
};

const CodeBlockNode: React.FC<CodeBlockNodeProps> = ({ data }) => (
  <div
    style={{
      background: "#282c34",
      color: "#fff",
      borderRadius: 8,
      padding: 16,
      fontFamily: "monospace",
      fontSize: 14,
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      minWidth: 200,
      maxWidth: 400,
      overflowX: "auto",
    }}
  >
    <div style={{ marginBottom: 8, fontWeight: "bold" }}>
      Code Block
      {data.language && (
        <span style={{ marginLeft: 8, fontSize: 12, color: "#61dafb" }}>
          ({data.language})
        </span>
      )}
    </div>
    <pre style={{ margin: 0 }}>
      <code>
        {data.code || "// No code provided"}
      </code>
    </pre>
  </div>
);

export default CodeBlockNode;