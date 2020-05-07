import Vue from 'vue'
import axios from 'axios'

export default {
  strict: true,
  state: {
    locations: {}
  },
  getters: {
    getLocationsByBook: state => (bookUUID) => {
      if (state.locations.hasOwnProperty(bookUUID)) {
        return state.locations[bookUUID].rows
      }
      return []
    },
    findLocation: state => (payload) => {
      let bookUUID = payload.book_id
      if (state.locations[bookUUID] !== undefined) {
        for (let i = 0; i < state.locations[bookUUID].rows.length; i++) {
          let current = state.locations[bookUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.locations[bookUUID].rows[i]
          }
        }
      }
      return null
    }
  },
  mutations: {
    loadLocationsByBook (state, payload) {
      let bookID = payload
      Vue.set(state.locations, bookID, { rows: [] })
      axios
        .get('http://localhost:3000/books/' + bookID + '/locations')
        .then(response => {
          state.locations[bookID] = { is_open: false, rows: response.data }
        })
    },
    addLocationToList (state, payload) {
      let bookID = payload.book_id
      // use this to get the total number of chapters under book
      let count = state.locations[bookID].rows.length
      state.locations[bookID].rows.push({})
      Vue.set(state.locations[bookID].rows, count, payload)
    },
    updateLocationFromList (state, payload) {
      let bookID = payload.book_id
      for (let i = 0; i < state.locations[bookID].rows.length; i++) {
        if (state.locations[bookID].rows[i].uuid === payload.uuid) {
          Vue.set(state.locations[bookID].rows, i, payload)
        }
      }
    },
    removeLocationFromList (state, payload) {
      let bookID = payload.book_id
      for (var i = 0; i < state.locations[bookID].rows.length; i++) {
        if (state.locations[bookID].rows[i].uuid === payload.uuid) {
          state.locations[bookID].rows.splice(i, 1)
        }
      }
    },
    updateLocationList (state, payload) {
      let bookUUID = payload.book_id
      if (!state.locations[bookUUID]) {
        Vue.set(state.locations, bookUUID, { rows: [] })
        // add row
        state.locations[bookUUID].rows.push({})
        Vue.set(state.locations[bookUUID].rows, 0, payload)
        return
      }

      for (let i = 0; i <= (state.locations[bookUUID].rows.length - 1); i++) {
        let current = state.locations[bookUUID].rows[i]
        if (current.uuid === payload.uuid) {
          Vue.set(state.locations[bookUUID].rows, i, payload)
          break
        } else if (i === (state.locations[bookUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of locations under book
          let count = state.locations[bookUUID].rows.length
          state.locations[bookUUID].rows.push({})
          Vue.set(state.locations[bookUUID].rows, count, payload)
        }
      }
    }
  },
  actions: {
    loadLocationsByBook ({ commit, state }, payload) {
      commit('loadLocationsByBook', payload)
    },
    addLocationToList ({ commit, state }, payload) {
      commit('addLocationToList', payload)
    },
    updateLocationFromList ({ commit, state }, payload) {
      commit('updateLocationFromList', payload)
    },
    updateLocationList ({ commit, state }, payload) {
      commit('updateLocationList', payload)
    },
    removeLocationFromList ({ commit, state }, payload) {
      commit('removeLocationFromList', payload)
    }
  }
}
