<template>
  <div class="campaign-progress">
    <ShareComponent
      :share-data="shareData"
      class="campaign-progress__share">
      {{ $t('shareCampaign') }}
    </ShareComponent>
    <data class="campaign-progress__total" :value="totalAmount">
      <ClientOnly>
        <AnimatedNumber
          for="progress-bar"
          class="campaign-progress__total-value"
          as="output"
          :value="totalAmount / 100"
          :formatter="($v: number) => $n($v, 'currency', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })"
        />
        <template #fallback>
          <output class="campaign-progress__total-value">
            {{ $n(totalAmount / 100, 'currency', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }) }}
          </output>
        </template>
      </ClientOnly>
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
        {{
          $n(currentGoal / 100, 'currency', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
        }}
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
import type { Campaign, SourceOnProgressBar } from '@/doar-para.d.ts';

const requestURL = useRequestURL()
const runtimeConfig = useRuntimeConfig();

const props = defineProps<{
  campaign: Campaign;
}>();

const donationSources = computed(() => combineDonationSources(props.campaign.platforms));

const totalAmount = computed(() => consolidateTotalAmount(donationSources.value));

const totalDonations = computed(() => donationSources.value.reduce((acc, cur) => {
  // eslint-disable-next-line no-param-reassign
  acc += cur.total_donations;
  return acc;
}, 0));

const currentGoal = computed(() => getCurrentGoal(props.campaign.goal_list, totalAmount.value));

const shareData = {
  title: props.campaign?.name
      ? `${props.campaign?.name} • ${runtimeConfig.public.title}`
      : `${runtimeConfig.public.title}`,
  text: props.campaign?.preamble,
  url: requestURL.href,
}

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

.campaign-progress__share {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
  @include my.themed-color('border-color', ('brand', 'primary'));

  &:before {
    content: "";
    width: 1.2em;
    aspect-ratio: 1;
    mask: my.image('icons/share.svg') no-repeat center / contain;
    background-color: currentColor;
    will-change: transform;
    backface-visibility: hidden;
    animation: jiggle 10s ease-in-out infinite;

    @media screen and (prefers-reduced-motion: reduce) {
      animation-name: none;
    }
  }
}

@keyframes jiggle {
  0%, 100% { transform: rotate(0deg); }
  2%  { transform: rotate(-14deg); }
  4%  { transform: rotate(14deg); }
  6%  { transform: rotate(-10deg); }
  8%  { transform: rotate(10deg); }
  10% { transform: rotate(0deg); }
  94% { transform: rotate(0deg); }
}
</style>
