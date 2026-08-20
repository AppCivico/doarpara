# Edge Cache - DoarPara

This document describes the edge caching implementation and how to programmatically purge the cache when campaigns are updated.

## Overview

DoarPara uses **NuxtHub cache** powered by **Cloudflare Workers KV** to cache SSR-rendered campaign pages at the edge for improved performance.

## Configuration

### Cache Settings

There are two independent caching layers:

**Layer 1 — Cloudflare CDN** (before the Worker runs): controlled by the `Cache-Control` HTTP response header set in [`server/middleware/headers.ts`](server/middleware/headers.ts) for `/<slug>` campaign pages:

- `s-maxage` — how long the CDN keeps the response fresh. Configurable via `EDGE_CACHE_DURATION` (default and production: 30 seconds).
- `stale-while-revalidate` — how long the CDN may serve a stale copy while fetching a fresh response from the Worker in the background. Configurable via `STALE_MAX_AGE` (default and production: 300 seconds / 5 minutes). Raising this from 30 s → 300 s significantly improves cache-hit rates during low-traffic periods where requests are more than 30 s apart.
- `stale-if-error=86400` — how long the CDN may serve a stale copy when the origin returns a 5xx. Set to 24 hours so cached campaign pages remain visible during Worker crashes or deploys.
- `max-age` — browser-side freshness. Configurable via `BROWSER_CACHE_DURATION` (default: 30 seconds).

Total CDN staleness window: up to `s-maxage + stale-while-revalidate` = ~5.5 minutes under normal conditions, or up to 24 hours if the origin is unavailable.

**Layer 2 — Worker KV** (inside the Worker, after the CDN miss): controlled by `routeRules` in [`nuxt.config.ts`](nuxt.config.ts):

- **Cache duration**: `EDGE_CACHE_DURATION` (default and production: 30 seconds)
- **Stale-while-revalidate**: Enabled — `STALE_MAX_AGE` (default and production: 300 seconds / 5 minutes). Wide enough to absorb `waitUntil` write cancellations and the post-deploy thundering herd caused by Nitro's per-build `integrity` invalidation. Matches the client-side polling interval (`CAMPAIGN_POOLING_INTERVAL=300000`), so user-visible staleness is capped at ~5 minutes regardless. Total KV staleness: ~5.5 minutes.

### Cached Routes

- `/**` — All campaign pages and their cacheable sub-routes (`/<slug>`, `/<slug>/metas`, `/<slug>/depoimentos`, `/<slug>/perguntas-frequentes`)

### Query-string handling

Cache keys are derived from the request URL. To prevent unbounded fragmentation from marketing and tracking parameters (`?utm_*`, `?fbclid`, `?gclid`, etc.), [`server/middleware/cache-key-strip-query.ts`](server/middleware/cache-key-strip-query.ts) strips query strings before the cache layer runs. Only two params are kept (whitelist):

- `ref` — read server-side by [`components/campaignIntro.vue`](components/campaignIntro.vue) to select a ref-specific cover video; preserved in the cache key so each ref value gets its own entry
- `previewing` — kept defensively so preview-mode routing still works

All other query parameters (UTM, fbclid, gclid, valor, etc.) are removed at the server boundary. `/<slug>`, `/<slug>?utm_source=fb`, `/<slug>?fbclid=ABC`, and `/<slug>?valor=20` all map to the **same** cache key. Client-side JavaScript still sees the original query string via `window.location.search` and `useRoute().query` — the stripping only affects what the SSR cache layer sees.

### Excluded Routes (Never Cached)

Two URL-pattern families need exclusion because each request is user-specific or carries server-side state:

- `/recibo/**` and `/recibos/**` — top-level receipt pages (each receipt has a unique signed ID)
- `/*/doar`, `/*/doacoes`, `/*/recibo`, `/*/recibos` — slug-nested donation, donations-list, and receipt pages
- `/**?previewing*` — preview mode (any page with `?previewing` parameter)

> Note: Nitro's route matcher (radix3) only allows `**` at the *end* of a pattern, so slug-nested rules use `*` (single-segment wildcard) for the slug. A previous `/doar/**` rule was a no-op because the real donation URL is `/<slug>/doar`, not `/doar/<x>`.

