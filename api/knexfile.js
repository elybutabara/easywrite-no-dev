// Update with your config settings.
const path = require('path')

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
      filename: path.join(process.resourcesPath, 'db', 'base.db')
    }
  }
}
