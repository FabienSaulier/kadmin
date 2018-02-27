<template >
<div>
  <v-card>
    <v-card-title>
      <div v-if="hasRunAllTestsAndKOs">
        <v-alert type="error" :value="true">
          <span></span>{{items.length}} tests KO sur le {{this.species}}
          <v-btn  :disabled="this.testRunning"  :loading="this.testRunning" @click="runAllTests(items)">Run All Tests</v-btn>
        </v-alert>
      </div>
      <div v-else>
        {{items.length}} tests pour les réponses du {{this.species}}
        <v-btn  :disabled="this.testRunning"  :loading="this.testRunning" @click="runAllTests(items)">Run All Tests</v-btn>
      </div>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" single-line hide-details append-icon="search" label="Search"></v-text-field>
    </v-card-title>
    <v-data-table
        v-bind:headers="headers"
        v-bind:items="items"
        v-bind:search="search"
        disable-initial-sort
      >
      <template slot="items" slot-scope="props">
        <tr>
        <td>
          <v-btn @click="save(props.item)" flat icon color="blue lighten-2">
            <v-icon>save</v-icon>
          </v-btn>
          <v-btn @click="deleteTest(props.item)" flat icon color="red lighten-2">
            <v-icon>delete</v-icon>
          </v-btn>
          <v-btn @click="runTest(props.item)" flat icon color="green lighten-2">
            <v-icon>play_arrow</v-icon>
          </v-btn>
          <v-btn  v-if="props.item.succeed === 1" flat icon color="green lighten-1">
            <v-icon>check_circle</v-icon>
          </v-btn>
          <v-btn  v-else-if="props.item.succeed === 0" flat icon color="red lighten-1">
            <v-icon>error</v-icon>
          </v-btn>
          <v-btn  v-else flat icon color="grey">
            <v-icon>error</v-icon>
          </v-btn>
        </td>
        <td>
          <v-edit-dialog small lazy>
            <div v-if="props.item.userInput === ''">_____________</div>
            <div v-else>{{props.item.userInput}}</div>
            <div slot="input" class="mt-3 title " style="width:600px;">User input</div>
            <v-text-field single-line autofocus slot="input" v-model="props.item.userInput"/>
          </v-edit-dialog>
        </td>
        <td>
          <v-select v-model="props.item.tags" chips tags :items="recastEntities"></v-select>
        </td>
        <td class="text-xs-right">
          <v-select v-model="props.item.answers" chips tags :items="answersMap" return-object item-text="name"></v-select>
        </td>
      </tr>
      <tr v-if="props.item.succeed === 0">
        <td></td>
        <td></td>
        <td style="color:red;"><pre>{{props.item.analyzeErrorMsg}}</pre></td>
        <td style="color:red;"><pre>{{props.item.findAnswerErrorMsg}}</pre></td>
      </tr>
      </template>
    </v-data-table>
  </v-card>
  <br />
  <br />
  <v-btn fab bottom right color="pink" dark fixed @click="addTest">
    <v-icon>add</v-icon>
  </v-btn>
  </div>
</template>


<script>
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import _ from 'lodash'
import config from '../../config/config'

