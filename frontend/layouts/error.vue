<script setup lang="ts">
onMounted(() => {
  console.error('error layout');
});
</script>

<template lang="pug">
.layout.error-layout
  main
    router-view(v-slot='{ Component }')
      component(:is='Component')
</template>

<style scoped lang="scss">
.error-layout {
}
</style>
