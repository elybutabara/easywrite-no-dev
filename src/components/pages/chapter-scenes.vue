<template>
    <div v-if="page.is_ready" class="page-chapter-scenes fadeIn animated">
        <div style="padding:0px 10px; text-align:right; margin-bottom:20px;">
            <button @click="CHANGE_COMPONENT('scene-form',{ book_id: chapter.book_id, chapter: chapter }, 'New Scene', true)" class="btn-new-scene">
                <i class="las la-plus"></i> ADD NEW SCENE
            </button>
        </div>
        <div class="es-row">
            <div class="es-col fadeIn animated" v-for="scene in scenes" v-bind:key="scene.id">
                <div class="es-card">
                    <div class="es-card-content">
                      <div class="es-card-actions">
                        <button class="btn-circle" @click="CHANGE_COMPONENT('scene-form',{ book_id: scene.book_id, scene: scene}, 'Edit ' + scene.title )"><i class="las la-pencil-alt"></i></button>
                        <button class="btn-circle" @click="DELETE_FROM_LIST('scenes', scene)"><i class="las la-trash-alt"></i></button>
                        <button class="btn-circle" @click="CHANGE_COMPONENT('scene-details',{ book_id: scene.book_id, scene: scene}, scene.title , true)"><i class="lar la-eye"></i></button>
                      </div>
                        <p class="title">{{ scene.title || 'Untitled' }}</p>
                        <i class="description ellipsis-2">{{ scene.short_description || 'No Short Description...'  }}</i>
                    </div>
                    <div class="es-card-footer">
                      <small>Versions: {{ scene.scene_version.length }}</small>
                      <small style="float:right;">Word Count: {{ WORD_COUNT(scene.scene_version[0].content) }}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'chapter-scenes',
  props: ['properties'],
  data: function () {
    return {
      page: {
        title: '',
        is_ready: false,
        data: null
      },
      chapter: null,
      scenes: []
    }
  },
  methods: {

  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this
    scope.chapter = scope.properties.chapter
    scope.scenes = scope.GET_SCENES_BY_CHAPTER(scope.chapter.uuid)

    console.log(scope.scenes)

    setTimeout(function () {
      scope.page.is_ready = true
    }, 500)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .scene-listing { background:transparent; }
    .scene-listing .btn-new-scene { background:#fff; color:#324553; border:1px solid #496d7d; height:30px; line-height:30px; padding:0px 10px; }
    .scene-listing .es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    .scene-listing .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
    .scene-listing .es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; padding-right:110px; }
    .scene-listing .es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

    .scene-listing .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }

    .scene-listing .es-card .es-card-footer { position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 0px; border-top:1px solid #e0e5ee; }
    .scene-listing .es-card .es-card-footer button { font-weight:600; background:transparent; border:none; height:40px; line-height:32px; text-align:center; font-size:14px; padding:0px 8px; }
    .scene-listing .es-card .es-card-footer button:hover { background:#e0e5ee; }
    .scene-listing .es-card .es-card-footer button i { font-size:18px; }
    .scene-listing .es-card .es-card-footer button.btn-delete { font-weight:600; color:#8f2c39; border-left:1px solid #e0e5ee; position:absolute; top:0px; right:0px; }

    .scene-listing .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }
    .scene-listing .es-card .es-card-content .es-card-actions .btn-circle { background:transparent; border:1px solid #e0e5ee; border-radius:50%; width:30px; height:30px; line-height:22px; text-align:center; font-size:15px; }
    .scene-listing .es-card .es-card-footer { background:#f5f8fa; height:40px; line-height:40px; padding:0px 20px; border-top:1px solid #e0e5ee; }
</style>
