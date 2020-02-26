# EasyWriteApp

> Easy Write Application , The best app for writer!

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Package.json Build Setup

``` bash
"build": {
    "appId": "com.forfatterskolen.easywrite",
    "productName": "Easy Write App",
    "directories": {
      "output": "output"
    },
    ## Resource folder that will be use outside the compress build (e.g: database,public images)##
    "extraResources": [
      {
        "from": "./resources",
        "to": "./",
        "filter": [
          "**/*"
        ]
      }
    ],
    ## Files that are excluded (e.g source codes,build,databases)
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
    ## installer to install in Application with productivity as category
    "mac": {
      "category": "public.app-category.productivity",
      "target": "dmg",
      "icon": "build/icons/mac/icon.icns"
    },
    ## installer to install in user-choice directory both x86 & x64 bit architecture
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
```
