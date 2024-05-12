import type {
  Campaign,
  CampaignSection,
  PaymentMethod,
  Reward,
} from '@/doar-para.d.ts';

type MinimumDonationPerMethod = {
  [key in PaymentMethod]?: number
};

interface State {
  campaign: Campaign | null;
  rewards: Reward[];
  requireSections: CampaignSection[];
  validSections: CampaignSection[];

  pending: boolean;
  error: null | unknown;
}

// sections which already have views on the right order
const validSections:CampaignSection[] = [
  'description',
  'donations',
  // 'faq',
  'goals',
  // 'rewards', // available, but not folly tested
  // 'testimonies',
];

const validSectionsOrder: Record<CampaignSection, number> = validSections.reduce(
  (acc, section, i) => {
    acc[section] = i;
    return acc;
  },
  {} as Record<CampaignSection, number>,
);

export const useCampaignStore = defineStore('campaign', {
  state: (): State => ({
    campaign: null,
    rewards: [],
    requireSections: ['description', 'donations'],
    validSections,
    pending: false,
    error: null,
  }),
  actions: {
    async fetchCampaignAndRewards(campaignSlug = '', params = {}): Promise<void> {
      const route = useRoute();
      const runtimeConfig = useRuntimeConfig();

      const fullUrl = `${runtimeConfig.public.publicApiBase}/campaign/${campaignSlug || route.params.campaignSlug}`;

      this.pending = true;
      this.error = null;

      try {
        const response: Campaign = await $fetch(fullUrl, {
          method: 'GET',
          params: params || {},
        });

        this.campaign = response;

        if (response.reward_list) {
          this.rewards = response.reward_list;
        }

        this.pending = false;
      } catch (error) {
        this.error = error;
        this.pending = false;

        throw error;
      }
    },
  },
  getters: {
    isCampaignLoaded: (state) => state.campaign !== null,

    campaignSections: (({ campaign, requireSections }): CampaignSection[] => (
      Array.isArray(campaign?.campaign_section_list)
        ? (campaign?.campaign_section_list || [])
          .filter((s: CampaignSection) => !requireSections.includes(s))
          .filter((s: CampaignSection) => (s === 'goals' && campaign.goal_list?.length)
          || (!!campaign?.[s as keyof Campaign] && validSections.includes(s)))
          .concat(requireSections)
          .sort((a, b) => validSectionsOrder[a] - validSectionsOrder[b])
        : requireSections
    )),

    minimumDonationPerMethod: (({ campaign }) => {
      const {
        min_donation_values: minDonationValues = [],
      } = campaign || {};

      return minDonationValues.reduce((acc: MinimumDonationPerMethod, cur) => {
        acc[cur.method] = cur.value;
        return acc;
      }, {});
    }),

    minimumDonation({ campaign }): number {
      const {
        payment_method_list: paymentMethodList = [],
      } = campaign || {};
      const { minimumDonationPerMethod } = this;

      return paymentMethodList
        .reduce((acc: number, cur: PaymentMethod) => (typeof minimumDonationPerMethod?.[cur] === 'number'
          ? Math.min(minimumDonationPerMethod[cur] || 0, acc)
          : acc), Infinity);
    },
  },
});
