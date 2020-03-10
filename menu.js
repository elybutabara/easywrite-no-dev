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
module.exports = (process.env.NODE_ENV == 'production') ? Menu.buildFromTemplate([]) : Menu.buildFromTemplate(mainMenuTemplate);
