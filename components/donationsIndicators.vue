<template>
  <dl class="donation-indicators">
    <div class="donation-indicators__item">
      <dt class="donation-indicators__title">
        {{ $n(consolidatedTotals.totalDonors) }}
      </dt>
      <dd class="donation-indicators__description">
        {{ $t('indicators.donorsToCampaign', {
          campaignName,
          donations: consolidatedTotals.totalDonations,
        }) }}
      </dd>
    </div>

    <div
      v-if="consolidatedTotals.newDonorsPercent && consolidatedTotals.newDonorsPercent < 100"
      class="donation-indicators__item"
    >
      <dt class="donation-indicators__title">
        {{ $n(consolidatedTotals.newDonorsPercent) }}%
      </dt>
      <dd class="donation-indicators__description">
        {{ $t('indicators.newDonors.title') }}
      </dd>
      <dd class="donation-indicators__description">
        {{ $t('indicators.newDonors.description') }}
      </dd>
    </div>
    <div
      v-if="consolidatedTotals.recurringPercent && consolidatedTotals.recurringPercent < 100"
      class="donation-indicators__item"
    >
      <dt class="donation-indicators__title">
        {{ $n(consolidatedTotals.recurringPercent) }}%
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
import type { ConsolidatedTotal } from '@/utils/consolidateTotals.ts';

defineProps<{
  campaignName: string;
  consolidatedTotals: ConsolidatedTotal;
}>();
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
