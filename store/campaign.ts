import type { Campaign, CampaignSection, Reward } from '@/doar-para.d.ts';

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

      this.error = null;

      const {
        data, error, pending,
      } = await useFetch<Campaign>(
        `${runtimeConfig.public.apiBase}/campaign/${campaignSlug || route.params.campaignSlug}`,
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
  },
});
