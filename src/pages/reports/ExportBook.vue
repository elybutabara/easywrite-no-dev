<template>
<div>
    <div><p><b>{{ mydata }}</b></p></div>
</div>
</template>
<script>
const electron = window.require('electron')
const {ipcRenderer} = electron

export default {
  data: function () {
    return {
      mydata: ''
    }
  },
  methods: {
    exportBook: function () {
      var markup = document.documentElement.outerHTML
      ipcRenderer.send('EXPORT-WORD-BOOK', markup)
    }
  },
  beforeMount () {},
  mounted () {
    const scope = this
    ipcRenderer.on('EXPORT-DOCX-GET-BOOK', function (event, data) {
      scope.mydata = data
      setTimeout(function () {
        scope.exportBook()
      }, 500)
    })
  }
}

</script>
