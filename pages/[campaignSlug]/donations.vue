<template>
  <article
    class="tab-list__item donations-page"
    role="main"
  >
    <section class="donations-page__indicators">
      <donationsIndicators v-if="campaign" :campaign="campaign" />
    </section>

    <section class="donations-page__receipts">
      <h2>{{ $t('receipts.titles') }}</h2>

      <MDC :value="$t('receipts.description')" tag="div" class="donations-page__receipts-intro" />

      <table
        class="donations-page__receipts-table"
      >
        <colgroup span="5" />
        <col class="col--action">
        <thead>
          <tr>
            <th>{{ $t('receipts.donorName') }}</th>
            <th>{{ $t('naturalPersonIdentification') }}</th>
            <th>{{ $t('receipts.creationDate') }}</th>
            <th>{{ $t('receipts.paymentMethod') }}</th>
            <th class="cell--number">
              {{ $t('receipts.amount') }}
            </th>
            <th />
          </tr>
        </thead>
        <tbody
          v-if="donationsList.length"
          :aria-busy="pending"
        >
          <tr v-for="donation in donationsList" :key="donation.id">
            <td :aria-label="$t('receipts.donorName')">
              {{ donation.donor_name }}
            </td>
            <td :aria-label="$t('naturalPersonIdentification')">
              {{ donation.donor_natural_person_id }}
            </td>
            <td :aria-label="$t('receipts.creationDate')">
              {{ $d(new Date(donation.creation_date), 'medium') }}
            </td>
            <td :aria-label="$t('receipts.paymentMethod')">
              {{ $t(`paymentMethods.${donation.payment_method}`) }}
            </td>
            <td :aria-label="$t('receipts.amount')" class="cell--number">
              {{ $n(donation.amount, 'currency', { maximumFractionDigits: 0 }) }}
            </td>
            <td class="cell--action">
              <a
                :href="`${runtimeConfig.public.receiptsBase}/${donation.id}`"
                class="nowrap"
                target="_blank"
                rel="noopener noreferrer"
                :title="$t('receipt')"
              >
                {{ $t('receipts.linkTo').toLowerCase() }}
              </a>
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td v-if="pending" colspan="6" :aria-busy="pending">
              {{ $t('waiting') }}
            </td>
            <td v-else colspan="6">
              {{ $t('noDonations') }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </article>
</template>
<script setup lang="ts">
import { useCampaignStore } from '@/store/campaign.ts';
import { useDonationsStore } from '@/store/donations.ts';

const runtimeConfig = useRuntimeConfig();
const route = useRoute();

const campaignStore = useCampaignStore();
const donationsStore = useDonationsStore();

const { campaign } = storeToRefs(campaignStore);

const { list: donationsList, pending } = storeToRefs(donationsStore);

donationsStore.fetchDonations(String(route.params.campaignSlug), {
  lazy: true,
  server: false,
});
</script>
<style lang="scss">
@mixin centralized {
  max-width: my.$max-width--narrow;
  margin-right: auto;
  margin-left: auto;
}

.donations-page {
  section {
    padding-top: my.$gutter;
    padding-bottom: my.$gutter;

    @media screen and (min-width: my.breakpoint('toggle-sidebar-position')) {
      padding-top: my.$gutter * 3;
      padding-bottom: my.$gutter * 3;
    }
  }
}

.donations-page__indicators {
  border-bottom: my.$stroke solid my.palette('neutral', 'light');
}

.donations-page .donation-indicators {
  @include centralized;
}

.donations-page__receipts {
  @include centralized;
}

.donations-page__receipts-intro {
  @include my.columns;

  max-width: my.$max-width--narrow;
  margin-bottom: my.$gutter;
}

.donations-page__receipts-table {
  width: 100%;

  @media screen and (max-width: my.breakpoint('toggle-table-layout') - 0.01) {
    tbody {
      display: flex;

      flex-wrap: wrap;

      gap: 0 my.$gutter;
    }

    tr {
      flex-basis: calc(50% - my.$gutter);
      flex-grow: 1;

      min-width: 20em;
    }
  }
}
</style>
