// src/MonacoEditor.tsx
import MonacoEditor, { Monaco, OnChange } from "@monaco-editor/react";
import React from "react";

interface MonacoEditorProps {
  code: string;
  onChange: OnChange;
}

const MonacoEditorComponent: React.FC<MonacoEditorProps> = ({ code = {} }) => {
  const handleEditorWillMount = (monaco: Monaco) => {
    // Configurando o Monaco para o modo JSON
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [],
    });
  };

  return (
    <MonacoEditor
      height="500px"
      language="json"
      value={code}
      //   beforeMount={handleEditorWillMount}
      onChange={() => {
        console.log("changed");
      }}
    />
  );
};

export default MonacoEditorComponent;
