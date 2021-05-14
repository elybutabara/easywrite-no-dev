export default {
  strict: true, // make sure everything us mutated, no direct editing of state
  name: 'settings',
  state: {
    darkmode: true,
    collapsedSideNav: false,
    autosync: false,
    syncStatus: 'idle',
    syncSource: 'initial', // initial (on app load), CTA (when manually started)
  },
  getters: {
    darkmode: state => {
      return state.darkmode
    },
    collapsedSideNav: state => {
      return state.collapsedSideNav
    },
    isAutoSync: state => {
      return state.autosync
    },
    getSyncStatus: state => {
      return state.syncStatus
    },
    getSyncSource: state => {
      return state.syncSource
    }
  },
  mutations: { 
    toggleTheme (state) {
      state.darkmode = !state.darkmode
    },
    toggleSideNav (state) {
      state.collapsedSideNav = !state.collapsedSideNav
    },
    setSyncSource (state, payload) {
      state.syncSource =  payload.source
    },
    startSync (state) {
      state.syncStatus =  'syncing'
    },
    stopSync (state) {
      state.syncSource =  'initial'
      state.syncStatus =  'idle'
    }
  },
  actions: {
    setSyncSource ({ commit, state }, payload) {
      commit('setSyncSource', payload)
    }
  }
}
