import { app, BrowserWindow } from "electron";
import { exec, ChildProcess } from "child_process";
import waitOn from "wait-on";

let mainWindow: BrowserWindow | null;
let serveProcess: ChildProcess | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("http://localhost:5827");

  // ウィンドウが閉じられたときの処理
  mainWindow.on("closed", () => {
    mainWindow = null;

    // serve プロセスが実行中であれば停止する
    if (serveProcess) {
      serveProcess.kill();
    }

    // アプリケーションを終了させる
    app.quit();
  });
};

// アプリケーションの準備ができたらウィンドウを作成
app.whenReady().then(() => {
  // yarn serve を実行
  serveProcess = exec(
    "./node_modules/.bin/serve -s build -l 5827",
    (error, stdout, _stderr) => {
      if (error) {
        console.error(`Error starting yarn serve: ${error}`);
        return;
      }
      console.log(`yarn serve output: ${stdout}`);
    }
  );

  // ポート 5827 が利用可能になるまで待機してからウィンドウを作成
  waitOn({ resources: ["http://localhost:5827"] }, (err) => {
    if (err) {
      console.error("Error waiting for localhost:5827:", err);
      return;
    }
    // サーバーが起動したらウィンドウを作成
    createWindow();
  });

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
