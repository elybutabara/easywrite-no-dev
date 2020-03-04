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
          <input name="title" type="text" class="form-control" placeholder="Title" >
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <label>Genre: </label>
          <select class="form-control select2-allow-clear select2-single" id="genre"></select>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <label>Description: </label>
          <editor id="book-description"
                  name="description"
                  class="form-control"
          />
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'book-form',
  data: function () {
    return {
    }
  },
  components: {
  },
  methods: {
  },
  mounted () {
    var scope = this
    scope.$refs.editor.initEditor('book-description')
    // console.log(scope.editor)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-book-form { padding:20px; }

  .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
  .page-title h3 { font-size:35px; }
</style>
