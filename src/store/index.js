import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    answerDialog: false,
  },

  mutations: {
    answerDialog() {
      this.state.answerDialog = !this.state.answerDialog;
    },
  },
})
