import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    answerDialog: false,
    entities: [],
  },

  mutations: {
    answerDialog() {
      this.state.answerDialog = !this.state.answerDialog
    },
    setEntities(state, entities) {
      const entitiesName = entities.map(x => x.name)
      this.state.entities = entitiesName
    },
  },
})
