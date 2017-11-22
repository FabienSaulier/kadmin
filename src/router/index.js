import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Species from '@/components/Species';
import Intent from '@/components/Intent';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
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
