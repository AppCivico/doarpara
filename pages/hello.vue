<template>
  <div>
    <h1>Hello, world!</h1>
    <p>Request time: {{ requestTime }}</p>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'minimal',
});

const requestTime = new Date().toISOString();
</script>
