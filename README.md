# EasyWrite

> Easy Write Application , The best app for writer!

## HOW TO INSTALL
> REQUIREMENT NODE.JS v12.x
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
