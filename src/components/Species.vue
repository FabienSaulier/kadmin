<template>
  <div>
    <v-card>
    <v-card-title>
      {{items.length}} réponses concernant le {{species}}
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
          <td class="text-xs-right">
            <div v-if="hasText('gb', props.item.text_gb)"  >
              <flag iso="gb"  />
              <span v-if="!hasText('gb', props.item.quickReplyLabel_gb)" >&nbsp;!</span>
            </div>
          </td>
          <td class="text-xs-right">
            <div v-if="hasText('es', props.item.text_es)"  >
              <flag iso="es"  />
              <span v-if="!hasText('es', props.item.quickReplyLabel_es)" >&nbsp;!</span>
            </div>
          </td>
          <td class="text-xs-right">
            <div v-if="hasText('nl', props.item.text_nl)"  >
              <flag iso="nl"  />
              <span v-if="!hasText('nl', props.item.quickReplyLabel_nl)" >&nbsp;!</span>
            </div>
          </td>
          <span v-if="props.item.quickReplyLabel_fr != undefined &&  props.item.quickReplyLabel_fr.length > 20">
            <v-tooltip top>
              <td class="text-xs-right"  slot="activator" style="color:red">{{ props.item.quickReplyLabel_fr }}</td>
              <span>Quick Reply Label is > 20 characters</span>
            </v-tooltip>
          </span>
          <span v-else>
            <td class="text-xs-right" >{{ props.item.quickReplyLabel_fr }}</td>
          </span>
          <td class="text-xs-right"><v-checkbox disabled v-model="props.item.precise"></v-checkbox></td>
          <td class="text-xs-right">{{ props.item.entities[0] }}</td>
          <td class="text-xs-right">{{ props.item.entities[1] }}</td>
          <td class="text-xs-right">{{ props.item.entities[2] }}</td>
          <td class="text-xs-right">{{ props.item.entities[3] }}</td>
          <td class="text-xs-right">{{ props.item.entities[4] }}</td>
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
                <v-flex xs12 style='margin-left: 15px; margin-top: -15px; font-size: 12px;'>
                  id: {{props.item._id}}
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 style='margin-left: 15px;font-size: 12px;'>
                  affichages: {{props.item.displayCount}}
                  <span v-if="props.item.displayButtonCount > 0">
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; affichages bouton: {{props.item.displayButtonCount}}
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; ratio click/affichage bouton: {{Math.round(props.item.displayCount/props.item.displayButtonCount*100)}}%
                  </span>
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
                  <v-subheader>Display Vet Button</v-subheader>
                </v-flex>
                <v-flex xs1>
                  <v-checkbox v-model="props.item.displayVetButton"></v-checkbox>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Quick reply label</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-text-field v-model="props.item.quickReplyLabel_fr"
                    :counter="20" :rules="[(v) => v.length <= 20 || 'Max 20 characters']">
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Quick reply label</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-tabs icons>
                    <v-tabs-bar>
                      <v-tabs-slider color="black"></v-tabs-slider>
                      <v-tabs-item v-for="lang in languages" :key="lang" :href="'#' + lang" >
                        <flag :iso="lang" />
                      </v-tabs-item>
                    </v-tabs-bar>
                    <v-tabs-items>
                      <v-tabs-content v-for="(lang, index) in languages" :key="lang" :id="lang">
                        <v-text-field v-model="props.item['quickReplyLabel_'+lang]"
                          :counter="20" :rules="[(v) => v.length <= 20 || 'Max 20 characters']">
                        ></v-text-field>
                      </v-tabs-content>
                    </v-tabs-items>
                  </v-tabs>
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
                  <v-tabs icons>
                    <v-tabs-bar>
                      <v-tabs-slider color="black"></v-tabs-slider>
                      <v-tabs-item v-for="lang in languages" :key="lang" :href="'#' + lang" >
                        <flag :iso="lang" />
                      </v-tabs-item>
                    </v-tabs-bar>
                    <v-tabs-items>
                      <v-tabs-content v-for="(lang, index) in languages" :key="lang" :id="lang">
                        <v-text-field multi-line rows=10 v-model="props.item['text_'+lang]"
                          placeholder="texte de la réponse" :counter="800" >
                        </v-text-field>
                      </v-tabs-content>
                    </v-tabs-items>
                  </v-tabs>
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
                  <draggable v-model="props.item.children">
                    <div class="lightBorder" v-for="child in props.item.children">
                      {{child.name}} - {{child.label}} - {{child.payload_data}}
                      <v-btn class="btn_no_margin" icon iconcolor="red" @click="delChild(props.item, child)"><v-icon standard>delete</v-icon></v-btn>
                    </div>
                  </draggable>
                  <v-layout row>
                    <v-flex xs8>
                      <v-select v-model="child" autocomplete @change="updateChildInput" placeholder="nom du fils" return-object
                        :items="items" item-text="name">
                      </v-select>
                      <v-text-field v-model="childLabel" placeholder="texte du bouton child" :counter="20"
                        :rules="[(v) => v.length <= 20 || 'Max 20 characters']">
                      </v-text-field>
                      <v-container grid-list-md text-xs-center>
                        <v-layout row wrap>
                          <v-flex >
                             <v-text-field v-model="payloadKey" label="Key" >
                             </v-text-field>
                           </v-flex>
                           <v-flex >
                             <v-text-field v-model="payloadValue" label="Value"  >
                             </v-text-field>
                           </v-flex>
                        </v-layout>
                      </v-container >
                    </v-flex>
                    <v-flex xs2>
                      <br /><br /><br /><br /><br /><br />
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
                  <draggable v-model="props.item.siblings">
                    <div class="lightBorder" v-for="sibling in props.item.siblings">
                      {{sibling.name}} - {{sibling.label}}
                      <v-btn class="btn_no_margin" icon iconcolor="red" @click="delSibling(props.item, sibling)"><v-icon standard>delete</v-icon></v-btn>
                    </div>
                  </draggable>
                  <v-layout row>
                    <v-flex xs8>
                      <v-select v-model="siblingName" @change="updateSiblingInput" placeholder="nom du sibling" return-object
                        :items="items" autocomplete item-text="name">
                      </v-select>
                      <v-text-field v-model="siblingLabel" placeholder="texte du bouton sibling" :counter="20"
                        :rules="[(v) => v.length <= 20 || 'Max 20 characters']">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs2>
                      <br /><br /><br /><br /><br />
                      <v-btn @click="addSibling(props.item)">Add</v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2>
                  <v-subheader>Expected behaviour</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-layout row>
                    <v-flex xs8>
                      <v-select :items="expectedBehaviour" placeholder="expected behaviour"
                        v-model="props.item.expectedBehaviour">
                      </v-select>
                      <v-select placeholder="next answer" :items="items"
                        v-model="props.item.nextAnswer" item-value="_id" item-text="name" >
                      </v-select>
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
import Vue from 'vue'
import axios from 'axios'
import * as Toaster from '../lib/toaster'
import FormAnswerAddButton from '../components/FormAnswerAddButton'
import answerMixin from '../mixins/answerMixin'
import draggable from 'vuedraggable'
import FlagIcon from 'vue-flag-icon'
Vue.use(FlagIcon)

