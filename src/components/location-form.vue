<template>
<div class="page-book-form">
  <div class="page-title">
    <h3>{{ properties.title }} New Location</h3>
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
              <label>Location: </label>
              <input v-model="data.location" type="text" class="form-control" placeholder="Location" >
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
import TinyMCE from './TinyMCE'

export default {
  name: 'book-form',
  props: ['properties'],
  data: function () {
    return {
      data: {
        book_id: this.properties.id,
        location: '',
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
          .post('http://localhost:3000/upload/locations/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            window.$('#location-details [name="picture"]').val(response.data.file.name)

            scope.data.picture = response.data.file.name
            scope.saveLocation()
          }).catch(function () {
            console.log('FAILURE!!')
          })
      } else {
        scope.saveLocation()
      }
    },
    saveLocation () {
      var scope = this

      scope.axios
        .post('http://localhost:3000/locations', scope.data)
        .then(response => {
          if (response.data) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Location successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.$parent.changeComponent('location-details', { location: response.data })
            })
          }
        })
    },
    loadLocation () {
      var scope = this

      scope.axios
        .get('http://localhost:3000/locations/' + scope.data.id)
        .then(response => {
          let locaiton = response.data
          scope.data.location = locaiton.location
          scope.data.AKA = locaiton.AKA
          scope.data.tags = locaiton.tags
          scope.data.description = locaiton.description

          if (locaiton.picture) {
            scope.$set(scope.data, 'picture', locaiton.picture)

            const image = new Image()
            image.src = locaiton.picture_src
            image.setAttribute('width', '100%')

            window.$('.uploaded-file-preview').html(image)
          }
        })
    }
  },
  beforeMount () {
    var scope = this

    scope.$set(scope.data, 'id', scope.properties.location.id)
    if (scope.data.id) {
      scope.loadLocation()
    }
  },
  mounted () {
    // var scope = this
    // console.log(scope)
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
