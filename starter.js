// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain , systemPreferences, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
// const log = require('electron-log')
//basePath is needed in some separate files
process.env.basePath = path.resolve(__dirname)
if(fs.existsSync(path.join(process.resourcesPath || '','prod.env'))){
  process.env.NODE_ENV = 'production'
  global.resourcePath = app.getPath('userData')
}else{
  process.env.NODE_ENV = 'development'
  global.resourcePath = path.resolve('./resources')
}

/*
* Include all separate files below
* */
const autoUpdate = require('./starter-extensions/auto-update/auto-update')
autoUpdate.initializeDatabase()//initialize database before using server
const route = require('./api/server')
const listener = require('./api/listener.js')
const menu = require('./menu')
const exportdocx = require('./starter-extensions/export-reports/docx/export-docx')
const exportPdf = require('./starter-extensions/export-reports/pdf/export-pdf')

//disable unwanted Emoji and Dictation in Menu before calling app event
if(process.platform == "darwin"){
  systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
  systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, loginWindow, exportWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: app.name+' v'+app.getVersion(),
    width : 500,
    height: 600,
    icon: path.resolve('src/assets/img/easywrite-new.ico'),
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // mainWindow.webContents.openDevTools()
  if (process.env.NODE_ENV == 'development') {
   //  mainWindow.webContents.openDevTools()
    let url = 'http://localhost:8080/'
    // and load the index.html of the app.
    // mainWindow.loadFile(url + 'dev/')
    mainWindow.loadURL(url + 'dev/#')
  } else {
    // and load the index.html of the app.
    // eslint-disable-next-line no-template-curly-in-string
    // let url = 'file://C:\\Users\\Admin\\Desktop\\FINAL\\spa\\'
    // mainWindow.loadFile(url + 'prod/index.html')
    // mainWindow.loadURL(url + 'dist/index.html')
    mainWindow.loadFile(`${__dirname}/dist/index.html`)
  }

  Menu.setApplicationMenu(null)

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

  // resize after authentication
  ipcMain.on('RESIZE_MAIN_WINDOW', function (e, cat) {
    Menu.setApplicationMenu(menu.getMenu(mainWindow))
    mainWindow.setSize(1280, 920)
    mainWindow.center()
  })

  exportdocx.initMainWindow(mainWindow)

  if(process.env.NODE_ENV != 'development') {
    autoUpdate.processUpdate(mainWindow)
  }

  ipcMain.on('REFRESH_MENUITEMS', function (e, cat) {
    Menu.setApplicationMenu(menu.getMenu(mainWindow))
  })
}

ipcMain.on('SET_DEFAULT_LANG', function (e, cat) {
  menu.setMenu(cat)
})


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function appReady() {
  autoUpdate.checkForVersionUpdates()
  createWindow()
  if(process.env.NODE_ENV != 'development'){
    autoUpdate.checkAppUpdates()
  }
})

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

ipcMain.on('SHOW_SWAL_TIMESUP_STARTER', function (event, data) {
  mainWindow.webContents.send('SHOW_SWAL_TIMESUP')
})