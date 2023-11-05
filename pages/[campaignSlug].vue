<template>
  <div class="page-wrapper">
    <!-- required by NUXT page transitions -->
    <pre v-if="error">{{ error }}</pre>
    <template v-else>
      <header class="main-header">
        <div class="container">
          <div class="title-and-colophon">
            <h1 v-if="campaign?.name" class="campaign-title">
              {{ campaign.name }}
            </h1>

            <div class="colophon">
              <img
                v-if="campaign?.fundraiser.avatar"
                class="colophon__creator-avatar"
                :width="typeof campaign.fundraiser.avatar === 'object'
                  ? campaign.fundraiser.avatar.width
                  : undefined"
                :height="typeof campaign.fundraiser.avatar === 'object'
                  ? campaign.fundraiser.avatar.height
                  : undefined"
                :src="typeof campaign.fundraiser.avatar === 'object'
                  ? campaign.fundraiser.avatar.url
                  : campaign.fundraiser.avatar"
                alt=""
              />

              <dl v-if="campaign?.is_election_campaign" class="colophon__campaign">
                <div class="colophon__campaign-creator">
                  <dt>
                    {{ $t('electionCampaign.runningForOffice', { gender: campaign.fundraiser.gender }) }}
                  </dt>
                  <dd>
                    {{ $t(`governmentOffices.${campaign.fundraiser.office}`, { gender: campaign.fundraiser.gender }) }}
                  </dd>
                </div>

                <div v-if="campaign.fundraiser.political_party" class="colophon__campaign-party">
                  <dt>
                    {{ $t('electionCampaign.politicalParty') }}
                  </dt>
                  <dd>
                    <abbr :title="campaign.fundraiser.political_party.name">
                      {{ campaign.fundraiser.political_party.abbreviation }}
                    </abbr>
                  </dd>
                </div>

                <div v-if="campaign.fundraiser.ballot_number" class="colophon__campaign-ballot-number">
                  <dt>
                    {{ $t('electionCampaign.ballotNumber') }}
                  </dt>
                  <dd>
                    {{ campaign.fundraiser.ballot_number }}
                  </dd>
                </div>

                <div
                  v-if="campaign.fundraiser.city && campaign.fundraiser.state"
                  class="colophon__campaign-location colophon__campaign-location--election"
                >
                  <dt>
                    {{ $t('electionCampaign.runningForLocation') }}
                  </dt>
                  <dd>
                    <template v-if="campaign.fundraiser.city">
                      <span class="colophon__campaign-location-city">
                        {{ campaign.fundraiser.city }}
                      </span>
                      <abbr class="colophon__campaign-location-state" :title="campaign.fundraiser.state.name">
                        {{ campaign.fundraiser.state.abbr }}
                      </abbr>
                    </template>
                    <span v-else class="colophon__campaign-location-state">
                      {{ campaign.fundraiser.state.name }}
                    </span>
                  </dd>
                </div>
              </dl>

              <div v-else class="colophon__campaign">
                <div class="colophon__campaign-creator">
                  {{ $t('campaignBy') }}
                  <a
                    v-if="campaign?.fundraiser.slug"
                    :href="campaign.fundraiser.slug"
                  >
                    {{ campaign.fundraiser.name }}
                  </a>
                  <template v-else>
                    {{ campaign?.fundraiser.name }}
                  </template>
                </div>

                <div
                  v-if="campaign?.fundraiser.city || campaign?.fundraiser.state"
                  class="colophon__campaign-location"
                >
                  <template v-if="campaign.fundraiser.city">
                    <span class="colophon__campaign-location-city">
                      {{ campaign.fundraiser.city }}
                    </span>
                    <abbr class="colophon__campaign-location-state" :title="campaign.fundraiser.state.name">
                      {{ campaign.fundraiser.state.abbr }}
                    </abbr>
                  </template>
                  <span v-else class="colophon__campaign-location-state">
                    {{ campaign.fundraiser.state.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <socialNetworks
            v-if="campaign?.contact_methods"
            :contact-methods="campaign.contact_methods"
          />
        </div>
      </header>

      <article role="main">
        <campaignIntro v-if="campaign" :campaign="campaign" />
        <div class="text-body">
          <div class="container text-body__container">
            <nav
              v-if="Array.isArray(campaignSections) && campaignSections?.length > 1"
              role="tablist"
              class="tab-navigation text-body__tab-navigation"
              :aria-label="$t('navigationLabel')"
            >
              <ul class="tab-navigation__list">
                <li
                  v-for="sectionId in campaignSections"
                  :key="sectionId"
                  class="tab-navigation__item"
                >
                  <NuxtLink
                    class="tab-navigation__link"
                    :to="sectionId === 'description'
                      ? `/${campaign?.slug}`
                      : `/${campaign?.slug}/${sectionId}`
                    "
                  >
                    {{ $t(`nav.${sectionId}`) }}
                  </NuxtLink>
                </li>
              </ul>
            </nav>
            <NuxtLoadingIndicator />
            <NuxtPage />
          </div>
        </div>
      </article>

      <footer class="main-footer">
        <div class="container main-footer__navigation-social-and-credits">
          <nav
            class="footer-nav"
            :aria-label="$t('footerMenuLabel')"
          >
            <ul class="footer-nav__list">
              <template v-if="Array.isArray(campaignSections) && campaignSections.length > 1">
                <li
                  v-for="sectionId in campaignSections"
                  :key="sectionId"
                  class="footer-nav__item"
                >
                  <NuxtLink
                    class="footer-nav__link"
                    :to="sectionId === 'description'
                      ? `/${campaign?.slug}`
                      : `/${campaign?.slug}/${sectionId}`
                    "
                  >
                    {{ $t(`nav.${sectionId}`) }}
                  </NuxtLink>
                </li>
              </template>
              <li class="footer-nav__item">
                <a class="footer-nav__link" href="/termos-de-uso">
                  {{ $t('useTerms') }}
                </a>
              </li>
              <li class="footer-nav__item">
                <a class="footer-nav__link" href="/politica-de-privacidade">
                  {{ $t('privacyPolicy') }}
                </a>
              </li>
            </ul>
          </nav>

          <socialNetworks
            v-if="campaign?.contact_methods"
            :contact-methods="campaign.contact_methods"
          />

          <div class="powered-by">
            {{ $t('credits.poweredBy') }}
            <img
              title="DoarPara"
              alt=""
              width="180"
              height="43"
              src="~/assets/images/logo-doarpara-rodape.svg"
            />
          </div>
        </div>
        <div class="container main-footer__juridical-data">
          <div v-if="campaign?.fundraiser" class="juridical-person-identification">
            {{ $t('credits.fundraiserLabel') }}: {{ campaign.fundraiser.name }}

            <template v-if="campaign.fundraiser.legal_entities_id">
              {{ $t('legalEntityIdentification') }}:
              {{ campaign.fundraiser.legal_entities_id }}
            </template>
            <template v-else-if="campaign.fundraiser.natural_person_id">
              {{ $t('naturalPersonIdentification') }}:
              {{ campaign.fundraiser.natural_person_id }}
            </template>
          </div>
        </div>
      </footer>
    </template>
  </div>
</template>
<script setup lang = "ts">
import { useCampaignStore } from '@/store/campaign.ts';

const appConfig = useAppConfig();
const route = useRoute();

const campaignStore = useCampaignStore();
const {
  campaign, campaignSections, error,
} = storeToRefs(campaignStore);

await campaignStore.fetchCampaignAndRewards(String(route.params.campaignSlug));

if (campaign.value) {
  const meta = {
    link: Object.values(campaign.value?.contact_methods)
      .filter((x) => !!x)
      .map((x) => ({
        rel: 'me',
        href: x,
      })),
    htmlAttrs: {
      class: `theme--${campaign.value.theme || 'default'}`,
    },
  };

  useHead(meta);

  useSeoMeta({
    title: campaign.value?.name
      ? `${campaign.value?.name} • ${appConfig.title}`
      : `${appConfig.title}`,
    description: campaign.value?.preamble,
    ogImage: typeof campaign.value?.sharingImage === 'object'
      ? {
        url: campaign.value?.sharingImage?.url,
        width: campaign.value?.sharingImage?.width,
        height: campaign.value?.sharingImage?.height,
      }
      : campaign.value?.sharingImage
      || '',
  });
}
</script>
