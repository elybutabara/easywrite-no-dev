<template>
<div class="page-chapter-details">
    <div class="header">
      <div class="page-title">
          <button @click="toggleFilter()" class="btn-toggle-filter"><i class="las la-filter"></i></button>
          <h3>{{ properties.title }}</h3>
          <p>{{ properties.short_description }}</p>
      </div>
      <b-button @click="editChapter(properties)" variant="dark">Edit</b-button>
      <b-button ref="button" :disabled="busy" @click="newVersion" variant="dark">Save as New Version</b-button>
    </div>
    <hr/>
    <div class="es-tab">
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
            <div v-html="properties.chapter_version[properties.chapter_version.length - 1].content" class="description" ></div>
        </div>
        <div class="es-tab-content" v-if="tab.active == 'scenes'">
            <div class="chapter-scenes-list">
              <div class="row">
                <div class="col-12 col-lg-4 col-md-6 col-sm-6 fadeIn animated" v-for="scene in properties.scenes" v-bind:key="scene.id">
                  <div class="item" >
                    <div class="header"><i class="las la-bookmark"></i> {{ scene.title }}</div>
                    <div class="content" >
                      <strong>{{ scene.short_description }}</strong>
                      <div v-html="scene.notes" class="description" >{{ scene.notes }}</div>
                      <button type="button">VIEW</button>
                      <button type="button">EDIT</button>
                      <button type="button">DELETE</button>
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
                <b-tab v-for="(version, index) in chapter.chapter_version" v-bind:key="version.id" :active="index==0" >
                  <template v-slot:title>
                    Version {{ index+1 }}
                    <b-badge variant="primary" v-if="index+1 == chapter.chapter_version.length" >Latest</b-badge>
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
  <b-overlay :show="busy" no-wrap fixed @shown="onShown" @hidden="onHidden">
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
      chapter: this.properties,
      chapter_version: {
        chapter_id: this.properties.uuid,
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
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Chapter successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.changeTab('versions')
              this.busy = false
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
          scope.chapter.chapter_version = response.data

          scope.chapter_version.chapter_id = chapter.uuid
          scope.chapter_version.change_description = ''
          scope.chapter_version.content = scope.chapter.chapter_version[response.data.length - 1].content
        })
    }
  },
  beforeUpdate () {
    var scope = this
    if (scope.chapter.uuid !== scope.properties.uuid) {
      scope.getAllChapterVersions(scope.properties)
    }
  },
  mounted () {
    var scope = this
    scope.getAllChapterVersions(scope.properties)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .page-chapter-details { padding:20px; }

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

    .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
    .page-title h3 { font-size:35px; }
    .page-title p { font-size:18px; }
    .page-actions { text-align:right; margin-top:10px;  }
    .page-actions .search-box  { position:relative; display:inline-block; width:350px; }
    .page-actions .search-box input { width:100%;  padding:0px 10px; padding-top:3px; padding-right:30px; height:35px; line-height:35px; }
    .page-actions .search-box .btn-search {  position:absolute; top:2px; right:0px; height:35px; width:35px; background:none; border:none; }

    .btn-new-record { z-index:500; padding-top:8px; position:fixed; bottom:20px; right:20px; height:50px; width:50px; border-radius:50%; background:#c12938; color:#fff; border:none; font-size:25px; }
    .btn-toggle-filter { display:none; float:right;  position:absolute; top:0px; right:0px; background:#fff; border:1px solid #9fb1c2; padding-top:5px; padding-bottom:0px; }

    @media only screen and (max-width: 968px) {
        .page-chapter-listing .item .header { padding:0px 15px; }
        .page-chapter-listing .item .content { padding:15px;  }

        .page-chapter-listing .item .content strong { font-family:'Crimson Bold'; font-size:16px; }
        .page-chapter-listing .item .content .description { font-size:14px; }

        .page-actions {  text-align:left;  display:none; }
        .page-actions.open {  display:block; }
        .page-actions .search-box  { width:100%; }

        .btn-toggle-filter { display:inline-block; }
    }
</style>