### Configuration Files

- [nuxt.config.ts](nuxt.config.ts) - Cache route rules and NuxtHub config
- [wrangler.jsonc](wrangler.jsonc) - KV namespace bindings and environment variables

## KV Namespace Bindings

The cache uses Cloudflare Workers KV under Appcivico's Cloudflare account:

| Environment | Binding name       | Namespace ID                                        |
|-------------|--------------------|-----------------------------------------------------|
| Production  | `production-CACHE` | see `env.production.kv_namespaces` in [wrangler.jsonc](wrangler.jsonc) |
| Preview     | `CACHE`            | see `kv_namespaces` in [wrangler.jsonc](wrangler.jsonc)                |

The account ID can be found in the Cloudflare Dashboard URL or under **My Profile** → **API Tokens** → any token's details.

> **Note**: You may see `cf-cache-status: DYNAMIC` on some responses. This means the CDN served the response without a CDN-layer cache hit — either because the entry had expired, the CDN had no entry yet, or the response came from a part of the site that the CDN doesn't cache (non-`/<slug>` pages). Campaign pages (`/<slug>`) with `stale-while-revalidate=300` should frequently return `cf-cache-status: HIT` or `cf-cache-status: STALE` within the 5.5-minute window. `DYNAMIC` on those pages just means the CDN window had also expired before this request.

## Cache Key Format

NuxtHub/Nitro generates cache keys in the format:

```
nitro:routes:_:{slug_normalized}.{hash}.json
```

- The "slug" portion is the request **pathname** with non-word characters removed via `/\W/g` and truncated to **16 characters** (e.g., `igor-oliveira` → `igoroliveira`, `pt-ribeirao-preto-sp` → `ptribeiraopretos` because of the 16-char cap). Underscores are word characters and are preserved (`renato_cron` stays `renato_cron`).
- The hash is **deterministic** on the post-middleware request URL — `hash("/pacheco")` always produces the same 10-character string. After the query-string middleware (see "Query-string handling" above), every UTM-tagged variant of the same URL produces the same hash, so they share one cache key.
- One cache entry exists per (slug × cacheable sub-route × `ref` value). Cacheable sub-routes today: `/<slug>`, `/<slug>/metas`, `/<slug>/depoimentos`, `/<slug>/perguntas-frequentes`. Donation, donations-list, and receipt routes are excluded.

For a campaign with slug `minha-campanha`, keys look like:

```
nitro:routes:_:minhacampanha.UhupfLmBE8.json          # /minha-campanha
nitro:routes:_:minhacampanha.QVKe7ZPFnH.json          # /minha-campanha?ref=video1
nitro:routes:_:minhacampanhametas.KviNRbOSpL.json     # /minha-campanha/metas
```

Although the hash is deterministic, recovering it from a slug alone requires reproducing Nitro's hashing function. So purging in practice still uses **prefix listing + delete** — e.g. the prefix `nitro:routes:_:minhacampanha` matches all of the above (substring match on the 16-char-truncated pathname).

## Authentication

### Creating a Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **My Profile** → **API Tokens**
2. Click **Create Token**
3. Create a custom token with:
   - **Permissions**: `Account > Workers KV Storage > Edit`
   - **Account Resources**: Appcivico's Account
4. Copy the token and store it securely

### Required Environment Variables

```bash
CLOUDFLARE_ACCOUNT_ID=your-account-id                  # Cloudflare Dashboard or My Profile → API Tokens
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_KV_NAMESPACE_ID_PRODUCTION=your-namespace-id  # see wrangler.jsonc → env.production.kv_namespaces
CLOUDFLARE_KV_NAMESPACE_ID_PREVIEW=your-namespace-id     # see wrangler.jsonc → kv_namespaces
```

## Programmatic Cache Purging

### Method 1: Purge Specific Campaign (Recommended)

Since cache keys have an unpredictable hash suffix, purging requires two steps:
1. List all keys with the campaign's prefix
2. Delete each matching key

#### Example: cURL (manual)

