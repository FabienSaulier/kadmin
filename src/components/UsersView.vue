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
            <v-subheader>Dernière espèce questionnée</v-subheader>
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
        <v-layout row wrap>
          <v-flex xs4>
            <v-subheader>Label</v-subheader>
          </v-flex>
          <v-flex xs2>
            <v-select v-model="searchLabel" :items="labels"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs4>
            <v-subheader>Nouveau Label</v-subheader>
          </v-flex>
          <v-flex xs2>
            <v-text-field  v-model="newLabelName" style="width:150px;"></v-text-field>
          </v-flex>
          <v-flex xs1>
          </v-flex>
          <v-flex xs2>
            <v-btn @click="createLabel" small>Create</v-btn>
          </v-flex>
        </v-layout>

        <v-btn @click="search" :loading="searching" >Rechercher</v-btn>
        <v-btn @click="resetForm" >Effacer</v-btn>

      </v-form>
    </v-card>
    <br />
    <v-data-table
      :headers="tableHeaders"
      :items="users"
      class="elevation-1"
      v-bind:search="filter"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPage"
      select-all
      v-model="selected"
      item-key="_id"
    >

      <template slot="headers" slot-scope="props">
        <tr>
          <th>
            <v-checkbox
              :input-value="props.all"
              :indeterminate="props.indeterminate"
              primary
              hide-details
              @click.native="toggleAll"
            ></v-checkbox>
          </th>
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
            @click="changeSort(header.value)"
          >
            <v-icon small>arrow_upward</v-icon>
            {{ header.text }}
          </th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
        <td><v-checkbox v-model="props.selected"></v-checkbox></td>
        <td>{{ props.item.first_name }}</td>
        <td>{{ props.item.last_name }}</td>
        <td>{{ props.item.labels.length > 0 ? props.item.labels : '' }}</td>
        <td class="text-xs-right">{{ comeFromAd(props.item.last_ad_referral) }}</td>
        <td class="text-xs-right">{{ props.item.question_species}}</td>
        <td class="text-xs-right">{{ props.item.last_answer_date ? dateFormatter(props.item.last_answer_date, 'dd/mm "à" HH"h"MM:ss') : null  }}</td>
        <td class="text-xs-right">{{ dateFormatter(props.item.createdAt, 'dd/mm "à" HH"h"MM:ss') }}</td>
      </template>
    </v-data-table>

    <br />
    <div>
      <v-card>
        <v-layout row wrap style="padding-top:10px;">
          <v-flex xs1>
            <v-subheader>Label</v-subheader>
          </v-flex>
          <v-flex xs2>
            <v-select v-model="labelToApply" :items="labels"></v-select>
          </v-flex>
          <v-flex xs3>
            <v-btn @click="applyLabel"  >Appliquer le label</v-btn>
          </v-flex>
          <v-flex xs2>
            <v-btn @click="removeLabels"  >Retirer tous les labels</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </div>

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
import storeController from '../mixins/storeController'
import Qs from 'qs'

const datepickerOptions = {}
Vue.use(AirbnbStyleDatepicker, datepickerOptions)

export default {
  name: 'UsersView',
  components: {
  },
  mixins: [storeController],
  data() {
    return {
      pagination: {
        sortBy: 'createdAt',
        descending: true,
      },
      rowsPerPage: [100,200,500],
      tableHeaders: [
        { text: 'Prénom', align: 'left', value:'first_name'},
        { text: 'Nom', align: 'left', value:'last_name'},
        { text: 'labels', value:'labels'},
        { text: 'provenance', value:'provenance'},
        { text: 'last species', value:'question_species'},
        { text: 'last_answer_date', value:'last_answer_date'},
        { text: 'createdAt', value:'createdAt'},
      ],
      users: [],
      dateFormatter: dateFormatter,
      filter: '',
      searchParams: {},
      // search params
      dateOne: '',
      dateTwo: '',
      searchUserLastName: '',
      lapin: false,
      chien: false,
      chat: false,
      aucune: false,
      searchLabel: '',
      // end search params
      searching: false,
      selected: [],
      newLabelName: '',
      labelToApply: '',
    }
  },

  created() {
    //this.load()
  },

  computed: {

    labels() {
      return this.$store.state.labels
    },

    formatDates: function(){
      if(this.dateOne === '' || this.dateTwo === '')
        return ''
      return this.dateOne+' => '+this.dateTwo
    }
  },

  methods: {

    search: async function () {
      this.searching = true
      this.searchParams.createdAtBegin = this.dateOne
      this.searchParams.createdAtEnd = this.dateTwo
      this.searchParams.species = []
      this.searchParams.label = this.searchLabel
      this.searchUserLastName != '' ? this.searchParams.userLastName = this.searchUserLastName : null
      this.chien ? this.searchParams.species.push("chien") : null
      this.chat ? this.searchParams.species.push("chat") : null
      this.lapin ? this.searchParams.species.push("lapin") : null
      this.aucune ? this.searchParams.species.push("aucune") : null
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
    },

    comeFromAd: function(last_ad_referral){
      if(last_ad_referral && last_ad_referral.source)
        return "AD"
    },

    applyLabel: function(){
      if(!this.labelToApply || this.labelToApply === '' ){
        this.$toasted.info("no label selected", Toaster.options)
        return
      }
      this.editLabels(this.labelToApply)
    },

    removeLabels: function(){
      if(!window.confirm('Voulez vous supprimer les labels de ces '+this.selected.length+' utilisateurs'))
        return
      this.editLabels('')
    },

    editLabels: async function(label){
      const url = process.env.API_URL+'/users/label/'+label
      if(!this.selected || this.selected.length === 0){
        this.$toasted.info("no user selected", Toaster.options)
        return
      }
      const params = { usersId: this.selected.map(user => user._id) }
      try{
        await axios.patch(url,
          {
            params,
            paramsSerializer: function(params) {
             return Qs.stringify(params, {arrayFormat: 'brackets'})
           },
        })
        this.search()
      } catch (error) {
        const errMsg = error.response.data.message
        this.$toasted.error(errMsg, Toaster.long)
      }
    },

    createLabel: async function(){
      const url = process.env.API_URL+'/labels'
      try{
        await axios.put(url, {name:this.newLabelName})
        this.$toasted.success('label ajouté', Toaster.options)
        this.newLabelName = ''
        this.loadLabels()
      } catch (error) {
        const errMsg = error.response.data.message
        this.$toasted.error(errMsg, Toaster.long)
      }
    },

    resetForm: function(){
      this.dateOne = ''
      this.dateTwo = ''
      this.userLastName = ''
      this.lapin = false
      this.chien = false
      this.chat = false
      this.aucune = false
      this.searchUserLastName = ''
      this.searchParams = {}
    },
    toggleAll: function() {
     if (this.selected.length) this.selected = []
     else this.selected = this.users.slice()
   },
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
