<template>
  <div v-if="page.is_ready == true && book" class="es-page-content" style="height: auto">

        <div class="inner">
          <div class="book-title">
            <center><h2 style="page-break-before: always;">{{ book.title }}</h2></center>
          </div>
        </div>
        <!-- <pre><br clear=all style='mso-special-character:line-break;page-break-before:always'></pre> -->
        <br clear=all style='mso-special-character:line-break;page-break-before:always' />
          <div class ="title">© Papermoon AS 2019</div>
          <div class ="title">www.papermoon.no</div>
          <div class ="title">Trykk og innbinding: Livonia Print</div>
          <div class ="title">Sats: Type-it AS, Trondheim 2019</div>
          <div class ="title">Coverdesign: Marius Renberg</div>
          <div class ="title">ISBN 978-82-690530-6-7</div>
          <div class ="title">1. opplag</div>
          <div class ="title">Det er ikke tillatt å kopiere, videreformidle eller mangfoldiggjøre
sider eller utdrag fra boken uten etter skriftlig avtale med forlaget.</div>
        <br>
        <br>
        <br>
        <br>

          <!-- <div v-if="chapters" class="rows-print-as-pages">
            <div v-bind:key="chapter.id" v-for="chapter in chapters">

                <div class ="title">{{chapter.title}}</div>
                <br>
                <br>
                <div v-html="chapter.chapter_version[chapter.chapter_version.length-1].content"></div>

              <div v-bind:key="scene.id" v-for="scene in chapter.scene">
                    <div class ="title">{{scene.title}}</div>
                    <br>
                    <br>
                    <div v-html="scene.scene_version[scene.scene_version.length-1].content"></div>
              </div>

            </div>
          </div> -->

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
      chapters: [],
      page: {
        is_ready: false
      }
    }
  },
  methods: {
    exportBook: function () {
      var scope = this
      // scope.injectCSSBeforeExport()
      // setTimeout(function () {
      var outerhtml = document.documentElement.outerHTML
      console.log(outerhtml)
      ipcRenderer.send('EXPORT-WORD-BOOK', {html: outerhtml, book: scope.book})
      // }, 200)
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
    }
  },
  mounted () {
    var scope = this
    ipcRenderer.on('EXPORT-DOCX-GET-BOOK', function (event, data) {
      scope.book = data

      // scope.$store.dispatch('loadChaptersWithScenesByBook', scope.book.uuid)

      // setTimeout(function () {
      //   scope.chapters = scope.$store.getters.getChaptersByBook(scope.book.uuid)
      scope.page.is_ready = true
      // }, 2000)

      setTimeout(function () {
        scope.exportBook()
      }, 500)
    })
  }
}

</script>

<style scoped>
.title {text-align:center;}
.inner .book-title { text-align:center; width:100%; page-break-before: always;}
.genre {padding:20px 20px;}

.es-export-settings { text-align:left; background:#fff; border-bottom:1px solid #ccc; height:40px; line-height:40px; padding:0px 10px; }
.es-export-settings .btn-option { background:#dfe5ea; margin-right:5px; padding:5px 12px; color:#293742; font-size:12px; cursor:pointer; }
.es-export-settings .btn-option.active { padding-left:8px;  background:#293742; color:#fff; }

.export-button { border-radius:10px; background:#a6d2f5; margin-right:5px; padding:5px 12px; color:#293742; font-size:12px; cursor:pointer;}
</style>
