import Vue from 'vue'
import axios from 'axios'

export default {
  strict: true,
  state: {
    books: [],
    chapters: {},
    items: {},
    characters: {},
    locations: {},
    scenes: {}
  },
  getters: {
    getBooks: state => {
      return state.books
    },
    getChaptersByBook: state => (bookUUID) => {
      if (state.chapters.hasOwnProperty(bookUUID)) {
        return state.chapters[bookUUID].rows
      }
      return []
    },
    getItemsByBook: state => (bookUUID) => {
      if (state.items.hasOwnProperty(bookUUID)) {
        return state.items[bookUUID].rows
      }
      return []
    },
    getLocationsByBook: state => (bookUUID) => {
      if (state.locations.hasOwnProperty(bookUUID)) {
        return state.locations[bookUUID].rows
      }
      return []
    },
    getCharactersByBook: state => (bookUUID) => {
      if (state.characters.hasOwnProperty(bookUUID)) {
        return state.characters[bookUUID].rows
      }
      return []
    },
    getScenesByBook: state => (bookUUID) => {
      if (state.scenes.hasOwnProperty(bookUUID)) {
        return state.scenes[bookUUID].rows
      }
      return []
    }
  },
  mutations: {
    toggleTree (state, payload) {
      let index = payload.index
      var isOpen = false
      if (payload.model === 'books') {
        isOpen = !((typeof state.books[index].is_open !== 'undefined' && state.books[index].is_open))

        Vue.set(state.books[index], 'is_open', isOpen)
        Vue.set(state.books[index], 'chapter_folder', { is_open: false })
        Vue.set(state.books[index], 'character_folder', { is_open: false })
        Vue.set(state.books[index], 'item_folder', { is_open: false })
        Vue.set(state.books[index], 'location_folder', { is_open: false })
        Vue.set(state.books[index], 'scene_folder', { is_open: false, rows: [] })
      } else if (payload.model === 'chapters') {
        let bookID = state.books[index].uuid
        // check if the folder is open for toggling
        isOpen = !(state.books[index].chapter_folder.is_open)
        state.books[index].chapter_folder.is_open = isOpen

        if (state.books[index].chapter_folder.is_open) {
          // add new object  to chapters object
          Vue.set(state.chapters, bookID, { is_open: false, rows: [] })

          axios
            .get('http://localhost:3000/books/' + bookID + '/chapters')
            .then(response => {
              console.log('aaaa')
              console.log(response)
              state.chapters[bookID] = { rows: response.data }
              console.log(state.chapters)
            })
        }
      } else if (payload.model === 'items') {
        let bookID = state.books[index].uuid
        // check if the folder is open for toggling
        isOpen = !(state.books[index].item_folder.is_open)
        state.books[index].item_folder.is_open = isOpen

        // add new object to items object
        Vue.set(state.items, bookID, { is_open: false, rows: [] })

        axios
          .get('http://localhost:3000/books/' + bookID + '/items')
          .then(response => {
            state.items[bookID] = { rows: response.data }
          })
      } else if (payload.model === 'locations') {
        let bookID = state.books[index].uuid
        // check if the folder is open for toggling
        isOpen = !(state.books[index].location_folder.is_open)
        state.books[index].location_folder.is_open = isOpen

        // add new object to locations object
        Vue.set(state.locations, bookID, { is_open: false, rows: [] })

        axios
          .get('http://localhost:3000/books/' + bookID + '/locations')
          .then(response => {
            state.locations[bookID] = { rows: response.data }
          })
      } else if (payload.model === 'characters') {
        let bookID = state.books[index].uuid
        // check if the folder is open for toggling
        isOpen = !(state.books[index].character_folder.is_open)
        state.books[index].character_folder.is_open = isOpen

        // add new object to characters object
        Vue.set(state.characters, bookID, { is_open: false, rows: [] })

        axios
          .get('http://localhost:3000/books/' + bookID + '/characters')
          .then(response => {
            state.characters[bookID] = { rows: response.data }
          })
      } else if (payload.model === 'scenes') {
        let bookID = state.books[index].uuid
        // check if the folder is open for toggling
        isOpen = !(state.books[index].scene_folder.is_open)
        state.books[index].scene_folder.is_open = isOpen

        // add new object to characters object
        Vue.set(state.scenes, bookID, { is_open: false, rows: [] })

        axios
          .get('http://localhost:3000/books/' + bookID + '/scenes/other')
          .then(response => {
            console.log('test')
            console.log(response.data)
            state.scenes[bookID] = { rows: response.data }
          })
      }
    },
    addToList (state, payload) {
      if (payload.model === 'books') {

      } else if (payload.model === 'chapters') {
        let bookID = payload.data.book_id
        state.chapters[bookID].rows.push(payload.data)
      } else if (payload.model === 'items') {
        let bookID = payload.data.book_id
        state.items[bookID].rows.push(payload.data)
      } else if (payload.model === 'locations') {
        let bookID = payload.data.book_id
        state.locations[bookID].rows.push(payload.data)
      } else if (payload.model === 'characters') {
        let bookID = payload.data.book_id
        state.characters[bookID].rows.push(payload.data)
      } else if (payload.model === 'scenes') {
        let bookID = payload.data.book_id
        state.scenes[bookID].rows.push(payload.data)
      }
    },
    updateFromList (state, payload) {
      if (payload.model === 'books') {

      } else if (payload.model === 'chapters') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.chapters[payload.data.book_id].rows.length - 1); i++) {
          if (state.chapters[bookID].rows[i].uuid === payload.data.uuid) {
            Vue.set(state.chapters[bookID].rows, i, payload.data)
          }
        }
      } else if (payload.model === 'items') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.items[payload.data.book_id].rows.length - 1); i++) {
          if (state.items[bookID].rows[i].uuid === payload.data.uuid) {
            Vue.set(state.items[bookID].rows, i, payload.data)
          }
        }
      } else if (payload.model === 'locations') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.locations[payload.data.book_id].rows.length - 1); i++) {
          if (state.locations[bookID].rows[i].uuid === payload.data.uuid) {
            Vue.set(state.locations[bookID].rows, i, payload.data)
          }
        }
      } else if (payload.model === 'characters') {
        let bookID = payload.data.book_id
        for (var i = 0; i <= (state.characters[payload.data.book_id].rows.length - 1); i++) {
          if (state.characters[bookID].rows[i].uuid === payload.data.uuid) {
            Vue.set(state.characters[bookID].rows, i, payload.data)
          }
        }
      } else if (payload.model === 'scenes') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.scenes[payload.data.book_id].rows.length - 1); i++) {
          if (state.scenes[bookID].rows[i].uuid === payload.data.uuid) {
            Vue.set(state.scenes[bookID].rows, i, payload.data)
          }
        }
      }
    },
    removeFromList (state, payload) {
      if (payload.model === 'books') {

      } else if (payload.model === 'chapters') {
        let bookID = payload.data.book_id
        for (var i = 0; i <= (state.chapters[payload.data.book_id].rows.length - 1); i++) {
          if (state.chapters[bookID].rows[i].uuid === payload.data.uuid) {
            state.chapters[payload.data.book_id].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'items') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.items[payload.data.book_id].rows.length - 1); i++) {
          if (state.items[bookID].rows[i].uuid === payload.data.uuid) {
            state.items[payload.data.book_id].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'locations') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.locations[payload.data.book_id].rows.length - 1); i++) {
          if (state.locations[bookID].rows[i].uuid === payload.data.uuid) {
            state.locations[payload.data.book_id].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'characters') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.characters[payload.data.book_id].rows.length - 1); i++) {
          if (state.characters[bookID].rows[i].uuid === payload.data.uuid) {
            state.characters[payload.data.book_id].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'scenes') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.scenes[payload.data.book_id].rows.length - 1); i++) {
          if (state.scenes[bookID].rows[i].uuid === payload.data.uuid) {
            state.scenes[payload.data.book_id].rows.splice(i, 1)
          }
        }
      }
    },
    mutateBook (state, payload) {
      var userID = payload
      axios
        .get('http://localhost:3000/users/' + userID + '/books')
        .then(response => {
          state.books = response.data
        })
    },
    mutateChapter (state, payload) {
      var bookID = payload
      console.log(bookID)
      console.log(state.chapters[bookID])
      state.chapters[bookID].rows.push({title: 'traaayydooorrr'})

      console.log(state.chapters[bookID])
      /*
        axios
          .get('http://localhost:3000/books/' + bookID + '/chapters')
          .then(response => {
            state.books = response.data
          })
        */
    },
    mutateCharacter (state, payload) {
      state.character.data = payload.character
    },
    mutateItem (state, payload) {
      state.item.data = payload.item
    },
    mutateLocation (state, payload) {
      state.location.data = payload.location
    },
    mutateScene (state, payload) {
      state.scene.data = payload.scene
    }
  },
  actions: {
    toggleTree ({ commit, state }, payload) {
      commit('toggleTree', payload)
    },
    addToList ({ commit, state }, payload) {
      commit('addToList', payload)
    },
    updateFromList ({ commit, state }, payload) {
      commit('updateFromList', payload)
    },
    removeFromList ({ commit, state }, payload) {
      commit('removeFromList', payload)
    },
    getBooksByAuthorID ({ commit, state }, payload) {
      commit('mutateBook', payload)
    }
  }
}
