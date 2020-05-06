<template>
<div class="page-character-listing">
   <div>
        <div class="es-page-head">
            <div class="inner">
                <div class="details">
                    <h4>{{$tc('CHARACTER',2)}}</h4>
                    <small>{{$t('BELOW_ARE_THE_LIST_OF_CHARACTERS_UNDER')}} {{ book.title }}</small>
                </div>
                <div class="actions">
                    <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'character-form', tabComponent: 'character-form', tabData: { list_index: -1, book: book, character: null }, tabTitle: $t('NEW') + ' ' + $tc('CHARACTER',1), newTab: true})">{{$t('NEW').toUpperCase()}} {{$tc('CHARACTER', 1).toUpperCase()}}</button>
                    <button class="es-button-white" @click="exportCharacter()">{{$t('EXPORT').toUpperCase()}} {{$tc('CHARACTERS', 1).toUpperCase()}} {{$tc('LIST', 1).toUpperCase()}}</button>
                </div>
            </div>
        </div>

        <div class="es-page-breadcrumbs">
           <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
           /
           <button class="current">{{ $tc('CHARACTER', 2) }}</button>
        </div>

       <div class="es-page-content">
            <div class="es-row">
                <div class="es-col fadeIn animated" v-for="character in characters" v-bind:key="character.id">
                    <div class="es-card">
                        <div class="es-card-content">
                            <p class="title ellipsis-2">{{ character.fullname || 'Untitled' }}</p>
                            <i class="description ellipsis-2" v-if="character.description !== '' && character.description !== null" v-html="character.description"></i>
                            <i class="description" v-else>{{$t('NO')}} {{$t('DESCRIPTION')}}...</i>
                        </div>
                        <div class="es-card-footer">
                            <button class="btn-" @click="CHANGE_COMPONENT({tabKey: 'character-details-' + character.uuid, tabComponent: 'character-details',  tabData: { book: book, character: character }, tabTitle: $t('VIEW')+ ' - ' + character.fullname})"><i class="lar la-eye"></i> {{$t('VIEW')}}</button>
                            <button class="btn-" @click="CHANGE_COMPONENT({tabKey: 'character-form-' + character.uuid, tabComponent: 'character-form',  tabData: { book: book, character: character }, tabTitle: $t('EDIT')+ ' - ' + character.fullname, newTab: true})"><i class="las la-pencil-alt"></i> {{$t('EDIT')}}</button>
                            <button class="btn-delete" @click="deleteCharacter(character)"><i class="las la-trash-alt"></i> {{$t('DELETE')}}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

   </div>
</div>
</template>

<script>
const {ipcRenderer} = window.require('electron')
export default {
  name: 'character-listing',
  props: ['properties'],
  data: function () {
    return {
      bookUUID: ''
    }
  },
  computed: {
    book: function () {
      return this.properties
    },
    characters: function () {
      return this.$store.getters.getCharactersByBook(this.bookUUID)
    }
  },
  methods: {
    deleteCharacter: function (character) {
      var scope = this
      window.swal.fire({
        title: this.$t('ARE_YOU_SURE'),
        text: this.$t('YOU_WONT_BE_ABLE_TO_REVERT_THIS'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('YES_DELETE_IT'),
        cancelButtonText: this.$t('CANCEL')
      }).then((result) => {
        if (result.value) {
          scope.axios
            .delete('http://localhost:3000/characters/' + character.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeCharacterFromList', character)
                })
              }
            })
        }
      })
    },
    exportCharacter: function () {
      const scope = this
      ipcRenderer.send('EXPORT:show-characters', {bookUUID: scope.bookUUID, title: scope.properties.title})
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
