<template>
  <div>
    <div v-for="intent in intents" >
      <h3>{{intent.name}}</h3>
      <br  />
      <div  v-for="answer in intent.answers">
        <v-expansion-panel>
          <v-expansion-panel-content >
            <div slot="header">{{answer.name}}</div>
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
                      <v-subheader>Gif id</v-subheader>
                    </v-flex>
                    <v-flex xs10>
                      <v-text-field v-model="answer.gifId" placeholder="id du gif sur giphy"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs2>
                      <v-subheader>Children</v-subheader>
                    </v-flex>
                    <v-flex xs10>
                      <div v-for="child in answer.children">
                        {{child.name}} - {{child.label}}
                        <v-btn small fat iconcolor="red" @click="delChild(answer, child)"><v-icon standard>delete</v-icon></v-btn>
                      </div>
                      <v-layout row>
                        <v-flex xs8>
                          <v-select v-model="childName" @change="updateChildInput" placeholder="nom du fils" return-object
                            :items="answersNameAndLabel" item-text="name">
                          </v-select>
                          <v-text-field v-model="childLabel" placeholder="texte du bouton"></v-text-field>
                        </v-flex>
                        <v-flex xs2>
                          <br /><br /><br /><br /><br />
                          <v-btn @click="addChild(answer)">Add</v-btn>
                        </v-flex>
                      </v-layout>
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
                <v-btn flat color="green" @click='save(answer)'>Sauvegarder</v-btn>
              </v-card-actions>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      <br  />
      </div>
      <FormAnswerAddButton :fixed="false" :intent="intent.name" :saveNewAnswer="save" species="all" ></FormAnswerAddButton>
      <br />
    </div>
  </div>
</template>

<script>
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import FormAnswerAddButton from '../components/FormAnswerAddButton'
import answerMixin from '../mixins/answerMixin'

export default {
  components: {
    FormAnswerAddButton,
  },
  mixins: [answerMixin],
  data() {
    return {
      answersNameAndLabel: [],
      intents: [{ name: 'greetings', answers: [] },
                { name: 'goodbye', answers: [] },
                { name: 'unknow', answers: [] },
                { name: 'multipleMatch', answers: [] },
                { name: 'sibling', answers: [] },
                { name: 'insult', answers: [] }],
      items: [],
      answersName: [],
      childLabel: '',
      childName: '',
      intent: this.$route.params.intent,
    };
  },

  created() {
    this.load()
  },

  methods: {
    updateChildInput: function (e) {
      this.childLabel = e.quickReplyLabel
      this.childName = e.name
    },
    load: function () {
      const url = process.env.API_URL+'/species/lapin';
      axios.get(url)
        .then((response) => {
          this.items = response.data;
          this.answersNameAndLabel = this.items.map(a => ({ name: a.name, quickReplyLabel: a.quickReplyLabel }))
        })
        .catch(function (error) {
          const errMsg = error.response.data.message
          this.$toasted.error(errMsg, Toaster.options)
        });

      this.intents.forEach(e => this.getGeneralAnswers(e.name))
    },

    getGeneralAnswers: function (intentName, answers) {
      const url = process.env.API_URL+'/intent/'+intentName
      axios.get(url)
        .then((response) => {
          this.intents.forEach((intent) => {
            if (intent.name == intentName) { intent.answers = response.data }
          })
        })
        .catch(function (error) {
          const errMsg = error.response.data.message
          this.$toasted.error(errMsg, Toaster.options)
        });
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
