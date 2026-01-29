import { useState } from 'react';
// @ts-ignore
import styles from './FileExplorer.module.css';

interface FileItem {
  name: string;
  isDirectory: boolean;
  size: number;
}

const SOURCES = [
  { id: 'local', name: 'Local Files', icon: '💻' },
  { id: 'google', name: 'Google Drive', icon: '🤖' }, // Use actual icons later
  { id: 'teams', name: 'MS Teams', icon: '👥' },
  { id: 'slack', name: 'Slack', icon: '💬' },
];

const FileExplorer = () => {
  const [activeSource, setActiveSource] = useState('local');
  const [data, setData] = useState<{ path: string; files: FileItem[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLocalBrowse = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.selectFolder();
      if (result) setData(result);
    } catch (error) {
      console.error("Scan error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloudConnect = async (sourceId: string) => {
  setActiveSource(sourceId);
  if (sourceId === 'local') return;

  setLoading(true);
  try {
    const result = await window.electronAPI.openCloudAuth(sourceId);
    if (result.success) {
      // Refresh the view or show a "Connected" status
      console.log(`WOW: ${sourceId} connected successfully!`);
    } else {
      console.error(result.error);
    }
  } catch (err) {
    console.error("Auth window failed", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Librarian</h1>

      {/* Source Selection Grid */}
      <div className={styles.connectorGrid}>
        {SOURCES.map((source) => (
          <div 
            key={source.id} 
            className={`${styles.connectorCard} ${activeSource === source.id ? styles.activeCard : ''}`}
            onClick={() => handleCloudConnect(source.id)}
          >
            <span className={styles.connectorIcon}>{source.icon}</span>
            <span className={styles.connectorName}>{source.name}</span>
          </div>
        ))}
      </div>

      {activeSource === 'local' ? (
        <button onClick={handleLocalBrowse} disabled={loading} className={styles.scanButton}>
          {loading ? 'Scanning...' : 'Scan Local Documents'}
        </button>
      ) : (
        <div className={styles.resultsWrapper}>
          <p>Connect your {activeSource} account to index cloud documents into Norvia XI.</p>
          <button className={styles.scanButton}>Authorize {activeSource}</button>
        </div>
      )}

      {/* Results List (only show if we have data) */}
      {activeSource === 'local' && data && (
        <div className={styles.resultsWrapper}>
          <div className={styles.locationPath}><strong>Location:</strong> {data.path}</div>
          <div className={styles.fileListContainer}>
            <ul className={styles.fileList}>
              {data.files.map((file, index) => (
                <li key={index} className={styles.fileItem}>
                  <span className={styles.icon}>{file.isDirectory ? '📁' : '📄'}</span>
                  <span className={styles.fileName}>{file.name}</span>
                  {!file.isDirectory && <span className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;