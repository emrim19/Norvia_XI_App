export interface IElectronAPI {
  getDocumentsPath: () => Promise<string>;
  getDesktopPath: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}