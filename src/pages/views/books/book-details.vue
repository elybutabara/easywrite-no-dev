<template>
<div v-if="page.is_ready" class="page-book-details">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <h4>{{ properties.title }}</h4>
                <small>{{ $t('DATE_MODIFIED') }}: {{ properties.created_at }}</small>
            </div>
            <div class="actions">
                <button class="es-button-white" @click="exportBook()">{{ export_book }}</button>
                <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'storyboard-' + page.data.uuid, tabComponent: 'storyboard',  tabData: page.data, tabTitle: 'Story Board - ' + properties.title, newTab: true})">Story Board</button>
                <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'book-form-' + page.data.uuid, tabComponent: 'book-form',  tabData: page.data, tabTitle: $t('EDIT') + ' - ' + properties.title, newTab: true})">{{ $t('EDIT') }}</button>
                <button class="es-button-red" @click="deleteBook()">{{ $t('DELETE') }}</button>
            </div>
        </div>
        <span class="book-genre" v-for="genre in properties.genre" :key="genre.uuid">{{ genre.name }}</span>
    </div>
    <div class="es-page-content">
        <div class="es-panel">
            <h4>{{ $t('ABOUT') }}</h4>
            <div v-html="properties.about"></div>
        </div>
    </div>
</div>
</template>

<script>
const {ipcRenderer} = window.require('electron')
export default {
  name: 'book-details',
  props: ['properties'],
  data: function () {
    return {
      page: {
        is_ready: false,
        title: '',
        data: null
      },
      export_book: this.$t('EXPORT_BOOK')
    }
  },
  computed: {

  },
  methods: {
    updateBook () {
      var scope = this
      // scope.$parent.getBooks()
      // scope.$parent.changeComponent('book-form', scope.properties)
      scope.$parent.changeComponent('book-form', scope.properties, scope.properties.title, true)
      scope.$store.commit('addTab', { title: scope.properties.title, component: 'book-form', data: scope.properties })
    },

    deleteBook () {
      var scope = this
      window.swal.fire({
        title: this.$t('ARE_YOU_SURE'),
        text: this.$t('YOU_WONT_BE_ABLE_TO_REVERT_THIS'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('YES_DELETE_IT'),
        cancelButtonText: this.$t('CANCEL')
      }).then((result) => {
        if (result.value) {
          scope.axios
            .delete('http://localhost:3000/books/' + scope.properties.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeBookFromList', scope.properties)
                  scope.CHANGE_COMPONENT({tabKey: 'dashboard', tabComponent: 'dashboard', tabData: null, tabTitle: 'DASHBOARD'})
                })
              }
            })
        }
      })
    },

    exportBook: function () {
      const scope = this
      scope.export_book = scope.$t('LOADING') + '....'

      let book = scope.properties

      ipcRenderer.send('EXPORT-DOCX-SHOW-BOOK-WINDOW', book)

      ipcRenderer.on('CHANGE-EXPORT-BOOK-BUTTON-NAME', function (event, data) {
        scope.export_book = scope.$t('EXPORT_BOOK').toUpperCase()
      })
    }

  },
  mounted () {
    var scope = this
    scope.page.title = scope.properties.title
    scope.page.data = scope.properties
    scope.page.is_ready = true
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.book-stats { padding-left:30px; }
.book-stats .heading { font-family:'Gotham Bold'; }
.book-stats ul { margin-top:5px; }
.book-genre { padding:3px 10px; font-size:12px; font-size:10px; font-family:'Crimson Roman Bold'; text-transform: uppercase; margin-right: 3px; }
.book-genre:nth-child(odd) { background:#e1e7fe; color:#9098c5; }
.book-genre:nth-child(even) { background:#feedda; color:#d6a67f; }

.es-page-head {
  height: 110px;
}

@media only screen and (max-width: 968px) {
  .book-stats { display:none; }
}
</style>
