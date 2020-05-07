<template>
<div class="page-character-details">
    <div class="es-page-breadcrumbs">
        <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
        /
        <button @click="CHANGE_COMPONENT({tabKey: 'character-listing-' + book.uuid, tabComponent: 'character-listing', tabData: book, tabTitle: $tc('CHARACTER', 2) + ' - ' + book.title})">{{ $tc('CHARACTER', 2) }}</button>
        /
        <button class="current">
            <span>{{ character.fullname }}</span>
        </button>
    </div>
    <div class="es-panel">
        <div class="es-panel-content">
            <div class="image-container"><img :src="properties.character.picture_src" /></div>
            <h2 class="title">
                {{ properties.character.fullname || 'No Name' }}
                <span v-if="properties.character.shortname != ''  && properties.character.shortname !== null">
                    ({{ properties.character.shortname }})
                </span>
            </h2>
            <p class="aka">{{ properties.character.nickname || 'Not Set' }}</p>
            <div class="es-panel-tab" style="">
                <a @click="changeTab('description')" href="javascript:void(0);" v-bind:class="{ 'active' : tab.active == 'description'}">{{$t('DESCRIPTION')}}</a>
                <a @click="changeTab('bio')" href="javascript:void(0);" v-bind:class="{ 'active' : tab.active == 'bio'}">{{$t('BIO')}}</a>
                <a @click="changeTab('goals')" href="javascript:void(0);" v-bind:class="{ 'active' : tab.active == 'goals'}">{{$t('GOALS')}}</a>
                <a @click="changeTab('relations')" href="javascript:void(0);" v-bind:class="{ 'active' : tab.active == 'relations'}">{{$tc('RELATION', 2)}}</a>
            </div>
            <div class="es-panel-tab-content">
                <div v-if="tab.active == 'description'">
                    <div v-html="properties.character.description" style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';"></div>
                </div>
                <div v-if="tab.active == 'bio'" v-bind:class="{ 'active' : tab.active == 'bio'}">
                    <div v-html="properties.character.bio" style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';"></div>
                </div>
                <div v-if="tab.active == 'goals'" v-bind:class="{ 'active' : tab.active == 'goals'}">
                    <div v-html="properties.character.goals" style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';"></div>
                </div>
                <div v-if="tab.active == 'relations'" v-bind:class="{ 'active' : tab.active == 'relations'}">
                    <div class="row">
                        <div class="col-4">
                            <div class="grid-character-relation">
                                <div class="avatar"></div>
                                <div class="name">&nbsp;</div>
                                <div class="relation">&nbsp;</div>
                                <div @click="toggleRelationForm()" style="border:2px dashed #c0c6d1; color:#c0c6d1; cursor:pointer; position:absolute; top:0px; left:0px; width:100%; height:100%; background:#f5f8fa; font-size:90px; padding:5px 10px;">
                                    <i class="las la-user-alt"></i>
                                    <p style="margin-top:-30px; font-size:14px; font-weight:600;">{{$t('CLICK')}} {{$t('TO_ADD').toLowerCase()}} {{$tc('RELATION', 2)}}</p>
                                </div>
                            </div>
                        </div>
                        <div v-for="(item, index) in relation_detail" v-bind:key="item.id" class="col-4">
                            <div class="grid-character-relation">
                                <button class="btn-delete" @click="deleteRelationDetail(item, index)"><i class="las la-trash-alt"></i></button>
                                <div class="avatar"><img :src="item.character_relation.picture_src"></div>
                                <div class="name">{{ item.character_relation.fullname }}</div>
                                <div class="relation" v-if="item.relation !== null">({{ item.relation.relation }})</div>
                                <div class="relation" v-else>(&nbsp;)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="es-panel-footer">
            <div class="cta" @click="CHANGE_COMPONENT({tabKey: 'character-form', tabComponent: 'character-form',  tabData: { book: book, character: properties.character }, tabTitle: $t('EDIT')+ ' - ' + properties.character.fullname, newTab: true })">{{$t('EDIT').toUpperCase()}}</div>
            <div class="cta" @click="deleteCharacter(properties.character)">{{$t('DELETE').toUpperCase()}}</div>
        </div>
    </div>
    <div class="es-dialog-overlay" v-bind:class="{'open' : relation_form.is_open }">
        <div class="es-dialog-content">
            <div style="margin-bottom:15px;">
                <label class="typo__label">{{$tc('RELATION', 1)}}: </label>
                <multiselect v-model="selected_relation" :options="relations" :placeholder="$t('SELECT') + ' '+ $tc('RELATION',1)" label="relation" track-by="relation" :taggable="true" @tag="addRelation" tag-placeholder="Press enter to add as new relation" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')" :deselectLabel="$t('PLEASE_ENTER_TO_DESELECT')" :selectedLabel="$t('SELECTED')"></multiselect>
            </div>
            <div style="margin-bottom:15px;">
                <label class="typo__label">{{$tc('CHARACTER', 1)}}: </label>
                <multiselect v-model="selected_character" :options="characters" :placeholder="$t('SELECT') + ' '+ $tc('CHARACTER',1)" label="fullname" track-by="fullname" :deselectLabel="$t('PLEASE_ENTER_TO_DESELECT')" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')" :selectedLabel="$t('SELECTED')"></multiselect>
            </div>
            <div style="text-align:right;">
                <b-button @click="saveRelationDetail()" variant="dark">{{$t('SAVE')}}</b-button>
                <b-button @click="toggleRelationForm()" ref="btn_cancel_relation" v-b-toggle.collapse-1 variant="dark">{{$t('CANCEL')}}</b-button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'character-details',
  props: ['properties'],
  data: function () {
    return {
      // List of characters
      characters: [],
      relation_detail: [],
      relations: [],
      selected_relation: null,
      selected_character: null,
      fields: [
        {key: 'relation.relation', label: 'Relation'},
        {key: 'character_relation.shortname', label: 'Short Name'},
        {key: 'character_relation.fullname', label: 'Full Name'},
        {key: 'character_relation.nickname', label: 'Nick Name'},
        {key: 'actions', label: 'Actions'}
      ],
      // Pagination setup
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      btn_relation_toggle: true,
      tab: {
        active: 'description'
      },
      relation_form: {
        is_open: false
      }
    }
  },
  components: {
    Multiselect
  },
  computed: {
    book: function () {
      return this.properties.book
    },
    character: function () {
      return this.properties.character
    }
  },
  methods: {
    changeTab (tab) {
      var scope = this
      scope.tab.active = tab
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    addRelation (relation) {
      var scope = this
      var newRelation = {
        author_id: scope.$store.getters.getAuthorID,
        relation: relation
      }
      scope.axios
        .post('http://localhost:3000/relations', newRelation)
        .then(response => {
          if (response.data) {
            scope.selected_relation = response.data
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$tc('RELATION', 1) + ' ' + this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.relations.push(scope.selected_relation)
            })
          }
        })
    },
    deleteRelationDetail (item, index) {
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
            .delete('http://localhost:3000/relation-details/' + item.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.totalRows--
                  scope.relation_detail = scope.relation_detail.filter(function (relation) {
                    return relation.uuid !== item.uuid
                  })
                })
              }
            })
        }
      })
    },
    saveRelationDetail () {
      var scope = this

      var relationDetail = {
        relation_id: scope.selected_relation.uuid,
        character_id: scope.character.uuid,
        character_relation_id: scope.selected_character.uuid
      }

      if (scope.relation_detail.find(x => (x.relation_id === relationDetail.relation_id && x.character_relation_id === relationDetail.character_relation_id)) !== undefined) {
        return window.swal.fire({
          position: 'center',
          icon: 'error',
          title: this.$tc('RELATION', 1) + ' ' + this.$t('ALREADY_EXIST'),
          showConfirmButton: false,
          timer: 1500
        })
      }

      scope.axios
        .post('http://localhost:3000/relation-details', relationDetail)
        .then(response => {
          if (response.data) {
            scope.relation_detail.push(response.data)
            scope.totalRows = scope.relation_detail.length

            // Reset Relation Form
            scope.selected_relation = null
            scope.selected_character = null
            scope.toggleRelationForm()

            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
    },
    editCharacter: function (character) {
      var scope = this
      scope.$parent.changeComponent('character-form', { character: character })
    },
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
                  scope.CHANGE_COMPONENT({tabKey: 'character-listing-' + character.book_id, tabComponent: 'character-listing', tabData: { uuid: character.book_id }, tabTitle: this.$tc('CHARACTER', 2) + ' - ' + this.$t('LIST'), tabIndex: scope.$store.getters.getActiveTab})
                })
              }
            })
        }
      })
    },
    loadCharacterDetail () {
      var scope = this
      // scope.character = scope.properties.character
      scope.axios
        .get('http://localhost:3000/books/' + scope.character.book_id + '/characters')
        .then(response => {
          scope.characters = response.data.filter(function (character) {
            return character.uuid !== scope.character.uuid
          })
        })

      scope.axios
        .get('http://localhost:3000/relations')
        .then(response => {
          scope.relations = response.data
        })

      scope.axios
        .get('http://localhost:3000/characters/' + scope.character.uuid + '/relations')
        .then(response => {
          scope.relation_detail = response.data
          scope.totalRows = scope.relation_detail.length
        })
    },
    toggleRelationForm () {
      var scope = this
      scope.relation_form.is_open = !scope.relation_form.is_open
    }
  },
  updated () {
    var scope = this
    if (scope.character.uuid !== scope.properties.character.uuid) {
      scope.loadCharacterDetail()
    }
  },
  mounted () {
    var scope = this
    scope.loadCharacterDetail()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .image-container { text-align: center; }
  .image-container img { width:100%; max-width:250px; }

  .es-panel { background:#fff; margin:0px auto; margin-top:70px; max-width:700px; border:1px solid #e0e5ee; }
  .es-panel .es-panel-content { padding:30px 30px; }
  .es-panel .es-panel-content .title { margin:0px; margin-top:20px; text-align:center;  font-size:25px; font-weight:600; color:#293742; }
  .es-panel .es-panel-content .aka { margin-top:0px; text-align:center;  font-size:16px; color:#922c39; font-weight:600; }
  .es-panel .es-panel-content .tags { text-align:center; font-size:16px; color:#293742; }
  .es-panel .es-panel-content .description { display:block; padding:20px 0px; font-size:18px; text-align:center; }

  .es-panel .es-panel-content .es-panel-tab { padding:20px 10px; text-align:center; }
  .es-panel .es-panel-content .es-panel-tab a { padding:0px 10px; color:#293742; font-size:18px; font-weight:600; }
  .es-panel .es-panel-content .es-panel-tab a.active { color:#922c39; text-decoration: underline; }
  .es-panel .es-panel-content .es-panel-tab-content { text-align:center; padding:10px; }

  .es-panel .es-panel-footer { display:flex; background:#f5f8fa; border-top:1px solid #e0e5ee; height:40px; line-height:40px; padding:0px 0px; }
  .es-panel .es-panel-footer .cta { font-weight:600; cursor:pointer; text-align:center; width:50%;}
  .es-panel .es-panel-footer .cta:first-child {  border-right:1px solid #e0e5ee; }

  .grid-character-relation { border:2px solid #f5f8fa; margin-top:10px; padding:10px 0px; position:relative; background:#f5f8fa; }
  .grid-character-relation .btn-delete { position:absolute; top:0px; right:0px; background:#922c39; color:#fff; padding:5px; border:1px solid #e0e5ee; }
  .grid-character-relation .avatar { position: relative; display:inline-block; background:#293742; border-radius:50%; width:100px; height:100px; overflow: hidden; }
  /*.grid-character-relation .avatar img { width: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }*/
  .grid-character-relation .avatar img { width: 100%; height: 100% }
  .grid-character-relation .name { font-weight:600; }
  .grid-character-relation .relation { font-weight:600; color:#922c39; }

  .es-dialog-overlay { display:none; width:100%; height:100vh; position:fixed; top:0px; left:0px; background:rgba(41,55,66,0.9); }
  .es-dialog-overlay.open { display:block;}
  .es-dialog-overlay .es-dialog-content { padding:40px; width:600px; height:300px; position:fixed; top:calc(50vh - 200px); left:calc(50% - 300px); background:#fff; }
</style>
