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
            <div v-if="stage == 'packing'" class="es-card">
                <div class="es-card-header">Packing</div>
                <div class="es-card-content">
                    <img class="loader" src="@/assets/img/loader-cog.svg">
                    <p style="font-size:20px;">{{ packingProgess }}%</p>
                    <div class="es-progress-bar">
                        <div v-bind:class="{'error' : packing.error }" class="es-progress" v-bind:style="{ width: packingProgess + '%' }"></div>
                    </div>
                    <p>{{ progress_message }}</p>
                    <br/>
                    <br/>
                </div>
            </div>
            <div v-if="stage == 'uploading'" class="es-card">
                <div class="es-card-header">Uploading Data</div>
                <div class="es-card-content">
                    <img class="loader" src="@/assets/img/loader-cog.svg">
                    <p style="font-size:20px;">{{ uploadProgess }}%</p>
                    <div class="es-progress-bar">
                        <div v-bind:class="{'error' : upload.error }" class="es-progress" v-bind:style="{ width: uploadProgess + '%' }"></div>
                    </div>
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
                        <div v-bind:class="{'error' : download.error }" class="es-progress" v-bind:style="{ width: downloadProgess + '%' }"></div>
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
                        <div v-bind:class="{'error' : saving.error }" class="es-progress" v-bind:style="{ width: savingProgess + '%' }"></div>
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
                           Downloaded {{ endpoint.downloaded.length}} <strong>{{ endpoint.title }}</strong>
                        </p>
                       <button v-if="autostart" class="syncer-button" @click="backToDashboard()">OK</button>
                       <button v-else class="syncer-button" @click="backToIntro()">OK</button>
                   </div>
                </div>
            </div>
        </div>

   </div>
</div>
</template>

