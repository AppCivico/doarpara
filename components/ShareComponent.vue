<template>
  <button
    v-if="isAvailable"
    v-bind="$attrs"
    type="button"
    :disabled="!clickable"
    class="share-button"
    @click="handleShare"
  >
    <template v-if="copied">
      {{ $t('copiedToClipboard') }}
    </template>
    <slot v-else>
      {{ $t('Share') }}
    </slot>
  </button>
  <span
    v-if="isAvailable"
    class="share-live-region"
    aria-live="polite"
    aria-atomic="true"
  >{{ copied ? $t('copiedToClipboard') : '' }}</span>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

defineOptions({ inheritAttrs: false })

interface ShareData {
  title?: string
  text?: string
  url?: string
}

interface Props {
  shareData: ShareData // Required - always passed from parent
  clickable?: boolean
  fallbackAction?: 'copy' | 'custom' | null
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true,
  fallbackAction: 'copy'
})

const isAvailable = ref(false);
const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  const hasShare = typeof navigator !== 'undefined' && !!navigator.share;
  const hasClipboard = typeof navigator !== 'undefined' && !!navigator.clipboard;
  isAvailable.value = hasShare || hasClipboard;
})

onUnmounted(() => {
  if (copiedTimer) {
    clearTimeout(copiedTimer);
  }
})

function showCopied() {
  copied.value = true;
  if (copiedTimer) {
    clearTimeout(copiedTimer);
  }
  copiedTimer = setTimeout(() => { copied.value = false }, 2000);
}

const emit = defineEmits<{
  shareSuccess: [data: ShareData]
  shareError: [error: Error]
  fallbackTriggered: [data: ShareData]
}>()

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    showCopied();
    console.log('URL copiada para o clipboard!');
  } catch (err) {
    console.error('Erro ao copiar para clipboard:', err);
    emit('shareError', err as Error);
  }
}

function handleFallback() {
  if (props.fallbackAction === 'copy' && props.shareData.url) {
    copyToClipboard(props.shareData.url);
  } else if (props.fallbackAction === 'custom') {
    emit('fallbackTriggered', props.shareData);
  }
}

async function handleShareError(err: unknown, pendingCopy: Promise<void | null> | null) {
  if ((err as Error).name === 'AbortError') {
    return;
  }

  emit('shareError', err as Error);
  if (pendingCopy) {
    await pendingCopy;
    showCopied();
  } else {
    handleFallback();
  }
}

async function handleShare() {
  if (!props.clickable) {
    return;
  }

  const canShare = typeof navigator.share === 'function'
    && (navigator.canShare?.(props.shareData) ?? true);

  if (!canShare) {
    handleFallback();
    return;
  }

  // Start clipboard write synchronously within the user gesture before going async,
  // so the activation token is still valid if share fails.
  const pendingCopy = props.fallbackAction === 'copy' && props.shareData.url && navigator.clipboard
    ? navigator.clipboard.writeText(props.shareData.url).catch(() => null)
    : null;

  try {
    await navigator.share(props.shareData);
    emit('shareSuccess', props.shareData);
  } catch (err) {
    console.error('Erro no compartilhamento:', err);
    await handleShareError(err, pendingCopy);
  }
}

</script>

<style lang="scss" scoped>
:where(.share-button) {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  display: contents;

  &.share-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  & .share-button:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

}

.share-live-region {
  @include my.visually-hidden;
}
</style>
