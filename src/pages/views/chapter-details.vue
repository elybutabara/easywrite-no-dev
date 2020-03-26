<template>
<div class="page-chapter-details">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <div>
                    <h4><strong>{{ properties.chapter.title }}</strong></h4>
                </div>
            </div>
            <div class="actions">
                <button class="es-button-white" @click="CHANGE_COMPONENT('chapter-form', {  book_id: properties.chapter.book_id, chapter:  properties.chapter }, 'Edit - ' +  properties.chapter.title)">EDIT</button>
                <button class="es-button-white" @click="DELETE_FROM_LIST('chapters',  properties.chapter)">DELETE</button>
            </div>
        </div>
    </div>

    <div  class="es-page-content">
        <div style="max-width:800px; margin:0px auto;" class="es-tab">
        <div>
            <div v-bind:class="{ 'active' : tab.active == 'content' }" class="es-tab-button" @click="changeTab('content')">
                Content
            </div>
            <div v-bind:class="{ 'active' : tab.active == 'scenes' }" class="es-tab-button" @click="changeTab('scenes')">
                Scenes
            </div>
          <div v-bind:class="{ 'active' : tab.active == 'versions' }" class="es-tab-button" @click="changeTab('versions')">
            Versions
          </div>
        </div>
        <div class="es-tab-content" v-if="tab.active == 'content'">
           <div v-if="chapter_versions !== 'undefined' && chapter_versions.length > 0" v-html="chapter_versions[chapter_versions.length - 1].content" class="description" ></div>
        </div>
        <div class="es-tab-content" v-if="tab.active == 'scenes'">
          <div class="text-right">
            <b-button @click="createScene()" variant="dark">Add Scene</b-button>
          </div>
            <div class="chapter-scenes-list">
              <div class="row">
                <div class="col-12 col-lg-4 col-md-6 col-sm-6 fadeIn animated" v-for="scene in chapter.scenes" v-bind:key="scene.id">
                  <div class="item" >
                    <div class="header"><i class="las la-bookmark"></i> {{ scene.title }}</div>
                    <div class="content" >
                      <strong>{{ scene.short_description }}</strong>
                      <div v-html="scene.notes" class="description" >{{ scene.notes }}</div>
                      <button type="button">VIEW</button>
                      <button @click="editScene(scene)" type="button">EDIT</button>
                      <button @click="deleteScene(scene.uuid)" type="button">DELETE</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div class="es-tab-content" v-if="tab.active == 'versions'">
          <div class="version-container">
            <b-card no-body>
              <b-tabs pills card vertical nav-wrapper-class="w-30">
                <b-tab v-for="(version, index) in chapter_versions" v-bind:key="version.id" :active="index==0" >
                  <template v-slot:title>
                    Version {{ index+1 }}
                    <b-badge variant="primary" v-if="index+1 == chapter_versions.length" >Latest</b-badge>
                    <b-badge variant="success" v-else-if="version.is_same == true" >Same</b-badge>
                    <b-badge variant="secondary" v-else >Diff</b-badge>
                  </template>
                  <div class="text-right" style="position: sticky; top: 1rem">
                    <b-button @click="editVersion(version)" variant="dark" class="btn-edit-version">Edit</b-button>
                  </div>
                  <br >
                  <b-card-text class="version-change-description" v-html="version.change_description "></b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </div>
    </div>
    </div>
  <b-overlay :show="busy" no-wrap fixed @shown="onShown" @hidden="onHidden">
    <template v-slot:overlay>
      <div
        ref="dialog"
        tabindex="-1"
        role="dialog"
        aria-modal="false"
        aria-labelledby="form-confirm-label"
        class="p-3"
      >
        <b-container class="bv-example-row">
          <b-row style="margin-bottom: 1rem;">
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
                <b-button variant="outline-dark" class="mr-3" @click="onCancel">Cancel</b-button>
                <b-button variant="dark" @click="saveNewVersion">Save</b-button>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </template>
  </b-overlay>
</div>
</template>

<script>
import TinyMCE from '../../components/TinyMCE'

