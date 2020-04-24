<template>
<div class="page-character-listing">
   <div>
        <div class="es-page-head">
            <div class="inner">
                <div class="details">
                    <h4>Characters</h4>
                    <small>Below are the list of characters under {{ properties.title }}</small>
                </div>
                <div class="actions">
                    <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'character-form', tabComponent: 'character-form', tabData: { list_index: -1, book_id: properties.uuid, character: null }, tabTitle: 'New Character', newTab: true})">New Character</button>
                </div>
            </div>
        </div>

       <div class="es-page-content">
            <div class="es-row">
                <div class="es-col fadeIn animated" v-for="character in characters" v-bind:key="character.id">
                    <div class="es-card">
                        <div class="es-card-content">
                            <p class="title">{{ character.fullname || 'Untitled' }}</p>
                            <i class="description" v-if="character.description !== '' && character.description !== null" v-html="character.description"></i>
                            <i class="description" v-else>No Description</i>
                        </div>
                        <div class="es-card-footer">
                            <button class="btn-" @click="CHANGE_COMPONENT({tabKey: 'character-details-' + character.uuid, tabComponent: 'character-details',  tabData: { book_id: properties.uuid, character: character }, tabTitle: character.fullname})"><i class="lar la-eye"></i> VIEW</button>
                            <button class="btn-" @click="CHANGE_COMPONENT({tabKey: 'character-form-' + character.uuid, tabComponent: 'character-form',  tabData: { book_id: properties.uuid, character: character }, tabTitle: 'Edit - ' + character.fullname, newTab: true})"><i class="las la-pencil-alt"></i> EDIT</button>
                            <button class="btn-delete" @click="deleteCharacter(character)"><i class="las la-trash-alt"></i> DELETE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

   </div>
</div>
</template>

<script>
export default {
  name: 'character-listing',
  props: ['properties'],
  data: function () {
    return {
      bookUUID: ''
    }
  },
  computed: {
    characters: function () {
      return this.$store.getters.getCharactersByBook(this.bookUUID)
    }
  },
  methods: {
    deleteCharacter: function (character) {
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
            .delete('http://localhost:3000/characters/' + character.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Character successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeCharacterFromList', character)
                })
              }
            })
        }
      })
    }
  },
  mounted () {
    var scope = this
    // scope.getCharacters(scope.properties.id)
    scope.bookUUID = scope.properties.uuid
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
    .es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; padding-right:110px; }
    .es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

    .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }

    .es-card .es-card-footer { position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 0px; border-top:1px solid #e0e5ee; }
    .es-card .es-card-footer button { font-weight:600; background:transparent; border:none; height:40px; line-height:32px; text-align:center; font-size:14px; padding:0px 8px; }
    .es-card .es-card-footer button:hover { background:#e0e5ee; }
    .es-card .es-card-footer button i { font-size:18px; }
    .es-card .es-card-footer button.btn-delete { font-weight:600; color:#8f2c39; border-left:1px solid #e0e5ee; position:absolute; top:0px; right:0px; }
</style>
