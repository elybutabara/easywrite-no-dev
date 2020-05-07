// Modules
// eslint-disable-next-line no-unused-vars
const {autoUpdater} = require('electron-updater')
const {app, ipcMain} = require('electron')
const log = require('electron-log')
const path = require('path')

// Enable logging
// autoUpdater.logger = require('electron-log')
// autoUpdater.logger.transports.file.level = 'error'
autoUpdater.logger = null
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.autoDownload = false
// console.log = log.log
exports.check = () => {
  global.updateInfo = {
    hasUpdate: false,
    version: null
  }

  //   if(process.env.NODE_ENV !== 'production') return false
  if (process.platform === 'darwin' || process.env.NODE_ENV != 'production') return false // TODO : remove this if DEVELOPERS CERTIFICATE IS GOOD TO GO

  process.env.GH_TOKEN = 'dfd1c61fcb090ecba24909875e177c5326ad449d'

  autoUpdater.checkForUpdates().then(() => {})
}

exports.processUpdate = (window) => {
  let version
  let in_progress = false
  let downloaded_version
  //TODO remove darwin if certificate is okay
  if (process.platform === 'darwin') return false
  autoUpdater.on('update-downloaded', function (data) {
    in_progress = false
    downloaded_version = data.version
    window.webContents.send('AUTO_UPDATE:downloaded', data)
    ipcMain.on('AUTO_UPDATE:checkUpdateDownloaded', (event) => {
      event.reply('AUTO_UPDATE:downloaded', data)
    })
  })

  autoUpdater.on('download-progress', function (d) {
    in_progress = true
    window.webContents.send('AUTO_UPDATE:downloadProgress',{progress:d.percent})
  })

  autoUpdater.on('error',function (err) {
    in_progress = false
    //this will throw Network error : TODO : enhance Network Error only
    if(isNetworkError(err)){
      window.webContents.send('AUTO_UPDATE:error',{error:err.message})
    }else{
      if(err.code != 'ERR_UPDATER_LATEST_VERSION_NOT_FOUND'){
        log.error(err)
      }
    }
  })

  autoUpdater.on('update-available',function (data) {
    // check available update
    version = data.version
    ipcMain.on('AUTO_UPDATE:checkUpdateAvailable', (event) => {
      if(downloaded_version != version){
        event.reply('AUTO_UPDATE:updateAvailable',{version: data.version})
      }
    })

    if(downloaded_version != version) {
      window.webContents.send('AUTO_UPDATE:updateAvailable', {version: data.version})
    }
  })

  ipcMain.on('AUTO_UPDATE:downloadAppUpdate', (event) => {
    autoUpdater.downloadUpdate().then(() => {}).catch((err) => {log.error(err)})
    event.reply('AUTO_UPDATE:prepareDownload')
  })

  ipcMain.on('install-update', function (e, cat) {
    const {autoUpdater} = require('electron-updater')
    autoUpdater.quitAndInstall()
  })
  // checking update every minute
  setInterval(function () {
    //TODO remove darwin if certificate is good to go
    if(!in_progress) {
      if (process.platform === 'darwin'|| process.env.NODE_ENV != 'production') return false // TODO : remove this if DEVELOPERS CERTIFICATE IS GOOD TO GO
      autoUpdater.checkForUpdates().then(() => {})
    }
  }, 1 * 60 * 1000)

  function isNetworkError(errorObject) {
    return errorObject.message === "net::ERR_INTERNET_DISCONNECTED" ||
      errorObject.message === "net::ERR_PROXY_CONNECTION_FAILED" ||
      errorObject.message === "net::ERR_CONNECTION_RESET" ||
      errorObject.message === "net::ERR_CONNECTION_CLOSE" ||
      errorObject.message === "net::ERR_NAME_NOT_RESOLVED" ||
      errorObject.message === "net::ERR_CONNECTION_TIMED_OUT";
  }
}

exports.checkForVersionUpdates = () => {
  let knexMigrate = require('knex-migrate')
  let data = {
    migrations : path.resolve(process.env.basePath, 'api/migrations')
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
      const { v1: uuidv1 } = require('uuid')
      /*generate_UID*/
      if(Array.isArray(directory_pathName)){
        knexConnection.table('migration_version_control').insert({
          'version_uid' : uuidv1(),
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

exports.initializeDatabase = () => {
  const fs = require('fs')
  const fsj = require('fs-jetpack')
  let src,dist
  if(process.env.NODE_ENV === 'development'){
    src = path.resolve(process.env.basePath,'api', 'base.db')
    dist = path.resolve(process.env.basePath,'config', 'db', 'development.db')
  }else{
    src = path.join(process.resourcesPath, 'app.asar', 'api', 'base.db')
    dist = path.resolve(app.getPath('userData'), 'resources', 'db', 'easywrite.db')
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
