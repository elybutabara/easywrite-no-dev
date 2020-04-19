<template>
<div class="left-side-bar">
        <div class="header">
            <img src="@/assets/img/es-logo-white.png">
        </div>
        <div class="search-box">
            <input type="text" placeholder="Search keyword...">
            <i class="las la-search icon"></i>
        </div>
        <div class="es-tree-view">
            <ul class="level-1">
                <li v-bind:class="{ 'open' : (book.is_open == true) }" v-bind:key="book.id" v-for="(book,book_index)  in GET_BOOKS_BY_AUTHOR()">
                    <div class="label" @click="TOGGLE_TREE('books', book_index, book.is_open, book)"><span><img src="@/assets/img/icons/book.svg"> {{ book.title || 'Untitled' }}</span></div>
                    <ul v-if="book.is_open == true" class="level-2">
                        <li v-bind:class="{ 'open' : book.chapter_folder.is_open  == true }">
                            <div @click="TOGGLE_TREE('chapters',book_index, book.chapter_folder.is_open, book)" class="label">
                                <span>
                                    <img v-if="book.chapter_folder.is_open" src="@/assets/img/icons/folder-open.svg">
                                    <img v-else src="@/assets/img/icons/folder.svg">
                                    {{ $tc('chapter', 2) }}
                                </span>
                            </div>
                            <ul class="level-3">
                                <li v-bind:class="{ 'open' : chapter.is_open  == true }" v-bind:key="chapter.id" v-for="chapter in GET_CHAPTERS_BY_BOOK(book.uuid)">
                                    <div @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + chapter.uuid , tabComponent: 'chapter-details',  tabData: { book_id: book.uuid, chapter: chapter }, tabTitle: chapter.title}),toggle(chapter),LOAD_LIST('chapter-scenes',chapter)" class="label"><span><img  src="@/assets/img/icons/chapter.svg"> {{ chapter.title }}</span></div>
                                    <ul v-if="chapter.is_open  == true " class="level-4">
                                        <li v-bind:key="scene.id" v-for="scene in GET_SCENES_BY_CHAPTER(chapter.uuid)">
                                            <div @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + scene.uuid, tabComponent: 'scene-details',  tabData: { book_id: book.uuid, scene: scene}, tabTitle: scene.title})" class="label"><span><img  src="@/assets/img/icons/scene.svg"> {{ scene.title || 'Untitled' }}</span></div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li v-bind:class="{ 'open' : book.item_folder.is_open  == true }">
                            <div @click="TOGGLE_TREE('items',book_index, book.item_folder.is_open, book)" class="label">
                                <span>
                                    <img v-if="book.item_folder.is_open" src="@/assets/img/icons/folder-open.svg">
                                    <img v-else src="@/assets/img/icons/folder.svg">
                                    Items
                                </span>
                            </div>
                            <ul class="level-3">
                                <li v-bind:key="item.id" v-for="item in GET_ITEMS_BY_BOOK(book.uuid)">
                                    <div @click="CHANGE_COMPONENT({tabKey: 'item-details', tabComponent: 'item-details',  tabData: {  book_id: book.uuid, item: item }, tabTitle: item.itemname})" class="label"><span><img  src="@/assets/img/icons/item.svg"> {{ item.itemname || 'Untitled' }}</span></div>
                                </li>
                            </ul>
                        </li>
                        <li v-bind:class="{ 'open' : book.character_folder.is_open  == true }">
                            <div @click="TOGGLE_TREE('characters',book_index, book.character_folder.is_open, book)"  class="label">
                                <span>
                                    <img v-if="book.character_folder.is_open" src="@/assets/img/icons/folder-open.svg">
                                    <img v-else src="@/assets/img/icons/folder.svg">
                                    Characters
                                </span>
                            </div>
                            <ul class="level-3">
                                <li v-bind:key="character.id" v-for="character in GET_CHARACTERS_BY_BOOK(book.uuid)">
                                    <div @click="CHANGE_COMPONENT({tabKey: 'character-details-' + character.uuid, tabComponent: 'character-details',  tabData:  {  book_id: book.uuid, character: character }, tabTitle: character.fullname})" class="label"><span><img  src="@/assets/img/icons/character.svg"> {{ character.fullname || 'Unamed' }}</span></div>
                                </li>
                            </ul>
                        </li>
                        <li v-bind:class="{ 'open' : book.location_folder.is_open  == true }">
                            <div @click="TOGGLE_TREE('locations',book_index, book.location_folder.is_open, book)" class="label">
                                <span>
                                    <img v-if="book.location_folder.is_open" src="@/assets/img/icons/folder-open.svg">
                                    <img v-else src="@/assets/img/icons/folder.svg">
                                    Locations
                                </span>
                            </div>
                            <ul class="level-3">
                                <li v-bind:key="location.id" v-for="location in GET_LOCATIONS_BY_BOOK(book.uuid)">
                                    <div @click="CHANGE_COMPONENT({tabKey: 'location-details-' + location.uuid, tabComponent: 'location-details',  tabData: { book_id: book.uuid, location: location }, tabTitle: location.location})" class="label"><span><img  src="@/assets/img/icons/location.svg"> {{ location.location || 'Untitled' }}</span></div>
                                </li>
                            </ul>
                        </li>
                        <li v-bind:class="{ 'open' : book.scene_folder.is_open  == true }">
                            <div @click="TOGGLE_TREE('scenes',book_index, book.scene_folder.is_open, book)" class="label">
                                <span>
                                    <img v-if="book.scene_folder.is_open" src="@/assets/img/icons/folder-open.svg">
                                    <img v-else src="@/assets/img/icons/folder.svg">
                                    Other Scenes
                                </span>
                            </div>
                            <ul class="level-4">
                                <li  v-bind:key="scene.id" v-for="scene in GET_SCENES_BY_BOOK(book.uuid)">
                                    <div @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + scene.uuid, tabComponent: 'scene-details', tabData: { book_id: book.uuid, scene: scene }, tabTitle: scene.title})" class="label"><span><img  src="@/assets/img/icons/scene.svg"> {{ scene.title || 'Untitled' }}</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
          <div class="updateVersion" >
            <!--avaialable update-->
            <span v-if="auto_update.status == 'updateAvailable'" @click="downloadAppUpdate()" href='#' ><i class="las la-code-branch icon" v-html="auto_update.text"></i></span>
            <!--progress-->
            <span v-if="(auto_update.status == 'downloadProgress')" v-html="'Downloading v' + auto_update.version"></span>
            <b-progress v-if="(auto_update.status == 'downloadProgress')" :max="100">
              <b-progress-bar :value="(auto_update.progress < 7) ? 7 :auto_update.progress" :label="`  ${((auto_update.progress / 100) * 100).toFixed(2)}%`"></b-progress-bar>
            </b-progress>
            <!--install update-->
            <span v-if="auto_update.status == 'downloaded'" @click="installNewVersion()" href='#' ><i class="las la-code-branch icon" v-html="' Install new version: ' + auto_update.version"></i></span>
          </div>
        </div>
    </div>
