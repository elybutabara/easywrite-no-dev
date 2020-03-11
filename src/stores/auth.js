export default {
  strict: true, // make sure everything us mutated, no direct editing of state
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
    }
  },
  mutations: {
    authenticate (state, payload) {
      state.isAuthenticated = true
      state.user.data = payload.user
      state.user.author = payload.author
    }
  }
}
