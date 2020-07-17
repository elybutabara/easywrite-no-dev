export default {
  strict: true, // make sure everything us mutated, no direct editing of state
  name: 'settings',
  state: {
    darkmode: false
  },
  getters: {
    darkmode: state => {
      return state.darkmode
    },
    tester: state => {
      return state.tester
    }
  },
  mutations: {
    toggleTheme (state) {
      state.darkmode = !state.darkmode
    }
  },
  actions: {

  }
}
