const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let robotWindow;

// =========================
// CREATE MAIN WINDOW
// =========================
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
}

// =========================
// CREATE ROBOT WINDOW
// =========================
function createRobotWindow() {
  robotWindow = new BrowserWindow({
    width: 240,
    height: 240,

    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  robotWindow.loadURL("http://localhost:3000/robot");
}

// =========================
// ROBOT MESSAGE BRIDGE (FIXED)
// =========================
ipcMain.on("robot-message", (_, data) => {
  if (!robotWindow || robotWindow.isDestroyed()) return;

  // 🔥 prevent queue lag (overwrite instead of stack spam)
  robotWindow.webContents.send("robot-update", {
    ...data,
    _ts: Date.now(), // force refresh signal
  });
});

// =========================
// CLOSE ROBOT
// =========================
ipcMain.on("close-robot", () => {
  if (robotWindow && !robotWindow.isDestroyed()) {
    robotWindow.close();
    robotWindow = null;
  }
});

// =========================
// APP READY
// =========================
app.whenReady().then(() => {
  createMainWindow();
  createRobotWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
      createRobotWindow();
    }
  });
});

// =========================
// CLEAN EXIT (FIX MEMORY LEAK)
// =========================
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});