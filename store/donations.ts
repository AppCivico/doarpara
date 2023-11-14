import type { Donation, DonationList } from '@/doar-para.d.ts';

type State = {
  list: Donation[];
  hasMore: boolean;
  paginationMarker: string;

  pending: boolean;
  error: null | unknown;
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
    async fetchDonations(campaignSlug = '', params = {}): Promise<void> {
      const route = useRoute();
      const runtimeConfig = useRuntimeConfig();

      const query = this.paginationMarker
        ? {
          pagination_marker: this.paginationMarker,
        }
        : {};

      this.pending = true;
      this.error = null;

      const {
        data, error, pending, status,
      } = await useFetch<DonationList>(`${runtimeConfig.public.publicApiBase}/candidate-donations/${campaignSlug || route.params.campaignSlug}`, {
        ...params,
        query,
      });

      await new Promise((resolve) => { setTimeout(resolve, 5000); });

      this.pending = pending.value;

      if (data.value) {
        if (Array.isArray(data.value.donations)) {
          this.list = data.value.donations;
        }

        this.hasMore = !!data.value?.has_more || false;
        this.paginationMarker = String(data.value?.pagination_marker) || '';
      }

      if (error.value) {
        this.error = error.value;
        throw createError(error.value);
      }
    },
  },
});
