<template>
    <div v-if="ready">
        <div v-if="!minimized" class="component-syncing-v2">
            <div class="component-syncing-v2-content">
                <div class="component-syncing-v2-header">
                    <h4>Sync Data</h4>
                    <div class="component-syncing-v2-actions">
                        <button @click="minimize()" class="btn-minimize"><i class="far fa-window-minimize"></i></button>
                    </div>
                </div>
                <div v-if="pointed_endpoint" class="component-syncing-v2-body">
                  <p style="font-weight:600;">{{ main_endpoint.title }}</p>
                    
                    <div class="es-progress-bar">
                      <div class="es-progress-number">{{ main_progress }}%</div>
                      <div class="es-progress" v-bind:style="{ width: main_progress + '%' }"></div>
                    </div>
                     {{ pointed_endpoint_status }} {{ pointed_endpoint.title }} Data 
                     <span v-if="pointed_endpoint.packed && pointed_endpoint.packed.length > 0 && pointed_endpoint_status == 'Uploading'">[{{ pointed_endpoint_uploaded }}/{{ pointed_endpoint.packed.length }}]</span>
                     <span v-if="pointed_endpoint.downloaded && pointed_endpoint.downloaded.length > 0 && pointed_endpoint_status == 'Saving'">[{{ pointed_endpoint_saved }}/{{ pointed_endpoint.downloaded.length }}]</span>
                </div>`
            </div>`
        </div>
        <div v-else class="component-syncing-v2-minimize">
            <span>
              <i class="fas fa-sync fa-spin"></i>
              {{ pointed_endpoint_status }}  
              {{ pointed_endpoint.title }} Data
              <template v-if="pointed_endpoint.packed && pointed_endpoint.packed.length > 0 && pointed_endpoint_status == 'Uploading'">[{{ pointed_endpoint_uploaded }}/{{ pointed_endpoint.packed.length }}]</template>
              <template v-if="pointed_endpoint.downloaded && pointed_endpoint.downloaded.length > 0 && pointed_endpoint_status == 'Saving'">[{{ pointed_endpoint_saved }}/{{ pointed_endpoint.downloaded.length }}]</template>
              {{ main_progress }}%
            </span>
            <span style="cursor:pointer;" @click="maximize()"><i class="fas fa-window-maximize"></i></span>
        </div>
    </div>
</template>

