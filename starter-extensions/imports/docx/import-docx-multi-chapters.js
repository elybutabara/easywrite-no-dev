const { ipcMain, dialog } = require('electron')
const log = require('electron-log')

const mammoth = require('mammoth')
const fs = require('fs')
// const $ = require('jquery')
// window.$ = window.jQuery = require('jquery')

let MainWindow
exports.initMainWindow = (window) => {
  MainWindow = window

  ipcMain.on('IMPORT-DOCX-MULTI-CHAPTERS', function (event, data) {
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

          var options = {
            styleMap: [
              'u => u'
            ]
          }
          mammoth.convertToHtml(data, options)
            .then(function (result) {
              MainWindow.webContents.send('GET-DOCX-CONTENT-MULTI-CHAPTERS', result.value)
              // var html = result.value // The generated HTML
              // var messages = result.messages // Any messages, such as warnings during conversion
              // window.$ = window.jQuery = require('jquery')
              // const contents = window.$.parseHTML(result.value)

              // let chapters = []

              // window.$.each(contents, function (i, node) {
              //   const outerHtml = window.$(node).get(0).outerHTML
              //   // check if the node is h1
              //   if (window.$.inArray(node.nodeName.toLowerCase(), ['h1']) > -1) {
              //     chapters.push({title: window.$(node).get(0).innerHTML, fileContent: ''})
              //     return true
              //   }
              //   if (chapters[chapters.length - 1] !== undefined) {
              //     // exclude element with &nbsp; content
              //     if (window.$(node).html() === '&nbsp;' || window.$(node).is(':empty') || window.$(node).html() === '<br>') {
              //       return true
              //     }
              //     // concat all element outerHtml/text after h1
              //     chapters[chapters.length - 1]['fileContent'] += outerHtml
              //   }
              // })
              // console.log(result.value)
            })
            .done()
        })
      }
    }).catch(err => {
      log.error(err)
    })
  })
}
