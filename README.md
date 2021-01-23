# EasyWrite

> Easy Write Application , The best app for writer!

# PREREQUISITE SOFTWARE
> REQUIREMENT
> 1. NODE.JS v12.x
> 2. Python v2.x
> 3. windows-build-tools ```npm install -g windows-build-tools```
> 4. sqlite3 v5.0.0 only.. need to verify before upgrading
## HOW TO INSTALL
1. npm install yarn -g
2. yarn install

## HOW TO RUN DEV
``` bash
# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Package.json Scripts
> This script is for WINDOWS ONLY, will create "migration file" in "api/migrations"
```
"migration-win" : "cross-env NODE_ENV=development knex migrate:make %npm_package_version% --knexfile=./api/knexfile.js",
```
> This script is for MAC & LINUX will, create "migration file" in "api/migrations"
```
"migration-mac-linux" : "cross-env NODE_ENV=development knex migrate:make $npm_package_name --knexfile=./api/knexfile.js"
```
## Build Scripts - Tips and Helps
```
"download-electron-for-build": "electron-download --mirror=https://npm.taobao.org/mirrors/electron/ --version=1.5.0"
```
