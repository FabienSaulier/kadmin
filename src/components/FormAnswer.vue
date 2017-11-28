<template>
  <v-dialog v-model="$store.state.answerDialog" width="800px">
    <v-card>
      <v-card-title class="grey lighten-4 py-4 title">
        Nouvelle réponse:    {{species}} >> {{intent}}
      </v-card-title>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex xs12 align-center justify-space-between>
            <v-text-field label="Nom" v-model="answer.name" placeholder="Nom (affiché) de la réponse"></v-text-field>
          </v-flex>
          <v-flex xs12 align-center justify-space-between>
            <v-text-field label="Description" v-model="answer.description" placeholder="Description - utilisé en interne"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-select label="Entities" v-model="answer.entities" chips tags :items="entities"></v-select>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Text" v-model="answer.text" multi-line placeholder="texte de la réponse" :counter="380" >
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Children" placeholder="a venir">
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Siblings" placeholder="a venir">
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="$store.commit('answerDialog')">Cancel</v-btn>
        <v-btn flat v-on:click='save(answer)' @click="$store.commit('answerDialog')">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import * as Toaster from '../lib/toaster'
import axios from 'axios'

export default {
  name: 'FormAnswer',
  props: {
    'dialogOpen': {type: Boolean},
    'species': {type: String},
    'intent': {type: String},
    'saveNewAnswer': {type: Function},
  },
  watch: {
    dialogOpen: function(a){
      this.isOpen = this.dialogOpen;
      console.log("isOpen ",this.isOpen);
    }
  },
  created: function () {
  },
  data() {
    return {
      answer : {},
      isOpen : this.dialogOpen,
      entities: ['a','b','c'],
    };
  },
  methods: {
    save: function (answer) {
      console.log("hjkl");
  this.saveNewAnswer(answer);
      /*
      const cleanAnswer = JSON.parse(JSON.stringify(answer));
      console.log(cleanAnswer);
      axios.put('http://localhost:3000/answer/', cleanAnswer)
        .then((response) => {
          this.$toasted.success(cleanAnswer.name+' enregistré', Toaster.options);
        })
        .catch((error) => this.$toasted.error(error, Toaster.options))
        */
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
