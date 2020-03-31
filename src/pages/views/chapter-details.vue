<template>
<div class="page-chapter-details">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <div>
                    <h4><strong>{{ page.title }}</strong></h4>
                </div>
            </div>
            <div class="actions">
                <button class="es-button-white" @click="newVersion()">SAVE AS NEW VERSION</button>
                <button class="es-button-white" @click="CHANGE_COMPONENT('chapter-form', {  book_id: properties.chapter.book_id, chapter:  properties.chapter }, 'Edit - ' +  properties.chapter.title)">EDIT</button>
                <button class="es-button-white" @click="DELETE_FROM_LIST('chapters',  properties.chapter)">DELETE</button>
            </div>
        </div>
    </div>

    <div class="es-chapter-details-tab">
        <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-chapter-details-tab-item">CONTENT</div>
        <div v-bind:class="{ 'active' : tab.active == 'scenes' }" @click="changeTab('scenes')" class="es-chapter-details-tab-item">SCENES</div>
        <div v-bind:class="{ 'active' : tab.active == 'versions' }" @click="changeTab('versions')" class="es-chapter-details-tab-item">VERSION</div>
    </div>

    <div v-bind:class="{ 'active' : tab.active == 'content' }" class="es-chapter-details-tab-content">
        <div v-if="chapter_versions !== 'undefined' && chapter_versions.length > 0" v-html="chapter_versions[chapter_versions.length - 1].content" class="description" ></div>
    </div>
    <div v-bind:class="{ 'active' : tab.active == 'scenes' }" class="es-chapter-details-tab-content">
        <div class="chapter-scenes-list">
            <div class="row">
                <div class="col-12 col-lg-4 col-md-6 col-sm-6 fadeIn animated" v-for="scene in chapter_scenes" v-bind:key="scene.id">
                <div class="item" >
                    <div class="header"><i class="las la-bookmark"></i> {{ scene.title }}</div>
                    <div class="content" >
                    <strong>{{ scene.short_description }}</strong>
                    <div v-html="scene.notes" class="description" >{{ scene.notes }}</div>
                    <button @click="CHANGE_COMPONENT('scene-details',{ book_id: scene.book_uuid, scene: scene}, scene.title )" type="button">VIEW</button>
                    <button @click="CHANGE_COMPONENT('scene-form',{ book_id: scene.book_uuid, scene: scene}, scene.title )" type="button">EDIT</button>
                    <button @click="deleteScene(scene.uuid)" type="button">DELETE</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>

    <div v-bind:class="{ 'active' : tab.active == 'versions' }" class="es-chapter-details-tab-content no-padding">
        <div class="es-chapter-details-versions-list">
            <div v-bind:class="{ 'active' : active_version.uuid === version.uuid }" @click="viewChapterVersion(version, index)" v-for="(version, index) in chapter_versions.slice().reverse()" v-bind:key="version.id" :active="index==0"  class="es-chapter-details-versions-list-item">
                Version {{ chapter_versions.length - index }}
                <b-badge variant="primary" v-if="(chapter_versions.length - index) == chapter_versions.length" >Latest</b-badge>
                <b-badge variant="success" v-else-if="version.is_same == true" >Same</b-badge>
                <b-badge variant="secondary" v-else >Diff</b-badge>
                <i class="icon las la-chevron-circle-right"></i>
            </div>
        </div>

        <div v-bind:class="{'transparent' : (active_version.uuid === null && !editing_version) }" class="es-chapter-details-version-header">
            <button v-if="active_version.uuid !== null && !editing_version" class="btn-edit" @click="editChapterVersion(active_version)" ><i class="las la-pencil-alt"></i> Edit</button>
            <h4 v-if="active_version.uuid !== null && !editing_version">Version {{ (chapter_versions.length - active_version_index) }}</h4>
            <h4 v-if="active_version.uuid !== null && editing_version">Edit Version {{ (chapter_versions.length - active_version_index) }}</h4>
            <h4 v-if="active_version.uuid === null && editing_version">New Version</h4>
        </div>
        <div class="es-chapter-details-version-content" v-if="active_version.uuid !== null" >
            <div v-if="!editing_version">
                <div v-if="active_version.change_description !== null && active_version.change_description !== ''" style="padding-top:30px;" class="version-change-description" v-html="active_version.change_description"></div>
                <div v-else  style="padding-top:30px;"><i>This <strong>Version</strong> has no description</i></div>
            </div>
        </div>
        <div class="es-chapter-details-version-content" v-if="editing_version">
            <tiny-editor :key="UNIQUE()" :initValue="active_version.change_description"
                v-on:getEditorContent="setDescription"
                class="form-control"
           />
            <div class="cta-container text-right">
              <button class="btn-dark" @click="saveChapterVersion(active_version)">Save Changes</button>
              <button class="btn-light" @click="onCancel">Cancel</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import TinyMCE from '../../components/TinyMCE'

