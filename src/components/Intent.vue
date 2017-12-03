<template>
  <div style="width:800px">
    <h3>Intent {{this.intent}}</h3>
    <br  />
    <div  v-for="answer in answersList">
      <v-expansion-panel>
        <v-expansion-panel-content >
          <div slot="header">{{answer.name}} - {{answer.entities}}</div>
          <v-card>
            <v-card-text>
              <v-container fluid>
                <v-layout row>
                  <v-flex xs2>
                    <v-subheader>Nom</v-subheader>
                  </v-flex>
                  <v-flex xs10>
                    <v-text-field v-model="answer.name"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs2>
                    <v-subheader>Description</v-subheader>
                  </v-flex>
                  <v-flex xs10>
                    <v-text-field v-model="answer.description"></v-text-field>
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
                    <v-text-field multi-line v-model="answer.text"
                      placeholder="texte de la réponse" :counter="380" >
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs2>
                    <v-subheader>Children</v-subheader>
                  </v-flex>
                  <v-flex xs10>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs2>
                    <v-subheader>Siblings</v-subheader>
                  </v-flex>
                  <v-flex xs10>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" flat @click="deleteAnswer(answer._id, answer.name)">Supprimer</v-btn>
              <v-btn flat color="green" v-on:click='save(answer)'>Sauvegarder</v-btn>
            </v-card-actions>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    <br  />
    </div>
    <v-btn fab bottom right color="pink" dark fixed @click.native.stop="$store.commit('answerDialog')">
      <v-icon>add</v-icon>
    </v-btn>
    <FormAnswer v-bind:dialogOpen="dialog" :saveNewAnswer="this.save" :species="this.species" :intent="this.intent"></FormAnswer>
  </div>
</template>

<script>
import  * as Kanzapi from '../lib/kanzapi'
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import FormAnswer from '../components/FormAnswer'

export default {
  name: 'Intent',
  components: {
    FormAnswer,
  },
  data() {
    return {
      species: this.$route.params.species,
      intent: this.$route.params.intent,
      answersList: {},
      entities: [],
      dialog: false,
    };
  },

  created(){
    this.load()
    this.entities= this.$store.state.entities
  },

  methods: {
    load: function () {
      // TODO pb: promise ??
      const url = process.env.API_URL+"/species/"+this.species+'/intent/'+this.intent;
      axios.get(url)
        .then((response) => {
          console.log(response);
          const data = response.data;
          this.answersList = data;

        })
        .catch(function (error) {
          const errMsg = error.response.data.message
          this.$toasted.error(errMsg, Toaster.options)
        });
    },

    save: function (answer) {
      const cleanAnswer = JSON.parse(JSON.stringify(answer));
      console.log(cleanAnswer);
      axios({method:'put', url:process.env.API_URL+'/answer/', data:cleanAnswer})
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

    deleteAnswer: function(id, name){
      if(!window.confirm("Voulez vous supprimer "+name)) return;
      const url = process.env.API_URL+"/answer/"+id;
      axios.delete(url)
        .then((response) => {
          this.$toasted.success('Réponse supprimée', Toaster.options);
          this.load();
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
