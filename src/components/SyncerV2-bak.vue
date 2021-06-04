<template>
    <div>
        <div v-if="!minimized" class="component-syncing-v2">
            <div class="component-syncing-v2-content">
                <div class="component-syncing-v2-header">
                    <h4>Sync Data</h4>
                    <div class="component-syncing-v2-actions">
                        <button @click="minimize()" class="btn-minimize"><i class="far fa-window-minimize"></i></button>
                    </div>
                </div>
                <div class="component-syncing-v2-body">
                  <div v-if="stage == 'packing'">
                    <p style="font-weight:600;">Fetching Data</p>
                    <div class="es-progress-bar">
                      <div class="es-progress-number">{{ packing_progress }}%</div>
                      <div class="es-progress" v-bind:style="{ width: packing_progress + '%' }"></div>
                    </div>
                  </div>
                  <div v-if="stage == 'uploading'">
                    <p style="font-weight:600;">Uploading <span v-if="pointed_endpoint">{{ pointed_endpoint.title }}</span> [<span>{{ pointed_endpoint.uploaded }}/{{ pointed_endpoint.packed.length }}</span>]</p>
                    
                    <div class="es-progress-bar">
                      <div class="es-progress-number">{{ upload_progress }}%</div>
                      <div class="es-progress" v-bind:style="{ width: upload_progress + '%' }"></div>
                    </div>
                  </div>
                  <div v-if="stage == 'downloading'">
                    <p style="font-weight:600;">Downloading</p>
                    
                    <div class="es-progress-bar">
                      <div class="es-progress-number">{{ upload_progress }}%</div>
                      <div class="es-progress" v-bind:style="{ width: upload_progress + '%' }"></div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <div v-else class="component-syncing-v2-minimize">
            <span>{{ stage }}</span>
            <span><i class="fas fa-sync fa-spin"></i> Uploading Data ({{ upload_progress }}%)</span>
            <span style="cursor:pointer;" @click="maximize()"><i class="fas fa-window-maximize"></i></span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SyncerV2',
  data: function () {
    return {
        version: 19, // syncing version
        api_token: '',
        minimized: false,
        upload_index: 0,
        upload_total: 0,// total numbers of data that has been successfully uploaded
        stage: '',
        progress_percentage: 0,
        endpoints: [
          { title: 'Authors', api: 'authors', local: 'authors', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50 },
          { title: 'Genres', api: 'book-genres', local: 'book-genres', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50 },
          { title: 'Relations', api: 'book-relations', local: 'relations', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50 },

          /* first batch*/
          { title: 'Books', api: 'books', local: 'books', downloaded: null, packed: null, skip: false, error: [], chunkSize: 10 },

          /* second batch */
          { title: 'Book Genres', api: 'book-genre-collections', local: 'book-genre-collections', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50 },
          { title: 'Chapters', api: 'book-chapters', local: 'chapters', downloaded: null, packed: null, skip: false, chunkSize: 50 },
          { title: 'Items', api: 'book-items', local: 'items', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50 },
          { title: 'Locations', api: 'book-locations', local: 'locations', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50 },
          { title: 'Characters', api: 'book-characters', local: 'characters', downloaded: null, packed: null, skip: false, chunkSize: 50 },
          { title: 'Relationships', api: 'book-relation-details', local: 'relation-details', downloaded: null, packed: null, skip: false, chunkSize: 50 },
          { title: 'Scenes', api: 'book-scenes', local: 'scenes', downloaded: null, packed: null, skip: false, chunkSize: 50 },
          { title: 'Notes', api: 'notes', local: 'notes', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50 }, // can only be added on books i read?
          

          /* third batch */
          { title: 'Chapter Versions', api: 'book-chapter-versions', local: 'chapter-versions', downloaded: null, packed: null, skip: false, chunkSize: 3 },
          { title: 'Scene Items', api: 'book-scene-items', local: 'scene-items', downloaded: null, packed: null, skip: false },
          { title: 'Scene Locations', api: 'book-scene-locations', local: 'scene-locations', downloaded: null, packed: null, skip: false, chunkSize: 50 },
          { title: 'Scene Characters', api: 'book-scene-characters', local: 'scene-characters', downloaded: null, packed: null, skip: false, chunkSize: 50 },
          { title: 'Feedbacks', api: 'feedbacks', local: 'feedbacks', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50 },
          { title: 'Feedback Response', api: 'feedback-responses', local: 'feedback-responses', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50 },
          { title: 'Scene Versions', api: 'book-scene-versions', local: 'scene-versions', downloaded: null, packed: null, skip: false, chunkSize: 3 },

          { title: 'Book Readers', api: 'book-readers', local: 'readers', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50 }, // skip or not?

          { title: 'Courses', api: 'courses', local: 'courses', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50 },
          { title: 'Courses Taken', api: 'courses-taken', local: 'courses-taken', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50 },
          { title: 'Packages', api: 'packages', local: 'packages', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50 },
          { title: 'Package Courses', api: 'package-courses', local: 'package-courses', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50 },
          { title: 'Lessons', api: 'lessons', local: 'lessons', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50 },
          { title: 'Lesson Documents', api: 'lesson-documents', local: 'lesson-documents', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50 },

          { title: 'Assignments', api: 'assignments', local: 'assignments', downloaded: null, packed: null, skip: false, chunkSize: 50 },
          { title: 'Assignment Manuscripts', api: 'assignment-manuscripts', local: 'assignment-manuscripts', downloaded: null, packed: null, skip: false, chunkSize: 50 },

          { title: 'Webinars', api: 'webinars', local: 'webinars', downloaded: null, packed: null, skip: true, chunkSize: 50 },
          { title: 'WebinarPresenters', api: 'webinar-presenters', local: 'webinar-presenters', downloaded: null, packed: null, skip: true, chunkSize: 50 },
          { title: 'WebinarRegistrants', api: 'webinar-registrants', local: 'webinar-registrants', downloaded: null, packed: null, skip: true, chunkSize: 50 },

          { title: 'Author Personal Progress', api: 'author-personal-progress', local: 'author-personal-progress', downloaded: null, packed: null, skip: false, chunkSize: 40 },
          { title: 'Notifications', api: 'notifications', local: 'notifications', downloaded: null, packed: null, skip: false, chunkSize: 50 }
      ],
    }
  }, 
  computed: {
    packable: function () {
      var scope = this
      return scope.endpoints.filter(function (data) {
          return !data.skip ;
      })
    },
    not_packed: function () {
      var scope = this
      var not_packed = scope.packable.filter(function (data) {
          return data.packed === null;
      })

      return not_packed
    },
    total_packed_data: function () {
      var scope = this
      var total = 0
      scope.packable.filter(function (data) {
        total += (data.packed !== null) ? data.packed.length : 0;
      })

      return total;
    },
    is_packed: function () {
      var scope = this

      console.log('NOT PACKED ==> ',scope.not_packed)
      return (scope.not_packed.length > 0) ? false : true
    },
    packing_progress: function() {
      var scope = this
      var progress = ((scope.packable.length - scope.not_packed.length) /  scope.packable.length) * 100

      console.log('PROGRESS ==> ',Math.ceil(progress))

      return Math.ceil(progress)
    },
    pointed_endpoint: function () {
      var scope = this
      var pointed = scope.packable[scope.upload_index]
      pointed = (pointed) ? pointed : null;

      console.log('HERE ==>',pointed)
      return pointed
    },
    is_pointed_endpoint_upload_done: function () {
      var scope = this
      if (!scope.pointed_endpoint || !scope.pointed_endpoint.chunks) {
        return 'skip';
      }

      if (scope.pointed_endpoint.chunks.length < 1) {
        return 'skip'
      }

      var not_done = scope.pointed_endpoint.chunks.filter(function (data) {
          return !data.done;
      })

      console.log('NOT UPLOAD DONE ==> ', not_done)
      return (not_done.length > 0) ? false : true
    },
    upload_progress: function () {
      var scope = this
      if (scope.total_packed_data < 1) {
        return 100
      }
      var progress = (scope.upload_total / scope.total_packed_data)  * 100

      return Math.ceil(progress)
    },
    is_uploaded: function () {
      var scope = this
      return (scope.upload_progress >= 100) ? true : false
    },
  },
  watch: {
    is_packed: function (val) {
      var scope = this
      if (val) {
        console.log('DONE')
        setTimeout(function(){
          scope.startUpload()
        },500);
      }
    },
    is_pointed_endpoint_upload_done: function (val) {
      var scope = this
      if ((val || val == 'skip') && scope.upload_index < scope.packable.length) {
          scope.upload_index++
          scope.initializeUploadEnpoint()
      }
    },
    is_uploaded: function (val) {
      var scope = this 
      if (val) {
        scope.startDownload();
      }
    }
  },
  methods: {
    pack: function (index) {
      var scope = this
      var userID = scope.$store.getters.getUserID
      var endpoint = scope.packable[index]

      scope.stage = 'packing'
      
      scope.axios.get('http://localhost:3000/' + endpoint.local + '/syncable',{ params: {userID: userID} })
        .then(function (response) {
          scope.packable[index].packed = (response.data) ? response.data : []
        })
        .catch(function (error) {
          if (!scope.packable[index].pack_error) {
             scope.$set(scope.packable[index],'pack_error',1)
          } else {
            scope.packable[index].pack_error += 1
          }

          setTimeout(function(){
            scope.pack(index)
          },4000);
        })
        .finally(function () {
          
        })
    },
    startPacking: function () {
      var scope = this 
      scope.LOGTIME('START TIME:');
      scope.stage = 'Packing'
      for (let i = 0; i < scope.packable.length; i++) {
        scope.pack(i)
      }
    },
    initializeUploadEnpoint: function () {
      const scope = this
      var index = scope.upload_index
      var endpoint = scope.pointed_endpoint
      
      if (scope.upload_index == scope.packable.length) {
        console.log('START DOWNLOAD')
        return
      }

      if (endpoint.packed.length < 1) {
        scope.upload_index++
        scope.initializeUploadEnpoint()
      }

      for (let i = 0; i < endpoint.packed.length; i++) {
        var data = endpoint.packed[i]
        data.created_at = scope.timeConvertToUTC(data.created_at)
        data.updated_at = scope.timeConvertToUTC(data.updated_at)
        data.sync_version = scope.version
      } 

      var URL = window.APP.API.URL + '/' + endpoint.api + '/v2';

      var rows = endpoint.packed
      var chunks = scope.CHUNK_ARRAY(rows,endpoint.chunkSize);
      scope.$set(endpoint,'chunks',[])
      scope.$set(endpoint,'uploaded',0)
 
      for (let i = 0; i < chunks.length; i++) {
        var chunk = chunks[i]
        endpoint.chunks.push({
          done: false,
          rows: chunk
        });
        if (i > 0 && (i % 10) == 0) {
          console.log(' PAUSE FOR 10 SECS TO PREVENT HIGH VOLUME OF REQUEST ',i)
          setTimeout(function(){
            var _chunk = endpoint.chunks[i]
            scope.upload(URL,_chunk,i);
          },10000);
        } else {
          var _chunk = endpoint.chunks[i]
          scope.upload(URL,_chunk,i);
        }
        
      }
      
      console.log('POINTED ENDPOINT ==> ',scope.pointed_endpoint) 
    }, 
    upload: function (URL,chunk, index = 0) {
      var scope = this
      var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + scope.api_token,
        'X-Authorization': 'Bearer ' + scope.api_token
      }

      var FORMDATA = chunk.rows
      scope.axios.post(URL,FORMDATA,{ 'headers': headers })
        .then(function (response) {
          chunk.done = true
          scope.pointed_endpoint.uploaded += chunk.rows.length
          scope.upload_total += chunk.rows.length
        })
        .catch(function (error) {
          setTimeout(function() {
            scope.upload(URL,chunk, index)
          },4000);
        })
        .finally(function () {
        
        })
    },
    startUpload: function () {
      var scope = this 
      scope.stage = 'uploading'
      scope.initializeUploadEnpoint()
    },
    startDownload: function () {
      var scope = this
      scope.LOGTIME('END TIME:');
      scope.stage = 'downloading'
    },
    minimize: function () {
      this.minimized = true
    },
    maximize: function () {
      this.minimized = false
    },
    timeConvertToUTC: function (datetime) {
      if (datetime === null || datetime === 'undefined') { return null }
      return moment(datetime).utc().format('YYYY-MM-DD HH:mm:ss').toString()
    },
  },
  mounted () {
    const scope = this
    scope.api_token = scope.$store.getters.getUserToken
    scope.startPacking();
    // console.log(' CHUNKED ===> ',scope.CHUNK_ARRAY(scope.endpoints,10))
  } 
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .component-syncing-v2 { position:fixed; width:100%; height:100vh; z-index:9000; background:rgba(0,0,0,0.7); }
    .component-syncing-v2-content { width:650px; height:250px; background:#fff; margin:0px auto; margin-top:calc(50vh - 225px); border-radius: 5px; }
    .component-syncing-v2-header { padding:15px;  }
    .component-syncing-v2-header h4 { font-size:16px; margin-bottom:0px; color:#333; font-weight:900;  }
    .component-syncing-v2-actions { float:right; text-align:right; margin-top:-25px;  }
    .component-syncing-v2-actions .btn-minimize { border:none;  background:transparent;  }

    .component-syncing-v2-body { padding:50px 40px; text-align:center;  }

    .component-syncing-v2-minimize { position:fixed; bottom:0px; left:0px; background:#007acc; padding:0px 20px; width:100%; height:25px; line-height:25px; color:#fff; text-align:right; z-index:9000; }
    .component-syncing-v2-minimize span { padding-left:8px; }

    .es-progress-bar { margin-top:-8px; margin-bottom:10px; position:relative; background:#ccc; border-radius:8px; height:15px;  }
    .es-progress { position:absolute; top:0px; left:0px; border-radius:8px; height:15px; background:#43c853; width:0%; height:100%;  }
    .es-progress-number { position:absolute; top:0px; left:calc(50% - 15px); color:#fff; z-index:5000; font-size:12px;  }
    .es-progress.error { background:#ef3551;  }
</style>
