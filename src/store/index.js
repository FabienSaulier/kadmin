import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    entities: [],
  },

  mutations: {
    setEntities(state, entities) {
      const entitiesName = entities.map(x => x.name)
      this.state.entities = entitiesName
    },
  },
})
