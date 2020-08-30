const { BrowserWindow } = require("electron");

class MainWindow extends BrowserWindow {
  constructor(file, isDev) {
    super({
      title: "GeneSys",
      width: isDev ? 800 : 355,
      height: 500,
      icon: `${__dirname}/assets/icons/icon.png`,
      resizable: isDev ? true : false,
      skipTaskbar: true,
      opacity: 0.9,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    this.loadURL(file);

    if (isDev) {
      this.webContents.openDevTools();
    }
  }
}

module.exports = MainWindow;
