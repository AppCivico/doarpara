import transformMessageToCampaign from '~/utils/transformMessageToCampaign.ts';
import type {
  Campaign,
  CampaignSection,
  PaymentMethod,
  Reward,
} from '../doar-para.d.ts';

type MinimumDonationPerMethod = {
  [key in PaymentMethod]?: number
};

type State = {
  campaign: Campaign | null;
  rewards: Reward[];

  pending: boolean;
  error: null | unknown;
};

type SectionsConfig = {
  valid:CampaignSection[];
  required:CampaignSection[];
};

const sectionsConfig:SectionsConfig = {
  // sections which already have views on the right order
  valid: [
    'description',
    'donations',
    // 'faq',
    'goals',
    // 'rewards', // available, but not fully tested
    'testimonies',
  ],
  // List of sections that should be shown even wether absent from API response
  required: [
    'description',
    'donations',
  ],
};

const validSectionsOrder: Record<CampaignSection, number> = sectionsConfig.valid.reduce(
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

      const { data, error, pending } = await useFetch<Campaign>(fullUrl, {
        method: 'GET',
        params,
      });

      this.pending = pending.value;

      if (data.value) {
        this.campaign = data.value;

        if (data.value.reward_list) {
          this.rewards = data.value?.reward_list;
        }
      }

      if (error.value) {
        this.error = error.value;
      }
    },

    updateCampaignFromMessage(properties: any): void {
      if (!this.campaign) return;

      const transformed = transformMessageToCampaign(properties, this.campaign);
      this.campaign = { ...this.campaign, ...transformed };
    },

    getPreviewToken(): Promise<string> {
      this.pending = true;

      return new Promise<string>((resolve) => {
        if (typeof window === 'undefined') {
          resolve('');
          return;
        }

        const allowedOrigin = useRuntimeConfig().public.controlPanelOrigin;

        const handleFirstMessage = (event: MessageEvent) => {
          if (!allowedOrigin || event.origin !== allowedOrigin) {
            return;
          }

          if (event.data?.type === 'PROVIDE_PREVIEW_TOKEN' && event.data?.previewToken) {
            window.removeEventListener('message', handleFirstMessage);
            resolve(event.data.previewToken);
          }
        };

        window.addEventListener('message', handleFirstMessage);
      });
    },

    setupPreviewUpdateListener(): void {
      if (typeof window !== 'undefined') {
        const allowedOrigin = useRuntimeConfig().public.controlPanelOrigin;

        window.addEventListener('message', (event: MessageEvent) => {
          if (!allowedOrigin || event.origin !== allowedOrigin) {
            return;
          }

          if (event.data?.type === 'PREVIEW_UPDATE' && event.data?.properties) {
            this.updateCampaignFromMessage(event.data.properties);
          }
        });
      }
    },
  },
  getters: {
    campaignSections: (({ campaign }): CampaignSection[] => (
      Array.isArray(campaign?.campaign_section_list)
        ? (campaign?.campaign_section_list || [])
          // filter invalid sections and goals, in case its list is empty
          .filter((section: CampaignSection) => (section === 'goals'
            ? (campaign.goal_list?.length && sectionsConfig.valid.includes(section))
            : sectionsConfig.valid.includes(section)))
          // combine with list of required sections
          .concat(sectionsConfig.required
            // preventing duplicates
            .filter((section, _i, sections) => sections.indexOf(section) < 0))
          // sort sections the same as the list of the required ones
          .sort((a, b) => validSectionsOrder[a] - validSectionsOrder[b])
        : sectionsConfig.required
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
