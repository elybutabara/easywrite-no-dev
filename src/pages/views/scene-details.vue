<template>
<div class="page-scene-details">
  <div class="header">
    <div class="page-title">
      <button @click="toggleFilter()" class="btn-toggle-filter"><i class="las la-filter"></i></button>
      <h3>{{ properties.scene.title }}</h3>
      <p>{{ properties.scene.short_description }}</p>
    </div>
    <b-button @click="editScene(properties.scene)" variant="dark">Edit</b-button>
    <b-button ref="button" :disabled="busy" @click="newVersion" variant="dark">Save as New Version</b-button>
  </div>
  <hr/>
  <div class="es-tab">
    <b-tabs content-class="mt-3" active-nav-item-class="bg-dark text-white">
      <b-tab title="Content" active>
        <div v-html="properties.scene.scene_version[properties.scene.scene_version.length - 1].content" class="description" ></div>
      </b-tab>
      <b-tab title="Locations/Items" active>
        Locations/Items
      </b-tab>
      <b-tab title="Characters" active>
        <div class="text-right">
          <b-button v-show='btn_character_toggle' @click='btn_character_toggle = !btn_character_toggle' v-b-toggle.collapse-1 variant="dark" class="margin-bottom-1rem">Add Character in Scene</b-button>
        </div>
        <b-collapse id="collapse-1" class="mt-2 margin-bottom-1rem">
          <b-card>
            <b-row class="margin-bottom-1rem">
              <b-col>
                <label class="typo__label">Character: </label>
                <multiselect v-model="selected_character" :options="characters" placeholder="Select Character" label="fullname" track-by="fullname" deselectLabel="Press enter to deselect"></multiselect>
              </b-col>
            </b-row>
            <b-row class="text-right">
              <b-col>
                <b-button ref="btn_cancel_scene_character" v-b-toggle.collapse-1 variant="dark" @click='btn_character_toggle = !btn_character_toggle'>Cancel</b-button>
                <b-button @click="saveSceneCharacter()" variant="dark">Save</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
        <b-table
          hover caption-top responsive borderless
          stacked="md"
          :current-page="currentPage"
          :per-page="perPage"
          :items="scene_character"
          :fields="scene_character_fields"
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
      <b-tab title="Versions">
        <div class="version-container">
          <b-row class="wrap" ref="wrap">
            <b-card no-body>
              <b-tabs pills card vertical nav-wrapper-class="w-30">
                <b-tab v-for="(version, index) in scene.scene_version" v-bind:key="version.id" :active="index==0" >
                  <template v-slot:title>
                    Version {{ index+1 }}
                    <b-badge variant="primary" v-if="index+1 == scene.scene_version.length" >Latest</b-badge>
                    <b-badge variant="success" v-else-if="version.is_same == true" >Same</b-badge>
                    <b-badge variant="secondary" v-else >Diff</b-badge>
                  </template>
                  <div class="text-right" style="position: sticky; top: 1rem">
                    <b-button @click="editVersion(version)" variant="dark" class="btn-edit-version">Edit</b-button>
                  </div>
                  <br >
                  <b-card-text class="version-change-description" v-html="version.change_description "></b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-row>
        </div>
      </b-tab>
    </b-tabs>
  </div>
  <b-overlay :show="busy" no-wrap fixed @shown="onShown" @hidden="onHidden">
    <template v-slot:overlay>
      <div
        id="overlay-background"
        ref="dialog"
        tabindex="-1"
        role="dialog"
        aria-modal="false"
        aria-labelledby="form-confirm-label"
        class="p-3"
      >
        <b-container class="bv-example-row">
          <b-row style="margin-bottom: 1rem;">
            <b-col>
              <label>Description: </label>
              <tiny-editor :initValue="scene_version.change_description"
                           v-on:getEditorContent="setDescription"
                           class="form-control"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div class="text-right">
                <b-button variant="outline-dark" class="mr-3" @click="onCancel">Cancel</b-button>
                <b-button variant="dark" @click="saveNewVersion">Save</b-button>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </template>
  </b-overlay>
</div>
</template>

