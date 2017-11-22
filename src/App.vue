<template>
  <v-app id="inspire">
    <v-navigation-drawer fixed clipped app v-model="drawer">
      <v-list dense>
        <template v-for="(item, i) in items">
          <v-layout row v-if="item.heading" align-center :key="i">
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group v-else-if="item.children" v-model="item.model" no-action>
            <v-list-tile slot="item" @click="">
              <v-list-tile-action>
                <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(child, i) in item.children" :key="i" @click="">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else @click="">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="blue darken-3" dark app clipped-left fixed>
      <v-toolbar-title :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <img src="/static/logo_transp.png" style="float:left;"  />
        <span class="hidden-xs-only">Kanzi</span>
      </v-toolbar-title>
      <!--
      <v-text-field light solo prepend-icon="search" placeholder="Search" style="max-width: 500px; min-width: 128px">
      </v-text-field>
      -->
      <div class="d-flex align-center" style="margin-left: auto">
        <v-btn icon >
          <v-icon>file_upload</v-icon>
        </v-btn>
      </div>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-tooltip right>
            <v-btn icon large :href="source" target="_blank" slot="activator">
              <v-icon large>code</v-icon>
            </v-btn>
            <span>Contenu</span>
          </v-tooltip>
        </v-layout>
      </v-container>
    </v-content>
    <v-btn fab bottom right color="pink" dark fixed @click.stop="dialog = !dialog">
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Nouvelle réponse
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
                <v-text-field label="Label" placeholder="Nom (affiché) de la réponse"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Intent" placeholder="intent" >
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Entities" placeholder="Séparées par un ;">
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Text" placeholder="texte de la réponse" :counter="380" >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      drawer: null,
      items: [
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Lapins',
          model: false,
          children: [
            { icon: 'restaurant', text: 'Alimentation' },
            { icon: 'mood', text: 'Comportement' },
            { icon: 'store', text: 'Habitat' },
            { icon: 'local_hospital', text: 'Prévention' },
            { icon: 'weekend', text: 'Reproduction' },
            { icon: 'local_pharmacy', text: 'Santé' },
          ],
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Chiens',
          model: false,
          children: [
            { icon: 'restaurant', text: 'Alimentation' },
            { icon: 'mood', text: 'Comportement' },
            { icon: 'store', text: 'Habitat' },
            { icon: 'local_hospital', text: 'Prévention' },
            { icon: 'weekend', text: 'Reproduction' },
            { icon: 'local_pharmacy', text: 'Santé' },
          ],
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Chats',
          model: false,
          children: [
            { icon: 'restaurant', text: 'Alimentation' },
            { icon: 'mood', text: 'Comportement' },
            { icon: 'store', text: 'Habitat' },
            { icon: 'local_hospital', text: 'Prévention' },
            { icon: 'weekend', text: 'Reproduction' },
            { icon: 'local_pharmacy', text: 'Santé' },
          ],
        },
      ],
    }),
    props: {
      source: String,
    },
  };
</script>
