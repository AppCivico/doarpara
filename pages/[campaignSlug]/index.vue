<!-- eslint-disable vue/no-v-html -->
<template>
  <article
    v-if="campaign?.description"
    class="tab-list__item"
    v-html="campaign.description"
  />
</template>

<script setup lang = "ts">
import { useCampaignStore } from '@/store/campaign.ts';

const campaignStore = useCampaignStore();
const { campaign } = storeToRefs(campaignStore);
</script>
