  <template>
  <div>
    <v-btn fab bottom right color="pink" dark :fixed="fixed ? true: false" @click="showModal = true">
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="showModal" width="800px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Nouvelle réponse:    {{species}} {{intent}}
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
              <v-text-field label="Nom" v-model="answer.name" placeholder="Nom (affiché) de la réponse"></v-text-field>
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <v-checkbox label="Precise: la réponse ne ressort que si tous ses tags sont dans la question" v-model="answer.precise" placeholder="La réponse est précise"></v-checkbox>
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <v-checkbox label="Véto: affiche le bouton véto" v-model="answer.displayVetButton" placeholder="Affiche le bouton véto"></v-checkbox>
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <v-text-field label="QuickReply label" v-model="answer.quickReplyLabel" placeholder="Label de la réponse en quick reply"></v-text-field>
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <v-text-field label="Description" v-model="answer.description" placeholder="Description - utilisé en interne"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-select label="Tags: entities, values..." v-model="answer.entities" chips tags :items="recastEntities"></v-select>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Text" v-model="answer.text_fr" multi-line placeholder="texte de la réponse" :counter="380" >
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Gif id" v-model="answer.gifId" placeholder="id du gif sur giphy"></v-text-field>
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary"  @click.native.stop="showModal = false">Cancel</v-btn>
          <v-btn flat  @click="save(answer)" @click.native.stop="showModal = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>

export default {
  name: 'FormAnswerAddButton',
  components: {
  },
  props: {
    species: { type: String },
    intent: { type: String },
    fixed: { type: Boolean, default: true },
    saveNewAnswer: { type: Function },
  },
  methods: {
    save: function (answer) {
      this.saveNewAnswer(answer)
      this.answer = {}
      this.answer.species = this.species
      this.answer.intent = this.intent
    },
  },
  created: function () {
    this.answer.species = this.species
    this.answer.intent = this.intent
  },
  data() {
    return {
      answer: {},
      showModal: false,
    };
  },
  computed: {
    recastEntities() {
      return this.$store.state.entities[this.species]
    },
  },
}
</script>
