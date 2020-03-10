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
          <multiselect v-model="genre_collection" @select="selectGenre" @remove="removeGenre" :multiple="true" :taggable="true" label="name" track-by="id" :options="genres"></multiselect>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <label>Description: </label>
          <tiny-editor :initValue="data.about"
                       v-on:getEditorContent="setAboutValue"
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
  props: ['properties'],
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
    // Required for geting value from TinyMCE content
    setAboutValue (value) {
      var scope = this

      scope.data.about = value
    },
    removeGenre ({id}) {
      var scope = this
      scope.data.book_genre_collection.find(x => x.genre_id === id).deleted_at = window.moment().format('YYYY-MM-DD hh:mm:ss').toString()
    },
    selectGenre ({id}) {
      var scope = this
      if (scope.data.book_genre_collection.find(x => (x.genre_id === id && x.deleted_at !== undefined)) !== undefined) {
        delete scope.data.book_genre_collection.find(x => x.genre_id === id).deleted_at
      }
    },
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
        if (scope.data.book_genre_collection.find(x => x.genre_id === item.id) === undefined) {
          scope.data.book_genre_collection.push({
            genre_id: item.id
          })
        }
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
              scope.$parent.getBooks()
              scope.$parent.changeComponent('book-details', response.data)
            })
          }
        })
    },
    loadBook: function () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/books/' + scope.data.id)
        .then(response => {
          let book = response.data
          scope.data.title = book.title
          scope.data.about = book.about

          book.book_genre_collection.forEach(function (item, index) {
            scope.data.book_genre_collection.push({
              id: item.id,
              book_id: item.book_id,
              genre_id: item.genre_id
            })

            if (scope.genres.find(x => (x.id === item.genre_id)) !== undefined) {
              var selectedGenre = scope.genres.find(x => (x.id === item.genre_id))
              scope.genre_collection.push({
                id: selectedGenre.id,
                name: selectedGenre.name
              })
            }
          })
        })
    }
  },
  beforeMount () {
    var scope = this

    scope.getGenre()

    scope.$set(scope.data, 'id', scope.properties.id)
    if (scope.data.id) {
      scope.loadBook()
    }
  },
  mounted () {
    // var scope = this
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-book-form { padding:20px; }

  .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
  .page-title h3 { font-size:35px; }
</style>
