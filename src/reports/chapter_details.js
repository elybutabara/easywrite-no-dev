const { ipcRenderer } = require('electron')

ipcRenderer.on('chapter-details-reply', (event, arg) => {
  console.log('testsetse')
})
