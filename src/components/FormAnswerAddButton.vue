<template>
  <div>
    <v-btn fab bottom right color="pink" dark fixed @click.native.stop="$store.commit('answerDialog')">
      <v-icon>add</v-icon>
    </v-btn>
    <FormAnswer :saveNewAnswer="this.save" :species="this.species" ></FormAnswer>
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
    'save': {type: Function},
  },
  created: function () {
    console.log("hello")
  },
  data() {
    return {
    };
  },
}
</script>
