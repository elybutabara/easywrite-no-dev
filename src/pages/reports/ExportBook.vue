<template>
<div v-if="page.is_ready == true && chapters" class="es-page-content" style="height: auto">

  <div class="inner">
    <div class="book-title">
      <center><h2>{{ book.title }}</h2></center>
    </div>
  </div>

    <div class="es-panel">
        <label>{{$t('ABOUT')}} : {{ book.about }}</label>
    </div>

  <div>
    <div v-if="chapters" class="rows-print-as-pages">

      <div v-bind:key="chapter.id" v-for="chapter in chapters">
          <div class="es-panel">
            <div><label>{{$tc('CHAPTER', 1)}} : {{chapter.title}}</label></div>
            <div><label>{{$t('SHORT_DESCRIPTION')}} : {{chapter.short_description}}</label></div>
            <div v-html="$t('CONTENT') + ': ' + chapter.chapter_version[chapter.chapter_version.length-1].content"></div>
          </div>

        <div v-bind:key="scene.id" v-for="scene in chapter.scene">
          <div class="es-panel">
              <div><label>{{$tc('SCENE', 1)}} : {{scene.title}}</label></div>
              <div><label>{{$t('TYPE_OF_SCENE')}} : {{scene.typeofscene}}</label></div>
              <div><label>{{$t('DATE_START')}} : {{scene.date_starts}}</label></div>
              <div><label>{{$t('DATE_END')}} : {{scene.date_ends}}</label>
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
  data: function () {
    return {
      book: null,
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
          label: this.$t('FULLNAME')
        },
        {
          key: 'location.AKA',
          label: this.$t('SHORTNAME')
        }
      ],
      itemFields: [
        {
          key: 'item.itemname',
          label: this.$t('FULLNAME')
        },
        {
          key: 'item.AKA',
          label: this.$t('SHORTNAME')
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

      setTimeout(function () {
        scope.chapters = scope.$store.getters.getChaptersByBook(scope.book.uuid)
        scope.page.is_ready = true
      }, 1000)

      setTimeout(function () {
        scope.exportBook()
      }, 1000)
    })
  }
}

</script>

<style scoped>
.inner .book-title { text-align:center; width:100%; }

</style>
