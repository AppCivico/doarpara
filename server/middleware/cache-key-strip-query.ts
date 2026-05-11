// Strip query strings from req.url before Nitro's cache layer computes the
// cache key. Nitro hashes the full URL (including query string) into the key
// (nitropack/dist/runtime/internal/cache.mjs:136-145), so without this every
// unique `?utm_source=...&fbclid=...` value would create a new KV entry —
// leading to unbounded cache fragmentation and cold-miss storms under
// marketing traffic.
//
// Whitelist (kept in the URL so the cache key still differentiates them —
// these params are read server-side):
//   - `ref`        components/campaignIntro.vue reads it during SSR to pick a
//                  campaign-specific cover video
//   - `previewing` utils/setupCampaignPreview.ts uses it; kept defensively in
//                  case routeRules' query-string matcher works
//
// Everything else (utm_*, fbclid, gclid, valor, etc.) is stripped. Those are
// either consumed client-side (window.location.search), or on routes that
// aren't cached anyway (donation / donations / receipt pages).
//
// Both `req.url` and `req.originalUrl` must be overwritten: h3 sets
// `originalUrl` before middleware runs (h3/dist/index.mjs:1984) and Nitro's
// cache key reads it first.

const KEEP_PARAMS = new Set(['ref', 'previewing']);

export default defineEventHandler((event) => {
  const url = event.node.req.url || '';
  const qIndex = url.indexOf('?');
  if (qIndex === -1) return;

  const pathname = url.slice(0, qIndex);
  const original = new URLSearchParams(url.slice(qIndex + 1));

  const kept = new URLSearchParams();
  for (const [key, value] of original) {
    if (KEEP_PARAMS.has(key)) kept.append(key, value);
  }

  const keptStr = kept.toString();
  const normalized = keptStr ? `${pathname}?${keptStr}` : pathname;

  event.node.req.url = normalized;
  event.node.req.originalUrl = normalized;
});
