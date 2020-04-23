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
            <button ref="button" class="es-button-white" :disabled="busy" @click="newVersion">{{$t('SAVE_AS_NEW_VERSION').toUpperCase()}}</button>
            <button class="es-button-white" @click="CHANGE_COMPONENT({ tabKey: 'chapter-form-' + properties.chapter.uuid, tabComponent: 'chapter-form',  tabData: { book_id: properties.chapter.book_id, chapter:  properties.chapter }, tabTitle: 'Edit - ' +  properties.chapter.title, newTab: true })">{{$t('EDIT').toUpperCase()}}</button>
            <button class="es-button-white" @click="DELETE_FROM_LIST('chapters',  properties.chapter)">{{$t('DELETE').toUpperCase()}}</button>
          </div>
        </div>
      </div>
      <div class="es-chapter-details-tab">
        <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-chapter-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
        <div v-bind:class="{ 'active' : tab.active == 'scenes' }" @click="changeTab('scenes')" class="es-chapter-details-tab-item">{{$tc('SCENE', 2).toUpperCase()}}</div>
        <div v-bind:class="{ 'active' : tab.active == 'versions' }" @click="changeTab('versions')" class="es-chapter-details-tab-item">{{$tc('VERSION', 2).toUpperCase()}}</div>
        <div v-bind:class="{ 'active' : tab.active == 'compare-versions' }" @click="changeTab('compare-versions')" class="es-chapter-details-tab-item">{{$t('COMPARE_VERSIONS').toUpperCase()}}</div>
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
    <b-overlay :show="busy" no-wrap fixed @shown="$refs.dialog.focus()" @hidden="$refs.button.focus()">
      <template v-slot:overlay>
        <div
          id="overlay-background"
          ref="dialog"
          tabindex="-1"
          role="dialog"
          aria-modal="false"
          aria-labelledby="form-confirm-label"
          class="p-3"
        >
          <b-container class="bv-example-row">
            <b-card-group deck>
              <b-card header="Save as new Version" class="text-center">
                <b-row style="margin-bottom: 1rem;" class="text-left">
                  <b-col>
                    <label>Description: </label>
                    <tiny-editor :initValue="chapter_version.change_description"
                                 v-on:getEditorContent="setDescription"
                                 class="form-control"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <div class="text-right">
                      <b-button variant="outline-dark" class="mr-2" @click="busy = !busy">Cancel</b-button><b-button variant="dark" @click="saveNewVersion">Save</b-button>
                    </div>
                  </b-col>
                </b-row>
              </b-card>
            </b-card-group>
          </b-container>
        </div>
      </template>
    </b-overlay>
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
      chapter_version: {
        chapter_id: null,
        content: '',
        change_description: ''
      },
      page: {
        title: '',
        is_ready: false,
        data: null
      },
      tab: {
        active: 'content'
      },
      busy: false,
      tempVersionDesc: ''
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
    // Required for geting value from TinyMCE content
    setDescription (value) {
      var scope = this
      scope.tempVersionDesc = value
    },
    changeTab: function (active) {
      var scope = this
      scope.tab.active = active
    },
    newVersion: function () {
      var scope = this
      this.busy = true

      scope.chapter_version.change_description = ''
      if (scope.chapter_version.id) {
        delete (scope.chapter_version.id)
        delete (scope.chapter_version.uuid)
      }
    },
    saveNewVersion () {
      var scope = this

      scope.chapter_version.change_description = scope.tempVersionDesc
      scope.chapter_version.content = scope.getChapterContent
      scope.chapter_version.chapter_id = scope.page.data.chapter.uuid

      scope.axios
        .post('http://localhost:3000/chapter-versions', scope.chapter_version)
        .then(response => {
          if (response.data) {
            // TODO: Insert vuex code that will refresh the chapter version
            scope.tab.active = 'content'
            scope.LOAD_LIST('chapter-versions', scope.page.data.chapter)
            this.busy = false
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Chapter version successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.tab.active = 'versions'
            })
          }
        })
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
