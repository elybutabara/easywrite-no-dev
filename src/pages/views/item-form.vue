<template>
<div class="page-item-form">
  <div class="page-title">
    <h3>{{ properties.item.book.title }} New Item</h3>
  </div>
  <div class="content" >

    <div class="row">
      <div class="col-md-5">
        <div class="form-group">
          <input v-on:change="displayImage" ref="fileInput" type="file" class="single-picture-file" name="single-picture-file" accept=".png, .jpg, .jpeg">
          <div @click="$refs.fileInput.click()" class="uploaded-file-preview">
            <div class="default-preview"><i class="fa fa-image"></i></div>
          </div>
        </div>
      </div>
      <div class="col-md-7">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Item Name: </label>
              <input v-model="data.itemname" type="text" class="form-control" placeholder="Item" >
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>AKA: </label>
              <input v-model.trim="data.AKA" type="text" class="form-control" placeholder="AKA" >
            </div>
          </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label>Tags: </label>
            <input v-model="data.tags" type="text" class="form-control" placeholder="Tags" >
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <label>Description: </label>
          <tiny-editor :initValue="data.description"
                       v-on:getEditorContent="setDescription"
                       class="form-control"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <button @click="uploadImage">Save</button>
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
        book_id: this.properties.uuid,
        itemname: '',
        AKA: '',
        tags: '',
        description: ''
      },
      file: ''
    }
  },
  components: {
    TinyMCE
  },
  methods: {
    // Required for geting value from TinyMCE content
    setDescription (value) {
      var scope = this

      scope.data.description = value
    },
    displayImage: function () {
      var scope = this

      let reader = new FileReader()

      scope.file = this.$refs.fileInput.files[0]

      let validImageTypes = ['image/gif', 'image/jpeg', 'image/png']

      if (!validImageTypes.includes(scope.file['type'])) {
        scope.file = ''
        window.swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Uploading Failed!',
          text: 'Only .png, .jpeg, .jpg files are allowed!',
          showConfirmButton: false,
          timer: 3000
        })
      } else {
        reader.onload = function () {
          const image = new Image()
          image.src = reader.result.toString()
          image.setAttribute('width', '100%')

          window.$('.uploaded-file-preview').html(image)
        }
        reader.readAsDataURL(scope.file)
      }
    },
    uploadImage () {
      var scope = this

      if (scope.file) {
        let formData = new FormData()
        formData.append('single-picture-file', scope.file)

        scope.axios
          .post('http://localhost:3000/upload/items/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            window.$('#item-details [name="picture"]').val(response.data.file.name)

            scope.data.pictures = response.data.file.name
            scope.saveItem()
          }).catch(function () {
            console.log('FAILURE!!')
          })
      } else {
        scope.saveItem()
      }
    },
    saveItem () {
      var scope = this

      scope.axios
        .post('http://localhost:3000/items', scope.data)
        .then(response => {
          if (response.data) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Item successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.$parent.changeComponent('item-details', { item: response.data })
            })
          }
        })
    },
    loadItem () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/items/' + scope.data.uuid)
        .then(response => {
          let item = response.data
          scope.data.itemname = item.itemname
          scope.data.AKA = item.AKA
          scope.data.tags = item.tags
          scope.data.description = item.description

          if (item.pictures) {
            scope.$set(scope.data, 'pictures', item.pictures)

            const image = new Image()
            image.src = item.picture_src
            image.setAttribute('width', '100%')

            window.$('.uploaded-file-preview').html(image)
          }
        })
    }
  },
  beforeMount () {
    var scope = this

    if (scope.properties.item) {
      scope.$set(scope.data, 'id', scope.properties.item.id)
      scope.$set(scope.data, 'uuid', scope.properties.item.uuid)
    }
  },
  mounted () {
    var scope = this

    if (scope.data.id) {
      window.$('.page-item-form .page-title h3').html('Update ' + scope.properties.item.itemname)
      scope.loadItem()
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
