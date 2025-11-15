<template>
  <article
    v-if="Array.isArray(faq) && faq?.length"
    class="tab-list__item faq-page"
    role="tabpanel"
    :aria-busy="pending"
  >
    <h2 class="visually-hidden">
      {{ $t('faq.title') }}
    </h2>

    <errorMessagePanel :error="error" @close="flushError" />

    <section
      v-for="(questionAndAnswer, i) in faq"
      :key="i"
      role="region"
      class="tab-list text-body__tab-list faq-page__question-and-answer"
    >
      <h3 class="faq-page__question" open>
        {{ questionAndAnswer.question }}
      </h3>

      <MDC
        v-if="questionAndAnswer.answer"
        :value="questionAndAnswer.answer"
        tag="div"
        class="faq-page__answer"
      />
    </section>
  </article>
</template>
<script setup lang="ts">
import type { FAQ } from '@/doar-para.d.ts';

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

definePageMeta({
  name: 'faq',
  // TO-DO: localize routes.
  // Currently, `localePath()` and `NuxtLinkLocale` do not support complex roue objects
  path: '/:campaignSlug/perguntas-frequentes',
});

const pending = ref(false);
const error = ref<any>(null);
const faqData = ref<FAQ | null>(null);

const faq = computed(() => (Array.isArray(faqData.value?.list)
  ? faqData.value?.list
    .filter((x) => x.question && x.answer)
  : []));

const fetchFaq = async () => {
  pending.value = true;
  error.value = null;

  try {
    const { campaignSlug } = route.params;
    const fullUrl = `${runtimeConfig.public.publicApiBase}/campaign/${campaignSlug}/faq`;

    faqData.value = await $fetch<FAQ>(fullUrl, {
      method: 'GET',
      timeout: 10000,
    });
  } catch (err) {
    error.value = err;
    if (import.meta.dev) {
      // eslint-disable-next-line no-console
      console.error('[FAQ Page] Failed to fetch FAQ:', err);
    }
  } finally {
    pending.value = false;
  }
};

const flushError = () => {
  error.value = null;
  fetchFaq();
};

onMounted(() => {
  fetchFaq();
});
</script>
<style lang="scss">
.faq-page {
}

.faq-page__question-and-answer {
}

.faq-page__answer,
.faq-page__question {
}

.faq-page__answer {
}

.faq-page__answer {
}
</style>
