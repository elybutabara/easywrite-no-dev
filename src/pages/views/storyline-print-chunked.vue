<template>
<div class="es-page-main page-storyline">
    <section class="storyline-print-canvas" slot="pdf-content">

      <section class="pdf-item" style="margin-top:20px;" v-for="(chunk,chunk_index) in chunks" :key="'chunk' + '-' + chunk_index">
      <div style="flex-wrap: nowrap;" class="row">
            <div class="col-lg-3">
            <div v-for="character in characters" :key="'character-'+ character.id + '-' + chunk_index" :id="'print-character-'+ character.id + '-' + chunk_index" class="position-relative">
                <div v-if="character.storyline_hidden == 0 || character.storyline_hidden == null">
                    <div class="sl-lines-wrapper"></div>
                    <div>
                        <div class="sl-sceneType-blurb">
                            <div class="d-flex align-items-center">
                                <div v-if="character.picture == '/uploads/book-characters/' || character.pictures == null" class="icon-wrap mr-2"><i class="fas fa-question-circle"></i></div>
                                <div v-else class="sl-c-img-wrap mr-2"><div class="sl-c-img" :style="'background-image: url(' + character.picture + ')'"></div></div>
                                <span class="name">{{ character.fullname }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="location in locations" :key="'location-'+ location.id" :id="'print-location-'+ location.id + '-' + chunk_index" class="position-relative">
                <div v-if="location.storyline_hidden == 0 || location.storyline_hidden == null">
                    <div class="sl-lines-wrapper"></div>
                    <div>
                        <div class="sl-sceneType-blurb">
                            <div class="d-flex align-items-center">
                                <div v-if="location.pictures == '/uploads/book-locations/' || location.pictures == null" class="icon-wrap mr-2"><i class="fas fa-question-circle"></i></div>
                                <div v-else class="sl-c-img-wrap mr-2"><div class="sl-c-img" :style="'background-image: url(' + location.pictures + ')'"></div></div>
                                <span class="name">{{ location.location }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="item in items" :key="'item-'+ item.id" :id="'print-item-'+ item.id + '-' + chunk_index" class="position-relative">
                <div v-if="item.storyline_hidden == 0 || item.storyline_hidden == null">
                  <div class="sl-lines-wrapper"></div>
                    <div>
                        <div class="sl-sceneType-blurb">
                            <div class="d-flex align-items-center">
                                <div v-if="item.pictures == '/uploads/book-items/' || item.pictures == null" class="icon-wrap iw-hammer mr-2"><i class="fas fa-question-circle"></i></div>
                                <div v-else class="sl-c-img-wrap mr-2"><div class="sl-c-img" :style="'background-image: url(' + item.pictures + ')'"></div></div>
                                <span class="name">{{ item.itemname }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template v-for="scene in chunks[chunk_index]">
          <div
            v-show="scene.storyline_hidden == 0 || scene.storyline_hidden == null"
            :key="'scene-'+ scene.id"
            :id="'print-scene-'+ scene.id + '-' + chunk_index"
            class="col-lg-3"
          >
            <div class="sl-chapter-scene-blurb">
                <div class="blurb-header"><div class="d-flex align-items-center"><i class="fas fa-bookmark mr-2"></i> <span class="title">{{ scene.blurb_title }}</span></div></div>
                <div class="blurb-body"><p>{{ scene.title }}</p><p>{{ scene.short_description }}</p></div>
                <div class="d-none blurb-footer">October 10, 2015 9:00 AM (Supposed to be dates ref from WriteItnow)</div>
            </div>
          </div>
        </template>
      </div>
      </section>

    </section>
</div>
</template>
<script>
/* eslint-disable camelcase */
// import moment from 'moment'
import Vue from 'vue'
export default {
  name: 'storyline-print-chunked',
  props: ['properties'],
  data: function () {
    return {
      chapters: [],
      scenes: [],
      characters: [],
      locations: [],
      items: [],
      chunks: []
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    updateData: function (data) {
      var scope = this
      scope.chapters = data.chapters
      scope.scenes = data.scenes
      scope.characters = data.characters
      scope.locations = data.locations
      scope.items = data.items
      scope.chunks = scope.chunkArray(scope.scenes, 3)

      Vue.nextTick(function () {
        scope.calculateSceneLinesAndHeight({data: scope.characters, type: 'characters'})
        scope.calculateSceneLinesAndHeight({data: scope.locations, type: 'locations'})
        scope.calculateSceneLinesAndHeight({data: scope.items, type: 'items'})
      })
    },
    chunkArray: function (myArray, chunk_size) {
      var index = 0
      var arrayLength = myArray.length
      var tempArray = []

      for (index = 0; index < arrayLength; index += chunk_size) {
        var myChunk = myArray.slice(index, index + chunk_size)
        // Do something if you want with the group
        tempArray.push(myChunk)
      }

      return tempArray
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

      for (var chunk_index = 0; chunk_index < scope.chunks.length; chunk_index++) {
        for (var dataType of data) {
          var arrayLines = []

          for (var scene of scope.chunks[chunk_index]) {
            for (var sceneType of scene[`scene_${type}`]) {
              if (dataType.id == sceneType[`${typeSingular}`].id && (scene.storyline_hidden == 0 || scene.storyline_hidden == null)) {
                var typeElement = document.querySelector(`.page-storyline #print-${typeSingular}-${dataType.id}-${chunk_index}`)
                var sceneElement = document.querySelector(`.page-storyline #print-scene-${scene.id}-${chunk_index}`)

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
                window.$(`.page-storyline #print-scene-${scene.id}-${chunk_index} .sl-chapter-scene-blurb`).height(typeElement.offsetTop + 17)
              }
            }
          }
          window.$(`.page-storyline #print-${typeSingular}-${dataType.id}-${chunk_index} .sl-lines-wrapper`).append(arrayLines.reverse().join(''))
        }
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
    }
  },
  async mounted () {
    // var scope = this
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.storyline-print-canvas { padding:5px; }
.storyline-print-canvas .sl-lines-wrapper > .sl-line {
    position: absolute;
    height: 10px;
    top: 50%;
    transform: translate(0, -50%);
    background: #bbb;
}

.storyline-print-canvas .sl-lines-wrapper > .sl-line:first-child:before {
    top: -3px;
    width: 15px;
    height: 15px;
    background: var(--es-darkish);
    border-radius: 50%;
}

.storyline-print-canvas .sl-lines-wrapper > .sl-line:before {
    content: '';
    position: absolute;
    right: -2px;
    top: -2px;
    width: 0px;
    height: 0px;
    border-top: 7px solid #efefef;
    border-left: 14px solid var(--es-darkish);
    border-left-color: inherit !important;
    border-bottom: 7px solid #efefef;
}
</style>
