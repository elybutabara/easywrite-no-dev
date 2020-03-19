<template>
<div class="page-character-form">
  <div class="page-title">
    <h3>New Character</h3>
  </div>
  <div class="content" >
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <input v-on:change="displayImage" ref="fileInput" type="file" class="single-picture-file" name="single-picture-file" accept=".png, .jpg, .jpeg">
          <div @click="$refs.fileInput.click()" class="uploaded-file-preview">
            <div class="default-preview"><i class="fa fa-image"></i></div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Full Name: </label>
              <b-form-input
                id="input-live"
                v-model="data.fullname"
                :state="null"
                aria-describedby="input-live-help input-live-feedback"
                placeholder="Full Name"
              ></b-form-input>

              <!-- This will only be shown if the preceding input has an invalid state -->
              <b-form-invalid-feedback id="input-live-feedback">
                Full name is required
              </b-form-invalid-feedback>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group">
              <label>Short Name: </label>
              <input v-model="data.shortname" type="text" class="form-control" placeholder="Short Name" >
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group">
              <label>Nickname: </label>
              <input v-model.trim="data.nickname" type="text" class="form-control" placeholder="Nickname" >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label>Occupation: </label>
          <input v-model="data.occupation" type="text" class="form-control" placeholder="Occupation" >
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="birthdate-datepicker">Birthdate: </label>
          <b-form-datepicker id="birthdate-datepicker" v-model="data.birthdate" class="mb-2" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"></b-form-datepicker>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <b-tabs content-class="mt-3" active-nav-item-class="bg-dark text-white">
            <b-tab title="Description" active>
              <tiny-editor :initValue="data.description"
                           v-on:getEditorContent="setDescription"
                           class="form-control"
              />
            </b-tab>
            <b-tab title="Bio">
              <tiny-editor :initValue="data.bio"
                           v-on:getEditorContent="setBio"
                           class="form-control"
              />
            </b-tab>
            <b-tab title="Goals">
              <tiny-editor :initValue="data.goals"
                           v-on:getEditorContent="setGoals"
                           class="form-control"
              />
            </b-tab>
          </b-tabs>
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
  name: 'chapter-form',
  props: ['properties'],
  computed: {
  },
  data: function () {
    return {
      data: {
        book_id: this.properties.uuid,
        shortname: '',
        fullname: '',
        nickname: '',
        occupation: '',
        description: '',
        bio: '',
        goals: '',
        birthdate: ''
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
    setBio (value) {
      var scope = this

      scope.data.bio = value
    },
    setGoals (value) {
      var scope = this

      scope.data.goals = value
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
          .post('http://localhost:3000/upload/characters/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            window.$('#character-details [name="picture"]').val(response.data.file.name)

            scope.data.picture = response.data.file.name
            scope.saveCharacter()
          }).catch(function () {
            console.log('FAILURE!!')
          })
      } else {
        scope.saveCharacter()
      }
    },
    saveCharacter () {
      var scope = this

      scope.axios
        .post('http://localhost:3000/characters', scope.data)
        .then(response => {
          console.log(response.data)
          if (response.data) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Character successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.$parent.changeComponent('character-details', { character: response.data })
            })
          }
        })
      console.log(scope.data)
    },
    loadCharacter () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/characters/' + scope.data.uuid)
        .then(response => {
          let character = response.data
          scope.data.shortname = character.shortname
          scope.data.fullname = character.fullname
          scope.data.nickname = character.nickname
          scope.data.occupation = character.occupation
          scope.data.description = character.description
          scope.data.bio = character.bio
          scope.data.goals = character.goals
          scope.data.birthdate = character.birthdate

          if (character.picture) {
            scope.$set(scope.data, 'picture', character.picture)

            const image = new Image()
            image.src = character.picture_src
            image.setAttribute('width', '100%')

            window.$('.uploaded-file-preview').html(image)
          }

          console.log(response.data)
        })
    }
  },
  beforeMount () {
    var scope = this

    if (scope.properties.character) {
      scope.$set(scope.data, 'id', scope.properties.character.id)
      scope.$set(scope.data, 'uuid', scope.properties.character.uuid)
      scope.$set(scope.data, 'book_id', scope.properties.character.book_id)
      console.log(scope.properties.character)
    }
  },
  mounted () {
    var scope = this

    if (scope.data.id) {
      window.$('.page-character-form .page-title h3').html('Update ' + scope.properties.character.fullname)
      scope.loadCharacter()
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-character-form { padding:20px; }

  .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
  .page-title h3 { font-size:35px; }

  .single-picture-file { display: none }
  .uploaded-file-preview { width:100%; cursor: pointer; }
  .uploaded-file-preview img { width:100%; }
  .uploaded-file-preview .default-preview { min-height: 180px; background-color: #293742; color: #fff; text-align: center; }
  .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 180px; opacity: 0.8; }
</style>
