<template>
  <div style="width:800px">
    <h3>Intent {{this.intent}}</h3>
    <br  />
    <div  v-for="item in intentsList">

      <v-expansion-panel>
        <v-expansion-panel-content >
          <div slot="header">{{item.name}} - {{item.description}}</div>
          <v-card>
            <v-card-text class="grey lighten-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    <br  />
    </div>
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

.container{
  padding:5px;
}
.card__text{
  padding:5px;
}
</style>
