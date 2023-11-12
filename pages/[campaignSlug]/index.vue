<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="text-body__tabs-and-rewards" role="tabpanel">
    <section
      aria-live="polite"
      role="region"
      class="tab-list text-body__tab-list"
    >
      <article
        v-if="campaign?.description"
        class="tab-list__item"
        v-html="campaign.description"
      />

      <footer v-if="hasFaq" class="text-body__call-to-faq">
        <i18n-t keypath="callToFAQ.message" tag="p">
          <a href="#faq">{{ $t('callToFAQ.textLink') }}</a>
        </i18n-t>
      </footer>
    </section>

    <section v-if="rewards.length" class="rewards text-body__rewards">
      <h2>{{ $t('rewards') }}</h2>
      <p>
        {{ $t('rewardsIntro') }}
      </p>
      <rewardsList :rewards="rewards" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from '@/store/campaign.ts';

const campaignStore = useCampaignStore();
const { campaign, campaignSections, rewards } = storeToRefs(campaignStore);

const hasFaq = computed(() => campaignSections.value.indexOf('faq') > -1);
</script>
