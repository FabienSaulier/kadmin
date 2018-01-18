<template>
  <div>
    <v-card>
    <v-card-title>
      Réponses concernant le {{species}}
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
        item-key="_id"
        hide-actions
      >
      <template slot="items" slot-scope="props">
        <tr @click="props.expanded = !props.expanded" v-on:click="clearChildForm">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right"><v-checkbox disabled v-model="props.item.precise"></v-checkbox></td>
          <td class="text-xs-right">{{ props.item.entities[0] }}</td>
          <td class="text-xs-right">{{ props.item.entities[1] }}</td>
          <td class="text-xs-right">{{ props.item.entities[2] }}</td>
          <td class="text-xs-right">{{ props.item.entities[3] }}</td>
          <td class="text-xs-right">{{ props.item.entities[4] }}</td>
          <td class="text-xs-right">{{ props.item.entities[5] }}</td>
          <td class="text-xs-right">{{ props.item.entities[6] }}</td>
          <td class="text-xs-right">{{ props.item.entities[7] }}</td>
        </tr>
      </template>
      <template slot="expand" slot-scope="props">
        <v-card flat>
          <v-card-text>
            <v-container fluid>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Nom</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-text-field v-model="props.item.name"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Precise</v-subheader>
                </v-flex>
                <v-flex xs1>
                  <v-checkbox v-model="props.item.precise"></v-checkbox>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Quick reply label</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-text-field v-model="props.item.quickReplyLabel"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Description</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-text-field v-model="props.item.description"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Tags: entities, values...</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-select v-model="props.item.entities" chips tags :items="recastEntities"></v-select>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Text</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-text-field multi-line v-model="props.item.text"
                    placeholder="texte de la réponse" :counter="380" >
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Gif id</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-text-field v-model="props.item.gifId" placeholder="id du gif sur giphy"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Children</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <div v-for="child in props.item.children">
                    {{child.name}} - {{child.label}}
                    <v-btn small fat iconcolor="red" @click="delChild(props.item, child)"><v-icon standard>delete</v-icon></v-btn>
                  </div>
                  <v-layout row>
                    <v-flex xs8>
                      <v-select v-model="childName" @change="updateChildInput" placeholder="nom du fils" return-object
                        :items="answersNameAndLabel" item-text="name">
                      </v-select>
                      <v-text-field v-model="childLabel" placeholder="texte du bouton child"></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                      <br /><br /><br /><br /><br />
                      <v-btn @click="addChild(props.item)">Add</v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Siblings</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <div v-for="sibling in props.item.siblings">
                    {{sibling.name}} - {{sibling.label}}
                    <v-btn small fat iconcolor="red" @click="delSibling(props.item, sibling)"><v-icon standard>delete</v-icon></v-btn>
                  </div>
                  <v-layout row>
                    <v-flex xs8>
                      <v-select v-model="siblingName" @change="updateSiblingInput" placeholder="nom du sibling" return-object
                        :items="answersNameAndLabel" item-text="name">
                      </v-select>
                      <v-text-field v-model="siblingLabel" placeholder="texte du bouton sibling"></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                      <br /><br /><br /><br /><br />
                      <v-btn @click="addSibling(props.item)">Add</v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" flat @click="deleteAnswer(props.item._id, props.item.name)">Supprimer</v-btn>
            <v-btn flat color="green" @click='save(props.item)'>Sauvegarder</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-data-table>
  </v-card>
  <FormAnswerAddButton :saveNewAnswer="save" :species="this.species" ></FormAnswerAddButton>
  </div>
</template>

<script>
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import FormAnswerAddButton from '../components/FormAnswerAddButton'
import answerMixin from '../mixins/answerMixin'

export default {
  name: 'Species',
  components: {
    FormAnswerAddButton,
  },
  mixins: [answerMixin],
  data() {
    return {
      items: [],
      species: this.$route.params.species,
      answersNameAndLabel: [],
      childName: '',
      childLabel: '',
      siblingName: '',
      siblingLabel: '',
      tmp: '',
      search: '',
      headers: [
        { text: 'Nom', align: 'left', sortable: true, value: 'name' },
        { text: 'precise', value: 'precise' },
        { text: 'entity 1', value: 'entities[0]' },
        { text: 'entity 2', value: 'entities[1]' },
        { text: 'entity 3', value: 'entities[2]' },
        { text: 'entity 4', value: 'entities[3]' },
        { text: 'entity 5', value: 'entities[4]' },
        { text: 'entity 6', value: 'entities[5]' },
        { text: 'entity 7', value: 'entities[6]' },
        { text: 'entity 8', value: 'entities[7]' },
      ],
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
    updateChildInput: function (e) {
      this.childLabel = e.quickReplyLabel
      this.childName = e.name
    },
    updateSiblingInput: function (e) {
      this.siblingLabel = e.quickReplyLabel
      this.siblingName = e.name
    },
    clearChildForm: function () {
      this.childName = ''
      this.childLabel = ''
      this.siblingName = ''
      this.siblingLabel = ''
    },
    load: function () {
      const url = process.env.API_URL+'/species/'+this.species;
      axios.get(url)
        .then((response) => {
          this.items = response.data;
          this.answersNameAndLabel = this.items.map(a => ({ name: a.name, quickReplyLabel: a.quickReplyLabel }))
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
