'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const builder = require('electron-builder')
const Platform = builder.Platform
const spinner = ora('building for production...')
spinner.start()

let buildOptions = {
  "appId": "com.forfatterskolen.easywrite",
  "productName": "Easy Write App",
  "directories": {
    "output": "output"
  },
  "extraResources": [
    {
      "from": "./resources",
      "to": "./",
      "filter": [
        "**/*"
      ]
    },
    {
      "from": "./config/prod.env.js",
      "to": "./prod.env",
      "filter": [
        "**/*"
      ]
    }
  ],
  "files": [
    "**/*",
    "!**src/*",
    "!**config/*",
    "!**icons/*",
    "!**test/*",
    "!**static/*",
    "!*.db",
    "!**db/*"
  ],
  "mac": {
    "category": "public.app-category.productivity",
    "target": "dmg",
    "icon": "build/icons/mac/icon.icns"
  },
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": [
          "x64",
          "ia32"
        ]
      }
    ],
    "icon": "build/icons/win/icon.ico"
  },
  "nsis": {
    "allowToChangeInstallationDirectory": true,
    "oneClick": false
  }
}

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {

    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  WebPack complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))

    let target = (process.platform === 'darwin') ? Platform.MAC.createTarget() : Platform.WINDOWS.createTarget();

    builder.build({
      targets : target,
      config: buildOptions
    }).then(() => {
      console.log(chalk.green('\n\nBuild complete.\n'))
      spinner.stop()
      process.exit(0);
    });

  })



})
