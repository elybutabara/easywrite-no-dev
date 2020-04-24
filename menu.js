'use strict'
let mainWindow
const { Menu } = require('electron');

// const {ipcRenderer} = window.require('electron')
let tray = null
// Create menu templete
const mainMenuTemplate = [
  // {
  //   label:'File',
  //   submenu:[
  //     { label: "Exit", role: 'close'},
  //   ]
  // },
  {
    label:'Translations',
    submenu:[
      {label: "English",
       type: 'checkbox',
       checked: true,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(0)) // main.js then to starter to refresh menu
          mainWindow.webContents.send('TRANSLATE','en') //main.js
          mainWindow.webContents.send('SET_TRANSLATION_DOM','en') // Main.vue
        }
      },
      {label: "Danish",
       type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(1))
          mainWindow.webContents.send('TRANSLATE','da')
          mainWindow.webContents.send('SET_TRANSLATION_DOM','da')

        },
      },
      {label: "Finnish",
      type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(2))
          mainWindow.webContents.send('TRANSLATE','fi')
          mainWindow.webContents.send('SET_TRANSLATION_DOM','fi')
        }
      },
      {label: "Icelandic",
       type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(3))
          mainWindow.webContents.send('TRANSLATE','is')
          mainWindow.webContents.send('SET_TRANSLATION_DOM','is')
        }
      },
      {label: "Norwegian",
       type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(4))
          mainWindow.webContents.send('TRANSLATE','nb')
          mainWindow.webContents.send('SET_TRANSLATION_DOM','nb')
        }
      },
      {label: "Spanish",
       type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(5))
          mainWindow.webContents.send('TRANSLATE','es')
          mainWindow.webContents.send('SET_TRANSLATION_DOM','es')
        }
      },
      {label: "Swedish",
       type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(6))
          mainWindow.webContents.send('TRANSLATE','sv')
          mainWindow.webContents.send('SET_TRANSLATION_DOM','sv')
        }
      }
    ]
  }
];

function ControlState(val) {
  let menuCount = mainMenuTemplate.length - 1
  if(process.env.NODE_ENV!=='production') menuCount -= 1

  mainMenuTemplate[menuCount].submenu.forEach(function (item, index) {
    if (index===val) {
      mainMenuTemplate[menuCount].submenu[val].checked = true
    }
    else {
      mainMenuTemplate[menuCount].submenu[index].checked = false
    }
  })

  return Menu.buildFromTemplate(mainMenuTemplate)
}

// If mac, add empty object on menu
if(process.platform == "darwin") {
  mainMenuTemplate.unshift({label: ''});
  const editMenu = {
    label: "Edit",
      submenu: [
    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
    { type: "separator" },
    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
  ]
  }
  mainMenuTemplate.splice(2,0,editMenu)
}

// Add DevTools if not in production
if(process.env.NODE_ENV!=='production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        role: 'toggleDevTools'
      },
      {
        role: 'reload'
      }
    ]
  });
}

/*remove taskbar top menu*/


// module.exports = (process.env.NODE_ENV == 'production') ? Menu.buildFromTemplate([]) : Menu.buildFromTemplate(mainMenuTemplate);
exports.getMenu = function (window) {
  mainWindow = window
  return Menu.buildFromTemplate(mainMenuTemplate)
}

exports.setMenu = function (data) {
  ControlState(data)
}
