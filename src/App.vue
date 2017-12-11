<template>
  <v-app id="inspire">

    <v-navigation-drawer fixed clipped app v-model="drawer">
      <v-list dense>
        <template v-for="(item, i) in items">
          <v-list-group  v-model="item.model" no-action>
            <v-list-tile slot="item" @click="clickSpecies(item.text)">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="blue darken-3" dark app clipped-left fixed>
      <v-toolbar-title :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <img src="/static/logo_transp.png" style="float:left;"  />
        <router-link class="hidden-xs-only" to="/">Kanzi</router-link>
      </v-toolbar-title>
      <div class="d-flex align-center" style="margin-left: auto">
        <v-btn icon >
          <v-icon>file_upload</v-icon>
        </v-btn>
      </div>
    </v-toolbar>

    <v-content class="vcontent">
      <v-container fluid fill-height>
        <v-layout>
          <router-view :key="$route.fullPath" /> <!-- // need :key to have unique route and force reload the component -->
        </v-layout>
      </v-container>
    </v-content>

  </v-app>
</template>
<script>

import FormAnswer from './components/FormAnswer'
import axios from 'axios'
import * as Toaster from './lib/toaster'

export default {
  components: {
    FormAnswer,
  },
  watch: {
  },
  created(){
    this.loadEntities();
  },

  methods: {
    clickSpecies: function(species, intent){
      this.$router.push({ name: 'species', params: { species: species}});
    },


    loadEntities: function(){
      const url = process.env.API_URL+"/nlp/entities"
      axios.get(url)
        .then((response) => {
          this.$store.commit('setEntities', response.data);
        })
        .catch((error) => {
          this.$toasted.error(error, Toaster.options)
        });
    }
  },

  data: () => ({
    dialog: false,
    drawer: null,
    items: [
      {
        icon: 'keyboard_arrow_up',
        text: 'lapin',
        model: false,
      },
      {
        icon: 'keyboard_arrow_up',
        text: 'chien',
        model: false,
      },
      {
        icon: 'keyboard_arrow_up',
        text: 'chat',
        model: false,
      },
    ],
  }),
  props: {
    source: String,
  },
};
</script>

<style>
.vcontent{
  padding:10px;
}

.theme--dark a{
  text-decoration:none;
  color:white;
}
</style>
