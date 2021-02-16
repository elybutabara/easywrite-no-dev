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

# Start the dev app
> npm run dev
>
> npm run start

# build for production with minification , output folder: output
npm run build

## Create Migration File
> This script is for WINDOWS ONLY, will create "migration file" in "api/migrations"
```
"migration-win" : "cross-env NODE_ENV=development knex migrate:make %npm_package_version% --knexfile=./api/knexfile.js",
```
> This script is for MAC & LINUX will, create "migration file" in "api/migrations"
```
"migration-mac-linux" : "cross-env NODE_ENV=development knex migrate:make $npm_package_name --knexfile=./api/knexfile.js"
```
