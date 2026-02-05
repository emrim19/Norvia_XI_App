import styles from "./FileExplorer.module.css";
import { useState } from "react";
import { getUserId } from "../hooks/useUser";
import { fetchLocalFiles } from "../services/localFileAccess";
import { fetchGoogleDriveFiles } from "../services/cloudAccess";

interface FileItem {
  name: string;
  isDirectory: boolean;
  size: number;
}

const SOURCES = [
  { id: "local", name: "Local Files", icon: "💻" },
  { id: "google", name: "Google Drive", icon: "🤖" },
  { id: "teams", name: "MS Teams", icon: "👥" },
  { id: "slack", name: "Slack", icon: "💬" },
];

const FileExplorer = () => {
  const [activeSource, setActiveSource] = useState("local");
  const [data, setData] = useState<{ path: string; files: FileItem[] } | null>(
    null,
  );
  // Track auth status to avoid unnecessary 404s in console
  const [isDriveAuthorized, setIsDriveAuthorized] = useState<boolean | null>(
    null,
  );

  //==========================================//
  // * DEDICATED HANDLERS *
  //==========================================//

  const handleLocalFetch = async () => {
    setActiveSource("local");
    const localFiles = await fetchLocalFiles();
    if (localFiles !== undefined) {
      setData(localFiles);
    }
  };

  const handleGoogleDriveFetch = async () => {
    setActiveSource("google");
    const userId = getUserId();
    if (!userId) return;

    try {
      // 1. Try silent fetch if we think we are authorized
      if (isDriveAuthorized !== false) {
        const files = await fetchGoogleDriveFiles();
        if (files) {
          setData({ path: "Google Drive", files });
          setIsDriveAuthorized(true);
          return;
        } else {
          setIsDriveAuthorized(false);
        }
      }

      // 2. Open auth window
      const result = await window.electronAPI.openCloudAuth(
        `google?userId=${userId}`,
      );

      // 3. Post-auth fetch
      if (result.success) {
        const files = await fetchGoogleDriveFiles();
        if (files) {
          setData({ path: "Google Drive", files });
          setIsDriveAuthorized(true);
        }
      }
    } catch (err) {
      console.error("Google Drive error:", err);
    }
  };

  const handleTeamsFetch = async () => {
    setActiveSource("teams");
    console.log("Teams integration coming soon...");
    setData(null); // Clear data for now
  };

  const handleSlackFetch = async () => {
    setActiveSource("slack");
    console.log("Slack integration coming soon...");
    setData(null); // Clear data for now
  };

  //==========================================//
  // * MAPPING HANDLERS TO SOURCES *
  //==========================================//
  const sourceHandlers: { [key: string]: () => Promise<void> } = {
    local: handleLocalFetch,
    google: handleGoogleDriveFetch,
    teams: handleTeamsFetch,
    slack: handleSlackFetch,
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Librarian</h1>

      {/* Source Selection Grid */}
      <div className={styles.connectorGrid}>
        {SOURCES.map((source) => (
          <div
            key={source.id}
            className={`${styles.connectorCard} ${activeSource === source.id ? styles.activeCard : ""}`}
            onClick={sourceHandlers[source.id]}
          >
            <span className={styles.connectorIcon}>{source.icon}</span>
            <span className={styles.connectorName}>{source.name}</span>
          </div>
        ))}
      </div>

      {/* Results List */}
      {data && (
        <div className={styles.resultsWrapper}>
          <div className={styles.locationPath}>
            <strong>Location:</strong> {data.path}
          </div>
          <div className={styles.fileListContainer}>
            <ul className={styles.fileList}>
              {data.files.map((file, index) => (
                <li key={index} className={styles.fileItem}>
                  <span className={styles.icon}>
                    {file.isDirectory ? "📁" : "📄"}
                  </span>
                  <span className={styles.fileName}>{file.name}</span>
                  {!file.isDirectory && (
                    <span className={styles.fileSize}>
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  )}
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
