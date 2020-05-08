<template>
<div v-if="page.is_ready == true && chapters" class="es-page-content" style="height: auto">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <h4>{{ $t('LIST') }} {{ $t('OF') }} {{$tc('SCENE',2)}}</h4>
                <small>{{$t('BELOW_ARE_THE_LIST_OF_SCENES_UNDER')}} {{ $tc('BOOK') }} : {{ bookTitle }}</small>
            </div>
<!--            <div class="actions">-->
<!--                <button id="printCharacterButton" class="es-button-white" @click="exportCharacter()">{{$t('EXPORT')}}</button>-->
<!--            </div>-->
        </div>
    </div>
    <div>
        <div v-if="chapters" class="rows-print-as-pages">
            <div v-bind:key="chapter.id" v-for="chapter in chapters">
                <div v-bind:key="scene.id" v-for="scene in chapter.scene">
                    <div class="es-panel">
                        <div class="row">
                            <div class="col-md-2">
                                <label class="">{{$tc('CHAPTER')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="">{{chapter.title}}</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="">{{$tc('SCENE')}} {{$tc('TITLE')}}:</label>
                            </div>
                            <div class="col-md-10">
                                <label class="">{{scene.title}}</label>
                            </div>
                        </div>
                        <div class="row">
                          <div class="col-md-2">
                            <label class="">{{$tc('SHORT_DESCRIPTION')}} :</label>
                          </div>
                          <div class="col-md-10">
                            <label class="">{{scene.short_description}}</label>
                          </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="">{{$tc('TYPE_OF_SCENE')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="">{{scene.typeofscene}}</label>
                            </div>
                        </div>
                        <div class="row">
                          <div class="col-md-2">
                            <label class="">{{$tc('IMPORTANCE')}} :</label>
                          </div>
                          <div class="col-md-10">
                            <label class="">{{scene.importance}}</label>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-2">
                            <label class="">{{$tc('WEATHER')}} :</label>
                          </div>
                          <div class="col-md-10">
                            <label class="">{{scene.weather_type}}</label>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-2">
                            <label class="">{{$tc('STATUS')}} :</label>
                          </div>
                          <div class="col-md-10">
                            <label class="">{{scene.status}}</label>
                          </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="">{{$tc('DATE_START')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="">{{scene.date_starts}}</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="">{{$tc('DATE_END')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="">{{scene.date_ends}}</label>
                            </div>
                        </div><br/>
                        <div class="row">
                          <div class="col-md-2">
                            <label class="">{{$tc('POINT_OF_VIEW')}} :</label>
                          </div>
                          <div class="col-md-10">
                            <label class="">{{getViewPointCharacter(scene)}}</label>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-12">
                            <div style="border-bottom: 1px solid  lightgray">
                              <label class="mb-0">{{$tc('POINT_OF_VIEW')}} {{$tc('DESCRIPTION')}} :</label>
                            </div>
                          </div>
                          <div class="col-md-12" v-html="scene.viewpoint_description"></div>
                        </div><br/><br/>
                        <div class="row">
                            <div class="col-md-12">
                                <div style="border-bottom: 1px solid  lightgray">
                                    <label class="mb-0">{{$tc('CONTENT')}} :</label>
                                </div>
                            </div>
                            <div class="col-md-12" v-html="scene.scene_version[scene.scene_version.length-1].content"></div>
                        </div><br/>
                        <div class="row">
                            <div class="col-md-12">
                                <div style="border-bottom: 1px solid  lightgray">
                                    <label class="mb-0">{{$tc('NOTES')}} :</label>
                                </div>
                            </div>
                            <div class="col-md-12" v-html="scene.notes"></div>
                        </div><br/><br/>
                        <div class="row">
                            <div class="col-md-12">
                                <label class="">{{$tc('CHARACTER',2)}} {{$t('IN')}} {{$t('THIS')}} {{$tc('SCENE',1)}} :</label>
                            </div>
                            <div class="col-md-12">
                                <b-table striped hover :items="scene.characters" :fields="characterFields"></b-table>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label class="">{{$tc('LOCATION',2)}} {{$t('IN')}} {{$t('THIS')}} {{$tc('SCENE',1)}} :</label>
                            </div>
                            <div class="col-md-12">
                                <b-table striped hover :items="scene.locations" :fields="locationFields"></b-table>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label class="">{{$tc('ITEM',2)}} {{$t('IN')}} {{$t('THIS')}} {{$tc('SCENE',1)}} :</label>
                            </div>
                            <div class="col-md-12">
                                <b-table striped hover :items="scene.items" :fields="itemFields"></b-table>
                            </div>
                        </div>
                    </div>
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
  name: 'ExportScenes',
  props: ['properties'],
  data: function () {
    return {
      chapters: [],
      allCharacterFromBook: null,
      characterRelations: [],
      characterFields: [
        {
          key: 'character.fullname',
          label: this.$t('FULLNAME'),
          sortable: true
        },
        {
          key: 'character.shortname',
          label: this.$t('SHORTNAME'),
          sortable: true
        },
        {
          key: 'character.nickname',
          label: this.$t('NICKNAME'),
          sortable: true
        },
        {
          key: 'character.occupation',
          label: this.$t('OCCUPATION'),
          sortable: true
        }
      ],
      locationFields: [
        {
          key: 'location.location',
          label: this.$tc('LOCATION', 1),
          sortable: true
        },
        {
          key: 'location.AKA',
          label: this.$t('AKA'),
          sortable: true
        }
      ],
      itemFields: [
        {
          key: 'item.itemname',
          label: this.$t('ITEM_NAME'),
          sortable: true
        },
        {
          key: 'item.AKA',
          label: this.$t('AKA'),
          sortable: true
        }
      ],
      bookUUID: null,
      bookTitle: null,
      page: {
        is_ready: false
      }
    }
  },
  computed: {},
  methods: {
    getViewPointCharacter: function (scene) {
      const scope = this
      let vpCharacter = ''
      if (scene.character_id_vp === -1) {
        return this.$tc('AUTHOR')
      }
      for (const key in scope.allCharacterFromBook) {
        let character = scope.allCharacterFromBook[key]
        if (character.uuid === scene.character_id_vp) {
          return character.fullname
        }
      }
      return vpCharacter
    },
    exportCharacter: function () {
      const scope = this
      window.$('#printCharacterButton').hide()
      let pdf = {
        name: scope.bookTitle + ' - ' + this.$tc('SCENE', 2)
      }
      ipcRenderer.send('EXPORT_PDF_CONFIRM_GENERATE', {pdf: pdf})
    }
  },
  beforeMount () {},
  mounted () {
    const scope = this
    ipcRenderer.on('EXPORT_PDF_LIST_CHAPTERS', function (event, data) {
      scope.bookUUID = data.bookUUID
      scope.bookTitle = data.title

      scope.$store.dispatch('loadCharactersByBook', scope.bookUUID)
      scope.$store.dispatch('loadChaptersWithScenesByBook', scope.bookUUID)

      setTimeout(function () {
        scope.allCharacterFromBook = scope.$store.getters.getCharactersByBook(scope.bookUUID)
        scope.chapters = scope.$store.getters.getChaptersByBook(scope.bookUUID)
        scope.page.is_ready = true
      }, 500)

      setTimeout(function () {
        let pdf = {
          name: scope.bookTitle + ' - ' + scope.$tc('SCENE', 2)
        }
        ipcRenderer.send('EXPORT_PDF_CONFIRM_GENERATE', {pdf: pdf})
      }, 500)
    })

    // ipcRenderer.on('EXPORT_PDF_SHOW_BUTTON', function (event, data) {
    //   window.$('#printCharacterButton').show()
    // })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @media print {
    .rows-print-as-pages .es-panel{
      page-break-after: always;
    }
    /* . this style if you want the first row to be on the same page as whatever precedes it */
    .rows-print-as-pages:last-child {
      page-break-after: avoid;
    }
  }
  .rows-print-as-pages{margin-top: 10px}
</style>
