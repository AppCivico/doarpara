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

let pollingInterval: ReturnType<typeof setInterval> | null = null;

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

const isPreviewMode = route.query.previewing !== undefined;
let fetchParams = {};

if (isPreviewMode && import.meta.client) {
  campaignStore.setupPreviewUpdateListener();

  // Notify parent window that we're waiting for preview token
  const allowedOrigin = runtimeConfig.public.controlPanelOrigin;
  if (allowedOrigin && window.parent) {
    window.parent.postMessage({
      type: 'WAITING_FOR_PREVIEW_TOKEN',
    }, allowedOrigin);
  }

  // Wait for first PROVIDE_PREVIEW_TOKEN message before fetching
  const previewToken = await campaignStore.getPreviewToken();
  if (previewToken) {
    fetchParams = { live_preview_token: previewToken };
  }
}

await useAsyncData('campaign', async () => campaignStore.fetchCampaignAndRewards(String(route.params.campaignSlug), fetchParams).then(() => true));

if (isPreviewMode && import.meta.client) {
  // Notify parent window about the result
  const allowedOrigin = runtimeConfig.public.controlPanelOrigin;
  if (allowedOrigin && window.parent) {
    if (error.value) {
      window.parent.postMessage({
        type: 'PREVIEW_ERROR',
        error: {
          message: (error.value as any).message || 'Unknown error',
          statusCode: (error.value as any).statusCode,
        },
      }, allowedOrigin);
    } else {
      window.parent.postMessage({
        type: 'PREVIEW_READY',
      }, allowedOrigin);
    }
  }
}

if (error.value) {
  throw createError(error.value);
}

if (import.meta.client && !isPreviewMode) {
  onMounted(() => {
    if (campaign.value && runtimeConfig.public.campaignPoolingInterval) {
      pollingInterval = setInterval(() => {
        if (document.visibilityState === 'visible' || document.hidden === false) {
          campaignStore.fetchCampaignAndRewards(String(route.params.campaignSlug));
        }
      }, runtimeConfig.public.campaignPoolingInterval);
    }

    storeReferral();
  });

  onBeforeUnmount(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
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
    script: [] as Array<Record<string, any>>,
    noscript: [] as Array<Record<string, any>>,
  };

  if (campaign.value.facebook_pixel) {
    meta.script.push({
      textContent: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${campaign.value.facebook_pixel}');
fbq('track', 'PageView');`,
    });
    meta.noscript.push({
      textContent: `<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${campaign.value.facebook_pixel}&ev=PageView&noscript=1"/>`,
    });
  }

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
