<template>
  <div class="campaign-progress">
    <data class="campaign-progress__total" :value="totalAmount">
      <output for="progress-bar" class="campaign-progress__total-value">
        <AnimatedNumber
          for="progress-bar"
          class="campaign-progress__total-value"
          :value="totalAmount / 100"
          :formatter="($v: number) => $n($v, 'currency', { maximumFractionDigits: 0 })"
        />
      </output>
      {{ $t('totalAmount').toLowerCase() }}
    </data>

    <template v-if="currentGoal">
      <div
        v-if="donationSources.length > 0"
        id="progress-bar"
        class="campaign-progress__bar"
        role="progressbar"
        aria-valuemin="0"
        :aria-valuenow="totalAmount"
        :aria-valuemax="currentGoal"
        :aria-label="$t('progressOfCampaign')"
      >
        <div
          v-for="(source, i) in donationSources"
          :key="i"
          :style="progressBarStyle(source)"
          :title="$t('totalAmountByDonationsPerSource', {
            percentage: $n(percentage(source.total_donated)),
            numberOfDonations: source.total_donations,
            source: source.name,
          })"
        >
          {{ percentage(source.total_donated) }}
        </div>
      </div>
      <progress
        v-else-if="totalAmount && currentGoal"
        id="progress-bar"
        class="campaign-progress__bar"
        :value="percentage()"
        max="100"
        :aria-label="$t('progressOfCampaign')"
      >
        {{ $n(totalAmount / currentGoal, 'percent') }}
      </progress>
    </template>

    <div
      v-if="currentGoal"
      class="campaign-progress__progress"
    >
      <data value="totalAmount / currentGoal" class="campaign-progress__progress-percentage">
        {{ $n(totalAmount / currentGoal, 'percent') }}
      </data>
      {{ $t('of').toLowerCase() }}
      <data :value="currentGoal / 100" class="campaign-progress__progress-total">
        {{ $n(currentGoal / 100, 'currency', { maximumFractionDigits: 0 }) }}
      </data>
    </div>
    <div class="campaign-progress__donations">
      <data :value="totalDonations" class="campaign-progress__donations-number">
        {{ $n(totalDonations) }}
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

const donationSources = computed(() => {
  const { platforms } = props.campaign;
  let opacity = 0;
  return !Array.isArray(platforms)
    ? []
    : platforms
      .filter((x) => x?.name && x.total_donated !== undefined)
      .map((x: RaisedAndSource) => {
        const y = x as SourceOnProgressBar;
        y.opacity = opacity;
        opacity += 0.25;
        return y;
      });
});

const totalAmount = computed(() => donationSources.value.reduce((acc, cur) => {
  // eslint-disable-next-line no-param-reassign
  acc += cur.total_donated;
  return acc;
}, 0));

const totalDonations = computed(() => donationSources.value.reduce((acc, cur) => {
  // eslint-disable-next-line no-param-reassign
  acc += cur.total_donations;
  return acc;
}, 0));

const currentGoal = computed(() => {
  const { goal_list: goals } = props.campaign;

  return (goals.find((x: Goal) => x.amount > totalAmount.value) || goals[goals.length - 1])?.amount
    || totalAmount.value
    || 0;
});

function percentage(amount = totalAmount.value, expected = currentGoal.value) {
  return Math.floor(
    (amount * 100) / Math.max(totalAmount.value, expected),
  );
}

function progressBarStyle(source: SourceOnProgressBar) {
  return {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, ${source.opacity}), rgba(0, 0, 0, ${source.opacity}))`,
    width: `${percentage(source.total_donated)}%`,
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
  margin-bottom: my.$gutter * 0.5;
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
