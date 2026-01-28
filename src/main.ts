import { app, BrowserWindow, ipcMain, dialog} from 'electron';
import fs from 'fs';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import axios from 'axios';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

if (started) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});




ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'], // Allows picking folders
    title: 'Select a folder to scan',
    buttonLabel: 'Select Folder',
  });

  if (result.canceled) return null;

  const folderPath = result.filePaths[0];
  const items = fs.readdirSync(folderPath);
  
  const files = items.map(name => {
    try {
      const stats = fs.statSync(path.join(folderPath, name));
      return { name, isDirectory: stats.isDirectory(), size: stats.size };
    } catch {
      return { name, isDirectory: false, size: 0 };
    }
  });

  return { path: folderPath, files };
});

ipcMain.handle('auth-register', async (event, userData) => {
  try {
    // This hits your Node.js server endpoint we just created
    const response = await axios.post('http://127.0.0.1:5000/api/users/register', userData);
    
    // Return the successful user data back to React
    return { success: true, data: response.data };
  } catch (error: any) {
    // If the server returns an error (like "Email already exists")
    return { 
      success: false, 
      error: error.response?.data?.error || 'Server connection failed' 
    };
  }
});

ipcMain.handle('auth-login', async (event, credentials) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/api/users/login', credentials);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Login Handler Error:", error.message);
    return { 
      success: false, 
      error: error.response?.data?.error || "Invalid credentials or server down" 
    };
  }
});



