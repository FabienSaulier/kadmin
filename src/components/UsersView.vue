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
        <td>{{ props.item.last_name }}</td>
        <td class="text-xs-right">{{ props.item.gender }}</td>
        <td class="text-xs-right">{{ dateFormat(props.item.receivedAt, 'dd/mm "à" HH"h"MM:ss') }}</td>
        <td class="text-xs-right">{{ dateFormat(props.item.createdAt, 'dd/mm "à" HH"h"MM:ss') }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import dateFormat from 'dateformat'

export default {
  name: 'UsersView',
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
        { text: 'User', align: 'left', value: 'last_name'},
        { text: 'gender', value: 'gender'},
        { text: 'updatedAt', value: 'updatedAt'},
        { text: 'createdAt', value: 'createdAt'},
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
        console.log(res)
        this.users = res.data
      } catch (e) {
        const errMsg = error.response.data.message
        this.$toasted.error(errMsg, Toaster.options)
      }
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
