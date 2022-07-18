<script setup lang="ts">
const route = useRoute();

const state = reactive({
  id: Number(route.params.id) || -1,
});

onServerPrefetch(() => {});
useHead({
  title: `Профиль ${state.id}`,
});
</script>

<template lang="pug">
.profile
  h1.profile__id Страница профиля. id={{ state.id }}
  router-link(:to='{ name: "home" }') На главную
</template>

<style scoped lang="scss">
.profile {
}
</style>

<route lang="yml">
{ name: profile-id }
</route>
