<template>
<div class="page-book-details">
    <div style="padding:20px;">
        <h2 style="margin:0px; font-family:'Crimson Roman Bold';">{{ properties.title }}</h2>
        <small style="font-family:'Crimson Roman'; font-size:12px; color:#72789b;">Date Modified: {{ properties.created_at }}</small>
        <div class="row">
            <div class="col-12 col-lg-12 order-2 order-lg-1">
                <div style="padding:10px 0px;">
                    <span class="book-genre" v-for="genre in properties.genre" :key="genre.id">{{ genre.name }}</span>
                </div>
                <div>
                  <button  @click="updateBook()" class="update-book">Update</button>
                  <button  @click="deleteBook()" class="delete-book">Delete</button>
                </div>
                <div v-html="properties.about" style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';">
                  {{ properties.about }}
                </div>
            </div>
            <div style="display:none;" class="col-12 col-lg-3 order-1 order-lg-2">
                <div class="book-stats">
                    <strong class="heading">Book Statistics</strong>
                    <ul class="list-group">
                        <li class="list-group-item"><span class="badge badge-success">12</span> &nbsp; <strong>Total Chapters</strong></li>
                        <li class="list-group-item"><span class="badge badge-success">38</span> &nbsp; <strong>Total Scenes</strong></li>
                        <li class="list-group-item"><span class="badge badge-success">21</span> &nbsp; <strong>Total Locations</strong></li>
                        <li class="list-group-item"><span class="badge badge-success">89</span> &nbsp; <strong>Total Items</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'book-details',
  props: ['properties'],
  data: function () {
    return {
    }
  },
  methods: {
    updateBook () {
      var scope = this
      scope.$parent.getBooks()
      scope.$parent.changeComponent('book-form', scope.properties)
    },
    deleteBook () {
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
            .delete('http://localhost:3000/books/' + scope.properties.id)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Book successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$parent.getBooks()
                  scope.$parent.changeComponent('book-listing', response.data)
                })
              }
            })
        }
      })
    }
  },
  mounted () {
    // var scope = this
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.book-stats { padding-left:30px; }
.book-stats .heading { font-family:'Gotham Bold'; }
.book-stats ul { margin-top:5px; }
.book-genre { padding:3px 10px; font-size:12px; font-size:10px; font-family:'Crimson Roman Bold'; text-transform: uppercase; margin-right: 3px; }
.book-genre:nth-child(odd) { background:#e1e7fe; color:#9098c5; }
.book-genre:nth-child(even) { background:#feedda; color:#d6a67f; }
@media only screen and (max-width: 968px) {
  .book-stats { display:none; }
}
</style>
