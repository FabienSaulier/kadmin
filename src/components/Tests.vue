


<template >
<div>


  <div>
    Tests {{currentTemplate}}
  </div>

  <component :is="currentTemplate"></component>



  <v-card>
    <v-card-title>
      tests
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
        v-bind:headers="headers"
        v-bind:items="items"
        v-bind:search="search"
      >
      <template slot="items" slot-scope="props">
        <td>
          <v-btn @click="editOrSave">edit/save</v-btn>
        </td>
        <td class="text-xs-right">edit/del</td>
        <td class="text-xs-right">{{ props.item.userInput }}</td>
        <td class="text-xs-right">{{ props.item.tags }}</td>
        <td class="text-xs-right">{{ props.item.answers_id }}</td>
        <td class="text-xs-right">
          <v-edit-dialog
            @open="tmp = props.item.iron"
            @save="props.item.iron = tmp || props.item.iron"
            large
            lazy
          >
            <div>{{ props.item.iron }}</div>
            <div slot="input" class="mt-3 title">Update Iron</div>
            <v-text-field
              slot="input"
              label="Edit"
              v-model="tmp"
              single-line
              counter
              autofocus
              :rules="[max25chars]"
            ></v-text-field>
          </v-edit-dialog>
        </td>
      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
  </v-card>
  </div>
</template>


<script>
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import Vue from 'Vue'
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
      currentTemplate: "viewTest",
      species: this.$route.params.species,
      toto: false,
      max25chars: (v) => v.length <= 25 || 'Input too long!',
      tmp: '',
      search: '',
      headers: [
        { text: 'actions', sortable: false },
        { text: 'input', align: 'left', sortable: false, value: 'name'},
        { text: 'Tags expected' },
        { text: 'Answers expected' },
      ],
      items: [
          {
            userInput: "super tomate",
            tags: ['tomate', 'ALIMENT_OK', 'BOCAL'],
            species: "lapin",
            answer_id: ["kazjhfbkdsjnf"],
          },
          {
            userInput: "tomate en bocal",
            tags: ['tomate', '', 'BOCAL'],
            species: "lapin",
            answer_id: ["jurhtegtdfsd", "fghjklgjhf"],
          },
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
    load: function () {

    },

    save: function () {

    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
