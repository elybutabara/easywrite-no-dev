<template>
<div class="page-main" v-bind:class="{ 'collapsed': $store.getters.collapsedSideNav, 'dark': $store.getters.darkmode }">
    <div v-if="ready">
        <SyncerV2 v-if="$store.getters.getSyncStatus == 'syncing'"></SyncerV2>
        <UserSettings v-if="is_user_settings_open"></UserSettings>
        <NotifySync v-if="show_notify_sync"></NotifySync>
        <!-- <div @click="toggleMainSideBar()"  class="btn-sidebar-opener"><i class="las la-arrow-right"></i></div> -->
        <main-side-navigation></main-side-navigation>
        <div class="es-right-side-content">
            <div class="es-top-parent">
                <div class="es-top-nav">
                  <div class="inner-nav">
                      <a
                        v-if="$store.getters.collapsedSideNav"
                        @click="$store.commit('toggleSideNav')"
                        class="icon-burger-close" href="javascript:void(0)">
                        <i class="las la-bars"></i>
                      </a>
                      <a @click="CHANGE_COMPONENT({tabKey: 'dashboard', tabComponent: 'dashboard',  tabData: null, tabTitle: $t('DASHBOARD')})" v-bind:class="{'active' : tabs.items[0].component == 'dashboard'}" href="javascript:void(0)" class="nav-btn dashboard">
                          <i class="fas fa-home"></i>
                          <span>{{ $t('DASHBOARD') }}</span>
                      </a>
                      <a @click="CHANGE_COMPONENT({tabKey: 'webinar-listing', tabComponent: 'webinar-listing',  tabData: null, tabTitle: $t('WEBINARS')})" v-bind:class="{'active' : tabs.items[0].component == 'webinar-listing'}" href="javascript:void(0)" class="nav-btn webinars">
                          <i class="fas fa-headset"></i>
                          <span>{{ $t('WEBINARS') }}</span>
                      </a>
                      <a @click="goToNotes()" v-bind:class="{'active' : tabs.items[0].component == 'note-listing'}" href="javascript:void(0)" class="nav-btn notes">
                          <i class="fas fa-sticky-note"></i>
                          <span>{{ $t('NOTES') }}</span>
                      </a>
                  </div>
                  <a @click="CHANGE_COMPONENT({tabKey: 'book-form', tabComponent: 'book-form', tabData: null, tabTitle: $t('NEW_BOOK'), newTab: true})" href="javascript:void(0)" class="nav-btn new-book bx-shadow-1">
                      <i class="fas fa-book-open"></i>
                      <span>{{ $t('NEW_BOOK') }}</span>
                  </a>
                  <a @click="startSync()" href="javascript:void(0)" class="nav-btn sync-data bx-shadow-1">
                      <template v-if="$store.getters.getSyncStatus == 'syncing'">
                        <i  class="fas fa-sync fa-spin"></i>
                        <span>{{ $t('SYNCING') }}</span>
                      </template>
                      <template v-else>
                        <i class="far fa-play-circle"></i>
                        <span>{{ $t('SYNC_DATA') }}</span>
                      </template>
                  </a>
                  <a @click="CHANGE_COMPONENT({tabKey: 'course-list', tabComponent: 'course-listing',  tabData: {}, tabTitle: $t('COURSES'), newTab: true})" href="javascript:void(0)" class="nav-btn courses bx-shadow-1">
                      <i class="fas fa-graduation-cap"></i>
                      <span>{{ $t('COURSES') }}</span>
                  </a>
                  <a class="nav-toggle mr-auto bx-shadow-1" href="javascript:void(0)" style="padding-top: 8px;">
                    <div class="switch-wrapper">
                      <label class="switch">
                        <input @click="$store.commit('toggleTheme')" type="checkbox" checked>
                        <span class="slider round"></span>
                      </label>
                      <label class="text">{{ $t('DARK_MODE') }}</label>
                    </div>
                  </a>
                  <a href="javascript:void(0)">
                    <pomodoro-timer></pomodoro-timer>
                  </a>

                  <a @click.prevent="showMessageCenter=!showMessageCenter; showUserSettings=false;" id="message-center" class="user-btn position-relative" href="javascript:void(0)" style="margin-right: 10px;">
                    <i class="fas fa-bell"></i>
                    <b-badge variant="primary">{{ notificationCount_ }}</b-badge>
                    <span v-if="notificationCount > 0" style="position: absolute;width: 20px;height: 20px;border-radius: 50%;background: red;color: rgb(255, 255, 255);top: -5px;right: -8px;line-height: 20px;text-align: center;font-size: 12px;">{{notificationCount}}</span>
                  </a>
                  <div id="message-centerr" v-show="showMessageCenter" style="position: absolute; top: 68px; right: 18px; z-index: 10000; width: 500px; text-align: left;">
                    <message-center-popup :params="user"></message-center-popup>
                  </div>
                  <a id="profile-nav" @click.prevent="showUserSettings=!showUserSettings; showMessageCenter=false;" class="user-btn" href="javascript:void(0)">
                    <i class="las la-user"></i>
                  </a>
                  <div id="profile-nav-div" v-show="showUserSettings" style="position: absolute; top: 68px; right: 12px; z-index: 10000; width: 350px; text-align: left; width: 250px;">
                      <div class="card shadow mb-4">
                        <div class="card-header py-3">
                          <h6 class="m-0 font-weight-bold">{{ user.data.username }}</h6>
                        </div>
                        <div class="user-setting-list">
                          <!--                        <a class="dropdown-item" @click="CHANGE_COMPONENT({tabKey: 'main-account', tabComponent: 'main-account',  tabData: null, tabTitle: 'Main Account'})">{{ trans("site.account.main") }}</a>-->
                          <!--                        <a class="dropdown-item" @click="CHANGE_COMPONENT({tabKey: 'main-reader-directory', tabComponent: 'main-reader-directory',  tabData: null, tabTitle: 'Main Reader Directory'})">{{ trans("site.the-reader-directory") }}</a>-->
                          <!--                        <a class="dropdown-item" @click="CHANGE_COMPONENT({tabKey: 'main-book-directory', tabComponent: 'main-book-directory',  tabData: null, tabTitle: 'Main Book Directory'})">{{ trans("site.the-book-directory") }}</a>-->
                          <!--                        <a class="dropdown-item" @click="CHANGE_COMPONENT({tabKey: 'main-book-finished', tabComponent: 'main-book-finished',  tabData: null, tabTitle: 'Main Book Finished'})">{{ trans('site.books-ive-finished') }}</a>-->
                          <!--                        <a class="dropdown-item" @click="CHANGE_COMPONENT({tabKey: 'my-deleted-books', tabComponent: 'my-deleted-books',  tabData: null, tabTitle: 'My Deleted Books'})">{{ trans('site.deleted-books-text') }}</a>-->
                          <a @click="toggleUserSettings()" class="dropdown-item">{{ $t('site.settings')  }}</a>
                          <a class="dropdown-item" @click="logout()">{{ $t('site.logout') }}</a>
                        </div>
                      </div>
                    </div>
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

                <book-details :key="tab.key" v-if="tab.component == 'book-details'" :properties="tab.data" :user="user"></book-details>
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
                <storyline :key="tab.key" v-if="tab.component == 'storyline'" :properties="tab.data" ></storyline>

                <syncing :key="tab.key" v-if="tab.component == 'syncing'" :properties="tab.data"></syncing>
                <course-details :key="tab.key" v-if="tab.component == 'course-details'" :properties="tab.data"></course-details>
                <course-listing :key="tab.key" v-if="tab.component == 'course-listing'" :properties="tab.data"></course-listing>
                <lesson-details :key="tab.key" v-if="tab.component == 'lesson-details'" :properties="tab.data"></lesson-details>

                <note-listing :key="tab.key" v-if="tab.component == 'note-listing'" :properties="tab.data"></note-listing>
                <webinar-listing :key="tab.key" v-if="tab.component == 'webinar-listing'" :properties="tab.data"></webinar-listing>

                <user-treadline :key="tab.key" v-if="tab.component == 'user-treadline'" :properties="tab.data" :user="user"></user-treadline>
            </div>
        </div>
    </div>
    <messaging :params="{}"></messaging>
