import React from 'react';
import styles from './FileTreeNode.module.css'; // Adjust path if necessary
import { FileItem } from '../..//types/FIleItem';

// Helper function to get icons (kept internal to component logic)
const getFileIcon = (
  fileName: string,
  isDirectory: boolean,
  isExpanded?: boolean
): string => {
  if (isDirectory) return isExpanded ? '📂' : '📁';
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return '📕';
    case 'doc':
    case 'docx':
      return '📝';
    case 'xls':
    case 'xlsx':
      return '📊';
    case 'png':
    case 'jpg':
      return '🖼️';
    default:
      return '📄';
  }
};

interface FileTreeNodeProps {
  nodes: FileItem[];
  level?: number;
  onToggle: (folder: FileItem) => void;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({
  nodes,
  level = 0,
  onToggle,
}) => {
  return (
    <ul style={{ paddingLeft: level === 0 ? 0 : 20 }}>
      {nodes.map((node) => (
        <li key={node.path}>
          <div
            className={styles.fileItem}
            onClick={() =>
              node.isDirectory ? onToggle(node) : console.log(node)
            }
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span className={styles.icon}>
              {getFileIcon(node.name, node.isDirectory, node.isExpanded)}
            </span>
            <span className={styles.fileName}>{node.name}</span>
          </div>

          {/* 💡 Recursively render children if expanded */}
          {node.isDirectory && node.isExpanded && node.children && (
            <FileTreeNode
              nodes={node.children}
              level={level + 1}
              onToggle={onToggle}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default FileTreeNode;
