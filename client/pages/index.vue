<script setup lang="ts">
useHead({
  title: 'Главная страница',
});
</script>

<template lang="pug">
.home
  .home__container
    .container-px
      h1 Привет :)
      button.btn Стилизовано классом
      button.btn-2 Стилизовано @apply
      HelloNust
    Slider
</template>

<style scoped lang="scss">
.home {
  .btn-2 {
    @apply btn;
  }
}
</style>

<route lang="yml">
{ name: home, meta: { middlewares: [hello] } }
</route>
