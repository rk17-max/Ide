import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import './Editor.css'; // Ensure this path is correct

const Editor = () => {
  return (
    <MonacoEditor
      height="70vh"
      width="60%"
      language="python"
      theme="vs-dark"
      defaultValue="# Write your Python code here"
    />
  );
};

export default Editor;
