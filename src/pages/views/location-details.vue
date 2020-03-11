<template>
<div class="page-location-details">
  <div style="padding:20px;">
    <h2 style="margin:0px; font-family:'Crimson Roman Bold';">{{ properties.location.location }}</h2>
    <small style="font-family:'Crimson Roman'; font-size:12px; color:#72789b;">Tags: {{ properties.location.tags }}</small>
    <div class="row">
      <div class="col-12 col-lg-12 order-2 order-lg-1">
        <div>
          <button  @click="editLocation()" class="update-book">Update</button>
          <button  @click="deleteLocation()" class="delete-book">Delete</button>
        </div>
      </div>
      <div class="col-12 col-lg-12 order-2 order-lg-1">
        <div class="image-container"><img :src="properties.location.picture_src" /></div>
        <div v-html="properties.location.description" style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';"></div>
      </div>
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
  methods: {
    editLocation () {
      var scope = this
      scope.$parent.changeComponent('location-form', { location: scope.location })
    },
    deleteLocation: function () {
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
            .delete('http://localhost:3000/locations/' + scope.location.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Locations successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$parent.changeComponent('location-listing', scope.location.book)
                })
              }
            })
        }
      })
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
  .image-container img { width: 30% }
</style>
