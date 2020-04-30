import Vue from 'vue'
import axios from 'axios'

export default {
  strict: true,
  state: {
    books: {}
  },
  getters: {
    getBooksByAuthor: state => (authorUUID) => {
      if (state.books.hasOwnProperty(authorUUID)) {
        return state.books[authorUUID].rows
      }
      return []
    },
    isBookChaptersFolderOpen: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i].is_chapters_folder_open
          }
        }
      }
      return false
    },
    isBookCharactersFolderOpen: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i].is_characters_folder_open
          }
        }
      }
      return false
    },
    isBookItemsFolderOpen: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i].is_items_folder_open
          }
        }
      }
      return false
    },
    isBookLocationsFolderOpen: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i].is_locations_folder_open
          }
        }
      }
      return false
    },
    isBookScenesFolderOpen: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i].is_scenes_folder_open
          }
        }
      }
      return false
    },
    findBook: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i]
          }
        }
      }
      return null
    }
  },
  mutations: {
    loadBooksByAuthor (state, payload) {
      var userUUID = payload.userUUID // this is for requesting purposes
      var authorUUID = payload.authorUUID

      Vue.set(state.books, authorUUID, { rows: [] })
      axios
        .get('http://localhost:3000/users/' + userUUID + '/books')
        .then(response => {
          state.books[authorUUID].rows = response.data
          for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
            Vue.set(state.books[authorUUID].rows[i], 'is_open', false)
            Vue.set(state.books[authorUUID].rows[i], 'is_chapters_folder_open', false)
            Vue.set(state.books[authorUUID].rows[i], 'is_items_folder_open', false)
            Vue.set(state.books[authorUUID].rows[i], 'is_locations_folder_open', false)
            Vue.set(state.books[authorUUID].rows[i], 'is_characters_folder_open', false)
            Vue.set(state.books[authorUUID].rows[i], 'is_scenes_folder_open', false)
          }
        })
    },
    toggleBook (state, payload) {
      let book = payload.data
      let model = payload.model

      for (let i = 0; i < state.books[book.author_id].rows.length; i++) {
        let pointed = state.books[book.author_id].rows[i]
        if (book.uuid === pointed.uuid && model === 'book') {
          let isOpen = state.books[book.author_id].rows[i].is_open
          Vue.set(state.books[book.author_id].rows[i], 'is_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'chapters') {
          let isOpen = state.books[book.author_id].rows[i].is_chapters_folder_open
          Vue.set(state.books[book.author_id].rows[i], 'is_chapters_folder_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'items') {
          let isOpen = state.books[book.author_id].rows[i].is_items_folder_open
          Vue.set(state.books[book.author_id].rows[i], 'is_items_folder_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'locations') {
          let isOpen = state.books[book.author_id].rows[i].is_locations_folder_open
          Vue.set(state.books[book.author_id].rows[i], 'is_locations_folder_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'characters') {
          let isOpen = state.books[book.author_id].rows[i].is_characters_folder_open
          Vue.set(state.books[book.author_id].rows[i], 'is_characters_folder_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'scenes') {
          let isOpen = state.books[book.author_id].rows[i].is_scenes_folder_open
          Vue.set(state.books[book.author_id].rows[i], 'is_scenes_folder_open', !isOpen)
          break
        }
      }
    },
    updateBookList (state, payload) {
      let authorUUID = payload.author_id
      if (!state.books.hasOwnProperty(authorUUID) || state.books[authorUUID].rows.length < 1) {
        console.log('ADDED AUTHOR!')
        Vue.set(state.books, authorUUID, { rows: [] })
        // add row
        state.books[authorUUID].rows.push({})
        Vue.set(state.books[authorUUID].rows, 0, payload)
        Vue.set(state.books[authorUUID].rows[0], 'is_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_chapters_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_items_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_locations_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_characters_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_scenes_folder_open', false)
        return
      }

      for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
        let current = state.books[authorUUID].rows[i]
        if (current.uuid === payload.uuid) {
          /*
            let isOpen = current.is_open
            let isChaptersFolderOpen = current.is_chapters_folder_open
            let isItemsFolderOpen = current.is_items_folder_open
            let isLocationsFolderOpen = current.is_locations_folder_open
            let isCharactersFolderOpen = current.is_characters_folder_open
            let isScenesFolderOpen = current.is_scenes_folder_open
            */
          state.books[authorUUID].rows[i] = payload
          /*
            state.books[authorUUID].rows[i].is_open = isOpen
            state.books[authorUUID].rows[i].is_chapters_folder_open = isChaptersFolderOpen
            Vue.set(state.books[authorUUID].rows[i], 'is_items_folder_open', isItemsFolderOpen)
            Vue.set(state.books[authorUUID].rows[i], 'is_locations_folder_open', isLocationsFolderOpen)
            Vue.set(state.books[authorUUID].rows[i], 'is_characters_folder_open', isCharactersFolderOpen)
            Vue.set(state.books[authorUUID].rows[i], 'is_scenes_folder_open', isScenesFolderOpen)
            */
          break
        } else if (i === (state.books[authorUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of chapters under book
          let count = state.books[authorUUID].rows.length
          state.books[authorUUID].rows.push({})
          Vue.set(state.books[authorUUID].rows, count, payload)
          Vue.set(state.books[authorUUID].rows[count], 'is_open', false)
          Vue.set(state.books[authorUUID].rows[count], 'is_chapters_folder_open', false)
          Vue.set(state.books[authorUUID].rows[count], 'is_items_folder_open', false)
          Vue.set(state.books[authorUUID].rows[count], 'is_locations_folder_open', false)
          Vue.set(state.books[authorUUID].rows[count], 'is_characters_folder_open', false)
          Vue.set(state.books[authorUUID].rows[count], 'is_scenes_folder_open', false)
        }
      }
    },
    updateBookList2 (state, payload) {
      let authorUUID = payload.author_id
      if (!state.books[authorUUID]) {
        Vue.set(state.books, authorUUID, { rows: [] })
        // add row
        state.books[authorUUID].rows.push({})
        Vue.set(state.books[authorUUID].rows, 0, payload)
        Vue.set(state.books[authorUUID].rows[0], 'is_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_chapters_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_items_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_locations_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_characters_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_scenes_folder_open', false)
        return
      }

      for (let i = 0; i <= (state.books[authorUUID].rows.length - 1); i++) {
        let current = state.books[authorUUID].rows[i]
        if (current.uuid === payload.uuid) {
          let isOpen = current.is_open
          let isChaptersFolderOpen = current.is_chapters_folder_open
          let isItemsFolderOpen = current.is_items_folder_open
          let isLocationsFolderOpen = current.is_locations_folder_open
          let isCharactersFolderOpen = current.is_characters_folder_open
          let isScenesFolderOpen = current.is_scenes_folder_ope
          Vue.set(state.books[authorUUID].rows, i, payload)
          Vue.set(state.books[authorUUID].rows[i], 'is_open', isOpen)
          Vue.set(state.books[authorUUID].rows[i], 'is_chapters_folder_open', isChaptersFolderOpen)
          Vue.set(state.books[authorUUID].rows[i], 'is_items_folder_open', isItemsFolderOpen)
          Vue.set(state.books[authorUUID].rows[i], 'is_locations_folder_open', isLocationsFolderOpen)
          Vue.set(state.books[authorUUID].rows[i], 'is_characters_folder_open', isCharactersFolderOpen)
          Vue.set(state.books[authorUUID].rows[i], 'is_scenes_folder_open', isScenesFolderOpen)

          break
        } else if (i === (state.books[authorUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of books under book
          let count = state.books[authorUUID].rows.length
          state.books[authorUUID].rows.push({})
          Vue.set(state.books[authorUUID].rows, count, payload)
        }
      }
    },
    removeBookFromList (state, payload) {
      let authorUUID = payload.author_id
      for (var i = 0; i <= (state.books[authorUUID].rows.length - 1); i++) {
        if (state.books[authorUUID].rows[i].uuid === payload.uuid) {
          state.books[authorUUID].rows.splice(i, 1)
        }
      }
    }
  },
  actions: {
    loadBooksByAuthor ({ commit, state }, payload) {
      commit('loadBooksByAuthor', payload)
    },
    updateBookList ({ commit, state }, payload) {
      commit('updateBookList', payload)
    },
    removeBookFromList ({ commit, state }, payload) {
      commit('removeBookFromList', payload)
    },
    toggleBook ({ commit, state }, payload) {
      commit('toggleBook', payload)
    }
  }
}