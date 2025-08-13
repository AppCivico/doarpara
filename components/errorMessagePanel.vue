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
          <template v-if="Array.isArray((error as ApiError)?.data)">
            <ul v-if="(error as ApiError)?.data.length > 1">
              <li
                v-for="(item, i) in error"
                :key="i"
              >
                {{ (item as ApiError)?.message || item }}
              </li>
            </ul>
            <template v-else>
              <p
                v-for="(item, i) in (error as ApiError)?.data"
                :key="i"
                :class="item.msg_id"
              >
                {{ (item as ApiError)?.message || item }}
              </p>
            </template>
          </template>
          <p v-else>
            {{ (error as ApiError)?.message || (error as FetchError)?.statusMessage || error }}
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
import type { ApiError } from '~/doar-para';

defineOptions({ inheritAttrs: false });

// @see: https://github.com/unjs/ofetch/blob/8e80b3922d940fac67d8163fcbaa46f8c16b7c7d/src/types.ts#L111
// export interface IFetchError<T = any> extends Error {
//   request?: FetchRequest;
//   options?: FetchOptions;
//   response?: FetchResponse<T>;
//   data?: T;
//   status?: number;
//   statusText?: string;
//   statusCode?: number;
//   statusMessage?: string;
// }

interface Props {
  error?: Error | FetchError | ApiError | null,
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
  position: sticky;
  right: my.$gutter;
  bottom: my.$gutter;
  left: my.$gutter;
  z-index: my.layer('dropdown');

  padding: my.$gutter;

  color: my.apca-text-contrast(
    $background-color: my.palette('signage', 'danger'),
    $text-color: my.palette('neutral', 'white'),
    $font-size: 13px,
    $font-weight: 400,
    $usage-context: 'content',
  );

  border-radius: my.$rounded-corner;


  @include my.shadow;
  @include my.pulsing-color(my.palette('effects', 'error-gradient'), 'background-color');

  @include my.themed-declaration ('green') {
    @include my.pulsing-color(my.palette('green-theme', 'effects', 'error-gradient'), 'background-color');
  }

  @include my.themed-declaration ('orange') {
    @include my.pulsing-color(my.palette('orange-theme', 'effects', 'error-gradient'), 'background-color');
  }

  @include my.themed-declaration ('red') {
    @include my.pulsing-color(my.palette('red-theme', 'effects', 'error-gradient'), 'background-color');
  }
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
