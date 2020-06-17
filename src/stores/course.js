import Vue from 'vue'
import axios from 'axios'

export default {
  strict: true,
  state: {
    courses: {}
  },
  getters: {
    getCoursesByUserId: state => (userUUID) => {
      if (state.courses.hasOwnProperty(userUUID)) {
        return state.courses[userUUID].rows
      }
      return []
    },
    findCourse: state => (payload) => {
      let userUUID = payload.userUUID
      if (state.courses[userUUID] !== undefined) {
        for (let i = 0; i < state.courses[userUUID].rows.length; i++) {
          let current = state.courses[userUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.courses[userUUID].rows[i]
          }
        }
      }
      return null
    }
  },
  mutations: {
    loadCourseByUserId (state, payload) {
      let userUUID = payload.userUUID
      let courses = payload.courses
      Vue.set(state.courses, userUUID, { rows: [] })
      state.courses[userUUID] = { is_open: false, rows: courses.data }
    },
    addCourseToList (state, payload) {
      let userUUID = payload.userUUID
      // use this to get the total number of chapters under book
      let count = state.courses[userUUID].rows.length
      state.courses[userUUID].rows.push({})
      Vue.set(state.courses[userUUID].rows, count, payload)
    },
    updateCourseFromList (state, payload) {
      let userUUID = payload.userUUID
      for (let i = 0; i < state.courses[userUUID].rows.length; i++) {
        if (state.courses[userUUID].rows[i].uuid === payload.uuid) {
          Vue.set(state.courses[userUUID].rows, i, payload)
        }
      }
    },
    removeCourseFromList (state, payload) {
      let userUUID = payload.userUUID
      for (var i = 0; i < state.courses[userUUID].rows.length; i++) {
        if (state.courses[userUUID].rows[i].uuid === payload.uuid) {
          state.courses[userUUID].rows.splice(i, 1)
        }
      }
    },
    updateCourseList (state, payload) {
      let userUUID = payload.userUUID
      if (!state.courses[userUUID]) {
        Vue.set(state.courses, userUUID, { rows: [] })
        // add row
        state.courses[userUUID].rows.push({})
        Vue.set(state.courses[userUUID].rows, 0, payload)
        return
      }

      for (let i = 0; i <= (state.courses[userUUID].rows.length - 1); i++) {
        let current = state.courses[userUUID].rows[i]
        if (current.uuid === payload.uuid) {
          Vue.set(state.courses[userUUID].rows, i, payload)
          break
        } else if (i === (state.courses[userUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of courses under book
          let count = state.courses[userUUID].rows.length
          state.courses[userUUID].rows.push({})
          Vue.set(state.courses[userUUID].rows, count, payload)
        }
      }
    }
  },
  actions: {
    async loadCourseByUserId ({ commit, state }, payload) {
      let userUUID = payload
      let courses = await axios.get('http://localhost:3000/courses/' + userUUID + '/course-list')
      commit('loadCourseByUserId', { userUUID: userUUID, courses: courses })
    },
    addCourseToList ({ commit, state }, payload) {
      commit('addCourseToList', payload)
    },
    updateCourseFromList ({ commit, state }, payload) {
      commit('updateCourseFromList', payload)
    },
    updateCourseList ({ commit, state }, payload) {
      commit('updateCourseList', payload)
    },
    removeCourseFromList ({ commit, state }, payload) {
      commit('removeCourseFromList', payload)
    }
  }
}
