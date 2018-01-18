import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Species from '@/components/Species'
import Entities from '@/components/Entities'
import AnswersGeneral from '@/components/AnswersGeneral'
import Tests from '@/components/Tests'

Vue.use(Router)

export default new Router({
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
