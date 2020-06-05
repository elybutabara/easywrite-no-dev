<template>
<div v-if="page.is_ready" class="page-chapter-listing">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <h4>{{ book.title }}</h4>
                <small>{{$t('BELOW_ARE_THE_LIST_OF_SCENES_UNDER')}} {{ book.title }}</small>
            </div>
        </div>
    </div>
    <div class="es-page-breadcrumbs">
        <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
        /
        <button class="current">{{ $tc('CHAPTER', 2) }}</button>
    </div>
    <div class="es-page-content">
        <draggable v-model="chapters" draggable=".none" class="es-row">
        <div class="es-col fadeIn animated" v-for="chapter in chapters" v-bind:key="chapter.id">
            <div class="es-card">
                <div class="es-card-content">
                    <div class="es-card-actions">
                        <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + chapter.uuid, tabComponent: 'books-i-read-chapter-details',  tabData: { book: book, chapter: chapter }, tabTitle: $t('VIEW')+ ' - ' + chapter.title})"><i class="lar la-eye"></i></button>
                    </div>
                    <p class="title ellipsis-2">{{ displayTitle(chapter.title) }}</p>
                    <i class="description ellipsis-2">{{ chapter.short_description || $t('NO_SHORT_DESCRIPTION') + '...' }}</i>
                </div>
                <div class="es-card-footer">
                    <small>{{$tc('SCENE', 2)}}: {{ $store.getters.getScenesByChapter(chapter.uuid).length }}</small>
                    &nbsp; &bull; &nbsp;
                    <small>{{$tc('VERSION', 2)}}: {{ $store.getters.getChapterVersions(chapter.uuid).length }}</small>
                    <small style="float:right;">{{$t('WORD_COUNT')}}: {{ WORD_COUNT($store.getters.getChapterContent(chapter.uuid)) }}</small>
                </div>
            </div>
        </div>
        </draggable>
    </div>
</div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'books-i-read-chapter-listing',
  props: ['properties'],
  components: {
    draggable
  },
  data: function () {
    return {
      page: {
        is_ready: false
      },
      bookUUID: ''
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
        /*
         * Only show in Book-I-Read Chapters that are hidden=0
         * */
        let chapterList = []
        for (let chaptersKey in chapters) {
          if (chapters[chaptersKey].hidden === 0) {
            scope.$store.dispatch('loadScenesByChapter', chapters[chaptersKey].uuid)
            scope.$store.dispatch('loadVersionsByChapter', chapters[chaptersKey].uuid)
            chapterList.push(chapters[chaptersKey])
          }
        }
        return chapterList
      },
      set (value) {
        let scope = this
        this.$store.commit('sortChapters', { bookUUID: scope.bookUUID, data: value })
      }
    }
  },
  methods: {
    log: function (chapterUUID) {
      console.log(chapterUUID)
      console.log(this.list1)
      console.log(this.list2)
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
    }
  },
  mounted () {
    var scope = this
    scope.bookUUID = scope.properties.uuid

    setTimeout(function () {
      scope.page.is_ready = true
    }, 100)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
