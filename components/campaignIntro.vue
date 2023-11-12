<template>
  <section class="intro">
    <div class="container">
      <figure v-if="!showVideo" class="intro__cover">
        <img
          alt=""
          class="intro__image"
          width="780"
          height="440"
          :src="campaignDefaultCover || youtubeThumbnail"
          :srcset="campaignCoverSrcset"
        />
        <button
          class="intro__figure-switcher"
          type="button"
          :aria-label="$t('loadVideo')"
          @click="() => (showVideo = !showVideo)"
        >
          <img
            src="~/assets/images/icon-play.svg"
            alt=""
            width="24"
            height="24"
            aria-hidden="true"
          />
        </button>
      </figure>
      <figure v-else class="intro__cover intro__video-container">
        <iframe
          class="intro__video"
          :title="$t('campaignVideo')"
          width="780"
          height="440"
          :src="`https://www.youtube-nocookie.com/embed/${videoId}?origin=${origin}&autoplay=1`"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        />
      </figure>

      <div class="intro__campaign-preamble">
        <p v-if="campaign.preamble">
          {{ campaign.preamble }}
        </p>
      </div>
      <campaignProgress
        class="intro__campaign-progress"
        :campaign="campaign"
      />
      <div class="call-to-action-values">
        <p v-if="campaign?.reward_list?.length" class="call-to-action-values__intro">
          {{ $t('donateWithoutReward') }}
        </p>

        <p v-if="campaign.is_flexible_funding" class="call-to-action-values__campaign-type">
          <span
            class="tooltip"
            title="Something small enough to escape casual notice."
          >
            {{ $t('flexibleFunding') }}
          </span>
        </p>

        <ul
          class="call-to-action-values__donation-values donation-values__list"
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
                  [appConfig.queryStringSpecialParameters.amount]: pledge,
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
            class="donation-values__item"
          >
            <button
              v-if="!chosenCustomPledge"
              type="button"
              class="donation-values__value donation-values__value--custom-button like-a__button"
              @click="$event => chosenCustomPledge = pledge"
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
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import type { Campaign } from '@/doar-para.d.ts';
import { computed, ref } from 'vue';

const appConfig = useAppConfig();
const props = defineProps<{
  campaign: Campaign;
}>();

const chosenCustomPledge: Ref<string> = ref('');
const showVideo = ref(false);

const origin: String = typeof window !== 'undefined'
  ? window.location.origin
  : '';

const videoId = computed(() => getYoutubeId(props.campaign.video));
const youtubeThumbnail = computed(() => getYoutubeThumbnail(props.campaign.video));

const campaignDefaultCover = computed(() => {
  if (typeof props.campaign.cover === 'string') {
    return props.campaign.cover;
  } if (Array.isArray(props.campaign.cover)) {
    return typeof props.campaign.cover?.[0] === 'string'
      ? props.campaign.cover[0]
      : props.campaign.cover[0]?.url || undefined;
  }
  return '';
});

const campaignCoverSrcset = computed(() => {
  if (typeof props.campaign.cover === 'string') {
    return undefined;
  } if (Array.isArray(props.campaign.cover)) {
    return props.campaign.cover
      .reduce((acc, cur) => {
        if (typeof cur === 'object' && cur.url && cur.width) {
          acc.push(`${cur.url} ${cur.width}w`);
        }
        return acc;
      }, [] as String[])
      .join(', ')
      || undefined;
  }
  return undefined;
});

const sortedPledgeList = computed(({ pledge_list } = props.campaign) => (!Array.isArray(pledge_list)
  ? []
  : pledge_list
    .filter((x) => (typeof x === 'number'))
    .sort((a, b) => (a as number) - (b as number))));

const customPledges = computed(({ pledge_list } = props.campaign) => (!Array.isArray(pledge_list)
  ? []
  : pledge_list.filter((x) => typeof x === 'string') as string[]));

const minimumDonation = computed(() => (typeof props.campaign.minimum_donation === 'number'
  ? props.campaign.minimum_donation
  : sortedPledgeList.value[0] as number
  || undefined));

const maximumDonation = computed(() => (typeof props.campaign.maximum_donation === 'number'
  ? props.campaign.maximum_donation
  : sortedPledgeList.value[sortedPledgeList.value.length - 1] as number
  || undefined));

const pledgeValue: Ref<number> = ref(
  minimumDonation.value
    ? minimumDonation.value / 100
    : 0,
);
</script>
