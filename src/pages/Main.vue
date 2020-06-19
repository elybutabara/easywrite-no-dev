<template>
<div class="page-main">
    <div v-if="ready">
        <main-side-navigation></main-side-navigation>
        <div class="es-right-side-content">
            <div class="es-top-parent">
               <pomodoro-timer></pomodoro-timer>
                <div class="es-top-nav">
                    <button @click="CHANGE_COMPONENT({tabKey: 'dashboard', tabComponent: 'dashboard',  tabData: null, tabTitle: $t('DASHBOARD')})"> {{ $t('DASHBOARD') }}</button>
                    <button @click="CHANGE_COMPONENT({tabKey: 'syncing', tabComponent: 'syncing',  tabData: null, tabTitle: $t('SYNC_DATA'), newTab: true})">{{ $t('SYNC_DATA') }}</button>
                    <button @click="CHANGE_COMPONENT({tabKey: 'book-form', tabComponent: 'book-form',  tabData: null, tabTitle: $t('NEW_BOOK'), newTab: true})">{{ $t('NEW_BOOK') }}</button>
                </div>
            </div>
            <div class="es-tab-nav">
                <div class="es-tab-nav-item"  v-bind:class="{ 'active': index == tabs.active_index, 'modified': tab.modified }" v-for="(tab,index) in tabs.items" v-bind:key="index">
                    <span @click="CHANGE_TAB(index)" class="es-tab-title">{{ $t(tab.title) || 'Untitled' }}</span>
                    <span @click="REMOVE_TAB(index)" class="es-tab-closer" v-if="index != 0"><i class="fas fa-times"></i></span>
                </div>
            </div>

            <div class="es-item-content" v-bind:class="{ 'active': index == tabs.active_index }" v-for="(tab,index) in tabs.items"  v-bind:key="'content-' + index" >
                <dashboard :key="tab.key" v-if="tab.component == 'dashboard'" :properties="tab.data"></dashboard>
                <chapter-listing :key="tab.key" v-if="tab.component == 'chapter-listing'" :properties="tab.data"></chapter-listing>
                <scene-listing :key="tab.key" v-if="tab.component == 'scene-listing'" :properties="tab.data"></scene-listing>
                <item-listing :key="tab.key" v-if="tab.component == 'item-listing'" :properties="tab.data"></item-listing>
                <location-listing :key="tab.key" v-if="tab.component == 'location-listing'" :properties="tab.data"></location-listing>
                <character-listing :key="tab.key" v-if="tab.component == 'character-listing'" :properties="tab.data"></character-listing>

                <book-details :key="tab.key" v-if="tab.component == 'book-details'" :properties="tab.data"></book-details>
                <chapter-details :key="tab.key" v-if="tab.component == 'chapter-details'" :properties="tab.data"></chapter-details>
                <scene-details :key="tab.key" v-if="tab.component == 'scene-details'" :properties="tab.data"></scene-details>
                <item-details :key="tab.key" v-if="tab.component == 'item-details'" :properties="tab.data"></item-details>
                <location-details :key="tab.key" v-if="tab.component == 'location-details'" :properties="tab.data"></location-details>
                <character-details :key="tab.key" v-if="tab.component == 'character-details'" :properties="tab.data"></character-details>

                <books-i-read-book-details :key="tab.key" v-if="tab.component == 'books-i-read-book-details'" :properties="tab.data"></books-i-read-book-details>
                <books-i-read-chapter-listing :key="tab.key" v-if="tab.component == 'books-i-read-chapter-listing'" :properties="tab.data"></books-i-read-chapter-listing>
                <books-i-read-scene-listing :key="tab.key" v-if="tab.component == 'books-i-read-scene-listing'" :properties="tab.data"></books-i-read-scene-listing>
                <books-i-read-chapter-details :key="tab.key" v-if="tab.component == 'books-i-read-chapter-details'" :properties="tab.data"></books-i-read-chapter-details>
                <books-i-read-scene-details :key="tab.key" v-if="tab.component == 'books-i-read-scene-details'" :properties="tab.data"></books-i-read-scene-details>

                <book-form :key="tab.key" v-if="tab.component == 'book-form'" :properties="tab.data"></book-form>
                <location-form :key="tab.key" v-if="tab.component == 'location-form'" :properties="tab.data"></location-form>
                <item-form :key="tab.key" v-if="tab.component == 'item-form'" :properties="tab.data"></item-form>
                <character-form :key="tab.key" v-if="tab.component == 'character-form'" :properties="tab.data"></character-form>
                <chapter-form :key="tab.key" v-if="tab.component == 'chapter-form'" :properties="tab.data"></chapter-form>
                <scene-form :key="tab.key" v-if="tab.component == 'scene-form'" :properties="tab.data"></scene-form>

                <storyboard :key="tab.key" v-if="tab.component == 'storyboard'" :properties="tab.data"></storyboard>
                <syncing :key="tab.key" v-if="tab.component == 'syncing'" :properties="tab.data"></syncing>
                <course-details :key="tab.key" v-if="tab.component == 'course-details'" :properties="tab.data"></course-details>
                <lesson-details :key="tab.key" v-if="tab.component == 'lesson-details'" :properties="tab.data"></lesson-details>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import MainSideNavigation from '@/components/MainSideNavigation'
