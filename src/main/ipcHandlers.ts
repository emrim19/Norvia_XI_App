import { ipcMain, dialog } from "electron";
import { promises as fs } from "fs";
import os from "os";
import path from "node:path";
import axios from "axios";
import { createAuthWindow } from "./windowManager";

// Env configuration for the API
const isDev = process.env.NODE_ENV === "development";
const API_BASE_URL = isDev
  ? "http://127.0.0.1:5000/api"
  : "https://norviaxi-backend.onrender.com/api";

export const registerIpcHandlers = () => {
  
  // ==========================================
  // * LIBRARIAN FEATURE (Local Files) *
  // ==========================================

  // Let user pick a folder
  ipcMain.handle("select-folder", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Select Root Folder",
      buttonLabel: "Select Folder",
    });

    if (result.canceled) return null;
    return result.filePaths[0];
  });

  // Navigate and scan directory contents
  ipcMain.handle("get-directory-contents", async (event, targetPath?: string) => {
    try {
      let dirToRead = targetPath || os.homedir();

      // Windows Drive Letter Fix
      if (process.platform === "win32" && dirToRead.length === 2 && dirToRead.endsWith(":")) {
        dirToRead += path.sep;
      }

      const items = await fs.readdir(dirToRead);

      const filePromises = items.map(async (name) => {
        const itemPath = path.resolve(dirToRead, name);
        try {
          const stats = await fs.stat(itemPath);
          return {
            name,
            path: itemPath,
            isDirectory: stats.isDirectory(),
            size: stats.size,
          };
        } catch (err) {
          return { name, path: itemPath, isDirectory: false, size: 0, error: true };
        }
      });

      const files = await Promise.all(filePromises);
      
      return {
        path: dirToRead,
        files: files.sort((a, b) => {
          if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
          return a.isDirectory ? -1 : 1;
        }),
      };
    } catch (error) {
      console.error("IPC: Failed to read directory", error);
      throw error;
    }
  });

  // ==========================================
  // * AUTH FEATURE (Proxy to Express) *
  // ==========================================

  ipcMain.handle("auth-register", async (_, userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Registration failed" 
      };
    }
  });

  ipcMain.handle("auth-login", async (_, credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Login failed" 
      };
    }
  });

  ipcMain.handle("open-auth-window", async (_, providerQuery: string) => {
    return new Promise((resolve) => {
      const providerName = providerQuery.split("?")[0];
      const authUrl = `${API_BASE_URL}/auth/${providerQuery}`;
      
      // Using the helper from our windowManager
      const authWindow = createAuthWindow(authUrl);

      authWindow.webContents.on("did-finish-load", () => {
        const currentURL = authWindow.webContents.getURL();
        if (currentURL.includes(`/api/auth/${providerName}/success`)) {
          resolve({ success: true });
          if (!authWindow.isDestroyed()) authWindow.destroy();
        }
      });

      authWindow.on("closed", () => {
        resolve({ success: false, error: "User closed window" });
      });
    });
  });
};