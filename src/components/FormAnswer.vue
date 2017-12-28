<template>
  <v-dialog v-model="$store.state.answerDialog" width="800px">
    <v-card>
      <v-card-title class="grey lighten-4 py-4 title">
        Nouvelle réponse:    {{species}} {{this.intent}}
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
            <v-select label="Entities" v-model="answer.entities" chips tags :items="recastEntities"></v-select>
          </v-flex>
          <v-flex xs12>
            <v-select label="Entities Values" v-model="answer.entValues" chips tags ></v-select>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Text" v-model="answer.text" multi-line placeholder="texte de la réponse" :counter="380" >
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
    'species': {type: String},
    'intent': {type: String, default: 'questions'},
    'saveNewAnswer': {type: Function},
  },
  created: function () {
    this.answer.species = this.species
    this.answer.intent = this.intent
  },
  data() {
    return {
      answer : {},
    };
  },
  computed: {
    recastEntities () {
      return this.$store.state.entities
    }
  },
  methods: {
    save: function (answer) {
      console.log(answer)
      this.saveNewAnswer(answer)
      this.answer = {}
    },
  },
}
</script>
