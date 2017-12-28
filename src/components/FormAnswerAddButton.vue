<template>
  <div>
    <v-btn fab bottom right color="pink" dark :fixed="fixed ? true: false" @click.native.stop="$store.commit('answerDialog')">
      <v-icon>add</v-icon>
    </v-btn>
    <FormAnswer :saveNewAnswer="this.save" :intent="this.intent" :species="this.species" ></FormAnswer>
  </div>
</template>

<script>
import FormAnswer from '../components/FormAnswer'

export default {
  name: 'FormAnswerAddButton',
  components: {
    FormAnswer,
  },
  props: {
    'species': {type: String},
    'intent': {type: String},
    'fixed': {type: Boolean, default: true},
    'save': {type: Function},
  },
  created: function () {
    console.log(this.fixed)
  },
  data() {
    return {
    };
  },
}
</script>
