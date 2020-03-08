// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const fs = require('fs')
const log = require('electron-log')

if(fs.existsSync(path.join(process.resourcesPath || '','prod.env'))){
  process.env.NODE_ENV = 'production'
  global.resourcePath = process.resourcesPath
}else{
  process.env.NODE_ENV = 'development'
  global.resourcePath = path.resolve('./resources')
}

const route = require('./api/server')
const listener = require('./api/listener.js')


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

  if (process.env.NODE_ENV == 'dev') {
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
app.on('ready', function () {
  checkFreshInstallation()
  checkForVersionUpdates()
  createWindow()
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

function checkFreshInstallation () {
  const fs = require('fs')
  const fsj = require('fs-jetpack')
  let src,dist
  if(process.env.NODE_ENV === 'development'){
    src = path.resolve('./api', 'base.db')
    dist = path.resolve(global.resourcePath, 'db', 'base.db')
  }else{
    src = path.join(process.resourcesPath, 'app.asar', 'api', 'base.db')
    dist = path.resolve(app.getPath('userData'), 'resources', 'db', 'base.db')
  }

  //%USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log
  // log.info(process.env.NODE_ENV)
  // log.info(path.resolve(app.getPath('userData'), 'resources', 'db'))

  if (
    fs.existsSync(src) &&
    fs.statSync(src).isFile() &&
    !fs.existsSync(dist)
  ) {
    fsj.copy(src, dist)
    log.info("fresh install")
    fs.chmod(dist, '0700', function (err) {
      log.error(err)
      if (err) throw err
    })
  }
}

function checkForVersionUpdates(){
  let knexMigrate = require('knex-migrate')
  let data = {
    knexfile : path.resolve(__dirname, './api/knexfile.js'),
    migrations : path.resolve(__dirname, './api/migrations')
  }

  knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{
    if(exists){
      await knexConnection.first().from('migration_version_control').orderByRaw('version_id DESC').then(function (res) {
        if(res){
          data.from = res.name
        }
      })
    }

    let directory_pathName
    await knexMigrate('up', data, ({ action, migration })=>{
      log.info('Doing ' + action + ' on ' + migration)

      directory_pathName = migration.split(path.sep)
    }).then(function () {
      /*generate_UID*/
      /* TODO replace this with function for generating UID*/
      let uuidGenerationRaw = knexConnection.client.config.client === 'sqlite3' ?
        `(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))` :
        `uuid_generate_v4()`;

      if(Array.isArray(directory_pathName)){
          knexConnection.table('migration_version_control').insert({
            'version_uid' : knexConnection.raw(uuidGenerationRaw),
            'full_path' : data.migrations,
            'directory': directory_pathName[0],
            'name' : directory_pathName[1],
            'created_at' : knexConnection.fn.now(),
            'updated_at' : knexConnection.fn.now()
          }).catch((err)=>{
            log.error(err)
          })
      }
    }).catch((err)=>{
      log.error(err)
    })
  }).catch((err)=>{
    log.error(err)
  })


}
