<template>
  <div>
    page de l'intent {{species}} - {{intent}}
  </div>
</template>

<script>
import  * as Kanzapi from '../lib/kanzapi'
import axios from 'axios';

export default {
  name: 'Intent',

  created(){
    console.log("load data ", this.species, this.intent);
    // this.intentsList = Kanzapi.getIntents(this.species, this.intent);
    // TODO pb: promise ??
    const url = 'http://localhost:3000/species/'+this.species+'/intent/'+this.intent;
    console.log(url);
    axios.get(url)
      .then((response) => {
        const data = response.data;
        this.intentsList = data;
        console.log(data);
        /*
        this.answer = Object.assign({}, this.answer, data); // answer is reactive
        this.originalAnswer = JSON.parse(JSON.stringify(data));
        // data.answer come up with observer ??? wtf ????
*/
      })
      .catch(function (error) {
        console.log(error);
      });

  },
  data() {
    return {
      species: this.$route.params.species,
      intent: this.$route.params.intent,
      intentsList: {},
    };
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
