# Edge Cache - DoarPara

This document describes the edge caching implementation and how to programmatically purge the cache when campaigns are updated.

## Overview

DoarPara uses **NuxtHub cache** powered by **Cloudflare Workers KV** to cache SSR-rendered campaign pages at the edge for improved performance.

## Configuration

### Cache Settings

- **Cache duration**: Configurable via `EDGE_CACHE_DURATION` environment variable (default: 30 seconds)
- **Stale-while-revalidate**: Enabled (serves stale content while fetching fresh data)
- **Stale max age**: 60 seconds

### Cached Routes

- `/**` - All campaign pages (30 seconds by default)

### Excluded Routes (Never Cached)

- `/doar/**` - Donation pages
- `/doacoes/**` - Donations list pages
- `/recibos/**` - Receipt pages
- `/**?previewing*` - Preview mode (any page with `?previewing` parameter)

### Configuration Files

- [nuxt.config.ts](nuxt.config.ts) - Cache route rules and NuxtHub config
- [wrangler.jsonc](wrangler.jsonc) - KV namespace bindings and environment variables

## KV Namespace Bindings

The cache uses Cloudflare Workers KV with the binding name `CACHE`:

- **Production**: KV namespace ID `e286ca3286a846feb0fd44d72d819b2d`
- **Preview**: KV namespace ID `a77cb110e33b4bbb8fa672168d741fda`

## Programmatic Cache Purging

When a campaign is updated from the backend, you should purge its cache to ensure users see fresh content immediately.

### Method 1: Purge Specific Campaign (Recommended)

Delete the specific cache entry for the updated campaign using the Cloudflare KV API.

#### API Request

```bash
DELETE https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{key}
```

#### Parameters

- `account_id`: Your Cloudflare account ID
- `namespace_id`:
  - Production: `e286ca3286a846feb0fd44d72d819b2d`
  - Preview: `a77cb110e33b4bbb8fa672168d741fda`
- `key`: The cache key for the campaign page

#### Cache Key Format

NuxtHub generates cache keys in the format:

```
nitro:handlers:{route_path}.html
```

For a campaign with slug `minha-campanha`, the key would be:

```
nitro:handlers:/minha-campanha.html
```

#### Example: cURL

```bash
curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/e286ca3286a846feb0fd44d72d819b2d/values/nitro:handlers:/minha-campanha.html" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json"
```

#### Example: Node.js

```javascript
async function purgeCampaignCache(campaignSlug, environment = 'production') {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  // Select namespace based on environment
  const namespaceId = environment === 'production'
    ? 'e286ca3286a846feb0fd44d72d819b2d'  // Production
    : 'a77cb110e33b4bbb8fa672168d741fda'; // Preview

  // Generate cache key
  const cacheKey = `nitro:handlers:/${campaignSlug}.html`;

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(cacheKey)}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    console.log(`✓ Cache purged for campaign: ${campaignSlug}`);
    return true;
  } else {
    const error = await response.json();
    console.error(`✗ Failed to purge cache:`, error);
    return false;
  }
}

// Usage
await purgeCampaignCache('minha-campanha', 'production');
```

#### Example: Python

```python
import requests
import os
from urllib.parse import quote

def purge_campaign_cache(campaign_slug, environment='production'):
    account_id = os.getenv('CLOUDFLARE_ACCOUNT_ID')
    api_token = os.getenv('CLOUDFLARE_API_TOKEN')

    # Select namespace based on environment
    namespace_id = (
        'e286ca3286a846feb0fd44d72d819b2d' if environment == 'production'
        else 'a77cb110e33b4bbb8fa672168d741fda'
    )

    # Generate cache key
    cache_key = f'nitro:handlers:/{campaign_slug}.html'

    url = f'https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{quote(cache_key, safe="")}'

    headers = {
        'Authorization': f'Bearer {api_token}',
        'Content-Type': 'application/json',
    }

    response = requests.delete(url, headers=headers)

    if response.ok:
        print(f'✓ Cache purged for campaign: {campaign_slug}')
        return True
    else:
        print(f'✗ Failed to purge cache: {response.json()}')
        return False

# Usage
purge_campaign_cache('minha-campanha', 'production')
```

