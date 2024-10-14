import { app, BrowserWindow } from "electron";

let mainWindow: BrowserWindow | null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("https://mr-cheesecake.com/");

  // ウィンドウが閉じられたときの処理
  mainWindow.on("closed", () => {
    mainWindow = null;
    // アプリケーションを終了させる
    app.quit();
  });
};

// アプリケーションの準備ができたらウィンドウを作成
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// すべてのウィンドウが閉じられたときにアプリを終了する
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
