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
import { useDonateStore } from '@/store/donate.ts';

let poolingInterval: ReturnType<typeof setInterval> | null = null;

const runtimeConfig = useRuntimeConfig();
const route = useRoute();

const campaignStore = useCampaignStore();
const donateStore = useDonateStore();
const { campaign, error } = storeToRefs(campaignStore);
const { referral } = storeToRefs(donateStore);

const { initialize } = useGtag();

function storeReferral() {
  const referralCode = route.query[runtimeConfig.public.queryStringSpecialParameters.referrer];

  if (referralCode && campaign.value?.id) {
    referral.value[campaign.value.id as keyof typeof referral.value] = String(referralCode);
  }
}

// Maybe the campaign is already loaded on `layouts/default.vue`
if (!campaign.value) {
  await useAsyncData('campaign', async () => campaignStore.fetchCampaignAndRewards(String(route.params.campaignSlug)).then(() => true));
}

if (import.meta.client) {
  onMounted(() => {
    if (runtimeConfig.public.campaignPoolingInterval) {
      poolingInterval = setInterval(() => {
        campaignStore.fetchCampaignAndRewards(String(route.params.campaignSlug));
      }, runtimeConfig.public.campaignPoolingInterval);
    }

    storeReferral();
  });

  onBeforeUnmount(() => {
    if (poolingInterval) {
      clearInterval(poolingInterval);
    }
  });
}

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
      class: () => normalizeThemeName(campaign.value?.theme),
    },
  };

  useHead(meta);

  useSeoMeta({
    title: () => (campaign.value?.name
      ? `${campaign.value?.name} • ${runtimeConfig.public.title}`
      : `${runtimeConfig.public.title}`),
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

  if (!import.meta.dev && import.meta.client) {
    if (campaign.value.google_analytics) {
      initialize(campaign.value.google_analytics);
    }
  }
}
</script>
