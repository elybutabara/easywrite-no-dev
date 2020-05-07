import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import Auth from '@/pages/Auth'
import ExportCharacters from '@/pages/ExportCharacters'
import ExportBook from '@/pages/reports/ExportBook'
import ExportScenes from '@/pages/ExportScenes'

import StoreAuth from '@/stores/auth'

Vue.use(Router)

function checkAuth (to, from, next) {
  // } else {
  // check if route is protected
  if (to.meta.protected) {
    var isAuthenticated = StoreAuth.state.isAuthenticated
    console.log('routerjs-isAuthenticated:' + isAuthenticated)
    if (isAuthenticated) {
      next() // allow to enter route
    } else {
      next('/auth') // go to '/auth';
    }
  } else {
    next()
  }
  // }
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
    },
    {
      path: '/export-characters',
      name: 'ExportCharacters',
      beforeEnter: checkAuth,
      component: ExportCharacters,
      meta: { protected: false }
    },
    {
      path: '/exportbook',
      name: 'ExportBook',
      beforeEnter: checkAuth,
      component: ExportBook,
      meta: { protected: false }
    },
    {
      path: '/export-scenes',
      name: 'ExportScenes',
      beforeEnter: checkAuth,
      component: ExportScenes,
      meta: { protected: false }
    }

  ]
})
