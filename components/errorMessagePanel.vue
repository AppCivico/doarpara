<template>
  <div
    v-if="slots.default"
    class="error-message"
    aria-live="assertive"
  >
    <span class="error-message__container">
      <slot />
    </span>
  </div>
</template>
<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();

defineProps({
  message: {
    type: String,
    default: '',
  },
});
</script>
<style scoped lang="scss">
.error-message {
  @include my.shadow;
  @include my.pulsing-color(my.palette('effects', 'error-gradient'), 'background-color');

  position: sticky;
  right: 0;
  bottom: my.$gutter;
  left: 0;
  z-index: my.layer('dropdown');

  padding: my.$gutter;

  color: my.text-contrast(my.palette('signage', 'danger'), my.palette('neutral', 'white'), $level: 'AA');

  border-radius: my.$rounded-corner;
}

.error-message--idle {}

.error-message--pending {}

.error-message--success {}

.error-message--error {}

.error-message__container {
  @include my.container;

  display: block;

  max-width: my.$max-width--dialog;

  text-align: center;
}
</style>
