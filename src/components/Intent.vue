<template>
  <div style="width:800px">
    <h3>Intent {{this.intent}}</h3>
    <br  />
    <div  v-for="answer in answersList">

      <v-expansion-panel>
        <v-expansion-panel-content >
          <div slot="header">{{answer.name}} - {{answer.description}}</div>
          <v-card>

            <v-card-text>

      <v-container fluid>

        <v-layout row>
          <v-flex xs2>
            <v-subheader>Nom</v-subheader>
          </v-flex>
          <v-flex xs10>
            <v-text-field :value="answer.name"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs2>
            <v-subheader>Description</v-subheader>
          </v-flex>
          <v-flex xs10>
            <v-text-field :value="answer.description"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs2>
            <v-subheader>Entities</v-subheader>
          </v-flex>
          <v-flex xs10>
            <v-select v-model="answer.entities" chips tags :items="entities"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs2>
            <v-subheader>Text</v-subheader>
          </v-flex>
          <v-flex xs10>
            <v-text-field multi-line :value="answer.text"
              placeholder="texte de la réponse" :counter="380" >
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs2>
            <v-subheader>Children</v-subheader>
          </v-flex>
          <v-flex xs10>
            <v-select v-model="answer.children" chips tags :items="otherAnswers"></v-select>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs2>
            <v-subheader>Siblings</v-subheader>
          </v-flex>
          <v-flex xs10>
            <v-select v-model="answer.siblings" chips tags :items="otherAnswers"></v-select>
          </v-flex>
        </v-layout>



      </v-container>
    </v-card-text>




            <v-card-actions>
              <v-spacer></v-spacer>
               <v-btn flat>Editer</v-btn>
               <v-btn flat color="purple">Supprimer</v-btn>
             </v-card-actions>


          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    <br  />
    </div>
  </div>
</template>

<script>
import  * as Kanzapi from '../lib/kanzapi'
import axios from 'axios'

export default {
  name: 'Intent',

  data() {
    return {
      species: this.$route.params.species,
      intent: this.$route.params.intent,
      answersList: {},
      test: [],
      entities: [],
      otherAnswers: []
    };
  },

  created(){
    console.log("load data ", this.species, this.intent);
    // this.answersList = Kanzapi.getIntents(this.species, this.intent);
    // TODO pb: promise ??
    const url = 'http://localhost:3000/species/'+this.species+'/intent/'+this.intent;
    console.log(url);
    axios.get(url)
      .then((response) => {
        const data = response.data;
        this.answersList = data;
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

  methods: {
    callbackMethod: function (event) {
      console.log(event);
    },
  }

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
