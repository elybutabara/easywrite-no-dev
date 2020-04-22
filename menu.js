'use strict'

const { Menu } = require('electron');

// Create menu templete
const mainMenuTemplate = [
  {
    label:'File',
    submenu:[
      {
        label: "Exit",
        role: 'close'
      }
    ]
  },
  {
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
];

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
//module.exports = (process.env.NODE_ENV == 'production') ? Menu.buildFromTemplate([]) : Menu.buildFromTemplate(mainMenuTemplate);
module.exports = Menu.buildFromTemplate(mainMenuTemplate);
