<template>
  <div>
    <h1>Campaign Test</h1>
    <p>Server request time: {{ serverTime }}</p>
    <p>Client hydration time: {{ clientTime || 'Not hydrated yet...' }}</p>

    <h2>Campaign Data:</h2>
    <pre>{{ campaign }}</pre>
  </div>
</template>
<script setup lang="ts">
import { useCampaignStore } from '@/store/campaign.ts';

definePageMeta({
  layout: 'minimal',
});

const route = useRoute();
const campaignStore = useCampaignStore();
const { campaign } = storeToRefs(campaignStore);

const serverTime = useState('testCampaignServerTime', () => new Date().toISOString());
const clientTime = ref<string | null>(null);

// Fetch campaign using slug from query parameter (e.g., ?slug=renato_cron)
const slug = String(route.query.slug || 'renato_cron');
await campaignStore.fetchCampaignAndRewards(slug);

if (import.meta.client) {
  onMounted(() => {
    clientTime.value = new Date().toISOString();
  });
}
</script>
<style scoped>
pre {
  background: #f5f5f5;
  color: #333;
  padding: 1rem;
  overflow: auto;
  max-height: 600px;
  font-size: 12px;
}
</style>
