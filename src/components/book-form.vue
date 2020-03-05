<template>
<div class="page-book-form">
  <div class="page-title">
    <h3>Create New Book</h3>
  </div>
  <div class="content" >
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <label>Title: </label>
          <input v-model="data.title" type="text" class="form-control" placeholder="Title" >
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <label>Genre: </label>
          <multiselect v-model="genre_collection" :multiple="true" :taggable="true" label="name" track-by="id" :options="genres"></multiselect>
<!--          <select2 :options="options" v-model="selected">-->
<!--            <option disabled value="0">Select one</option>-->
<!--          </select2>-->
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <label>Description: </label>
          <tiny-editor v-model="data.about"
                  id="tiny-area"
                  class="form-control"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <button @click="saveBook">Save</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import TinyMCE from './TinyMCE'

export default {
  name: 'book-form',
  data: function () {
    return {
      data: {
        author_id: this.$store.getters.getAuthorID,
        title: '',
        book_genre_collection: [],
        about: ''
      },
      genre_collection: [],
      genres: []
    }
  },
  components: {
    TinyMCE,
    Multiselect
  },
  methods: {
    getGenre: function () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/books/genres')
        .then(response => {
          scope.genres = response.data
        })
    },
    saveBook: function () {
      var scope = this

      scope.genre_collection.forEach(function (item, index) {
        scope.data.book_genre_collection.push({
          genre_id: item.id
        })
      })

      scope.axios
        .post('http://localhost:3000/books', scope.data)
        .then(response => {
          if (response.data) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Book successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              console.log(response.data)
            })
          }
          // scope.genres = response.data
        })
    }
  },
  mounted () {
    var scope = this
    // scope.components.TinyMCE.methods.initEditor('.tiny-area')
    scope.getGenre()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-book-form { padding:20px; }

  .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
  .page-title h3 { font-size:35px; }
</style>
