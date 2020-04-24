<template>
<div class="page-scene-listing">
   <div>
        <div class="es-page-head">
            <div class="inner">
                <div class="details">
                    <h4>{{$tc('SCENE',2)}}</h4>
                    <small>{{$t('BELOW_ARE_THE_LIST_OF_CHAPTERS_UNDER')}} {{ properties.title }}</small>
                </div>
                <div class="actions">
                    <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + properties.uuid, tabComponent: 'scene-form', tabData: { book_id: properties.uuid , uuid: properties.uuid }, tabTitle: 'New Scenes', newTab: true})">{{$t('NEW').toUpperCase()}} {{$tc('SCENE', 1).toUpperCase()}}</button>
                </div>
            </div>
        </div>

        <div class="es-page-content">
            <draggable v-model="scenes" draggable=".es-col" class="es-row">
                <div class="es-col fadeIn animated" v-for="scene in scenes" v-bind:key="scene.id">
                    <div class="es-card">
                        <div class="es-card-content">
                        <div class="es-card-actions">
                            <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + scene.uuid, tabComponent: 'scene-form',  tabData: { book_id: scene.book_id, scene: scene}, tabTitle: 'Edit ' + scene.title, newTab: true })"><i class="las la-pencil-alt"></i></button>
                            <button class="btn-circle" @click="deleteScene(scene)"><i class="las la-trash-alt"></i></button>
                            <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + scene.uuid, tabComponent: 'scene-details',  tabData: { book_id: scene.book_id, scene: scene}, tabTitle: scene.title, newTab: true })"><i class="lar la-eye"></i></button>
                        </div>
                            <p class="title">{{ scene.title || 'Untitled' }}</p>
                            <i class="description ellipsis-2">{{ scene.short_description || $t('NO_SHORT_DESCRIPTION') + '...'  }}</i>
                        </div>
                        <div class="es-card-footer">
                            <small>{{$tc('VERSION', 2)}}: {{ scene.scene_version.length }}</small>
                            <small style="float:right;">{{$t('WORD_COUNT')}}: {{ WORD_COUNT(scene.scene_version[0].content) }}</small>
                        </div>
                    </div>
                </div>
            </draggable>
        </div>
   </div>
</div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'scene-listing',
  props: ['properties'],
  data: function () {
    return {
      otherScenes: [],
      bookUUID: ''
    }
  },
  components: {
    draggable
  },
  computed: {
    scenes: {
      get () {
        let scope = this
        let scenes = scope.$store.getters.getScenesByBook(scope.bookUUID)
        return scenes
      },
      set (value) {
        let scope = this
        this.$store.commit('sortScenes', { PARENT: scope.bookUUID, data: value })
      }
    }
  },
  methods: {
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
                })
              }
            })
        }
      })
    }
  },
  mounted () {
    var scope = this
    // scope.getOtherScenes(scope.properties.id)
    scope.bookUUID = scope.properties.uuid
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
    .es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; padding-right:110px; }
    .es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

    .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }

    .es-card .es-card-footer { position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 0px; border-top:1px solid #e0e5ee; }
    .es-card .es-card-footer button { font-weight:600; background:transparent; border:none; height:40px; line-height:32px; text-align:center; font-size:14px; padding:0px 8px; }
    .es-card .es-card-footer button:hover { background:#e0e5ee; }
    .es-card .es-card-footer button i { font-size:18px; }
    .es-card .es-card-footer button.btn-delete { font-weight:600; color:#8f2c39; border-left:1px solid #e0e5ee; position:absolute; top:0px; right:0px; }

    .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }
    .es-card .es-card-content .es-card-actions .btn-circle { background:transparent; border:1px solid #e0e5ee; border-radius:50%; width:30px; height:30px; line-height:22px; text-align:center; font-size:15px; }
    .es-card .es-card-footer { background:#f5f8fa; height:40px; line-height:40px; padding:0px 20px; border-top:1px solid #e0e5ee; }
</style>
