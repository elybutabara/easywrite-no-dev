import Vue from 'vue'
import axios from 'axios'

export default {
  strict: true,
  state: {
    chapters: {},
    chapter_versions: { rows: [] },
    chapter_history: { rows: [] },
    chapter_author_personal_progress: {}
  },
  getters: {
    isChapterFolderOpen: state => (bookUUID) => {
      if (state.chapters.hasOwnProperty(bookUUID) && state.chapters[bookUUID].is_open) {
        return true
      } else {
        return false
      }
    },
    getChaptersByBook: state => (bookUUID) => {
      if (state.chapters.hasOwnProperty(bookUUID)) {
        return state.chapters[bookUUID].rows
      }
      return []
    },
    getChapterHistory: state => (chapterUUID) => {
      if (state.chapter_history.hasOwnProperty(chapterUUID)) {
        return state.chapter_history[chapterUUID].rows
      }
      return []
    },
    getChapterVersions: state => (chapterUUID) => {
      if (state.chapter_versions.hasOwnProperty(chapterUUID)) {
        return state.chapter_versions[chapterUUID].rows
      }
      return []
    },
    getChapterContent: state => (chapterUUID) => {
      if (state.chapter_versions[chapterUUID] && state.chapter_versions[chapterUUID].rows.length > 0) {
        var index = state.chapter_versions[chapterUUID].rows.length - 1
        return state.chapter_versions[chapterUUID].rows[index].content
      } else {
        return ''
      }
    },
    getChapterVersionContent: state => (chapterVersionUUID) => {
      if (state.chapter_versions[chapterVersionUUID] !== undefined && state.chapter_versions[chapterVersionUUID].rows.length > 0) {
        var index = state.chapter_versions[chapterVersionUUID].rows.length - 1
        return state.chapter_versions[chapterVersionUUID].rows[index].content
      } else {
        return ''
      }
    },
    findLatestChapterVersionByChapter: state => (payload) => {
      let chapterUUID = payload.uuid

      if (state.chapter_versions[chapterUUID] !== 'undefined' && state.chapter_versions[chapterUUID].rows.length > 0) {
        var index = state.chapter_versions[chapterUUID].rows.length - 1
        return state.chapter_versions[chapterUUID].rows[index]
      }
      return null
    },
    getTodayAuthorPersonalProgressForChapter: state => (payload) => {
      let chapterUUID = payload.uuid

      if (state.chapter_author_personal_progress[chapterUUID] !== 'undefined') {
        return state.chapter_author_personal_progress[chapterUUID]
      }
      return null
    },
    findChapter: state => (payload) => {
      let bookUUID = payload.book_id
      if (state.chapters[bookUUID] !== undefined) {
        for (let i = 0; i < state.chapters[bookUUID].rows.length; i++) {
          let current = state.chapters[bookUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.chapters[bookUUID].rows[i]
          }
        }
      }
      return null
    }
  },
  mutations: {
    toggleChapter (state, payload) {
      let chapter = payload
      for (let i = 0; i < state.chapters[chapter.book_id].rows.length; i++) {
        let pointed = state.chapters[chapter.book_id].rows[i]
        if (chapter.uuid === pointed.uuid) {
          let isOpen = state.chapters[chapter.book_id].rows[i].is_open
          Vue.set(state.chapters[chapter.book_id].rows[i], 'is_open', !isOpen)
          break
        }
      }
    },
    loadChaptersByBook (state, payload) {
      let bookID = payload
      Vue.set(state.chapters, bookID, { rows: [] })
      axios
        .get('http://localhost:3000/books/' + bookID + '/chapters')
        .then(response => {
          state.chapters[bookID] = { is_open: false, rows: response.data }
          for (let i = 0; i < state.chapters[bookID].rows.length; i++) {
            Vue.set(state.chapters[bookID].rows[i], 'is_open', false)
          }
        })
    },
    loadChaptersWithScenesByBook (state, payload) {
      let bookUUID = payload
      Vue.set(state.chapters, bookUUID, { rows: [] })
      axios
        .get('http://localhost:3000/chapters/' + bookUUID + '/scenes-with-relation')
        .then(response => {
          state.chapters[bookUUID] = { is_open: false, rows: response.data }
          for (let i = 0; i < state.chapters[bookUUID].rows.length; i++) {
            Vue.set(state.chapters[bookUUID].rows[i], 'is_open', false)
          }
        })
    },
    loadChapterHistory (state, payload) {
      let chapterID = payload
      Vue.set(state.chapter_history, chapterID, { rows: [] })
      axios
        .get('http://localhost:3000/chapters/' + chapterID + '/history')
        .then(response => {
          state.chapter_history[chapterID] = { rows: response.data }
        })
    },
    loadVersionsByChapter (state, payload) {
      let chapterID = payload
      Vue.set(state.chapter_versions, chapterID, { rows: [] })
      axios
        .get('http://localhost:3000/chapters/' + chapterID + '/versions')
        .then(response => {
          state.chapter_versions[chapterID] = { rows: response.data }
        })
    },
    loadTodayAuthorPersonalProgressForChapter (state, payload) {
      let chapterID = payload.chapter_id
      let authorID = payload.author_id
      Vue.set(state.chapter_author_personal_progress, chapterID, {})
      axios
        .get('http://localhost:3000/authors/' + authorID + '/chapter/' + chapterID + '/personal-progress/today')
        .then(response => {
          state.chapter_author_personal_progress[chapterID] = response.data
        })
    },
    addChapterToList (state, payload) {
      let bookID = payload.book_id
      // use this to get the total number of chapters under book
      let count = state.chapters[bookID].rows.length
      state.chapters[bookID].rows.push({})
      Vue.set(state.chapters[bookID].rows, count, payload)
    },
    updateChapterFromList (state, payload) {
      let bookID = payload.book_id
      for (let i = 0; i <= (state.chapters[bookID].rows.length - 1); i++) {
        if (state.chapters[bookID].rows[i].uuid === payload.uuid) {
          Vue.set(state.chapters[bookID].rows, i, payload)
        }
      }
    },
    removeChapterFromList (state, payload) {
      let bookID = payload.book_id
      for (var i = 0; i <= (state.chapters[bookID].rows.length - 1); i++) {
        if (state.chapters[bookID].rows[i].uuid === payload.uuid) {
          state.chapters[bookID].rows.splice(i, 1)
        }
      }
    },
    updateChapterList (state, payload) {
      let bookUUID = payload.book_id
      if (!state.chapters[bookUUID]) {
        Vue.set(state.chapters, bookUUID, { rows: [] })
        // add row
        state.chapters[bookUUID].rows.push({})
        Vue.set(state.chapters[bookUUID].rows, 0, payload)
        return
      }

      for (let i = 0; i <= (state.chapters[bookUUID].rows.length - 1); i++) {
        let current = state.chapters[bookUUID].rows[i]
        if (current.uuid === payload.uuid) {
          let isOpen = current.is_open
          Vue.set(state.chapters[bookUUID].rows, i, payload)
          Vue.set(state.chapters[bookUUID].rows[i], 'is_open', isOpen)
          break
        } else if (i === (state.chapters[bookUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of chapters under book
          let count = state.chapters[bookUUID].rows.length
          state.chapters[bookUUID].rows.push({})
          Vue.set(state.chapters[bookUUID].rows, count, payload)
        }
      }
    },
    updateChapterVersionList (state, payload) {
      let chapterUUID = payload.chapter_id
      console.log(payload)
      if (!state.chapter_versions[chapterUUID]) {
        Vue.set(state.chapter_versions, chapterUUID, { rows: [] })
        // add row
        state.chapter_versions[chapterUUID].rows.push({})
        Vue.set(state.chapter_versions[chapterUUID].rows, 0, payload)
        return
      }

      for (let i = 0; i <= (state.chapter_versions[chapterUUID].rows.length - 1); i++) {
        let current = state.chapter_versions[chapterUUID].rows[i]
        if (current.uuid === payload.uuid) {
          Vue.set(state.chapter_versions[chapterUUID].rows, i, payload)
          break
        } else if (i === (state.chapter_versions[chapterUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of chapters under book
          let count = state.chapter_versions[chapterUUID].rows.length
          state.chapter_versions[chapterUUID].rows.push({})
          Vue.set(state.chapter_versions[chapterUUID].rows, count, payload)
        }
      }
    },
    sortChapters (state, payload) {
      axios
        .post('http://localhost:3000/chapters/sort', payload.data)
        .then(response => {
          console.log('chapters sorted!')
        })
      state.chapters[payload.bookUUID].rows = payload.data
    }
  },
  actions: {
    toggleChapter ({ commit, state }, payload) {
      commit('toggleChapter', payload)
    },
    loadChaptersByBook ({ commit, state }, payload) {
      commit('loadChaptersByBook', payload)
    },
    loadChaptersWithScenesByBook ({ commit, state }, payload) {
      commit('loadChaptersWithScenesByBook', payload)
    },
    loadChapterHistory ({ commit, state }, payload) {
      commit('loadChapterHistory', payload)
    },
    loadVersionsByChapter ({ commit, state }, payload) {
      commit('loadVersionsByChapter', payload)
    },
    loadTodayAuthorPersonalProgressForChapter ({ commit, state, rootGetters }, payload) {
      commit('loadTodayAuthorPersonalProgressForChapter', { chapter_id: payload, author_id: rootGetters.getAuthorID })
    },
    addChapterToList ({ commit, state }, payload) {
      commit('addChapterToList', payload)
    },
    updateChapterFromList ({ commit, state }, payload) {
      commit('updateChapterFromList', payload)
    },
    updateChapterList ({ commit, state }, payload) {
      commit('updateChapterList', payload)
    },
    updateChapterVersionList ({ commit, state }, payload) {
      commit('updateChapterVersionList', payload)
    },
    removeChapterFromList ({ commit, state }, payload) {
      commit('removeChapterFromList', payload)
    },
    sortChapters ({ commit, state }, payload) {
      commit('sortChapters', payload)
    }
  }
}
