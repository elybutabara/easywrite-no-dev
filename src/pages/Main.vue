<template>
<div class="page-main">
    <div class="left-side-bar">
        <div class="header">
            <img src="@/assets/img/es-logo-white.png">
        </div>
        <div class="search-box">
            <input type="text" placeholder="Search keyword...">
            <i class="las la-search icon"></i>
        </div>
        <div class="es-tree-view">
            <div class="text-right">
              <span  @click="changeComponent('book-form')" class="new-book"><i class="las la-plus icon"></i> New Book</span>
            </div>
            <ul class="level-1">
                <li v-bind:class="{ 'open' : (book.is_open == true) }" v-bind:key="book.id" v-for="book in books">
                    <div class="label" @click="showChildren(book)"><span><img src="@/assets/img/icons/book.svg"> {{ book.title }}</span></div>
                    <ul v-if="book.is_open == true" class="level-2">
                        <li v-bind:class="{ 'open' : book.chapters.is_open  == true }">
                            <div @click="getChapters(book)"  class="label">
                                <span>
                                    <img v-if="book.chapters.is_open" src="@/assets/img/icons/folder-open.svg">
                                    <img v-else src="@/assets/img/icons/folder.svg">
                                    Chapters
                                </span>
                            </div>
                            <ul class="level-3">
                                <li v-bind:class="{ 'open' : chapter.is_open  == true }" v-bind:key="chapter.id" v-for="chapter in book.chapters.rows">
                                    <div @click="getSceneByChapter(chapter)" class="label"><span><img  src="@/assets/img/icons/chapter.svg"> {{ chapter.title }}</span></div>
                                    <ul v-if="chapter.is_open  == true " class="level-4">
                                        <li v-bind:key="scene.id" v-for="scene in chapter.scenes.rows">
                                            <div @click="changeComponent('scene-details',scene.id)" class="label"><span><img  src="@/assets/img/icons/scene.svg"> {{ scene.title }}</span></div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li v-bind:class="{ 'open' : book.items.is_open  == true }">
                            <div @click="getItems(book)" class="label">
                                <span>
                                    <img v-if="book.items.is_open" src="@/assets/img/icons/folder-open.svg">
                                    <img v-else src="@/assets/img/icons/folder.svg">
                                    Items
                                </span>
                            </div>
                            <ul class="level-3">
                                <li v-bind:key="item.id" v-for="item in book.items.rows">
                                    <div @click="changeComponent('item-details',item.id)" class="label"><span><img  src="@/assets/img/icons/item.svg"> {{ item.itemname }}</span></div>
                                </li>
                            </ul>
                        </li>
                        <li v-bind:class="{ 'open' : book.characters.is_open  == true }">
                            <div @click="getCharacters(book)"  class="label">
                                <span>
                                    <img v-if="book.characters.is_open" src="@/assets/img/icons/folder-open.svg">
                                    <img v-else src="@/assets/img/icons/folder.svg">
                                    Characters
                                </span>
                            </div>
                            <ul class="level-3">
                                <li v-bind:key="character.id" v-for="character in book.characters.rows">
                                    <div @click="changeComponent('character-details',character.id)" class="label"><span><img  src="@/assets/img/icons/character.svg"> {{ character.fullname }}</span></div>
                                </li>
                            </ul>
                        </li>
                        <li v-bind:class="{ 'open' : book.locations.is_open  == true }">
                            <div @click="getLocations(book)" class="label">
                                <span>
                                    <img v-if="book.locations.is_open" src="@/assets/img/icons/folder-open.svg">
                                    <img v-else src="@/assets/img/icons/folder.svg">
                                    Locations
                                </span>
                            </div>
                            <ul class="level-3">
                                <li v-bind:key="location.id" v-for="location in book.locations.rows">
                                    <div @click="changeComponent('location-details',{ location: location })" class="label"><span><img  src="@/assets/img/icons/location.svg"> {{ location.location }}</span></div>
                                </li>
                            </ul>
                        </li>
                        <li v-bind:class="{ 'open' : book.scenes.is_open  == true }">
                            <div @click="getScenes(book)" class="label">
                                <span>
                                    <img v-if="book.scenes.is_open" src="@/assets/img/icons/folder-open.svg">
                                    <img v-else src="@/assets/img/icons/folder.svg">
                                    Other Scenes
                                </span>
                            </div>
                            <ul class="level-4">
                                <li  v-bind:key="scene.id" v-for="scene in book.scenes.rows">
                                    <div @click="changeComponent('scene-details',scene.id)" class="label"><span><img  src="@/assets/img/icons/scene.svg"> {{ scene.title }}</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    <div style="text-align:left; padding-left:330px;">
        <book-listing v-if="active.component == 'book-listing'"></book-listing>
        <chapter-listing v-if="active.component == 'chapter-listing'" :properties="active.data"></chapter-listing>
        <scene-listing v-if="active.component == 'scene-listing'" :properties="active.data"></scene-listing>
        <item-listing v-if="active.component == 'item-listing'" :properties="active.data"></item-listing>
        <location-listing v-if="active.component == 'location-listing'" :properties="active.data"></location-listing>
        <character-listing v-if="active.component == 'character-listing'" :properties="active.data"></character-listing>

        <book-details v-if="active.component == 'book-details'" :properties="active.data"></book-details>
        <chapter-details v-if="active.component == 'chapter-details'" :properties="active.data"></chapter-details>
        <scene-details v-if="active.component == 'scene-details'" :properties="active.data"></scene-details>
        <item-details v-if="active.component == 'item-details'" :properties="active.data"></item-details>
        <location-details v-if="active.component == 'location-details'" :properties="active.data"></location-details>
        <character-details v-if="active.component == 'character-details'" :properties="active.data"></character-details>

        <book-form v-if="active.component == 'book-form'" :properties="active.data"></book-form>
        <location-form v-if="active.component == 'location-form'" :properties="active.data"></location-form>
    </div>
