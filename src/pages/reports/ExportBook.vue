<template>
  <div v-if="page.is_ready == true && book" class="es-page-content" style="height: auto">

        <div v-if="show_export_settings" class = "es-export-settings">
              <span class="btn-option" v-bind:class="{'active' : details.show_scene_details}" @click="toggleData('scene_details')">
                  <i v-if="details.show_scene_details" class="las la-check"></i>
                  {{$t('SCENE_DETAILS')}}
              </span>
              <span class="btn-option" v-bind:class="{'active' : details.show_viewpoint}" @click="toggleData('viewpoint')">
                  <i v-if="details.show_viewpoint" class="las la-check"></i>
                  {{$t('VIEWPOINT')}}
              </span>
              <span class="btn-option" v-bind:class="{'active' : details.show_scene_items}" @click="toggleData('scene_items')">
                  <i v-if="details.show_scene_items" class="las la-check"></i>
                  {{$t('SCENE_ITEMS')}}
              </span>
              <span class="btn-option" v-bind:class="{'active' : details.show_scene_locations}" @click="toggleData('scene_locations')">
                  <i v-if="details.show_scene_locations" class="las la-check"></i>
                  {{$t('SCENE_LOCATIONS')}}
              </span>
              <span class="btn-option" v-bind:class="{'active' : details.show_scene_characters}" @click="toggleData('scene_characters')">
                  <i v-if="details.show_scene_characters" class="las la-check"></i>
                  {{$t('SCENE_CHARACTERS')}}
              </span>
              <span class="btn-option" v-bind:class="{'active' : details.show_items}" @click="toggleData('items')">
                  <i v-if="details.show_items" class="las la-check"></i>
                  {{$t('ITEMS')}}
              </span>
              <span class="btn-option" v-bind:class="{'active' : details.show_locations}" @click="toggleData('locations')">
                  <i v-if="details.show_locations" class="las la-check"></i>
                  {{$t('LOCATIONS')}}
              </span>
              <span class="btn-option" v-bind:class="{'active' : details.show_characters}" @click="toggleData('characters')">
                  <i v-if="details.show_characters" class="las la-check"></i>
                  {{$t('CHARACTERS')}}
              </span>
              <span class="btn-option" v-bind:class="{'active' : details.show_other_scenes}" @click="toggleData('other_scenes')">
                  <i v-if="details.show_other_scenes" class="las la-check"></i>
                  {{$t('OTHER_SCENES')}}
              </span>
              <span class="export-button" @click="toggleData('export')">{{$t('EXPORT_BOOK')}}</span>
        </div>

        <br>
        <div class="inner">
          <div class="book-title">
            <center><h2>{{ book.title }}</h2></center>
          </div>
        </div>
          <div class="es-panel" ><label><b>{{$t('GENRE')}}:</b></label> <label><span v-for="(genre, index) in book.genre" :key="genre.uuid"><span v-if="index != 0">, </span>{{genre.name}}</span></label></div>
          <div class="es-panel"><label><b>{{$t('ABOUT')}}:</b></label>
             <div v-html="book.about"></div>
          </div>
        <div>

          <div v-if="chapters" class="rows-print-as-pages">

            <div v-bind:key="chapter.id" v-for="chapter in chapters">

              <div class="es-panel">
                <div><label><b>{{$t('CHAPTER')}}:</b></label> <label>{{chapter.title}}</label></div>
                <div><label><b>{{$t('SHORT_DESCRIPTION')}}:</b></label> <label>{{chapter.short_description}}</label></div>
                <div><label><b>{{ $t('CONTENT') + ': '}}</b></label></div>
                <div v-html="chapter.chapter_version[chapter.chapter_version.length-1].content"></div>
              </div>

              <div v-bind:key="scene.id" v-for="scene in chapter.scene">
                <div class="es-panel">
                    <div><label><b>{{$t('SCENE')}}:</b></label> <label>{{scene.title}}</label></div>
                    <div><label><b>{{$t('SHORT_DESCRIPTION')}}:</b></label> <label>{{scene.short_description}}</label></div>

                      <div v-if="details.show_scene_details" class="details">
                        <div><label><b>{{$t('IMPORTANCE')}}:</b></label> <label>{{scene.importance}}</label></div>
                        <div><label><b>{{$t('TAGS')}}:</b></label> <label>{{scene.tags}}</label></div>
                        <div><label><b>{{$t('STATUS')}}:</b></label> <label>{{scene.status}}</label></div>
                        <div><label><b>{{$t('TYPE_OF_SCENE')}}:</b></label> <label>{{scene.typeofscene}}</label></div>
                        <div><label><b>{{$t('DATE_START')}}:</b></label> <label>{{scene.date_starts}}</label></div>
                        <div><label><b>{{$t('DATE_END')}}:</b></label> <label>{{scene.date_ends}}</label></div>
                        <div><label><b>{{$t('WEATHER')}}:</b></label> <label>{{scene.weather}}</label></div>
                        <div><label><b>{{$t('NOTES')}}:</b></label></div>
                        <div v-html="scene.notes"></div>
                        <br/>
                      </div>
                      <div v-if="details.show_viewpoint" class="details">
                        <div><label><b>{{$t('POINT_OF_VIEW')}}:</b></label> <label>{{getViewPointCharacter(scene)}}</label></div>
                        <div><label><b>{{$t('VIEWPOINT')}}:</b></label></div>
                        <div v-html="scene.viewpoint_description"></div>
                        <br/>
                      </div>

                    <div><label><b>{{$t('CONTENT')}}:</b></label><br/></div>
                    <div v-html="scene.scene_version[scene.scene_version.length-1].content"></div>

                    <div v-if="details.show_scene_characters" class="details">
                      <div><label><b>{{$t('CHARACTERS_IN_THIS_SCENE')}}:</b> </label></div>
                      <div>
                        <b-table striped hover :items="scene.characters" :fields="characterFields"></b-table>
                      </div>
                    </div>

                    <div v-if="details.show_scene_locations" class="details">
                      <div><label><b>{{$t('LOCATIONS_IN_THIS_SCENE')}}:</b></label></div>
                      <div>
                        <b-table striped hover :items="scene.locations" :fields="locationFields"></b-table>
                      </div>
                    </div>

                    <div v-if="details.show_scene_items" class="details">
                      <div><label><b>{{$t('ITEMS_IN_THIS_SCENE')}}:</b></label></div>
                      <div>
                        <b-table striped hover :items="scene.items" :fields="itemFields"></b-table>
                      </div>
                    </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="details.show_other_scenes" class="details">
          <div><center><h2><b>{{$t('OTHER_SCENES')}}</b></h2></center></div>
          <div v-if="scenes" class="rows-print-as-pages">
            <div v-bind:key="scene.id" v-for="scene in scenes">
              <div class="es-panel">
                <div><label><b>{{$t('SCENE')}}:</b></label> <label>{{scene.title}}</label></div>
                <div><label><b>{{$t('SHORT_DESCRIPTION')}}:</b></label> <label>{{scene.short_description}}</label></div>
                <div><label><b>{{$t('IMPORTANCE')}}:</b></label> <label>{{scene.importance}}</label></div>
                <div><label><b>{{$t('TAGS')}}:</b></label> <label>{{scene.tags}}</label></div>
                <div><label><b>{{$t('STATUS')}}:</b></label> <label>{{scene.status}}</label></div>
                <div><label><b>{{$t('TYPE_OF_SCENE')}}:</b></label> <label>{{scene.typeofscene}}</label></div>
                <div><label><b>{{$t('DATE_START')}}:</b></label> <label>{{scene.date_starts}}</label></div>
                <div><label><b>{{$t('DATE_END')}}:</b></label> <label>{{scene.date_ends}}</label></div>
                <div><label><b>{{$t('WEATHER')}}:</b></label> <label>{{scene.weather}}</label></div>
                <br/>
                <div><label><b>{{$t('CONTENT')}}:</b></label><br/></div>
                <div v-html="scene.scene_version[scene.scene_version.length-1].content"></div>
                <br/>
                  <div><label><b>{{$t('NOTES')}}:</b></label></div>
                <div v-html="scene.notes"></div>
                <br/>
                <div><label><b>{{$t('POINT_OF_VIEW')}}:</b></label> <label>{{getViewPointCharacter(scene)}}</label></div>
                <div><label><b>{{$t('VIEWPOINT')}}:</b></label></div>
                <div v-html="scene.viewpoint_description"></div>
                <br/>

                <div><label><b>{{$t('CHARACTERS_IN_THIS_SCENE')}}:</b></label></div>
                <div>
                  <b-table striped hover :items="scene.characters" :fields="characterFields"></b-table>
                </div>

                <div><label><b>{{$t('LOCATIONS_IN_THIS_SCENE')}}:</b></label></div>
                <div>
                  <b-table striped hover :items="scene.locations" :fields="locationFields"></b-table>
                </div>

                <div><label><b>{{$t('ITEMS_IN_THIS_SCENE')}}:</b></label></div>
                <div>
                  <b-table striped hover :items="scene.items" :fields="itemFields"></b-table>
                </div>
              </div>
            </div>
          </div>
        </div>

     <div v-if="details.show_locations" class="details">
        <div><center><h2><b>{{$t('LOCATIONS')}}</b></h2></center></div>
        <div v-if="locations" class="rows-print-as-pages">
          <div v-bind:key="location.id" v-for="location in locations">
            <div class="es-panel">
              <div><label><b>{{$t('LOCATION')}}:</b></label> <label>{{location.location}}</label></div>
              <div><label><b>{{$t('AKA')}}:</b></label> <label>{{location.AKA}}</label></div>
              <div><label><b>{{$t('DESCRIPTION')}}:</b></label></div>
              <div v-html="location.description"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="details.show_items" class="details">
        <div><center><h2><b>{{$t('ITEMS')}}</b></h2></center></div>
        <div v-if="items" class="rows-print-as-pages">
          <div v-bind:key="item.id" v-for="item in items">
            <div class="es-panel">
              <div><label><b>{{$t('ITEM')}}:</b></label> <label>{{item.itemname}}</label></div>
              <div><label><b>{{$t('AKA')}}:</b></label> <label>{{item.AKA}}</label></div>
              <div><label><b>{{$t('DESCRIPTION')}}:</b></label></div>
              <div v-html="item.description"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="details.show_characters" class="details">
        <div><center><h2><b>{{$t('CHARACTERS')}}</b></h2></center></div>
        <div v-if="characters" class="rows-print-as-pages">
          <div v-bind:key="character.id" v-for="character in characters">
            <div class="es-panel">
              <div><label><b>{{$t('FULLNAME')}}:</b></label> <label>{{character.fullname}}</label></div>
              <div><label><b>{{$t('SHORTNAME')}}:</b></label> <label>{{character.shortname}}</label></div>
              <div><label><b>{{$t('NICKNAME')}}:</b></label> <label>{{character.nickname}}</label></div>
              <div><label><b>{{$t('OCCUPATION')}}:</b></label> <label>{{character.occupation}}</label></div>
              <div><label><b>{{$t('BIRTHDATE')}}:</b></label> <label>{{character.birthdate}}</label></div>
              <div><label><b>{{$t('DESCRIPTION')}}:</b></label></div>
              <div v-html="character.description"></div>
              <br/>
              <div><label><b>{{$t('BIO')}}:</b></label></div>
              <div v-html="character.bio"></div>
              <br/>
              <div><label><b>{{$t('GOALS')}}:</b></label></div>
              <div v-html="character.goals"></div>
            </div>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
