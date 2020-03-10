import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import Auth from '@/pages/Auth'

import StoreAuth from '@/stores/auth'

Vue.use(Router)

function checkAuth (to, from, next) {
  // check if route is protected
  if (to.meta.protected) {
    var isAuthenticated = StoreAuth.state.isAuthenticated
    if (isAuthenticated) {
      next() // allow to enter route
    } else {
      next('/auth') // go to '/auth';
    }
  } else {
    next()
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      beforeEnter: checkAuth,
      component: Main,
      meta: { protected: true }
    },
    {
      path: '/auth',
      name: 'Auth',
      beforeEnter: checkAuth,
      component: Auth,
      meta: { protected: false }
    }
  ]
})