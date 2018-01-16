<template >
<div>
  <v-card>
    <v-card-title>
      tests pour les réponses du {{this.species}}
      <v-spacer></v-spacer>
      <v-text-field v-model="search" single-line hide-details append-icon="search" label="Search"></v-text-field>
    </v-card-title>
    <v-data-table
        v-bind:headers="headers"
        v-bind:items="items"
        v-bind:search="search"
        hide-actions
      >
      <template slot="items" slot-scope="props">
        <td>
          <v-btn @click="save(props.item)">save</v-btn>
        </td>
        <td>
          <v-edit-dialog small lazy>
            <div>{{ props.item.userInput}}</div>
            <div slot="input" class="mt-3 title " style="width:600px;">User input</div>
            <v-text-field single-line autofocus slot="input" v-model="props.item.userInput"/>
          </v-edit-dialog>
        </td>
        <td>
          <v-select v-model="props.item.tags" chips tags :items="recastEntities"></v-select>
        </td>
        <td class="text-xs-right">
          <v-select v-model="props.item.answers" chips tags :items="answers" return-object item-text="name"></v-select>
        </td>
      </template>
    </v-data-table>
  </v-card>
  </div>
</template>


<script>
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import Vue from 'Vue'
import _ from 'lodash'
import TestEditTemplate from './TestEditTemplate'
import TestViewTemplate from './TestViewTemplate'

export default {
  name: 'Tests',

  components:{
    edit: TestEditTemplate,
    viewTest: TestViewTemplate
  },
  data() {
    return {
      answers: [],
      species: this.$route.params.species,
      tmp: '',
      search: '',
      headers: [
        { text: 'Actions', sortable: false, value:"userInput"},
        { text: 'User Input', align: 'left', value: 'userInput'},
        { text: 'Tags expected', value:'tags' },
        { text: 'Answers expected', value:'answersId' },
      ],
      items: [

        ]
    };
  },

  created() {
    this.load()
  },

  computed: {
    recastEntities() {
      return this.$store.state.entities
    },
  },

  methods: {
    editOrSave: function(){

      if(this.currentTemplate ===  "viewTest")
        this.currentTemplate = "edit"
      else
        this.currentTemplate = "viewTest"
      console.log(this.currentTemplate)

    },
    load: async function () {

      const testsUrl = process.env.API_URL+'/test/'+this.species;
      this.items = (await axios.get(testsUrl)).data

      const answersUrl = process.env.API_URL+'/species/'+this.species;
      const res = await axios.get(answersUrl)
      this.answers = res.data.map(a => ({ name: a.name, _id: a._id }))

      this.items.forEach( (item) =>{
        let answers = []
        item.answersId.forEach(answerId => {
          const index = _.findIndex(this.answers, {'_id': answerId})
          answers.push(this.answers[index])

        })
        item.answers = answers

      })

    },

    save: function (test) {
      const testData = this.cleanAndFormatTest(test)
      console.log(testData)

      axios({ method: 'put', url: process.env.API_URL+'/test/', data: testData })
        .then(() => { // response
          this.$toasted.success(testData.userInput+' enregistré', Toaster.options)
//          this.load()
        })
        .catch((error) => {
          const errMsg = error.response.data.message
          this.$toasted.error(errMsg, Toaster.options)
        })

    },

    cleanAndFormatTest: function(rawTestData){
      let test = JSON.parse(JSON.stringify(rawTestData))
      test.answersId = []
      test.answers.forEach(answer => test.answersId.push(answer._id))
      delete test.answers;
      return test
    }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
