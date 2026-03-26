const PURGE_ON_STATUS = new Set([403, 404]);

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', async (response, { event }) => {
    if (!PURGE_ON_STATUS.has(response.statusCode)) return;

    const slug = event.path.split('/').find(Boolean);
    if (!slug) return;

    // Nitro uses /\W/g to normalize cache keys (removes non-word characters),
    // so "igor-oliveira" → "igoroliveira" but "renato_cron" → "renato_cron"
    // Source: nitropack/dist/runtime/internal/cache.mjs line 125
    const normalizedSlug = slug.replaceAll(/\W/g, '');

    try {
      // Access the CACHE KV binding directly via Cloudflare's native API.
      // hubKV() targets the KV binding (user-facing), not CACHE (Nitro route cache).
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const kv = (event.context as any).cloudflare?.env?.CACHE;
      if (!kv) return; // not in Cloudflare environment (local dev)

      const list = await kv.list({ prefix: `nitro:routes:_:${normalizedSlug}` });
      await Promise.all(list.keys.map((k: { name: string }) => kv.delete(k.name)));
    } catch (err) {
      console.error(
        `[purge-stale-on-404] Failed to purge KV for slug "${slug}":`,
        err,
      );
    }
  });
});
