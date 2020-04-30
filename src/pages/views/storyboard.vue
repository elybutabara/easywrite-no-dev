<template>
<div class="page-storyboard" style="position:relative; width:100%; height:calc(100vh - 77px);">
    <div v-if="page.is_ready">
        <div class="es-page-head">
            <div class="inner">
                <div class="details">
                    <h4>{{ book.title }}</h4>
                    <small>{{$t('BELOW_ARE_THE_LIST_OF_SCENES_UNDER')}} {{ book.title }}</small>
                </div>
                <div class="actions">
                    <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'chapter-form', tabComponent: 'chapter-form', tabData: { book: book, chapter: null }, tabTitle: $t('NEW_CHAPTER'), newTab: true})">{{$t('NEW_CHAPTER').toUpperCase()}}</button>
                </div>
            </div>
        </div>
        <div class="es-page-breadcrumbs">
        <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
        /
        <button class="current">{{ $tc('STORYBOARD', 2) }}</button>
        </div>
        <div class="es-page-content">
            <draggable v-model="chapters" group="chapters" draggable=".handle-chapters">
            <div style="padding:5px 10px; display:flex; min-height:200px;"  v-for="chapter in chapters" v-bind:key="chapter.id" group="chapters" class="handle-chapters">
                <div style="padding:5px 10px; background:transparent; width:25%;">
                    <div style="background:#fff; padding:10px 10px; border: 1px solid #e0e5ee; border-radius: 3px;">
                        <p class="ellipsis-2" style="font-weight:600;">{{ displayTitle(chapter.title) }}</p>
                        <i class="ellipsis-3">
                            {{ chapter.short_description || $t('NO_SHORT_DESCRIPTION') + '...' }}
                        </i>
                        <br/>
                    </div>
                </div>
                <draggable :list="$store.getters.getScenesByChapter(chapter.uuid)" group="scenes" @change="sortScene(chapter.uuid)" :empty-insert-threshold="100" draggable=".handle-scenes"  style="padding:0px 5px;  background:transparent; width:75%; display:flex; flex-wrap: wrap;">
                    <div style="z-index:9000; width:calc(33.33% - 10px);  margin:5px; margin-bottom:10px;" class="handle-scenes" :key="scene.id" v-for="scene in $store.getters.getScenesByChapter(chapter.uuid)">
                        <div style=" background:#fff; padding:10px 20px; border: 1px solid #e0e5ee; border-radius: 3px;">
                            <p class="ellipsis-2" style="font-weight:600;">{{ displayTitle(scene.title) }}</p>
                            <div style="margin-bottom:5px;">
                                <p style="margin:0px;"><i class="las la-info-circle"></i> Short Description</p>
                                <span style="color:#5c7c95; padding-left:20px;">{{ scene.short_description || 'No short description' }}</span>
                            </div>
                            <div style="margin-bottom:5px;">
                                <p style="margin:0px;"><i class="las la-clock"></i> Date Start</p>
                                <span style="color:#5c7c95; padding-left:20px;">{{ scene.date_starts || 'No short description' }}</span>
                            </div>
                            <div style="margin-bottom:5px;">
                                <p style="margin:0px;"><i class="las la-clock"></i> Date End</p>
                                <span style="color:#5c7c95; padding-left:20px;">{{ scene.date_ends || 'No short description' }}</span>
                            </div>
                            <div style="margin-bottom:5px;">
                                <p style="margin:0px;"><i class="las la-cloud-sun"></i> Weather</p>
                                <span style="color:#5c7c95; padding-left:20px;">{{ scene.weather_type || 'No short description' }}</span>
                            </div>
                        </div>
                    </div>
                </draggable>
            </div>
            </draggable>
            <!-- OTHER SCENES --->
            <div style="padding:5px 10px; display:flex;" >
                <div style="padding:5px 10px; background:transparent; width:25%;">
                    <div style="background:#fff; padding:10px 10px; border: 1px solid #e0e5ee; border-radius: 3px;">
                        <p class="ellipsis-2" style="font-weight:600;">Other Scenes</p>
                        <i class="ellipsis-3">
                            A list of scenes that does not belong to any chapters
                        </i>
                        <br/>
                    </div>
                </div>
                <draggable :list="$store.getters.getScenesByBook(bookUUID)" group="scenes" @change="sortScene(null)" draggable=".handle-scenes"  style="padding:0px 5px; background:transparent; width:75%; display:flex; flex-wrap: wrap;">
                    <div style="z-index:9000; width:calc(33.33% - 10px);  margin:5px; margin-bottom:10px;" class="handle-scenes" :key="scene.id" v-for="scene in $store.getters.getScenesByBook(bookUUID)">
                        <div style=" background:#fff; padding:10px 20px; border: 1px solid #e0e5ee; border-radius: 3px;">
                            <p class="ellipsis-2" style="font-weight:600;">{{ displayTitle(scene.title) }}</p>
                            <div style="margin-bottom:5px;">
                                <p style="margin:0px;"><i class="las la-info-circle"></i> Short Description</p>
                                <span style="color:#5c7c95; padding-left:20px;">{{ scene.short_description || 'No short description' }}</span>
                            </div>
                            <div style="margin-bottom:5px;">
                                <p style="margin:0px;"><i class="las la-clock"></i> Date Start</p>
                                <span style="color:#5c7c95; padding-left:20px;">{{ scene.date_starts || 'No short description' }}</span>
                            </div>
                            <div style="margin-bottom:5px;">
                                <p style="margin:0px;"><i class="las la-clock"></i> Date End</p>
                                <span style="color:#5c7c95; padding-left:20px;">{{ scene.date_ends || 'No short description' }}</span>
                            </div>
                            <div style="margin-bottom:5px;">
                                <p style="margin:0px;"><i class="las la-cloud-sun"></i> Weather</p>
                                <span style="color:#5c7c95; padding-left:20px;">{{ scene.weather_type || 'No short description' }}</span>
                            </div>
                        </div>
                    </div>
                </draggable>
            </div>
        </div>
    </div>
    <div v-else style="position:absolute; top:0px; left:0px; background:#fff; width:100%; height:100%; text-align:center; padding-top:calc(50vh - 200px);">
        <img style="width:100px;" class="loader" src="@/assets/img/loader-cog.svg">
        <p style="margin-top:10px;">Loading Story Board, please wait...</p>
    </div>
