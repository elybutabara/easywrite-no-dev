<template>
<div class="page-location-listing">
   <div>
       <div class="es-page-head">
            <div class="inner">
                <div class="details">
                    <h4>Locations</h4>
                    <small>Below are the list of locations under {{ properties.title }}</small>
                </div>
                <div class="actions">
                    <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'location-form', tabComponent: 'location-form', tabData: { list_index: -1, book_id: properties.uuid, location: null }, tabTitle: 'New Location', newTab: true})">New Location</button>
                </div>
            </div>
        </div>

       <div class="es-page-content">
            <div class="es-row">
                <div class="es-col fadeIn animated" v-for="location in GET_LOCATIONS_BY_BOOK(bookUUID)" v-bind:key="location.id">
                    <div class="es-card">
                        <div class="es-card-content">
                            <p class="title">{{ location.location || 'Untitled' }}</p>
                            <i class="description" v-if="location.description !== '' && location.description !== null" v-html="location.description"></i>
                            <i class="description" v-else>No Description</i>
                        </div>
                        <div class="es-card-footer">
                            <button class="btn-"  @click="CHANGE_COMPONENT({tabKey: 'location-details-' + location.uuid, tabComponent: 'location-details', tabData: { book_id: properties.uuid, location: location }, tabTitle:  location.location, newTab})"><i class="lar la-eye"></i> VIEW</button>
                            <button class="btn-" @click="CHANGE_COMPONENT({tabKey: 'location-form-' + location.uuid, tabComponent: 'location-form', tabData: { book_id: properties.uuid, location: location }, tabTitle: 'Edit - ' + location.location, newTab: true})"><i class="las la-pencil-alt"></i> EDIT</button>
                            <button class="btn-delete"  @click="DELETE_FROM_LIST('locations', location)"><i class="las la-trash-alt"></i> DELETE</button>
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
  name: 'location-listing',
  props: ['properties'],
  data: function () {
    return {
      locations: [],
      bookUUID: ''
    }
  },
  methods: {
    editLocation: function (location) {
      var scope = this
      scope.$parent.changeComponent('location-form', { location: location })
    },
    viewLocation: function (location) {
      var scope = this
      scope.$parent.changeComponent('location-details', { location: location })
    },
    deleteLocation: function (locationId) {
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
            .delete('http://localhost:3000/locations/' + locationId)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Locations successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.getLocations(scope.properties.uuid)
                  scope.$parent.changeComponent('location-listing', scope.properties)
                })
              }
            })
        }
      })
    },
    toggleFilter: function () {
      var scope = this
      scope.filter.is_open = !scope.filter.is_open
    },
    filterResults: function () {
      // var scope = this
      // console.log(scope.filter.keyword)
    },
    getLocations: function (bookId) {
      var scope = this
      scope.axios
        .get('http://localhost:3000/books/' + bookId + '/locations')
        .then(response => {
          scope.locations = response.data
        })
    },
    createLocation () {
      var scope = this
      scope.$parent.changeComponent('location-form', scope.properties)
    }
  },
  mounted () {
    var scope = this
    // scope.getLocations(scope.properties.uuid)
    scope.bookUUID = scope.properties.uuid
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
    .es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; }
    .es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

    .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }

    .es-card .es-card-footer { position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 0px; border-top:1px solid #e0e5ee; }
    .es-card .es-card-footer button { font-weight:600; background:transparent; border:none; height:40px; line-height:32px; text-align:center; font-size:14px; padding:0px 8px; }
    .es-card .es-card-footer button:hover { background:#e0e5ee; }
    .es-card .es-card-footer button i { font-size:18px; }
    .es-card .es-card-footer button.btn-delete { font-weight:600; color:#8f2c39; border-left:1px solid #e0e5ee; position:absolute; top:0px; right:0px; }
</style>
