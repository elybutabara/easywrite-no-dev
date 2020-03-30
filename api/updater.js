// Modules
// eslint-disable-next-line no-unused-vars
const {autoUpdater} = require('electron-updater')

// Enable logging
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

autoUpdater.autoInstallOnAppQuit = false

exports.check = () => {
  global.updateInfo = {
    hasUpdate: false,
    version: null
  }

  //   if(process.env.NODE_ENV !== 'production') return false
  if (process.platform === 'darwin') return false // TODO : remove this if DEVELOPERS CERTIFICATE IS GOOD TO GO

  process.env.GH_TOKEN = 'dfd1c61fcb090ecba24909875e177c5326ad449d'

  // return false;
  autoUpdater.checkForUpdates().then(() => {}).catch(err => autoUpdater.logger.error(err))

  /*
  autoUpdater.checkForUpdatesAndNotify().then(function (data) {
    swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      console.log(result)
    })
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'New version. Do you want to update now?',
      buttons: ['Update', 'No']
    }).then(function (buttonIndex) {
      console.log(buttonIndex.response)
      if (buttonIndex.response !== 0) {
        return false
      }else{
        console.log(data)
        autoUpdater.downloadUpdate().catch(err => log.info(err))

      }
    })
  }).catch(err => log.info(err))
  */

  let downloadProgress = 0
  autoUpdater.on('download-progress', function (d) {
    downloadProgress = d.percent
    autoUpdater.logger.info(downloadProgress)
  })

  autoUpdater.on('update-downloaded', function (data) {
    autoUpdater.logger.info('Done download update')
    console.log('has update')
    global.updateInfo = {
      hasUpdate: true,
      version: data.version
    }
  })

  return true
}
