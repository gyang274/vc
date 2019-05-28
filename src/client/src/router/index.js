import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/room',
      name: 'room',
      component:  () => import(/* webpackChunkName: "about" */ '../views/Room.vue')
    },
    {
      path: '/table',
      name: 'table',
      component:  () => import(/* webpackChunkName: "about" */ '../views/Table.vue')
    },
    {
      path: '/test',
      name: 'test',
      component:  () => import(/* webpackChunkName: "about" */ '../views/Test.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  ]
})
