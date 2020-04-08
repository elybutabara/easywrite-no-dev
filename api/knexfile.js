// Update with your config settings.
const path = require('path')
const { app } = require('electron')
const log = require('electron-log')
let srcPath = (process.env.NODE_ENV === 'production') ? app.getPath('userData') : path.resolve(__dirname, '../config/db')

// TODO delete this if stable is release
if (process.env.NODE_ENV === 'production') {
  srcPath = (process.env.DEMO && process.platform === 'darwin') ? path.resolve(srcPath, 'demo', 'db', 'demo.db') : path.resolve(srcPath, 'resources', 'db', 'easywrite.db')
  log.info('kenxfile:' + srcPath)
}

module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: path.join(srcPath, 'development.db')
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
      filename: srcPath
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
