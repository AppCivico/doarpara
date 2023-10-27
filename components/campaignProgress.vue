<template>
  <div class="campaign-progress">
    <data class="campaign-progress__total" value="11650">
      <output for="progress-bar" class="campaign-progress__total-value">
        {{ $n(totalAmount / 100, 'currency', { maximumFractionDigits: 0 }) }}
      </output>
      {{ $t('totalAmount').toLowerCase() }}
    </data>
    <progress
      id="progress-bar"
      class="campaign-progress__bar"
      :value="totalAmount / currentGoal * 100"
      max="100"
      :aria-label="$t('progressOfCampaign')"
    >
      {{ $n(totalAmount / currentGoal, 'percent') }}
    </progress>
    <div class="campaign-progress__progress">
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
defineProps({
  currentGoal: {
    type: Number,
    required: true,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  totalDonations: {
    type: Number,
    required: true,
    default: 0,
  },
});
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
