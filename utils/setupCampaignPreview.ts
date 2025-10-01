import { useCampaignStore } from '~/store/campaign.ts';

/**
 * Checks if the current page is in preview mode
 * @returns true if the ?previewing query parameter is present
 */
export function isPreviewMode(): boolean {
  const route = useRoute();
  return route.query.previewing !== undefined;
}

/**
 * Sets up campaign preview mode
 * Handles the message flow with parent window for live preview
 * @returns Object with preview token and error (if any)
 */
export async function setupCampaignPreview() {
  const campaignStore = useCampaignStore();
  const runtimeConfig = useRuntimeConfig();
  const allowedOrigin = runtimeConfig.public.controlPanelOrigin;

  // Setup the preview update listener
  campaignStore.setupPreviewUpdateListener();

  // Notify parent window that we're waiting for preview token
  if (allowedOrigin && window.parent) {
    window.parent.postMessage({
      type: 'WAITING_FOR_PREVIEW_TOKEN',
    }, allowedOrigin);
  }

  // Wait for first PROVIDE_PREVIEW_TOKEN message before fetching
  const previewToken = await campaignStore.getPreviewToken();

  return { previewToken };
}

/**
 * Notifies parent window about preview result
 * @param error - Error object if preview failed, null if successful
 */
export function notifyPreviewResult(error: any = null) {
  const runtimeConfig = useRuntimeConfig();
  const allowedOrigin = runtimeConfig.public.controlPanelOrigin;

  if (!allowedOrigin || !window.parent) return;

  if (error) {
    window.parent.postMessage({
      type: 'PREVIEW_ERROR',
      error: {
        message: error.message || 'Unknown error',
        statusCode: error.statusCode,
      },
    }, allowedOrigin);
  } else {
    window.parent.postMessage({
      type: 'PREVIEW_READY',
    }, allowedOrigin);
  }
}
