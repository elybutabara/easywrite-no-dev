const { app, BrowserWindow, Menu, ipcMain , systemPreferences, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const electron = require('electron')
let mainwindow,exportWindow

exports.initPdfWindow = (window) => {
  mainwindow = window
}

ipcMain.on('EXPORT_PDF_SHOW_CHARACTERS', function (event, data) {
  createExportWindow({exportBy:'export-characters',data:data})
  exportWindow.on('ready-to-show', function () {
    exportWindow.show()
    exportWindow.webContents.send('EXPORT_PDF_LIST_CHARACTERS',data)
  })
})

ipcMain.on('EXPORT_PDF_CONFIRM_GENERATE', function (event, args) {
  dialog.showSaveDialog(exportWindow, {
    defaultPath: args.pdfName,
    properties: ['openFile', 'openDirectory','showOverwriteConfirmation'],
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] }
    ]
  }).then(result => {
    if(result.canceled){
      exportWindow.webContents.send('EXPORT_PDF_SHOW_BUTTON')
    }else{
      exportWindow.webContents.printToPDF({}, (success, errorType) => {
        log.error(errorType)
      }).then(function (data) {
        const pdfPath = path.resolve(result.filePath)
        fs.writeFile(pdfPath, data, function (error) {
          if (error) {
            log.error(error)
          }
          electron.shell.openExternal('file://' + pdfPath)
          exportWindow.webContents.send('success-exporting',pdfPath)
          exportWindow.webContents.send('EXPORT_PDF_SHOW_BUTTON')
        })
      }).catch(function (err) {
        log.error(err)
      })
    }
  }).catch(err => {
    log.error(err)
  })
})

function createExportWindow(data) {
  exportWindow = new BrowserWindow({
    title: app.name+' v'+app.getVersion(),
    icon: path.resolve('src/assets/img/easywrite-new.ico'),
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      preload: path.resolve(__dirname,'../', 'preload.js'),
      plugins: true
    },
    protocol: 'file:',
    slashes: true,
    movable: true,
    show:false,
    parent:mainwindow,
  })
  exportWindow.setSize(1280, 920)
  exportWindow.center()
  exportWindow.setMenu(null)

  exportWindow.webContents.openDevTools()
  if (process.env.NODE_ENV == 'development') {
    exportWindow.webContents.openDevTools()
    let url = 'http://localhost:8080/'
    exportWindow.loadURL(url + 'dev/' + '/#/'+ data.exportBy)
  } else {
    exportWindow.loadFile(path.resolve(`${__dirname}/../dist/export.html`))
  }

  exportWindow.on('closed', function () {
    exportWindow = null
  })
}

ipcMain.on('EXPORT_PDF_SHOW_CHAPTERS', function (event, data) {
  createExportWindow({exportBy:'export-chapters',data:data})
  exportWindow.on('ready-to-show', function () {
    exportWindow.show()
    exportWindow.webContents.send('EXPORT_PDF_LIST_CHAPTERS',data)
  })
})
