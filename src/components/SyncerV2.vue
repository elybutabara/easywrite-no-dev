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
            </div>
        </div>
        <div v-else class="component-syncing-v2-minimize">
            <span>Syncing: <strong>The Wanno Arc Data</strong></span>
            <span><i class="fas fa-sync fa-spin"></i> Progress: 100/200 (50%)</span>
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
        endpoints: [
          { title: 'Authors', api: 'authors', local: 'authors', downloaded: null, packed: null, skip: true, error: [] },
          { title: 'Genres', api: 'book-genres', local: 'book-genres', downloaded: null, packed: null, skip: true, error: [] },
          { title: 'Relations', api: 'book-relations', local: 'relations', downloaded: null, packed: null, skip: true, error: [] },

          /* first batch*/
          { title: 'Books', api: 'books', local: 'books', downloaded: null, packed: null, skip: false, error: [] },

          /* second batch */
          { title: 'Book Genres', api: 'book-genre-collections', local: 'book-genre-collections', downloaded: null, packed: null, skip: false, error: [] },
          { title: 'Chapters', api: 'book-chapters', local: 'chapters', downloaded: null, packed: null, skip: false },
          { title: 'Items', api: 'book-items', local: 'items', downloaded: null, packed: null, skip: false, error: [] },
          { title: 'Locations', api: 'book-locations', local: 'locations', downloaded: null, packed: null, skip: false, error: [] },
          { title: 'Characters', api: 'book-characters', local: 'characters', downloaded: null, packed: null, skip: false },
          { title: 'Relationships', api: 'book-relation-details', local: 'relation-details', downloaded: null, packed: null, skip: false },
          { title: 'Scenes', api: 'book-scenes', local: 'scenes', downloaded: null, packed: null, skip: false },
          { title: 'Notes', api: 'notes', local: 'notes', downloaded: null, packed: null, skip: false, error: [] }, // can only be added on books i read?
          

          /* third batch */
          { title: 'Chapter Versions', api: 'book-chapter-versions', local: 'chapter-versions', downloaded: null, packed: null, skip: false },
          { title: 'Scene Versions', api: 'book-scene-versions', local: 'scene-versions', downloaded: null, packed: null, skip: false },
          { title: 'Scene Items', api: 'book-scene-items', local: 'scene-items', downloaded: null, packed: null, skip: false },
          { title: 'Scene Locations', api: 'book-scene-locations', local: 'scene-locations', downloaded: null, packed: null, skip: false },
          { title: 'Scene Characters', api: 'book-scene-characters', local: 'scene-characters', downloaded: null, packed: null, skip: false },
          { title: 'Feedbacks', api: 'feedbacks', local: 'feedbacks', downloaded: null, packed: null, skip: false, error: [] },
          { title: 'Feedback Response', api: 'feedback-responses', local: 'feedback-responses', downloaded: null, packed: null, skip: false, error: [] },

          { title: 'Book Readers', api: 'book-readers', local: 'readers', downloaded: null, packed: null, skip: true, error: [] }, // skip or not?

          { title: 'Courses', api: 'courses', local: 'courses', downloaded: null, packed: null, skip: true, error: [] },
          { title: 'Courses Taken', api: 'courses-taken', local: 'courses-taken', downloaded: null, packed: null, skip: true, error: [] },
          { title: 'Packages', api: 'packages', local: 'packages', downloaded: null, packed: null, skip: true, error: [] },
          { title: 'Package Courses', api: 'package-courses', local: 'package-courses', downloaded: null, packed: null, skip: true, error: [] },
          { title: 'Lessons', api: 'lessons', local: 'lessons', downloaded: null, packed: null, skip: true, error: [] },
          { title: 'Lesson Documents', api: 'lesson-documents', local: 'lesson-documents', downloaded: null, packed: null, skip: true, error: [] },

          { title: 'Assignments', api: 'assignments', local: 'assignments', downloaded: null, packed: null, skip: false },
          { title: 'Assignment Manuscripts', api: 'assignment-manuscripts', local: 'assignment-manuscripts', downloaded: null, packed: null, skip: false },

          { title: 'Webinars', api: 'webinars', local: 'webinars', downloaded: null, packed: null, skip: true },
          { title: 'WebinarPresenters', api: 'webinar-presenters', local: 'webinar-presenters', downloaded: null, packed: null, skip: true },
          { title: 'WebinarRegistrants', api: 'webinar-registrants', local: 'webinar-registrants', downloaded: null, packed: null, skip: true },

          { title: 'Author Personal Progress', api: 'author-personal-progress', local: 'author-personal-progress', downloaded: null, packed: null, skip: false },
          { title: 'Notifications', api: 'notifications', local: 'notifications', downloaded: null, packed: null, skip: false }
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
    is_packed: function () {
      var scope = this

      // this will return the number of endpoints that has not been packed
      var not_packed = scope.packable.filter(function (data) {
          return data.packed === null;
      })

      console.log('NOT PACKED ==> ',not_packed)
      return (not_packed.length > 0) ? false : true
    }
  },
  watch: {
    is_packed: function (val) {
      var scope = this
      if (val) {
        console.log('DONE')
        scope.startUpload()
      }
    }
  },
  methods: {
    pack: function (index) {
      var scope = this
      var userID = scope.$store.getters.getUserID
      var endpoint = scope.packable[index]

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
          },2000);
        })
        .finally(function () {
        })
    },
    startPacking: function () {
      var scope = this 
      for (let i = 0; i < scope.packable.length; i++) {
        scope.pack(i)
      }
    },
    upload: function (index) {
      const scope = this
      var endpoint = scope.packable[index]
      
      for (let i = 0; i < endpoint.packed.length; i++) {
        var data = endpoint.packed[i]
        data.created_at = scope.timeConvertToUTC(data.created_at)
        data.updated_at = scope.timeConvertToUTC(data.updated_at)
        data.sync_version = scope.version
      } 
  
      var finalData = endpoint.packed
      var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + scope.api_token,
        'X-Authorization': 'Bearer ' + scope.api_token
      }

      scope.axios.post(window.APP.API.URL + '/' + endpoint.api + '/v2',finalData,{ 'headers': headers })
        .then(function (response) {
          scope.upload_index++
          if (scope.upload_index < scope.packable.length) {
            scope.upload(scope.upload_index)
          }
        })
        .catch(function (error) {
          setTimeout(function() {
            scope.upload(scope.upload_index)
          },4000);
        })
        .finally(function () {
        })
    }, 
    startUpload: function () {
      var scope = this 
      scope.upload(scope.upload_index)
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
    .component-syncing-v2-actions .btn-minimize { border:none; padding:none; background:transparent;  }

    .component-syncing-v2-minimize { position:fixed; bottom:0px; left:0px; background:#007acc; padding:0px 20px; width:100%; height:25px; line-height:25px; color:#fff; text-align:right; z-index:9000; }
    .component-syncing-v2-minimize span { padding-left:8px; }
</style>
