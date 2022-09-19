const electron = require("electron");
// Module to control application life.
const app = electron.app;
const path = require("path");
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const isDev = require("electron-is-dev");
const { Tray, Menu } = require("electron");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "trello.png"),
    autoHideMenuBar: true,
    show: false,
  });

  mainWindow.setFullScreen(true);
  mainWindow.on("ready-to-show", mainWindow.show);

  mainWindow.setThumbarButtons([
    {
      tooltip: "button1",
      icon: path.join(__dirname, "trello.png"),
      click() {
        console.log("button1 clicked");
      },
    },
    {
      tooltip: "button2",
      icon: path.join(__dirname, "trello.png"),
      flags: ["enabled", "dismissonclick"],
      click() {
        console.log("button2 clicked.");
      },
    },
  ]);

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

let tray = null;
app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, "trello.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
  ]);
  tray.setToolTip("CHello");
  tray.setContextMenu(contextMenu);
});

app.setUserTasks([
  {
    program: "http://localhost:3000/home",
    iconPath: process.execPath,
    iconIndex: 0,
    title: "Favorite Board",
    description: "Navigate you to home",
  },
  {
    program: __dirname + "/src/Script/home.exe",
    iconPath: process.execPath,
    iconIndex: 0,
    title: "Home",
    description: "Navigate you to home",
  },
  {
    program: process.execPath,
    iconPath: process.execPath,
    iconIndex: 0,
    title: "Electron",
    description: "Navigate you to electron page",
  },
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
