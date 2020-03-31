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
                                    Chapters
                                </span>
                            </div>
                            <ul class="level-3">
                                <li v-bind:class="{ 'open' : chapter.is_open  == true }" v-bind:key="chapter.id" v-for="chapter in GET_CHAPTERS_BY_BOOK(book.uuid)">
                                    <div @click="CHANGE_COMPONENT('chapter-details', { book_id: book.uuid, chapter: chapter }, chapter.title);toggle(chapter);LOAD_LIST('chapter-scenes',chapter);" class="label"><span><img  src="@/assets/img/icons/chapter.svg"> {{ chapter.title }}</span></div>
                                    <ul v-if="chapter.is_open  == true " class="level-4">
                                        <li v-bind:key="scene.id" v-for="scene in GET_SCENES_BY_CHAPTER(chapter.uuid)">
                                            <div @click="CHANGE_COMPONENT('scene-details',{ book_id: book.uuid, scene: scene}, scene.title )" class="label"><span><img  src="@/assets/img/icons/scene.svg"> {{ scene.title || 'Untitled' }}</span></div>
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
                                    <div @click="CHANGE_COMPONENT('item-details', {  book_id: book.uuid, item: item }, item.itemname, true)" class="label"><span><img  src="@/assets/img/icons/item.svg"> {{ item.itemname || 'Untitled' }}</span></div>
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
                                    <div @click="CHANGE_COMPONENT('character-details', {  book_id: book.uuid, character: character }, character.fullname)" class="label"><span><img  src="@/assets/img/icons/character.svg"> {{ character.fullname || 'Unamed' }}</span></div>
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
                                    <div @click="CHANGE_COMPONENT('location-details', {  book_id: book.uuid, location: location }, location.location, true)" class="label"><span><img  src="@/assets/img/icons/location.svg"> {{ location.location || 'Untitled' }}</span></div>
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
                                    <div @click="changeComponent('scene-details',{ scene: scene }, scene.title)" class="label"><span><img  src="@/assets/img/icons/scene.svg"> {{ scene.title || 'Untitled' }}</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
// In renderer process (web page).
export default {
  name: 'MainSideNavigation',
  data () {
    return {
      // chapters: [],
      scenes: [],
      items: [],
      locations: [],
      other_scenes: []
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
    toggleTree: function (model, index, data) {
      var scope = this
      scope.$store.dispatch('toggleTree', { model: model, index: index })

      if (model === 'book') {
        scope.changeComponent('book-details', data, 'aaaaa')
      } else if (model === 'chapter') {
        scope.changeComponent('chapter-listing', data, 'Chapters - ' + data.title)
      } else if (model === 'item') {
        scope.changeComponent('item-listing', data, 'Items - ' + data.title)
      } else if (model === 'location') {
        scope.changeComponent('location-listing', data, 'Location - ' + data.title)
      } else if (model === 'character') {
        scope.changeComponent('character-listing', data, 'Character - ' + data.title)
      } else if (model === 'scene') {
        scope.changeComponent('scene-listing', data, 'Scenes - ' + data.title)
      }
    },
    toggle: function (data) {
      var scope = this
      var isOpen = !((typeof data.is_open !== 'undefined' && data.is_open))
      scope.$set(data, 'is_open', isOpen)
    },
    showChildren: function (book) {
      var scope = this
      if (book.is_open !== true) {
        // scope.$set(book, 'is_open', true)
        // scope.$set(book, 'chapters', { is_open: false, rows: [] })
        // scope.$set(book, 'characters', { is_open: false, rows: [] })
        // scope.$set(book, 'items', { is_open: false, rows: [] })
        // scope.$set(book, 'locations', { is_open: false, rows: [] })
        // scope.$set(book, 'scenes', { is_open: false, rows: [] })
      } else {
        // scope.$set(book, 'is_open', false)
        // scope.$set(book, 'chapters', { is_open: false, rows: [] })
        // scope.$set(book, 'characters', { is_open: false, rows: [] })
        // scope.$set(book, 'items', { is_open: false, rows: [] })
        // scope.$set(book, 'locations', { is_open: false, rows: [] })
        // scope.$set(book, 'scenes', { is_open: false, rows: [] })
      }
      scope.changeComponent('book-details', book, book.title)
    },
    getChapters: function (book) {
      var scope = this
      if (book.chapters.is_open !== true) {
        book.chapters.is_open = true
        scope.axios
          .get('http://localhost:3000/books/' + book.uuid + '/chapters')
          .then(response => {
            book.chapters.rows = response.data
          })
      } else {
        book.chapters.is_open = false
      }
      scope.changeComponent('chapter-listing', book, 'Chapters | ' + book.title)
    },
    getItems: function (book) {
      var scope = this
      if (book.items.is_open !== true) {
        book.items.is_open = true
        scope.axios
          .get('http://localhost:3000/books/' + book.uuid + '/items')
          .then(response => {
            book.items.rows = response.data
          })
      } else {
        book.items.is_open = false
      }
      scope.changeComponent('item-listing', book, 'Items | ' + book.title)
    },
    getCharacters: function (book) {
      var scope = this
      if (book.characters.is_open !== true) {
        book.characters.is_open = true
        scope.axios
          .get('http://localhost:3000/books/' + book.uuid + '/characters')
          .then(response => {
            book.characters.rows = response.data
          })
      } else {
        book.characters.is_open = false
      }
      scope.changeComponent('character-listing', book, 'Characters | ' + book.title)
    },
    getLocations: function (book) {
      var scope = this
      if (book.locations.is_open !== true) {
        book.locations.is_open = true
        scope.axios
          .get('http://localhost:3000/books/' + book.uuid + '/locations')
          .then(response => {
            book.locations.rows = response.data
          })
      } else {
        book.locations.is_open = false
      }
      scope.changeComponent('location-listing', book, 'Locations | ' + book.title)
    },
    getScenes: function (book) {
      var scope = this
      if (book.scenes.is_open !== true) {
        book.scenes.is_open = true
        scope.axios
          .get('http://localhost:3000/books/' + book.uuid + '/scenes/other')
          .then(response => {
            book.scenes.rows = response.data
          })
      } else {
        book.scenes.is_open = false
      }
      scope.changeComponent('scene-listing', book, 'Scenes | ' + book.title)
    },
    getSceneByChapter: function (chapter) {
      var scope = this
      if (chapter.is_open !== true) {
        scope.$set(chapter, 'is_open', true)
        scope.$set(chapter, 'scenes', { is_open: false, rows: [] })
        scope.axios
          .get('http://localhost:3000/chapters/' + chapter.uuid + '/scenes')
          .then(response => {
            chapter.scenes.rows = response.data
          })

        chapter.scenes.is_open = true
      } else {
        chapter.is_open = false
        chapter.scenes.is_open = false
      }
      // scope.changeComponent('chapter-details', chapter, 'Scenes | ' + chapter.title)
    }
  },
  mounted () {
    // var scope = this
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.new-book { font-family: 'Crimson Roman'; color:#abc4d7; font-size: 14px; cursor: pointer }
.new-book:hover  { color:#fff; }
</style>
