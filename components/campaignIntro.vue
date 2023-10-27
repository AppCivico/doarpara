<template>
  <section class="intro">
    <div class="container">
      <figure v-if="!showVideo" class="intro__cover">
        <img
          alt=""
          class="intro__image"
          width="780"
          height="440"
          :src="typeof campaign.cover === 'object'
            ? campaign.cover.url
            : campaign.cover || youtubeThumbnail"
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
        :current-goal="currentGoal"
        :total-amount="campaign.total_amount"
        :total-donations="campaign.total_donations"
      />
      <div class="call-to-action-values">
        <p class="call-to-action-values__intro">
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
            <a
              :href="`#doar?valor=${pledge}`"
              class="donation-values__value like-a__button"
            >
              {{ typeof pledge === 'number'
                ? $n(pledge / 100, 'currency', { maximumFractionDigits: 0 })
                : $t(`pledges.${pledge}`) }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { Campaign, Goal } from '../doar-para.d.ts';
import getVideoId from '../utils/getYoutubeId.ts';
import getYoutubeThumbnail from '../utils/getYoutubeThumbnail.ts';

const props = defineProps<{
  campaign: Campaign;
}>();

const showVideo = ref(false);

const origin: String = process.browser ? window.location.origin : '';

const videoId = computed(() => getVideoId(props.campaign.video));
const youtubeThumbnail = computed(() => getYoutubeThumbnail(props.campaign.video));

const currentGoal = computed(() => {
  const { total_amount: totalAmount, goal_list: goals } = props.campaign;

  return (goals.find((x: Goal) => x.amount > totalAmount) || goals[goals.length - 1])?.amount
    || totalAmount
    || 0;
});

const sortedPledgeList = computed(() => {
  const { pledge_list: pledgeList } = props.campaign;

  return !Array.isArray(pledgeList)
    ? []
    : [...pledgeList].sort((a, b) => {
      if (a === 'custom') {
        return 1;
      }
      if (b === 'custom') {
        return -1;
      }

      return a - (b as number);
    });
});
</script>
