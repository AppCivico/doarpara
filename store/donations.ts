import type { Donation, DonationResponse } from '@/doar-para.d.ts';
import type { FetchError } from 'ofetch';

type State = {
  list: Donation[];

  hasMore: boolean;
  paginationMarker: string;

  pending: boolean;
  error: FetchError | null;
};

export const useDonationsStore = defineStore('donation', {
  state: (): State => ({
    list: [],

    hasMore: false,
    paginationMarker: '',

    pending: false,
    error: null,
  }),
  actions: {
    async fetchDonations(campaignSlug = '', paginationMarker = '', params = {}): Promise<void> {
      const route = useRoute();
      const runtimeConfig = useRuntimeConfig();

      this.pending = true;
      this.error = null;

      try {
        const fullUrl = `${runtimeConfig.public.publicApiBase}/candidate-donations/${campaignSlug || route.params.campaignSlug}/${paginationMarker}`;
        const response: DonationResponse = await $fetch(fullUrl, {
          method: 'GET',
          params: {
            ...params,
            limit: 10,
          },
        });

        if (Array.isArray(response.donations)) {
          if (paginationMarker) {
            this.list = this.list.concat(response.donations);
          } else {
            this.list = response.donations;
          }
        }

        this.hasMore = response.has_more;

        this.paginationMarker = response.pagination_marker
        // eslint-disable-next-line no-underscore-dangle
        || response.donations[response.donations.length - 1]?._marker
        || '';
        this.pending = false;
      } catch (error) {
        this.pending = false;
        this.error = (error as FetchError).data;

        // Don't throw to prevent SSR crashes on Cloudflare Pages
        if (import.meta.dev) {
          console.error('[Donations Store] Failed to fetch donations:', error);
        }
      }
    },
  },
});
