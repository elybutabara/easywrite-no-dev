<template>
<div class="page-item-form">
  <div class="page-title">
    <h3>New Chapter</h3>
  </div>
  <div class="content" >

    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <label>Title: </label>
          <input v-model="data.title" type="text" class="form-control" placeholder="Chapter Title" >
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <label>Short Description: </label>
          <input v-model.trim="data.short_description" type="text" class="form-control" placeholder="Short Description" >
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <label>Description: </label>
          <tiny-editor :initValue="data.chapter_version.content"
                       v-on:getEditorContent="setDescription"
                       class="form-control"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <button @click="saveChapter">Save</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import TinyMCE from '../../components/TinyMCE'

export default {
  name: 'book-form',
  props: ['properties'],
  data: function () {
    return {
      data: {
        book_id: this.properties.chapter.book_id,
        title: '',
        short_description: '',
        chapter_version: {
          content: ''
        }
      }
    }
  },
  components: {
    TinyMCE
  },
  methods: {
    // Required for geting value from TinyMCE content
    setDescription (value) {
      var scope = this

      scope.data.chapter_version.content = value
    },
    saveChapter () {
      var scope = this

      console.log(scope.data)

      scope.axios
        .post('http://localhost:3000/chapters', scope.data)
        .then(response => {
          if (response.data) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Chapter successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.$parent.changeComponent('chapter-details', response.data)
            })
          }
        })
    },
    loadChapter () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/chapters/' + scope.data.uuid)
        .then(response => {
          console.log(response.data)
          let chapter = response.data
          scope.data.title = chapter.title
          scope.data.short_description = chapter.short_description

          if (chapter.chapter_version[0]) {
            scope.data.chapter_version.id = chapter.chapter_version[0].id
            scope.data.chapter_version.uuid = chapter.chapter_version[0].uuid
            scope.data.chapter_version.content = chapter.chapter_version[0].content
          }
        })
    }
  },
  beforeMount () {
    var scope = this

    if (scope.properties.chapter) {
      scope.$set(scope.data, 'id', scope.properties.chapter.id)
      scope.$set(scope.data, 'uuid', scope.properties.chapter.uuid)
    }
  },
  mounted () {
    var scope = this

    if (scope.data.id) {
      // window.$('.page-item-form .page-title h3').html('Update ' + scope.properties.item.itemname)
      scope.loadChapter()
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-book-form { padding:20px; }

  .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
  .page-title h3 { font-size:35px; }

  .single-picture-file { display: none }
  .uploaded-file-preview { width:100%; cursor: pointer; }
  .uploaded-file-preview img { width:100%; }
  .uploaded-file-preview .default-preview { min-height: 180px; background-color: #293742; color: #fff; text-align: center; }
  .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 180px; opacity: 0.8; }
</style>
