<template>
  <div>
    page généraliste du {{species}}
  </div>
</template>

<script>
export default {
  name: 'Species',
  data() {
    return {
      species: this.$route.params.species,

    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
