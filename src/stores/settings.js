export default {
  strict: true, // make sure everything us mutated, no direct editing of state
  name: 'settings',
  state: {
    darkmode: true,
    collapsedSideNav: false,
    autosync: true,
    syncStatus: 'idle',
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
    }
  },
  mutations: {
    toggleTheme (state) {
      state.darkmode = !state.darkmode
    },
    toggleSideNav (state) {
      state.collapsedSideNav = !state.collapsedSideNav
    },
    startSync (state) {
      state.syncStatus =  'syncing'
    },
    stopSync (state) {
      state.syncStatus =  'idle'
    }
  },
  actions: {

  }
}
