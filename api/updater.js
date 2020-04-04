// Modules
// eslint-disable-next-line no-unused-vars
const {autoUpdater} = require('electron-updater')
const {ipcMain} = require('electron')
// Enable logging
// autoUpdater.logger = require('electron-log')
// autoUpdater.logger.transports.file.level = 'error'

autoUpdater.autoInstallOnAppQuit = true

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
  autoUpdater.on('update-downloaded', function (data) {
    ipcMain.on('AUTO_UPDATE:checkHasUpdate', (event) => {
      event.reply('AUTO_UPDATE:downloaded', data)
    })
  })

  autoUpdater.on('download-progress', function (d) {
    window.webContents.send('AUTO_UPDATE:downloadProgress',{progress:d.percent})
  })
}
