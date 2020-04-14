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
  autoUpdater.on('update-downloaded', function (data) {
    ipcMain.on('AUTO_UPDATE:checkUpdateDownloaded', (event) => {
      event.reply('AUTO_UPDATE:downloaded', data)
    })
  })

  autoUpdater.on('download-progress', function (d) {
    window.webContents.send('AUTO_UPDATE:downloadProgress',{progress:d.percent})
  })

  autoUpdater.on('error',function (err) {
    window.webContents.send('AUTO_UPDATE:error',{error:err.message,version:version})
  })

  autoUpdater.on('update-available',function (data) {
    ipcMain.on('AUTO_UPDATE:checkUpdateAvailable', (event) => {
      version = data.version
      event.reply('AUTO_UPDATE:updateAvailable',{version: data.version})
    })
    window.webContents.send('AUTO_UPDATE:updateAvailable',{version: data.version})
  })

  ipcMain.on('AUTO_UPDATE:downloadAppUpdate', (event) => {
    autoUpdater.downloadUpdate().then(() => {}).catch((err) => {log.error(err)})
    event.reply('AUTO_UPDATE:prepareDownload')
  })

  ipcMain.on('AUTO_UPDATE:checkForUpdate', (event) => {
    autoUpdater.checkForUpdates().then(() => {log.info('autoUpdater checkForudpate')}).catch((err) => {log.error(err)})
  })

  // //TEST AREA //TODO REMOVE THIS AFTER STABLE
  // let percent = 90
  // ipcMain.on('AUTO_UPDATE:downloadAppUpdate', (event) => {
  //
  //   // autoUpdater.downloadUpdate().then(() => {}).catch((err) => {log.error(err)})
  //   if(percent <= 100) {
  //     setInterval(function () {
  //       percent++
  //       window.webContents.send('AUTO_UPDATE:downloadProgress', {progress: percent})
  //     }, 1000)
  //   }
  //   event.reply('AUTO_UPDATE:prepareDownload')
  // })
  //
  // ipcMain.on('AUTO_UPDATE:checkUpdateDownloaded', (event) => {
  //   // autoUpdater.on('update-downloaded', function (data) {
  //   if(percent >= 100)
  //     event.reply('AUTO_UPDATE:downloaded', {version:'0.0.2'})
  //   // })
  // })
}
