import type {
  Campaign, CampaignSection, PaymentMethod, Reward,
} from '@/doar-para.d.ts';

type MinimumDonationPerMethod = {
  [key in PaymentMethod]?: number
};

interface State {
  campaign: Campaign | null;
  rewards: Reward[];
  requireSections: CampaignSection[];

  pending: boolean;
  error: null | unknown;
}

export const useCampaignStore = defineStore('campaign', {
  state: (): State => ({
    campaign: null,
    rewards: [],
    requireSections: ['description', 'donations'],

    pending: false,
    error: null,
  }),
  actions: {
    async fetchCampaignAndRewards(campaignSlug = '', params = {}): Promise<void> {
      const route = useRoute();
      const runtimeConfig = useRuntimeConfig();

      this.pending = true;
      this.error = null;

      const {
        data, error, pending,
      } = await useFetch<Campaign>(
        `${runtimeConfig.public.publicApiBase}/campaign/${campaignSlug || route.params.campaignSlug}`,
        params,
      );

      this.pending = pending.value;

      if (data.value) {
        this.campaign = data.value;

        if (data.value.reward_list) {
          this.rewards = data.value?.reward_list;
        }
      }

      if (error.value) {
        this.error = error.value;
        throw createError(error.value);
      }
    },
  },
  getters: {
    isCampaignLoaded: (state) => state.campaign !== null,

    campaignSections: (({ campaign, requireSections }):CampaignSection[] => (
      Array.isArray(campaign?.campaign_section_list)
        ? (campaign?.campaign_section_list || [])
          .filter((s: CampaignSection) => !requireSections.includes(s))
          .filter((s: CampaignSection) => !!campaign?.[s as keyof Campaign])
          .concat(requireSections)
        : requireSections
    )),
    minimumDonationPerMethod: (({ campaign }) => {
      const {
        min_donation_values: minDonationValues = [],
      } = campaign || {};

      return minDonationValues.reduce((acc:MinimumDonationPerMethod, cur) => {
        acc[cur.method] = cur.value;
        return acc;
      }, {});
    }),

    minimumDonation({ campaign }):number {
      const {
        payment_method_list: paymentMethodList = [],
      } = campaign || {};
      const { minimumDonationPerMethod } = this;

      return paymentMethodList
        .reduce((acc:number, cur: PaymentMethod) => (typeof minimumDonationPerMethod?.[cur] === 'number'
          ? Math.min(minimumDonationPerMethod[cur] || 0, acc)
          : acc), Infinity);
    },
  },
});
