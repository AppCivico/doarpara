<template>
  <button
    type="button"
    :disabled="!clickable"
    class="share-button"
    @click="handleShare"
  >
    <slot>
      {{ $t('Share') }}
    </slot>
  </button>
</template>

<script setup lang="ts">
interface ShareData {
  title?: string
  text?: string
  url?: string
}

interface Props {
  shareData?: ShareData
  clickable?: boolean
  fallbackAction?: 'copy' | 'custom' | null
}

const props = withDefaults(defineProps<Props>(), {
  shareData: () => ({
    title: 'Doar para',
    text: 'Doar para',
    url: 'https://doarpara.com.br',
  }),
  clickable: true,
  fallbackAction: 'copy'
})

const emit = defineEmits<{
  shareSuccess: [data: ShareData]
  shareError: [error: Error]
  fallbackTriggered: [data: ShareData]
}>()

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    console.log('URL copiada para o clipboard!')
  } catch (err) {
    console.error('Erro ao copiar para clipboard:', err)
    emit('shareError', err as Error)
  }
}

function handleFallback() {
  if (props.fallbackAction === 'copy' && props.shareData.url) {
    copyToClipboard(props.shareData.url)
  } else if (props.fallbackAction === 'custom') {
    emit('fallbackTriggered', props.shareData)
  }
}

async function handleShare() {
  if (!props.clickable) return

  if (navigator.share) {
    try {
      await navigator.share(props.shareData)
      emit('shareSuccess', props.shareData)
    } catch (err) {
      console.error('Erro no compartilhamento:', err)
      emit('shareError', err as Error)

      if ((err as Error).name !== 'AbortError') {
        handleFallback()
      }
    }
  } else {
    handleFallback()
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
</style>