import Syncer from '@/components/Syncer'

import Syncing from '@/pages/views/syncing'
import StoryBoard from '@/pages/views/storyboard'
import Dashboard from '@/pages/views/dashboard'
import ChapterListing from '@/pages/views/chapters/chapter-listing'
import SceneListing from '@/pages/views/scenes/scene-listing'
import ItemListing from '@/pages/views/items/item-listing'
import CharacterListing from '@/pages/views/characters/character-listing'
import LocationListing from '@/pages/views/locations/location-listing'

import BookDetails from '@/pages/views/books/book-details'
import ChapterDetails from '@/pages/views/chapters/chapter-details'
import SceneDetails from '@/pages/views/scenes/scene-details'
import ItemDetails from '@/pages/views/items/item-details'
import CharacterDetails from '@/pages/views/characters/character-details'
import LocationDetails from '@/pages/views/locations/location-details'

import BookForm from '@/pages/views/books/book-form'
import LocationForm from '@/pages/views/locations/location-form'
import ItemForm from '@/pages/views/items/item-form'
import CharacterForm from '@/pages/views/characters/character-form'
import SceneForm from '@/pages/views/scenes/scene-form'
import ChapterForm from '@/pages/views/chapters/chapter-form'
import PomodoroTimer from '@/components/PomodoroTimer'

// books i read
import BooksIReadBookDetails from '@/pages/views/books-i-read/book-details'
import BooksIReadChapterListing from '@/pages/views/books-i-read/chapter-listing'
import BooksIReadSceneListing from '@/pages/views/books-i-read/scene-listing'
import BooksIReadChapterDetails from '@/pages/views/books-i-read/chapter-details'
import BooksIReadSceneDetails from '@/pages/views/books-i-read/scene-details'
import CourseDetails from '@/pages/views/course/course-details'
import LessonDetails from '@/pages/views/lessons/lesson-details'

// const electron = window.require('electron')
// const remote = electron.remote
// const loginInfo = remote.getGlobal('loginInfo')
const electron = window.require('electron')
const log = window.require('electron-log')
const {ipcRenderer} = electron

