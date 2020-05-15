<template>
  <div v-if="page.is_ready == true && chapters" class="es-page-content" style="height: auto">

        <div class="inner">
          <div class="book-title">
            <center><h2>{{ book.title }}</h2></center>
          </div>
        </div>
          <div class="es-panel" >{{$t('GENRE')}}: <span v-for="(genre, index) in book.genre" :key="genre.uuid"><span v-if="index != 0">, </span>{{genre.name}}</span></div>
          <div class="es-panel" v-html="$t('ABOUT') + ': ' + book.about"></div>

        <div>
          <div v-if="chapters" class="rows-print-as-pages">

            <div v-bind:key="chapter.id" v-for="chapter in chapters">
                <div class="es-panel">
                  <div><label>{{$t('CHAPTER')}} : {{chapter.title}}</label></div>
                  <div><label>{{$t('SHORT_DESCRIPTION')}} : {{chapter.short_description}}</label></div>
                  <div>{{ $t('CONTENT') + ': '}}</div>
                  <div v-html="chapter.chapter_version[chapter.chapter_version.length-1].content"></div>
                </div>

              <div v-bind:key="scene.id" v-for="scene in chapter.scene">
                <div class="es-panel">
                    <div><label>{{$t('SCENE')}} : {{scene.title}}</label></div>
                    <div><label>{{$t('SHORT_DESCRIPTION')}} : {{scene.short_description}}</label></div>
                    <div><label>{{$t('IMPORTANCE')}} : {{scene.importance}}</label></div>
                    <div><label>{{$t('TAGS')}} : {{scene.tags}}</label></div>
                    <div><label>{{$t('STATUS')}} : {{scene.status}}</label></div>
                    <div><label>{{$t('TYPE_OF_SCENE')}} : {{scene.typeofscene}}</label></div>
                    <div><label>{{$t('DATE_START')}} : {{scene.date_starts}}</label></div>
                    <div><label>{{$t('DATE_END')}} : {{scene.date_ends}}</label></div>
                    <div><label>{{$t('WEATHER')}} : {{scene.weather}}</label></div>
                    <br/>
                    <div><label>{{$t('CONTENT')}} :</label><br/></div>
                    <div v-html="scene.scene_version[scene.scene_version.length-1].content"></div>
                    <br/>
                      <div><label>{{$t('NOTES')}} :</label></div>
                    <div v-html="scene.notes"></div>
                    <br/>
                    <div><label>{{$t('VIEWPOINT')}} :</label></div>
                    <div v-html="scene.viewpoint_description"></div>
                    <br/>

                    <div><label>{{$t('CHARACTERS_IN_THIS_SCENE')}} : </label></div>
                    <div>
                      <b-table striped hover :items="scene.characters" :fields="characterFields"></b-table>
                    </div>

                    <div><label>{{$t('LOCATIONS_IN_THIS_SCENE')}} :</label></div>
                    <div>
                      <b-table striped hover :items="scene.locations" :fields="locationFields"></b-table>
                    </div>

                    <div><label>{{$t('ITEMS_IN_THIS_SCENE')}} :</label></div>
                    <div>
                      <b-table striped hover :items="scene.items" :fields="itemFields"></b-table>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div><center><h2>{{$t('OTHER_SCENES')}}</h2></center></div>

      <div v-if="scenes" class="rows-print-as-pages">
        <div v-bind:key="scene.id" v-for="scene in scenes">
          <div class="es-panel">
            <div><label>{{$t('SCENE')}} : {{scene.title}}</label></div>
            <div><label>{{$t('SHORT_DESCRIPTION')}} : {{scene.short_description}}</label></div>
            <div><label>{{$t('IMPORTANCE')}} : {{scene.importance}}</label></div>
            <div><label>{{$t('TAGS')}} : {{scene.tags}}</label></div>
            <div><label>{{$t('STATUS')}} : {{scene.status}}</label></div>
            <div><label>{{$t('TYPE_OF_SCENE')}} : {{scene.typeofscene}}</label></div>
            <div><label>{{$t('DATE_START')}} : {{scene.date_starts}}</label></div>
            <div><label>{{$t('DATE_END')}} : {{scene.date_ends}}</label></div>
            <div><label>{{$t('WEATHER')}} : {{scene.weather}}</label></div>
            <br/>
            <div><label>{{$t('CONTENT')}} :</label><br/></div>
            <div v-html="scene.scene_version[scene.scene_version.length-1].content"></div>
            <br/>
              <div><label>{{$t('NOTES')}} :</label></div>
            <div v-html="scene.notes"></div>
            <br/>
            <div><label>{{$t('VIEWPOINT')}} :</label></div>
            <div v-html="scene.viewpoint_description"></div>
            <br/>

            <div><label>{{$t('CHARACTERS_IN_THIS_SCENE')}} : </label></div>
            <div>
              <b-table striped hover :items="scene.characters" :fields="characterFields"></b-table>
            </div>

            <div><label>{{$t('LOCATIONS_IN_THIS_SCENE')}} :</label></div>
            <div>
              <b-table striped hover :items="scene.locations" :fields="locationFields"></b-table>
            </div>

            <div><label>{{$t('ITEMS_IN_THIS_SCENE')}} :</label></div>
            <div>
              <b-table striped hover :items="scene.items" :fields="itemFields"></b-table>
            </div>
          </div>
        </div>
      </div>

      <div><center><h2>{{$t('LOCATIONS')}}</h2></center></div>

      <div v-if="locations" class="rows-print-as-pages">
        <div v-bind:key="location.id" v-for="location in locations">
          <div class="es-panel">
            <div><label>{{$t('LOCATION')}} : {{location.location}}</label></div>
            <div><label>{{$t('AKA')}} : {{location.AKA}}</label></div>
            <div><label>{{$t('DESCRIPTION')}} :</label></div>
            <div v-html="location.description"></div>
          </div>
        </div>
      </div>

      <div><center><h2>{{$t('ITEMS')}}</h2></center></div>

      <div v-if="items" class="rows-print-as-pages">
        <div v-bind:key="item.id" v-for="item in items">
          <div class="es-panel">
            <div><label>{{$t('ITEM')}} : {{item.itemname}}</label></div>
            <div><label>{{$t('AKA')}} : {{item.AKA}}</label></div>
            <div><label>{{$t('DESCRIPTION')}} :</label></div>
            <div v-html="item.description"></div>
          </div>
        </div>
      </div>

      <div><center><h2>{{$t('CHARACTERS')}}</h2></center></div>

      <div v-if="characters" class="rows-print-as-pages">
        <div v-bind:key="character.id" v-for="character in characters">
          <div class="es-panel">
            <div><label>{{$t('FULLNAME')}} : {{character.fullname}}</label></div>
            <div><label>{{$t('SHORTNAME')}} : {{character.shortname}}</label></div>
            <div><label>{{$t('NICKNAME')}} : {{character.nickname}}</label></div>
            <div><label>{{$t('OCCUPATION')}} : {{character.occupation}}</label></div>
            <div><label>{{$t('BIRTHDATE')}} : {{character.birthdate}}</label></div>
            <div><label>{{$t('DESCRIPTION')}} :</label></div>
            <div v-html="character.description"></div>
            <br/>
            <div><label>{{$t('BIO')}} :</label></div>
            <div v-html="character.bio"></div>
            <br/>
            <div><label>{{$t('GOALS')}} :</label></div>
            <div v-html="character.goals"></div>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
const electron = window.require('electron')
const {ipcRenderer} = electron

export default {
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
      }
    }
  },
  methods: {
    exportBook: function () {
      var scope = this
      var outerhtml = document.documentElement.outerHTML
      console.log(outerhtml)
      ipcRenderer.send('EXPORT-WORD-BOOK', {html: outerhtml, book: scope.book})
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
      }, 500)

      setTimeout(function () {
        scope.exportBook()
      }, 500)
    })
  }
}

</script>

<style scoped>
.inner .book-title { text-align:center; width:100%; }

</style>
