<template>
<div>
<div v-if="page.is_ready" class="page-chapter-details">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <div>
                    <h4><strong>{{ page.title }}</strong></h4>
                </div>
            </div>
            <div class="actions">
                <button class="es-button-white" @click="newVersion()">SAVE AS NEW VERSION</button>
                <button class="es-button-white" @click="CHANGE_COMPONENT('chapter-form', {  book_id: properties.chapter.book_id, chapter:  properties.chapter }, 'Edit - ' +  properties.chapter.title, true)">EDIT</button>
                <button class="es-button-white" @click="DELETE_FROM_LIST('chapters',  properties.chapter)">DELETE</button>
            </div>
        </div>
    </div>

    <div class="es-chapter-details-tab">
        <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-chapter-details-tab-item">CONTENT</div>
        <div v-bind:class="{ 'active' : tab.active == 'scenes' }" @click="changeTab('scenes')" class="es-chapter-details-tab-item">SCENES</div>
        <div v-bind:class="{ 'active' : tab.active == 'versions' }" @click="changeTab('versions')" class="es-chapter-details-tab-item">VERSION</div>
        <div v-bind:class="{ 'active' : tab.active == 'compare-versions' }" @click="changeTab('compare-versions')" class="es-chapter-details-tab-item">COMPARE VERSION</div>
    </div>

    <div v-if="tab.active === 'content'"  class="es-chapter-details-tab-content">
        <div v-html="getChapterContent" class="description" ></div>
    </div>
    <div v-if="tab.active === 'scenes'"  class="es-chapter-details-tab-content scene-listing">
        <chapter-scenes :properties="{ chapter: page.data.chapter }"></chapter-scenes>
    </div>
    <div v-if="tab.active === 'versions'"  class="es-chapter-details-tab-content">
        <chapter-versions :properties="{ chapter: page.data.chapter }"></chapter-versions>
    </div>
    <div v-if="tab.active === 'compare-versions'"  class="es-chapter-details-tab-content">
        <chapter-compare-versions :properties="{ chapter: page.data.chapter }"></chapter-compare-versions>
    </div>
</div>
</div>
</template>

<script>
import TinyMCE from '../../components/TinyMCE'
import ChapterScenes from '@/components/pages/chapter-scenes'
import ChapterVersions from '@/components/pages/chapter-versions'
import ChapterCompareVersions from '@/components/pages/chapter-compare-versions'
import moment from 'moment'

export default {
  name: 'chapter-details',
  props: ['properties'],
  data: function () {
    return {
      page: {
        title: '',
        is_ready: false,
        data: null
      },
      tab: {
        active: 'content'
      }
    }
  },
  components: {
    TinyMCE,
    ChapterScenes,
    ChapterVersions,
    ChapterCompareVersions
  },
  computed: {
    getChapterContent: function () {
      var scope = this
      var chapterID = scope.page.data.chapter.uuid
      return this.$store.getters.getChapterContent(chapterID)
    },
    test: function () {
      var stillUtc = moment.utc('2020-04-09 13:51:40').toDate()
      var date = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss')
      return moment('2020-04-09 21:51:40').utc().format('YYYY-MM-DD HH:mm:ss').toString() + ' ---> ' + date
    }
  },
  methods: {
    changeTab: function (active) {
      var scope = this
      scope.tab.active = active
    }
  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this
    scope.page.data = scope.properties
    scope.LOAD_LIST('chapter-versions', scope.page.data.chapter)
    scope.page.title = scope.properties.chapter.title
    scope.page.is_ready = true
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .btn-edit { float:right; background:#fff; border:1px solid #506d84; }
    /*.chapter-scenes-list .item { font-family: 'Crimson Roman Bold'; border:1px solid #354350; border-top:none; padding:0px 20px; height:35px; line-height:35px}*/
    /*.chapter-scenes-list .item:first-child { border-top:1px solid #354350;  }*/

    .image-container { text-align: center; }
    .image-container img { width:100%; max-width:250px; }

    .es-chapter-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
    .es-chapter-details-tab .es-chapter-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
    .es-chapter-details-tab .es-chapter-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
    .es-chapter-details-tab .es-chapter-details-tab-item.active:after { background:#922c39;  }

    .es-chapter-details-tab-content { position:relative; padding:30px; background:#fff; height:calc(100vh - 247px); overflow-y:auto; display:block; }
    .es-chapter-details-tab-content.no-padding { padding:0px; }
    .es-chapter-details-tab-content.active { display:block; }
</style>
