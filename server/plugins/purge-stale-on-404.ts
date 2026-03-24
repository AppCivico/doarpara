export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', async (response, { event }) => {
    if (response.statusCode !== 404) return;

    const slug = event.path.split('/').find(Boolean);
    if (!slug) return;

    try {
      // @ts-expect-error: hubKV resolved at runtime via Nitro auto-imports
      const kv = hubKV();
      const keys = await kv.keys(`nitro:routes:_:${slug}`);
      await Promise.all(keys.map((key: string) => kv.removeItem(key)));
    } catch (err) {
      console.error(
        `[purge-stale-on-404] Failed to purge KV for slug "${slug}":`,
        err,
      );
    }
  });
});
