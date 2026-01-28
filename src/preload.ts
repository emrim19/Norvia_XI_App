import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  registerUser: (userData: any) => ipcRenderer.invoke('auth-register', userData),
  loginUser: (credentials: any) => ipcRenderer.invoke('auth-login', credentials),
});
