<script setup lang="ts">
useHead({
  title: 'Главная страница',
});
</script>

<template lang="pug">
.home
  .home__container
    h1 Привет :)
    HelloNust
</template>

<style scoped lang="scss">
.home {
}
</style>

<route lang="yml">
{ name: home, meta: { middlewares: [hello] } }
</route>