</div>

</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'storyboard',
  props: ['properties'],
  components: {
    draggable
  },
  data: function () {
    return {
      page: {
        is_ready: false
      },
      bookUUID: '',
      scenes: []
    }
  },
  computed: {
    book: function () {
      return this.properties
    },
    chapters: {
      get () {
        let scope = this
        let chapters = scope.$store.getters.getChaptersByBook(scope.bookUUID)
        return chapters
      },
      set (value) {
        let scope = this
        this.$store.commit('sortChapters', { bookUUID: scope.bookUUID, data: value })
      }
    }
  },
  methods: {
    sortScene: function (chapterUUID) {
      var scope = this
      var scenes = (chapterUUID !== null) ? this.$store.getters.getScenesByChapter(chapterUUID) : this.$store.getters.getScenesByBook(scope.bookUUID)
      for (let i = 0; i < scenes.length; i++) {
        scenes[i].chapter_id = chapterUUID
        if (i === (scenes.length - 1)) {
          var parent = (chapterUUID !== null) ? chapterUUID : scope.bookUUID
          this.$store.commit('sortScenes', { PARENT: parent, data: scenes })
        }
      }
    },
    displayTitle: function (title) {
      if (title === null) {
        return 'Untitled'
      }
      if (title.length > 70) {
        return title.slice(0, 70) + '...'
      } else if (title.length < 1) {
        return 'Untitled'
      } else {
        return title.slice(0, 39)
      }
    },
    deleteChapter: function (chapter) {
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
            .delete('http://localhost:3000/chapters/' + chapter.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeChapterFromList', chapter)
                })
              }
            })
        }
      })
    },
    loadScenes: function () {
      var scope = this
      let chapters = scope.$store.getters.getChaptersByBook(scope.bookUUID)
      for (let i = 0; i < chapters.length; i++) {
        let chapter = chapters[i]
        scope.$store.dispatch('loadScenesByChapter', chapter.uuid)
        if (i === (chapters.length - 1)) {
          setTimeout(function () {
            scope.page.is_ready = true
          }, 500)
        }
      }
    }
  },
  mounted () {
    var scope = this
    scope.bookUUID = scope.properties.uuid
    scope.$store.dispatch('loadChaptersByBook', scope.bookUUID)
    scope.$store.dispatch('loadScenesByBook', scope.bookUUID)
    setTimeout(function () {
      scope.loadScenes()
    }, 1500)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-storyboard { position:relative; }

.es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
.es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
.es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; padding-right:110px; }
.es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

.es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }
.es-card .es-card-content .es-card-actions .btn-circle { background:transparent; border:1px solid #e0e5ee; border-radius:50%; width:30px; height:30px; line-height:22px; text-align:center; font-size:15px; }
.es-card .es-card-footer { background:#f5f8fa; height:40px; line-height:40px; padding:0px 20px; border-top:1px solid #e0e5ee; }

@media only screen and (max-width: 968px) {

}
</style>
