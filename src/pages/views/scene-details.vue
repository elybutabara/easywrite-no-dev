<template>
<div v-if="page.is_ready" class="page-scene-details">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <div>
                    <h4><strong>{{ properties.scene.title }}</strong></h4>
                </div>
            </div>
            <div class="actions">
                <button class="es-button-white" @click="newVersion()">SAVE AS NEW VERSION</button>
                <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + properties.scene.uuid, tabComponent: 'scene-form', tabData: { book_id: properties.scene.book_id, scene: properties.scene }, tabTitle: 'Edit - ' +  properties.scene.title, newTab: true})">EDIT</button>
                <button class="es-button-white" @click="deleteScene(properties.scene)">DELETE</button>
            </div>
        </div>
    </div>
    <div class="es-scene-details-tab">
        <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-scene-details-tab-item">CONTENT</div>
        <div v-bind:class="{ 'active' : tab.active == 'locations' }" @click="changeTab('locations')" class="es-scene-details-tab-item">LOCATIONS</div>
        <div v-bind:class="{ 'active' : tab.active == 'items' }" @click="changeTab('items')" class="es-scene-details-tab-item">ITEMS</div>
        <div v-bind:class="{ 'active' : tab.active == 'characters' }" @click="changeTab('characters')" class="es-scene-details-tab-item">CHARACTERS</div>
        <div v-bind:class="{ 'active' : tab.active == 'versions' }" @click="changeTab('versions')" class="es-scene-details-tab-item">VERSIONS</div>
        <div v-bind:class="{ 'active' : tab.active == 'compare-versions' }" @click="changeTab('compare-versions')" class="es-scene-details-tab-item">COMPARE VERSIONS</div>
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
      page: {
        is_ready: false,
        title: '',
        data: null
      },
      tab: {
        active: 'content'
      }
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
    changeTab: function (tab) {
      var scope = this
      scope.tab.active = tab
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
    },
    deleteScene: function (scene) {
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
            .delete('http://localhost:3000/scenes/' + scene.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Scene successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeSceneFromList', scene)
                  scope.CHANGE_COMPONENT({tabKey: 'scene-listing-' + scene.book_id, tabComponent: 'scene-listing', tabData: { uuid: scene.book_id }, tabTitle: 'Scene List', tabIndex: scope.$store.getters.getActiveTab})
                })
              }
            })
        }
      })
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
