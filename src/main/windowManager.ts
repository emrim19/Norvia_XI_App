import { BrowserWindow, shell } from "electron";
import path from "node:path";

// These are injected by Vite/Electron-Forge during the build
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

export const WINDOW_CONFIG = {
  MAIN: {
    WIDTH: 1100,
    HEIGHT: 700,
  },
  AUTH: {
    WIDTH: 500,
    HEIGHT: 650,
  },
};

/**
 * Creates the primary application window.
 */
export const createMainWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    width: WINDOW_CONFIG.MAIN.WIDTH,
    height: WINDOW_CONFIG.MAIN.HEIGHT,
    show: false, // Hidden until ready-to-show to prevent "white flash"
    webPreferences: {
      // Points to our preload bridge
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the content based on environment
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Graceful show
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Security: Open external links (target="_blank") in the user's default browser, not in Norvia XI
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  return mainWindow;
};

/**
 * Creates a specialized popup window for OAuth/External Auth providers.
 */
export const createAuthWindow = (authUrl: string): BrowserWindow => {
  const authWindow = new BrowserWindow({
    width: WINDOW_CONFIG.AUTH.WIDTH,
    height: WINDOW_CONFIG.AUTH.HEIGHT,
    show: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  authWindow.loadURL(authUrl);

  authWindow.once("ready-to-show", () => {
    authWindow.show();
  });

  return authWindow;
};