// Update with your config settings.
const path = require('path')
const { app } = require('electron')
const log = require('electron-log')
let srcPath = (process.env.NODE_ENV === 'production') ? app.getPath('userData') : path.resolve(__dirname)
module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: path.join(srcPath, 'base.db')
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'migrations')
    },
    log: {
      warn (message) {
        log.warn(message)
      },
      error (message) {
        log.error(message)
      },
      deprecate (message) {
        log.info(message)
      },
      debug (message) {
        log.debug(message)
      }
    }
  },
  production: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: path.resolve(srcPath, 'resources', 'db', 'base.db')
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'migrations')
    },
    log: {
      warn (message) {
        log.warn(message)
      },
      error (message) {
        log.error(message)
      },
      deprecate (message) {
        log.info(message)
      },
      debug (message) {
        log.debug(message)
      }
    }
  }
}
