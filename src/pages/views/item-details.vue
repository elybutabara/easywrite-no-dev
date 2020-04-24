<template>
<div class="page-item-details">
    <div class="es-panel">
        <div class="es-panel-content">
            <div class="image-container"><img :src="properties.item.picture_src" /></div>
            <h2 class="title">{{ properties.item.itemname || 'Untitled' }}</h2>
            <p class="aka">{{ properties.item.AKA || 'Not Set' }}</p>
            <div class="tags">{{ properties.item.tags || 'No tag is set' }}</div>
            <i class="description" v-if="properties.item.description !== '' && properties.item.description !== null" v-html="properties.item.description" ></i>
            <i class="description" v-else>No Description</i>
        </div>
        <div class="es-panel-footer">
            <div class="cta" @click="CHANGE_COMPONENT({tabKey: 'item-form-' + properties.item.uuid, tabComponent: 'item-form', tabData: { book_id: properties.uuid, item: properties.item }, tabTitle: 'Edit - ' + properties.item.itemname, newTab: true})">EDIT</div>
            <div class="cta" @click="deleteItem(properties.item)">DELETE</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'item-details',
  props: ['properties'],
  data: function () {
    return {
      page: {
        is_ready: false
      },
      item: []
    }
  },
  methods: {
    deleteItem: function (item) {
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
            .delete('http://localhost:3000/items/' + item.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Item successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeItemFromList', item)
                  scope.CHANGE_COMPONENT({tabKey: 'item-listing-' + item.book_id, tabComponent: 'item-listing', tabData: { uuid: item.book_id }, tabTitle: 'Item List', tabIndex: scope.$store.getters.getActiveTab})
                })
              }
            })
        }
      })
    }
  },
  beforeMount () {
    var scope = this
    scope.$set(scope, 'item', scope.properties.item)
  },
  mounted () {
    // var scope = this
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
