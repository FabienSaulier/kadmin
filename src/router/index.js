/* eslint-disable */

import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Species from '@/components/Species'
import Entities from '@/components/Entities'
import AnswersGeneral from '@/components/AnswersGeneral'
import MessagesHistoryView from '@/components/MessagesHistoryView'
import UsersView from '@/components/UsersView'
import Tests from '@/components/Tests'
import { requireAuth } from '../auth/AuthServ'
import AuthCallBack from '../auth/AuthCallBack'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
  //    beforeEnter: requireAuth,
    },
    {
      path: '/species/:species',
      name: 'species',
      component: Species,
      beforeEnter: requireAuth,
    },
    {
      path: '/entities/:species',
      name: 'entities',
      component: Entities,
      beforeEnter: requireAuth,
    },
    {
      path: '/answers/general/',
      name: 'answersGeneral',
      component: AnswersGeneral,
      beforeEnter: requireAuth,
    },
    {
      path: '/messages/',
      name: 'messagesHistory',
      component: MessagesHistoryView,
      beforeEnter: requireAuth,
    },
    {
      path: '/users/',
      name: 'users',
      component: UsersView,
      beforeEnter: requireAuth,
    },
    {
      path: '/tests/:species',
      name: 'tests',
      component: Tests,
      beforeEnter: requireAuth,
    },
    {
      path: '/callback',
      name: 'authCallBack',
      component: AuthCallBack,
    },
  ],
})

export default router
