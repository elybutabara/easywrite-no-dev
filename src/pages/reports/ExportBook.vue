<template>
<div>
    <div><p>{{ mydata }}</p></div>
    <div class="actions">
        <button id="printBookButton" class="es-button-white" @click="exportBook()">{{$t('EXPORT')}}</button>
    </div>
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
      // const scope = this
      window.$('#printBookButton').hide()
      var markup = document.documentElement.outerHTML
      ipcRenderer.send('EXPORT-WORD-BOOK', markup)
    }
  },
  beforeMount () {},
  mounted () {
    const scope = this
    ipcRenderer.on('EXPORT-DOCX-GET-BOOK', function (event, data) {
      scope.mydata = data
    })

    ipcRenderer.on('EXPORT-DOCX-SHOW-BUTTON', function (event, data) {
      window.$('#printBookButton').show()
    })
  }
}

</script>