export default {
  name: 'chapter-details',
  props: ['properties'],
  data: function () {
    return {
      chapter: null,
      chapter_versions: [],
      chapter_version: {
        chapter_id: null,
        content: '',
        change_description: ''
      },
      tab: {
        active: 'content'
      },
      busy: false,
      interval: null
    }
  },
  components: {
    TinyMCE
  },
  methods: {
    createScene: function () {
      var scope = this
      scope.$parent.changeComponent('scene-form', { chapter: scope.chapter })
    },
    newVersion: function () {
      var scope = this
      this.busy = true

      if (scope.chapter_version.id) {
        delete (scope.chapter_version.id)
        delete (scope.chapter_version.uuid)
      }
    },
    onShown () {
      // Focus the dialog prompt
      this.$refs.dialog.focus()
    },
    onHidden () {
      // In this case, we return focus to the submit button
      // You may need to alter this based on your application requirements
      this.$refs.button.focus()
    },
    onCancel () {
      this.busy = false
    },
    saveNewVersion () {
      var scope = this
      scope.axios
        .post('http://localhost:3000/chapter-versions', scope.chapter_version)
        .then(response => {
          if (response.data) {
            scope.getAllChapterVersions(scope.properties)
            this.busy = false
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Chapter version successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.changeTab('versions')
            })
          }
        })
    },
    editVersion: function (version) {
      var scope = this
      scope.chapter_version.id = version.id
      scope.chapter_version.uuid = version.uuid
      scope.chapter_version.change_description = version.change_description
      scope.chapter_version.content = version.content

      this.busy = true
    },
    editChapter: function (chapter) {
      var scope = this
      scope.$parent.changeComponent('chapter-form', { chapter: chapter })
    },
    changeTab: function (active) {
      var scope = this
      scope.tab.active = active
    },
    setDescription (value) {
      var scope = this

      scope.chapter_version.change_description = value
    },
    getAllChapterVersions: function (chapter) {
      var scope = this
      scope.chapter = chapter
      scope.axios
        .get('http://localhost:3000/chapters/' + chapter.uuid + '/versions')
        .then(response => {
          scope.chapter_versions = response.data

          scope.chapter_version.chapter_id = chapter.uuid
          scope.chapter_version.change_description = ''
          scope.chapter_version.content = scope.chapter_versions[response.data.length - 1].content
        })
    },
    getSceneByChapter: function (chapterId) {
      var scope = this
      scope.axios
        .get('http://localhost:3000/chapters/' + chapterId + '/scenes')
        .then(response => {
          scope.chapter.scenes = response.data
        })
    },
    editScene: function (scene) {
      var scope = this
      scope.$parent.changeComponent('scene-form', { scene: scene })
    },
    deleteScene: function (sceneId) {
      var scope = this
      window.swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          scope.axios
            .delete('http://localhost:3000/scenes/' + sceneId)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Scene successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.getSceneByChapter(scope.properties.uuid)
                })
              }
            })
        }
      })
    }
  },
  beforeUpdate () {
    var scope = this
    if (scope.properties.chapter.uuid !== scope.chapter.uuid) {
      scope.$set(scope, 'chapter', scope.properties.chapter)
      scope.getAllChapterVersions(scope.properties.chapter)
    }
  },
  mounted () {
    var scope = this
    scope.getAllChapterVersions(scope.properties.chapter)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .es-tab .es-tab-button {
        cursor:pointer; background:#354350; color:#fff; border:1px solid #efefef; display:inline-block; height:40px; line-height:40px; padding:0px 40px; font-family: 'Crimson Roman Bold'; cursor:pointer;
        border-top-left-radius:3px;  border-top-right-radius:3px;
    }
    .es-tab .es-tab-button.active {  position:relative; background:#fff; border:1px solid #efefef; color:#354350; }
    .es-tab .es-tab-button.active:after {  content:''; position:absolute; bottom:-3px; left:0px; width:100%; height:4px; background:#fff; }
    .es-tab-content {  background:#fff; padding:20px; border:1px solid #efefef; min-height:50vh; font-size:18px; }

    .chapter-scenes-list .item { margin-top:20px; border:1px solid #efefef; }
    .chapter-scenes-list .item .header { background:#354350; padding:0px 10px; height:35px; line-height:38px; color:#fff; border:2px solid #354350; }
    .chapter-scenes-list .item .content { padding:20px; background:#fff; }
    .chapter-scenes-list .item .content strong { font-family:'Crimson Bold'; font-size:18px; }
    .chapter-scenes-list .item .content .description { font-size:16px; }
    .chapter-scenes-list .item .content button { background:#fff; border:1px solid #efefef; padding:5px 10px; padding-bottom:0px; }

    /*.chapter-scenes-list .item { font-family: 'Crimson Roman Bold'; border:1px solid #354350; border-top:none; padding:0px 20px; height:35px; line-height:35px}*/
    /*.chapter-scenes-list .item:first-child { border-top:1px solid #354350;  }*/

    .image-container { text-align: center; }
    .image-container img { width:100%; max-width:250px; }

    .es-panel { background:#fff; margin:0px auto; margin-top:70px; max-width:780px; border:1px solid #e0e5ee; }
    .es-panel .es-panel-content { padding:30px 30px; }
    .es-panel .es-panel-content .title { margin:0px; margin-top:20px; text-align:center;  font-size:25px; font-weight:600; color:#293742; }
    .es-panel .es-panel-content .aka { margin-top:0px; text-align:center;  font-size:16px; color:#922c39; font-weight:600; }
    .es-panel .es-panel-content .tags { text-align:center; font-size:16px; color:#293742; }
    .es-panel .es-panel-content .description { display:block; padding:20px 0px; font-size:18px; text-align:center; }

    .es-panel .es-panel-footer { display:flex; background:#f5f8fa; border-top:1px solid #e0e5ee; height:40px; line-height:40px; padding:0px 0px; }
    .es-panel .es-panel-footer .cta { font-weight:600; cursor:pointer; text-align:center; width:50%;}
    .es-panel .es-panel-footer .cta:first-child {  border-right:1px solid #e0e5ee; }
</style>
