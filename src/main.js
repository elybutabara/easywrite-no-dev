// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import StoreAuth from './stores/auth'
import mixins from './utils/mixins'
import Notifications from 'vue-notification'

import './assets/vendors/bootstrap/css/bootstrap.min.css'
import './assets/vendors/lineawesome/css/line-awesome.min.css'
import './assets/vendors/fontawesome/css/all.min.css'
import './assets/css/animate.css'
import './assets/css/fonts.css'
import './assets/css/style.css'

import tinymce from 'tinymce'
import 'tinymce/themes/silver'

import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
import 'tinymce/skins/content/default/content.min.css'

// plugins
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/table'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/template'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/wordcount'

// import electron from 'electron'
// Vue.use(electron)
Vue.use(Vuex)
Vue.use(Notifications)
Vue.use(VueAxios, axios)

const store = new Vuex.Store({
  modules: {
    auth: StoreAuth
  }
})

// Vue.component('editor', TinyMCE)

// all global functions goes here...
Vue.mixin(mixins)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

Vue.component('editor', {
  template: '<textarea class="form-control">{{ initValue }}</textarea>',
  props: ['initValue', 'disabled'],
  methods: {
    initEditor: function (elementId) {
      // eslint-disable-next-line one-var
      tinymce.init({
        selector: '#' + elementId,
        min_height: 400,
        resize: false,
        hidden_input: false,
        plugins: [
          'autolink link lists charmap hr anchor',
          'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime nonbreaking',
          'table contextmenu directionality template paste textcolor'// remove autoresize
        ],
        toolbar: [
          'undo | redo | print | copy | cut | paste | bold | italic | underline | strikethrough | backcolor | leftChev | rightChev | enDash | numlist | bullist | alignleft | aligncenter | alignright'
        ],
        browser_spellcheck: true,
        menubar: false,
        branding: false,
        autoresize_on_init: false,
        forced_root_block: false,
        setup: function (editor) {
          editor.ui.registry.addButton('leftChev', {
            text: '<<',
            tooltip: 'leftChev',
            onAction: function (_) {
              editor.insertContent('&#171;')
            }
          })

          editor.ui.registry.addButton('rightChev', {
            text: '>>',
            tooltip: 'rightChev',
            onAction: function (_) {
              editor.insertContent('&#187;')
            }
          })

          editor.ui.registry.addButton('enDash', {
            text: '-',
            tooltip: 'en dash',
            onAction: function (_) {
              editor.insertContent('&#8211;')
            }
          })
        }
      })
    }
  },
  updated: function () {
    // Since we're using Ajax to load data, hence we have to use this hook because when parent's data got loaded, it will fire this hook.
    // Depends on your use case, you might not need this
    var vm = this

    if (vm.initValue) {
      var editor = tinymce.get(vm.$el.id)
      editor.setContent(vm.initValue)
    }
  },
  mounted () {
    var vm = this
    vm.initEditor(vm.$el.id)
  }
})