### Method 2: Purge All Cache (Nuclear Option)

To purge the entire cache (all campaigns), you can delete all keys in the KV namespace.

**⚠️ Warning**: This will purge cache for ALL campaigns, causing temporary performance degradation until caches rebuild.

#### API Request

```bash
DELETE https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/bulk
```

#### Example: cURL

```bash
# Get list of all keys
curl "https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/keys" \
  -H "Authorization: Bearer {api_token}" > keys.json

# Delete all keys (requires list of keys in body)
curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/bulk" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d @keys.json
```

### Method 3: Wait for Cache Expiration

If the update is not urgent, you can simply wait for the cache to expire naturally:

- **Default**: 30 seconds (configurable via `EDGE_CACHE_DURATION`)
- **Stale content**: Served for up to 60 additional seconds while revalidating

## Authentication

### Creating a Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **My Profile** → **API Tokens**
2. Click **Create Token**
3. Use the **Edit Cloudflare Workers** template or create custom token with:
   - Permissions: `Account > Workers KV Storage > Edit`
   - Account Resources: Include your account
4. Copy the token and store it securely

### Required Environment Variables

For the backend to purge cache, set these environment variables:

```bash
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
```

## Cache Key Discovery

If you're unsure about the exact cache key format, you can list all keys in the KV namespace:

```bash
curl "https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/keys" \
  -H "Authorization: Bearer {api_token}"
```

This will return a list of all cached keys, allowing you to identify the pattern.

## Testing Cache Purging

### 1. Verify Cache is Working

```bash
# First request (cache MISS)
curl -I https://doarpara.com.br/minha-campanha

# Second request (cache HIT - should be faster)
curl -I https://doarpara.com.br/minha-campanha
```

### 2. Purge the Cache

Use one of the methods above to purge the campaign cache.

### 3. Verify Cache was Purged

```bash
# This should be slow again (cache MISS)
curl -I https://doarpara.com.br/minha-campanha
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

1. Verify the API token has correct permissions
2. Check the cache key format matches exactly
3. Ensure you're using the correct namespace ID for the environment
4. Check Cloudflare API response for error details

### Different Cache Keys

If Nitro's cache key format changes in future versions, use the key listing API to discover the new format:

```bash
curl "https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/keys" \
  -H "Authorization: Bearer {api_token}"
```

## API References

- [Cloudflare KV API Documentation](https://developers.cloudflare.com/api/operations/workers-kv-namespace-delete-key-value-pair)
- [NuxtHub Cache Documentation](https://hub.nuxt.com/docs/features/cache)
- [Nitro Cache Documentation](https://nitro.build/guide/cache)

## Best Practices

1. **Purge only when necessary** - Cache expires automatically in 30 seconds
2. **Purge specific campaigns** - Avoid purging entire cache unless absolutely needed
3. **Handle errors gracefully** - Cache purge failures should not break campaign updates
4. **Log purge operations** - Track when and why caches are purged for debugging
5. **Test in preview first** - Verify cache purging works in preview environment before production

## Example: Backend Integration

Here's a complete example of integrating cache purging into a campaign update endpoint:

```javascript
// Backend API endpoint (Node.js/Express example)
app.put('/api/campaigns/:slug', async (req, res) => {
  try {
    // 1. Update campaign in database
    const campaign = await updateCampaign(req.params.slug, req.body);

    // 2. Purge frontend cache (fire and forget)
    purgeCampaignCache(req.params.slug, 'production').catch(err => {
      console.error('Failed to purge cache:', err);
      // Don't fail the request if cache purge fails
    });

    // 3. Return success
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

This ensures the campaign is updated even if cache purging fails, preventing cache issues from blocking critical operations.
