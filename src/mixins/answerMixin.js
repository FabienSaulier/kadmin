
// Mixin object
import axios from 'axios'
import * as Toaster from '../lib/toaster'

export default {
  methods: {

    save: function (answer) {
      const cleanAnswer = JSON.parse(JSON.stringify(answer));
      console.log(cleanAnswer);
      axios({ method: 'put', url: process.env.API_URL+'/answer/', data: cleanAnswer })
        .then((response) => {
          console.log(response);
          this.$toasted.success(cleanAnswer.name+' enregistré', Toaster.options);
          this.load();
        })
        .catch((error) => {
          const errMsg = error.response.data.message
          this.$toasted.error(errMsg, Toaster.options)
        })
    },

    deleteAnswer: function (id, name) {
      if (!window.confirm('Voulez vous supprimer '+name)) return;
      const url = process.env.API_URL+'/answer/'+id;
      axios.delete(url)
        .then(() => {
          this.$toasted.success('Réponse supprimée', Toaster.options);
          this.load();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
}
