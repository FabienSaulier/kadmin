<template>
  <div>
    <v-card>
      <v-card-title>
        <v-subheader>Filtre utilisateurs</v-subheader>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Filtre"
          single-line
          hide-details
          v-model="filter"
        ></v-text-field>
      </v-card-title>
      <br />
      <v-form style="margin-left:20px">
        <v-layout row wrap>
          <v-flex xs4>
            <v-subheader>Nom utilisateur</v-subheader>
          </v-flex>
          <v-flex xs1>
            <v-text-field  v-model="searchUserLastName" style="width:200px;"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs4>
            <v-subheader>Dernière espèce demandée</v-subheader>
          </v-flex>
          <v-flex xs1>
            <div>chien</div>
            <v-checkbox v-model="chien"></v-checkbox>
          </v-flex>
          <v-flex xs1>
            <div>chat</div>
            <v-checkbox v-model="chat"></v-checkbox>
          </v-flex>
          <v-flex xs1>
            <div>lapin</div>
            <v-checkbox v-model="lapin"></v-checkbox>
          </v-flex>
          <v-flex xs1>
            <div>aucune</div>
            <v-checkbox v-model="aucune"></v-checkbox>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs4>
            <v-subheader>Date arrivée du user</v-subheader>
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
      </v-form>
      <br />
    </v-card>

    <v-data-table
      :headers="tableHeaders"
      :items="users"
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
        <td>{{ props.item.first_name }}</td>
        <td>{{ props.item.last_name }}</td>
        <td class="text-xs-right">{{ comeFromAd(props.item.last_ad_referral) }}</td>
        <td class="text-xs-right">{{ props.item.question_species}}</td>
        <td class="text-xs-right">{{ props.item.last_answer_date ? dateFormatter(props.item.last_answer_date, 'dd/mm "à" HH"h"MM:ss') : null  }}</td>
        <td class="text-xs-right">{{ dateFormatter(props.item.createdAt, 'dd/mm "à" HH"h"MM:ss') }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import dateFormatter from 'dateformat'
import _ from 'lodash'
import Vue from 'vue'
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/styles.css'
import format from 'date-fns/format'

const datepickerOptions = {}
Vue.use(AirbnbStyleDatepicker, datepickerOptions)

export default {
  name: 'UsersView',
  components: {
  },

  data() {
    return {
      pagination: {
        sortBy: 'createdAt',
        descending: true,
      },
      rowsPerPage: [100,200,500],
      tableHeaders: [
        { text: 'User', align: 'left', value:'first_name'},
        { text: 'User', align: 'left', value:'last_name'},
        { text: 'provenance', value:'provenance'},
        { text: 'last species', value:'question_species'},
        { text: 'last_answer_date', value:'last_answer_date'},
        { text: 'createdAt', value:'createdAt'},
      ],
      users: [],
      dateFormatter: dateFormatter,
      filter: '',
      searchParams: {},
      datePicker: false,
      dateOne: '',
      dateTwo: '',
      searchUserLastName: '',
      lapin: false,
      chien: false,
      chat: false,
      aucune: false,
      searching: false,
    }
  },

  created() {
    //this.load()
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
      const url = process.env.API_URL+'/user/all/'
      try{
        const res = await axios.get(url)
        this.users = res.data
      } catch (error) {
        const errMsg = error.response.data.message
        this.$toasted.error(errMsg, Toaster.options)
      }
    },

    search: async function () {
      this.searching = true
      this.searchParams.createdAtBegin = this.dateOne
      this.searchParams.createdAtEnd = this.dateTwo
      this.searchParams.species = []
      this.searchUserLastName != '' ? this.searchParams.userLastName = this.searchUserLastName : null
      this.chien ? this.searchParams.species.push("chien") : null
      this.chat ? this.searchParams.species.push("chat") : null
      this.lapin ? this.searchParams.species.push("lapin") : null
      this.aucune ? this.searchParams.species.push("aucune") : null

console.log(this.searchParams)
      const url = process.env.API_URL+'/user/search/'
      try{
        const res = await axios.get(url, {params: this.searchParams})
        this.users = res.data
        this.searching = false
      } catch (error) {
        this.searching = false
        const errMsg = error.response.data.message
        this.$toasted.error(errMsg, Toaster.options)
      }

      console.log(this.searchParams)
    },
    comeFromAd: function(last_ad_referral){
      if(last_ad_referral && last_ad_referral.source)
        return "AD"
    },
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
