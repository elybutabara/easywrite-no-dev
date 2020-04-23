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
          <div class="actions">
            <button ref="button" class="es-button-white" :disabled="busy" @click="newVersion()">{{$t('SAVE_AS_NEW_VERSION').toUpperCase()}}</button>
            <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + properties.scene.uuid, tabComponent: 'scene-form', tabData: { book_id: properties.scene.book_id, scene: properties.scene }, tabTitle: 'Edit - ' +  properties.scene.title, newTab: true})">{{$t('EDIT').toUpperCase()}}</button>
            <button class="es-button-white" @click="DELETE_FROM_LIST('scenes',  properties.scene)">{{$t('DELETE').toUpperCase()}}</button>
          </div>
        </div>
      </div>
      <div class="es-scene-details-tab">
        <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-scene-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
        <div v-bind:class="{ 'active' : tab.active == 'locations' }" @click="changeTab('locations')" class="es-scene-details-tab-item">{{$tc('LOCATION', 2).toUpperCase()}}</div>
        <div v-bind:class="{ 'active' : tab.active == 'items' }" @click="changeTab('items')" class="es-scene-details-tab-item">{{$tc('ITEM', 2).toUpperCase()}}</div>
        <div v-bind:class="{ 'active' : tab.active == 'characters' }" @click="changeTab('characters')" class="es-scene-details-tab-item">{{$tc('CHARACTER', 2).toUpperCase()}}</div>
        <div v-bind:class="{ 'active' : tab.active == 'versions' }" @click="changeTab('versions')" class="es-scene-details-tab-item">{{$tc('VERSION', 2).toUpperCase()}}</div>
        <div v-bind:class="{ 'active' : tab.active == 'compare-versions' }" @click="changeTab('compare-versions')" class="es-scene-details-tab-item">{{$t('COMPARE_VERSIONS').toUpperCase()}}</div>
      </div>
      <div v-if="tab.active === 'content'"  class="es-scene-details-tab-content">
        <div v-html="getSceneContent" class="description" ></div>
      </div>
      <div v-if="tab.active === 'locations'"  class="es-scene-details-tab-content no-padding">
        <scene-locations :properties="{ scene: page.data.scene }"></scene-locations>
      </div>
      <div v-if="tab.active === 'items'"  class="es-scene-details-tab-content no-padding">
        <scene-items :properties="{ scene: page.data.scene }"></scene-items>
      </div>
      <div v-if="tab.active === 'characters'"  class="es-scene-details-tab-content no-padding">
        <scene-characters :properties="{ scene: page.data.scene }"></scene-characters>
      </div>
      <div v-if="tab.active === 'versions'"  class="es-scene-details-tab-content">
        <scene-versions :properties="{ scene: page.data.scene }"></scene-versions>
      </div>
      <div v-if="tab.active === 'compare-versions'"  class="es-scene-details-tab-content">
        <scene-compare-versions :properties="{ scene: page.data.scene }"></scene-compare-versions>
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
                    <tiny-editor :initValue="scene_version.change_description"
                                 v-on:getEditorContent="setDescription"
                                 class="form-control"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <div class="text-right">
                      <b-button variant="outline-dark" class="mr-2" @click="busy = !busy">Cancel</b-button>
                      <b-button variant="dark" @click="saveNewVersion">Save</b-button>
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
import SceneLocations from '@/components/pages/scene-locations'
import SceneItems from '@/components/pages/scene-items'
import SceneCharacters from '@/components/pages/scene-characters'
import SceneVersions from '@/components/pages/scene-versions'
import SceneCompareVersions from '@/components/pages/scene-compare-versions'

export default {
  name: 'scene-details',
  props: ['properties'],
  computed: {
    getSceneContent: function () {
      var scope = this
      var sceneID = scope.page.data.scene.uuid
      return this.$store.getters.getSceneContent(sceneID)
    }
  },
  data: function () {
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
      tempVersionDesc: ''
    }
  },
  components: {
    TinyMCE,
    SceneLocations,
    SceneItems,
    SceneCharacters,
    SceneVersions,
    SceneCompareVersions
  },
  methods: {
    setDescription (value) {
      var scope = this
      scope.tempVersionDesc = value
    },
    newVersion: function () {
      var scope = this
      this.busy = true

      scope.scene_version.change_description = ''
      if (scope.scene_version.id) {
        delete (scope.scene_version.id)
        delete (scope.scene_version.uuid)
      }
    },
    changeTab: function (tab) {
      var scope = this
      scope.tab.active = tab
    },
    saveNewVersion () {
      var scope = this

      scope.scene_version.change_description = scope.tempVersionDesc
      scope.scene_version.content = scope.getSceneContent
      scope.scene_version.book_scene_id = scope.page.data.scene.uuid

      scope.axios
        .post('http://localhost:3000/scene-versions', scope.scene_version)
        .then(response => {
          if (response.data) {
            // TODO: Insert vuex code that will refresh the chapter version
            scope.tab.active = 'content'
            scope.LOAD_LIST('scene-versions', scope.page.data.scene)
            this.busy = false
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Scene version successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.tab.active = 'versions'
            })
          }
        })
    },
    initializeData: function () {
      var scope = this
      scope.page.data = scope.properties
      scope.LOAD_LIST('scene-versions', scope.page.data.scene)
      scope.LOAD_LIST('scene-locations', scope.page.data.scene)
      scope.LOAD_LIST('scene-items', scope.page.data.scene)
      scope.LOAD_LIST('scene-characters', scope.page.data.scene)
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
    .es-scene-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
    .es-scene-details-tab .es-scene-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
    .es-scene-details-tab .es-scene-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
    .es-scene-details-tab .es-scene-details-tab-item.active:after { background:#922c39;  }

    .es-scene-details-tab-content { position:relative; padding:30px; background:#fff; height:calc(100vh - 247px); overflow-y:auto; display:block; }
    .es-scene-details-tab-content.no-padding { padding:0px; }
    .es-scene-details-tab-content.active { display:block; }
</style>
