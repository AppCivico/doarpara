<template>
  <dl class="donation-indicators">
    <div class="donation-indicators__item">
      <dt class="donation-indicators__title">
        {{ $n(1633) }}
      </dt>
      <dd class="donation-indicators__description">
        {{ $t('indicators.donorsToCampaign', { campaignName: campaign?.name }) }}
      </dd>
    </div>

    <div class="donation-indicators__item">
      <dt class="donation-indicators__title">
        {{ $n(0.69, 'percent') }}
      </dt>
      <dd class="donation-indicators__description">
        {{ $t('indicators.newDonors.title') }}
      </dd>
      <dd class="donation-indicators__description">
        {{ $t('indicators.newDonors.description') }}
      </dd>
    </div>
    <div class="donation-indicators__item">
      <dt class="donation-indicators__title">
        {{ $n(0.31, 'percent') }}
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

defineProps<{
  campaign: Campaign;
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
  text-align: center;

  :first-child > * {
    font-size: my.ms-step(61px);
  }
}

.donation-indicators__description {
  .donation-indicators__title + & {
    font-weight: my.font-weight('bold');
  }
}
</style>
