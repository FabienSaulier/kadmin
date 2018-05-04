<template>
  <div>
    <v-btn color="primary" @click="save">Sauvegarder</v-btn>
    <pre>
      Note: ['pronoun', 'person', 'number'] are automatically excluded
      Il y a {{items.length}} entities
    </pre>
    <v-card>
      <v-data-table
        v-bind:headers="headers"
        v-bind:items="items"
        item-key="name"
        hide-actions
        >
        <template slot="headers" slot-scope="props">
          <tr>
            <th v-for="header in props.headers" :key="header.text">
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" >
            <td>{{ props.item.name }}</td>
            <td><v-checkbox  v-model="props.item.areValuesPertinent"></v-checkbox></td>
            <td class="text-xs-right">{{ props.item.custom }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import * as Toaster from '../lib/toaster'
import axios from 'axios'

export default {
  name: 'Entities',
  components: {
  },

  data() {
    return {
      species: this.$route.params.species,
      pagination: {
        sortBy: 'name',
      },
      selected: [],
      headers: [
        {
          text: 'Entities from recast',
          align: 'left',
          value: 'name',
          sortable: true,
        },
        { text: 'Check Values', value: 'areValuesPertinent' },
        { text: 'Custom', value: 'custom' },
      ],
      items: [],
    };
  },

  created() {
    this.load()
  },

  computed: {

  },

  methods: {

    load: function () {

      const url = process.env.API_URL+'/entities/'+this.species;
      axios.get(url)
        .then((response) => {
          this.items = response.data
        })
        .catch(function (error) {
          const errMsg = error.response.data.message
          this.$toasted.error(errMsg, Toaster.options)
        });
    },

    save: function () {
      const url = process.env.API_URL+'/entities/';
      const cleanItems = JSON.parse(JSON.stringify(this.items));
      axios({ method: 'put', url: url, data: cleanItems })
        .then((response) => {
          this.$toasted.success('Sauvegarde effectuée', Toaster.options);
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