const electron = window.require('electron')
const {ipcRenderer} = electron

export default {
  name: 'ExportBook',
  data: function () {
    return {
      book: null,
      characters: [],
      items: [],
      locations: [],
      scenes: [],
      chapters: [],
      characterRelations: [],
      characterFields: [
        {
          key: 'character.fullname',
          label: this.$t('FULLNAME')
        },
        {
          key: 'character.shortname',
          label: this.$t('SHORTNAME')
        },
        {
          key: 'character.nickname',
          label: this.$t('NICKNAME')
        },
        {
          key: 'character.occupation',
          label: this.$t('OCCUPATION')
        }
      ],
      locationFields: [
        {
          key: 'location.location',
          label: this.$t('LOCATIONS')
        },
        {
          key: 'location.AKA',
          label: this.$t('AKA')
        }
      ],
      itemFields: [
        {
          key: 'item.itemname',
          label: this.$t('ITEMS')
        },
        {
          key: 'item.AKA',
          label: this.$t('AKA')
        }
      ],
      page: {
        is_ready: false
      },
      details: {
        show_scene_details: true,
        show_viewpoint: true,
        show_scene_items: true,
        show_scene_locations: true,
        show_scene_characters: true,
        show_items: true,
        show_locations: true,
        show_characters: true,
        show_other_scenes: true
      },
      show_export_settings: true
    }
  },
  methods: {
    exportBook: function () {
      var scope = this
      scope.injectCSSBeforeExport()
      setTimeout(function () {
        var outerhtml = document.documentElement.outerHTML
        // console.log(outerhtml)
        ipcRenderer.send('EXPORT-WORD-BOOK', {html: outerhtml, book: scope.book})
      }, 200)
    },
    injectCSSBeforeExport: function () {
      // this will get the external from this window and inject it as internal css before exporting
      let css = []
      let head = document.head || document.getElementsByTagName('head')[0]
      let style = document.createElement('style')
      for (let sheeti = 0; sheeti < document.styleSheets.length; sheeti++) {
        let sheet = document.styleSheets[sheeti]
        let rules = ('cssRules' in sheet) ? sheet.cssRules : sheet.rules
        for (let rulei = 0; rulei < rules.length; rulei++) {
          let rule = rules[rulei]
          if ('cssText' in rule) { css.push(rule.cssText) } else { css.push(rule.selectorText + ' {\n' + rule.style.cssText + '\n}\n') }
        }
      }
      head.appendChild(style)
      style.type = 'text/css'
      if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css.join('\n')
      } else {
        style.appendChild(document.createTextNode(css.join('\n')))
      }
      return css.join('\n')
    },
    getViewPointCharacter: function (scene) {
      var scope = this

      if (scene.character_id_vp === -1) {
        return this.$t('AUTHOR')
      }
      for (const key in scope.characters) {
        let character = scope.characters[key]
        if (character.uuid === scene.character_id_vp) {
          return character.fullname
        }
      }
    },
    toggleData: function (data) {
      var scope = this

      if (data === 'scene_details') {
        scope.details.show_scene_details = !scope.details.show_scene_details
      } else if (data === 'viewpoint') {
        scope.details.show_viewpoint = !scope.details.show_viewpoint
      } else if (data === 'scene_items') {
        scope.details.show_scene_items = !scope.details.show_scene_items
      } else if (data === 'scene_locations') {
        scope.details.show_scene_locations = !scope.details.show_scene_locations
      } else if (data === 'scene_characters') {
        scope.details.show_scene_characters = !scope.details.show_scene_characters
      } else if (data === 'items') {
        scope.details.show_items = !scope.details.show_items
      } else if (data === 'locations') {
        scope.details.show_locations = !scope.details.show_locations
      } else if (data === 'characters') {
        scope.details.show_characters = !scope.details.show_characters
      } else if (data === 'other_scenes') {
        scope.details.show_other_scenes = !scope.details.show_other_scenes
      } else if (data === 'export') {
        scope.show_export_settings = !scope.show_export_settings
        scope.exportBook()
      }
    }
  },
  beforeMount () {},
  mounted () {
    var scope = this
    ipcRenderer.on('EXPORT-DOCX-GET-BOOK', function (event, data) {
      scope.book = data

      scope.$store.dispatch('loadChaptersWithScenesByBook', scope.book.uuid)
      scope.$store.dispatch('loadScenesByBook', scope.book.uuid)
      scope.$store.dispatch('loadLocationsByBook', scope.book.uuid)
      scope.$store.dispatch('loadItemsByBook', scope.book.uuid)
      scope.$store.dispatch('loadCharactersByBook', scope.book.uuid)

      setTimeout(function () {
        scope.chapters = scope.$store.getters.getChaptersByBook(scope.book.uuid)
        scope.scenes = scope.$store.getters.getScenesByBook(scope.book.uuid)
        scope.locations = scope.$store.getters.getLocationsByBook(scope.book.uuid)
        scope.items = scope.$store.getters.getItemsByBook(scope.book.uuid)
        scope.characters = scope.$store.getters.getCharactersByBook(scope.book.uuid)
        scope.page.is_ready = true
      }, 2000)

      ipcRenderer.on('SHOW-EXPORT-SETTINGS', function (event, data) {
        scope.show_export_settings = true
      })
    })
  }
}

</script>

<style scoped>
.inner .book-title { text-align:center; width:100%; }
.genre {padding:20px 20px;}

.es-export-settings { text-align:left; background:#fff; border-bottom:1px solid #ccc; height:40px; line-height:40px; padding:0px 10px; }
.es-export-settings .btn-option { background:#dfe5ea; margin-right:5px; padding:5px 12px; color:#293742; font-size:12px; cursor:pointer; }
.es-export-settings .btn-option.active { padding-left:8px;  background:#293742; color:#fff; }

.export-button { border-radius:10px; background:#a6d2f5; margin-right:5px; padding:5px 12px; color:#293742; font-size:12px; cursor:pointer;}
</style>
