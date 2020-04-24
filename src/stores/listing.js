import Vue from 'vue'
import axios from 'axios'

export default {
  strict: true,
  state: {
    // books: [],
    // items: {},
    // characters: {},
    // locations: {},
    // scenes: {},
    // scene_versions: { rows: [] },
    // scene_locations: { rows: [] },
    // scene_items: { rows: [] },
    // scene_characters: { rows: [] }
  },
  getters: {
    getBooks: state => {
      return state.books
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
    loadList (state, payload) {
      if (payload.model === 'books') {
        let userID = payload.data.uuid
        axios
          .get('http://localhost:3000/users/' + userID + '/books')
          .then(response => {
            state.books = response.data
          })
      } else if (payload.model === 'chapters') {
        let bookID = payload.data.uuid
        Vue.set(state.items, bookID, { rows: [] })
        axios
          .get('http://localhost:3000/books/' + bookID + '/chapters')
          .then(response => {
            state.chapters[bookID] = { rows: response.data }
          })
      } else if (payload.model === 'items') {
        let bookID = payload.data.uuid
        Vue.set(state.items, bookID, { rows: [] })
        axios
          .get('http://localhost:3000/books/' + bookID + '/items')
          .then(response => {
            state.items[bookID] = { rows: response.data }
          })
      } else if (payload.model === 'locations') {
        let bookID = payload.data.uuid
        Vue.set(state.locations, bookID, { rows: [] })
        axios
          .get('http://localhost:3000/books/' + bookID + '/locations')
          .then(response => {
            state.locations[bookID] = { rows: response.data }
          })
      } else if (payload.model === 'characters') {
        let bookID = payload.data.uuid
        Vue.set(state.characters, bookID, { rows: [] })
        axios
          .get('http://localhost:3000/books/' + bookID + '/characters')
          .then(response => {
            state.characters[bookID] = { rows: response.data }
          })
      } else if (payload.model === 'scenes') {
        let bookID = payload.data.uuid
        Vue.set(state.scenes, bookID, { rows: [] })
        axios
          .get('http://localhost:3000/books/' + bookID + '/scenes')
          .then(response => {
            state.scenes[bookID] = { rows: response.data }
          })
      } else if (payload.model === 'chapter-scenes') {
        let chapterID = payload.data.uuid
        Vue.set(state.scenes, chapterID, { rows: [] })
        axios
          .get('http://localhost:3000/chapters/' + chapterID + '/scenes')
          .then(response => {
            state.scenes[chapterID] = { rows: response.data }
          })
      } else if (payload.model === 'chapter-versions') {
        let chapterID = payload.data.uuid
        Vue.set(state.chapter_versions, chapterID, { rows: [] })
        axios
          .get('http://localhost:3000/chapters/' + chapterID + '/versions')
          .then(response => {
            state.chapter_versions[chapterID] = { rows: response.data }
          })
      } else if (payload.model === 'scene-versions') {
        let sceneID = payload.data.uuid
        Vue.set(state.scene_versions, sceneID, { rows: [] })
        axios
          .get('http://localhost:3000/scenes/' + sceneID + '/versions')
          .then(response => {
            state.scene_versions[sceneID] = { rows: response.data }
          })
      } else if (payload.model === 'scene-locations') {
        let sceneID = payload.data.uuid
        Vue.set(state.scene_locations, sceneID, { rows: [] })
        axios
          .get('http://localhost:3000/scenes/' + sceneID + '/locations')
          .then(response => {
            state.scene_locations[sceneID] = { rows: response.data }
          })
      } else if (payload.model === 'scene-items') {
        let sceneID = payload.data.uuid
        Vue.set(state.scene_items, sceneID, { rows: [] })
        axios
          .get('http://localhost:3000/scenes/' + sceneID + '/items')
          .then(response => {
            state.scene_items[sceneID] = { rows: response.data }
            console.log('SCENE ITEMS: ')
            console.log(state.scene_items[sceneID])
          })
      } else if (payload.model === 'scene-characters') {
        let sceneID = payload.data.uuid
        Vue.set(state.scene_characters, sceneID, { rows: [] })
        axios
          .get('http://localhost:3000/scenes/' + sceneID + '/characters')
          .then(response => {
            state.scene_characters[sceneID] = { rows: response.data }
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
        // parent can be chapter or book (other scenes)
        let PARENT = (payload.data.chapter_id !== null) ? payload.data.chapter_id : payload.data.book_id
        state.scenes[PARENT].rows.push(payload.data)
      } else if (payload.model === 'chapter-versions') {
        let chapterID = payload.data.chapter_id
        state.chapter_versions[chapterID].rows.push(payload.data)
      } else if (payload.model === 'scene-locations') {
        let sceneID = payload.data.book_scene_id

        if (state.scene_locations[sceneID].rows === 'undefined' || state.scene_locations[sceneID].rows == null) {
          Vue.set(state.scene_locations, sceneID, { rows: [] })
        }

        state.scene_locations[sceneID].rows.push(payload.data)
      } else if (payload.model === 'scene-items') {
        let sceneID = payload.data.book_scene_id

        if (state.scene_items[sceneID] === 'undefined' || state.scene_items[sceneID] === null) {
          Vue.set(state.scene_items, sceneID, { rows: [] })
        }

        state.scene_items[sceneID].rows.push(payload.data)
      } else if (payload.model === 'scene-characters') {
        let sceneID = payload.data.book_scene_id

        if (state.scene_characters[sceneID].rows === 'undefined' || state.scene_characters[sceneID].rows == null) {
          Vue.set(state.scene_items, sceneID, { rows: [] })
        }

        state.scene_characters[sceneID].rows.push(payload.data)
      }
    },
    updateFromList (state, payload) {
      if (payload.model === 'books') {

      } else if (payload.model === 'chapters') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.chapters[bookID].rows.length - 1); i++) {
          if (state.chapters[bookID].rows[i].uuid === payload.data.uuid) {
            Vue.set(state.chapters[bookID].rows, i, payload.data)
          }
        }
      } else if (payload.model === 'items') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.items[bookID].rows.length - 1); i++) {
          if (state.items[bookID].rows[i].uuid === payload.data.uuid) {
            Vue.set(state.items[bookID].rows, i, payload.data)
          }
        }
      } else if (payload.model === 'locations') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.locations[bookID].rows.length - 1); i++) {
          if (state.locations[bookID].rows[i].uuid === payload.data.uuid) {
            Vue.set(state.locations[bookID].rows, i, payload.data)
          }
        }
      } else if (payload.model === 'characters') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.characters[bookID].rows.length - 1); i++) {
          if (state.characters[bookID].rows[i].uuid === payload.data.uuid) {
            Vue.set(state.characters[bookID].rows, i, payload.data)
          }
        }
      } else if (payload.model === 'scenes') {
        // parent can be chapter or book (other scenes)
        let PARENT = (payload.data.chapter_id !== null) ? payload.data.chapter_id : payload.data.book_id
        for (let i = 0; i <= (state.scenes[PARENT].rows.length - 1); i++) {
          if (state.scenes[PARENT].rows[i].uuid === payload.data.uuid) {
            Vue.set(state.scenes[PARENT].rows, i, payload.data)
          }
        }
      } else if (payload.model === 'chapter-versions') {
        let chapterID = payload.data.chapter_id
        for (let i = 0; i <= (state.chapter_versions[chapterID].rows.length - 1); i++) {
          if (state.chapter_versions[chapterID].rows[i].uuid === payload.data.uuid) {
            Vue.set(state.chapter_versions[chapterID].rows, i, payload.data)
          }
        }
      }
    },
    removeFromList (state, payload) {
      if (payload.model === 'books') {

      } else if (payload.model === 'chapters') {
        let bookID = payload.data.book_id
        for (var i = 0; i <= (state.chapters[bookID].rows.length - 1); i++) {
          if (state.chapters[bookID].rows[i].uuid === payload.data.uuid) {
            state.chapters[bookID].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'items') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.items[bookID].rows.length - 1); i++) {
          if (state.items[bookID].rows[i].uuid === payload.data.uuid) {
            state.items[bookID].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'locations') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.locations[bookID].rows.length - 1); i++) {
          if (state.locations[bookID].rows[i].uuid === payload.data.uuid) {
            state.locations[bookID].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'characters') {
        let bookID = payload.data.book_id
        for (let i = 0; i <= (state.characters[bookID].rows.length - 1); i++) {
          if (state.characters[bookID].rows[i].uuid === payload.data.uuid) {
            state.characters[bookID].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'scenes') {
        let PARENT = (payload.data.chapter_id !== null) ? payload.data.chapter_id : payload.data.book_id

        for (let i = 0; i <= (state.scenes[PARENT].rows.length - 1); i++) {
          if (state.scenes[PARENT].rows[i].uuid === payload.data.uuid) {
            state.scenes[PARENT].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'chapter-versions') {
        let chapterID = payload.data.chapter_id
        for (let i = 0; i <= (state.chapter_versions[chapterID].rows.length - 1); i++) {
          if (state.chapter_versions[chapterID].rows[i].uuid === payload.data.uuid) {
            state.chapter_versions[chapterID].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'scene-locations') {
        let sceneID = payload.data.book_scene_id
        for (let i = 0; i <= (state.scene_locations[sceneID].rows.length - 1); i++) {
          if (state.scene_locations[sceneID].rows[i].uuid === payload.data.uuid) {
            state.scene_locations[sceneID].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'scene-items') {
        let sceneID = payload.data.book_scene_id
        for (let i = 0; i <= (state.scene_items[sceneID].rows.length - 1); i++) {
          if (state.scene_items[sceneID].rows[i].uuid === payload.data.uuid) {
            state.scene_items[sceneID].rows.splice(i, 1)
          }
        }
      } else if (payload.model === 'scene-characters') {
        let sceneID = payload.data.book_scene_id
        for (let i = 0; i <= (state.scene_characters[sceneID].rows.length - 1); i++) {
          if (state.scene_characters[sceneID].rows[i].uuid === payload.data.uuid) {
            state.scene_characters[sceneID].rows.splice(i, 1)
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
          state.books.forEach(function (book) {
            book.is_open = false
            book.folders = ['chapters', 'items', 'characters', 'locations', 'scenes']
          })
        })
    },
    mutateChapter (state, payload) {
      var bookID = payload
      console.log(bookID)
      console.log(state.chapters[bookID])
      state.chapters[bookID].rows.push({title: 'traaayydooorrr'})
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
    loadList ({ commit, state }, payload) {
      commit('loadList', payload)
    },
    updateFromList ({ commit, state }, payload) {
      commit('updateFromList', payload)
    },
    removeFromList ({ commit, state }, payload) {
      commit('removeFromList', payload)
    },
    getBooksByAuthorID ({ commit, state }, payload) {
      commit('mutateBook', payload)
    },
    sortChapters ({ commit, state }, payload) {
      commit('sortChapters', payload)
    }
  }
}
