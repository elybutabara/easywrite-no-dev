<template>
<div class="page-character-details">
    <div class="header">
      <div class="page-title">
        <button @click="toggleFilter()" class="btn-toggle-filter"><i class="las la-filter"></i></button>
        <h3>{{ properties.character.fullname }}</h3>
        <p>{{ properties.short_description }}</p>
      </div>
      <b-button @click="editCharacter(properties.character)" variant="dark">Edit</b-button>
      <b-button @click="deleteCharacter(properties.character.uuid)" variant="dark">Delete</b-button>
    </div>
    <hr/>
    <div class="image-container"><img :src="properties.character.picture_src" /></div>
    <br>
    <div class="es-tab">
      <b-tabs content-class="mt-3" active-nav-item-class="bg-dark text-white">
        <b-tab title="Description" active>
          <div v-html="properties.character.description" style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';"></div>
        </b-tab>
        <b-tab title="Bio">
          <div v-html="properties.character.bio" style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';"></div>
        </b-tab>
        <b-tab title="Goals">
          <div v-html="properties.character.goals" style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';"></div>
        </b-tab>
        <b-tab title="Relation">
          <div class="text-right">
            <b-button v-show='btn_relation_toggle' @click='btn_relation_toggle = !btn_relation_toggle' v-b-toggle.collapse-1 variant="dark" class="margin-bottom-1rem">Add Relation</b-button>
          </div>
          <b-collapse id="collapse-1" class="mt-2 margin-bottom-1rem">
            <b-card>
              <b-row class="margin-bottom-1rem">
                <b-col>
                  <label class="typo__label">Relation: </label>
                  <multiselect v-model="selected_relation" :options="relations" placeholder="Select Relation" label="relation" track-by="relation" :taggable="true" @tag="addRelation" tag-placeholder="Press enter to add as new relation" deselectLabel="Press enter to deselect"></multiselect>
                </b-col>
                <b-col>
                  <label class="typo__label">Character: </label>
                  <multiselect v-model="selected_character" :options="characters" placeholder="Select Character" label="fullname" track-by="fullname" deselectLabel="Press enter to deselect"></multiselect>
                </b-col>
              </b-row>
              <b-row class="text-right">
                <b-col>
                  <b-button ref="btn_cancel_relation" v-b-toggle.collapse-1 variant="dark" @click='btn_relation_toggle = !btn_relation_toggle'>Cancel</b-button>
                  <b-button @click="saveRelationDetail()" variant="dark">Save</b-button>
                </b-col>
              </b-row>
            </b-card>
          </b-collapse>
          <b-table
            hover caption-top responsive borderless
            stacked="md"
            :current-page="currentPage"
            :per-page="perPage"
            :items="relation_detail"
            :fields="fields"
            thead-class="bg-dark text-white"
            @filtered="onFiltered"
          >
            <!-- Example scoped slot for action state illustrative purposes -->
            <template v-slot:cell(actions)="row">
              <b-button size="sm" @click="deleteRelationDetail(row.item, row.index)" class="mr-1" variant="outline-dark">
                <i class="fa fa-trash"></i>
              </b-button>
            </template>
            <template v-if="totalRows" small v-slot:bottom-row>
              <b-td colspan="6" variant="secondary" class="text-right">
                Total Rows: <b>{{totalRows}}</b>
              </b-td>
            </template>
          </b-table>
          <b-pagination v-if="totalRows" v-model="currentPage" :per-page="perPage" :total-rows="totalRows" align="center"></b-pagination>
        </b-tab>
      </b-tabs>
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
      // Current character record
      character: this.properties.character,
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
      btn_relation_toggle: true
    }
  },
  components: {
    Multiselect
  },
  methods: {
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
              title: 'Relation successfuly added',
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
            .delete('http://localhost:3000/relation-details/' + item.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Relation successfuly deleted',
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
          title: 'Relation already exist!',
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
            scope.$refs.btn_cancel_relation.click()

            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Relation successfuly added',
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
    deleteCharacter: function (characterId) {
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
            .delete('http://localhost:3000/characters/' + characterId)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Character successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$parent.changeComponent('character-listing', scope.character.book)
                })
              }
            })
        }
      })
    },
    loadCharacterDetail () {
      var scope = this
      scope.character = scope.properties.character
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
  .page-character-details { padding:20px; }

  .image-container { text-align: center; }
  .image-container img { width: 30% }

  .btn-toggle-filter { display:none; float:right;  position:absolute; top:0px; right:0px; background:#fff; border:1px solid #9fb1c2; padding-top:5px; padding-bottom:0px; }
</style>
