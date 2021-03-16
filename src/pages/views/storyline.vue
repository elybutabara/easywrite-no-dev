<template>
<div class="es-page-main page-storyline">

  <div>
     <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="false"
        :paginate-elements-by-height="1700"
        :filename="properties.book.title + ' Story Line'"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="landscape"
        pdf-content-width="100%"
        ref="html2Pdf"
        @hasDownloaded="hasDownloaded($event)"
    >
        <section slot="pdf-content">
            <Print v-if="print == 'default'" ref="printCanvas"></Print>
            <PrintChunked v-if="print == 'chunked'" ref="printCanvasChunked"></PrintChunked>
        </section>
    </vue-html2pdf>
   </div>
  
  <div v-if="is_page_ready">
    <div class="es-page-head-2">
      <div class="row-head">
        <div>
          <h4 class="main-title"><i class="fas fa-link mr-2"></i>{{ $t('STORYLINE_EDITOR_FOR') }} ‘{{ book.title }}’</h4>
        </div>
        <div class="book-panel-right">
          <button class="es-button btn-sm white" v-bind:class="{'disabled' : printing}" @click="generateReport()">
            <span v-if="printing && print =='default'">{{ $t('PROCESSING') }}...</span>
            <span v-else>{{ $t('PRINT') }}</span>
            
          </button>
          <button class="es-button btn-sm white"  v-bind:class="{'disabled' : printing}"  @click="generateReport(true)">
            <span v-if="printing && print =='chunked'">{{ $t('PROCESSING') }}...</span>
            <span v-else>{{ $t('PRINT_CHUNKED') }}</span>
          </button>
          <div class="position-relative">
            <button class="es-button btn-sm white" @click="showSettings('settings')">{{ $t('SETTINGS') }}</button>
            <div v-if="show_settings" class="sl-show-settings">
              <span @click="showSettings('storylines')" class="cursor-pointer">{{ $t('SHOW_STORYLINES') }}</span>
              <span @click="showSettings('scenes')" class="cursor-pointer">{{ $t('SHOW_SCENES') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="statistics">
      <div>
        <div class="mr-4">
          <ul class="es-breadcrumb mb-0">
              <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.id, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">
                  <span class="bc-book-title">{{ book.title }}</span>
              </a></li>
              <li><a href="javascript:void(0);">{{ $t('STORYLINE') }}</a></li>
          </ul>
        </div>
        <div class="mr-4"><strong>{{ $t('PROCESSING') }} ({{ storylinesHidden }} {{ $t('OF') }} {{ storylinesTotal }})</strong></div>
        <div class="mr-4"><strong>{{ $t('SELECTED_SCENE') }} ({{ scenesHidden }} {{ $t('OF') }} {{ scenesTotal }})</strong></div>
      </div>
      <div>
        <div class="legend mr-3">
            <span class="triangle"></span>
            <span>{{ $t('STORYLINE_ASSOCIATED_WITH_SCENE') }}</span>
        </div>
        <div class="legend">
            <span class="circle"></span>
            <span>{{ $t('STROYLINE_ENDS_WITH_SCENE') }}</span>
        </div>
      </div>
    </div>

   
    <div class="es-page-content" id="custom-scrollbar">
      <div class="storyline-content mt-1">
        <div class="row">
          <div class="col-lg-2">
            <div v-for="character in characters" :key="'character-'+ character.id" :id="'character-'+ character.id" class="position-relative">
              <div v-if="character.storyline_hidden == 0 || character.storyline_hidden == null">
                <div class="sl-lines-wrapper"></div>
                  <div>
                    <div class="sl-sceneType-blurb">
                      <div class="d-flex align-items-center">
                        <div v-if="character.picture == '/uploads/book-characters/' || character.pictures == null" class="icon-wrap mr-2">
                          <i class="fas fa-question-circle"></i>
                        </div>
                        <div v-else class="sl-c-img-wrap mr-2">
                          <div class="sl-c-img" :style="'background-image: url(' + character.picture + ')'"></div>
                        </div>
                          <span class="name">{{ character.fullname }}</span>
                      </div>
                      <div class="position-relative">
                        <span @click="showOptions(character.id, 'character')" class="cursor-pointer"><i class="fas fa-cog"></i><!--<i class="fas fa-palette"></i>--></span>
                        <div v-if="show_options.show == 'character'+character.id" class="sl-show-options">
                          <span @click="selectChild(character, 'character')" class="cursor-pointer"><!--<i class="fas fa-palette"></i>-->{{ $t('SET_IDENTIFYING_COLOR') }}</span>
                          <span @click="toggleHiddenStorylinesAndScenes(character, 'characters')" class="cursor-pointer"><!--<i class="fas fa-palette"></i>-->{{ $t('REMOVE_SELECTION_FROM_STORYLINE') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            <div v-for="location in locations" :key="'location-'+ location.id" :id="'location-'+ location.id" class="position-relative">
              <div v-if="location.storyline_hidden == 0 || location.storyline_hidden == null">
                <div class="sl-lines-wrapper"></div>
                <div>
                  <div class="sl-sceneType-blurb">
                    <div class="d-flex align-items-center">
                      <div v-if="location.pictures == '/uploads/book-locations/' || location.pictures == null" class="icon-wrap mr-2">
                          <!--<i class="fas fa-map-marker-alt"></i>-->
                          <i class="fas fa-question-circle"></i>
                      </div>
                     <div v-else class="sl-c-img-wrap mr-2">
                        <div class="sl-c-img" :style="'background-image: url(' + location.pictures + ')'"></div>
                      </div>
                      <span class="name">{{ location.location }}</span>
                    </div>
                    <div class="position-relative">
                      <span @click="showOptions(location.id, 'location')" class="cursor-pointer"><i class="fas fa-cog"></i></span>
                      <div v-if="show_options.show == 'location'+location.id" class="sl-show-options">
                        <span @click="selectChild(location, 'location')"  class="cursor-pointer">{{ $t('SET_IDENTIFYING_COLOR') }}</span>
                        <span @click="toggleHiddenStorylinesAndScenes(location, 'locations')" class="cursor-pointer">{{ $t('REMOVE_SELECTION_FROM_STORYLINE') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-for="item in items" :key="'item-'+ item.id" :id="'item-'+ item.id" class="position-relative">
              <div v-if="item.storyline_hidden == 0 || item.storyline_hidden == null">
                  <div class="sl-lines-wrapper"></div>
                  <div>
                    <div class="sl-sceneType-blurb">
                      <div class="d-flex align-items-center">
                        <div v-if="item.pictures == '/uploads/book-items/' || item.pictures == null" class="icon-wrap iw-hammer mr-2">
                          <!--<i class="fas fa-hammer"></i>-->
                          <i class="fas fa-question-circle"></i>
                        </div>
                        <div v-else class="sl-c-img-wrap mr-2">
                          <div class="sl-c-img" :style="'background-image: url(' + item.pictures + ')'"></div>
                        </div>
                        <span class="name">{{ item.itemname }}</span>
                        </div>
                        <div class="position-relative">
                          <span @click="showOptions(item.id, 'item')" class="cursor-pointer"><i class="fas fa-cog"></i></span>
                          <div v-if="show_options.show == 'item'+item.id" class="sl-show-options">
                            <span @click="selectChild(item, 'item')" class="cursor-pointer">{{ $t('SET_IDENTIFYING_COLOR') }}</span>
                            <span @click="toggleHiddenStorylinesAndScenes(item, 'items')" class="cursor-pointer">{{ $t('REMOVE_SELECTION_FROM_STORYLINE') }}</span>
                          </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template v-for="scene in scenes">
          <div
            v-show="scene.storyline_hidden == 0 || scene.storyline_hidden == null"
            :key="'scene-'+ scene.id"
            :id="'scene-'+ scene.id"
            class="col-lg-2"
          >
            <div class="sl-chapter-scene-blurb">
              <div class="blurb-header">
                <div class="d-flex align-items-center">
                    <i class="fas fa-bookmark mr-2"></i>
                    <span class="title">{{ scene.blurb_title }}</span>
                </div>
                <div class="position-relative">
                    <span @click="showOptions(scene.id, 'scene')" class="cursor-pointer"><i class="fas fa-cog"></i></span>
                    <div v-if="show_options.show == 'scene'+scene.id" class="sl-show-options">
                        <span class="cursor-pointer" @click="editScene(scene)">{{ $t('EDIT_SCENE') }}</span>
                        <span @click="toggleHiddenStorylinesAndScenes(scene, 'scenes')" class="cursor-pointer">{{ $t('REMOVE_SELECTION_FROM_STORYLINE') }}</span>
                    </div>
                </div>
              </div>
              <div class="blurb-body">
                <p>{{ scene.title }}</p>
                <p>{{ scene.short_description }}</p>
              </div>
              <div style="display:none;" class="d-none blurb-footer">
                October 10, 2015 9:00 AM (Supposed to be dates ref from WriteItnow)
              </div>
              <!--<small>characters:</small>
              <small class="mb-1" v-for="scene_character in scene.scene_characters" :key="'scene_character-' + scene_character.id">
              {{ scene_character.character.shortname }},
              </small>
              <hr>
              <small>items:</small>
              <small class="mb-1" v-for="scene_item in scene.scene_items" :key="'scene_item-' + scene_item.id">
              {{ scene_item.item.AKA }},
              </small>
              <hr>
              <small>Locations:</small>
              <small class="mb-1" v-for="location_item in scene.scene_locations" :key="'location_item-' + location_item.id">
              {{ location_item.location.AKA }},
              </small>
              <hr>-->
            </div>
          </div>
        </template>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="pageLoader-container" style="height: calc(100vh - 147px)">
    <div class="d-flex align-items-center flex-column">
      <div id="pageLoader"></div>
        <br>
        <p style="font-size: 13px;">{{ $t('LOADING') }} '{{ book.title }}' {{ $t('STROYLINE') }}: {{ loading_msg }}</p>
      </div>
  </div>

    <div v-if="show_edit_scene_modal" class="popup-overlay">
      <div class="popup-wrapper ">
          <div v-if="formStatus == 'ready'" class="popup-header">
            {{ $t('EDIT') }} {{ selected_scene.blurb_title }}
            <span @click="closeEditSceneModal()" style="float:right; cursor:pointer;"><i class="fas fa-times"></i></span>
          </div>

          <div class="popup-body" v-if="formStatus == 'ready'">
            <div class="row">
              <div class="col-md-4 col-12">
                <strong>Characters</strong>
                <div v-for="character in characters" :key="'character-option-'+ character.id">
                  <input
                    type="checkbox"
                    :id="'character-cbx-'+ character.id"
                    :checked="isChildrenExists(selected_scene.selected_characters_ids,character.uuid)"
                    @change="toggleChild(selected_scene.selected_characters_ids,character.uuid)"
                  >
                <label :for="'character-cbx-'+ character.id">{{ character.fullname }}</label>
                </div>
              </div>

              <div class="col-md-4 col-12">
                <strong>{{ $t('LOCATIONS') }}</strong>
                <div v-for="location in locations" :key="'location-option-'+ location.id">
                  <input
                    type="checkbox"
                    :id="'location-cbx-'+ location.id"
                    :checked="isChildrenExists(selected_scene.selected_locations_ids,location.uuid)"
                    @change="toggleChild(selected_scene.selected_locations_ids,location.uuid)"
                  >
                  <label :for="'location-cbx-'+ location.id">{{ location.location }}</label>
                </div>
              </div>
                <div class="col-md-4 col-12">
                  <strong>{{ $t('ITEMS') }}</strong>
                  <div  v-for="item in items" :key="'items-option-'+ item.id">
                    <input
                      type="checkbox"
                      :id="'item-cbx-'+ item.id"
                      :checked="isChildrenExists(selected_scene.selected_items_ids,item.uuid)"
                      @change="toggleChild(selected_scene.selected_items_ids,item.uuid)"
                    >
                    <label :for="'item-cbx-'+ item.id">{{ item.itemname }}</label>
                  </div>
                </div>
            </div>
          </div>
          <div v-if="formStatus == 'saving'" style="padding:100px 30px; text-align:center;">{{ $t('SAVING') }}</div>
            <div v-if="formStatus == 'ready'" class="popup-footer">
              <button @click="saveSceneChilds()"  title="Save" class="es-button btn-sm">{{ $t('SAVE') }}</button>
              <button @click="closeEditSceneModal()" class="es-button btn-sm white">{{ $t('CANCEL') }}</button>
          </div>
        </div>
    </div>

    <div v-if="show_child_line_color_modal" class="popup-overlay">
      <div class="popup-wrapper" style="width:260px !important;">
        <div v-if="formLineColorStatus == 'ready'" class="popup-header">
          {{ $t('EDIT') }} {{ selected_child.label }}
          <span @click="closeChildLineColorModal()" style="float:right; cursor:pointer;"><i class="fas fa-times"></i></span>
        </div>

        <div class="popup-body" v-if="formLineColorStatus == 'ready'">
          <div class="row">
            <div class="col-12 col-md-6">
              <sketch-picker v-model="selected_child_color"></sketch-picker>
            </div>
          </div>
        </div>
        <div v-if="formLineColorStatus == 'saving'" style="padding:100px 30px; text-align:center;">{{ $t('SAVING') }}..</div>
        <div v-if="formLineColorStatus == 'ready'" class="popup-footer">
          <button @click="saveChildLineColor()"  title="Save" class="es-button btn-sm">{{ $t('SAVE') }}</button>
          <button @click="closeChildLineColorModal()" class="es-button btn-sm white">{{ $t('CANCEL') }}</button>
        </div>
      </div>
    </div>

    <div v-if="show_storylines" class="popup-overlay">
        <div class="popup-wrapper">
          <div class="popup-header">
            {{ $t('SELECT_STORYLINES') }}
            <span @click="show_storylines=false; show_settings=false" style="float:right; cursor:pointer;"><i class="fas fa-times"></i></span>
          </div>
          <div class="popup-body">
            <div class="row">
              <div class="col-lg-4 col-12">
                <strong class="d-block mb-2">{{ $t('CHARACTERS') }}:</strong>
                <div v-for="character in characters" :key="'character-option-'+ character.id">
                  <input
                  type="checkbox"
                  :id="'s-character-cbx-'+ character.id"
                  :checked="character.storyline_hidden == 0 || character.storyline_hidden == null"
                  @change="toggleHiddenStorylinesAndScenes(character, 'characters')"
                  >
                  <label :for="'s-character-cbx-'+ character.id">{{ character.fullname }}</label>
                </div>
              </div>
              <div class="col-lg-4 col-12">
                <strong class="d-block mb-2">{{ $t('LOCATIONS') }}:</strong>
                <div v-for="location in locations" :key="'location-option-'+ location.id">
                  <input
                      type="checkbox"
                      :id="'s-location-cbx-'+ location.id"
                      :checked="location.storyline_hidden == 0 || location.storyline_hidden == null"
                      @change="toggleHiddenStorylinesAndScenes(location, 'locations')"
                    >
                    <label :for="'s-location-cbx-'+ location.id">{{ location.location }}</label>
                </div>
              </div>
              <div class="col-lg-4 col-12">
                <strong class="d-block mb-2">{{ $t('ITEMS') }}:</strong>
                <div v-for="item in items" :key="'item-option-'+ item.id">
                  <input
                    type="checkbox"
                      :id="'s-item-cbx-'+ item.id"
                      :checked="item.storyline_hidden == 0 || item.storyline_hidden == null"
                      @change="toggleHiddenStorylinesAndScenes(item, 'items')"
                    >
                    <label :for="'s-item-cbx-'+ item.id">{{ item.itemname }}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="popup-footer">
            <button @click="show_storylines=false; show_settings=false" class="es-button btn-sm">{{ $t('BACK') }}</button>
          </div>
        </div>
    </div>
    <div v-if="show_scenes" class="popup-overlay">
      <div class="popup-wrapper">
        <div class="popup-header">
          {{ $t('SELECT_SCENES') }}
          <span @click="show_scenes=false; show_settings=false" style="float:right; cursor:pointer;"><i class="fas fa-times"></i></span>
        </div>
        <div class="popup-body">
          <div class="row">
            <div class="col-12">
              <strong class="d-block mb-2">{{ $t('SCENES') }}:</strong>
              <div v-for="scene in scenes" :key="'scene-option-'+ scene.id">
                <input
                    type="checkbox"
                    :id="'s-scene-cbx-'+ scene.id"
                    :checked="scene.storyline_hidden == 0 || scene.storyline_hidden == null"
                    @change="toggleHiddenStorylinesAndScenes(scene, 'scenes')"
                >
                <label :for="'s-scene-cbx-'+ scene.id">{{ scene.title }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <button @click="show_scenes=false; show_settings=false" class="es-button btn-sm">{{ $t('BACK') }}</button>
        </div>
      </div>
    </div>
    <div id="snackbar">{{ $t('CHANGES_SAVED') }}</div>
</div>
</template>
<script>
// import moment from 'moment'
import Vue from 'vue'
import axios from 'axios'
import VueHtml2pdf from 'vue-html2pdf'
import Print from './storyline-print'
import PrintChunked from './storyline-print-chunked'

export default {
  name: 'storyline',
  props: ['properties'],
  data: function () {
    return {
      scenes: [],
      detailed_chapters: '',
      selected_scene: null,
      loading_msg: '',
      is_page_ready: false,
      show_edit_scene_modal: false,
      formStatus: 'ready',
      show_options: {
        show: '',
        counter: 1
      },
      show_settings: false,
      show_storylines: false,
      show_scenes: false,

      selected_storylines: [],

      formLineColorStatus: 'ready',
      show_child_line_color_modal: false,
      selected_child: null,
      selected_child_color: { hex: '#bbb' },
      print: 'none', // default or chunked
      printing: false,
    }
  },
  components: { 
     VueHtml2pdf,
     Print,
     PrintChunked
  },
  computed: {
    book: function () {
      var scope = this
      return scope.properties.book
    },
    items: {
      get () {
        var items = this.$store.getters.getItemsByBook(this.book.uuid)
        return items
      },
      set (newValue) {
        this.$store.dispatch('updateItemInList', newValue)
      }
    },
    characters: function () {
      var characters = this.$store.getters.getCharactersByBook(this.book.uuid)
      return characters
    },
    locations: {
      get () {
        let locations = this.$store.getters.getLocationsByBook(this.book.uuid)
        return locations
      },
      set (newValue) {
        this.$store.dispatch('updateLocationList', newValue)
      }
    },
    scenesTotal: function () {
      return this.scenes.length
    },
    scenesHidden: function () {
      var scenesHidden = 0
      for (let scene of this.scenes) {
        if (scene.storyline_hidden == 0 || scene.storyline_hidden == null) {
          scenesHidden++
        }
      }
      return scenesHidden
    },
    storylinesTotal: function () {
      return this.characters.length + this.items.length + this.locations.length
    },
    storylinesHidden: function () {
      var storylines = ['characters', 'items', 'locations']
      var storylinesHidden = 0

      for (let storyline of storylines) {
        for (let each of this[storyline]) {
          if (each.storyline_hidden == 0 || each.storyline_hidden == null) {
            storylinesHidden++
          }
        }
      }
      return storylinesHidden
    }
  },
  methods: {
    generateReport (chunked = false) {
       var scope = this
        var data = {
          chapters: [],
          scenes: scope.scenes,
          characters: scope.characters,
          locations: scope.locations,
          items: scope.items,
        }

        if (scope.printing) {
          return
        }
        
        scope.printing = true

        if (!chunked) {
          scope.print = 'default'
          setTimeout(function(){
            scope.$refs.printCanvas.updateData(data);
          },300);
        } else {
          scope.print = 'chunked'
          setTimeout(function(){
            scope.$refs.printCanvasChunked.updateData(data);
          },300);
        }
        

        setTimeout(function(){
          scope.$refs.html2Pdf.generatePdf()
        },1000);
        
    },
    hasDownloaded: function() {
      var scope = this
      scope.printing = false
    },
    showSettings: function (setting) {
      this[`show_` + setting] = !this[`show_` + setting]
      this.resetShowOptions()
    },
    showOptions: function (id, type) {
      // if user click another option = open
      if (this.show_options.show && this.show_options.show != type + id) {
        this.show_options.counter = 1
      }

      this.show_options.show = type + id
      // if user click the same option = close
      if (this.show_options.counter % 2 == 0) {
        this.show_options.show = ''
      }
      this.show_options.counter++
    },
    resetShowOptions: function () {
      this.show_options.show = ''
      this.show_options.counter = 1
    },
    toggleHiddenStorylinesAndScenes: function (selected, type) {
      var scope = this

      axios.post('http://localhost:3000/' + type + '/' + selected.id + '/hide-storyline')
        .then(response => {
          console.log(response)
          if (response) {
            console.log('response.data.storyline_hidden')
            console.log(response.data.storyline_hidden)

            selected.storyline_hidden = response.data.storyline_hidden

            scope.reCalculateSceneLinesAndHeight()
            scope.showSnackbar()
          }
        })
    },
    editScene: function (scene) {
      this.show_edit_scene_modal = true
      this.selected_scene = scene

      console.log('CHILD')
      console.log(this.selected_scene)
    },
    closeEditSceneModal: function () {
      this.show_edit_scene_modal = false
      // this.selected_scene = null
      this.formStatus = 'ready'
      this.resetShowOptions()
    },
    toggleChild: function (selected, childID) {
      var index = selected.indexOf(childID)
      if (index !== -1) {
        selected.splice(index, 1)
      } else {
        selected.push(childID)
      }
    },
    isChildrenExists: function (haystack, needle) {
      if (haystack && haystack.includes(needle)) {
        return true
      }
      return false
    },
    saveSceneChilds: function () {
      var scope = this
      var sceneID = scope.selected_scene.uuid
      scope.formStatus = 'saving'

      axios.post('http://localhost:3000/scenes/' + sceneID + '/children', {
        charaters: scope.selected_scene.selected_characters_ids,
        locations: scope.selected_scene.selected_locations_ids,
        items: scope.selected_scene.selected_items_ids
      }).then(response => {
        if (response) {
          console.log(response)
          setTimeout(function () {
            window.$(document).find('.sl-line').remove()

            scope.selected_scene.scene_characters = response.data.scene_characters
            scope.selected_scene.scene_items = response.data.scene_items
            scope.selected_scene.scene_locations = response.data.scene_locations

            scope.selected_scene.selected_characters_ids = []
            scope.selected_scene.selected_locations_ids = []
            scope.selected_scene.selected_items_ids = []

            scope.calculateSceneLinesAndHeight({data: scope.characters, type: 'characters'})
            scope.calculateSceneLinesAndHeight({data: scope.locations, type: 'locations'})
            scope.calculateSceneLinesAndHeight({data: scope.items, type: 'items'})
            scope.closeEditSceneModal()
          }, 1000)
        }
      })
      scope.show_options.show = ''
      scope.show_options.counter = 1
    },
    selectChild: function (child, type) {
      this.show_child_line_color_modal = true
      this.selected_child = child
      this.selected_child.type = type
      this.selected_child_color.hex = child.line_color

      if (type == 'character') {
        this.selected_child.label = child.fullname
      } else if (type == 'location') {
        this.selected_child.label = child.location
      } else if (type == 'item') {
        this.selected_child.label = child.itemname
      }
    },
    closeChildLineColorModal: function () {
      this.show_child_line_color_modal = false
      // this.selected_child = null
      this.formLineColorStatus = 'ready'
    },
    saveChildLineColor: function () {
      var scope = this
      var childID = scope.selected_child.id
      var URL = ''
      scope.formLineColorStatus = 'saving'

      if (scope.selected_child.type == 'character') {
        URL = '/characters/' + childID + '/line-color'
      } else if (scope.selected_child.type == 'location') {
        URL = '/locations/' + childID + '/line-color'
      } else if (scope.selected_child.type == 'item') {
        URL = '/items/' + childID + '/line-color'
      }

      axios.post('http://localhost:3000' + URL, {
        color: scope.selected_child_color.hex
      }).then(response => {
        if (response.data) {
          setTimeout(function () {
            window.$(document).find('.sl-line').remove()
            var data = response.data
            scope.selected_child.line_color = data.line_color
            scope.calculateSceneLinesAndHeight({data: scope.characters, type: 'characters'})
            scope.calculateSceneLinesAndHeight({data: scope.locations, type: 'locations'})
            scope.calculateSceneLinesAndHeight({data: scope.items, type: 'items'})

            scope.closeChildLineColorModal()
          }, 1000)
        }
      })

      scope.resetShowOptions()
    },
    /**
    getDetailedChapters: function (chapters) {
      var scope = this
      console.log('detailed_chapters: ', chapters)
      for (var chapter of chapters) {
        for (var scene of chapter.scenes) {
          scope.scenes.push(scene)
        }
      }
      console.log('scenes:', scope.scenes)
    },
    */
    hexToRgb: function (hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b
      })

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    },
    reCalculateSceneLinesAndHeight: function () {
      var scope = this
      window.$(document).find('.sl-line').remove()
      Vue.nextTick(function () {
        scope.calculateSceneLinesAndHeight({data: scope.characters, type: 'characters'})
        scope.calculateSceneLinesAndHeight({data: scope.locations, type: 'locations'})
        scope.calculateSceneLinesAndHeight({data: scope.items, type: 'items'})
      })
    },
    calculateSceneLinesAndHeight: function ({data, type} = {}) {
      var scope = this
      var typeSingular = type.slice(0, -1)

      for (var dataType of data) {
        var arrayLines = []

        for (var scene of scope.scenes) {
          if (!scene.hasOwnProperty('selected_' + type + '_ids')) {
            scope.$set(scene, 'selected_' + type + '_ids', [])
          }

          for (var sceneType of scene[`scene_${type}`]) {
            console.log(`HERERE ===>> scene_${type}`)
            console.log(sceneType)
            console.log(sceneType[`${typeSingular}`])
            if (dataType.id == sceneType[`${typeSingular}`].id && (scene.storyline_hidden == 0 || scene.storyline_hidden == null)) {
              console.log(`scene_${type}`)
              console.log(sceneType[`${typeSingular}`])

              var index = scene['selected_' + type + '_ids'].indexOf(dataType.uuid)
              if (index === -1) {
                scene['selected_' + type + '_ids'].push(dataType.uuid)
              }

              var typeElement = document.querySelector(`.page-storyline #${typeSingular}-${dataType.id}`)
              var sceneElement = document.querySelector(`.page-storyline #scene-${scene.id}`)

              // lines
              const Xdistance = scope.getXDistanceBetweenElements(typeElement, sceneElement)
              // console.log('type: ', type)
              // console.log('Xdistance: ', Xdistance)

              // var lineColor = dataType.lineColor
              var lineColor = dataType.line_color
              arrayLines.push(`
              <div class="sl-line" style="width: ${Xdistance}px !important; background:${lineColor} !important; border-left-color:${lineColor}; "></div>`)

              // height
              // console.log('height: ', typeElement.offsetTop)
              window.$(`.page-storyline #scene-${scene.id} .sl-chapter-scene-blurb`).height(typeElement.offsetTop + 17)
            }
          }
        }
        window.$(`.page-storyline #${typeSingular}-${dataType.id} .sl-lines-wrapper`).append(arrayLines.reverse().join(''))
      }

      /**
        * Guide for above:
        *
        * for(var character of scope.characters) {
            var arrayLines = []

              for(var scene of scope.scenes) {
                for(var scene_character of scene.scene_characters) {
                  if(character.id === scene_character.character.id) {

                    var characterElement = document.querySelector(`.page-storyline #character-${character.id}`)
                    var sceneElement = document.querySelector(`.page-storyline #scene-${scene.id}`) **/
    },
    getPositionAtCenter: function (element) {
      const {top, left, width, height} = element.getBoundingClientRect()
      return {
        x: left + width / 2,
        y: top + height / 2
      }
    },
    getXDistanceBetweenElements: function (a, b) {
      var scope = this

      const aPosition = scope.getPositionAtCenter(a)
      const bPosition = scope.getPositionAtCenter(b)

      return Math.hypot(aPosition.x - bPosition.x)
    },
    showSnackbar: function () {
      var x = document.getElementById('snackbar')
      x.className = 'show'
      setTimeout(function () { x.className = x.className.replace('show', '') }, 3000)
    }
  },
  async mounted () {
    var scope = this
    var keepTrying = false

    do {
      try {
        scope.loading_msg = 'Mounting loadCharactersByBook'
        await scope.$store.dispatch('loadCharactersByBook', scope.book.uuid)

        scope.loading_msg = 'Mounting loadLocationsByBook'
        await scope.$store.dispatch('loadLocationsByBook', scope.book.uuid)

        scope.loading_msg = 'Mounting loadItemsByBook'
        await scope.$store.dispatch('loadItemsByBook', scope.book.uuid)

        this.loading_msg = 'Mounting getChaptersAndScenes'
        let chapters = this.$store.getters.getChaptersByBook(this.book.uuid)

        // get chapters and scenes
        for (let chapter of chapters) {
          await this.$store.dispatch('loadScenesByChapter', chapter.uuid)
          let scenes = this.$store.getters.getScenesByChapter(chapter.uuid)

          for (let scene of scenes) {
            await this.$store.dispatch('loadItemsByScene', scene)
            scene.scene_items = this.$store.getters.getSceneItems(scene.uuid)

            await this.$store.dispatch('loadCharactersByScene', scene)
            scene.scene_characters = this.$store.getters.getSceneCharacters(scene.uuid)

            await this.$store.dispatch('loadLocationsByScene', scene)
            scene.scene_locations = this.$store.getters.getSceneLocations(scene.uuid)

            scene.blurb_title = `Ch. ${chapter.order} Sc. ${scene.order}`
            this.scenes.push(scene)
          }
        }

        scope.is_page_ready = true

        Vue.nextTick(function () {
          scope.calculateSceneLinesAndHeight({data: scope.characters, type: 'characters'})
          scope.calculateSceneLinesAndHeight({data: scope.locations, type: 'locations'})
          scope.calculateSceneLinesAndHeight({data: scope.items, type: 'items'})
        })

        keepTrying = false
      } catch (err) {
        alert('something went wrong. Run again?')
        keepTrying = true
      }
    } while (keepTrying)
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.es-button.disabled { opacity:0.4 !important; }
.popup-overlay { position:fixed; top:0px; left:0px; width:100%; height:100vh; background:rgba(0,0,0,0.7); z-index:5000; }
.popup-overlay .popup-wrapper { background:#fff; width:900px; margin:0px auto; margin-top:120px; border-radius: 4px; }
.popup-overlay .popup-wrapper .popup-header {
    padding:10px 20px;
    background:#efefef;
    font-size:16px;
    font-weight:700;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom: 1px solid #ddd;
}
.popup-overlay .popup-wrapper .popup-body { padding:20px 20px; max-height:500px; overflow-y:auto; }
.popup-overlay .popup-wrapper .popup-footer {
    padding:10px 20px;
    background:#efefef;
    font-size:16px;
    font-weight:700;
    text-align:right;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-top: 1px solid #ddd;
}
</style>
