// Mixins are a flexible way to distribute reusable functionalities for Vue components.
export default {
  name: 'mixins',
  data () {
    return {
      msg: 'BOOK LISTING'
    }
  },
  methods: {
    IPCSendSync: function (channel, args) {
      var response = window.ipcRenderer.sendSync(channel, args)
      return response
      /*
      window.ipcRenderer.on('ping', (event, message) => {
        console.log(message) // Prints 'whoooooooh!'
        window.ipcRenderer.send('db', 'ACCESS ES.DB')
      })
      console.log(this.conflicting())
      */
    },
    IPCSendAsync: function (channel, args) {
      window.ipcRenderer.sendSync(channel, args)
      window.ipcRenderer.on(channel, (event, message) => {
        console.log(message)
      })
      /*
      window.ipcRenderer.on('ping', (event, message) => {
        console.log(message) // Prints 'whoooooooh!'
        window.ipcRenderer.send('db', 'ACCESS ES.DB')
      })
      console.log(this.conflicting())
      */
    }
  }
}
