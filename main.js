const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const MainWindow = require("./MainWindow");
const AppTray = require("./AppTray");
const Store = require("./Store");

// Set env
process.env.NODE_ENV = "production";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let tray;

const store = new Store({
  configName: "user-settings",
  defaults: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 5,
    },
  },
});

function createMainWindow() {
  mainWindow = new MainWindow(`file://${__dirname}/app/index.html`, isDev);
}

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: "About GeneSys",
    width: isMac ? 430 : 450,
    height: isMac ? 420 : 445,
    icon: `${__dirname}/assets/icons/icon.png`,
    resizable: isDev,
    backgroundColor: "#fff",
  });

  aboutWindow.loadURL(`file://${__dirname}/app/about.html`);

  aboutWindow.removeMenu();
  aboutWindow.setMaximizable(false);
}

app.on("ready", () => {
  if (isMac) {
    app.dock.hide();
  }

  createMainWindow();

  mainWindow.setMaximizable(false);
  mainWindow.removeMenu();

  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.webContents.send("settings:get", store.get("settings"));
  });

  mainWindow.on("close", (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
    return true;
  });

  const icon = path.join(__dirname, "assets", "icons", "tray_icon.png");
  tray = new AppTray(icon, mainWindow, createAboutWindow);

  mainWindow.on("closed", () => (mainWindow = null));
});

ipcMain.on("settings:set", (e, settings) => {
  store.set("settings", settings);
  mainWindow.webContents.send("settings:get", store.get("settings"));
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
