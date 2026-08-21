<template>
  <NuxtLayout>
    <div class="layout-container">
      <NuxtPage />
    </div>
  </NuxtLayout>

  <updateBannerPanel v-if="updateAvailable" @reload="reload" />
  <errorMessagePanel :error="errorToShow" @close="flushError" />

  <NuxtLoadingIndicator :color="false" :height="3" />
</template>
<script setup lang="ts">
import * as Sentry from '@sentry/nuxt';

const { updateAvailable, reload } = useVersionChecker();
const errorToShow: Ref<Error | null> = ref(null);

function flushError() {
  errorToShow.value = null;
}

function isChunkLoadError(error: unknown) {
  const errorMessage = (error as Error)?.message?.toLowerCase() || '';
  return (
    errorMessage.includes('dynamically imported module')
    || errorMessage.includes('loading chunk')
    || errorMessage.includes('importing a module script failed')
  );
}

function reloadForStaleChunk(error: unknown) {
  // Log to Sentry before refreshing
  Sentry.captureException(error, {
    tags: {
      error_type: 'chunk_load_error',
      auto_refresh: true,
    },
  });

  // Force a hard reload to get fresh chunks
  window.location.reload();
}

if (import.meta.client) {
  // Vite's own module preloading (dynamic import() of route/component chunks)
  // fails outside Vue's render/lifecycle tree, so it never reaches
  // onErrorCaptured below — it surfaces here instead.
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    reloadForStaleChunk(event.payload);
  });

  // Fallback for dynamic import() rejections that are neither caught by
  // Vue nor routed through vite:preloadError (e.g. browsers that reject
  // with "Importing a module script failed" outside the preload path).
  window.addEventListener('unhandledrejection', (event) => {
    if (isChunkLoadError(event.reason)) {
      event.preventDefault();
      reloadForStaleChunk(event.reason);
    }
  });

  onErrorCaptured((error) => {
    if (isChunkLoadError(error)) {
      reloadForStaleChunk(error);
      return false; // Prevent further error handling
    }

    // Fatal errors created via createError (e.g. a campaign 404 thrown from
    // layouts/default.vue) already carry their own status page — hand them
    // to Nuxt's error handling instead of showing the generic panel below,
    // otherwise they get stuck as an unhandled exception here.
    if (isNuxtError(error) && error.fatal) {
      showError(error);
      return false;
    }

    errorToShow.value = error;

    if (import.meta.dev) {
      console.trace(error);
    }

    Sentry.captureException(error);
    return undefined;
  });
}
</script>
<style lang="scss">
.page-slide-left-enter-active,
.page-slide-left-leave-active,
.page-slide-right-enter-active,
.page-slide-right-leave-active {
  transition: all 0.2s;
}

.page-slide-left-enter-from {
  opacity: 0;

  transform: translate(50px, 0);
}

.page-slide-left-leave-to {
  opacity: 0;

  transform: translate(-50px, 0);
}

.page-slide-right-enter-from {
  opacity: 0;

  transform: translate(-50px, 0);
}

.page-slide-right-leave-to {
  opacity: 0;

  transform: translate(50px, 0);
}

.nuxt-loading-indicator {
  background: my.palette('neutral', 'white') linear-gradient(to right,
    my.palette('loading', 'gradient-list'));
}
</style>
