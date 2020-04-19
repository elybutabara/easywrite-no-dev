'use strict'
let mainWindow
const { Menu } = require('electron');
// const {ipcRenderer} = window.require('electron')
let tray = null
// Create menu templete
const mainMenuTemplate = [
  {
    label:'File',
    submenu:[
      { label: "Exit", role: 'close'},
    ]
  },
  {
    label:'Translations',
    submenu:[
      {label: "English",
       type: 'checkbox',
       checked: true,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(0))
          mainWindow.webContents.send('translate','en')
        }
      },
      {label: "Danish",
       type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(1))
          mainWindow.webContents.send('translate','da')

        },
      },
      {label: "Finnish",
      type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(2))
          mainWindow.webContents.send('translate','fi')
        }
      },
      {label: "Icelandic",
       type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(3))
          mainWindow.webContents.send('translate','is')
        }
      },
      {label: "Norwegian",
       type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(4))
          mainWindow.webContents.send('translate','nb')
        }
      },
      {label: "Spanish",
       type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(5))
          mainWindow.webContents.send('translate','es')
        }
      },
      {label: "Swedish",
       type: 'checkbox',
        checked: false,
        click() {
          mainWindow.webContents.send('REFRESH_MENU', ControlState(6))
          mainWindow.webContents.send('translate','sv')
        }
      }
    ]
  }
];

function ControlState(val) {
  mainMenuTemplate[1].submenu.forEach(function (item, index) {
    if (index===val) {
      mainMenuTemplate[1].submenu[val].checked = true
    }
    else {
      mainMenuTemplate[1].submenu[index].checked = false
    }
  })

  return Menu.buildFromTemplate(mainMenuTemplate)
}

// If mac, add empty object on menu
if(process.platform == "darwin") {
  mainMenuTemplate.unshift({label: ''});
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
  return (process.env.NODE_ENV == 'production') ? Menu.buildFromTemplate([]) : Menu.buildFromTemplate(mainMenuTemplate)
}
