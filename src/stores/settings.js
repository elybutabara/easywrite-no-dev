export default {
  strict: true, // make sure everything us mutated, no direct editing of state
  name: 'settings',
  state: {
    darkmode: true,
    collapsedSideNav: false,
    autosync: false
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
    }
  },
  mutations: {
    toggleTheme (state) {
      state.darkmode = !state.darkmode
    },
    toggleSideNav (state) {
      state.collapsedSideNav = !state.collapsedSideNav
    }
  },
  actions: {

  }
}
