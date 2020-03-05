// Update with your config settings.
const path = require('path')
const { app } = require('electron')
module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: path.join(__dirname, '..', 'resources', 'db', 'base.db')
    }
  },
  production: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: path.resolve(app.getPath('userData'), 'resources', 'db', 'base.db')
    }
  }
}