```bash
ACCOUNT_ID="your-account-id"         # Cloudflare Dashboard URL or My Profile → API Tokens
NAMESPACE_ID="your-namespace-id"     # see wrangler.jsonc → env.production.kv_namespaces
API_TOKEN="your-api-token"
SLUG="minha-campanha"
PREFIX="nitro:routes:_:${SLUG//[^a-zA-Z0-9_]/}"  # removes non-word characters (keeps underscores)

# 1. List keys with that prefix
curl "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/keys?prefix=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${PREFIX}', safe=''))")" \
  -H "Authorization: Bearer ${API_TOKEN}"

# 2. Delete each key returned (repeat for each)
curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/$(python3 -c "import urllib.parse; print(urllib.parse.quote('nitro:routes:_:minhacampanha.REPLACE_HASH.json', safe=''))")" \
  -H "Authorization: Bearer ${API_TOKEN}"
```

#### Example: Python

```python
import requests
import os

def purge_campaign_cache(campaign_slug, environment='production'):
    account_id = os.getenv('CLOUDFLARE_ACCOUNT_ID')
    api_token = os.getenv('CLOUDFLARE_API_TOKEN')

    # Namespace IDs are in wrangler.jsonc:
    #   production → env.production.kv_namespaces[0].id
    #   preview    → kv_namespaces[0].id
    namespace_id = os.getenv(
        'CLOUDFLARE_KV_NAMESPACE_ID_PRODUCTION' if environment == 'production'
        else 'CLOUDFLARE_KV_NAMESPACE_ID_PREVIEW'
    )

    headers = {
        'Authorization': f'Bearer {api_token}',
        'Content-Type': 'application/json',
    }

    # Nitro removes non-word characters (/\W/g) from keys — underscores are kept
    import re
    prefix = f"nitro:routes:_:{re.sub(r'\W', '', campaign_slug)}"

    # 1. List all keys matching this campaign
    list_url = f'https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/keys'
    response = requests.get(list_url, headers=headers, params={'prefix': prefix})
    keys = response.json().get('result', [])

    if not keys:
        print(f'No cache entries found for: {campaign_slug}')
        return True

    # 2. Delete each key
    purged = 0
    for key in keys:
        key_name = key['name']
        from urllib.parse import quote
        delete_url = f'https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{quote(key_name, safe="")}'
        delete_response = requests.delete(delete_url, headers=headers)
        if delete_response.ok:
            purged += 1
        else:
            print(f'✗ Failed to delete key {key_name}: {delete_response.json()}')

    print(f'✓ Purged {purged}/{len(keys)} cache entries for: {campaign_slug}')
    return purged == len(keys)

# Usage
purge_campaign_cache('minha-campanha', 'production')
```

#### Example: Perl

```perl
use strict;
use warnings;
use LWP::UserAgent;
use HTTP::Request;
use URI;
use URI::Escape;
use JSON;

sub purge_campaign_cache {
    my ($campaign_slug, $environment) = @_;
    $environment //= 'production';

    my $account_id   = $ENV{CLOUDFLARE_ACCOUNT_ID};
    my $api_token    = $ENV{CLOUDFLARE_API_TOKEN};
    my $namespace_id = $environment eq 'production'
        ? $ENV{CLOUDFLARE_KV_NAMESPACE_ID_PRODUCTION}  # see wrangler.jsonc → env.production.kv_namespaces
        : $ENV{CLOUDFLARE_KV_NAMESPACE_ID_PREVIEW};    # see wrangler.jsonc → kv_namespaces

    my $ua = LWP::UserAgent->new;
    my %headers = (Authorization => "Bearer $api_token", 'Content-Type' => 'application/json');

    # Nitro removes non-word characters (/\W/g) from keys — underscores are kept
    (my $slug_normalized = $campaign_slug) =~ s/\W//g;
    my $prefix = "nitro:routes:_:$slug_normalized";

    # 1. List all keys matching this campaign
    my $list_uri = URI->new("https://api.cloudflare.com/client/v4/accounts/$account_id/storage/kv/namespaces/$namespace_id/keys");
    $list_uri->query_form(prefix => $prefix);

    my $list_req = HTTP::Request->new(GET => $list_uri);
    $list_req->header(%headers);
    my $list_res = $ua->request($list_req);
    my $keys = decode_json($list_res->content)->{result} // [];

    unless (@$keys) {
        print "No cache entries found for: $campaign_slug\n";
        return 1;
    }

    # 2. Delete each key
    my $purged = 0;
    for my $key (@$keys) {
        my $encoded = uri_escape($key->{name});
        my $delete_url = "https://api.cloudflare.com/client/v4/accounts/$account_id/storage/kv/namespaces/$namespace_id/values/$encoded";
        my $del_req = HTTP::Request->new(DELETE => $delete_url);
        $del_req->header(%headers);
        my $del_res = $ua->request($del_req);
        if ($del_res->is_success) {
            $purged++;
        } else {
            warn "Failed to delete key $key->{name}: " . $del_res->content . "\n";
        }
    }

    printf "Purged %d/%d cache entries for: %s\n", $purged, scalar @$keys, $campaign_slug;
    return $purged == scalar @$keys;
}

# Usage
purge_campaign_cache('minha-campanha', 'production');
```

