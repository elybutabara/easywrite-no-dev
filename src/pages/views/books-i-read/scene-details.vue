<template>
<div>
    <div v-if="page.is_ready" class="page-scene-details">
        <div class="es-page-head">
            <div class="inner">
                <div class="details">
                    <div>
                        <h4><strong>{{ properties.scene.title }}</strong></h4>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="chapter !== null" class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'books-i-read-chapter-listing', tabData: book, tabTitle: $tc('CHAPTER', 2) + ' - ' + book.title})">{{ $tc('CHAPTER', 2) }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + book.uuid, tabComponent: 'books-i-read-chapter-details', tabData: { book: book, chapter: chapter }, tabTitle: 'VIEW - ' + chapter.title})">{{ chapter.title || 'Untitled' }}</button>
            /
            <button class="current">
                <span>{{ scene.title || 'Untitled' }}</span>
            </button>
        </div>
        <div v-else class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'scene-listing-' + book.uuid, tabComponent: 'books-i-read-scene-listing', tabData: book, tabTitle: $tc('OTHER_SCENES', 2) + ' - ' + book.title})">{{ $tc('OTHER_SCENES', 2) }}</button>
            /
            <button class="current">
                <span>{{ scene.title || 'Untitled' }}</span>
            </button>
        </div>
        <div class="es-scene-details-tab">
            <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-scene-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
        </div>
        <div v-if="tab.active === 'content'"  class="es-scene-details-tab-content">
            <div v-html="getSceneContent" class="description" v-commentbase="commentbase_params"></div>
        </div>
    </div>
</div>
</template>

<script>
import CommentBase from '../../../components/CommentBase'

export default {
  name: 'books-i-read-scene-details',
  props: ['properties'],
  directives: {
    commentbase: CommentBase
  },
  data: function () {
    var scope = this
    return {
      scene_version: {
        book_scene_id: null,
        change_description: null,
        content: null
      },
      page: {
        is_ready: false,
        title: '',
        data: null
      },
      tab: {
        active: 'content'
      },
      busy: false,
      tempVersionDesc: '',
      commentbase_params: {
        onMounted: (vm) => {
          scope.commentbase_vm = vm
          vm.setAuthor(this.getAuthor)
          vm.setCommentsJSON(this.comments)
        },
        onAddComment: function () {
          scope.saveComments()
        }
      }
    }
  },
  components: {
  },
  computed: {
    book: function () {
      return this.properties.book
    },
    scene: function () {
      return this.properties.scene
    },
    chapter: function () {
      return this.properties.chapter
    },
    getSceneContent: function () {
      var scope = this
      var sceneID = scope.page.data.scene.uuid
      return this.$store.getters.getSceneContent(sceneID)
    },
    comments: function () {
      // return '{}'
      var scope = this
      var sceneID = scope.page.data.scene.uuid
      return this.$store.getters.getSceneComments(sceneID)
    },
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    }
  },
  methods: {
    setDescription (value) {
      var scope = this
      scope.tempVersionDesc = value
    },
    changeTab: function (tab) {
      var scope = this
      scope.tab.active = tab
    },
    // todo
    saveComments () {
      var scope = this

      var sceneID = scope.page.data.scene.uuid
      scope.scene_version.uuid = this.$store.getters.getSceneVersionUUID(sceneID)
      scope.scene_version.change_description = scope.tempVersionDesc
      scope.scene_version.content = this.commentbase_vm.getContent()
      scope.scene_version.comments = this.commentbase_vm.getCommentsJSON()
      scope.scene_version.book_scene_id = sceneID

      scope.axios
        .post('http://localhost:3000/scene-versions/comment', scope.scene_version)
        .then(response => {
          if (response.data) {
            // TODO: Insert vuex code that will refresh the chapter version
            scope.tab.active = 'content'
            this.busy = false
            // scope.$store.dispatch('updateSceneVersionList', { uuid: response.data.book_scene_id })
          }
        })
    },
    initializeData: function () {
      var scope = this
      scope.page.data = scope.properties

      // load book
      scope.$store.dispatch('loadCharactersByBook', scope.page.data.scene.book_id)
      scope.$store.dispatch('loadItemsByBook', scope.page.data.scene.book_id)
      scope.$store.dispatch('loadLocationsByBook', scope.page.data.scene.book_id)

      // load scene children
      scope.$store.dispatch('loadCharactersByScene', scope.page.data.scene)
      scope.$store.dispatch('loadItemsByScene', scope.page.data.scene)
      scope.$store.dispatch('loadLocationsByScene', scope.page.data.scene)
      scope.$store.dispatch('loadVersionsByScene', scope.page.data.scene)

      setTimeout(function () {
        scope.page.is_ready = true
      }, 500)
    }
  },
  mounted () {
    var scope = this
    scope.initializeData()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .export-content{ text-align: right; margin-bottom: 20px;}
    .es-scene-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
    .es-scene-details-tab .es-scene-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
    .es-scene-details-tab .es-scene-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
    .es-scene-details-tab .es-scene-details-tab-item.active:after { background:#922c39;  }

    .es-scene-details-tab-content { position:relative; padding:30px; background:#fff; height:calc(100vh - 247px); overflow-y:auto; display:block; }
    .es-scene-details-tab-content.no-padding { padding:0px; }
    .es-scene-details-tab-content.active { display:block; }
</style>
