<template>
  <div class="page-wrapper">
    <!-- required by NUXT page transitions -->
    <pre v-if="error">{{ error }}</pre>
    <template v-else>
      <NuxtPage />
    </template>
  </div>
</template>
<script setup lang="ts">
import { useCampaignStore } from '@/store/campaign.ts';

const appConfig = useAppConfig();
const route = useRoute();

const campaignStore = useCampaignStore();
const {
  campaign, campaignSections, error,
} = storeToRefs(campaignStore);

await campaignStore.fetchCampaignAndRewards(String(route.params.campaignSlug));

if (campaign.value) {
  const meta = {
    link: Object.values(campaign.value?.contact_methods)
      .filter((x) => !!x)
      .map((x) => ({
        rel: 'me',
        href: x,
      })),
    htmlAttrs: {
      class: `theme--${campaign.value.theme || 'default'}`,
    },
  };

  useHead(meta);

  if (process.dev || process.server) {
    useSeoMeta({
      title: campaign.value?.name
        ? `${campaign.value?.name} • ${appConfig.title}`
        : `${appConfig.title}`,
      description: campaign.value?.preamble,
      ogImage: typeof campaign.value?.sharingImage === 'object'
        ? {
          url: campaign.value?.sharingImage?.url,
          width: campaign.value?.sharingImage?.width,
          height: campaign.value?.sharingImage?.height,
        }
        : campaign.value?.sharingImage
        || null,
    });
  }
}
</script>
