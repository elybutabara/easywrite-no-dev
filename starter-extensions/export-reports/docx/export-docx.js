const { ipcMain, dialog, app, BrowserWindow } = require('electron')
const log = require('electron-log')
const path = require('path')
const HtmlDocx = require('html-docx-js')
const fs = require('fs')

let ExportWindow, MainWindow

exports.initMainWindow = (window) => {
  MainWindow = window
  ipcMain.on('EXPORT-CONTENT-DOCX', function (e, cat) {
    dialog.showSaveDialog(MainWindow, {
      defaultPath: cat.defaultfilename,
      properties: ['openFile', 'openDirectory', 'showOverwriteConfirmation'],
      filters: [
        { name: 'Doc Files', extensions: ['docx'] }
      ]
    }).then(result => {
      if (result.canceled === false) {
        var outputFile = result.filePath
        var docx = HtmlDocx.asBlob(cat.content)
        fs.writeFile(outputFile, docx, function (err) {
          if (err) {
            MainWindow.webContents.send('SHOW-SWAL-ERROR-EXPORTING', result.filePath)
          } else {
            MainWindow.webContents.send('SHOW-SWAL-SUCCESS-EXPORTING', result.filePath)
          }
        })
      }
    }).catch(() => {

    })
  })

  ipcMain.on('EXPORT-DOCX-SHOW-BOOK-WINDOW', function (event, data) {
    createExportWindowBook()
    ExportWindow.on('ready-to-show', function () {
      // ExportWindow.show()
      ExportWindow.webContents.send('EXPORT-DOCX-GET-BOOK', data)
    })
  })

  ipcMain.on('EXPORT-WORD-BOOK', function (event, data) {
    dialog.showSaveDialog(MainWindow, {
      defaultPath: data.book.title,
      properties: ['openFile', 'openDirectory', 'showOverwriteConfirmation'],
      filters: [
        { name: 'Doc Files', extensions: ['docx'] }
      ]
    }).then(result => {
      if (result.canceled) {
        MainWindow.webContents.send('CHANGE_EXPORT_BOOK_BUTTON_NAME')
      } else {
        var HtmlDocx = require('html-docx-js')
        var fs = require('fs')

        var outputFile = result.filePath
        var docx = HtmlDocx.asBlob(data.html)
        fs.writeFile(outputFile, docx, function (err) {
          if (err) {
            MainWindow.webContents.send('CHANGE_EXPORT_BOOK_BUTTON_NAME')
            MainWindow.webContents.send('SHOW-SWAL-ERROR-EXPORTING', result.filePath)
          } else {
            MainWindow.webContents.send('CHANGE_EXPORT_BOOK_BUTTON_NAME')
            MainWindow.webContents.send('SHOW-SWAL-SUCCESS-EXPORTING', result.filePath)
          }
        })
      }
    }).catch(err => {
      log.error(err)
    })
  })

  function createExportWindowBook () {
    ExportWindow = new BrowserWindow({
      title: app.name + ' v' + app.getVersion(),
      icon: path.resolve('src/assets/img/easywrite-new.ico'),
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.js'),
        plugins: true
      },
      protocol: 'file:',
      slashes: true,
      movable: true,
      show: false
    })
    ExportWindow.setSize(1280, 920)
    ExportWindow.center()
    ExportWindow.setMenu(null)

    if (process.env.NODE_ENV === 'development') {
      ExportWindow.webContents.openDevTools()
      let url = 'http://localhost:8080/'
      ExportWindow.loadURL(url + 'dev/' + '/#/exportbook')
    } else {
      ExportWindow.loadFile(`${__dirname}/dist/export.html`)
    }

    ExportWindow.on('closed', function () {
      ExportWindow = null
    })
  }
}
