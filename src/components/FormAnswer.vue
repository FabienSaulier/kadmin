<template>
  <v-dialog v-model="$store.state.answerDialog" width="800px">
    <v-card>
      <v-card-title class="grey lighten-4 py-4 title">
        Nouvelle réponse
      </v-card-title>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex xs12 align-center justify-space-between>
              <v-text-field label="Label" placeholder="Nom (affiché) de la réponse"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Intent" placeholder="intent" >
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Entities" placeholder="Séparées par un ;">
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Text" multi-line placeholder="texte de la réponse" :counter="380" >
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="$store.commit('answerDialog')">Cancel</v-btn>
        <v-btn flat @click="$store.commit('answerDialog')">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// @vue/component
export default {
  name: 'FormAnswer',
  props: [
    'dialogOpen',
  ],
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
      msg: 'Welcome to Your FormAnswer.js ',
      isOpen : this.dialogOpen
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
