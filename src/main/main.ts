import { app, BrowserWindow, Tray, Menu, globalShortcut, screen } from 'electron';
import started from "electron-squirrel-startup";
import { createMainWindow } from "./windowManager";
import { registerIpcHandlers } from "./ipcHandlers";
import path from 'path';

// 1. Handle Windows startup/install shortcuts
if (started) {
  app.quit();
}

registerIpcHandlers();

// 2. APP LIFECYCLE
app.on("ready", () => {
  createMainWindow();
});

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

/**
 * Security: Disable navigation to untrusted sites from within the app shell.
 */
app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== "http://localhost:5173" && !app.isPackaged) {
      event.preventDefault();
    }
  });
});



