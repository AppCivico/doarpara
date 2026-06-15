export function useVersionChecker() {
  const { version, versionCheckInterval } = useRuntimeConfig().public
  const updateAvailable = ref(false)
  let interval: ReturnType<typeof setInterval> | null = null

  async function check() {
    if (document.visibilityState !== 'visible') return
    try {
      const { version: latest } = await $fetch<{ version: string }>('/_version')
      if (latest !== version) updateAvailable.value = true
    }
    catch {
      // Silently ignore network errors — don't surface a false update alert
    }
  }

  onMounted(() => {
    if (!versionCheckInterval) return
    interval = setInterval(check, (versionCheckInterval as number) * 1000)
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return {
    updateAvailable,
    reload: () => globalThis.location.reload(),
  }
}
