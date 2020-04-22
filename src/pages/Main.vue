<template>
<div class="page-main">
    <div v-if="ready">
        <main-side-navigation></main-side-navigation>
        <div class="es-right-side-content">
            <div class="es-top-parent">
               <pomodoro-timer></pomodoro-timer>
                <div class="es-top-nav">
                    <button @click="CHANGE_COMPONENT({tabKey: 'dashboard', tabComponent: 'dashboard',  tabData: null, tabTitle: $t('dashboard')})"> {{ $t('dashboard') }}</button>
                    <button @click="CHANGE_COMPONENT({tabKey: 'syncing', tabComponent: 'syncing',  tabData: null, tabTitle: 'Syncing', newTab: true})">{{ $t('sync_data') }}</button>
                    <button @click="CHANGE_COMPONENT({tabKey: 'book-form', tabComponent: 'book-form',  tabData: null, tabTitle: 'New Book', newTab: true})">{{ $t('new_book') }}</button>
                </div>
            </div>
            <div class="es-tab-nav">
                <div class="es-tab-nav-item"  v-bind:class="{ 'active': index == tabs.active_index }" v-for="(tab,index) in tabs.items" v-bind:key="index">
                    <span @click="CHANGE_TAB(index)" class="es-tab-title">{{ tab.title || 'Untitled' }}</span>
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

                <book-form :key="tab.key" v-if="tab.component == 'book-form'" :properties="tab.data"></book-form>
                <location-form :key="tab.key" v-if="tab.component == 'location-form'" :properties="tab.data"></location-form>
                <item-form :key="tab.key" v-if="tab.component == 'item-form'" :properties="tab.data"></item-form>
                <character-form :key="tab.key" v-if="tab.component == 'character-form'" :properties="tab.data"></character-form>
                <chapter-form :key="tab.key" v-if="tab.component == 'chapter-form'" :properties="tab.data"></chapter-form>
                <scene-form :key="tab.key" v-if="tab.component == 'scene-form'" :properties="tab.data"></scene-form>

                <syncing :key="tab.key" v-if="tab.component == 'syncing'" :properties="tab.data"></syncing>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import MainSideNavigation from '@/components/MainSideNavigation'
import Syncer from '@/components/Syncer'

import Syncing from '@/pages/views/syncing'
import Dashboard from '@/pages/views/dashboard'
import ChapterListing from '@/pages/views/chapter-listing'
import SceneListing from '@/pages/views/scene-listing'
import ItemListing from '@/pages/views/item-listing'
import CharacterListing from '@/pages/views/character-listing'
import LocationListing from '@/pages/views/location-listing'

import BookDetails from '@/pages/views/book-details'
import ChapterDetails from '@/pages/views/chapter-details'
import SceneDetails from '@/pages/views/scene-details'
import ItemDetails from '@/pages/views/item-details'
import CharacterDetails from '@/pages/views/character-details'
import LocationDetails from '@/pages/views/location-details'

import BookForm from '@/pages/views/book-form'
import LocationForm from '@/pages/views/location-form'
import ItemForm from '@/pages/views/item-form'
import CharacterForm from '@/pages/views/character-form'
import SceneForm from '@/pages/views/scene-form'
import ChapterForm from '@/pages/views/chapter-form'
import PomodoroTimer from '@/pages/views/pomodoro-timer'

// const electron = window.require('electron')
// const remote = electron.remote
// const loginInfo = remote.getGlobal('loginInfo')
const electron = window.require('electron')
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
      }
    }
  },
  components: {
    'main-side-navigation': MainSideNavigation,
    'syncer': Syncer,
    'syncing': Syncing,
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
    'pomodoro-timer': PomodoroTimer
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
    var userID = this.$store.getters.getUserID
    scope.$store.dispatch('getBooksByAuthorID', userID)
    console.log(scope)
    setTimeout(function () {
      scope.ready = true
    }, 1000)
  }
}

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
