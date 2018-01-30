/* eslint-disable */

import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Species from '@/components/Species'
import Entities from '@/components/Entities'
import AnswersGeneral from '@/components/AnswersGeneral'
import Tests from '@/components/Tests'
import AuthentService from './../auth/AuthentService'

Vue.use(Router)


const auth = new AuthentService();
const {authenticated, login, logout, authNotifier} = auth


const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/species/:species',
      name: 'species',
      component: Species,
    },
    {
      path: '/entities/:species',
      name: 'entities',
      component: Entities,
    },
    {
      path: '/answers/general/',
      name: 'answersGeneral',
      component: AnswersGeneral,
    },
    {
      path: '/tests/:species',
      name: 'tests',
      component: Tests,
    },
  ],
})

router.beforeResolve((to, from, next) => {
  if(!authenticated)
    login()
  else
    next()
})

export default router
