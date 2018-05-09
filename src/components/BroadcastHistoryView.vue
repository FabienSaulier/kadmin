<template>
  <div>
      <v-card-title>
        Historique des Broadcasts
      </v-card-title>
  </div>
</template>

<script>
import * as Toaster from '../lib/toaster'
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'BroadcastHistoryView',
  components: {
  },

  data() {
    return {

    }
  },

  created() {
    this.load()
  },

  computed: {
  },

  methods: {
    load: async function () {
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