<script>
import TinyMCE from '../../components/TinyMCE'

export default {
  name: 'scene-details',
  props: ['properties'],
  data: function () {
    return {
      scene: this.properties.scene,
      scene_version: {
        book_scene_id: null,
        change_description: null,
        content: null
      },
      scene_character_fields: [
        {key: 'shortname', label: 'Short Name'},
        {key: 'fullname', label: 'Full Name'},
        {key: 'nickname', label: 'Nick Name'},
        {key: 'actions', label: 'Actions'}
      ],
      // List of characters
      characters: [],
      scene_character: [],
      selected_character: null,
      busy: false,
      interval: null,
      totalRows: 0,
      currentPage: 1,
      perPage: 10,
      btn_character_toggle: true
    }
  },
  components: {
    TinyMCE
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    setDescription (value) {
      var scope = this

      scope.scene_version.change_description = value
    },
    newVersion: function () {
      var scope = this
      this.busy = true

      scope.scene_version.change_description = ''
      if (scope.scene_version.id) {
        delete (scope.scene_version.id)
        delete (scope.scene_version.uuid)
      }
    },
    onShown () {
      // Focus the dialog prompt
      this.$refs.dialog.focus()
    },
    onHidden () {
      // In this case, we return focus to the submit button
      // You may need to alter this based on your application requirements
      this.$refs.button.focus()
    },
    onCancel () {
      this.busy = false
    },
    saveSceneCharacter () {
      var scope = this

      var sceneCharacter = {
        book_scene_id: scope.scene.uuid,
        book_character_id: scope.selected_character.uuid
      }

      scope.axios
        .post('http://localhost:3000/scene-characters', sceneCharacter)
        .then(response => {
          if (response.data) {
            scope.scene_character.push(response.data)
            scope.totalRows = scope.scene.scene_character.length

            // Reset Relation Form
            scope.selected_character = null
            scope.$refs.btn_cancel_scene_character.click()
          }
        })
    },
    saveNewVersion () {
      var scope = this
      scope.axios
        .post('http://localhost:3000/scene-versions', scope.scene_version)
        .then(response => {
          if (response.data) {
            this.busy = false
            scope.getAllSceneVersions(scope.properties.scene)
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Scene version successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.changeTab('versions')
            })
          }
        })
    },
    editVersion: function (version) {
      var scope = this
      scope.scene_version.id = version.id
      scope.scene_version.uuid = version.uuid
      scope.scene_version.change_description = version.change_description
      scope.scene_version.content = version.content

      this.busy = true
    },
    editScene: function (scene) {
      var scope = this
      scope.$parent.changeComponent('scene-form', { scene: scene })
    },
    loadScene: function (scene) {
      var scope = this

      scope.axios
        .get('http://localhost:3000/scenes/' + scene.uuid)
        .then(response => {
          scope.scene = response.data

          scope.$set(scope.scene_version, 'book_scene_id', scope.scene.uuid)
          scope.$set(scope.scene_version, 'change_description', '')
          scope.$set(scope.scene_version, 'content', scope.scene.scene_version[scope.scene.scene_version.length - 1].content)
        })

      scope.axios
        .get('http://localhost:3000/books/' + scope.scene.book_id + '/characters')
        .then(response => {
          if (scope.scene_character.length) {
            // scope.characters = response.data.filter(function (character) {
            //   scope.characters.find(x => (x.uuid === character.uuid))
            //   return character.uuid !== scope.character.uuid
            // })
            console.log(scope.scene.scene_character)
          } else {
            scope.characters = response.data
          }
        })

      scope.axios
        .get('http://localhost:3000/scenes/' + scope.scene.uuid + '/characters')
        .then(response => {
          if (response.data) {
            scope.scene_character = response.data
            scope.totalRows = scope.scene_character.length
          }
        })
    }
  },
  beforeUpdate () {
    var scope = this
    if (scope.scene.uuid !== scope.properties.scene.uuid) {
      scope.loadScene(scope.properties.scene)
    }
  },
  mounted () {
    var scope = this
    scope.loadScene(scope.properties.scene)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-scene-details { padding:20px; }
</style>
