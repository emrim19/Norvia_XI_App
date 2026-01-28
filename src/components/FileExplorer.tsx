import { useState } from 'react';

interface FileItem {
  name: string;
  isDirectory: boolean;
  size: number;
}

const FileExplorer = () => {
  const [data, setData] = useState<{ path: string; files: FileItem[] } | null>(null);

  const handleBrowse = async () => {
    const result = await window.electronAPI.selectFolder();
    if (result) {
      console.log("User selected:", result.path);
      // Set this to your state to update the Dashboard table
      setData(result); 
    }
  };

  return (
    <div className="dashboard-container">
      <h1>File Explorer</h1>
      <button onClick={handleBrowse} className="nav-button active">
        Scan Documents
      </button>

      {data && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: '#64748b', marginBottom: '10px' }}>Location: {data.path}</p>
          
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data.files.map((file, index) => (
              <li key={index} style={{ 
                padding: '10px', 
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '10px' }}>
                  {file.isDirectory ? '📁' : '📄'}
                </span>
                <span style={{ flex: 1 }}>{file.name}</span>
                {!file.isDirectory && (
                  <span style={{ color: '#475569', fontSize: '0.8rem' }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;