export default {
  name: 'Main',
  data: function () {
    return {
      ready: false,
      books: [],
      syncer: {
        is_open: false
      },
      active: {
        id: 0,
        data: null,
        component: 'book-listing'
      },
      forceQuit: false
    }
  },
  components: {
    'main-side-navigation': MainSideNavigation,
    'syncer': Syncer,
    'syncing': Syncing,
    'storyboard': StoryBoard,
    'dashboard': Dashboard,
    'chapter-listing': ChapterListing,
    'scene-listing': SceneListing,
    'item-listing': ItemListing,
    'character-listing': CharacterListing,
    'location-listing': LocationListing,
    'book-details': BookDetails,
    'chapter-details': ChapterDetails,
    'scene-details': SceneDetails,
    'item-details': ItemDetails,
    'character-details': CharacterDetails,
    'location-details': LocationDetails,
    'book-form': BookForm,
    'location-form': LocationForm,
    'item-form': ItemForm,
    'chapter-form': ChapterForm,
    'scene-form': SceneForm,
    'character-form': CharacterForm,
    'books-i-read-book-details': BooksIReadBookDetails,
    'books-i-read-chapter-listing': BooksIReadChapterListing,
    'books-i-read-scene-listing': BooksIReadSceneListing,
    'books-i-read-chapter-details': BooksIReadChapterDetails,
    'books-i-read-scene-details': BooksIReadSceneDetails,
    'pomodoro-timer': PomodoroTimer,
    'course-details': CourseDetails,
    'lesson-details': LessonDetails
  },
  methods: {
    changeComponent: function (component, data) {
      var scope = this
      scope.$delete(scope.active, 'data')
      scope.$set(scope.active, 'data', data)
      scope.active.component = ''
      scope.active.component = component
    },
    toggleSyncer: function () {
      var scope = this
      scope.syncer.is_open = !scope.syncer.is_open
    },
    checkHasUnsavedTabs: function () {
      let scope = this
      window.onbeforeunload = (e) => {
        let modified = scope.$store.getters.getModifiedTabs

        ipcRenderer.on('ENABLE_FORCE_QUIT', function () {
          scope.forceQuit = true
        })

        if (modified.length > 0 && scope.forceQuit === false) {
          e.returnValue = true
          var text = ''
          for (let i = 0; i < modified.length; i++) {
            let current = modified[i]
            text += '<p style="margin:0px;">' + current.title + '</p>'
          }
          window.swal.fire({
            title: this.$tc('Are you sure you want to Close EasyWrite with unsaved changes?') + '<br>' + this.$tc("You won't be able to revert this!"),
            html: text + '<br/>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: this.$tc('Force Quit')
          }).then((result) => {
            if (result.value) {
              log.info('FORCE QUIT')
              ipcRenderer.send('FORCE_QUIT')
            }
          })
        }
      }
    }
  },
  beforeMount () {
    /*
    this.$store.commit('authenticate', {
      user: loginInfo.data.user,
      author: loginInfo.data.author
    })
    */
  },
  computed: {
    tabs () {
      return this.$store.getters.getTabs
    }
  },

  mounted () {
    var scope = this
    var userUUID = this.$store.getters.getUserID
    var authorUUID = this.$store.getters.getAuthorID
    scope.$store.dispatch('loadBooksByAuthor', {userUUID: userUUID, authorUUID: authorUUID})
    scope.$store.dispatch('loadBooksIReadByAuthor', {userUUID: userUUID, authorUUID: authorUUID})
    // scope.$store.dispatch('getBooksByAuthorID', userID)
    setTimeout(function () {
      scope.ready = true
    }, 1000)

    scope.CHANGE_MENU_TITLE(scope.$t('DASHBOARD'))

    ipcRenderer.on('GO_TO_DASHBOARD', function (event, data) {
      scope.CHANGE_COMPONENT({tabKey: 'dashboard', tabComponent: 'dashboard', tabData: null, tabTitle: scope.$t('DASHBOARD')})
    })

    ipcRenderer.on('NEW_BOOK', function (event, data) {
      scope.CHANGE_COMPONENT({tabKey: 'book-form', tabComponent: 'book-form', tabData: null, tabTitle: scope.$t('NEW_BOOK'), newTab: true})
    })

    ipcRenderer.on('SYNC_DATA', function (event, data) {
      scope.CHANGE_COMPONENT({tabKey: 'syncing', tabComponent: 'syncing', tabData: null, tabTitle: scope.$t('SYNC_DATA'), newTab: true})
    })

    ipcRenderer.on('SHOW_SWAL_TIMESUP', function (event, data) {
      window.swal.fire({
        icon: 'error',
        title: scope.$t('TIMES_UP'),
        text: scope.$t('YOUR_POMODORO_EXPIRES'),
        customClass: {
          container: 'pomodoro-expired-alert animated heartBeat'
        }
      })
    })

    ipcRenderer.on('SHOW-SWAL-SUCCESS-EXPORTING', function (event, data) {
      window.swal.fire({
        icon: 'success',
        title: scope.$t('SUCCESSFULY_EXPORTED_TO'),
        text: data
      })
    })

    ipcRenderer.on('SHOW-SWAL-ERROR-EXPORTING', function (event, data) {
      window.swal.fire({
        icon: 'error',
        title: scope.$t('UNSUCCESSFULY_EXPORTED_YOUR_FILE_IS_ALREADY_OPEN_PLEASE_CLOSE_YOUR_FILE_BEFORE_EXPORTING'),
        text: data
      })
    })

    scope.checkHasUnsavedTabs()
  }
}

ipcRenderer.on('LOGOUT', function (e, data) {
  // Check something before calling the SET_DELFAULT
  ipcRenderer.send('SET_DEFAULTS', { reload: true })
})

ipcRenderer.on('SET_TRANSLATION_DOM', function (event, data) {
  localStorage.setItem('translation', data)
})

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.es-top-parent{ position: relative; background:#293742; border-left:1px solid #324553; border-bottom:1px solid #506d84; height:40px; line-height:40px; padding:0px 10px; text-align:right;}
.es-top-nav { position: absolute; right: 10px;}
.pomodoro-nav {position: absolute; height:40px; line-height:40px; padding:0px 10px; text-align: center;}
</style>
