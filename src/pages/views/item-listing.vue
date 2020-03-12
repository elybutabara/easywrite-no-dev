<template>
<div class="page-item-listing">
   <div>
       <button @click="createItem" class="btn-new-record"><i class="las la-plus"></i></button>
       <div class="row">
           <div class="col-12 col-md-7">
                <div class="page-title">
                    <button @click="toggleFilter()" class="btn-toggle-filter"><i class="las la-filter"></i></button>
                    <h3>{{ properties.title }}'s Items</h3>
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
            <div class="col-12 col-lg-4 col-md-6 col-sm-6 bounceInRight animated" v-for="item in items" v-bind:key="item.id">
                <div class="item" >
                    <div class="content">
                        <div class="picture-placeholder"><img :src="item.picture_src" /></div>
                        <strong> {{ item.itemname }} </strong>
                        <div v-html="item.description" class="description" >{{ item.description }}</div>
                        <button @click="viewItem(item)" type="button">VIEW</button>
                        <button @click="editItem(item)" type="button">EDIT</button>
                        <button @click="deleteItem(item.uuid)" type="button">DELETE</button>
                    </div>
                </div>
            </div>
       </div>
   </div>
</div>
</template>

<script>
export default {
  name: 'item-listing',
  props: ['properties'],
  data: function () {
    return {
      items: [],
      filter: {
        is_open: false,
        keyword: ''
      }
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
    getItems: function (bookId) {
      var scope = this
      scope.axios
        .get('http://localhost:3000/books/' + bookId + '/items')
        .then(response => {
          scope.items = response.data
        })
    },
    createItem () {
      var scope = this
      scope.$parent.changeComponent('item-form', scope.properties)
    },
    editItem: function (item) {
      var scope = this
      scope.$parent.changeComponent('item-form', { item: item })
    },
    viewItem: function (item) {
      var scope = this
      scope.$parent.changeComponent('item-details', { item: item })
    },
    deleteItem: function (locationId) {
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
            .delete('http://localhost:3000/items/' + locationId)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Item successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.getItems(scope.properties.uuid)
                  scope.$parent.changeComponent('item-listing', scope.properties)
                })
              }
            })
        }
      })
    }
  },
  mounted () {
    var scope = this
    scope.getItems(scope.properties.uuid)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .page-item-listing { padding:20px; }
    .page-item-listing .item { margin-top:20px; border:1px solid #9fb1c2; text-align:center; }
    .page-item-listing .item .header { background:#354350; padding:0px 20px; height:35px; line-height:38px; color:#fff; border:2px solid #354350; }
    .page-item-listing .item .content { padding:20px; background:#fff; }
    .page-item-listing .item .content .picture-placeholder {  display:block; margin:0px auto;  width:200px; height:100px; background:#ccd5dd; border:2px solid #9fb1c2; margin-bottom:10px; cursor:pointer; }
    .page-item-listing .item .content .picture-placeholder img { height: 100% }
    .page-item-listing .item .content strong { font-family:'Crimson Bold'; font-size:18px; }
    .page-item-listing .item .content .description { font-size:16px; }
    .page-item-listing .item .content button { background:#fff; border:1px solid #efefef; padding:5px 10px; padding-bottom:0px; }

    .page-title { position:relative; padding-right:50px; }
    .page-actions { text-align:right; margin-top:10px; }
    .page-actions .search-box  { position:relative; display:inline-block; width:350px; }
    .page-actions .search-box input { width:100%;  padding:0px 10px; padding-top:3px; padding-right:30px; height:35px; line-height:35px; }
    .page-actions .search-box .btn-search {  position:absolute; top:2px; right:0px; height:35px; width:35px; background:none; border:none; }

    .btn-new-record { z-index:500; padding-top:8px; position:fixed; bottom:20px; right:20px; height:50px; width:50px; border-radius:50%; background:#c12938; color:#fff; border:none; font-size:25px; }
    .btn-toggle-filter { display:none; float:right;  position:absolute; top:0px; right:0px; background:#fff; border:1px solid #9fb1c2; padding-top:5px; padding-bottom:0px; }

    @media only screen and (max-width: 968px) {
        .page-item-listing .item .header { padding:0px 15px; }
        .page-item-listing .item .content { padding:15px;  }

        .page-item-listing .item .content strong { font-family:'Crimson Bold'; font-size:16px; }
        .page-item-listing .item .content .description { font-size:14px; }

        .page-actions {  text-align:left;  display:none; }
        .page-actions.open {  display:block; }
        .page-actions .search-box  { width:100%; }

        .btn-toggle-filter { display:inline-block; }
    }
</style>
