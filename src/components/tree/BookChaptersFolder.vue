<template>
    <li v-if="component.is_ready" v-bind:class="{ 'open' : $store.getters.isBookChaptersFolderOpen(book) }">
        <div @click="TOGGLE_BOOK(book,'chapters')" class="label">
            <span>
                <img v-if="$store.getters.isBookChaptersFolderOpen(book)" src="@/assets/img/icons/folder-open.svg">
                <img v-else src="@/assets/img/icons/folder.svg">
                Chapters
            </span>
        </div>
        <draggable tag="ul"  v-model="chapters" draggable=".handle" class="level-3">
            <li v-bind:class="{ 'open' : $store.getters.isBookChaptersFolderOpen(book) }" v-bind:key="chapter.id" v-for="chapter in chapters" class="handle">
                <div @click="toggleChapter(chapter)" class="label"><span><img  src="@/assets/img/icons/chapter.svg"> {{ chapter.title }}</span></div>
                <chapter-scenes-folder v-if="chapter.is_open" :key="'tree-chapter-scenes-' + chapter.uuid" :properties="chapter"></chapter-scenes-folder>
            </li>
        </draggable>
    </li>
</template>
<script>
import draggable from 'vuedraggable'
import ChapterScenesFolder from '@/components/tree/ChapterScenesFolder'

export default {
  name: 'book-chapters-folder',
  props: ['properties'],
  data: function () {
    return {
      component: {
        title: '',
        is_ready: false,
        data: null
      },
      chapter: null
    }
  },
  components: {
    draggable,
    ChapterScenesFolder
  },
  computed: {
    chapters: {
      get () {
        let scope = this
        let chapters = scope.$store.getters.getChaptersByBook(scope.book.uuid)
        return chapters
      },
      set (value) {
        let scope = this
        this.$store.commit('sortChapters', { bookUUID: scope.book.uuid, data: value })
      }
    }
  },
  methods: {
    toggleChapter: function (chapter) {
      let scope = this

      let config = {
        tabKey: 'chapter-details-' + chapter.uuid,
        tabComponent: 'chapter-details',
        tabData: { book_id: chapter.book_id, chapter: chapter },
        tabTitle: chapter.title
      }

      scope.$store.dispatch('toggleChapter', chapter)
      scope.CHANGE_COMPONENT(config)
    }
  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this
    scope.book = scope.properties

    setTimeout(function () {
      scope.component.is_ready = true
    }, 500)
  }
}
</script>
