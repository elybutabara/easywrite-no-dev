const { ipcMain, dialog } = require('electron')
const log = require('electron-log')

const mammoth = require('mammoth')
const fs = require('fs')

let MainWindow
exports.initMainWindow = (window) => {
  MainWindow = window

  ipcMain.on('IMPORT-DOCX', function (event, type) {
    dialog.showOpenDialog(MainWindow, {
      properties: ['openFile', 'showOverwriteConfirmation'],
      filters: [
        { name: 'Doc Files', extensions: ['docx'] }
      ]
    }).then(result => {
      if (result.canceled) {

      } else {
        var outputFile = result.filePaths
        var html = null

        fs.readFile(outputFile[0], (err, data) => {

          if (err) throw err

          // check if there is altChunk
          if(data.indexOf("<w:altChunk r:id=\"htmlChunk\" />") >= 0){ // Do not use mammoth
            
            html = data.toString().substring(data.toString().indexOf("<body>"), data.toString().indexOf("</body>"))

            if (type === 'book') {
              MainWindow.webContents.send('GET-DOCX-CONTENT-BOOK', html)
            } else if (type === 'chapter') {
              MainWindow.webContents.send('GET-DOCX-CONTENT-CHAPTER', html)
            } else if (type === 'scene') {
              MainWindow.webContents.send('GET-DOCX-CONTENT-SCENE', html)
            }

          }else{ //use mammoth
            
            var options = {
              styleMap: [
                'u => u'
              ]
            }
  
            mammoth.convertToHtml(data, options)
              .then(function (result) {
                html = result.value // The generated HTML 
                // var messages = result.messages // Any messages, such as warnings during conversion

                if (type === 'book') {
                  MainWindow.webContents.send('GET-DOCX-CONTENT-BOOK', html)
                } else if (type === 'chapter') {
                  MainWindow.webContents.send('GET-DOCX-CONTENT-CHAPTER', html)
                } else if (type === 'scene') {
                  MainWindow.webContents.send('GET-DOCX-CONTENT-SCENE', html)
                }

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
