<template>
<div class="page-syncing" v-bind:class="{'fullscreen' : fullscreen}">
   <div>
       <div class="es-page-head">
            <div class="inner">
                <div class="details">
                    <h4>Syncing</h4>
                    <small>Sync your data from and to web</small>
                </div>
            </div>
        </div>

       <div class="es-page-content">
            <div v-if="stage == 'intro'" class="es-card fadeIn animated">
                <div class="es-card-header">Data Syncer</div>
                <div class="es-card-content">
                    <p class="intro-message">
                        <i style="font-size:80px;" class="las la-sync"></i> <br/>
                        Sync your data from desktop application to web vice versa...
                        <br/>
                        <br/>
                        <button class="syncer-button" @click="checkConnection()">Start Syncing</button>
                    </p>
                </div>
            </div>
            <div v-if="stage == 'connecting'" class="es-card fadeIn animated">
                <div class="es-card-header">Connecting</div>
                <div class="es-card-content">
                    <img class="loader" src="@/assets/img/loader-cog.svg">
                    <p>{{ progress_message }}</p>
                    <br/>
                    <br/>
                </div>
            </div>
            <div v-if="stage == 'downloading'" class="es-card">
                <div class="es-card-header">Downloading</div>
                <div class="es-card-content">
                    <img class="loader" src="@/assets/img/loader-cog.svg">
                    <p style="font-size:20px;">{{ downloadProgess }}%</p>
                    <div class="es-progress-bar">
                        <div class="es-progress" v-bind:style="{ width: downloadProgess + '%' }"></div>
                    </div>
                    <p>{{ progress_message }}</p>
                    <br/>
                    <br/>
                </div>
            </div>
            <div v-if="stage == 'saving'" class="es-card">
                <div class="es-card-header">Saving Data</div>
                <div class="es-card-content">
                    <img class="loader" src="@/assets/img/loader-cog.svg">
                    <p style="font-size:20px;">{{ savingProgess }}%</p>
                    <div class="es-progress-bar">
                        <div class="es-progress" v-bind:style="{ width: savingProgess + '%' }"></div>
                    </div>
                    <p>{{ progress_message }}</p>
                    <br/>
                    <br/>
                </div>
            </div>
            <div v-if="stage == 'logs'" class="es-card">
                <div class="es-card-header">Change Logs</div>
                <div class="es-card-content">
                   <div style="text-align:left; color:#ccc;">
                        <p style="margin:2px 0px; color:#293742; font-size:12px;" v-for="(endpoint,index) in endpoints" v-bind:key="index">
                           Downloaded {{ endpoint.data.length}} <strong>{{ endpoint.title }}</strong>
                        </p>
                       <button v-if="autostart" class="syncer-button" @click="backToDashboard()">OK</button>
                   </div>
                </div>
            </div>
        </div>

   </div>
</div>
</template>

