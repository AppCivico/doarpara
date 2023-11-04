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

      const {
        data, error, pending,
      } = await useFetch<Campaign>(
        `${runtimeConfig.public.apiBase}/campaign/${campaignSlug || route.params.campaignSlug}`,
        params,
      );

      this.pending = pending.value;
      this.error = error.value;

      if (data.value) {
        this.campaign = data.value;

        if (data.value.reward_list) {
          this.rewards = data.value?.reward_list;
        }
      }
    },
  },
  getters: {
    isCampaignLoaded: (state) => state.campaign !== null,

    campaignSections: (({ campaign, requireSections }) => {
      const campaignSectionList = campaign?.campaign_section_list || [];

      return (Array.isArray(campaignSectionList)
        ? (campaignSectionList)
          .filter((s: CampaignSection) => !requireSections.includes(s))
          .filter((s: CampaignSection) => !!campaign?.[s as keyof Campaign])
          .concat(requireSections)
        : requireSections)
        .map((s) => ({
          id: s, content: campaign?.[s as keyof Campaign] ?? '',
        }));
    }),
  },
});
