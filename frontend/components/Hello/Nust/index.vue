<script setup lang="ts">
const state = reactive({
  text: 'Добро пожаловать в Nust',
});
</script>

<template lang="pug">
.hello
  h2.hello__text {{ state.text }}
  router-link(:to='{ name: "profile-id", params: { id: 123 } }') Перейти на страницу профиля
</template>

<style scoped lang="scss">
.hello {
}
</style>
