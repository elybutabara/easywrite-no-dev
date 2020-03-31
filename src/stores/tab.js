export default {
  strict: true, // make sure everything us mutated, no direct editing of state
  state: {
    axios: null,
    tabs: {
      active_index: 0,
      items: [
        { title: 'Dashboard', component: 'dashboard', data: { autosync: false } }
      ]
    }
  },
  getters: {
    getTabs: state => {
      return state.tabs
    },
    getTabsByID: state => (id) => {
      return id
    },
    getActiveTab: state => {
      return state.tabs.active_index
    }
  },
  mutations: {
    newTab (state, payload) {
      state.tabs.items.push(payload)
      state.tabs.active_index = (state.tabs.items.length - 1)
    },
    changeTab (state, payload) {
      state.tabs.active_index = payload
    },
    changeTabContent (state, payload) {
      state.tabs.active_index = payload.index
      state.tabs.items[payload.index].title = payload.title
      state.tabs.items[payload.index].component = payload.component
      state.tabs.items[payload.index].data = payload.data
    },
    removeTab (state, payload) {
      let next = 0

      // first tab will always be open
      if (payload < 1) {
        return
      }

      next = payload - 1

      if (payload > -1) {
        state.tabs.items.splice(payload, 1)
        state.tabs.active_index = next
      }
    }
  },
  actions: {
    changeTabContent ({ commit, state }, payload) {
      commit('changeTabContent', payload)
    },
    newTab ({ commit, state }, payload) {
      commit('newTab', payload)
    },
    changeTab ({ commit, state }, payload) {
      commit('changeTab', payload)
    },
    removeTab ({ commit, state }, payload) {
      commit('removeTab', payload)
    }
  }
}
