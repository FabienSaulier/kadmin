<template>
  <div>
      <v-card-title>
        Utilisateurs
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>

    <v-data-table
      :headers="tableHeaders"
      :items="users"
      class="elevation-1"
      v-bind:search="search"
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
        <td>{{ props.item.first_name }} {{ props.item.last_name }}</td>
        <td class="text-xs-right">{{ comeFromAd(props.item.last_ad_referral) }}</td>
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
        { text: 'User', align: 'left', value:'last_name'},
        { text: 'provenance', value:'provenance'},
        { text: 'last_answer_date', value:'last_answer_date'},
        { text: 'createdAt', value:'createdAt'},
      ],
      users: [],
      dateFormat: dateFormat,
      search: '',
    }
  },

  created() {
    this.load()
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
    comeFromAd: function(last_ad_referral){
      if(last_ad_referral && last_ad_referral.source)
        return "AD"
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
