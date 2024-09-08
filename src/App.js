import React, { useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

const Editor = () => {
  const editorRef = useRef(null);
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('python');

  function handleChange(e) {
    setLanguage(e.target.value);
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleRunCode() {
    const code = editorRef.current.getValue();
  
    fetch('http://localhost:8000/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }), // Specify the language if your server expects it
    })
    .then(response => response.json())
    .then(data => {
      if (data.output) {
        setOutput(data.output);
      } else if (data.error) {
        setOutput(`Error: ${data.error}`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setOutput('An error occurred while running the code.');
    });
  }

  return (
    <>

    <div className='controls' style={{ marginTop: '10px' }}>
          <select value={language} onChange={handleChange}>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">cpp</option>
            <option value="c">c</option>
          </select>
          
        </div>
    <div style={{ display: 'flex', height: '90vh' }}>
      <div className='input' style={{ flex: 1, padding: '10px', borderRight: '1px solid #ddd' }}>
        <MonacoEditor
          height="100%"
          width="100%"
          language={language}
          theme="vs-dark"
          defaultValue={
            language === 'python' 
            ? '# Write your Python code here' 
            : '// Write your Java code here'
          }
          onMount={handleEditorDidMount}
        />
        <button onClick={handleRunCode} style={{ marginLeft: '10px' }}>Run Code</button>
        
      </div>
      <div className='output' style={{ flex: 1, padding: '10px' }}>
        <strong>Output:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f0f0f0', padding: '10px', border: '1px solid #ddd' }}>{output}</pre>
      </div>
    </div>
    </>
  );
  
};

export default Editor;
