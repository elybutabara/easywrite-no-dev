<template>
<div v-if="page.is_ready" class="page-chapter-listing">
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
        <draggable :list="list1" group="people" draggable=".handle" @change="log(1)">
            <div style="background:red; margin:10px;" :key="item.id" v-for="item in list1" class="handle">{{ item.name }}</div>
        </draggable>

        <draggable :list="list2" group="people" draggable=".handle" @change="log(2)">
            <div style="background:blue; margin:10px;" :key="item.id" v-for="item in list2" class="handle">{{ item.name }}</div>
        </draggable>
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
      list1: [
        { id: 1, name: 'item 1a' },
        { id: 2, name: 'item 1b' },
        { id: 3, name: 'item 1c' },
        { id: 4, name: 'item 1d' }
      ],
      list2: [
        { id: 5, name: 'item 1aa' },
        { id: 6, name: 'item 1bb' },
        { id: 7, name: 'item 1cc' },
        { id: 8, name: 'item 1dd' }
      ]
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
    log: function (chapterUUID) {
      console.log(chapterUUID)
      console.log(this.list1)
      console.log(this.list2)
    },
    displayTitle: function (title) {
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
