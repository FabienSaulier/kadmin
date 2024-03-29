// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import Toasted from 'vue-toasted'
import 'vuetify/dist/vuetify.css'
import store from './store/index'
import App from './App'
import router from './router'

Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(Toasted)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
})
