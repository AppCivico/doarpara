<template>
  <ul
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
            [appConfig.queryStringSpecialParameters.amount]: $n(pledge / 100),
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
      class="donation-values__item donation-values__item--custom-button"
    >
      <button
        v-if="!chosenCustomPledge"
        type="button"
        class="donation-values__value donation-values__value--custom-button like-a__button"
        @click="() => { chosenCustomPledge = pledge; }"
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
          :for="appConfig.queryStringSpecialParameters.amount"
        >
          {{ $t('_currencySymbol') }}
        </label>
        <input
          :id="appConfig.queryStringSpecialParameters.amount"
          v-model="pledgeValue"
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
          :to="pledgeValue
            ? {
              name: 'donate',
              query: {
                [appConfig.queryStringSpecialParameters.amount]: pledgeValue,
              },
            }
            : `#${appConfig.queryStringSpecialParameters.amount}`"
          class="donation-values__custom-submit like-a__button"
        >
          {{ $t(`pledges.toChoose`) }}
        </NuxtLink>
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

const appConfig = useAppConfig();

const campaignStore = useCampaignStore();
const { minimumDonation } = storeToRefs(campaignStore); // TODO: move from using props to store
const chosenCustomPledge: Ref<string> = ref('');
const pledgeValue = ref('');

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

if (minimumDonation.value) {
  pledgeValue.value = String(minimumDonation.value / 100);
}
</script>
