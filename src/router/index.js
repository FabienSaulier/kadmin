import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Species from '@/components/Species'
import Entities from '@/components/Entities'
import AnswersGeneral from '@/components/AnswersGeneral'

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
      path: '/entities/',
      name: 'entities',
      component: Entities,
    },
    {
      path: '/answers/general/',
      name: 'answersGeneral',
      component: AnswersGeneral,
    },
  ],
})
