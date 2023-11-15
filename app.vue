<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useCampaignStore } from '@/store/campaign.ts';
import { useDonateStore } from '@/store/donate.ts';

const appConfig = useAppConfig();
const route = useRoute();

const campaignStore = useCampaignStore();
const donateStore = useDonateStore();

const { campaign } = storeToRefs(campaignStore);
const { referral } = storeToRefs(donateStore);

function storeReferral() {
  const referralCode = route.query[appConfig.queryStringSpecialParameters.referrer];

  if (referralCode && campaign.value?.id) {
    referral.value[campaign.value.id as keyof typeof referral.value] = String(referralCode);
  }
}

await campaignStore.fetchCampaignAndRewards(String(route.params.campaignSlug));

if (process.client) {
  onMounted(() => {
    storeReferral();
  });
}
</script>
<style>
.page-slide-left-enter-active,
.page-slide-left-leave-active,
.page-slide-right-enter-active,
.page-slide-right-leave-active {
  transition: all 0.2s;
}

.page-slide-left-enter-from {
  opacity: 0;

  transform: translate(50px, 0);
}

.page-slide-left-leave-to {
  opacity: 0;

  transform: translate(-50px, 0);
}

.page-slide-right-enter-from {
  opacity: 0;

  transform: translate(-50px, 0);
}

.page-slide-right-leave-to {
  opacity: 0;

  transform: translate(50px, 0);
}
</style>
