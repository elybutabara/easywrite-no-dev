// Modules
// eslint-disable-next-line no-unused-vars
const {autoUpdater} = require('electron-updater')
const {ipcMain} = require('electron')
const log = require('electron-log')
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
  if (process.platform === 'darwin') return false // TODO : remove this if DEVELOPERS CERTIFICATE IS GOOD TO GO

  process.env.GH_TOKEN = 'dfd1c61fcb090ecba24909875e177c5326ad449d'

  autoUpdater.checkForUpdates().then(() => {}).catch((err) => {log.error(err)})
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
      // log.error(err)
    }
  })

  autoUpdater.on('update-available',function (data) {
    // check available update
    version = data.version
    ipcMain.on('AUTO_UPDATE:checkUpdateAvailable', (event) => {
      // console.log('checkUpdateAvailable-downloaded_version:' + downloaded_version)
      // console.log('checkUpdateAvailable-version:' + version)
      if(downloaded_version != version){
        event.reply('AUTO_UPDATE:updateAvailable',{version: data.version})
      }
    })
    // console.log('checkUpdateAvailable-downloaded_version:' + downloaded_version)
    // console.log('checkUpdateAvailable-version:' + version)
    if(downloaded_version != version) {
      window.webContents.send('AUTO_UPDATE:updateAvailable', {version: data.version})
    }
  })

  ipcMain.on('AUTO_UPDATE:downloadAppUpdate', (event) => {
    autoUpdater.downloadUpdate().then(() => {}).catch((err) => {log.error(err)})
    event.reply('AUTO_UPDATE:prepareDownload')
  })

  // checking update every minute
  setInterval(function () {
    //TODO remove darwin if certificate is good to go
    if(!in_progress && process.platform === 'darwin') {
      autoUpdater.checkForUpdates().then((data) => {
        // console.log('checking for update')
        // log.info(data)
      })
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