</div>
</template>

<script>
import MainSideNavigation from '@/components/MainSideNavigation'
import MessageCenterPopup from '@/components/MessageCenterPopup'
import Messaging from '@/components/Messaging'
import Syncer from '@/components/Syncer'
import SyncerV2 from '@/components/SyncerV2'
import UserSettings from '@/components/UserSettings'
import NotifySync from '@/components/NotifySync'

import Syncing from '@/pages/views/syncing'
import StoryBoard from '@/pages/views/storyboard'
import Storyline from '@/pages/views/storyline'
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
import CourseListing from '@/pages/views/course/course-listing'

import NoteListing from '@/pages/views/notes/note-listing'
import WebinarListing from '@/pages/views/webinars/webinar-listing'
import UserTreadline from '@/pages/views/treadline/user-treadline.vue'
// const electron = window.require('electron')
// const remote = electron.remote
// const loginInfo = remote.getGlobal('loginInfo')

var shell = window.require('electron').shell

const electron = window.require('electron')
const log = window.require('electron-log')
const {ipcRenderer} = electron

export default {
  name: 'Main',

  data: function () {
    return {
      ready: false,
      isCollapsed: false,
      books: [],
      syncer: {
        is_open: false
      },
      active: {
        id: 0,
        data: null,
        component: 'book-listing'
      },
      itemsCounts: {
        'all': 0,
        'messages': 0,
        'notifications': 0,
        'invitations': 0
      },
      showMessageCenter: false,
      showUserSettings: false,
      forceQuit: false,
      notificationCount_: 0,
      is_user_settings_open: false,
      show_notify_sync: false,
    }
  },
  components: {
    'main-side-navigation': MainSideNavigation,
    'message-center-popup': MessageCenterPopup,
    'messaging': Messaging,
    'syncer': Syncer,
    'SyncerV2': SyncerV2,
    'NotifySync': NotifySync,
    'UserSettings': UserSettings,
    'syncing': Syncing,
    'storyboard': StoryBoard,
    'storyline': Storyline,
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
    'course-listing': CourseListing,
    'lesson-details': LessonDetails,
    'note-listing': NoteListing,
    'webinar-listing': WebinarListing,
    'user-treadline': UserTreadline,
  },
  methods: {
    logout () {
      ipcRenderer.send('SET_DEFAULTS', { reload: true })
    },
    toggleMessageCenter: function () {
      // const scope = this
      // scope.notification.show = !scope.notification.show
      // scope.showUserSettings = false
    },
    toggleUserSettings: function () {
      var scope = this 
      scope.is_user_settings_open = !scope.is_user_settings_open
    },
    setItemCount: function (k, n) {
      console.log('setItemCount', n)
      this.itemsCounts[k] = n
    },
    addItemCount: function (k, n) {
      console.log('addItemCount', n)
      this.itemsCounts[k] += n
    },
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
            title: this.$t('ARE_YOU_SURE_YOU_WANT_TO_CLOSE_EASYWRITE_WITH_UNSAVED_CHANGES') + '<br>' + this.$t('YOU_WONT_BE_ABLE_TO_REVERT_THIS'),
            html: text + '<br/>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: this.$t('FORCE_QUIT')
          }).then((result) => {
            if (result.value) {
              log.info('FORCE QUIT')
              ipcRenderer.send('FORCE_QUIT')
            }
          })
        }
      }
    },
    countNotificationItemTotal: function () {
      var scope = this
      scope.itemsCounts['all'] = scope.itemsCounts['messages'] + scope.itemsCounts['invitations'] + scope.itemsCounts['notifications']
      scope.notificationCount_ = scope.itemsCounts['all']
      return scope.itemsCounts['all']
    },
    goToNotes: function () {
      this.$store.dispatch('setActiveMainSideNavTab', 'books-i-read')
      this.CHANGE_COMPONENT({tabKey: 'note-listing', tabComponent: 'note-listing', tabData: null, tabTitle: this.$t('NOTES')})
    },
    startSync: function () {
      var scope = this
      if (scope.$store.getters.getSyncStatus == 'syncing') {
        return
      }

      scope.$store.dispatch('setSyncSource', { source: 'CTA' })
      scope.$store.commit('startSync')
    },
    closeSyncingNotification: function () {
      this.show_notify_sync = false
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
    },
    notificationCount: function () {
      return this.itemsCounts['Notification'] + this.itemsCounts['Message']
    },
    user () {
      var vUser = this.$store.getters.getUser
      return vUser
    }
  },

  mounted () {
    var scope = this
    // console.log(scope.tabs.items[0].component)
    window.AppMain = this
    // eslint-disable-next-line no-unused-vars
    var userUUID = this.$store.getters.getUserID
    // eslint-disable-next-line no-unused-vars
    var authorUUID = this.$store.getters.getAuthorID
    // scope.$store.dispatch('loadBooksByAuthor', {userUUID: userUUID, authorUUID: authorUUID})
    // scope.$store.dispatch('loadBooksIReadByAuthor', {userUUID: userUUID, authorUUID: authorUUID})
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
      // scope.CHANGE_COMPONENT({tabKey: 'syncing', tabComponent: 'syncing', tabData: null, tabTitle: scope.$t('SYNC_DATA'), newTab: true})
      scope.startSync();
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
        title: scope.$t('SUCCESSFULY_EXPORTED_TO'),
        text: data,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        // cancelButtonColor: '#dd3333',
        confirmButtonText: scope.$tc('OPEN_FILE'),
        cancelButtonText: scope.$t('CLOSE')
      }).then((result) => {
        if (result.value) {
          // data == path
          shell.openItem(data)
        }
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

    // open external links on system default web browser
    if (!window.openExternalAllExternalLinks) {
      window.openExternalAllExternalLinks = true
      document.addEventListener('click', function (e) {
        for (var target = e.target; target && target !== this; target = target.parentNode) {
          if (target.matches('a[href^="http"]') && !target.matches('a[href^="http://localhost"]')) {
            e.preventDefault()
            shell.openExternal(target.href)
            break
          }
        }
      }, false)
    }

    if (window.AppMessaging.recountUnread) {
      window.AppMessaging.recountUnread()
    }

    scope.auto_sync = scope.$store.getters.getUserSyncedAutoSync
 
    setTimeout(function () {
      if (scope.auto_sync) {
        scope.$store.commit('startSync')
      } else {
        var authorUUID = scope.$store.getters.getAuthorID
        scope.$store.dispatch('loadBooksByAuthor', {userUUID: userUUID, authorUUID: authorUUID, is_synced: true})
        scope.$store.dispatch('loadBooksIReadByAuthor', {userUUID: userUUID, authorUUID: authorUUID, is_synced: true})

        setTimeout(function(){
          scope.show_notify_sync = true
        },5500);
      }
    }, 1000)
  },
  created () {
    const scope = this
    window.addEventListener('click', function (e) {
      // Close when clicked outside the profile
      if (scope.showUserSettings && document.getElementById('profile-nav-div').contains(e.target) == false && document.getElementById('profile-nav').contains(e.target) == false) {
        scope.showUserSettings = false
      }

      // close when link clicked in profile
      document.querySelectorAll('#profile-nav-div .dropdown-item').forEach(link => {
        link.onclick = () => {
          scope.showUserSettings = false
        }
      })
    })
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
/*TODO: please use the custom.css from web*/
/* profile div in nav */
.user-setting-list a { cursor: pointer }
</style>
