<template>
  <section class="intro">
    <div class="container">
      <figure v-if="!showVideo" class="intro__cover">
        <img
          alt=""
          class="intro__image"
          width="780"
          height="440"
          :src="imageSrc || youtubeThumbnail"
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
        <p>
          Ajude-nos a criar lavandarias escolares gratuitas para que as crianças
          que vivem em situação de vulnerabilidade, possam ter acesso a roupas
          limpas através do Espuma nas Escolas.
        </p>
      </div>
      <campaignProgress class="intro__campaign-progress" />
      <div class="call-to-action-values">
        <p class="call-to-action-values__intro">
          {{ $t('donateWithoutReward') }}
        </p>

        <p class="call-to-action-values__campaign-type">
          <span
            class="tooltip"
            title="Something small enough to escape casual notice."
          >
            Campanha flexível
          </span>
        </p>

        <ul
          class="call-to-action-values__donation-values donation-values__list"
        >
          <li class="donation-values__item">
            <a
              href="#doar?valor=20"
              class="donation-values__value like-a__button"
            >
              {{ $n(20, 'currency', { maximumFractionDigits: 0 }) }}
            </a>
          </li>
          <li class="donation-values__item">
            <a
              href="#doar?valor=50"
              class="donation-values__value like-a__button"
            >
              {{ $n(50, 'currency', { maximumFractionDigits: 0 }) }}
            </a>
          </li>
          <li class="donation-values__item">
            <a
              href="#doar?valor=100"
              class="donation-values__value like-a__button"
            >
              {{ $n(100, 'currency', { maximumFractionDigits: 0 }) }}
            </a>
          </li>
          <!-- lala -->
          <li class="donation-values__item">
            <a
              href="#doar?valor=200"
              class="donation-values__value like-a__button"
            >
              {{ $n(200, 'currency', { maximumFractionDigits: 0 }) }}
            </a>
          </li>
          <li class="donation-values__item">
            <a
              href="#doar?valor=500"
              class="donation-values__value like-a__button"
            >
              {{ $n(500, 'currency', { maximumFractionDigits: 0 }) }}
            </a>
          </li>
          <li class="donation-values__item">
            <a
              href="#doar?valor=1064"
              class="donation-values__value like-a__button"
            >
              {{ $n(1064, 'currency', { maximumFractionDigits: 0 }) }}
            </a>
          </li>

          <!-- lala -->
          <li class="donation-values__item">
            <a
              href="#doar-outro-valor"
              class="donation-values__value like-a__button"
            >
              Outro valor
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import getVideoId from '../utils/getYoutubeId.ts';
import getYoutubeThumbnail from '../utils/getYoutubeThumbnail.ts';

const showVideo = ref(false);

const origin: String = process.browser ? window.location.origin : '';

const imageSrc = '/assets/img/sample-cover.png';
const videoId: String = getVideoId(
  'https://www.youtube.com/watch?v=ZzH-bAY6KGI',
);

const youtubeThumbnail = getYoutubeThumbnail(
  'https://www.youtube.com/watch?v=ZzH-bAY6KGI',
);
</script>
