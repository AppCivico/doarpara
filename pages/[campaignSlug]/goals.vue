<template>
  <article
    v-if="goals.length"
    class="tab-list__item goals-page"
    role="tabpanel"
  >
    <section
      v-for="(goal, i) in goals"
      :key="i"
      role="region"
      class="tab-list text-body__tab-list goals-page__goal-item"
    >
      <h2 class="goals-page__goal-amount">
        {{ $n(goal.amount / 100, 'currency', { maximumFractionDigits: 0 }) }}
      </h2>

      <div class="goals-page__goal-title-and-description">
        <h3 v-if="goal.title" class="goals-page__goal-title">
          {{ goal.title }}
        </h3>

        <MDC
          v-if="goal.description"
          :value="goal.description"
          tag="div"
          class="goals-page__goal-description"
        />
        <div
          v-else
          class="goals-page__goal-description"
        >
          <p v-if="currentGoal > goal.amount">
            {{ $t('goalAchieved') }}
          </p>
          <p v-else>
            {{ $t('currentGoal') }}
          </p>
        </div>
      </div>
    </section>
  </article>
</template>
<script setup lang="ts">
import { useCampaignStore } from '@/store/campaign.ts';

const campaignStore = useCampaignStore();

const { campaign } = storeToRefs(campaignStore);

definePageMeta({
  name: 'goals',
  // TO-DO: localize routes.
  // Currently, `localePath()` and `NuxtLinkLocale` do not support complex roue objects
  path: '/:campaignSlug/metas',
});

const donationSources = computed(() => (Array.isArray(campaign.value?.platforms)
  ? combineDonationSources(campaign.value?.platforms)
  : []));

const totalAmount = computed(() => consolidateTotalAmount(donationSources.value));

const currentGoal = computed(() => (Array.isArray(campaign.value?.goal_list)
  ? getCurrentGoal(campaign.value.goal_list, totalAmount.value)
  : 0));

const goals = computed(() => (Array.isArray(campaign.value?.goal_list)
  ? campaign.value?.goal_list
    .filter((x) => x.amount <= currentGoal.value)
    .sort((a, b) => b.amount - a.amount)
  : []));
</script>
<style lang="scss">
.goals-page {
  @media screen and (min-width: my.breakpoint('toggle-table-layout')) {
    display: table;
  }

  section {
    padding-top: my.$gutter;
    padding-bottom: my.$gutter;

    @media screen and (min-width: my.breakpoint('toggle-table-layout')) {
      padding-top: my.$gutter * 3;
      padding-bottom: my.$gutter * 3;
    }
  }
}

.goals-page__goal-item {
  @media screen and (min-width: my.breakpoint('toggle-table-layout')) {
    display: table-row;
  }
}

.goals-page__goal-title-and-description,
.goals-page__goal-amount {
  @media screen and (min-width: my.breakpoint('toggle-table-layout')) {
    display: table-cell;
  }
}

.goals-page__goal-amount {
  white-space: nowrap;

  @media screen and (min-width: my.breakpoint('toggle-table-layout')) {
    width: 3em;
    padding-right: my.$gutter;

    text-align: right;
  }
}

.goals-page__goal-title-and-description {
  @media screen and (min-width: my.breakpoint('toggle-table-layout')) {
    padding-left: my.$gutter;
  }
}

.goals-page__goal-title {}

.goals-page__goal-description {}
</style>
