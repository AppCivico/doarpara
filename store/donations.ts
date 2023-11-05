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
      // const runtimeConfig = useRuntimeConfig();

      this.error = null;

      const {
        data, error, pending,
      } = await useFetch<DonationList>(`/api/${campaignSlug || route.params.campaignSlug}/donations`, {
        // has_more: this.hasMore,
        // pagination_marker: this.paginationMarker,
        ...params,
      });

      this.pending = pending.value;

      if (data.value) {
        console.debug('data.value', data.value);
        if (Array.isArray(data.value.list)) {
          this.list = data.value.list;
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
