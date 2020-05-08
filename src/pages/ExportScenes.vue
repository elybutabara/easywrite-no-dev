<template>
<div v-if="page.is_ready == true && chapters" class="es-page-content" style="height: auto">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <h4>{{ $t('LIST') }} {{ $t('OF') }} {{$tc('SCENE',2)}}</h4>
                <small>{{$t('BELOW_ARE_THE_LIST_OF_SCENES_UNDER')}} {{ $tc('BOOK') }} : {{ bookTitle }}</small>
            </div>
            <div class="actions">
                <button id="printCharacterButton" class="es-button-white" @click="exportCharacter()">{{$t('EXPORT')}}</button>
            </div>
        </div>
    </div>
    <div>
        <div v-if="chapters" class="rows-print-as-pages">
            <div v-bind:key="chapter.id" v-for="chapter in chapters">
                <div v-bind:key="scene.id" v-for="scene in chapter.scene">
                    <div class="es-panel">
                        <div class="row">
                            <div class="col-md-2">
                                <label class="text-capitalize">{{$tc('CHAPTER')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="text-capitalize">{{chapter.title}}</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="text-capitalize">{{$tc('SCENE')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="text-capitalize">{{scene.title}}</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="text-capitalize">{{$tc('TYPE_OF_SCENE')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="text-capitalize">{{scene.typeofscene}}</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="text-capitalize">{{$tc('DATE_START')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="text-capitalize">{{scene.date_starts}}</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="text-capitalize">{{$tc('DATE_END')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="text-capitalize">{{scene.date_ends}}</label>
                            </div>
                        </div><br/>
                        <div class="row">
                            <div class="col-md-12">
                                <div style="border-bottom: 1px solid  lightgray">
                                    <label class="text-capitalize">{{$tc('CONTENT')}} :</label>
                                </div>
                                <br/>
                            </div>
                            <div class="col-md-12" v-html="scene.scene_version[scene.scene_version.length-1].content"></div>
                        </div><br/>
                        <div class="row">
                            <div class="col-md-12">
                                <div style="border-bottom: 1px solid  lightgray">
                                    <label class="text-capitalize">{{$tc('NOTES')}} :</label>
                                </div>
                            </div>
                            <br/>
                            <div class="col-md-12" v-html="scene.notes"></div>
                        </div><br/>
                        <div class="row">
                            <div class="col-md-12">
                                <label class="text-capitalize">{{$tc('CHARACTER',2)}} {{$t('IN')}} {{$t('THIS')}} {{$tc('SCENE',1)}} :</label>
                            </div>
                            <div class="col-md-12">
                                <b-table striped hover :items="scene.characters" :fields="characterFields"></b-table>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label class="text-capitalize">{{$tc('LOCATION',2)}} {{$t('IN')}} {{$t('THIS')}} {{$tc('SCENE',1)}} :</label>
                            </div>
                            <div class="col-md-12">
                                <b-table striped hover :items="scene.locations" :fields="locationFields"></b-table>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label class="text-capitalize">{{$tc('ITEM',2)}} {{$t('IN')}} {{$t('THIS')}} {{$tc('SCENE',1)}} :</label>
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

      scope.$store.dispatch('loadChaptersWithScenesByBook', scope.bookUUID)
      setTimeout(function () {
        scope.chapters = scope.$store.getters.getChaptersByBook(scope.bookUUID)
        scope.page.is_ready = true
      }, 500)
    })

    ipcRenderer.on('EXPORT_PDF_SHOW_BUTTON', function (event, data) {
      window.$('#printCharacterButton').show()
    })
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
