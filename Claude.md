# Campaign Store Message Listener

This document describes the window message listener implementation for live preview of campaigns from a parent window (control panel).

## Overview

The campaign store (`useCampaignStore`) listens for `postMessage` events from a parent window to enable live preview functionality with real-time updates.

## Setup

When accessing a campaign page with the `?previewing` query parameter, the message listener is automatically initialized in [[campaignSlug].vue](pages/[campaignSlug].vue).

## Environment Configuration

The listener validates that messages come from an authorized origin defined in the environment variable:

- **Development**: `CONTROL_PANEL_ORIGIN=http://localhost:3001` (in `.env`)
- **Production**: `CONTROL_PANEL_ORIGIN=https://painel.doarpara.com.br` (in `.env.production`)

## Preview Flow

### 1. Initial Setup

Access the campaign with the preview parameter:

```url
https://doarpara.com.br/campaign-slug?previewing
```

The iframe will send a message to the parent:

```javascript
{
  type: 'WAITING_FOR_PREVIEW_TOKEN'
}
```

### 2. Provide Preview Token

Parent window must respond with:

```javascript
iframe.contentWindow.postMessage({
  type: 'PROVIDE_PREVIEW_TOKEN',
  previewToken: 'your-preview-token-here'
}, 'https://doarpara.com.br');
```

The preview token is used as the `live_preview_token` parameter when fetching campaign data from the API.

### 3. Preview Ready

After fetching campaign data, the iframe will send one of:

**Success:**

```javascript
{
  type: 'PREVIEW_READY'
}
```

**Error:**

```javascript
{
  type: 'PREVIEW_ERROR',
  error: {
    message: 'Error message',
    statusCode: 404
  }
}
```

### 4. Real-time Updates

To update campaign properties in real-time, send:

```javascript
iframe.contentWindow.postMessage({
  type: 'PREVIEW_UPDATE',
  properties: {
    color: 'blue',
    picture: 'https://example.com/avatar.jpg',
    video_url: 'https://youtube.com/watch?v=...',
    video_cover: 'https://example.com/cover.jpg',
    username: 'campaign-slug',
    name: 'Campaign Name'
  }
}, 'https://doarpara.com.br');
```

## Property Mapping

The incoming message properties are transformed to match the Campaign schema:

| Message Property | Campaign Property | Description |
|-----------------|-------------------|-------------|
| `color` | `theme` | Campaign theme color |
| `picture` | `fundraiser.avatar` | Fundraiser avatar image |
| `video_url` | `video` | Campaign video URL |
| `video_cover` | `cover` | Campaign cover image |
| `username` | `slug` | Campaign slug/URL identifier |
| `name` | `fundraiser.name` | Fundraiser name |
| `is_published` | _(not used)_ | Ignored |
| `show_external_donations` | _(not used)_ | Ignored |
| `faq_tab_active` | _(not used)_ | Ignored |

## Message Types

| Message Type | Direction | Purpose | Required Fields |
|-------------|-----------|---------|----------------|
| `WAITING_FOR_PREVIEW_TOKEN` | Iframe → Parent | Indicates iframe is ready and waiting for token | None |
| `PROVIDE_PREVIEW_TOKEN` | Parent → Iframe | Provides authentication token for preview | `previewToken` (string) |
| `PREVIEW_READY` | Iframe → Parent | Indicates campaign data loaded successfully | None |
| `PREVIEW_ERROR` | Iframe → Parent | Indicates error loading campaign data | `error` (object with `message`, `statusCode`) |
| `PREVIEW_UPDATE` | Parent → Iframe | Updates campaign properties in real-time | `properties` (object) |

## Implementation Details

### Files

- **[pages/[campaignSlug].vue](pages/[campaignSlug].vue)** - Preview mode initialization
  - Detects `?previewing` query parameter
  - Sends `WAITING_FOR_PREVIEW_TOKEN` message
  - Waits for `PROVIDE_PREVIEW_TOKEN` response
  - Fetches campaign data with token
  - Sends `PREVIEW_READY` or `PREVIEW_ERROR` message
  - Sets up real-time update listener

- **[store/campaign.ts](store/campaign.ts)** - Store actions for message handling
  - `getPreviewToken()` - Waits for and returns preview token from parent
  - `setupPreviewUpdateListener()` - Listens for `PREVIEW_UPDATE` messages
  - `updateCampaignFromMessage()` - Updates campaign with transformed properties

- **[utils/transformMessageToCampaign.ts](utils/transformMessageToCampaign.ts)** - Property transformation utility
  - Transforms message properties to Campaign schema
  - Handles nested object updates (e.g., `fundraiser.avatar`, `fundraiser.name`)

### Security

- **Origin Validation**: Only messages from the configured `CONTROL_PANEL_ORIGIN` are processed
- **Query Parameter**: Preview mode only activates with `?previewing` parameter
- **Type Checking**: Different message types for different purposes
- **Property Validation**: Transformation function ensures type safety

## Complete Example

```javascript
// Parent window (control panel)
const iframe = document.createElement('iframe');
iframe.src = 'https://doarpara.com.br/campaign-slug?previewing';
document.body.appendChild(iframe);

const targetOrigin = 'https://doarpara.com.br';

// Listen for messages from iframe
window.addEventListener('message', (event) => {
  if (event.origin !== targetOrigin) return;

  switch (event.data.type) {
    case 'WAITING_FOR_PREVIEW_TOKEN':
      // Send preview token
      iframe.contentWindow.postMessage({
        type: 'PROVIDE_PREVIEW_TOKEN',
        previewToken: 'abc123xyz'
      }, targetOrigin);
      break;

    case 'PREVIEW_READY':
      console.log('Preview loaded successfully');
      // Now you can send real-time updates
      iframe.contentWindow.postMessage({
        type: 'PREVIEW_UPDATE',
        properties: {
          color: 'blue',
          name: 'Updated Campaign Name'
        }
      }, targetOrigin);
      break;

    case 'PREVIEW_ERROR':
      console.error('Preview error:', event.data.error);
      break;
  }
});
```
