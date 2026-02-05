import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { promises as fs } from "fs";
import path from "node:path";
import started from "electron-squirrel-startup";
import axios from "axios";

// These are injected by Vite during the build process
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
const API_BASE_URL = isDev
  ? "http://127.0.0.1:5000/api"
  : "https://norviaxi-backend.onrender.com/api";

// Handle creating/removing shortcuts on Windows during installation/uninstallation.
if (started) {
  app.quit();
}

//==========================================//
// * WINDOW MANAGEMENT *
//==========================================//

// Standard Electron boilerplate to spin up the Chromium window.
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      // Connects the 'bridge' file so the frontend can talk to this file.
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // If we are in dev mode, load from the Vite server. If production, load the built HTML.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Opens Chrome DevTools automatically—great for debugging Norvia XI's UI.
  mainWindow.webContents.openDevTools();
};

//==========================================//
// * APP LIFECYCLE *
//==========================================//
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS (standard Mac behavior).
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//==========================================//
// * 3. IPC HANDLERS (The "Backend" Logic) *
//==========================================//

// LIBRARIAN FEATURE: Let's user pick a folder and scans it.
ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    title: "Select a folder to scan",
    buttonLabel: "Select Folder",
  });

  if (result.canceled) return null;

  const folderPath = result.filePaths[0];

  try {
    // 1. Asynchronously read the directory names
    const items = await fs.readdir(folderPath);

    // 2. Map items to promises for their stats
    const filePromises = items.map(async (name) => {
      try {
        const itemPath = path.join(folderPath, name);
        const stats = await fs.stat(itemPath); // Asynchronous stat

        return {
          name,
          isDirectory: stats.isDirectory(),
          size: stats.size,
        };
      } catch (err) {
        // Handle individual file errors (e.g. permission issues)
        return { name, isDirectory: false, size: 0, error: true };
      }
    });

    // 3. Wait for all file stats to resolve in parallel
    const files = await Promise.all(filePromises);

    return { path: folderPath, files };
  } catch (error) {
    console.error("Failed to scan directory:", error);
    throw error; // Let the renderer handle the error
  }
});

// AUTH FEATURE: Proxying registration to your Express/Supabase backend.
ipcMain.handle("auth-register", async (event, userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/register`,
      userData,
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Server connection failed",
    };
  }
});

// AUTH FEATURE: Proxying login.
ipcMain.handle("auth-login", async (event, credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/login`,
      credentials,
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Invalid credentials",
    };
  }
});

ipcMain.handle("open-auth-window", async (event, providerQuery: string) => {
  return new Promise((resolve) => {
    const providerName = providerQuery.split("?")[0];

    const authWindow = new BrowserWindow({
      width: 500,
      height: 650,
      show: false,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    const authUrl = `${API_BASE_URL}/auth/${providerQuery}`;
    authWindow.loadURL(authUrl);

    authWindow.once("ready-to-show", () => authWindow.show());

    // This event fires every time a page is fully loaded
    authWindow.webContents.on("did-finish-load", () => {
      const currentURL = authWindow.webContents.getURL();

      // Check if we hit the success landing strip
      if (currentURL.includes(`/api/auth/${providerName}/success`)) {
        resolve({ success: true });

        // Clean up
        if (!authWindow.isDestroyed()) {
          authWindow.destroy();
        }
      }
    });

    authWindow.on("closed", () => {
      resolve({ success: false, error: "User closed window" });
    });
  });
});
