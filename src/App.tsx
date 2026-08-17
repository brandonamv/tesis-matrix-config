import { useState } from 'react'
import './App.css'

function App() {
  const [maxInteractions, setMaxInteractions] = useState<number>(0);
  const [text, setText] = useState("Hello, this is the text inside my file!");

  const handleDownload = () => {
    // 1. Create a blob with the text data and set MIME type to plain text
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

    // 2. Generate a temporary object URL pointing to the blob
    const url = URL.createObjectURL(blob);

    // 3. Create a temporary hidden anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-custom-file.txt'; // The default filename

    // 4. Append to DOM, click it to trigger download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Free up memory
  };

  return (
    <>
      <div style={{ padding: '20px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          cols={40}
        />
        <br />
        <button onClick={handleDownload}>Download Text File</button>
      </div>

    </>
  )
}

export default App
