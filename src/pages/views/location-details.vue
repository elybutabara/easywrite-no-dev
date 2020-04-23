<template>
<div class="page-location-details">

    <div class="es-panel">
        <div class="es-panel-content">
            <div class="image-container"><img :src="properties.location.picture_src" /></div>
            <h2 class="title">{{ properties.location.location  || 'Untitled' }}</h2>
            <p class="aka">{{ properties.location.AKA || $t('AKA') + ' ' + $t('NOT_SET')}}</p>
            <i class="description" v-if="properties.location.description !== '' && properties.location.description !== null" v-html="properties.location.description" ></i>
            <i class="description" v-else>{{$t('NO')}} {{$t('DESCRIPTION')}}</i>
        </div>
        <div class="es-panel-footer">
            <div class="cta" @click="CHANGE_COMPONENT({tabKey: 'location-form-' + properties.location.uuid, tabComponent: 'location-form', tabData: { book_id: properties.uuid, location: properties.location }, tabTitle: 'Edit - ' + properties.location.location, newTab: true})">{{$t('EDIT').toUpperCase()}}</div>
            <div class="cta" @click="DELETE_FROM_LIST('locations', properties.location)">{{$t('DELETE').toUpperCase()}}</div>
        </div>
    </div>

</div>
</template>

<script>
export default {
  name: 'location-details',
  props: ['properties'],
  data: function () {
    return {
      location: []
    }
  },
  beforeMount () {
    var scope = this
    scope.$set(scope, 'location', scope.properties.location)
  },
  mounted () {
    // var scope = this
    // console.log(scope.location)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .image-container { text-align: center; }
  .image-container img { width:100%; max-width:250px; }

  .es-panel { background:#fff; margin:0px auto; margin-top:70px; max-width:670px; border:1px solid #e0e5ee; }
  .es-panel .es-panel-content { padding:30px 30px; }
  .es-panel .es-panel-content .title { margin:0px; margin-top:20px; text-align:center;  font-size:25px; font-weight:600; color:#293742; }
  .es-panel .es-panel-content .aka { margin-top:0px; text-align:center;  font-size:16px; color:#922c39; font-weight:600; }
  .es-panel .es-panel-content .tags { text-align:center; font-size:16px; color:#293742; }
  .es-panel .es-panel-content .description { display:block; padding:20px 0px; font-size:18px; text-align:center; }

  .es-panel .es-panel-footer { display:flex; background:#f5f8fa; border-top:1px solid #e0e5ee; height:40px; line-height:40px; padding:0px 0px; }
  .es-panel .es-panel-footer .cta { font-weight:600; cursor:pointer; text-align:center; width:50%;}
  .es-panel .es-panel-footer .cta:first-child {  border-right:1px solid #e0e5ee; }
</style>