<script>
/*  ---- STEPS ----
  STEP 1: get all books
  STEP 2: get all books i read
  STEP 3: append both books and books i read to the "endpoints" array
  STEP 4: append the post books endpoints 

*/
export default {
  name: 'SyncerV2',
  data: function () {
    return {
        ready: false,
        version: 19, // syncing version
        api_token: '',
        minimized: false,
        endpoint_index: 0,
        endpoint_upload_request_done: null,
        endpoint_upload_request_count: null,
        endpoint_save_local_request_done: null,
        endpoint_save_local_request_count: null,
        pointed_endpoint: null,
        pointed_endpoint_status: null,
        pointed_endpoint_uploaded: 0,
        pointed_endpoint_saved: 0,
        endpoint_total_counter: 0,
        endpoint_done_counter: 0,
        endpoints: [
          { title: 'Authors', type: 'default', api: 'authors', local: 'authors', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50, done: false },
          { title: 'Genres', type: 'default', api: 'book-genres', local: 'book-genres', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50, done: false },
          { title: 'Relations', type: 'default', api: 'book-relations', local: 'relations', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50, done: false },
        ],
        bookChildren: [
          { title: 'Book Genres', api: 'book-genre-collections', local: 'book-genre-collections', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50, done: false },
          { title: 'Chapters', api: 'book-chapters', local: 'chapters', downloaded: null, packed: null, skip: false, chunkSize: 50, done: false },
          { title: 'Items', api: 'book-items', local: 'items', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50, done: false },
          { title: 'Locations', api: 'book-locations', local: 'locations', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50, done: false },
          { title: 'Characters', api: 'book-characters', local: 'characters', downloaded: null, packed: null, skip: false, chunkSize: 50, done: false },
          { title: 'Relationships', api: 'book-relation-details', local: 'relation-details', downloaded: null, packed: null, skip: false, chunkSize: 50, done: false },
          { title: 'Scenes', api: 'book-scenes', local: 'scenes', downloaded: null, packed: null, skip: false, chunkSize: 50, done: false },
          
          { title: 'Chapter Versions', api: 'book-chapter-versions', local: 'chapter-versions', downloaded: null, packed: null, skip: false, chunkSize: 3, done: false },
          { title: 'Scene Items', api: 'book-scene-items', local: 'scene-items', downloaded: null, packed: null, skip: false, done: false },
          { title: 'Scene Locations', api: 'book-scene-locations', local: 'scene-locations', downloaded: null, packed: null, skip: false, chunkSize: 50, done: false },
          { title: 'Scene Characters', api: 'book-scene-characters', local: 'scene-characters', downloaded: null, packed: null, skip: false, chunkSize: 50, done: false },
          { title: 'Feedbacks', api: 'feedbacks', local: 'feedbacks', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50, done: false },
          { title: 'Feedback Response', api: 'feedback-responses', local: 'feedback-responses', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50, done: false },
          { title: 'Scene Versions', api: 'book-scene-versions', local: 'scene-versions', downloaded: null, packed: null, skip: false, chunkSize: 3, done: false },
        ],
        booksIReadChildren: [
          { title: 'Book Genres', api: 'book-genre-collections', local: 'book-genre-collections', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50, done: false },
          { title: 'Scenes', api: 'book-scenes', local: 'scenes', downloaded: null, packed: null, skip: false, chunkSize: 50, done: false },

          { title: 'Chapter Versions', api: 'book-chapter-versions', local: 'chapter-versions', downloaded: null, packed: null, skip: false, chunkSize: 3, done: false },
          { title: 'Feedbacks', api: 'feedbacks', local: 'feedbacks', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50, done: false },
          { title: 'Feedback Response', api: 'feedback-responses', local: 'feedback-responses', downloaded: null, packed: null, skip: false, error: [], chunkSize: 50, done: false },
          { title: 'Scene Versions', api: 'book-scene-versions', local: 'scene-versions', downloaded: null, packed: null, skip: false, chunkSize: 3, done: false },
        ],
        postBook: [
          { title: 'Author Personal Progress', type: 'default', api: 'author-personal-progress', local: 'author-personal-progress', downloaded: null, packed: null, skip: false, chunkSize: 40, done: false },
          { title: 'Courses', type: 'default', api: 'courses', local: 'courses', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50, done: false },
          { title: 'Courses Taken', type: 'default', api: 'courses-taken', local: 'courses-taken', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50, done: false },
          { title: 'Packages',type: 'default',  api: 'packages', local: 'packages', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50, done: false },
          { title: 'Package Courses', type: 'default', api: 'package-courses', local: 'package-courses', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50, done: false },
          { title: 'Lessons', type: 'default', api: 'lessons', local: 'lessons', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50, done: false },
          { title: 'Lesson Documents', type: 'default', api: 'lesson-documents', local: 'lesson-documents', downloaded: null, packed: null, skip: true, error: [], chunkSize: 50, done: false },
        
          { title: 'Notes', api: 'notes', local: 'notes', downloaded: null, packed: null, skip: false, error: [], chunkSize: 25 }, // can only be added on books i read?
          { title: 'Assignments', type: 'default', api: 'assignments', local: 'assignments', downloaded: null, packed: null, skip: false, chunkSize: 50, done: false },
          { title: 'Assignment Manuscripts', type: 'default', api: 'assignment-manuscripts', local: 'assignment-manuscripts', downloaded: null, packed: null, skip: false, chunkSize: 50, done: false },
          { title: 'Notifications', type: 'default', api: 'notifications', local: 'notifications', downloaded: null, packed: null, skip: false, chunkSize: 50, done: false },

          { title: 'Webinars', type: 'default', api: 'webinars', local: 'webinars', downloaded: null, packed: null, skip: true, chunkSize: 50 },
          { title: 'WebinarPresenters', type: 'default', api: 'webinar-presenters', local: 'webinar-presenters', downloaded: null, packed: null, skip: true, chunkSize: 50 },
          { title: 'WebinarRegistrants', type: 'default', api: 'webinar-registrants', local: 'webinar-registrants', downloaded: null, packed: null, skip: true, chunkSize: 50 },
        ]
    }
  }, 
  computed: {
    books: function () {
      // this is fetched during login
      var authorUUID = this.$store.getters.getAuthorID
      return this.$store.getters.getBooksByAuthor(authorUUID)
    },
    books_i_read: function () {
      // this is fetched during login
      var authorUUID = this.$store.getters.getAuthorID
      return this.$store.getters.getBooksIReadByAuthor(authorUUID)
    },

    main_endpoint: function () {
      var scope = this
      var endpoint = scope.endpoints[scope.endpoint_index]

      return endpoint
    },
    main_progress: function () {
      var scope = this
      var progress = (scope.endpoint_done_counter / scope.endpoint_total_counter) * 100
      return Math.ceil(progress)
    },
  },
  watch: {
    endpoint_upload_request_done: function (val) {
      var scope = this
      if (val === null) {
        return;
      }
     
     if (val == scope.endpoint_upload_request_count) {
       setTimeout(function(){
         scope.fetchDataFromWeb(scope.pointed_endpoint);

        // reset
        scope.endpoint_upload_request_count = null
        scope.endpoint_upload_request_done = null
       },1000);
      
     }
    },
    endpoint_save_local_request_done: function (val) {
      var scope = this
      if (val === null) {
        return;
      }

     if (val == scope.endpoint_save_local_request_count) {
       setTimeout(function(){
         scope.next()

        // reset
        scope.endpoint_save_local_request_count = null
        scope.endpoint_save_local_request_done = null
       },1000);
      
     }
    }
  },
  methods: {
    start: function () {
      var scope = this
      var endpoint = scope.endpoints[scope.endpoint_index]
      scope.ready = true
      scope.LOGTIME('START TIME:');

      scope.processEndpoint(endpoint);
    },
    processEndpoint: function(endpoint) {
      var scope = this
      scope.pointed_endpoint = endpoint

      if (scope.endpoint_index >= scope.endpoints.length) {
        return;
      }
      
      if (!endpoint || endpoint.skip) {
        scope.fetchDataFromWeb(endpoint);
        return;
      }

      if (endpoint.type === 'book' || endpoint.type === 'books-i-read') {
        scope.saveDataToWeb(endpoint);
        return;
      }

      scope.fetchDataFromApp(endpoint);
    },
    fetchDataFromApp: function (endpoint) {
      var scope = this
      var userID = scope.$store.getters.getUserID
      var parent_uuid = (endpoint.book_uuid) ? endpoint.book_uuid : null

      scope.pointed_endpoint_status = 'Packing'
      scope.axios.get('http://localhost:3000/' + endpoint.local + '/syncable',{ params: {userID: userID, parent_uuid: parent_uuid } })
      .then(function (response) {
        endpoint.packed = (response.data) ? response.data : []
        scope.saveDataToWeb(endpoint);
      })
      .catch(function (error) {
        setTimeout(function(){
          scope.fetchDataFromApp(endpoint)
        },5000);
      })
    },
    saveDataToWeb: function (endpoint) {
      var scope = this
      
      if (!endpoint.packed || endpoint.packed.length < 1) {
        scope.fetchDataFromWeb(endpoint);
        return;
      }

      scope.pointed_endpoint_status = 'Uploading'
      scope.pointed_endpoint_uploaded = 0

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

      // use this to detect whether or not we move to fetchDataFromWeb
      scope.endpoint_upload_request_count = chunks.length
      scope.endpoint_upload_request_done = 0


      for (let i = 0; i < chunks.length; i++) {
        var chunk = chunks[i]
        endpoint.chunks.push({
          done: false,
          rows: chunk
        });

        if (i > 0 && (i % 5) == 0) {
          setTimeout(function(){
            var _chunk = endpoint.chunks[i]
            scope.upload(URL,_chunk,i);
          },5000);
        } else {
          var _chunk = endpoint.chunks[i]
          scope.upload(URL,_chunk,i);
        }
      }

      /*
      console.log('CHUNKS ===> ',chunks)
      scope.fetchDataFromWeb(endpoint);
      */
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
          scope.endpoint_upload_request_done++
          scope.pointed_endpoint_uploaded += chunk.rows.length
          //scope.upload_total += chunk.rows.length
        })
        .catch(function (error) {
          setTimeout(function() {
            scope.upload(URL,chunk, index)
          },4000);
        })
        .finally(function () {
        
        })
    },
    fetchDataFromWeb: function (endpoint) {
      var scope = this
  
      var lastSyncedDate = scope.timeConvertToUTC(scope.$store.getters.getUserSyncedDate)
      var parent_uuid = (endpoint.book_uuid) ? endpoint.book_uuid : null
      
      scope.pointed_endpoint_status = 'Fetching'
      scope.axios.get(window.APP.API.URL + '/' + endpoint.api + '/v2',
        {
          params: {
            synced_at: lastSyncedDate, 
            uuid: parent_uuid,
            parent_uuid: parent_uuid
          },
          'headers': {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + scope.api_token,
            'X-Authorization': 'Bearer ' + scope.api_token
          }
        })
      .then(function (response) {
        endpoint.downloaded = (response.data) ? response.data : []
        scope.saveDataToApp(endpoint)
      })
      .catch(function (error) {
        setTimeout(function(){
          scope.fetchDataFromWeb(endpoint)
        },5000);
      })
    },
    saveDataToApp: function (endpoint) {
      var scope = this

      if (!endpoint.downloaded || endpoint.downloaded.length < 1) {
        scope.next()
        return;
      }

      scope.pointed_endpoint_status = 'Saving'
      scope.pointed_endpoint_saved = 0

      for (let i = 0; i < endpoint.downloaded.length; i++) {
        var data = endpoint.downloaded[i]
        data.created_at = scope.timeConvertToUTC(data.created_at)
        data.updated_at = scope.timeConvertToUTC(data.updated_at)
        data.sync_version = scope.version
      } 

      var URL = 'http://localhost:3000/' + endpoint.local + '/v2';

      var rows = endpoint.downloaded
      var chunks = scope.CHUNK_ARRAY(rows,endpoint.chunkSize);
      
      scope.$set(endpoint,'chunks',[])
      scope.$set(endpoint,'uploaded',0)

      // use this to detect whether or not we move to fetchDataFromWeb
      scope.endpoint_save_local_request_count = chunks.length
      scope.endpoint_save_local_request_done = 0

      for (let i = 0; i < chunks.length; i++) {
        var chunk = chunks[i]
        endpoint.chunks.push({
          done: false,
          rows: chunk
        });

        if (i > 0 && (i % 5) == 0) {
          setTimeout(function(){
            var _chunk = endpoint.chunks[i]
            scope.saveToLocalDB(URL,_chunk,i);
          },5000);
        } else {
          var _chunk = endpoint.chunks[i]
          scope.saveToLocalDB(URL,_chunk,i);
        }
      }
    },
    saveToLocalDB: function (URL,chunk, index = 0) {
      var scope = this
      var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + scope.api_token,
        'X-Authorization': 'Bearer ' + scope.api_token
      }

      var FORMDATA = chunk.rows
      scope.axios.post('http://localhost:3000/' + endpoint.local + '/sync', data)
        .then(function (response) {
          chunk.done = true
          scope.endpoint_save_local_request_done++
          scope.pointed_endpoint_saved += chunk.rows.length
          //scope.upload_total += chunk.rows.length
        })
        .catch(function (error) {
          setTimeout(function() {
            scope.saveToLocalDB(URL,chunk, index)
          },4000);
        })
        .finally(function () {
        
        })
    },
    next: function () {
      var scope = this
      var main_endpoint =  scope.main_endpoint
     

      // books or others except book childrens e.g chapter, scenes
      if (main_endpoint.children && main_endpoint.children.length > 0 && main_endpoint.child_index < main_endpoint.children.length) {
        var child_index = main_endpoint.child_index

        var endpoint = main_endpoint.children[child_index]
        main_endpoint.child_index++

        scope.processEndpoint(endpoint);

      } else {
        scope.endpoint_index++;

        var endpoint = scope.endpoints[scope.endpoint_index]
        scope.processEndpoint(endpoint);
      }

       scope.endpoint_done_counter++;

      if (scope.endpoint_index == scope.endpoints.length ) {
        scope.LOGTIME('END TIME')
        // update last synced at data
        // set timeout to resync
        return;
      }

      
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
    addBooksToEndpoint: function () {
      var scope = this
      var rows = scope.books

      for(let i = 0; i < rows.length; i++) {
        var row = rows[i]

        var children = JSON.parse(JSON.stringify(scope.bookChildren))
        for (let x = 0; x < children.length; x++) {
          var child = children[x]
          scope.$set(child,'book_uuid',row.uuid)
        }

        var packed = []
        packed.push(row)
        scope.endpoints.push({ title: row.title, type: 'book', api: 'books', local: 'books', downloaded: null, packed: packed, skip: false, error: [], chunkSize: 1, done: false, children: children, child_index: 0 },);
      }
      scope.addBooksIReadToEndpoint();
    },
    addBooksIReadToEndpoint: function () {
      var scope = this
      var rows = scope.books_i_read
    
      for(let i = 0; i < rows.length; i++) {
        var row = rows[i]
        var children = JSON.parse(JSON.stringify(scope.booksIReadChildren))
        for (let x = 0; x < children.length; x++) {
          var child = children[x]
          scope.$set(child,'book_uuid',row.uuid)
        }

        var packed = []
        packed.push(row)
        scope.endpoints.push({ title: row.title, type: 'book', api: 'books', local: 'books', downloaded: null, packed: packed, skip: false, error: [], chunkSize: 1, done: false, children: children, child_index: 0 },);
      }
      scope.addPostBookEndpoints();
    },
    addPostBookEndpoints: function() {
      var scope = this
      var rows = scope.postBook
    
      for(let i = 0; i < rows.length; i++) {
        var row = rows[i]
        scope.endpoints.push(row);
      }

      var count = 0;
      for (let i = 0; i < scope.endpoints.length; i++) {
        var data = scope.endpoints[i]
        count++;
        count += (data.children) ? data.children.length  : 0;
      }

      scope.endpoint_total_counter = count
      scope.start();
    }
  },
  mounted () {
    const scope = this
    scope.api_token = scope.$store.getters.getUserToken
    scope.addBooksToEndpoint();
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
