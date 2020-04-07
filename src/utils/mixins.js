// Mixins are a flexible way to distribute reusable functionalities for Vue components.
export default {
  name: 'mixins',
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    UNIQUE: function () {
      let key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // eslint-disable-next-line one-var
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
      return key
    },
    CHANGE_COMPONENT: function (tabComponent, tabData = null, tabTitle = 'New Tab', newTab = false, tabIndex = 0) {
      var scope = this
      if (newTab) {
        scope.$store.dispatch('newTab', { title: tabTitle, component: tabComponent, data: tabData })
      } else {
        scope.$store.dispatch('changeTabContent', { title: tabTitle, component: tabComponent, data: tabData, index: tabIndex })
      }
    },
    TOGGLE_TREE: function (model, index, isOpen, data) {
      var scope = this
      scope.$store.dispatch('toggleTree', { model: model, index: index })

      // only change componenent when opening
      if (!isOpen) {
        if (model === 'books') {
          scope.CHANGE_COMPONENT('book-details', data, data.title)
        } else if (model === 'chapters') {
          scope.CHANGE_COMPONENT('chapter-listing', data, 'Chapters - ' + data.title)
        } else if (model === 'items') {
          scope.CHANGE_COMPONENT('item-listing', data, 'Items - ' + data.title)
        } else if (model === 'locations') {
          scope.CHANGE_COMPONENT('location-listing', data, 'Location - ' + data.title)
        } else if (model === 'characters') {
          scope.CHANGE_COMPONENT('character-listing', data, 'Character - ' + data.title)
        } else if (model === 'scenes') {
          scope.CHANGE_COMPONENT('scene-listing', data, 'Scenes - ' + data.title)
        }
      }
    },
    CHANGE_TAB: function (index) {
      var scope = this
      scope.$store.dispatch('changeTab', index)
    },
    REMOVE_TAB: function (index) {
      var scope = this
      scope.$store.dispatch('removeTab', index)
    },
    GET_BOOKS_BY_AUTHOR: function (uuid = '') {
      return this.$store.getters.getBooks
    },
    GET_CHAPTERS_BY_BOOK: function (uuid = '') {
      return this.$store.getters.getChaptersByBook(uuid)
    },
    GET_ITEMS_BY_BOOK: function (uuid = '') {
      return this.$store.getters.getItemsByBook(uuid)
    },
    GET_LOCATIONS_BY_BOOK: function (uuid = '') {
      return this.$store.getters.getLocationsByBook(uuid)
    },
    GET_CHARACTERS_BY_BOOK: function (uuid = '') {
      return this.$store.getters.getCharactersByBook(uuid)
    },
    GET_SCENES_BY_BOOK: function (uuid = '') {
      return this.$store.getters.getScenesByBook(uuid)
    },
    GET_SCENES_BY_CHAPTER: function (uuid = '') {
      return this.$store.getters.getScenesByChapter(uuid)
    },
    GET_CHAPTER_VERSIONS_BY_CHAPTER: function (uuid = '') {
      return this.$store.getters.getChapterVersions(uuid)
    },
    GET_SCENE_VERSIONS_BY_SCENE: function (uuid = '') {
      return this.$store.getters.getSceneVersions(uuid)
    },
    GET_SCENE_LOCATIONS_BY_SCENE: function (uuid = '') {
      return this.$store.getters.getSceneLocations(uuid)
    },
    GET_SCENE_ITEMS_BY_SCENE: function (uuid = '') {
      return this.$store.getters.getSceneItems(uuid)
    },
    GET_SCENE_CHARACTERS_BY_SCENE: function (uuid = '') {
      return this.$store.getters.getSceneCharacters(uuid)
    },
    LOAD_LIST: function (model = '', data) {
      var scope = this
      scope.$store.dispatch('loadList', {model: model, data: data})
    },
    ADD_TO_LIST: function (model = '', data) {
      var scope = this
      scope.$store.dispatch('addToList', {model: model, data: data})
    },
    UPDATE_FROM_LIST: function (model = '', data) {
      var scope = this
      scope.$store.dispatch('updateFromList', {model: model, data: data})
    },
    DELETE_FROM_LIST: function (model = '', data) {
      var scope = this

      window.swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          scope.axios
            .delete('http://localhost:3000/' + model + '/' + data.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'A record successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeFromList', {model: model, data: data})
                })
              }
            })
        }
      })
    }
  }
}
