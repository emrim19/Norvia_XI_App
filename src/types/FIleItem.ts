export interface FileItem {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  webViewLink?: string;
  children: FileItem[];
  isExpanded: boolean;
  parentId?: string; // Add this line
}
