<template>
<div class="page-scene-listing">
   <div>
        <div class="es-page-head">
            <div class="inner">
                <div class="details">
                    <h4>Scenes</h4>
                    <small>Below are the list of scenes under {{ properties.title }}</small>
                </div>
                <div class="actions">
                    <button class="es-button-white" @click="CHANGE_COMPONENT('scene-form',{ book_id: properties.uuid , uuid: properties.uuid },'New Scenes', true)">New Scene</button>
                </div>
            </div>
        </div>

        <div class="es-page-content">
            <div class="es-row">
                <div class="es-col fadeIn animated" v-for="scene in GET_SCENES_BY_BOOK(bookUUID)" v-bind:key="scene.id">
                    <div class="es-card">
                        <div class="es-card-content">
                            <p class="title">{{ scene.title || 'Untitled' }}</p>
                            <i class="description">{{ scene.short_description || 'No Short Description...'  }}</i>
                        </div>
                        <div class="es-card-footer">
                            <button @click="CHANGE_COMPONENT('scene-details',{ book_id: scene.book_uuid, scene: scene}, scene.title )" class="btn-"><i class="lar la-eye"></i> VIEW</button>
                            <button @click="CHANGE_COMPONENT('scene-form',{ book_id: scene.book_uuid, scene: scene}, 'Edit ' + scene.title )" class="btn-"><i class="las la-pencil-alt"></i> EDIT</button>
                            <button @click="DELETE_FROM_LIST('scenes', scene)" class="btn-delete"><i class="las la-trash-alt"></i> DELETE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   </div>
</div>
</template>

<script>
export default {
  name: 'scene-listing',
  props: ['properties'],
  data: function () {
    return {
      otherScenes: [],
      bookUUID: ''
    }
  },
  methods: {
    toggleFilter: function () {
      var scope = this
      scope.filter.is_open = !scope.filter.is_open
    },
    filterResults: function () {
      var scope = this
      console.log(scope.filter.keyword)
    },
    getOtherScenes: function (bookId) {
      var scope = this
      scope.axios
        .get('http://localhost:3000/books/' + bookId + '/scenes/other')
        .then(response => {
          scope.otherScenes = response.data
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
</style>