<script>
export default {
  name: 'syncing',
  props: ['properties'],
  data: function () {
    return {
      api_token: '',
      fullscreen: false,
      autostart: false,
      stage: 'intro',
      current: 0,
      progress_message: 'Initializing...',
      download: {
        pointer: 0,
        progress: 0,
        total: 0
      },
      saving: {
        pointer: 0,
        index: 0,
        counter: 0,
        progress: 0,
        total: 0
      },
      endpoints: [
        { title: 'Genres', api: 'book-genres', local: 'book-genres', data: [] },
        { title: 'Relations', api: 'book-relations', local: 'relations', data: [] },
        { title: 'Books', api: 'books', local: 'books', data: [] },
        { title: 'Items', api: 'book-items', local: 'items', data: [] },
        { title: 'Locations', api: 'book-locations', local: 'locations', data: [] },
        { title: 'Book Genres', api: 'book-genre-collections', local: 'book-genre-collections', data: [] },
        { title: 'Chapters', api: 'book-chapters', local: 'chapters', data: [] },
        { title: 'Chapter Version', api: 'book-chapter-versions', local: 'chapter-versions', data: [] },
        { title: 'Characters', api: 'book-characters', local: 'characters', data: [] },
        { title: 'Relationships', api: 'book-relation-details', local: 'relation-details', data: [] },
        { title: 'Scenes', api: 'book-scenes', local: 'scenes', data: [] },
        { title: 'Scene Versions', api: 'book-scene-versions', local: 'scene-versions', data: [] },
        { title: 'Scene Items', api: 'book-scene-items', local: 'scene-items', data: [] },
        { title: 'Scene Locations', api: 'book-scene-locations', local: 'scene-locations', data: [] },
        { title: 'Scene Characters', api: 'book-scene-characters', local: 'scene-characters', data: [] }
      ],
      bookUUID: ''
    }
  },
  computed: {
    downloadProgess: function () {
      var progress = Math.ceil((this.download.pointer / this.endpoints.length) * 100)
      if (progress > 100) { progress = 100 }
      return progress
    },
    savingProgess: function () {
      var progress = Math.ceil((this.saving.counter / this.download.total) * 100)
      if (progress > 100) { progress = 100 }
      return progress
    }
  },
  methods: {
    checkConnection: function () {
      var scope = this
      scope.stage = 'connecting'
      scope.progress_message = 'Establishing Connection...'

      scope.axios.get(window.API_URL + '/user/connect')
        .then(function (response) {
        // handle success
          scope.progress_message = 'Connected!'
          setTimeout(function () {
            scope.startDownloadData()
          }, 1000)
        })
        .catch(function (error) {
        // handle error
          console.log(error)
        })
        .finally(function () {
        // always executed
        })
    },
    startDownloadData: function () {
      var scope = this
      scope.stage = 'downloading'
      if (scope.download.pointer >= scope.endpoints.length) {
        scope.saveDownloadedData()
        return
      }
      // get the current pointed endpoint
      let endpoint = scope.endpoints[scope.download.pointer]
      scope.progress_message = 'Downloading ' + endpoint.title + '...'
      scope.axios.get(window.API_URL + '/' + endpoint.api,
        {
          'headers': {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + scope.api_token
          }
        })
        .then(function (response) {
          // eslint-disable-next-line valid-typeof
          var data = response.data.rows
          scope.endpoints[scope.download.pointer].data = data
          scope.download.pointer++
          scope.download.total += response.data.count
          scope.startDownloadData()
        })
        .catch(function (error) {
          // handle error
          console.log(error)
        })
        .finally(function () {
          // always executed
        })
    },
    saveDownloadedData: function () {
      var scope = this
      scope.stage = 'saving'

      // done going through tables
      if (scope.saving.pointer >= scope.endpoints.length) {
        scope.showLogs()
        return
      }

      var endpoint = scope.endpoints[scope.saving.pointer]
      scope.progress_message = 'Saving ' + endpoint.title + ' Data...'

      // move to the next table/model
      if (scope.saving.index >= endpoint.data.length) {
        scope.saving.pointer++
        scope.saving.index = 0
        scope.saveDownloadedData()
      }

      scope.progress_message = 'Saving ' + endpoint.title + ' Data (' + scope.saving.index + ' of ' + (endpoint.data.length + 1) + ')...'
      scope.axios
        .post('http://localhost:3000/' + endpoint.local + '/sync', endpoint.data[scope.saving.index])
        .then(function (response) {
          // eslint-disable-next-line valid-typeof
          scope.saving.index++
          scope.saving.counter++
          scope.saveDownloadedData()
        })
        .catch(function (error) {
          // handle error
          console.log(error)
        })
        .finally(function () {
          // always executed
        })
    },
    showLogs: function () {
      var scope = this
      scope.stage = 'logs'

      var userID = this.$store.getters.getUserID
      scope.$store.dispatch('getBooksByAuthorID', userID)
    },
    backToDashboard: function () {
      var scope = this
      scope.$parent.closeSyncer()
    }
  },
  beforeMount () {
    var scope = this
    scope.api_token = scope.$store.getters.getUserToken
  },
  mounted () {
    var scope = this
    if (scope.properties !== null && scope.properties.fullscreen) {
      scope.fullscreen = true
    }

    if (scope.properties !== null && scope.properties.autostart) {
      scope.autostart = true
      scope.checkConnection()
    }
    // scope.getLocations(scope.properties.uuid)
    // scope.bookUUID = scope.properties.uuid
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .page-syncing.fullscreen .es-page-content {
        position: fixed;
        top: 0px;
        left: 0px;
        background: rgba(31,46,58,0.8);
        width: 100%;
        height: 100vh;
        z-index: 999;
    }
    .es-card { width:calc(100% - 40px); max-width:750px; margin:0px auto; margin-top:10px; color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    .es-card .es-card-content { position:relative; padding:20px; min-height:150px; text-align:center; }
    .es-card .es-card-content .intro-message { padding:80px 10px; }
    .es-card .es-card-content .loader { display:inline-block; margin:0px auto; padding:20px 0px; max-width:100px; }

    .es-card .es-card-content .syncer-button {cursor:pointer; background:#862e3b; border:none; color:#fff; padding:10px 40px; border-radius:4px; }
    .es-card .es-card-content .syncer-button:hover { background:#973241;  }

    .es-card .es-card-content .es-progress-bar { margin-top:-8px; margin-bottom:10px; position:relative; background:#ccc; border-radius:8px; height:10px;  }
    .es-card .es-card-content .es-progress { position:absolute; top:0px; left:0px; border-radius:8px; height:10px; background:#43c853; width:0%; height:100%;  }

    .es-card .es-card-header { font-weight:600; position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 10px; border-bottom:1px solid #e0e5ee; }
</style>
