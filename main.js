/* eslint-disable eqeqeq */
// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const listener = require('./api/listener.js')

// environment
var ENV = 'dev'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let menuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'Exit', role: 'close' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { label: 'Dev Tools', role: 'toggleDevTools' }
    ]
  }
]

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (ENV == 'dev') {
    mainWindow.webContents.openDevTools()
    let url = 'http://localhost:8080/'
    // and load the index.html of the app.
    // mainWindow.loadFile(url + 'dev/')
    mainWindow.loadURL(url + 'dev/')
  } else {
    // and load the index.html of the app.
    // eslint-disable-next-line no-template-curly-in-string
    // let url = 'file://C:\\Users\\Admin\\Desktop\\FINAL\\spa\\'
    // mainWindow.loadFile(url + 'prod/index.html')
    // mainWindow.loadURL(url + 'dist/index.html')
    mainWindow.loadFile(`${__dirname}/dist/index.html`)
  }

  let menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // load api listener, all IPC message will go
  listener.loadApi(mainWindow)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
