<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <template v-if="$props.error?.statusCode === 404">
      <img
        src="/assets/images/logo-doarpara.svg"
        width="180"
        height="42"
        alt=""
        aria-hidden="true"
        :aria-label="runtimeConfig.public.title"
        class="error-page__logo"
      />
      <img
        src="/assets/images/errors/404.svg"
        width="290"
        height="220"
        alt=""
        aria-hidden="true"
        class="error-page__figure"
      />
      <!-- eslint-disable-next-line vuejs-accessibility/heading-has-content -->
      <h1 v-t="'errors.404.title'" class="error-page__title" />
      <p v-t="'errors.404.message'" class="error-page__message" />
    </template>

    <template v-else-if="String($props.error?.statusCode)[0] === '5'">
      <img
        src="/assets/images/logo-doarpara--negative.svg"
        width="180"
        height="42"
        alt=""
        aria-hidden="true"
        :aria-label="runtimeConfig.public.title"
        class="error-page__logo"
      />
      <img
        src="/assets/images/errors/500.svg"
        width="290"
        height="220"
        alt=""
        aria-hidden="true"
        class="error-page__figure"
      />
      <!-- eslint-disable-next-line vuejs-accessibility/heading-has-content -->
      <h1 v-t="'errors.server.title'" class="error-page__title" />
      <p v-t="'errors.server.message'" class="error-page__message" />
    </template>

    <template v-else>
      <img
        src="/assets/images/logo-doarpara.svg"
        width="180"
        height="42"
        alt=""
        aria-hidden="true"
        :aria-label="runtimeConfig.public.title"
        class="error-page__logo"
      />
      <!-- eslint-disable-next-line vuejs-accessibility/heading-has-content -->
      <h1 v-t="'errors.generic.title'" class="error-page__title" />

      <pre>$props.error: {{ $props.error }}</pre>

      <p v-if="$props.error?.message">
        {{ $props.error.message }}
      </p>
      <p v-else v-t="'errors.generic.message'" class="error-page__message" />
    </template>

    <button
      type="button"
      class="error-page__escape-button like-a__button--submit"
      @click="handleError"
    >
      {{ $t('visitWebsite') }}
    </button>
  </div>
</template>
<script setup lang="ts">
import type { NuxtError } from '#app';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    default: () => ({}),
  },
});
const runtimeConfig = useRuntimeConfig();

const meta = computed(() => {
  switch (true) {
    case props.error?.statusCode === 404:
      return {
        title: () => `${props.error.statusCode} • ${runtimeConfig.public.title}`,
        description: t('errors.404.message'),
        htmlAttrs: {
          class: 'error-page--client error-page--404',
        },
      };
    case String(props.error?.statusCode)[0] === '5':
      return {
        title: () => `${props.error.statusCode} • ${runtimeConfig.public.title}`,
        description: t('errors.server.message'),
        htmlAttrs: {
          class: 'error-page--server error-page--500',
        },
      };

    default:
      return {
        htmlAttrs: {
          class: 'error-page',
        },
      };
  }
});

useHead(meta);

const handleError = () => {
  clearError();
  // using window location because home page is out of this SPA
  window.location.assign('/');
};
</script>
