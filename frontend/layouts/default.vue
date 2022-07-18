<script setup lang="ts">
onMounted(() => {
  console.log('Default layout');
});
</script>

<template lang="pug">
.layout.default-layout
  main.default-layout__main.default-layout__content
    router-view(v-slot='{ Component }')
      transition(name='fade', mode='out-in')
        component(:is='Component')
</template>

<style scoped lang="scss">
.default-layout {
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
