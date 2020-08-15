const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

const MainWindow = require("./MainWindow");
const AppTray = require("./AppTray");
const Store = require("./Store");
const { createMenuTemplate } = require("./Menu");

// Set env
process.env.NODE_ENV = "production";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;

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

app.on("ready", () => {
  createMainWindow();

  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.webContents.send("settings:get", store.get("settings"));
  });

  const mainMenu = Menu.buildFromTemplate(createMenuTemplate(isMac, isDev));
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("close", (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
    return true;
  });

  const icon = path.join(__dirname, "assets", "icons", "tray_icon.png");
  new AppTray(icon, mainWindow);

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
