<template>
  <div>
    page de l'intent {{species}} - {{intent}}
  </div>
</template>

<script>
export default {
  name: 'Intent',

  created(){
    console.log("load data ", this.species, this.intent);
  },
  data() {
    return {
      species: this.$route.params.species,
      intent: this.$route.params.intent,
    };
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
