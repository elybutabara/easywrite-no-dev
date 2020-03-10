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
import Multiselect from 'vue-multiselect'

import './assets/vendors/bootstrap/css/bootstrap.min.css'
import './assets/vendors/lineawesome/css/line-awesome.min.css'
import './assets/vendors/fontawesome/css/all.min.css'
import './assets/css/animate.css'
import './assets/css/fonts.css'
import './assets/css/style.css'

// import jQuery from 'jquery'
// import 'jquery/dist/jquery.min'

// import 'select2/dist/css/select2.min.css'
// import 'select2-theme-bootstrap4/dist/select2-bootstrap.min.css'
// import 'select2/dist/js/select2.min'

import 'vue-multiselect/dist/vue-multiselect.min.css'

import 'tinymce/tinymce'
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

import TinyMCE from './components/TinyMCE'

window.$ = window.jQuery = require('jquery')
window.moment = require('moment')
window.swal = require('sweetalert2')
// window.$.fn.select2.defaults.set('theme', 'bootstrap')

// import electron from 'electron'
// Vue.use(electron)
Vue.use(Vuex)
Vue.use(Notifications)
Vue.use(VueAxios, axios)
Vue.component('multiselect', Multiselect)
Vue.component('tiny-editor', TinyMCE)
// Vue.use(jQuery)

const store = new Vuex.Store({
  modules: {
    auth: StoreAuth
  }
})

// Vue.component('editor', tinymce)

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