export default {
  name: 'Tests',
  components:{
  },
  data() {
    return {
      answersMap: [],
      species: this.$route.params.species,
      tmp: '',
      search: '',
      headers: [
        { text: 'Actions', sortable: false, value:"userInput"},
        { text: 'User Input', align: 'left', sortable: false, value: 'userInput'},
        { text: 'Tags expected', value:'tags' },
        { text: 'Answers expected', value:'answersId' },
      ],
      items: [],
      itemsKO: [],
      testRunning: false,
      hasRunAllTestsAndKOs: false,
    };
  },

  created() {
    this.load()
  },

  computed: {
    recastEntities() {
      return this.$store.state.entities[this.species]
    },
  },

  methods: {

    load: async function () {
      // load tests
      const testsUrl = config.API_URL+'/test/species/'+this.species;
      let tests = (await axios.get(testsUrl)).data
      tests.forEach((test) => {
        test.succeed = -1
      })
      this.items = tests

      // load answers
      const answersUrl = config.API_URL+'/species/'+this.species;
      const res = await axios.get(answersUrl)
      // get only id and name
      this.answersMap = res.data.map(a => ({ name: a.name, _id: a._id }))
      // replace answer ID by their answer Name
      this.replaceAnswerIdByName()
    },

    save: function (test) {
      const testData = this.cleanAndFormatTest(test)
      axios({ method: 'put', url: config.API_URL+'/test/', data: testData })
        .then((res) => {
          if(res.data._id) // object created is returned. otherwise it's an update
            test._id = res.data._id
          this.$toasted.success(testData.userInput+' enregistré', Toaster.options)
        })
        .catch((error) => {
          const errMsg = error.response.data.message
          this.$toasted.error(errMsg, Toaster.options)
        })
    },

    testAnalyseAnswer: function(test){
      return axios({ method: 'get', url: config.API_URL+'/test/'+this.species+'/analyse/'+test.userInput})
    },

    testFindAnswer: function(test){
      return axios({ method: 'get', url: config.API_URL+'/test/'+this.species+'/findanswer/'+test.userInput})
    },

    runAllTests: async function(items){
      items.forEach((item) => {
        item.succeed = -1
      })
      this.testRunning = true

      for (let [index, item] of items.entries()) {  //don't use high end func like foreach with await/async
        this.runTest(item)
        await new Promise(r => setTimeout(r, 250));
        if(index === items.length-1){
          this.testRunning = false
          let itemsKO = []
          items.forEach((item) => {
            if(item.succeed === 0){
              itemsKO.push(item)
              this.hasRunAllTestsAndKOs = true
              this.items = itemsKO
            }
          })
        }
      }
    },

    runTest: async function(test){
      test.succeed = -1
      let hadAnalyzeSucceed = undefined
      let analyzeErrorMsg = ''
      let hadFindAnswerSucceed = undefined
      let findAnswerErrorMsg = ''
      const ANALYSE_ANSWER = 0
      const FIND_ANSWER = 1
      const results = await Promise.all([
        this.testAnalyseAnswer(test),
        this.testFindAnswer(test)
      ])

      // test analyse message
      if(_.isEqual(_.sortBy(results[ANALYSE_ANSWER].data), _.sortBy(test.tags)))
        hadAnalyzeSucceed = true
      else{
        hadAnalyzeSucceed = false
        analyzeErrorMsg = "got: "+_.sortBy(results[0].data)
      }

      // prepare got answers
      const expectedAnswers = test.answers.map(a => a.name )
      let gotAnswers = []
      if(Array.isArray(results[FIND_ANSWER].data))
        gotAnswers = results[FIND_ANSWER].data.map(a => a.name )
      else
        gotAnswers[0] = results[FIND_ANSWER].data.name

      // test find answer
      if(_.isEqual(_.sortBy(expectedAnswers), _.sortBy( gotAnswers)))
        hadFindAnswerSucceed = true
      else{
        hadFindAnswerSucceed = false
        findAnswerErrorMsg = "got: "+_.sortBy(gotAnswers)
      }

      if(hadAnalyzeSucceed && hadFindAnswerSucceed )
        test.succeed = 1
      else if (!hadAnalyzeSucceed || !hadFindAnswerSucceed){
        test.succeed = 0
        this.$set(test, 'analyzeErrorMsg', analyzeErrorMsg)
        this.$set(test, 'findAnswerErrorMsg', findAnswerErrorMsg)
      } else{
        alert("error case unhandled")
      }
    },

    cleanAndFormatTest: function(rawTestData){
      let test = JSON.parse(JSON.stringify(rawTestData))
      test.answersId = []
      test.answers.forEach(answer => test.answersId.push(answer._id))
      delete test.answers;
      return test
    },

    addTest: function(){
      this.items.unshift({userInput:'', succeed: undefined, species: this.species, answers: [], tags: []})
    },

    deleteTest: function(test){
      if (!window.confirm('Voulez vous supprimer '+test.userInput)) return
      if(!test._id) {
        this.$toasted.success('Réponse supprimée', Toaster.options)
        this.load()
        return
      }

      const url = config.API_URL+'/test/'+test._id
      axios.delete(url)
        .then(() => {
          this.$toasted.success('Test supprimé', Toaster.options)
          this.load()
        })
        .catch((error) => {
          console.log(error)
        })
    },

    replaceAnswerIdByName: function(){
      this.items.forEach( (test) =>{
        let answers = []
        test.answersId.forEach(answerId => {
          const index = _.findIndex(this.answersMap, {'_id': answerId})
          answers.push(this.answersMap[index])
        })
        test.answers = answers
      })
    }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
