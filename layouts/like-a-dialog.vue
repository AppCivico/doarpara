<template>
  <div class="page-wrapper page-wrapper--like-a-dialog container">
    <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir">
      <Head>
        <Title>{{ title }}</Title>
        <template v-for="link in head.link" :key="link.id">
          <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
        </template>
        <template v-for="meta in head.meta" :key="meta.id">
          <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
        </template>

        <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <Link rel="manifest" href="/site.webmanifest" />
        <Link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00d182" />
        <Meta name="msapplication-TileColor" content="#00aba9" />
        <Meta name="theme-color" content="#ffffff" />
      </Head>
      <Body>
        <header>
          <h1>
            <span
              v-if="route.meta.title"
            >
              {{ route.meta.title }}
            </span>

            {{ campaign?.name }}
          </h1>

          <nav>
            <NuxtLink
              :to="{ name: 'campaign' }"
              class="dialog__close-button"
            >
              {{ $t('backToCampaign') }}
            </NuxtLink>
          </nav>
        </header>
        <slot />
      </Body>
    </Html>
  </div>
</template>
<script setup lang="ts">
import { useCampaignStore } from '@/store/campaign.ts';
import { isPreviewMode, notifyPreviewResult, setupCampaignPreview } from '@/utils/setupCampaignPreview.ts';

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const campaignStore = useCampaignStore();
const { campaign, error } = storeToRefs(campaignStore);

const head = useLocaleHead();

const title = computed(() => (route.meta.title
  ? `${route.meta.title} • ${runtimeConfig.public.title}`
  : runtimeConfig.public.title));

// Fetch campaign data if not already loaded
if (route.params.campaignSlug && !campaign.value) {
  // Preview mode: wait for token and fetch with it
  if (isPreviewMode() && import.meta.client) {
    const { previewToken } = await setupCampaignPreview();
    const fetchParams = previewToken ? { preview_token: previewToken } : {};
    await campaignStore.fetchCampaignAndRewards(String(route.params.campaignSlug), fetchParams);
    notifyPreviewResult(error.value);
  } else {
    // Normal mode: SSR fetch (but this layout is typically used with .client.vue pages)
    await useAsyncData(
      'campaign',
      () => campaignStore.fetchCampaignAndRewards(String(route.params.campaignSlug)).then(() => true),
    );
  }

  // Throw error if fetch failed
  // In preview mode, only throw non-404 errors (404 is expected if campaign
  // isn't public yet)
  if (error.value) {
    const err = error.value as any;
    const bypass404 = isPreviewMode() && err.statusCode === 404;

    if (!bypass404) {
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.message || 'Error loading campaign',
        fatal: false, // Don't crash SSR, show error page instead
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.page-wrapper--like-a-dialog {
  position: relative;

  max-width: my.$max-width--dialog;
  /* 660px */
  padding-top: my.$gutter * 4;
  padding-bottom: my.$gutter * 4;

  @media screen and (min-width: my.breakpoint('tablet__portrait')) {
    padding-top: my.$gutter * 7;
    padding-bottom: my.$gutter * 7;
  }
}

header {
  text-align: center;
}

header span {
  color: my.palette('neutral');
}

.dialog__close-button {
  background-color: my.palette('neutral', 'white');

  @media screen and (min-width: my.$max-width--dialog + my.$gutter * 2) {
    position: fixed;
    top: my.$gutter;
    right: my.$gutter * 2;

    &:hover,
    &:focus,
    &:active {
      position: fixed;
    }
  }
}
</style>
