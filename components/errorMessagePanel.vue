<template>
  <Teleport
    v-if="slots.default"
    to="#teleports"
  >
    <div
      class="error-message"
      aria-live="assertive"
    >
      <span class="error-message__container">
        <slot />
      </span>
    </div>
  </Teleport>
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

  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: my.layer('dropdown');

  padding: my.$gutter;

  color: my.text-contrast(my.palette('feedback', 'danger'), my.palette('neutral', 'white'), $level: 'AA');
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