export default {
  name: 'chapter-details',
  props: ['properties'],
  data: function () {
    return {
      page: {
        title: ''
      },
      editing_version: false,
      chapter: null,
      chapter_versions: [],
      active_version: {
        id: null,
        uuid: null,
        chapter_id: null,
        content: '',
        change_description: ''
      },
      active_version_index: 0,
      chapter_scenes: [],
      tab: {
        active: 'content'
      },
      busy: false,
      interval: null,
      tempVersionDesc: ''
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

      scope.active_version.change_description = ''
      scope.active_version.id = null
      scope.active_version.uuid = null
      scope.editing_version = true
      scope.changeTab('versions')
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
      var scope = this
      scope.editing_version = false
      this.busy = false
    },
    saveChapterVersion () {
      var scope = this
      scope.active_version.change_description = scope.tempVersionDesc
      scope.axios
        .post('http://localhost:3000/chapter-versions', scope.active_version)
        .then(response => {
          if (response.data) {
            if (scope.active_version.uuid === null) {
              scope.chapter_versions.push(response.data)
            }
            this.editing_version = false
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Chapter version successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              // scope.changeTab('versions')
            })
          }
        })
    },
    editChapterVersion: function (version) {
      var scope = this
      scope.active_version.id = version.id
      scope.active_version.uuid = version.uuid
      scope.active_version.change_description = version.change_description
      scope.active_version.content = version.content
      scope.editing_version = true
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
      // scope.active_version.change_description = value
      scope.tempVersionDesc = value
    },
    getAllChapterVersions: function (chapter) {
      var scope = this
      scope.chapter = chapter
      scope.active_version.chapter_id = chapter.uuid
      scope.axios
        .get('http://localhost:3000/chapters/' + chapter.uuid + '/versions')
        .then(response => {
          scope.chapter_versions = response.data
          // scope.active_version.change_description = ''
          //  scope.active_version.id = scope.chapter_versions[response.data.length - 1].id
          // scope.active_version.uuid = scope.chapter_versions[response.data.length - 1].uuid
          // scope.active_version.content = scope.chapter_versions[response.data.length - 1].content
          // scope.active_version = scope.chapter_versions[response.data.length - 1]
        })
    },
    getSceneByChapter: function (chapterId) {
      var scope = this
      scope.axios
        .get('http://localhost:3000/chapters/' + chapterId + '/scenes')
        .then(response => {
          scope.chapter_scenes = response.data
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
    },
    viewChapterVersion: function (version, index = 0) {
      var scope = this
      scope.active_version.id = version.id
      scope.active_version.uuid = version.uuid
      scope.active_version.change_description = version.change_description
      scope.active_version.content = version.content
      scope.active_version_index = index
      scope.editing_version = false
    }
  },
  beforeUpdate () {
    var scope = this
    if (scope.properties.chapter.uuid !== scope.chapter.uuid) {
      scope.$set(scope, 'chapter', scope.properties.chapter)
      // scope.getAllChapterVersions(scope.properties.chapter)
    }
  },
  mounted () {
    var scope = this
    scope.page.title = scope.properties.chapter.title
    scope.getAllChapterVersions(scope.properties.chapter)
    scope.getSceneByChapter(scope.properties.chapter.uuid)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .btn-edit { float:right; background:#fff; border:1px solid #506d84; }

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

    .es-chapter-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
    .es-chapter-details-tab .es-chapter-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
    .es-chapter-details-tab .es-chapter-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
    .es-chapter-details-tab .es-chapter-details-tab-item.active:after { background:#922c39;  }

    .es-chapter-details-tab-content { position:relative; padding:30px; background:#fff; height:calc(100vh - 247px); overflow-y:auto; display:none; }
    .es-chapter-details-tab-content.no-padding { padding:0px; }
    .es-chapter-details-tab-content.active { display:block; }

    .es-chapter-details-versions-list { position:absolute; top:0px; left:0px; border-right:1px solid #e0e5ee; width:300px; height:100%; overflow:auto; }
    .es-chapter-details-versions-list .es-chapter-details-versions-list-item { background:#fff; cursor:pointer; padding:10px 20px; padding-right:5px; width:100%; border-bottom:1px solid #e0e5ee; }
    .es-chapter-details-versions-list .es-chapter-details-versions-list-item .icon { float:right;font-size:20px; }
    .es-chapter-details-versions-list .es-chapter-details-versions-list-item.active { background:#324553; color:#fff; }

    .es-chapter-details-version-content { padding:10px 30px; padding-left:330px; }

    .es-chapter-details-version-header { padding:5px 10px; padding-left:310px; background:#f5f8fa; border-bottom: 1px solid #e0e5ee; }
    .es-chapter-details-version-header.transparent { opacity:0; }
    .es-chapter-details-version-header h4 { color:#324553; margin:0px; font-size:22px; }

    .cta-container { margin-top:20px; }
    .cta-container .btn-dark { background:#324553; color:#fff; border:1px solid #324553; height:30px; line-height:30px; padding:0px 10px; }
    .cta-container .btn-light { background:#fff; color:#324553; border:1px solid #496d7d; height:30px; line-height:30px; padding:0px 10px; }
</style>
