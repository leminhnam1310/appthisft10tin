const {
  app,
  BrowserWindow,
  ipcMain,
} = require("electron");

const path = require("path");

let mainWindow;
let robotWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,

    webPreferences: {
      preload: path.join(
        __dirname,
        "preload.js"
      ),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(
    "http://localhost:3000"
  );
}

function createRobotWindow() {
  robotWindow = new BrowserWindow({
    width: 220,
    height: 220,

    frame: false,
    transparent: true,

    alwaysOnTop: true,
    skipTaskbar: true,

    resizable: false,

    webPreferences: {
      preload: path.join(
        __dirname,
        "preload.js"
      ),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  robotWindow.loadURL(
    "http://localhost:3000/robot"
  );
}

ipcMain.on(
  "robot-message",
  (_, data) => {
    if (robotWindow) {
      robotWindow.webContents.send(
        "robot-update",
        data
      );
    }
  }
);

ipcMain.on(
  "close-robot",
  () => {
    if (robotWindow) {
      robotWindow.close();
    }
  }
);

app.whenReady().then(() => {
  createMainWindow();
  createRobotWindow();
});

app.on(
  "window-all-closed",
  () => {
    if (
      process.platform !==
      "darwin"
    ) {
      app.quit();
    }
  }
);