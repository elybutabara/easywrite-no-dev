// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const log = require('electron-log')
const appUpdate = require('./api/updater')

if(fs.existsSync(path.join(process.resourcesPath || '','prod.env'))){
  process.env.NODE_ENV = 'production'
  global.resourcePath = process.resourcesPath
}else{
  process.env.NODE_ENV = 'development'
  global.resourcePath = path.resolve('./resources')
}
checkFreshInstallation()
const route = require('./api/server')
const listener = require('./api/listener.js')
const menu = require('./menu');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, loginWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: app.getName()+' '+app.getVersion(),
    width : 500,
    height: 600,
    icon: path.resolve('src/assets/img/easywrite.png'),
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // mainWindow.webContents.openDevTools()
  if (process.env.NODE_ENV == 'development') {
    mainWindow.webContents.openDevTools()
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
    Menu.setApplicationMenu(menu)
    mainWindow.setSize(1280, 920);
    mainWindow.center();
  })
  appUpdate.processUpdate(mainWindow)
}

/*
function createLoginWindow () {
  loginWindow = new BrowserWindow({
    resizable: false,
    frame: false,
    show: false,
    width : 390,
    height: 380,
    icon: path.resolve('src/assets/img/easywrite.png'),
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV == 'development') {
    let url = 'http://localhost:8080/'

    // Load login html file into window
    loginWindow.loadURL(url + 'dev/#/auth')
  } else {
    // and load the index.html of the app.
    // eslint-disable-next-line no-template-curly-in-string
    // let url = 'file://C:\\Users\\Admin\\Desktop\\FINAL\\spa\\'
    // mainWindow.loadFile(url + 'prod/index.html')
    // mainWindow.loadURL(url + 'dist/index.html')
    loginWindow.loadFile(`${__dirname}/dist/auth.html`)
  }

  // only show window after the contents are loaded , it will delay load because of background
  loginWindow.webContents.once('did-finish-load', function(){
    loginWindow.show();
  });

  ipcMain.on('createMainWindow', function (e, cat) {
    global.loginInfo = cat
    createWindow()
  })
}
*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function appReady() {
  checkForVersionUpdates()
  createWindow()
  appUpdate.check()
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
    dist = path.resolve(__dirname,'config', 'db', 'development.db')
  }else{
    process.env.DEMO = true
    src = path.join(process.resourcesPath, 'app.asar', 'api', 'base.db')
    if(process.env.DEMO){
      /*
      * Application is not installed and running in downloaded folder
      * */
      if(process.platform == 'darwin' ){
        //db is place in userData since some userdata is retricted to write in mac
        dist = path.resolve(app.getPath('userData'), 'demo', 'db', 'demo.db')

        let deleteRecursive = function (path) {
          if( fs.existsSync(path) ) {
            log.info('exist delte')
            log.info(path)
            fs.readdirSync(path).forEach(function(file,index){
              let curPath = path + "/" + file;
              if(fs.lstatSync(curPath).isDirectory()) { // recurse
                log.info('rescures')
                deleteRecursive(curPath);
              } else { // delete file
                fs.unlinkSync(curPath);
              }
            });
            fs.rmdirSync(path);
          }
        }
        deleteRecursive(path.resolve(app.getPath('userData'), 'demo'))
      }else{
        dist = path.resolve(process.resourcesPath, 'demo', 'db', 'demo.db')
      }
    }else{
      dist = path.resolve(app.getPath('userData'), 'resources', 'db', 'easywrite.db')
    }
  }

  process.env.dblocation = dist

  if (
    fs.existsSync(src) &&
    fs.statSync(src).isFile() &&
    !fs.existsSync(dist)
  ) {
    fsj.copy(src, dist)
    log.info("fresh install")
    fs.chmod(dist, '0700', function (err) {
      if (err){
        log.error(err)
        throw err
      }
    })
  }
}

function checkForVersionUpdates(){
  let knexMigrate = require('knex-migrate')
  let data = {
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

ipcMain.on('install-update', function (e, cat) {
  const {autoUpdater} = require('electron-updater')
  autoUpdater.quitAndInstall()
})
