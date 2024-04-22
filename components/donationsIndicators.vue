<template>
  <dl class="donation-indicators">
    <div class="donation-indicators__item">
      <dt class="donation-indicators__title">
        {{ $n(totalDonations.total) }}
      </dt>
      <dd class="donation-indicators__description">
        {{ $t('indicators.donorsToCampaign', { campaignName: campaign?.name }) }}
      </dd>
    </div>

    <div
      v-if="totalDonations.newDonorsPercent"
      class="donation-indicators__item"
    >
      <dt class="donation-indicators__title">
        {{ $n(totalDonations.newDonorsPercent) }}%
      </dt>
      <dd class="donation-indicators__description">
        {{ $t('indicators.newDonors.title') }}
      </dd>
      <dd class="donation-indicators__description">
        {{ $t('indicators.newDonors.description') }}
      </dd>
    </div>
    <div
      v-if="totalDonations.recurringPercent"
      class="donation-indicators__item"
    >
      <dt class="donation-indicators__title">
        {{ $n(totalDonations.recurringPercent) }}%
      </dt>
      <dd class="donation-indicators__description">
        {{ $t('indicators.oldDonors.title') }}
      </dd>
      <dd class="donation-indicators__description">
        {{ $t('indicators.oldDonors.description') }}
      </dd>
    </div>
  </dl>
</template>
<script setup lang="ts">
import type { Campaign } from '@/doar-para.d.ts';

const props = defineProps<{
  campaign: Campaign;
}>();

const totalDonations = computed(() => consolidateTotals(props.campaign?.platforms));
</script>
<style lang="scss">
.donation-indicators {
  display: flex;

  flex-wrap: wrap;

  gap: my.$gutter;

  @media screen and (min-width: my.breakpoint('toggle-sidebar-position')) {
    gap: my.$gutter * 2;
  }

  @media screen and (min-width: my.breakpoint('desktop')) {
    gap: my.$gutter * 3;
  }
}

.donation-indicators__item {
  flex-basis: 10em;
  flex-grow: 1;

  &:first-child {
    flex-basis: 100%;

    text-align: center;
  }
}

.donation-indicators__title {
  font-size: my.ms-step(48px);
  font-weight: inherit;

  :first-child > * {
    font-size: my.ms-step(61px);
  }
}

.donation-indicators__description {
  .donation-indicators__title + & {
    margin-bottom: 0;

    font-weight: my.font-weight('bold');
  }
}
</style>
