<template>
<div class="page-scene-details">
  <div class="header">
    <div class="page-title">
      <button @click="toggleFilter()" class="btn-toggle-filter"><i class="las la-filter"></i></button>
      <h3>{{ properties.scene.title }}</h3>
      <p>{{ properties.scene.short_description }}</p>
    </div>
    <b-button @click="CHANGE_COMPONENT('scene-form',{ book_id: properties.scene.book_uuid, scene: properties.scene}, properties.scene.title )" variant="dark">Edit</b-button>
    <b-button ref="button" :disabled="busy" @click="newVersion" variant="dark">Save as New Version</b-button>
  </div>
  <hr/>
  <div class="es-tab">
    <b-tabs v-model="tabIndex" content-class="mt-3" active-nav-item-class="bg-dark text-white">
      <b-tab href="#content" title="Content" active>
        <div v-html="properties.scene.scene_version[properties.scene.scene_version.length - 1].content" class="description" ></div>
      </b-tab>
      <b-tab href="#locations" title="Locations">
        <div class="text-right">
          <b-button v-show='btn_location_toggle' @click='btn_location_toggle = !btn_location_toggle' v-b-toggle.collapse-loc variant="dark" class="margin-bottom-1rem">Add Location in Scene</b-button>
        </div>
        <b-collapse id="collapse-loc" class="mt-2 margin-bottom-1rem">
          <b-card>
            <b-row class="margin-bottom-1rem">
              <b-col>
                <label class="typo__label">Location: </label>
                <multiselect v-model="selected_location" :options="locations" placeholder="Select Location" label="location" track-by="location" deselectLabel="Press enter to deselect"></multiselect>
              </b-col>
            </b-row>
            <b-row class="text-right">
              <b-col>
                <b-button ref="btn_cancel_scene_location" v-b-toggle.collapse-loc variant="dark" @click='btn_location_toggle = !btn_location_toggle'>Cancel</b-button>
                <b-button @click="saveSceneLocation()" variant="dark">Save</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
        <b-table
          hover caption-top responsive borderless
          stacked="md"
          :current-page="locations_currentPage"
          :per-page="perPage"
          :items="scene_location"
          :fields="scene_location_fields"
          thead-class="bg-dark text-white"
          @filtered="onLocationFiltered"
        >
          <!-- Example scoped slot for action state illustrative purposes -->
          <template v-slot:cell(actions)="row">
            <b-button size="sm" @click="deleteSceneLocation(row.item, row.index)" class="mr-1" variant="outline-dark">
              <i class="fa fa-trash"></i>
            </b-button>
          </template>
          <template v-if="locations_totalRows" small v-slot:bottom-row>
            <b-td colspan="6" variant="secondary" class="text-right">
              Total Rows: <b>{{locations_totalRows}}</b>
            </b-td>
          </template>
        </b-table>
        <b-pagination v-if="locations_totalRows > perPage" v-model="locations_currentPage" :per-page="perPage" :total-rows="locations_totalRows" align="center"></b-pagination>
      </b-tab>
      <b-tab href="#items" title="Items">
        <div class="text-right">
          <b-button v-show='btn_item_toggle' @click='btn_item_toggle = !btn_item_toggle' v-b-toggle.collapse-itm variant="dark" class="margin-bottom-1rem">Add Item in Scene</b-button>
        </div>
        <b-collapse id="collapse-itm" class="mt-2 margin-bottom-1rem">
          <b-card>
            <b-row class="margin-bottom-1rem">
              <b-col>
                <label class="typo__label">Item: </label>
                <multiselect v-model="selected_item" :options="items" placeholder="Select Item" label="itemname" track-by="itemname" deselectLabel="Press enter to deselect"></multiselect>
              </b-col>
            </b-row>
            <b-row class="text-right">
              <b-col>
                <b-button ref="btn_cancel_scene_item" v-b-toggle.collapse-itm variant="dark" @click='btn_item_toggle = !btn_item_toggle'>Cancel</b-button>
                <b-button @click="saveSceneItem()" variant="dark">Save</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
        <b-table
          hover caption-top responsive borderless
          stacked="md"
          :current-page="items_currentPage"
          :per-page="perPage"
          :items="scene_item"
          :fields="scene_item_fields"
          thead-class="bg-dark text-white"
          @filtered="onItemFiltered"
        >
          <!-- Example scoped slot for action state illustrative purposes -->
          <template v-slot:cell(actions)="row">
            <b-button size="sm" @click="deleteSceneItem(row.item, row.index)" class="mr-1" variant="outline-dark">
              <i class="fa fa-trash"></i>
            </b-button>
          </template>
          <template v-if="items_totalRows" small v-slot:bottom-row>
            <b-td colspan="6" variant="secondary" class="text-right">
              Total Rows: <b>{{items_totalRows}}</b>
            </b-td>
          </template>
        </b-table>
        <b-pagination v-if="items_totalRows > perPage" v-model="items_currentPage" :per-page="perPage" :total-rows="items_totalRows" align="center"></b-pagination>
      </b-tab>
      <b-tab href="#characters" title="Characters">
        <div class="text-right">
          <b-button v-show='btn_character_toggle' @click='btn_character_toggle = !btn_character_toggle' v-b-toggle.collapse-char variant="dark" class="margin-bottom-1rem">Add Character in Scene</b-button>
        </div>
        <b-collapse id="collapse-char" class="mt-2 margin-bottom-1rem">
          <b-card>
            <b-row class="margin-bottom-1rem">
              <b-col>
                <label class="typo__label">Character: </label>
                <multiselect v-model="selected_character" :options="characters" placeholder="Select Character" label="fullname" track-by="fullname" deselectLabel="Press enter to deselect"></multiselect>
              </b-col>
            </b-row>
            <b-row class="text-right">
              <b-col>
                <b-button ref="btn_cancel_scene_character" v-b-toggle.collapse-char variant="dark" @click='btn_character_toggle = !btn_character_toggle'>Cancel</b-button>
                <b-button @click="saveSceneCharacter()" variant="dark">Save</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
        <b-table
          hover caption-top responsive borderless
          stacked="md"
          :current-page="characters_currentPage"
          :per-page="perPage"
          :items="scene_character"
          :fields="scene_character_fields"
          thead-class="bg-dark text-white"
          @filtered="onCharacterFiltered"
        >
          <!-- Example scoped slot for action state illustrative purposes -->
          <template v-slot:cell(actions)="row">
            <b-button size="sm" @click="deleteSceneCharacter(row.item, row.index)" class="mr-1" variant="outline-dark">
              <i class="fa fa-trash"></i>
            </b-button>
          </template>
          <template v-if="characters_totalRows" small v-slot:bottom-row>
            <b-td colspan="6" variant="secondary" class="text-right">
              Total Rows: <b>{{characters_totalRows}}</b>
            </b-td>
          </template>
        </b-table>
        <b-pagination v-if="characters_totalRows > perPage" v-model="characters_currentPage" :per-page="perPage" :total-rows="characters_totalRows" align="center"></b-pagination>
      </b-tab>
      <b-tab href="#versions" title="Versions">
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
        {key: 'character.shortname', label: 'Short Name'},
        {key: 'character.fullname', label: 'Full Name'},
        {key: 'character.nickname', label: 'Nick Name'},
        {key: 'actions', label: 'Actions'}
      ],
      scene_location_fields: [
        {key: 'location.location', label: 'Location'},
        {key: 'location.AKA', label: 'AKA'},
        {key: 'actions', label: 'Actions'}
      ],
      scene_item_fields: [
        {key: 'item.itemname', label: 'Item'},
        {key: 'item.AKA', label: 'AKA'},
        {key: 'actions', label: 'Actions'}
      ],
      // List of item
      items: [],
      scene_item: [],
      selected_item: null,
      items_totalRows: 0,
      items_currentPage: 1,
      btn_item_toggle: true,
      // List of location
      locations: [],
      scene_location: [],
      selected_location: null,
      locations_totalRows: 0,
      locations_currentPage: 1,
      btn_location_toggle: true,
      // List of characters
      characters: [],
      scene_character: [],
      selected_character: null,
      characters_totalRows: 0,
      characters_currentPage: 1,
      btn_character_toggle: true,
      perPage: 10,
      busy: false,
      interval: null,
      tempVersionDesc: '',
      tabIndex: 1,
      tabs: ['#contents', '#locations', '#items', '#characters', '#versions']
    }
  },
  components: {
    TinyMCE
  },
  methods: {
    onItemFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.items_totalRows = filteredItems.length
      this.items_currentPage = 1
    },
    onCharacterFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.characters_totalRows = filteredItems.length
      this.characters_currentPage = 1
    },
    onLocationFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.locations_totalRows = filteredItems.length
      this.locations_currentPage = 1
    },
    setDescription (value) {
      var scope = this

      scope.tempVersionDesc = value
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
    saveSceneItem () {
      var scope = this

      var sceneItem = {
        book_scene_id: scope.scene.uuid,
        book_item_id: scope.selected_item.uuid
      }

      if (scope.scene_item.find(x => (x.book_item_id === sceneItem.book_item_id && x.book_scene_id === sceneItem.book_scene_id)) !== undefined) {
        return window.swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Item already exist!',
          showConfirmButton: false,
          timer: 1500
        })
      }

      scope.axios
        .post('http://localhost:3000/scene-items', sceneItem)
        .then(response => {
          if (response.data) {
            scope.scene_item.push(response.data)
            scope.items_totalRows = scope.scene_item.length

            // Reset Relation Form
            scope.selected_item = null
            scope.$refs.btn_cancel_scene_item.click()
          }
        })
    },
    deleteSceneItem: function (item, index) {
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
            .delete('http://localhost:3000/scene-items/' + item.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Scene Item successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.items_totalRows--
                  scope.scene_item = scope.scene_item.filter(function (itm) {
                    return itm.uuid !== item.uuid
                  })
                })
              }
            })
        }
      })
    },
    saveSceneLocation () {
      var scope = this

      var sceneLocation = {
        book_scene_id: scope.scene.uuid,
        book_location_id: scope.selected_location.uuid
      }

      if (scope.scene_location.find(x => (x.book_location_id === sceneLocation.book_location_id && x.book_scene_id === sceneLocation.book_scene_id)) !== undefined) {
        return window.swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Location already exist!',
          showConfirmButton: false,
          timer: 1500
        })
      }

      scope.axios
        .post('http://localhost:3000/scene-locations', sceneLocation)
        .then(response => {
          if (response.data) {
            scope.scene_location.push(response.data)
            scope.locations_totalRows = scope.scene_location.length

            // Reset Relation Form
            scope.selected_location = null
            scope.$refs.btn_cancel_scene_location.click()
          }
        })
    },
    deleteSceneLocation: function (item, index) {
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
            .delete('http://localhost:3000/scene-locations/' + item.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Scene Location successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.locations_totalRows--
                  scope.scene_location = scope.scene_location.filter(function (location) {
                    return location.uuid !== item.uuid
                  })
                })
              }
            })
        }
      })
    },
    saveSceneCharacter () {
      var scope = this

      var sceneCharacter = {
        book_scene_id: scope.scene.uuid,
        book_character_id: scope.selected_character.uuid
      }

      if (scope.scene_character.find(x => (x.book_character_id === sceneCharacter.book_character_id && x.book_scene_id === sceneCharacter.book_scene_id)) !== undefined) {
        return window.swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Character already exist!',
          showConfirmButton: false,
          timer: 1500
        })
      }
      scope.axios
        .post('http://localhost:3000/scene-characters', sceneCharacter)
        .then(response => {
          if (response.data) {
            scope.scene_character.push(response.data)
            scope.characters_totalRows = scope.scene_character.length

            // Reset Relation Form
            scope.selected_character = null
            scope.$refs.btn_cancel_scene_character.click()
          }
        })
    },
    deleteSceneCharacter: function (item, index) {
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
            .delete('http://localhost:3000/scene-characters/' + item.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Scene Character successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.totalRows--
                  scope.scene_character = scope.scene_character.filter(function (character) {
                    return character.uuid !== item.uuid
                  })
                })
              }
            })
        }
      })
    },
    saveNewVersion () {
      var scope = this

      scope.scene_version.change_description = scope.tempVersionDesc

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
              scope.tabIndex = scope.tabs.findIndex(tab => tab === '#versions')
            })
          }
        })
    },
    editVersion: function (version) {
      var scope = this
      scope.scene_version.id = version.id
      scope.scene_version.uuid = version.uuid
      scope.scene_version.change_description = version.change_description
      scope.tempVersionDesc = version.change_description
      scope.scene_version.content = version.content

      this.busy = true
    },
    editScene: function (scene) {
      var scope = this
      scope.$parent.changeComponent('scene-form', { scene: scene })
    },
    getAllSceneVersions: function (scene) {
      var scope = this

      scope.axios
        .get('http://localhost:3000/scenes/' + scene.uuid + '/versions')
        .then(response => {
          scope.scene.scene_version = response.data
          scope.$set(scope.scene_version, 'book_scene_id', scope.scene.uuid)
          scope.$set(scope.scene_version, 'change_description', '')
          scope.$set(scope.scene_version, 'content', scope.scene.scene_version[response.data.length - 1].content)
        })
    },
    loadScene: function () {
      var scope = this
      scope.scene = scope.properties.scene

      scope.getAllSceneVersions(scope.scene)

      scope.axios
        .get('http://localhost:3000/books/' + scope.scene.book_id + '/characters')
        .then(response => {
          // commented for now to make the code simple as possible
          // if (scope.scene_character.length) {
          //   scope.characters = response.data.filter(function (character) {
          //     return (scope.scene_character.find(x => (x.book_character_id === character.uuid)) === undefined)
          //   })
          // } else {
          scope.characters = response.data
          // }
        })

      scope.axios
        .get('http://localhost:3000/books/' + scope.scene.book_id + '/locations')
        .then(response => {
          // commented for now to make the code simple as possible
          // if (scope.scene_character.length) {
          //   scope.characters = response.data.filter(function (character) {
          //     return (scope.scene_character.find(x => (x.book_character_id === character.uuid)) === undefined)
          //   })
          // } else {
          scope.locations = response.data
          // }
        })

      scope.axios
        .get('http://localhost:3000/books/' + scope.scene.book_id + '/items')
        .then(response => {
          // commented for now to make the code simple as possible
          // if (scope.scene_character.length) {
          //   scope.characters = response.data.filter(function (character) {
          //     return (scope.scene_character.find(x => (x.book_character_id === character.uuid)) === undefined)
          //   })
          // } else {
          scope.items = response.data
          // }
        })

      scope.axios
        .get('http://localhost:3000/scenes/' + scope.scene.uuid + '/characters')
        .then(response => {
          scope.scene_character = response.data
          scope.characters_totalRows = scope.scene_character.length
        })

      scope.axios
        .get('http://localhost:3000/scenes/' + scope.scene.uuid + '/locations')
        .then(response => {
          scope.scene_location = response.data
          scope.locations_totalRows = scope.scene_location.length
        })

      scope.axios
        .get('http://localhost:3000/scenes/' + scope.scene.uuid + '/items')
        .then(response => {
          scope.scene_item = response.data
          console.log(scope.scene_item)
          scope.items_totalRows = scope.scene_item.length
        })
    }
  },
  updated () {
    var scope = this

    if (scope.scene.uuid !== scope.properties.scene.uuid) {
      scope.loadScene()
    }
  },
  mounted () {
    var scope = this
    scope.loadScene()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-scene-details { padding:20px; }

  .btn-toggle-filter { display:none; float:right;  position:absolute; top:0px; right:0px; background:#fff; border:1px solid #9fb1c2; padding-top:5px; padding-bottom:0px; }
</style>
