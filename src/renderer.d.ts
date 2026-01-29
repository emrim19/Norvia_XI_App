export interface FileItem {
  name: string;
  isDirectory: boolean;
  size: number;
}

export interface IElectronAPI {
  // Folder Scanning
  selectFolder: () => Promise<{ path: string; files: FileItem[] } | null>;
  
  // Auth Logic
  registerUser: (userData: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  loginUser: (credentials: any) => Promise<{ success: boolean; data?: any; error?: string }>;

  // Cloud Auth
  openCloudAuth: (provider: string) => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}