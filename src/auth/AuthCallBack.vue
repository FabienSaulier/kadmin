<template>
</template>

<script>

import { setIdToken, setAccessToken } from './AuthServ';

export default {
  name: '',
  mounted() {
    this.$nextTick(() => {
      setAccessToken();
      setIdToken();
      window.location.href = '/';
    });
  },
};
</script>
