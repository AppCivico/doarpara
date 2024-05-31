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
          v-if="refVideo.some(item => item.code === refParam) || youtubeThumbnail"
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
          :src="currentVideoUrl
            ? `https://www.youtube-nocookie.com/embed/${currentVideoUrl}?origin=${origin}&autoplay=1&color=white&rel=0`
            : `https://www.youtube-nocookie.com/embed/${videoId}?origin=${origin}&autoplay=1&color=white&rel=0`"
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
          <!-- TO-DO: Use popover -->
          <!-- TO-DO: Update message -->
          <span
            class="tooltip"
            title="Something small enough to escape casual notice."
          >
            {{ $t('flexibleFunding') }}
          </span>
        </p>

        <donationValues :campaign="campaign" class="call-to-action-values__donation-values" />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import type { Campaign } from '@/doar-para.d.ts';

const props = defineProps<{
  campaign: Campaign;
}>();

const refVideo = props.campaign.refs_videos;
const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const refParam = urlParams ? urlParams.get('ref')?.replace(/"/g, '') : null;

const showVideo = ref(false);

const origin: String = typeof window !== 'undefined'
  ? window.location.origin
  : '';

const videoId = computed<string | null | undefined>(() => getYoutubeId(props.campaign.video));
const youtubeThumbnail = computed(() => getYoutubeThumbnail(props.campaign.video));

const currentVideoUrl = computed(() => {
  let url = '';
  if (refParam) {
    refVideo.forEach((item) => {
      if (item.code === refParam) {
        url = getYoutubeId(item.video_url);
      }
    });
  }
  return url;
});

const campaignDefaultCover = computed(() => {
  if (typeof props.campaign.cover === 'string') {
    return props.campaign.cover;
  }
  if (Array.isArray(props.campaign.cover)) {
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
</script>