#### Example: Node.js

```javascript
async function purgeCampaignCache(campaignSlug, environment = 'production') {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  // Namespace IDs are in wrangler.jsonc:
  //   production → env.production.kv_namespaces[0].id
  //   preview    → kv_namespaces[0].id
  const namespaceId = environment === 'production'
    ? process.env.CLOUDFLARE_KV_NAMESPACE_ID_PRODUCTION
    : process.env.CLOUDFLARE_KV_NAMESPACE_ID_PREVIEW;

  const headers = {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
  };

  // Nitro removes non-word characters (/\W/g) from keys — underscores are kept
  const prefix = `nitro:routes:_:${campaignSlug.replace(/\W/g, '')}`;

  // 1. List all keys matching this campaign
  const listUrl = new URL(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/keys`);
  listUrl.searchParams.set('prefix', prefix);

  const listResponse = await fetch(listUrl, { headers });
  const { result: keys = [] } = await listResponse.json();

  if (!keys.length) {
    console.log(`No cache entries found for: ${campaignSlug}`);
    return true;
  }

  // 2. Delete each key
  let purged = 0;
  for (const { name } of keys) {
    const deleteUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(name)}`;
    const deleteResponse = await fetch(deleteUrl, { method: 'DELETE', headers });
    if (deleteResponse.ok) {
      purged++;
    } else {
      const error = await deleteResponse.json();
      console.error(`✗ Failed to delete key ${name}:`, error);
    }
  }

  console.log(`✓ Purged ${purged}/${keys.length} cache entries for: ${campaignSlug}`);
  return purged === keys.length;
}

// Usage
await purgeCampaignCache('minha-campanha', 'production');
```

### Method 2: Purge All Cache (Nuclear Option)

**⚠️ Warning**: This will purge cache for ALL campaigns, causing temporary performance degradation until caches rebuild.

```bash
ACCOUNT_ID="your-account-id"         # Cloudflare Dashboard URL or My Profile → API Tokens
NAMESPACE_ID="your-namespace-id"     # see wrangler.jsonc → env.production.kv_namespaces
API_TOKEN="your-api-token"

# Get list of all keys
curl "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/keys" \
  -H "Authorization: Bearer ${API_TOKEN}" > keys.json

# Delete all keys in bulk
curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/bulk" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @keys.json
```

### Method 3: Wait for Cache Expiration

If the update is not urgent, wait for the cache to expire naturally:

Both cache layers must expire before users see fresh content:

- **CDN layer**: `s-maxage=30` (fresh) + `stale-while-revalidate=300` (stale window) = up to **~5.5 minutes**
- **KV layer**: `EDGE_CACHE_DURATION=30` (fresh) + `STALE_MAX_AGE=300` (stale window) = up to **~5.5 minutes**

