// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
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

// import electron from 'electron'
// Vue.use(electron)
Vue.use(Vuex)
Vue.use(Notifications)

const store = new Vuex.Store({
  modules: {
    auth: StoreAuth
  }
})

// all global functions goes here...
Vue.mixin(mixins)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
