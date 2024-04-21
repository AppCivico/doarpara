<template>
  <div class="page-wrapper">
    <!-- `.page-wrapper` required by NUXT page transitions -->
    <pre v-if="error">{{ error }}</pre>
    <template v-else>
      <NuxtPage />
    </template>
  </div>
</template>
<script setup lang="ts">
import { useCampaignStore } from '@/store/campaign.ts';

const appConfig = useAppConfig();

const campaignStore = useCampaignStore();
const { campaign, error } = storeToRefs(campaignStore);

if (campaign.value) {
  const meta = {
    link: () => (campaign.value?.contact_methods
      ? Object.values(campaign.value?.contact_methods)
        .filter((x) => !!x)
        .map((x) => ({
          rel: 'me',
          href: x,
        }))
      : []),
    htmlAttrs: {
      class: () => `theme--${campaign.value?.theme || 'default'}`,
    },
  };

  useHead(meta);

  if (import.meta.dev || import.meta.server) {
    useSeoMeta({
      title: () => (campaign.value?.name
        ? `${campaign.value?.name} • ${appConfig.title}`
        : `${appConfig.title}`),
      ogTitle: () => campaign.value?.name,
      ogImage: () => (typeof campaign.value?.sharing_image === 'object'
        ? {
          url: campaign.value?.sharing_image?.url,
          width: campaign.value?.sharing_image?.width,
          height: campaign.value?.sharing_image?.height,
        }
        : campaign.value?.sharing_image
        || null),
      description: () => campaign.value?.preamble,
      ogDescription: () => campaign.value?.preamble,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterSite: extractTwitterHandle(campaign.value?.contact_methods?.twitter),
    });
  }
}
</script>
