<template>
  <ul
    v-if="sortedPledgeList.length || customPledges.length"
    class="donation-values__list"
  >
    <li
      v-for="(pledge, i) in sortedPledgeList"
      :key="i"
      class="donation-values__item"
    >
      <NuxtLink
        :to="{
          name: 'donate',
          query: {
            [runtimeConfig.public.queryStringSpecialParameters.amount]: $n(pledge / 100),
          },
        }"
        class="donation-values__value like-a__button"
      >
        {{ typeof pledge === 'number'
          ? $n(pledge / 100, 'currency', { maximumFractionDigits: 0 })
          : $t(`pledges.${pledge}`) }}
      </NuxtLink>
    </li>
    <li
      v-for="pledge in customPledges"
      :key="pledge"
      class="donation-values__item donation-values__item--custom"
    >
      <button
        v-if="!chosenCustomPledge"
        type="button"
        class="donation-values__value donation-values__value--custom-button like-a__button"
        @click="openCustomPledge(pledge)"
      >
        {{ $t(`pledges.${pledge}`) }}
      </button>
      <div
        v-else
        class="donation-values__value donation-values__value--custom-group like-a__button"
        role="group"
      >
        <label
          class="donation-values__custom-currency"
          :for="runtimeConfig.public.queryStringSpecialParameters.amount"
        >
          {{ $t('_currencySymbol') }}
        </label>
        <input
          :id="runtimeConfig.public.queryStringSpecialParameters.amount"
          ref="customPledgeField"
          v-model.number="pledgeValue"
          v-focus.select
          type="number"
          step=".01"
          class="donation-values__custom-input"
          :aria-label="$t(`pledges.${pledge}`)"
          :min="minimumDonation
            ? minimumDonation as number / 100
            : undefined"
          :max="maximumDonation
            ? maximumDonation as number / 100
            : undefined"
        />
        <NuxtLink
          v-if="pledgeValue && isPledgeValueValid"
          :to="{
            name: 'donate',
            query: {
              [runtimeConfig.public.queryStringSpecialParameters.amount]: pledgeValue,
            },
          }"
          class="donation-values__custom-submit like-a__button"
        >
          {{ $t(`pledges.toChoose`) }}
        </NuxtLink>
        <button
          v-else
          type="button"
          aria-disabled="true"
          class="donation-values__custom-submit like-a__button"
        >
          {{ $t(`pledges.toChoose`) }}
        </button>
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import type { Campaign } from '@/doar-para.d.ts';
import { useCampaignStore } from '@/store/campaign.ts';

const props = defineProps<{
  campaign: Campaign;
}>();

const runtimeConfig = useRuntimeConfig();
const campaignStore = useCampaignStore();
const { minimumDonation } = storeToRefs(campaignStore); // TODO: move from using store to props

const chosenCustomPledge: Ref<string> = ref('');
const pledgeValue = ref(0);
const customPledgeField = ref(null);

const sortedPledgeList = computed(() => {
  const { pledge_list: pledgeList } = props.campaign;

  return !Array.isArray(pledgeList)
    ? []
    : pledgeList
      .filter((x): x is number => typeof x === 'number')
      .sort((a, b) => (a as number) - (b as number));
});

const customPledges = computed(() => {
  const { pledge_list: pledgeList } = props.campaign;

  return !Array.isArray(pledgeList)
    ? []
    : pledgeList.filter((x) => typeof x === 'string') as string[];
});

const maximumDonation = computed(() => (typeof props.campaign.max_donation_value === 'number'
  ? props.campaign.max_donation_value
  : sortedPledgeList.value[sortedPledgeList.value.length - 1] as number
  || undefined));

const minimumSuggestedDonation = computed((): number => {
  const { pledge_list: pledgeList } = props.campaign;

  return !Array.isArray(pledgeList) || !pledgeList.length
    ? minimumDonation.value
    : pledgeList
      // using `Array.filter()` instead of a `Array.reduce()`
      // because TypeScript isn't smart enough
      .filter((pledge): pledge is number => typeof pledge === 'number')
      .reduce((acc, cur) => Math.min(acc, cur), +Infinity as number);
});

const isPledgeValueValid = computed(() => !(pledgeValue.value < (minimumDonation.value || 0) / 100
  || pledgeValue.value > (maximumDonation?.value || Infinity) / 100));

async function openCustomPledge(pledge: string) {
  chosenCustomPledge.value = pledge;
  await nextTick();

  if (customPledgeField.value?.[0] && customPledgeField.value[0] as any instanceof HTMLElement) {
    (customPledgeField.value[0] as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }
}

if (minimumDonation.value) {
  pledgeValue.value = minimumSuggestedDonation.value < +Infinity
    ? minimumSuggestedDonation.value / 100
    : minimumDonation.value / 100;
}
</script>