<script>
import moment from 'moment'

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
        total: 0,
        error: false
      },
      upload: {
        pointer: 1, // starts at one coz  we skip genres
        index: 0,
        counter: 0,
        progress: 0,
        total: 0,
        error: false
      },
      packing: {
        pointer: 1, // starts at one coz  we skip genres
        progress: 0,
        total: 0,
        error: false
      },
      saving: {
        pointer: 0,
        index: 0,
        counter: 0,
        progress: 0,
        total: 0,
        error: false
      },
      endpoints: [
        { title: 'Genres', api: 'book-genres', local: 'book-genres', downloaded: [], packed: [] },
        { title: 'Relations', api: 'book-relations', local: 'relations', downloaded: [], packed: [] },
        { title: 'Books', api: 'books', local: 'books', downloaded: [], packed: [] },
        { title: 'Items', api: 'book-items', local: 'items', downloaded: [], packed: [] },
        { title: 'Locations', api: 'book-locations', local: 'locations', downloaded: [], packed: [] },
        { title: 'Book Genres', api: 'book-genre-collections', local: 'book-genre-collections', downloaded: [], packed: [] },
        { title: 'Chapters', api: 'book-chapters', local: 'chapters', downloaded: [], packed: [] },
        { title: 'Chapter Version', api: 'book-chapter-versions', local: 'chapter-versions', downloaded: [], packed: [] },
        { title: 'Characters', api: 'book-characters', local: 'characters', downloaded: [], packed: [] },
        { title: 'Relationships', api: 'book-relation-details', local: 'relation-details', downloaded: [], packed: [] },
        { title: 'Scenes', api: 'book-scenes', local: 'scenes', downloaded: [], packed: [] },
        { title: 'Scene Versions', api: 'book-scene-versions', local: 'scene-versions', downloaded: [], packed: [] },
        { title: 'Scene Items', api: 'book-scene-items', local: 'scene-items', downloaded: [], packed: [] },
        { title: 'Scene Locations', api: 'book-scene-locations', local: 'scene-locations', downloaded: [], packed: [] },
        { title: 'Scene Characters', api: 'book-scene-characters', local: 'scene-characters', downloaded: [], packed: [] }
      ],
      bookUUID: ''
    }
  },
  computed: {
    packingProgess: function () {
      var progress = Math.ceil((this.packing.pointer / this.endpoints.length) * 100)
      if (progress > 100) { progress = 100 }
      return progress
    },
    uploadProgess: function () {
      var progress = Math.ceil((this.upload.counter / this.packing.total) * 100)
      if (progress > 100) { progress = 100 }
      return progress
    },
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
            scope.getSyncableData()
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
    getSyncableData: function () {
      var scope = this
      var userID = this.$store.getters.getUserID
      scope.stage = 'packing'
      scope.packing.error = false
      // get the current pointed endpoint
      let endpoint = scope.endpoints[scope.packing.pointer]
      scope.progress_message = 'Packing ' + endpoint.title + '...'

      scope.axios.get('http://localhost:3000/' + endpoint.local + '/syncable',
        {
          params: {
            userID: userID
          }
        })
        .then(function (response) {
          // eslint-disable-next-line valid-typeof
          scope.endpoints[scope.packing.pointer].packed = response.data
          scope.packing.pointer++
          scope.packing.total += response.data.length
          if (scope.packing.pointer >= scope.endpoints.length) {
            scope.startUploadData()
          } else {
            scope.getSyncableData()
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error)
          scope.packing.error = true
          scope.progress_message = 'Packing Failed, Reconnecting...'
          setTimeout(function () {
            scope.getSyncableData()
          }, 5000)
        })
        .finally(function () {
          // always executed
        })
    },
    startUploadData: function () {
      var scope = this
      scope.stage = 'uploading'
      scope.upload.error = false

      // done going through tables
      if (scope.upload.pointer >= scope.endpoints.length) {
        scope.startDownloadData()
        return
      }

      var endpoint = scope.endpoints[scope.upload.pointer]
      if (typeof endpoint.packed === 'undefined' || endpoint.packed.length < 1) {
        scope.upload.pointer++
        scope.upload.index = 0
        scope.startUploadData()
        return
      }

      scope.progress_message = 'Uploading ' + endpoint.title + ' Data...'
      scope.progress_message = 'Uploading ' + endpoint.title + ' Data (' + scope.upload.index + ' of ' + (endpoint.packed.length + 1) + ')...'
      var data = endpoint.packed[scope.upload.index]

      data.created_at = scope.timeConvertToUTC(data.created_at)
      data.updated_at = scope.timeConvertToUTC(data.updated_at)

      scope.axios
        .post(window.API_URL + '/' + endpoint.api + '', data,
          {
            'headers': {
              'X-Requested-With': 'XMLHttpRequest',
              'Authorization': 'Bearer ' + scope.api_token
            }
          })
        .then(function (response) {
          // eslint-disable-next-line valid-typeof
          scope.upload.index++
          scope.upload.counter++
          // move to the next table/model
          if (scope.upload.index >= endpoint.packed.length) {
            scope.upload.pointer++
            scope.upload.index = 0
            // scope.startUploadData()
          }
          scope.startUploadData()
        })
        .catch(function (error) {
          // handle error
          console.log(error)
          scope.upload.error = true
          scope.progress_message = 'Upload Failed, Reconnecting...'
          setTimeout(function () {
            scope.startUploadData()
          }, 5000)
        })
        .finally(function () {
          // always executed
        })
    },
    timeConvertFromUTC: function (datetime) {
      var stillUtc = moment.utc(datetime).toDate()
      var date = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss')
      return date
    },
    timeConvertToUTC: function (datetime) {
      return moment(datetime).utc().format('YYYY-MM-DD HH:mm:ss').toString()
    },
    startDownloadData: function () {
      var scope = this
      scope.stage = 'downloading'
      scope.download.error = false

      if (scope.download.pointer >= scope.endpoints.length) {
        scope.saveDownloadedData()
        return
      }

      // get the current pointed endpoint
      let endpoint = scope.endpoints[scope.download.pointer]
      scope.progress_message = 'Downloading ' + endpoint.title + '...'

      var lastSyncedDate = scope.timeConvertToUTC(this.$store.getters.getUserSyncedDate)
      scope.axios.get(window.API_URL + '/' + endpoint.api,
        {
          params: {
            synced_at: lastSyncedDate
          },
          'headers': {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + scope.api_token
          }
        })
        .then(function (response) {
          // eslint-disable-next-line valid-typeof
          var data = response.data.rows
          scope.endpoints[scope.download.pointer].downloaded = data
          scope.download.pointer++
          scope.download.total += response.data.count
          scope.startDownloadData()
        })
        .catch(function (error) {
          // handle error
          console.log(error)
          scope.download.error = true
          scope.progress_message = 'Download Failed, Reconnecting...'
          setTimeout(function () {
            scope.startDownloadData()
          }, 5000)
        })
        .finally(function () {
          // always executed
        })
    },
    saveDownloadedData: function () {
      var scope = this
      scope.stage = 'saving'
      scope.saving.error = false

      // done going through tables
      if (scope.saving.pointer >= scope.endpoints.length) {
        scope.saveUserSyncedDate()
        scope.showLogs()
        return
      }

      var endpoint = scope.endpoints[scope.saving.pointer]
      scope.progress_message = 'Saving ' + endpoint.title + ' Data...'
      scope.progress_message = 'Saving ' + endpoint.title + ' Data (' + scope.saving.index + ' of ' + (endpoint.downloaded.length + 1) + ')...'

      // skip attempt upload on empty data
      if (endpoint.downloaded.length < 1) {
        console.log('SKIP ' + endpoint.title)
        scope.saving.pointer++
        scope.saving.index = 0
        scope.saveDownloadedData()
        return
      }

      var data = endpoint.downloaded[scope.saving.index]
      data.created_at = scope.timeConvertFromUTC(data.created_at)
      data.updated_at = scope.timeConvertFromUTC(data.updated_at)

      scope.axios
        .post('http://localhost:3000/' + endpoint.local + '/sync', data)
        .then(function (response) {
          // eslint-disable-next-line valid-typeof
          scope.saving.index++
          scope.saving.counter++
          // move to the next table/model
          if (scope.saving.index >= endpoint.downloaded.length) {
            scope.saving.pointer++
            scope.saving.index = 0
          }
          scope.saveDownloadedData()
        })
        .catch(function (error) {
          // handle error
          console.log(error)
          scope.saving.error = true
          scope.progress_message = 'Download Failed, Reconnecting...'
          setTimeout(function () {
            scope.saveDownloadedData()
          }, 5000)
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
    saveUserSyncedDate: function () {
      var scope = this
      var userID = this.$store.getters.getUserID

      scope.axios
        .post('http://localhost:3000/users/synced', { uuid: userID })
        .then(function (response) {
          var data = response.data
          scope.$store.commit('updateSyncedAt', {
            syncedAt: data.synced_at
          })
        })
        .catch(function (error) {
          // handle error
          console.log(error)
        })
        .finally(function () {
          // always executed
        })
    },
    backToIntro: function () {
      var scope = this
      scope.resetInitialData()
    },
    backToDashboard: function () {
      var scope = this
      scope.$parent.closeSyncer()
    },
    resetInitialData: function () {
      var scope = this
      scope.stage = 'intro'
      scope.current = 0
      scope.progress_message = 'Initializing...'

      scope.download.pointer = 0
      scope.download.progress = 0
      scope.download.total = 0
      scope.download.error = false

      scope.upload.pointer = 1
      scope.upload.index = 0
      scope.upload.counter = 0
      scope.upload.progress = 0
      scope.upload.total = 0
      scope.upload.error = false

      scope.packing.pointer = 1
      scope.packing.progress = 0
      scope.packing.total = 0
      scope.packing.error = false

      scope.saving.pointer = 0
      scope.saving.index = 0
      scope.saving.counter = 0
      scope.saving.progress = 0
      scope.saving.total = 0
      scope.saving.error = false
      scope.endpoints = [
        { title: 'Genres', api: 'book-genres', local: 'book-genres', downloaded: [], packed: [] },
        { title: 'Relations', api: 'book-relations', local: 'relations', downloaded: [], packed: [] },
        { title: 'Books', api: 'books', local: 'books', downloaded: [], packed: [] },
        { title: 'Items', api: 'book-items', local: 'items', downloaded: [], packed: [] },
        { title: 'Locations', api: 'book-locations', local: 'locations', downloaded: [], packed: [] },
        { title: 'Book Genres', api: 'book-genre-collections', local: 'book-genre-collections', downloaded: [], packed: [] },
        { title: 'Chapters', api: 'book-chapters', local: 'chapters', downloaded: [], packed: [] },
        { title: 'Chapter Version', api: 'book-chapter-versions', local: 'chapter-versions', downloaded: [], packed: [] },
        { title: 'Characters', api: 'book-characters', local: 'characters', downloaded: [], packed: [] },
        { title: 'Relationships', api: 'book-relation-details', local: 'relation-details', downloaded: [], packed: [] },
        { title: 'Scenes', api: 'book-scenes', local: 'scenes', downloaded: [], packed: [] },
        { title: 'Scene Versions', api: 'book-scene-versions', local: 'scene-versions', downloaded: [], packed: [] },
        { title: 'Scene Items', api: 'book-scene-items', local: 'scene-items', downloaded: [], packed: [] },
        { title: 'Scene Locations', api: 'book-scene-locations', local: 'scene-locations', downloaded: [], packed: [] },
        { title: 'Scene Characters', api: 'book-scene-characters', local: 'scene-characters', downloaded: [], packed: [] }
      ]
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
    .page-syncing.fullscreen .es-page-content {  position: fixed; top: 0px; left: 0px;  background: rgba(31,46,58,0.8); width: 100%; height: 100vh; z-index: 999; }
    .page-syncing.fullscreen .es-card { margin-top:100px; }

    .es-card { width:calc(100% - 40px); max-width:750px; margin:0px auto; margin-top:10px; color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    .es-card .es-card-content { position:relative; padding:20px; min-height:150px; text-align:center; }
    .es-card .es-card-content .intro-message { padding:80px 10px; }
    .es-card .es-card-content .loader { display:inline-block; margin:0px auto; padding:20px 0px; max-width:100px; }

    .es-card .es-card-content .syncer-button {cursor:pointer; background:#862e3b; border:none; color:#fff; padding:10px 40px; border-radius:4px; }
    .es-card .es-card-content .syncer-button:hover { background:#973241;  }

    .es-card .es-card-content .es-progress-bar { margin-top:-8px; margin-bottom:10px; position:relative; background:#ccc; border-radius:8px; height:10px;  }
    .es-card .es-card-content .es-progress { position:absolute; top:0px; left:0px; border-radius:8px; height:10px; background:#43c853; width:0%; height:100%;  }
    .es-card .es-card-content .es-progress.error { background:#ef3551;  }

    .es-card .es-card-header { font-weight:600; position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 10px; border-bottom:1px solid #e0e5ee; }
</style>
