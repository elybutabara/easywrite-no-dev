const { ipcMain, dialog } = require('electron')
const log = require('electron-log')

const mammoth = require('mammoth')
const fs = require('fs')
// const $ = require('jquery')
// window.$ = window.jQuery = require('jquery')

let MainWindow
exports.initMainWindow = (window) => {
  MainWindow = window

  ipcMain.on('IMPORT-DOCX-MULTI-CHAPTERS', function (event, book) {
    dialog.showOpenDialog(MainWindow, {
      properties: ['openFile', 'showOverwriteConfirmation'],
      filters: [
        { name: 'Doc Files', extensions: ['docx'] }
      ]
    }).then(result => {
      if (result.canceled) {

      } else {
        var outputFile = result.filePaths

        fs.readFile(outputFile[0], (err, data) => {

          if (err) throw err

          // check if there is altChunk
          if(data.indexOf("<w:altChunk r:id=\"htmlChunk\" />") >= 0){ // Do not use mammoth
            
            var toStringContent = data.toString()
            var tempContent = toStringContent.replace(/3D/g, "")
            var cleanContent = tempContent.substring(tempContent.indexOf("<body>"), tempContent.indexOf("</body>"))
            MainWindow.webContents.send('GET-DOCX-CONTENT-MULTI-CHAPTERS-2', {book: book, html: cleanContent, fromMammoth: false})

          }else{

            var options = {
              styleMap: [
                'u => u'
              ]
            }
  
            mammoth.convertToHtml(data, options)
              .then(function (result) {
                // console.log('testtse')
                // console.log(book)
                MainWindow.webContents.send('GET-DOCX-CONTENT-MULTI-CHAPTERS-2', {book: book, html: result.value, fromMammoth: true})
              })
              .done()

          }

        })
      }
    }).catch(err => {
      log.error(err)
    })
  })
}
