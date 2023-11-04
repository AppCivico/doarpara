<template>
  <div class="campaign-progress">
    <data class="campaign-progress__total" :value="campaign.total_amount">
      <output for="progress-bar" class="campaign-progress__total-value">
        {{ $n(campaign.total_amount / 100, 'currency', { maximumFractionDigits: 0 }) }}
      </output>
      {{ $t('totalAmount').toLowerCase() }}
    </data>

    <div
      v-if="donationSources.length > 1"
      id="progress-bar"
      class="campaign-progress__bar"
      role="progressbar"
      aria-valuemin="0"
      :aria-valuenow="campaign.total_amount"
      :aria-valuemax="currentGoal"
      :aria-label="$t('progressOfCampaign')"
    >
      <div
        v-for="(source, i) in donationSources"
        :key="i"
        :style="progressBarStyle(source)"
        :title="`${percentage(source.value)}% (${source.name})`"
      >
        {{ percentage(source.value) }}
      </div>
    </div>
    <progress
      v-else-if="campaign.total_amount"
      id="progress-bar"
      class="campaign-progress__bar"
      :value="campaign.total_amount / currentGoal * 100"
      max="100"
      :aria-label="$t('progressOfCampaign')"
    >
      {{ $n(campaign.total_amount / currentGoal, 'percent') }}
    </progress>

    <div class="campaign-progress__progress">
      <data value="campaign.total_amount / currentGoal" class="campaign-progress__progress-percentage">
        {{ $n(campaign.total_amount / currentGoal, 'percent') }}
      </data>
      {{ $t('of').toLowerCase() }}
      <data :value="currentGoal / 100" class="campaign-progress__progress-total">
        {{ $n(currentGoal / 100, 'currency', { maximumFractionDigits: 0 }) }}
      </data>
    </div>
    <div class="campaign-progress__donations">
      <data :value="campaign.total_donations" class="campaign-progress__donations-number">
        {{ $n(campaign.total_donations) }}
      </data>
      {{ $t('totalDonations').toLowerCase() }}
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Campaign, Goal, RaisedAndSource } from '@/doar-para.d.ts';

type SourceOnProgressBar = RaisedAndSource & {
  opacity: number;
};

const props = defineProps<{
  campaign: Campaign;
}>();

const currentGoal = computed(() => {
  const { goal_list: goals, total_amount: totalAmount } = props.campaign;

  return (goals.find((x: Goal) => x.amount > totalAmount) || goals[goals.length - 1])?.amount
    || totalAmount
    || 0;
});

const donationSources = computed(({ donation_sources } = props.campaign) => {
  let opacity = 0;
  return !Array.isArray(donation_sources)
    ? []
    : donation_sources
      .filter((x) => x.value !== undefined && x.name)
      .map((x: RaisedAndSource) => {
        const y = x as SourceOnProgressBar;
        y.opacity = opacity;
        opacity += 0.25;
        return y;
      });
});

function percentage(amount = props.campaign.total_amount, expected = currentGoal.value) {
  return Math.floor(
    ((typeof amount === 'string' ? parseFloat(amount) : amount) * 100) / Math.max(props.campaign.total_amount, expected),
  );
}

function progressBarStyle(source: SourceOnProgressBar) {
  return {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, ${source.opacity}), rgba(0, 0, 0, ${source.opacity}))`,
    width: `${percentage(source.value)}%`,
  };
}

</script>
<style lang="scss">
.campaign-progress {
  display: flex;

  flex-wrap: wrap;

  gap: 0 my.$gutter;

  justify-content: space-between;
}

.campaign-progress__total {
  display: block;

  width: 100%;
  overflow: hidden;

  font-size: my.ms-step(20px);
  line-height: 1;
  text-overflow: ellipsis;
}

.campaign-progress__total-currency,
.campaign-progress__total-value {
  font-size: my.ms-step(35px);
  font-weight: my.font-weight('bold');
}

.campaign-progress__bar {
  width: 100%;
  margin-top: my.$gutter * 0.5;
  margin-bottom: my.$gutter * 0.5;
}

.campaign-progress__total-currency {
}

.campaign-progress__total-value {
}

.campaign-progress__progress,
.campaign-progress__donations {
  flex-basis: calc(50% - my.$gutter);
  flex-grow: 1;

  min-width: min-content;
  max-width: max-content;
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.campaign-progress__progress {
}

.campaign-progress__progress-percentage,
.campaign-progress__progress-total {
  font-weight: my.font-weight('bold');
}

.campaign-progress__progress-percentage {
}

.campaign-progress__progress-total {
}

.campaign-progress__donations {
}

.campaign-progress__donations-number {
  font-weight: my.font-weight('bold');
}
</style>
