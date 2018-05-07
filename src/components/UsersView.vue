<template>
  <div>
    <v-card>

    <v-card-title>
      Filtre utilisateurs
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Filtre"
        single-line
        hide-details
        v-model="filter"
      ></v-text-field>
    </v-card-title>
</v-card>
<v-card>
    <v-card-title>
      <v-form >
         <v-layout row wrap class="light--text">
            <v-flex xs4>chien</v-flex>
            <v-flex xs4>chat</v-flex>
            <v-flex xs4>lapin</v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs4>
              <v-checkbox v-model="searchParams.species.chien"></v-checkbox>
            </v-flex>
            <v-flex xs4>
              <v-checkbox v-model="searchParams.species.chat"></v-checkbox>
            </v-flex>
            <v-flex xs4>
              <v-checkbox v-model="searchParams.species.lapin"></v-checkbox>
            </v-flex>
          </v-layout>


          <v-layout row wrap>
            <v-flex xs12 lg6>
              <v-menu
                :close-on-content-click="true"
                v-model="datePicker"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="searchParams.dateFormatted"
                  label="Date"
                  persistent-hint
                  prepend-icon="event"
                  style="width:120px"
                ></v-text-field>
                <v-date-picker v-model="searchParams.dateFormatted" @input="datePicker = false"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>


         <v-btn @click="search" >Rechercher</v-btn>
       </v-form>
    </v-card-title>
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
        <td class="text-xs-right">{{ props.item.last_answer_date ? dateFormat(props.item.last_answer_date, 'dd/mm "à" HH"h"MM:ss') : null  }}</td>
        <td class="text-xs-right">{{ dateFormat(props.item.createdAt, 'dd/mm "à" HH"h"MM:ss') }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import dateFormat from 'dateformat'
import _ from 'lodash'

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
      dateFormat: dateFormat,
      filter: '',
      searchParams: {species:{},},
      datePicker: false,
    }
  },

  created() {
    //this.load()
  },

  computed: {
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