</div>
</template>

<script>
import BookListing from '@/components/book-listing'
import ChapterListing from '@/components/chapter-listing'
import SceneListing from '@/components/scene-listing'
import ItemListing from '@/components/item-listing'
import CharacterListing from '@/components/character-listing'
import LocationListing from '@/components/location-listing'

import BookDetails from '@/components/book'
import ChapterDetails from '@/components/chapter'
import SceneDetails from '@/components/scene'
import ItemDetails from '@/components/item'
import CharacterDetails from '@/components/character'
import LocationDetails from '@/components/location'

import BookForm from '@/components/book-form'
import LocationForm from '@/components/location-form'
const electron = window.require('electron')

const remote = electron.remote

const loginInfo = remote.getGlobal('loginInfo')

export default {
  name: 'Main',
  data: function () {
    return {
      books: [],
      active: {
        id: 0,
        data: null,
        component: 'book-listing'
      }
    }
  },
  components: {
    'book-listing': BookListing,
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
    'location-form': LocationForm
  },
  methods: {
    changeComponent: function (component, data) {
      var scope = this
      scope.$delete(scope.active, 'data')
      scope.$set(scope.active, 'data', data)
      scope.active.component = ''
      scope.active.component = component
    },
    getBooks: function () {
      var scope = this
      // eslint-disable-next-line camelcase
      var userID = this.$store.getters.getUserID

      scope.axios
        .get('http://localhost:3000/users/' + userID + '/books')
        .then(response => {
          scope.books = response.data
        })
      // scope.books = response
    },
    showChildren: function (book) {
      var scope = this
      if (book.is_open !== true) {
        scope.$set(book, 'is_open', true)
        scope.$set(book, 'chapters', { is_open: false, rows: [] })
        scope.$set(book, 'characters', { is_open: false, rows: [] })
        scope.$set(book, 'items', { is_open: false, rows: [] })
        scope.$set(book, 'locations', { is_open: false, rows: [] })
        scope.$set(book, 'scenes', { is_open: false, rows: [] })
      } else {
        scope.$set(book, 'is_open', false)
        scope.$set(book, 'chapters', { is_open: false, rows: [] })
        scope.$set(book, 'characters', { is_open: false, rows: [] })
        scope.$set(book, 'items', { is_open: false, rows: [] })
        scope.$set(book, 'locations', { is_open: false, rows: [] })
        scope.$set(book, 'scenes', { is_open: false, rows: [] })
      }
      scope.changeComponent('book-details', book)
    },
    getChapters: function (book) {
      var scope = this
      if (book.chapters.is_open !== true) {
        book.chapters.is_open = true
        scope.axios
          .get('http://localhost:3000/books/' + book.id + '/chapters')
          .then(response => {
            book.chapters.rows = response.data
          })
      } else {
        book.chapters.is_open = false
      }
      scope.changeComponent('chapter-listing', book)
    },
    getItems: function (book) {
      var scope = this
      if (book.items.is_open !== true) {
        book.items.is_open = true
        scope.axios
          .get('http://localhost:3000/books/' + book.id + '/items')
          .then(response => {
            book.items.rows = response.data
          })
      } else {
        book.items.is_open = false
      }
      scope.changeComponent('item-listing', book)
    },
    getCharacters: function (book) {
      var scope = this
      if (book.characters.is_open !== true) {
        book.characters.is_open = true
        scope.axios
          .get('http://localhost:3000/books/' + book.id + '/characters')
          .then(response => {
            book.characters.rows = response.data
          })
      } else {
        book.characters.is_open = false
      }
      scope.changeComponent('character-listing', book)
    },
    getLocations: function (book) {
      var scope = this
      if (book.locations.is_open !== true) {
        book.locations.is_open = true
        scope.axios
          .get('http://localhost:3000/books/' + book.id + '/locations')
          .then(response => {
            book.locations.rows = response.data
          })
      } else {
        book.locations.is_open = false
      }
      scope.changeComponent('location-listing', book)
    },
    getScenes: function (book) {
      var scope = this
      if (book.scenes.is_open !== true) {
        book.scenes.is_open = true
        scope.axios
          .get('http://localhost:3000/books/' + book.id + '/scenes/other')
          .then(response => {
            book.scenes.rows = response.data
          })
      } else {
        book.scenes.is_open = false
      }
      scope.changeComponent('scene-listing', book)
    },
    getSceneByChapter: function (chapter) {
      var scope = this
      if (chapter.is_open !== true) {
        scope.$set(chapter, 'is_open', true)
        scope.$set(chapter, 'scenes', { is_open: false, rows: [] })
        scope.axios
          .get('http://localhost:3000/chapters/' + chapter.id + '/scenes')
          .then(response => {
            chapter.scenes.rows = response.data
          })

        chapter.scenes.is_open = true
      } else {
        chapter.is_open = false
        chapter.scenes.is_open = false
      }
      scope.changeComponent('chapter-details', chapter)
    }
  },
  beforeMount () {
    this.$store.commit('authenticate', {
      user: loginInfo.data.user,
      author: loginInfo.data.author
    })
  },
  mounted () {
    var scope = this
    scope.getBooks()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul { margin-left:0px; list-style:none;  }

.left-side-bar { position:fixed; top:0px; left:0px; background:#293742; width:320px; height:100vh; overflow-y:auto; }

.left-side-bar .header { text-align:center; height:70px; line-height:70px; border-bottom:1px solid #3c505f; padding:0px 10px; }
.left-side-bar .header img { height:60px; }

.left-side-bar .search-box { height:40px; line-height:40px; border-bottom:1px solid #3c505f; padding:0px 5px; position:relative; }
.left-side-bar .search-box .icon { position:absolute; top:8px; right:8px; color:#506d84; font-size:25px; }
.left-side-bar .search-box input { background:#324553; width:100%; height:30px; border:none; color:#fff; padding:0px 5px; padding-right:35px;  }
.left-side-bar .search-box input:focus, .search-box input:active{ background:#324553; }
.left-side-bar .search-box input::placeholder { color: #506d84; }

.new-book { font-family: 'Crimson Roman'; color:#abc4d7; font-size: 14px; cursor: pointer }
.new-book:hover  { color:#fff; }

.es-tree-view { padding:10px 5px; }
.es-tree-view ul { padding-left:10px; text-align: left; }
.es-tree-view ul:not(:first-child) { padding-left:30px; }
.es-tree-view ul li  { padding-top:10px; cursor:pointer; }
.es-tree-view ul li  img { height:14px; }
.es-tree-view ul li .label { font-family:'Crimson Roman'; color:#abc4d7; font-size:18px; }
.es-tree-view ul li .label span i { padding-right:5px; }
.es-tree-view ul li .label:hover { color:#fff; }

.es-tree-view ul.level-1 > li > .label { text-decoration:none; }

.es-tree-view ul.level-1 > li > ul  { position:relative;  }
.es-tree-view ul.level-1 > li > ul:after { height:100%; width:1px; content:''; border-left:1px #abc4d7 dotted ; position:absolute; top:0px; left:12px; }

.es-tree-view ul.level-2 > li  { position:relative;  }
.es-tree-view ul.level-2 > li:after  { content:''; position:absolute; top:18px; left:-10px; width:12px; height:1px; border-bottom:1px #abc4d7 dotted;  }

.es-tree-view ul.level-2 > li ul { position:relative;  }
.es-tree-view ul.level-2 > li ul:after { height:100%; width:1px; content:''; border-left:1px #abc4d7 dotted ; position:absolute; top:0px; left:12px; }

.es-tree-view ul.level-3 > li  { position:relative;  }
.es-tree-view ul.level-3 > li:after  { content:''; position:absolute; top:18px; left:-10px; width:12px; height:1px; border-bottom:1px #abc4d7 dotted;  }

.es-tree-view ul.level-3 > li ul { position:relative;  }
.es-tree-view ul.level-3 > li ul:after { height:100%; width:1px; content:''; border-left:1px #abc4d7 dotted ; position:absolute; top:0px; left:9px; }

.es-tree-view ul.level-4 > li  { position:relative;  }
.es-tree-view ul.level-4 > li:after  { content:''; position:absolute; top:18px; left:-10px; width:12px; height:1px; border-bottom:1px #abc4d7 dotted;  }

.es-tree-view ul.level-4 > li ul { position:relative;  }
.es-tree-view ul.level-4 > li ul:after { height:100%; width:1px; content:''; border-left:1px #abc4d7 dotted ; position:absolute; top:0px; left:12px; }

.es-tree-view .level-1 li ul, .es-tree-view .level-1 li > ul > li { display:none; }
.es-tree-view .level-1 li.open ul, .es-tree-view .level-1 li.open > ul > li{ display:block; }

.es-tree-view .level-2 li ul, .es-tree-view .level-2 li > ul > li { display:none; }
.es-tree-view .level-2 li.open ul, .es-tree-view .level-2 li.open > ul > li{ display:block; }

.es-tree-view .level-3 li ul, .es-tree-view .level-3 li > ul > li { display:none; }
.es-tree-view .level-3 li.open ul, .es-tree-view .level-3 li.open > ul > li{ display:block; }
</style>
