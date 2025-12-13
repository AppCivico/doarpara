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
    'faq',
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

      try {
        const data = await $fetch<Campaign>(fullUrl, {
          method: 'GET',
          params,
          timeout: runtimeConfig.public.apiTimeout,
        });

        if (data) {
          this.campaign = data;

          if (data.reward_list) {
            this.rewards = data.reward_list;
          }
        }
      } catch (error) {
        const statusCode = (error as any)?.statusCode || (error as any)?.status || 500;
        const message = error instanceof Error ? error.message : String(error);

        if (import.meta.dev) {
          // eslint-disable-next-line no-console
          console.error('[Campaign Store] Failed to fetch campaign:', error);
          console.trace('Stack trace:');
        }

        // Production logging temporarily disabled to test CPU usage
        // if (!import.meta.dev) {
        //   console.error('[Campaign Store] Error:', {
        //     url: fullUrl,
        //     message,
        //     statusCode,
        //     stack: error instanceof Error ? error.stack : undefined,
        //   });
        // }

        this.error = { message, statusCode };
      } finally {
        this.pending = false;
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
    campaignSections: (({ campaign }): CampaignSection[] => {
      if (!Array.isArray(campaign?.campaign_section_list)) {
        return sectionsConfig.required;
      }

      // Filter valid sections
      const validSections = (campaign.campaign_section_list || [])
        .filter((section: CampaignSection) => {
          if (!sectionsConfig.valid.includes(section)) {
            return false;
          }
          if (section === 'goals') {
            return !!campaign.goal_list?.length;
          }
          return true;
        });

      // Add missing required sections (using Set for efficient lookup)
      const sectionSet = new Set(validSections);
      const requiredNotInList = sectionsConfig.required.filter(
        (section) => !sectionSet.has(section),
      );

      return [...validSections, ...requiredNotInList]
        .sort((a, b) => validSectionsOrder[a] - validSectionsOrder[b]);
    }),

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
