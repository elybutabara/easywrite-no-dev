<template>
    <div class="page-content">
        This is a test
        <div class="es-card">
          <multiselect class="custom-multiselect" :preselectFirst="true" :allow-empty="false" v-model="selected_scene" :options="options_scenes"  @select="selectMultiselect" :placeholder="$t('SELECT') + ' ' + $t('SCENE')" label="title" track-by="uuid" :deselectLabel="$t('SELECTED')" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
          <div v-html="properties.scene_content"></div>
            <!-- {{properties.chapter_id}} -->
            <button @click="CloseMe()">Close</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'save-to-scene',
  props: ['properties'],
  data: function () {
    return {
      selected_scene: null,
      options_scenes: [{title: this.$t('NEW_SCENE'), uuid: '-1'}]
    }
  },
  methods: {
    CloseMe: function () {
      var scope = this
      scope.$parent.closeSaveToScene()
    },
    loadScene () {
      var scope = this

      let scenes = scope.$store.getters.getScenesByChapter(scope.properties.chapter_id)

      scope.options_scenes = [{title: scope.$t('NEW_SCENE'), uuid: '-1'}]
      scenes.forEach(function (row, index) {
        scope.options_scenes.push(row)
      })
      console.log(scope.options_scenes)
    },
    selectMultiselect () {
      var scope = this
      console.log(scope.selected_scene)
    }
  },
  mounted () {
    var scope = this
    scope.loadScene()
  }
}
</script>

<style scoped>
    .page-content {  position: fixed; top: 0px; left: 0px;  background: rgba(31,46,58,0.8); width: 100%; height: 100vh; z-index: 999; }
    .page-content .es-card { margin-top:100px; }
    .es-card { width:calc(100% - 40px); max-width:750px; margin:0px auto; margin-top:10px; color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    /* .page-content { position: fixed; top: 0; left: 0; bottom: 0; right: 0; overflow: auto; background-color: rgba(44, 46, 47, 0.9); z-index: 2}
    .page-content .es-card { margin-top: 100px; margin-bottom: 70px; } */
</style>
