<template>
<div class="page-location-form">
   <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <div  v-if="data.id != null">
                    <h4>{{$t('EDIT')}}: <strong>{{ data.location }}</strong></h4>
                    <small>{{$t('DATE_MODIFIED')}}: {{ data.updated_at }}</small>
                </div>
                <div v-else>
                    <h4>{{$t('CREATE')}} {{$t('NEW')}} {{$tc('LOCATION', 1)}}</h4>
                </div>
            </div>
            <div class="actions">
                <button v-if="data.id != null" class="es-button-white" @click="uploadImage()">{{$t('SAVE_CHANGES')}}</button>
                <button v-else class="es-button-white" @click="uploadImage()">{{$t('SAVE')}}</button>
            </div>
        </div>
    </div>
    <div class="es-page-content">
        <div class="container">
            <div class="es-panel">
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
                                    <label>{{$tc('LOCATION', 1)}} </label>
                                    <input v-model="data.location" type="text" class="form-control" :placeholder="$tc('LOCATION', 1)">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>{{$t('AKA')}}: </label>
                                    <input v-model.trim="data.AKA" type="text" class="form-control" :placeholder="$t('AKA')">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>{{$t('TAGS')}}: </label>
                                    <input v-model="data.tags" type="text" class="form-control" :placeholder="$t('TAGS')">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label>{{$t('DESCRIPTION')}}: </label>
                            <tiny-editor :initValue="data.description" v-on:getEditorContent="setDescription" class="form-control" />
                        </div>
                    </div>
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
        id: null,
        uuid: null,
        book_id: null,
        location: '',
        AKA: '',
        tags: '',
        description: ''
      },
      file: '',
      tempDescription: ''
    }
  },
  components: {
    TinyMCE
  },
  methods: {
    // Required for geting value from TinyMCE content
    setDescription (value) {
      var scope = this

      scope.tempDescription = value
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

            scope.data.pictures = response.data.file.name
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
      scope.data.description = scope.tempDescription
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
              if (scope.data.uuid === null) {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateLocationList', response.data)
                scope.CHANGE_COMPONENT({tabKey: 'location-form-' + response.data.uuid, tabComponent: 'location-form', tabData: { book_id: response.data.book_id, location: response.data }, tabTitle: 'Edit  - ' + response.data.location, tabIndex: scope.$store.getters.getActiveTab})
              } else {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateLocationList', response.data)
                scope.$store.dispatch('changeTabTitle', { key: 'location-form-' + response.data.uuid, title: 'Edit - ' + response.data.location })
              }
            })
          }
        })
    },
    loadLocation () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/locations/' + scope.data.uuid)
        .then(response => {
          let location = response.data
          scope.data.location = location.location
          scope.data.AKA = location.AKA
          scope.data.tags = location.tags
          scope.data.description = location.description

          if (location.pictures) {
            scope.$set(scope.data, 'pictures', location.pictures)

            const image = new Image()
            image.src = location.picture_src
            image.setAttribute('width', '100%')

            window.$('.uploaded-file-preview').html(image)
          }
        })
    }
  },
  beforeMount () {
    var scope = this
    scope.data.book_id = scope.properties.book_id

    if (scope.properties.location) {
      scope.$set(scope.data, 'id', scope.properties.location.id)
      scope.$set(scope.data, 'uuid', scope.properties.location.uuid)
    }
  },
  mounted () {
    var scope = this

    if (scope.data.id) {
      window.$('.page-location-form .page-title h3').html('Update ' + scope.properties.location.location)
      scope.loadLocation()
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
