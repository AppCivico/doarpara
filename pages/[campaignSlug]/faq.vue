<template>
  <article
    v-if="Array.isArray(faq) && faq?.length"
    class="tab-list__item faq-page"
    role="tabpanel"
  >
    <h2 class="visually-hidden">
      {{ $t('faq.title') }}
    </h2>

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
import { useCampaignStore } from '@/store/campaign.ts';

const campaignStore = useCampaignStore();

const { campaign } = storeToRefs(campaignStore);

definePageMeta({
  name: 'faq',
  // TO-DO: localize routes.
  // Currently, `localePath()` and `NuxtLinkLocale` do not support complex roue objects
  path: '/:campaignSlug/perguntas-frequentes',
});

const faq = computed(() => (Array.isArray(campaign.value?.faq?.list)
  ? campaign.value?.faq?.list
    .filter((x) => x.question && x.answer)
  : []));
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
