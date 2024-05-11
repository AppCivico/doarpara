<template>
  <TransitionExpand>
    <div
      v-if="slots.default || error"
      v-bind="$attrs"
      class="error-message"
      aria-live="assertive"
      role="dialog"
    >
      <div class="error-message__container">
        <slot>
          <ul v-if="Array.isArray((error as FetchError)?.data)">
            <li
              v-for="(item, i) in error"
              :key="i"
            >
              {{ item }}
            </li>
          </ul>
          <p v-else>
            {{ error }}
          </p>
        </slot>
      </div>

      <button
        v-if="dismissible"
        type="button"
        class="dialog__close-button error-message__close-button"
        @click="flushErrors"
      >
        {{ $t('closeError') }}
      </button>
    </div>
  </TransitionExpand>
</template>
<script setup lang="ts">
import type { FetchError } from 'ofetch';
import { useSlots } from 'vue';

defineOptions({ inheritAttrs: false });


interface Props {
  error?: Error | FetchError | null,
  dismissible?: boolean,
}

withDefaults(defineProps<Props>(), {
  error: null,
  dismissible: true,
});

const emits = defineEmits([
  'close',
]);

const slots = useSlots();

function flushErrors() {
  clearError();
  emits('close');
}
</script>
<style scoped lang="scss">
.error-message {
  @include my.shadow;
  @include my.pulsing-color(my.palette('effects', 'error-gradient'), 'background-color');

  position: sticky;
  right: my.$gutter;
  bottom: my.$gutter;
  left: my.$gutter;
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

  *:last-child {
    margin-bottom: 0;
  }
}
</style>
