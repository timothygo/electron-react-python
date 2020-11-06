const { app, ipcMain, BrowserWindow } = require("electron");

const isDev = require("electron-is-dev");
const Client = require("./zeromq/Client");
const config = require("./config");
const actions = require("./actions");

let mainWindow;
let client;

//start python app
let python = require("child_process").execFile(
  config.execFile,
  {
    cwd: isDev
      ? __dirname + `\\..\\resources\\`
      : process.resourcesPath + `\\resources\\`
  },
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }
  }
);

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: config.width,
    height: config.height,
    backgroundColor: config.backgroundColor,
    resizable: config.resizable,
    show: config.show,
    frame: config.frame,
    transparent: config.transparent,
    webPreferences: {
      nodeIntegration: false,
      devTools: isDev,
      preload: __dirname + "/preload.js"
    }
  });
  if (!isDev) mainWindow.setMenu(null);

  mainWindow.loadURL(
    isDev ? `http://localhost:3000#/` : `file://${__dirname}/index.html`
  );

  client = new Client((sub_message)=>{
    console.log(sub_message)
  });
  client.connect(config.port_req, config.port_sub);

  //listen to actions
  for (action in actions) {
    if (actions[action].length == 1) {
      ipcMain.on(action, actions[action](client));
    } else {
      ipcMain.on(action, actions[action]);
    }
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
});

app.on("quit", () => {
  client.unsubscribe();
  client.send("quit");
  python.kill();
});
