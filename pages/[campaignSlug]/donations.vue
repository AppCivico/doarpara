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

      <MDC
        :value="$t('receipts.description', { campaignName: campaign?.name })"
        tag="div"
        class="donations-page__receipts-intro"
      />

      <ClientOnly>
        <table
          class="donations-page__receipts-table"
          :class="{ 'has-unmasked-row': donationToUnmask }"
        >
          <colgroup span="5" />
          <col class="col--action">
          <thead>
            <tr>
              <th>{{ $t('receipts.donorName') }}</th>
              <th
                class="cell--nowrap"
              >
                {{ $t('naturalPersonIdentification') }}
              </th>
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
            :aria-live="pending ? 'polite' : 'off'"
          >
            <tr
              v-for="donation in donationsList"
              :key="donation.id"
              :class="{
                irregular: donation.is_irregular,
                'unmasked-row': donationToUnmask === donation.id,
              }"
            >
              <td :aria-label="$t('receipts.donorName')">
                {{ donationToUnmask === donation.id
                  ? donation.donor_name
                  : maskName(donation.donor_name) }}
              </td>
              <td
                :aria-label="$t('naturalPersonIdentification')"
                class="cell--nowrap"
              >
                {{ donationToUnmask === donation.id
                  ? formatCPF(donation.donor_natural_person_id)
                  : maskCPF(donation.donor_natural_person_id) }}
              </td>
              <td :aria-label="$t('receipts.creationDate')">
                {{ $d(new Date(donation.captured_at), 'medium') }}
              </td>
              <td :aria-label="$t('receipts.paymentMethod')">
                {{ $t(`paymentMethods.${donation.payment_method}`) }}
              </td>
              <td :aria-label="$t('receipts.amount')" class="cell--number">
                {{ $n(donation.amount / 100, 'currency', { maximumFractionDigits: 2 }) }}
              </td>
              <td class="cell--action">
                <label class="like-a__button">
                  <input
                    v-model="donationToUnmask"
                    type="checkbox"
                    :true-value="donation.id"
                  />
                  {{ $t('toExposeData').toLowerCase() }}
                </label>
              </td>
            </tr>
          </tbody>
          <tbody v-if="pending || !donationsList.length">
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

        <div class="pagination">
          <button
            v-if="hasMore"
            type="button"
            class="like-a__link pagination__load-more"
            :aria-busy="pending"
            :aria-disabled="pending"
            @click="fetchDonations(true)"
          >
            carregar mais
          </button>
        </div>
      </ClientOnly>
    </section>
  </article>
</template>
<script setup lang="ts">
import { useCampaignStore } from '@/store/campaign.ts';
import { useDonationsStore } from '@/store/donations.ts';

const route = useRoute();

const campaignStore = useCampaignStore();
const donationsStore = useDonationsStore();

const { campaign } = storeToRefs(campaignStore);

const {
  hasMore, list: donationsList, paginationMarker, pending,
} = storeToRefs(donationsStore);

definePageMeta({
  name: 'donations',
  // TO-DO: localize routes.
  // Currently, `localePath()` and `NuxtLinkLocale` do not support complex roue objects
  path: '/:campaignSlug/doacoes',
});

const donationToUnmask = ref('');

function fetchDonations(more = false) {
  if (pending.value) return;
  if (more) {
    donationsStore.fetchDonations(String(route.params.campaignSlug), paginationMarker.value);
  } else {
    donationsStore.fetchDonations(String(route.params.campaignSlug));
  }
}

if (import.meta.client) {
  fetchDonations();
}
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
    }
  }
}
</style>
