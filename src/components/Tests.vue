<template>
  <div>
    Tests {{species}}
  </div>
</template>

<script>
import * as Toaster from '../lib/toaster'
import axios from 'axios'

export default {
  name: 'Tests',
  components: {
  },

  data() {
    return {
      species: this.$route.params.species,

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
