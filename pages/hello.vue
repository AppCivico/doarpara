<template>
  <div>
    <h1>Hello, world!</h1>
    <p>Server request time: {{ serverTime }}</p>
    <p>Client hydration time: {{ clientTime || 'Not hydrated yet...' }}</p>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'minimal',
});

const serverTime = useState('serverTime', () => new Date().toISOString());
const clientTime = ref<string | null>(null);

if (import.meta.client) {
  onMounted(() => {
    clientTime.value = new Date().toISOString();
  });
}
</script>
