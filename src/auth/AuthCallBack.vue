<template>
</template>

<script>

import { setIdToken, setAccessToken } from './AuthServ';

export default {
  name: '',
  mounted() {
    alert("auth call back compo")
    this.$nextTick(() => {
      setAccessToken();
      setIdToken();
      window.location.href = '/';
    });
  },
};
</script>
