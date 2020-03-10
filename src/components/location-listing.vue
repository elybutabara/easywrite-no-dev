<template>
<div class="page-location-listing">
   <div>
       <button @click="createLocation" class="btn-new-record"><i class="las la-plus"></i></button>
        <div class="row">
           <div class="col-12 col-md-7">
                <div class="page-title">
                    <button @click="toggleFilter()" class="btn-toggle-filter"><i class="las la-filter"></i></button>
                    <h3>{{ properties.title }}'s Locations</h3>
                </div>
           </div>
           <div class="col-12 col-md-5">
               <div v-bind:class="{ 'open' : filter.is_open }" class="page-actions">
                    <div class="search-box">
                        <form v-on:submit.prevent="filterResults()">
                            <input v-model="filter.keyword" type="text" placeholder="Enter a keyword...">
                            <button class="btn-search" type="submit"><i class="las la-search"></i></button>
                        </form>
                    </div>
                </div>
           </div>
        </div>
        <hr/>

       <div class="row">
            <div class="col-12 col-lg-3 col-md-6 col-sm-6 fadeIn animated" v-for="location in locations" v-bind:key="location.id">
                <div class="item" >
                    <div class="content">
                        <div class="picture-placeholder"><img :src="location.picture_src" /></div>
                        <strong>{{ location.location }}</strong>
                        <div  v-html="location.description" class="description" >{{ location.description }}</div>
                        <button @click="viewLocation(location)" type="button">VIEW</button>
                        <button @click="editLocation(location)" type="button">EDIT</button>
                        <button @click="deleteLocation(location.id)" type="button">DELETE</button>
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
      filter: {
        is_open: false,
        keyword: ''
      }
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
              scope.getLocations(scope.properties.id)
              scope.$parent.changeComponent('location-listing', scope.properties)
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
    scope.getLocations(scope.properties.id)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .page-location-listing { padding:20px; }
    .page-location-listing .item { margin-top:20px; border:1px solid #9fb1c2; text-align:center; }
    .page-location-listing .item .header { background:#354350; padding:0px 20px; height:35px; line-height:38px; color:#fff; border:2px solid #354350; }
    .page-location-listing .item .content { padding:20px; background:#fff; }
    .page-location-listing .item .content .picture-placeholder {  display:block; margin:0px auto; width: 200px; height: 100px; background:#ccd5dd; border:2px solid #9fb1c2; margin-bottom:10px; cursor:pointer; }
    .page-location-listing .item .content .picture-placeholder img { height: 100% }
    .page-location-listing .item .content strong { font-family:'Crimson Bold'; font-size:18px; }
    .page-location-listing .item .content .description { font-size:16px; }
    .page-location-listing .item .content button { background:#fff; border:1px solid #efefef; padding:5px 10px; padding-bottom:0px; }

    .page-title { position:relative; padding-right:50px; }
    .page-actions { text-align:right; margin-top:10px;  }
    .page-actions .search-box  { position:relative; display:inline-block; width:350px; }
    .page-actions .search-box input { width:100%;  padding:0px 10px; padding-top:3px; padding-right:30px; height:35px; line-height:35px; }
    .page-actions .search-box .btn-search {  position:absolute; top:2px; right:0px; height:35px; width:35px; background:none; border:none; }

    .btn-new-record { z-index:500; padding-top:8px; position:fixed; bottom:20px; right:20px; height:50px; width:50px; border-radius:50%; background:#c12938; color:#fff; border:none; font-size:25px; }
    .btn-toggle-filter { display:none; float:right;  position:absolute; top:0px; right:0px; background:#fff; border:1px solid #9fb1c2; padding-top:5px; padding-bottom:0px; }

    @media only screen and (max-width: 968px) {
        .page-location-listing .item .header { padding:0px 15px; }
        .page-location-listing .item .content { padding:15px;  }

        .page-location-listing .item .content strong { font-family:'Crimson Bold'; font-size:16px; }
        .page-location-listing .item .content .description { font-size:14px; }

        .page-actions {  text-align:left;  display:none; }
        .page-actions.open {  display:block; }
        .page-actions .search-box  { width:100%; }

        .btn-toggle-filter { display:inline-block; }
    }
</style>
