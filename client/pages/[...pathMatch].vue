<script setup lang="ts">
useHead({
  title: '404',
});
</script>

<template lang="pug">
.not-found
  .not-found__row.container-px
    h1.not-found__title 404
    h2.not-found__subtitle Такая страница не найдена :(
    router-link.not-found__link(:to='{ name: "home" }') На главную
</template>

<style lang="scss" scoped>
.not-found {
}
</style>

<route lang="yml">
{ name: '404', meta: { layout: error } }
</route>
