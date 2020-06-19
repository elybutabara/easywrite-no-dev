export default {
  strict: true, // make sure everything us mutated, no direct editing of state
  state: {
    exportbook: {
      export_book_status: false
    }
  },
  getters: {
    getExportBookStatus: state => {
      return state.exportbook
    }
  },
  mutations: {
    exportBookStatusOpen: state => {
      state.exportbook.export_book_status = true
    },
    exportBookStatusClose: state => {
      state.exportbook.export_book_status = false
    }
  }
}
