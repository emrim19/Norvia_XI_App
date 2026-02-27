import styles from './FileExplorer.module.css';
import FileTreeNode from '../components/FIleExplorer/FileTreeNode';
import { FileItem } from '../types/FIleItem';
import { useState } from 'react';
import { getUserId } from '../hooks/useUser';
import { fetchGoogleDriveFiles } from '../services/cloudAccess';
import { getDirectoryContents } from '../services/localFileAccess';

const SOURCES = [
  { id: 'local', name: 'Local Files', icon: '💻' },
  { id: 'google', name: 'Google Drive', icon: '🤖' },
  { id: 'teams', name: 'MS Teams', icon: '👥' },
  { id: 'slack', name: 'Slack', icon: '💬' },
];

const FileExplorer = () => {
  const [activeSource, setActiveSource] = useState('local');
  const [treeData, setTreeData] = useState<FileItem[]>([]);

  const updateNodeInTree = (
    nodes: FileItem[],
    targetPath: string,
    updater: (node: FileItem) => FileItem
  ): FileItem[] => {
    return nodes.map((node) => {
      if (node.path === targetPath) {
        return updater(node);
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeInTree(node.children, targetPath, updater),
        };
      }
      return node;
    });
  };

  const toggleFolder = async (folder: FileItem) => {
    if (!folder.isDirectory) return;
    const isOpening = !folder.isExpanded;

    setTreeData((prev) =>
      updateNodeInTree(prev, folder.path, (node) => ({
        ...node,
        isExpanded: isOpening,
      }))
    );

    if (isOpening && (!folder.children || folder.children.length === 0)) {
      try {
        let newChildren: FileItem[] = [];

        if (activeSource === 'local') {
          const result = await getDirectoryContents(folder.path);
          newChildren = result ? result.files : [];
        } else if (activeSource === 'google') {
          console.log('Fetching cloud folder contents for ID:', folder.id);

          //TODO: fetch file in some way and showcase it to the user
        }
        setTreeData((prev) =>
          updateNodeInTree(prev, folder.path, (node) => ({
            ...node,
            children: newChildren,
          }))
        );
      } catch (err) {
        console.error('Failed to fetch folder contents', err);
      }
    }
  };

  const handleLocalClick = async () => {
    setActiveSource('local');
    const rootPath = await window.electronAPI.selectFolder();
    if (rootPath) {
      // Initialize with root contents
      const result = await getDirectoryContents(rootPath);
      setTreeData(result ? result.files : []);
    }
  };

  const handleGoogleDriveFetch = async () => {
    setActiveSource('google');
    const userId = getUserId();
    if (!userId) return;

    try {
      const rawFiles = await fetchGoogleDriveFiles();
      console.log(rawFiles);

      if (rawFiles) {
        // 2. Map raw data to the FileItem base structure
        const allItems: FileItem[] = rawFiles.map((file: any) => ({
          id: file.id,
          name: file.name,
          path: file.id,
          isDirectory:
            file.mimeType.includes('folder') ||
            file.mimeType === 'application/vnd.google-apps.folder',
          size: 0,
          webViewLink: file.webViewLink,
          children: [],
          isExpanded: false,
          // Safely get the parent ID
          parentId:
            file.parents && file.parents.length > 0
              ? file.parents[0]
              : undefined,
        }));

        // 3. Build a hierarchical tree
        const treeData = buildTree(allItems);
        setTreeData(treeData);
      }
    } catch (err) {
      console.error('Google Drive error:', err);
    }
  };

  const buildTree = (items: FileItem[]): FileItem[] => {
    const itemMap = new Map<string, FileItem>();
    const rootItems: FileItem[] = [];

    // First pass: Initialize map, ensuring children is reset
    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: Build parent-child relationships securely
    items.forEach((item) => {
      const mappedItem = itemMap.get(item.id);
      if (!mappedItem) return;

      const parentId = item.parentId;

      // Check if parent exists in our map
      if (parentId && itemMap.has(parentId)) {
        // 4. Safe lookup using optional chaining and strict null checks
        itemMap.get(parentId)?.children.push(mappedItem);
      } else {
        // No parent found in the current list, it's a root item
        rootItems.push(mappedItem);
      }
    });

    return rootItems;
  };

  const sourceHandlers: { [key: string]: () => Promise<void> | void } = {
    local: handleLocalClick,
    google: handleGoogleDriveFetch,
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Librarian</h1>

      <div className={styles.connectorGrid}>
        {SOURCES.map((source) => (
          <div
            key={source.id}
            className={`${styles.connectorCard} ${activeSource === source.id ? styles.activeCard : ''}`}
            onClick={sourceHandlers[source.id]}
          >
            <span className={styles.connectorIcon}>{source.icon}</span>
            <span className={styles.connectorName}>{source.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.resultsWrapper}>
        <FileTreeNode nodes={treeData} onToggle={toggleFolder} />
      </div>
    </div>
  );
};

export default FileExplorer;
