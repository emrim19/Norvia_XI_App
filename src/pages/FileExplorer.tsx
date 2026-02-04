import { useState } from 'react';
import { getUserId } from '../hooks/useUser'
// @ts-ignore
import styles from './FileExplorer.module.css';

interface FileItem {
  name: string;
  isDirectory: boolean;
  size: number;
}

const SOURCES = [
  { id: 'local', name: 'Local Files', icon: '💻' },
  { id: 'google', name: 'Google Drive', icon: '🤖' },
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

  // 1. Ensure we have the current user's ID from your Norvia XI session
  // 1. Grab the user string from storage
  const userId = getUserId();
  if (!userId) return;

  if (!userId) {
    console.error("You must be logged in to Norvia XI to connect cloud services.");
    return;
  }

  setLoading(true);
    try {
      // 2. Pass the provider AND the userId to the bridge.
      // This tells the backend: "Hey, connect Google to User #123"
      const result = await window.electronAPI.openCloudAuth(`${sourceId}?userId=${userId}`);

      if (result.success) {
        // 3. The token returned here is your AppToken (internal session)
        // You can store it or just use it to trigger a UI refresh.
        console.log(`Successfully linked ${sourceId} to your Norvia XI account!`);
        await fetchDriveFiles();
        
        // OPTIONAL: Fetch the updated connection list from your DB here
        // fetchUserConnections(); 
      } else {
        console.error(`${sourceId} connection failed:`, result.error);
        // Show a toast or notification to the user here
      }
    } catch (err) {
      console.error("The auth window crashed or was blocked:", err);
    } finally {
      setLoading(false);
    }
  };

 const fetchDriveFiles = async () => {
  try {
    const userId = getUserId();
    if (!userId) return;

    // Use the dynamic API_BASE_URL we set up earlier!
    const baseUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${baseUrl}/api/auth/google/files?userId=${userId}`);
    
    if (response.ok) {
      const files = await response.json();
      console.log("Librarian found these files:", files);
      
      // Wrap the array in an object so your .map logic doesn't break
      setData({ path: 'Google Drive / My Files', files: files });
    } else {
      console.error("Server responded with error:", response.status);
    }
  } catch (err) {
    console.error("Failed to sync files:", err);
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