Worst case: ~5.5 minutes total (the two layers run in parallel — once the CDN misses and hits the Worker, the KV stale window is all that's left).

## Cache Key Discovery

To inspect what is currently cached for a specific campaign:

```bash
ACCOUNT_ID="your-account-id"         # Cloudflare Dashboard URL or My Profile → API Tokens
NAMESPACE_ID="your-namespace-id"     # see wrangler.jsonc → env.production.kv_namespaces
API_TOKEN="your-api-token"
SLUG="minha-campanha"
PREFIX="nitro:routes:_:${SLUG//[^a-zA-Z0-9_]/}"  # removes non-word characters (keeps underscores)

curl "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/keys?prefix=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${PREFIX}', safe=''))")" \
  -H "Authorization: Bearer ${API_TOKEN}"
```

To list all keys in the namespace (no filter):

```bash
curl "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/keys" \
  -H "Authorization: Bearer ${API_TOKEN}"
```

## Example: Backend Integration

Integrate cache purging into the campaign disable/update endpoint (fire-and-forget — don't let cache failures block the operation):

**Python:**

```python
def disable_campaign(campaign_slug):
    # 1. Update status in DB
    update_campaign_status(campaign_slug, disabled=True)

    # 2. Purge frontend cache (non-blocking)
    try:
        purge_campaign_cache(campaign_slug, environment='production')
    except Exception as e:
        log.error(f'Cache purge failed for {campaign_slug}: {e}')
        # Don't raise — the DB update already succeeded
```

**Perl:**

```perl
sub disable_campaign {
    my ($campaign_slug) = @_;

    # 1. Update status in DB
    update_campaign_status($campaign_slug, disabled => 1);

    # 2. Purge frontend cache (non-blocking)
    eval {
        purge_campaign_cache($campaign_slug, 'production');
    };
    if ($@) {
        warn "Cache purge failed for $campaign_slug: $@";
        # Don't die — the DB update already succeeded
    }
}
```

**Node.js:**

```javascript
async function disableCampaign(campaignSlug) {
  // 1. Update status in DB
  await updateCampaignStatus(campaignSlug, { disabled: true });

  // 2. Purge frontend cache (fire and forget)
  purgeCampaignCache(campaignSlug, 'production').catch(err => {
    console.error(`Cache purge failed for ${campaignSlug}:`, err);
    // Don't throw — the DB update already succeeded
  });
}
```

## Monitoring

### Cache Hit Rate

Monitor cache performance in Cloudflare Dashboard:

- **Workers & Pages** → **doarpara** → **Analytics**
- Look for cache hit ratio metrics

### KV Operations

View KV operations and storage usage:

- **Workers & Pages** → **KV** → Select namespace
- Monitor read/write operations and storage consumption

## Troubleshooting

### Cache Not Being Created

Check logs for warnings:

```
IoContext timed out due to inactivity, waitUntil tasks were cancelled
```

This means KV writes are timing out. The cache will eventually work after a few requests.

### Cache Not Being Purged

1. Verify the API token has `Account > Workers KV Storage > Edit` permission
2. Confirm you are using the correct namespace ID for the environment (see table above)
3. Remember the slug must have hyphens removed when building the key prefix
4. List keys first to confirm the exact key names before deleting
5. Check Cloudflare API response body for error details

### `cf-cache-status: DYNAMIC` Does Not Mean Uncached

This header is set by Cloudflare's CDN layer, which never caches Pages Function responses. It does **not** indicate whether the response came from KV cache or live SSR. To check if a page is cached, list the KV keys for that campaign slug.

## API References

- [Cloudflare KV API Documentation](https://developers.cloudflare.com/api/operations/workers-kv-namespace-delete-key-value-pair)
- [NuxtHub Cache Documentation](https://hub.nuxt.com/docs/features/cache)
- [Nitro Cache Documentation](https://nitro.build/guide/cache)

## Best Practices

1. **Purge only when necessary** - Cache expires automatically in production after ~35 seconds
2. **Purge specific campaigns** - Avoid purging entire cache unless absolutely needed
3. **Handle errors gracefully** - Cache purge failures should not break campaign updates
4. **Log purge operations** - Track when and why caches are purged for debugging
5. **Test in preview first** - Verify cache purging works in preview environment before production