</template>

<script>
const electron = window.require('electron')
const log = window.require('electron-log')
// const remote = electron.remote
const { ipcRenderer } = electron

// In renderer process (web page).
export default {
  name: 'MainSideNavigation',
  data () {
    return {
      // chapters: [],
      scenes: [],
      items: [],
      locations: [],
      other_scenes: [],
      auto_update: {
        version: '',
        downloaded_version: '',
        progress: 0,
        status: '',
        text: ''
      }
    }
  },
  methods: {
    changeComponent: function (tabComponent, data, tabTitle = 'New Tab', newTab = false, tabIndex = 0) {
      var scope = this
      // scope.$parent.changeComponent(component, data)
      if (newTab) {
        scope.$store.dispatch('newTab', { title: tabTitle, component: tabComponent })
      } else {
        scope.$store.dispatch('changeTabContent', { title: tabTitle, component: tabComponent, data: data, index: tabIndex })
      }
    },
    toggle: function (data) {
      var scope = this
      var isOpen = !((typeof data.is_open !== 'undefined' && data.is_open))
      scope.$set(data, 'is_open', isOpen)
    },
    installNewVersion: function () {
      window.swal.fire({
        title: 'Are you sure you want to install update?',
        text: "Please save all your work before you install. You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Restart and Install'
      }).then((result) => {
        if (result.value) {
          log.info('Quit and install update triggered')
          ipcRenderer.send('install-update')
        }
      })
    },
    downloadAppUpdate: function () {
      ipcRenderer.send('AUTO_UPDATE:downloadAppUpdate')
    },
    checkAppUpdate: function () {
      var scope = this
      // check available update
      ipcRenderer.send('AUTO_UPDATE:checkUpdateAvailable')
      ipcRenderer.on('AUTO_UPDATE:updateAvailable', function (event, data) {
        // show downloaded version if the downloaded version is not the same as the update version
        // log.info('scope.auto_update.downloaded_version !== data.version: ' + (scope.auto_update.downloaded_version !== data.version))
        // log.info('scope.auto_update.status !== downloadProgress: ' + (scope.auto_update.status !== 'downloadProgress'))
        // log.info('scope.auto_update.status !== downloaded: ' + (scope.auto_update.status !== 'downloaded'))
        if (
          scope.auto_update.downloaded_version !== data.version &&
          scope.auto_update.status !== 'downloadProgress' &&
          scope.auto_update.status !== 'downloaded'
        ) {
          scope.auto_update.status = 'updateAvailable'
          scope.auto_update.version = data.version
          scope.auto_update.text = 'Download new version: ' + data.version
        }
      })

      // show prepate since there is a time delay in downloading
      ipcRenderer.on('AUTO_UPDATE:prepareDownload', function (event, data) {
        scope.auto_update.text = 'Preparing download ...'
      })

      // show error via notification
      ipcRenderer.on('AUTO_UPDATE:error', function (event, data) {
        log.warn(data.error)
        scope.auto_update.status = 'updateAvailable'
        ipcRenderer.send('AUTO_UPDATE:checkUpdateAvailable')
        scope.$notify({
          group: 'notification',
          title: 'Downloading new version Failed!',
          text: data.error,
          type: 'warn'
        })
      })

      // show download progress
      ipcRenderer.on('AUTO_UPDATE:downloadProgress', function (event, data) {
        scope.auto_update.status = 'downloadProgress'
        scope.auto_update.progress = data.progress
        if (scope.auto_update.progress >= 100) {
          scope.auto_update.status = 'downloaded'
        }
      })

      // after 100 and checking after app is re-open with finish download
      ipcRenderer.on('AUTO_UPDATE:downloaded', function (event, data) {
        scope.auto_update.status = 'downloaded'
        scope.auto_update.downloaded_version = data.version
      })
    }
  },
  mounted () {
    var scope = this
    scope.checkAppUpdate()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.new-book { font-family: 'Crimson Roman'; color:#abc4d7; font-size: 14px; cursor: pointer }
.new-book:hover  { color:#fff; }

.updateVersion{ padding-left:5px;width:325px;background: #324553;position: fixed;bottom: 0;left: 0;text-align: center;margin-left: -5px;}
.updateVersion span{ font-family: 'Crimson Roman'; color:#abc4d7; font-size: 14px; cursor: pointer }
.updateVersion span:hover  { color:#fff; }
</style>
