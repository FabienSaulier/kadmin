<template>
  <v-app>

    <v-navigation-drawer fixed clipped app v-model="drawer">
      <v-list dense>
        <v-list-group   no-action>
          <v-list-tile slot="item" @click="$router.push({ name: 'answersGeneral'});">
            <v-list-tile-content>
              <v-list-tile-title>
                Réponses générales
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <template v-for="(item, i) in items">
          <v-list-group  v-model="item.model" no-action>
            <v-list-tile slot="item" @click="redirectToSpecies(item.text)">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_down</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile v-for="subItem in item.children" v-bind:key="subItem.text" @click="">
             <v-list-tile-content>
               <v-list-tile-title slot="item" @click="pushRoute(subItem.routeParams)">
                 {{ subItem.text }}
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
        <router-link style="color:white" class="hidden-xs-only" to="/">Kanzi</router-link>
      </v-toolbar-title>
      <div class="d-flex align-center" style="margin-left: auto">

        <v-btn icon v-if="!authenticated" @click="login()" >
          Log In {{authenticated}}
        </v-btn>
        <v-btn icon v-if="authenticated" @click="logout()" >
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </div>
    </v-toolbar>

    <v-content class="vcontent">
      <v-container fluid fill-height>
        <v-layout>
          <router-view :auth="auth"
        :authenticated="authenticated"
        :key="$route.fullPath" /> <!-- // need :key to have unique route and force reload the component -->
        </v-layout>
      </v-container>
    </v-content>

  </v-app>
</template>
<script>

import axios from 'axios'
import * as Toaster from './lib/toaster'
import AuthService from './auth/AuthService'

const auth = new AuthService()

const { login, logout, authenticated, authNotifier } = auth

export default {

  data() {
    authNotifier.on('authChange', authState => {
      this.authenticated = authState.authenticated
    })
    auth.handleAuthentication()
    return{
      auth,
      authenticated,
      dialog: false,
      drawer: null,
      items: [
        {
          icon: 'keyboard_arrow_up',
          text: 'lapin',
          model: false,
          children: [
            { text: 'Gestion des Entities', routeParams: { name: 'entities', params: { species: 'lapin' }  } },
            { text: 'Tests', routeParams: { name: 'tests', params: { species: 'lapin' }  } },
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          text: 'chien',
          model: false,
          children: [
            { text: 'Gestion des Entities', routeParams: { name: 'entities', params: { species: 'chien' }  } },
            { text: 'Tests', routeParams: { name: 'tests', params: { species: 'chien' }  } },
          ]
        },
      ],
    }
  },

  created() {
    this.loadEntities()
  },

  methods: {
    login,
    logout,

    redirectToSpecies: function (species, intent) {
      console.log("auth app ",auth)
      this.$router.push({ name: 'species', params: { species: species } });
    },

    pushRoute: function(routeParams){
      this.$router.push(routeParams);
    },

    loadEntities: function () {
      this.items.forEach((item) => {
        const species = item.text
        const url = process.env.API_URL+'/nlp/entities/'+species
        axios.get(url)
          .then((response) => {
            this.$store.commit('setEntities', {species:species, data:response.data});
          })
          .catch((error) => {
            this.$toasted.error(error, Toaster.options)
          });
      })

    },
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
