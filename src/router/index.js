import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index';
import Species from '@/components/Species';
import Intent from '@/components/Intent';

Vue.use(Router);

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
      path: '/species/:species/intent/:intent',
      name: 'intent',
      component: Intent,
    },
  ],
});