export default {
  name: 'Species',
  components: {
    FormAnswerAddButton, draggable
  },
  mixins: [answerMixin],
  data() {
    return {
      items: [],
      species: this.$route.params.species,
      child: {},
      childLabel: '',
      payloadKey: undefined,
      payloadValue: undefined,
      siblingName: '',
      siblingLabel: '',
      tmp: '',
      search: '',
      languages: ['fr', 'gb', 'es', 'nl'],
      headers: [
        { text: 'Nom', align: 'left', sortable: true, value: 'name' },
        { text: 'gb', width:'20', sortable: true, value: 'text_gb' },
        { text: 'es', width:'20', sortable: true, value: 'text_es' },
        { text: 'nl', width:'20', sortable: true, value: 'text_nl' },
        { text: 'QR label FR', width:'20', sortable: true, value: 'quickReplyLabel_fr' },
        { text: 'precise', value: 'precise' },
        { text: 'entity 1', value: 'entities[0]' },
        { text: 'entity 2', value: 'entities[1]' },
        { text: 'entity 3', value: 'entities[2]' },
        { text: 'entity 4', value: 'entities[3]' },
        { text: 'entity 5', value: 'entities[4]' },
      ],
      expectedBehaviour: [
        '', 'saveUserAnimalName', 'saveUserAnimalWeight', 'saveUserAnimalInArmsWeight',
        'saveUserOwnerWeight', 'saveUserAnimalTargetWeight', 'saveUserAnimalProfilMorpho',
        'setQuestionSpecies', 'saveSelectedQRPayload',
      ]
    };
  },

  created() {
    this.load()
  },

  computed: {
    recastEntities() {
      return this.$store.state.entities[this.species]
    },
  },

  methods: {

    updateChildInput: function (e) {
      this.child = e
      this.childLabel = e.quickReplyLabel
    },
    updateSiblingInput: function (e) {
      this.siblingLabel = e.quickReplyLabel
      this.siblingName = e.name
    },
    clearChildForm: function () {
      this.child = {}
      this.childLabel = ''
      this.payloadKey = undefined
      this.payloadValue = undefined
      this.siblingName = ''
      this.siblingLabel = ''
    },
    load: function () {
      const url = process.env.API_URL+'/species/'+this.species;
      axios.get(url)
        .then((response) => {
          this.items = response.data;
        })
        .catch(function (error) {
          const errMsg = error.response.data.message
          this.$toasted.error(errMsg, Toaster.options)
        });
    },
    hasText: function (lang, text) {
      if(text !== undefined && text !== ''){
        return true
      }
      return false
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn_no_margin{
  margin: 0;
}
.lightBorder{
  border-color:grey;
  border-width:1px;
  border-style:dashed;
  width:500px;
}
</style>
