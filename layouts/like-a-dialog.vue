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
          <h1>{{ campaign?.name }}</h1>

          <nav>
            <NuxtLink :to="{ name: 'campaign' }" class="link-like-a-close">
              {{ $t('backToCampaign') }}
            </NuxtLink>
          </nav>
        </header>
        <NuxtLoadingIndicator color="black" />
        <slot />
      </Body>
    </Html>
  </div>
</template>
<script setup lang="ts">
import { useCampaignStore } from '@/store/campaign.ts';

const appConfig = useAppConfig();
const route = useRoute();

const campaignStore = useCampaignStore();
const { campaign } = storeToRefs(campaignStore);

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true,
});

const title = computed(() => (route.meta.title
  ? `${route.meta.title} • ${appConfig.title}`
  : appConfig.title));
</script>
<style lang="scss" scoped>
$max-width: 41.25rem;

.page-wrapper--like-a-dialog {
  position: relative;

  max-width: $max-width;
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

.link-like-a-close {
  @include my.image-replacement;

  position: absolute;
  top: my.$gutter;
  right: my.$gutter;

  width: my.$gutter * 1.5;
  height: my.$gutter * 1.5;

  background-image: my.image('icons/x-mark.svg');
  background-position: 50%;
  background-size: contain;
  opacity: 0.35;

  &:hover,
  &:focus {
    opacity: 1;
  }

  @media screen and (min-width: $max-width + my.$gutter * 2) {
    position: fixed;
    top: my.$gutter * 2;
    right: my.$gutter * 2;
  }
}
</style>
