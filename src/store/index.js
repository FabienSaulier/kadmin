import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    entities: {},
  },

  mutations: {
    setEntities(state, entities) {
      const entitiesName = entities.data.map(x => x.name)
      // here we set a new object property who has the name of the current species
      // cf es6 Bracket notation
      this.state.entities[entities.species] = entitiesName
    },
  },
})
