<template>
  <div
    class="update-banner"
    aria-live="polite"
  >
    <div class="update-banner__container">
      <span>{{ $t('updateAvailable') }}</span>
      <button
        type="button"
        class="update-banner__button"
        @click="$emit('reload')"
      >
        {{ $t('updateReload') }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
defineEmits(['reload']);
</script>
<style scoped lang="scss">
.update-banner {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: my.layer('modal');

  padding: my.$gutter * 0.75 my.$gutter;

  color: my.palette('neutral', 'white');
  background: my.palette('neutral', 'x-dark');

  @include my.shadow;
}

.update-banner__container {
  @include my.container;

  display: flex;
  gap: my.$gutter;
  align-items: center;
  justify-content: space-between;

  max-width: my.$max-width--dialog;
}

.update-banner__button {
  padding: 0.25em 0.75em;

  color: inherit;
  white-space: nowrap;

  background: transparent;
  border: 1px solid currentColor;
  border-radius: my.$rounded-corner;

  cursor: pointer;

  &:hover {
    background: rgb(255 255 255 / 15%);
  }
}
</style>
