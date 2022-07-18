<script setup lang="ts">
onMounted(() => {
  console.log('404 layout');
});
</script>

<template lang="pug">
.error-layout.layout
  main
    router-view(v-slot='{ Component }')
      component(:is='Component')
</template>

<style scoped lang="scss">
.error-layout {
  @apply bg-primary;
}
</style>
