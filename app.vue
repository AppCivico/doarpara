<template>
  <NuxtLayout>
    <div class="layout-container">
      <NuxtPage />
    </div>
  </NuxtLayout>

  <errorMessagePanel :error="errorToShow" @close="flushError" />

  <NuxtLoadingIndicator :color="false" :height="3" />
</template>
<script setup lang="ts">
import * as Sentry from '@sentry/nuxt';

const errorToShow: Ref<Error | null> = ref(null);

function flushError() {
  errorToShow.value = null;
}

if (import.meta.client) {
  onErrorCaptured((error) => {
    // Check if this is a dynamic import/chunk loading error
    const errorMessage = error.message?.toLowerCase() || '';
    const isChunkLoadError =
      errorMessage.includes('dynamically imported module') ||
      errorMessage.includes('failed to fetch') ||
      errorMessage.includes('loading chunk') ||
      errorMessage.includes('importing a module script failed');

    if (isChunkLoadError) {
      // Log to Sentry before refreshing
      Sentry.captureException(error, {
        tags: {
          error_type: 'chunk_load_error',
          auto_refresh: true,
        },
      });

      // Force a hard reload to get fresh chunks
      window.location.reload();
      return false; // Prevent further error handling
    }

    errorToShow.value = error;

    if (import.meta.dev) {
      console.trace(error);
    }

    Sentry.captureException(error);
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
