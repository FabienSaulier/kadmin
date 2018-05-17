<template>
  <div>
    <v-card-title>
      Historique des messages (seulement de type Text)
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="search"
        single-line
        hide-details
        v-model="filter"
      ></v-text-field>
    </v-card-title>
    <v-form style="margin-left:20px">
      <v-layout row wrap>
        <v-flex xs4>
          <v-subheader>NLP concerné</v-subheader>
        </v-flex>
        <v-flex xs1>
          <div>chien</div>
          <v-checkbox v-model="species['chien']"></v-checkbox>
        </v-flex>
        <v-flex xs1>
          <div>chat</div>
          <v-checkbox v-model="species['chat']"></v-checkbox>
        </v-flex>
        <v-flex xs1>
          <div>lapin</div>
          <v-checkbox v-model="species['lapin']"></v-checkbox>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs4>
          <v-subheader>Date message</v-subheader>
        </v-flex>
        <v-flex xs3>
          <div class="datepicker-trigger">
            <v-text-field readonly="readonly" style="width:200px;"
              type="text"
              id="datepicker-trigger"
              :value="formatDates"
            />
            <AirbnbStyleDatepicker
              :trigger-element-id="'datepicker-trigger'"
              :mode="'range'"
              :fullscreen-mobile="true"
              :endDate="new Date().toString()"
              :date-one="dateOne"
              :date-two="dateTwo"
              @date-one-selected="val => { dateOne = val }"
              @date-two-selected="val => { dateTwo = val }"
            />
          </div>
        </v-flex>
      </v-layout>
      <v-btn @click="search" :loading="searching" >Rechercher</v-btn>
      <v-btn @click="resetForm" >Effacer</v-btn>
    </v-form>

    <v-data-table
      :headers="tableHeaders"
      :items="messages"
      class="elevation-1"
      v-bind:search="filter"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPage"
    >
      <template slot="headerCell" slot-scope="props">
        <v-tooltip bottom>
          <span slot="activator">
            {{ props.header.text }}
          </span>
          <span>
            {{ props.header.text }}
          </span>
        </v-tooltip>
      </template>
      <template slot="items" slot-scope="props">
        <td>
          <v-radio-group
            v-model="props.item.answerStatus"
            @change="reviewMessageLog(props.item)"
            row
          >
            <v-tooltip bottom>
              <v-radio color="green" value="CORRECT"  slot="activator" />
              <span>Correcte</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-radio color="orange" value="TO_IMPROVE" slot="activator"  />
              <span>A améliorer</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-radio color="grey" value="UNDEFINED" slot="activator"  />
              <span>A définir</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-radio color="yellow" value="USER_EDUCATION" slot="activator"  />
              <span>éducation user</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-radio color="red" value="FALSE" slot="activator"  />
              <span>Fausse</span>
            </v-tooltip>
          </v-radio-group>
        </td>
        <td><v-checkbox color="green" v-model="props.item.isCorrected" @change="reviewMessageLog(props.item)" /></td>
        <td>{{ props.item.userName }}</td>
        <td class="text-xs-right">{{ dateFormat(props.item.receivedAt, 'dd/mm "à" HH"h"MM:ss') }}</td>
        <td class="text-xs-right">{{ props.item.nlp }}</td>
        <td class="text-xs-right">{{ props.item.inputType }}</td>
        <td class="text-xs-right">{{ props.item.input }}</td>
        <td class="text-xs-right">
          <v-tooltip data-html="true" v-model="props.item.displayAnswerToolTip" bottom :lazy="true"
            max-width='500' min-width='500'>
            <div slot="activator" @mouseleave="cancelTooltip(props.item)" @mouseover="displayAnswerToolTip(props.item)" >{{ props.item.answersName }}</div>
            <span v-html="answerTextToolTip" />
          </v-tooltip>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Vue from 'vue'
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import dateFormat from 'dateformat'
import _ from 'lodash'
import Qs from 'qs'
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/styles.css'
import format from 'date-fns/format'

const datepickerOptions = {}
Vue.use(AirbnbStyleDatepicker, datepickerOptions)

export default {
  name: 'MessagesHistoryView',
  components: {
  },

  data() {
    return {
      pagination: {
        sortBy: 'receivedAt',
        descending: true,
      },
      rowsPerPage: [100,200,500],
      tableHeaders: [
        { text: 'statut', align: 'center', value: 'answerStatus'},
        { text: 'corrigée?', value: 'isCorrected'},
        { text: 'User', align: 'left', value: 'userName'},
        { text: 'date', align: 'center', value: 'receivedAt' },
        { text: 'NLP', value: 'nlp' },
        { text: 'TYPE', value: 'inputType' },
        { text: 'Input', value: 'input' },
        { text: 'Answers', value: 'answersName' },
      ],
      messages: [],
      dateFormat: dateFormat,
      filter: '',
      answerTextToolTip: '',
      searchForm: {},
      species: {},
      dateOne: '',
      dateTwo: '',
      searching: false,
    }
  },

  created() {
  //  this.load()
  },

  computed: {
    formatDates: function(){
      if(this.dateOne === '' || this.dateTwo === '')
        return ''
      return this.dateOne+' => '+this.dateTwo
    }
  },

  methods: {
    load: async function () {
      const url = process.env.API_URL+'/message-log/text/all'
      try{
        const res = await axios.get(url)
        this.messages = res.data
        console.log(this.messages)
      } catch (error) {
        const errMsg = error.response.data.message
        this.$toasted.error(errMsg, Toaster.options)
      }
    },

    search: async function () {
      this.searching = true
      this.searchForm.dateOne = this.dateOne
      this.searchForm.dateTwo = this.dateTwo
      this.searchForm.species = Object.keys(this.species)
      const url = process.env.API_URL+'/message-log/text/'
      try{
        const res = await axios.get(url, {params: this.searchForm})
        this.messages = res.data
        this.searching = false
        console.log(this.messages)

      } catch (error) {
        this.searching = false
        const errMsg = error.response.data.message
        this.$toasted.error(errMsg, Toaster.options)
      }
    },

    resetForm: function () {

    },
    reviewMessageLog: function (item) {
      const url = process.env.API_URL+'/message-log/reviewMessageLog/'
      const data = {
        _id : item._id,
        answerStatus : item.answerStatus
      }
      try{
        axios.put(url, data)
      } catch (error) {
        const errMsg = error.response.data.message
        this.$toasted.error(errMsg, Toaster.options)
      }
    },
    corrected: function (item) {
      const url = process.env.API_URL+'/message-log/corrected/'
      const data = {
        isCorrected : item.isCorrected,
      }
      try{
        axios.put(url, data)
      } catch (error) {
        const errMsg = error.response.data.message
        this.$toasted.error(errMsg, Toaster.options)
      }
    },
    cancelTooltip: function(item){
      item.displayAnswerToolTip = false
    },
    displayAnswerToolTip: async function(item) {
      item.displayAnswerToolTip = true
      const url = process.env.API_URL+'/answers/name/'
      const params = {
        names : item.answersName,
        species: item.nlp,
      }
      try{
        const res = await axios.get(url,
          {
            params,
            paramsSerializer: function(params) {
             return Qs.stringify(params, {arrayFormat: 'brackets'})
           },
        })
        let toolTipText = ''
        res.data.forEach((answer) => toolTipText += answer.text+"<br  />---<br  />")
        this.answerTextToolTip = toolTipText
      } catch (error) {
        const errMsg = error.response.data.message
        this.$toasted.error(errMsg, Toaster.options)
      }
    }
  },


};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
