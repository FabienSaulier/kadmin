
// Mixin object
import axios from 'axios'
import * as Toaster from '../lib/toaster'

export default {
  data() {
    return {
    }
  },
  methods: {
    loadEntities: function () {
      this.items.forEach((item) => {
        const species = item.text
        const url = process.env.API_URL+'/nlp/entities/'+species
        axios.get(url)
          .then((response) => {
            this.$store.commit('setEntities', { species: species, data: response.data })
          })
          .catch((error) => {
            this.$toasted.error(error, Toaster.options)
          })
      })
    },
    loadLabels: async function () {
      const url = process.env.API_URL+'/labels'
      const labels = await axios.get(url)
      this.$store.commit('setLabels', labels)
    },
  },
}
