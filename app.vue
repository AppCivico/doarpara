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
const errorToShow: Ref<Error | null> = ref(null);

function flushError() {
  errorToShow.value = null;
}

if (import.meta.client) {
  onErrorCaptured((error) => {
    errorToShow.value = error;

    return false;
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
