<template>
  <div class="page-wrapper page-wrapper--receipt container">
    <Html class="background-page-receipt" :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir">
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
        <slot />
      </Body>
    </Html>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true,
});

const title = computed(() => (route.meta.title
  ? `${route.meta.title} • ${runtimeConfig.public.title}`
  : runtimeConfig.public.title));
</script>
<style lang="scss" scoped>
.page-wrapper--receipt {
  max-width: my.$max-width--dialog;
  /* 660px */
  padding-top: my.$gutter * 4;
  padding-bottom: my.$gutter * 4;

  // @media screen and (min-width: my.breakpoint('tablet__portrait')) {
  //   padding-top: my.$gutter * 7;
  //   padding-bottom: my.$gutter * 7;
  // }
}
</style>
