export default {
  strict: true, // make sure everything us mutated, no direct editing of state
  name: 'auth',
  state: {
    user: {
      data: [],
      author: []
    },
    isAuthenticated: false
  },
  getters: {
    isAuthenticated: state => {
      return state.isAuthenticated
    },
    getAuthorID: state => {
      return state.user.author.uuid
    },
    getUserID: state => {
      return state.user.data.uuid
    },
    getUserToken: state => {
      return state.user.data.token
    },
    getAuthorName: state => {
      return state.user.author.first_name
    },
    getUserSyncedDate: state => {
      return state.user.data.synced_at
    }
  },
  mutations: {
    authenticate (state, payload) {
      state.isAuthenticated = true
      state.user.data = payload.user
      state.user.author = payload.author
    },
    updateSyncedAt (state, payload) {
      state.user.data.synced_at = payload.syncedAt
    }
  }
}
