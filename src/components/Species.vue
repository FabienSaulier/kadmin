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
        item-key="name"
        hide-actions
      >
      <template slot="items" slot-scope="props">
        <tr @click="props.expanded = !props.expanded">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.entities[0] }}</td>
          <td class="text-xs-right">{{ props.item.entities[1] }}</td>
          <td class="text-xs-right">{{ props.item.entities[2] }}</td>
          <td class="text-xs-right">{{ props.item.entities[3] }}</td>
          <td class="text-xs-right">{{ props.item.entValues }}</td>
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
                  <v-text-field disabled v-model="props.item.name"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>_id</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-text-field disabled v-model="props.item._id"></v-text-field>
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
                  <v-subheader>Entities</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-select v-model="props.item.entities" chips tags :items="recastEntities"></v-select>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Ent Values</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-select v-model="props.item.entValues" chips tags></v-select>
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
                  <v-subheader>Children</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <div v-for="child in props.item.children">
                    {{child.name}} - {{child.label}}
                    <v-btn small fat iconcolor="red" @click="delChild(props.item, child)"><v-icon standard>delete</v-icon></v-btn>
                  </div>
                  <v-layout row>
                    <v-flex xs8>
                      <v-select v-model="childName"  placeholder="nom du fils"  :items="answersName"></v-select>
                      <v-text-field v-model="childLabel" placeholder="texte du bouton"></v-text-field>
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
  <v-btn fab bottom right color="pink" dark fixed @click.native.stop="$store.commit('answerDialog')">
    <v-icon>add</v-icon>
  </v-btn>
  <FormAnswer v-bind:dialogOpen="dialog" :saveNewAnswer="this.save" :species="this.species" ></FormAnswer>

  </div>
</template>

<script>
import  * as Kanzapi from '../lib/kanzapi'
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import FormAnswer from '../components/FormAnswer'


export default {
  name: 'Species',
  components: {
    FormAnswer,
  },

  data() {
    return {
      species: this.$route.params.species,
      dialog: false,
      answersName: [],
      childName: "",
      childLabel: "",
      tmp: '',
      search: '',
      headers: [
        {
          text: 'Nom',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'entity 1', value: 'entities[0]' },
        { text: 'entity 2', value: 'entities[1]' },
        { text: 'entity 3', value: 'entities[2]' },
        { text: 'entity 4', value: 'entities[3]' },
        { text: 'entities values', value: 'entValues' },
      ],
      items: []
    };
  },

  created(){
    this.load()
  },

  computed: {
    recastEntities () {
      return this.$store.state.entities
    }
  },

  methods: {
    load: function () {
      const url = process.env.API_URL+"/species/"+this.species;
      axios.get(url)
        .then((response) => {
          console.log(response);
          this.items = response.data;
          this.answersName = this.items.map(a => a.name)
        })
        .catch(function (error) {
          const errMsg = error.response.data.message
          this.$toasted.error(errMsg, Toaster.options)
        });
    },

    save: function (answer) {
      const cleanAnswer = JSON.parse(JSON.stringify(answer));
      console.log(cleanAnswer);
      axios({method:'put', url:process.env.API_URL+'/answer/', data:cleanAnswer})
        .then((response) => {
          console.log(response);
          this.$toasted.success(cleanAnswer.name+' enregistré', Toaster.options);
          this.load();
        })
        .catch((error) => {
          const errMsg = error.response.data.message
          this.$toasted.error(errMsg, Toaster.options)
        })
    },

    deleteAnswer: function(id, name){
      if(!window.confirm("Voulez vous supprimer "+name)) return;
      const url = process.env.API_URL+"/answer/"+id;
      axios.delete(url)
        .then((response) => {
          this.$toasted.success('Réponse supprimée', Toaster.options);
          this.load();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    addChild: function(answer){
      // find child ID
      const child = this.items.filter(a => a.name == this.childName)
      const childLink = {_id:child[0]._id, name: this.childName, label: this.childLabel}
      answer.children.push(childLink)
      this.childName = ""
      this.childLabel = ""
    },

    delChild: function(answer, child){
      answer.children = answer.children.filter(c => c.name != child.name)
    },

  },


};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
