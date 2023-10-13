<template>
  <div class="campaign-progress">
    <data class="campaign-progress__total" value="11650">
      <output for="progress-bar" class="campaign-progress__total-value">
        {{ $n(11650, 'currency', { maximumFractionDigits: 0 }) }}
      </output>
      {{ $t('totalAmount').toLowerCase() }}
    </data>

    <progress
      id="progress-bar"
      class="campaign-progress__bar"
      value="46"
      max="100"
      aria-label="Progresso da campanha"
    >
      {{ $n(0.46, 'percent') }}
    </progress>
    <div class="campaign-progress__progress">
      <data value="0.46" class="campaign-progress__progress-percentage">
        {{ $n(0.46, 'percent') }}
      </data>
      de
      <data value="25000" class="campaign-progress__progress-total">
        {{ $n(25000, 'currency', { maximumFractionDigits: 0 }) }}
      </data>
    </div>
    <div class="campaign-progress__donations">
      <data value="710" class="campaign-progress__donations-number">
        {{ $n(710) }}
      </data>
      {{ $t('totalDonations').toLowerCase() }}
    </div>
  </div>
</template>
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
  text-overflow: ellipsis;
  white-space: nowrap;
}

.campaign-progress__total-currency,
.campaign-progress__total-value {
  font-size: my.ms-step(35px);
  font-weight: my.font-weight('bold');
}

.campaign-progress__bar {
  width: 100%;
}

.campaign-progress__total-currency {}

.campaign-progress__total-value {}

.campaign-progress__progress,
.campaign-progress__donations {
  flex-basis: calc(50% - my.$gutter);
  flex-grow: 1;

  min-width: min-content;
  max-width: max-content;
  margin-top: my.$gutter * 0.5;
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.campaign-progress__progress {}

.campaign-progress__progress-percentage,
.campaign-progress__progress-total {
  font-weight: my.font-weight('bold');
}

.campaign-progress__progress-percentage {}

.campaign-progress__progress-total {}

.campaign-progress__donations {}

.campaign-progress__donations-number {
  font-weight: my.font-weight('bold');
}
</style>
