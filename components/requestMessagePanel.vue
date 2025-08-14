<template>
  <Teleport
    v-if="slots.default || defaultMessage"
    to="#teleports"
  >
    <div
      class="request-message"
      aria-live="assertive"
      :class="`request-message--${status}`"
    >
      <span class="request-message__container">
        <slot>
          {{ $t(defaultMessage) }}
        </slot>
      </span>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();
const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'idle',
    validator: (value: string) => ['', 'idle', 'pending', 'success', 'error'].indexOf(value) > -1,
  },
});

const defaultMessage = computed(() => {
  switch (props.status) {
    case 'pending':
      return 'pending';

    case 'success':
      return 'success';

    case 'error':
      return 'error';

    case 'idle':
      return 'idle';
    default:
      return '';
  }
});
</script>
<style scoped lang="scss">
.request-message {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: my.layer('dropdown');

  padding: my.$gutter;

  color: my.palette('neutral', 'white');

  @include my.shadow;
  @include my.pulsing-color(my.palette('loading', 'pulsing-list'), 'background-color');

  @include my.themed-declaration('green') {
    @include my.pulsing-color(my.palette('green-theme', 'loading', 'pulsing-list'), 'background-color');
  }

  @include my.themed-declaration('orange') {
    @include my.pulsing-color(my.palette('orange-theme', 'loading', 'pulsing-list'), 'background-color');
  }

  @include my.themed-declaration('red') {
    @include my.pulsing-color(my.palette('red-theme', 'loading', 'pulsing-list'), 'background-color');
  }
}

.request-message--idle {}

.request-message--pending {}

.request-message--success {}

.request-message--error {}

.request-message__container {
  @include my.container;

  display: block;

  max-width: my.$max-width--dialog;

  text-align: center;
}
</style>
